/**
 * Misc ASCII Art - Utility art pieces for various screens
 * Skull, Treasure Chest, Campfire, Crossed Swords, Question Mark
 */

/**
 * SKULL_ART - For death/defeat screens (~15 lines)
 */
export const SKULL_ART: string[] = [
  "               ,---.                    ",
  "              /     \\                   ",
  "             /       \\                  ",
  "            |  @   @  |                 ",
  "            |    ^    |                 ",
  "            |   |-|   |                 ",
  "             \\  ===  /                  ",
  "              \\ ||| /                   ",
  "           ____\\|||/____                ",
  "          /              \\              ",
  "         /________________\\             ",
  "         |   ||    ||   |               ",
  "         |___||____||___|               ",
  "              ||    ||                  ",
  "             _||____||_                 ",
];

export const SKULL_COLORS = [
  // Eye sockets in red
  { line: 3, start: 13, end: 14, color: '#ff0000' },
  { line: 3, start: 18, end: 19, color: '#ff0000' },
];

/**
 * TREASURE_CHEST_ART - For loot screens (~12 lines)
 */
export const TREASURE_CHEST_ART: string[] = [
  "          ___________          ",
  "         /           \\        ",
  "        /  *  *  *  * \\       ",
  "       |===============|      ",
  "       |   _________   |      ",
  "       |  |  LOOT!  |  |      ",
  "       |  |_________|  |      ",
  "       |   *  *  *  *  |      ",
  "       |_______________|      ",
  "       |___|_______|___|      ",
  "      /   /         \\   \\    ",
  "     /___/___________\\___\\   ",
];

export const TREASURE_CHEST_COLORS = [
  // Stars/gems in yellow
  { line: 2, start: 12, end: 22, color: '#ffff00' },
  { line: 7, start: 11, end: 21, color: '#ffff00' },
  // LOOT text in gold
  { line: 5, start: 14, end: 20, color: '#ff8000' },
];

/**
 * CAMPFIRE_ART - For rest/inn screens (~15 lines)
 */
export const CAMPFIRE_ART: string[] = [
  "                  )                     ",
  "                 ) \\                    ",
  "                (   )                   ",
  "                 ) (                    ",
  "                (   )                   ",
  "               _)   (_                  ",
  "              (_  *  _)                 ",
  "             (__  *  __)                ",
  "            (___  *  ___)               ",
  "               \\* * */                  ",
  "                \\*|*/                   ",
  "            ,----===----,               ",
  "           /  /\\     /\\  \\             ",
  "          /__/  \\___/  \\__\\            ",
  "         |____|_______|____|            ",
];

export const CAMPFIRE_COLORS = [
  // Flames in red/orange
  { line: 0, start: 18, end: 19, color: '#ff4500' },
  { line: 1, start: 17, end: 20, color: '#ff4500' },
  { line: 2, start: 16, end: 21, color: '#ff6600' },
  { line: 3, start: 17, end: 20, color: '#ff6600' },
  { line: 4, start: 16, end: 21, color: '#ff8800' },
  { line: 5, start: 15, end: 22, color: '#ff8800' },
  { line: 6, start: 14, end: 23, color: '#ffaa00' },
  { line: 7, start: 13, end: 24, color: '#ffaa00' },
  { line: 8, start: 12, end: 25, color: '#ffcc00' },
  { line: 9, start: 15, end: 22, color: '#ffff00' },
  { line: 10, start: 16, end: 21, color: '#ffff00' },
];

/**
 * CROSSED_SWORDS_ART - For combat screens (~10 lines)
 */
export const CROSSED_SWORDS_ART: string[] = [
  "         \\           /         ",
  "          \\         /          ",
  "           \\       /           ",
  "            \\     /            ",
  "             \\   /             ",
  "           ---===---           ",
  "             /   \\             ",
  "            /     \\            ",
  "           /       \\           ",
  "          /         \\          ",
];

export const CROSSED_SWORDS_COLORS = [
  // Blades in white
  { line: 0, start: 9, end: 10, color: '#ffffff' },
  { line: 0, start: 21, end: 22, color: '#ffffff' },
  { line: 1, start: 10, end: 11, color: '#ffffff' },
  { line: 1, start: 20, end: 21, color: '#ffffff' },
  { line: 2, start: 11, end: 12, color: '#ffffff' },
  { line: 2, start: 19, end: 20, color: '#ffffff' },
  { line: 3, start: 12, end: 13, color: '#ffffff' },
  { line: 3, start: 18, end: 19, color: '#ffffff' },
  { line: 4, start: 13, end: 14, color: '#ffffff' },
  { line: 4, start: 17, end: 18, color: '#ffffff' },
  // Crossguard in yellow
  { line: 5, start: 11, end: 20, color: '#ffff00' },
  // Hilts in brown
  { line: 6, start: 13, end: 18, color: '#8B4513' },
  { line: 7, start: 12, end: 19, color: '#8B4513' },
  { line: 8, start: 11, end: 20, color: '#8B4513' },
  { line: 9, start: 10, end: 21, color: '#8B4513' },
];

/**
 * QUESTION_MARK_ART - For 404/not found screens (~15 lines)
 */
export const QUESTION_MARK_ART: string[] = [
  "           ,-----.             ",
  "          /       \\            ",
  "         |   ???   |           ",
  "         |   ???   |           ",
  "          \\   ?   /            ",
  "           \\     /             ",
  "            \\   /              ",
  "             | |               ",
  "             | |               ",
  "             |_|               ",
  "                               ",
  "             ___               ",
  "            |   |              ",
  "            |___|              ",
  "                               ",
];

export const QUESTION_MARK_COLORS = [
  // Question marks in yellow
  { line: 2, start: 13, end: 18, color: '#ffff00' },
  { line: 3, start: 13, end: 18, color: '#ffff00' },
  { line: 4, start: 16, end: 17, color: '#ffff00' },
  // Dot in yellow
  { line: 12, start: 12, end: 17, color: '#ffff00' },
  { line: 13, start: 12, end: 17, color: '#ffff00' },
];

/**
 * VICTORY_BANNER_ART - For victory screens
 */
export const VICTORY_BANNER_ART: string[] = [
  "  ╔═══════════════════════════════════╗  ",
  "  ║                                   ║  ",
  "  ║     ██╗   ██╗██╗ ██████╗████████╗ ║  ",
  "  ║     ██║   ██║██║██╔════╝╚══██╔══╝ ║  ",
  "  ║     ██║   ██║██║██║        ██║    ║  ",
  "  ║     ╚██╗ ██╔╝██║██║        ██║    ║  ",
  "  ║      ╚████╔╝ ██║╚██████╗   ██║    ║  ",
  "  ║       ╚═══╝  ╚═╝ ╚═════╝   ╚═╝    ║  ",
  "  ║              O  R  Y              ║  ",
  "  ║                                   ║  ",
  "  ╚═══════════════════════════════════╝  ",
];

export const VICTORY_BANNER_COLORS = [
  // Title in gold
  { line: 2, start: 9, end: 37, color: '#ffff00' },
  { line: 3, start: 9, end: 37, color: '#ffff00' },
  { line: 4, start: 9, end: 37, color: '#ffff00' },
  { line: 5, start: 9, end: 37, color: '#ffff00' },
  { line: 6, start: 9, end: 37, color: '#ffff00' },
  { line: 7, start: 9, end: 37, color: '#ffff00' },
  { line: 8, start: 14, end: 28, color: '#ffff00' },
];

/**
 * DEFEAT_BANNER_ART - For defeat screens
 */
export const DEFEAT_BANNER_ART: string[] = [
  "  ╔═══════════════════════════════════╗  ",
  "  ║                                   ║  ",
  "  ║    ██████╗ ███████╗███████╗██████╗║  ",
  "  ║    ██╔══██╗██╔════╝██╔════╝██╔══██║  ",
  "  ║    ██║  ██║█████╗  █████╗  ██████╔║  ",
  "  ║    ██║  ██║██╔══╝  ██╔══╝  ██╔══██║  ",
  "  ║    ██████╔╝███████╗██║     ██║  ██║  ",
  "  ║    ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═║  ",
  "  ║              A  T  E  D          ║  ",
  "  ║                                   ║  ",
  "  ╚═══════════════════════════════════╝  ",
];

export const DEFEAT_BANNER_COLORS = [
  // Title in red
  { line: 2, start: 8, end: 38, color: '#ff0000' },
  { line: 3, start: 8, end: 38, color: '#ff0000' },
  { line: 4, start: 8, end: 38, color: '#ff0000' },
  { line: 5, start: 8, end: 38, color: '#ff0000' },
  { line: 6, start: 8, end: 38, color: '#ff0000' },
  { line: 7, start: 8, end: 38, color: '#ff0000' },
  { line: 8, start: 14, end: 28, color: '#ff0000' },
];

export default {
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
};
