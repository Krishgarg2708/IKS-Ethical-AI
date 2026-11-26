import React, { useEffect, useState } from 'react';
import { LineChart as LineIcon, Sprout } from 'lucide-react';
import { api, fmtDate, type JourneyItem, type User } from '../api';
import { Alert, Card, Eyebrow, Legend, Pill, ReviewPill, Spinner, StackBar, TrendChart } from '../ui';
import type { Nav } from '../SwaLekhan';

export const LearningJourney: React.FC<{ user: User; nav: Nav; studentId?: number }> = ({ user, nav, studentId }) => {
  const [items, setItems] = useState<JourneyItem[] | null>(null); const [who, setWho] = useState<string>(''); const [err, setErr] = useState('');
  useEffect(() => {
    if (studentId) api.studentJourney(studentId).then(r => { setItems(r.journey); setWho(`${r.student.name} (${r.student.studentCode}, ${r.student.classLevel})`); }).catch(e => setErr(e.message));
    else api.journey().then(r => setItems(r.journey)).catch(e => setErr(e.message));
  }, [studentId]);
  if (err) return <Alert>{err}</Alert>;
  if (!items) return <Spinner />;

  const an = items.filter(i => i.analysed);
  const first = an[0], last = an[an.length - 1];
  const delta = (k: 'independentPct' | 'aiPct') => (first && last && an.length > 1 ? (last[k]! - first[k]!) : null);
  const reflections = items.filter(i => i.reflectionAnswered > 0).length;
  const disclosed = items.filter(i => i.aiDisclosed === 'yes').length;

  return (
    <div className="space-y-8">
      <div className="space-y-1"><Eyebrow>Learning Journey Tracker · अधिगम यात्रा</Eyebrow>
        <h1 className="font-serif text-4xl font-bold text-[#243B32]">{studentId ? 'Student learning journey' : 'My learning journey'}</h1>
        <p className="text-sm text-[#66675F]">{studentId ? `${who}. Only assignments in subjects you are authorised to review are shown.` : 'How your writing and your responsible use of AI are developing over time.'}</p></div>

      {!items.length ? <Card className="p-10 text-center text-sm text-[#66675F]">No assignments yet. Your journey starts with your first submission.</Card> : (<>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[['Assignments', items.length, `${an.length} analysed`],
            ['Independent indicators', last ? `${last.independentPct}%` : '–', delta('independentPct') === null ? 'latest' : `${delta('independentPct')! >= 0 ? '+' : ''}${delta('independentPct')} pts since first`],
            ['Reflections written', reflections, `of ${items.length} assignments`],
            ['Honest AI disclosures', disclosed, 'disclosure is always welcome']].map(([l, v, s]) => (
            <Card key={l as string} className="p-5"><div className="text-[10px] uppercase tracking-wider text-[#66675F]">{l}</div><div className="font-serif text-3xl font-bold text-[#243B32]">{v}</div><div className="text-xs text-[#66675F]">{s}</div></Card>))}
        </div>

        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4"><div className="flex items-center gap-2"><LineIcon className="w-5 h-5 text-[#A6533C]" /><h2 className="font-serif text-2xl font-bold text-[#243B32]">Contribution indicators over time</h2></div><Legend /></div>
          <TrendChart items={items} />
          <div className="mt-4 flex gap-2 text-xs text-[#66675F] bg-[#F7F3EA] rounded p-3"><Sprout className="w-4 h-4 text-[#243B32] shrink-0" />
            More AI assistance does not mean less learning. Using AI openly for grammar, translation or explanations can be responsible. What matters is that the ideas and the understanding stay yours. Read these lines alongside the reflections, not on their own.</div>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-[#243B32] mb-4">Writing development & assignment history</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm min-w-[640px]">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-[#66675F] border-b border-[#DDD3C2]"><th className="py-2 pr-3">Date</th><th className="pr-3">Assignment</th><th className="pr-3">Words</th><th className="pr-3">Avg sentence</th><th className="pr-3 w-40">Contribution</th><th className="pr-3">Reflection</th><th>Review</th></tr></thead>
            <tbody>{[...items].reverse().map(j => (
              <tr key={j.id} onClick={() => nav({ view: 'report', id: j.id })} className="border-b border-[#E8DDCA] hover:bg-[#F7F3EA] cursor-pointer">
                <td className="py-3 pr-3 whitespace-nowrap text-[#66675F]">{fmtDate(j.createdAt)}</td>
                <td className="pr-3"><div className="font-semibold text-[#243B32]">{j.title}</div><div className="text-xs text-[#66675F]">{j.subject}</div></td>
                <td className="pr-3">{j.wordCount}</td><td className="pr-3">{j.avgSentenceLength ?? '–'} words</td>
                <td className="pr-3">{j.analysed ? <><StackBar independent={j.independentPct!} ai={j.aiPct!} uncertain={j.uncertainPct!} /><div className="text-[10px] text-[#66675F] mt-1">{j.independentPct}/{j.aiPct}/{j.uncertainPct}</div></> : <span className="text-xs text-[#A6533C]">not analysed</span>}</td>
                <td className="pr-3 text-xs">{j.reflectionAnswered}/8{j.aiDisclosed === 'yes' && <div><Pill tone="gold">AI disclosed</Pill></div>}</td>
                <td><ReviewPill status={j.reviewStatus} /></td>
              </tr>))}</tbody>
          </table></div>
        </Card>
      </>)}
    </div>
  );
};
