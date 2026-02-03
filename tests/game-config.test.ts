// ============= GAME CONFIG FORMULA TESTS =============
// Unit tests for pure functions in shared/constants/gameConfig.ts

import { describe, it, expect } from 'vitest';
import {
  // XP Functions
  getXpRequiredForLevel,
  getTotalXpToLevel,
  getLevelFromXp,
  XP_TABLE,
  MAX_LEVEL,
  BASE_XP,
  XP_EXPONENT,

  // Combat Functions
  calculateArmorReduction,
  calculateAutoAttackDamage,
  calculateEffectiveAttackSpeed,
  DAMAGE_PER_AP,

  // Economy Functions
  calculateGoldDrop,
  calculateXpGain,
  calculateRestedXpGain,
  MAX_OFFLINE_HOURS,
  RESTED_XP_PERCENT_PER_HOUR,
  RESTED_XP_MAX_PERCENT,

  // Reputation
  getReputationLevel,
  REPUTATION_LEVELS,

  // Misc
  calculateRespecCost,
  calculateSuccessRate,
} from '@shared/constants/gameConfig';

// ============= XP CALCULATION TESTS =============

describe('XP Calculations', () => {
  describe('getXpRequiredForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(getXpRequiredForLevel(1)).toBe(0);
    });

    it('should return 0 for levels below 1', () => {
      expect(getXpRequiredForLevel(0)).toBe(0);
      expect(getXpRequiredForLevel(-1)).toBe(0);
    });

    it('should return 0 for levels above MAX_LEVEL', () => {
      expect(getXpRequiredForLevel(MAX_LEVEL + 1)).toBe(0);
      expect(getXpRequiredForLevel(100)).toBe(0);
    });

    it('should return positive values for valid levels 2-60', () => {
      for (let level = 2; level <= MAX_LEVEL; level++) {
        const xp = getXpRequiredForLevel(level);
        expect(xp, `Level ${level} XP should be positive`).toBeGreaterThan(0);
      }
    });

    it('should follow the formula: BASE_XP * (Level ^ XP_EXPONENT)', () => {
      // Test specific levels
      const testLevels = [2, 10, 30, 60];
      for (const level of testLevels) {
        const expected = Math.floor(BASE_XP * Math.pow(level, XP_EXPONENT));
        expect(getXpRequiredForLevel(level)).toBe(expected);
      }
    });

    it('should increase monotonically (each level requires more XP)', () => {
      for (let level = 3; level <= MAX_LEVEL; level++) {
        const prevXp = getXpRequiredForLevel(level - 1);
        const currXp = getXpRequiredForLevel(level);
        expect(currXp, `Level ${level} XP should be > level ${level - 1}`).toBeGreaterThan(prevXp);
      }
    });

    it('should produce known reference values', () => {
      // Level 2: 100 * 2^2.5 = 100 * 5.66 = 565
      expect(getXpRequiredForLevel(2)).toBe(Math.floor(100 * Math.pow(2, 2.5)));

      // Level 10: 100 * 10^2.5 = 100 * 316.23 = 31622
      expect(getXpRequiredForLevel(10)).toBe(Math.floor(100 * Math.pow(10, 2.5)));

      // Level 60: 100 * 60^2.5 = 100 * 27885.48 = 2788548
      expect(getXpRequiredForLevel(60)).toBe(Math.floor(100 * Math.pow(60, 2.5)));
    });
  });

  describe('getTotalXpToLevel', () => {
    it('should return 0 for level 1 and below', () => {
      expect(getTotalXpToLevel(1)).toBe(0);
      expect(getTotalXpToLevel(0)).toBe(0);
    });

    it('should return correct cumulative XP', () => {
      // Level 3 total = XP for level 2 + XP for level 3
      const level2Xp = getXpRequiredForLevel(2);
      const level3Xp = getXpRequiredForLevel(3);
      expect(getTotalXpToLevel(3)).toBe(level2Xp + level3Xp);
    });

    it('should match XP_TABLE cumulative values', () => {
      for (let level = 1; level <= 10; level++) {
        const tableEntry = XP_TABLE.find(e => e.level === level);
        expect(tableEntry).toBeDefined();
        expect(getTotalXpToLevel(level)).toBe(tableEntry!.totalXp);
      }
    });

    it('should increase monotonically', () => {
      for (let level = 2; level <= MAX_LEVEL; level++) {
        const prevTotal = getTotalXpToLevel(level - 1);
        const currTotal = getTotalXpToLevel(level);
        expect(currTotal).toBeGreaterThan(prevTotal);
      }
    });
  });

  describe('getLevelFromXp', () => {
    it('should return level 1 for 0 XP', () => {
      const result = getLevelFromXp(0);
      expect(result.level).toBe(1);
      expect(result.currentLevelXp).toBe(0);
    });

    it('should return correct level for exact level threshold', () => {
      const xpForLevel10 = getTotalXpToLevel(10);
      const result = getLevelFromXp(xpForLevel10);
      expect(result.level).toBe(10);
    });

    it('should return correct level for partial progress', () => {
      const xpForLevel5 = getTotalXpToLevel(5);
      const partialXp = xpForLevel5 + 100; // 100 XP into level 5
      const result = getLevelFromXp(partialXp);
      expect(result.level).toBe(5);
      expect(result.currentLevelXp).toBe(100);
    });

    it('should cap at MAX_LEVEL', () => {
      const hugeXp = getTotalXpToLevel(MAX_LEVEL) * 2;
      const result = getLevelFromXp(hugeXp);
      expect(result.level).toBe(MAX_LEVEL);
    });

    it('should return correct xpToNextLevel', () => {
      const result = getLevelFromXp(0);
      expect(result.xpToNextLevel).toBe(getXpRequiredForLevel(2));
    });

    it('should return 0 xpToNextLevel at max level', () => {
      const maxXp = getTotalXpToLevel(MAX_LEVEL);
      const result = getLevelFromXp(maxXp);
      expect(result.xpToNextLevel).toBe(0);
    });
  });

  describe('XP_TABLE', () => {
    it('should have entries for all 60 levels', () => {
      expect(XP_TABLE.length).toBe(MAX_LEVEL);
    });

    it('should have correct structure for each entry', () => {
      for (const entry of XP_TABLE) {
        expect(entry).toHaveProperty('level');
        expect(entry).toHaveProperty('xpRequired');
        expect(entry).toHaveProperty('totalXp');
        expect(entry.level).toBeGreaterThanOrEqual(1);
        expect(entry.level).toBeLessThanOrEqual(MAX_LEVEL);
      }
    });

    it('should have levels in order 1-60', () => {
      for (let i = 0; i < XP_TABLE.length; i++) {
        expect(XP_TABLE[i].level).toBe(i + 1);
      }
    });
  });
});

// ============= COMBAT FORMULA TESTS =============

describe('Combat Formulas', () => {
  describe('calculateArmorReduction', () => {
    it('should return 0% reduction for 0 armor', () => {
      expect(calculateArmorReduction(0, 60)).toBe(0);
    });

    it('should return positive reduction for positive armor', () => {
      const reduction = calculateArmorReduction(1000, 60);
      expect(reduction).toBeGreaterThan(0);
      expect(reduction).toBeLessThan(1);
    });

    it('should cap at 75% (0.75) reduction', () => {
      // Very high armor should cap at 75%
      const reduction = calculateArmorReduction(100000, 60);
      expect(reduction).toBe(0.75);
    });

    it('should follow formula: armor / (armor + 400 + 85 * level)', () => {
      const armor = 2000;
      const level = 60;
      const expected = armor / (armor + 400 + 85 * level);
      expect(calculateArmorReduction(armor, level)).toBeCloseTo(expected, 5);
    });

    it('should be affected by attacker level', () => {
      const armor = 1000;
      // Higher level attackers should penetrate more (lower reduction)
      const reductionVsLevel10 = calculateArmorReduction(armor, 10);
      const reductionVsLevel60 = calculateArmorReduction(armor, 60);
      expect(reductionVsLevel10).toBeGreaterThan(reductionVsLevel60);
    });

    it('should produce expected values at level 60', () => {
      // At level 60: denominator = armor + 400 + 5100 = armor + 5500
      // 2750 armor: 2750 / (2750 + 5500) = 2750/8250 = 0.333...
      const reduction = calculateArmorReduction(2750, 60);
      expect(reduction).toBeCloseTo(0.333, 2);
    });

    it('should handle edge case of level 0', () => {
      // Level 0: denominator = armor + 400
      const reduction = calculateArmorReduction(400, 0);
      expect(reduction).toBe(0.5); // 400 / (400 + 400) = 0.5
    });
  });

  describe('calculateAutoAttackDamage', () => {
    it('should calculate correct damage range', () => {
      const result = calculateAutoAttackDamage(10, 20, 2.5, 0);
      expect(result.min).toBe(10);
      expect(result.max).toBe(20);
      expect(result.average).toBe(15);
    });

    it('should add AP bonus based on weapon speed', () => {
      const weaponMin = 10;
      const weaponMax = 20;
      const weaponSpeed = 2.5;
      const attackPower = 140; // 140 AP = 10 bonus damage per 1.0 speed

      const result = calculateAutoAttackDamage(weaponMin, weaponMax, weaponSpeed, attackPower);

      // AP bonus = (140 / 14) * 2.5 = 10 * 2.5 = 25
      const expectedBonus = (attackPower / DAMAGE_PER_AP) * weaponSpeed;
      expect(result.min).toBe(Math.floor(weaponMin + expectedBonus));
      expect(result.max).toBe(Math.floor(weaponMax + expectedBonus));
    });

    it('should scale linearly with attack power', () => {
      const base = calculateAutoAttackDamage(10, 20, 2.5, 0);
      const with100AP = calculateAutoAttackDamage(10, 20, 2.5, 100);
      const with200AP = calculateAutoAttackDamage(10, 20, 2.5, 200);

      const diff1 = with100AP.average - base.average;
      const diff2 = with200AP.average - with100AP.average;

      expect(diff1).toBeCloseTo(diff2, 0);
    });

    it('should scale with weapon speed', () => {
      const fastWeapon = calculateAutoAttackDamage(10, 20, 1.5, 140);
      const slowWeapon = calculateAutoAttackDamage(10, 20, 3.0, 140);

      // Slow weapon gets more AP bonus
      expect(slowWeapon.average).toBeGreaterThan(fastWeapon.average);
    });

    it('should return floored values', () => {
      const result = calculateAutoAttackDamage(10, 20, 2.5, 1);
      expect(Number.isInteger(result.min)).toBe(true);
      expect(Number.isInteger(result.max)).toBe(true);
    });
  });

  describe('calculateEffectiveAttackSpeed', () => {
    it('should return base speed with 0% haste', () => {
      expect(calculateEffectiveAttackSpeed(2.5, 0)).toBe(2.5);
    });

    it('should decrease attack speed with positive haste', () => {
      const base = 2.5;
      const effective = calculateEffectiveAttackSpeed(base, 100);
      expect(effective).toBeLessThan(base);
    });

    it('should follow formula: baseSpeed / (1 + haste/100)', () => {
      // 50% haste: 2.5 / 1.5 = 1.666...
      const result = calculateEffectiveAttackSpeed(2.5, 50);
      expect(result).toBeCloseTo(2.5 / 1.5, 5);
    });

    it('should halve attack speed at 100% haste', () => {
      const result = calculateEffectiveAttackSpeed(2.0, 100);
      expect(result).toBe(1.0);
    });
  });
});

// ============= ECONOMY TESTS =============

describe('Economy Functions', () => {
  describe('calculateGoldDrop', () => {
    it('should return positive gold for any mob', () => {
      const gold = calculateGoldDrop(10, 'normal');
      expect(gold).toBeGreaterThan(0);
    });

    it('should scale with mob level', () => {
      // Average over multiple calls due to randomness
      const samples = 100;
      let lowLevelSum = 0;
      let highLevelSum = 0;

      for (let i = 0; i < samples; i++) {
        lowLevelSum += calculateGoldDrop(10, 'normal');
        highLevelSum += calculateGoldDrop(60, 'normal');
      }

      expect(highLevelSum / samples).toBeGreaterThan(lowLevelSum / samples);
    });

    it('should scale with mob type', () => {
      // Elite should drop more than normal
      const samples = 100;
      let normalSum = 0;
      let eliteSum = 0;
      let bossSum = 0;

      for (let i = 0; i < samples; i++) {
        normalSum += calculateGoldDrop(30, 'normal');
        eliteSum += calculateGoldDrop(30, 'elite');
        bossSum += calculateGoldDrop(30, 'boss');
      }

      expect(eliteSum).toBeGreaterThan(normalSum);
      expect(bossSum).toBeGreaterThan(eliteSum);
    });

    it('should return floored integer values', () => {
      for (let i = 0; i < 10; i++) {
        const gold = calculateGoldDrop(25, 'normal');
        expect(Number.isInteger(gold)).toBe(true);
      }
    });
  });

  describe('calculateXpGain', () => {
    it('should return positive XP for same-level mob', () => {
      const xp = calculateXpGain(30, 30, 'normal', false);
      expect(xp).toBeGreaterThan(0);
    });

    it('should apply mob type multipliers', () => {
      const normal = calculateXpGain(30, 30, 'normal', false);
      const elite = calculateXpGain(30, 30, 'elite', false);
      const boss = calculateXpGain(30, 30, 'boss', false);
      const raidBoss = calculateXpGain(30, 30, 'raid_boss', false);

      expect(elite).toBe(normal * 2);
      expect(boss).toBe(normal * 5);
      expect(raidBoss).toBe(normal * 10);
    });

    it('should reduce XP for green mobs (3-4 levels below)', () => {
      const sameLevel = calculateXpGain(30, 30, 'normal', false);
      const greenMob = calculateXpGain(26, 30, 'normal', false); // 4 levels below

      expect(greenMob).toBeLessThan(sameLevel);
    });

    it('should return 0 XP for gray mobs (5+ levels below)', () => {
      const xp = calculateXpGain(20, 30, 'normal', false); // 10 levels below
      expect(xp).toBe(0);
    });

    it('should increase XP for red mobs (5+ levels above)', () => {
      const sameLevel = calculateXpGain(30, 30, 'normal', false);
      const redMob = calculateXpGain(35, 30, 'normal', false); // 5 levels above

      expect(redMob).toBeGreaterThan(sameLevel);
    });

    it('should double XP with rested bonus', () => {
      const normal = calculateXpGain(30, 30, 'normal', false);
      const rested = calculateXpGain(30, 30, 'normal', true);

      expect(rested).toBe(normal * 2);
    });

    it('should follow base formula: mobLevel * 45', () => {
      // For same-level normal mob without rested
      const xp = calculateXpGain(20, 20, 'normal', false);
      expect(xp).toBe(20 * 45);
    });
  });

  describe('calculateRestedXpGain', () => {
    it('should return 0 for 0 hours offline', () => {
      expect(calculateRestedXpGain(0, 1000)).toBe(0);
    });

    it('should scale with hours offline', () => {
      const xp1Hour = calculateRestedXpGain(1, 10000);
      const xp5Hours = calculateRestedXpGain(5, 10000);

      expect(xp5Hours).toBeGreaterThan(xp1Hour);
      expect(xp5Hours).toBe(xp1Hour * 5);
    });

    it('should cap at MAX_OFFLINE_HOURS', () => {
      const xpAtMax = calculateRestedXpGain(MAX_OFFLINE_HOURS, 10000);
      const xpBeyondMax = calculateRestedXpGain(100, 10000);

      expect(xpBeyondMax).toBe(xpAtMax);
    });

    it('should scale with current level XP requirement', () => {
      const smallLevel = calculateRestedXpGain(10, 1000);
      const largeLevel = calculateRestedXpGain(10, 10000);

      expect(largeLevel).toBeGreaterThan(smallLevel);
    });

    it('should cap at MAX_OFFLINE_HOURS worth of rested XP', () => {
      const levelXp = 10000;
      // Max is min of: (hours * 5% of levelXp) OR (150% of levelXp)
      // At 18 hours max: 18 * (10000 * 0.05) = 18 * 500 = 9000
      // 150% cap: 15000
      // So actual cap is 9000 (limited by hours, not percent cap)

      const xp = calculateRestedXpGain(1000, levelXp); // 1000 hours capped to 18
      const expectedXp = Math.floor((levelXp * RESTED_XP_PERCENT_PER_HOUR / 100) * MAX_OFFLINE_HOURS);
      expect(xp).toBe(expectedXp); // 9000
    });

    it('should follow formula: hours * (levelXp * percent / 100)', () => {
      const levelXp = 10000;
      const hours = 5;
      const expected = Math.floor((levelXp * RESTED_XP_PERCENT_PER_HOUR / 100) * hours);

      expect(calculateRestedXpGain(hours, levelXp)).toBe(expected);
    });
  });
});

// ============= REPUTATION TESTS =============

describe('Reputation Functions', () => {
  describe('getReputationLevel', () => {
    it('should return Hated for very negative reputation', () => {
      expect(getReputationLevel(-50000)).toBe('Hated');
    });

    it('should return Hostile for -6000 to -3001', () => {
      // Hostile threshold is >= -6000 and < -3000
      expect(getReputationLevel(-6000)).toBe('Hostile');
      expect(getReputationLevel(-3001)).toBe('Hostile');
    });

    it('should return Hated for below -6000', () => {
      // Anything below hostile threshold (-6000) is Hated
      expect(getReputationLevel(-6001)).toBe('Hated');
      expect(getReputationLevel(-10000)).toBe('Hated');
    });

    it('should return Unfriendly for -3000 to -1', () => {
      expect(getReputationLevel(-3000)).toBe('Unfriendly');
      expect(getReputationLevel(-1)).toBe('Unfriendly');
    });

    it('should return Neutral for 0 to 2999', () => {
      expect(getReputationLevel(0)).toBe('Neutral');
      expect(getReputationLevel(2999)).toBe('Neutral');
    });

    it('should return Friendly for 3000 to 8999', () => {
      expect(getReputationLevel(3000)).toBe('Friendly');
      expect(getReputationLevel(8999)).toBe('Friendly');
    });

    it('should return Honored for 9000 to 20999', () => {
      expect(getReputationLevel(9000)).toBe('Honored');
      expect(getReputationLevel(20999)).toBe('Honored');
    });

    it('should return Revered for 21000 to 41999', () => {
      expect(getReputationLevel(21000)).toBe('Revered');
      expect(getReputationLevel(41999)).toBe('Revered');
    });

    it('should return Exalted for 42000+', () => {
      expect(getReputationLevel(42000)).toBe('Exalted');
      expect(getReputationLevel(100000)).toBe('Exalted');
    });

    it('should match REPUTATION_LEVELS thresholds', () => {
      // Each .min is the minimum rep to reach that standing
      expect(getReputationLevel(REPUTATION_LEVELS.hostile.min)).toBe('Hostile');    // -6000
      expect(getReputationLevel(REPUTATION_LEVELS.unfriendly.min)).toBe('Unfriendly'); // -3000
      expect(getReputationLevel(REPUTATION_LEVELS.neutral.min)).toBe('Neutral');    // 0
      expect(getReputationLevel(REPUTATION_LEVELS.friendly.min)).toBe('Friendly');  // 3000
      expect(getReputationLevel(REPUTATION_LEVELS.honored.min)).toBe('Honored');    // 9000
      expect(getReputationLevel(REPUTATION_LEVELS.revered.min)).toBe('Revered');    // 21000
      expect(getReputationLevel(REPUTATION_LEVELS.exalted.min)).toBe('Exalted');    // 42000
    });
  });
});

// ============= MISC FUNCTION TESTS =============

describe('Miscellaneous Functions', () => {
  describe('calculateRespecCost', () => {
    it('should return 1 gold for first respec', () => {
      expect(calculateRespecCost(0)).toBe(1);
    });

    it('should increase with each respec', () => {
      expect(calculateRespecCost(1)).toBe(2);
      expect(calculateRespecCost(5)).toBe(6);
      expect(calculateRespecCost(10)).toBe(11);
    });

    it('should cap at 50 gold', () => {
      expect(calculateRespecCost(49)).toBe(50);
      expect(calculateRespecCost(100)).toBe(50);
      expect(calculateRespecCost(1000)).toBe(50);
    });

    it('should follow formula: min(50, respecCount + 1)', () => {
      for (let count = 0; count < 60; count++) {
        const expected = Math.min(50, count + 1);
        expect(calculateRespecCost(count)).toBe(expected);
      }
    });
  });

  describe('calculateSuccessRate', () => {
    it('should return 100% when player power equals required power (normal)', () => {
      const rate = calculateSuccessRate(100, 100, 'normal');
      expect(rate).toBe(100);
    });

    it('should return higher rate for safe difficulty', () => {
      // Use lower power to avoid cap at 100%
      const normal = calculateSuccessRate(50, 100, 'normal');
      const safe = calculateSuccessRate(50, 100, 'safe');

      // Safe (1.5x multiplier) should be higher than normal (1.0x)
      expect(safe).toBeGreaterThan(normal);
    });

    it('should return lower rate for heroic difficulty', () => {
      const normal = calculateSuccessRate(100, 100, 'normal');
      const heroic = calculateSuccessRate(100, 100, 'heroic');

      expect(heroic).toBeLessThan(normal);
    });

    it('should apply correct difficulty multipliers', () => {
      const basePower = 100;
      const required = 100;

      // Safe: 1.5x
      expect(calculateSuccessRate(basePower, required, 'safe')).toBe(100); // Capped at 100

      // Normal: 1.0x
      expect(calculateSuccessRate(basePower, required, 'normal')).toBe(100);

      // Challenging: 0.75x
      expect(calculateSuccessRate(basePower, required, 'challenging')).toBe(75);

      // Heroic: 0.5x
      expect(calculateSuccessRate(basePower, required, 'heroic')).toBe(50);
    });

    it('should clamp minimum at 5%', () => {
      const rate = calculateSuccessRate(1, 1000, 'heroic');
      expect(rate).toBe(5);
    });

    it('should clamp maximum at 100%', () => {
      const rate = calculateSuccessRate(1000, 100, 'safe');
      expect(rate).toBe(100);
    });

    it('should scale linearly with power ratio', () => {
      const rate50 = calculateSuccessRate(50, 100, 'normal');
      const rate100 = calculateSuccessRate(100, 100, 'normal');
      const rate150 = calculateSuccessRate(150, 100, 'normal');

      expect(rate50).toBe(50);
      expect(rate100).toBe(100);
      expect(rate150).toBe(100); // Capped
    });
  });
});
