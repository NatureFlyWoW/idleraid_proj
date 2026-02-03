// ============= COMBAT SIMULATION ENGINE =============
// Time-based combat simulation using WoW Classic-style formulas
// Each tick = 1 second of combat

import type {
  CombatStats,
  CombatResult,
  CombatSimulationInput,
  CombatSimulationOutput,
  EnemyDefinition,
  AbilityDefinition,
  DifficultyModifiers,
} from '@shared/types';
import { DIFFICULTY_MODIFIERS } from '@shared/types';
import {
  calculateArmorReduction,
  calculateXpGain,
  calculateGoldDrop,
  DAMAGE_PER_AP,
  BASE_CRIT_MULTIPLIER,
  SPELL_CRIT_MULTIPLIER,
  HEALING_CRIT_MULTIPLIER,
  GCD_SECONDS,
  COMBAT_TICK_SECONDS,
  RAGE_PER_DAMAGE_DEALT,
  RAGE_PER_DAMAGE_TAKEN,
  ENERGY_REGEN_PER_SECOND,
  GLANCING_BLOW_CHANCE,
  GLANCING_BLOW_DAMAGE_REDUCTION_MIN,
  GLANCING_BLOW_DAMAGE_REDUCTION_MAX,
} from '@shared/constants';
import type { Difficulty } from '@shared/schema';

// ============= INTERFACES =============

interface CombatState {
  playerHealth: number;
  playerMaxHealth: number;
  playerResource: number;
  playerMaxResource: number;
  resourceType: 'rage' | 'mana' | 'energy';

  enemyHealth: number;
  enemyMaxHealth: number;

  // Cooldown tracking (ability ID -> seconds remaining)
  playerCooldowns: Map<string, number>;
  enemyCooldowns: Map<string, number>;

  // GCD tracking
  playerGcd: number;

  // DOT/HOT tracking
  activeEffects: ActiveEffect[];

  // Timing
  currentTime: number;
  lastAutoAttack: number;

  // Combat log
  combatLog: CombatResult[];
  highlights: string[];

  // Statistics
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalHealing: number;
  critCount: number;
  missCount: number;
}

interface ActiveEffect {
  id: string;
  name: string;
  source: 'player' | 'enemy';
  type: 'dot' | 'hot' | 'buff' | 'debuff';
  tickDamage: number;
  tickHealing: number;
  ticksRemaining: number;
  tickInterval: number;
  nextTickAt: number;
}

// ============= RANDOM HELPERS =============

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollChance(percentChance: number): boolean {
  return Math.random() * 100 < percentChance;
}

// ============= COMBAT FLAVOR TEXT =============

const CRIT_FLAVOR = [
  'CRUSHING blow!',
  'DEVASTATING strike!',
  'CRITICAL hit!',
  'MASSIVE damage!',
];

const MISS_FLAVOR = [
  'The attack misses!',
  'Swing and a miss!',
  'The target evades!',
];

const CLOSE_CALL_FLAVOR = [
  'Barely survived that one!',
  'A close call!',
  'Hanging on by a thread!',
];

const ABILITY_FLAVOR: Record<string, string[]> = {
  mortal_strike: ['cleaves through armor!', 'lands a vicious blow!'],
  bloodthirst: ['feeds on the enemy\'s blood!', 'strikes with fury!'],
  fireball: ['hurls a blazing fireball!', 'engulfs the enemy in flame!'],
  frostbolt: ['chills the enemy to the bone!', 'freezes the target!'],
  greater_heal: ['channels healing light!', 'mends grievous wounds!'],
  flash_heal: ['quick heals the wounded!'],
};

function getRandomFlavor(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

function getAbilityFlavor(abilityId: string): string | undefined {
  const flavors = ABILITY_FLAVOR[abilityId];
  return flavors ? getRandomFlavor(flavors) : undefined;
}

// ============= DAMAGE CALCULATION =============

function calculatePhysicalDamage(
  attackPower: number,
  weaponDamageMin: number,
  weaponDamageMax: number,
  weaponSpeed: number,
  enemyArmor: number,
  attackerLevel: number,
  abilityDamage: number = 0,
  apCoefficient: number = 0
): number {
  // Base weapon damage
  const weaponDamage = randomBetween(weaponDamageMin, weaponDamageMax);

  // AP bonus normalized to weapon speed
  const apBonus = (attackPower / DAMAGE_PER_AP) * weaponSpeed;

  // Ability bonus
  const abilityBonus = abilityDamage + (attackPower * apCoefficient);

  // Total raw damage
  const rawDamage = weaponDamage + apBonus + abilityBonus;

  // Apply armor reduction
  const armorReduction = calculateArmorReduction(enemyArmor, attackerLevel);
  const finalDamage = rawDamage * (1 - armorReduction);

  return Math.max(1, Math.floor(finalDamage));
}

function calculateSpellDamage(
  baseDamage: number,
  spellPower: number,
  spCoefficient: number,
  targetResistance: number = 0
): number {
  const spBonus = spellPower * spCoefficient;
  const rawDamage = baseDamage + spBonus;

  // Simplified resistance calculation (resistance / 5 = % reduction, capped at 75%)
  const resistanceReduction = Math.min(0.75, targetResistance / 500);
  const finalDamage = rawDamage * (1 - resistanceReduction);

  return Math.max(1, Math.floor(finalDamage));
}

function calculateHealing(
  baseHealing: number,
  spellPower: number,
  spCoefficient: number
): number {
  const spBonus = spellPower * spCoefficient;
  return Math.max(1, Math.floor(baseHealing + spBonus));
}

// ============= HIT/CRIT/MISS ROLLS =============

type AttackResult = 'hit' | 'crit' | 'miss' | 'dodge' | 'parry' | 'block' | 'glancing';

function rollAttack(
  hitChance: number,
  critChance: number,
  targetDodge: number,
  targetParry: number,
  targetBlock: number,
  isAttackingBoss: boolean
): AttackResult {
  const roll = Math.random() * 100;

  // Miss chance (inverse of hit)
  const missChance = 100 - hitChance;
  if (roll < missChance) return 'miss';

  // Dodge
  if (roll < missChance + targetDodge) return 'dodge';

  // Parry (only if target has weapon)
  if (roll < missChance + targetDodge + targetParry) return 'parry';

  // Block (only if target has shield)
  if (roll < missChance + targetDodge + targetParry + targetBlock) return 'block';

  // Glancing blow (only vs higher-level enemies/bosses)
  if (isAttackingBoss && roll < missChance + targetDodge + targetParry + targetBlock + GLANCING_BLOW_CHANCE) {
    return 'glancing';
  }

  // Crit
  if (rollChance(critChance)) return 'crit';

  return 'hit';
}

function rollSpellHit(hitChance: number, critChance: number): 'hit' | 'crit' | 'miss' {
  const missChance = 100 - hitChance;
  if (rollChance(missChance)) return 'miss';
  if (rollChance(critChance)) return 'crit';
  return 'hit';
}

// ============= AI ABILITY SELECTION =============

function selectPlayerAbility(
  abilities: AbilityDefinition[],
  state: CombatState,
  stats: CombatStats,
  isLowHealth: boolean
): AbilityDefinition | null {
  // Filter available abilities (off cooldown, have resource, not on GCD)
  const available = abilities.filter(ability => {
    const cooldownRemaining = state.playerCooldowns.get(ability.id) ?? 0;
    if (cooldownRemaining > 0) return false;

    // Check resource cost
    if (ability.resourceCost > state.playerResource && state.resourceType !== 'rage') {
      return false;
    }

    return true;
  });

  if (available.length === 0) return null;

  // Priority: Heal if low health, then highest damage
  if (isLowHealth) {
    const heal = available.find(a => a.baseHealing > 0);
    if (heal) return heal;
  }

  // Sort by expected damage/healing value
  const sorted = available.sort((a, b) => {
    const aDamage = a.baseDamage + (stats.meleeAttackPower * a.apCoefficient) + (stats.spellPower * a.spCoefficient);
    const bDamage = b.baseDamage + (stats.meleeAttackPower * b.apCoefficient) + (stats.spellPower * b.spCoefficient);

    // Prioritize instant abilities when moving
    if (a.type === 'instant' && b.type !== 'instant') return -1;
    if (b.type === 'instant' && a.type !== 'instant') return 1;

    return bDamage - aDamage;
  });

  return sorted[0];
}

// ============= COMBAT TICK PROCESSING =============

function processAutoAttack(
  state: CombatState,
  stats: CombatStats,
  enemy: EnemyDefinition,
  difficultyMods: DifficultyModifiers
): void {
  const weaponSpeed = stats.weaponSpeed;

  if (state.currentTime - state.lastAutoAttack < weaponSpeed) {
    return; // Weapon not ready
  }

  state.lastAutoAttack = state.currentTime;

  // Roll attack result
  const result = rollAttack(
    stats.hitChance,
    stats.meleeCritChance,
    0, // enemy dodge
    0, // enemy parry
    0, // enemy block
    enemy.type === 'boss' || enemy.type === 'raid_boss'
  );

  let damage = 0;
  let isCrit = false;
  let flavorText: string | undefined;

  const adjustedEnemyArmor = enemy.armor * difficultyMods.enemyHealthMultiplier;

  switch (result) {
    case 'hit':
      damage = calculatePhysicalDamage(
        stats.meleeAttackPower,
        stats.weaponDamageMin,
        stats.weaponDamageMax,
        stats.weaponSpeed,
        adjustedEnemyArmor,
        60 // Assume level 60 for now
      );
      break;

    case 'crit':
      damage = calculatePhysicalDamage(
        stats.meleeAttackPower,
        stats.weaponDamageMin,
        stats.weaponDamageMax,
        stats.weaponSpeed,
        adjustedEnemyArmor,
        60
      );
      damage = Math.floor(damage * BASE_CRIT_MULTIPLIER);
      isCrit = true;
      state.critCount++;
      flavorText = getRandomFlavor(CRIT_FLAVOR);
      break;

    case 'miss':
      state.missCount++;
      flavorText = getRandomFlavor(MISS_FLAVOR);
      break;

    case 'glancing':
      damage = calculatePhysicalDamage(
        stats.meleeAttackPower,
        stats.weaponDamageMin,
        stats.weaponDamageMax,
        stats.weaponSpeed,
        adjustedEnemyArmor,
        60
      );
      const glancingReduction = randomBetween(GLANCING_BLOW_DAMAGE_REDUCTION_MIN, GLANCING_BLOW_DAMAGE_REDUCTION_MAX);
      damage = Math.floor(damage * (1 - glancingReduction / 100));
      flavorText = 'Glancing blow';
      break;

    case 'dodge':
    case 'parry':
    case 'block':
      flavorText = `Enemy ${result}s the attack`;
      break;
  }

  state.enemyHealth -= damage;
  state.totalDamageDealt += damage;

  // Generate rage from damage dealt (for warriors)
  if (state.resourceType === 'rage' && damage > 0) {
    const rageGained = Math.floor(damage * RAGE_PER_DAMAGE_DEALT * 10);
    state.playerResource = Math.min(state.playerMaxResource, state.playerResource + rageGained);
  }

  state.combatLog.push({
    type: result,
    damage,
    healing: 0,
    ability: 'Auto Attack',
    timestamp: state.currentTime,
    source: 'player',
    isCrit,
    flavorText,
  });
}

function processEnemyAttack(
  state: CombatState,
  stats: CombatStats,
  enemy: EnemyDefinition,
  difficultyMods: DifficultyModifiers
): void {
  const attackSpeed = enemy.attackSpeed;

  // Simple enemy attack timing (attack every attackSpeed seconds)
  if (state.currentTime % Math.ceil(attackSpeed) !== 0) {
    return;
  }

  // Roll against player defenses
  const result = rollAttack(
    95, // Enemy base hit
    5,  // Enemy base crit
    stats.dodgeChance,
    stats.parryChance,
    stats.blockChance,
    false
  );

  const baseDamage = enemy.damage * difficultyMods.enemyDamageMultiplier;
  let damage = 0;
  let flavorText: string | undefined;

  switch (result) {
    case 'hit':
      damage = Math.floor(baseDamage * (1 - stats.armorReduction));
      break;

    case 'crit':
      damage = Math.floor(baseDamage * BASE_CRIT_MULTIPLIER * (1 - stats.armorReduction));
      flavorText = `${enemy.name} lands a critical strike!`;
      break;

    case 'dodge':
      flavorText = 'You dodge the attack!';
      break;

    case 'parry':
      flavorText = 'You parry the attack!';
      break;

    case 'block':
      damage = Math.max(0, Math.floor(baseDamage * (1 - stats.armorReduction)) - stats.blockValue);
      flavorText = `You block, reducing damage by ${stats.blockValue}`;
      break;

    case 'miss':
      flavorText = 'The enemy misses!';
      break;
  }

  state.playerHealth -= damage;
  state.totalDamageTaken += damage;

  // Generate rage from damage taken (for warriors)
  if (state.resourceType === 'rage' && damage > 0) {
    const rageGained = Math.floor(damage * RAGE_PER_DAMAGE_TAKEN * 10);
    state.playerResource = Math.min(state.playerMaxResource, state.playerResource + rageGained);
  }

  // Check for close call
  const healthPercent = state.playerHealth / state.playerMaxHealth;
  if (healthPercent < 0.2 && healthPercent > 0 && damage > 0) {
    state.highlights.push(getRandomFlavor(CLOSE_CALL_FLAVOR));
  }

  state.combatLog.push({
    type: result,
    damage,
    healing: 0,
    ability: 'Melee',
    timestamp: state.currentTime,
    source: 'enemy',
    isCrit: result === 'crit',
    flavorText,
  });
}

function processAbility(
  state: CombatState,
  stats: CombatStats,
  ability: AbilityDefinition,
  enemy: EnemyDefinition,
  difficultyMods: DifficultyModifiers
): void {
  // Deduct resource cost
  if (state.resourceType !== 'rage') {
    state.playerResource -= ability.resourceCost;
  } else {
    // Rage abilities consume rage
    state.playerResource = Math.max(0, state.playerResource - ability.resourceCost);
  }

  // Set cooldown
  state.playerCooldowns.set(ability.id, ability.cooldownSeconds);

  // Set GCD
  state.playerGcd = GCD_SECONDS;

  // Determine if it's a damage or healing ability
  if (ability.baseDamage > 0 || ability.apCoefficient > 0 || ability.spCoefficient > 0) {
    processOffensiveAbility(state, stats, ability, enemy, difficultyMods);
  }

  if (ability.baseHealing > 0) {
    processHealingAbility(state, stats, ability);
  }

  // Handle DOTs
  if (ability.isDot && ability.tickCount && ability.tickIntervalSeconds) {
    const tickDamage = calculateSpellDamage(
      ability.baseDamage / ability.tickCount,
      stats.spellPower,
      ability.spCoefficient / ability.tickCount
    );

    state.activeEffects.push({
      id: ability.id,
      name: ability.name,
      source: 'player',
      type: 'dot',
      tickDamage,
      tickHealing: 0,
      ticksRemaining: ability.tickCount,
      tickInterval: ability.tickIntervalSeconds,
      nextTickAt: state.currentTime + ability.tickIntervalSeconds,
    });

    state.combatLog.push({
      type: 'hit',
      damage: 0,
      healing: 0,
      ability: ability.name,
      timestamp: state.currentTime,
      source: 'player',
      isCrit: false,
      flavorText: `${ability.name} applied to ${enemy.name}`,
    });
  }

  // Handle HOTs
  if (ability.isHot && ability.tickCount && ability.tickIntervalSeconds) {
    const tickHealing = calculateHealing(
      ability.baseHealing / ability.tickCount,
      stats.spellPower,
      ability.spCoefficient / ability.tickCount
    );

    state.activeEffects.push({
      id: ability.id,
      name: ability.name,
      source: 'player',
      type: 'hot',
      tickDamage: 0,
      tickHealing,
      ticksRemaining: ability.tickCount,
      tickInterval: ability.tickIntervalSeconds,
      nextTickAt: state.currentTime + ability.tickIntervalSeconds,
    });
  }
}

function processOffensiveAbility(
  state: CombatState,
  stats: CombatStats,
  ability: AbilityDefinition,
  enemy: EnemyDefinition,
  difficultyMods: DifficultyModifiers
): void {
  // Don't process DOTs here (they're handled separately)
  if (ability.isDot) return;

  // Determine if physical or spell
  const isPhysical = ability.apCoefficient > 0;

  let result: AttackResult | 'hit' | 'crit' | 'miss';
  let damage = 0;
  let isCrit = false;
  let flavorText = getAbilityFlavor(ability.id);

  const adjustedEnemyArmor = enemy.armor * difficultyMods.enemyHealthMultiplier;

  if (isPhysical) {
    result = rollAttack(
      stats.hitChance,
      stats.meleeCritChance,
      0, 0, 0,
      enemy.type === 'boss' || enemy.type === 'raid_boss'
    );

    if (result === 'hit' || result === 'crit' || result === 'glancing') {
      damage = calculatePhysicalDamage(
        stats.meleeAttackPower,
        stats.weaponDamageMin,
        stats.weaponDamageMax,
        stats.weaponSpeed,
        adjustedEnemyArmor,
        60,
        ability.baseDamage,
        ability.apCoefficient
      );

      if (result === 'crit') {
        damage = Math.floor(damage * BASE_CRIT_MULTIPLIER);
        isCrit = true;
        state.critCount++;
        flavorText = `${ability.name} ${getRandomFlavor(CRIT_FLAVOR)}`;
      } else if (result === 'glancing') {
        const reduction = randomBetween(GLANCING_BLOW_DAMAGE_REDUCTION_MIN, GLANCING_BLOW_DAMAGE_REDUCTION_MAX);
        damage = Math.floor(damage * (1 - reduction / 100));
      }
    } else if (result === 'miss') {
      state.missCount++;
      flavorText = `${ability.name} misses!`;
    }
  } else {
    // Spell
    result = rollSpellHit(stats.hitChance, stats.spellCritChance);

    if (result === 'hit' || result === 'crit') {
      damage = calculateSpellDamage(
        ability.baseDamage,
        stats.spellPower,
        ability.spCoefficient
      );

      if (result === 'crit') {
        damage = Math.floor(damage * SPELL_CRIT_MULTIPLIER); // Spell damage crits for 1.5x
        isCrit = true;
        state.critCount++;
        flavorText = `${ability.name} ${getRandomFlavor(CRIT_FLAVOR)}`;
      }
    } else {
      state.missCount++;
      flavorText = `${ability.name} resisted!`;
    }
  }

  state.enemyHealth -= damage;
  state.totalDamageDealt += damage;

  // Generate rage from damage dealt (for warriors)
  if (state.resourceType === 'rage' && damage > 0) {
    const rageGained = Math.floor(damage * RAGE_PER_DAMAGE_DEALT * 5);
    state.playerResource = Math.min(state.playerMaxResource, state.playerResource + rageGained);
  }

  state.combatLog.push({
    type: result as CombatResult['type'],
    damage,
    healing: 0,
    ability: ability.name,
    timestamp: state.currentTime,
    source: 'player',
    isCrit,
    flavorText,
  });
}

function processHealingAbility(
  state: CombatState,
  stats: CombatStats,
  ability: AbilityDefinition
): void {
  // Don't process HOTs here (they're handled separately)
  if (ability.isHot) return;

  const result = rollSpellHit(100, stats.spellCritChance); // Heals always hit

  let healing = calculateHealing(ability.baseHealing, stats.spellPower, ability.spCoefficient);
  let isCrit = false;
  let flavorText = getAbilityFlavor(ability.id);

  if (result === 'crit') {
    healing = Math.floor(healing * HEALING_CRIT_MULTIPLIER);
    isCrit = true;
    flavorText = `${ability.name} critically heals!`;
  }

  // Apply healing (don't overheal)
  const actualHealing = Math.min(healing, state.playerMaxHealth - state.playerHealth);
  state.playerHealth += actualHealing;
  state.totalHealing += actualHealing;

  state.combatLog.push({
    type: isCrit ? 'crit' : 'hit',
    damage: 0,
    healing: actualHealing,
    ability: ability.name,
    timestamp: state.currentTime,
    source: 'player',
    isCrit,
    flavorText,
  });
}

function processActiveEffects(state: CombatState): void {
  const effectsToRemove: number[] = [];

  for (let i = 0; i < state.activeEffects.length; i++) {
    const effect = state.activeEffects[i];

    if (state.currentTime >= effect.nextTickAt) {
      // Apply tick
      if (effect.type === 'dot') {
        state.enemyHealth -= effect.tickDamage;
        state.totalDamageDealt += effect.tickDamage;

        state.combatLog.push({
          type: 'hit',
          damage: effect.tickDamage,
          healing: 0,
          ability: `${effect.name} (tick)`,
          timestamp: state.currentTime,
          source: 'player',
          isCrit: false,
        });
      } else if (effect.type === 'hot') {
        const actualHealing = Math.min(effect.tickHealing, state.playerMaxHealth - state.playerHealth);
        state.playerHealth += actualHealing;
        state.totalHealing += actualHealing;

        state.combatLog.push({
          type: 'hit',
          damage: 0,
          healing: actualHealing,
          ability: `${effect.name} (tick)`,
          timestamp: state.currentTime,
          source: 'player',
          isCrit: false,
        });
      }

      effect.ticksRemaining--;
      effect.nextTickAt = state.currentTime + effect.tickInterval;

      if (effect.ticksRemaining <= 0) {
        effectsToRemove.push(i);
      }
    }
  }

  // Remove expired effects (in reverse order to preserve indices)
  for (let i = effectsToRemove.length - 1; i >= 0; i--) {
    state.activeEffects.splice(effectsToRemove[i], 1);
  }
}

function processResourceRegen(state: CombatState, stats: CombatStats): void {
  switch (state.resourceType) {
    case 'mana':
      // Mana regen from spirit (simplified: regen every tick)
      const manaRegen = stats.resourceRegenPerSecond;
      state.playerResource = Math.min(state.playerMaxResource, state.playerResource + manaRegen);
      break;

    case 'energy':
      // Energy regens at fixed rate
      state.playerResource = Math.min(
        state.playerMaxResource,
        state.playerResource + ENERGY_REGEN_PER_SECOND
      );
      break;

    case 'rage':
      // Rage doesn't naturally regen (generated from damage)
      // But it does decay out of combat (not applicable in combat)
      break;
  }
}

function tickCooldowns(state: CombatState): void {
  // Tick player cooldowns
  for (const [abilityId, remaining] of state.playerCooldowns) {
    if (remaining > 0) {
      state.playerCooldowns.set(abilityId, remaining - COMBAT_TICK_SECONDS);
    }
  }

  // Tick enemy cooldowns
  for (const [abilityId, remaining] of state.enemyCooldowns) {
    if (remaining > 0) {
      state.enemyCooldowns.set(abilityId, remaining - COMBAT_TICK_SECONDS);
    }
  }

  // Tick GCD
  if (state.playerGcd > 0) {
    state.playerGcd -= COMBAT_TICK_SECONDS;
  }
}

// ============= MAIN SIMULATION =============

export function simulateCombat(input: CombatSimulationInput): CombatSimulationOutput {
  const difficultyMods: DifficultyModifiers = DIFFICULTY_MODIFIERS[input.difficulty];

  // Apply difficulty modifiers to enemy
  const adjustedEnemyHealth = Math.floor(input.enemy.health * difficultyMods.enemyHealthMultiplier);

  // Initialize combat state
  const state: CombatState = {
    playerHealth: input.characterStats.maxHealth,
    playerMaxHealth: input.characterStats.maxHealth,
    playerResource: input.characterStats.maxResource,
    playerMaxResource: input.characterStats.maxResource,
    resourceType: determineResourceType(input.characterClass),

    enemyHealth: adjustedEnemyHealth,
    enemyMaxHealth: adjustedEnemyHealth,

    playerCooldowns: new Map(),
    enemyCooldowns: new Map(),
    playerGcd: 0,

    activeEffects: [],

    currentTime: 0,
    lastAutoAttack: -input.characterStats.weaponSpeed, // Allow immediate first attack

    combatLog: [],
    highlights: [],

    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalHealing: 0,
    critCount: 0,
    missCount: 0,
  };

  // Mage/Priest start with full mana, Warrior starts with 0 rage
  if (state.resourceType === 'rage') {
    state.playerResource = 0;
  }

  // Add combat start highlight
  state.highlights.push(`Combat begins against ${input.enemy.name}!`);

  // Main combat loop
  while (state.currentTime < input.maxDurationSeconds) {
    // Check victory condition
    if (state.enemyHealth <= 0) {
      state.highlights.push(`${input.enemy.name} has been defeated!`);
      break;
    }

    // Check death condition
    if (state.playerHealth <= 0) {
      state.highlights.push(`You have been slain by ${input.enemy.name}!`);
      break;
    }

    // Check flee condition
    if (input.settings.fleeOnLowHealth) {
      const healthPercent = state.playerHealth / state.playerMaxHealth;
      if (healthPercent < input.settings.fleeHealthThreshold) {
        state.highlights.push('Fled from combat at low health!');
        break;
      }
    }

    // Process combat tick
    const isLowHealth = state.playerHealth / state.playerMaxHealth < input.settings.healthPotionThreshold;

    // Player auto-attack
    processAutoAttack(state, input.characterStats, input.enemy, difficultyMods);

    // Player ability (if GCD is ready)
    if (state.playerGcd <= 0) {
      const ability = selectPlayerAbility(input.abilities, state, input.characterStats, isLowHealth);
      if (ability) {
        processAbility(state, input.characterStats, ability, input.enemy, difficultyMods);
      }
    }

    // Enemy attack
    processEnemyAttack(state, input.characterStats, input.enemy, difficultyMods);

    // Process DOTs/HOTs
    processActiveEffects(state);

    // Resource regeneration
    processResourceRegen(state, input.characterStats);

    // Tick cooldowns
    tickCooldowns(state);

    // Advance time
    state.currentTime += COMBAT_TICK_SECONDS;
  }

  // Determine outcome
  const victory = state.enemyHealth <= 0;
  const durationSeconds = state.currentTime;
  const dps = durationSeconds > 0 ? state.totalDamageDealt / durationSeconds : 0;

  // Calculate rewards if victory
  let rewards: CombatSimulationOutput['rewards'];
  if (victory) {
    const xp = Math.floor(calculateXpGain(
      input.enemy.level,
      input.characterLevel,
      input.enemy.type,
      false
    ) * difficultyMods.rewardMultiplier);

    const gold = Math.floor(calculateGoldDrop(
      input.enemy.level,
      input.enemy.type
    ) * difficultyMods.rewardMultiplier);

    rewards = {
      experience: xp,
      gold: gold,
      items: [], // Item generation handled separately
    };
  }

  return {
    victory,
    durationSeconds,

    playerHealthRemaining: Math.max(0, state.playerHealth),
    playerHealthPercent: Math.max(0, (state.playerHealth / state.playerMaxHealth) * 100),

    totalDamageDealt: state.totalDamageDealt,
    totalDamageTaken: state.totalDamageTaken,
    totalHealing: state.totalHealing,

    dps: Math.floor(dps),

    combatLog: state.combatLog,
    highlights: state.highlights,

    critCount: state.critCount,
    missCount: state.missCount,

    rewards,

    deathReason: !victory && state.playerHealth <= 0
      ? `Slain by ${input.enemy.name}`
      : undefined,
  };
}

function determineResourceType(characterClass: string): 'rage' | 'mana' | 'energy' {
  switch (characterClass) {
    case 'warrior':
      return 'rage';
    case 'rogue':
      return 'energy';
    default:
      return 'mana';
  }
}

// ============= BATCH SIMULATION FOR OFFLINE =============

export interface BatchSimulationInput {
  combatInput: CombatSimulationInput;
  cycleCount: number;
}

export interface BatchSimulationResult {
  cyclesCompleted: number;
  totalXp: number;
  totalGold: number;
  deaths: number;
  totalDamageDealt: number;
  avgCombatDuration: number;
  avgDps: number;
  notableEvents: string[];
}

/**
 * Simulates multiple combat cycles for offline progress
 * Uses averaged results for performance
 */
export function simulateBatchCombat(input: BatchSimulationInput): BatchSimulationResult {
  const results: CombatSimulationOutput[] = [];
  let deaths = 0;
  let cyclesCompleted = 0;

  // Run a sample of combats (max 10) to get averages
  const sampleSize = Math.min(10, input.cycleCount);

  for (let i = 0; i < sampleSize; i++) {
    const result = simulateCombat(input.combatInput);
    results.push(result);

    if (result.victory) {
      cyclesCompleted++;
    } else if (result.deathReason) {
      deaths++;
      break; // Death stops offline progress
    }
  }

  if (results.length === 0) {
    return {
      cyclesCompleted: 0,
      totalXp: 0,
      totalGold: 0,
      deaths: 0,
      totalDamageDealt: 0,
      avgCombatDuration: 0,
      avgDps: 0,
      notableEvents: [],
    };
  }

  // Calculate averages from samples
  const victories = results.filter(r => r.victory);
  const avgXpPerCycle = victories.length > 0
    ? victories.reduce((sum, r) => sum + (r.rewards?.experience ?? 0), 0) / victories.length
    : 0;
  const avgGoldPerCycle = victories.length > 0
    ? victories.reduce((sum, r) => sum + (r.rewards?.gold ?? 0), 0) / victories.length
    : 0;
  const avgDuration = results.reduce((sum, r) => sum + r.durationSeconds, 0) / results.length;
  const avgDps = victories.length > 0
    ? victories.reduce((sum, r) => sum + r.dps, 0) / victories.length
    : 0;

  // Extrapolate to full cycle count
  const winRate = victories.length / results.length;
  const estimatedVictories = deaths > 0 ? cyclesCompleted : Math.floor(input.cycleCount * winRate);

  // Collect notable events
  const notableEvents = results.flatMap(r => r.highlights);

  return {
    cyclesCompleted: estimatedVictories,
    totalXp: Math.floor(avgXpPerCycle * estimatedVictories),
    totalGold: Math.floor(avgGoldPerCycle * estimatedVictories),
    deaths,
    totalDamageDealt: results.reduce((sum, r) => sum + r.totalDamageDealt, 0),
    avgCombatDuration: Math.floor(avgDuration),
    avgDps: Math.floor(avgDps),
    notableEvents: [...new Set(notableEvents)].slice(0, 10),
  };
}
