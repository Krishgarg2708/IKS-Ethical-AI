// SwaLekhan AI server entry point.
import { openDb, purgeExpired } from './db.ts';
import { createApp } from './app.ts';

const db = openDb();
const retention = Number(process.env.RETENTION_DAYS || 0);
const purge = () => { const n = purgeExpired(db, retention); if (n) console.log(`[swalekhan] retention policy removed ${n} assignment(s)`); };
purge();
setInterval(purge, 24 * 3600_000).unref();

const port = Number(process.env.PORT || 8787);
createApp(db).listen(port, () => {
  const ai = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  console.log(`[swalekhan] API listening on http://localhost:${port}`);
  console.log(`[swalekhan] analysis mode: ${ai ? 'hybrid (heuristic + Gemini)' : 'heuristic only (GEMINI_API_KEY not set)'}`);
  if (!process.env.TEACHER_INVITE_CODE) console.log('[swalekhan] teacher self-registration disabled (set TEACHER_INVITE_CODE to enable)');
});
