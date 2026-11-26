import React, { useState } from 'react';
import { GraduationCap, BookOpenCheck } from 'lucide-react';
import { api, type Meta, type User } from '../api';
import { Alert, Btn, Card, Eyebrow, Field, inputCls, SwaLekhanMark } from '../ui';

export const AuthPanel: React.FC<{ meta: Meta | null; onAuthed: (u: User) => void }> = ({ meta, onAuthed }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [f, setF] = useState<Record<string, string>>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const r = mode === 'login' ? await api.login(f.username || '', f.password || '')
        : await api.register({ role, name: f.name, username: f.username, password: f.password, studentCode: f.studentCode, classLevel: f.classLevel, inviteCode: f.inviteCode, institution: f.institution, subjects });
      onAuthed(r.user);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <Card className="p-7 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center"><SwaLekhanMark size={48} /></div>
          <Eyebrow>SwaLekhan AI</Eyebrow>
          <h1 className="font-serif text-3xl font-bold text-[#243B32]">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        </div>
        <div className="grid grid-cols-2 p-1 bg-[#F7F3EA] rounded border border-[#DDD3C2] text-xs font-semibold uppercase tracking-wider">
          {(['login', 'register'] as const).map(m => <button key={m} type="button" onClick={() => { setMode(m); setErr(''); }} className={`py-2 rounded cursor-pointer ${mode === m ? 'bg-[#243B32] text-[#FFFDF8]' : 'text-[#66675F]'}`}>{m === 'login' ? 'Sign in' : 'Register'}</button>)}
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {([['student', GraduationCap, 'Student'], ['teacher', BookOpenCheck, 'Teacher']] as const).map(([r, Icon, l]) => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={`flex items-center justify-center gap-2 py-3 rounded border text-sm cursor-pointer ${role === r ? 'border-[#243B32] bg-[#243B32]/5 text-[#243B32] font-semibold' : 'border-[#DDD3C2] text-[#66675F]'}`}><Icon className="w-4 h-4" />{l}</button>))}
              </div>
              <Field label="Full name" required><input className={inputCls} value={f.name || ''} onChange={set('name')} autoComplete="name" /></Field>
              {role === 'student' ? (
                <>
                  <Field label="Student ID / registration number" required><input className={inputCls} value={f.studentCode || ''} onChange={set('studentCode')} /></Field>
                  <Field label="Class / academic level" required>
                    <select className={inputCls} value={f.classLevel || ''} onChange={set('classLevel')}><option value="">Select…</option>{meta?.classLevels.map(c => <option key={c}>{c}</option>)}</select>
                  </Field>
                </>
              ) : (
                <>
                  {!meta?.teacherRegistrationOpen && <Alert tone="info">Teacher registration needs an invite code from the administrator, so students cannot sign up as teachers.</Alert>}
                  <Field label="Teacher invite code" required><input className={inputCls} value={f.inviteCode || ''} onChange={set('inviteCode')} /></Field>
                  <Field label="Institution"><input className={inputCls} value={f.institution || ''} onChange={set('institution')} /></Field>
                  <Field label="Subjects you are authorised to review" required>
                    <div className="flex flex-wrap gap-1.5">{meta?.subjects.map(s => (
                      <button type="button" key={s} onClick={() => setSubjects(x => x.includes(s) ? x.filter(y => y !== s) : [...x, s])}
                        className={`px-2.5 py-1 rounded-full text-xs border cursor-pointer ${subjects.includes(s) ? 'bg-[#243B32] text-[#FFFDF8] border-[#243B32]' : 'border-[#DDD3C2] text-[#66675F]'}`}>{s}</button>))}</div>
                  </Field>
                </>
              )}
            </>
          )}
          <Field label="Username" required><input className={inputCls} value={f.username || ''} onChange={set('username')} autoComplete="username" /></Field>
          <Field label="Password" required hint={mode === 'register' ? 'At least 8 characters.' : undefined}><input type="password" className={inputCls} value={f.password || ''} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></Field>
          {err && <Alert>{err}</Alert>}
          <Btn type="submit" busy={busy} className="w-full py-3">{mode === 'login' ? 'Sign in' : 'Create account'}</Btn>
        </form>
        {meta?.demoAccounts && mode === 'login' && (
          <div className="text-[11px] text-[#66675F] border-t border-[#DDD3C2] pt-4">
            <span className="font-semibold text-[#A6533C]">Demo data is loaded.</span> Student: <code>demo.student</code> · Teacher: <code>demo.teacher</code> · password <code>demo-pass-2026</code>
          </div>)}
        <p className="text-[11px] text-[#66675F] text-center">SwaLekhan stores only what is needed: your name, ID, class and assignment text. Uploaded files are read and then discarded.</p>
      </Card>
    </div>
  );
};
