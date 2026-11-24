import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

// Animated intro: the logo draws itself, then the title appears letter by letter,
// a short tagline cycles through the four principles, and a field-row progress bar fills.
// About 3.4 s in total, then the screen fades out. Click or press any key to skip.

const PRINCIPLES = ['Dharma', 'Ahimsa', 'Nyaya', 'Samata'];
const TOTAL_MS = 3400;

export const LoadingScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [leaving, setLeaving] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const total = reduce ? 600 : TOTAL_MS;
    const t1 = setTimeout(() => setLeaving(true), total);
    const t2 = setTimeout(onDone, total + 700);
    const iv = setInterval(() => setIdx((i) => (i + 1) % PRINCIPLES.length), 650);
    const skip = () => { setLeaving(true); setTimeout(onDone, 500); };
    window.addEventListener('keydown', skip, { once: true });
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); window.removeEventListener('keydown', skip); };
  }, [onDone]);

  const title1 = 'Gram';
  const title2 = 'Graph';

  return (
    <div
      className={`loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7F3EA] ${leaving ? 'loader-out' : ''}`}
      onClick={() => { setLeaving(true); setTimeout(onDone, 500); }}
      role="status"
      aria-label="Loading Gram to Graph"
    >
      {/* Background: concentric ripples and rising field lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <span key={i} className="loader-ripple" style={{ animationDelay: `${i * 0.9}s` }} />
        ))}
        <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M0 ${150 - i * 22} Q300 ${120 - i * 22} 600 ${150 - i * 22} T1200 ${150 - i * 22}`}
              fill="none"
              stroke={i % 2 ? '#B49A61' : '#243B32'}
              strokeOpacity={0.18}
              strokeWidth="1.5"
             
              className="loader-field"
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="relative flex flex-col items-center gap-6 px-6">
        <div className="loader-logo-wrap">
          <Logo size={150} animated />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#243B32] tracking-tight flex items-baseline gap-3">
          <span className="flex">
            {title1.split('').map((c, i) => (
              <span key={i} className="loader-letter" style={{ animationDelay: `${1.2 + i * 0.06}s` }}>{c}</span>
            ))}
          </span>
          <span className="loader-letter italic font-normal text-[#A6533C] text-3xl sm:text-4xl" style={{ animationDelay: '1.5s' }}>to</span>
          <span className="flex">
            {title2.split('').map((c, i) => (
              <span key={i} className="loader-letter" style={{ animationDelay: `${1.6 + i * 0.06}s` }}>{c}</span>
            ))}
          </span>
        </h1>

        <p className="loader-fade text-xs sm:text-sm uppercase tracking-[0.3em] text-[#66675F]" style={{ animationDelay: '2s' }}>
          Fair AI for Rural Learners
        </p>

        <div className="loader-fade h-6 overflow-hidden text-center" style={{ animationDelay: '2.1s' }}>
          <span key={idx} className="loader-word block font-serif italic text-lg text-[#B49A61]">
            {PRINCIPLES[idx]}
          </span>
        </div>

        {/* Progress: a field row that fills from village to graph */}
        <div className="loader-fade w-64 sm:w-80 flex items-center gap-2" style={{ animationDelay: '0.4s' }}>
          <span className="text-[10px] uppercase tracking-widest text-[#66675F]">Gram</span>
          <div className="flex-1 h-[3px] bg-[#DDD3C2] rounded relative">
            <div className="loader-bar absolute inset-y-0 left-0 bg-[#243B32]" />
            <div className="loader-dot-track absolute inset-0"><span className="loader-bar-dot absolute top-1/2 w-2 h-2 rounded-full bg-[#A6533C]" /></div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#66675F]">Graph</span>
        </div>

        <p className="loader-fade text-[10px] text-[#66675F]/70" style={{ animationDelay: '2.6s' }}>Click or press any key to skip</p>
      </div>
    </div>
  );
};
