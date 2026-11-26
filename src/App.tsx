import React, { useState, useEffect, useCallback } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgress, BackToTop, useScrollReveal } from './components/Enhancements';
import { Home } from './pages/Home';
import { EthicalScenario } from './pages/EthicalScenario';
import { IKSPrinciples } from './pages/IKSPrinciples';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { Safeguards } from './pages/Safeguards';
import { DecisionSimulator } from './pages/DecisionSimulator';
import { Assessment } from './pages/Assessment';
import { About } from './pages/About';
import { RuralDivideLab } from './pages/RuralDivideLab';
import { AccessAudit } from './pages/AccessAudit';
import { AICheck } from './pages/AICheck';
import { SwaLekhan } from './swalekhan/SwaLekhan';

export default function App() {
  // Support deep linking via hash
  const getTabFromHash = (): PageTab => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    // SwaLekhan AI owns its own sub-routes: #swalekhan/<view>/<id>
    if (hash === 'swalekhan' || hash.startsWith('swalekhan/')) return 'swalekhan';
    const validTabs: PageTab[] = [
      'home', 
      'scenario', 
      'rural',
      'audit',
      'principles', 
      'risks', 
      'safeguards', 
      'simulator', 
      'assessment', 
      'about',
      'swalekhan',
      'aicheck'
    ];
    return validTabs.includes(hash as PageTab) ? (hash as PageTab) : 'home';
  };

  const [activeTab, setActiveTabState] = useState<PageTab>(getTabFromHash);
  const [loading, setLoading] = useState(true);
  const hideLoader = useCallback(() => setLoading(false), []);
  useScrollReveal([activeTab, loading]);

  const setActiveTab = (tab: PageTab) => {
    setActiveTabState(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    // (#swalekhan resets the module to its landing/dashboard page)
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
      {loading && <LoadingScreen onDone={hideLoader} />}
      <div className="print:hidden"><BackgroundAnimation /></div>

      {/* Main Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Content Body */}
      <ScrollProgress />
      <BackToTop />
      <main key={activeTab === 'swalekhan' ? 'swalekhan' : activeTab} className="flex-1 relative z-10 page-enter">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'scenario' && <EthicalScenario setActiveTab={setActiveTab} />}
        {activeTab === 'audit' && <AccessAudit setActiveTab={setActiveTab} />}
        {activeTab === 'rural' && <RuralDivideLab setActiveTab={setActiveTab} />}
        {activeTab === 'principles' && <IKSPrinciples setActiveTab={setActiveTab} />}
        {activeTab === 'risks' && <RiskAnalysis setActiveTab={setActiveTab} />}
        {activeTab === 'safeguards' && <Safeguards setActiveTab={setActiveTab} />}
        {activeTab === 'simulator' && <DecisionSimulator setActiveTab={setActiveTab} />}
        {activeTab === 'assessment' && <Assessment setActiveTab={setActiveTab} />}
        {activeTab === 'about' && <About setActiveTab={setActiveTab} />}
        {activeTab === 'swalekhan' && <SwaLekhan />}
        {activeTab === 'aicheck' && <AICheck setActiveTab={setActiveTab} />}
      </main>

      {/* Editorial Footer */}
      <div className="print:hidden"><Footer setActiveTab={setActiveTab} /></div>
    </div>
  );
}
