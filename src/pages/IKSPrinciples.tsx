import React, { useState } from 'react';
import { PageTab } from '../types';
import { IKS_PRINCIPLES } from '../data/principles';
import { 
  ArrowRight, 
  Compass, 
  Heart, 
  Scale, 
  Sparkles, 
  Check, 
  HelpCircle, 
  BookOpen, 
  SlidersHorizontal 
} from 'lucide-react';

interface IKSPrinciplesProps {
  setActiveTab: (tab: PageTab) => void;
}

export const IKSPrinciples: React.FC<IKSPrinciplesProps> = ({ setActiveTab }) => {
  // Track interactive principle applications
  const [appliedPrinciples, setAppliedPrinciples] = useState<Record<string, boolean>>({
    'dharma': false,
    'ahimsa': false,
    'nyaya-samata': false,
    'holistic-wellbeing': false,
  });

  const togglePrinciple = (id: string) => {
    setAppliedPrinciples(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPrincipleIcon = (id: string) => {
    switch (id) {
      case 'dharma':
        return <Compass className="w-5 h-5 text-[#B49A61]" />;
      case 'ahimsa':
        return <Heart className="w-5 h-5 text-[#B49A61]" />;
      case 'nyaya-samata':
        return <Scale className="w-5 h-5 text-[#B49A61]" />;
      case 'holistic-wellbeing':
      default:
        return <Sparkles className="w-5 h-5 text-[#B49A61]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Epistemological Foundations</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          IKS Principles Explorer
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          Examine the four core pillars of Indian Knowledge Systems and explore how each concept provides ethical guardrails for modern predictive algorithms.
        </p>
      </div>

      {/* Mandatory Scholarly Integrity Clarification */}
      <div className="p-4 bg-[#E8DDCA]/50 border border-[#DDD3C2] rounded-lg text-xs text-[#282923] leading-relaxed flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-[#A6533C] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#243B32] font-semibold">Academic Integrity Note:</strong> The concepts presented here are interpretive, scholarly applications of classical Indian philosophical traditions (such as Nyaya, Upanishadic psychology, and Dharmic jurisprudence) to contemporary computational ethics. They do not constitute claims that ancient historical treatises directly anticipated digital electronic computers or modern machine learning architectures.
        </div>
      </div>

      {/* 4 Interactive Principle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {IKS_PRINCIPLES.map((principle) => {
          const isApplied = appliedPrinciples[principle.id];

          return (
            <div
              key={principle.id}
              className={`bg-[#FFFDF8] border rounded-lg p-6 sm:p-8 space-y-6 shadow-xs transition-all ${
                isApplied
                  ? 'border-[#243B32] ring-1 ring-[#243B32]/30'
                  : 'border-[#DDD3C2]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#DDD3C2] pb-4">
                <div className="space-y-1">
                  <span className="font-serif text-sm font-semibold text-[#A6533C]">
                    {principle.sanskritName}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#243B32]">
                    {principle.englishTitle}
                  </h3>
                  <p className="text-xs text-[#66675F] italic">
                    "{principle.tagline}"
                  </p>
                </div>
                <div className="w-10 h-10 rounded bg-[#243B32] text-[#FFFDF8] flex items-center justify-center shrink-0">
                  {getPrincipleIcon(principle.id)}
                </div>
              </div>

              {/* Definition & Classical Lineage */}
              <div className="space-y-3 text-xs leading-relaxed text-[#282923]">
                <div>
                  <strong className="text-[#243B32] uppercase tracking-wider text-[11px] block mb-1">
                    Core Conceptual Definition
                  </strong>
                  <p className="text-[#66675F]">{principle.shortDefinition}</p>
                </div>

                <div className="pt-2 border-t border-[#DDD3C2]/50">
                  <strong className="text-[#243B32] uppercase tracking-wider text-[11px] block mb-1">
                    Philosophical Lineage &amp; Textual Roots
                  </strong>
                  <p className="text-[#66675F]">{principle.philosophicalRoot}</p>
                </div>

                <div className="pt-2 border-t border-[#DDD3C2]/50">
                  <strong className="text-[#243B32] uppercase tracking-wider text-[11px] block mb-1">
                    Translation into Modern AI Systems
                  </strong>
                  <p className="text-[#66675F]">{principle.modernAIAggregation}</p>
                </div>

                <div className="p-3 bg-[#F7F3EA] border border-[#DDD3C2] rounded text-xs space-y-1">
                  <strong className="text-[#A6533C] font-semibold block">
                    Educational System Application:
                  </strong>
                  <p className="text-[#282923]">{principle.practicalExample}</p>
                </div>
              </div>

              {/* Interactive Principle Sandbox Control */}
              <div className="pt-2 border-t border-[#DDD3C2] space-y-3">
                <button
                  onClick={() => togglePrinciple(principle.id)}
                  className={`w-full py-2.5 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isApplied
                      ? 'bg-[#243B32] text-[#FFFDF8]'
                      : 'border border-[#243B32] text-[#243B32] bg-[#F7F3EA] hover:bg-[#E8DDCA]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {isApplied ? 'Principle Active in System Engine' : principle.interactiveScenarioPrompt}
                  </span>
                </button>

                {isApplied && (
                  <div className="p-3 bg-[#243B32]/10 border border-[#243B32]/30 rounded text-xs text-[#243B32] space-y-1 animate-fadeIn">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#243B32]" />
                      Engine Modification Enabled:
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#282923]">
                      {principle.interactiveEffect}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Bridge to Risk Analysis */}
      <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base font-bold text-[#243B32]">
            Next: Examine the Two Primary Ethical Risks
          </h4>
          <p className="text-xs text-[#66675F]">
            Discover what happens when evaluation architectures operate in the absence of these Dharmic principles.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('risks')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors cursor-pointer shrink-0"
        >
          <span>Examine Ethical Risks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
