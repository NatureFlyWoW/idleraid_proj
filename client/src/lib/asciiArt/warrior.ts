/**
 * Warrior ASCII Art - Heavily armored battle warrior
 * ~35 lines tall, ~50 chars wide
 * Uses full density gradient per style guide
 */

export const WARRIOR_ART: string[] = [
  "                    ,/|                          ",
  "                   //||                          ",
  "                  ///|||                         ",
  "                 ////||||                        ",
  "                /////|||||                       ",
  "               ////// ||||||                     ",
  "              ///////  |||||||                   ",
  "             ////////   ||||||||                 ",
  "            /////////    |||||||||               ",
  "               |||          |||                  ",
  "            ,--@@@--,                            ",
  "           /##|===|##\\                           ",
  "          |###|   |###|                          ",
  "          |#@@\\---/@@@|                          ",
  "           \\##|   |##/                           ",
  "            \\@|___|@/                            ",
  "          ___/MMMMM\\___                          ",
  "         /@@@WWWWWWW@@@\\                         ",
  "        |@@%NWWWWWWWN%@@|                        ",
  "        |@%NNWWWWWWWNN%@|                        ",
  "    |\\  |%%NNWWWWWWWNN%%|  /|                    ",
  "    ||\\|%%%%WWWWWWWWW%%%%|/||                    ",
  "    |||@@@%%%NNNNNNN%%%@@@|||                    ",
  "    |||@@@@%%%%MMM%%%%@@@@|||                    ",
  "    |||@@@@@%%%|||%%%@@@@@|||                    ",
  "    ||| @@@@@@%|||%@@@@@@ |||                    ",
  "    |||  @@@@@||||@@@@@@  |||                    ",
  "    |||   @@@@||||@@@@    |||                    ",
  "    |||    @@@|  |@@@     |||                    ",
  "    |||    @@@|  |@@@     |||                    ",
  "    |||   @@@@|  |@@@@    |||                    ",
  "   /|||  @@@@@|  |@@@@@   |||\\                   ",
  "  //||| @@@@@@|  |@@@@@@  |||\\\\                  ",
  " ///|||@@@@@@/    \\@@@@@@|||||\\\\                 ",
  "====================================             ",
];

// Color regions: sword blade white, visor slit red
export const WARRIOR_COLORS = [
  // Sword blade (lines 0-9) in white
  { line: 0, start: 20, end: 22, color: '#ffffff' },
  { line: 1, start: 19, end: 23, color: '#ffffff' },
  { line: 2, start: 18, end: 24, color: '#ffffff' },
  { line: 3, start: 17, end: 25, color: '#ffffff' },
  { line: 4, start: 16, end: 26, color: '#ffffff' },
  { line: 5, start: 15, end: 27, color: '#ffffff' },
  { line: 6, start: 14, end: 28, color: '#ffffff' },
  { line: 7, start: 13, end: 29, color: '#ffffff' },
  { line: 8, start: 12, end: 30, color: '#ffffff' },
  { line: 9, start: 15, end: 26, color: '#ffffff' },
  // Visor eyes in red
  { line: 13, start: 12, end: 14, color: '#ff0000' },
  { line: 13, start: 20, end: 22, color: '#ff0000' },
];

export default WARRIOR_ART;
