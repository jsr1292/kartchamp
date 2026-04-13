import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createRace, addResults, getChampionshipById } from '$lib/server/db/queries';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { championshipId, name, date, track, weather, laps, results: raceResults } = body;

  if (!championshipId || !name || !date) {
    return json({ error: 'championshipId, name, and date are required' }, { status: 400 });
  }

  // Verify championship exists and user has access
  const championship = await getChampionshipById(championshipId);
  if (!championship) {
    return json({ error: 'Championship not found' }, { status: 404 });
  }

  // Create the race
  const race = await createRace({
    championshipId,
    name,
    date: new Date(date),
    track: track || undefined,
    weather: weather || 'dry',
    laps: laps || undefined,
  });

  // Add results if provided
  if (raceResults && raceResults.length > 0) {
    const resultsWithRaceId = raceResults.map((r: { driverId: string; position: number; totalTimeMs?: number | null; bestLapMs?: number | null }) => ({
      raceId: race.id,
      driverId: r.driverId,
      position: r.position,
      totalTimeMs: r.totalTimeMs ?? null,
      bestLapMs: r.bestLapMs ?? null,
    }));
    await addResults(resultsWithRaceId);
  }

  return json({ race }, { status: 201 });
};
