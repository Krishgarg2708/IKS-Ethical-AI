import React from 'react';
import type { Footprint } from '../api';
import { Field, inputCls } from '../ui';

export const FOOTPRINT_QUESTIONS: [string, string, string?][] = [
  ['original_idea', '1. What was your original idea?'],
  ['research_method', '2. How did you research the topic?'],
  ['used_ai', '3. Did you use AI tools?'],
  ['ai_tools', '4. If yes, which tools did you use?', 'e.g. ChatGPT, Gemini, Google Translate, Grammarly'],
  ['ai_help_detail', '5. How did AI help you?'],
  ['independent_parts', '6. Which parts did you write independently?'],
  ['learnings', '7. What did you learn while completing the assignment?'],
  ['main_argument', '8. Can you explain your main argument in your own words?'],
];
const HELP_LABEL: Record<string, string> = { brainstorming: 'Brainstorming ideas', grammar: 'Grammar / spelling correction', translation: 'Translation from my language', research: 'Research / finding sources', explanation: 'Explaining concepts to me', drafting: 'Writing parts of the text', other: 'Other' };

export const FootprintForm: React.FC<{ value: Footprint; onChange: (f: Footprint) => void; helpTypes: string[] }> = ({ value, onChange, helpTypes }) => {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });
  const ta = (k: string, rows = 2, ph?: string) => <textarea rows={rows} className={inputCls} value={value[k] || ''} placeholder={ph} onChange={e => set(k, e.target.value)} />;
  const types: string[] = value.ai_help_types || [];
  return (
    <div className="space-y-5">
      <p className="text-xs text-[#66675F] leading-relaxed bg-[#F7F3EA] border border-[#DDD3C2] rounded p-3">
        Everything here is <strong>optional</strong>. It helps your teacher understand how you worked. It is used as supporting context and is not treated as proof either way. Saying you used AI will <strong>never</strong> count against you. Drafts you paste here are compared with your final text as evidence of your writing process.
      </p>
      {FOOTPRINT_QUESTIONS.map(([k, label, ph]) => k === 'used_ai' ? (
        <Field key={k} label={label}>
          <div className="flex flex-wrap gap-2">{[['yes', 'Yes'], ['no', 'No'], ['prefer_not', 'Prefer not to say']].map(([v, l]) => (
            <button type="button" key={v} onClick={() => set('used_ai', value.used_ai === v ? '' : v)} className={`px-3 py-1.5 rounded border text-sm cursor-pointer ${value.used_ai === v ? 'bg-[#243B32] text-[#FFFDF8] border-[#243B32]' : 'border-[#DDD3C2] text-[#66675F] bg-[#FFFDF8]'}`}>{l}</button>))}</div>
          {value.used_ai === 'yes' && (
            <div className="pt-2 space-y-1.5"><span className="text-[11px] text-[#66675F]">What kind of help? (select all that apply)</span>
              <div className="flex flex-wrap gap-1.5">{helpTypes.map(h => (
                <button type="button" key={h} onClick={() => set('ai_help_types', types.includes(h) ? types.filter(x => x !== h) : [...types, h])}
                  className={`px-2.5 py-1 rounded-full text-xs border cursor-pointer ${types.includes(h) ? 'bg-[#B49A61] text-[#FFFDF8] border-[#B49A61]' : 'border-[#DDD3C2] text-[#66675F]'}`}>{HELP_LABEL[h] || h}</button>))}</div>
            </div>)}
        </Field>
      ) : (k === 'ai_tools' || k === 'ai_help_detail') && value.used_ai !== 'yes' ? null : <Field key={k} label={label}>{ta(k, 2, ph)}</Field>)}
      <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-[#DDD3C2]">
        <Field label="Short reflection">{ta('reflection', 3)}</Field>
        <Field label="References & sources">{ta('references_list', 3, 'Books, websites, people you interviewed…')}</Field>
        <Field label="Research notes">{ta('research_notes', 3)}</Field>
        <Field label="Revision history (optional)" hint="What changed between drafts and why.">{ta('revision_history', 3)}</Field>
      </div>
      <Field label="Earlier drafts (optional)" hint="Paste one or more earlier drafts. Matching phrasing counts as evidence of your own writing process.">{ta('drafts', 5)}</Field>
    </div>
  );
};
