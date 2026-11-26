// SwaLekhan "browser mode" backend.
// Used automatically when no SwaLekhan API server is reachable (e.g. a static Vercel deploy).
// Everything is stored in this browser's localStorage — no server, no database, no API key.
// Limitation: data lives only in this browser; teachers only see submissions made in the same browser.
import { analyse } from '../../server/analysis/engine.ts';
import { sentences, wordCount } from '../../server/analysis/text.ts';
import { extractText } from '../lib/extract';

const SUBJECTS = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Ethical AI', 'Indian Knowledge Systems', 'Environmental Studies', 'Economics', 'Other'];
const CLASS_LEVELS = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Undergraduate – Year 1', 'Undergraduate – Year 2', 'Undergraduate – Year 3', 'Undergraduate – Year 4', 'Postgraduate', 'Diploma / Vocational'];
const AI_HELP_TYPES = ['brainstorming', 'grammar', 'translation', 'research', 'explanation', 'drafting', 'other'];
const VERDICTS: Record<string, string> = {
  independent_confirmed: 'Independent work confirmed by teacher',
  appropriate_ai_assistance: 'AI assistance acknowledged and appropriate',
  needs_discussion: 'Needs a learning conversation',
  inconclusive: 'Inconclusive — no concern recorded',
};
const REFLECTION_QUESTIONS = ['original_idea', 'research_method', 'used_ai', 'ai_tools', 'ai_help_detail', 'independent_parts', 'learnings', 'main_argument'];
// Teacher invite code for browser mode. Override at build time with VITE_TEACHER_INVITE_CODE.
const TEACHER_CODE = (import.meta as any).env?.VITE_TEACHER_INVITE_CODE || 'TEACHER2026';

class HttpErr extends Error { constructor(public status: number, message: string, public data?: any) { super(message); } }

interface Store {
  seq: number;
  users: any[];          // {id, role, name, username, pwHash, studentCode?, classLevel?, subjects?}
  assignments: any[];    // {id, studentId, title, subject, classLevel, description, sourceType, content, wordCount, status, reviewStatus, analysisError, createdAt, file, footprint}
  reports: any[];        // full Report objects + assignmentId
  feedback: any[];
  reviews: any[];
  session: number | null;
}
const KEY = 'swalekhan_local_v1';
const load = (): Store => {
  try { const s = JSON.parse(localStorage.getItem(KEY) || ''); if (s && s.users) return s; } catch { /* empty */ }
  return { seq: 0, users: [], assignments: [], reports: [], feedback: [], reviews: [], session: null };
};
const save = (s: Store) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)); }
  catch { throw new HttpErr(507, 'Browser storage is full. Delete some old submissions and try again.'); }
};
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const nextId = (s: Store) => ++s.seq;

async function hash(pw: string, salt: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pw));
  return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const pub = (u: any) => u && ({ id: u.id, role: u.role, name: u.name, username: u.username, isDemo: false, studentCode: u.studentCode, classLevel: u.classLevel, subjects: u.subjects });

function me(s: Store, ...roles: string[]) {
  const u = s.users.find(x => x.id === s.session);
  if (!u) throw new HttpErr(401, 'Please sign in.');
  if (roles.length && !roles.includes(u.role)) throw new HttpErr(403, 'Not allowed for your role.');
  return u;
}
function canView(s: Store, u: any, aid: number) {
  const a = s.assignments.find(x => x.id === aid);
  if (!a || (u.role === 'student' && a.studentId !== u.id)) throw new HttpErr(404, 'Assignment not found.');
  if (u.role === 'teacher' && !(u.subjects || []).includes(a.subject)) throw new HttpErr(403, 'You are not assigned to review this subject.');
  return a;
}
const latestReport = (s: Store, aid: number) => s.reports.filter(r => r.assignmentId === aid).sort((a, b) => b.id - a.id)[0] || null;

function currentAssessment(s: Store, aid: number) {
  const ov = s.reviews.filter(r => r.assignmentId === aid && r.action === 'override').sort((a, b) => b.id - a.id)[0];
  if (ov) return { source: 'teacher' as const, ...ov.updated_assessment, teacherName: ov.teacherName, at: ov.createdAt, reason: ov.reason };
  const r = latestReport(s, aid);
  return r ? { source: 'automated' as const, verdict: null, independentPct: r.independentPct, aiPct: r.aiPct, uncertainPct: r.uncertainPct } : null;
}

async function runAnalysis(s: Store, a: any) {
  const fp = a.footprint || {};
  try {
    const r = await analyse({
      text: a.content,
      disclosure: { usedAi: fp.used_ai ?? null, helpTypes: fp.ai_help_types ?? [] },
      drafts: fp.drafts || '', revisionHistory: fp.revision_history || '',
      reflectionAnswered: REFLECTION_QUESTIONS.filter(q => fp[q] && String(fp[q]).trim()).length,
      referencesProvided: !!fp.references_list,
    });
    const id = nextId(s);
    s.reports.push({ id, assignmentId: a.id, createdAt: now(), method: r.method, engineVersion: r.engineVersion,
      independentPct: r.independentPct, aiPct: r.aiPct, uncertainPct: r.uncertainPct, confidence: r.confidence, confidenceLabel: r.confidenceLabel,
      paragraphCount: r.paragraphs.length, wordCount: r.wordCount, summary: r.summary,
      limitations: [...r.limitations, 'Browser mode: this report was produced and stored entirely on this device.'],
      fairness: r.fairness, processEvidence: r.processEvidence, paragraphs: r.paragraphs });
    a.status = 'analysed'; a.analysisError = null;
    return id;
  } catch (e: any) {
    a.status = 'analysis_failed'; a.analysisError = String(e?.message || e);
    throw new HttpErr(422, `Analysis could not be completed: ${a.analysisError} No report was generated.`, { assignmentId: a.id, saved: true });
  }
}

function journeyFor(s: Store, sid: number, subjects?: string[]) {
  return s.assignments.filter(a => a.studentId === sid && (!subjects || subjects.includes(a.subject)))
    .sort((a, b) => a.id - b.id).map(a => {
      const r = latestReport(s, a.id); const sn = sentences(a.content); const cur = currentAssessment(s, a.id);
      return { id: a.id, title: a.title, subject: a.subject, createdAt: a.createdAt, wordCount: a.wordCount, reviewStatus: a.reviewStatus,
        analysed: !!r, independentPct: r?.independentPct ?? null, aiPct: r?.aiPct ?? null, uncertainPct: r?.uncertainPct ?? null, confidenceLabel: r?.confidenceLabel ?? null,
        avgSentenceLength: sn.length ? Math.round((wordCount(a.content) / sn.length) * 10) / 10 : null,
        reflectionAnswered: r?.processEvidence.reflectionAnswered ?? 0, aiDisclosed: r?.processEvidence.disclosure ?? 'not_given',
        teacherVerdict: cur?.source === 'teacher' ? cur.verdict : null };
    });
}

const b64ToFile = (name: string, b64: string) => {
  const bin = atob(b64); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new File([u], name);
};
const cleanFp = (fp: any) => {
  const o: any = {};
  if (fp && typeof fp === 'object') for (const [k, v] of Object.entries(fp)) if (v !== '' && v != null) o[k] = v;
  if (Array.isArray(o.ai_help_types)) o.ai_help_types = o.ai_help_types.filter((x: string) => AI_HELP_TYPES.includes(x));
  return o;
};

/** Same shape as the HTTP routes in server/app.ts. */
export async function localRequest(method: string, url: string, body?: any): Promise<any> {
  const s = load();
  const [path, qs] = url.split('?');
  const q = Object.fromEntries(new URLSearchParams(qs || ''));
  const m = (re: RegExp) => path.match(re);
  let out: any; let mut = false;

  if (method === 'GET' && path === '/api/meta') {
    out = { subjects: SUBJECTS, classLevels: CLASS_LEVELS, aiHelpTypes: AI_HELP_TYPES, verdicts: VERDICTS, aiServiceConfigured: false,
      maxFileMb: 10, retentionDays: null, teacherRegistrationOpen: true, demoAccounts: false };
  } else if (method === 'GET' && path === '/api/auth/me') {
    out = { user: pub(s.users.find(u => u.id === s.session)) || null };
  } else if (method === 'POST' && path === '/api/auth/register') {
    const b = body || {};
    const role = b.role === 'teacher' ? 'teacher' : 'student';
    const name = String(b.name || '').trim(), username = String(b.username || '').trim(), password = String(b.password || '');
    if (!name || !username || !password) throw new HttpErr(400, 'Name, username and password are required.');
    if (!/^[a-zA-Z0-9._@+-]{3,60}$/.test(username)) throw new HttpErr(400, 'Username must be 3–60 characters: letters, numbers, . _ - @ + (an email works).');
    if (password.length < 8) throw new HttpErr(400, 'Password must be at least 8 characters.');
    if (s.users.some(u => u.username.toLowerCase() === username.toLowerCase())) throw new HttpErr(409, 'That username is already taken.');
    const u: any = { id: nextId(s), role, name, username, salt: crypto.randomUUID() };
    u.pwHash = await hash(password, u.salt);
    if (role === 'student') {
      u.studentCode = String(b.studentCode || '').trim(); u.classLevel = b.classLevel;
      if (!u.studentCode) throw new HttpErr(400, 'Student ID / registration number is required.');
      if (!CLASS_LEVELS.includes(u.classLevel)) throw new HttpErr(400, 'Please select a valid class or academic level.');
      if (s.users.some(x => x.studentCode === u.studentCode)) throw new HttpErr(409, 'An account already exists for this student ID.');
    } else {
      if (String(b.inviteCode || '').trim() !== TEACHER_CODE) throw new HttpErr(403, 'Invalid teacher invite code.');
      u.subjects = (b.subjects || []).filter((x: string) => SUBJECTS.includes(x));
      if (!u.subjects.length) throw new HttpErr(400, 'Select at least one subject you are authorised to review.');
    }
    s.users.push(u); s.session = u.id; mut = true; out = { user: pub(u) };
  } else if (method === 'POST' && path === '/api/auth/login') {
    const u = s.users.find(x => x.username.toLowerCase() === String(body?.username || '').trim().toLowerCase());
    if (!u || (await hash(String(body?.password || ''), u.salt)) !== u.pwHash) throw new HttpErr(401, 'Incorrect username or password.');
    s.session = u.id; mut = true; out = { user: pub(u) };
  } else if (method === 'POST' && path === '/api/auth/logout') {
    s.session = null; mut = true; out = { ok: true };
  } else if (method === 'POST' && path === '/api/assignments') {
    const u = me(s, 'student'); const b = body || {};
    const title = String(b.title || '').trim(); if (!title) throw new HttpErr(400, 'Assignment title is required.');
    if (!SUBJECTS.includes(b.subject)) throw new HttpErr(400, 'Please select a valid subject.');
    let text = '', sourceType = 'paste', file: any = null;
    if (b.file) {
      try { text = await extractText(b64ToFile(b.file.name, b.file.dataBase64)); } catch (e: any) { throw new HttpErr(422, e.message); }
      sourceType = b.file.name.split('.').pop().toLowerCase();
      file = { fileName: b.file.name, fileType: sourceType, sizeBytes: Math.round(b.file.dataBase64.length * 0.75), pages: null };
    } else text = String(b.pastedText || '');
    text = text.replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').trim();
    if (!text) throw new HttpErr(400, 'Your submission is empty. Upload a file or paste your assignment text.');
    const wc = wordCount(text);
    if (wc < 30) throw new HttpErr(400, `Only ${wc} words were found. At least 30 words are needed for a meaningful analysis.`);
    const norm = (t: string) => t.replace(/\s+/g, ' ').toLowerCase();
    const dupe = s.assignments.find(a => a.studentId === u.id && norm(a.content) === norm(text));
    if (dupe) throw new HttpErr(409, 'You have already submitted this exact text. Open your existing submission instead.', { assignmentId: dupe.id });
    const a = { id: nextId(s), studentId: u.id, title, subject: b.subject, classLevel: u.classLevel, description: b.description || null, sourceType,
      content: text, wordCount: wc, status: 'submitted', reviewStatus: 'pending', analysisError: null, createdAt: now(), file, footprint: cleanFp(b.footprint) };
    s.assignments.push(a);
    try { out = { assignmentId: a.id, reportId: await runAnalysis(s, a) }; } finally { save(s); }
    return out;
  } else if (method === 'GET' && path === '/api/assignments') {
    const u = me(s, 'student', 'teacher');
    let list = s.assignments.filter(a => u.role === 'student' ? a.studentId === u.id : (u.subjects || []).includes(a.subject));
    const stu = (a: any) => s.users.find(x => x.id === a.studentId) || {};
    if (q.subject) list = list.filter(a => a.subject === q.subject);
    if (q.title) list = list.filter(a => a.title.toLowerCase().includes(q.title.toLowerCase()));
    if (q.q) list = list.filter(a => (stu(a).name + ' ' + stu(a).studentCode).toLowerCase().includes(q.q.toLowerCase()));
    if (q.from) list = list.filter(a => a.createdAt.slice(0, 10) >= q.from);
    if (q.to) list = list.filter(a => a.createdAt.slice(0, 10) <= q.to);
    if (q.review) list = list.filter(a => a.reviewStatus === q.review);
    out = { assignments: list.sort((a, b) => b.id - a.id).map(a => {
      const r = latestReport(s, a.id); const su = stu(a);
      return { id: a.id, title: a.title, subject: a.subject, classLevel: a.classLevel, wordCount: a.wordCount, status: a.status, reviewStatus: a.reviewStatus,
        createdAt: a.createdAt, studentId: a.studentId, studentName: su.name, studentCode: su.studentCode,
        independentPct: r?.independentPct ?? null, aiPct: r?.aiPct ?? null, uncertainPct: r?.uncertainPct ?? null, confidenceLabel: r?.confidenceLabel ?? null,
        fairnessWarnings: r ? r.fairness.warnings.length : 0, reviewRecommended: r?.fairness.teacherReviewRecommended ?? false,
        teacherVerified: currentAssessment(s, a.id)?.source === 'teacher',
        feedbackCount: s.feedback.filter(f => f.assignmentId === a.id && f.kind === 'feedback').length };
    }) };
  } else if (m(/^\/api\/assignments\/(\d+)$/) && method === 'GET') {
    const u = me(s, 'student', 'teacher'); const a = canView(s, u, +m(/(\d+)$/)![1]);
    const hist = s.reports.filter(r => r.assignmentId === a.id).sort((x, y) => y.id - x.id);
    const chosen = hist.find(r => r.id === Number(q.reportId)) || hist[0] || null;
    const su = s.users.find(x => x.id === a.studentId) || {};
    const { footprint, ...rest } = a;
    out = {
      assignment: { ...rest, studentName: su.name, studentCode: su.studentCode },
      report: chosen ? (({ assignmentId, ...r }) => r)(chosen) : null,
      reportHistory: hist.map(r => ({ id: r.id, createdAt: r.createdAt, method: r.method, independentPct: r.independentPct, aiPct: r.aiPct, uncertainPct: r.uncertainPct, confidenceLabel: r.confidenceLabel })),
      footprint: footprint && Object.keys(footprint).length ? footprint : null,
      feedback: s.feedback.filter(f => f.assignmentId === a.id),
      reviews: s.reviews.filter(r => r.assignmentId === a.id),
      currentAssessment: currentAssessment(s, a.id),
      journey: journeyFor(s, a.studentId, u.role === 'teacher' ? u.subjects : undefined),
    };
  } else if (m(/^\/api\/assignments\/(\d+)\/analyse$/) && method === 'POST') {
    const u = me(s, 'student', 'teacher'); const a = canView(s, u, +m(/(\d+)\/analyse$/)![1]);
    try { out = { reportId: await runAnalysis(s, a) }; } finally { save(s); }
    return out;
  } else if (m(/^\/api\/assignments\/(\d+)\/footprint$/) && method === 'PUT') {
    const u = me(s, 'student'); const a = canView(s, u, +m(/(\d+)\/footprint$/)![1]);
    a.footprint = cleanFp(body?.footprint);
    try { out = { ok: true, reportId: await runAnalysis(s, a) }; } finally { save(s); }
    return out;
  } else if (m(/^\/api\/assignments\/(\d+)$/) && method === 'DELETE') {
    const u = me(s, 'student'); const a = canView(s, u, +m(/(\d+)$/)![1]);
    s.assignments = s.assignments.filter(x => x.id !== a.id);
    s.reports = s.reports.filter(x => x.assignmentId !== a.id);
    s.feedback = s.feedback.filter(x => x.assignmentId !== a.id);
    s.reviews = s.reviews.filter(x => x.assignmentId !== a.id);
    mut = true; out = { ok: true };
  } else if (m(/^\/api\/assignments\/(\d+)\/feedback$/) && method === 'POST') {
    const u = me(s, 'student', 'teacher'); const a = canView(s, u, +m(/(\d+)\/feedback$/)![1]);
    const message = String(body?.message || '').trim(); if (!message) throw new HttpErr(400, 'Message cannot be empty.');
    let kind = body?.kind;
    if (u.role === 'student') kind = 'student_response';
    else if (!['feedback', 'clarification_request'].includes(kind)) throw new HttpErr(400, 'Invalid feedback type.');
    s.feedback.push({ id: nextId(s), assignmentId: a.id, kind, message, createdAt: now(), author: u.name, authorRole: u.role });
    if (kind === 'clarification_request') a.reviewStatus = 'clarification_requested';
    mut = true; out = { ok: true };
  } else if (m(/^\/api\/assignments\/(\d+)\/review$/) && method === 'POST') {
    const u = me(s, 'teacher'); const a = canView(s, u, +m(/(\d+)\/review$/)![1]);
    const reason = String(body?.reason || '').trim();
    const base = { id: nextId(s), assignmentId: a.id, createdAt: now(), teacherName: u.name, teacherId: u.id };
    if (body?.action === 'mark_reviewed') {
      s.reviews.push({ ...base, action: 'mark_reviewed', previous_assessment: null, updated_assessment: null, reason: reason || null });
    } else if (body?.action === 'override') {
      if (reason.length < 10) throw new HttpErr(400, 'Please give a reason of at least 10 characters for changing the assessment.');
      const up = body.updated || {};
      if (!VERDICTS[up.verdict]) throw new HttpErr(400, 'Choose a valid assessment outcome.');
      const v = [up.independentPct, up.aiPct, up.uncertainPct].map(Number);
      if (v.some(x => !Number.isInteger(x) || x < 0 || x > 100) || v[0] + v[1] + v[2] !== 100) throw new HttpErr(400, 'The three percentages must be whole numbers that add up to exactly 100.');
      const previous = currentAssessment(s, a.id);
      if (!previous) throw new HttpErr(409, 'There is no automated assessment to review yet.');
      s.reviews.push({ ...base, action: 'override', previous_assessment: previous, reason,
        updated_assessment: { verdict: up.verdict, independentPct: v[0], aiPct: v[1], uncertainPct: v[2] } });
    } else throw new HttpErr(400, 'Unknown review action.');
    a.reviewStatus = 'reviewed'; mut = true; out = { ok: true };
  } else if (method === 'GET' && path === '/api/journey') {
    out = { journey: journeyFor(s, me(s, 'student').id) };
  } else if (m(/^\/api\/students\/(\d+)\/journey$/) && method === 'GET') {
    const u = me(s, 'teacher'); const sid = +m(/(\d+)\/journey$/)![1];
    const st = s.users.find(x => x.id === sid && x.role === 'student'); if (!st) throw new HttpErr(404, 'Student not found.');
    const journey = journeyFor(s, sid, u.subjects);
    if (!journey.length) throw new HttpErr(403, 'This student has no assignments in subjects you are authorised to review.');
    out = { student: { id: sid, name: st.name, studentCode: st.studentCode, classLevel: st.classLevel }, journey };
  } else if (method === 'GET' && path === '/api/teacher/stats') {
    const u = me(s, 'teacher');
    const list = s.assignments.filter(a => (u.subjects || []).includes(a.subject));
    const rep = list.map(a => latestReport(s, a.id)).filter(Boolean);
    const avgOf = (rs: any[], k: string) => rs.length ? Math.round(rs.reduce((t, r) => t + r[k], 0) / rs.length) : null;
    const subjects = [...new Set(list.map(a => a.subject))];
    out = {
      total: list.length,
      pending: list.filter(a => a.reviewStatus === 'pending').length,
      reviewed: list.filter(a => a.reviewStatus === 'reviewed').length,
      clarification: list.filter(a => a.reviewStatus === 'clarification_requested').length,
      bySubject: subjects.map(sub => { const rs = list.filter(a => a.subject === sub).map(a => latestReport(s, a.id)).filter(Boolean);
        return { subject: sub, count: list.filter(a => a.subject === sub).length, avgIndependent: avgOf(rs, 'independentPct'), avgAi: avgOf(rs, 'aiPct'), avgUncertain: avgOf(rs, 'uncertainPct') }; })
        .sort((a, b) => b.count - a.count),
      avg: rep.length ? { independentPct: avgOf(rep, 'independentPct')!, aiPct: avgOf(rep, 'aiPct')!, uncertainPct: avgOf(rep, 'uncertainPct')!, n: rep.length } : null,
      fairnessFlagged: rep.filter((r: any) => r.fairness.warnings.length).length,
      overrides: s.reviews.filter(r => r.action === 'override' && list.some(a => a.id === r.assignmentId)).length,
    };
  } else {
    throw new HttpErr(404, 'Not available in browser mode.');
  }
  if (mut) save(s);
  return out;
}
