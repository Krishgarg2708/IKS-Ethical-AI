// SwaLekhan AI REST API (Express 5). All identity comes from the server-side session.
import express, { type Request, type Response, type NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import type { DB } from './db.ts';
import { audit } from './db.ts';
import { hashPassword, verifyPassword, createSession, destroySession, sessionMiddleware, requireRole, rateLimit, loadUser } from './auth.ts';
import { extractFromFile, normaliseText, ExtractionError, MAX_FILE_BYTES } from './extract.ts';
import { wordCount } from './analysis/text.ts';
import {
  SUBJECTS, CLASS_LEVELS, AI_HELP_TYPES, VERDICTS, HttpError, contentHash, sanitiseFootprint, saveFootprint,
  runAnalysis, assertCanView, assignmentBundle, currentAssessment, journeyFor,
} from './service.ts';
import { streamReportPdf } from './report-pdf.ts';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const id = (v: unknown) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'Invalid id.'); return n; };

export function createApp(db: DB) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });
  // JSON only (base64 file payloads); generous enough for MAX_FILE_BYTES after base64 inflation.
  app.use('/api', express.json({ limit: Math.ceil(MAX_FILE_BYTES * 1.4) + 300_000 }));
  // CSRF hardening: state-changing API calls must be JSON (cannot be sent by a plain cross-site form).
  app.use('/api', (req, res, next) => {
    const hasBody = Number(req.headers['content-length'] || 0) > 0 || !!req.headers['transfer-encoding'] || !!req.headers['content-type'];
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json') || (req.method === 'DELETE' && hasBody && !req.is('application/json'))) {
      return res.status(415).json({ error: 'Requests must be sent as JSON.' });
    }
    next();
  });
  app.use(sessionMiddleware(db));

  const teacherInvite = () => process.env.TEACHER_INVITE_CODE || '';

  app.get('/api/health', (_req, res) => { db.prepare('SELECT 1').get(); res.json({ ok: true }); });

  app.get('/api/meta', (_req, res) => {
    const key = process.env.GEMINI_API_KEY;
    res.json({
      subjects: SUBJECTS, classLevels: CLASS_LEVELS, aiHelpTypes: AI_HELP_TYPES, verdicts: VERDICTS,
      aiServiceConfigured: !!key && key !== 'MY_GEMINI_API_KEY',
      maxFileMb: MAX_FILE_BYTES / 1048576,
      retentionDays: Number(process.env.RETENTION_DAYS || 0) || null,
      teacherRegistrationOpen: !!teacherInvite(),
      demoAccounts: !!(db.prepare('SELECT 1 FROM users WHERE is_demo = 1 LIMIT 1').get()),
    });
  });

  // ── Auth ────────────────────────────────────────────────────────────────
  const authLimit = rateLimit(Number(process.env.AUTH_RATE_LIMIT || 30), 10 * 60_000);

  app.post('/api/auth/register', authLimit, (req, res) => {
    const b = req.body || {};
    const role = b.role === 'teacher' ? 'teacher' : 'student';
    const name = str(b.name, 100), username = str(b.username, 40), password = typeof b.password === 'string' ? b.password : '';
    if (!name || !username || !password) throw new HttpError(400, 'Name, username and password are required.');
    if (!/^[a-zA-Z0-9._@+-]{3,60}$/.test(username)) throw new HttpError(400, 'Username must be 3–60 characters: letters, numbers, . _ - @ + (an email works).');
    if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
    if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)) throw new HttpError(409, 'That username is already taken.');

    let studentCode = '', classLevel = '', subjects: string[] = [];
    if (role === 'student') {
      studentCode = str(b.studentCode, 40); classLevel = str(b.classLevel, 60);
      if (!studentCode) throw new HttpError(400, 'Student ID / registration number is required.');
      if (!CLASS_LEVELS.includes(classLevel)) throw new HttpError(400, 'Please select a valid class or academic level.');
      if (db.prepare('SELECT 1 FROM students WHERE student_code = ?').get(studentCode)) throw new HttpError(409, 'An account already exists for this student ID. Ask your teacher if you need help.');
    } else {
      if (!teacherInvite()) throw new HttpError(403, 'Teacher registration is disabled on this server. Ask the administrator for an invite code.');
      if (str(b.inviteCode, 200) !== teacherInvite()) throw new HttpError(403, 'Invalid teacher invite code.');
      subjects = Array.isArray(b.subjects) ? b.subjects.filter((s: any) => SUBJECTS.includes(s)) : [];
      if (!subjects.length) throw new HttpError(400, 'Select at least one subject you are authorised to review.');
    }

    db.exec('BEGIN');
    try {
      const r = db.prepare('INSERT INTO users (role, name, username, password_hash) VALUES (?,?,?,?)').run(role, name, username, hashPassword(password));
      const uid = Number(r.lastInsertRowid);
      if (role === 'student') db.prepare('INSERT INTO students (user_id, student_code, class_level) VALUES (?,?,?)').run(uid, studentCode, classLevel);
      else {
        db.prepare('INSERT INTO teachers (user_id, institution) VALUES (?,?)').run(uid, str(b.institution, 120) || null);
        for (const s of subjects) db.prepare('INSERT INTO teacher_subjects (teacher_id, subject) VALUES (?,?)').run(uid, s);
      }
      audit(db, uid, 'register', 'user', uid, { role });
      db.exec('COMMIT');
      createSession(db, res, uid);
      res.status(201).json({ user: loadUser(db, uid) });
    } catch (e) { db.exec('ROLLBACK'); throw e; }
  });

  app.post('/api/auth/login', authLimit, (req, res) => {
    const username = str(req.body?.username, 40), password = typeof req.body?.password === 'string' ? req.body.password : '';
    const u = db.prepare('SELECT id, password_hash FROM users WHERE username = ?').get(username) as any;
    if (!u || !verifyPassword(password, u.password_hash)) throw new HttpError(401, 'Incorrect username or password.');
    createSession(db, res, u.id);
    audit(db, u.id, 'login', 'user', u.id);
    res.json({ user: loadUser(db, u.id) });
  });

  app.post('/api/auth/logout', (req, res) => { destroySession(db, req, res); res.json({ ok: true }); });
  app.get('/api/auth/me', (req, res) => res.json({ user: req.user ?? null }));

  // ── Assignments ─────────────────────────────────────────────────────────
  app.post('/api/assignments', requireRole('student'), async (req, res) => {
    const u = req.user!;
    const b = req.body || {};
    const title = str(b.title, 200), subject = str(b.subject, 60), description = str(b.description, 2000);
    if (!title) throw new HttpError(400, 'Assignment title is required.');
    if (!SUBJECTS.includes(subject)) throw new HttpError(400, 'Please select a valid subject.');

    let text = '', sourceType: 'paste' | 'pdf' | 'docx' | 'txt' = 'paste', fileMeta: any = null;
    if (b.file && typeof b.file === 'object') {
      const fileName = str(b.file.name, 255);
      if (!fileName || typeof b.file.dataBase64 !== 'string') throw new HttpError(400, 'File upload is incomplete. Please choose the file again.');
      const buf = Buffer.from(b.file.dataBase64, 'base64');
      const ex = await extractFromFile(fileName, buf);
      text = ex.text; sourceType = ex.kind;
      fileMeta = { fileName, fileType: ex.kind, sizeBytes: ex.sizeBytes, sha256: ex.sha256, pages: ex.pages ?? null };
    } else {
      text = normaliseText(typeof b.pastedText === 'string' ? b.pastedText.slice(0, 200_000) : '');
    }
    if (!text) throw new HttpError(400, 'Your submission is empty. Upload a file or paste your assignment text.');
    const wc = wordCount(text);
    if (wc < 30) throw new HttpError(400, `Only ${wc} words were found. At least 30 words are needed for a meaningful analysis.`);

    const hash = contentHash(text);
    const dupe = db.prepare('SELECT id FROM assignments WHERE student_id = ? AND content_hash = ?').get(u.id, hash) as any;
    if (dupe) return res.status(409).json({ error: 'You have already submitted this exact text. Open your existing submission instead.', assignmentId: dupe.id });

    const r = db.prepare(`INSERT INTO assignments (student_id, title, subject, class_level, description, source_type, content, content_hash, word_count)
      VALUES (?,?,?,?,?,?,?,?,?)`).run(u.id, title, subject, u.classLevel!, description || null, sourceType, text, hash, wc);
    const aid = Number(r.lastInsertRowid);
    if (fileMeta) db.prepare('INSERT INTO assignment_files (assignment_id, file_name, file_type, size_bytes, sha256, pages) VALUES (?,?,?,?,?,?)')
      .run(aid, fileMeta.fileName, fileMeta.fileType, fileMeta.sizeBytes, fileMeta.sha256, fileMeta.pages);
    saveFootprint(db, aid, sanitiseFootprint(b.footprint));
    audit(db, u.id, 'submit', 'assignment', aid, { sourceType, wc });

    try {
      const reportId = await runAnalysis(db, aid, u.id);
      res.status(201).json({ assignmentId: aid, reportId });
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message, assignmentId: aid, saved: true });
    }
  });

  app.get('/api/assignments', requireRole('student', 'teacher'), (req, res) => {
    const u = req.user!;
    const where: string[] = []; const params: any[] = [];
    if (u.role === 'student') { where.push('a.student_id = ?'); params.push(u.id); }
    else {
      const subs = u.subjects || [];
      if (!subs.length) return res.json({ assignments: [] });
      where.push(`a.subject IN (${subs.map(() => '?').join(',')})`); params.push(...subs);
      const q = str(req.query.q, 100);
      if (q) { where.push('(u.name LIKE ? OR s.student_code LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
    }
    const subject = str(req.query.subject, 60); if (subject) { where.push('a.subject = ?'); params.push(subject); }
    const title = str(req.query.title, 200); if (title) { where.push('a.title LIKE ?'); params.push(`%${title}%`); }
    const from = str(req.query.from, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(from)) { where.push('date(a.created_at) >= ?'); params.push(from); }
    const to = str(req.query.to, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(to)) { where.push('date(a.created_at) <= ?'); params.push(to); }
    const review = str(req.query.review, 40); if (['pending', 'reviewed', 'clarification_requested'].includes(review)) { where.push('a.review_status = ?'); params.push(review); }

    const rows = db.prepare(`SELECT a.id, a.title, a.subject, a.class_level AS classLevel, a.word_count AS wordCount, a.status, a.review_status AS reviewStatus,
        a.created_at AS createdAt, a.student_id AS studentId, u.name AS studentName, s.student_code AS studentCode,
        r.independent_pct AS independentPct, r.ai_pct AS aiPct, r.uncertain_pct AS uncertainPct, r.confidence_label AS confidenceLabel, r.fairness,
        (SELECT COUNT(*) FROM feedback f WHERE f.assignment_id = a.id AND f.kind = 'feedback') AS feedbackCount
      FROM assignments a JOIN users u ON u.id = a.student_id JOIN students s ON s.user_id = a.student_id
      LEFT JOIN analysis_reports r ON r.id = (SELECT MAX(id) FROM analysis_reports WHERE assignment_id = a.id)
      WHERE ${where.join(' AND ')} ORDER BY a.created_at DESC, a.id DESC LIMIT 500`).all(...params) as any[];
    res.json({ assignments: rows.map(r => {
      const f = r.fairness ? JSON.parse(r.fairness) : null;
      const cur = currentAssessment(db, r.id);
      return { ...r, fairness: undefined, fairnessWarnings: f ? f.warnings.length : 0, reviewRecommended: f?.teacherReviewRecommended ?? false,
        teacherVerified: cur?.source === 'teacher' };
    }) });
  });

  app.get('/api/assignments/:id', requireRole('student', 'teacher'), (req, res) => {
    const reportId = req.query.reportId ? id(req.query.reportId) : undefined;
    res.json(assignmentBundle(db, req.user!, id(req.params.id), reportId));
  });

  app.get('/api/assignments/:id/report.pdf', requireRole('student', 'teacher'), (req, res) => {
    const reportId = req.query.reportId ? id(req.query.reportId) : undefined;
    const bundle = assignmentBundle(db, req.user!, id(req.params.id), reportId);
    audit(db, req.user!.id, 'report_pdf_downloaded', 'assignment', bundle.assignment.id);
    streamReportPdf(res, bundle);
  });

  app.post('/api/assignments/:id/analyse', requireRole('student', 'teacher'), async (req, res) => {
    const aid = id(req.params.id);
    assertCanView(db, req.user!, aid);
    const reportId = await runAnalysis(db, aid, req.user!.id);
    res.json({ reportId });
  });

  app.put('/api/assignments/:id/footprint', requireRole('student'), async (req, res) => {
    const aid = id(req.params.id);
    assertCanView(db, req.user!, aid);
    saveFootprint(db, aid, sanitiseFootprint(req.body?.footprint));
    audit(db, req.user!.id, 'footprint_updated', 'assignment', aid);
    // Footprint (drafts, disclosure) feeds the engine → produce a fresh report version.
    try { const reportId = await runAnalysis(db, aid, req.user!.id); res.json({ ok: true, reportId }); }
    catch (e: any) { res.status(e.status || 500).json({ error: e.message, saved: true }); }
  });

  app.delete('/api/assignments/:id', requireRole('student'), (req, res) => {
    const aid = id(req.params.id);
    assertCanView(db, req.user!, aid);
    db.prepare('DELETE FROM assignments WHERE id = ?').run(aid);
    audit(db, req.user!.id, 'assignment_deleted_by_student', 'assignment', aid);
    res.json({ ok: true });
  });

  app.post('/api/assignments/:id/feedback', requireRole('student', 'teacher'), (req, res) => {
    const u = req.user!; const aid = id(req.params.id);
    assertCanView(db, u, aid);
    const message = str(req.body?.message, 4000);
    if (!message) throw new HttpError(400, 'Message cannot be empty.');
    let kind = req.body?.kind;
    if (u.role === 'student') kind = 'student_response';
    else if (!['feedback', 'clarification_request'].includes(kind)) throw new HttpError(400, 'Invalid feedback type.');
    db.prepare('INSERT INTO feedback (assignment_id, author_id, kind, message) VALUES (?,?,?,?)').run(aid, u.id, kind, message);
    if (kind === 'clarification_request') db.prepare(`UPDATE assignments SET review_status = 'clarification_requested' WHERE id = ?`).run(aid);
    audit(db, u.id, `feedback_${kind}`, 'assignment', aid);
    res.status(201).json({ ok: true });
  });

  app.post('/api/assignments/:id/review', requireRole('teacher'), (req, res) => {
    const u = req.user!; const aid = id(req.params.id);
    assertCanView(db, u, aid);
    const action = req.body?.action;
    const reason = str(req.body?.reason, 2000);
    if (action === 'mark_reviewed') {
      db.prepare(`INSERT INTO teacher_reviews (assignment_id, teacher_id, action, reason) VALUES (?,?,?,?)`).run(aid, u.id, 'mark_reviewed', reason || null);
      db.prepare(`UPDATE assignments SET review_status = 'reviewed' WHERE id = ?`).run(aid);
      audit(db, u.id, 'marked_reviewed', 'assignment', aid);
      return res.json({ ok: true });
    }
    if (action !== 'override') throw new HttpError(400, 'Unknown review action.');
    if (!reason || reason.length < 10) throw new HttpError(400, 'Please give a reason of at least 10 characters for changing the assessment.');
    const up = req.body?.updated || {};
    const verdict = up.verdict;
    if (!VERDICTS[verdict]) throw new HttpError(400, 'Choose a valid assessment outcome.');
    const vals = [up.independentPct, up.aiPct, up.uncertainPct].map(Number);
    if (vals.some(v => !Number.isInteger(v) || v < 0 || v > 100) || vals[0] + vals[1] + vals[2] !== 100) {
      throw new HttpError(400, 'The three percentages must be whole numbers that add up to exactly 100.');
    }
    const previous = currentAssessment(db, aid);
    if (!previous) throw new HttpError(409, 'There is no automated assessment to review yet.');
    const updated = { verdict, independentPct: vals[0], aiPct: vals[1], uncertainPct: vals[2] };
    db.prepare(`INSERT INTO teacher_reviews (assignment_id, teacher_id, action, previous_assessment, updated_assessment, reason) VALUES (?,?,?,?,?,?)`)
      .run(aid, u.id, 'override', JSON.stringify(previous), JSON.stringify(updated), reason);
    db.prepare(`UPDATE assignments SET review_status = 'reviewed' WHERE id = ?`).run(aid);
    audit(db, u.id, 'assessment_override', 'assignment', aid, { previous, updated, reason });
    res.json({ ok: true });
  });

  // ── Learning Journey & dashboards ───────────────────────────────────────
  app.get('/api/journey', requireRole('student'), (req, res) => res.json({ journey: journeyFor(db, req.user!.id) }));

  app.get('/api/students/:id/journey', requireRole('teacher'), (req, res) => {
    const sid = id(req.params.id);
    const s = db.prepare(`SELECT u.name, st.student_code, st.class_level FROM users u JOIN students st ON st.user_id = u.id WHERE u.id = ?`).get(sid) as any;
    if (!s) throw new HttpError(404, 'Student not found.');
    const journey = journeyFor(db, sid, req.user!.subjects);
    if (!journey.length) throw new HttpError(403, 'This student has no assignments in subjects you are authorised to review.');
    res.json({ student: { id: sid, name: s.name, studentCode: s.student_code, classLevel: s.class_level }, journey });
  });

  app.get('/api/teacher/stats', requireRole('teacher'), (req, res) => {
    const subs = req.user!.subjects || [];
    if (!subs.length) return res.json({ total: 0, pending: 0, reviewed: 0, clarification: 0, bySubject: [], avg: null, fairnessFlagged: 0, overrides: 0 });
    const ph = subs.map(() => '?').join(',');
    const counts = db.prepare(`SELECT COUNT(*) total, SUM(review_status='pending') pending, SUM(review_status='reviewed') reviewed,
      SUM(review_status='clarification_requested') clarification FROM assignments WHERE subject IN (${ph})`).get(...subs) as any;
    const bySubject = db.prepare(`SELECT a.subject, COUNT(*) AS count, ROUND(AVG(r.independent_pct)) AS avgIndependent, ROUND(AVG(r.ai_pct)) AS avgAi, ROUND(AVG(r.uncertain_pct)) AS avgUncertain
      FROM assignments a LEFT JOIN analysis_reports r ON r.id = (SELECT MAX(id) FROM analysis_reports WHERE assignment_id = a.id)
      WHERE a.subject IN (${ph}) GROUP BY a.subject ORDER BY count DESC`).all(...subs);
    const avg = db.prepare(`SELECT ROUND(AVG(r.independent_pct)) AS independentPct, ROUND(AVG(r.ai_pct)) AS aiPct, ROUND(AVG(r.uncertain_pct)) AS uncertainPct, COUNT(r.id) AS n
      FROM assignments a JOIN analysis_reports r ON r.id = (SELECT MAX(id) FROM analysis_reports WHERE assignment_id = a.id) WHERE a.subject IN (${ph})`).get(...subs) as any;
    const flagged = db.prepare(`SELECT COUNT(*) n FROM assignments a JOIN analysis_reports r ON r.id = (SELECT MAX(id) FROM analysis_reports WHERE assignment_id = a.id)
      WHERE a.subject IN (${ph}) AND json_array_length(json_extract(r.fairness, '$.warnings')) > 0`).get(...subs) as any;
    const overrides = db.prepare(`SELECT COUNT(*) n FROM teacher_reviews tr JOIN assignments a ON a.id = tr.assignment_id WHERE tr.action = 'override' AND a.subject IN (${ph})`).get(...subs) as any;
    res.json({ total: counts.total || 0, pending: counts.pending || 0, reviewed: counts.reviewed || 0, clarification: counts.clarification || 0,
      bySubject, avg: avg?.n ? avg : null, fairnessFlagged: flagged.n, overrides: overrides.n });
  });

  // ── Errors ──────────────────────────────────────────────────────────────
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError || err instanceof ExtractionError) return res.status(err.status).json({ error: err.message });
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: `Upload too large. The limit is ${MAX_FILE_BYTES / 1048576} MB.` });
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed request.' });
    console.error('[swalekhan] unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
  });

  // ── Static frontend (production) ────────────────────────────────────────
  const dist = path.resolve('dist');
  if (fs.existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist, { index: false }));
    app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  return app;
}
