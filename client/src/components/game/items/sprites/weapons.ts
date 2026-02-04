// ============================================================================
// WEAPON SPRITE TEMPLATES - ASCII art for weapon items
// ============================================================================

export interface SpriteTemplate {
  lines: string[];
  colorMap: Record<string, string>;
}

// Color keys for dynamic replacement
export const WEAPON_COLOR_KEYS = {
  blade: 'BLADE',      // Main weapon body
  hilt: 'HILT',        // Handle/grip
  gem: 'GEM',          // Accent gem/crystal
  glow: 'GLOW',        // Magical glow
  metal: 'METAL',      // Metal accents
};

// ============================================================================
// ONE-HANDED WEAPONS
// ============================================================================

// Sword - 6 lines, 10 chars wide
export const SWORD_SPRITE: SpriteTemplate = {
  lines: [
    "    ╱│    ",
    "   ╱ │    ",
    "  ╱  │    ",
    " ╱   │    ",
    "╔════╪════╗",
    "    ╔╧╗   ",
  ],
  colorMap: {
    '╱': WEAPON_COLOR_KEYS.blade,
    '│': WEAPON_COLOR_KEYS.blade,
    '═': WEAPON_COLOR_KEYS.hilt,
    '╔': WEAPON_COLOR_KEYS.hilt,
    '╗': WEAPON_COLOR_KEYS.hilt,
    '╪': WEAPON_COLOR_KEYS.gem,
    '╧': WEAPON_COLOR_KEYS.metal,
  },
};

// Dagger - 5 lines, 8 chars wide
export const DAGGER_SPRITE: SpriteTemplate = {
  lines: [
    "   ╱│   ",
    "  ╱ │   ",
    " ╱  │   ",
    "╔═══╪═══╗",
    "   ╔╧╗  ",
  ],
  colorMap: {
    '╱': WEAPON_COLOR_KEYS.blade,
    '│': WEAPON_COLOR_KEYS.blade,
    '═': WEAPON_COLOR_KEYS.hilt,
    '╔': WEAPON_COLOR_KEYS.hilt,
    '╗': WEAPON_COLOR_KEYS.hilt,
    '╪': WEAPON_COLOR_KEYS.gem,
    '╧': WEAPON_COLOR_KEYS.metal,
  },
};

// Mace - 6 lines, 10 chars wide
export const MACE_SPRITE: SpriteTemplate = {
  lines: [
    "  ╔═══╗  ",
    "  ║▓▓▓║  ",
    "  ╚═╤═╝  ",
    "    │    ",
    "    │    ",
    "   ╔╧╗   ",
  ],
  colorMap: {
    '╔': WEAPON_COLOR_KEYS.metal,
    '╗': WEAPON_COLOR_KEYS.metal,
    '╚': WEAPON_COLOR_KEYS.metal,
    '╝': WEAPON_COLOR_KEYS.metal,
    '═': WEAPON_COLOR_KEYS.metal,
    '║': WEAPON_COLOR_KEYS.metal,
    '▓': WEAPON_COLOR_KEYS.blade,
    '│': WEAPON_COLOR_KEYS.hilt,
    '╤': WEAPON_COLOR_KEYS.gem,
    '╧': WEAPON_COLOR_KEYS.hilt,
  },
};

// Axe - 6 lines, 10 chars wide
export const AXE_SPRITE: SpriteTemplate = {
  lines: [
    " ╔══════╗ ",
    " ║▓▓▓▓▓▓║ ",
    " ╚══╤═══╝ ",
    "    │     ",
    "    │     ",
    "   ╔╧╗    ",
  ],
  colorMap: {
    '╔': WEAPON_COLOR_KEYS.blade,
    '╗': WEAPON_COLOR_KEYS.blade,
    '╚': WEAPON_COLOR_KEYS.blade,
    '╝': WEAPON_COLOR_KEYS.blade,
    '═': WEAPON_COLOR_KEYS.blade,
    '║': WEAPON_COLOR_KEYS.blade,
    '▓': WEAPON_COLOR_KEYS.metal,
    '│': WEAPON_COLOR_KEYS.hilt,
    '╤': WEAPON_COLOR_KEYS.gem,
    '╧': WEAPON_COLOR_KEYS.hilt,
  },
};

// ============================================================================
// TWO-HANDED WEAPONS
// ============================================================================

// Greatsword - 8 lines, 12 chars wide
export const GREATSWORD_SPRITE: SpriteTemplate = {
  lines: [
    "      ╱│    ",
    "     ╱ │    ",
    "    ╱  │    ",
    "   ╱   │    ",
    "  ╱    │    ",
    " ╱     │    ",
    "╔══════╪════╗",
    "     ╔═╧═╗  ",
  ],
  colorMap: {
    '╱': WEAPON_COLOR_KEYS.blade,
    '│': WEAPON_COLOR_KEYS.blade,
    '═': WEAPON_COLOR_KEYS.hilt,
    '╔': WEAPON_COLOR_KEYS.hilt,
    '╗': WEAPON_COLOR_KEYS.hilt,
    '╪': WEAPON_COLOR_KEYS.gem,
    '╧': WEAPON_COLOR_KEYS.metal,
  },
};

// Staff - 8 lines, 10 chars wide
export const STAFF_SPRITE: SpriteTemplate = {
  lines: [
    "   ╔◇╗   ",
    "   ║✦║   ",
    "   ╚╤╝   ",
    "    │    ",
    "    │    ",
    "    │    ",
    "    │    ",
    "   ╔╧╗   ",
  ],
  colorMap: {
    '╔': WEAPON_COLOR_KEYS.metal,
    '╗': WEAPON_COLOR_KEYS.metal,
    '╚': WEAPON_COLOR_KEYS.metal,
    '╝': WEAPON_COLOR_KEYS.metal,
    '◇': WEAPON_COLOR_KEYS.gem,
    '✦': WEAPON_COLOR_KEYS.glow,
    '│': WEAPON_COLOR_KEYS.hilt,
    '║': WEAPON_COLOR_KEYS.metal,
    '╤': WEAPON_COLOR_KEYS.metal,
    '╧': WEAPON_COLOR_KEYS.hilt,
  },
};

// Polearm - 8 lines, 10 chars wide
export const POLEARM_SPRITE: SpriteTemplate = {
  lines: [
    "   ╱╲    ",
    "  ╱▓▓╲   ",
    " ╱▓▓▓▓╲  ",
    "╔══╪═══╗ ",
    "    │    ",
    "    │    ",
    "    │    ",
    "   ╔╧╗   ",
  ],
  colorMap: {
    '╱': WEAPON_COLOR_KEYS.blade,
    '╲': WEAPON_COLOR_KEYS.blade,
    '▓': WEAPON_COLOR_KEYS.blade,
    '═': WEAPON_COLOR_KEYS.metal,
    '╔': WEAPON_COLOR_KEYS.metal,
    '╗': WEAPON_COLOR_KEYS.metal,
    '│': WEAPON_COLOR_KEYS.hilt,
    '╪': WEAPON_COLOR_KEYS.gem,
    '╧': WEAPON_COLOR_KEYS.hilt,
  },
};

// ============================================================================
// RANGED WEAPONS
// ============================================================================

// Bow - 7 lines, 12 chars wide
export const BOW_SPRITE: SpriteTemplate = {
  lines: [
    "╭───╮     ",
    "│   ╰╮    ",
    "│    │────",
    "│   ◇│    ",
    "│    │────",
    "│   ╭╯    ",
    "╰───╯     ",
  ],
  colorMap: {
    '╭': WEAPON_COLOR_KEYS.hilt,
    '╮': WEAPON_COLOR_KEYS.hilt,
    '╰': WEAPON_COLOR_KEYS.hilt,
    '╯': WEAPON_COLOR_KEYS.hilt,
    '│': WEAPON_COLOR_KEYS.hilt,
    '─': WEAPON_COLOR_KEYS.blade,
    '◇': WEAPON_COLOR_KEYS.gem,
  },
};

// Wand - 5 lines, 10 chars wide
export const WAND_SPRITE: SpriteTemplate = {
  lines: [
    "  ╔◇╗    ",
    "  ║✦║    ",
    "  ╚╤╝    ",
    "   ╲     ",
    "    ╲    ",
  ],
  colorMap: {
    '╔': WEAPON_COLOR_KEYS.metal,
    '╗': WEAPON_COLOR_KEYS.metal,
    '╚': WEAPON_COLOR_KEYS.metal,
    '╝': WEAPON_COLOR_KEYS.metal,
    '║': WEAPON_COLOR_KEYS.metal,
    '◇': WEAPON_COLOR_KEYS.gem,
    '✦': WEAPON_COLOR_KEYS.glow,
    '╤': WEAPON_COLOR_KEYS.metal,
    '╲': WEAPON_COLOR_KEYS.hilt,
  },
};

// ============================================================================
// WEAPON TYPE MAPPING
// ============================================================================

export type WeaponType =
  | 'sword' | 'dagger' | 'mace' | 'axe'
  | 'greatsword' | 'staff' | 'polearm'
  | 'bow' | 'wand';

export const WEAPON_SPRITES: Record<WeaponType, SpriteTemplate> = {
  sword: SWORD_SPRITE,
  dagger: DAGGER_SPRITE,
  mace: MACE_SPRITE,
  axe: AXE_SPRITE,
  greatsword: GREATSWORD_SPRITE,
  staff: STAFF_SPRITE,
  polearm: POLEARM_SPRITE,
  bow: BOW_SPRITE,
  wand: WAND_SPRITE,
};
