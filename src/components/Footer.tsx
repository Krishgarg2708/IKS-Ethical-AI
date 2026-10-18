import React from 'react';
import { PageTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const handleNav = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#243B32] text-[#E8DDCA] border-t border-[#B49A61]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#B49A61]/20">
          {/* Column 1: Brand & Scholarly Intent */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wide text-[#FFFDF8]">
              IKS &amp; Ethical AI
            </h3>
            <p className="text-sm leading-relaxed text-[#E8DDCA]/80 max-w-md">
              Ancient Wisdom, Responsible Intelligence. An interactive academic project synthesizing classical Indian Knowledge Systems (Dharma, Ahimsa, Nyaya, and Panchakosha) with modern machine learning governance and ethical student evaluation.
            </p>
            <div className="pt-2 text-xs text-[#B49A61] flex flex-wrap items-center gap-2">
              <span>National Education Policy (NEP) 2020</span>
              <span aria-hidden="true">·</span>
              <span>NITI Aayog Responsible AI</span>
              <span aria-hidden="true">·</span>
              <span>UNESCO AI Ethics</span>
            </div>
          </div>

          {/* Column 2: Navigation Pathways */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#B49A61]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('scenario')}
                  className="hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Ethical Scenario
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('principles')}
                  className="hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  IKS Principles Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('risks')}
                  className="hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Two Primary Ethical Risks
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('safeguards')}
                  className="hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Two Essential Safeguards
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('simulator')}
                  className="hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Decision Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('assessment')}
                  className="hover:text-[#FFFDF8] transition-colors cursor-pointer"
                >
                  Learning Assessment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Foundations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#B49A61]">
              Epistemological Pillars
            </h4>
            <ul className="space-y-1.5 text-xs text-[#E8DDCA]/80">
              <li><strong className="text-[#FFFDF8]">Dharma:</strong> Responsibility &amp; Human Oversight</li>
              <li><strong className="text-[#FFFDF8]">Ahimsa:</strong> Non-Harm &amp; Preserving Dignity</li>
              <li><strong className="text-[#FFFDF8]">Nyaya &amp; Samata:</strong> Contextual Fairness &amp; Justice</li>
              <li><strong className="text-[#FFFDF8]">Panchakosha:</strong> Holistic Multi-Attribute Well-being</li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleNav('about')}
                className="text-xs text-[#B49A61] hover:text-[#FFFDF8] underline transition-colors cursor-pointer"
              >
                View Project Details &amp; References →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#E8DDCA]/60">
          <p className="max-w-2xl leading-relaxed">
            <strong>Academic Note:</strong> This application presents interpretive applications of classical Indian philosophical traditions to contemporary computational ethics. It does not assert historical claims that ancient treatises explicitly anticipated modern digital neural networks.
          </p>
          <div className="whitespace-nowrap shrink-0 text-[#E8DDCA]/50">
            Educational Research Edition · 2026
          </div>
        </div>
      </div>
    </footer>
  );
};
