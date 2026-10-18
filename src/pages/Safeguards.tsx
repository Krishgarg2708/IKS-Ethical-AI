import React from 'react';
import { PageTab } from '../types';
import { ETHICAL_SAFEGUARDS } from '../data/safeguards';
import { InteractiveChecklist } from '../components/InteractiveChecklist';
import { 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Cpu, 
  HeartHandshake, 
  HelpCircle, 
  CheckCircle2, 
  Scale 
} from 'lucide-react';

interface SafeguardsProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Safeguards: React.FC<SafeguardsProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Responsible Engineering &amp; Governance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          Two Primary Safeguards
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          To neutralize algorithmic bias and psychological harm, higher education systems must deploy two interconnected, non-negotiable safeguards rooted in Dharma, Ahimsa, and Nyaya.
        </p>
      </div>

      {/* The Two Primary Safeguards Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ETHICAL_SAFEGUARDS.map((safeguard, index) => {
          return (
            <div
              key={safeguard.id}
              className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDD3C2] pb-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#A6533C] font-semibold">
                    Safeguard 0{index + 1}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#243B32] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#243B32]" />
                    <span>Direct Mitigation</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-bold text-[#243B32]">
                    {safeguard.title}
                  </h2>
                  <p className="text-xs text-[#66675F] leading-relaxed">
                    {safeguard.subtitle}
                  </p>
                </div>

                {/* Mitigated Risks Badge Strip */}
                <div className="p-3 bg-[#F7F3EA] border border-[#DDD3C2] rounded text-xs space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A6533C] block">
                    Mitigates Core Ethical Risks:
                  </span>
                  <div className="text-xs text-[#282923]">
                    • <strong>Risk 1:</strong> Bias and Unfair Treatment <br />
                    • <strong>Risk 2:</strong> Harm to Student Well-being
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#243B32] block">
                    Operational Core Features:
                  </span>
                  <ul className="space-y-2 text-xs text-[#66675F]">
                    {safeguard.keyFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#243B32] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* IKS Philosophical Connection */}
              <div className="pt-4 border-t border-[#DDD3C2] text-xs text-[#282923] space-y-1 bg-[#F7F3EA] p-4 rounded-lg">
                <strong className="text-[#243B32] font-semibold block">
                  Grounding in Indian Knowledge Systems:
                </strong>
                <p className="text-[#66675F] leading-relaxed">
                  {safeguard.iksConnection}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Institutional Safeguards Checklist */}
      <InteractiveChecklist />

      {/* Navigation Bridge to Decision Simulator */}
      <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base font-bold text-[#243B32]">
            Next: Test Your Intuition in the Decision Simulator
          </h4>
          <p className="text-xs text-[#66675F]">
            Navigate four realistic dilemmas involving misclassified scholars, connectivity gaps, and faculty disputes.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('simulator')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors cursor-pointer shrink-0"
        >
          <span>Launch Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
