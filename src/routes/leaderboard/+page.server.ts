import { getChampionshipsByUser } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();
  let championships = [];
  if (user) {
    const rows = await getChampionshipsByUser(user.id);
    championships = rows.map(r => r.championship);
  }
  return { championships };
};
