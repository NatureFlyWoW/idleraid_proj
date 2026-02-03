// ============= LOOT GENERATION TESTS =============
// Tests for item drop rates, rarity distribution, and gold drops
// Reference: Idle-Raiders-GDD.md Section 7.1 (Loot System)

import { describe, it, expect } from 'vitest';
import {
  LOOT_RARITY_WEIGHTS,
  calculateGoldDrop,
  PRIMARY_STAT_PER_ILVL,
  SECONDARY_STAT_PER_ILVL,
  SLOT_WEIGHTS,
  WEAPON_SPEED_MODIFIERS,
} from '@shared/constants/gameConfig';

describe('Loot Generation', () => {
  // ============= RARITY DISTRIBUTION =============

  describe('Rarity Distribution Weights', () => {
    describe('Normal Mobs', () => {
      const weights = LOOT_RARITY_WEIGHTS.normal;

      it('should have common as most likely drop', () => {
        expect(weights.common).toBeGreaterThan(weights.uncommon);
        expect(weights.common).toBeGreaterThan(weights.rare);
      });

      it('should have expected rarity percentages', () => {
        expect(weights.common).toBe(45);
        expect(weights.uncommon).toBe(35);
        expect(weights.rare).toBe(18);
        expect(weights.epic).toBe(2);
        expect(weights.legendary).toBe(0);
      });

      it('should total to 100%', () => {
        const total = weights.common + weights.uncommon + weights.rare + weights.epic + weights.legendary;
        expect(total).toBe(100);
      });

      it('should not drop legendary items', () => {
        expect(weights.legendary).toBe(0);
      });
    });

    describe('Elite Mobs', () => {
      const weights = LOOT_RARITY_WEIGHTS.elite;

      it('should have uncommon as most likely drop', () => {
        expect(weights.uncommon).toBeGreaterThan(weights.common);
        expect(weights.uncommon).toBeGreaterThan(weights.rare);
      });

      it('should have expected rarity percentages', () => {
        expect(weights.common).toBe(20);
        expect(weights.uncommon).toBe(45);
        expect(weights.rare).toBe(30);
        expect(weights.epic).toBe(5);
        expect(weights.legendary).toBe(0);
      });

      it('should total to 100%', () => {
        const total = weights.common + weights.uncommon + weights.rare + weights.epic + weights.legendary;
        expect(total).toBe(100);
      });
    });

    describe('Dungeon Bosses', () => {
      const weights = LOOT_RARITY_WEIGHTS.boss;

      it('should have rare as most likely drop', () => {
        expect(weights.rare).toBeGreaterThan(weights.epic);
        expect(weights.rare).toBeGreaterThan(weights.uncommon);
      });

      it('should not drop common or uncommon items', () => {
        expect(weights.common).toBe(0);
        expect(weights.uncommon).toBe(0);
      });

      it('should have expected rarity percentages', () => {
        expect(weights.rare).toBe(65);
        expect(weights.epic).toBe(30);
        expect(weights.legendary).toBe(5);
      });

      it('should total to 100%', () => {
        const total = weights.common + weights.uncommon + weights.rare + weights.epic + weights.legendary;
        expect(total).toBe(100);
      });

      it('should have legendary drops possible', () => {
        expect(weights.legendary).toBeGreaterThan(0);
      });
    });

    describe('Raid Bosses', () => {
      const weights = LOOT_RARITY_WEIGHTS.raid_boss;

      it('should have epic as most likely drop', () => {
        expect(weights.epic).toBeGreaterThan(weights.rare);
      });

      it('should not drop common or uncommon items', () => {
        expect(weights.common).toBe(0);
        expect(weights.uncommon).toBe(0);
      });

      it('should have expected rarity percentages', () => {
        expect(weights.rare).toBe(30);
        expect(weights.epic).toBe(65);
        expect(weights.legendary).toBe(5);
      });

      it('should total to 100%', () => {
        const total = weights.common + weights.uncommon + weights.rare + weights.epic + weights.legendary;
        expect(total).toBe(100);
      });
    });

    describe('Progression from Normal → Raid Boss', () => {
      it('should have increasing epic chance', () => {
        expect(LOOT_RARITY_WEIGHTS.normal.epic).toBeLessThan(LOOT_RARITY_WEIGHTS.elite.epic);
        expect(LOOT_RARITY_WEIGHTS.elite.epic).toBeLessThan(LOOT_RARITY_WEIGHTS.boss.epic);
        expect(LOOT_RARITY_WEIGHTS.boss.epic).toBeLessThan(LOOT_RARITY_WEIGHTS.raid_boss.epic);
      });

      it('should have decreasing common chance', () => {
        expect(LOOT_RARITY_WEIGHTS.normal.common).toBeGreaterThan(LOOT_RARITY_WEIGHTS.elite.common);
        expect(LOOT_RARITY_WEIGHTS.elite.common).toBeGreaterThan(LOOT_RARITY_WEIGHTS.boss.common);
      });
    });
  });

  // ============= GOLD DROP FORMULA =============

  describe('Gold Drop Calculation', () => {
    describe('Base Formula', () => {
      it('should return non-negative gold for any mob level', () => {
        for (let level = 1; level <= 60; level += 10) {
          const gold = calculateGoldDrop(level, 'normal');
          expect(gold).toBeGreaterThanOrEqual(0);
        }
      });

      it('should return positive gold for higher level mobs', () => {
        // Level 10+ should reliably drop gold
        for (let level = 10; level <= 60; level += 10) {
          const gold = calculateGoldDrop(level, 'normal');
          expect(gold).toBeGreaterThan(0);
        }
      });

      it('should return integer values (floored)', () => {
        for (let i = 0; i < 10; i++) {
          const gold = calculateGoldDrop(30, 'normal');
          expect(Number.isInteger(gold)).toBe(true);
        }
      });

      it('should scale with mob level', () => {
        const lowLevelGold = calculateGoldDrop(10, 'normal');
        const highLevelGold = calculateGoldDrop(60, 'normal');

        // Higher level should drop more on average
        // Using multiple samples to account for variance
        let lowTotal = 0;
        let highTotal = 0;
        for (let i = 0; i < 100; i++) {
          lowTotal += calculateGoldDrop(10, 'normal');
          highTotal += calculateGoldDrop(60, 'normal');
        }

        expect(highTotal).toBeGreaterThan(lowTotal);
      });
    });

    describe('Mob Type Multipliers', () => {
      it('should have elite drop more than normal', () => {
        let normalTotal = 0;
        let eliteTotal = 0;

        for (let i = 0; i < 100; i++) {
          normalTotal += calculateGoldDrop(30, 'normal');
          eliteTotal += calculateGoldDrop(30, 'elite');
        }

        expect(eliteTotal).toBeGreaterThan(normalTotal);
      });

      it('should have boss drop more than elite', () => {
        let eliteTotal = 0;
        let bossTotal = 0;

        for (let i = 0; i < 100; i++) {
          eliteTotal += calculateGoldDrop(30, 'elite');
          bossTotal += calculateGoldDrop(30, 'boss');
        }

        expect(bossTotal).toBeGreaterThan(eliteTotal);
      });

      it('should have raid_boss drop more than boss', () => {
        let bossTotal = 0;
        let raidBossTotal = 0;

        for (let i = 0; i < 100; i++) {
          bossTotal += calculateGoldDrop(30, 'boss');
          raidBossTotal += calculateGoldDrop(30, 'raid_boss');
        }

        expect(raidBossTotal).toBeGreaterThan(bossTotal);
      });
    });

    describe('Level 60 Reference Values', () => {
      it('should drop reasonable gold amounts at max level', () => {
        // Sample gold drops at level 60
        const samples = [];
        for (let i = 0; i < 100; i++) {
          samples.push(calculateGoldDrop(60, 'normal'));
        }

        const min = Math.min(...samples);
        const max = Math.max(...samples);
        const avg = samples.reduce((a, b) => a + b) / samples.length;

        // Verify reasonable ranges
        expect(min).toBeGreaterThan(0);
        expect(max).toBeLessThan(100); // Normal mobs shouldn't drop 100g+
        expect(avg).toBeGreaterThan(15); // Average should be decent
        expect(avg).toBeLessThan(50);
      });
    });
  });

  // ============= ITEM STAT BUDGET =============

  describe('Item Stat Budget', () => {
    describe('Stat per Item Level', () => {
      it('should have 0.5 primary stat per ilvl', () => {
        expect(PRIMARY_STAT_PER_ILVL).toBe(0.5);
      });

      it('should have 0.3 secondary stat per ilvl', () => {
        expect(SECONDARY_STAT_PER_ILVL).toBe(0.3);
      });

      it('should have primary > secondary budget', () => {
        expect(PRIMARY_STAT_PER_ILVL).toBeGreaterThan(SECONDARY_STAT_PER_ILVL);
      });
    });

    describe('Expected Stats at Level 60', () => {
      it('should calculate expected primary stat for ilvl 60 chest', () => {
        // Chest has 1.0 primary weight
        const ilvl = 60;
        const slotWeight = SLOT_WEIGHTS.chest.primary;
        const expectedStat = Math.floor(ilvl * PRIMARY_STAT_PER_ILVL * slotWeight);

        // ilvl 60 * 0.5 * 1.0 = 30 primary stat
        expect(expectedStat).toBe(30);
      });

      it('should calculate expected primary stat for ilvl 60 back', () => {
        // Back has 0.5 primary weight
        const ilvl = 60;
        const slotWeight = SLOT_WEIGHTS.back.primary;
        const expectedStat = Math.floor(ilvl * PRIMARY_STAT_PER_ILVL * slotWeight);

        // ilvl 60 * 0.5 * 0.5 = 15 primary stat
        expect(expectedStat).toBe(15);
      });
    });
  });

  // ============= SLOT WEIGHTS =============

  describe('Equipment Slot Weights', () => {
    describe('Armor Slot Hierarchy', () => {
      it('should have chest as highest weighted slot', () => {
        expect(SLOT_WEIGHTS.chest.primary).toBe(1.0);
        expect(SLOT_WEIGHTS.chest.secondary).toBe(1.0);
      });

      it('should have legs as second highest', () => {
        expect(SLOT_WEIGHTS.legs.primary).toBe(0.9);
        expect(SLOT_WEIGHTS.legs.secondary).toBe(0.9);
      });

      it('should have head close to legs', () => {
        expect(SLOT_WEIGHTS.head.primary).toBe(0.85);
      });

      it('should have back as lower weighted', () => {
        expect(SLOT_WEIGHTS.back.primary).toBe(0.5);
      });

      it('should have wrist as lowest armor slot', () => {
        expect(SLOT_WEIGHTS.wrist.primary).toBe(0.5);
      });
    });

    describe('Jewelry Slots', () => {
      it('should have rings with 0 primary (no main stat)', () => {
        expect(SLOT_WEIGHTS.ring1.primary).toBe(0);
        expect(SLOT_WEIGHTS.ring2.primary).toBe(0);
      });

      it('should have rings with secondary stat budget', () => {
        expect(SLOT_WEIGHTS.ring1.secondary).toBe(0.8);
        expect(SLOT_WEIGHTS.ring2.secondary).toBe(0.8);
      });

      it('should have neck similar to rings', () => {
        expect(SLOT_WEIGHTS.neck.primary).toBe(0);
        expect(SLOT_WEIGHTS.neck.secondary).toBe(0.8);
      });

      it('should have trinkets with full secondary budget', () => {
        expect(SLOT_WEIGHTS.trinket1.primary).toBe(0);
        expect(SLOT_WEIGHTS.trinket1.secondary).toBe(1.0);
        expect(SLOT_WEIGHTS.trinket2.secondary).toBe(1.0);
      });
    });

    describe('Weapon Slots', () => {
      it('should have main hand with moderate weight', () => {
        expect(SLOT_WEIGHTS.mainHand.primary).toBe(0.7);
      });

      it('should have off hand lower than main hand', () => {
        expect(SLOT_WEIGHTS.offHand.primary).toBeLessThan(SLOT_WEIGHTS.mainHand.primary);
      });

      it('should have ranged slot defined', () => {
        expect(SLOT_WEIGHTS.ranged).toBeDefined();
        expect(SLOT_WEIGHTS.ranged.primary).toBe(0.4);
      });
    });

    describe('All Slots Defined', () => {
      const expectedSlots = [
        'head', 'neck', 'shoulders', 'back', 'chest', 'wrist',
        'hands', 'waist', 'legs', 'feet', 'ring1', 'ring2',
        'trinket1', 'trinket2', 'mainHand', 'offHand', 'ranged'
      ];

      it('should have all 17 equipment slots', () => {
        for (const slot of expectedSlots) {
          expect(SLOT_WEIGHTS[slot]).toBeDefined();
          expect(SLOT_WEIGHTS[slot].primary).toBeDefined();
          expect(SLOT_WEIGHTS[slot].secondary).toBeDefined();
        }
      });
    });
  });

  // ============= WEAPON SPEED MODIFIERS =============

  describe('Weapon Speed Modifiers', () => {
    it('should have dagger as lowest modifier', () => {
      expect(WEAPON_SPEED_MODIFIERS.dagger).toBe(0.9);
    });

    it('should have fast weapons at baseline', () => {
      expect(WEAPON_SPEED_MODIFIERS.fast).toBe(1.0);
    });

    it('should have slow weapons with bonus', () => {
      expect(WEAPON_SPEED_MODIFIERS.slow).toBe(1.3);
    });

    it('should have very slow weapons with highest bonus', () => {
      expect(WEAPON_SPEED_MODIFIERS.verySlow).toBe(1.4);
    });

    it('should increase from dagger to verySlow', () => {
      expect(WEAPON_SPEED_MODIFIERS.dagger).toBeLessThan(WEAPON_SPEED_MODIFIERS.fast);
      expect(WEAPON_SPEED_MODIFIERS.fast).toBeLessThan(WEAPON_SPEED_MODIFIERS.medium);
      expect(WEAPON_SPEED_MODIFIERS.medium).toBeLessThan(WEAPON_SPEED_MODIFIERS.slow);
      expect(WEAPON_SPEED_MODIFIERS.slow).toBeLessThan(WEAPON_SPEED_MODIFIERS.verySlow);
    });
  });

  // ============= LOOT TABLE SCENARIOS =============

  describe('Loot Table Scenarios', () => {
    describe('Dungeon Run Expectations', () => {
      it('should have bosses drop better loot than trash', () => {
        // Boss rare + epic + legendary = 100%, trash has mostly common/uncommon
        const bossHighRarity = LOOT_RARITY_WEIGHTS.boss.rare + LOOT_RARITY_WEIGHTS.boss.epic + LOOT_RARITY_WEIGHTS.boss.legendary;
        const normalHighRarity = LOOT_RARITY_WEIGHTS.normal.rare + LOOT_RARITY_WEIGHTS.normal.epic + LOOT_RARITY_WEIGHTS.normal.legendary;

        expect(bossHighRarity).toBe(100);
        expect(normalHighRarity).toBe(20);
      });
    });

    describe('Raid vs Dungeon', () => {
      it('should have raid bosses drop more epics than dungeon bosses', () => {
        expect(LOOT_RARITY_WEIGHTS.raid_boss.epic).toBeGreaterThan(LOOT_RARITY_WEIGHTS.boss.epic);
      });

      it('should have same legendary chance for both boss types', () => {
        expect(LOOT_RARITY_WEIGHTS.raid_boss.legendary).toBe(LOOT_RARITY_WEIGHTS.boss.legendary);
      });
    });
  });
});
