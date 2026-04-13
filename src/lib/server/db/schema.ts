import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, index, unique } from 'drizzle-orm/pg-core';

// ── Users ──────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Championships ──────────────────────────────────────────────────────────
export const championships = pgTable('championships', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  // Points system: array of points per position, e.g. [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
  pointsSystem: jsonb('points_system').$type<number[]>().default([25, 18, 15, 12, 10, 8, 6, 4, 2, 1]).notNull(),
  // Drop worst N races from standings
  dropWorst: integer('drop_worst').default(0).notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Drivers ────────────────────────────────────────────────────────────────
export const drivers = pgTable('drivers', {
  id: uuid('id').primaryKey().defaultRandom(),
  championshipId: uuid('championship_id').references(() => championships.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id), // link to user account (optional)
  nickname: varchar('nickname', { length: 50 }).notNull(),
  realName: varchar('real_name', { length: 100 }),
  number: integer('number'), // racing number like #42
  avatarUrl: text('avatar_url'),
  team: varchar('team', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_drivers_championship').on(table.championshipId),
  unique('unique_driver_number').on(table.championshipId, table.number),
]);

// ── Tracks ─────────────────────────────────────────────────────────────────
export const tracks = pgTable('tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  championshipId: uuid('championship_id').references(() => championships.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  layout: varchar('layout', { length: 100 }), // "Short Circuit", "GP Layout"
  location: varchar('location', { length: 200 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_tracks_championship').on(table.championshipId),
]);

// ── Races ──────────────────────────────────────────────────────────────────
export const races = pgTable('races', {
  id: uuid('id').primaryKey().defaultRandom(),
  championshipId: uuid('championship_id').references(() => championships.id, { onDelete: 'cascade' }).notNull(),
  trackId: uuid('track_id').references(() => tracks.id),
  name: varchar('name', { length: 200 }).notNull(), // "Race 1", "Round 3"
  date: timestamp('date').notNull(),
  type: varchar('type', { length: 20 }).default('official').notNull(), // 'official' | 'practice'
  weather: varchar('weather', { length: 50 }), // 'dry', 'wet', 'mixed'
  laps: integer('laps'),
  notes: text('notes'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_races_championship').on(table.championshipId),
  index('idx_races_date').on(table.date),
]);

// ── Race Results ───────────────────────────────────────────────────────────
export const results = pgTable('results', {
  id: uuid('id').primaryKey().defaultRandom(),
  raceId: uuid('race_id').references(() => races.id, { onDelete: 'cascade' }).notNull(),
  driverId: uuid('driver_id').references(() => drivers.id, { onDelete: 'cascade' }).notNull(),
  position: integer('position').notNull(), // 1st, 2nd, 3rd...
  totalTimeMs: integer('total_time_ms'), // total race time in milliseconds
  bestLapMs: integer('best_lap_ms'), // best lap time in milliseconds
  lapsCompleted: integer('laps_completed'),
  points: integer('points'), // calculated from championship points system
  notes: text('notes'),
}, (table) => [
  index('idx_results_race').on(table.raceId),
  index('idx_results_driver').on(table.driverId),
  unique('unique_result').on(table.raceId, table.driverId),
]);

// ── Championship Members (roles) ───────────────────────────────────────────
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  championshipId: uuid('championship_id').references(() => championships.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 20 }).default('driver').notNull(), // 'admin' | 'driver' | 'viewer'
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  unique('unique_member').on(table.championshipId, table.userId),
]);
