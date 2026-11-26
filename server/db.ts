// SwaLekhan AI — persistent storage (SQLite via Node's built-in node:sqlite, no native deps)
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export type DB = DatabaseSync;

const SCHEMA = `
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  role          TEXT NOT NULL CHECK (role IN ('student','teacher')),
  name          TEXT NOT NULL,
  username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  is_demo       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Student-specific profile (1:1 with users where role = student)
CREATE TABLE IF NOT EXISTS students (
  user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_code TEXT NOT NULL UNIQUE COLLATE NOCASE,
  class_level  TEXT NOT NULL
);

-- Teacher-specific profile; subjects a teacher is authorised to review
CREATE TABLE IF NOT EXISTS teachers (
  user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  institution TEXT
);
CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id INTEGER NOT NULL REFERENCES teachers(user_id) ON DELETE CASCADE,
  subject    TEXT NOT NULL COLLATE NOCASE,
  PRIMARY KEY (teacher_id, subject)
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assignments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  subject       TEXT NOT NULL COLLATE NOCASE,
  class_level   TEXT NOT NULL,
  description   TEXT,
  source_type   TEXT NOT NULL CHECK (source_type IN ('paste','pdf','docx','txt')),
  content       TEXT NOT NULL,
  content_hash  TEXT NOT NULL,
  word_count    INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','analysed','analysis_failed')),
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','reviewed','clarification_requested')),
  analysis_error TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_assign_student ON assignments(student_id, created_at);
CREATE INDEX IF NOT EXISTS idx_assign_subject ON assignments(subject, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_assign_dupe ON assignments(student_id, content_hash);

-- Metadata only: original file bytes are NOT stored (data minimisation)
CREATE TABLE IF NOT EXISTS assignment_files (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  file_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  sha256        TEXT NOT NULL,
  pages         INTEGER
);

CREATE TABLE IF NOT EXISTS analysis_reports (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id    INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  method           TEXT NOT NULL,
  engine_version   TEXT NOT NULL,
  independent_pct  INTEGER NOT NULL,
  ai_pct           INTEGER NOT NULL,
  uncertain_pct    INTEGER NOT NULL,
  confidence       REAL NOT NULL,
  confidence_label TEXT NOT NULL,
  paragraph_count  INTEGER NOT NULL,
  word_count       INTEGER NOT NULL,
  summary          TEXT NOT NULL,
  limitations      TEXT NOT NULL,  -- JSON string[]
  fairness         TEXT NOT NULL,  -- JSON FairnessResult
  process_evidence TEXT NOT NULL,  -- JSON
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (independent_pct + ai_pct + uncertain_pct = 100)
);
CREATE INDEX IF NOT EXISTS idx_report_assignment ON analysis_reports(assignment_id, created_at);

CREATE TABLE IF NOT EXISTS paragraph_analysis (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id              INTEGER NOT NULL REFERENCES analysis_reports(id) ON DELETE CASCADE,
  idx                    INTEGER NOT NULL,
  text                   TEXT NOT NULL,
  word_count             INTEGER NOT NULL,
  ai_likelihood          REAL NOT NULL,
  independent_likelihood REAL NOT NULL,
  confidence             REAL NOT NULL,
  category               TEXT NOT NULL CHECK (category IN ('independent','ai_assisted','uncertain')),
  indicators             TEXT NOT NULL -- JSON Indicator[]
);
CREATE INDEX IF NOT EXISTS idx_para_report ON paragraph_analysis(report_id, idx);

CREATE TABLE IF NOT EXISTS thinking_footprints (
  assignment_id   INTEGER PRIMARY KEY REFERENCES assignments(id) ON DELETE CASCADE,
  original_idea   TEXT,
  research_method TEXT,
  used_ai         TEXT CHECK (used_ai IN ('yes','no','prefer_not')),
  ai_tools        TEXT,
  ai_help_types   TEXT,   -- JSON string[] e.g. ["grammar","translation"]
  ai_help_detail  TEXT,
  independent_parts TEXT,
  learnings       TEXT,
  main_argument   TEXT,
  reflection      TEXT,
  research_notes  TEXT,
  drafts          TEXT,
  revision_history TEXT,
  references_list TEXT,
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Every manual teacher action, including overrides (append-only)
CREATE TABLE IF NOT EXISTS teacher_reviews (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id       INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  teacher_id          INTEGER NOT NULL REFERENCES users(id),
  action              TEXT NOT NULL CHECK (action IN ('mark_reviewed','override')),
  previous_assessment TEXT,  -- JSON
  updated_assessment  TEXT,  -- JSON
  reason              TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_review_assignment ON teacher_reviews(assignment_id, created_at);

CREATE TABLE IF NOT EXISTS feedback (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  author_id     INTEGER NOT NULL REFERENCES users(id),
  kind          TEXT NOT NULL CHECK (kind IN ('feedback','clarification_request','student_response')),
  message       TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_feedback_assignment ON feedback(assignment_id, created_at);

CREATE TABLE IF NOT EXISTS audit_logs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id   INTEGER,
  action     TEXT NOT NULL,
  entity     TEXT NOT NULL,
  entity_id  INTEGER,
  details    TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export function openDb(file = process.env.SWALEKHAN_DB_PATH || path.resolve('data/swalekhan.db')): DB {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(SCHEMA);
  return db;
}

export function audit(db: DB, actorId: number | null, action: string, entity: string, entityId: number | null, details?: unknown) {
  db.prepare('INSERT INTO audit_logs (actor_id, action, entity, entity_id, details) VALUES (?,?,?,?,?)')
    .run(actorId, action, entity, entityId, details === undefined ? null : JSON.stringify(details));
}

/** Retention policy: hard-delete assignments (and cascaded reports) older than N days. */
export function purgeExpired(db: DB, retentionDays: number): number {
  if (!retentionDays || retentionDays <= 0) return 0;
  const r = db.prepare(`DELETE FROM assignments WHERE created_at < datetime('now', ?)`).run(`-${Math.floor(retentionDays)} days`);
  db.prepare(`DELETE FROM sessions WHERE expires_at < datetime('now')`).run();
  if (Number(r.changes) > 0) audit(db, null, 'retention_purge', 'assignments', null, { deleted: Number(r.changes), retentionDays });
  return Number(r.changes);
}
