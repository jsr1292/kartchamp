import { pgTable, text, integer, timestamp, jsonb, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  nickname: text('nickname'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const championships = pgTable('championships', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  pointsSystem: jsonb('points_system').notNull().$type<number[]>(),
  dropWorst: integer('drop_worst').default(0).notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const drivers = pgTable('drivers', {
  id: uuid('id').defaultRandom().primaryKey(),
  nickname: text('nickname').notNull(),
  number: integer('number'),
  realName: text('real_name'),
  championshipId: uuid('championship_id').references(() => championships.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tracks = pgTable('tracks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  layout: text('layout'),
  ownerId: uuid('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const races = pgTable('races', {
  id: uuid('id').defaultRandom().primaryKey(),
  championshipId: uuid('championship_id').references(() => championships.id).notNull(),
  trackId: uuid('track_id').references(() => tracks.id),
  name: text('name').notNull(),
  date: timestamp('date').notNull(),
  weather: text('weather').default('dry'),
  laps: integer('laps'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const results = pgTable('results', {
  id: uuid('id').defaultRandom().primaryKey(),
  raceId: uuid('race_id').references(() => races.id).notNull(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  position: integer('position').notNull(),
  totalTimeMs: integer('total_time_ms'),
  bestLapMs: integer('best_lap_ms'),
});

export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  championshipId: uuid('championship_id').references(() => championships.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role').default('member').notNull(), // owner, admin, member
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});
