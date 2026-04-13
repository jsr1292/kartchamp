import { db } from './index';
import { users, championships, drivers, races, results, tracks, members } from './schema';
import { eq, and, desc, inArray } from 'drizzle-orm';

// Championships
export async function createChampionship(data: {
  name: string; slug: string; description?: string; ownerId: string;
  pointsSystem: number[]; dropWorst: number;
}) {
  const [champ] = await db.insert(championships).values(data).returning();
  // Add owner as member
  await db.insert(members).values({ championshipId: champ.id, userId: data.ownerId, role: 'owner' });
  return champ;
}

export async function getChampionshipsByUser(userId: string) {
  return db.select({ championship: championships })
    .from(members)
    .innerJoin(championships, eq(members.championshipId, championships.id))
    .where(eq(members.userId, userId))
    .orderBy(desc(championships.createdAt));
}

export async function getChampionshipBySlug(slug: string) {
  const [row] = await db.select().from(championships).where(eq(championships.slug, slug));
  return row;
}

export async function getChampionshipById(id: string) {
  const [row] = await db.select().from(championships).where(eq(championships.id, id));
  return row;
}

// Drivers
export async function addDriver(data: { nickname: string; number?: number | null; realName?: string | null; championshipId: string }) {
  const [driver] = await db.insert(drivers).values(data).returning();
  return driver;
}

export async function getDriversByChampionship(championshipId: string) {
  return db.select().from(drivers).where(eq(drivers.championshipId, championshipId));
}

// Races
export async function createRace(data: {
  championshipId: string; name: string; date: Date; track?: string;
  weather?: string; laps?: number;
}) {
  const { track, ...rest } = data;
  // Create track if provided
  let trackId;
  if (track) {
    const [t] = await db.insert(tracks).values({ name: track }).returning();
    trackId = t.id;
  }
  const [race] = await db.insert(races).values({ ...rest, trackId }).returning();
  return race;
}

export async function getRacesByChampionship(championshipId: string) {
  return db.select({
    race: races,
    trackName: tracks.name,
    trackLayout: tracks.layout,
  })
    .from(races)
    .leftJoin(tracks, eq(races.trackId, tracks.id))
    .where(eq(races.championshipId, championshipId))
    .orderBy(desc(races.date));
}

// Results
export async function addResults(raceResults: { raceId: string; driverId: string; position: number; totalTimeMs?: number | null; bestLapMs?: number | null }[]) {
  return db.insert(results).values(raceResults).returning();
}

export async function getResultsByRace(raceId: string) {
  return db.select({
    result: results,
    driverNickname: drivers.nickname,
    driverNumber: drivers.number,
  })
    .from(results)
    .innerJoin(drivers, eq(results.driverId, drivers.id))
    .where(eq(results.raceId, raceId))
    .orderBy(results.position);
}

export async function getResultsByChampionship(championshipId: string) {
  const raceRows = await db.select({ id: races.id }).from(races)
    .where(eq(races.championshipId, championshipId));
  const raceIds = raceRows.map(r => r.id);
  if (raceIds.length === 0) return [];

  return db.select({
    result: results,
    driverNickname: drivers.nickname,
    driverNumber: drivers.number,
    raceId: results.raceId,
  })
    .from(results)
    .innerJoin(drivers, eq(results.driverId, drivers.id))
    .where(inArray(results.raceId, raceIds));
}
