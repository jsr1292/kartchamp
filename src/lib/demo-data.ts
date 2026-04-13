// Demo data for development — remove when real DB is wired up
import type { RaceResult } from './scoring';

export const DEMO_POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export const DEMO_DRIVERS = [
  { id: 'd1', nickname: 'Speedy', number: 42, realName: 'Juanma' },
  { id: 'd2', nickname: 'Thunder', number: 7, realName: 'Carlos' },
  { id: 'd3', nickname: 'Nitro', number: 13, realName: 'Miguel' },
  { id: 'd4', nickname: 'Blaze', number: 99, realName: 'Ana' },
  { id: 'd5', nickname: 'Ghost', number: 3, realName: 'Pablo' },
  { id: 'd6', nickname: 'Razor', number: 21, realName: 'Laura' },
  { id: 'd7', nickname: 'Viper', number: 66, realName: 'Diego' },
  { id: 'd8', nickname: 'Shadow', number: 11, realName: 'Sara' },
];

export const DEMO_RACES = [
  { id: 'r1', name: 'Race 1', date: '2026-03-15', track: 'Karting Madrid - GP Layout' },
  { id: 'r2', name: 'Race 2', date: '2026-03-22', track: 'Karting Madrid - Short Circuit' },
  { id: 'r3', name: 'Race 3', date: '2026-04-05', track: 'Karting Madrid - GP Layout' },
  { id: 'r4', name: 'Race 4', date: '2026-04-12', track: 'Indoor Karting Boadilla' },
];

export const DEMO_RESULTS: RaceResult[] = [
  // Race 1
  { driverId: 'd1', driverNickname: 'Speedy', driverNumber: 42, position: 1, totalTimeMs: 185234, bestLapMs: 45210, points: 25, raceId: 'r1' },
  { driverId: 'd2', driverNickname: 'Thunder', driverNumber: 7, position: 2, totalTimeMs: 187012, bestLapMs: 44890, points: 18, raceId: 'r1' },
  { driverId: 'd3', driverNickname: 'Nitro', driverNumber: 13, position: 3, totalTimeMs: 189456, bestLapMs: 46100, points: 15, raceId: 'r1' },
  { driverId: 'd4', driverNickname: 'Blaze', driverNumber: 99, position: 4, totalTimeMs: 191234, bestLapMs: 45780, points: 12, raceId: 'r1' },
  { driverId: 'd5', driverNickname: 'Ghost', driverNumber: 3, position: 5, totalTimeMs: 193567, bestLapMs: 47200, points: 10, raceId: 'r1' },
  { driverId: 'd6', driverNickname: 'Razor', driverNumber: 21, position: 6, totalTimeMs: 195890, bestLapMs: 46890, points: 8, raceId: 'r1' },
  { driverId: 'd7', driverNickname: 'Viper', driverNumber: 66, position: 7, totalTimeMs: 198234, bestLapMs: 48100, points: 6, raceId: 'r1' },
  { driverId: 'd8', driverNickname: 'Shadow', driverNumber: 11, position: 8, totalTimeMs: 201567, bestLapMs: 47900, points: 4, raceId: 'r1' },
  // Race 2
  { driverId: 'd2', driverNickname: 'Thunder', driverNumber: 7, position: 1, totalTimeMs: 152340, bestLapMs: 37200, points: 25, raceId: 'r2' },
  { driverId: 'd1', driverNickname: 'Speedy', driverNumber: 42, position: 2, totalTimeMs: 153100, bestLapMs: 37890, points: 18, raceId: 'r2' },
  { driverId: 'd5', driverNickname: 'Ghost', driverNumber: 3, position: 3, totalTimeMs: 154890, bestLapMs: 38100, points: 15, raceId: 'r2' },
  { driverId: 'd4', driverNickname: 'Blaze', driverNumber: 99, position: 4, totalTimeMs: 156234, bestLapMs: 38450, points: 12, raceId: 'r2' },
  { driverId: 'd3', driverNickname: 'Nitro', driverNumber: 13, position: 5, totalTimeMs: 157890, bestLapMs: 38900, points: 10, raceId: 'r2' },
  { driverId: 'd8', driverNickname: 'Shadow', driverNumber: 11, position: 6, totalTimeMs: 159456, bestLapMs: 39200, points: 8, raceId: 'r2' },
  { driverId: 'd6', driverNickname: 'Razor', driverNumber: 21, position: 7, totalTimeMs: 161234, bestLapMs: 39500, points: 6, raceId: 'r2' },
  { driverId: 'd7', driverNickname: 'Viper', driverNumber: 66, position: 8, totalTimeMs: 163567, bestLapMs: 40100, points: 4, raceId: 'r2' },
  // Race 3
  { driverId: 'd1', driverNickname: 'Speedy', driverNumber: 42, position: 1, totalTimeMs: 188100, bestLapMs: 44900, points: 25, raceId: 'r3' },
  { driverId: 'd3', driverNickname: 'Nitro', driverNumber: 13, position: 2, totalTimeMs: 189567, bestLapMs: 45100, points: 18, raceId: 'r3' },
  { driverId: 'd2', driverNickname: 'Thunder', driverNumber: 7, position: 3, totalTimeMs: 190234, bestLapMs: 44200, points: 15, raceId: 'r3' },
  { driverId: 'd6', driverNickname: 'Razor', driverNumber: 21, position: 4, totalTimeMs: 192100, bestLapMs: 46300, points: 12, raceId: 'r3' },
  { driverId: 'd4', driverNickname: 'Blaze', driverNumber: 99, position: 5, totalTimeMs: 193890, bestLapMs: 45700, points: 10, raceId: 'r3' },
  { driverId: 'd8', driverNickname: 'Shadow', driverNumber: 11, position: 6, totalTimeMs: 195600, bestLapMs: 47100, points: 8, raceId: 'r3' },
  { driverId: 'd5', driverNickname: 'Ghost', driverNumber: 3, position: 7, totalTimeMs: 197800, bestLapMs: 46900, points: 6, raceId: 'r3' },
  { driverId: 'd7', driverNickname: 'Viper', driverNumber: 66, position: 8, totalTimeMs: 200100, bestLapMs: 48500, points: 4, raceId: 'r3' },
  // Race 4
  { driverId: 'd4', driverNickname: 'Blaze', driverNumber: 99, position: 1, totalTimeMs: 172100, bestLapMs: 41800, points: 25, raceId: 'r4' },
  { driverId: 'd1', driverNickname: 'Speedy', driverNumber: 42, position: 2, totalTimeMs: 173500, bestLapMs: 41200, points: 18, raceId: 'r4' },
  { driverId: 'd6', driverNickname: 'Razor', driverNumber: 21, position: 3, totalTimeMs: 174900, bestLapMs: 42500, points: 15, raceId: 'r4' },
  { driverId: 'd2', driverNickname: 'Thunder', driverNumber: 7, position: 4, totalTimeMs: 176200, bestLapMs: 41900, points: 12, raceId: 'r4' },
  { driverId: 'd3', driverNickname: 'Nitro', driverNumber: 13, position: 5, totalTimeMs: 177800, bestLapMs: 43100, points: 10, raceId: 'r4' },
  { driverId: 'd7', driverNickname: 'Viper', driverNumber: 66, position: 6, totalTimeMs: 179500, bestLapMs: 43700, points: 8, raceId: 'r4' },
  { driverId: 'd5', driverNickname: 'Ghost', driverNumber: 3, position: 7, totalTimeMs: 181200, bestLapMs: 44100, points: 6, raceId: 'r4' },
  { driverId: 'd8', driverNickname: 'Shadow', driverNumber: 11, position: 8, totalTimeMs: 183100, bestLapMs: 44800, points: 4, raceId: 'r4' },
];
