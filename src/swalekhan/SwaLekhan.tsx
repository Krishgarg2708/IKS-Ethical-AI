// SwaLekhan AI (स्वलेखन) — module root: session, meta and sub-routing via #swalekhan/<view>/<id>.
import React, { useCallback, useEffect, useState } from 'react';
import { LogOut, ShieldCheck, ArrowLeft } from 'lucide-react';
import { api, type Meta, type User, ApiError } from './api';
import { Alert, Spinner, SwaLekhanMark } from './ui';
import { Landing } from './views/Landing';
import { AuthPanel } from './views/Auth';
import { StudentDashboard } from './views/StudentDashboard';
import { SubmitAssignment } from './views/SubmitAssignment';
import { ReportView } from './views/ReportView';
import { LearningJourney } from './views/LearningJourney';
import { TeacherDashboard } from './views/TeacherDashboard';

export type Route = { view: 'landing' | 'auth' | 'home' | 'submit' | 'report' | 'journey' | 'student'; id?: number };
export type Nav = (r: Route) => void;

const parse = (): Route => {
  const parts = window.location.hash.replace(/^#/, '').split('/');
  const view = (parts[1] || 'landing') as Route['view'];
  const id = parts[2] ? Number(parts[2]) : undefined;
  return ['landing', 'auth', 'home', 'submit', 'report', 'journey', 'student'].includes(view) ? { view, id } : { view: 'landing' };
};

export const SwaLekhan: React.FC = () => {
  const [route, setRoute] = useState<Route>(parse);
  const [user, setUser] = useState<User | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [boot, setBoot] = useState<'loading' | 'ready' | 'offline'>('loading');
  const [bootErr, setBootErr] = useState('');

  const nav: Nav = useCallback((r) => {
    const h = `#swalekhan${r.view === 'landing' ? '' : '/' + r.view}${r.id ? '/' + r.id : ''}`;
    if (window.location.hash !== h) window.history.pushState(null, '', h);
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const on = () => { if (window.location.hash.startsWith('#swalekhan')) setRoute(parse()); };
    window.addEventListener('popstate', on); window.addEventListener('hashchange', on);
    return () => { window.removeEventListener('popstate', on); window.removeEventListener('hashchange', on); };
  }, []);

  useEffect(() => {
    Promise.all([api.meta(), api.me()])
      .then(([m, me]) => { setMeta(m); setUser(me.user); setBoot('ready'); })
      .catch((e: ApiError) => { setBootErr(e.message); setBoot('offline'); });
  }, []);

  const logout = async () => { await api.logout().catch(() => {}); setUser(null); nav({ view: 'landing' }); };
  const needsAuth = ['home', 'submit', 'report', 'journey', 'student'].includes(route.view);

  let body: React.ReactNode;
  if (boot === 'loading') body = <Spinner label="Preparing SwaLekhan…" />;
  else if (needsAuth && boot === 'offline') body = <div className="max-w-2xl mx-auto py-10"><Alert>{bootErr} No analysis can run until the server is reachable — no results will be shown in the meantime.</Alert></div>;
  else if (needsAuth && !user) body = <AuthPanel meta={meta} onAuthed={(u) => { setUser(u); nav(route); }} />;
  else if (route.view === 'auth') body = user ? null : <AuthPanel meta={meta} onAuthed={(u) => { setUser(u); nav({ view: 'home' }); }} />;
  else if (route.view === 'landing' || !user) body = <Landing user={user} meta={meta} offline={boot === 'offline' ? bootErr : ''} nav={nav} />;
  else if (route.view === 'home') body = user.role === 'teacher' ? <TeacherDashboard user={user} meta={meta!} nav={nav} /> : <StudentDashboard user={user} nav={nav} />;
  else if (route.view === 'submit') body = user.role === 'student' ? <SubmitAssignment user={user} meta={meta!} nav={nav} /> : <Alert>Only students can submit assignments.</Alert>;
  else if (route.view === 'report' && route.id) body = <ReportView id={route.id} user={user} meta={meta!} nav={nav} />;
  else if (route.view === 'journey') body = <LearningJourney user={user} nav={nav} />;
  else if (route.view === 'student' && route.id && user.role === 'teacher') body = <LearningJourney user={user} nav={nav} studentId={route.id} />;
  else body = <Alert>Page not found.</Alert>;

  useEffect(() => { if (route.view === 'auth' && user) nav({ view: 'home' }); }, [route.view, user, nav]);

  return (
    <div className="pb-20">
      {/* Module bar */}
      <div className="border-b border-[#DDD3C2] bg-[#FFFDF8]/80 backdrop-blur-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <button onClick={() => nav({ view: user ? 'home' : 'landing' })} className="flex items-center gap-2.5 cursor-pointer min-w-0">
            <SwaLekhanMark size={30} />
            <span className="font-serif text-lg font-bold text-[#243B32] whitespace-nowrap">SwaLekhan <span className="text-[#B49A61]">AI</span></span>
            <span className="hidden sm:inline font-serif text-base text-[#A6533C]">स्वलेखन</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-4 text-xs min-w-0">
            {user && route.view !== 'landing' && route.view !== 'home' && (
              <button onClick={() => nav({ view: 'home' })} className="hidden sm:inline-flex items-center gap-1 text-[#66675F] hover:text-[#243B32] cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" />Dashboard</button>)}
            {user && route.view === 'landing' && <button onClick={() => nav({ view: 'home' })} className="text-[#243B32] font-semibold uppercase tracking-wider cursor-pointer">My dashboard</button>}
            {user ? (
              <>
                <span className="hidden md:inline-flex items-center gap-1.5 text-[#66675F] truncate"><ShieldCheck className="w-3.5 h-3.5 text-[#B49A61]" />{user.name} · <span className="capitalize">{user.role}</span>{user.isDemo && ' · demo'}</span>
                <button onClick={logout} className="inline-flex items-center gap-1 text-[#A6533C] hover:underline cursor-pointer"><LogOut className="w-3.5 h-3.5" />Sign out</button>
              </>
            ) : boot === 'ready' && route.view !== 'auth' && (
              <button onClick={() => nav({ view: 'auth' })} className="px-3 py-1.5 rounded bg-[#243B32] text-[#FFFDF8] uppercase tracking-wider font-semibold cursor-pointer">Sign in</button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">{body}</div>
    </div>
  );
};
