// SwaLekhan domain service: persistence of analyses, access control, bundles.
import crypto from 'node:crypto';
import type { DB } from './db.ts';
import { audit } from './db.ts';
import type { SessionUser } from './auth.ts';
import { analyse, type AnalysisResult } from './analysis/engine.ts';
import { geminiScorer } from './analysis/gemini.ts';
import { sentences, wordCount } from './analysis/text.ts';

export const SUBJECTS = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Ethical AI', 'Indian Knowledge Systems', 'Environmental Studies', 'Economics', 'Other'];
export const CLASS_LEVELS = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Undergraduate – Year 1', 'Undergraduate – Year 2', 'Undergraduate – Year 3', 'Undergraduate – Year 4', 'Postgraduate', 'Diploma / Vocational'];
export const AI_HELP_TYPES = ['brainstorming', 'grammar', 'translation', 'research', 'explanation', 'drafting', 'other'];
export const VERDICTS: Record<string, string> = {
  independent_confirmed: 'Independent work confirmed by teacher',
  appropriate_ai_assistance: 'AI assistance acknowledged and appropriate',
  needs_discussion: 'Needs a learning conversation',
  inconclusive: 'Inconclusive — no concern recorded',
};

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }

export const contentHash = (t: string) => crypto.createHash('sha256').update(t.replace(/\s+/g, ' ').trim().toLowerCase()).digest('hex');

export const FOOTPRINT_FIELDS = ['original_idea', 'research_method', 'used_ai', 'ai_tools', 'ai_help_types', 'ai_help_detail', 'independent_parts', 'learnings', 'main_argument', 'reflection', 'research_notes', 'drafts', 'revision_history', 'references_list'] as const;
const REFLECTION_QUESTIONS = ['original_idea', 'research_method', 'used_ai', 'ai_tools', 'ai_help_detail', 'independent_parts', 'learnings', 'main_argument'];

export function sanitiseFootprint(fp: any) {
  const out: Record<string, any> = {};
  if (!fp || typeof fp !== 'object') return out;
  for (const f of FOOTPRINT_FIELDS) {
    const v = fp[f];
    if (v === undefined || v === null || v === '') continue;
    if (f === 'used_ai') { if (['yes', 'no', 'prefer_not'].includes(v)) out[f] = v; continue; }
    if (f === 'ai_help_types') { if (Array.isArray(v)) out[f] = JSON.stringify(v.filter((x: any) => AI_HELP_TYPES.includes(x))); continue; }
    const limit = ['drafts', 'revision_history', 'research_notes'].includes(f) ? 60000 : 4000;
    out[f] = String(v).slice(0, limit);
  }
  return out;
}

export function saveFootprint(db: DB, assignmentId: number, fp: Record<string, any>) {
  const cols = Object.keys(fp);
  db.prepare('INSERT OR IGNORE INTO thinking_footprints (assignment_id) VALUES (?)').run(assignmentId);
  if (cols.length) {
    db.prepare(`UPDATE thinking_footprints SET ${cols.map(c => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE assignment_id = ?`)
      .run(...cols.map(c => fp[c]), assignmentId);
  }
}

export function getFootprint(db: DB, assignmentId: number) {
  const row = db.prepare('SELECT * FROM thinking_footprints WHERE assignment_id = ?').get(assignmentId) as any;
  if (!row) return null;
  return { ...row, ai_help_types: row.ai_help_types ? JSON.parse(row.ai_help_types) : [] };
}

/** Run the engine and persist a new report version. Never stores a report if analysis fails. */
export async function runAnalysis(db: DB, assignmentId: number, actorId: number): Promise<number> {
  const a = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId) as any;
  if (!a) throw new HttpError(404, 'Assignment not found.');
  const fp = getFootprint(db, assignmentId);
  const answered = fp ? REFLECTION_QUESTIONS.filter(q => fp[q] && String(fp[q]).trim()).length : 0;
  let result: AnalysisResult;
  try {
    result = await analyse({
      text: a.content,
      disclosure: { usedAi: fp?.used_ai ?? null, helpTypes: fp?.ai_help_types ?? [] },
      drafts: fp?.drafts || '',
      revisionHistory: fp?.revision_history || '',
      reflectionAnswered: answered,
      referencesProvided: !!fp?.references_list,
    }, geminiScorer());
  } catch (e: any) {
    const msg = String(e?.message || e);
    db.prepare(`UPDATE assignments SET status = 'analysis_failed', analysis_error = ? WHERE id = ?`).run(msg, assignmentId);
    audit(db, actorId, 'analysis_failed', 'assignment', assignmentId, { error: msg });
    throw new HttpError(422, `Analysis could not be completed: ${msg} No report was generated. You can edit the submission or retry.`);
  }

  db.exec('BEGIN');
  try {
    const r = db.prepare(`INSERT INTO analysis_reports (assignment_id, method, engine_version, independent_pct, ai_pct, uncertain_pct, confidence, confidence_label,
      paragraph_count, word_count, summary, limitations, fairness, process_evidence) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      assignmentId, result.method, result.engineVersion, result.independentPct, result.aiPct, result.uncertainPct, result.confidence, result.confidenceLabel,
      result.paragraphs.length, result.wordCount, result.summary, JSON.stringify(result.limitations), JSON.stringify(result.fairness), JSON.stringify(result.processEvidence));
    const reportId = Number(r.lastInsertRowid);
    const ins = db.prepare(`INSERT INTO paragraph_analysis (report_id, idx, text, word_count, ai_likelihood, independent_likelihood, confidence, category, indicators) VALUES (?,?,?,?,?,?,?,?,?)`);
    for (const p of result.paragraphs) {
      ins.run(reportId, p.idx, p.text, p.wordCount, p.aiLikelihood, p.independentLikelihood, p.confidence, p.category, JSON.stringify({ indicators: p.indicators, assistanceHint: p.assistanceHint ?? null }));
    }
    db.prepare(`UPDATE assignments SET status = 'analysed', analysis_error = NULL WHERE id = ?`).run(assignmentId);
    audit(db, actorId, 'analysis_completed', 'assignment', assignmentId, { reportId, method: result.method });
    db.exec('COMMIT');
    return reportId;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

/** Throws unless the user may view this assignment. Students: own only. Teachers: their subjects only. */
export function assertCanView(db: DB, user: SessionUser, assignmentId: number) {
  const a = db.prepare('SELECT id, student_id, subject FROM assignments WHERE id = ?').get(assignmentId) as any;
  if (!a) throw new HttpError(404, 'Assignment not found.');
  if (user.role === 'student' && a.student_id !== user.id) throw new HttpError(404, 'Assignment not found.');
  if (user.role === 'teacher' && !(user.subjects || []).some(s => s.toLowerCase() === String(a.subject).toLowerCase())) {
    throw new HttpError(403, 'You are not assigned to review this subject.');
  }
  return a;
}

function reportRow(db: DB, reportId: number) {
  const r = db.prepare('SELECT * FROM analysis_reports WHERE id = ?').get(reportId) as any;
  if (!r) return null;
  const paragraphs = (db.prepare('SELECT * FROM paragraph_analysis WHERE report_id = ? ORDER BY idx').all(reportId) as any[]).map(p => {
    const extra = JSON.parse(p.indicators);
    return { idx: p.idx, text: p.text, wordCount: p.word_count, aiLikelihood: p.ai_likelihood, independentLikelihood: p.independent_likelihood,
      confidence: p.confidence, category: p.category, indicators: extra.indicators, assistanceHint: extra.assistanceHint };
  });
  return {
    id: r.id, createdAt: r.created_at, method: r.method, engineVersion: r.engine_version,
    independentPct: r.independent_pct, aiPct: r.ai_pct, uncertainPct: r.uncertain_pct,
    confidence: r.confidence, confidenceLabel: r.confidence_label, paragraphCount: r.paragraph_count, wordCount: r.word_count,
    summary: r.summary, limitations: JSON.parse(r.limitations), fairness: JSON.parse(r.fairness), processEvidence: JSON.parse(r.process_evidence),
    paragraphs,
  };
}

export function currentAssessment(db: DB, assignmentId: number) {
  const ov = db.prepare(`SELECT tr.*, u.name AS teacher_name FROM teacher_reviews tr JOIN users u ON u.id = tr.teacher_id
    WHERE tr.assignment_id = ? AND tr.action = 'override' ORDER BY tr.id DESC LIMIT 1`).get(assignmentId) as any;
  if (ov) return { source: 'teacher' as const, ...JSON.parse(ov.updated_assessment), teacherName: ov.teacher_name, at: ov.created_at, reason: ov.reason };
  const r = db.prepare('SELECT independent_pct, ai_pct, uncertain_pct FROM analysis_reports WHERE assignment_id = ? ORDER BY id DESC LIMIT 1').get(assignmentId) as any;
  if (!r) return null;
  return { source: 'automated' as const, verdict: null, independentPct: r.independent_pct, aiPct: r.ai_pct, uncertainPct: r.uncertain_pct };
}

export function assignmentBundle(db: DB, user: SessionUser, assignmentId: number, reportId?: number) {
  assertCanView(db, user, assignmentId);
  const a = db.prepare(`SELECT a.*, u.name AS student_name, s.student_code FROM assignments a
    JOIN users u ON u.id = a.student_id JOIN students s ON s.user_id = a.student_id WHERE a.id = ?`).get(assignmentId) as any;
  const history = db.prepare('SELECT id, created_at AS createdAt, method, independent_pct AS independentPct, ai_pct AS aiPct, uncertain_pct AS uncertainPct, confidence_label AS confidenceLabel FROM analysis_reports WHERE assignment_id = ? ORDER BY id DESC').all(assignmentId) as any[];
  const chosen = reportId && history.some(h => h.id === reportId) ? reportId : history[0]?.id;
  const file = db.prepare('SELECT file_name AS fileName, file_type AS fileType, size_bytes AS sizeBytes, pages FROM assignment_files WHERE assignment_id = ?').get(assignmentId) as any;
  const feedback = db.prepare(`SELECT f.id, f.kind, f.message, f.created_at AS createdAt, u.name AS author, u.role AS authorRole FROM feedback f JOIN users u ON u.id = f.author_id WHERE assignment_id = ? ORDER BY f.id`).all(assignmentId);
  const reviews = (db.prepare(`SELECT tr.id, tr.action, tr.previous_assessment, tr.updated_assessment, tr.reason, tr.created_at AS createdAt, u.name AS teacherName, u.id AS teacherId
    FROM teacher_reviews tr JOIN users u ON u.id = tr.teacher_id WHERE assignment_id = ? ORDER BY tr.id`).all(assignmentId) as any[])
    .map(r => ({ ...r, previous_assessment: r.previous_assessment ? JSON.parse(r.previous_assessment) : null, updated_assessment: r.updated_assessment ? JSON.parse(r.updated_assessment) : null }));
  return {
    assignment: {
      id: a.id, title: a.title, subject: a.subject, classLevel: a.class_level, description: a.description, sourceType: a.source_type,
      wordCount: a.word_count, status: a.status, reviewStatus: a.review_status, analysisError: a.analysis_error, createdAt: a.created_at,
      studentId: a.student_id, studentName: a.student_name, studentCode: a.student_code, content: a.content, file: file || null,
    },
    report: chosen ? reportRow(db, chosen) : null,
    reportHistory: history,
    footprint: getFootprint(db, assignmentId),
    feedback, reviews,
    currentAssessment: currentAssessment(db, assignmentId),
    journey: journeyFor(db, a.student_id, user.role === 'teacher' ? user.subjects : undefined),
  };
}

/** Learning Journey: only the given student's own records; teachers see only their subjects. */
export function journeyFor(db: DB, studentId: number, subjects?: string[]) {
  const rows = db.prepare(`SELECT a.id, a.title, a.subject, a.created_at, a.word_count, a.content, a.review_status,
      r.independent_pct, r.ai_pct, r.uncertain_pct, r.confidence_label, r.process_evidence
    FROM assignments a
    LEFT JOIN analysis_reports r ON r.id = (SELECT MAX(id) FROM analysis_reports WHERE assignment_id = a.id)
    WHERE a.student_id = ? ORDER BY a.created_at, a.id`).all(studentId) as any[];
  const allowed = subjects ? new Set(subjects.map(s => s.toLowerCase())) : null;
  return rows.filter(r => !allowed || allowed.has(String(r.subject).toLowerCase())).map(r => {
    const s = sentences(r.content);
    const pe = r.process_evidence ? JSON.parse(r.process_evidence) : null;
    const override = currentAssessment(db, r.id);
    return {
      id: r.id, title: r.title, subject: r.subject, createdAt: r.created_at, wordCount: r.word_count, reviewStatus: r.review_status,
      analysed: r.independent_pct !== null,
      independentPct: r.independent_pct, aiPct: r.ai_pct, uncertainPct: r.uncertain_pct, confidenceLabel: r.confidence_label,
      avgSentenceLength: s.length ? Math.round((wordCount(r.content) / s.length) * 10) / 10 : null,
      reflectionAnswered: pe?.reflectionAnswered ?? 0,
      aiDisclosed: pe?.disclosure ?? 'not_given',
      teacherVerdict: override?.source === 'teacher' ? override.verdict : null,
    };
  });
}
