import React, { useEffect, useState } from 'react';
import { Inbox, Clock, CheckCircle2, HelpCircle, Scale, Search, UserCheck } from 'lucide-react';
import { api, fmtDate, type ListItem, type Meta, type User } from '../api';
import { Alert, Card, Donut, Eyebrow, Legend, Pill, ReviewPill, Spinner, StackBar, inputCls } from '../ui';
import type { Nav } from '../SwaLekhan';

type Stats = Awaited<ReturnType<typeof api.stats>>;

export const TeacherDashboard: React.FC<{ user: User; meta: Meta; nav: Nav }> = ({ user, nav }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [items, setItems] = useState<ListItem[] | null>(null);
  const [f, setF] = useState({ q: '', subject: '', title: '', from: '', to: '', review: '' });
  const [err, setErr] = useState('');
  useEffect(() => { api.stats().then(setStats).catch(e => setErr(e.message)); }, []);
  useEffect(() => { const t = setTimeout(() => api.list(f).then(r => setItems(r.assignments)).catch(e => setErr(e.message)), 250); return () => clearTimeout(t); }, [f]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="space-y-8">
      <div className="space-y-1"><Eyebrow>Teacher review & verification</Eyebrow>
        <h1 className="font-serif text-4xl font-bold text-[#243B32]">Welcome, {user.name.replace('[DEMO] ', '')}</h1>
        <p className="text-sm text-[#66675F]">You can review submissions in: {user.subjects?.join(', ') || 'no subjects yet'}. Every estimate here is a starting point for a conversation, not a verdict.</p></div>
      {err && <Alert>{err}</Alert>}

      {!stats ? <Spinner /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {([[Inbox, 'Total submissions', stats.total, ''], [Clock, 'Pending review', stats.pending, 'pending'], [CheckCircle2, 'Reviewed', stats.reviewed, 'reviewed'],
              [HelpCircle, 'Clarification asked', stats.clarification, 'clarification_requested'], [Scale, 'With fairness notes', stats.fairnessFlagged, null]] as const).map(([Icon, l, v, filt]) => (
              <button key={l} disabled={filt === null} onClick={() => filt !== null && setF({ ...f, review: filt })} className={`text-left bg-[#FFFDF8] border rounded-xl p-5 transition-colors ${filt !== null ? 'cursor-pointer hover:border-[#B49A61]' : ''} ${filt !== null && f.review === filt ? 'border-[#243B32]' : 'border-[#DDD3C2]'}`}>
                <Icon className="w-5 h-5 text-[#B49A61] mb-2" /><div className="font-serif text-3xl font-bold text-[#243B32]">{v}</div><div className="text-xs text-[#66675F]">{l}</div>
              </button>))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center gap-3">
              <div className="self-start"><Eyebrow>Contribution overview</Eyebrow><div className="text-xs text-[#66675F]">Average of latest reports{stats.avg ? ` (n = ${stats.avg.n})` : ''}</div></div>
              {stats.avg ? <Donut independent={stats.avg.independentPct} ai={stats.avg.aiPct} uncertain={stats.avg.uncertainPct} size={170}
                center={<><span className="font-serif text-3xl font-bold text-[#243B32]">{stats.avg.independentPct}%</span><span className="text-[10px] uppercase text-[#66675F]">independent</span></>} /> : <div className="text-sm text-[#66675F] py-10">No analysed submissions yet.</div>}
              <Legend />
              <div className="text-[11px] text-[#66675F] text-center"><UserCheck className="w-3.5 h-3.5 inline" /> {stats.overrides} teacher-verified override{stats.overrides === 1 ? '' : 's'} logged</div>
            </Card>
            <Card className="p-6 lg:col-span-2">
              <Eyebrow>Subject-wise statistics</Eyebrow>
              {!stats.bySubject.length ? <div className="text-sm text-[#66675F] py-8">No submissions yet in your subjects.</div> : (
                <div className="space-y-4 mt-4">{stats.bySubject.map(s => (
                  <div key={s.subject}><div className="flex justify-between text-sm mb-1"><span className="font-semibold text-[#243B32]">{s.subject}</span><span className="text-xs text-[#66675F]">{s.count} submission{s.count > 1 && 's'}{s.avgIndependent !== null && ` · avg ${s.avgIndependent}/${s.avgAi}/${s.avgUncertain}`}</span></div>
                    {s.avgIndependent !== null ? <StackBar independent={s.avgIndependent} ai={s.avgAi!} uncertain={100 - s.avgIndependent - s.avgAi!} h="h-2.5" /> : <div className="text-xs text-[#66675F]">not analysed</div>}</div>))}</div>)}
            </Card>
          </div>
        </>)}

      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2"><h2 className="font-serif text-2xl font-bold text-[#243B32]">Submitted assignments</h2>
          {Object.values(f).some(Boolean) && <button onClick={() => setF({ q: '', subject: '', title: '', from: '', to: '', review: '' })} className="text-xs text-[#A6533C] font-semibold uppercase tracking-wider cursor-pointer">Clear filters</button>}</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-1"><Search className="w-4 h-4 absolute left-3 top-3 text-[#A8A79F]" /><input className={inputCls + ' pl-9'} placeholder="Student name or ID" value={f.q} onChange={set('q')} /></div>
          <select className={inputCls} value={f.subject} onChange={set('subject')}><option value="">All my subjects</option>{user.subjects?.map(s => <option key={s}>{s}</option>)}</select>
          <input className={inputCls} placeholder="Assignment title" value={f.title} onChange={set('title')} />
          <input type="date" className={inputCls} value={f.from} onChange={set('from')} aria-label="From date" />
          <input type="date" className={inputCls} value={f.to} onChange={set('to')} aria-label="To date" />
        </div>
        {!items ? <Spinner /> : !items.length ? <div className="text-sm text-[#66675F] py-8 text-center">No submissions match.</div> : (
          <div className="overflow-x-auto"><table className="w-full text-sm min-w-[760px]">
            <thead><tr className="text-left text-[10px] uppercase tracking-wider text-[#66675F] border-b border-[#DDD3C2]"><th className="py-2 pr-3">Student</th><th className="pr-3">Assignment</th><th className="pr-3">Date</th><th className="pr-3 w-44">SwaLekhan estimate</th><th className="pr-3">Notes</th><th>Status</th></tr></thead>
            <tbody>{items.map(a => (
              <tr key={a.id} className="border-b border-[#E8DDCA] hover:bg-[#F7F3EA] cursor-pointer" onClick={() => nav({ view: 'report', id: a.id })}>
                <td className="py-3 pr-3"><button onClick={e => { e.stopPropagation(); nav({ view: 'student', id: a.studentId }); }} className="font-semibold text-[#243B32] hover:underline text-left cursor-pointer">{a.studentName}</button><div className="text-xs text-[#66675F]">{a.studentCode}</div></td>
                <td className="pr-3"><div className="text-[#282923]">{a.title}</div><div className="text-xs text-[#66675F]">{a.subject} · {a.wordCount} words</div></td>
                <td className="pr-3 whitespace-nowrap text-[#66675F]">{fmtDate(a.createdAt)}</td>
                <td className="pr-3">{a.independentPct !== null ? <><StackBar independent={a.independentPct} ai={a.aiPct!} uncertain={a.uncertainPct!} /><div className="text-[10px] text-[#66675F] mt-1">{a.independentPct}% ind · {a.aiPct}% AI · {a.uncertainPct}% unc · {a.confidenceLabel}</div></> : <span className="text-xs text-[#A6533C]">analysis failed</span>}</td>
                <td className="pr-3"><div className="flex flex-wrap gap-1">{a.fairnessWarnings > 0 && <Pill tone={a.reviewRecommended ? 'terra' : 'gold'}>{a.fairnessWarnings} Nyaya</Pill>}{a.teacherVerified && <Pill tone="green">Verified</Pill>}</div></td>
                <td><ReviewPill status={a.reviewStatus} /></td>
              </tr>))}</tbody>
          </table></div>)}
      </Card>
    </div>
  );
};
