import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUser, authenticate, createSession } from '$lib/server/db/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const { action, email, password, nickname } = body;

  if (action === 'register') {
    if (!email || !password || !nickname) {
      return json({ error: 'Email, password, and nickname are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    try {
      const user = await createUser(email, password, nickname);
      const session = await createSession(user.id);
      cookies.set('session', session.token, {
        path: '/',
        httpOnly: true,
        secure: false, // true in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      return json({ user: { id: user.id, email: user.email, nickname: user.nickname } });
    } catch (e) {
      if (e.code === '23505') {
        return json({ error: 'Email already registered' }, { status: 409 });
      }
      return json({ error: 'Registration failed' }, { status: 500 });
    }
  }

  if (action === 'login') {
    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = await authenticate(email, password);
    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const session = await createSession(user.id);
    cookies.set('session', session.token, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return json({ user: { id: user.id, email: user.email, nickname: user.nickname } });
  }

  return json({ error: 'Invalid action' }, { status: 400 });
};
