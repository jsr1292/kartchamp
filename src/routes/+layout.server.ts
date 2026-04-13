import { getSession } from '$lib/server/db/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('session');
  const user = await getSession(token || '');
  return { user: user ? { id: user.id, email: user.email, nickname: user.nickname } : null };
};
