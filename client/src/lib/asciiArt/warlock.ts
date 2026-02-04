/**
 * Warlock ASCII Art - Dark robed caster with grimoire and hellfire
 * ~35 lines tall, ~50 chars wide
 * Uses full density gradient per style guide
 */

export const WARLOCK_ART: string[] = [
  "                                                 ",
  "    .  *  .           |||           .  *  .      ",
  "      * .  *          |||          *  . *        ",
  "   .    *   .      ,-@@@@@-,      .   *    .     ",
  "              .   /#@@###@@#\\   .                ",
  "             .   |##@@ @@##@|   .                ",
  "            .    |#@  *  @#@|    .               ",
  "           .      \\#  Y  #/      .               ",
  "          .        \\#####/        .              ",
  "         .     ____/@@@@@\\____     .             ",
  "        .     /&&&&@@###@@&&&&\\     .            ",
  "       .     |&&&%%@#####@%%&&&|     .           ",
  "      .     |&&%%%@@@###@@@%%%&&|     .          ",
  "     .      |&%%%@@@@ | @@@@%%%&|      .         ",
  "    . ~*~   |%%%@@@   |   @@@%%%|   ~*~  .       ",
  "   *~~~~~*  |%%@@@    |    @@@%%|  *~~~~~*       ",
  "  *~~~~~~~* |%@@@  ,--|--,  @@@%| *~~~~~~~*      ",
  "   *~~~~~*  |@@@  /######\\  @@@|  *~~~~~*        ",
  "    . ~*~   |@@  |########|  @@|   ~*~ .         ",
  "     .      |@   |##~~~~##|   @|      .          ",
  "      .     |    |##~||~##|    |     .           ",
  "       .    |    |##~~~~##|    |    .            ",
  "        .   |    |########|    |   .             ",
  "         .  |     \\######/     |  .              ",
  "          . |      '----'      | .               ",
  "            |        ||        |                 ",
  "            |        ||        |                 ",
  "            |       /||\\       |                 ",
  "            |      //||\\\\      |                 ",
  "            |_____///||\\\\\\_____|                 ",
  "           /     ////||\\\\\\\\     \\                ",
  "          /ddddd/////||\\\\\\\\\\ddddd\\               ",
  "         /bbbbbbbbbb/||\\bbbbbbbbbb\\              ",
  "        /qqqqqqqqqq/ || \\qqqqqqqqqq\\             ",
  "=============================================    ",
];

// Color regions: hellfire green, demon runes red, grimoire yellow, eyes green
export const WARLOCK_COLORS = [
  // Floating runes (stars) in red
  { line: 1, start: 4, end: 10, color: '#ff0000' },
  { line: 1, start: 39, end: 46, color: '#ff0000' },
  { line: 2, start: 6, end: 12, color: '#ff0000' },
  { line: 2, start: 37, end: 44, color: '#ff0000' },
  { line: 3, start: 3, end: 14, color: '#ff0000' },
  { line: 3, start: 35, end: 46, color: '#ff0000' },
  // Eyes in green
  { line: 6, start: 17, end: 18, color: '#00ff00' },
  { line: 6, start: 21, end: 22, color: '#00ff00' },
  // Hellfire (left side)
  { line: 14, start: 4, end: 10, color: '#00ff00' },
  { line: 15, start: 3, end: 11, color: '#00ff00' },
  { line: 16, start: 2, end: 12, color: '#00ff00' },
  { line: 17, start: 3, end: 11, color: '#00ff00' },
  { line: 18, start: 4, end: 10, color: '#00ff00' },
  // Hellfire (right side)
  { line: 14, start: 39, end: 45, color: '#00ff00' },
  { line: 15, start: 38, end: 46, color: '#00ff00' },
  { line: 16, start: 37, end: 47, color: '#00ff00' },
  { line: 17, start: 38, end: 46, color: '#00ff00' },
  { line: 18, start: 39, end: 45, color: '#00ff00' },
  // Grimoire (yellow)
  { line: 16, start: 18, end: 31, color: '#ffff00' },
  { line: 17, start: 17, end: 32, color: '#ffff00' },
  { line: 18, start: 16, end: 33, color: '#ffff00' },
  { line: 19, start: 15, end: 34, color: '#ffff00' },
  { line: 20, start: 15, end: 34, color: '#ffff00' },
  { line: 21, start: 15, end: 34, color: '#ffff00' },
  { line: 22, start: 15, end: 34, color: '#ffff00' },
  { line: 23, start: 16, end: 33, color: '#ffff00' },
  { line: 24, start: 17, end: 32, color: '#ffff00' },
];

export default WARLOCK_ART;
