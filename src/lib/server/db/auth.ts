import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from './index';
import { users, sessions } from './schema';
import { eq } from 'drizzle-orm';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createUser(email: string, password: string, nickname: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(users).values({ email, passwordHash, nickname }).returning();
  return user;
}

export async function authenticate(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const [session] = await db.insert(sessions).values({ userId, token, expiresAt }).returning();
  return session;
}

export async function getSession(token: string) {
  if (!token) return null;
  const [session] = await db.select().from(sessions).where(eq(sessions.token, token));
  if (!session) return null;
  if (new Date() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return null;
  }
  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  return user;
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}
