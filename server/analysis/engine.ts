// ─────────────────────────────────────────────────────────────────────────────
// SWALEKHAN CONTRIBUTION ENGINE  (स्वलेखन)
//
// An explicitly-labelled, transparent HEURISTIC analysis, optionally blended with
// a server-side LLM judgement (see gemini.ts). It estimates *indicators* of
// independent writing vs AI assistance. It does not and cannot verify authorship.
//
// PER-PARAGRAPH PIPELINE
//  1. AI-pattern evidence E_ai ∈ [0,1] (weighted mean of):
//       s_burst  0.30  low variation in sentence length (coefficient of variation < 0.55)
//       s_stock  0.35  density of stock phrases typical of LLM prose ("it is important to note", "delve" …)
//       s_trans  0.20  share of sentences opening with formal connectors (Furthermore, Moreover …)
//       s_triad  0.15  share of sentences with "X, Y, and Z" enumerations
//  2. Independent-voice evidence E_ind ∈ [0,1]:
//       v_voice  0.40  first-person singular / personal experience
//       v_spec   0.30  concrete specifics (numbers, local names, dates, quotes)
//       v_proc   0.30  traces of thinking (questions, asides in brackets, contractions)
//  3. Writing-process evidence d ∈ [0,1]: containment of the paragraph's 5-word
//     shingles in the drafts / revision history the student supplied.
//  4. AI-assistance likelihood  p = σ(3.0·E_ai − 2.4·E_ind − 2.5·d − 0.35)
//     Independent likelihood    q = 1 − p
//  5. Confidence c = L · (0.35 + 0.65·|2p − 1|) · F · S, capped at 0.85 (heuristic) / 0.90 (hybrid)
//       L = min(1, 0.35 + words/150) (short paragraphs → lower confidence)
//       F = Nyaya fairness factor   (≤ 1, see fairness.ts)
//       S = 0.85 if the paragraph's style shifts sharply from the student's own baseline
//  6. Category: c < 0.30 → uncertain; p ≥ 0.62 → AI-assisted; p ≤ 0.42 → independent; else uncertain.
//
// DOCUMENT-LEVEL NORMALISATION (always sums to exactly 100)
//   For each paragraph with w words:
//     uncertain   += w · (1 − c)
//     ai          += w · c · p
//     independent += w · c · (1 − p)
//   Divide by total words → shares; convert to integer percentages with the
//   largest-remainder method so the three values total exactly 100.
//
// NEVER USED AS SIGNALS (Nyaya): grammatical correctness, vocabulary level,
// simplicity, repetition, spelling, or comparison with other students.
// ─────────────────────────────────────────────────────────────────────────────
import { words, wordCount, sentences, segmentParagraphs, shingles, containment, clamp01, mean, sd, median } from './text.ts';
import { nyayaCheck, type Disclosure, type FairnessResult } from './fairness.ts';

export const ENGINE_VERSION = 'swalekhan-heuristic-1.0';

export type Category = 'independent' | 'ai_assisted' | 'uncertain';

export interface Indicator {
  signal: string;
  direction: 'ai' | 'independent' | 'neutral';
  strength: number; // 0..1
  explanation: string;
}

export interface ParagraphResult {
  idx: number;
  text: string;
  wordCount: number;
  aiLikelihood: number;
  independentLikelihood: number;
  confidence: number;
  category: Category;
  indicators: Indicator[];
  assistanceHint?: string;
}

export interface ProcessEvidence {
  draftsProvided: boolean;
  revisionHistoryProvided: boolean;
  draftOverlapAvg: number;
  reflectionAnswered: number;   // of 8 Thinking Footprint questions
  referencesProvided: boolean;
  disclosure: 'yes' | 'no' | 'prefer_not' | 'not_given';
  helpTypes: string[];
}

export interface AnalysisResult {
  method: 'heuristic' | 'hybrid';
  engineVersion: string;
  independentPct: number;
  aiPct: number;
  uncertainPct: number;
  confidence: number;
  confidenceLabel: 'Low' | 'Moderate' | 'High';
  wordCount: number;
  paragraphs: ParagraphResult[];
  fairness: FairnessResult;
  processEvidence: ProcessEvidence;
  limitations: string[];
  summary: string;
}

export interface EngineInput {
  text: string;
  disclosure?: Disclosure;
  drafts?: string;
  revisionHistory?: string;
  reflectionAnswered?: number;
  referencesProvided?: boolean;
}

/** Optional external judgement per paragraph (0..1 AI-assistance likelihood). */
export type ExternalScorer = (paragraphs: string[]) => Promise<{ scores: (number | null)[]; rationales: (string | null)[]; model: string }>;

const STOCK_PHRASES = [
  'it is important to note', 'it is worth noting', 'it should be noted', 'plays a crucial role', 'plays a vital role',
  'plays a pivotal role', 'in today\'s fast-paced', 'in today’s fast-paced', 'in the modern era', 'in conclusion, ',
  'delve into', 'delves into', 'delving into', 'a testament to', 'rich tapestry', 'navigate the complexities',
  'ever-evolving', 'ever-changing landscape', 'in the realm of', 'serves as a', 'underscores the', 'underscore the importance',
  'a myriad of', 'foster a sense', 'holistic approach', 'paving the way', 'shed light on', 'sheds light on',
  'crucial to understand', 'it is essential to', 'stands as a', 'in essence', 'harness the power', 'unlock the potential',
  'embark on a journey', 'nuanced understanding', 'by leveraging', 'in summary,', 'in the ever',
  'a crucial role', 'navigating the', 'the intricate interplay', 'multifaceted nature', 'a deeper understanding of',
];
// Deliberately NOT included: single "advanced" words (robust, intricate, myriad …). Under the Nyaya
// principle, vocabulary level alone is never evidence — only multi-word stock constructions are.
const CONNECTOR_OPENERS = /^(furthermore|moreover|additionally|in addition|consequently|ultimately|notably|overall|thus|hence|therefore|importantly|similarly|conversely|nevertheless|in conclusion|in summary|to summarize|firstly|secondly|lastly|finally)\b/i;
const FIRST_PERSON = /\b(i|i'm|i’m|i've|i’ve|my|me|mine|myself|we|our|us|मैं|मेरा|मेरी|हम)\b/giu;

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const r3 = (x: number) => Math.round(x * 1000) / 1000;

function analyseParagraph(text: string, idx: number, draftShingles: Set<string>, baseline: { sentLen: number }, fairnessFactor: number) {
  const lower = text.toLowerCase();
  const wc = wordCount(text);
  const sents = sentences(text);
  const sentLens = sents.map(wordCount);
  const indicators: Indicator[] = [];

  // 1a. Burstiness
  let sBurst = 0;
  if (sentLens.length >= 3) {
    const cv = sd(sentLens) / Math.max(1, mean(sentLens));
    sBurst = clamp01((0.55 - cv) / 0.35);
    indicators.push(sBurst > 0.5
      ? { signal: 'Uniform sentence rhythm', direction: 'ai', strength: r3(sBurst), explanation: `Sentence lengths vary little (variation ${cv.toFixed(2)}). Generated prose is often evenly paced; human drafts usually mix short and long sentences.` }
      : { signal: 'Varied sentence rhythm', direction: 'independent', strength: r3(1 - sBurst), explanation: `Sentence lengths vary naturally (variation ${cv.toFixed(2)}), which is typical of a writer thinking as they go.` });
  } else {
    indicators.push({ signal: 'Too few sentences for rhythm analysis', direction: 'neutral', strength: 0, explanation: 'Fewer than three sentences — sentence-rhythm signal not used.' });
  }

  // 1b. Stock phrases
  const hits = STOCK_PHRASES.filter(p => lower.includes(p));
  const stockDensity = (hits.length / Math.max(1, wc)) * 100;
  const sStock = clamp01(stockDensity / 1.5);
  if (hits.length) indicators.push({ signal: 'Stock phrasing', direction: 'ai', strength: r3(sStock), explanation: `Contains phrases frequently produced by AI writing tools: “${hits.slice(0, 4).join('”, “')}”. Many writers also use these, so this is weak evidence on its own.` });

  // 1c. Connector openers
  const openers = sents.filter(s => CONNECTOR_OPENERS.test(s.trim())).length;
  const sTrans = sents.length ? clamp01(openers / sents.length / 0.4) : 0;
  if (openers >= 2) indicators.push({ signal: 'Formulaic transitions', direction: 'ai', strength: r3(sTrans), explanation: `${openers} of ${sents.length} sentences open with formal connectors (e.g. “Furthermore”, “Moreover”).` });

  // 1d. Triads
  const triads = (text.match(/\b[\p{L}-]+(?: [\p{L}-]+){0,2}, [\p{L}-]+(?: [\p{L}-]+){0,2},? and [\p{L}-]+/gu) || []).length;
  const sTriad = sents.length ? clamp01(triads / sents.length / 0.5) : 0;
  if (triads >= 2) indicators.push({ signal: 'Repeated three-part lists', direction: 'ai', strength: r3(sTriad), explanation: `${triads} “X, Y and Z” lists — a common rhetorical habit of language models.` });

  // 2a. Personal voice
  const fp = (text.match(FIRST_PERSON) || []).length;
  const vVoice = clamp01(((fp / Math.max(1, wc)) * 100) / 2);
  if (fp) indicators.push({ signal: 'Personal voice', direction: 'independent', strength: r3(vVoice), explanation: `Uses first-person perspective ${fp} time(s), suggesting personal experience or opinion.` });

  // 2b. Concrete specifics
  const specifics = (text.match(/\b\d[\d,.:%]*\b/g) || []).length
    + (text.match(/(?<=[a-z,] )\p{Lu}\p{Ll}+/gu) || []).length
    + (text.match(/["“][^"”]{3,80}["”]/g) || []).length;
  const vSpec = clamp01(((specifics / Math.max(1, wc)) * 100) / 4);
  if (specifics >= 2) indicators.push({ signal: 'Concrete specifics', direction: 'independent', strength: r3(vSpec), explanation: `${specifics} specific details (numbers, names, quotations) — specific local detail is harder to generate generically.` });

  // 2c. Thinking traces
  const traces = (text.match(/\?/g) || []).length + (text.match(/\([^)]{2,}\)/g) || []).length
    + (text.match(/\b\w+(n't|n’t|'ll|’ll|'re|’re|'d|’d)\b/gi) || []).length + (text.match(/!/g) || []).length;
  const vProc = sents.length ? clamp01(traces / sents.length / 0.3) : 0;
  if (traces) indicators.push({ signal: 'Traces of thinking aloud', direction: 'independent', strength: r3(vProc), explanation: `${traces} questions, asides or informal contractions — features of a writer reasoning in their own words.` });

  // 3. Drafts
  const d = draftShingles.size ? containment(text, draftShingles) : 0;
  if (draftShingles.size) indicators.push(d > 0.15
    ? { signal: 'Matches student’s earlier draft', direction: 'independent', strength: r3(d), explanation: `${Math.round(d * 100)}% of this paragraph’s phrasing appears in drafts or revision history the student supplied — writing-process evidence.` }
    : { signal: 'Not found in supplied drafts', direction: 'neutral', strength: 0, explanation: 'This paragraph does not closely match the supplied drafts. It may have been added or rewritten later — this is not evidence of AI use.' });

  const eAi = 0.30 * sBurst + 0.35 * sStock + 0.20 * sTrans + 0.15 * sTriad;
  const eInd = 0.40 * vVoice + 0.30 * vSpec + 0.30 * vProc;
  const p = sigmoid(3.0 * eAi - 2.4 * eInd - 2.5 * d - 0.35);

  // Style shift relative to the student's own baseline (raises uncertainty only)
  const avgLen = sentLens.length ? mean(sentLens) : wc;
  const shift = baseline.sentLen ? Math.abs(avgLen - baseline.sentLen) / baseline.sentLen : 0;
  const S = shift > 0.6 ? 0.85 : 1;
  if (S < 1) indicators.push({ signal: 'Style differs from rest of assignment', direction: 'neutral', strength: r3(clamp01(shift)), explanation: 'Sentence length differs strongly from this student’s other paragraphs. Could indicate a change of source, a quotation, or simply a different section type — confidence lowered.' });

  const L = Math.min(1, 0.35 + wc / 150);
  const c = Math.min(0.85, L * (0.35 + 0.65 * Math.abs(2 * p - 1)) * fairnessFactor * S);

  let assistanceHint: string | undefined;
  if (eAi > 0.35 && eInd > 0.3) assistanceHint = 'Mixed signals: personal content with polished phrasing — consistent with editing, grammar or translation support rather than generated text.';
  else if (eAi > 0.45 && eInd < 0.15 && d < 0.1) assistanceHint = 'Pattern resembles generated prose with little personal detail. Discuss with the student before drawing any conclusion.';

  return { idx, text, wordCount: wc, p, c, indicators, assistanceHint, d };
}

function categorise(p: number, c: number): Category {
  if (c < 0.30) return 'uncertain';
  if (p >= 0.62) return 'ai_assisted';
  if (p <= 0.42) return 'independent';
  return 'uncertain';
}

/** Largest-remainder rounding: integer percentages that sum to exactly 100. */
export function toPercentages(shares: number[]): number[] {
  const total = shares.reduce((a, b) => a + b, 0) || 1;
  const raw = shares.map(s => (s / total) * 100);
  const floors = raw.map(Math.floor);
  let rest = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; rest > 0; k = (k + 1) % order.length, rest--) floors[order[k][1]]++;
  return floors;
}

export async function analyse(input: EngineInput, external?: ExternalScorer): Promise<AnalysisResult> {
  const paragraphsText = segmentParagraphs(input.text);
  if (!paragraphsText.length) throw new Error('No analysable paragraphs were found.');
  const totalWords = paragraphsText.reduce((s, p) => s + wordCount(p), 0);
  if (totalWords < 30) throw new Error('At least 30 words of continuous writing are needed for analysis.');

  const disclosure = input.disclosure || {};
  const fairness = nyayaCheck(paragraphsText.join('\n\n'), paragraphsText, disclosure);
  const draftShingles = shingles([input.drafts || '', input.revisionHistory || ''].join('\n'));
  const baseline = { sentLen: median(paragraphsText.map(p => { const s = sentences(p); return s.length ? wordCount(p) / s.length : wordCount(p); })) };

  const raw = paragraphsText.map((t, i) => analyseParagraph(t, i + 1, draftShingles, baseline, fairness.confidenceFactor));

  let method: AnalysisResult['method'] = 'heuristic';
  const limitations: string[] = [];
  if (external) {
    try {
      const ext = await external(paragraphsText);
      let used = 0;
      raw.forEach((r, i) => {
        const s = ext.scores[i];
        if (typeof s === 'number' && Number.isFinite(s)) {
          used++;
          const blended = 0.5 * r.p + 0.5 * clamp01(s);
          r.indicators.push({ signal: `Language-model review (${ext.model})`, direction: s >= 0.6 ? 'ai' : s <= 0.4 ? 'independent' : 'neutral', strength: r3(Math.abs(2 * s - 1)),
            explanation: `An AI model independently estimated ${Math.round(s * 100)}% likelihood of AI assistance.${ext.rationales[i] ? ' ' + ext.rationales[i] : ''} Blended 50/50 with the heuristic.` });
          // agreement between the two methods increases confidence slightly, disagreement lowers it
          const agree = 1 - Math.abs(r.p - s);
          r.p = blended;
          r.c = Math.min(0.9, r.c * (0.8 + 0.4 * agree));
        }
      });
      if (used) method = 'hybrid';
      else limitations.push('The configured AI service returned no usable scores; this report uses the heuristic engine only.');
    } catch (e: any) {
      limitations.push(`The configured AI service was unavailable (${String(e?.message || e).slice(0, 120)}). This report uses the heuristic engine only.`);
    }
  }

  const paragraphs: ParagraphResult[] = raw.map(r => ({
    idx: r.idx, text: r.text, wordCount: r.wordCount,
    aiLikelihood: r3(r.p), independentLikelihood: r3(1 - r.p), confidence: r3(r.c),
    category: categorise(r.p, r.c), indicators: r.indicators, assistanceHint: r.assistanceHint,
  }));

  let ai = 0, ind = 0, unc = 0;
  for (const p of paragraphs) {
    unc += p.wordCount * (1 - p.confidence);
    ai += p.wordCount * p.confidence * p.aiLikelihood;
    ind += p.wordCount * p.confidence * p.independentLikelihood;
  }
  const [independentPct, aiPct, uncertainPct] = toPercentages([ind, ai, unc]);
  const confidence = r3(paragraphs.reduce((s, p) => s + p.confidence * p.wordCount, 0) / totalWords);
  const confidenceLabel = confidence < 0.35 ? 'Low' : confidence < 0.6 ? 'Moderate' : 'High';

  const helpTypes = disclosure.helpTypes || [];
  const processEvidence: ProcessEvidence = {
    draftsProvided: !!input.drafts?.trim(),
    revisionHistoryProvided: !!input.revisionHistory?.trim(),
    draftOverlapAvg: r3(mean(raw.map(r => r.d))),
    reflectionAnswered: input.reflectionAnswered || 0,
    referencesProvided: !!input.referencesProvided,
    disclosure: (disclosure.usedAi as any) || 'not_given',
    helpTypes,
  };

  limitations.unshift(
    method === 'heuristic'
      ? 'Method: transparent heuristic indicators only (no external AI detector is configured). Heuristics are not calibrated against a labelled dataset and should be treated as conversation starters.'
      : 'Method: heuristic indicators blended with a language-model judgement. Language models are not reliable AI detectors either; agreement between methods only modestly increases confidence.',
    'No automated method can establish who wrote a text. These percentages are estimates of writing indicators, not verified authorship.',
    'AI assistance (brainstorming, grammar, translation, explanations) is legitimate in many classrooms and is not the same as submitting AI-generated work.',
    'This score must not be used on its own to grade, fail, suspend or accuse any student.',
  );
  if (totalWords < 300) limitations.push('Short texts produce unstable estimates.');

  const nAi = paragraphs.filter(p => p.category === 'ai_assisted').length;
  const summary =
    `Across ${paragraphs.length} paragraph(s) and ${totalWords} words, SwaLekhan estimates ${independentPct}% of the content shows independent-writing indicators, ` +
    `${aiPct}% shows possible AI-assistance indicators, and ${uncertainPct}% is inconclusive (overall confidence: ${confidenceLabel.toLowerCase()}). ` +
    (nAi ? `${nAi} paragraph(s) carry stronger AI-assistance indicators and may be worth discussing with the student — as a learning conversation, not an accusation. ` : 'No paragraph carries strong AI-assistance indicators. ') +
    (fairness.warnings.length ? `${fairness.warnings.length} Nyaya fairness note(s) apply; please read them before interpreting the numbers.` : '');

  return { method, engineVersion: ENGINE_VERSION, independentPct, aiPct, uncertainPct, confidence, confidenceLabel, wordCount: totalWords, paragraphs, fairness, processEvidence, limitations, summary };
}

export { words };
