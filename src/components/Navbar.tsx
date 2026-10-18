import React, { useState } from 'react';
import { PageTab } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { tab: PageTab; label: string }[] = [
    { tab: 'home', label: 'Overview' },
    { tab: 'scenario', label: 'Ethical Scenario' },
    { tab: 'principles', label: 'IKS Principles' },
    { tab: 'risks', label: 'Risk Analysis' },
    { tab: 'safeguards', label: 'Safeguards' },
    { tab: 'simulator', label: 'Decision Simulator' },
    { tab: 'assessment', label: 'Assessment' },
    { tab: 'about', label: 'Project Info' },
  ];

  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F3EA]/95 backdrop-blur-sm border-b border-[#DDD3C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#243B32] hover:text-[#A6533C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            IKS &amp; Ethical AI
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.tab}
                  onClick={() => handleNavClick(link.tab)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs uppercase tracking-wider ${
                    isActive
                      ? 'text-[#243B32] font-semibold'
                      : 'text-[#66675F] hover:text-[#243B32]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#A6533C]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('scenario')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <span>Explore Scenario</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 text-[#243B32] hover:text-[#A6533C] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#DDD3C2] bg-[#FFFDF8] px-4 pt-3 pb-5 space-y-1 shadow-sm">
          {navLinks.map((link) => {
            const isActive = activeTab === link.tab;
            return (
              <button
                key={link.tab}
                onClick={() => handleNavClick(link.tab)}
                className={`w-full text-left px-3 py-2 text-sm uppercase tracking-wider font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-[#E8DDCA]/60 text-[#243B32] font-semibold'
                    : 'text-[#66675F] hover:bg-[#F7F3EA] hover:text-[#243B32]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#DDD3C2]">
            <button
              onClick={() => handleNavClick('scenario')}
              className="w-full text-center px-4 py-2.5 text-xs uppercase tracking-wider font-medium text-[#FFFDF8] bg-[#243B32] rounded hover:bg-[#1a2b25] transition-colors"
            >
              Explore Scenario
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
