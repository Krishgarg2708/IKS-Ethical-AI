import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, ClipboardType, X, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { api, fileToBase64, type Footprint, type Meta, type User, ApiError } from '../api';
import { Alert, Btn, Card, Eyebrow, Field, inputCls } from '../ui';
import { FootprintForm } from './FootprintForm';
import type { Nav } from '../SwaLekhan';

const ALLOWED = ['pdf', 'docx', 'txt'];

export const SubmitAssignment: React.FC<{ user: User; meta: Meta; nav: Nav }> = ({ user, meta, nav }) => {
  const [title, setTitle] = useState(''); const [subject, setSubject] = useState(''); const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'file' | 'paste'>('file');
  const [file, setFile] = useState<File | null>(null); const [text, setText] = useState('');
  const [fp, setFp] = useState<Footprint>({}); const [fpOpen, setFpOpen] = useState(false);
  const [stage, setStage] = useState<'' | 'upload' | 'analyse' | 'done'>('');
  const [err, setErr] = useState(''); const [errLink, setErrLink] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const inp = useRef<HTMLInputElement>(null);
  const wc = (text.match(/\S+/g) || []).length;

  const pick = (f: File | undefined | null) => {
    setErr('');
    if (!f) return;
    const ext = f.name.toLowerCase().split('.').pop() || '';
    if (!ALLOWED.includes(ext)) { setErr(`“.${ext}” is not supported. Please choose a PDF, DOCX or TXT file.`); return; }
    if (f.size > meta.maxFileMb * 1048576) { setErr(`This file is ${(f.size / 1048576).toFixed(1)} MB. The limit is ${meta.maxFileMb} MB.`); return; }
    if (f.size === 0) { setErr('This file is empty.'); return; }
    setFile(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setErrLink(null);
    if (!title.trim()) return setErr('Please enter an assignment title.');
    if (!subject) return setErr('Please select a subject.');
    if (mode === 'file' && !file) return setErr('Please choose a file, or switch to “Paste text”.');
    if (mode === 'paste' && wc < 30) return setErr(wc ? `Only ${wc} words. Please paste at least 30 words.` : 'Your submission is empty. Paste your assignment text.');
    try {
      setStage('upload');
      const body: any = { title, subject, description, footprint: fp };
      if (mode === 'file') body.file = { name: file!.name, dataBase64: await fileToBase64(file!) };
      else body.pastedText = text;
      const t = setTimeout(() => setStage('analyse'), 700);
      const r = await api.submit(body);
      clearTimeout(t);
      setStage('done');
      setTimeout(() => nav({ view: 'report', id: r.assignmentId }), 900);
    } catch (e: any) {
      setStage('');
      setErr(e.message);
      if (e instanceof ApiError && e.data?.assignmentId) setErrLink(e.data.assignmentId);
    }
  };

  if (stage) return (
    <Card className="max-w-lg mx-auto p-10 text-center space-y-6">
      <Eyebrow>Processing</Eyebrow>
      <div className="space-y-4 text-left">
        {[['upload', mode === 'file' ? 'Uploading & extracting text' : 'Receiving your text'], ['analyse', 'Nyaya fairness check & SwaLekhan analysis'], ['done', 'Generating your report']].map(([k, l], i) => {
          const order = ['upload', 'analyse', 'done']; const cur = order.indexOf(stage);
          const done = i < cur || stage === 'done'; const active = i === cur && stage !== 'done';
          return <div key={k} className={`flex items-center gap-3 text-sm ${done || active ? 'text-[#243B32]' : 'text-[#A8A79F]'}`}>
            {done ? <CheckCircle2 className="w-5 h-5 text-[#243B32]" /> : active ? <Loader2 className="w-5 h-5 animate-spin text-[#B49A61]" /> : <span className="w-5 h-5 rounded-full border border-[#DDD3C2]" />}{l}</div>;
        })}
      </div>
      {stage === 'done' && <p className="text-sm text-[#243B32] font-semibold">Submitted successfully. Opening your report…</p>}
    </Card>
  );

  return (
    <form onSubmit={submit} className="max-w-4xl mx-auto space-y-6" noValidate>
      <div className="space-y-1"><Eyebrow>Submit assignment</Eyebrow><h1 className="font-serif text-4xl font-bold text-[#243B32]">Share your work</h1>
        <p className="text-sm text-[#66675F]">Submitting as <b>{user.name}</b> ({user.studentCode}, {user.classLevel}). Your identity comes from your signed-in account.</p></div>

      <Card className="p-6 sm:p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Assignment title" required><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} maxLength={200} /></Field>
          <Field label="Subject" required><select className={inputCls} value={subject} onChange={e => setSubject(e.target.value)}><option value="">Select…</option>{meta.subjects.map(s => <option key={s}>{s}</option>)}</select></Field>
        </div>
        <Field label="Description"><textarea rows={2} className={inputCls} value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} placeholder="What was the assignment asking for?" /></Field>

        <div className="space-y-3">
          <div className="inline-flex p-1 bg-[#F7F3EA] rounded border border-[#DDD3C2] text-xs font-semibold uppercase tracking-wider">
            {([['file', UploadCloud, 'Upload file'], ['paste', ClipboardType, 'Paste text']] as const).map(([m, Icon, l]) => (
              <button type="button" key={m} onClick={() => { setMode(m); setErr(''); }} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded cursor-pointer ${mode === m ? 'bg-[#243B32] text-[#FFFDF8]' : 'text-[#66675F]'}`}><Icon className="w-3.5 h-3.5" />{l}</button>))}
          </div>
          {mode === 'file' ? (
            file ? (
              <div className="flex items-center justify-between gap-3 p-4 border border-[#243B32]/30 bg-[#243B32]/5 rounded-lg">
                <div className="flex items-center gap-3 min-w-0"><FileText className="w-6 h-6 text-[#243B32] shrink-0" /><div className="min-w-0"><div className="text-sm font-semibold truncate">{file.name}</div><div className="text-xs text-[#66675F]">{(file.size / 1024).toFixed(0)} KB</div></div></div>
                <button type="button" onClick={() => setFile(null)} aria-label="Remove file" className="p-1 text-[#A6533C] cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div onClick={() => inp.current?.click()} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-colors ${drag ? 'border-[#B49A61] bg-[#B49A61]/10' : 'border-[#DDD3C2] hover:border-[#B49A61]'}`}>
                <UploadCloud className="w-8 h-8 mx-auto text-[#B49A61]" />
                <div className="mt-2 text-sm text-[#243B32] font-semibold">Drop your file here or click to browse</div>
                <div className="text-xs text-[#66675F] mt-1">PDF, DOCX or TXT · max {meta.maxFileMb} MB · scanned PDFs cannot be read (no OCR)</div>
                <input ref={inp} type="file" accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={e => pick(e.target.files?.[0])} />
              </div>
            )
          ) : (
            <div><textarea rows={12} className={inputCls + ' font-serif text-base leading-relaxed'} value={text} onChange={e => setText(e.target.value)} placeholder="Paste your assignment here. Leave a blank line between paragraphs." />
              <div className="text-right text-[11px] text-[#66675F] mt-1">{wc} words</div></div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <button type="button" onClick={() => setFpOpen(!fpOpen)} className="w-full flex items-center justify-between p-6 text-left cursor-pointer">
          <div><Eyebrow>Optional · recommended</Eyebrow><div className="font-serif text-2xl font-bold text-[#243B32]">My Thinking Footprint</div><div className="text-sm text-[#66675F]">Tell the story of how you created this work.</div></div>
          <ChevronDown className={`w-5 h-5 text-[#66675F] transition-transform ${fpOpen ? 'rotate-180' : ''}`} />
        </button>
        {fpOpen && <div className="px-6 pb-6"><FootprintForm value={fp} onChange={setFp} helpTypes={meta.aiHelpTypes} /></div>}
      </Card>

      {err && <Alert>{err}{errLink && <> <button type="button" onClick={() => nav({ view: 'report', id: errLink })} className="underline font-semibold cursor-pointer">Open that submission</button></>}</Alert>}
      <div className="flex justify-end gap-3"><Btn type="button" variant="ghost" onClick={() => nav({ view: 'home' })}>Cancel</Btn><Btn type="submit">Submit for analysis</Btn></div>
    </form>
  );
};
