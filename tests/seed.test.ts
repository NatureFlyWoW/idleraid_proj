// ============= SEED DATA INTEGRITY TESTS =============
// Tests verifying the game seed data is correctly structured and valid

import { describe, it, expect, beforeAll } from 'vitest';
import { EXPECTED_ZONES, EXPECTED_DUNGEONS } from './setup';

// Ensure database is seeded before tests run
beforeAll(async () => {
  const { seedStartingContent } = await import('../server/game/data/seed');
  await seedStartingContent();
});

describe('Seed Data Integrity', () => {
  // ============= ZONE TESTS =============

  describe('Zones', () => {
    let zones: any[];

    beforeAll(async () => {
      const { storage } = await import('../server/storage');
      zones = await storage.content.getAllZones();
    });

    it('should have Northshire Valley zone', () => {
      const zone = zones.find(z => z.name === 'Northshire Valley');
      expect(zone).toBeDefined();
      expect(zone.levelMin).toBe(1);
      expect(zone.levelMax).toBe(6);
    });

    it('should have Elwynn Forest zone', () => {
      const zone = zones.find(z => z.name === 'Elwynn Forest');
      expect(zone).toBeDefined();
      expect(zone.levelMin).toBe(5);
      expect(zone.levelMax).toBe(12);
    });

    it('should have Westfall zone', () => {
      const zone = zones.find(z => z.name === 'Westfall');
      expect(zone).toBeDefined();
      expect(zone.levelMin).toBe(10);
      expect(zone.levelMax).toBe(20);
    });

    it('should have Redridge Mountains zone', () => {
      const zone = zones.find(z => z.name === 'Redridge Mountains');
      expect(zone).toBeDefined();
      expect(zone.levelMin).toBe(20);
      expect(zone.levelMax).toBe(30);
    });

    it('should have Duskwood zone', () => {
      const zone = zones.find(z => z.name === 'Duskwood');
      expect(zone).toBeDefined();
      expect(zone.levelMin).toBe(30);
      expect(zone.levelMax).toBe(40);
    });

    it('should have all expected zones', () => {
      for (const expectedZone of EXPECTED_ZONES) {
        const zone = zones.find(z => z.name === expectedZone);
        expect(zone, `Missing zone: ${expectedZone}`).toBeDefined();
      }
    });

    it('should have valid level ranges (levelMin < levelMax)', () => {
      for (const zone of zones) {
        expect(zone.levelMin, `Zone ${zone.name} has invalid level range`).toBeLessThan(zone.levelMax);
        expect(zone.levelMin, `Zone ${zone.name} has negative levelMin`).toBeGreaterThanOrEqual(1);
        expect(zone.levelMax, `Zone ${zone.name} has invalid levelMax`).toBeGreaterThan(0);
      }
    });

    it('should have zone level ranges that overlap properly for progression', () => {
      // Sort zones by levelMin
      const sortedZones = [...zones].sort((a, b) => a.levelMin - b.levelMin);

      // Each subsequent zone should overlap with or connect to the previous
      for (let i = 1; i < sortedZones.length; i++) {
        const prevZone = sortedZones[i - 1];
        const currZone = sortedZones[i];

        // Current zone's min should be <= previous zone's max + some buffer
        // This ensures players can progress smoothly
        expect(
          currZone.levelMin,
          `Gap between ${prevZone.name} (max ${prevZone.levelMax}) and ${currZone.name} (min ${currZone.levelMin})`
        ).toBeLessThanOrEqual(prevZone.levelMax + 3);
      }
    });
  });

  // ============= QUEST TESTS =============

  describe('Quests', () => {
    let zones: any[];
    let allQuests: any[];

    beforeAll(async () => {
      const { storage } = await import('../server/storage');
      zones = await storage.content.getAllZones();

      // Get all quests for all zones
      allQuests = [];
      for (const zone of zones) {
        const zoneQuests = await storage.content.getQuestsByZone(zone.id);
        allQuests.push(...zoneQuests);
      }
    });

    it('should have quests referencing valid zoneIds', () => {
      const validZoneIds = zones.map(z => z.id);

      for (const quest of allQuests) {
        expect(
          validZoneIds,
          `Quest "${quest.name}" references invalid zoneId: ${quest.zoneId}`
        ).toContain(quest.zoneId);
      }
    });

    it('should have quest levels falling within zone level ranges', () => {
      for (const quest of allQuests) {
        const zone = zones.find(z => z.id === quest.zoneId);
        expect(zone, `Quest "${quest.name}" has no matching zone`).toBeDefined();

        // Quest level should be within zone range (with small buffer for edge cases)
        expect(
          quest.level,
          `Quest "${quest.name}" (level ${quest.level}) outside zone "${zone.name}" range [${zone.levelMin}-${zone.levelMax}]`
        ).toBeGreaterThanOrEqual(zone.levelMin - 1);

        expect(
          quest.level,
          `Quest "${quest.name}" (level ${quest.level}) above zone "${zone.name}" max level ${zone.levelMax}`
        ).toBeLessThanOrEqual(zone.levelMax + 2);
      }
    });

    it('should have quests with valid quest types', () => {
      const validTypes = ['kill', 'collection', 'delivery', 'boss'];

      for (const quest of allQuests) {
        expect(
          validTypes,
          `Quest "${quest.name}" has invalid type: ${quest.type}`
        ).toContain(quest.type);
      }
    });

    it('should have quests with positive XP rewards', () => {
      for (const quest of allQuests) {
        expect(
          quest.xpReward,
          `Quest "${quest.name}" has non-positive XP reward`
        ).toBeGreaterThan(0);
      }
    });

    it('should have quests with non-negative gold rewards', () => {
      for (const quest of allQuests) {
        expect(
          quest.goldReward,
          `Quest "${quest.name}" has negative gold reward`
        ).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ============= ITEM TEMPLATE TESTS =============

  describe('Item Templates', () => {
    let itemTemplates: any[];

    beforeAll(async () => {
      const { db } = await import('../server/db');
      const { itemTemplates: itemsTable } = await import('../shared/schema');

      itemTemplates = await db.select().from(itemsTable);
    });

    it('should have item templates', () => {
      expect(itemTemplates.length).toBeGreaterThan(0);
    });

    it('should have valid item slots', () => {
      const validSlots = [
        'head', 'neck', 'shoulders', 'back', 'chest', 'wrist', 'hands',
        'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2',
        'mainHand', 'offHand', 'ranged'
      ];

      for (const item of itemTemplates) {
        expect(
          validSlots,
          `Item "${item.name}" has invalid slot: ${item.slot}`
        ).toContain(item.slot);
      }
    });

    it('should have valid item rarities', () => {
      const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

      for (const item of itemTemplates) {
        expect(
          validRarities,
          `Item "${item.name}" has invalid rarity: ${item.rarity}`
        ).toContain(item.rarity);
      }
    });

    it('should have valid item levels', () => {
      for (const item of itemTemplates) {
        expect(
          item.itemLevel,
          `Item "${item.name}" has invalid itemLevel`
        ).toBeGreaterThan(0);
      }
    });

    it('should have requiredLevel <= itemLevel', () => {
      for (const item of itemTemplates) {
        expect(
          item.requiredLevel,
          `Item "${item.name}" has requiredLevel (${item.requiredLevel}) > itemLevel (${item.itemLevel})`
        ).toBeLessThanOrEqual(item.itemLevel);
      }
    });

    it('should have weapons with valid damage and speed values', () => {
      const weapons = itemTemplates.filter(i => i.isWeapon);

      for (const weapon of weapons) {
        expect(
          weapon.minDamage,
          `Weapon "${weapon.name}" has no minDamage`
        ).toBeGreaterThan(0);

        expect(
          weapon.maxDamage,
          `Weapon "${weapon.name}" has no maxDamage`
        ).toBeGreaterThan(0);

        expect(
          weapon.minDamage,
          `Weapon "${weapon.name}" has minDamage > maxDamage`
        ).toBeLessThanOrEqual(weapon.maxDamage);

        expect(
          weapon.weaponSpeed,
          `Weapon "${weapon.name}" has invalid weaponSpeed`
        ).toBeGreaterThan(0);
      }
    });
  });

  // ============= DUNGEON TESTS =============

  describe('Dungeons', () => {
    let dungeons: any[];

    beforeAll(async () => {
      const { storage } = await import('../server/storage');
      dungeons = await storage.content.getAllDungeons();
    });

    it('should have all expected dungeons', () => {
      for (const expectedDungeon of EXPECTED_DUNGEONS) {
        const dungeon = dungeons.find(d => d.name === expectedDungeon);
        expect(dungeon, `Missing dungeon: ${expectedDungeon}`).toBeDefined();
      }
    });

    it('should have dungeons with valid level ranges', () => {
      for (const dungeon of dungeons) {
        expect(dungeon.levelMin, `Dungeon ${dungeon.name} has invalid levelMin`).toBeGreaterThan(0);
        expect(dungeon.levelMax, `Dungeon ${dungeon.name} has levelMax <= levelMin`).toBeGreaterThan(dungeon.levelMin);
      }
    });

    // ============= THE DEADMINES =============

    describe('The Deadmines', () => {
      let deadmines: any;
      let deadminesBosses: any[];

      beforeAll(async () => {
        const { storage } = await import('../server/storage');
        deadmines = dungeons.find(d => d.name === 'The Deadmines');

        if (deadmines) {
          deadminesBosses = await storage.content.getDungeonBosses(deadmines.id);
        }
      });

      it('should exist', () => {
        expect(deadmines, 'The Deadmines dungeon is missing').toBeDefined();
      });

      it('should have level range 17-21', () => {
        expect(deadmines?.levelMin).toBe(17);
        expect(deadmines?.levelMax).toBe(21);
      });

      it('should have at least 3 bosses', () => {
        expect(
          deadminesBosses?.length,
          `The Deadmines has only ${deadminesBosses?.length} bosses (expected 3+)`
        ).toBeGreaterThanOrEqual(3);
      });

      it('should have bosses with sequential orderIndex', () => {
        if (!deadminesBosses) return;
        const sortedBosses = [...deadminesBosses].sort((a, b) => a.orderIndex - b.orderIndex);

        for (let i = 0; i < sortedBosses.length; i++) {
          expect(
            sortedBosses[i].orderIndex,
            `Boss "${sortedBosses[i].name}" has non-sequential orderIndex`
          ).toBe(i + 1);
        }
      });

      it('should have exactly one final boss', () => {
        if (!deadminesBosses) return;
        const finalBosses = deadminesBosses.filter(b => b.isFinalBoss);
        expect(finalBosses.length).toBe(1);
      });

      it('should have Edwin VanCleef as final boss', () => {
        if (!deadminesBosses) return;
        const finalBoss = deadminesBosses.find(b => b.isFinalBoss);
        expect(finalBoss?.name).toBe('Edwin VanCleef');
      });

      it('should have bosses with valid health and damage values', () => {
        if (!deadminesBosses) return;
        for (const boss of deadminesBosses) {
          expect(boss.health, `Boss "${boss.name}" has invalid health`).toBeGreaterThan(0);
          expect(boss.damage, `Boss "${boss.name}" has invalid damage`).toBeGreaterThan(0);
        }
      });
    });

    // ============= CINDERMAW CAVERNS =============

    describe('Cindermaw Caverns', () => {
      let cindermaw: any;
      let cindermawBosses: any[];

      beforeAll(async () => {
        const { storage } = await import('../server/storage');
        cindermaw = dungeons.find(d => d.name === 'Cindermaw Caverns');

        if (cindermaw) {
          cindermawBosses = await storage.content.getDungeonBosses(cindermaw.id);
        }
      });

      it('should exist', () => {
        expect(cindermaw, 'Cindermaw Caverns dungeon is missing').toBeDefined();
      });

      it('should have level range 15-18', () => {
        expect(cindermaw?.levelMin).toBe(15);
        expect(cindermaw?.levelMax).toBe(18);
      });

      it('should have at least 2 bosses', () => {
        expect(
          cindermawBosses?.length,
          `Cindermaw Caverns has only ${cindermawBosses?.length} bosses (expected 2+)`
        ).toBeGreaterThanOrEqual(2);
      });

      it('should have exactly one final boss', () => {
        if (!cindermawBosses) return;
        const finalBosses = cindermawBosses.filter(b => b.isFinalBoss);
        expect(finalBosses.length).toBe(1);
      });

      it('should have bosses with valid health and damage values', () => {
        if (!cindermawBosses) return;
        for (const boss of cindermawBosses) {
          expect(boss.health, `Boss "${boss.name}" has invalid health`).toBeGreaterThan(0);
          expect(boss.damage, `Boss "${boss.name}" has invalid damage`).toBeGreaterThan(0);
        }
      });

      it('should have bosses with sequential orderIndex', () => {
        if (!cindermawBosses) return;
        const sortedBosses = [...cindermawBosses].sort((a, b) => a.orderIndex - b.orderIndex);

        for (let i = 0; i < sortedBosses.length; i++) {
          expect(
            sortedBosses[i].orderIndex,
            `Boss "${sortedBosses[i].name}" has non-sequential orderIndex`
          ).toBe(i + 1);
        }
      });
    });

    // ============= SERPENT'S LAMENT =============

    describe("Serpent's Lament", () => {
      let serpentsLament: any;
      let serpentsLamentBosses: any[];

      beforeAll(async () => {
        const { storage } = await import('../server/storage');
        serpentsLament = dungeons.find(d => d.name === "Serpent's Lament");

        if (serpentsLament) {
          serpentsLamentBosses = await storage.content.getDungeonBosses(serpentsLament.id);
        }
      });

      it('should exist', () => {
        expect(serpentsLament, "Serpent's Lament dungeon is missing").toBeDefined();
      });

      it('should have level range 18-25', () => {
        expect(serpentsLament?.levelMin).toBe(18);
        expect(serpentsLament?.levelMax).toBe(25);
      });

      it('should have at least 3 bosses', () => {
        expect(
          serpentsLamentBosses?.length,
          `Serpent's Lament has only ${serpentsLamentBosses?.length} bosses (expected 3+)`
        ).toBeGreaterThanOrEqual(3);
      });

      it('should have exactly one final boss', () => {
        if (!serpentsLamentBosses) return;
        const finalBosses = serpentsLamentBosses.filter(b => b.isFinalBoss);
        expect(finalBosses.length).toBe(1);
      });

      it('should have bosses with valid health and damage values', () => {
        if (!serpentsLamentBosses) return;
        for (const boss of serpentsLamentBosses) {
          expect(boss.health, `Boss "${boss.name}" has invalid health`).toBeGreaterThan(0);
          expect(boss.damage, `Boss "${boss.name}" has invalid damage`).toBeGreaterThan(0);
        }
      });

      it('should have bosses with sequential orderIndex', () => {
        if (!serpentsLamentBosses) return;
        const sortedBosses = [...serpentsLamentBosses].sort((a, b) => a.orderIndex - b.orderIndex);

        for (let i = 0; i < sortedBosses.length; i++) {
          expect(
            sortedBosses[i].orderIndex,
            `Boss "${sortedBosses[i].name}" has non-sequential orderIndex`
          ).toBe(i + 1);
        }
      });
    });

    // ============= DUNGEON PROGRESSION =============

    describe('Dungeon Progression', () => {
      it('should have progressive dungeon difficulty', () => {
        // Sort dungeons by level
        const sortedDungeons = [...dungeons].sort((a, b) => a.levelMin - b.levelMin);

        // Each subsequent dungeon should be progressively harder
        for (let i = 1; i < sortedDungeons.length; i++) {
          const prevDungeon = sortedDungeons[i - 1];
          const currDungeon = sortedDungeons[i];

          // Current dungeon should start within reasonable range of previous
          expect(
            currDungeon.levelMin,
            `Dungeon "${currDungeon.name}" starts too high after "${prevDungeon.name}"`
          ).toBeLessThanOrEqual(prevDungeon.levelMax + 5);
        }
      });

      it('should have dungeon level ranges that match corresponding zones', async () => {
        const { storage } = await import('../server/storage');
        const zones = await storage.content.getAllZones();

        for (const dungeon of dungeons) {
          // Find a zone that overlaps with dungeon level range
          const matchingZone = zones.find(
            z => z.levelMin <= dungeon.levelMax && z.levelMax >= dungeon.levelMin
          );

          expect(
            matchingZone,
            `Dungeon "${dungeon.name}" (${dungeon.levelMin}-${dungeon.levelMax}) has no overlapping zone`
          ).toBeDefined();
        }
      });
    });
  });

  // ============= CROSS-REFERENCE TESTS =============

  describe('Data Cross-References', () => {
    it('should have quests for each zone', async () => {
      const { storage } = await import('../server/storage');
      const zones = await storage.content.getAllZones();

      for (const zone of zones) {
        const quests = await storage.content.getQuestsByZone(zone.id);
        expect(
          quests.length,
          `Zone "${zone.name}" has no quests`
        ).toBeGreaterThan(0);
      }
    });

    it('should have progressive zone difficulty', async () => {
      const { storage } = await import('../server/storage');
      const zones = await storage.content.getAllZones();

      // Sort zones by level
      const sortedZones = [...zones].sort((a, b) => a.levelMin - b.levelMin);

      // Verify level progression makes sense
      let previousMax = 0;
      for (const zone of sortedZones) {
        expect(
          zone.levelMin,
          `Zone "${zone.name}" starts too high after previous zone`
        ).toBeLessThanOrEqual(previousMax + 5);

        previousMax = Math.max(previousMax, zone.levelMax);
      }
    });
  });
});
