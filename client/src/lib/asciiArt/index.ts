/**
 * ASCII Art Library - Barrel file
 * Re-exports all ASCII art assets for the game
 */

// Character Portraits
import { WARRIOR_ART, WARRIOR_COLORS } from './warrior';
import { MAGE_ART, MAGE_COLORS } from './mage';
import { PRIEST_ART, PRIEST_COLORS } from './priest';
import { ROGUE_ART, ROGUE_COLORS } from './rogue';
import { HUNTER_ART, HUNTER_COLORS } from './hunter';
import { WARLOCK_ART, WARLOCK_COLORS } from './warlock';
import { SHAMAN_ART, SHAMAN_COLORS } from './shaman';

// Title and Branding
import {
  TITLE_LOGO_ART,
  TITLE_LOGO_COLORS,
  TITLE_LOGO_COMPACT,
  TITLE_LOGO_COMPACT_COLORS,
} from './titleLogo';

// Utility Art
import {
  SKULL_ART,
  SKULL_COLORS,
  TREASURE_CHEST_ART,
  TREASURE_CHEST_COLORS,
  CAMPFIRE_ART,
  CAMPFIRE_COLORS,
  CROSSED_SWORDS_ART,
  CROSSED_SWORDS_COLORS,
  QUESTION_MARK_ART,
  QUESTION_MARK_COLORS,
  VICTORY_BANNER_ART,
  VICTORY_BANNER_COLORS,
  DEFEAT_BANNER_ART,
  DEFEAT_BANNER_COLORS,
} from './misc';

// Re-export everything
export {
  // Character portraits
  WARRIOR_ART, WARRIOR_COLORS,
  MAGE_ART, MAGE_COLORS,
  PRIEST_ART, PRIEST_COLORS,
  ROGUE_ART, ROGUE_COLORS,
  HUNTER_ART, HUNTER_COLORS,
  WARLOCK_ART, WARLOCK_COLORS,
  SHAMAN_ART, SHAMAN_COLORS,
  // Title
  TITLE_LOGO_ART, TITLE_LOGO_COLORS,
  TITLE_LOGO_COMPACT, TITLE_LOGO_COMPACT_COLORS,
  // Utility
  SKULL_ART, SKULL_COLORS,
  TREASURE_CHEST_ART, TREASURE_CHEST_COLORS,
  CAMPFIRE_ART, CAMPFIRE_COLORS,
  CROSSED_SWORDS_ART, CROSSED_SWORDS_COLORS,
  QUESTION_MARK_ART, QUESTION_MARK_COLORS,
  VICTORY_BANNER_ART, VICTORY_BANNER_COLORS,
  DEFEAT_BANNER_ART, DEFEAT_BANNER_COLORS,
};

// Helper type for color regions
export interface ColorRegion {
  line: number;
  start: number;
  end: number;
  color: string;
}

// Map class names to their art
export const CLASS_ART_MAP: Record<string, { art: string[], colors: ColorRegion[] }> = {
  warrior: { art: WARRIOR_ART, colors: WARRIOR_COLORS },
  mage: { art: MAGE_ART, colors: MAGE_COLORS },
  priest: { art: PRIEST_ART, colors: PRIEST_COLORS },
  rogue: { art: ROGUE_ART, colors: ROGUE_COLORS },
  hunter: { art: HUNTER_ART, colors: HUNTER_COLORS },
  warlock: { art: WARLOCK_ART, colors: WARLOCK_COLORS },
  shaman: { art: SHAMAN_ART, colors: SHAMAN_COLORS },
};

/**
 * Get art for a specific class (also handles paladin/druid as aliases)
 */
export function getClassArt(className: string): { art: string[], colors: ColorRegion[] } | null {
  const normalizedClass = className.toLowerCase();

  // Handle aliases for unimplemented classes
  const aliasMap: Record<string, string> = {
    paladin: 'warrior',  // Similar armor/aesthetic
    druid: 'shaman',     // Similar nature theme
  };

  const resolvedClass = aliasMap[normalizedClass] || normalizedClass;
  return CLASS_ART_MAP[resolvedClass] || null;
}

/**
 * Get all available class art keys
 */
export function getAvailableClasses(): string[] {
  return Object.keys(CLASS_ART_MAP);
}
