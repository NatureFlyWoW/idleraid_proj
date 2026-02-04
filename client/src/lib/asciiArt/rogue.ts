/**
 * Rogue ASCII Art - Shadowy hooded figure with twin daggers
 * ~35 lines tall, ~50 chars wide
 * Uses full density gradient per style guide
 */

export const ROGUE_ART: string[] = [
  "                                                 ",
  "             . : ; .       . ; : .               ",
  "           :   :   :     :   :   :               ",
  "              ,--@@@@@--,                        ",
  "             /##@@@@@@@##\\                       ",
  "            |@##       ##@|                      ",
  "            |##  *   *  ##|                      ",
  "            |#    ___    #|                      ",
  "             \\##\\     /##/                       ",
  "              \\@@\\___/@@/                        ",
  "           ____/ddddddd\\____                     ",
  "      |\\  /@@@@bbbbbbbbb@@@@\\  /|                ",
  "      | \\/@@@@dbbbbbbbbd@@@@\\/ |                 ",
  "      |  \\@@@ddbbbbbbbdd@@@/   |                 ",
  "      |   \\@@dddbbbbddd@@/    |                  ",
  "      |    \\@ddddddddd@/     |                   ",
  "     /|     \\ddddddddd/      |\\                  ",
  "    / |      \\ddddddd/       | \\                 ",
  "   /  |       \\ddbdd/        |  \\                ",
  "  /   |        \\ddd/         |   \\               ",
  " /    |         \\d/          |    \\              ",
  "|     |          |           |     |             ",
  "|     |          |           |     |             ",
  "|     |          |           |     |             ",
  " \\    |          |          |    /               ",
  "  \\   |          |          |   /                ",
  "   \\  |         /|\\         |  /                 ",
  "    \\ |        / | \\        | /                  ",
  "     \\|       /  |  \\       |/                   ",
  "      |      /   |   \\      |                    ",
  "      |     /    |    \\     |                    ",
  "      |____/_____|_____\\___|                     ",
  "       .  :   .  |  .   :  .                     ",
  "      : ;   :    |    :   ; :                    ",
  "=============================================    ",
];

// Color regions: daggers white, eyes yellow, shadow wisps gray
export const ROGUE_COLORS = [
  // Shadow wisps top
  { line: 1, start: 13, end: 22, color: '#666666' },
  { line: 1, start: 28, end: 37, color: '#666666' },
  { line: 2, start: 11, end: 24, color: '#666666' },
  { line: 2, start: 26, end: 39, color: '#666666' },
  // Eyes (stars)
  { line: 6, start: 17, end: 18, color: '#ffff00' },
  { line: 6, start: 22, end: 23, color: '#ffff00' },
  // Left dagger
  { line: 11, start: 6, end: 8, color: '#ffffff' },
  { line: 12, start: 6, end: 9, color: '#ffffff' },
  { line: 13, start: 6, end: 10, color: '#ffffff' },
  { line: 14, start: 6, end: 10, color: '#ffffff' },
  { line: 15, start: 5, end: 10, color: '#ffffff' },
  { line: 16, start: 4, end: 10, color: '#ffffff' },
  { line: 17, start: 3, end: 10, color: '#ffffff' },
  { line: 18, start: 2, end: 10, color: '#ffffff' },
  { line: 19, start: 1, end: 10, color: '#ffffff' },
  { line: 20, start: 0, end: 10, color: '#ffffff' },
  // Right dagger
  { line: 11, start: 40, end: 42, color: '#ffffff' },
  { line: 12, start: 39, end: 42, color: '#ffffff' },
  { line: 13, start: 38, end: 42, color: '#ffffff' },
  { line: 14, start: 38, end: 42, color: '#ffffff' },
  { line: 15, start: 38, end: 43, color: '#ffffff' },
  { line: 16, start: 38, end: 44, color: '#ffffff' },
  { line: 17, start: 38, end: 45, color: '#ffffff' },
  { line: 18, start: 38, end: 46, color: '#ffffff' },
  { line: 19, start: 38, end: 47, color: '#ffffff' },
  { line: 20, start: 38, end: 48, color: '#ffffff' },
  // Shadow wisps bottom
  { line: 32, start: 7, end: 20, color: '#666666' },
  { line: 32, start: 26, end: 39, color: '#666666' },
  { line: 33, start: 6, end: 20, color: '#666666' },
  { line: 33, start: 26, end: 40, color: '#666666' },
];

export default ROGUE_ART;
