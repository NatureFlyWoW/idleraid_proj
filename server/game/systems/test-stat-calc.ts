// Simple test script for stat calculator
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

// Helper to create test warrior
function createTestWarrior(level: number = 1): CharacterData {
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
    currentResource: 0,
  };
}

function createTestMage(level: number = 1): CharacterData {
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
}

function createEmptyEquipment(): EquipmentSet {
  return { items: new Map() };
}

function createTestSword(): GeneratedItem {
  return {
    templateId: 1,
    name: 'Test Sword',
    slot: 'mainHand',
    rarity: 'uncommon',
    itemLevel: 10,
    requiredLevel: 1,
    stats: { strength: 5, stamina: 3 },
    isWeapon: true,
    weaponDamageMin: 10,
    weaponDamageMax: 20,
    weaponSpeed: 2.5,
    weaponDps: 6,
  };
}

function createTestChest(): GeneratedItem {
  return {
    templateId: 2,
    name: 'Test Chestplate',
    slot: 'chest',
    rarity: 'uncommon',
    itemLevel: 10,
    requiredLevel: 1,
    stats: { stamina: 8, armor: 100 },
    isWeapon: false,
  };
}

// Run tests
console.log('=== STAT CALCULATOR TESTS ===\n');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name} - assertion failed`);
      failed++;
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.log(`❌ ${name} - error: ${message}`);
    failed++;
  }
}

// Test 1: Warrior base stats
test('Warrior base stats without gear', () => {
  const warrior = createTestWarrior();
  const equipment = createEmptyEquipment();
  const { stats, attributes } = calculateCombatStats(warrior, equipment);

  return (
    attributes.strength.total > 15 &&
    attributes.stamina.total > 10 &&
    stats.maxHealth > 0 &&
    stats.maxResource === 100 && // Rage cap
    stats.meleeAttackPower > 0
  );
});

// Test 2: Mage base stats
test('Mage base stats without gear', () => {
  const mage = createTestMage();
  const equipment = createEmptyEquipment();
  const { stats, attributes } = calculateCombatStats(mage, equipment);

  return (
    attributes.intellect.total > 15 &&
    stats.maxResource > 100 && // Mana pool
    stats.spellPower > 0
  );
});

// Test 3: Gear adds stats
test('Gear adds stats correctly', () => {
  const warrior = createTestWarrior();
  const equipment = createEmptyEquipment();
  equipment.items.set('mainHand', createTestSword());
  equipment.items.set('chest', createTestChest());

  const { stats, attributes } = calculateCombatStats(warrior, equipment);

  return (
    attributes.strength.gear === 5 &&
    attributes.stamina.gear === 11 && // 3 + 8
    stats.armor > 100 &&
    stats.weaponDamageMin === 10 &&
    stats.weaponDamageMax === 20
  );
});

// Test 4: Talent bonuses
test('Talent bonuses increase stats', () => {
  const warrior = createTestWarrior();
  const equipment = createEmptyEquipment();

  const talents = getDefaultTalentBonuses();
  talents.strength = 10;
  talents.strengthPercent = 10;

  const { attributes: withTalents } = calculateCombatStats(warrior, equipment, talents);
  const { attributes: withoutTalents } = calculateCombatStats(warrior, equipment);

  return withTalents.strength.total > withoutTalents.strength.total;
});

// Test 5: Buff effects
test('Buff effects increase stats', () => {
  const warrior = createTestWarrior();
  const equipment = createEmptyEquipment();

  const buffs = getDefaultBuffEffects();
  buffs.attackPower = 100;
  buffs.armor = 200;

  const { stats: withBuffs } = calculateCombatStats(warrior, equipment, getDefaultTalentBonuses(), buffs);
  const { stats: withoutBuffs } = calculateCombatStats(warrior, equipment);

  return (
    withBuffs.meleeAttackPower > withoutBuffs.meleeAttackPower &&
    withBuffs.armor > withoutBuffs.armor
  );
});

// Test 6: DPS estimation
test('DPS estimation is positive', () => {
  const warrior = createTestWarrior();
  const equipment = createEmptyEquipment();
  equipment.items.set('mainHand', createTestSword());

  const { stats } = calculateCombatStats(warrior, equipment);
  const classDef = getClassDefinition('warrior')!;
  const dps = estimateDps(stats, classDef);

  return dps > 0;
});

// Test 7: Survivability is bounded
test('Survivability is between 0-100', () => {
  const warrior = createTestWarrior();
  const equipment = createEmptyEquipment();

  const { stats } = calculateCombatStats(warrior, equipment);
  const surv = estimateSurvivability(stats, warrior.level);

  return surv >= 0 && surv <= 100;
});

// Test 8: Average item level
test('Average item level calculation', () => {
  const equipment = createEmptyEquipment();
  equipment.items.set('mainHand', { ...createTestSword(), itemLevel: 10 });
  equipment.items.set('chest', { ...createTestChest(), itemLevel: 20 });

  const avgIlvl = calculateAverageItemLevel(equipment);
  return avgIlvl === 15;
});

// Test 9: Empty equipment item level
test('Empty equipment returns 0 item level', () => {
  const equipment = createEmptyEquipment();
  return calculateAverageItemLevel(equipment) === 0;
});

// Test 10: Level 60 warrior full calculation
test('Level 60 warrior full stat calculation', () => {
  const warrior = createTestWarrior(60);
  warrior.baseStrength = 120;
  warrior.baseAgility = 80;
  warrior.baseStamina = 100;

  const equipment = createEmptyEquipment();
  const epicSword: GeneratedItem = {
    templateId: 100,
    name: 'Epic Sword',
    slot: 'mainHand',
    rarity: 'epic',
    itemLevel: 60,
    requiredLevel: 60,
    stats: { strength: 30, agility: 15, stamina: 20, critRating: 14 },
    isWeapon: true,
    weaponDamageMin: 80,
    weaponDamageMax: 150,
    weaponSpeed: 2.6,
    weaponDps: 44,
  };
  equipment.items.set('mainHand', epicSword);

  const { stats, attributes } = calculateCombatStats(warrior, equipment);

  console.log('  Level 60 Warrior Stats:');
  console.log(`    STR: ${attributes.strength.total} (${attributes.strength.base} base + ${attributes.strength.gear} gear)`);
  console.log(`    Max HP: ${stats.maxHealth}`);
  console.log(`    Melee AP: ${stats.meleeAttackPower}`);
  console.log(`    Melee Crit: ${stats.meleeCritChance.toFixed(2)}%`);
  console.log(`    Weapon: ${stats.weaponDamageMin}-${stats.weaponDamageMax} @ ${stats.weaponSpeed}s`);

  return (
    attributes.strength.total === 150 && // 120 + 30
    stats.meleeAttackPower > 200 &&
    stats.maxHealth > 1000
  );
});

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
