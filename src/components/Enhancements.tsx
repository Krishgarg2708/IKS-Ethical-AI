import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/** Thin reading-progress bar fixed at the very top of the page. */
export const ScrollProgress: React.FC = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none" aria-hidden="true">
      <div className="h-full bg-gradient-to-r from-[#243B32] via-[#B49A61] to-[#A6533C] origin-left" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
};

/** Floating back-to-top button that appears after scrolling. */
export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#243B32] text-[#FFFDF8] flex items-center justify-center shadow-md border border-[#B49A61]/50 transition-all duration-500 cursor-pointer hover:bg-[#A6533C] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

/**
 * Scroll-reveal: watches every <section> and card-like block inside `root`
 * and fades it up into view the first time it enters the viewport.
 * Re-runs whenever `deps` change, for example on a page switch.
 */
export const useScrollReveal = (deps: unknown[]) => {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    const main = document.querySelector('main');
    if (!main) return;
    const targets = Array.from(
      main.querySelectorAll<HTMLElement>('section, h1, h2, .rounded-lg, .rounded-xl')
    ).filter((el) => !el.closest('.reveal') && el.getBoundingClientRect().top > window.innerHeight * 0.9);
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
    });
    // Also re-observe anything left pending from an earlier run
    main.querySelectorAll<HTMLElement>('.reveal:not(.reveal-in)').forEach((el) => {
      if (!targets.includes(el)) targets.push(el);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('reveal-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/** Number that counts up smoothly whenever `value` changes. */
export const CountUp: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ value, suffix = '', duration = 700 }) => {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{shown}{suffix}</>;
};
