// End-to-end API tests against a real (temporary) SQLite database and real PDF/DOCX/TXT files.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import PDFDocument from 'pdfkit';
import JSZip from 'jszip';
import { openDb } from '../db.ts';
import { createApp } from '../app.ts';

process.env.TEACHER_INVITE_CODE = 'test-invite';
delete process.env.GEMINI_API_KEY; // must work with NO API key
let server: Server; let base = '';

before(async () => {
  const db = openDb(':memory:');
  server = createApp(db).listen(0);
  await new Promise(r => server.once('listening', r));
  base = `http://127.0.0.1:${(server.address() as any).port}`;
});
after(() => server.close());

class Client {
  cookie = '';
  async call(method: string, path: string, body?: any) {
    const res = await fetch(base + path, { method, headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(this.cookie ? { cookie: this.cookie } : {}) }, body: body !== undefined ? JSON.stringify(body) : undefined });
    const sc = res.headers.get('set-cookie'); if (sc) this.cookie = sc.split(';')[0];
    const ct = res.headers.get('content-type') || '';
    return { status: res.status, ct, data: ct.includes('json') ? await res.json() : Buffer.from(await res.arrayBuffer()) as any };
  }
}

const ESSAY = `In my village near Sitapur, every summer the hand pump goes dry by May. My grandmother remembers a time when the old pond behind the temple held water until the monsoon. I wanted to find out what changed, so I asked around the village.

I talked to three farmers and our panchayat secretary. Ramesh chacha told me the pond was filled with mud in 2009 when the new road was built. Nobody cleaned it after that! Is it surprising that the water table fell? I don't think so.

We measured two wells with a rope (it took a whole Sunday). One was 38 feet, the other 41 feet. Ten years ago people say it was around 25 feet. My idea is that if we desilt the pond and build small check dams, rain water will stay longer in the ground.`;

function makePdf(paragraphs: string[] | null): Promise<Buffer> {
  return new Promise(res => {
    const d = new PDFDocument(); const chunks: Buffer[] = [];
    d.on('data', c => chunks.push(c)); d.on('end', () => res(Buffer.concat(chunks)));
    if (paragraphs) paragraphs.forEach(p => { d.text(p); d.moveDown(); });
    else d.rect(50, 50, 400, 600).fill('#888'); // image-like page with no text = "scanned"
    d.end();
  });
}
async function makeDocx(paragraphs: string[]): Promise<Buffer> {
  const z = new JSZip();
  z.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  z.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  z.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs.map(p => `<w:p><w:r><w:t xml:space="preserve">${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</w:t></w:r></w:p>`).join('')}</w:body></w:document>`);
  return z.generateAsync({ type: 'nodebuffer' });
}
const b64 = (b: Buffer) => b.toString('base64');

const student = new Client(), student2 = new Client(), teacher = new Client(), otherTeacher = new Client(), anon = new Client();
let aid = 0;

test('meta works with no API key; heuristic mode', async () => {
  const r = await anon.call('GET', '/api/meta');
  assert.equal(r.status, 200); assert.equal(r.data.aiServiceConfigured, false);
});

test('registration & auth', async () => {
  assert.equal((await student.call('POST', '/api/auth/register', { role: 'student', name: 'Asha', username: 'asha', password: 'password123', studentCode: 'S-001', classLevel: 'Class 12' })).status, 201);
  assert.equal((await student2.call('POST', '/api/auth/register', { role: 'student', name: 'Ravi', username: 'ravi', password: 'password123', studentCode: 'S-002', classLevel: 'Class 12' })).status, 201);
  assert.equal((await teacher.call('POST', '/api/auth/register', { role: 'teacher', name: 'Ms Rao', username: 'rao', password: 'password123', inviteCode: 'test-invite', subjects: ['Environmental Studies'] })).status, 201);
  assert.equal((await otherTeacher.call('POST', '/api/auth/register', { role: 'teacher', name: 'Mr Das', username: 'das', password: 'password123', inviteCode: 'test-invite', subjects: ['Mathematics'] })).status, 201);
  assert.equal((await anon.call('POST', '/api/auth/register', { role: 'teacher', name: 'Fake', username: 'fake', password: 'password123', inviteCode: 'wrong', subjects: ['English'] })).status, 403);
  assert.equal((await anon.call('POST', '/api/auth/login', { username: 'asha', password: 'nope-nope' })).status, 401);
  assert.equal((await anon.call('POST', '/api/auth/register', { role: 'student', name: 'X', username: 'xx1', password: 'short', studentCode: 'S-9', classLevel: 'Class 12' })).status, 400);
});

test('unauthenticated & wrong-role access is refused', async () => {
  assert.equal((await anon.call('GET', '/api/assignments')).status, 401);
  assert.equal((await teacher.call('POST', '/api/assignments', { title: 't', subject: 'English', pastedText: ESSAY })).status, 403);
  assert.equal((await student.call('GET', '/api/teacher/stats')).status, 403);
});

test('pasted text submission produces a real analysis that sums to 100', async () => {
  const r = await student.call('POST', '/api/assignments', { title: 'Water in my village', subject: 'Environmental Studies', pastedText: ESSAY, footprint: { used_ai: 'no', original_idea: 'Why the pump dries', main_argument: 'Desilting helps' } });
  assert.equal(r.status, 201, JSON.stringify(r.data)); aid = r.data.assignmentId;
  const b = (await student.call('GET', `/api/assignments/${aid}`)).data;
  assert.equal(b.report.independentPct + b.report.aiPct + b.report.uncertainPct, 100);
  assert.equal(b.report.paragraphs.length, 3);
  assert.equal(b.report.method, 'heuristic');
  assert.equal(b.footprint.used_ai, 'no');
});

test('student identity comes from session, not the request body', async () => {
  const r = await student.call('POST', '/api/assignments', { title: 'spoof', subject: 'English', pastedText: ESSAY + ' Extra line to differ.', studentId: 999, student_id: 999 });
  const b = (await student.call('GET', `/api/assignments/${r.data.assignmentId}`)).data;
  assert.equal(b.assignment.studentCode, 'S-001');
});

test('duplicate submission is detected', async () => {
  const r = await student.call('POST', '/api/assignments', { title: 'again', subject: 'Environmental Studies', pastedText: ESSAY });
  assert.equal(r.status, 409); assert.equal(r.data.assignmentId, aid);
});

test('PDF, DOCX and TXT extraction', async () => {
  const paras = ESSAY.split('\n\n').map(p => p + ' (file version)');
  const pdf = await student.call('POST', '/api/assignments', { title: 'pdf', subject: 'English', file: { name: 'essay.pdf', dataBase64: b64(await makePdf(paras)) } });
  assert.equal(pdf.status, 201, JSON.stringify(pdf.data));
  const pb = (await student.call('GET', `/api/assignments/${pdf.data.assignmentId}`)).data;
  assert.equal(pb.assignment.sourceType, 'pdf'); assert.ok(pb.report.paragraphs.length >= 3, `pdf paragraphs ${pb.report.paragraphs.length}`);
  const docx = await student.call('POST', '/api/assignments', { title: 'docx', subject: 'English', file: { name: 'essay.docx', dataBase64: b64(await makeDocx(paras.map(p => p + ' docx'))) } });
  assert.equal(docx.status, 201, JSON.stringify(docx.data));
  const db2 = (await student.call('GET', `/api/assignments/${docx.data.assignmentId}`)).data;
  assert.equal(db2.report.paragraphs.length, 3);
  const txt = await student.call('POST', '/api/assignments', { title: 'txt', subject: 'English', file: { name: 'essay.txt', dataBase64: b64(Buffer.from(ESSAY + '\n\ntxt version paragraph with enough words to count as a proper paragraph of writing here.')) } });
  assert.equal(txt.status, 201, JSON.stringify(txt.data));
});

test('file validation edge cases never produce reports', async () => {
  const cases: [any, number, RegExp][] = [
    [{ name: 'scan.pdf', dataBase64: b64(await makePdf(null)) }, 422, /scanned/i],
    [{ name: 'bad.pdf', dataBase64: b64(Buffer.from('not a pdf at all')) }, 422, /not a valid PDF/],
    [{ name: 'broken.pdf', dataBase64: b64(Buffer.from('%PDF-1.4 garbage garbage')) }, 422, /could not read/i],
    [{ name: 'x.exe', dataBase64: b64(Buffer.from('MZ')) }, 415, /not supported/],
    [{ name: 'old.docx', dataBase64: b64(Buffer.from('plain')) }, 422, /not a valid Word/],
    [{ name: 'empty.txt', dataBase64: '' }, 422, /empty/],
    [{ name: 'big.txt', dataBase64: b64(Buffer.alloc(5.5 * 1024 * 1024, 97)) }, 413, /too large/i],
  ];
  for (const [file, status, re] of cases) {
    const r = await student.call('POST', '/api/assignments', { title: 'edge', subject: 'English', file });
    assert.equal(r.status, status, `${file.name}: ${JSON.stringify(r.data)}`); assert.match(r.data.error, re);
  }
  assert.equal((await student.call('POST', '/api/assignments', { title: 'e', subject: 'English', pastedText: '' })).status, 400);
  assert.equal((await student.call('POST', '/api/assignments', { title: '', subject: 'English', pastedText: ESSAY + 'z' })).status, 400);
  assert.equal((await student.call('POST', '/api/assignments', { title: 'x', subject: 'Nonsense', pastedText: ESSAY + 'z' })).status, 400);
});

test('students cannot see each other’s work', async () => {
  assert.equal((await student2.call('GET', `/api/assignments/${aid}`)).status, 404);
  assert.equal((await student2.call('GET', '/api/assignments')).data.assignments.length, 0);
  assert.equal((await student2.call('DELETE', `/api/assignments/${aid}`)).status, 404);
});

test('teachers only see subjects they are authorised for', async () => {
  const mine = (await teacher.call('GET', '/api/assignments')).data.assignments;
  assert.ok(mine.length >= 1 && mine.every((a: any) => a.subject === 'Environmental Studies'));
  assert.equal((await otherTeacher.call('GET', `/api/assignments/${aid}`)).status, 403);
  assert.equal((await teacher.call('GET', '/api/assignments?q=S-001')).data.assignments.length, 1);
  assert.equal((await teacher.call('GET', '/api/assignments?q=nobody')).data.assignments.length, 0);
});

test('thinking footprint update re-analyses and keeps report history', async () => {
  const r = await student.call('PUT', `/api/assignments/${aid}/footprint`, { footprint: { used_ai: 'yes', ai_help_types: ['translation'], drafts: ESSAY.split('\n\n')[0] } });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  const b = (await student.call('GET', `/api/assignments/${aid}`)).data;
  assert.equal(b.reportHistory.length, 2);
  assert.ok(b.report.fairness.warnings.some((w: any) => w.code === 'translation_disclosed'));
  assert.ok(b.report.processEvidence.draftsProvided);
});

test('teacher feedback, clarification, student reply, override with audit, review', async () => {
  assert.equal((await teacher.call('POST', `/api/assignments/${aid}/feedback`, { kind: 'clarification_request', message: 'Explain paragraph 2 please' })).status, 201);
  assert.equal((await student.call('GET', `/api/assignments/${aid}`)).data.assignment.reviewStatus, 'clarification_requested');
  assert.equal((await student.call('POST', `/api/assignments/${aid}/feedback`, { kind: 'feedback', message: 'I interviewed Ramesh chacha myself.' })).status, 201);
  assert.equal((await teacher.call('POST', `/api/assignments/${aid}/review`, { action: 'override', updated: { verdict: 'independent_confirmed', independentPct: 90, aiPct: 5, uncertainPct: 5 }, reason: 'short' })).status, 400);
  assert.equal((await teacher.call('POST', `/api/assignments/${aid}/review`, { action: 'override', updated: { verdict: 'independent_confirmed', independentPct: 90, aiPct: 5, uncertainPct: 6 }, reason: 'Student explained in class' })).status, 400);
  assert.equal((await teacher.call('POST', `/api/assignments/${aid}/review`, { action: 'override', updated: { verdict: 'independent_confirmed', independentPct: 90, aiPct: 5, uncertainPct: 5 }, reason: 'Student explained the interviews in class.' })).status, 200);
  assert.equal((await student.call('POST', `/api/assignments/${aid}/review`, { action: 'mark_reviewed' })).status, 403);
  const b = (await teacher.call('GET', `/api/assignments/${aid}`)).data;
  assert.equal(b.currentAssessment.source, 'teacher'); assert.equal(b.currentAssessment.independentPct, 90);
  const ov = b.reviews.find((r: any) => r.action === 'override');
  assert.equal(ov.teacherName, 'Ms Rao'); assert.ok(ov.previous_assessment.source === 'automated'); assert.ok(ov.reason.length > 10 && ov.createdAt);
  assert.equal(b.feedback.length, 2);
  assert.equal((await teacher.call('POST', `/api/assignments/${aid}/review`, { action: 'mark_reviewed', reason: 'ok' })).status, 200);
});

test('learning journey, stats and PDF report', async () => {
  const j = (await student.call('GET', '/api/journey')).data.journey;
  assert.ok(j.length >= 5);
  const tj = await teacher.call('GET', `/api/students/${(await student.call('GET', '/api/auth/me')).data.user.id}/journey`);
  assert.equal(tj.status, 200); assert.ok(tj.data.journey.every((x: any) => x.subject === 'Environmental Studies'));
  const s = (await teacher.call('GET', '/api/teacher/stats')).data;
  assert.equal(s.total, 1); assert.equal(s.reviewed, 1); assert.equal(s.overrides, 1);
  const pdf = await student.call('GET', `/api/assignments/${aid}/report.pdf`);
  assert.equal(pdf.status, 200); assert.match(pdf.ct, /pdf/); assert.equal(pdf.data.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdf.data.length > 3000);
});

test('student can delete their own data', async () => {
  assert.equal((await student.call('DELETE', `/api/assignments/${aid}`)).status, 200);
  assert.equal((await student.call('GET', `/api/assignments/${aid}`)).status, 404);
});

test('non-JSON state changes are rejected (CSRF hardening)', async () => {
  const r = await fetch(base + '/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', cookie: student.cookie }, body: 'a=1' });
  assert.equal(r.status, 415);
});
