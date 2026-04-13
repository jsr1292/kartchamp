import { getChampionshipBySlug, getDriversByChampionship, getRacesByChampionship, getResultsByRace } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const championship = await getChampionshipBySlug(params.slug);
  if (!championship) {
    // Return demo data if no real championship found
    return { championship: null, drivers: [], racesWithResults: [] };
  }

  const drivers = await getDriversByChampionship(championship.id);
  const raceRows = await getRacesByChampionship(championship.id);

  const racesWithResults = [];
  for (const row of raceRows) {
    const results = await getResultsByRace(row.race.id);
    racesWithResults.push({
      ...row,
      results: results.map(r => ({
        ...r.result,
        driverNickname: r.driverNickname,
        driverNumber: r.driverNumber,
      })),
    });
  }

  return { championship, drivers, racesWithResults };
};
