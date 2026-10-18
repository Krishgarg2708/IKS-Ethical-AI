import React, { useState } from 'react';
import { PageTab } from '../types';
import { SIMULATOR_CASES } from '../data/scenarios';
import { 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Compass, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DecisionSimulatorProps {
  setActiveTab: (tab: PageTab) => void;
}

export const DecisionSimulator: React.FC<DecisionSimulatorProps> = ({ setActiveTab }) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  const currentCase = SIMULATOR_CASES[activeCaseIndex];
  const activeChoiceId = selectedChoices[currentCase.id];
  const activeChoice = currentCase.choices.find(c => c.id === activeChoiceId);

  const handleSelectChoice = (caseId: string, choiceId: string) => {
    setSelectedChoices(prev => ({
      ...prev,
      [caseId]: choiceId
    }));
  };

  const completedCount = Object.keys(selectedChoices).length;
  const totalCases = SIMULATOR_CASES.length;

  const resetAllSimulations = () => {
    setSelectedChoices({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Interactive Applied Ethics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          Ethical Decision Simulator
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          Step into the role of an academic ethics council member. Analyze complex institutional scenarios, test proposed responses, and evaluate how Indian Knowledge Systems resolve conflicting imperatives without simplistic binary judgments.
        </p>
      </div>

      {/* Case Navigator Bar & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {SIMULATOR_CASES.map((item, idx) => {
            const isCurrent = activeCaseIndex === idx;
            const hasChosen = !!selectedChoices[item.id];

            return (
              <button
                key={item.id}
                onClick={() => setActiveCaseIndex(idx)}
                className={`px-3.5 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#243B32] text-[#FFFDF8] shadow-xs'
                    : 'bg-[#F7F3EA] text-[#66675F] hover:bg-[#E8DDCA]'
                }`}
              >
                <span>Case {item.caseNumber}</span>
                {hasChosen && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#B49A61]' : 'text-[#243B32]'}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#66675F]">
          <span>
            Progress: <strong>{completedCount}</strong> of {totalCases} Cases Explored
          </span>
          {completedCount > 0 && (
            <button
              onClick={resetAllSimulations}
              className="flex items-center gap-1 hover:text-[#243B32] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Case Simulation Card */}
      <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-10 space-y-8 shadow-xs">
        {/* Case Narrative Box */}
        <div className="space-y-4 border-b border-[#DDD3C2] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
              Scenario Case {currentCase.caseNumber} of {totalCases}
            </span>
            <span className="text-xs text-[#66675F]">
              Realistic Applied Dilemma
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#243B32]">
            {currentCase.title}
          </h2>

          <div className="p-4 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg text-sm text-[#282923] leading-relaxed">
            {currentCase.context}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#A6533C]/10 border border-[#A6533C]/30 rounded-lg">
              <span className="font-semibold text-[#A6533C] uppercase tracking-wider block mb-1">
                Automated AI Assessment Output:
              </span>
              <p className="text-[#282923] font-medium">{currentCase.aiClassification}</p>
            </div>

            <div className="p-4 bg-[#243B32]/10 border border-[#243B32]/30 rounded-lg">
              <span className="font-semibold text-[#243B32] uppercase tracking-wider block mb-1">
                Ground-Truth Lived Reality (Omitted by AI):
              </span>
              <p className="text-[#282923]">{currentCase.hiddenContext}</p>
            </div>
          </div>
        </div>

        {/* Action Choices */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#243B32]">
              Select Institutional Response
            </h3>
            <p className="text-xs text-[#66675F]">
              Consider the trade-offs between administrative expediency, algorithmic dogma, and ethical stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentCase.choices.map((choice) => {
              const isSelected = activeChoiceId === choice.id;

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(currentCase.id, choice.id)}
                  className={`text-left p-5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#243B32] bg-[#243B32]/10 ring-1 ring-[#243B32]'
                      : 'border-[#DDD3C2] hover:bg-[#F7F3EA]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-serif text-base font-bold text-[#243B32]">
                        {choice.title}
                      </div>
                      <p className="text-xs text-[#66675F] leading-relaxed">
                        {choice.description}
                      </p>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#243B32] bg-[#243B32]' : 'border-[#DDD3C2]'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#FFFDF8]" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Choice In-Depth Multi-Attribute Analysis */}
        {activeChoice ? (
          <div className="p-6 bg-[#F7F3EA] border border-[#DDD3C2] rounded-xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD3C2] pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B49A61] font-semibold">
                  Comprehensive Ethical Analysis
                </span>
                <h4 className="font-serif text-xl font-bold text-[#243B32]">
                  {activeChoice.title}
                </h4>
              </div>
              <div className="px-3 py-1 rounded text-xs font-semibold self-start sm:self-center bg-[#FFFDF8] border border-[#DDD3C2] text-[#243B32]">
                {activeChoice.isRecommended ? 'Recommended Ethical Alignment' : 'Sub-Optimal / Unbalanced Approach'}
              </div>
            </div>

            {/* Benefits & Risks Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg space-y-2">
                <span className="font-semibold text-[#243B32] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#243B32]" />
                  Ethical &amp; Operational Benefits
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[#66675F]">
                  {activeChoice.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg space-y-2">
                <span className="font-semibold text-[#A6533C] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#A6533C]" />
                  Ethical Risks &amp; Liabilities
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[#66675F]">
                  {activeChoice.risks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stakeholders & Applicable Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FFFDF8] border border-[#DDD3C2] rounded space-y-1">
                <strong className="text-[#243B32] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#B49A61]" />
                  Affected Stakeholders:
                </strong>
                <p className="text-[#66675F]">{activeChoice.stakeholders.join(' · ')}</p>
              </div>

              <div className="p-3 bg-[#FFFDF8] border border-[#DDD3C2] rounded space-y-1">
                <strong className="text-[#243B32] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#B49A61]" />
                  Relevant IKS Principles:
                </strong>
                <p className="text-[#66675F]">{activeChoice.applicablePrinciples.join(' · ')}</p>
              </div>
            </div>

            {/* Nuanced Expert Rationale */}
            <div className="p-4 bg-[#FFFDF8] border border-[#B49A61]/40 rounded-lg space-y-2 text-xs leading-relaxed text-[#282923]">
              <strong className="text-[#243B32] block font-semibold">
                Expert Philosophical Rationale &amp; Guidance:
              </strong>
              <p className="text-[#66675F]">
                {activeChoice.expertRationale}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-[#DDD3C2] rounded-xl text-center text-xs text-[#66675F] space-y-2">
            <Compass className="w-6 h-6 text-[#B49A61] mx-auto opacity-70" />
            <p>Select one of the three institutional response options above to examine its multi-attribute ethical implications.</p>
          </div>
        )}
      </div>

      {/* Case Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveCaseIndex(prev => Math.max(0, prev - 1))}
          disabled={activeCaseIndex === 0}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded border border-[#DDD3C2] transition-colors cursor-pointer ${
            activeCaseIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-[#F7F3EA] text-[#66675F]'
              : 'bg-[#FFFDF8] text-[#243B32] hover:bg-[#E8DDCA]'
          }`}
        >
          ← Previous Case
        </button>

        <div className="text-xs text-[#66675F]">
          Case {activeCaseIndex + 1} of {totalCases}
        </div>

        <button
          onClick={() => {
            if (activeCaseIndex < totalCases - 1) {
              setActiveCaseIndex(prev => prev + 1);
            } else {
              setActiveTab('assessment');
            }
          }}
          className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded bg-[#243B32] text-[#FFFDF8] hover:bg-[#1a2b25] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>{activeCaseIndex < totalCases - 1 ? 'Next Case →' : 'Proceed to Assessment →'}</span>
        </button>
      </div>
    </div>
  );
};
