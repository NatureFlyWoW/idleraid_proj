/**
 * Item Visual Descriptor System
 *
 * This file defines the vocabulary for procedural item generation.
 * Item Art Agent uses these descriptors to generate ASCII sprites.
 * Item Balance Agent uses these to inform stat generation.
 */

// ============================================================================
// MATERIAL DESCRIPTORS
// ============================================================================

export const ITEM_MATERIALS = {
  // Metals (primarily for weapons/armor)
  metals: ['iron', 'steel', 'bronze', 'copper', 'silver', 'gold', 'mithril', 'adamantine', 'darksteel', 'bloodiron'] as const,

  // Woods (staves, bows, handles)
  woods: ['oak', 'ash', 'yew', 'ebony', 'ironwood', 'ghostwood', 'bloodwood', 'heartwood'] as const,

  // Fabrics (cloth armor, robes)
  fabrics: ['linen', 'wool', 'silk', 'moonweave', 'shadowcloth', 'spellweave', 'netherweave'] as const,

  // Leathers (leather armor)
  leathers: ['leather', 'hide', 'dragonscale', 'wyrmhide', 'demonhide', 'felscale'] as const,

  // Gemstones (for accents and enchantments)
  gems: ['ruby', 'sapphire', 'emerald', 'diamond', 'onyx', 'amethyst', 'topaz', 'opal'] as const,

  // Bones/organic (for darker themes)
  bones: ['bone', 'skull', 'fang', 'claw', 'chitin', 'horn'] as const,
} as const;

export type MetalMaterial = typeof ITEM_MATERIALS.metals[number];
export type WoodMaterial = typeof ITEM_MATERIALS.woods[number];
export type FabricMaterial = typeof ITEM_MATERIALS.fabrics[number];
export type LeatherMaterial = typeof ITEM_MATERIALS.leathers[number];
export type GemMaterial = typeof ITEM_MATERIALS.gems[number];
export type BoneMaterial = typeof ITEM_MATERIALS.bones[number];

export type ItemMaterial = MetalMaterial | WoodMaterial | FabricMaterial | LeatherMaterial | GemMaterial | BoneMaterial;

// ============================================================================
// COLOR DESCRIPTORS
// ============================================================================

export const ITEM_COLORS = {
  // Base colors
  primary: ['black', 'white', 'grey', 'red', 'blue', 'green', 'gold', 'silver', 'brown', 'purple'] as const,

  // Tints/shades
  modifiers: ['dark', 'pale', 'bright', 'faded', 'rich', 'deep'] as const,

  // Special colors (for magical items)
  magical: ['glowing', 'shimmering', 'pulsing', 'crackling', 'ethereal', 'shadowy', 'radiant', 'corrupted'] as const,
} as const;

export type PrimaryColor = typeof ITEM_COLORS.primary[number];
export type ColorModifier = typeof ITEM_COLORS.modifiers[number];
export type MagicalColor = typeof ITEM_COLORS.magical[number];

// ============================================================================
// DIMENSIONAL DESCRIPTORS
// ============================================================================

export const ITEM_DIMENSIONS = {
  sizes: ['tiny', 'small', 'medium', 'large', 'massive', 'colossal'] as const,
  widths: ['slender', 'narrow', 'normal', 'wide', 'broad', 'massive'] as const,
  conditions: ['pristine', 'worn', 'battle-scarred', 'ancient', 'rusted', 'polished', 'ornate'] as const,
} as const;

export type ItemSize = typeof ITEM_DIMENSIONS.sizes[number];
export type ItemWidth = typeof ITEM_DIMENSIONS.widths[number];
export type ItemCondition = typeof ITEM_DIMENSIONS.conditions[number];

// ============================================================================
// EFFECT DESCRIPTORS (Visual flourishes)
// ============================================================================

export const ITEM_EFFECTS = {
  // Glow effects
  glows: ['none', 'subtle', 'bright', 'blinding', 'pulsing'] as const,

  // Particle effects
  particles: ['none', 'sparks', 'flames', 'frost', 'shadow', 'holy', 'arcane', 'nature', 'blood'] as const,

  // Aura effects
  auras: ['none', 'faint', 'visible', 'intense', 'overwhelming'] as const,

  // Animation effects
  animations: ['static', 'subtle-pulse', 'breathing', 'crackling', 'flowing', 'blazing'] as const,
} as const;

export type GlowIntensity = typeof ITEM_EFFECTS.glows[number];
export type ParticleType = typeof ITEM_EFFECTS.particles[number];
export type AuraIntensity = typeof ITEM_EFFECTS.auras[number];
export type AnimationType = typeof ITEM_EFFECTS.animations[number];

// ============================================================================
// COMBINED VISUAL DESCRIPTOR
// ============================================================================

export interface ItemVisualDescriptor {
  // Core visuals
  primaryMaterial: ItemMaterial;
  secondaryMaterial?: ItemMaterial;
  accentMaterial?: GemMaterial | MetalMaterial;

  // Colors
  primaryColor: PrimaryColor;
  colorModifier?: ColorModifier;
  magicalTint?: MagicalColor;

  // Dimensions
  size: ItemSize;
  width?: ItemWidth;
  condition: ItemCondition;

  // Effects (for rare+ items)
  glowIntensity: GlowIntensity;
  particleType: ParticleType;
  auraIntensity: AuraIntensity;
  animation: AnimationType;

  // Flavor
  prefix?: string;    // "Blazing", "Frozen", "Ancient"
  suffix?: string;    // "of the Bear", "of Destruction"
}

// ============================================================================
// RARITY → VISUAL MAPPING
// ============================================================================

export const RARITY_VISUAL_RULES = {
  common: {
    allowedGlows: ['none'] as const,
    allowedParticles: ['none'] as const,
    allowedAuras: ['none'] as const,
    allowedAnimations: ['static'] as const,
    maxMaterials: 1,
  },
  uncommon: {
    allowedGlows: ['none', 'subtle'] as const,
    allowedParticles: ['none'] as const,
    allowedAuras: ['none', 'faint'] as const,
    allowedAnimations: ['static', 'subtle-pulse'] as const,
    maxMaterials: 2,
  },
  rare: {
    allowedGlows: ['subtle', 'bright'] as const,
    allowedParticles: ['none', 'sparks', 'frost', 'flames'] as const,
    allowedAuras: ['faint', 'visible'] as const,
    allowedAnimations: ['subtle-pulse', 'breathing', 'crackling'] as const,
    maxMaterials: 2,
  },
  epic: {
    allowedGlows: ['bright', 'pulsing'] as const,
    allowedParticles: ['sparks', 'flames', 'frost', 'shadow', 'holy', 'arcane'] as const,
    allowedAuras: ['visible', 'intense'] as const,
    allowedAnimations: ['breathing', 'crackling', 'flowing'] as const,
    maxMaterials: 3,
  },
  legendary: {
    allowedGlows: ['pulsing', 'blinding'] as const,
    allowedParticles: ['flames', 'frost', 'shadow', 'holy', 'arcane', 'nature', 'blood'] as const,
    allowedAuras: ['intense', 'overwhelming'] as const,
    allowedAnimations: ['crackling', 'flowing', 'blazing'] as const,
    maxMaterials: 3,
  },
} as const;

export type ItemRarity = keyof typeof RARITY_VISUAL_RULES;
