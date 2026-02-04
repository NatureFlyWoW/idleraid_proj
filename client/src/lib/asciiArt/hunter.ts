/**
 * Hunter ASCII Art - Ranger with longbow and wolf companion
 * ~35 lines tall, ~55 chars wide
 * Uses full density gradient per style guide
 */

export const HUNTER_ART: string[] = [
  "                                            /    ",
  "                                           //    ",
  "              ,--@@@--,                   ///    ",
  "             /##@@@@@##\\                 ////    ",
  "            |###     ###|               /////    ",
  "            |##  . .  ##|              //////    ",
  "             \\#   w   #/              ///////    ",
  "              \\#\\___/#/              ////////    ",
  "           ____/bbbbb\\____          /////////    ",
  "          /@@@@dbbbbbd@@@@\\        //////////    ",
  "         |@@@%ddbbbbbdd%@@@|      ///////////    ",
  "         |@@%dddbbbbbddd%@@|     ////////////    ",
  "        /  \\%%dddbbddd%%/  \\    /////////////    ",
  "       (    \\%%ddddddd%%/    ) //////////////    ",
  "       |     \\%dddddd%%/     |///////////////    ",
  "       |      \\%ddddd%/      ||||||||||||||||    ",
  "       |       \\%ddd%/       |               \\   ",
  "       |        \\%d%/        |                \\  ",
  "       |         \\%/         |                 \\ ",
  "       |          |          |     .------>     |",
  "       |          |          |                 / ",
  "       |          |          |                /  ",
  "       |         /|\\         |               /   ",
  "       |________/_|_\\_______|               /    ",
  "                                           /     ",
  "        ,---.       Wolf Companion        /      ",
  "       /@@   \\         /\\  /\\                    ",
  "      |@ . . @|       /  \\/  \\                   ",
  "      |@  w   |      |   ..   |                  ",
  "       \\@@@@@/       |   \\/   |                  ",
  "        |   |         \\  ||  /                   ",
  "        |___|          \\_||_/                    ",
  "       /     \\         /    \\                    ",
  "      /_______\\       /______\\                   ",
  "=============================================    ",
];

// Color regions: bow/arrow white, eyes yellow, wolf companion different green
export const HUNTER_COLORS = [
  // Bow (right side)
  { line: 0, start: 44, end: 48, color: '#8B4513' },
  { line: 1, start: 43, end: 48, color: '#8B4513' },
  { line: 2, start: 42, end: 48, color: '#8B4513' },
  { line: 3, start: 41, end: 48, color: '#8B4513' },
  { line: 4, start: 40, end: 48, color: '#8B4513' },
  { line: 5, start: 39, end: 48, color: '#8B4513' },
  { line: 6, start: 38, end: 48, color: '#8B4513' },
  { line: 7, start: 37, end: 48, color: '#8B4513' },
  { line: 8, start: 36, end: 48, color: '#8B4513' },
  { line: 9, start: 35, end: 48, color: '#8B4513' },
  { line: 10, start: 34, end: 48, color: '#8B4513' },
  { line: 11, start: 33, end: 48, color: '#8B4513' },
  { line: 12, start: 32, end: 48, color: '#8B4513' },
  { line: 13, start: 31, end: 48, color: '#8B4513' },
  { line: 14, start: 30, end: 48, color: '#8B4513' },
  { line: 15, start: 29, end: 48, color: '#8B4513' },
  // Arrow
  { line: 19, start: 37, end: 48, color: '#ffffff' },
  // Hunter eyes
  { line: 5, start: 17, end: 18, color: '#ffff00' },
  { line: 5, start: 20, end: 21, color: '#ffff00' },
  // Wolf companion - different shade of green
  { line: 26, start: 8, end: 18, color: '#7CFC00' },
  { line: 27, start: 6, end: 20, color: '#7CFC00' },
  { line: 28, start: 6, end: 20, color: '#7CFC00' },
  { line: 29, start: 7, end: 19, color: '#7CFC00' },
  { line: 30, start: 8, end: 18, color: '#7CFC00' },
  { line: 31, start: 8, end: 18, color: '#7CFC00' },
  { line: 32, start: 7, end: 19, color: '#7CFC00' },
  { line: 33, start: 6, end: 20, color: '#7CFC00' },
  // Wolf eyes
  { line: 27, start: 11, end: 12, color: '#ffff00' },
  { line: 27, start: 14, end: 15, color: '#ffff00' },
];

export default HUNTER_ART;
