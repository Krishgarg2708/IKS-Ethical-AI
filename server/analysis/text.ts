// Text utilities shared by the SwaLekhan engine.

export const words = (t: string): string[] => t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
export const wordCount = (t: string) => words(t).length;

export function sentences(t: string): string[] {
  return t
    .replace(/\b(e\.g|i\.e|etc|Dr|Mr|Mrs|Ms|Prof|vs|Fig|No)\./gi, '$1<DOT>')
    .split(/(?<=[.!?।])\s+(?=["'“(\p{Lu}\p{N}\p{Script=Devanagari}])/u)
    .map(s => s.replace(/<DOT>/g, '.').trim())
    .filter(s => wordCount(s) > 0);
}

/**
 * Split extracted text into analysable paragraphs.
 * - Blank lines are paragraph boundaries.
 * - Inside a block, hard line-wraps (common in PDFs) are re-joined unless a line ends a sentence
 *   and is visibly shorter than the block's typical line (a paragraph's last line).
 * - Short heading-like lines (<= 10 words, no closing punctuation) are dropped from analysis.
 */
export function segmentParagraphs(text: string): string[] {
  const out: string[] = [];
  for (const block of text.split(/\n\s*\n/)) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const maxLen = Math.max(...lines.map(l => l.length));
    let cur: string[] = [];
    const flush = () => { if (cur.length) { out.push(cur.join(' ').replace(/\s+/g, ' ').trim()); cur = []; } };
    for (const line of lines) {
      cur.push(line);
      const endsSentence = /[.!?।:"”)]$/.test(line);
      if (lines.length > 1 && endsSentence && line.length < maxLen * 0.8) flush();
      else if (lines.length > 1 && !endsSentence && wordCount(line) <= 10 && cur.length === 1) flush(); // heading line
    }
    flush();
  }
  return out.filter(p => {
    const wc = wordCount(p);
    const looksLikeHeading = wc <= 10 && !/[.!?।]$/.test(p);
    return wc > 0 && !looksLikeHeading;
  });
}

export function shingles(t: string, n = 5): Set<string> {
  const w = words(t.toLowerCase());
  const s = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
  return s;
}

/** Fraction of the paragraph's 5-word shingles that also appear in `other` (containment, 0..1). */
export function containment(paragraph: string, other: Set<string>): number {
  const p = shingles(paragraph);
  if (!p.size || !other.size) return 0;
  let hit = 0;
  for (const s of p) if (other.has(s)) hit++;
  return hit / p.size;
}

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
export const sd = (a: number[]) => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
export const median = (a: number[]) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const k = Math.floor(s.length / 2); return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
