// SwaLekhan AI — typed API client. Cookies carry the session; no keys ever live in the browser.

export interface User { id: number; role: 'student' | 'teacher'; name: string; username: string; isDemo: boolean; studentCode?: string; classLevel?: string; subjects?: string[] }
export interface Meta { subjects: string[]; classLevels: string[]; aiHelpTypes: string[]; verdicts: Record<string, string>; aiServiceConfigured: boolean; maxFileMb: number; retentionDays: number | null; teacherRegistrationOpen: boolean; demoAccounts: boolean }
export type Category = 'independent' | 'ai_assisted' | 'uncertain';
export interface Indicator { signal: string; direction: 'ai' | 'independent' | 'neutral'; strength: number; explanation: string }
export interface Paragraph { idx: number; text: string; wordCount: number; aiLikelihood: number; independentLikelihood: number; confidence: number; category: Category; indicators: Indicator[]; assistanceHint?: string | null }
export interface FairnessWarning { code: string; severity: 'info' | 'caution' | 'important'; title: string; detail: string }
export interface Report {
  id: number; createdAt: string; method: 'heuristic' | 'hybrid'; engineVersion: string; independentPct: number; aiPct: number; uncertainPct: number;
  confidence: number; confidenceLabel: string; paragraphCount: number; wordCount: number; summary: string; limitations: string[];
  fairness: { warnings: FairnessWarning[]; confidenceFactor: number; adjustmentsApplied: string[]; excludedSignals: string[]; teacherReviewRecommended: boolean };
  processEvidence: { draftsProvided: boolean; revisionHistoryProvided: boolean; draftOverlapAvg: number; reflectionAnswered: number; referencesProvided: boolean; disclosure: string; helpTypes: string[] };
  paragraphs: Paragraph[];
}
export interface Footprint { [k: string]: any; ai_help_types?: string[] }
export interface JourneyItem { id: number; title: string; subject: string; createdAt: string; wordCount: number; reviewStatus: string; analysed: boolean; independentPct: number | null; aiPct: number | null; uncertainPct: number | null; confidenceLabel: string | null; avgSentenceLength: number | null; reflectionAnswered: number; aiDisclosed: string; teacherVerdict: string | null }
export interface Assessment { source: 'automated' | 'teacher'; verdict: string | null; independentPct: number; aiPct: number; uncertainPct: number; teacherName?: string; at?: string; reason?: string }
export interface Bundle {
  assignment: { id: number; title: string; subject: string; classLevel: string; description: string | null; sourceType: string; wordCount: number; status: string; reviewStatus: string; analysisError: string | null; createdAt: string; studentId: number; studentName: string; studentCode: string; content: string; file: { fileName: string; fileType: string; sizeBytes: number; pages: number | null } | null };
  report: Report | null;
  reportHistory: { id: number; createdAt: string; method: string; independentPct: number; aiPct: number; uncertainPct: number; confidenceLabel: string }[];
  footprint: Footprint | null;
  feedback: { id: number; kind: string; message: string; createdAt: string; author: string; authorRole: string }[];
  reviews: { id: number; action: string; previous_assessment: any; updated_assessment: any; reason: string | null; createdAt: string; teacherName: string }[];
  currentAssessment: Assessment | null;
  journey: JourneyItem[];
}
export interface ListItem { id: number; title: string; subject: string; classLevel: string; wordCount: number; status: string; reviewStatus: string; createdAt: string; studentId: number; studentName: string; studentCode: string; independentPct: number | null; aiPct: number | null; uncertainPct: number | null; confidenceLabel: string | null; fairnessWarnings: number; reviewRecommended: boolean; teacherVerified: boolean; feedbackCount: number }

export class ApiError extends Error { constructor(public status: number, message: string, public data?: any) { super(message); } }

// Mode: 'server' (Express API reachable) or 'local' (browser-only, e.g. static Vercel deploy).
// Force with VITE_SWALEKHAN_MODE=local|server; otherwise auto-detected once via /api/health.
let modePromise: Promise<'server' | 'local'> | null = null;
let resolvedMode: 'server' | 'local' | null = null;
export const isLocalMode = () => resolvedMode === 'local';
function detectMode() {
  if (!modePromise) {
    const forced = (import.meta as any).env?.VITE_SWALEKHAN_MODE;
    modePromise = (forced === 'local' || forced === 'server') ? Promise.resolve(forced)
      : fetch('/api/health', { credentials: 'same-origin' })
          .then(async r => (r.ok && (await r.json().catch(() => null))?.ok === true ? 'server' : 'local') as 'server' | 'local')
          .catch(() => 'local' as const);
    modePromise.then(m => { resolvedMode = m; });
  }
  return modePromise;
}

async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  if ((await detectMode()) === 'local') {
    const { localRequest } = await import('./localApi');
    try { return await localRequest(method, url, body) as T; }
    catch (e: any) { throw new ApiError(e.status || 500, e.message || 'Something went wrong.', e.data); }
  }
  let res: Response;
  try {
    res = await fetch(url, { method, credentials: 'same-origin', headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'Cannot reach the SwaLekhan server. Check your internet connection, or make sure the API server is running (npm run dev).');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || `Request failed (${res.status}).`, data);
  return data as T;
}

export const api = {
  meta: () => req<Meta>('GET', '/api/meta'),
  me: () => req<{ user: User | null }>('GET', '/api/auth/me'),
  login: (username: string, password: string) => req<{ user: User }>('POST', '/api/auth/login', { username, password }),
  register: (body: any) => req<{ user: User }>('POST', '/api/auth/register', body),
  logout: () => req('POST', '/api/auth/logout', {}),
  submit: (body: any) => req<{ assignmentId: number; reportId: number }>('POST', '/api/assignments', body),
  list: (q: Record<string, string> = {}) => req<{ assignments: ListItem[] }>('GET', '/api/assignments?' + new URLSearchParams(Object.entries(q).filter(([, v]) => v))),
  get: (id: number, reportId?: number) => req<Bundle>('GET', `/api/assignments/${id}${reportId ? `?reportId=${reportId}` : ''}`),
  reanalyse: (id: number) => req<{ reportId: number }>('POST', `/api/assignments/${id}/analyse`, {}),
  saveFootprint: (id: number, footprint: Footprint) => req<{ reportId: number }>('PUT', `/api/assignments/${id}/footprint`, { footprint }),
  remove: (id: number) => req('DELETE', `/api/assignments/${id}`),
  feedback: (id: number, kind: string, message: string) => req('POST', `/api/assignments/${id}/feedback`, { kind, message }),
  review: (id: number, body: any) => req('POST', `/api/assignments/${id}/review`, body),
  journey: () => req<{ journey: JourneyItem[] }>('GET', '/api/journey'),
  studentJourney: (sid: number) => req<{ student: { id: number; name: string; studentCode: string; classLevel: string }; journey: JourneyItem[] }>('GET', `/api/students/${sid}/journey`),
  stats: () => req<{ total: number; pending: number; reviewed: number; clarification: number; bySubject: { subject: string; count: number; avgIndependent: number | null; avgAi: number | null; avgUncertain: number | null }[]; avg: { independentPct: number; aiPct: number; uncertainPct: number; n: number } | null; fairnessFlagged: number; overrides: number }>('GET', '/api/teacher/stats'),
  pdfUrl: (id: number, reportId?: number) => `/api/assignments/${id}/report.pdf${reportId ? `?reportId=${reportId}` : ''}`,
};

export const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1] || '');
  r.onerror = () => reject(new Error('Could not read the file from your device.'));
  r.readAsDataURL(f);
});

export const fmtDate = (s: string) => { const d = new Date(s.replace(' ', 'T') + 'Z'); return isNaN(+d) ? s : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
export const fmtDateTime = (s: string) => { const d = new Date(s.replace(' ', 'T') + 'Z'); return isNaN(+d) ? s : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
