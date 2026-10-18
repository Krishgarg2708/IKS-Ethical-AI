import React, { useState } from 'react';
import { PageTab } from '../types';
import { ETHICAL_RISKS } from '../data/risks';
import { 
  ArrowRight, 
  AlertTriangle, 
  HelpCircle, 
  Users, 
  ShieldAlert, 
  GitBranch, 
  FileWarning 
} from 'lucide-react';

interface RiskAnalysisProps {
  setActiveTab: (tab: PageTab) => void;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ setActiveTab }) => {
  // Track selected severity level for each risk
  const [selectedSeverities, setSelectedSeverities] = useState<Record<string, number>>({
    'bias-unfair-treatment': 2, // Default: Severe
    'harm-to-student-wellbeing': 2, // Default: Severe
  });

  const handleSeverityChange = (riskId: string, levelIndex: number) => {
    setSelectedSeverities(prev => ({
      ...prev,
      [riskId]: levelIndex
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Socio-Technical Vulnerability Audit</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          Two Primary Ethical Risks
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          When higher education systems deploy opaque algorithmic evaluation models without ethical guardrails, they generate two distinct systemic harms: unfair proxy-based discrimination and psychological injury.
        </p>
      </div>

      {/* Educational Framework Disclaimer */}
      <div className="p-4 bg-[#E8DDCA]/50 border border-[#DDD3C2] rounded-lg text-xs leading-relaxed text-[#282923] flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-[#A6533C] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#243B32] font-semibold">Educational Assessment Clarification:</strong> The severity selectors below provide qualitative educational assessments designed to illustrate risk dynamics. They reflect analytical case-study classifications rather than fixed statistical empirical constants.
        </div>
      </div>

      {/* The Two Primary Risks */}
      <div className="space-y-12">
        {ETHICAL_RISKS.map((risk, index) => {
          const activeSeverityIndex = selectedSeverities[risk.id] ?? 2;
          const activeSeverity = risk.severityAssessments[activeSeverityIndex];

          return (
            <div
              key={risk.id}
              className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-10 space-y-8 shadow-xs"
            >
              {/* Risk Banner & Title */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#DDD3C2] pb-6">
                <div className="space-y-1 max-w-3xl">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A6533C] font-semibold">
                    Risk Category 0{index + 1}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#243B32]">
                    {risk.title}
                  </h2>
                  <p className="text-sm text-[#66675F] leading-relaxed">
                    {risk.shortDescription}
                  </p>
                </div>
                <div className="px-3.5 py-1.5 bg-[#F7F3EA] border border-[#DDD3C2] rounded text-xs text-[#243B32] font-semibold self-start shrink-0">
                  Qualitative Focus: High Priority
                </div>
              </div>

              {/* 4 Analytical Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Root Causes */}
                <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#243B32]">
                    <GitBranch className="w-4 h-4 text-[#A6533C]" />
                    <span>Root Epistemic &amp; Technical Causes</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#66675F] leading-relaxed">
                    {risk.rootCause.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. Example Situation */}
                <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#243B32]">
                    <FileWarning className="w-4 h-4 text-[#A6533C]" />
                    <span>Concrete Academic Demonstration</span>
                  </div>
                  <p className="text-xs text-[#282923] leading-relaxed">
                    {risk.exampleSituation}
                  </p>
                </div>

                {/* 3. Who Is Affected */}
                <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#243B32]">
                    <Users className="w-4 h-4 text-[#B49A61]" />
                    <span>Vulnerable Populations Impacted</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-[#66675F] leading-relaxed">
                    {risk.whoIsAffected.map((person, i) => (
                      <li key={i}>{person}</li>
                    ))}
                  </ul>
                </div>

                {/* 4. Possible Consequences & Principles */}
                <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#243B32]">
                    <ShieldAlert className="w-4 h-4 text-[#B49A61]" />
                    <span>Systemic Consequences &amp; Violated Principles</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-[#66675F] leading-relaxed">
                    {risk.possibleConsequences.map((consequence, i) => (
                      <li key={i}>{consequence}</li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-[#DDD3C2] text-xs text-[#243B32]">
                    <strong className="text-[#A6533C]">Violated IKS Principles:</strong>{' '}
                    {risk.relevantPrinciples.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Interactive Qualitative Severity Selector */}
              <div className="p-6 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#243B32]">
                    Interactive Qualitative Severity Explorer
                  </span>
                  <span className="text-xs text-[#66675F]">
                    Select a tier to examine institutional escalation
                  </span>
                </div>

                {/* Severity Segmented Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {risk.severityAssessments.map((assessment, idx) => {
                    const isSelected = activeSeverityIndex === idx;

                    return (
                      <button
                        key={assessment.level}
                        onClick={() => handleSeverityChange(risk.id, idx)}
                        className={`p-3 text-left rounded border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFFDF8] border-[#243B32] shadow-xs'
                            : 'bg-[#E8DDCA]/40 border-transparent hover:bg-[#E8DDCA]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            isSelected ? 'text-[#243B32]' : 'text-[#66675F]'
                          }`}>
                            {assessment.level}
                          </span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#A6533C]" />}
                        </div>
                        <span className="text-[11px] text-[#66675F] line-clamp-1">
                          Tier 0{idx + 1} Assessment
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Severity Note Card */}
                <div className="p-4 bg-[#FFFDF8] border border-[#DDD3C2] rounded text-xs leading-relaxed text-[#282923] space-y-1">
                  <div className="font-semibold text-[#A6533C]">
                    Severity Descriptor: {activeSeverity.level} Impact
                  </div>
                  <p className="text-[#66675F]">
                    {activeSeverity.educationalNote}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Bridge to Safeguards */}
      <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base font-bold text-[#243B32]">
            Next: Explore the Two Primary Safeguards
          </h4>
          <p className="text-xs text-[#66675F]">
            Discover how human oversight and student-centred fairness testing resolve each of these risks.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('safeguards')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors cursor-pointer shrink-0"
        >
          <span>Examine Safeguards &amp; Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
