// ============= OFFLINE PROGRESS CALCULATOR TESTS =============
// Tests for the offline progress calculation system
//
// NOTE: Integration tests (marked .skip) require:
// 1. Database connection
// 2. Seeded quest/dungeon data
// Run these after Backend seeds the database

import { describe, it, expect, beforeAll } from 'vitest';
import type { Character } from '@shared/schema';
import { MAX_OFFLINE_HOURS, MAX_LEVEL } from '@shared/constants/gameConfig';

// ============= TEST HELPERS =============
// Defined before tests to avoid ESM hoisting issues

function createTestCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    userId: 1,
    name: 'TestChar',
    characterClass: 'warrior',
    level: 10,
    experience: 0,
    gold: 100,
    baseStrength: 20,
    baseAgility: 10,
    baseIntellect: 8,
    baseStamina: 18,
    baseSpirit: 10,
    currentHealth: 200,
    maxHealth: 200,
    currentResource: 0,
    maxResource: 100,
    talentPointsAvailable: 0,
    talentTree1Points: [],
    talentTree2Points: [],
    talentTree3Points: [],
    respecCount: 0,
    currentActivity: null,
    currentActivityId: null,
    currentDifficulty: 'normal',
    activityStartedAt: null,
    activityCompletesAt: null,
    activityProgress: 0,
    restedXp: 0,
    maxRestedXp: 0,
    totalPlaytime: 0,
    totalKills: 0,
    totalDeaths: 0,
    totalDamageDealt: 0,
    createdAt: new Date(),
    lastPlayedAt: new Date(),
    isDeleted: false,
    ...overrides,
  } as Character;
}

describe('Offline Progress Calculator', () => {
  // ============= TIME CALCULATION TESTS =============
  // These test pure calculation logic

  describe('Time Calculation', () => {
    it('should cap offline time at 18 hours maximum', async () => {
      const { calculateOfflineProgress } = await import('../server/game/systems/OfflineCalculator');

      // Character with no activity (idle) - tests time capping without DB access
      const character = createTestCharacter({ currentActivity: null });
      const lastOnline = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const returnedAt = new Date();

      const result = await calculateOfflineProgress(character, lastOnline, returnedAt);

      expect(result.cappedAt18Hours).toBe(true);
      expect(result.effectiveDurationSeconds).toBe(MAX_OFFLINE_HOURS * 60 * 60);
    });

    it('should return exact duration if under 18 hours', async () => {
      const { calculateOfflineProgress } = await import('../server/game/systems/OfflineCalculator');

      const character = createTestCharacter({ currentActivity: null });
      const hoursOffline = 5;
      const lastOnline = new Date(Date.now() - hoursOffline * 60 * 60 * 1000);
      const returnedAt = new Date();

      const result = await calculateOfflineProgress(character, lastOnline, returnedAt);

      expect(result.cappedAt18Hours).toBe(false);
      // Allow 2 second tolerance for test execution time
      expect(result.effectiveDurationSeconds).toBeCloseTo(hoursOffline * 60 * 60, -1);
    });

    it('should handle edge case of 0 offline time', async () => {
      const { calculateOfflineProgress } = await import('../server/game/systems/OfflineCalculator');

      const character = createTestCharacter({ currentActivity: null });
      const now = new Date();

      const result = await calculateOfflineProgress(character, now, now);

      expect(result.offlineDurationSeconds).toBe(0);
      expect(result.effectiveDurationSeconds).toBe(0);
      expect(result.cappedAt18Hours).toBe(false);
      expect(result.cyclesCompleted).toBe(0);
    });

    it('should handle very short offline time (< 1 minute)', async () => {
      const { calculateOfflineProgress } = await import('../server/game/systems/OfflineCalculator');

      const character = createTestCharacter({ currentActivity: null });
      const lastOnline = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      const returnedAt = new Date();

      const result = await calculateOfflineProgress(character, lastOnline, returnedAt);

      expect(result.offlineDurationSeconds).toBeLessThan(60);
      expect(result.cyclesCompleted).toBe(0);
    });
  });

  // ============= IDLE ACTIVITY TESTS =============

  describe('Idle Activity', () => {
    it('should return minimal progress when idle', async () => {
      const { calculateOfflineProgress } = await import('../server/game/systems/OfflineCalculator');

      const character = createTestCharacter({
        currentActivity: 'idle',
        currentActivityId: null,
      });

      const lastOnline = new Date(Date.now() - 5 * 60 * 60 * 1000);
      const returnedAt = new Date();

      const result = await calculateOfflineProgress(character, lastOnline, returnedAt);

      expect(result.activityPerformed).toBe('Resting');
      expect(result.xpEarned).toBe(0);
      expect(result.goldEarned).toBe(0);
      expect(result.itemsFound).toHaveLength(0);
      expect(result.died).toBe(false);
    });

    it('should treat null activity as resting', async () => {
      const { calculateOfflineProgress } = await import('../server/game/systems/OfflineCalculator');

      const character = createTestCharacter({
        currentActivity: null,
        currentActivityId: null,
      });

      const lastOnline = new Date(Date.now() - 60 * 60 * 1000);
      const returnedAt = new Date();

      const result = await calculateOfflineProgress(character, lastOnline, returnedAt);

      expect(result.activityPerformed).toBe('Resting');
    });
  });

  // ============= INTEGRATION TESTS =============
  // These require seeded database - skip until Backend runs seed

  describe.skip('XP Calculation (requires seeded DB)', () => {
    it('should award correct XP per quest cycle', async () => {
      // Requires: Quest in database with id matching character.currentActivityId
    });

    it('should apply difficulty modifiers to rewards', async () => {
      // Requires: Quest in database
    });

    it('should handle multiple level-ups during offline', async () => {
      // Requires: Quest in database with high XP reward
    });

    it('should stop XP gain at max level (60)', async () => {
      // Requires: Quest in database
    });
  });

  describe.skip('Death Handling (requires seeded DB)', () => {
    it('should stop progress on death', async () => {
      // Requires: High-level quest in database
    });

    it('should preserve rewards earned before death', async () => {
      // Requires: Quest in database
    });

    it('should scale death chance with difficulty', async () => {
      // Requires: Quest in database
    });
  });

  describe.skip('Loot Generation (requires seeded DB)', () => {
    it('should generate items based on activity loot tables', async () => {
      // Requires: Dungeon with bosses in database
    });
  });
});
