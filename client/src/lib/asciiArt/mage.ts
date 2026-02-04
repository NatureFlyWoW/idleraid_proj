/**
 * Mage ASCII Art - Robed spellcaster channeling magic
 * ~35 lines tall, ~50 chars wide
 * Uses full density gradient per style guide
 */

export const MAGE_ART: string[] = [
  "                     *                           ",
  "                    ***                          ",
  "                   *****                         ",
  "                  *******                        ",
  "                   |||||                         ",
  "                ,--@@@@@--,                      ",
  "               /###@@@@@###\\                     ",
  "              |####     ####|                    ",
  "              |###  . .  ###|                    ",
  "               \\##   v   ##/                     ",
  "                \\##\\___/##/                      ",
  "            ,.~~~~~~~~~~~~~~~.,                  ",
  "           /@@&&&&&&&&&&&&&&&@@\\                 ",
  "          |@&&&%%%%%@%%%%%&&&@@|                 ",
  "         |@@&&%%%%@@@@@%%%%&&@@|                 ",
  "         |@&&&%%%@@@@@@@%%%&&&@|                 ",
  "        |@@&&&%%@@@   @@@%%&&&@@|                ",
  "  *~.   |@&&&%%@@@  |  @@@%%&&&@|   .~*          ",
  " *~~~.  |@@&&%%@@   |   @@%%&&@@|  .~~~*         ",
  "*~~~~~* |@&&%%@@    |    @@%%&&@| *~~~~~*        ",
  " *~~~*  |@@&%%@     |     @%%&@@|  *~~~*         ",
  "  *~*   |@&%%@      |      @%%&@|   *~*          ",
  "   *    |@@%@       |       @%@@|    *           ",
  "        |@%@        |        @%@|                ",
  "        |@@         |         @@|                ",
  "        |@          |          @|                ",
  "        |@          |          @|                ",
  "        |@         /|\\         @|                ",
  "        |@        //|\\\\        @|                ",
  "        |@@      ///|\\\\\\      @@|                ",
  "       /@@@@    ////|\\\\\\\\    @@@@\\               ",
  "      /@@@@@@  /////|\\\\\\\\\\  @@@@@@\\              ",
  "     /@@@@@@@dddbbbbbbbbdddd@@@@@@@\\             ",
  "    /@@@@@@dddbbqpppppqbbddd@@@@@@@@\\            ",
  "=============================================    ",
];

// Color regions: staff orb cyan, magic sparks cyan, eyes white
export const MAGE_COLORS = [
  // Magic orb at top
  { line: 0, start: 21, end: 22, color: '#00ffff' },
  { line: 1, start: 20, end: 23, color: '#00ffff' },
  { line: 2, start: 19, end: 24, color: '#00ffff' },
  { line: 3, start: 18, end: 25, color: '#00ffff' },
  // Staff
  { line: 4, start: 19, end: 24, color: '#ffff00' },
  // Eyes
  { line: 8, start: 18, end: 19, color: '#ffffff' },
  { line: 8, start: 21, end: 22, color: '#ffffff' },
  // Magic sparks left
  { line: 17, start: 2, end: 6, color: '#00ffff' },
  { line: 18, start: 1, end: 7, color: '#00ffff' },
  { line: 19, start: 0, end: 8, color: '#00ffff' },
  { line: 20, start: 1, end: 7, color: '#00ffff' },
  { line: 21, start: 2, end: 6, color: '#00ffff' },
  { line: 22, start: 3, end: 5, color: '#00ffff' },
  // Magic sparks right
  { line: 17, start: 42, end: 46, color: '#00ffff' },
  { line: 18, start: 41, end: 47, color: '#00ffff' },
  { line: 19, start: 40, end: 48, color: '#00ffff' },
  { line: 20, start: 41, end: 47, color: '#00ffff' },
  { line: 21, start: 42, end: 46, color: '#00ffff' },
  { line: 22, start: 43, end: 45, color: '#00ffff' },
];

export default MAGE_ART;
