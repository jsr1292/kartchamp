import { getChampionshipBySlug, getDriversByChampionship, getRacesByChampionship, getResultsByRace } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const championship = await getChampionshipBySlug(params.slug);
  if (!championship) {
    return { championship: null, hasChampionship: false, drivers: [], racesWithResults: [] };
  }

  const drivers = await getDriversByChampionship(championship.id);
  const raceRows = await getRacesByChampionship(championship.id);

  const racesWithResults = [];
  for (const row of raceRows) {
    const raceResults = await getResultsByRace(row.race.id);
    racesWithResults.push({
      race: row.race,
      trackName: row.trackName || '',
      trackLayout: row.trackLayout || '',
      results: raceResults.map(r => ({
        ...r.result,
        driverNickname: r.driverNickname,
        driverNumber: r.driverNumber,
      })),
    });
  }

  return { championship, hasChampionship: true, drivers, racesWithResults };
};
