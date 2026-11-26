# SwaLekhan AI (स्वलेखन) — Your Voice. Your Learning. Your Creation.

An ethical student authorship, AI contribution and learning reflection system, built into
**Gram to Graph – IKS & Ethical AI**. Open it from the **SwaLekhan AI** item in the navbar (`#swalekhan`).

> **No API key is required.** The analysis engine runs entirely on your own server.
> A Gemini key is optional and only adds a second opinion.

---

## 1. Quick start

```bash
npm install
npm run seed:demo        # optional: creates clearly-labelled [DEMO] accounts + 2 analysed submissions
npm run dev:all          # web on http://localhost:3000  +  API on http://localhost:8787
```
Open http://localhost:3000/#swalekhan

Demo logins (after `seed:demo`; password `demo-pass-2026`): `demo.student` and `demo.teacher`.
Remove demo data with `npm run seed:demo -- --remove`.

To register a real teacher, set `TEACHER_INVITE_CODE` (see `.env.example`). Teachers choose the
subjects they are allowed to review. Students register themselves.

| Command | Purpose |
|---|---|
| `npm run dev` | Frontend only (original behaviour; SwaLekhan shows a "server not reachable" notice) |
| `npm run dev:server` | API only, with auto-reload |
| `npm run dev:all` | Both together |
| `npm run build` | Production frontend build → `dist/` |
| `npm start` | Production: one Node process serves the API **and** `dist/` on `PORT` (default 8787) |
| `npm run lint` | TypeScript checks (frontend + server) |
| `npm test` | 26 automated tests (engine + full API with real PDF/DOCX/TXT files) |

Requirements: **Node.js ≥ 22.13**. The database is Node's built-in `node:sqlite`, so there is nothing
native to compile and no database server to install. Node prints a one-line "experimental" warning for it,
which is harmless.

### Deployment note
The original site is deployed on Vercel as a static app. Vercel's static hosting cannot run the SwaLekhan
API or keep its SQLite file. Deploy with `npm run build && npm start` on any Node host with a persistent
disk (Render, Railway, Fly.io, a VPS). The existing pages still work unchanged as a static deployment.

---

## 2. How SwaLekhan works

```
Submit (PDF/DOCX/TXT/paste) → validation → text extraction → paragraph segmentation
   → Nyaya Fairness Check → per-paragraph indicators → (optional LLM review)
   → word-weighted normalisation to 100% → stored report version → student & teacher views → PDF
```

### Analysis engine (`server/analysis/engine.ts`) — transparent heuristic, labelled as such
Per paragraph:

* **AI-pattern evidence E_ai**: 0.30·uniform sentence rhythm + 0.35·multi-word stock phrases
  ("it is important to note", "plays a crucial role" …) + 0.20·formulaic connector openers
  (Furthermore/Moreover …) + 0.15·repeated "X, Y and Z" lists
* **Independent-voice evidence E_ind**: 0.40·personal voice + 0.30·concrete specifics
  (numbers, local names, quotations) + 0.30·thinking traces (questions, asides, contractions)
* **Writing-process evidence d**: overlap of 5-word phrases with the drafts / revision history the student supplied
* **AI-assistance likelihood** `p = σ(3.0·E_ai − 2.4·E_ind − 2.5·d − 0.35)`; independent likelihood = 1 − p
* **Confidence** `c = L · (0.35 + 0.65·|2p−1|) · F · S`, capped at 0.85.
  L = length factor, F = Nyaya fairness factor, S = style-shift factor.
* **Category**: c < 0.30 → uncertain; p ≥ 0.62 → AI-assisted; p ≤ 0.42 → independent; otherwise uncertain.

**Normalisation to exactly 100%.** Each paragraph's words are split three ways:
uncertain = w·(1−c), AI = w·c·p, independent = w·c·(1−p).
The shares are summed, then rounded with the largest-remainder method.
The database also enforces the 100% total with a CHECK constraint.

**Assistance vs generation.** When polished phrasing appears together with personal content, the paragraph is
labelled as consistent with editing, grammar or translation help. Only prose with stock patterns and no
personal detail is described as resembling generated text, and even then only as something to discuss.

**Deterministic.** The same input always gives the same result. Nothing is random and nothing is hard-coded.

### Optional language-model review (`server/analysis/gemini.ts`)
If `GEMINI_API_KEY` is set, each paragraph also gets a server-side Gemini estimate, blended 50/50
with the heuristic (method shown as *hybrid*). If the call fails, the report uses the heuristic only and
says so in its limitations. The key is never sent to the browser.

### Nyaya Fairness Check (`server/analysis/fairness.ts`)
This check can **only lower confidence** (which widens "uncertain"). It never raises an AI estimate.
It triggers on: short texts, few paragraphs, simple-English style, Devanagari or code-mixed text,
and disclosed translation or grammar tools.

These are **never used as signals**: grammatical correctness, vocabulary level, simplicity,
repetition, spelling, and comparison with other students. Single "advanced" words (robust, intricate …)
are deliberately excluded from the phrase list.

### Other modules
* **SwaLekhan Score**: donut, percentage cards, progress bars and confidence. It is never a grade or
  an honesty score.
* **My Thinking Footprint**: the 8 reflection questions plus reflection, notes, drafts, revision history and
  references. Saving it creates a new report version. Disclosing AI use never counts against a student.
* **Learning Journey**: trend chart and writing-development table. Teachers see only their own subjects.
* **Teacher review**: search and filters, feedback, clarification requests, "mark reviewed", and
  overrides. Each override requires a reason and stores the teacher, the previous and updated
  assessment, and the time (`teacher_reviews` table plus `audit_logs`).
* **Reports**: in-app report, print layout, server-generated PDF, and version history.

---

## 3. Security & privacy
* scrypt password hashing. Opaque session tokens are stored hashed and sent in an httpOnly, SameSite=Lax cookie.
* Identity always comes from the session. A `studentId` sent by the client is ignored (this is tested).
* Students see only their own records. Teachers see only the subjects they are assigned.
  Role checks run on every endpoint.
* Uploads are checked for extension and file signature, size-limited (5 MB), and **not stored**.
  Only name, size and hash are kept.
* JSON-only state-changing requests (CSRF hardening), rate-limited login and registration, and security headers.
* Students can delete their submissions. `RETENTION_DAYS` purges old data automatically.

## 4. Database (SQLite, `server/db.ts`)
`users`, `students`, `teachers`, `teacher_subjects`, `sessions`, `assignments`, `assignment_files`,
`analysis_reports`, `paragraph_analysis`, `thinking_footprints`, `teacher_reviews`, `feedback`, `audit_logs`.
Learning progress is calculated from reports instead of being stored twice.
The schema is created automatically on first start.

## 5. Known limitations
* The heuristic has **not been calibrated against a labelled dataset**. Treat its numbers as conversation starters.
  Every report says this.
* No OCR. Scanned PDFs are rejected with a clear message and no report is produced.
* Legacy `.doc` files are not supported (use `.docx`).
* The indicators were designed for English. Multilingual text is flagged and its confidence reduced.
* The PDF report uses standard Latin fonts. Devanagari passages print as "[non-Latin text]" in the PDF
  (they display correctly in the app and its print view).
* Login rate limiting is in-memory (per process).

## 6. How it differs from a generic AI detector
A generic detector gives one hidden "AI %" verdict. SwaLekhan gives a three-way estimate with explicit
uncertainty and a reason for every paragraph. It runs a fairness guard before any number appears,
refuses to use grammar, vocabulary or simplicity as evidence, and adds the student's own reflection and
drafts as process evidence. The teacher makes the final, logged decision, and there are no automatic penalties.
