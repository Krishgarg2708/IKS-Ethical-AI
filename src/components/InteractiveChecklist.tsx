import React, { useState } from 'react';
import { SafeguardControl } from '../types';
import { ETHICAL_SAFEGUARDS } from '../data/safeguards';
import { CheckCircle2, Clock, XCircle, RotateCcw, ShieldCheck, Filter } from 'lucide-react';

export const InteractiveChecklist: React.FC = () => {
  // Extract initial controls from both safeguards
  const initialControls: SafeguardControl[] = [
    ...ETHICAL_SAFEGUARDS[0].controls,
    ...ETHICAL_SAFEGUARDS[1].controls,
  ];

  const [controls, setControls] = useState<SafeguardControl[]>(initialControls);
  const [filterMode, setFilterMode] = useState<'all' | 'oversight' | 'fairness'>('all');

  const updateStatus = (id: string, newStatus: 'implemented' | 'pending' | 'unimplemented') => {
    setControls(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const resetAll = () => {
    setControls(initialControls);
  };

  // Calculations
  const total = controls.length;
  const implementedCount = controls.filter(c => c.status === 'implemented').length;
  const pendingCount = controls.filter(c => c.status === 'pending').length;
  const unimplementedCount = controls.filter(c => c.status === 'unimplemented').length;
  const scorePercent = Math.round((implementedCount / total) * 100);

  // Filtered view
  const filteredControls = controls.filter(c => {
    if (filterMode === 'oversight') return c.id.startsWith('ctrl-1') || c.id.startsWith('ctrl-2') || c.id.startsWith('ctrl-3') || c.id.startsWith('ctrl-4') || c.id.startsWith('ctrl-5');
    if (filterMode === 'fairness') return c.id.startsWith('ctrl-6') || c.id.startsWith('ctrl-7') || c.id.startsWith('ctrl-8') || c.id.startsWith('ctrl-9') || c.id.startsWith('ctrl-10');
    return true;
  });

  return (
    <div className="bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Top Banner & Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DDD3C2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B49A61] font-semibold">
            Institutional Audit
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#243B32]">
            Responsible AI Safeguards Checklist
          </h3>
          <p className="text-xs text-[#66675F] mt-1 max-w-xl">
            Evaluate and track institutional readiness across the two core safeguards. Click status tags on any control to simulate operational progress.
          </p>
        </div>

        {/* Dynamic Metric Dial */}
        <div className="flex items-center gap-4 bg-[#F7F3EA] border border-[#DDD3C2] p-4 rounded-lg self-start md:self-center">
          <div className="text-right">
            <span className="text-xs text-[#66675F] block uppercase tracking-wider">Implementation Rate</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-[#243B32]">
              {scorePercent}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#E8DDCA] border-t-[#243B32] flex items-center justify-center font-mono text-xs font-bold text-[#243B32]">
            {implementedCount}/{total}
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="space-y-2">
        <div className="flex h-3 w-full bg-[#E8DDCA] rounded-full overflow-hidden">
          <div style={{ width: `${(implementedCount / total) * 100}%` }} className="bg-[#243B32] transition-all duration-300" title="Implemented" />
          <div style={{ width: `${(pendingCount / total) * 100}%` }} className="bg-[#B49A61] transition-all duration-300" title="Pending" />
          <div style={{ width: `${(unimplementedCount / total) * 100}%` }} className="bg-[#A6533C]/40 transition-all duration-300" title="Unimplemented" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#66675F]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#243B32]" />
              <strong>{implementedCount}</strong> Implemented
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B49A61]" />
              <strong>{pendingCount}</strong> In Review / Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A6533C]/40" />
              <strong>{unimplementedCount}</strong> Unimplemented
            </span>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-[#66675F] hover:text-[#243B32] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default State</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-2 border-b border-[#DDD3C2] pb-3">
        <span className="text-xs uppercase tracking-wider text-[#66675F] flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
            filterMode === 'all'
              ? 'bg-[#243B32] text-[#FFFDF8] font-medium'
              : 'text-[#66675F] hover:bg-[#F7F3EA] hover:text-[#243B32]'
          }`}
        >
          All Controls ({total})
        </button>
        <button
          onClick={() => setFilterMode('oversight')}
          className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
            filterMode === 'oversight'
              ? 'bg-[#243B32] text-[#FFFDF8] font-medium'
              : 'text-[#66675F] hover:bg-[#F7F3EA] hover:text-[#243B32]'
          }`}
        >
          Safeguard 1: Human Oversight
        </button>
        <button
          onClick={() => setFilterMode('fairness')}
          className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
            filterMode === 'fairness'
              ? 'bg-[#243B32] text-[#FFFDF8] font-medium'
              : 'text-[#66675F] hover:bg-[#F7F3EA] hover:text-[#243B32]'
          }`}
        >
          Safeguard 2: Fairness Testing
        </button>
      </div>

      {/* Control Rows */}
      <div className="space-y-3">
        {filteredControls.map((ctrl) => {
          return (
            <div
              key={ctrl.id}
              className="p-4 rounded-lg border border-[#DDD3C2] bg-[#F7F3EA]/70 hover:bg-[#F7F3EA] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 text-xs text-[#66675F]">
                  <span className="font-semibold text-[#243B32]">{ctrl.relatedPrinciple}</span>
                  <span aria-hidden="true">·</span>
                  <span>{ctrl.mitigatesRisk}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#282923]">
                  {ctrl.title}
                </h4>
                <p className="text-xs text-[#66675F] leading-relaxed">
                  {ctrl.description}
                </p>
              </div>

              {/* Status Selector Buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                <button
                  onClick={() => updateStatus(ctrl.id, 'implemented')}
                  className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    ctrl.status === 'implemented'
                      ? 'bg-[#243B32] text-[#FFFDF8] font-medium shadow-xs'
                      : 'bg-[#E8DDCA]/60 text-[#66675F] hover:bg-[#E8DDCA]'
                  }`}
                  title="Mark as Implemented"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active</span>
                </button>
                <button
                  onClick={() => updateStatus(ctrl.id, 'pending')}
                  className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    ctrl.status === 'pending'
                      ? 'bg-[#B49A61] text-[#FFFDF8] font-medium shadow-xs'
                      : 'bg-[#E8DDCA]/60 text-[#66675F] hover:bg-[#E8DDCA]'
                  }`}
                  title="Mark as In Review / Pending"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                </button>
                <button
                  onClick={() => updateStatus(ctrl.id, 'unimplemented')}
                  className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    ctrl.status === 'unimplemented'
                      ? 'bg-[#A6533C] text-[#FFFDF8] font-medium shadow-xs'
                      : 'bg-[#E8DDCA]/60 text-[#66675F] hover:bg-[#E8DDCA]'
                  }`}
                  title="Mark as Unimplemented"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Off</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Institutional Legal & Ethical Caution */}
      <div className="p-4 bg-[#E8DDCA]/40 border border-[#DDD3C2] rounded-lg text-xs leading-relaxed text-[#66675F] space-y-1">
        <div className="font-semibold text-[#243B32] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#243B32]" />
          Governance Methodology Warning
        </div>
        <p>
          Completing an administrative checklist is a foundational step, but does not autonomously guarantee statutory or moral compliance. Under Indian Knowledge Systems, true <em>Dharma</em> requires ongoing active inquiry, empathetic institutional dialogue, and continual vigilance against emergent socio-technical harms.
        </p>
      </div>
    </div>
  );
};
