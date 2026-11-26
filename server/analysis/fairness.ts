// NYAYA FAIRNESS CHECK (न्याय)
// Runs on every submission BEFORE scores are finalised. It never raises an AI estimate.
// It can only (a) widen uncertainty by reducing confidence, and (b) attach warnings that
// tell the teacher where automated indicators are known to be unreliable.
import { words, sentences, mean } from './text.ts';

export interface FairnessWarning {
  code: string;
  severity: 'info' | 'caution' | 'important';
  title: string;
  detail: string;
}

export interface FairnessResult {
  warnings: FairnessWarning[];
  confidenceFactor: number;         // multiplied into every paragraph's confidence (<= 1)
  adjustmentsApplied: string[];
  excludedSignals: string[];        // signals the engine deliberately never uses
  teacherReviewRecommended: boolean;
}

export interface Disclosure {
  usedAi?: 'yes' | 'no' | 'prefer_not' | null;
  helpTypes?: string[];             // brainstorming | grammar | translation | research | explanation | drafting | other
}

/** Signals SwaLekhan refuses to treat as evidence of AI use (documented, shown in every report). */
export const EXCLUDED_SIGNALS = [
  'Grammatical correctness — correct English is not evidence of AI use.',
  'Advanced or formal vocabulary — rich vocabulary is not evidence of AI use.',
  'Simple sentences or basic vocabulary — simple writing is not evidence of anything.',
  'Repeated words or phrases — common in learners writing in a second language.',
  'Difference from other students’ writing — students are never compared with each other.',
  'Spelling mistakes or their absence.',
];

export function nyayaCheck(fullText: string, paragraphs: string[], disclosure: Disclosure): FairnessResult {
  const warnings: FairnessWarning[] = [];
  const adjustments: string[] = [];
  let factor = 1;

  const w = words(fullText);
  const total = w.length;
  const sents = sentences(fullText);
  const avgSentLen = sents.length ? total / sents.length : total;
  const avgWordLen = mean(w.map(x => x.length));

  if (total < 200) {
    factor *= 0.75;
    warnings.push({ code: 'short_text', severity: 'important', title: 'Very short submission',
      detail: `Only ${total} words were analysed. Short texts give writing indicators very little to work with, so most of this estimate is marked uncertain.` });
    adjustments.push('Confidence reduced by 25% for a short text.');
  }

  if (paragraphs.length < 3) {
    factor *= 0.85;
    warnings.push({ code: 'few_paragraphs', severity: 'caution', title: 'Few paragraphs',
      detail: 'With fewer than three paragraphs, the engine cannot compare a student’s style across the assignment.' });
    adjustments.push('Confidence reduced by 15% because there are few paragraphs.');
  }

  if (avgSentLen < 12 && avgWordLen < 4.6) {
    factor *= 0.85;
    warnings.push({ code: 'simple_english', severity: 'caution', title: 'Simple English writing style',
      detail: 'This writing uses short sentences and common words. Simplicity is never treated as a signal here — but research has shown that automated detectors misjudge learners writing in a second language more often, so confidence is lowered and teacher judgement matters more.' });
    adjustments.push('Confidence reduced by 15% to protect simple-English and second-language writers.');
  }

  const letters = fullText.match(/\p{L}/gu) || [];
  const nonLatin = letters.filter(c => !/\p{Script=Latin}/u.test(c)).length;
  const hinglish = (fullText.match(/\b(hai|nahi|nahin|aur|bhi|kya|matlab|accha|yaani|lekin|toh)\b/gi) || []).length;
  if ((letters.length && nonLatin / letters.length > 0.02) || hinglish >= 3) {
    factor *= 0.8;
    warnings.push({ code: 'multilingual', severity: 'important', title: 'Multilingual or regional-language writing',
      detail: 'This text contains Devanagari/other scripts or code-mixed words. The indicators were designed for English and are not reliable for multilingual writing. A teacher should read these sections directly.' });
    adjustments.push('Confidence reduced by 20% for multilingual content.');
  }

  const help = new Set((disclosure.helpTypes || []).map(h => h.toLowerCase()));
  if (help.has('translation')) {
    factor *= 0.75;
    warnings.push({ code: 'translation_disclosed', severity: 'important', title: 'Translation tool disclosed',
      detail: 'The student says they wrote in another language and translated. Machine translation produces fluent, uniform English that looks like AI-generated text even when every idea is the student’s own.' });
    adjustments.push('Confidence reduced by 25% because translation was disclosed.');
  }
  if (help.has('grammar')) {
    factor *= 0.9;
    warnings.push({ code: 'grammar_disclosed', severity: 'caution', title: 'Grammar correction disclosed',
      detail: 'Grammar tools smooth sentence structure. Polished paragraphs may reflect language support, not AI-written ideas.' });
    adjustments.push('Confidence reduced by 10% because grammar assistance was disclosed.');
  }
  if (disclosure.usedAi === 'yes') {
    warnings.push({ code: 'ai_disclosed', severity: 'info', title: 'Student disclosed AI use',
      detail: 'Honest disclosure is encouraged by SwaLekhan and must never count against the student. Read the Thinking Footprint to understand how AI was used.' });
  }

  return {
    warnings,
    confidenceFactor: Math.max(0.25, factor),
    adjustmentsApplied: adjustments,
    excludedSignals: EXCLUDED_SIGNALS,
    teacherReviewRecommended: warnings.some(x => x.severity === 'important'),
  };
}
