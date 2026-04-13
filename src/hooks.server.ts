import { getSession } from '$lib/server/db/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session');
  const user = await getSession(token || '');
  event.locals.user = user ? { id: user.id, email: user.email, nickname: user.nickname } : null;
  return resolve(event);
};
