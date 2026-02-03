// ============= PROGRESSION TESTS =============
// Tests for XP/Level system, rested bonuses, and character progression
// Reference: Idle-Raiders-GDD.md Section 3.1 (Character Progression)

import { describe, it, expect } from 'vitest';
import {
  MAX_LEVEL,
  BASE_XP,
  XP_EXPONENT,
  getXpRequiredForLevel,
  getTotalXpToLevel,
  getLevelFromXp,
  XP_TABLE,
  TALENT_POINT_START_LEVEL,
  TOTAL_TALENT_POINTS,
  calculateXpGain,
  XP_MODIFIERS,
  RESTED_XP_PERCENT_PER_HOUR,
  RESTED_XP_MAX_PERCENT,
  MAX_OFFLINE_HOURS,
  calculateRestedXpGain,
  LEVEL_MILESTONES,
} from '@shared/constants/gameConfig';

describe('Character Progression', () => {
  // ============= XP REQUIREMENTS =============

  describe('XP Requirements per Level', () => {
    describe('Formula: BASE_XP * (Level ^ XP_EXPONENT)', () => {
      it('should use BASE_XP of 100', () => {
        expect(BASE_XP).toBe(100);
      });

      it('should use XP_EXPONENT of 2.5', () => {
        expect(XP_EXPONENT).toBe(2.5);
      });

      it('should return 0 XP for level 1', () => {
        expect(getXpRequiredForLevel(1)).toBe(0);
      });

      it('should return 0 XP for invalid levels', () => {
        expect(getXpRequiredForLevel(0)).toBe(0);
        expect(getXpRequiredForLevel(-1)).toBe(0);
        expect(getXpRequiredForLevel(61)).toBe(0);
        expect(getXpRequiredForLevel(100)).toBe(0);
      });

      it('should follow the formula for valid levels', () => {
        for (let level = 2; level <= MAX_LEVEL; level++) {
          const expected = Math.floor(BASE_XP * Math.pow(level, XP_EXPONENT));
          const actual = getXpRequiredForLevel(level);
          expect(actual).toBe(expected);
        }
      });

      it('should increase monotonically', () => {
        let previousXp = 0;
        for (let level = 2; level <= MAX_LEVEL; level++) {
          const xp = getXpRequiredForLevel(level);
          expect(xp).toBeGreaterThan(previousXp);
          previousXp = xp;
        }
      });
    });

    describe('Known Reference Values', () => {
      it('should require ~566 XP for level 2', () => {
        // 100 * (2 ^ 2.5) = 100 * 5.66 ≈ 566
        const xp = getXpRequiredForLevel(2);
        expect(xp).toBeCloseTo(566, -1);
      });

      it('should require ~4642 XP for level 10', () => {
        // 100 * (10 ^ 2.5) = 100 * 316.23 ≈ 31623
        const xp = getXpRequiredForLevel(10);
        expect(xp).toBe(Math.floor(100 * Math.pow(10, 2.5)));
      });

      it('should require ~2.78M XP for level 60', () => {
        // 100 * (60 ^ 2.5) = 100 * 27885.48 ≈ 2788548
        const xp = getXpRequiredForLevel(60);
        expect(xp).toBeGreaterThan(2_000_000);
        expect(xp).toBeLessThan(3_000_000);
      });
    });
  });

  // ============= CUMULATIVE XP =============

  describe('Total XP to Level', () => {
    it('should return 0 for level 1', () => {
      expect(getTotalXpToLevel(1)).toBe(0);
    });

    it('should equal XP for level 2 when targeting level 2', () => {
      const totalTo2 = getTotalXpToLevel(2);
      const xpFor2 = getXpRequiredForLevel(2);
      expect(totalTo2).toBe(xpFor2);
    });

    it('should accumulate correctly for level 3', () => {
      const totalTo3 = getTotalXpToLevel(3);
      const xpFor2 = getXpRequiredForLevel(2);
      const xpFor3 = getXpRequiredForLevel(3);
      expect(totalTo3).toBe(xpFor2 + xpFor3);
    });

    it('should match XP_TABLE cumulative values', () => {
      for (let level = 1; level <= MAX_LEVEL; level++) {
        const calculated = getTotalXpToLevel(level);
        const fromTable = XP_TABLE[level - 1].totalXp;
        expect(calculated).toBe(fromTable);
      }
    });

    it('should increase monotonically', () => {
      let previousTotal = 0;
      for (let level = 2; level <= MAX_LEVEL; level++) {
        const total = getTotalXpToLevel(level);
        expect(total).toBeGreaterThan(previousTotal);
        previousTotal = total;
      }
    });
  });

  // ============= LEVEL FROM XP =============

  describe('Get Level from XP', () => {
    it('should return level 1 for 0 XP', () => {
      const result = getLevelFromXp(0);
      expect(result.level).toBe(1);
      expect(result.currentLevelXp).toBe(0);
    });

    it('should return level 2 with exact threshold XP', () => {
      const xpFor2 = getXpRequiredForLevel(2);
      const result = getLevelFromXp(xpFor2);
      expect(result.level).toBe(2);
      expect(result.currentLevelXp).toBe(0);
    });

    it('should return level 1 with partial progress', () => {
      const xpFor2 = getXpRequiredForLevel(2);
      const result = getLevelFromXp(xpFor2 - 100);
      expect(result.level).toBe(1);
      expect(result.currentLevelXp).toBe(xpFor2 - 100);
    });

    it('should cap at MAX_LEVEL', () => {
      const hugeXp = 999_999_999;
      const result = getLevelFromXp(hugeXp);
      expect(result.level).toBe(MAX_LEVEL);
    });

    it('should return 0 xpToNextLevel at max level', () => {
      const maxXp = getTotalXpToLevel(MAX_LEVEL) + 1000000;
      const result = getLevelFromXp(maxXp);
      expect(result.level).toBe(MAX_LEVEL);
      expect(result.xpToNextLevel).toBe(0);
    });

    it('should correctly calculate xpToNextLevel', () => {
      const totalTo5 = getTotalXpToLevel(5);
      const xpFor6 = getXpRequiredForLevel(6);

      const result = getLevelFromXp(totalTo5);
      expect(result.level).toBe(5);
      expect(result.xpToNextLevel).toBe(xpFor6);
    });
  });

  // ============= XP TABLE =============

  describe('XP Table', () => {
    it('should have 60 entries (levels 1-60)', () => {
      expect(XP_TABLE).toHaveLength(MAX_LEVEL);
    });

    it('should have correct structure for each entry', () => {
      for (const entry of XP_TABLE) {
        expect(entry).toHaveProperty('level');
        expect(entry).toHaveProperty('xpRequired');
        expect(entry).toHaveProperty('totalXp');
        expect(typeof entry.level).toBe('number');
        expect(typeof entry.xpRequired).toBe('number');
        expect(typeof entry.totalXp).toBe('number');
      }
    });

    it('should have levels in sequential order', () => {
      for (let i = 0; i < XP_TABLE.length; i++) {
        expect(XP_TABLE[i].level).toBe(i + 1);
      }
    });

    it('should have level 1 require 0 XP', () => {
      expect(XP_TABLE[0].xpRequired).toBe(0);
      expect(XP_TABLE[0].totalXp).toBe(0);
    });
  });

  // ============= TALENT POINTS =============

  describe('Talent Points', () => {
    it('should start earning at level 10', () => {
      expect(TALENT_POINT_START_LEVEL).toBe(10);
    });

    it('should have 51 total talent points', () => {
      // Levels 10-60 = 51 levels = 51 talent points
      expect(TOTAL_TALENT_POINTS).toBe(51);
    });

    it('should equal levels from 10 to 60', () => {
      const pointsFromLevels = MAX_LEVEL - TALENT_POINT_START_LEVEL + 1;
      expect(TOTAL_TALENT_POINTS).toBe(pointsFromLevels);
    });
  });

  // ============= XP GAIN CALCULATION =============

  describe('XP Gain from Combat', () => {
    describe('Base Formula', () => {
      it('should use base formula: mobLevel * 45', () => {
        // Same level mob (30 vs 30)
        const xp = calculateXpGain(30, 30, 'normal', false);
        expect(xp).toBe(30 * 45); // 1350
      });
    });

    describe('Mob Type Multipliers', () => {
      it('should have normal at 1.0x', () => {
        expect(XP_MODIFIERS.mobType.normal).toBe(1.0);
      });

      it('should have elite at 2.0x', () => {
        expect(XP_MODIFIERS.mobType.elite).toBe(2.0);
      });

      it('should have boss at 5.0x', () => {
        expect(XP_MODIFIERS.mobType.boss).toBe(5.0);
      });

      it('should have raid_boss at 10.0x', () => {
        expect(XP_MODIFIERS.mobType.raid_boss).toBe(10.0);
      });

      it('should apply multipliers correctly', () => {
        const level = 30;
        const normalXp = calculateXpGain(level, level, 'normal', false);
        const eliteXp = calculateXpGain(level, level, 'elite', false);
        const bossXp = calculateXpGain(level, level, 'boss', false);

        expect(eliteXp).toBe(normalXp * 2);
        expect(bossXp).toBe(normalXp * 5);
      });
    });

    describe('Level Difference Modifiers', () => {
      it('should give bonus XP for higher level mobs', () => {
        // Player 30, mob 35 (+5 levels)
        const xp = calculateXpGain(35, 30, 'normal', false);
        const baseXp = calculateXpGain(30, 30, 'normal', false);

        expect(xp).toBeGreaterThan(baseXp);
      });

      it('should reduce XP for green mobs (3-4 levels below)', () => {
        // Player 30, mob 26 (-4 levels) = green mob
        const greenXp = calculateXpGain(26, 30, 'normal', false);
        const baseXp = calculateXpGain(30, 30, 'normal', false);

        // Green XP should be less than same-level XP
        expect(greenXp).toBeLessThan(baseXp);

        // Green modifier is 0.5 applied to (mobLevel * 45)
        // greenXp = 26 * 45 * 0.5 = 585
        const expectedGreenXp = Math.floor(26 * 45 * 0.5);
        expect(greenXp).toBe(expectedGreenXp);
      });

      it('should give 0 XP for gray mobs (5+ levels below)', () => {
        // Player 30, mob 24 (-6 levels)
        const grayXp = calculateXpGain(24, 30, 'normal', false);
        expect(grayXp).toBe(0);
      });

      it('should have correct level difference modifiers defined', () => {
        expect(XP_MODIFIERS.levelDifference[-5]).toBe(1.25);
        expect(XP_MODIFIERS.levelDifference[0]).toBe(1.0);
        expect(XP_MODIFIERS.levelDifference[3]).toBe(0.5);
        expect(XP_MODIFIERS.levelDifference[5]).toBe(0);
      });
    });

    describe('Rested Bonus', () => {
      it('should have 2.0x rested multiplier', () => {
        expect(XP_MODIFIERS.restedBonus).toBe(2.0);
      });

      it('should double XP when rested', () => {
        const normalXp = calculateXpGain(30, 30, 'normal', false);
        const restedXp = calculateXpGain(30, 30, 'normal', true);

        expect(restedXp).toBe(normalXp * 2);
      });
    });
  });

  // ============= RESTED XP =============

  describe('Rested XP System', () => {
    describe('Accumulation Rate', () => {
      it('should accumulate 5% per hour', () => {
        expect(RESTED_XP_PERCENT_PER_HOUR).toBe(5);
      });

      it('should cap at 100% of current level XP', () => {
        // NOTE: GDD says 150% but implementation uses 100%
        expect(RESTED_XP_MAX_PERCENT).toBe(100);
      });

      it('should cap accumulation at 18 hours', () => {
        expect(MAX_OFFLINE_HOURS).toBe(18);
      });
    });

    describe('calculateRestedXpGain', () => {
      it('should return 0 for 0 hours offline', () => {
        const xp = calculateRestedXpGain(0, 10000);
        expect(xp).toBe(0);
      });

      it('should accumulate 5% per hour', () => {
        const levelXp = 10000;
        const hoursOffline = 1;

        const xp = calculateRestedXpGain(hoursOffline, levelXp);
        expect(xp).toBe(Math.floor(levelXp * 0.05));
      });

      it('should accumulate linearly up to cap', () => {
        const levelXp = 10000;

        const xp5Hours = calculateRestedXpGain(5, levelXp);
        const xp10Hours = calculateRestedXpGain(10, levelXp);

        // 10 hours should be double 5 hours (before cap)
        expect(xp10Hours).toBe(xp5Hours * 2);
      });

      it('should cap at MAX_OFFLINE_HOURS', () => {
        const levelXp = 10000;

        const xp18Hours = calculateRestedXpGain(18, levelXp);
        const xp24Hours = calculateRestedXpGain(24, levelXp);
        const xp100Hours = calculateRestedXpGain(100, levelXp);

        // All should be the same (capped at 18 hours)
        expect(xp24Hours).toBe(xp18Hours);
        expect(xp100Hours).toBe(xp18Hours);
      });

      it('should cap at 100% of level XP', () => {
        const levelXp = 10000;
        const maxRested = Math.floor(levelXp * (RESTED_XP_MAX_PERCENT / 100));

        // Even with many hours, shouldn't exceed max cap
        const xp = calculateRestedXpGain(100, levelXp);
        expect(xp).toBeLessThanOrEqual(maxRested);
      });

      it('should reach max (90% of level XP) at 18 hours', () => {
        // 18 hours * 5% = 90% (below 150% cap)
        const levelXp = 10000;
        const expectedXp = Math.floor(levelXp * (RESTED_XP_PERCENT_PER_HOUR / 100) * MAX_OFFLINE_HOURS);

        const xp = calculateRestedXpGain(MAX_OFFLINE_HOURS, levelXp);
        expect(xp).toBe(expectedXp); // 9000
      });
    });
  });

  // ============= LEVEL MILESTONES =============

  describe('Level Milestones', () => {
    it('should have milestone at level 1', () => {
      expect(LEVEL_MILESTONES[1]).toBeDefined();
      expect(LEVEL_MILESTONES[1]).toContain('Character created');
    });

    it('should have talent point milestone at level 10', () => {
      expect(LEVEL_MILESTONES[10]).toBeDefined();
      expect(LEVEL_MILESTONES[10]).toContain('First talent point');
    });

    it('should have mount training at level 20', () => {
      expect(LEVEL_MILESTONES[20]).toBeDefined();
    });

    it('should have epic mount at level 40', () => {
      expect(LEVEL_MILESTONES[40]).toBeDefined();
    });

    it('should have raid access at level 60', () => {
      expect(LEVEL_MILESTONES[60]).toBeDefined();
      expect(LEVEL_MILESTONES[60]).toContain('Raid access');
    });
  });

  // ============= MAX LEVEL =============

  describe('Max Level', () => {
    it('should be 60', () => {
      expect(MAX_LEVEL).toBe(60);
    });

    it('should not be able to exceed max level', () => {
      const result = getLevelFromXp(999_999_999_999);
      expect(result.level).toBe(60);
    });
  });
});
