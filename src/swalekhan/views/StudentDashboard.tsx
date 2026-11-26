import React, { useEffect, useState } from 'react';
import { PlusCircle, LineChart, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import { api, fmtDate, type ListItem, type User } from '../api';
import { Alert, Btn, Card, Eyebrow, Legend, Pill, ReviewPill, Spinner, StackBar } from '../ui';
import type { Nav } from '../SwaLekhan';

export const StudentDashboard: React.FC<{ user: User; nav: Nav }> = ({ user, nav }) => {
  const [items, setItems] = useState<ListItem[] | null>(null); const [err, setErr] = useState('');
  useEffect(() => { api.list().then(r => setItems(r.assignments)).catch(e => setErr(e.message)); }, []);
  const clar = items?.filter(i => i.reviewStatus === 'clarification_requested') || [];
  const withFeedback = items?.filter(i => i.feedbackCount > 0) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <Eyebrow>Student dashboard</Eyebrow>
          <h1 className="font-serif text-4xl font-bold text-[#243B32]">Namaste, {user.name.replace('[DEMO] ', '').split(' ')[0]}</h1>
          <p className="text-sm text-[#66675F]">{user.studentCode} · {user.classLevel}. Your voice, your learning, your creation.</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => nav({ view: 'journey' })}><LineChart className="w-4 h-4" />My learning journey</Btn>
          <Btn onClick={() => nav({ view: 'submit' })}><PlusCircle className="w-4 h-4" />Submit new assignment</Btn>
        </div>
      </div>

      {err && <Alert>{err}</Alert>}
      {clar.length > 0 && <Alert tone="warn"><strong>Your teacher asked for clarification</strong> on {clar.map((c, i) => <button key={c.id} onClick={() => nav({ view: 'report', id: c.id })} className="underline cursor-pointer">{(i ? ', ' : '') + c.title}</button>)}. This is a conversation, not an accusation. Open the report to reply.</Alert>}

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          [FileText, 'Assignments submitted', items?.length ?? '–'],
          [MessageSquare, 'With teacher feedback', withFeedback.length],
        ].map(([Icon, l, v]: any) => (
          <Card key={l} className="p-5 flex items-center gap-4"><Icon className="w-6 h-6 text-[#B49A61]" /><div><div className="font-serif text-3xl font-bold text-[#243B32]">{v}</div><div className="text-xs text-[#66675F]">{l}</div></div></Card>))}
        <Card className="p-5 text-xs text-[#66675F] leading-relaxed">Your SwaLekhan Score shows <em>writing indicators</em>. It is not a grade and is never used to grade you automatically. Disclosing AI use is always safe.</Card>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2"><h2 className="font-serif text-2xl font-bold text-[#243B32]">My assignments & SwaLekhan reports</h2><Legend /></div>
        {!items && !err && <Spinner />}
        {items && !items.length && (
          <Card className="p-10 text-center space-y-3">
            <p className="text-sm text-[#66675F]">You have not submitted anything yet.</p>
            <Btn onClick={() => nav({ view: 'submit' })}>Submit your first assignment</Btn>
          </Card>)}
        <div className="grid gap-3">
          {items?.map(a => (
            <button key={a.id} onClick={() => nav({ view: 'report', id: a.id })} className="text-left bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-5 hover:border-[#B49A61] transition-colors cursor-pointer">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-serif text-xl font-bold text-[#243B32] truncate">{a.title}</div>
                  <div className="text-xs text-[#66675F]">{a.subject} · {fmtDate(a.createdAt)} · {a.wordCount} words</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <ReviewPill status={a.reviewStatus} />
                  {a.teacherVerified && <Pill tone="green">Teacher verified</Pill>}
                  {a.fairnessWarnings > 0 && <Pill tone="gold">{a.fairnessWarnings} Nyaya note{a.fairnessWarnings > 1 && 's'}</Pill>}
                  {a.feedbackCount > 0 && <Pill><MessageSquare className="w-3 h-3" />Feedback</Pill>}
                </div>
              </div>
              {a.independentPct !== null ? (
                <div className="mt-4 space-y-1.5">
                  <StackBar independent={a.independentPct} ai={a.aiPct!} uncertain={a.uncertainPct!} />
                  <div className="flex gap-4 text-xs text-[#66675F]"><span><b className="text-[#243B32]">{a.independentPct}%</b> independent</span><span><b className="text-[#8C7440]">{a.aiPct}%</b> AI-assisted</span><span><b>{a.uncertainPct}%</b> uncertain</span><span>· confidence {a.confidenceLabel?.toLowerCase()}</span></div>
                </div>
              ) : <div className="mt-3 text-xs text-[#A6533C] flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />Analysis not completed. Open to retry.</div>}
            </button>))}
        </div>
      </section>
    </div>
  );
};
