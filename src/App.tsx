import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { EthicalScenario } from './pages/EthicalScenario';
import { IKSPrinciples } from './pages/IKSPrinciples';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { Safeguards } from './pages/Safeguards';
import { DecisionSimulator } from './pages/DecisionSimulator';
import { Assessment } from './pages/Assessment';
import { About } from './pages/About';

export default function App() {
  // Support deep linking via hash
  const getTabFromHash = (): PageTab => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validTabs: PageTab[] = [
      'home', 
      'scenario', 
      'principles', 
      'risks', 
      'safeguards', 
      'simulator', 
      'assessment', 
      'about'
    ];
    return validTabs.includes(hash as PageTab) ? (hash as PageTab) : 'home';
  };

  const [activeTab, setActiveTabState] = useState<PageTab>(getTabFromHash);

  const setActiveTab = (tab: PageTab) => {
    setActiveTabState(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EA] text-[#282923] relative selection:bg-[#E8DDCA] selection:text-[#243B32]">
      {/* Subtle Live Background Ambient Drift (Restrained, no neon, no glow) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle geometric mandala watermark drifting slowly in background */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-[#DDD3C2]/40 opacity-40 lattice-pattern"
          style={{ animation: 'spin 180s linear infinite' }}
        />
        <div 
          className="absolute top-1/2 -left-48 w-[500px] h-[500px] rounded-full border border-[#B49A61]/20 opacity-30 manuscript-pattern"
          style={{ animation: 'spin 240s linear infinite reverse' }}
        />
        <div 
          className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full border border-[#DDD3C2]/30 opacity-25"
        />
      </div>

      {/* Main Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Content Body */}
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'scenario' && <EthicalScenario setActiveTab={setActiveTab} />}
        {activeTab === 'principles' && <IKSPrinciples setActiveTab={setActiveTab} />}
        {activeTab === 'risks' && <RiskAnalysis setActiveTab={setActiveTab} />}
        {activeTab === 'safeguards' && <Safeguards setActiveTab={setActiveTab} />}
        {activeTab === 'simulator' && <DecisionSimulator setActiveTab={setActiveTab} />}
        {activeTab === 'assessment' && <Assessment setActiveTab={setActiveTab} />}
        {activeTab === 'about' && <About setActiveTab={setActiveTab} />}
      </main>

      {/* Editorial Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
