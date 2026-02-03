// ============= STAT CALCULATOR SYSTEM =============
// Computes combat stats from: base + gear + talents + buffs
// Uses WoW Classic-style formulas

import type { CombatStats, ClassDefinition, GeneratedItem, StatScaling } from '@shared/types';
import type { CharacterClass, ItemSlot } from '@shared/schema';
import { getClassDefinition } from '../data/classes';
import {
  calculateArmorReduction,
  COMBAT_RATINGS,
  LEVEL_SCALING,
  BASE_HIT_CHANCE,
  BASE_CRIT_CHANCE,
} from '@shared/constants';

// ============= INTERFACES =============

export interface CharacterData {
  level: number;
  characterClass: CharacterClass;

  // Base attributes (from class + level)
  baseStrength: number;
  baseAgility: number;
  baseIntellect: number;
  baseStamina: number;
  baseSpirit: number;

  // Current resources
  currentHealth: number;
  currentResource: number;
}

export interface EquipmentSet {
  items: Map<ItemSlot, GeneratedItem | null>;
}

export interface TalentBonuses {
  // Flat bonuses
  strength: number;
  agility: number;
  intellect: number;
  stamina: number;
  spirit: number;

  // Percentage bonuses
  strengthPercent: number;
  agilityPercent: number;
  intellectPercent: number;
  staminaPercent: number;
  spiritPercent: number;

  // Combat bonuses
  meleeAttackPowerPercent: number;
  rangedAttackPowerPercent: number;
  spellPowerPercent: number;
  critChanceFlat: number;
  spellCritChanceFlat: number;
  hitChanceFlat: number;
  armorPercent: number;
  healthPercent: number;
  manaPercent: number;
  damagePercent: number;
  healingPercent: number;
}

export interface BuffEffects {
  // Flat stat buffs
  strength: number;
  agility: number;
  intellect: number;
  stamina: number;
  spirit: number;

  // Percentage stat buffs
  strengthPercent: number;
  agilityPercent: number;
  intellectPercent: number;
  staminaPercent: number;
  spiritPercent: number;

  // Combat buffs
  attackPower: number;
  spellPower: number;
  armor: number;
  critChance: number;
  hastePercent: number;
}

export interface ComputedAttributes {
  strength: { base: number; gear: number; buffs: number; total: number };
  agility: { base: number; gear: number; buffs: number; total: number };
  intellect: { base: number; gear: number; buffs: number; total: number };
  stamina: { base: number; gear: number; buffs: number; total: number };
  spirit: { base: number; gear: number; buffs: number; total: number };
}

// ============= DEFAULT VALUES =============

export function getDefaultTalentBonuses(): TalentBonuses {
  return {
    strength: 0,
    agility: 0,
    intellect: 0,
    stamina: 0,
    spirit: 0,
    strengthPercent: 0,
    agilityPercent: 0,
    intellectPercent: 0,
    staminaPercent: 0,
    spiritPercent: 0,
    meleeAttackPowerPercent: 0,
    rangedAttackPowerPercent: 0,
    spellPowerPercent: 0,
    critChanceFlat: 0,
    spellCritChanceFlat: 0,
    hitChanceFlat: 0,
    armorPercent: 0,
    healthPercent: 0,
    manaPercent: 0,
    damagePercent: 0,
    healingPercent: 0,
  };
}

export function getDefaultBuffEffects(): BuffEffects {
  return {
    strength: 0,
    agility: 0,
    intellect: 0,
    stamina: 0,
    spirit: 0,
    strengthPercent: 0,
    agilityPercent: 0,
    intellectPercent: 0,
    staminaPercent: 0,
    spiritPercent: 0,
    attackPower: 0,
    spellPower: 0,
    armor: 0,
    critChance: 0,
    hastePercent: 0,
  };
}

/**
 * Calculates talent bonuses from character's talent allocation
 */
export function calculateTalentBonuses(
  characterClass: CharacterClass,
  talentTree1Points: Record<string, number> | null,
  talentTree2Points: Record<string, number> | null,
  talentTree3Points: Record<string, number> | null
): TalentBonuses {
  const bonuses = getDefaultTalentBonuses();
  const classdef = getClassDefinition(characterClass);

  // Process each talent tree
  const allocations = [
    talentTree1Points || {},
    talentTree2Points || {},
    talentTree3Points || {},
  ];

  allocations.forEach((allocation, treeIndex) => {
    const talentTree = classdef.talentTrees[treeIndex];
    if (!talentTree) return;

    // Apply each talented point
    Object.entries(allocation).forEach(([talentId, ranks]) => {
      if (ranks <= 0) return;

      const talent = talentTree.talents.find(t => t.id === talentId);
      if (!talent) return;

      // Apply each effect of this talent
      talent.effects.forEach(effect => {
        const value = effect.valuePerRank * ranks;

        switch (effect.type) {
          case 'stat_bonus':
            if (!effect.stat) return;

            // Map effect stats to bonus fields
            const statMap: Record<string, keyof TalentBonuses> = {
              'strength': effect.isPercentage ? 'strengthPercent' : 'strength',
              'agility': effect.isPercentage ? 'agilityPercent' : 'agility',
              'intellect': effect.isPercentage ? 'intellectPercent' : 'intellect',
              'stamina': effect.isPercentage ? 'staminaPercent' : 'stamina',
              'spirit': effect.isPercentage ? 'spiritPercent' : 'spirit',
              'meleeAttackPower': 'meleeAttackPowerPercent',
              'rangedAttackPower': 'rangedAttackPowerPercent',
              'spellPower': 'spellPowerPercent',
              'critChance': 'critChanceFlat',
              'spellCritChance': 'spellCritChanceFlat',
              'hitChance': 'hitChanceFlat',
              'armor': 'armorPercent',
              'health': 'healthPercent',
              'mana': 'manaPercent',
              'damage': 'damagePercent',
              'healing': 'healingPercent',
            };

            const bonusField = statMap[effect.stat];
            if (bonusField) {
              bonuses[bonusField] += value;
            }
            break;

          // TODO: Implement ability_unlock, ability_modifier, and proc effects
          // These will require integration with CombatSimulator
          case 'ability_unlock':
          case 'ability_modifier':
          case 'proc':
            // Placeholder for future implementation
            break;
        }
      });
    });
  });

  return bonuses;
}

// ============= STAT CALCULATION =============

/**
 * Calculates total stats from gear
 */
export function calculateGearStats(equipment: EquipmentSet | null | undefined): {
  attributes: { strength: number; agility: number; intellect: number; stamina: number; spirit: number };
  armor: number;
  attackPower: number;
  spellPower: number;
  critRating: number;
  hitRating: number;
  hasteRating: number;
  weaponDamageMin: number;
  weaponDamageMax: number;
  weaponSpeed: number;
} {
  const result = {
    attributes: { strength: 0, agility: 0, intellect: 0, stamina: 0, spirit: 0 },
    armor: 0,
    attackPower: 0,
    spellPower: 0,
    critRating: 0,
    hitRating: 0,
    hasteRating: 0,
    weaponDamageMin: 0,
    weaponDamageMax: 0,
    weaponSpeed: 2.0, // Default weapon speed
  };

  // Handle null/undefined equipment or items
  if (!equipment?.items || !(equipment.items instanceof Map) || equipment.items.size === 0) {
    return result;
  }

  for (const [slot, item] of equipment.items) {
    if (!item) continue;

    // Add attribute stats
    if (item.stats.strength) result.attributes.strength += item.stats.strength;
    if (item.stats.agility) result.attributes.agility += item.stats.agility;
    if (item.stats.intellect) result.attributes.intellect += item.stats.intellect;
    if (item.stats.stamina) result.attributes.stamina += item.stats.stamina;
    if (item.stats.spirit) result.attributes.spirit += item.stats.spirit;

    // Add combat stats
    if (item.stats.armor) result.armor += item.stats.armor;
    if (item.stats.attackPower) result.attackPower += item.stats.attackPower;
    if (item.stats.spellPower) result.spellPower += item.stats.spellPower;
    if (item.stats.critRating) result.critRating += item.stats.critRating;
    if (item.stats.hitRating) result.hitRating += item.stats.hitRating;
    if (item.stats.hasteRating) result.hasteRating += item.stats.hasteRating;

    // Handle weapon stats (mainhand takes priority, two-handers use mainHand slot)
    if (item.isWeapon && slot === 'mainHand') {
      result.weaponDamageMin = item.weaponDamageMin ?? 0;
      result.weaponDamageMax = item.weaponDamageMax ?? 0;
      result.weaponSpeed = item.weaponSpeed ?? 2.0;
    }
  }

  return result;
}

/**
 * Applies percentage modifiers to base value
 */
function applyPercentModifier(base: number, percentBonus: number): number {
  return Math.floor(base * (1 + percentBonus / 100));
}

/**
 * Converts rating to percentage based on level
 */
function ratingToPercent(rating: number, ratingPerPercent: number, level: number): number {
  // Ratings become less effective at higher levels
  const levelPenalty = 1 + (level - 60) * 0.01;
  const effectiveRating = level > 60 ? ratingPerPercent * levelPenalty : ratingPerPercent;
  return rating / effectiveRating;
}

/**
 * Main stat calculator function
 * Computes final combat stats from all sources
 */
export function calculateCombatStats(
  character: CharacterData,
  equipment: EquipmentSet | null | undefined,
  talents: TalentBonuses = getDefaultTalentBonuses(),
  buffs: BuffEffects = getDefaultBuffEffects()
): { stats: CombatStats; attributes: ComputedAttributes } {

  const classDef = getClassDefinition(character.characterClass);
  if (!classDef) {
    throw new Error(`Class ${character.characterClass} not implemented`);
  }

  // Ensure scaling values are defined (default to 0 if missing)
  const scaling: StatScaling = {
    strengthToAP: classDef.statScaling.strengthToAP ?? 0,
    agilityToAP: classDef.statScaling.agilityToAP ?? 0,
    agilityToCrit: classDef.statScaling.agilityToCrit ?? 0,
    agilityToRangedAP: classDef.statScaling.agilityToRangedAP ?? 0,
    intellectToMana: classDef.statScaling.intellectToMana ?? 15,
    intellectToSpellPower: classDef.statScaling.intellectToSpellPower ?? 0,
    intellectToSpellCrit: classDef.statScaling.intellectToSpellCrit ?? 0,
    staminaToHealth: classDef.statScaling.staminaToHealth ?? 10,
    spiritToRegen: classDef.statScaling.spiritToRegen ?? 1,
  };
  const gearStats = calculateGearStats(equipment);

  // ============= CALCULATE FINAL ATTRIBUTES =============

  // Strength
  const baseStr = character.baseStrength + talents.strength;
  const gearStr = gearStats.attributes.strength;
  const buffStr = buffs.strength;
  const totalStrBeforePercent = baseStr + gearStr + buffStr;
  const strPercentBonus = talents.strengthPercent + buffs.strengthPercent;
  const totalStr = applyPercentModifier(totalStrBeforePercent, strPercentBonus);

  // Agility
  const baseAgi = character.baseAgility + talents.agility;
  const gearAgi = gearStats.attributes.agility;
  const buffAgi = buffs.agility;
  const totalAgiBeforePercent = baseAgi + gearAgi + buffAgi;
  const agiPercentBonus = talents.agilityPercent + buffs.agilityPercent;
  const totalAgi = applyPercentModifier(totalAgiBeforePercent, agiPercentBonus);

  // Intellect
  const baseInt = character.baseIntellect + talents.intellect;
  const gearInt = gearStats.attributes.intellect;
  const buffInt = buffs.intellect;
  const totalIntBeforePercent = baseInt + gearInt + buffInt;
  const intPercentBonus = talents.intellectPercent + buffs.intellectPercent;
  const totalInt = applyPercentModifier(totalIntBeforePercent, intPercentBonus);

  // Stamina
  const baseSta = character.baseStamina + talents.stamina;
  const gearSta = gearStats.attributes.stamina;
  const buffSta = buffs.stamina;
  const totalStaBeforePercent = baseSta + gearSta + buffSta;
  const staPercentBonus = talents.staminaPercent + buffs.staminaPercent;
  const totalSta = applyPercentModifier(totalStaBeforePercent, staPercentBonus);

  // Spirit
  const baseSpi = character.baseSpirit + talents.spirit;
  const gearSpi = gearStats.attributes.spirit;
  const buffSpi = buffs.spirit;
  const totalSpiBeforePercent = baseSpi + gearSpi + buffSpi;
  const spiPercentBonus = talents.spiritPercent + buffs.spiritPercent;
  const totalSpi = applyPercentModifier(totalSpiBeforePercent, spiPercentBonus);

  const attributes: ComputedAttributes = {
    strength: { base: baseStr, gear: gearStr, buffs: buffStr, total: totalStr },
    agility: { base: baseAgi, gear: gearAgi, buffs: buffAgi, total: totalAgi },
    intellect: { base: baseInt, gear: gearInt, buffs: buffInt, total: totalInt },
    stamina: { base: baseSta, gear: gearSta, buffs: buffSta, total: totalSta },
    spirit: { base: baseSpi, gear: gearSpi, buffs: buffSpi, total: totalSpi },
  };

  // ============= CALCULATE ATTACK POWER =============

  // Melee AP: Base from STR + gear AP + buff AP
  let meleeAP = totalStr * scaling.strengthToAP + totalAgi * scaling.agilityToAP;
  meleeAP += gearStats.attackPower + buffs.attackPower;
  meleeAP = applyPercentModifier(meleeAP, talents.meleeAttackPowerPercent);

  // Ranged AP: Primarily from AGI
  let rangedAP = totalAgi * scaling.agilityToRangedAP;
  rangedAP += gearStats.attackPower + buffs.attackPower;
  rangedAP = applyPercentModifier(rangedAP, talents.rangedAttackPowerPercent);

  // ============= CALCULATE SPELL POWER =============

  let spellPower = totalInt * scaling.intellectToSpellPower;
  spellPower += gearStats.spellPower + buffs.spellPower;
  spellPower = applyPercentModifier(spellPower, talents.spellPowerPercent);

  // ============= CALCULATE CRIT CHANCES =============

  // Melee crit: Base + AGI contribution + gear rating + talents
  const meleeCritFromAgi = totalAgi * scaling.agilityToCrit * 0.01;
  const meleeCritFromRating = ratingToPercent(
    gearStats.critRating,
    COMBAT_RATINGS.CRIT_RATING_PER_PERCENT,
    character.level
  );
  const meleeCrit = BASE_CRIT_CHANCE + meleeCritFromAgi + meleeCritFromRating +
    talents.critChanceFlat + buffs.critChance;

  // Ranged crit: Same as melee for simplicity
  const rangedCrit = meleeCrit;

  // Spell crit: Base + INT contribution + gear rating + talents
  const spellCritFromInt = totalInt * scaling.intellectToSpellCrit * 0.01;
  const spellCritFromRating = ratingToPercent(
    gearStats.critRating,
    COMBAT_RATINGS.SPELL_CRIT_RATING_PER_PERCENT,
    character.level
  );
  const spellCrit = BASE_CRIT_CHANCE + spellCritFromInt + spellCritFromRating +
    talents.spellCritChanceFlat;

  // ============= CALCULATE HIT CHANCE =============

  const hitFromRating = ratingToPercent(
    gearStats.hitRating,
    COMBAT_RATINGS.HIT_RATING_PER_PERCENT,
    character.level
  );
  const hitChance = Math.min(100, BASE_HIT_CHANCE + hitFromRating + talents.hitChanceFlat);

  // ============= CALCULATE HASTE =============

  const hasteFromRating = ratingToPercent(
    gearStats.hasteRating,
    COMBAT_RATINGS.HASTE_RATING_PER_PERCENT,
    character.level
  );
  const hastePercent = hasteFromRating + buffs.hastePercent;

  // ============= CALCULATE DEFENSIVE STATS =============

  // Armor: Gear armor + AGI contribution + buffs
  const armorFromAgi = totalAgi * 2; // 2 armor per AGI
  let totalArmor = gearStats.armor + armorFromAgi + buffs.armor;
  totalArmor = applyPercentModifier(totalArmor, talents.armorPercent);

  // Armor reduction (against same-level enemy)
  const armorReduction = calculateArmorReduction(totalArmor, character.level);

  // Dodge: Base + AGI contribution
  const dodgeFromAgi = totalAgi * 0.05; // 0.05% per AGI
  const dodgeChance = Math.min(30, 5 + dodgeFromAgi); // 5% base, 30% cap

  // Parry: Requires melee weapon, simplified
  const parryChance = 5; // Base 5%, talents can increase

  // Block: Requires shield, simplified
  const blockChance = 5; // Base 5% with shield
  const blockValue = Math.floor(totalStr / 20); // STR/20 block value

  // ============= CALCULATE HEALTH & RESOURCES =============

  // Health: Base + Stamina contribution
  let maxHealth = classDef.baseStats.health + (totalSta * scaling.staminaToHealth);
  maxHealth = applyPercentModifier(maxHealth, talents.healthPercent);

  // Resource: Depends on class type
  let maxResource: number;
  if (classDef.resourceType === 'mana') {
    maxResource = classDef.baseStats.resource + (totalInt * scaling.intellectToMana);
    maxResource = applyPercentModifier(maxResource, talents.manaPercent);
  } else if (classDef.resourceType === 'rage') {
    maxResource = 100; // Rage is always 100
  } else {
    maxResource = 100; // Energy is always 100
  }

  // Regen rates
  const healthRegenPerSecond = Math.floor(totalSpi * scaling.spiritToRegen);
  let resourceRegenPerSecond: number;
  if (classDef.resourceType === 'mana') {
    // Mana regen: Spirit-based, interrupted by casting
    resourceRegenPerSecond = Math.floor(totalSpi * scaling.spiritToRegen * 2);
  } else if (classDef.resourceType === 'rage') {
    // Rage: Generated by dealing/taking damage, decays slowly
    resourceRegenPerSecond = -1; // Rage decays 1 per second out of combat
  } else {
    // Energy: Fixed 10 per second
    resourceRegenPerSecond = 10;
  }

  // ============= CALCULATE WEAPON STATS =============

  // Use gear weapon stats or defaults
  const weaponMin = gearStats.weaponDamageMin || 1;
  const weaponMax = gearStats.weaponDamageMax || 2;
  const weaponSpeed = gearStats.weaponSpeed || 2.0;
  const weaponDps = (weaponMin + weaponMax) / 2 / weaponSpeed;

  // ============= ASSEMBLE FINAL STATS =============

  // Helper to ensure no NaN values (returns 0 if NaN)
  const safe = (value: number, defaultValue = 0): number =>
    Number.isNaN(value) || !Number.isFinite(value) ? defaultValue : value;

  const stats: CombatStats = {
    // Offensive
    meleeAttackPower: safe(Math.floor(meleeAP)),
    rangedAttackPower: safe(Math.floor(rangedAP)),
    spellPower: safe(Math.floor(spellPower)),
    meleeCritChance: safe(Math.min(100, Math.max(0, meleeCrit)), BASE_CRIT_CHANCE),
    rangedCritChance: safe(Math.min(100, Math.max(0, rangedCrit)), BASE_CRIT_CHANCE),
    spellCritChance: safe(Math.min(100, Math.max(0, spellCrit)), BASE_CRIT_CHANCE),
    hitChance: safe(hitChance, BASE_HIT_CHANCE),
    hastePercent: safe(Math.max(0, hastePercent)),

    // Defensive
    armor: safe(totalArmor),
    armorReduction: safe(armorReduction),
    dodgeChance: safe(Math.min(100, Math.max(0, dodgeChance)), 5),
    parryChance: safe(Math.min(100, Math.max(0, parryChance)), 5),
    blockChance: safe(Math.min(100, Math.max(0, blockChance)), 5),
    blockValue: safe(Math.max(0, blockValue)),

    // Resources
    maxHealth: safe(maxHealth, 100),
    maxResource: safe(maxResource, 100),
    healthRegenPerSecond: safe(healthRegenPerSecond),
    resourceRegenPerSecond: safe(resourceRegenPerSecond),

    // Weapon
    weaponDamageMin: safe(weaponMin, 1),
    weaponDamageMax: safe(weaponMax, 2),
    weaponSpeed: safe(weaponSpeed, 2.0),
    weaponDps: safe(weaponDps, 1),
  };

  return { stats, attributes };
}

/**
 * Calculate estimated DPS based on stats
 * Simplified formula for UI display
 */
export function estimateDps(stats: CombatStats, classDef: ClassDefinition): number {
  // Base auto-attack DPS
  const autoAttackDps = stats.weaponDps + (stats.meleeAttackPower / 14);

  // Apply crit multiplier (average increase)
  const critMultiplier = 1 + (stats.meleeCritChance / 100) * 1.0; // Crits do 2x, so +100%

  // Apply hit chance reduction
  const hitMultiplier = stats.hitChance / 100;

  // Haste increases attack speed
  const hasteMultiplier = 1 + (stats.hastePercent / 100);

  // For casters, use spell power instead
  if (classDef.resourceType === 'mana' && classDef.id !== 'priest') {
    // Spell DPS estimation: (SP * coefficient) / cast_time * hit * crit
    const avgSpellDamage = stats.spellPower * 0.857; // Average coefficient
    const avgCastTime = 2.5; // Average cast time
    const spellDps = (avgSpellDamage / avgCastTime) * hitMultiplier *
      (1 + (stats.spellCritChance / 100) * 0.5); // Spell crits do 1.5x
    return Math.floor(spellDps);
  }

  return Math.floor(autoAttackDps * critMultiplier * hitMultiplier * hasteMultiplier);
}

/**
 * Calculate survivability score (0-100)
 * Higher = more likely to survive average encounters
 */
export function estimateSurvivability(stats: CombatStats, level: number): number {
  // Base survivability from health pool
  const healthScore = Math.min(40, stats.maxHealth / (level * 25));

  // Armor contribution
  const armorScore = Math.min(30, stats.armorReduction * 30);

  // Avoidance contribution
  const avoidance = stats.dodgeChance + stats.parryChance + stats.blockChance;
  const avoidanceScore = Math.min(20, avoidance);

  // Regen contribution
  const regenScore = Math.min(10, stats.healthRegenPerSecond / level);

  return Math.floor(healthScore + armorScore + avoidanceScore + regenScore);
}

/**
 * Calculate average item level from equipment
 */
export function calculateAverageItemLevel(equipment: EquipmentSet | null | undefined): number {
  // Handle null/undefined equipment or items
  if (!equipment?.items || !(equipment.items instanceof Map) || equipment.items.size === 0) {
    return 0;
  }

  let totalIlvl = 0;
  let itemCount = 0;

  for (const [_, item] of equipment.items) {
    if (item) {
      totalIlvl += item.itemLevel ?? 0;
      itemCount++;
    }
  }

  return itemCount > 0 ? Math.floor(totalIlvl / itemCount) : 0;
}
