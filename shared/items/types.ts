/**
 * Item Type System
 *
 * Defines item categories, slots, and base templates for procedural generation.
 */

import type { ItemVisualDescriptor, ItemRarity } from './descriptors';

// ============================================================================
// EQUIPMENT SLOTS
// ============================================================================

export const EQUIPMENT_SLOTS = [
  'head',
  'neck',
  'shoulders',
  'back',
  'chest',
  'wrists',
  'hands',
  'waist',
  'legs',
  'feet',
  'ring1',
  'ring2',
  'trinket1',
  'trinket2',
  'mainHand',
  'offHand',
  'ranged',
] as const;

export type EquipmentSlot = typeof EQUIPMENT_SLOTS[number];

// ============================================================================
// WEAPON TYPES
// ============================================================================

export const WEAPON_TYPES = {
  oneHanded: ['sword', 'axe', 'mace', 'dagger', 'fist'] as const,
  twoHanded: ['greatsword', 'greataxe', 'polearm', 'staff'] as const,
  ranged: ['bow', 'crossbow', 'gun', 'wand', 'thrown'] as const,
  offhand: ['shield', 'tome', 'orb', 'totem'] as const,
} as const;

export type OneHandedWeapon = typeof WEAPON_TYPES.oneHanded[number];
export type TwoHandedWeapon = typeof WEAPON_TYPES.twoHanded[number];
export type RangedWeapon = typeof WEAPON_TYPES.ranged[number];
export type OffhandType = typeof WEAPON_TYPES.offhand[number];
export type WeaponType = OneHandedWeapon | TwoHandedWeapon | RangedWeapon | OffhandType;

// ============================================================================
// ARMOR TYPES
// ============================================================================

export const ARMOR_TYPES = ['cloth', 'leather', 'mail', 'plate'] as const;
export type ArmorType = typeof ARMOR_TYPES[number];

export const ARMOR_SLOTS = ['head', 'shoulders', 'chest', 'wrists', 'hands', 'waist', 'legs', 'feet'] as const;
export type ArmorSlot = typeof ARMOR_SLOTS[number];

// ============================================================================
// ACCESSORY TYPES
// ============================================================================

export const ACCESSORY_TYPES = {
  neck: ['amulet', 'pendant', 'choker', 'medallion'] as const,
  back: ['cloak', 'cape', 'mantle'] as const,
  ring: ['ring', 'band', 'signet', 'loop'] as const,
  trinket: ['charm', 'talisman', 'relic', 'idol', 'fetish'] as const,
} as const;

// ============================================================================
// STAT TYPES
// ============================================================================

export const PRIMARY_STATS = ['strength', 'agility', 'intellect', 'stamina', 'spirit'] as const;
export type PrimaryStat = typeof PRIMARY_STATS[number];

export const SECONDARY_STATS = [
  'attackPower',
  'spellPower',
  'critRating',
  'hitRating',
  'hasteRating',
  'armorPenetration',
  'spellPenetration',
  'mp5',
  'dodge',
  'parry',
  'block',
  'armor',
  'resilience',
] as const;
export type SecondaryStat = typeof SECONDARY_STATS[number];

// ============================================================================
// SPECIAL EFFECTS
// ============================================================================

export const EFFECT_TRIGGERS = [
  'onHit',           // When hitting an enemy
  'onCrit',          // When critically hitting
  'onBlock',         // When blocking an attack
  'onDodge',         // When dodging an attack
  'onSpellCast',     // When casting a spell
  'onHeal',          // When healing
  'onTakeDamage',    // When taking damage
  'onKill',          // When killing an enemy
  'passive',         // Always active
  'use',             // On-use effect with cooldown
] as const;
export type EffectTrigger = typeof EFFECT_TRIGGERS[number];

export interface ItemSpecialEffect {
  id: string;
  name: string;
  description: string;
  trigger: EffectTrigger;
  procChance?: number;       // For proc effects (0-1)
  cooldown?: number;         // In seconds
  duration?: number;         // Effect duration in seconds
  effectType: 'damage' | 'heal' | 'buff' | 'debuff' | 'utility';
  magnitude: number;         // Base effect strength
  scaling?: {                // How it scales
    stat?: PrimaryStat;
    ratio?: number;
  };
}

// ============================================================================
// SET BONUSES
// ============================================================================

export interface SetBonus {
  piecesRequired: number;
  bonusType: 'stat' | 'effect';
  statBonuses?: Partial<Record<PrimaryStat | SecondaryStat, number>>;
  effect?: ItemSpecialEffect;
  description: string;
}

export interface ItemSet {
  id: string;
  name: string;
  pieces: string[];          // Item IDs in the set
  bonuses: SetBonus[];
  loreText?: string;
}

// ============================================================================
// COMPLETE ITEM DEFINITION
// ============================================================================

export interface ItemTemplate {
  // Identity
  id: string;
  name: string;
  baseType: WeaponType | ArmorSlot | 'neck' | 'back' | 'ring' | 'trinket';
  slot: EquipmentSlot;
  rarity: ItemRarity;
  itemLevel: number;
  requiredLevel: number;

  // Class restrictions
  armorType?: ArmorType;
  classRestrictions?: string[];  // Empty = all classes

  // Stats
  primaryStats: Partial<Record<PrimaryStat, number>>;
  secondaryStats?: Partial<Record<SecondaryStat, number>>;

  // Weapon-specific
  weaponType?: WeaponType;
  minDamage?: number;
  maxDamage?: number;
  attackSpeed?: number;      // Attacks per second

  // Special
  specialEffects?: ItemSpecialEffect[];
  setId?: string;

  // Visual (generated by Item Art Agent)
  visualDescriptor: ItemVisualDescriptor;

  // Flavor
  flavorText?: string;
  source?: string;           // "Drops from X", "Quest reward", etc.
}

// ============================================================================
// GENERATION PARAMETERS
// ============================================================================

export interface ItemGenerationParams {
  slot: EquipmentSlot;
  itemLevel: number;
  rarity: ItemRarity;
  armorType?: ArmorType;
  weaponType?: WeaponType;

  // Optional constraints
  forceStats?: (PrimaryStat | SecondaryStat)[];
  forbidStats?: (PrimaryStat | SecondaryStat)[];
  themeHint?: string;        // "fire", "nature", "shadow", etc.
}

// ============================================================================
// SPRITE TEMPLATE (for Item Art Agent)
// ============================================================================

export interface ItemSpriteTemplate {
  baseType: WeaponType | ArmorSlot | 'accessory';
  asciiTemplate: string[];   // Base ASCII art (multiline)
  colorZones: {              // Which characters get which color
    primary: string;         // Characters to color with primary
    secondary: string;       // Characters to color with secondary
    accent: string;          // Characters to color with accent
    effect: string;          // Characters for glow/particle effects
  };
  variants: {
    size: Record<string, string[]>;      // Size variations
    condition: Record<string, string[]>; // Wear variations
  };
}
