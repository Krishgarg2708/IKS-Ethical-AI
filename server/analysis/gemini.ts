// Optional server-side language-model review via the Google Gemini REST API.
// Enabled only when GEMINI_API_KEY is set on the server. The key never reaches the browser.
import type { ExternalScorer } from './engine.ts';

export function geminiScorer(): ExternalScorer | undefined {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') return undefined;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  return async (paragraphs) => {
    const prompt = `You are assisting a FAIR academic-integrity review for students, many from rural India writing in a second language.
For each numbered paragraph, estimate the likelihood (0.0–1.0) that it shows signs of AI assistance in writing.
Rules: Do NOT treat correct grammar, advanced vocabulary, simple English, repetition or translation-like phrasing as evidence.
Be conservative: use values near 0.5 when unsure. Give a one-sentence neutral rationale.
Return JSON: {"paragraphs":[{"index":1,"ai_likelihood":0.0,"rationale":"..."}]}

${paragraphs.map((p, i) => `[${i + 1}] ${p.slice(0, 2500)}`).join('\n\n')}`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Number(process.env.GEMINI_TIMEOUT_MS || 25000));
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, responseMimeType: 'application/json' },
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`AI service HTTP ${res.status}`);
      const data: any = await res.json();
      const txt = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
      const parsed = JSON.parse(txt);
      const scores: (number | null)[] = paragraphs.map(() => null);
      const rationales: (string | null)[] = paragraphs.map(() => null);
      for (const item of parsed?.paragraphs || []) {
        const i = Number(item.index) - 1;
        const v = Number(item.ai_likelihood);
        if (i >= 0 && i < paragraphs.length && v >= 0 && v <= 1) {
          scores[i] = v;
          rationales[i] = typeof item.rationale === 'string' ? item.rationale.slice(0, 300) : null;
        }
      }
      return { scores, rationales, model };
    } finally {
      clearTimeout(timer);
    }
  };
}
