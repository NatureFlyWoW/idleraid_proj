/**
 * Shaman ASCII Art - Tribal elementalist with totems and lightning
 * ~35 lines tall, ~50 chars wide
 * Uses full density gradient per style guide
 */

export const SHAMAN_ART: string[] = [
  "                 \\  |  /                         ",
  "                  \\ | /                          ",
  "                   \\|/                           ",
  "                    |                            ",
  "              ,--@@@|@@@--,                      ",
  "             /##@@  |  @@##\\                     ",
  "            |###@   |   @###|                    ",
  "            |##  *  |  *  ##|                    ",
  "             \\#   \\_|_/   #/                     ",
  "              \\##\\_____/##/                      ",
  "           ____/WWWWWWWWW\\____                   ",
  "          /@@@@NWWW|||WWWN@@@@\\                  ",
  "         |@@@%NNW  |||  WNN%@@@|                 ",
  "         |@@%NNNW  |||  WNNN%@@|                 ",
  "        |   \\%%%W  |||  W%%%/   |                ",
  "        |    \\%%W  |||  W%%/    |                ",
  "    /\\  |     \\%W  \\|/  W%/     |  /\\            ",
  "   /~~\\ |      \\W   |   W/      | /~~\\           ",
  "  |****||       \\   |   /       ||****|          ",
  "  |*~~*||        \\  |  /        ||*~~*|          ",
  "  |****||         \\ | /         ||****|          ",
  "   \\~~/  \\         \\|/         /  \\~~/           ",
  "    \\/    \\         |         /    \\/            ",
  "           \\        |        /                   ",
  "            \\       |       /                    ",
  "             \\      |      /                     ",
  "              \\     |     /                      ",
  "               \\    |    /                       ",
  "                \\___|___/                        ",
  "   [_@_]        /       \\        [_@_]           ",
  "   |   |       /_________\\       |   |           ",
  "   |:-:|      |           |      |:-:|           ",
  "   |___|      |___________|      |___|           ",
  "  /TOTEM\\    /_____________\\    /TOTEM\\          ",
  "=============================================    ",
];

// Color regions: lightning cyan, fire red, totem faces yellow, eyes white
export const SHAMAN_COLORS = [
  // Lightning bolts from sky
  { line: 0, start: 17, end: 26, color: '#00ffff' },
  { line: 1, start: 18, end: 25, color: '#00ffff' },
  { line: 2, start: 19, end: 24, color: '#00ffff' },
  { line: 3, start: 20, end: 21, color: '#00ffff' },
  // Lightning continuing through hands
  { line: 4, start: 18, end: 24, color: '#00ffff' },
  { line: 5, start: 18, end: 24, color: '#00ffff' },
  { line: 6, start: 19, end: 23, color: '#00ffff' },
  { line: 7, start: 19, end: 23, color: '#00ffff' },
  { line: 11, start: 20, end: 23, color: '#00ffff' },
  { line: 12, start: 20, end: 23, color: '#00ffff' },
  { line: 13, start: 20, end: 23, color: '#00ffff' },
  { line: 14, start: 20, end: 23, color: '#00ffff' },
  { line: 15, start: 20, end: 23, color: '#00ffff' },
  { line: 16, start: 20, end: 23, color: '#00ffff' },
  // Eyes in white
  { line: 7, start: 16, end: 17, color: '#ffffff' },
  { line: 7, start: 22, end: 23, color: '#ffffff' },
  // Fire totems (left) - red
  { line: 16, start: 4, end: 8, color: '#ff0000' },
  { line: 17, start: 3, end: 9, color: '#ff0000' },
  { line: 18, start: 2, end: 10, color: '#ff0000' },
  { line: 19, start: 2, end: 10, color: '#ff0000' },
  { line: 20, start: 2, end: 10, color: '#ff0000' },
  { line: 21, start: 3, end: 9, color: '#ff0000' },
  { line: 22, start: 4, end: 8, color: '#ff0000' },
  // Fire totems (right) - red
  { line: 16, start: 41, end: 45, color: '#ff0000' },
  { line: 17, start: 40, end: 46, color: '#ff0000' },
  { line: 18, start: 39, end: 47, color: '#ff0000' },
  { line: 19, start: 39, end: 47, color: '#ff0000' },
  { line: 20, start: 39, end: 47, color: '#ff0000' },
  { line: 21, start: 40, end: 46, color: '#ff0000' },
  { line: 22, start: 41, end: 45, color: '#ff0000' },
  // Totem labels in yellow
  { line: 29, start: 3, end: 8, color: '#ffff00' },
  { line: 29, start: 41, end: 46, color: '#ffff00' },
  { line: 31, start: 3, end: 8, color: '#ffff00' },
  { line: 31, start: 41, end: 46, color: '#ffff00' },
  { line: 33, start: 2, end: 9, color: '#ffff00' },
  { line: 33, start: 40, end: 47, color: '#ffff00' },
];

export default SHAMAN_ART;
