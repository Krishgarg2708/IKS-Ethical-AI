import React, { useCallback, useEffect, useState } from 'react';
import { Download, Printer, RefreshCw, Trash2, ChevronDown, Scale, Footprints, MessageSquare, UserCheck, History, ShieldAlert, Info, LineChart, Pencil, Send } from 'lucide-react';
import { api, isLocalMode, fmtDateTime, type Bundle, type Meta, type User, type Paragraph, type Footprint } from '../api';
import { Alert, Btn, Card, CAT_META, Donut, Eyebrow, Field, inputCls, Legend, Pill, ReviewPill, Spinner, StackBar, SwaLekhanMark, COLORS } from '../ui';
import { FootprintForm, FOOTPRINT_QUESTIONS } from './FootprintForm';
import type { Nav } from '../SwaLekhan';

const pct = (x: number) => `${Math.round(x * 100)}%`;
const SectionTitle: React.FC<{ icon: any; eyebrow: string; title: string; right?: React.ReactNode }> = ({ icon: Icon, eyebrow, title, right }) => (
  <div className="flex items-end justify-between gap-3 flex-wrap mb-4">
    <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-[#A6533C]" /><div><Eyebrow>{eyebrow}</Eyebrow><h2 className="font-serif text-2xl font-bold text-[#243B32]">{title}</h2></div></div>{right}
  </div>
);

export const ReportView: React.FC<{ id: number; user: User; meta: Meta; nav: Nav }> = ({ id, user, meta, nav }) => {
  const [b, setB] = useState<Bundle | null>(null); const [err, setErr] = useState(''); const [reportId, setReportId] = useState<number | undefined>();
  const [busy, setBusy] = useState(''); const [actionErr, setActionErr] = useState(''); const [notice, setNotice] = useState('');
  const load = useCallback(() => { api.get(id, reportId).then(setB).catch(e => setErr(e.message)); }, [id, reportId]);
  useEffect(() => { load(); }, [load]);

  const act = async (key: string, fn: () => Promise<any>, ok?: string) => {
    setBusy(key); setActionErr(''); setNotice('');
    try { await fn(); if (ok) setNotice(ok); setReportId(undefined); await api.get(id).then(setB); }
    catch (e: any) { setActionErr(e.message); } finally { setBusy(''); }
  };

  if (err) return <Alert>{err}</Alert>;
  if (!b) return <Spinner label="Loading report…" />;
  const { assignment: a, report: r } = b;
  const isTeacher = user.role === 'teacher';
  const latest = b.reportHistory[0]?.id;
  const cur = b.currentAssessment;

  return (
    <div className="space-y-8 swl-report">
      {/* Print-only branding header */}
      <div className="hidden print:flex items-center gap-3 border-b-2 border-[#243B32] pb-3"><SwaLekhanMark size={36} /><div><div className="text-[10px] uppercase tracking-widest text-[#A6533C]">Gram to Graph · IKS & Ethical AI</div><div className="font-serif text-2xl font-bold text-[#243B32]">SwaLekhan AI Contribution Report</div></div></div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <Eyebrow>SwaLekhan report · #{a.id}</Eyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#243B32] break-words">{a.title}</h1>
          <div className="text-sm text-[#66675F]">{a.studentName} ({a.studentCode}) · {a.classLevel} · {a.subject} · submitted {fmtDateTime(a.createdAt)}</div>
          <div className="text-xs text-[#66675F]">{a.file ? `${a.file.fileName} · ${a.sourceType.toUpperCase()}${a.file.pages ? ` · ${a.file.pages} pages` : ''}` : 'Pasted text'}{a.description && ` · ${a.description}`}</div>
          <div className="flex gap-1.5 pt-1"><ReviewPill status={a.reviewStatus} />{cur?.source === 'teacher' && <Pill tone="green">Teacher verified</Pill>}{r && <Pill>{r.method === 'hybrid' ? 'Heuristic + LLM review' : 'Heuristic engine'}</Pill>}</div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          {r && !isLocalMode() && <a href={api.pdfUrl(a.id, r.id)} className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded bg-[#243B32] text-[#FFFDF8] hover:bg-[#1a2b25]"><Download className="w-4 h-4" />PDF report</a>}
          {r && <Btn variant="ghost" onClick={() => window.print()}><Printer className="w-4 h-4" />Print</Btn>}
          <Btn variant="ghost" busy={busy === 're'} onClick={() => act('re', () => api.reanalyse(a.id), 'A new analysis version was created.')}><RefreshCw className="w-4 h-4" />{r ? 'Re-analyse' : 'Retry analysis'}</Btn>
          {!isTeacher && <Btn variant="danger" busy={busy === 'del'} onClick={async () => {
            if (!window.confirm('Permanently delete this assignment, all its reports, footprint and feedback? This cannot be undone.')) return;
            setBusy('del'); try { await api.remove(a.id); nav({ view: 'home' }); } catch (e: any) { setActionErr(e.message); setBusy(''); }
          }}><Trash2 className="w-4 h-4" />Delete</Btn>}
        </div>
      </div>

      {actionErr && <Alert>{actionErr}</Alert>}
      {notice && <Alert tone="info">{notice}</Alert>}
      {b.reportHistory.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 text-xs print:hidden"><History className="w-4 h-4 text-[#B49A61]" /><span className="text-[#66675F]">Report history:</span>
          {b.reportHistory.map((h, i) => <button key={h.id} onClick={() => setReportId(h.id)} className={`px-2.5 py-1 rounded-full border cursor-pointer ${r?.id === h.id ? 'bg-[#243B32] text-[#FFFDF8] border-[#243B32]' : 'border-[#DDD3C2] text-[#66675F]'}`}>v{b.reportHistory.length - i} · {fmtDateTime(h.createdAt)}</button>)}
          {r && r.id !== latest && <span className="text-[#A6533C]">Viewing an older version.</span>}
        </div>)}

      {!r ? (
        <Alert>No report exists for this assignment because the analysis did not complete{a.analysisError ? `: ${a.analysisError}` : '.'} SwaLekhan never shows results for a failed analysis. Use “Retry analysis” above.</Alert>
      ) : (<>
        {/* ── SwaLekhan Score ── */}
        <Card className="p-6 sm:p-8">
          <SectionTitle icon={SwaLekhanMark} eyebrow="SwaLekhan Score" title="Estimated content contribution" right={<Legend />} />
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <Donut independent={r.independentPct} ai={r.aiPct} uncertain={r.uncertainPct} size={220}
                center={<><span className="text-[10px] uppercase tracking-wider text-[#66675F]">confidence</span><span className="font-serif text-3xl font-bold text-[#243B32]">{r.confidenceLabel}</span><span className="text-xs text-[#66675F]">{pct(r.confidence)}</span></>} />
            </div>
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {([['Independent', r.independentPct, COLORS.independent], ['AI-assisted', r.aiPct, COLORS.ai], ['Uncertain', r.uncertainPct, COLORS.uncertain]] as const).map(([l, v, c]) => (
                  <div key={l} className="rounded-lg border border-[#DDD3C2] bg-[#F7F3EA]/60 p-4 relative overflow-hidden">
                    <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: c }} />
                    <div className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: c === COLORS.uncertain ? '#66675F' : c }}>{v}%</div>
                    <div className="text-[11px] uppercase tracking-wider text-[#66675F]">{l}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#EFE8DA]"><div className="h-full rounded-full" style={{ width: `${v}%`, background: c, transition: 'width .9s' }} /></div>
                  </div>))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {[['Total words', r.wordCount], ['Paragraphs analysed', r.paragraphCount], ['Fairness notes', r.fairness.warnings.length], ['Analysed', fmtDateTime(r.createdAt)]].map(([k, v]) => (
                  <div key={k as string}><div className="text-[10px] uppercase tracking-wider text-[#66675F]">{k}</div><div className="font-semibold text-[#243B32]">{v}</div></div>))}
              </div>
              <p className="text-sm leading-relaxed text-[#282923]">{r.summary}</p>
              {cur?.source === 'teacher' && (
                <div className="rounded-lg border border-[#243B32]/30 bg-[#243B32]/5 p-4 text-sm space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-[#243B32]"><UserCheck className="w-4 h-4" />Teacher-verified assessment: {meta.verdicts[cur.verdict!]}</div>
                  <StackBar independent={cur.independentPct} ai={cur.aiPct} uncertain={cur.uncertainPct} />
                  <div className="text-xs text-[#66675F]">{cur.independentPct}% independent · {cur.aiPct}% AI-assisted · {cur.uncertainPct}% uncertain, by {cur.teacherName} on {fmtDateTime(cur.at!)}. Reason: “{cur.reason}”</div>
                </div>)}
              <div className="text-[11px] text-[#66675F] flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>This is an estimate of writing <em>indicators</em>, not a measure of intelligence or honesty, and not a cheating score. It never changes a grade automatically.</span></div>
            </div>
          </div>
        </Card>

        {/* ── Nyaya ── */}
        <Card className="p-6 sm:p-8">
          <SectionTitle icon={Scale} eyebrow="Nyaya Fairness Check · न्याय" title={r.fairness.warnings.length ? `${r.fairness.warnings.length} fairness note${r.fairness.warnings.length > 1 ? 's' : ''}` : 'No fairness concerns detected'}
            right={r.fairness.teacherReviewRecommended ? <Pill tone="terra"><ShieldAlert className="w-3 h-3" />Teacher reading recommended</Pill> : undefined} />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {!r.fairness.warnings.length && <p className="text-sm text-[#66675F]">No language, length or disclosure conditions that are known to make indicators unreliable were found. Confidence was not reduced.</p>}
              {r.fairness.warnings.map(w => (
                <div key={w.code} className={`border-l-4 rounded-r-lg p-3.5 ${w.severity === 'important' ? 'border-[#A6533C] bg-[#A6533C]/5' : w.severity === 'caution' ? 'border-[#B49A61] bg-[#B49A61]/10' : 'border-[#243B32]/40 bg-[#243B32]/5'}`}>
                  <div className="text-sm font-semibold text-[#282923]">{w.title}</div><div className="text-xs text-[#66675F] leading-relaxed mt-0.5">{w.detail}</div>
                </div>))}
              {r.fairness.adjustmentsApplied.length > 0 && <div className="text-xs text-[#243B32]"><b>Adjustments applied:</b> {r.fairness.adjustmentsApplied.join(' ')} These can only increase “uncertain”. They never increase the AI estimate.</div>}
            </div>
            <div className="bg-[#F7F3EA] rounded-lg p-4 border border-[#DDD3C2]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#243B32] mb-2">SwaLekhan never treats these as evidence</div>
              <ul className="space-y-1.5 text-xs text-[#66675F]">{r.fairness.excludedSignals.map(s => <li key={s} className="flex gap-2"><span className="text-[#B49A61]">✕</span>{s}</li>)}</ul>
            </div>
          </div>
        </Card>

        {/* ── Paragraphs ── */}
        <Card className="p-6 sm:p-8">
          <SectionTitle icon={Pencil} eyebrow="Paragraph-level analysis" title="Read it paragraph by paragraph" right={<span className="text-xs text-[#66675F]">Click a paragraph to see its reasoning</span>} />
          <div className="space-y-3">{r.paragraphs.map(p => <ParagraphCard key={p.idx} p={p} />)}</div>
        </Card>
      </>)}

      {/* ── Thinking Footprint ── */}
      <FootprintSection b={b} user={user} meta={meta} onSaved={(msg) => act('fp', async () => {}, msg)} />

      {/* ── Process evidence & journey ── */}
      {r && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <SectionTitle icon={Footprints} eyebrow="Writing-process evidence" title="How the work was made" />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[['Drafts supplied', r.processEvidence.draftsProvided ? `Yes · ${pct(r.processEvidence.draftOverlapAvg)} avg. overlap` : 'No'],
                ['Revision history', r.processEvidence.revisionHistoryProvided ? 'Provided' : 'Not provided'],
                ['Reflection questions', `${r.processEvidence.reflectionAnswered} of 8 answered`],
                ['AI use disclosed', ({ yes: 'Yes', no: 'No', prefer_not: 'Prefers not to say', not_given: 'Not answered' } as any)[r.processEvidence.disclosure]],
                ['Help types', r.processEvidence.helpTypes.join(', ') || '—'], ['References', r.processEvidence.referencesProvided ? 'Provided' : 'Not provided']].map(([k, v]) => (
                <div key={k}><dt className="text-[10px] uppercase tracking-wider text-[#66675F]">{k}</dt><dd className="font-semibold text-[#243B32] capitalize">{v}</dd></div>))}
            </dl>
          </Card>
          <Card className="p-6">
            <SectionTitle icon={LineChart} eyebrow="Learning Journey" title={`${b.journey.length} assignment${b.journey.length === 1 ? '' : 's'} on record`} />
            <div className="space-y-2">{b.journey.slice(-5).map(j => (
              <div key={j.id} className={`text-xs ${j.id === a.id ? 'font-semibold' : ''}`}><div className="flex justify-between gap-2"><span className="truncate">{j.title}</span><span className="text-[#66675F] shrink-0">{j.analysed ? `${j.independentPct}/${j.aiPct}/${j.uncertainPct}` : 'not analysed'}</span></div>
                {j.analysed && <StackBar independent={j.independentPct!} ai={j.aiPct!} uncertain={j.uncertainPct!} h="h-1.5" />}</div>))}</div>
            <button className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#A6533C] cursor-pointer print:hidden" onClick={() => nav(isTeacher ? { view: 'student', id: a.studentId } : { view: 'journey' })}>Open full journey →</button>
          </Card>
        </div>)}

      {/* ── Conversation & teacher review ── */}
      <Conversation b={b} user={user} busy={busy} act={act} />
      {isTeacher && r && <TeacherReviewPanel b={b} meta={meta} busy={busy} act={act} />}
      {b.reviews.length > 0 && (
        <Card className="p-6">
          <SectionTitle icon={History} eyebrow="Audit trail" title="Teacher review history" />
          <div className="space-y-3 text-sm">{b.reviews.map(rv => (
            <div key={rv.id} className="border-l-2 border-[#B49A61] pl-3">
              <div className="font-semibold text-[#243B32]">{rv.action === 'override' ? 'Assessment updated' : 'Marked as reviewed'} · {rv.teacherName} · <span className="font-normal text-[#66675F]">{fmtDateTime(rv.createdAt)}</span></div>
              {rv.action === 'override' && <div className="text-xs text-[#66675F]">Previous ({rv.previous_assessment?.source}): {rv.previous_assessment?.independentPct}/{rv.previous_assessment?.aiPct}/{rv.previous_assessment?.uncertainPct} → Updated: {meta.verdicts[rv.updated_assessment?.verdict]} · {rv.updated_assessment?.independentPct}/{rv.updated_assessment?.aiPct}/{rv.updated_assessment?.uncertainPct}</div>}
              {rv.reason && <div className="text-xs italic">“{rv.reason}”</div>}
            </div>))}</div>
        </Card>)}

      {r && (
        <Card className="p-6 bg-[#F7F3EA]">
          <SectionTitle icon={Info} eyebrow="Please read" title="Important limitations & disclaimer" />
          <ul className="space-y-2 text-sm text-[#282923]">{r.limitations.map(l => <li key={l} className="flex gap-2"><span className="text-[#A6533C]">•</span>{l}</li>)}</ul>
          <p className="mt-4 text-xs text-[#66675F]">Engine {r.engineVersion}. Automated analysis cannot establish exact authorship.</p>
        </Card>)}
    </div>
  );
};

const ParagraphCard: React.FC<{ p: Paragraph }> = ({ p }) => {
  const [open, setOpen] = useState(false);
  const m = CAT_META[p.category];
  return (
    <div className={`border border-[#DDD3C2] border-l-4 ${m.border} rounded-lg overflow-hidden`}>
      <button onClick={() => setOpen(!open)} className={`w-full text-left p-4 ${m.bg} cursor-pointer`} aria-expanded={open}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2"><span className="font-serif text-lg font-bold text-[#243B32]">¶ {p.idx}</span><span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: m.color }}>{m.label}</span></div>
          <div className="flex items-center gap-3 text-[11px] text-[#66675F]"><span>AI-assist {pct(p.aiLikelihood)}</span><span>Independent {pct(p.independentLikelihood)}</span><span>Confidence {pct(p.confidence)}</span><ChevronDown className={`w-4 h-4 transition-transform print:hidden ${open ? 'rotate-180' : ''}`} /></div>
        </div>
        <p className={`font-serif text-[15px] leading-relaxed text-[#282923] ${open ? '' : 'line-clamp-3 print:line-clamp-none'}`}>{p.text}</p>
      </button>
      {open && (
        <div className="p-4 bg-[#FFFDF8] border-t border-[#DDD3C2] space-y-3">
          <div className="text-[10px] uppercase tracking-wider text-[#66675F] font-semibold">Indicators detected ({p.wordCount} words)</div>
          <div className="grid md:grid-cols-2 gap-2">{p.indicators.map((i, k) => (
            <div key={k} className="text-xs rounded border border-[#E8DDCA] p-2.5">
              <div className="flex justify-between gap-2 font-semibold"><span style={{ color: i.direction === 'ai' ? '#8C7440' : i.direction === 'independent' ? '#243B32' : '#66675F' }}>{i.direction === 'ai' ? '◆' : i.direction === 'independent' ? '●' : '○'} {i.signal}</span>{i.direction !== 'neutral' && <span className="text-[#66675F] font-normal">strength {pct(i.strength)}</span>}</div>
              <div className="text-[#66675F] mt-1 leading-relaxed">{i.explanation}</div>
            </div>))}</div>
          {p.assistanceHint && <div className="text-xs text-[#243B32] bg-[#E8DDCA]/50 rounded p-2.5"><b>Assistance vs generation:</b> {p.assistanceHint}</div>}
          <div className="text-[11px] text-[#66675F] italic">These are indicators, not an authorship label.</div>
        </div>)}
    </div>
  );
};

const FootprintSection: React.FC<{ b: Bundle; user: User; meta: Meta; onSaved: (m: string) => void }> = ({ b, user, meta, onSaved }) => {
  const [edit, setEdit] = useState(false); const [fp, setFp] = useState<Footprint>(b.footprint || {}); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  useEffect(() => setFp(b.footprint || {}), [b.footprint]);
  const own = user.role === 'student';
  const f = b.footprint;
  const answered = f ? FOOTPRINT_QUESTIONS.filter(([k]) => f[k]) : [];
  const save = async () => { setBusy(true); setErr(''); try { await api.saveFootprint(b.assignment.id, fp); setEdit(false); onSaved('Thinking Footprint saved and the analysis was refreshed with your writing-process evidence.'); } catch (e: any) { setErr(e.message); } finally { setBusy(false); } };
  return (
    <Card className="p-6 sm:p-8">
      <SectionTitle icon={Footprints} eyebrow="My Thinking Footprint · चिन्तन पदचिह्न" title={own ? 'The story behind your work' : 'The student’s account of their process'}
        right={own && !edit ? <Btn variant="ghost" onClick={() => setEdit(true)} className="print:hidden"><Pencil className="w-3.5 h-3.5" />{answered.length ? 'Edit' : 'Add footprint'}</Btn> : undefined} />
      {edit ? (
        <div className="space-y-4"><FootprintForm value={fp} onChange={setFp} helpTypes={meta.aiHelpTypes} />{err && <Alert>{err}</Alert>}
          <div className="flex justify-end gap-2"><Btn variant="ghost" onClick={() => setEdit(false)}>Cancel</Btn><Btn busy={busy} onClick={save}>Save & refresh analysis</Btn></div></div>
      ) : !f || (!answered.length && !f.reflection && !f.drafts) ? (
        <p className="text-sm text-[#66675F]">{own ? 'You have not added a Thinking Footprint yet. It is optional, but it gives your teacher valuable context.' : 'The student did not provide a Thinking Footprint. That is optional and is not a negative signal.'}</p>
      ) : (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {answered.map(([k, l]) => (
              <div key={k}><div className="text-xs font-semibold text-[#243B32]">{l}</div>
                <div className="text-sm text-[#282923] whitespace-pre-wrap">{k === 'used_ai' ? ({ yes: 'Yes', no: 'No', prefer_not: 'Prefers not to say' } as any)[f[k]] + (f.ai_help_types?.length ? ` (${f.ai_help_types.join(', ')})` : '') : f[k]}</div></div>))}
            {(['reflection', 'references_list', 'research_notes', 'revision_history'] as const).filter(k => f[k]).map(k => (
              <div key={k}><div className="text-xs font-semibold text-[#243B32] capitalize">{k.replace('_list', 's').replace('_', ' ')}</div><div className="text-sm whitespace-pre-wrap">{f[k]}</div></div>))}
          </div>
          {f.drafts && <details className="text-sm"><summary className="cursor-pointer text-xs font-semibold text-[#A6533C]">Supplied drafts ({String(f.drafts).split(/\s+/).length} words)</summary><div className="mt-2 whitespace-pre-wrap font-serif bg-[#F7F3EA] p-3 rounded">{f.drafts}</div></details>}
          <p className="text-[11px] text-[#66675F] italic">Self-reported. This is supporting context for a fair conversation, not proof of authorship either way.</p>
        </div>)}
    </Card>
  );
};

const Conversation: React.FC<{ b: Bundle; user: User; busy: string; act: (k: string, fn: () => Promise<any>, ok?: string) => void }> = ({ b, user, busy, act }) => {
  const [msg, setMsg] = useState(''); const [kind, setKind] = useState('feedback');
  const isT = user.role === 'teacher';
  return (
    <Card className="p-6 sm:p-8">
      <SectionTitle icon={MessageSquare} eyebrow="Feedback & clarification" title="Teacher observations" />
      <div className="space-y-3 mb-5">
        {!b.feedback.length && <p className="text-sm text-[#66675F]">No feedback yet.</p>}
        {b.feedback.map(f => (
          <div key={f.id} className={`max-w-[85%] rounded-lg p-3 text-sm ${f.authorRole === 'teacher' ? 'bg-[#243B32]/5 border border-[#243B32]/15' : 'ml-auto bg-[#E8DDCA]/50 border border-[#DDD3C2]'}`}>
            <div className="text-[10px] uppercase tracking-wider text-[#66675F] mb-1">{f.kind === 'clarification_request' ? 'Clarification requested' : f.kind === 'student_response' ? 'Student response' : 'Feedback'} · {f.author} · {fmtDateTime(f.createdAt)}</div>
            <div className="whitespace-pre-wrap">{f.message}</div>
          </div>))}
      </div>
      <div className="space-y-2 print:hidden">
        {isT && <div className="flex gap-2 text-xs">{[['feedback', 'Feedback'], ['clarification_request', 'Request clarification']].map(([k, l]) => <button key={k} onClick={() => setKind(k)} className={`px-3 py-1.5 rounded border cursor-pointer ${kind === k ? 'bg-[#243B32] text-[#FFFDF8] border-[#243B32]' : 'border-[#DDD3C2] text-[#66675F]'}`}>{l}</button>)}</div>}
        <textarea rows={3} className={inputCls} value={msg} onChange={e => setMsg(e.target.value)} placeholder={isT ? (kind === 'clarification_request' ? 'e.g. Could you tell me in your own words how you reached the conclusion in paragraph 2?' : 'Your feedback for the student…') : 'Reply to your teacher…'} />
        <div className="flex justify-end"><Btn busy={busy === 'msg'} disabled={!msg.trim()} onClick={() => act('msg', () => api.feedback(b.assignment.id, kind, msg).then(() => setMsg('')), 'Message sent.')}><Send className="w-3.5 h-3.5" />Send</Btn></div>
      </div>
    </Card>
  );
};

const TeacherReviewPanel: React.FC<{ b: Bundle; meta: Meta; busy: string; act: (k: string, fn: () => Promise<any>, ok?: string) => void }> = ({ b, meta, busy, act }) => {
  const cur = b.currentAssessment!;
  const [v, setV] = useState({ verdict: 'inconclusive', independentPct: cur.independentPct, aiPct: cur.aiPct, uncertainPct: cur.uncertainPct });
  const [reason, setReason] = useState(''); const [note, setNote] = useState('');
  const sum = v.independentPct + v.aiPct + v.uncertainPct;
  const num = (k: keyof typeof v) => <input type="number" min={0} max={100} className={inputCls} value={v[k] as number} onChange={e => setV({ ...v, [k]: Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0))) })} />;
  return (
    <Card className="p-6 sm:p-8 border-[#243B32]/40 print:hidden">
      <SectionTitle icon={UserCheck} eyebrow="Teacher review & verification · Dharma" title="Your professional judgement" />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <p className="text-sm text-[#66675F]">After reading the paragraphs, the Thinking Footprint and the fairness notes, you can mark this analysis as reviewed.</p>
          <Field label="Review note (optional)"><textarea rows={3} className={inputCls} value={note} onChange={e => setNote(e.target.value)} /></Field>
          <Btn busy={busy === 'rev'} onClick={() => act('rev', () => api.review(b.assignment.id, { action: 'mark_reviewed', reason: note }).then(() => setNote('')), 'Marked as reviewed.')}>Mark review complete</Btn>
        </div>
        <div className="space-y-3 lg:border-l lg:border-[#DDD3C2] lg:pl-8">
          <div className="text-sm font-semibold text-[#243B32]">Override the automated assessment</div>
          <Field label="Outcome"><select className={inputCls} value={v.verdict} onChange={e => setV({ ...v, verdict: e.target.value })}>{Object.entries(meta.verdicts).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
          <div className="grid grid-cols-3 gap-2"><Field label="Independent %">{num('independentPct')}</Field><Field label="AI-assisted %">{num('aiPct')}</Field><Field label="Uncertain %">{num('uncertainPct')}</Field></div>
          <div className={`text-xs ${sum === 100 ? 'text-[#66675F]' : 'text-[#A6533C] font-semibold'}`}>Total: {sum}% {sum !== 100 && '(must equal 100)'}</div>
          <Field label="Reason for change" required hint="Recorded permanently with your name, the previous and updated assessment, and the time."><textarea rows={3} className={inputCls} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Student explained the argument clearly in person and showed handwritten notes." /></Field>
          <Btn variant="gold" busy={busy === 'ov'} disabled={sum !== 100 || reason.trim().length < 10} onClick={() => act('ov', () => api.review(b.assignment.id, { action: 'override', updated: v, reason }).then(() => setReason('')), 'Assessment updated and logged.')}>Save verified assessment</Btn>
        </div>
      </div>
    </Card>
  );
};
