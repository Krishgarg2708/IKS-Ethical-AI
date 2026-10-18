import React, { useState } from 'react';
import { PageTab } from '../types';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  HelpCircle, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

interface AssessmentProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ setActiveTab }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return; // Prevent changing after submission
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Dynamic score calculation
  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((score / totalQuestions) * 100);

  const handleRetake = () => {
    setUserAnswers({});
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Knowledge Validation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          Learning Assessment
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          Validate your understanding of Indian Knowledge Systems in artificial intelligence ethics, algorithmic bias detection, human-in-the-loop oversight, and student dignity preservation.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="p-5 bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#66675F]">
            Assessment Progress
          </span>
          <div className="font-serif text-xl font-bold text-[#243B32]">
            {answeredCount} of {totalQuestions} Questions Answered
          </div>
        </div>

        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={answeredCount < totalQuestions}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded transition-all cursor-pointer ${
              answeredCount === totalQuestions
                ? 'bg-[#243B32] text-[#FFFDF8] hover:bg-[#1a2b25] shadow-xs'
                : 'bg-[#DDD3C2] text-[#66675F] cursor-not-allowed opacity-60'
            }`}
          >
            Submit &amp; View Results
          </button>
        ) : (
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#243B32] border border-[#243B32] rounded hover:bg-[#E8DDCA]/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        )}
      </div>

      {/* Final Results Summary Card */}
      {showResults && (
        <div className="p-6 sm:p-8 bg-[#243B32] text-[#FFFDF8] rounded-xl space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B49A61]/30 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
                Evaluation Complete
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#FFFDF8]">
                Final Score: {score} / {totalQuestions} ({scorePercentage}%)
              </h2>
            </div>
            <div className="p-3 rounded-full bg-[#B49A61]/20 border border-[#B49A61] self-start sm:self-center">
              <Award className="w-8 h-8 text-[#B49A61]" />
            </div>
          </div>

          <div className="text-sm leading-relaxed text-[#E8DDCA]/90">
            {scorePercentage >= 85 ? (
              <p>
                <strong>Exceptional Mastery:</strong> You have demonstrated a comprehensive, nuanced grasp of how classical Indian epistemologies (Dharma, Ahimsa, Nyaya, and Panchakosha) enrich contemporary computational ethics and counteract reductive algorithmic harms.
              </p>
            ) : scorePercentage >= 60 ? (
              <p>
                <strong>Good Proficiency:</strong> You possess a strong understanding of core ethical safeguards and algorithmic risks. Review the question explanations below to deepen your grounding in technical proxy bias and epistemic rigor.
              </p>
            ) : (
              <p>
                <strong>Foundational Progress:</strong> Review the IKS Principles and Risk Analysis modules to strengthen your understanding of how ancient duty and non-harm frameworks inform responsible machine learning.
              </p>
            )}
          </div>

          {/* Concepts Summary Strip */}
          <div className="pt-4 border-t border-[#B49A61]/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#E8DDCA]/80">
            <div>
              <span className="text-[#B49A61] block font-semibold">Ahimsa</span>
              Non-Stigmatizing AI
            </div>
            <div>
              <span className="text-[#B49A61] block font-semibold">Dharma</span>
              Human Accountability
            </div>
            <div>
              <span className="text-[#B49A61] block font-semibold">Nyaya</span>
              Empirical Due Inquiry
            </div>
            <div>
              <span className="text-[#B49A61] block font-semibold">Panchakosha</span>
              Holistic Well-being
            </div>
          </div>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-8">
        {QUIZ_QUESTIONS.map((q, index) => {
          const selectedOption = userAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-[#FFFDF8] border rounded-xl p-6 sm:p-8 space-y-6 shadow-xs transition-all ${
                showResults
                  ? isCorrect
                    ? 'border-[#243B32]'
                    : 'border-[#A6533C]'
                  : 'border-[#DDD3C2]'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#DDD3C2] pb-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
                    Question 0{index + 1} of {totalQuestions}
                  </span>
                  <div className="text-xs text-[#66675F]">
                    Focus: <strong className="text-[#243B32]">{q.iksConcept}</strong>
                  </div>
                </div>

                {showResults && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isCorrect ? (
                      <span className="text-[#243B32] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-[#243B32]" />
                        Correct (+1)
                      </span>
                    ) : (
                      <span className="text-[#A6533C] flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-[#A6533C]" />
                        Incorrect (0)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#243B32] leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = q.correctIndex === optIdx;

                  let optionStyle = 'border-[#DDD3C2] hover:bg-[#F7F3EA]';
                  if (!showResults && isThisSelected) {
                    optionStyle = 'border-[#243B32] bg-[#243B32]/10 ring-1 ring-[#243B32]';
                  } else if (showResults) {
                    if (isThisCorrect) {
                      optionStyle = 'border-[#243B32] bg-[#243B32]/15 font-medium';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'border-[#A6533C] bg-[#A6533C]/10 text-[#A6533C]';
                    } else {
                      optionStyle = 'border-[#DDD3C2] opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={showResults}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all text-xs leading-relaxed flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center mt-0.5 ${
                        isThisSelected ? 'border-[#243B32] bg-[#243B32]' : 'border-[#DDD3C2]'
                      }`}>
                        {isThisSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#FFFDF8]" />}
                      </div>
                      <span className="text-[#282923]">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation (Visible after submission) */}
              {showResults && (
                <div className={`p-4 rounded-lg border text-xs leading-relaxed space-y-1 ${
                  isCorrect
                    ? 'bg-[#243B32]/10 border-[#243B32]/30 text-[#243B32]'
                    : 'bg-[#A6533C]/10 border-[#A6533C]/30 text-[#A6533C]'
                }`}>
                  <strong className="block font-semibold">
                    Explanation &amp; Epistemic Rationale:
                  </strong>
                  <p className="text-[#282923]">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Bridge to Project Info */}
      <div className="p-6 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base font-bold text-[#243B32]">
            Complete the Journey: Project Info &amp; References
          </h4>
          <p className="text-xs text-[#66675F]">
            Review official government policy papers, academic literature, scope limitations, and implementation notes.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('about')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors cursor-pointer shrink-0"
        >
          <span>View Project Info</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
