// Authentication: scrypt password hashing + opaque session tokens in an httpOnly cookie.
// The server derives identity from the session only — student IDs sent by the client are never trusted.
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { DB } from './db.ts';

export interface SessionUser {
  id: number;
  role: 'student' | 'teacher';
  name: string;
  username: string;
  isDemo: boolean;
  studentCode?: string;
  classLevel?: string;
  subjects?: string[];
}

declare module 'express-serve-static-core' {
  interface Request { user?: SessionUser }
}

const COOKIE = 'swl_session';
const SESSION_DAYS = 7;

export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(pw, salt, 64);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [scheme, saltHex, keyHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
  const key = crypto.scryptSync(pw, Buffer.from(saltHex, 'hex'), 64);
  const expected = Buffer.from(keyHex, 'hex');
  return expected.length === key.length && crypto.timingSafeEqual(expected, key);
}

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

export function createSession(db: DB, res: Response, userId: number) {
  const token = crypto.randomBytes(32).toString('base64url');
  db.prepare(`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', ?))`)
    .run(sha256(token), userId, `+${SESSION_DAYS} days`);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 86400_000,
    path: '/',
  });
}

export function destroySession(db: DB, req: Request, res: Response) {
  const token = readCookie(req);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
  res.clearCookie(COOKIE, { path: '/' });
}

function readCookie(req: Request): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function loadUser(db: DB, userId: number): SessionUser | undefined {
  const u = db.prepare(`SELECT u.id, u.role, u.name, u.username, u.is_demo, s.student_code, s.class_level
    FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.id = ?`).get(userId) as any;
  if (!u) return undefined;
  const user: SessionUser = { id: u.id, role: u.role, name: u.name, username: u.username, isDemo: !!u.is_demo };
  if (u.role === 'student') { user.studentCode = u.student_code; user.classLevel = u.class_level; }
  else {
    user.subjects = (db.prepare('SELECT subject FROM teacher_subjects WHERE teacher_id = ? ORDER BY subject').all(u.id) as any[]).map(r => r.subject);
  }
  return user;
}

export const sessionMiddleware = (db: DB) => (req: Request, _res: Response, next: NextFunction) => {
  const token = readCookie(req);
  if (token) {
    const row = db.prepare(`SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > datetime('now')`).get(sha256(token)) as any;
    if (row) req.user = loadUser(db, row.user_id);
  }
  next();
};

export const requireRole = (...roles: SessionUser['role'][]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' });
  if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: 'You do not have permission to access this resource.' });
  next();
};

/** Simple in-memory rate limiter for auth endpoints (per IP). */
export function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { n: number; t: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const h = hits.get(key);
    if (!h || now - h.t > windowMs) { hits.set(key, { n: 1, t: now }); return next(); }
    if (++h.n > max) return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' });
    next();
  };
}
