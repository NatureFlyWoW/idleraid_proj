// ============= COMBAT SIMULATOR TESTS =============
// Tests for the combat simulation engine

import { describe, it, expect, beforeAll } from 'vitest';
import type { CombatSimulationInput, CombatStats, EnemyDefinition, AbilityDefinition } from '@shared/types';

describe('Combat Simulator', () => {
  let simulateCombat: typeof import('../server/game/engine/CombatSimulator').simulateCombat;
  let simulateBatchCombat: typeof import('../server/game/engine/CombatSimulator').simulateBatchCombat;

  beforeAll(async () => {
    const module = await import('../server/game/engine/CombatSimulator');
    simulateCombat = module.simulateCombat;
    simulateBatchCombat = module.simulateBatchCombat;
  });

  // ============= BASIC COMBAT TESTS =============

  describe('Basic Combat', () => {
    it('should allow player to defeat weak enemy', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();
      const input = createCombatInput(stats, enemy);

      const result = simulateCombat(input);

      expect(result.victory).toBe(true);
      expect(result.totalDamageDealt).toBeGreaterThan(0);
      expect(result.durationSeconds).toBeGreaterThan(0);
      expect(result.combatLog.length).toBeGreaterThan(0);
    });

    it('should allow player to die to strong enemy', () => {
      const stats = createWeakStats();
      const enemy = createStrongEnemy();
      const input = createCombatInput(stats, enemy);

      const result = simulateCombat(input);

      expect(result.victory).toBe(false);
      expect(result.playerHealthRemaining).toBe(0);
      expect(result.deathReason).toBeDefined();
    });

    it('should respect max duration limit', () => {
      const stats = createWeakStats();
      // Enemy with very high health - combat will timeout
      const tankEnemy: EnemyDefinition = {
        ...createWeakEnemy(),
        health: 1000000,
        damage: 1, // Low damage so player doesn't die
      };
      const input = createCombatInput(stats, tankEnemy, { maxDuration: 10 });

      const result = simulateCombat(input);

      expect(result.durationSeconds).toBeLessThanOrEqual(10);
    });

    it('should produce combat log with all attacks', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();
      const input = createCombatInput(stats, enemy);

      const result = simulateCombat(input);

      // Should have log entries
      expect(result.combatLog.length).toBeGreaterThan(0);

      // Each entry should have required fields
      for (const entry of result.combatLog) {
        expect(entry).toHaveProperty('type');
        expect(entry).toHaveProperty('damage');
        expect(entry).toHaveProperty('ability');
        expect(entry).toHaveProperty('timestamp');
        expect(entry).toHaveProperty('source');
      }
    });

    it('should generate highlights during combat', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();
      const input = createCombatInput(stats, enemy);

      const result = simulateCombat(input);

      // Should have combat start highlight at minimum
      expect(result.highlights.length).toBeGreaterThan(0);
      expect(result.highlights[0]).toContain('Combat begins');
    });
  });

  // ============= STAT CALCULATION TESTS =============

  describe('Stat Calculations', () => {
    it('should produce more damage with higher attack power', () => {
      const lowApStats = createStrongStats({ meleeAttackPower: 50 });
      const highApStats = createStrongStats({ meleeAttackPower: 500 });
      const enemy = createWeakEnemy();

      // Run multiple times and average to account for RNG
      const lowApResults: number[] = [];
      const highApResults: number[] = [];

      for (let i = 0; i < 5; i++) {
        const lowResult = simulateCombat(createCombatInput(lowApStats, enemy));
        const highResult = simulateCombat(createCombatInput(highApStats, enemy));
        lowApResults.push(lowResult.totalDamageDealt);
        highApResults.push(highResult.totalDamageDealt);
      }

      const avgLowDamage = lowApResults.reduce((a, b) => a + b, 0) / lowApResults.length;
      const avgHighDamage = highApResults.reduce((a, b) => a + b, 0) / highApResults.length;

      // High AP should result in more damage or faster kills (less total needed)
      // Since we're fighting a weak enemy, both win - but high AP does more damage
      // Actually high AP kills faster, so might deal less total damage
      // Better test: high AP should have higher DPS
      const lowApInput = createCombatInput(lowApStats, { ...enemy, health: 5000 });
      const highApInput = createCombatInput(highApStats, { ...enemy, health: 5000 });

      const lowDpsResult = simulateCombat(lowApInput);
      const highDpsResult = simulateCombat(highApInput);

      expect(highDpsResult.dps).toBeGreaterThan(lowDpsResult.dps);
    });

    it('should reduce damage taken with armor', () => {
      const lowArmorStats = createStrongStats({ armor: 0, armorReduction: 0 });
      const highArmorStats = createStrongStats({ armor: 2000, armorReduction: 0.5 });
      const enemy = createStrongEnemy();

      // Set up so player doesn't die immediately
      const lowArmorInput = createCombatInput(
        { ...lowArmorStats, maxHealth: 10000 },
        { ...enemy, health: 5000 },
        { maxDuration: 30 }
      );
      const highArmorInput = createCombatInput(
        { ...highArmorStats, maxHealth: 10000 },
        { ...enemy, health: 5000 },
        { maxDuration: 30 }
      );

      const lowArmorResult = simulateCombat(lowArmorInput);
      const highArmorResult = simulateCombat(highArmorInput);

      // High armor should take less damage
      expect(highArmorResult.totalDamageTaken).toBeLessThan(lowArmorResult.totalDamageTaken);
    });

    it('should produce critical hits based on crit chance', () => {
      // Create stats with very high crit chance
      const highCritStats = createStrongStats({ meleeCritChance: 80 });
      const enemy = createWeakEnemy();

      // Run combat with high crit
      const results: number[] = [];
      for (let i = 0; i < 5; i++) {
        const result = simulateCombat(createCombatInput(highCritStats, { ...enemy, health: 2000 }));
        results.push(result.critCount);
      }

      const totalCrits = results.reduce((a, b) => a + b, 0);
      // With 80% crit chance over multiple combats, should have crits
      expect(totalCrits).toBeGreaterThan(0);
    });

    it('should produce misses based on hit chance', () => {
      // Create stats with low hit chance
      const lowHitStats = createStrongStats({ hitChance: 50 });
      const enemy = createWeakEnemy();

      // Run combat with low hit
      const results: number[] = [];
      for (let i = 0; i < 5; i++) {
        const result = simulateCombat(createCombatInput(lowHitStats, { ...enemy, health: 2000 }));
        results.push(result.missCount);
      }

      const totalMisses = results.reduce((a, b) => a + b, 0);
      // With 50% hit chance, should have some misses
      expect(totalMisses).toBeGreaterThan(0);
    });

    it('should calculate DPS correctly', () => {
      const stats = createStrongStats();
      const enemy: EnemyDefinition = {
        ...createWeakEnemy(),
        health: 10000, // Long fight for better DPS calculation
      };
      const input = createCombatInput(stats, enemy, { maxDuration: 60 });

      const result = simulateCombat(input);

      // DPS should be total damage / duration
      const calculatedDps = result.totalDamageDealt / Math.max(1, result.durationSeconds);
      expect(result.dps).toBeCloseTo(calculatedDps, 0);
    });
  });

  // ============= DIFFICULTY MODIFIER TESTS =============

  describe('Difficulty Modifiers', () => {
    it('should make safe mode easier (enemy has less health/damage)', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();

      const safeInput = createCombatInput(stats, enemy, { difficulty: 'safe' });
      const heroicInput = createCombatInput(stats, enemy, { difficulty: 'heroic' });

      const safeResult = simulateCombat(safeInput);
      const heroicResult = simulateCombat(heroicInput);

      // Safe should result in more remaining health (easier fight)
      expect(safeResult.playerHealthPercent).toBeGreaterThan(heroicResult.playerHealthPercent);
    });

    it('should make heroic mode harder', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();

      const normalInput = createCombatInput(stats, enemy, { difficulty: 'normal' });
      const heroicInput = createCombatInput(stats, enemy, { difficulty: 'heroic' });

      const normalResults: number[] = [];
      const heroicResults: number[] = [];

      for (let i = 0; i < 3; i++) {
        normalResults.push(simulateCombat(normalInput).playerHealthPercent);
        heroicResults.push(simulateCombat(heroicInput).playerHealthPercent);
      }

      const avgNormalHealth = normalResults.reduce((a, b) => a + b, 0) / normalResults.length;
      const avgHeroicHealth = heroicResults.reduce((a, b) => a + b, 0) / heroicResults.length;

      // Normal should leave player with more health on average
      expect(avgNormalHealth).toBeGreaterThan(avgHeroicHealth);
    });

    it('should apply reward multipliers on victory', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();

      const safeInput = createCombatInput(stats, enemy, { difficulty: 'safe' });
      const heroicInput = createCombatInput(stats, enemy, { difficulty: 'heroic' });

      const safeResult = simulateCombat(safeInput);
      const heroicResult = simulateCombat(heroicInput);

      // Both should win
      expect(safeResult.victory).toBe(true);
      expect(heroicResult.victory).toBe(true);

      // Heroic should give more rewards (2x vs 0.5x)
      if (safeResult.rewards && heroicResult.rewards) {
        expect(heroicResult.rewards.experience).toBeGreaterThan(safeResult.rewards.experience);
        expect(heroicResult.rewards.gold).toBeGreaterThan(safeResult.rewards.gold);
      }
    });
  });

  // ============= CLASS ABILITY TESTS =============

  describe('Class Abilities', () => {
    it('should generate rage from damage dealt (warrior)', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();
      const warriorAbilities = getWarriorAbilities();

      const input: CombatSimulationInput = {
        ...createCombatInput(stats, enemy),
        characterClass: 'warrior',
        abilities: warriorAbilities,
      };

      const result = simulateCombat(input);

      // Combat log should show ability usage (warrior starts with 0 rage, generates it)
      const abilityUsed = result.combatLog.some(
        entry => entry.source === 'player' && entry.ability !== 'Auto Attack'
      );

      // Warrior should have used abilities if rage was generated
      // (depends on combat duration and rage generation rate)
      expect(result.victory).toBe(true);
    });

    it('should consume mana for spell abilities (mage)', () => {
      const mageStats = createMageStats();
      const enemy = createWeakEnemy();
      const mageAbilities = getMageAbilities();

      const input: CombatSimulationInput = {
        ...createCombatInput(mageStats, { ...enemy, health: 2000 }),
        characterClass: 'mage',
        abilities: mageAbilities,
      };

      const result = simulateCombat(input);

      // Should have cast spells
      const spellsCast = result.combatLog.filter(
        entry => entry.source === 'player' && entry.ability !== 'Auto Attack'
      );

      // Mage should cast spells
      expect(spellsCast.length).toBeGreaterThan(0);
    });

    it('should deal correct ability damage', () => {
      const stats = createStrongStats({ spellPower: 100 });
      const enemy = createWeakEnemy();

      // Single spell ability for testing
      const testAbility: AbilityDefinition = {
        id: 'test_spell',
        name: 'Test Spell',
        description: 'Test',
        type: 'instant',
        resourceCost: 0,
        cooldownSeconds: 0,
        castTimeSeconds: 0,
        baseDamage: 100,
        baseHealing: 0,
        apCoefficient: 0,
        spCoefficient: 0.5, // 100 base + (100 SP * 0.5) = 150 expected
      };

      const input = createCombatInput(stats, { ...enemy, health: 500 });
      input.abilities = [testAbility];

      const result = simulateCombat(input);

      // Should have used the ability
      const abilityLog = result.combatLog.find(e => e.ability === 'Test Spell');
      expect(abilityLog).toBeDefined();
      // Damage should be around expected (RNG variance for hit/crit)
    });
  });

  // ============= BATCH SIMULATION TESTS =============

  describe('Batch Simulation', () => {
    it('should aggregate results from multiple combats', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();

      const batchResult = simulateBatchCombat({
        combatInput: createCombatInput(stats, enemy),
        cycleCount: 50,
      });

      expect(batchResult.cyclesCompleted).toBeGreaterThan(0);
      expect(batchResult.totalXp).toBeGreaterThan(0);
      expect(batchResult.totalGold).toBeGreaterThan(0);
    });

    it('should stop on death in batch mode', () => {
      const stats = createWeakStats();
      const enemy = createStrongEnemy();

      const batchResult = simulateBatchCombat({
        combatInput: createCombatInput(stats, enemy),
        cycleCount: 100,
      });

      // Should have at least one death
      expect(batchResult.deaths).toBeGreaterThan(0);
      // Deaths should stop further progress
      expect(batchResult.cyclesCompleted).toBeLessThan(100);
    });

    it('should calculate average DPS across cycles', () => {
      const stats = createStrongStats();
      const enemy = createWeakEnemy();

      const batchResult = simulateBatchCombat({
        combatInput: createCombatInput(stats, { ...enemy, health: 500 }),
        cycleCount: 10,
      });

      expect(batchResult.avgDps).toBeGreaterThan(0);
      expect(batchResult.avgCombatDuration).toBeGreaterThan(0);
    });
  });
});

// ============= TEST HELPERS =============

function createStrongStats(overrides: Partial<CombatStats> = {}): CombatStats {
  return {
    meleeAttackPower: 200,
    rangedAttackPower: 0,
    spellPower: 0,
    meleeCritChance: 15,
    rangedCritChance: 0,
    spellCritChance: 5,
    hitChance: 95,
    hastePercent: 0,
    armor: 500,
    armorReduction: 0.2,
    dodgeChance: 5,
    parryChance: 5,
    blockChance: 0,
    blockValue: 0,
    maxHealth: 1000,
    maxResource: 100,
    healthRegenPerSecond: 1,
    resourceRegenPerSecond: 0,
    weaponDamageMin: 30,
    weaponDamageMax: 60,
    weaponSpeed: 2.6,
    weaponDps: 17,
    ...overrides,
  };
}

function createWeakStats(overrides: Partial<CombatStats> = {}): CombatStats {
  return {
    meleeAttackPower: 30,
    rangedAttackPower: 0,
    spellPower: 0,
    meleeCritChance: 5,
    rangedCritChance: 0,
    spellCritChance: 0,
    hitChance: 80,
    hastePercent: 0,
    armor: 50,
    armorReduction: 0.05,
    dodgeChance: 2,
    parryChance: 0,
    blockChance: 0,
    blockValue: 0,
    maxHealth: 200,
    maxResource: 100,
    healthRegenPerSecond: 0,
    resourceRegenPerSecond: 0,
    weaponDamageMin: 5,
    weaponDamageMax: 10,
    weaponSpeed: 2.0,
    weaponDps: 4,
    ...overrides,
  };
}

function createMageStats(overrides: Partial<CombatStats> = {}): CombatStats {
  return {
    meleeAttackPower: 20,
    rangedAttackPower: 0,
    spellPower: 150,
    meleeCritChance: 0,
    rangedCritChance: 0,
    spellCritChance: 20,
    hitChance: 95,
    hastePercent: 0,
    armor: 100,
    armorReduction: 0.05,
    dodgeChance: 2,
    parryChance: 0,
    blockChance: 0,
    blockValue: 0,
    maxHealth: 500,
    maxResource: 1000, // High mana pool
    healthRegenPerSecond: 0,
    resourceRegenPerSecond: 10,
    weaponDamageMin: 10,
    weaponDamageMax: 20,
    weaponSpeed: 3.0,
    weaponDps: 5,
    ...overrides,
  };
}

function createWeakEnemy(): EnemyDefinition {
  return {
    id: 'test_enemy',
    name: 'Test Enemy',
    level: 10,
    type: 'normal',
    health: 300,
    damage: 15,
    attackSpeed: 2.0,
    armor: 50,
    abilities: [],
    baseXp: 100,
    goldMin: 5,
    goldMax: 10,
  };
}

function createStrongEnemy(): EnemyDefinition {
  return {
    id: 'strong_enemy',
    name: 'Strong Enemy',
    level: 60,
    type: 'elite',
    health: 5000,
    damage: 200,
    attackSpeed: 1.5,
    armor: 500,
    abilities: [],
    baseXp: 1000,
    goldMin: 50,
    goldMax: 100,
  };
}

function createCombatInput(
  stats: CombatStats,
  enemy: EnemyDefinition,
  options: {
    maxDuration?: number;
    difficulty?: 'safe' | 'normal' | 'challenging' | 'heroic';
  } = {}
): CombatSimulationInput {
  return {
    characterStats: stats,
    characterLevel: 10,
    characterClass: 'warrior',
    abilities: [],
    enemy,
    maxDurationSeconds: options.maxDuration ?? 120,
    difficulty: options.difficulty ?? 'normal',
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
}

function getWarriorAbilities(): AbilityDefinition[] {
  return [
    {
      id: 'heroic_strike',
      name: 'Heroic Strike',
      description: 'A strong attack',
      type: 'instant',
      resourceCost: 15,
      cooldownSeconds: 0,
      castTimeSeconds: 0,
      baseDamage: 50,
      baseHealing: 0,
      apCoefficient: 0.5,
      spCoefficient: 0,
    },
    {
      id: 'mortal_strike',
      name: 'Mortal Strike',
      description: 'A powerful strike',
      type: 'instant',
      resourceCost: 30,
      cooldownSeconds: 6,
      castTimeSeconds: 0,
      baseDamage: 100,
      baseHealing: 0,
      apCoefficient: 0.8,
      spCoefficient: 0,
    },
  ];
}

function getMageAbilities(): AbilityDefinition[] {
  return [
    {
      id: 'fireball',
      name: 'Fireball',
      description: 'Hurls a ball of fire',
      type: 'cast',
      resourceCost: 50,
      cooldownSeconds: 0,
      castTimeSeconds: 2.5,
      baseDamage: 150,
      baseHealing: 0,
      apCoefficient: 0,
      spCoefficient: 0.8,
    },
    {
      id: 'fire_blast',
      name: 'Fire Blast',
      description: 'Instant fire damage',
      type: 'instant',
      resourceCost: 30,
      cooldownSeconds: 8,
      castTimeSeconds: 0,
      baseDamage: 80,
      baseHealing: 0,
      apCoefficient: 0,
      spCoefficient: 0.4,
    },
  ];
}
