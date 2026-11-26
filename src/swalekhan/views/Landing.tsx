import React, { useEffect, useState } from 'react';
import { ArrowRight, Footprints, LineChart, Scale, UserCheck, Gauge, FileSearch, HeartHandshake, Cpu } from 'lucide-react';
import { api, type Meta, type User, type ListItem } from '../api';
import { Alert, Card, Eyebrow, Donut, Legend, StackBar, SwaLekhanMark } from '../ui';
import type { Nav } from '../SwaLekhan';

const MODULES = [
  { icon: Gauge, name: 'SwaLekhan Score', sk: 'स्वलेखन अंक', text: 'A transparent estimate of independent, AI-assisted and uncertain content — never an intelligence, honesty or cheating score, and never a grade.' },
  { icon: Footprints, name: 'My Thinking Footprint', sk: 'चिन्तन पदचिह्न', text: 'Students tell the story behind the work: the original idea, research, how AI helped, and their main argument in their own words.' },
  { icon: LineChart, name: 'Learning Journey', sk: 'अधिगम यात्रा', text: 'Shows how a student’s writing and responsible AI use change across assignments — growth, not surveillance.' },
  { icon: Scale, name: 'Nyaya Fairness Check', sk: 'न्याय परीक्षा', text: 'Protects simple-English, multilingual and translated writing. It can only widen uncertainty — it never raises an AI estimate.' },
];

export const Landing: React.FC<{ user: User | null; meta: Meta | null; offline: string; nav: Nav }> = ({ user, meta, offline, nav }) => {
  const [latest, setLatest] = useState<ListItem | null>(null);
  useEffect(() => { if (user) api.list().then(r => setLatest(r.assignments.find(a => a.independentPct !== null) || null)).catch(() => {}); }, [user]);
  const cta = () => nav(user ? (user.role === 'student' ? { view: 'submit' } : { view: 'home' }) : { view: 'auth' });

  return (
    <div className="space-y-16">
      {offline && <Alert tone="warn">The SwaLekhan server is not reachable ({offline}). You can read about the module, but submissions and reports need the server running.</Alert>}
      <section className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <Eyebrow>Gram to Graph · Original innovation · Ethical AI</Eyebrow>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#243B32] leading-[1.05]">
            SwaLekhan <span className="text-[#B49A61]">AI</span><br />
            <span className="font-normal italic text-[#A6533C] text-4xl sm:text-5xl">स्वलेखन</span>
          </h1>
          <p className="font-serif text-2xl text-[#243B32] italic">Your Voice. Your Learning. Your Creation.</p>
          <p className="text-base text-[#282923] leading-relaxed max-w-2xl font-light">
            <strong className="font-semibold">Swa</strong> (one’s own) + <strong className="font-semibold">Lekhan</strong> (writing). SwaLekhan helps students and teachers understand how much of an assignment shows signs of independent writing and how much shows signs of AI assistance. It does this <em>transparently, fairly and without accusation</em>. Every number comes with its confidence, its reasons and its limits.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={cta} className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] cursor-pointer">
              {user?.role === 'teacher' ? 'Open teacher dashboard' : 'Submit an assignment'} <ArrowRight className="w-4 h-4" />
            </button>
            {!user && <button onClick={() => nav({ view: 'auth' })} className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#243B32] border border-[#243B32] rounded bg-[#FFFDF8] hover:bg-[#E8DDCA]/50 cursor-pointer">Sign in / Register</button>}
          </div>
          {meta && (
            <div className="flex items-start gap-2 text-xs text-[#66675F] max-w-xl">
              <Cpu className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
              <span>{meta.aiServiceConfigured
                ? 'Analysis mode: transparent heuristic engine plus an optional language-model review that runs on the server.'
                : 'Analysis mode: transparent heuristic engine that runs fully on this server. No API key or external AI service is needed.'}</span>
            </div>)}
        </div>

        {/* Contribution analysis preview */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-8 relative">
            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#F7F3EA] border border-[#DDD3C2] text-[10px] uppercase tracking-widest text-[#A6533C] font-semibold">
              {latest ? 'Your latest SwaLekhan Score' : 'How a report reads'}
            </div>
            {latest ? (
              <div className="flex flex-col items-center gap-4">
                <Donut independent={latest.independentPct!} ai={latest.aiPct!} uncertain={latest.uncertainPct!} size={200}
                  center={<><span className="font-serif text-4xl font-bold text-[#243B32]">{latest.independentPct}%</span><span className="text-[10px] uppercase tracking-wider text-[#66675F]">independent</span></>} />
                <div className="text-sm text-center text-[#282923]">{latest.title}</div>
                <Legend />
                <button onClick={() => nav({ view: 'report', id: latest.id })} className="text-xs font-semibold uppercase tracking-wider text-[#A6533C] cursor-pointer">Open report →</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5">
                <Donut independent={0} ai={0} uncertain={0} size={190} center={<SwaLekhanMark size={64} />} />
                <div className="w-full space-y-3 text-xs text-[#66675F]">
                  {[['#243B32', 'Independent-writing indicators', 'personal voice, specifics, draft evidence'], ['#B49A61', 'Possible AI assistance', 'stock phrasing, uniform rhythm'], ['#A8A79F', 'Uncertain', 'where evidence is too weak to say']].map(([c, t, d]) => (
                    <div key={t} className="flex gap-3 items-start"><span className="w-1 h-8 rounded" style={{ background: c }} /><div><div className="font-semibold text-[#282923]">{t}</div>{d}</div></div>))}
                </div>
                <p className="text-[11px] text-[#66675F] text-center">Your real results appear here once you submit an assignment. SwaLekhan never shows sample scores.</p>
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl space-y-2"><Eyebrow>Four interconnected modules</Eyebrow><h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#243B32]">More than a detector, a learning companion</h2></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map(m => (
            <Card key={m.name} className="p-6 space-y-3 hover:border-[#B49A61] transition-colors">
              <m.icon className="w-6 h-6 text-[#A6533C]" />
              <div><h3 className="font-serif text-xl font-bold text-[#243B32]">{m.name}</h3><div className="text-xs text-[#B49A61]">{m.sk}</div></div>
              <p className="text-sm text-[#282923]/85 leading-relaxed">{m.text}</p>
            </Card>))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        {[
          { icon: FileSearch, t: 'Paragraph by paragraph', d: 'Each paragraph gets its own likelihoods, confidence and the reasons behind them. Teachers can open any paragraph and see exactly why.' },
          { icon: UserCheck, t: 'The teacher has the final word', d: 'Dharma (responsibility) stays with people. Teachers review, ask for clarification and can override any estimate. Every override is logged with a reason.' },
          { icon: HeartHandshake, t: 'Ahimsa (non-harm) by design', d: 'No automatic fails, flags or accusations. Disclosing AI use is encouraged and never counts against a student. Students can delete their own submissions.' },
        ].map(x => (
          <div key={x.t} className="flex gap-4 p-5 border-t-2 border-[#B49A61]/50">
            <x.icon className="w-5 h-5 text-[#243B32] shrink-0 mt-1" />
            <div><h3 className="font-serif text-lg font-bold text-[#243B32]">{x.t}</h3><p className="text-sm text-[#66675F] leading-relaxed">{x.d}</p></div>
          </div>))}
      </section>

      <section className="bg-[#243B32] text-[#E8DDCA] rounded-2xl p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <Eyebrow><span className="text-[#B49A61]">Ethical AI commitment</span></Eyebrow>
          <h2 className="font-serif text-3xl font-bold text-[#FFFDF8]">“A lamp shows the path. It does not walk it for you.”</h2>
          <p className="text-sm leading-relaxed text-[#E8DDCA]/85">No software can prove who wrote a text. Generic AI detectors present guesses as verdicts, and research shows they misjudge second-language writers more often. SwaLekhan was built the other way round. Uncertainty is shown openly. Fairness checks run before any number is shown. Signals such as grammar, vocabulary or simple style are never counted as evidence. The student’s own account of how they worked sits beside the analysis.</p>
        </div>
        <div className="space-y-3">
          {[['Generic AI detector', 'One verdict score · hidden reasoning · penalises simple or translated English · invites accusation'], ['SwaLekhan AI', 'Three-way estimate with confidence · reasons for every paragraph · Nyaya fairness guard · student reflection · teacher verification and audit trail']].map(([t, d], i) => (
            <div key={t} className={`rounded-lg p-4 ${i ? 'bg-[#FFFDF8] text-[#282923]' : 'bg-[#1a2b25] text-[#E8DDCA]/80'}`}>
              <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${i ? 'text-[#A6533C]' : 'text-[#B49A61]'}`}>{t}</div><div className="text-sm">{d}</div>
              {i === 1 && <div className="mt-3"><StackBar independent={34} ai={33} uncertain={33} /><div className="text-[10px] text-[#66675F] mt-1">Three colours for three categories. This bar is a colour key, not a result.</div></div>}
            </div>))}
        </div>
      </section>
    </div>
  );
};
