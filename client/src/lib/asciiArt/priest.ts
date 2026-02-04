/**
 * Priest ASCII Art - Holy figure radiating divine light
 * ~35 lines tall, ~50 chars wide
 * Uses full density gradient per style guide
 */

export const PRIEST_ART: string[] = [
  "                    |||                          ",
  "                  --+|+--                        ",
  "                    |||                          ",
  "               . ' .|||. ' .                     ",
  "            .  '  ' ||| '  '  .                  ",
  "          .   '   ' ||| '   '   .                ",
  "        .    '    ' ||| '    '    .              ",
  "              ,--@@@@@--,                        ",
  "             /##@@@@@@@##\\                       ",
  "            |###   .   ###|                      ",
  "            |##  . | .  ##|                      ",
  "             \\#   \\=/   #/                       ",
  "              \\#\\_____/#/                        ",
  "           ____/WWWWWWW\\____                     ",
  "          /@@@@NWWWWWWWN@@@@\\                    ",
  "         |@@@%NNWWWWWWWNN%@@@|                   ",
  "         |@@%NNNWWWWWWWNNN%@@|                   ",
  "        /   \\%%%%WWWWW%%%%/   \\                  ",
  "       /  .  \\%%%NNNNN%%%/  .  \\                 ",
  "      /   .   \\%%MMMMM%%/   .   \\                ",
  "     |    .    \\%@@@@@%/    .    |               ",
  "     |    .     \\@@@@@/     .    |               ",
  "     |   . .     \\@@@/     . .   |               ",
  "     |   . .      \\@/      . .   |               ",
  "     |  .   .      |      .   .  |               ",
  "     |  .   .      |      .   .  |               ",
  "     | .     .     |     .     . |               ",
  "     |.       .    |    .       .|               ",
  "     |         .   |   .         |               ",
  "    /|          .  |  .          |\\              ",
  "   //|           . | .           |\\\\             ",
  "  ///|            .|.            |\\\\\\            ",
  " ////|             |             |\\\\\\\\           ",
  "/////|_____________|_____________|\\\\\\\\\\          ",
  "=============================================    ",
];

// Color regions: holy symbol yellow, light rays yellow, eyes white
export const PRIEST_COLORS = [
  // Holy cross symbol
  { line: 0, start: 20, end: 23, color: '#ffff00' },
  { line: 1, start: 18, end: 25, color: '#ffff00' },
  { line: 2, start: 20, end: 23, color: '#ffff00' },
  // Light rays
  { line: 3, start: 15, end: 30, color: '#ffff00' },
  { line: 4, start: 12, end: 33, color: '#ffff00' },
  { line: 5, start: 10, end: 35, color: '#ffff00' },
  { line: 6, start: 8, end: 37, color: '#ffff00' },
  // Eyes
  { line: 10, start: 18, end: 19, color: '#ffffff' },
  { line: 10, start: 22, end: 23, color: '#ffffff' },
  // Aura dots (light particles)
  { line: 17, start: 7, end: 10, color: '#ffffaa' },
  { line: 17, start: 35, end: 38, color: '#ffffaa' },
  { line: 18, start: 6, end: 10, color: '#ffffaa' },
  { line: 18, start: 35, end: 39, color: '#ffffaa' },
  { line: 19, start: 5, end: 10, color: '#ffffaa' },
  { line: 19, start: 35, end: 40, color: '#ffffaa' },
];

export default PRIEST_ART;
