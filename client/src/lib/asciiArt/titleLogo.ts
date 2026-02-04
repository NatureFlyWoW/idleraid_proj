/**
 * Title Logo ASCII Art - "IDLE RAIDERS" massive block letters
 * ~25 lines tall, ~80 chars wide
 * Uses dense fill for letter bodies
 */

export const TITLE_LOGO_ART: string[] = [
  "                                                                                ",
  "  ██╗██████╗ ██╗     ███████╗    ██████╗  █████╗ ██╗██████╗ ███████╗██████╗ ███████╗",
  "  ██║██╔══██╗██║     ██╔════╝    ██╔══██╗██╔══██╗██║██╔══██╗██╔════╝██╔══██╗██╔════╝",
  "  ██║██║  ██║██║     █████╗      ██████╔╝███████║██║██║  ██║█████╗  ██████╔╝███████╗",
  "  ██║██║  ██║██║     ██╔══╝      ██╔══██╗██╔══██║██║██║  ██║██╔══╝  ██╔══██╗╚════██║",
  "  ██║██████╔╝███████╗███████╗    ██║  ██║██║  ██║██║██████╔╝███████╗██║  ██║███████║",
  "  ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝",
  "                                                                                ",
  "                         ⚔═══════════════════════════════⚔                      ",
  "                                                                                ",
  "                              /\\                  /\\                            ",
  "                             /  \\      /\\       /  \\                           ",
  "                            / /\\ \\    /  \\     / /\\ \\                          ",
  "                           / /  \\ \\  / /\\ \\   / /  \\ \\                         ",
  "                          /_/    \\_\\/ /  \\ \\_/_/    \\_\\                        ",
  "                                   / /    \\ \\                                  ",
  "                                  /_/      \\_\\                                 ",
  "                                                                                ",
  "                    ~ An Incremental MMORPG Adventure ~                         ",
  "                                                                                ",
  "            ═══════════════════════════════════════════════════                 ",
  "                                                                                ",
];

// Color the whole logo in red/amber
export const TITLE_LOGO_COLORS = [
  // Main title letters in red
  { line: 1, start: 2, end: 82, color: '#ff3333' },
  { line: 2, start: 2, end: 82, color: '#ff3333' },
  { line: 3, start: 2, end: 82, color: '#ff3333' },
  { line: 4, start: 2, end: 82, color: '#ff3333' },
  { line: 5, start: 2, end: 82, color: '#ff3333' },
  { line: 6, start: 2, end: 82, color: '#ff3333' },
  // Crossed swords in yellow
  { line: 8, start: 25, end: 55, color: '#ffff00' },
  // Decorative swords
  { line: 10, start: 29, end: 51, color: '#888888' },
  { line: 11, start: 29, end: 51, color: '#888888' },
  { line: 12, start: 28, end: 52, color: '#888888' },
  { line: 13, start: 27, end: 53, color: '#888888' },
  { line: 14, start: 26, end: 54, color: '#888888' },
  { line: 15, start: 35, end: 45, color: '#888888' },
  { line: 16, start: 34, end: 46, color: '#888888' },
  // Tagline in gray
  { line: 18, start: 20, end: 60, color: '#666666' },
  // Bottom separator
  { line: 20, start: 12, end: 68, color: '#444444' },
];

/**
 * Compact title for smaller displays
 */
export const TITLE_LOGO_COMPACT: string[] = [
  "╔═══════════════════════════════════╗",
  "║   ██ █▀▄ █   █▀▀   █▀█ ▄▀▄ ██ █▀▄ █▀▀ █▀█ ▄▀▀   ║",
  "║   ██ █ █ █   █▀    █▀▄ █▀█ ██ █ █ █▀  █▀▄  ▀▀▄  ║",
  "║   ██ ▀▀  ▀▀▀ ▀▀▀   ▀ ▀ ▀ ▀ ██ ▀▀  ▀▀▀ ▀ ▀ ▀▀▀   ║",
  "╚═══════════════════════════════════╝",
];

export const TITLE_LOGO_COMPACT_COLORS = [
  { line: 0, start: 0, end: 38, color: '#ff3333' },
  { line: 1, start: 0, end: 52, color: '#ff3333' },
  { line: 2, start: 0, end: 52, color: '#ff3333' },
  { line: 3, start: 0, end: 52, color: '#ff3333' },
  { line: 4, start: 0, end: 38, color: '#ff3333' },
];

export default TITLE_LOGO_ART;
