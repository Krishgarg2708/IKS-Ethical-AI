import React, { useState } from 'react';
import { PageTab } from '../types';
import { CountUp } from '../components/Enhancements';
import { Wifi, Smartphone, Zap, MapPin, Home as HomeIcon, Languages, ShieldCheck, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';

interface Props {
  setActiveTab: (tab: PageTab) => void;
}

type Bandwidth = 'fibre' | '4g' | 'patchy';
type Device = 'laptop' | 'own-phone' | 'shared-phone';

interface Inputs {
  attendance: number;
  exam: number;
  assignments: number;
  lms: number;
  bandwidth: Bandwidth;
  device: Device;
  powerCuts: number;
  commuteHrs: number;
  caregiving: boolean;
  regionalMedium: boolean;
}

const DEFAULTS: Inputs = {
  attendance: 70, exam: 75, assignments: 64, lms: 38,
  bandwidth: 'patchy', device: 'shared-phone', powerCuts: 5, commuteHrs: 3,
  caregiving: true, regionalMedium: true,
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export const AccessAudit: React.FC<Props> = ({ setActiveTab }) => {
  const [x, setX] = useState<Inputs>(DEFAULTS);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setX({ ...x, [k]: v });

  // Digital Access Index: 100 = full access, 0 = severe constraint
  const dai = clamp(
    100 -
      (x.bandwidth === 'patchy' ? 35 : x.bandwidth === '4g' ? 12 : 0) -
      (x.device === 'shared-phone' ? 25 : x.device === 'own-phone' ? 12 : 0) -
      Math.min(20, x.powerCuts * 2.5) -
      Math.min(12, x.commuteHrs * 3)
  );
  const lowAccess = dai < 60;

  const naive = clamp(
    35 +
      Math.max(0, 75 - x.attendance) * 1.5 +
      Math.max(0, 70 - x.assignments) * 1.2 +
      Math.max(0, 70 - x.exam) * 0.8 +
      Math.max(0, 60 - x.lms) * 0.8
  );

  const attAllow = Math.min(15, x.powerCuts + x.commuteHrs * 1.5 + (x.caregiving ? 5 : 0));
  const asgAllow = Math.min(14, (100 - dai) / 6 + (x.caregiving ? 4 : 0));
  let fair =
    35 +
    Math.max(0, 75 - attAllow - x.attendance) * 1.5 +
    Math.max(0, 70 - asgAllow - x.assignments) * 1.2 +
    Math.max(0, 70 - x.exam) * 0.8 +
    Math.max(0, 60 - x.lms) * (lowAccess ? 0 : 0.8);
  if (x.exam >= 70) fair -= 10;
  fair = clamp(fair);

  const band = (r: number) => (r >= 75 ? 'High Risk' : r >= 50 ? 'Moderate Risk' : 'Low Risk');
  const tone = (r: number) => (r >= 75 ? 'text-[#A6533C]' : r >= 50 ? 'text-[#B49A61]' : 'text-[#243B32]');

  const unreliable: string[] = [];
  if (lowAccess) unreliable.push('LMS clicks and login times. They show how good your internet is, not how much you study.');
  if (x.powerCuts >= 3 || x.bandwidth === 'patchy') unreliable.push('Late-submission timestamps. Uploads fail during power cuts and network drops.');
  if (x.commuteHrs >= 2 || x.caregiving) unreliable.push('Attendance at early-morning lectures. Long commutes and duties at home make these hard to reach.');
  if (x.regionalMedium) unreliable.push('Forum participation in English. A lower count may reflect the language barrier, not lack of interest.');

  const supports: string[] = [];
  if (x.bandwidth !== 'fibre') supports.push('Offline study packs, low-data audio lectures and SMS reminders');
  if (x.device !== 'laptop') supports.push('A laptop loan scheme, and course pages that work well on phones');
  if (x.powerCuts >= 3) supports.push('48-hour grace windows for submissions and the option to submit in batches');
  if (x.commuteHrs >= 2) supports.push('Recorded lectures, and attendance credit for watching them');
  if (x.caregiving) supports.push('Flexible deadlines, plus a confidential counselling check-in');
  if (x.regionalMedium) supports.push('Bilingual glossaries, peer mentors and the option to answer in your mother tongue');
  if (!supports.length) supports.push('Routine mentor check-in only');

  const Slider = ({ k, label }: { k: 'attendance' | 'exam' | 'assignments' | 'lms'; label: string }) => (
    <label className="block space-y-1">
      <div className="flex justify-between text-xs"><span className="text-[#66675F]">{label}</span><span className="font-semibold">{x[k]}%</span></div>
      <input type="range" min={0} max={100} value={x[k]} onChange={(e) => set(k, +e.target.value)} className="w-full accent-[#243B32]" />
    </label>
  );

  const Choice = <T extends string>({ value, opts, onPick }: { value: T; opts: [T, string][]; onPick: (v: T) => void }) => (
    <div className="flex flex-wrap gap-2">
      {opts.map(([v, l]) => (
        <button key={v} onClick={() => onPick(v)}
          className={`px-3 py-1.5 text-xs rounded border cursor-pointer ${value === v ? 'bg-[#243B32] text-[#FFFDF8] border-[#243B32]' : 'bg-[#FFFDF8] border-[#DDD3C2] hover:border-[#B49A61]'}`}>
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          Personal Tool · Access Audit
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">Would the AI judge you fairly?</h1>
        <p className="text-base font-light leading-relaxed">
          Describe a student's situation, or your own. The audit works out a Digital Access Index, shows which
          of the AI's signals can't be trusted for this student, and compares the naive AI verdict with the verdict
          after IKS safeguards. It also lists the support a caring institution would offer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Inputs */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#243B32]">Student situation</h2>
            <button onClick={() => setX(DEFAULTS)} className="text-xs flex items-center gap-1 text-[#66675F] hover:text-[#A6533C] cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-[#A6533C] font-semibold">What the AI sees</div>
            {Slider({ k: "attendance", label: "Attendance" })}
            {Slider({ k: "exam", label: "Exam score" })}
            {Slider({ k: "assignments", label: "Assignments submitted on time" })}
            {Slider({ k: "lms", label: "LMS activity (clicks and logins)" })}
          </div>
          <div className="space-y-4 pt-4 border-t border-[#DDD3C2]">
            <div className="text-xs uppercase tracking-wider text-[#A6533C] font-semibold">What the AI doesn't see</div>
            <div className="space-y-2"><div className="text-xs flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5" /> Internet at home</div>
              {Choice({ value: x.bandwidth, onPick: (v) => set('bandwidth', v), opts: [['fibre', 'Broadband / Wi-Fi'], ['4g', 'Stable 4G'], ['patchy', 'Patchy 2G/3G']] })}</div>
            <div className="space-y-2"><div className="text-xs flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Study device</div>
              {Choice({ value: x.device, onPick: (v) => set('device', v), opts: [['laptop', 'Own laptop'], ['own-phone', 'Own phone'], ['shared-phone', 'Shared family phone']] })}</div>
            <label className="block space-y-1">
              <div className="flex justify-between text-xs"><span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Power cuts per week</span><span className="font-semibold">{x.powerCuts}</span></div>
              <input type="range" min={0} max={10} value={x.powerCuts} onChange={(e) => set('powerCuts', +e.target.value)} className="w-full accent-[#243B32]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between text-xs"><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Daily commute (hours)</span><span className="font-semibold">{x.commuteHrs}</span></div>
              <input type="range" min={0} max={5} value={x.commuteHrs} onChange={(e) => set('commuteHrs', +e.target.value)} className="w-full accent-[#243B32]" />
            </label>
            <div className="flex flex-wrap gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={x.caregiving} onChange={(e) => set('caregiving', e.target.checked)} className="accent-[#243B32]" /><HomeIcon className="w-3.5 h-3.5" /> Family caregiving or work</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={x.regionalMedium} onChange={(e) => set('regionalMedium', e.target.checked)} className="accent-[#243B32]" /><Languages className="w-3.5 h-3.5" /> Regional-medium schooling</label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#243B32] text-[#FFFDF8] rounded-lg p-6">
            <div className="text-xs uppercase tracking-wider text-[#E8DDCA]">Digital Access Index</div>
            <div className="flex items-end gap-3">
              <div className="font-serif text-5xl font-bold"><CountUp value={dai} /></div>
              <div className="text-sm text-[#E8DDCA] pb-2">/ 100 · {dai >= 80 ? 'Full access' : dai >= 60 ? 'Partial access' : 'Severely constrained'}</div>
            </div>
            <div className="w-full h-2 bg-[#FFFDF8]/20 rounded mt-3"><div className="h-2 bg-[#B49A61] rounded transition-all duration-700" style={{ width: `${dai}%` }} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-5">
              <div className="text-xs text-[#66675F]">Naive AI verdict</div>
              <div className={`font-serif text-4xl font-bold ${tone(naive)}`}>{naive}</div>
              <div className={`text-xs font-semibold ${tone(naive)}`}>{band(naive)}</div>
              <p className="text-[11px] text-[#66675F] mt-2">Every signal counts the same for every student.</p>
            </div>
            <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-5">
              <div className="text-xs text-[#66675F]">After IKS safeguards</div>
              <div className={`font-serif text-4xl font-bold ${tone(fair)}`}>{fair}</div>
              <div className={`text-xs font-semibold ${tone(fair)}`}>{band(fair)}</div>
              <p className="text-[11px] text-[#66675F] mt-2">Context adjusts the thresholds, and unreliable proxies are removed.</p>
            </div>
          </div>

          {naive - fair >= 10 && (
            <div className="p-4 border border-[#A6533C]/40 bg-[#A6533C]/5 rounded-lg text-sm flex gap-2">
              <AlertTriangle className="w-4 h-4 text-[#A6533C] shrink-0 mt-0.5" />
              <span>The naive AI scores this student <strong>{naive - fair} points</strong> higher on risk than they should be. Most of that penalty comes from their <em>access conditions</em>, not their learning.</span>
            </div>
          )}

          <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#243B32]">Signals the AI shouldn't trust here (Nyaya · Pramana)</h3>
            {unreliable.length ? (
              <ul className="space-y-2 text-sm list-disc pl-5 text-[#282923]">{unreliable.map((u) => <li key={u}>{u}</li>)}</ul>
            ) : <p className="text-sm text-[#66675F]">All signals are reasonably reliable for this student.</p>}
          </div>

          <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#243B32] flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#243B32]" /> Support to offer (Dharma and Ahimsa)</h3>
            <ul className="space-y-2 text-sm list-disc pl-5">{supports.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="text-xs text-[#66675F] pt-2 border-t border-[#DDD3C2]">A human mentor reviews every flag before anything happens. A flag leads to support, never to an automatic warning.</p>
          </div>

          <button onClick={() => setActiveTab('rural')} className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] cursor-pointer">
            Compare four students in the Fairness Lab <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
