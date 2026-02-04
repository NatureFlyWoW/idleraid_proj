// ============================================================================
// ARMOR SPRITE TEMPLATES - ASCII art for armor items
// ============================================================================

import { SpriteTemplate } from './weapons';

// Color keys for dynamic replacement
export const ARMOR_COLOR_KEYS = {
  main: 'MAIN',        // Primary armor material
  trim: 'TRIM',        // Decorative trim
  gem: 'GEM',          // Accent gem/crystal
  glow: 'GLOW',        // Magical glow
  metal: 'METAL',      // Metal accents/buckles
};

// ============================================================================
// HEAD SLOT
// ============================================================================

// Helm - 5 lines, 10 chars wide
export const HELM_SPRITE: SpriteTemplate = {
  lines: [
    "  ╔════╗  ",
    " ╔╣▓▓▓▓╠╗ ",
    " ║▓▓◇▓▓▓║ ",
    " ║░░░░░░║ ",
    " ╚══════╝ ",
  ],
  colorMap: {
    '╔': ARMOR_COLOR_KEYS.metal,
    '╗': ARMOR_COLOR_KEYS.metal,
    '╚': ARMOR_COLOR_KEYS.metal,
    '╝': ARMOR_COLOR_KEYS.metal,
    '═': ARMOR_COLOR_KEYS.metal,
    '║': ARMOR_COLOR_KEYS.metal,
    '╣': ARMOR_COLOR_KEYS.metal,
    '╠': ARMOR_COLOR_KEYS.metal,
    '▓': ARMOR_COLOR_KEYS.main,
    '░': ARMOR_COLOR_KEYS.trim,
    '◇': ARMOR_COLOR_KEYS.gem,
  },
};

// Hood - 5 lines, 10 chars wide
export const HOOD_SPRITE: SpriteTemplate = {
  lines: [
    "  ╭────╮  ",
    " ╭╯▓▓▓▓╰╮ ",
    " │▓▓▓▓▓▓│ ",
    " │ ░░░░ │ ",
    " ╰──────╯ ",
  ],
  colorMap: {
    '╭': ARMOR_COLOR_KEYS.main,
    '╮': ARMOR_COLOR_KEYS.main,
    '╰': ARMOR_COLOR_KEYS.main,
    '╯': ARMOR_COLOR_KEYS.main,
    '─': ARMOR_COLOR_KEYS.main,
    '│': ARMOR_COLOR_KEYS.main,
    '▓': ARMOR_COLOR_KEYS.main,
    '░': ARMOR_COLOR_KEYS.trim,
  },
};

// ============================================================================
// CHEST SLOT
// ============================================================================

// Chestplate - 6 lines, 12 chars wide
export const CHESTPLATE_SPRITE: SpriteTemplate = {
  lines: [
    " ╔════════╗ ",
    " ║▓▓▓◇▓▓▓▓║ ",
    " ║▓▓▓▓▓▓▓▓║ ",
    " ╠▓▓▓▓▓▓▓▓╣ ",
    " ║▓▓▓▓▓▓▓▓║ ",
    " ╚════════╝ ",
  ],
  colorMap: {
    '╔': ARMOR_COLOR_KEYS.metal,
    '╗': ARMOR_COLOR_KEYS.metal,
    '╚': ARMOR_COLOR_KEYS.metal,
    '╝': ARMOR_COLOR_KEYS.metal,
    '═': ARMOR_COLOR_KEYS.metal,
    '║': ARMOR_COLOR_KEYS.metal,
    '╠': ARMOR_COLOR_KEYS.metal,
    '╣': ARMOR_COLOR_KEYS.metal,
    '▓': ARMOR_COLOR_KEYS.main,
    '◇': ARMOR_COLOR_KEYS.gem,
  },
};

// Robe - 6 lines, 12 chars wide
export const ROBE_SPRITE: SpriteTemplate = {
  lines: [
    " ╭────────╮ ",
    " │▓▓▓◇▓▓▓▓│ ",
    " │▓▓▓▓▓▓▓▓│ ",
    " │▓▓▓▓▓▓▓▓│ ",
    " │▓░░░░░▓▓│ ",
    " ╰────────╯ ",
  ],
  colorMap: {
    '╭': ARMOR_COLOR_KEYS.main,
    '╮': ARMOR_COLOR_KEYS.main,
    '╰': ARMOR_COLOR_KEYS.main,
    '╯': ARMOR_COLOR_KEYS.main,
    '─': ARMOR_COLOR_KEYS.trim,
    '│': ARMOR_COLOR_KEYS.main,
    '▓': ARMOR_COLOR_KEYS.main,
    '░': ARMOR_COLOR_KEYS.trim,
    '◇': ARMOR_COLOR_KEYS.gem,
  },
};

// ============================================================================
// HANDS SLOT
// ============================================================================

// Gloves - 4 lines, 10 chars wide
export const GLOVES_SPRITE: SpriteTemplate = {
  lines: [
    " ╭──╮╭──╮ ",
    " │▓▓││▓▓│ ",
    " │▓▓││▓▓│ ",
    " ╰══╯╰══╯ ",
  ],
  colorMap: {
    '╭': ARMOR_COLOR_KEYS.main,
    '╮': ARMOR_COLOR_KEYS.main,
    '╰': ARMOR_COLOR_KEYS.main,
    '╯': ARMOR_COLOR_KEYS.main,
    '─': ARMOR_COLOR_KEYS.metal,
    '│': ARMOR_COLOR_KEYS.main,
    '▓': ARMOR_COLOR_KEYS.main,
    '═': ARMOR_COLOR_KEYS.metal,
  },
};

// ============================================================================
// FEET SLOT
// ============================================================================

// Boots - 4 lines, 12 chars wide
export const BOOTS_SPRITE: SpriteTemplate = {
  lines: [
    "  ╭──╮╭──╮  ",
    "  │▓▓││▓▓│  ",
    " ╔╧══╧╧══╧╗ ",
    " ╚════════╝ ",
  ],
  colorMap: {
    '╭': ARMOR_COLOR_KEYS.main,
    '╮': ARMOR_COLOR_KEYS.main,
    '─': ARMOR_COLOR_KEYS.main,
    '│': ARMOR_COLOR_KEYS.main,
    '▓': ARMOR_COLOR_KEYS.main,
    '╔': ARMOR_COLOR_KEYS.metal,
    '╗': ARMOR_COLOR_KEYS.metal,
    '╚': ARMOR_COLOR_KEYS.metal,
    '╝': ARMOR_COLOR_KEYS.metal,
    '═': ARMOR_COLOR_KEYS.metal,
    '╧': ARMOR_COLOR_KEYS.metal,
  },
};

// ============================================================================
// ACCESSORY SLOTS
// ============================================================================

// Ring - 3 lines, 6 chars wide
export const RING_SPRITE: SpriteTemplate = {
  lines: [
    " ╭◇╮ ",
    " │░│ ",
    " ╰─╯ ",
  ],
  colorMap: {
    '╭': ARMOR_COLOR_KEYS.metal,
    '╮': ARMOR_COLOR_KEYS.metal,
    '╰': ARMOR_COLOR_KEYS.metal,
    '╯': ARMOR_COLOR_KEYS.metal,
    '─': ARMOR_COLOR_KEYS.metal,
    '│': ARMOR_COLOR_KEYS.metal,
    '◇': ARMOR_COLOR_KEYS.gem,
    '░': ARMOR_COLOR_KEYS.glow,
  },
};

// Trinket - 4 lines, 8 chars wide
export const TRINKET_SPRITE: SpriteTemplate = {
  lines: [
    "  ╔══╗  ",
    "  ║✦◇║  ",
    "  ╚╤═╝  ",
    "   ○    ",
  ],
  colorMap: {
    '╔': ARMOR_COLOR_KEYS.metal,
    '╗': ARMOR_COLOR_KEYS.metal,
    '╚': ARMOR_COLOR_KEYS.metal,
    '╝': ARMOR_COLOR_KEYS.metal,
    '═': ARMOR_COLOR_KEYS.metal,
    '║': ARMOR_COLOR_KEYS.metal,
    '╤': ARMOR_COLOR_KEYS.metal,
    '✦': ARMOR_COLOR_KEYS.glow,
    '◇': ARMOR_COLOR_KEYS.gem,
    '○': ARMOR_COLOR_KEYS.trim,
  },
};

// Necklace - 4 lines, 10 chars wide
export const NECKLACE_SPRITE: SpriteTemplate = {
  lines: [
    " ╭──────╮ ",
    " │      │ ",
    " ╰──◇───╯ ",
    "    ✦    ",
  ],
  colorMap: {
    '╭': ARMOR_COLOR_KEYS.metal,
    '╮': ARMOR_COLOR_KEYS.metal,
    '╰': ARMOR_COLOR_KEYS.metal,
    '╯': ARMOR_COLOR_KEYS.metal,
    '─': ARMOR_COLOR_KEYS.metal,
    '│': ARMOR_COLOR_KEYS.metal,
    '◇': ARMOR_COLOR_KEYS.gem,
    '✦': ARMOR_COLOR_KEYS.glow,
  },
};

// Cape/Back - 5 lines, 10 chars wide
export const CAPE_SPRITE: SpriteTemplate = {
  lines: [
    " ╔══════╗ ",
    " ║▓▓▓▓▓▓║ ",
    " ║▓▓▓▓▓▓║ ",
    " ║▓▓▓▓▓▓║ ",
    " ╰──────╯ ",
  ],
  colorMap: {
    '╔': ARMOR_COLOR_KEYS.metal,
    '╗': ARMOR_COLOR_KEYS.metal,
    '═': ARMOR_COLOR_KEYS.metal,
    '║': ARMOR_COLOR_KEYS.main,
    '▓': ARMOR_COLOR_KEYS.main,
    '╰': ARMOR_COLOR_KEYS.main,
    '╯': ARMOR_COLOR_KEYS.main,
    '─': ARMOR_COLOR_KEYS.trim,
  },
};

// Shield - 6 lines, 10 chars wide
export const SHIELD_SPRITE: SpriteTemplate = {
  lines: [
    " ╔══════╗ ",
    " ║▓▓▓▓▓▓║ ",
    " ║▓▓◇▓▓▓║ ",
    " ║▓▓▓▓▓▓║ ",
    " ╚══════╝ ",
    "   ╰──╯   ",
  ],
  colorMap: {
    '╔': ARMOR_COLOR_KEYS.metal,
    '╗': ARMOR_COLOR_KEYS.metal,
    '╚': ARMOR_COLOR_KEYS.metal,
    '╝': ARMOR_COLOR_KEYS.metal,
    '═': ARMOR_COLOR_KEYS.metal,
    '║': ARMOR_COLOR_KEYS.metal,
    '▓': ARMOR_COLOR_KEYS.main,
    '◇': ARMOR_COLOR_KEYS.gem,
    '╰': ARMOR_COLOR_KEYS.metal,
    '╯': ARMOR_COLOR_KEYS.metal,
    '─': ARMOR_COLOR_KEYS.metal,
  },
};

// ============================================================================
// ARMOR TYPE MAPPING
// ============================================================================

export type ArmorType =
  | 'helm' | 'hood'
  | 'chestplate' | 'robe'
  | 'gloves' | 'boots'
  | 'ring' | 'trinket' | 'necklace'
  | 'cape' | 'shield';

export const ARMOR_SPRITES: Record<ArmorType, SpriteTemplate> = {
  helm: HELM_SPRITE,
  hood: HOOD_SPRITE,
  chestplate: CHESTPLATE_SPRITE,
  robe: ROBE_SPRITE,
  gloves: GLOVES_SPRITE,
  boots: BOOTS_SPRITE,
  ring: RING_SPRITE,
  trinket: TRINKET_SPRITE,
  necklace: NECKLACE_SPRITE,
  cape: CAPE_SPRITE,
  shield: SHIELD_SPRITE,
};
