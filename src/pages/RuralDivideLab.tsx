import React, { useState } from 'react';
import { PageTab } from '../types';
import { CountUp } from '../components/Enhancements';
import { Wifi, WifiOff, Scale, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  setActiveTab: (tab: PageTab) => void;
}

interface Profile {
  id: string;
  name: string;
  setting: string;
  story: string;
  attendance: number;
  exam: number;
  assignments: number;
  lmsActivity: number;
  bandwidth: 'Fibre' | '4G' | 'Patchy 2G/3G';
  device: 'Own laptop' | 'Shared phone';
  powerCutsPerWeek: number;
  caregiving: boolean;
  firstGen: boolean;
  regionalMedium: boolean;
}

const PROFILES: Profile[] = [
  {
    id: 'riya', name: 'Riya M.', setting: 'Metro city, Bengaluru',
    story: 'Hostel resident with campus Wi-Fi and her own laptop.',
    attendance: 88, exam: 72, assignments: 92, lmsActivity: 85,
    bandwidth: 'Fibre', device: 'Own laptop', powerCutsPerWeek: 0,
    caregiving: false, firstGen: false, regionalMedium: false,
  },
  {
    id: 'aarav', name: 'Aarav S.', setting: 'Village near Bahraich, UP',
    story: 'Commutes 2 hours each way and looks after his grandfather in the evenings.',
    attendance: 68, exam: 74, assignments: 62, lmsActivity: 40,
    bandwidth: 'Patchy 2G/3G', device: 'Shared phone', powerCutsPerWeek: 6,
    caregiving: true, firstGen: true, regionalMedium: true,
  },
  {
    id: 'lakshmi', name: 'Lakshmi P.', setting: 'Tribal block, Koraput, Odisha',
    story: 'First in her family at college. Studied in Odia-medium schools up to Class 12.',
    attendance: 74, exam: 78, assignments: 70, lmsActivity: 35,
    bandwidth: 'Patchy 2G/3G', device: 'Shared phone', powerCutsPerWeek: 8,
    caregiving: false, firstGen: true, regionalMedium: true,
  },
  {
    id: 'imran', name: 'Imran K.', setting: 'Tier-2 town, Nashik',
    story: 'Works evening shifts at his family shop. Has 4G but no laptop.',
    attendance: 79, exam: 69, assignments: 75, lmsActivity: 60,
    bandwidth: '4G', device: 'Shared phone', powerCutsPerWeek: 2,
    caregiving: true, firstGen: false, regionalMedium: false,
  },
];


// Synthetic cohort of 120 fictional students (deterministic seed). Exam ability is drawn from the
// SAME distribution for urban and rural students. Only the access conditions differ.
const seeded = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const COHORT: (Profile & { group: 'Urban' | 'Rural' })[] = (() => {
  const rnd = seeded(42);
  return Array.from({ length: 120 }, (_, i) => {
    const rural = i % 2 === 1;
    const exam = Math.round(45 + rnd() * 50);
    const engagement = exam / 100;
    return {
      id: `c${i}`, name: `S${i}`, setting: '', story: '',
      group: rural ? 'Rural' : 'Urban',
      exam,
      attendance: Math.round(50 + engagement * 42 - (rural ? 6 + rnd() * 8 : 0)),
      assignments: Math.round(40 + engagement * 52 - (rural ? 8 + rnd() * 10 : 0)),
      lmsActivity: Math.round(rural ? 20 + rnd() * 30 : 30 + engagement * 55),
      bandwidth: rural ? (rnd() < 0.7 ? 'Patchy 2G/3G' : '4G') : 'Fibre',
      device: rural ? (rnd() < 0.6 ? 'Shared phone' : 'Own laptop') : 'Own laptop',
      powerCutsPerWeek: rural ? Math.round(3 + rnd() * 6) : 0,
      caregiving: rnd() < (rural ? 0.35 : 0.15),
      firstGen: rural && rnd() < 0.5,
      regionalMedium: rural && rnd() < 0.6,
    } as Profile & { group: 'Urban' | 'Rural' };
  });
})();
const FLAG_AT = 60;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// Naive model: treats every signal as equally meaningful for everyone
const naiveRisk = (p: Profile) =>
  clamp(
    35 +
      Math.max(0, 75 - p.attendance) * 1.5 +
      Math.max(0, 70 - p.assignments) * 1.2 +
      Math.max(0, 70 - p.exam) * 0.8 +
      Math.max(0, 60 - p.lmsActivity) * 0.8
  );

// Context-aware model built on the IKS safeguards
const iksRisk = (p: Profile, s: Safeguards) => {
  const constrained = p.bandwidth === 'Patchy 2G/3G' || p.device === 'Shared phone';
  // Nyaya / Pramana: drop proxy signals that measure internet access, not learning
  const lmsWeight = s.dropProxies && constrained ? 0 : 0.8;
  // Samata: adjust expectations for real constraints on attendance and submission
  const attAllowance = s.contextNorms
    ? Math.min(15, p.powerCutsPerWeek * 1 + (p.caregiving ? 5 : 0) + (constrained ? 3 : 0))
    : 0;
  const asgAllowance = s.contextNorms ? (constrained ? 8 : 0) + (p.caregiving ? 4 : 0) : 0;
  // Exam performance is the most direct evidence of learning, so it keeps its weight
  let r =
    35 +
    Math.max(0, 75 - attAllowance - p.attendance) * 1.5 +
    Math.max(0, 70 - asgAllowance - p.assignments) * 1.2 +
    Math.max(0, 70 - p.exam) * 0.8 +
    Math.max(0, 60 - p.lmsActivity) * lmsWeight;
  // Ahimsa: strong exam results protect the student from a deficit label
  if (s.strengthsFirst && p.exam >= 70) r -= 10;
  return clamp(r);
};

interface Safeguards {
  dropProxies: boolean;
  contextNorms: boolean;
  strengthsFirst: boolean;
  humanReview: boolean;
}


// Explainability: how much each signal adds to the naive vs IKS score
const breakdown = (p: Profile, s: Safeguards) => {
  const constrained = p.bandwidth === 'Patchy 2G/3G' || p.device === 'Shared phone';
  const attA = s.contextNorms ? Math.min(15, p.powerCutsPerWeek + (p.caregiving ? 5 : 0) + (constrained ? 3 : 0)) : 0;
  const asgA = s.contextNorms ? (constrained ? 8 : 0) + (p.caregiving ? 4 : 0) : 0;
  return [
    { label: 'Attendance', naive: Math.max(0, 75 - p.attendance) * 1.5, iks: Math.max(0, 75 - attA - p.attendance) * 1.5 },
    { label: 'Assignments', naive: Math.max(0, 70 - p.assignments) * 1.2, iks: Math.max(0, 70 - asgA - p.assignments) * 1.2 },
    { label: 'Exam', naive: Math.max(0, 70 - p.exam) * 0.8, iks: Math.max(0, 70 - p.exam) * 0.8 },
    { label: 'LMS clicks', naive: Math.max(0, 60 - p.lmsActivity) * 0.8, iks: Math.max(0, 60 - p.lmsActivity) * (s.dropProxies && constrained ? 0 : 0.8) },
    { label: 'Strengths credit', naive: 0, iks: s.strengthsFirst && p.exam >= 70 ? -10 : 0 },
  ].map((r) => ({ ...r, naive: Math.round(r.naive), iks: Math.round(r.iks) }));
};

const band = (r: number) => (r >= 75 ? 'High Risk' : r >= 50 ? 'Moderate Risk' : 'Low Risk');
const bandColor = (r: number) =>
  r >= 75 ? 'text-[#A6533C]' : r >= 50 ? 'text-[#B49A61]' : 'text-[#243B32]';

const supportAction = (p: Profile, r: number, s: Safeguards) => {
  if (!s.humanReview) return r >= 75 ? 'Automatic academic warning email' : 'No action';
  const acts: string[] = [];
  if (p.bandwidth === 'Patchy 2G/3G') acts.push('offline study packs and low-data lecture audio');
  if (p.device === 'Shared phone') acts.push('a laptop from the library loan scheme');
  if (p.caregiving) acts.push('flexible deadlines and recorded lectures');
  if (p.regionalMedium) acts.push('bilingual glossaries and peer mentoring');
  if (p.firstGen) acts.push('a faculty mentor for first-generation students');
  return acts.length ? `Mentor meeting that offers ${acts.join(', ')}` : 'Routine check-in';
};

export const RuralDivideLab: React.FC<Props> = ({ setActiveTab }) => {
  const [openWhy, setOpenWhy] = useState<string | null>(null);
  const [s, setS] = useState<Safeguards>({
    dropProxies: false, contextNorms: false, strengthsFirst: false, humanReview: false,
  });
  const toggle = (k: keyof Safeguards) => setS({ ...s, [k]: !s[k] });
  const allOn = Object.values(s).every(Boolean);

  const rows = PROFILES.map((p) => ({ p, naive: naiveRisk(p), iks: iksRisk(p, s) }));
  const gap = (vals: number[]) => Math.max(...vals) - Math.min(...vals);
  const naiveGap = gap(rows.map((r) => r.naive));
  const iksGap = gap(rows.map((r) => r.iks));


  const flagRate = (g: 'Urban' | 'Rural', fn: (p: Profile) => number) => {
    const grp = COHORT.filter((c) => c.group === g);
    return Math.round((grp.filter((c) => fn(c) >= FLAG_AT).length / grp.length) * 100);
  };
  const nU = flagRate('Urban', naiveRisk), nR = flagRate('Rural', naiveRisk);
  const iU = flagRate('Urban', (p) => iksRisk(p, s)), iR = flagRate('Rural', (p) => iksRisk(p, s));
  const ratio = (r: number, u: number) => (u === 0 ? (r === 0 ? '1.00' : '∞') : (r / u).toFixed(2));

  const safeguardList: { k: keyof Safeguards; title: string; principle: string; desc: string }[] = [
    { k: 'dropProxies', title: 'Remove proxy signals', principle: 'Nyaya · Pramana',
      desc: 'LMS clicks measure internet access, not learning. Ignore them for students who have little access.' },
    { k: 'contextNorms', title: 'Adjust for context', principle: 'Samata',
      desc: 'Account for power cuts, caregiving and connectivity when setting attendance and submission thresholds.' },
    { k: 'strengthsFirst', title: 'Strengths first', principle: 'Ahimsa',
      desc: 'Strong exam results protect a student from a deficit label.' },
    { k: 'humanReview', title: 'Mentor review', principle: 'Dharma',
      desc: 'A mentor reviews every flag, and the outcome is support, never automatic punishment.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Focus Niche · Digital Divide</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          The Rural Divide Fairness Lab
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          One AI rule applied to four students in very different situations. An identical formula looks
          neutral but turns unequal access to internet, devices and electricity into unequal judgements.
          Switch on the IKS safeguards one at a time and see how the outcomes change.
        </p>
      </div>

      <div className="p-4 bg-[#E8DDCA]/50 border border-[#DDD3C2] rounded-lg flex items-start gap-3 text-xs leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-[#A6533C] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#243B32]">Educational demonstration:</strong> These profiles are fictional,
          and the scores come from simple, transparent rules written to show ethical trade-offs. They are not a
          validated statistical model.
        </div>
      </div>

      {/* Safeguard toggles */}
      <div className="flex justify-end -mb-6">
        <button
          onClick={() => { const v = !allOn; setS({ dropProxies: v, contextNorms: v, strengthsFirst: v, humanReview: v }); }}
          className="px-4 py-2 text-xs uppercase tracking-wider border border-[#243B32] text-[#243B32] rounded hover:bg-[#E8DDCA]/50 cursor-pointer"
        >
          {allOn ? 'Turn all safeguards off' : 'Turn all safeguards on'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {safeguardList.map((g) => (
          <button
            key={g.k}
            onClick={() => toggle(g.k)}
            className={`text-left p-5 rounded-lg border transition-colors cursor-pointer ${
              s[g.k] ? 'bg-[#243B32] border-[#243B32] text-[#FFFDF8]' : 'bg-[#FFFDF8] border-[#DDD3C2] text-[#282923] hover:border-[#B49A61]'
            }`}
          >
            <div className={`text-xs uppercase tracking-wider font-semibold ${s[g.k] ? 'text-[#E8DDCA]' : 'text-[#A6533C]'}`}>
              {g.principle}
            </div>
            <div className="font-serif text-lg font-bold mt-1">{g.title}</div>
            <p className={`text-xs mt-2 leading-relaxed ${s[g.k] ? 'text-[#E8DDCA]' : 'text-[#66675F]'}`}>{g.desc}</p>
            <div className="text-xs mt-3 font-semibold">{s[g.k] ? 'ON' : 'OFF'}</div>
          </button>
        ))}
      </div>

      {/* Fairness gap summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg">
          <div className="text-xs uppercase tracking-wider text-[#66675F]">Risk gap, naive model</div>
          <div className="font-serif text-4xl font-bold text-[#A6533C]"><CountUp value={naiveGap} /> pts</div>
        </div>
        <div className="p-5 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg">
          <div className="text-xs uppercase tracking-wider text-[#66675F]">Risk gap, with IKS safeguards</div>
          <div className="font-serif text-4xl font-bold text-[#243B32]"><CountUp value={iksGap} /> pts</div>
        </div>
        <div className="p-5 bg-[#E8DDCA]/40 border border-[#DDD3C2] rounded-lg flex items-center gap-3">
          <Scale className="w-8 h-8 text-[#B49A61] shrink-0" />
          <p className="text-xs leading-relaxed">
            The <strong>risk gap</strong> is the difference between the highest and lowest risk score across
            the four students. All four have similar exam results, so a large gap points to the model
            measuring access rather than ability.
          </p>
        </div>
      </div>

      {/* Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map(({ p, naive, iks }) => {
          const constrained = p.bandwidth === 'Patchy 2G/3G';
          return (
            <div key={p.id} className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#243B32]">{p.name}</h3>
                  <div className="text-xs text-[#B49A61] uppercase tracking-wider">{p.setting}</div>
                </div>
                {constrained ? <WifiOff className="w-5 h-5 text-[#A6533C]" /> : <Wifi className="w-5 h-5 text-[#243B32]" />}
              </div>
              <p className="text-sm text-[#66675F]">{p.story}</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[['Attend.', p.attendance], ['Exam', p.exam], ['Assign.', p.assignments], ['LMS', p.lmsActivity]].map(([l, v]) => (
                  <div key={l as string} className="p-2 bg-[#F7F3EA] rounded">
                    <div className="text-[#66675F]">{l}</div>
                    <div className="font-semibold text-[#282923]">{v}%</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-1 border border-[#DDD3C2] rounded">{p.bandwidth}</span>
                <span className="px-2 py-1 border border-[#DDD3C2] rounded">{p.device}</span>
                <span className="px-2 py-1 border border-[#DDD3C2] rounded">{p.powerCutsPerWeek} power cuts/week</span>
                {p.caregiving && <span className="px-2 py-1 border border-[#DDD3C2] rounded">Caregiver</span>}
                {p.firstGen && <span className="px-2 py-1 border border-[#DDD3C2] rounded">First-generation student</span>}
                {p.regionalMedium && <span className="px-2 py-1 border border-[#DDD3C2] rounded">Regional-medium schooling</span>}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#DDD3C2]">
                <div>
                  <div className="text-xs text-[#66675F]">Naive AI</div>
                  <div className={`font-serif text-2xl font-bold ${bandColor(naive)}`}>{naive}</div>
                  <div className={`text-xs font-semibold ${bandColor(naive)}`}>{band(naive)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#66675F]">With IKS safeguards</div>
                  <div className={`font-serif text-2xl font-bold ${bandColor(iks)}`}>{iks}</div>
                  <div className={`text-xs font-semibold ${bandColor(iks)}`}>{band(iks)}</div>
                </div>
              </div>
              <button onClick={() => setOpenWhy(openWhy === p.id ? null : p.id)} className="text-xs text-[#A6533C] hover:text-[#243B32] underline cursor-pointer">
                {openWhy === p.id ? 'Hide' : 'Why this score?'} (explainability)
              </button>
              {openWhy === p.id && (
                <table className="w-full text-xs">
                  <thead><tr className="text-[#66675F] text-left"><th className="py-1">Signal</th><th>Naive adds</th><th>IKS adds</th></tr></thead>
                  <tbody>
                    <tr className="border-t border-[#DDD3C2]"><td className="py-1">Base score</td><td>35</td><td>35</td></tr>
                    {breakdown(p, s).map((b) => (
                      <tr key={b.label} className="border-t border-[#DDD3C2]">
                        <td className="py-1">{b.label}</td>
                        <td>{b.naive > 0 ? `+${b.naive}` : b.naive}</td>
                        <td className={b.iks !== b.naive ? 'font-semibold text-[#243B32]' : ''}>{b.iks > 0 ? `+${b.iks}` : b.iks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="text-xs p-3 bg-[#F7F3EA] rounded flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#243B32] shrink-0" />
                <span><strong>Outcome:</strong> {supportAction(p, iks, s)}</span>
              </div>
            </div>
          );
        })}
      </div>


      {/* Cohort-level fairness audit */}
      <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">Cohort audit · 120 fictional students</div>
          <h2 className="font-serif text-2xl font-bold text-[#243B32]">Does the AI flag rural students more often?</h2>
          <p className="text-sm text-[#66675F] max-w-3xl">
            Urban and rural students in this synthetic cohort have <strong>identically distributed exam ability</strong>.
            Only their internet, devices, power supply and duties at home differ. A fair system should flag both groups
            at roughly the same rate. The bars update live as you toggle the safeguards above.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{ t: 'Naive AI', u: nU, r: nR }, { t: 'With active IKS safeguards', u: iU, r: iR }].map((m) => (
            <div key={m.t} className="space-y-3">
              <div className="font-serif text-lg font-bold text-[#243B32]">{m.t}</div>
              {[['Urban students', m.u, '#243B32'], ['Rural students', m.r, '#A6533C']].map(([l, v, c]) => (
                <div key={l as string} className="space-y-1">
                  <div className="flex justify-between text-xs"><span>{l}</span><span className="font-semibold"><CountUp value={v as number} />% flagged</span></div>
                  <div className="h-3 bg-[#F7F3EA] rounded"><div className="h-3 rounded transition-all duration-500" style={{ width: `${v}%`, background: c as string }} /></div>
                </div>
              ))}
              <div className="text-xs text-[#66675F]">Disparity ratio (rural ÷ urban): <strong className="text-[#282923]">{ratio(m.r, m.u)}×</strong></div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#66675F] border-t border-[#DDD3C2] pt-4">
          A <strong>disparity ratio</strong> close to 1.0 means both groups are flagged at similar rates. Fairness auditors often
          treat a large gap between groups as a warning sign worth investigating. This is the Samata check: an equal rule
          applied to unequal conditions produces unequal outcomes.
        </p>
      </div>

      {allOn && (
        <div className="p-6 bg-[#243B32] text-[#FFFDF8] rounded-lg space-y-2">
          <h3 className="font-serif text-xl font-bold">Sarve Bhavantu Sukhinah: may all be well</h3>
          <p className="text-sm text-[#E8DDCA] leading-relaxed">
            With all four safeguards on, the system stops penalising students for poor connectivity and uses
            its flags to direct support to the students who need it. Treating everyone the same is not fairness.
            Fairness means giving each student what they need to succeed.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setActiveTab('safeguards')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] cursor-pointer"
        >
          See the full safeguard framework <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
