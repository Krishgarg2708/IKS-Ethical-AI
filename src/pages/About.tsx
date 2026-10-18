import React from 'react';
import { PageTab } from '../types';
import { VERIFIED_REFERENCES } from '../data/references';
import { 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  FileCheck2, 
  Layers, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface AboutProps {
  setActiveTab: (tab: PageTab) => void;
}

export const About: React.FC<AboutProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A61] font-semibold border-b border-[#B49A61]/40 pb-1">
          <span>Project Monograph &amp; Governance Architecture</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243B32]">
          Project Information &amp; References
        </h1>
        <p className="text-base text-[#282923] leading-relaxed font-light">
          A comprehensive scholarly synthesis detailing the research objectives, epistemological scope, technical limitations, and verified institutional foundations behind this educational initiative.
        </p>
      </div>

      {/* Monograph Structure Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Objective & Problem Statement */}
          <section className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A6533C] font-semibold">
              01 · Problem Formulation &amp; Intent
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#243B32]">
              Project Objective &amp; Problem Statement
            </h2>
            <div className="text-xs sm:text-sm text-[#282923] leading-relaxed space-y-3">
              <p>
                <strong>The Critical Problem:</strong> Higher education institutions are increasingly deploying automated learning analytics and machine learning prediction models to forecast student dropout, automate academic alerts, and rank cohorts. However, these systems rely overwhelmingly on <em>digital proxy variables</em> (such as midnight LMS click frequency, online video streaming durations, and RFID campus check-ins).
              </p>
              <p>
                This creates profound socio-technical vulnerabilities: students with limited broadband, rural scholars, caregiving youth, and neurodivergent thinkers are systematically mislabeled as "disengaged" or "high risk." When such predictions trigger automated sanctions without human review, they inflict irreversible psychological demoralization and systemic injustice.
              </p>
              <p>
                <strong>The Research Objective:</strong> This educational platform demonstrates how ancient Indian Knowledge Systems (IKS)—principally <em>Dharma</em> (responsibility &amp; moral agency), <em>Ahimsa</em> (non-harm &amp; student dignity), <em>Nyaya &amp; Samata</em> (contextual justice), and <em>Panchakosha</em> (holistic multi-attribute well-being)—provide actionable, culturally grounded engineering safeguards to govern artificial intelligence in education.
              </p>
            </div>
          </section>

          {/* Section 2: Scope & Epistemological Limitations */}
          <section className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
              02 · Epistemic Scope &amp; Rigorous Limitations
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#243B32]">
              Scope, Boundaries &amp; Academic Integrity
            </h2>
            <div className="text-xs sm:text-sm text-[#282923] leading-relaxed space-y-3">
              <p>
                <strong>Interpretive Framework, Not Historical Machine Claims:</strong> This project explicitly treats Indian philosophical traditions as an <em>interpretive moral and epistemological framework</em>. It does not advance anachronistic historical claims that ancient Indian texts directly described silicon computers, modern statistical regressions, or neural networks.
              </p>
              <p>
                <strong>Educational Simulation Status:</strong> The student risk score in the interactive scenario is a transparent, rule-based algorithmic demonstration constructed to illuminate ethical trade-offs. It is not an unvalidated statistical forecast deployed upon live students.
              </p>
              <p>
                <strong>Data Minimization by Design:</strong> The platform operates fully client-side without harvesting personal identification, biometric information, or student credentials.
              </p>
            </div>
          </section>

          {/* Section 3: Verified Academic & Policy References */}
          <section className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[#DDD3C2] pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#243B32] font-semibold">
                03 · Bibliography &amp; Primary Sources
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#243B32] mt-1">
                Verified Academic &amp; Institutional References
              </h2>
              <p className="text-xs text-[#66675F] mt-1">
                Grounded in official national guidelines, international declarations, and foundational philosophical texts.
              </p>
            </div>

            <div className="space-y-4">
              {VERIFIED_REFERENCES.map((ref) => {
                return (
                  <div
                    key={ref.id}
                    className="p-4 bg-[#F7F3EA] border border-[#DDD3C2] rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="font-semibold text-[#A6533C] text-[11px] uppercase tracking-wider">
                        {ref.category} · {ref.year}
                      </span>
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#243B32] hover:text-[#A6533C] underline text-[11px] transition-colors"
                        >
                          <span>Institutional Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#243B32]">
                      {ref.title}
                    </h4>
                    <div className="text-[#66675F] italic">
                      {ref.authorOrInstitution}
                    </div>
                    <p className="text-[#282923] leading-relaxed">
                      {ref.summary}
                    </p>
                    <div className="pt-1 text-[#243B32] font-medium text-[11px] border-t border-[#DDD3C2]/50">
                      <strong>Relevance to Project:</strong> {ref.relevanceToProject}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Expected Impact & Future Enhancements */}
          <section className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
            <span className="font-mono text-xs uppercase tracking-widest text-[#243B32] font-semibold">
              04 · Horizon &amp; Scalability
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#243B32]">
              Expected Impact &amp; Future Enhancements
            </h2>
            <div className="text-xs sm:text-sm text-[#282923] leading-relaxed space-y-3">
              <p>
                <strong>Educational &amp; Pedagogical Impact:</strong> Demonstrates that artificial intelligence ethics can transcend purely Western regulatory paradigms by incorporating indigenous epistemologies of duty, compassion, and holistic embodiment.
              </p>
              <p>
                <strong>Future Technical Extensions:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#66675F]">
                <li>Implementation of interactive multi-objective Pareto front visualizations comparing traditional optimization against well-being metrics.</li>
                <li>Expansion into multilingual Sanskrit, Hindi, Tamil, and Bengali terminology toggles for all philosophical concepts.</li>
                <li>Exportable institutional audit report generator for university governance committees.</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Right Column: Implementation Verification Checklist & Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#243B32] text-[#FFFDF8] rounded-xl p-6 space-y-4 shadow-xs">
            <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold block">
              System Audit
            </span>
            <h3 className="font-serif text-xl font-bold text-[#FFFDF8]">
              Final Implementation Checklist
            </h3>
            <p className="text-xs text-[#E8DDCA]/80 leading-relaxed font-light">
              Verification of major functional deliverables against requirements.
            </p>

            <div className="space-y-2.5 text-xs text-[#E8DDCA] pt-2 border-t border-[#B49A61]/30">
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Restrained Heritage Palette (Zero neon/glow)</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Interactive Student Performance Scenario</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Hidden Context Reveal &amp; Decision Panel</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>4 Interactive IKS Principle Cards with Sandboxes</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Exactly 2 Primary Risks with Severity Selector</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Exactly 2 Primary Safeguards Linked to Risks</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Functional Interactive Safeguards Checklist</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Ethical Decision Simulator (4 In-depth Cases)</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Learning Assessment with Dynamic Scoring</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-[#B49A61] shrink-0 mt-0.5" />
                <span>Verified Academic &amp; Government Citations</span>
              </div>
            </div>
          </div>

          {/* Quick Nav to Modules */}
          <div className="p-5 bg-[#FFFDF8] border border-[#DDD3C2] rounded-xl space-y-3 text-xs shadow-xs">
            <span className="font-semibold text-[#243B32] uppercase tracking-wider block">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-[#66675F]">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-[#243B32] underline cursor-pointer"
                >
                  Return to Landing Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('scenario')}
                  className="hover:text-[#243B32] underline cursor-pointer"
                >
                  Revisit Interactive Student Scenario
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="hover:text-[#243B32] underline cursor-pointer"
                >
                  Test Decision Simulator Scenarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="hover:text-[#243B32] underline cursor-pointer"
                >
                  Take the Learning Assessment Quiz
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
