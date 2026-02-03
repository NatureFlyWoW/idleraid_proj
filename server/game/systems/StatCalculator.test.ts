// ============= STAT CALCULATOR TESTS =============
import { describe, it, expect } from 'vitest';
import {
  calculateCombatStats,
  calculateGearStats,
  estimateDps,
  estimateSurvivability,
  calculateAverageItemLevel,
  getDefaultTalentBonuses,
  getDefaultBuffEffects,
  type CharacterData,
  type EquipmentSet,
} from './StatCalculator';
import { getClassDefinition, getClassStartingStats } from '../data/classes';
import type { GeneratedItem } from '@shared/types';
import type { ItemSlot } from '@shared/schema';

describe('StatCalculator', () => {
  // Create a level 1 warrior for testing
  const createTestWarrior = (level: number = 1): CharacterData => {
    const startingStats = getClassStartingStats('warrior');
    return {
      level,
      characterClass: 'warrior',
      baseStrength: startingStats.baseStrength,
      baseAgility: startingStats.baseAgility,
      baseIntellect: startingStats.baseIntellect,
      baseStamina: startingStats.baseStamina,
      baseSpirit: startingStats.baseSpirit,
      currentHealth: startingStats.currentHealth,
      currentResource: 0, // Rage starts at 0
    };
  };

  const createTestMage = (level: number = 1): CharacterData => {
    const startingStats = getClassStartingStats('mage');
    return {
      level,
      characterClass: 'mage',
      baseStrength: startingStats.baseStrength,
      baseAgility: startingStats.baseAgility,
      baseIntellect: startingStats.baseIntellect,
      baseStamina: startingStats.baseStamina,
      baseSpirit: startingStats.baseSpirit,
      currentHealth: startingStats.currentHealth,
      currentResource: startingStats.currentResource,
    };
  };

  const createEmptyEquipment = (): EquipmentSet => ({
    items: new Map(),
  });

  const createTestSword = (): GeneratedItem => ({
    templateId: 1,
    name: 'Test Sword',
    slot: 'mainHand',
    rarity: 'uncommon',
    itemLevel: 10,
    requiredLevel: 1,
    stats: {
      strength: 5,
      stamina: 3,
    },
    isWeapon: true,
    weaponDamageMin: 10,
    weaponDamageMax: 20,
    weaponSpeed: 2.5,
    weaponDps: 6,
  });

  const createTestChestplate = (): GeneratedItem => ({
    templateId: 2,
    name: 'Test Chestplate',
    slot: 'chest',
    rarity: 'uncommon',
    itemLevel: 10,
    requiredLevel: 1,
    stats: {
      stamina: 8,
      armor: 100,
    },
    isWeapon: false,
  });

  describe('calculateCombatStats', () => {
    it('should calculate base stats for warrior without gear', () => {
      const warrior = createTestWarrior();
      const equipment = createEmptyEquipment();

      const { stats, attributes } = calculateCombatStats(warrior, equipment);

      // Warrior should have high strength
      expect(attributes.strength.total).toBeGreaterThan(15);
      expect(attributes.stamina.total).toBeGreaterThan(10);

      // Should have base health from stamina
      expect(stats.maxHealth).toBeGreaterThan(0);

      // Rage should be 100 max (warriors use rage)
      expect(stats.maxResource).toBe(100);

      // Should have some attack power from strength
      expect(stats.meleeAttackPower).toBeGreaterThan(0);
    });

    it('should calculate base stats for mage without gear', () => {
      const mage = createTestMage();
      const equipment = createEmptyEquipment();

      const { stats, attributes } = calculateCombatStats(mage, equipment);

      // Mage should have high intellect
      expect(attributes.intellect.total).toBeGreaterThan(15);

      // Mage should have mana
      expect(stats.maxResource).toBeGreaterThan(100);

      // Should have spell power from intellect
      expect(stats.spellPower).toBeGreaterThan(0);
    });

    it('should add gear stats to totals', () => {
      const warrior = createTestWarrior();
      const equipment = createEmptyEquipment();
      equipment.items.set('mainHand', createTestSword());
      equipment.items.set('chest', createTestChestplate());

      const { stats, attributes } = calculateCombatStats(warrior, equipment);

      // Should have gear strength added
      expect(attributes.strength.gear).toBe(5);

      // Should have gear stamina added
      expect(attributes.stamina.gear).toBe(3 + 8); // sword + chest

      // Should have armor from chestplate
      expect(stats.armor).toBeGreaterThan(100);

      // Should have weapon stats
      expect(stats.weaponDamageMin).toBe(10);
      expect(stats.weaponDamageMax).toBe(20);
      expect(stats.weaponSpeed).toBe(2.5);
    });

    it('should apply talent bonuses', () => {
      const warrior = createTestWarrior();
      const equipment = createEmptyEquipment();
      const talents = getDefaultTalentBonuses();
      talents.strength = 10; // Flat STR bonus
      talents.strengthPercent = 10; // 10% more STR

      const { attributes: withTalents } = calculateCombatStats(warrior, equipment, talents);
      const { attributes: withoutTalents } = calculateCombatStats(warrior, equipment);

      // Should have more strength with talents
      expect(withTalents.strength.total).toBeGreaterThan(withoutTalents.strength.total);
    });

    it('should apply buff effects', () => {
      const warrior = createTestWarrior();
      const equipment = createEmptyEquipment();
      const buffs = getDefaultBuffEffects();
      buffs.attackPower = 100;
      buffs.armor = 200;

      const { stats: withBuffs } = calculateCombatStats(
        warrior,
        equipment,
        getDefaultTalentBonuses(),
        buffs
      );
      const { stats: withoutBuffs } = calculateCombatStats(warrior, equipment);

      expect(withBuffs.meleeAttackPower).toBeGreaterThan(withoutBuffs.meleeAttackPower);
      expect(withBuffs.armor).toBeGreaterThan(withoutBuffs.armor);
    });
  });

  describe('calculateGearStats', () => {
    it('should sum all gear stats correctly', () => {
      const equipment = createEmptyEquipment();
      equipment.items.set('mainHand', createTestSword());
      equipment.items.set('chest', createTestChestplate());

      const gearStats = calculateGearStats(equipment);

      expect(gearStats.attributes.strength).toBe(5);
      expect(gearStats.attributes.stamina).toBe(11); // 3 + 8
      expect(gearStats.armor).toBe(100);
      expect(gearStats.weaponDamageMin).toBe(10);
      expect(gearStats.weaponDamageMax).toBe(20);
    });

    it('should handle empty equipment', () => {
      const equipment = createEmptyEquipment();
      const gearStats = calculateGearStats(equipment);

      expect(gearStats.attributes.strength).toBe(0);
      expect(gearStats.armor).toBe(0);
    });
  });

  describe('estimateDps', () => {
    it('should estimate positive DPS for warrior', () => {
      const warrior = createTestWarrior();
      const equipment = createEmptyEquipment();
      equipment.items.set('mainHand', createTestSword());

      const { stats } = calculateCombatStats(warrior, equipment);
      const classDef = getClassDefinition('warrior')!;
      const dps = estimateDps(stats, classDef);

      expect(dps).toBeGreaterThan(0);
    });

    it('should estimate higher DPS with better gear', () => {
      const warrior = createTestWarrior(60);
      const equipmentWeak = createEmptyEquipment();
      const equipmentStrong = createEmptyEquipment();

      const strongSword: GeneratedItem = {
        ...createTestSword(),
        weaponDamageMin: 100,
        weaponDamageMax: 200,
        stats: { strength: 50, stamina: 30 },
      };
      equipmentStrong.items.set('mainHand', strongSword);

      const classDef = getClassDefinition('warrior')!;
      const { stats: weakStats } = calculateCombatStats(warrior, equipmentWeak);
      const { stats: strongStats } = calculateCombatStats(warrior, equipmentStrong);

      const weakDps = estimateDps(weakStats, classDef);
      const strongDps = estimateDps(strongStats, classDef);

      expect(strongDps).toBeGreaterThan(weakDps);
    });
  });

  describe('estimateSurvivability', () => {
    it('should return value between 0 and 100', () => {
      const warrior = createTestWarrior();
      const equipment = createEmptyEquipment();

      const { stats } = calculateCombatStats(warrior, equipment);
      const survivability = estimateSurvivability(stats, warrior.level);

      expect(survivability).toBeGreaterThanOrEqual(0);
      expect(survivability).toBeLessThanOrEqual(100);
    });

    it('should increase with better armor', () => {
      const warrior = createTestWarrior(60);
      const equipmentWeak = createEmptyEquipment();
      const equipmentStrong = createEmptyEquipment();

      const heavyArmor: GeneratedItem = {
        ...createTestChestplate(),
        stats: { stamina: 50, armor: 1000 },
      };
      equipmentStrong.items.set('chest', heavyArmor);

      const { stats: weakStats } = calculateCombatStats(warrior, equipmentWeak);
      const { stats: strongStats } = calculateCombatStats(warrior, equipmentStrong);

      const weakSurv = estimateSurvivability(weakStats, warrior.level);
      const strongSurv = estimateSurvivability(strongStats, warrior.level);

      expect(strongSurv).toBeGreaterThan(weakSurv);
    });
  });

  describe('calculateAverageItemLevel', () => {
    it('should return 0 for empty equipment', () => {
      const equipment = createEmptyEquipment();
      expect(calculateAverageItemLevel(equipment)).toBe(0);
    });

    it('should calculate average correctly', () => {
      const equipment = createEmptyEquipment();

      const item1: GeneratedItem = { ...createTestSword(), itemLevel: 10 };
      const item2: GeneratedItem = { ...createTestChestplate(), itemLevel: 20 };

      equipment.items.set('mainHand', item1);
      equipment.items.set('chest', item2);

      expect(calculateAverageItemLevel(equipment)).toBe(15); // (10 + 20) / 2
    });
  });
});
