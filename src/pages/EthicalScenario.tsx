import React from 'react';
import { PageTab } from '../types';
import { StudentCard } from '../components/StudentCard';
import { ArrowRight, AlertTriangle, ShieldCheck, BookOpen, Compass } from 'lucide-react';

interface EthicalScenarioProps {
  setActiveTab: (tab: PageTab) => void;
}

export const EthicalScenario: React.FC<EthicalScenarioProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Case Study in Action</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          Interactive Ethical AI Scenario
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          A university deploys an artificial intelligence model to predict which students are at risk of academic failure. Explore how reductive metrics create hidden casualties, and test the institutional decisions that restore ethical equilibrium.
        </p>
      </div>

      {/* Main Interactive Student Performance Evaluation System Component */}
      <StudentCard />

      {/* Structured Epistemic Analysis Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#DDD3C2]">
        <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg space-y-3">
          <div className="text-xs uppercase tracking-wider text-[#A6533C] font-semibold">
            Stage 01 · Mechanistic Capture
          </div>
          <h3 className="font-serif text-lg font-bold text-[#243B32]">
            Proxy Variable Fallacy
          </h3>
          <p className="text-xs text-[#66675F] leading-relaxed">
            The machine measures <em>LMS session clicks</em> and <em>morning card swipes</em>, mistaking digital surveillance trace data for intellectual capability and student engagement.
          </p>
        </div>

        <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg space-y-3">
          <div className="text-xs uppercase tracking-wider text-[#B49A61] font-semibold">
            Stage 02 · Epistemic Blinders
          </div>
          <h3 className="font-serif text-lg font-bold text-[#243B32]">
            Omission of Lived Reality
          </h3>
          <p className="text-xs text-[#66675F] leading-relaxed">
            The algorithm cannot perceive rural rolling blackouts, 2G cellular bandwidth constraints, or family elder-care obligations that force asynchronous study schedules.
          </p>
        </div>

        <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg space-y-3">
          <div className="text-xs uppercase tracking-wider text-[#243B32] font-semibold">
            Stage 03 · The Dharmic Intercept
          </div>
          <h3 className="font-serif text-lg font-bold text-[#243B32]">
            Human Stewardship Gate
          </h3>
          <p className="text-xs text-[#66675F] leading-relaxed">
            Ethical AI governance refuses to permit unilateral algorithmic sanction. An empathetic educator exercises moral discernment before any punitive threshold is triggered.
          </p>
        </div>
      </div>

      {/* Next Step Pathways */}
      <div className="p-6 bg-[#E8DDCA]/40 border border-[#DDD3C2] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base font-bold text-[#243B32]">
            Next: Discover the Philosophical Principles
          </h4>
          <p className="text-xs text-[#66675F]">
            Unpack how Dharma, Ahimsa, Nyaya, and Panchakosha provide structural foundations for AI governance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('principles')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors cursor-pointer"
          >
            <span>Explore IKS Principles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
