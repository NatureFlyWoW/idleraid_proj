// ============= GAME CONFIGURATION =============
// Balance constants for Idle Raiders

// ============= LEVEL & XP =============

export const MAX_LEVEL = 60;
export const TALENT_POINT_START_LEVEL = 10;
export const TOTAL_TALENT_POINTS = 51; // Level 10-60

// XP formula: BaseXP × (Level^2.5)
export const BASE_XP = 100;
export const XP_EXPONENT = 2.5;

/**
 * Calculate XP required for a specific level
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return 0;

  // Formula from GDD: BaseXP × (Level^2.5)
  return Math.floor(BASE_XP * Math.pow(level, XP_EXPONENT));
}

/**
 * Calculate total XP needed from level 1 to target level
 */
export function getTotalXpToLevel(targetLevel: number): number {
  let total = 0;
  for (let i = 2; i <= targetLevel; i++) {
    total += getXpRequiredForLevel(i);
  }
  return total;
}

/**
 * Calculate level from total XP
 */
export function getLevelFromXp(totalXp: number): { level: number; currentLevelXp: number; xpToNextLevel: number } {
  let level = 1;
  let xpAccumulated = 0;

  while (level < MAX_LEVEL) {
    const xpForNextLevel = getXpRequiredForLevel(level + 1);
    if (xpAccumulated + xpForNextLevel > totalXp) {
      break;
    }
    xpAccumulated += xpForNextLevel;
    level++;
  }

  const currentLevelXp = totalXp - xpAccumulated;
  const xpToNextLevel = level < MAX_LEVEL ? getXpRequiredForLevel(level + 1) : 0;

  return { level, currentLevelXp, xpToNextLevel };
}

// Pre-calculated XP table for quick lookup
export const XP_TABLE: { level: number; xpRequired: number; totalXp: number }[] = [];
let cumulativeXp = 0;
for (let level = 1; level <= MAX_LEVEL; level++) {
  const xpRequired = level === 1 ? 0 : getXpRequiredForLevel(level);
  cumulativeXp += xpRequired;
  XP_TABLE.push({
    level,
    xpRequired,
    totalXp: cumulativeXp,
  });
}

// ============= COMBAT FORMULAS =============

/**
 * Damage per 14 Attack Power
 */
export const DAMAGE_PER_AP = 14;

/**
 * Calculate armor damage reduction
 * Formula: Armor / (Armor + 400 + 85 × Level)
 */
export function calculateArmorReduction(armor: number, attackerLevel: number): number {
  const reduction = armor / (armor + 400 + 85 * attackerLevel);
  return Math.min(0.75, reduction); // Cap at 75% reduction
}

/**
 * Calculate auto-attack damage
 */
export function calculateAutoAttackDamage(
  weaponDamageMin: number,
  weaponDamageMax: number,
  weaponSpeed: number,
  attackPower: number
): { min: number; max: number; average: number } {
  const apBonus = (attackPower / DAMAGE_PER_AP) * weaponSpeed;

  const min = weaponDamageMin + apBonus;
  const max = weaponDamageMax + apBonus;
  const average = (min + max) / 2;

  return { min: Math.floor(min), max: Math.floor(max), average };
}

/**
 * Calculate effective attack speed with haste
 */
export function calculateEffectiveAttackSpeed(baseSpeed: number, hastePercent: number): number {
  return baseSpeed / (1 + hastePercent / 100);
}

// ============= CRITICAL STRIKE =============

export const BASE_CRIT_CHANCE = 5; // Base crit chance %
export const BASE_HIT_CHANCE = 95; // Base hit chance %

export const BASE_CRIT_MULTIPLIER = 2.0;
export const SPELL_CRIT_MULTIPLIER = 1.5;  // Spell damage crits (same as melee base)
export const HEALING_CRIT_MULTIPLIER = 1.5;

// ============= COMBAT RATINGS =============
// Rating to percentage conversions at level 60

export const COMBAT_RATINGS = {
  CRIT_RATING_PER_PERCENT: 14,
  SPELL_CRIT_RATING_PER_PERCENT: 14,
  HIT_RATING_PER_PERCENT: 10,
  HASTE_RATING_PER_PERCENT: 10,
  DEFENSE_RATING_PER_PERCENT: 1.5,
  DODGE_RATING_PER_PERCENT: 12,
  PARRY_RATING_PER_PERCENT: 15,
  BLOCK_RATING_PER_PERCENT: 7,
};

// ============= LEVEL SCALING =============

export const LEVEL_SCALING = {
  HEALTH_PER_STAMINA: 10,
  MANA_PER_INTELLECT: 15,
  ARMOR_PER_AGILITY: 2,
};

// Base crit chance by class at level 60
export const CLASS_BASE_CRIT: Record<string, { melee: number; ranged: number; spell: number }> = {
  warrior: { melee: 5, ranged: 0, spell: 0 },
  paladin: { melee: 3.5, ranged: 0, spell: 1.8 },
  hunter: { melee: 0, ranged: 3.6, spell: 0 },
  rogue: { melee: 5, ranged: 0, spell: 0 },
  priest: { melee: 0, ranged: 0, spell: 3 },
  mage: { melee: 0, ranged: 0, spell: 3 },
  druid: { melee: 5, ranged: 0, spell: 3 },
};

// Crit rating conversion (at level 60)
export const CRIT_RATING_PER_PERCENT = 14;
export const HIT_RATING_PER_PERCENT = 10;
export const HASTE_RATING_PER_PERCENT = 10;

// ============= HIT & MISS =============

export const BASE_MISS_CHANCE_MELEE = 5; // vs same level
export const BASE_MISS_CHANCE_SPELL = 4; // vs same level
export const MISS_CHANCE_PER_LEVEL_DIFF = 1; // per level above player

export const HIT_CAP_MELEE = 9; // vs +3 level boss
export const HIT_CAP_SPELL = 16; // vs +3 level boss

// ============= GLANCING BLOWS =============

export const GLANCING_BLOW_CHANCE = 40; // % vs bosses (+3 level)
export const GLANCING_BLOW_DAMAGE_REDUCTION_MIN = 15;
export const GLANCING_BLOW_DAMAGE_REDUCTION_MAX = 35;

// ============= RESOURCE GENERATION =============

export const RAGE_DECAY_PER_SECOND = 1;
export const RAGE_PER_DAMAGE_DEALT = 0.05; // Rage per point of damage dealt (increased from 0.0125)
export const RAGE_PER_DAMAGE_TAKEN = 0.025; // Rage per point of damage taken

export const ENERGY_REGEN_PER_SECOND = 10;
export const MAX_ENERGY = 100;
export const MAX_RAGE = 100;

// Mana regen: 5% of max mana per 5 seconds (base)
export const MANA_REGEN_BASE_PERCENT = 5;
export const MANA_REGEN_INTERVAL = 5; // seconds

// ============= ITEM GENERATION =============

// Stat budget per item level
export const PRIMARY_STAT_PER_ILVL = 0.5;
export const SECONDARY_STAT_PER_ILVL = 0.3;

// Slot weights for stat distribution
export const SLOT_WEIGHTS: Record<string, { primary: number; secondary: number }> = {
  head: { primary: 0.85, secondary: 0.85 },
  neck: { primary: 0, secondary: 0.80 },
  shoulders: { primary: 0.70, secondary: 0.70 },
  back: { primary: 0.50, secondary: 0.50 },
  chest: { primary: 1.00, secondary: 1.00 },
  wrist: { primary: 0.50, secondary: 0.50 },
  hands: { primary: 0.60, secondary: 0.60 },
  waist: { primary: 0.60, secondary: 0.60 },
  legs: { primary: 0.90, secondary: 0.90 },
  feet: { primary: 0.60, secondary: 0.60 },
  ring1: { primary: 0, secondary: 0.80 },
  ring2: { primary: 0, secondary: 0.80 },
  trinket1: { primary: 0, secondary: 1.00 },
  trinket2: { primary: 0, secondary: 1.00 },
  mainHand: { primary: 0.70, secondary: 0.70 },
  offHand: { primary: 0.50, secondary: 0.50 },
  ranged: { primary: 0.40, secondary: 0.40 },
};

// Weapon speed modifiers for damage budget
export const WEAPON_SPEED_MODIFIERS: Record<string, number> = {
  dagger: 0.9,       // 1.8 speed
  fast: 1.0,         // 2.0-2.4 speed
  medium: 1.15,      // 2.5-2.9 speed
  slow: 1.3,         // 3.0-3.5 speed
  verySlow: 1.4,     // 3.6-4.0 speed
};

// ============= LOOT DROP RATES =============

// Normal mob drops at level 60
export const LOOT_RARITY_WEIGHTS = {
  normal: {
    common: 45,
    uncommon: 35,
    rare: 18,
    epic: 2,
    legendary: 0,
  },
  elite: {
    common: 20,
    uncommon: 45,
    rare: 30,
    epic: 5,
    legendary: 0,
  },
  boss: {
    common: 0,
    uncommon: 0,
    rare: 65,
    epic: 30,
    legendary: 5,
  },
  raid_boss: {
    common: 0,
    uncommon: 0,
    rare: 30,
    epic: 65,
    legendary: 5,
  },
};

// ============= GOLD =============

export function calculateGoldDrop(mobLevel: number, mobType: 'normal' | 'elite' | 'boss' | 'raid_boss'): number {
  const base = mobLevel * 0.5;
  const variance = Math.random() * mobLevel * 0.2;

  const typeMultipliers = {
    normal: 1,
    elite: 2,
    boss: 5,
    raid_boss: 10,
  };

  return Math.floor((base + variance) * typeMultipliers[mobType]);
}

// ============= XP MODIFIERS =============

export const XP_MODIFIERS = {
  mobType: {
    normal: 1.0,
    elite: 2.0,
    boss: 5.0,
    raid_boss: 10.0,
  },
  levelDifference: {
    // Player level - mob level
    [-5]: 1.25,  // Red (5+ above)
    [-4]: 1.10,
    [-3]: 1.10,  // Orange (3-4 above)
    [-2]: 1.0,
    [-1]: 1.0,
    [0]: 1.0,    // Yellow (±2)
    [1]: 1.0,
    [2]: 1.0,
    [3]: 0.5,    // Green (3-4 below)
    [4]: 0.5,
    [5]: 0,      // Gray (5+ below)
  },
  restedBonus: 2.0, // Double XP when rested
};

export function calculateXpGain(
  mobLevel: number,
  playerLevel: number,
  mobType: 'normal' | 'elite' | 'boss' | 'raid_boss',
  hasRestedBonus: boolean
): number {
  // Base XP from GDD: Mob Level × 45
  const baseXp = mobLevel * 45;

  // Apply mob type multiplier
  const typeMultiplier = XP_MODIFIERS.mobType[mobType];

  // Apply level difference modifier
  const levelDiff = playerLevel - mobLevel;
  const clampedDiff = Math.max(-5, Math.min(5, levelDiff));
  const levelModifier = XP_MODIFIERS.levelDifference[clampedDiff as keyof typeof XP_MODIFIERS.levelDifference] ?? 0;

  // Apply rested bonus
  const restedMultiplier = hasRestedBonus ? XP_MODIFIERS.restedBonus : 1.0;

  return Math.floor(baseXp * typeMultiplier * levelModifier * restedMultiplier);
}

// ============= RESTED XP =============

// Accumulate 5% of current level's XP requirement per hour offline
export const RESTED_XP_PERCENT_PER_HOUR = 5;
export const RESTED_XP_MAX_PERCENT = 100; // 1 level worth (100% cap decision)
export const MAX_OFFLINE_HOURS = 18;

export function calculateRestedXpGain(hoursOffline: number, currentLevelXpRequired: number): number {
  const effectiveHours = Math.min(hoursOffline, MAX_OFFLINE_HOURS);
  const xpPerHour = (currentLevelXpRequired * RESTED_XP_PERCENT_PER_HOUR) / 100;
  const maxRested = (currentLevelXpRequired * RESTED_XP_MAX_PERCENT) / 100;

  return Math.min(Math.floor(xpPerHour * effectiveHours), Math.floor(maxRested));
}

// ============= REPUTATION =============

export const REPUTATION_LEVELS = {
  hated: { min: -42000, name: 'Hated' },
  hostile: { min: -6000, name: 'Hostile' },
  unfriendly: { min: -3000, name: 'Unfriendly' },
  neutral: { min: 0, name: 'Neutral' },
  friendly: { min: 3000, name: 'Friendly' },
  honored: { min: 9000, name: 'Honored' },
  revered: { min: 21000, name: 'Revered' },
  exalted: { min: 42000, name: 'Exalted' },
};

export function getReputationLevel(reputation: number): string {
  if (reputation >= REPUTATION_LEVELS.exalted.min) return 'Exalted';
  if (reputation >= REPUTATION_LEVELS.revered.min) return 'Revered';
  if (reputation >= REPUTATION_LEVELS.honored.min) return 'Honored';
  if (reputation >= REPUTATION_LEVELS.friendly.min) return 'Friendly';
  if (reputation >= REPUTATION_LEVELS.neutral.min) return 'Neutral';
  if (reputation >= REPUTATION_LEVELS.unfriendly.min) return 'Unfriendly';
  if (reputation >= REPUTATION_LEVELS.hostile.min) return 'Hostile';
  return 'Hated';
}

// ============= LEVEL MILESTONES =============

export const LEVEL_MILESTONES: Record<number, string[]> = {
  1: ['Character created', 'Starting zone unlocked'],
  10: ['First talent point', 'Specialization choice'],
  15: ['First dungeon access'],
  20: ['Mount training (-30% travel time)'],
  25: ['Second dungeon tier'],
  30: ['Advanced class abilities'],
  40: ['Epic mount training (-60% travel time)'],
  45: ['Third dungeon tier'],
  55: ['Pre-raid dungeons'],
  60: ['Raid access', 'Endgame content unlocked'],
};

// ============= COMBAT TIMING =============

export const COMBAT_TICK_SECONDS = 1;
export const GCD_SECONDS = 1.5; // Global cooldown
export const DOT_TICK_INTERVAL = 3; // Standard DOT tick every 3 seconds
export const HOT_TICK_INTERVAL = 3; // Standard HOT tick every 3 seconds

// Combat duration estimates
export const COMBAT_DURATION = {
  quest_mob: { min: 10, max: 30 },
  dungeon_trash: { min: 30, max: 60 },
  dungeon_boss: { min: 120, max: 300 },
  raid_boss: { min: 300, max: 900 },
};

// ============= INVENTORY =============

export const BASE_INVENTORY_SLOTS = 40;
export const MAX_INVENTORY_SLOTS = 80;
export const INVENTORY_SLOTS_PER_BAG = 10;

// ============= RESPEC COST =============

export function calculateRespecCost(respecCount: number): number {
  return Math.min(50, respecCount + 1);
}

// ============= SUCCESS RATE CALCULATION =============

/**
 * Calculate success rate for an activity based on player power vs requirement
 */
export function calculateSuccessRate(
  playerPower: number,
  requiredPower: number,
  difficulty: 'safe' | 'normal' | 'challenging' | 'heroic'
): number {
  const baserate = (playerPower / requiredPower) * 100;

  const difficultyMultipliers = {
    safe: 1.5,
    normal: 1.0,
    challenging: 0.75,
    heroic: 0.5,
  };

  const adjustedRate = baserate * difficultyMultipliers[difficulty];

  // Clamp between 5% and 100%
  return Math.max(5, Math.min(100, adjustedRate));
}
