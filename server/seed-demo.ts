// Creates clearly-labelled DEMO accounts and DEMO submissions (analysed by the real engine).
// Usage: npm run seed:demo      Remove with: npm run seed:demo -- --remove
import { openDb, audit } from './db.ts';
import { hashPassword } from './auth.ts';
import { contentHash, saveFootprint, runAnalysis } from './service.ts';
import { wordCount } from './analysis/text.ts';

const db = openDb();
if (process.argv.includes('--remove')) {
  const r = db.prepare('DELETE FROM users WHERE is_demo = 1').run();
  console.log(`Removed ${r.changes} demo user(s) and their data.`);
  process.exit(0);
}
if (db.prepare('SELECT 1 FROM users WHERE is_demo = 1').get()) { console.log('Demo data already present.'); process.exit(0); }

const pw = hashPassword('demo-pass-2026');
const mk = (role: string, name: string, username: string) => Number(db.prepare('INSERT INTO users (role,name,username,password_hash,is_demo) VALUES (?,?,?,?,1)').run(role, name, username, pw).lastInsertRowid);
const t = mk('teacher', '[DEMO] Dr. Meera Joshi', 'demo.teacher');
db.prepare('INSERT INTO teachers (user_id, institution) VALUES (?, ?)').run(t, 'Demo Institution');
for (const s of ['English', 'Ethical AI', 'Indian Knowledge Systems', 'Environmental Studies']) db.prepare('INSERT INTO teacher_subjects VALUES (?,?)').run(t, s);
const s = mk('student', '[DEMO] Anjali Kumari', 'demo.student');
db.prepare('INSERT INTO students VALUES (?,?,?)').run(s, 'DEMO-2026-014', 'Undergraduate – Year 2');

const samples = [
  { title: 'Water Harvesting in My Village', subject: 'Environmental Studies', days: 40,
    text: `In my village near Sitapur, every summer the hand pump goes dry by May. My grandmother remembers a time when the old pond behind the temple held water till the monsoon came back. I wanted to find out what changed.\n\nI talked to three farmers and our panchayat secretary. Ramesh chacha told me the pond was filled with mud in 2009 when the new road was built, and nobody cleaned it after that. Is it surprising then that the water table fell? I don't think so.\n\nWe measured the depth of two wells with a rope (it took us a whole Sunday). One was 38 feet, the other 41 feet. Ten years ago people say it was around 25 feet. My idea is that if we desilt the pond and build small check dams on the nala, rain water will stay longer in the ground.`,
    fp: { original_idea: 'Why our hand pump dries every May', research_method: 'Interviews with farmers and measuring wells', used_ai: 'no', learnings: 'Groundwater recharge depends on ponds', main_argument: 'Reviving the pond can recharge wells.' } },
  { title: 'Ethics of AI in Student Evaluation', subject: 'Ethical AI', days: 20,
    text: `Artificial intelligence plays a crucial role in modern education. It is important to note that AI systems can analyse large amounts of student data quickly, efficiently, and accurately. Furthermore, these systems can identify patterns that teachers may miss.\n\nMoreover, it is essential to consider the ethical implications of such systems. Students from rural areas may face connectivity, language, and resource challenges. In the realm of fairness, algorithms trained on urban data may misjudge these learners. This underscores the importance of human oversight.\n\nIn my own college, I saw a friend marked "at risk" because she could not log in during power cuts. She was actually one of the best in our class. That experience is why I believe the teacher must always have the final word.`,
    fp: { original_idea: 'My friend being wrongly flagged', used_ai: 'yes', ai_tools: 'ChatGPT', ai_help_types: JSON.stringify(['brainstorming', 'grammar']), ai_help_detail: 'Used it to get an outline and fix grammar in the first two paragraphs', independent_parts: 'The last paragraph is fully mine', main_argument: 'Teachers must have the final word over AI flags.' } },
];
for (const x of samples) {
  const r = db.prepare(`INSERT INTO assignments (student_id,title,subject,class_level,description,source_type,content,content_hash,word_count,created_at)
    VALUES (?,?,?,?,?,'paste',?,?,?,datetime('now', ?))`).run(s, '[DEMO] ' + x.title, x.subject, 'Undergraduate – Year 2', 'Demo submission', x.text, contentHash(x.text), wordCount(x.text), `-${x.days} days`);
  const aid = Number(r.lastInsertRowid);
  db.prepare('INSERT INTO thinking_footprints (assignment_id) VALUES (?)').run(aid);
  saveFootprint(db, aid, x.fp);
  await runAnalysis(db, aid, s);
}
audit(db, null, 'demo_seeded', 'users', null);
console.log('Demo data created (all labelled [DEMO]).\n  Student: demo.student / demo-pass-2026\n  Teacher: demo.teacher / demo-pass-2026');
