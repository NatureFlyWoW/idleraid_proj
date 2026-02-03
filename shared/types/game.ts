// ============= GAME TYPES =============
// Core type definitions for Idle Raiders

import type { CharacterClass, ItemRarity, ItemSlot, ActivityType, Difficulty } from '../schema';

// ============= CLASS DEFINITIONS =============

export type ResourceType = 'rage' | 'mana' | 'energy';

export interface BaseStats {
  health: number;
  resource: number;
  strength: number;
  agility: number;
  intellect: number;
  stamina: number;
  spirit: number;
}

export interface StatScaling {
  strengthToAP: number;        // Melee attack power per strength
  agilityToAP: number;         // Attack power per agility
  agilityToCrit: number;       // Crit % per agility (× 0.01)
  agilityToRangedAP: number;   // Ranged AP per agility
  intellectToMana: number;     // Mana per intellect
  intellectToSpellPower: number;
  intellectToSpellCrit: number; // Spell crit % per intellect (× 0.01)
  staminaToHealth: number;     // Always 10
  spiritToRegen: number;       // Mana/health regen modifier
}

export interface TalentTreeDefinition {
  id: string;
  name: string;
  description: string;
  role: 'tank' | 'dps' | 'healer' | 'hybrid';
  talents: TalentDefinition[];
}

export interface TalentDefinition {
  id: string;
  name: string;
  description: string;
  tier: number;           // 1-7
  column: number;         // Position in row
  maxRanks: number;
  requiredTalentId?: string;
  requiredPoints: number; // Points needed in tree to unlock
  type: 'passive' | 'active' | 'proc';
  effects: TalentEffect[];
}

export interface TalentEffect {
  type: 'stat_bonus' | 'ability_unlock' | 'ability_modifier' | 'proc';
  stat?: string;
  valuePerRank: number;
  isPercentage?: boolean;
  abilityId?: string;
  procChance?: number;
  procTrigger?: string;
  procEffect?: string;
}

export interface ClassDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  resourceType: ResourceType;
  armorType: 'cloth' | 'leather' | 'mail' | 'plate';
  baseStats: BaseStats;
  statScaling: StatScaling;
  talentTrees: [TalentTreeDefinition, TalentTreeDefinition, TalentTreeDefinition];
  abilities: AbilityDefinition[];
}

// ============= ABILITIES =============

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  type: 'instant' | 'cast' | 'channel';

  // Resource
  resourceCost: number;
  cooldownSeconds: number;
  castTimeSeconds: number;

  // Damage/Healing
  baseDamage: number;
  baseHealing: number;
  apCoefficient: number;
  spCoefficient: number;

  // Properties
  isAoE: boolean;
  maxTargets?: number;

  // DOT/HOT
  isDot: boolean;
  isHot: boolean;
  tickCount?: number;
  tickIntervalSeconds?: number;

  // Requirements
  requiresWeapon?: string;
  requiresTalent?: string;
  levelRequired: number;
}

// ============= COMBAT =============

export interface CombatStats {
  // Offensive
  meleeAttackPower: number;
  rangedAttackPower: number;
  spellPower: number;
  meleeCritChance: number;
  rangedCritChance: number;
  spellCritChance: number;
  hitChance: number;
  hastePercent: number;

  // Defensive
  armor: number;
  armorReduction: number; // Calculated damage reduction %
  dodgeChance: number;
  parryChance: number;
  blockChance: number;
  blockValue: number;

  // Resources
  maxHealth: number;
  maxResource: number;
  healthRegenPerSecond: number;
  resourceRegenPerSecond: number;

  // Weapon
  weaponDamageMin: number;
  weaponDamageMax: number;
  weaponSpeed: number;
  weaponDps: number;
}

export interface EnemyDefinition {
  id: string;
  name: string;
  level: number;
  type: 'normal' | 'elite' | 'boss' | 'raid_boss';

  health: number;
  damage: number;
  attackSpeed: number;
  armor: number;

  abilities: {
    name: string;
    damage: number;
    cooldown: number;
    trigger?: 'health_percent' | 'timer' | 'random';
    triggerValue?: number;
  }[];

  // Rewards
  baseXp: number;
  goldMin: number;
  goldMax: number;
  lootTableId?: string;
}

export interface CombatResult {
  type: 'hit' | 'crit' | 'miss' | 'dodge' | 'parry' | 'block' | 'glancing';
  damage: number;
  healing: number;
  ability: string;
  timestamp: number;
  source: 'player' | 'enemy';
  isCrit: boolean;
  flavorText?: string;
}

export interface CombatSimulationInput {
  characterStats: CombatStats;
  characterLevel: number;
  characterClass: CharacterClass;
  abilities: AbilityDefinition[];

  enemy: EnemyDefinition;

  maxDurationSeconds: number;
  difficulty: Difficulty;

  settings: {
    healthPotionThreshold: number;
    manaPotionThreshold: number;
    useCooldowns: boolean;
    fleeOnLowHealth: boolean;
    fleeHealthThreshold: number;
  };

  consumables: {
    healthPotions: number;
    manaPotions: number;
    buffPotions: { stat: string; value: number; }[];
  };
}

export interface CombatSimulationOutput {
  victory: boolean;
  durationSeconds: number;

  playerHealthRemaining: number;
  playerHealthPercent: number;

  totalDamageDealt: number;
  totalDamageTaken: number;
  totalHealing: number;

  dps: number;

  combatLog: CombatResult[];
  highlights: string[];

  critCount: number;
  missCount: number;

  rewards?: {
    experience: number;
    gold: number;
    items: number[];
  };

  deathReason?: string;
}

// ============= DIFFICULTY MODIFIERS =============

export interface DifficultyModifiers {
  successChanceMultiplier: number;
  rewardMultiplier: number;
  enemyHealthMultiplier: number;
  enemyDamageMultiplier: number;
  description: string;
}

export const DIFFICULTY_MODIFIERS: Record<Difficulty, DifficultyModifiers> = {
  safe: {
    successChanceMultiplier: 1.5,
    rewardMultiplier: 0.5,
    enemyHealthMultiplier: 0.7,
    enemyDamageMultiplier: 0.7,
    description: '100% success rate, 50% rewards',
  },
  normal: {
    successChanceMultiplier: 1.0,
    rewardMultiplier: 1.0,
    enemyHealthMultiplier: 1.0,
    enemyDamageMultiplier: 1.0,
    description: 'Standard difficulty and rewards',
  },
  challenging: {
    successChanceMultiplier: 0.75,
    rewardMultiplier: 1.5,
    enemyHealthMultiplier: 1.3,
    enemyDamageMultiplier: 1.3,
    description: '50-79% success, +50% rewards',
  },
  heroic: {
    successChanceMultiplier: 0.5,
    rewardMultiplier: 2.0,
    enemyHealthMultiplier: 1.6,
    enemyDamageMultiplier: 1.6,
    description: 'Below 50% success, +100% rewards',
  },
};

// ============= ITEMS =============

export interface GeneratedItem {
  templateId: number;
  name: string;
  description?: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  itemLevel: number;
  requiredLevel: number;

  stats: {
    strength?: number;
    agility?: number;
    intellect?: number;
    stamina?: number;
    spirit?: number;
    critRating?: number;
    hitRating?: number;
    hasteRating?: number;
    attackPower?: number;
    spellPower?: number;
    armor?: number;
  };

  isWeapon: boolean;
  weaponDamageMin?: number;
  weaponDamageMax?: number;
  weaponSpeed?: number;
  weaponDps?: number;

  specialEffect?: string;
  setId?: number;
  setName?: string;
}

export const ITEM_RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#9d9d9d',      // Gray
  uncommon: '#1eff00',    // Green
  rare: '#0070dd',        // Blue
  epic: '#a335ee',        // Purple
  legendary: '#ff8000',   // Orange
};

export const ITEM_RARITY_MULTIPLIERS: Record<ItemRarity, number> = {
  common: 0.7,
  uncommon: 1.0,
  rare: 1.3,
  epic: 1.6,
  legendary: 2.0,
};

// ============= PROGRESSION =============

export interface LevelRequirements {
  level: number;
  xpRequired: number;
  totalXpToLevel: number;
  unlocksDescription?: string;
}

export interface ActivityState {
  type: ActivityType;
  activityId?: number;
  activityName?: string;
  startedAt: Date;
  estimatedCompletionAt: Date;
  progressPercent: number;
  difficulty: Difficulty;
}

export interface OfflineProgressSummary {
  offlineDurationSeconds: number;
  effectiveDurationSeconds: number;
  cappedAt18Hours: boolean;

  activityPerformed: string;
  cyclesCompleted: number;

  xpEarned: number;
  goldEarned: number;
  itemsFound: GeneratedItem[];

  levelsGained: number;
  previousLevel: number;
  currentLevel: number;

  died: boolean;
  deathReason?: string;
  diedAfterCycles?: number;
}

// ============= UI STATE =============

export interface GameNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'loot' | 'levelup' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  itemRarity?: ItemRarity;
}

export interface GameState {
  isLoading: boolean;
  activeTab: 'character' | 'world' | 'combat' | 'inventory' | 'dungeons' | 'achievements' | 'settings';

  characterId: number | null;

  activity: ActivityState | null;

  currentCombat: CombatSimulationOutput | null;
  combatMode: 'realtime' | 'summary';

  notifications: GameNotification[];

  offlineProgress: OfflineProgressSummary | null;
  showOfflineModal: boolean;
}

// ============= COMPUTED CHARACTER =============

export interface ComputedCharacter {
  id: number;
  name: string;
  characterClass: CharacterClass;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  experiencePercent: number;

  gold: number;

  // Computed stats (base + gear + talents + buffs)
  stats: CombatStats;

  // Current state
  currentHealth: number;
  currentResource: number;
  healthPercent: number;
  resourcePercent: number;

  // Attributes breakdown
  attributes: {
    strength: { base: number; gear: number; total: number };
    agility: { base: number; gear: number; total: number };
    intellect: { base: number; gear: number; total: number };
    stamina: { base: number; gear: number; total: number };
    spirit: { base: number; gear: number; total: number };
  };

  // Equipment
  equipment: Record<ItemSlot, GeneratedItem | null>;
  averageItemLevel: number;

  // Talent summary
  talentPointsSpent: [number, number, number]; // Per tree
  talentPointsAvailable: number;

  // Activity
  currentActivity: ActivityState | null;

  // Estimates
  estimatedDps: number;
  estimatedSurvivability: number; // % chance to survive average fight
}
