// SwaLekhan shared UI primitives & hand-built SVG charts (no chart library needed).
import React from 'react';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import type { Category, JourneyItem } from './api';

export const COLORS = { independent: '#243B32', ai: '#B49A61', uncertain: '#A8A79F', terra: '#A6533C' };
export const CAT_META: Record<Category, { label: string; short: string; color: string; bg: string; border: string }> = {
  independent: { label: 'Independent-writing indicators', short: 'Independent', color: '#243B32', bg: 'bg-[#243B32]/[0.06]', border: 'border-l-[#243B32]' },
  ai_assisted: { label: 'Possible AI assistance', short: 'AI-assisted', color: '#8C7440', bg: 'bg-[#B49A61]/15', border: 'border-l-[#B49A61]' },
  uncertain: { label: 'Inconclusive', short: 'Uncertain', color: '#66675F', bg: 'bg-[#A8A79F]/15', border: 'border-l-[#A8A79F]' },
};

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl ${className}`}>{children}</div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[10px] uppercase tracking-[0.18em] text-[#A6533C] font-semibold">{children}</div>
);

export const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'gold'; busy?: boolean }> = ({ variant = 'primary', busy, className = '', children, disabled, ...p }) => {
  const v = {
    primary: 'bg-[#243B32] text-[#FFFDF8] hover:bg-[#1a2b25] border border-[#243B32]',
    ghost: 'bg-[#FFFDF8] text-[#243B32] border border-[#243B32]/70 hover:bg-[#E8DDCA]/50',
    danger: 'bg-[#FFFDF8] text-[#A6533C] border border-[#A6533C]/60 hover:bg-[#A6533C]/10',
    gold: 'bg-[#B49A61] text-[#FFFDF8] border border-[#B49A61] hover:bg-[#9c844f]',
  }[variant];
  return (
    <button {...p} disabled={disabled || busy} className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${v} ${className}`}>
      {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{children}
    </button>
  );
};

export const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode; required?: boolean }> = ({ label, hint, children, required }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-[#243B32] tracking-wide">{label}{required && <span className="text-[#A6533C]"> *</span>}</span>
    {children}
    {hint && <span className="block text-[11px] text-[#66675F]">{hint}</span>}
  </label>
);
export const inputCls = 'w-full px-3 py-2.5 text-sm bg-[#FFFDF8] border border-[#DDD3C2] rounded focus:outline-none focus:border-[#243B32] focus:ring-2 focus:ring-[#243B32]/10 text-[#282923] placeholder:text-[#A8A79F]';

export const Alert: React.FC<{ tone?: 'error' | 'info' | 'warn'; children: React.ReactNode }> = ({ tone = 'error', children }) => {
  const t = { error: 'bg-[#A6533C]/8 border-[#A6533C]/40 text-[#7d3c2a]', warn: 'bg-[#B49A61]/12 border-[#B49A61]/50 text-[#5f4f2a]', info: 'bg-[#243B32]/5 border-[#243B32]/25 text-[#243B32]' }[tone];
  const Icon = tone === 'info' ? Info : AlertTriangle;
  return <div role={tone === 'error' ? 'alert' : undefined} className={`flex gap-2.5 items-start border rounded-lg px-4 py-3 text-sm ${t}`}><Icon className="w-4 h-4 mt-0.5 shrink-0" /><div className="min-w-0">{children}</div></div>;
};

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-sm text-[#66675F]"><Loader2 className="w-5 h-5 animate-spin text-[#B49A61]" />{label}</div>
);

export const Pill: React.FC<{ children: React.ReactNode; tone?: 'green' | 'gold' | 'grey' | 'terra' }> = ({ children, tone = 'grey' }) => {
  const t = { green: 'bg-[#243B32]/10 text-[#243B32]', gold: 'bg-[#B49A61]/20 text-[#6e5a2c]', grey: 'bg-[#E8DDCA]/70 text-[#66675F]', terra: 'bg-[#A6533C]/12 text-[#A6533C]' }[tone];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${t}`}>{children}</span>;
};

export const ReviewPill: React.FC<{ status: string }> = ({ status }) =>
  status === 'reviewed' ? <Pill tone="green">Reviewed</Pill> : status === 'clarification_requested' ? <Pill tone="terra">Clarification asked</Pill> : <Pill tone="gold">Pending review</Pill>;

/** Donut chart of the three contribution categories. */
export const Donut: React.FC<{ independent: number; ai: number; uncertain: number; size?: number; center?: React.ReactNode }> = ({ independent, ai, uncertain, size = 200, center }) => {
  const r = 70, c = 2 * Math.PI * r;
  const segs = [[independent, COLORS.independent], [ai, COLORS.ai], [uncertain, COLORS.uncertain]] as const;
  let off = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" width={size} height={size} role="img" aria-label={`Independent ${independent}%, AI-assisted ${ai}%, uncertain ${uncertain}%`}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="#EFE8DA" strokeWidth="20" />
        {segs.map(([v, col], i) => {
          const len = (v / 100) * c; const el = (
            <circle key={i} cx="90" cy="90" r={r} fill="none" stroke={col} strokeWidth="20" strokeDasharray={`${Math.max(0, len - (v > 0 && v < 100 ? 1.5 : 0))} ${c}`} strokeDashoffset={-off}
              transform="rotate(-90 90 90)" style={{ transition: 'stroke-dasharray .9s ease' }} />);
          off += len; return el;
        })}
        <circle cx="90" cy="90" r="52" fill="none" stroke="#DDD3C2" strokeDasharray="1 4" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>
    </div>
  );
};

export const StackBar: React.FC<{ independent: number; ai: number; uncertain: number; h?: string }> = ({ independent, ai, uncertain, h = 'h-2' }) => (
  <div className={`flex w-full ${h} rounded-full overflow-hidden bg-[#EFE8DA]`}>
    <div style={{ width: `${independent}%`, background: COLORS.independent }} />
    <div style={{ width: `${ai}%`, background: COLORS.ai }} />
    <div style={{ width: `${uncertain}%`, background: COLORS.uncertain }} />
  </div>
);

export const Legend: React.FC = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#66675F]">
    {[['Independent', COLORS.independent], ['Possible AI assistance', COLORS.ai], ['Uncertain', COLORS.uncertain]].map(([l, c]) => (
      <span key={l} className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}</span>))}
  </div>
);

/** Learning-journey trend lines over time (analysed assignments only). */
export const TrendChart: React.FC<{ items: JourneyItem[] }> = ({ items }) => {
  const pts = items.filter(i => i.analysed);
  if (pts.length < 2) return <div className="text-sm text-[#66675F] py-10 text-center">Trends appear once two or more assignments have been analysed.</div>;
  const W = 640, H = 220, P = { l: 36, r: 14, t: 14, b: 34 };
  const x = (i: number) => P.l + (i * (W - P.l - P.r)) / (pts.length - 1);
  const y = (v: number) => P.t + ((100 - v) * (H - P.t - P.b)) / 100;
  const line = (k: 'independentPct' | 'aiPct' | 'uncertainPct') => pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[k] ?? 0).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Contribution indicators over time">
      {[0, 25, 50, 75, 100].map(v => <g key={v}><line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="#E8DDCA" strokeDasharray={v % 50 ? '2 4' : undefined} /><text x={P.l - 8} y={y(v) + 3} fontSize="9" textAnchor="end" fill="#8a8a82">{v}%</text></g>)}
      {([['uncertainPct', COLORS.uncertain], ['aiPct', COLORS.ai], ['independentPct', COLORS.independent]] as const).map(([k, c]) => (
        <g key={k}><path d={line(k)} fill="none" stroke={c} strokeWidth="2.25" strokeLinejoin="round" />
          {pts.map((p, i) => <circle key={i} cx={x(i)} cy={y(p[k] ?? 0)} r="3.5" fill="#FFFDF8" stroke={c} strokeWidth="2"><title>{`${p.title}: ${p[k]}%`}</title></circle>)}</g>))}
      {pts.map((p, i) => <text key={i} x={x(i)} y={H - 12} fontSize="9" textAnchor="middle" fill="#66675F">{new Date(p.createdAt.replace(' ', 'T') + 'Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</text>)}
    </svg>
  );
};

/** IKS-inspired ornament: a small lotus-mandala mark used as SwaLekhan's emblem. */
export const SwaLekhanMark: React.FC<{ size?: number; light?: boolean }> = ({ size = 40, light }) => {
  const stroke = light ? '#E8DDCA' : '#243B32';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="#B49A61" strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx="24" cy="13" rx="4" ry="9" fill="none" stroke="#B49A61" strokeWidth="0.8" opacity=".7" transform={`rotate(${i * 45} 24 24)`} />)}
      <path d="M16 31 C 22 27, 27 22, 32 14" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 14 l-2.5 6 l-2-2.5 z" fill="#A6533C" />
      <circle cx="24" cy="24" r="2" fill="#A6533C" />
    </svg>
  );
};
