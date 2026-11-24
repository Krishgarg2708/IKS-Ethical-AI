import React, { useState } from 'react';
import { StudentIndicators } from '../types';
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  Sliders, 
  UserCheck, 
  ShieldAlert, 
  HeartHandshake,
  RotateCcw
} from 'lucide-react';

export const StudentCard: React.FC = () => {
  // Input indicators state
  const [indicators, setIndicators] = useState<StudentIndicators>({
    attendance: 68,
    examScore: 74,
    assignmentCompletion: 62,
    participationScore: 58,
    connectivityConstrained: true,
    familyCaregivingDuty: true,
    workingPartTime: true,
  });

  const [revealedHiddenContext, setRevealedHiddenContext] = useState<boolean>(false);
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);

  // Dynamic illustrative risk calculation (rule-based demonstration)
  // Heuristic: heavy penalty on attendance < 75% and assignment < 70%, ignoring context
  const attendanceDeficit = Math.max(0, 75 - indicators.attendance) * 1.5;
  const assignmentDeficit = Math.max(0, 70 - indicators.assignmentCompletion) * 1.2;
  const examDeficit = Math.max(0, 70 - indicators.examScore) * 0.8;
  const participationDeficit = Math.max(0, 60 - indicators.participationScore) * 0.6;
  
  const rawRiskScore = Math.min(95, Math.round(35 + attendanceDeficit + assignmentDeficit + examDeficit + participationDeficit));
  
  const riskCategory = rawRiskScore >= 75 ? 'High Risk' : rawRiskScore >= 50 ? 'Moderate Risk' : 'Low Risk';

  const resetToDefault = () => {
    setIndicators({
      attendance: 68,
      examScore: 74,
      assignmentCompletion: 62,
      participationScore: 58,
      connectivityConstrained: true,
      familyCaregivingDuty: true,
      workingPartTime: true,
    });
    setRevealedHiddenContext(false);
    setSelectedDecision(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Educational Disclaimer */}
      <div className="p-4 bg-[#E8DDCA]/50 border border-[#DDD3C2] rounded-lg flex items-start gap-3 text-xs leading-relaxed text-[#282923]">
        <Info className="w-4 h-4 text-[#A6533C] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[#243B32]">Educational Demonstration Notice:</strong> The predictive risk score shown below is a transparent, illustrative rule-based calculation modeled after deployed university analytics. It is designed to examine ethical trade-offs, not an unvalidated statistical forecast.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Profile & Automated AI View (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD3C2] gap-2">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
                Anonymized Case File #CS-2024-819
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#243B32]">
                Aarav S. — B.Tech Computer Science (Year 2)
              </h3>
            </div>
            <button
              onClick={resetToDefault}
              className="inline-flex items-center gap-1 text-xs text-[#66675F] hover:text-[#243B32] transition-colors self-start sm:self-center cursor-pointer"
              title="Reset to scenario baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>

          {/* Interactive Metric Adjustment Sliders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#243B32] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#B49A61]" />
                Institutional Metric Inputs (Simulate Variance)
              </span>
              <span className="text-xs text-[#66675F]">Adjust sliders to observe AI scoring</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Attendance */}
              <div className="p-3 bg-[#F7F3EA] rounded border border-[#DDD3C2]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#282923]">Lecture Attendance</span>
                  <span className="font-mono font-semibold tabular-nums text-[#243B32]">{indicators.attendance}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={indicators.attendance}
                  onChange={(e) => setIndicators({ ...indicators, attendance: Number(e.target.value) })}
                  className="w-full accent-[#243B32] cursor-pointer"
                />
                <span className="text-[11px] text-[#66675F]">University threshold: 75%</span>
              </div>

              {/* Assignment Completion */}
              <div className="p-3 bg-[#F7F3EA] rounded border border-[#DDD3C2]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#282923]">On-Time Assignments</span>
                  <span className="font-mono font-semibold tabular-nums text-[#243B32]">{indicators.assignmentCompletion}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={indicators.assignmentCompletion}
                  onChange={(e) => setIndicators({ ...indicators, assignmentCompletion: Number(e.target.value) })}
                  className="w-full accent-[#243B32] cursor-pointer"
                />
                <span className="text-[11px] text-[#66675F]">Portal submissions on LMS</span>
              </div>

              {/* Midterm Exam Marks */}
              <div className="p-3 bg-[#F7F3EA] rounded border border-[#DDD3C2]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#282923]">Midterm Exam Marks</span>
                  <span className="font-mono font-semibold tabular-nums text-[#243B32]">{indicators.examScore}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={indicators.examScore}
                  onChange={(e) => setIndicators({ ...indicators, examScore: Number(e.target.value) })}
                  className="w-full accent-[#243B32] cursor-pointer"
                />
                <span className="text-[11px] text-[#66675F]">Class average: 71%</span>
              </div>

              {/* Classroom Participation */}
              <div className="p-3 bg-[#F7F3EA] rounded border border-[#DDD3C2]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#282923]">Live LMS Video / Click</span>
                  <span className="font-mono font-semibold tabular-nums text-[#243B32]">{indicators.participationScore}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={indicators.participationScore}
                  onChange={(e) => setIndicators({ ...indicators, participationScore: Number(e.target.value) })}
                  className="w-full accent-[#243B32] cursor-pointer"
                />
                <span className="text-[11px] text-[#66675F]">In-class audio &amp; chat clicks</span>
              </div>
            </div>
          </div>

          {/* AI Risk Output Display */}
          <div className="p-5 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#66675F]">
                  Algorithmic Assessment Engine
                </span>
                <h4 className="font-serif text-lg font-bold text-[#243B32]">
                  Predicted Student Risk Classification
                </h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs uppercase tracking-wider text-[#66675F] block">Risk Score</span>
                <span className="font-mono text-2xl font-bold tabular-nums text-[#A6533C]">
                  {rawRiskScore} <span className="text-xs font-normal text-[#66675F]">/ 100</span>
                </span>
              </div>
            </div>

            {/* Visual Risk Gauge */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-[#E8DDCA] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    rawRiskScore >= 75 ? 'bg-[#A6533C]' : rawRiskScore >= 50 ? 'bg-[#B49A61]' : 'bg-[#243B32]'
                  }`}
                  style={{ width: `${rawRiskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#66675F]">
                <span>Low Risk (0–49)</span>
                <span>Moderate Risk (50–74)</span>
                <span>High Risk (75–100)</span>
              </div>
            </div>

            {/* Model Influence Factors */}
            <div className="text-xs space-y-1.5 text-[#282923]">
              <div className="font-semibold text-[#243B32]">Factors Driving This Prediction:</div>
              <ul className="list-disc pl-4 space-y-1 text-[#66675F]">
                <li>
                  <strong>Attendance Deficit:</strong> Recorded attendance is {indicators.attendance}%, falling below the statutory 75% institutional threshold.
                </li>
                <li>
                  <strong>Submission Lag:</strong> On-time assignment completion is {indicators.assignmentCompletion}%, triggering the late-penalty algorithmic weight.
                </li>
                <li>
                  <strong>Behavioral Surveillance:</strong> In-class digital response activity ({indicators.participationScore}%) places the student in the lowest quartile of digital session clicks.
                </li>
              </ul>
            </div>
          </div>

          {/* Reveal Hidden Reality Button */}
          <div className="pt-2">
            <button
              onClick={() => setRevealedHiddenContext(!revealedHiddenContext)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-[#B49A61] rounded-lg text-sm font-medium text-[#243B32] bg-[#E8DDCA]/30 hover:bg-[#E8DDCA]/60 transition-colors cursor-pointer"
            >
              {revealedHiddenContext ? (
                <>
                  <EyeOff className="w-4 h-4 text-[#A6533C]" />
                  <span>Hide Ground-Truth Context</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#243B32]" />
                  <span>Reveal Student's Hidden Context (Unseen by AI)</span>
                </>
              )}
            </button>
          </div>

          {/* Hidden Context Expanded Section */}
          {revealedHiddenContext && (
            <div className="p-5 bg-[#E8DDCA]/40 border border-[#B49A61]/50 rounded-lg space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A6533C]">
                <HelpCircle className="w-4 h-4" />
                <span>The Unobserved Ground Reality</span>
              </div>
              <div className="text-sm leading-relaxed text-[#282923] space-y-2">
                <p>
                  Aarav resides in a village 25 kilometers from the university where mobile network bandwidth averages less than 256 kbps. Due to severe power grid rolling cuts, live video streaming drops frequently, artificially depressing his recorded "participation" score.
                </p>
                <p>
                  Additionally, Aarav manages medicine administration for his disabled grandfather each morning before commuting. Despite these hurdles, his physical laboratory practical test score is <strong>88% (Grade A)</strong>, and his offline code repositories demonstrate masterful understanding of algorithmic data structures.
                </p>
                <p className="font-serif italic text-xs text-[#243B32] pt-1 border-t border-[#DDD3C2]">
                  The AI evaluation system possesses zero awareness of these socio-technical realities, treating lack of fiber-optic connectivity and family caregiving duty as academic incompetence.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Institutional Decision Panel & Ethical Impact (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#A6533C] font-semibold">
              Action Required
            </span>
            <h3 className="font-serif text-xl font-bold text-[#243B32] mt-0.5">
              Ethical Governance Decision
            </h3>
            <p className="text-xs text-[#66675F] mt-1">
              How should the university respond to this high-risk prediction?
            </p>
          </div>

          {/* 3 Choices */}
          <div className="space-y-3">
            {/* Choice 1: Auto Penalize */}
            <button
              onClick={() => setSelectedDecision(1)}
              className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                selectedDecision === 1
                  ? 'border-[#A6533C] bg-[#A6533C]/10 ring-1 ring-[#A6533C]'
                  : 'border-[#DDD3C2] hover:bg-[#F7F3EA]'
              }`}
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#A6533C] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-[#282923]">
                    1. Automatically Penalize Student
                  </div>
                  <div className="text-xs text-[#66675F] mt-0.5">
                    Issue automated academic probation notice, apply 10% attendance grade deduction, and freeze scholarship renewal.
                  </div>
                </div>
              </div>
            </button>

            {/* Choice 2: Teacher Review */}
            <button
              onClick={() => setSelectedDecision(2)}
              className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                selectedDecision === 2
                  ? 'border-[#B49A61] bg-[#B49A61]/15 ring-1 ring-[#B49A61]'
                  : 'border-[#DDD3C2] hover:bg-[#F7F3EA]'
              }`}
            >
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-[#B49A61] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-[#282923]">
                    2. Mandate Faculty Qualitative Review
                  </div>
                  <div className="text-xs text-[#66675F] mt-0.5">
                    Flag prediction as preliminary; require course instructor to examine laboratory practicals and schedule an office hour dialogue.
                  </div>
                </div>
              </div>
            </button>

            {/* Choice 3: Proactive Support & Right to Challenge */}
            <button
              onClick={() => setSelectedDecision(3)}
              className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                selectedDecision === 3
                  ? 'border-[#243B32] bg-[#243B32]/10 ring-1 ring-[#243B32]'
                  : 'border-[#DDD3C2] hover:bg-[#F7F3EA]'
              }`}
            >
              <div className="flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-[#243B32] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-[#282923]">
                    3. Proactive Support &amp; Contestability Protocol
                  </div>
                  <div className="text-xs text-[#66675F] mt-0.5">
                    Provide offline study allowances, grant data rectification rights, and offer peer tutoring without disciplinary stigma.
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Decision Outcome & Ethical Analysis */}
          {selectedDecision ? (
            <div className="p-4 rounded-lg border border-[#DDD3C2] bg-[#F7F3EA] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                {selectedDecision === 1 ? (
                  <span className="text-[#A6533C]">Violation of IKS Principles</span>
                ) : selectedDecision === 2 ? (
                  <span className="text-[#B49A61]">Partial Alignment — Dharma in Practice</span>
                ) : (
                  <span className="text-[#243B32]">Comprehensive Alignment — Dharma, Ahimsa &amp; Nyaya</span>
                )}
              </div>

              {selectedDecision === 1 && (
                <div className="text-xs text-[#282923] space-y-2 leading-relaxed">
                  <p>
                    <strong>Severe Ethical Failure:</strong> The institution treats correlation as infallible truth, abdicating human responsibility (breaching <em>Dharma</em>).
                  </p>
                  <p>
                    By inflicting unmerited stigma and revoking financial aid from a diligent scholar navigating socioeconomic adversity, this action causes profound psychological and structural injury (violating <em>Ahimsa</em>).
                  </p>
                  <div className="text-[11px] text-[#A6533C] font-medium pt-1 border-t border-[#DDD3C2]">
                    Outcome: Aarav suffers acute demoralization and faces forced withdrawal despite 88% lab competence.
                  </div>
                </div>
              )}

              {selectedDecision === 2 && (
                <div className="text-xs text-[#282923] space-y-2 leading-relaxed">
                  <p>
                    <strong>Sound Human Stewardship:</strong> Mandating educator review upholds <em>Dharma</em> (moral responsibility). The teacher investigates whether proxy variables reflect real comprehension (applying <em>Nyaya</em>).
                  </p>
                  <p>
                    However, without a standardized institutional support pipeline for bandwidth disparities or a formal right to challenge data, systemic risk remains for peers.
                  </p>
                  <div className="text-[11px] text-[#243B32] font-medium pt-1 border-t border-[#DDD3C2]">
                    Outcome: The teacher recognizes Aarav’s practical genius and waives the flag, averting immediate catastrophe.
                  </div>
                </div>
              )}

              {selectedDecision === 3 && (
                <div className="text-xs text-[#282923] space-y-2 leading-relaxed">
                  <p>
                    <strong>Exemplary Synthesis of IKS &amp; Responsible AI:</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      <strong>Ahimsa (Non-Harm):</strong> The student is shielded from punitive labels; the alert triggers help rather than discipline.
                    </li>
                    <li>
                      <strong>Nyaya &amp; Samata (Fairness):</strong> Adjusting for bandwidth constraints acknowledges that identical rules across asymmetric realities create deep injustice.
                    </li>
                    <li>
                      <strong>Panchakosha (Holistic Flourishing):</strong> Recognizes student caregiving responsibilities and resilience as vital human virtues.
                    </li>
                  </ul>
                  <div className="text-[11px] text-[#243B32] font-semibold pt-1 border-t border-[#DDD3C2]">
                    Outcome: Aarav graduates with honors, supported by an institution that values human dignity over blind algorithmic compliance.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-[#DDD3C2] text-center text-xs text-[#66675F]">
              Select an option above to examine its ethical implications through the lens of Indian Knowledge Systems.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
