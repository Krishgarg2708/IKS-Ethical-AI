import React from 'react';
import { PageTab } from '../types';
import { MandalaPattern } from '../components/MandalaPattern';
import { 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Scale, 
  Sparkles, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 lg:space-y-24 py-8 lg:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle decorative manuscript background linework */}
        <div className="absolute inset-0 pointer-events-none opacity-20 lattice-pattern" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
                <span>Indian Knowledge Systems &amp; Ethical Artificial Intelligence</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#243B32] leading-tight">
                Ancient Wisdom. <br />
                <span className="italic font-normal text-[#A6533C]">Responsible Intelligence.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#282923] leading-relaxed max-w-2xl font-light">
                Modern artificial intelligence often reduces human potential to narrow quantitative metrics. By anchoring algorithmic governance in timeless Indian philosophical traditions—<strong>Dharma</strong> (responsibility), <strong>Ahimsa</strong> (non-harm), <strong>Nyaya</strong> (contextual fairness), and <strong>Panchakosha</strong> (holistic well-being)—we construct an ethical architecture where technology serves human flourishing rather than mechanical surveillance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('scenario')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-all cursor-pointer shadow-xs"
                >
                  <span>Explore the Ethical Scenario</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('principles')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#243B32] border border-[#243B32] rounded bg-[#FFFDF8] hover:bg-[#E8DDCA]/50 transition-all cursor-pointer"
                >
                  <span>Discover IKS Principles</span>
                </button>
              </div>

              {/* Core Attributes strip */}
              <div className="pt-6 border-t border-[#DDD3C2] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#66675F]">
                <div>
                  <span className="font-semibold text-[#243B32] block">Dharma</span>
                  Human Responsibility
                </div>
                <div>
                  <span className="font-semibold text-[#243B32] block">Ahimsa</span>
                  Non-Harm &amp; Dignity
                </div>
                <div>
                  <span className="font-semibold text-[#243B32] block">Nyaya</span>
                  Contextual Fairness
                </div>
                <div>
                  <span className="font-semibold text-[#243B32] block">Sukhinah</span>
                  Holistic Well-being
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Mandala Visual (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-6 sm:p-8 bg-[#FFFDF8] border border-[#DDD3C2] rounded-2xl shadow-sm">
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#F7F3EA] border border-[#DDD3C2] text-[10px] uppercase tracking-widest text-[#A6533C] font-semibold">
                  Epistemological Nexus
                </div>
                <MandalaPattern size={400} />
                <div className="mt-4 text-center">
                  <p className="font-serif italic text-xs text-[#66675F]">
                    Synthesis of Stepwell Symmetries, Dharmachakra Harmonics &amp; Neural Computational Graphs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Use Case Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DDD3C2] pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
                Core Academic Scenario
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#243B32]">
                AI-Based Student Performance Evaluation
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('scenario')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#A6533C] hover:text-[#243B32] transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Launch Interactive Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-[#A6533C]">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#243B32]">The Dilemma</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#66675F]">
                A major university deploys an automated predictive model that flags students as "high risk of dropout" based on attendance and late assignment uploads, completely unaware of socioeconomic divides and family obligations.
              </p>
            </div>

            <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-[#A6533C]">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#243B32]">2 Primary Risks</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#66675F]">
                <strong>1. Bias &amp; Unfair Treatment:</strong> Algorithmic penalization of low-bandwidth rural scholars. <br />
                <strong>2. Harm to Student Well-being:</strong> Demoralizing deficit labeling that triggers imposter syndrome and withdrawal.
              </p>
            </div>

            <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-[#243B32]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#243B32]">2 Primary Safeguards</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#66675F]">
                <strong>1. Human Oversight &amp; Accountability:</strong> Mandatory educator qualitative review and right to appeal (Dharma). <br />
                <strong>2. Fairness Testing &amp; Student-Centred Design:</strong> Bias audits and asynchronous accommodations (Nyaya &amp; Ahimsa).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Overview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
            Philosophical Framework
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#243B32]">
            Four Pillars of Indian Knowledge Systems in AI
          </h2>
          <p className="text-xs sm:text-sm text-[#66675F]">
            How classical concepts translate into actionable computational ethics and engineering safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-3 shadow-xs hover:border-[#B49A61] transition-all">
            <div className="w-10 h-10 rounded bg-[#243B32] text-[#FFFDF8] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#B49A61]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#243B32]">
              Dharma
            </h3>
            <span className="text-[11px] text-[#A6533C] font-semibold uppercase tracking-wider block">
              Responsibility &amp; Duty
            </span>
            <p className="text-xs text-[#66675F] leading-relaxed">
              Institutional accountability and human agency. Automated predictions must never displace human moral responsibility or serve as liability shields.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-3 shadow-xs hover:border-[#B49A61] transition-all">
            <div className="w-10 h-10 rounded bg-[#243B32] text-[#FFFDF8] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#B49A61]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#243B32]">
              Ahimsa
            </h3>
            <span className="text-[11px] text-[#A6533C] font-semibold uppercase tracking-wider block">
              Non-Harm &amp; Dignity
            </span>
            <p className="text-xs text-[#66675F] leading-relaxed">
              Prohibiting algorithms that inflict psychological distress or stigmatizing labels. Every algorithmic intervention must preserve the dignity and confidence of the learner.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-3 shadow-xs hover:border-[#B49A61] transition-all">
            <div className="w-10 h-10 rounded bg-[#243B32] text-[#FFFDF8] flex items-center justify-center">
              <Scale className="w-5 h-5 text-[#B49A61]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#243B32]">
              Nyaya &amp; Samata
            </h3>
            <span className="text-[11px] text-[#A6533C] font-semibold uppercase tracking-wider block">
              Fairness &amp; Context
            </span>
            <p className="text-xs text-[#66675F] leading-relaxed">
              Rigorous inquiry and contextual equity. Recognizing that treating unequal socio-technical realities identically is itself a form of structural injustice.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 space-y-3 shadow-xs hover:border-[#B49A61] transition-all">
            <div className="w-10 h-10 rounded bg-[#243B32] text-[#FFFDF8] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#B49A61]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#243B32]">
              Panchakosha
            </h3>
            <span className="text-[11px] text-[#A6533C] font-semibold uppercase tracking-wider block">
              Holistic Well-being
            </span>
            <p className="text-xs text-[#66675F] leading-relaxed">
              Human development across five holistic sheaths—physical, vital, emotional, intellectual, and inner selfhood—rather than reductive scalar test scores.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveTab('principles')}
            className="text-xs font-semibold uppercase tracking-wider text-[#243B32] hover:text-[#A6533C] transition-colors underline cursor-pointer"
          >
            Explore Detailed Principles &amp; Interactive Sandboxes →
          </button>
        </div>
      </section>

      {/* Purpose & Learning Outcomes Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#243B32] text-[#FFFDF8] rounded-xl p-8 sm:p-12 space-y-6 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
              Curricular Objectives
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFFDF8]">
              Expected Learning Outcomes
            </h2>
            <p className="text-sm text-[#E8DDCA]/80 leading-relaxed font-light">
              This interactive platform bridges traditional humanities and contemporary computer science to equip students, researchers, and policymakers with practical ethical decision-making frameworks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs text-[#E8DDCA]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Distinguish valid algorithmic assistance from harmful automated determinism.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Identify socio-technical proxy bias in educational data analytics.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Design multi-tiered institutional human oversight mechanisms.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Apply Indian philosophical ethics to real-world engineering trade-offs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
