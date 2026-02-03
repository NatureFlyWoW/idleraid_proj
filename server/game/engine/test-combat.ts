// Simple test script for combat simulator
import { simulateCombat, simulateBatchCombat } from './CombatSimulator';
import { calculateCombatStats, getDefaultTalentBonuses, type CharacterData, type EquipmentSet } from '../systems/StatCalculator';
import { getClassDefinition, getClassStartingStats } from '../data/classes';
import type { CombatSimulationInput, EnemyDefinition, AbilityDefinition } from '@shared/types';
import type { GeneratedItem } from '@shared/types';

// Create a level 10 warrior for testing
function createTestWarrior(level: number = 10): CharacterData {
  const startingStats = getClassStartingStats('warrior');
  return {
    level,
    characterClass: 'warrior',
    baseStrength: startingStats.baseStrength + (level * 2),
    baseAgility: startingStats.baseAgility + level,
    baseIntellect: startingStats.baseIntellect,
    baseStamina: startingStats.baseStamina + (level * 2),
    baseSpirit: startingStats.baseSpirit,
    currentHealth: 0, // Will be calculated
    currentResource: 0,
  };
}

function createTestEquipment(): EquipmentSet {
  const sword: GeneratedItem = {
    templateId: 1,
    name: 'Worn Longsword',
    slot: 'mainHand',
    rarity: 'uncommon',
    itemLevel: 10,
    requiredLevel: 1,
    stats: { strength: 5, stamina: 3 },
    isWeapon: true,
    weaponDamageMin: 15,
    weaponDamageMax: 28,
    weaponSpeed: 2.6,
    weaponDps: 8.3,
  };

  const chest: GeneratedItem = {
    templateId: 2,
    name: 'Chainmail Vest',
    slot: 'chest',
    rarity: 'common',
    itemLevel: 8,
    requiredLevel: 1,
    stats: { stamina: 5, armor: 80 },
    isWeapon: false,
  };

  const equipment: EquipmentSet = { items: new Map() };
  equipment.items.set('mainHand', sword);
  equipment.items.set('chest', chest);
  return equipment;
}

function createTestEnemy(): EnemyDefinition {
  return {
    id: 'kobold_worker',
    name: 'Kobold Worker',
    level: 8,
    type: 'normal',
    health: 150,
    damage: 12,
    attackSpeed: 2.0,
    armor: 50,
    abilities: [],
    baseXp: 360,
    goldMin: 3,
    goldMax: 8,
  };
}

function createEliteEnemy(): EnemyDefinition {
  return {
    id: 'defias_pillager',
    name: 'Defias Pillager',
    level: 12,
    type: 'elite',
    health: 450,
    damage: 25,
    attackSpeed: 2.5,
    armor: 120,
    abilities: [
      {
        name: 'Fireball',
        damage: 40,
        cooldown: 8,
        trigger: 'timer',
        triggerValue: 8,
      },
    ],
    baseXp: 1080,
    goldMin: 10,
    goldMax: 20,
  };
}

// Get warrior abilities for testing
function getWarriorAbilities(): AbilityDefinition[] {
  const classDef = getClassDefinition('warrior');
  if (!classDef) return [];

  // Return a subset of abilities for testing
  return classDef.abilities.filter(a =>
    ['heroic_strike', 'rend', 'mortal_strike', 'execute'].includes(a.id)
  );
}

// Run tests
console.log('=== COMBAT SIMULATOR TESTS ===\n');

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

// Test 1: Basic combat simulation
test('Basic combat simulation completes', () => {
  const warrior = createTestWarrior(10);
  const equipment = createTestEquipment();
  const enemy = createTestEnemy();

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 120,
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const result = simulateCombat(input);

  console.log(`  Duration: ${result.durationSeconds}s`);
  console.log(`  Victory: ${result.victory}`);
  console.log(`  Damage dealt: ${result.totalDamageDealt}`);
  console.log(`  DPS: ${result.dps}`);
  console.log(`  Health remaining: ${result.playerHealthPercent.toFixed(0)}%`);

  return result.durationSeconds > 0 && (result.victory || result.deathReason !== undefined);
});

// Test 2: Combat generates combat log
test('Combat generates combat log entries', () => {
  const warrior = createTestWarrior(10);
  const equipment = createTestEquipment();
  const enemy = createTestEnemy();

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 30,
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const result = simulateCombat(input);

  console.log(`  Combat log entries: ${result.combatLog.length}`);
  console.log(`  Highlights: ${result.highlights.length}`);

  return result.combatLog.length > 0 && result.highlights.length > 0;
});

// Test 3: Higher level player wins against lower level mob
test('Level advantage leads to victory', () => {
  const warrior = createTestWarrior(15);
  const equipment = createTestEquipment();
  const enemy = createTestEnemy(); // Level 8

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 120,
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const result = simulateCombat(input);

  console.log(`  Level 15 warrior vs Level 8 kobold`);
  console.log(`  Victory: ${result.victory}`);
  console.log(`  Health remaining: ${result.playerHealthPercent.toFixed(0)}%`);

  return result.victory && result.playerHealthPercent > 50;
});

// Test 4: Difficulty affects combat
test('Heroic difficulty is harder than safe', () => {
  const warrior = createTestWarrior(10);
  const equipment = createTestEquipment();
  const enemy = createTestEnemy();

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const baseInput: Omit<CombatSimulationInput, 'difficulty'> = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 120,
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const safeResult = simulateCombat({ ...baseInput, difficulty: 'safe' });
  const heroicResult = simulateCombat({ ...baseInput, difficulty: 'heroic' });

  console.log(`  Safe: Health ${safeResult.playerHealthPercent.toFixed(0)}%`);
  console.log(`  Heroic: Health ${heroicResult.playerHealthPercent.toFixed(0)}%`);

  // Heroic should leave player with less health
  return safeResult.playerHealthPercent > heroicResult.playerHealthPercent;
});

// Test 5: Elite enemy is tougher
test('Elite enemy deals more damage', () => {
  const warrior = createTestWarrior(10);
  // Use minimal equipment for this test so combat lasts longer
  const equipment: EquipmentSet = { items: new Map() };
  const normalEnemy = createTestEnemy();
  const eliteEnemy = createEliteEnemy();

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const baseInput: Omit<CombatSimulationInput, 'enemy'> = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    maxDurationSeconds: 120,
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const normalResult = simulateCombat({ ...baseInput, enemy: normalEnemy });
  const eliteResult = simulateCombat({ ...baseInput, enemy: eliteEnemy });

  console.log(`  vs Normal: Damage taken ${normalResult.totalDamageTaken}`);
  console.log(`  vs Elite: Damage taken ${eliteResult.totalDamageTaken}`);

  return eliteResult.totalDamageTaken > normalResult.totalDamageTaken;
});

// Test 6: Victory grants rewards
test('Victory grants XP and gold', () => {
  const warrior = createTestWarrior(10); // Same level range as enemy
  const equipment = createTestEquipment();
  const enemy = createTestEnemy(); // Level 8

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 120,
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const result = simulateCombat(input);

  if (result.victory && result.rewards) {
    console.log(`  XP earned: ${result.rewards.experience}`);
    console.log(`  Gold earned: ${result.rewards.gold}`);
    return result.rewards.experience > 0 && result.rewards.gold > 0;
  }

  return false;
});

// Test 7: Batch simulation for offline progress
test('Batch simulation calculates totals', () => {
  const warrior = createTestWarrior(10); // Same level range as enemy
  const equipment = createTestEquipment();
  const enemy = createTestEnemy(); // Level 8

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const combatInput: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 120,
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const batchResult = simulateBatchCombat({
    combatInput,
    cycleCount: 50,
  });

  console.log(`  Cycles completed: ${batchResult.cyclesCompleted}`);
  console.log(`  Total XP: ${batchResult.totalXp}`);
  console.log(`  Total Gold: ${batchResult.totalGold}`);
  console.log(`  Deaths: ${batchResult.deaths}`);
  console.log(`  Avg DPS: ${batchResult.avgDps}`);

  return batchResult.cyclesCompleted > 0 && batchResult.totalXp > 0;
});

// Test 8: Sample combat log output
test('Combat log has correct format', () => {
  const warrior = createTestWarrior(10);
  const equipment = createTestEquipment();
  const enemy = createTestEnemy();

  const { stats } = calculateCombatStats(warrior, equipment);
  const abilities = getWarriorAbilities();

  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: warrior.level,
    characterClass: 'warrior',
    abilities,
    enemy,
    maxDurationSeconds: 10, // Short combat for log inspection
    difficulty: 'normal',
    settings: {
      healthPotionThreshold: 0.3,
      manaPotionThreshold: 0.2,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0.1,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  const result = simulateCombat(input);

  console.log('\n  Sample combat log entries:');
  result.combatLog.slice(0, 5).forEach(entry => {
    const dmgHeal = entry.damage > 0 ? `${entry.damage} dmg` : entry.healing > 0 ? `${entry.healing} heal` : '';
    console.log(`    [${entry.timestamp}s] ${entry.source}: ${entry.ability} - ${entry.type} ${dmgHeal}`);
  });

  return result.combatLog.every(entry =>
    entry.type !== undefined &&
    entry.ability !== undefined &&
    entry.source !== undefined &&
    typeof entry.timestamp === 'number'
  );
});

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
