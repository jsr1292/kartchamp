import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/db/auth';

export const GET: RequestHandler = async ({ cookies }) => {
  const token = cookies.get('session');
  const user = await getSession(token || '');
  if (!user) {
    return json({ user: null });
  }
  return json({ user: { id: user.id, email: user.email, nickname: user.nickname } });
};
