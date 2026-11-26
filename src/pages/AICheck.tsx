// AI Checker — 100% in-browser. No backend, no API key, nothing uploaded anywhere.
// Reuses the transparent SwaLekhan heuristic engine (server/analysis/engine.ts is pure TS).
import React, { useRef, useState } from 'react';
import { PageTab } from '../types';
import { analyse, type AnalysisResult } from '../../server/analysis/engine.ts';
import { extractText, MAX_MB } from '../lib/extract';
import { Upload, FileText, ShieldCheck, AlertTriangle, RotateCcw, Loader2 } from 'lucide-react';

interface Props { setActiveTab: (tab: PageTab) => void; }

const Bar: React.FC<{ label: string; pct: number; color: string }> = ({ label, pct, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1"><span>{label}</span><span className="font-semibold">{pct}%</span></div>
    <div className="h-3 rounded bg-[#E8DDCA] overflow-hidden"><div className="h-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} /></div>
  </div>
);

const catStyle: Record<string, string> = {
  ai_assisted: 'border-l-[#A6533C] bg-[#A6533C]/5',
  independent: 'border-l-[#243B32] bg-[#243B32]/5',
  uncertain: 'border-l-[#B8A98C] bg-[#B8A98C]/10',
};
const catLabel: Record<string, string> = { ai_assisted: 'Possible AI', independent: 'Human-like', uncertain: 'Inconclusive' };

export const AICheck: React.FC<Props> = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    setErr(''); setRes(null); setBusy(true);
    try { setText(await extractText(f)); setFileName(f.name); }
    catch (e: any) { setErr(e?.message || 'Could not read the file.'); }
    finally { setBusy(false); }
  };

  const run = async () => {
    setErr(''); setBusy(true);
    try { setRes(await analyse({ text })); } // no external scorer → heuristic only, fully offline
    catch (e: any) { setErr(e?.message || 'Analysis failed.'); setRes(null); }
    finally { setBusy(false); }
  };

  const reset = () => { setText(''); setFileName(''); setRes(null); setErr(''); };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-xs uppercase tracking-widest text-[#A6533C] mb-2">Frontend-only · No API key · Runs in your browser</p>
      <h1 className="font-serif text-4xl font-bold text-[#243B32] mb-3">AI Assignment Checker</h1>
      <p className="text-[#66675F] mb-8 max-w-3xl">
        Upload an assignment to estimate how much of it shows AI-writing patterns. The file never leaves your device —
        all analysis happens locally using transparent heuristics.
      </p>

      {!res && (
        <div className="space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
            className="cursor-pointer border-2 border-dashed border-[#B8A98C] rounded-lg p-10 text-center bg-[#FFFDF8] hover:border-[#A6533C] transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto text-[#A6533C] mb-2" />
            <p className="font-medium text-[#243B32]">{fileName ? <><FileText className="inline w-4 h-4 mr-1" />{fileName}</> : 'Click or drop a PDF, DOCX or TXT file'}</p>
            <p className="text-xs text-[#66675F] mt-1">Max {MAX_MB} MB</p>
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
          </div>
          <p className="text-center text-xs text-[#66675F]">— or paste the text —</p>
          <textarea
            value={text} onChange={e => setText(e.target.value)} rows={10}
            placeholder="Paste assignment text here (at least ~30 words)…"
            className="w-full p-4 rounded-lg border border-[#DDD3C2] bg-[#FFFDF8] text-sm focus:outline-none focus:border-[#A6533C]"
          />
          {err && <p className="text-sm text-[#A6533C] flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{err}</p>}
          <button
            disabled={busy || !text.trim()} onClick={run}
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#243B32] text-[#FFFDF8] text-sm uppercase tracking-wider disabled:opacity-40 cursor-pointer"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} Check assignment
          </button>
        </div>
      )}

      {res && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 items-center bg-[#FFFDF8] border border-[#DDD3C2] rounded-lg p-6">
            <div className="text-center">
              <div className="font-serif text-6xl font-bold text-[#A6533C]">{res.aiPct}%</div>
              <div className="text-sm text-[#66675F]">possible AI-generated</div>
              <div className="text-xs mt-2 text-[#66675F]">Confidence: <b>{res.confidenceLabel}</b> · {res.wordCount} words</div>
            </div>
            <div className="space-y-3">
              <Bar label="Possible AI-assisted" pct={res.aiPct} color="#A6533C" />
              <Bar label="Human / independent writing" pct={res.independentPct} color="#243B32" />
              <Bar label="Inconclusive" pct={res.uncertainPct} color="#B8A98C" />
            </div>
          </div>

          <p className="text-[#282923]">{res.summary}</p>

          {res.fairness.warnings.length > 0 && (
            <div className="space-y-2">
              {res.fairness.warnings.map((w, i) => (
                <div key={i} className="p-3 rounded border border-[#E8DDCA] bg-[#F7F3EA] text-sm">
                  <b className="text-[#243B32]">{w.title}</b> — {w.detail}
                </div>
              ))}
            </div>
          )}

          <div>
            <h2 className="font-serif text-2xl text-[#243B32] mb-3">Paragraph breakdown</h2>
            <div className="space-y-3">
              {res.paragraphs.map(p => (
                <div key={p.idx} className={`border-l-4 p-4 rounded-r ${catStyle[p.category]}`}>
                  <div className="flex justify-between text-xs uppercase tracking-wider mb-2">
                    <span className="font-semibold">¶{p.idx} · {catLabel[p.category]}</span>
                    <span>AI likelihood {Math.round(p.aiLikelihood * 100)}% · conf. {Math.round(p.confidence * 100)}%</span>
                  </div>
                  <p className="text-sm text-[#282923] mb-2">{p.text}</p>
                  {p.indicators.filter(i => i.direction !== 'neutral').length > 0 && (
                    <ul className="text-xs text-[#66675F] list-disc pl-5 space-y-0.5">
                      {p.indicators.filter(i => i.direction !== 'neutral').map((i, k) => (
                        <li key={k}><b>{i.signal}:</b> {i.explanation}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded bg-[#243B32]/5 text-xs text-[#66675F] space-y-1">
            <p className="flex items-center gap-2 font-semibold text-[#243B32]"><ShieldCheck className="w-4 h-4" />Limitations</p>
            {res.limitations.map((l, i) => <p key={i}>• {l}</p>)}
          </div>

          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#243B32] text-[#243B32] text-sm uppercase tracking-wider cursor-pointer">
            <RotateCcw className="w-4 h-4" /> Check another
          </button>
        </div>
      )}
    </div>
  );
};
