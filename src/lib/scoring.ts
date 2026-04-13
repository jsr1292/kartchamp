/**
 * Scoring engine — calculates championship standings from race results.
 */

export interface RaceResult {
  driverId: string;
  driverNickname: string;
  driverNumber: number | null;
  position: number;
  totalTimeMs: number | null;
  bestLapMs: number | null;
  points: number;
  raceId: string;
}

export interface DriverStanding {
  driverId: string;
  nickname: string;
  number: number | null;
  totalPoints: number;
  raceCount: number;
  wins: number;
  podiums: number;
  bestFinish: number;
  bestLapMs: number | null;
  results: RaceResult[];
}

export function calculateStandings(
  results: RaceResult[],
  pointsSystem: number[],
  dropWorst: number = 0
): DriverStanding[] {
  const driverMap = new Map<string, RaceResult[]>();

  for (const r of results) {
    if (!driverMap.has(r.driverId)) driverMap.set(r.driverId, []);
    driverMap.get(r.driverId)!.push(r);
  }

  const standings: DriverStanding[] = [];

  for (const [driverId, driverResults] of driverMap) {
    const scoredResults = driverResults.map(r => ({
      ...r,
      points: r.position <= pointsSystem.length ? (pointsSystem[r.position - 1] ?? 0) : 0,
    }));

    const sortedByPoints = [...scoredResults].sort((a, b) => a.points - b.points);
    const dropped = new Set(sortedByPoints.slice(0, dropWorst).map(r => r.raceId));
    const activeResults = scoredResults.filter(r => !dropped.has(r.raceId));
    const totalPoints = activeResults.reduce((s, r) => s + r.points, 0);

    const firstResult = driverResults[0];
    standings.push({
      driverId,
      nickname: firstResult.driverNickname,
      number: firstResult.driverNumber,
      totalPoints,
      raceCount: driverResults.length,
      wins: driverResults.filter(r => r.position === 1).length,
      podiums: driverResults.filter(r => r.position <= 3).length,
      bestFinish: Math.min(...driverResults.map(r => r.position)),
      bestLapMs: driverResults.reduce<number | null>((best, r) => {
        if (!r.bestLapMs) return best;
        if (!best || r.bestLapMs < best) return r.bestLapMs;
        return best;
      }, null),
      results: scoredResults,
    });
  }

  standings.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.podiums !== a.podiums) return b.podiums - a.podiums;
    return a.bestFinish - b.bestFinish;
  });

  return standings;
}

export function formatTime(ms: number | null): string {
  if (!ms) return '—';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  }
  return `${seconds}.${String(millis).padStart(3, '0')}`;
}

export function positionSuffix(pos: number): string {
  if (pos === 1) return 'st';
  if (pos === 2) return 'nd';
  if (pos === 3) return 'rd';
  return 'th';
}

export function positionColor(pos: number): string {
  if (pos === 1) return 'text-[var(--neon-yellow)]';
  if (pos === 2) return 'text-gray-300';
  if (pos === 3) return 'text-amber-600';
  return 'text-[var(--text-secondary)]';
}
