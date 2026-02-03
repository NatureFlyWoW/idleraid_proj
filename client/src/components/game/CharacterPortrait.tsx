import { cn } from "@/lib/utils";

// ============================================================================
// CHARACTER PORTRAIT SYSTEM - Idle Raiders
// ============================================================================
// Research References:
// - ACiD/iCE ANSI art packs (90s BBS scene)
// - Dwarf Fortress, Caves of Qud, Cogmind roguelike portraits
// - Classic MUD character representations
// - Unicode block elements: ░▒▓█ ▀▄▌▐
// - Box-drawing: ╔═╗║╚╝╠╣╬┌┐└┘├┤┬┴┼
// - Shading density: " .`'^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
// ============================================================================

// Item rarity colors from shared/types/game.ts
const RARITY_COLORS = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

// WoW class colors
const CLASS_COLORS = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// Secondary/accent colors for each class
const CLASS_ACCENT_COLORS = {
  warrior: { primary: "#C79C6E", secondary: "#8B6914", armor: "#4a4a4a", weapon: "#c0c0c0" },
  paladin: { primary: "#F58CBA", secondary: "#FFD700", armor: "#c0c0c0", holy: "#FFFACD" },
  hunter: { primary: "#ABD473", secondary: "#8B4513", armor: "#654321", weapon: "#8B7355" },
  rogue: { primary: "#FFF569", secondary: "#2F4F4F", armor: "#1a1a1a", weapon: "#c0c0c0" },
  priest: { primary: "#FFFFFF", secondary: "#FFD700", cloth: "#E8E8E8", holy: "#FFFACD" },
  mage: { primary: "#69CCF0", secondary: "#9370DB", cloth: "#4169E1", arcane: "#DA70D6" },
  druid: { primary: "#FF7D0A", secondary: "#228B22", nature: "#32CD32", bark: "#8B4513" },
};

type CharacterClass = "warrior" | "mage" | "priest" | "paladin" | "hunter" | "rogue" | "druid";
type PortraitSize = "small" | "medium" | "large" | "xlarge";
type PortraitStyle = "block" | "line" | "shaded" | "detailed" | "minimal";
type PortraitState = "idle" | "combat" | "damaged" | "casting" | "victory";

interface PortraitProps {
  characterClass: CharacterClass;
  size?: PortraitSize;
  style?: PortraitStyle;
  state?: PortraitState;
  borderRarity?: keyof typeof RARITY_COLORS;
  showFrame?: boolean;
  className?: string;
}

// ============================================================================
// TECHNIQUE 1: BLOCK ELEMENT PORTRAITS (░▒▓█)
// High contrast, bold silhouettes using Unicode block characters
// ============================================================================

const WARRIOR_BLOCK_LARGE = `
          ▄▄▄▄▄▄▄▄▄▄
        ▄█▀▀▀▀▀▀▀▀▀▀█▄
       ██   ▄████▄   ██
      ██  ▐███████▌  ██
      █▌  ▐███████▌  ▐█
      █▌   ▀█████▀   ▐█
      ██     ▀▀▀     ██
       █▄  ╔═════╗  ▄█
        █▄ ║ ◆ ◆ ║ ▄█
        ▐█ ║  ▼  ║ █▌
        ▐█ ║ ╰─╯ ║ █▌
         █▄╚═════╝▄█
       ▄▄██▀▀▀▀▀▀▀██▄▄
      ██▀  ╔═════╗  ▀██
     ██   ╔╣█████╠╗   ██
    ▐█   ╔╝ █████ ╚╗   █▌
    █▌  ╔╝  █████  ╚╗  ▐█
    █▌  ║   █████   ║  ▐█
    ██  ║  ╔═════╗  ║  ██
    ▐█  ║  ║█████║  ║  █▌
    ▐█  ║  ║█████║  ║  █▌
     █▄ ║  ╚═════╝  ║ ▄█
     ▐█ ╚═══╗   ╔═══╝ █▌
      █▄    ║   ║    ▄█
      ▐█    ║   ║    █▌
       █▄  ╔╝   ╚╗  ▄█
       ▐█▄▄█     █▄▄█▌
`;

const MAGE_BLOCK_LARGE = `
            ▄▄▄▄▄▄
          ▄█▀    ▀█▄
         █▀   ✦   ▀█
        █▀    ◇    ▀█
       █▀   ╱   ╲   ▀█
      █▀  ╱       ╲  ▀█
     ██▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄██
        ▐█       █▌
       ▄██▄▄▄▄▄▄▄██▄
      ██ ║ ◈   ◈ ║ ██
      █▌ ║   ▽   ║ ▐█
      █▌ ║  ───  ║ ▐█
      ██ ╚═══════╝ ██
     ▄██▀▀▀▀▀▀▀▀▀▀▀██▄
    ██ ░░░░░░░░░░░░░ ██
   ▐█  ░░░░░░░░░░░░░  █▌
   █▌  ░░░▒▒▒▒▒▒▒░░░  ▐█
   █▌  ░░▒▒▓▓▓▓▓▒▒░░  ▐█
   █▌  ░▒▒▓▓███▓▓▒▒░  ▐█
   ██  ░▒▒▓▓▓▓▓▓▓▒▒░  ██
   ▐█  ░░▒▒▒▒▒▒▒▒▒░░  █▌
    █▄ ░░░░░░░░░░░░░ ▄█
    ▐█▄░░░░░░░░░░░░░▄█▌
     ██▀▀▀▀▀▀▀▀▀▀▀▀▀██
      ▐█▄         ▄█▌
       ██▄▄▄▄▄▄▄▄▄██
`;

const PRIEST_BLOCK_LARGE = `
            ╭───╮
           ╭┤ ✝ ├╮
          ╭┤     ├╮
         ╭┤       ├╮
         │    ☆    │
          ╲   │   ╱
           ╲  │  ╱
        ▄▄▄▄▀▀▀▀▀▄▄▄▄
       ██▀         ▀██
      ██   ╭─────╮   ██
      █▌   │ ◡ ◡ │   ▐█
      █▌   │  △  │   ▐█
      █▌   │ ╰─╯ │   ▐█
      ██   ╰──┬──╯   ██
       █▄    ╱☩╲    ▄█
      ▄█▀▀▀▀╱   ╲▀▀▀▀█▄
     ██   ╔╝     ╚╗   ██
    ▐█   ╔╝ ░░░░░ ╚╗   █▌
    █▌  ╔╝  ░░░░░  ╚╗  ▐█
    █▌  ║   ░░░░░   ║  ▐█
    █▌  ║   ░░░░░   ║  ▐█
    ██  ║   ░░░░░   ║  ██
    ▐█  ╚═══╗   ╔═══╝  █▌
     █▄     ║ ☩ ║     ▄█
     ▐█▄    ║   ║    ▄█▌
      ██▄  ╔╝   ╚╗  ▄██
       ▀█▄▄█     █▄▄█▀
`;

// ============================================================================
// TECHNIQUE 2: SHADED ASCII (Character Density Gradients)
// Uses characters of increasing "density" for shading: .:-=+*#%@
// ============================================================================

const WARRIOR_SHADED_LARGE = `
            .:::::::.
          .:+########+:.
         :*############*:
        .*##############*.
       .+#################+.
       :##################:
       +########%%########+
       *#######%@@%#######*
       *######%@@@@%######*
       +#####%@@@@@@%#####:
       :####%@@@@@@@@%####.
        *##%@@@@@@@@@@%##*
         *%@@@@@@@@@@@@%*
        .%@@@@%####%@@@@%.
       .*@@@@%*====*%@@@@*.
      .+@@@@%*=    =*%@@@@+.
      :@@@@%*=  {}  =*%@@@@:
      *@@@%*=   ()   =*%@@@*
      *@@%*=   _/\_   =*%@@*
      *@%*=   /    \   =*%@*
      +%*=   /      \   =*%+
      :*=   |        |   =*:
       .    |   ##   |    .
            |   ##   |
            |   ##   |
           /    ##    \
          /     ##     \
         |______|_______|
`;

const MAGE_SHADED_LARGE = `
              .:.
            .:*+*:.
          .:*+   +*:.
        .:*+   *   +*:.
      .:*+    .*+.   +*:.
    .:*+     .*++*.    +*:.
    *+++++++++*++*+++++++++*
          .*+    +*.
         .*++::::++*.
        .*+ :    : +*.
        *+  : @@ :  +*
        *+  :  V :  +*
        *+  : -- :  +*
        .*+ :    : +*.
      .::*++======++*::.
     *:::::::::::::::::::*
    *:  :::::::::::::::  :*
   *:   ::::.......::::   :*
   *:   ::.         .::   :*
   *:   :.    ...    .:   :*
   *:   :    :***:    :   :*
   *:   :   :*****:   :   :*
   *:   :   :*****:   :   :*
   .*:  :   .*****:   :  :*.
    .*: :    :***:    : :*.
     .* :     ...     : *.
      .*:             :*.
       .***::::::::****.
`;

// ============================================================================
// TECHNIQUE 3: LINE ART (Box-Drawing Characters)
// Clean outlines with box-drawing characters ─│┌┐└┘├┤┬┴┼
// ============================================================================

const WARRIOR_LINE_LARGE = `
           ╭─────────╮
          ╭┤ ▄▄▄▄▄▄▄ ├╮
         ╭┤ █ HELM █ ├╮
        ╭┴┴─────────┴┴╮
        │             │
        │   ┌─────┐   │
        │   │ ● ● │   │
        │   │  ▼  │   │
        │   │ ╰─╯ │   │
        │   └──┬──┘   │
       ╭┴──────┴──────┴╮
      ╭┤   ╔═══════╗   ├╮
     ╭┤    ║ PLATE ║    ├╮
    ╭┤     ║ ARMOR ║     ├╮
    │     ╔╩═══════╩╗     │
    │    ╔╝╔═══════╗╚╗    │
    │   ╔╝ ║       ║ ╚╗   │
    │  ╔╝  ║ ═══   ║  ╚╗  │
    │ ╔╝   ║       ║   ╚╗ │
    │ ║    ╚═══════╝    ║ │
    │ ║                 ║ │
    │ ╚╗               ╔╝ │
    │  ╚═══╗       ╔═══╝  │
    │      ║ ┌───┐ ║      │
    │      ║ │   │ ║      │
    │      ║ │   │ ║      │
    ╰──────╨─┴───┴─╨──────╯
`;

// ============================================================================
// TECHNIQUE 4: DETAILED MULTI-COLOR (ANSI-style with spans)
// Full color portraits with multiple layers
// ============================================================================

interface ColoredLine {
  chars: string;
  colors: string[]; // Color for each character
}

// Helper to render a colored ASCII portrait
function ColoredPortrait({ lines, className }: { lines: ColoredLine[]; className?: string }) {
  return (
    <pre className={cn("font-mono leading-none select-none", className)}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="whitespace-pre">
          {line.chars.split("").map((char, charIndex) => (
            <span key={charIndex} style={{ color: line.colors[charIndex] || "#888" }}>
              {char}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
}

// ============================================================================
// REFERENCE-BASED PORTRAITS - Recreating ref_pic/ images
// ============================================================================

// Color palette from requirements
const PORTRAIT_COLORS = {
  // Frost/Ice
  frostBright: "#00ffff",
  frostMid: "#66ffff",
  frostDark: "#0099cc",
  // Gold/Holy
  goldBright: "#ffd700",
  goldMid: "#ffaa00",
  goldDark: "#cc8800",
  // Fire/Flame
  fireBright: "#ffcc00",
  fireMid: "#ff6600",
  fireDark: "#ff3300",
  // Dark base
  darkBase: "#1a1a1a",
  darkMid: "#333333",
  // Metal
  metalLight: "#aaaaaa",
  metalMid: "#888888",
  metalDark: "#666666",
  // Copper/Brown
  copperBright: "#cc8844",
  copperMid: "#996633",
  copperDark: "#664422",
  // Leather
  leatherLight: "#8b6914",
  leatherMid: "#654321",
  leatherDark: "#3d2914",
  // Cat/Fur
  furGray: "#555566",
  furDark: "#2a2a33",
};

// Helper to create color arrays
function colorLine(text: string, colorMap: { [char: string]: string }, defaultColor: string): ColoredLine {
  const colors = text.split("").map(char => colorMap[char] || defaultColor);
  return { chars: text, colors };
}

// Helper to fill entire line with one color
function solidLine(text: string, color: string): ColoredLine {
  return { chars: text, colors: new Array(text.length).fill(color) };
}

// ============================================================================
// PORTRAIT 1: FROSTBLIGHTED ARMOR (ref_pic/frostblighted_armor_th.png)
// Dark black armor with cyan glowing runes/cracks, glowing blue eyes
// ============================================================================

const FROSTBLIGHTED_PORTRAIT: ColoredLine[] = [
  // Line 1-5: Helmet top
  solidLine("           ▄▄████████▄▄           ", PORTRAIT_COLORS.darkMid),
  solidLine("         ▄██▀▀▀▀▀▀▀▀▀▀██▄         ", PORTRAIT_COLORS.darkMid),
  { chars: "        ██▀   ▄▄▄▄▄▄   ▀██        ", colors: [
    ...Array(8).fill(PORTRAIT_COLORS.darkMid),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(6).fill(PORTRAIT_COLORS.frostDark),
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(8).fill(PORTRAIT_COLORS.darkMid),
  ]},
  { chars: "       ██  ╔═══════════╗  ██       ", colors: [
    ...Array(7).fill(PORTRAIT_COLORS.darkMid),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(11).fill(PORTRAIT_COLORS.frostBright),
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(7).fill(PORTRAIT_COLORS.darkMid),
  ]},
  { chars: "      ██  ║▀▀▀▀▀▀▀▀▀▀▀▀▀║  ██      ", colors: [
    ...Array(6).fill(PORTRAIT_COLORS.darkMid),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(2).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.frostBright,
    ...Array(13).fill(PORTRAIT_COLORS.darkBase),
    PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(6).fill(PORTRAIT_COLORS.darkMid),
  ]},
  // Line 6-10: Face/visor with glowing eyes
  { chars: "     ██   ║   ◆     ◆   ║   ██     ", colors: [
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright, // left eye
    ...Array(5).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright, // right eye
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
  ]},
  { chars: "     █▌   ║      ▼      ║   ▐█     ", colors: [
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
    ...Array(1).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.frostBright,
    ...Array(6).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostMid, // nose
    ...Array(6).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(1).fill(PORTRAIT_COLORS.darkBase),
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
  ]},
  { chars: "     █▌   ║   ╰───╯    ║   ▐█     ", colors: [
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
    ...Array(1).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(5).fill(PORTRAIT_COLORS.frostDark), // mouth area
    ...Array(4).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(1).fill(PORTRAIT_COLORS.darkBase),
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
  ]},
  { chars: "     ██   ╚═════════════╝   ██     ", colors: [
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(13).fill(PORTRAIT_COLORS.frostBright),
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
  ]},
  { chars: "      ██▄   ╲       ╱   ▄██      ", colors: [
    ...Array(6).fill(PORTRAIT_COLORS.darkMid),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.frostMid,
    ...Array(7).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostMid,
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(6).fill(PORTRAIT_COLORS.darkMid),
  ]},
  // Line 11-15: Neck and shoulders with frost runes
  { chars: "    ▄██▀▀▀▀▀═══════════▀▀▀▀▀██▄    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
    ...Array(11).fill(PORTRAIT_COLORS.frostBright),
    ...Array(5).fill(PORTRAIT_COLORS.darkMid),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "  ▄██▀ ░▒▓█▀▀▀▀▀▀▀▀▀▀▀▀▀█▓▒░ ▀██▄  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    " ", PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostMid, PORTRAIT_COLORS.frostBright,
    ...Array(17).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostMid, PORTRAIT_COLORS.frostDark, " ",
    ...Array(3).fill(PORTRAIT_COLORS.darkBase),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: " ▄█▀ ░▒▓████████████████████▓▒░ ▀█▄ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkBase), " ",
    PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostMid, PORTRAIT_COLORS.frostBright,
    ...Array(24).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostMid, PORTRAIT_COLORS.frostDark,
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkBase), " ",
  ]},
  { chars: "██ ░▓█▀─═══════════════════─▀█▓░ ██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    " ", PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    ...Array(23).fill(PORTRAIT_COLORS.frostMid),
    ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, " ",
    ...Array(2).fill(PORTRAIT_COLORS.darkBase),
  ]},
  { chars: "█▌░▓█│ ╔══════╗   ╔══════╗ │█▓░▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid), " ",
    ...Array(8).fill(PORTRAIT_COLORS.frostBright),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(8).fill(PORTRAIT_COLORS.frostBright),
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.darkBase,
  ]},
  // Line 16-22: Chest armor with frost cracks
  { chars: "█▌▓██│ ║██████║   ║██████║ │██▓▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid), " ",
    PORTRAIT_COLORS.frostBright,
    ...Array(6).fill(PORTRAIT_COLORS.darkBase),
    PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(6).fill(PORTRAIT_COLORS.darkBase),
    PORTRAIT_COLORS.frostBright,
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
  ]},
  { chars: "█▌▓██│ ║█░░░█║   ║█░░░█║ │██▓▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid), " ",
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
    ...Array(3).fill(PORTRAIT_COLORS.frostMid),
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
    ...Array(3).fill(PORTRAIT_COLORS.frostMid),
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
  ]},
  { chars: "█▌▓██│ ║█▓▓▓█║   ║█▓▓▓█║ │██▓▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid), " ",
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
    ...Array(3).fill(PORTRAIT_COLORS.frostBright),
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
    ...Array(3).fill(PORTRAIT_COLORS.frostBright),
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
  ]},
  { chars: "█▌▓██│ ╚══════╝   ╚══════╝ │██▓▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid), " ",
    ...Array(8).fill(PORTRAIT_COLORS.frostBright),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(8).fill(PORTRAIT_COLORS.frostBright),
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
  ]},
  { chars: "█▌▓██│     ║     ║     │██▓▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(PORTRAIT_COLORS.darkMid), " ",
    ...Array(5).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(5).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(5).fill(" ").map(() => "#111"),
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
  ]},
  { chars: "█▌░▓█│  ╔══╩═════╩══╗  │█▓░▐█", colors: [
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(1).fill(PORTRAIT_COLORS.darkMid), " ",
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(14).fill(PORTRAIT_COLORS.frostBright),
    ...Array(2).fill(" ").map(() => "#111"),
    " ", ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.darkBase,
  ]},
  // Line 23-28: Belt and legs
  { chars: "██░▓█│  ║████████████║  │█▓░██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.darkBase), PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(1).fill(PORTRAIT_COLORS.darkMid), " ",
    ...Array(2).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright,
    ...Array(12).fill(PORTRAIT_COLORS.darkBase),
    PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(" ").map(() => "#111"),
    " ", ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, ...Array(2).fill(PORTRAIT_COLORS.darkBase),
  ]},
  { chars: " ██░▓█  ║█░══════░█║  █▓░██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkBase), PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    ...Array(2).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkBase,
    PORTRAIT_COLORS.frostMid,
    ...Array(6).fill(PORTRAIT_COLORS.frostBright),
    PORTRAIT_COLORS.frostMid,
    PORTRAIT_COLORS.darkBase, PORTRAIT_COLORS.frostBright,
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, ...Array(2).fill(PORTRAIT_COLORS.darkBase), " ",
  ]},
  { chars: "  ██░▓█ ╚═══╗ ║ ╔═══╝ █▓░██  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase), PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(1).fill(PORTRAIT_COLORS.darkMid), " ",
    ...Array(4).fill(PORTRAIT_COLORS.frostBright),
    " ", PORTRAIT_COLORS.frostBright, " ",
    ...Array(4).fill(PORTRAIT_COLORS.frostBright),
    " ", ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: "   ██░▓█    ║ ║ ║    █▓░██   ", colors: [
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase), PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.frostBright,
    ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    ...Array(4).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.frostBright, " ", PORTRAIT_COLORS.frostBright, " ", PORTRAIT_COLORS.frostBright,
    ...Array(4).fill(" ").map(() => "#111"),
    ...Array(1).fill(PORTRAIT_COLORS.darkMid),
    PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.frostDark, ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#000"),
  ]},
  { chars: "    ██░█   ╔╝ ║ ╚╗   █░██    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase), PORTRAIT_COLORS.frostDark, PORTRAIT_COLORS.darkMid,
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.frostBright),
    " ", PORTRAIT_COLORS.frostBright, " ",
    ...Array(2).fill(PORTRAIT_COLORS.frostBright),
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.darkMid, PORTRAIT_COLORS.frostDark, ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "     ██▓█ ██   ██ █▓██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase), PORTRAIT_COLORS.frostBright, PORTRAIT_COLORS.darkMid,
    " ", ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.darkBase), " ",
    PORTRAIT_COLORS.darkMid, PORTRAIT_COLORS.frostBright, ...Array(2).fill(PORTRAIT_COLORS.darkBase),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "      ██▀▀██   ██▀▀██      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(4).fill(PORTRAIT_COLORS.darkBase),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(4).fill(PORTRAIT_COLORS.darkBase),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
];

// ============================================================================
// PORTRAIT 2: ROGUE GUILDMASTER (ref_pic/Master-Taruun-Rakutah.png)
// Cat-person rogue in scale armor with copper/brown accents
// ============================================================================

const ROGUE_GUILDMASTER_PORTRAIT: ColoredLine[] = [
  // Line 1-5: Cat ears and head
  solidLine("          ▄▄      ▄▄          ", PORTRAIT_COLORS.furGray),
  { chars: "         █▀▀█    █▀▀█         ", colors: [
    ...Array(9).fill(" ").map(() => "#000"),
    ...Array(4).fill(PORTRAIT_COLORS.furGray),
    ...Array(4).fill(" ").map(() => "#111"),
    ...Array(4).fill(PORTRAIT_COLORS.furGray),
    ...Array(9).fill(" ").map(() => "#000"),
  ]},
  { chars: "        █░░░█▄▄▄▄█░░░█        ", colors: [
    ...Array(8).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.furGray,
    ...Array(3).fill(PORTRAIT_COLORS.furDark),
    ...Array(6).fill(PORTRAIT_COLORS.furGray),
    ...Array(3).fill(PORTRAIT_COLORS.furDark),
    PORTRAIT_COLORS.furGray,
    ...Array(8).fill(" ").map(() => "#000"),
  ]},
  { chars: "       ██████████████████       ", colors: [
    ...Array(7).fill(" ").map(() => "#000"),
    ...Array(18).fill(PORTRAIT_COLORS.furGray),
    ...Array(7).fill(" ").map(() => "#000"),
  ]},
  { chars: "      ██▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀██      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(16).fill(PORTRAIT_COLORS.furDark),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
  // Line 6-10: Face with glowing eyes
  { chars: "     ██   ◈         ◈   ██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(3).fill(" ").map(() => "#1a1a1a"),
    "#ff3300", // left eye (red glow)
    ...Array(9).fill(" ").map(() => "#1a1a1a"),
    "#ff3300", // right eye
    ...Array(3).fill(" ").map(() => "#1a1a1a"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "     ██     ▄▀▀▀▄     ██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(5).fill(" ").map(() => "#1a1a1a"),
    ...Array(5).fill(PORTRAIT_COLORS.furDark), // snout
    ...Array(5).fill(" ").map(() => "#1a1a1a"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "     ██     ▀▄▀▄▀     ██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(5).fill(" ").map(() => "#1a1a1a"),
    PORTRAIT_COLORS.furDark, "#333", "#ff6699", "#333", PORTRAIT_COLORS.furDark, // nose pink
    ...Array(5).fill(" ").map(() => "#1a1a1a"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "      ██    ╰───╯    ██      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(4).fill(" ").map(() => "#1a1a1a"),
    ...Array(5).fill(PORTRAIT_COLORS.furDark),
    ...Array(4).fill(" ").map(() => "#1a1a1a"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
  { chars: "       ██▄▄▄▄▄▄▄▄▄▄▄▄██       ", colors: [
    ...Array(7).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(12).fill(PORTRAIT_COLORS.furDark),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(7).fill(" ").map(() => "#000"),
  ]},
  // Line 11-15: Neck and shoulders with scale armor
  { chars: "      ▄██▀▀▀▀▀▀▀▀▀▀▀▀██▄      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.leatherDark),
    ...Array(14).fill(PORTRAIT_COLORS.metalDark),
    ...Array(3).fill(PORTRAIT_COLORS.leatherDark),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
  { chars: "    ▄██░░░░░░░░░░░░░░░░██▄    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.leatherDark),
    ...Array(18).fill(PORTRAIT_COLORS.metalMid),
    ...Array(3).fill(PORTRAIT_COLORS.leatherDark),
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "   ██╔═══════════════════╗██   ", colors: [
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(21).fill(PORTRAIT_COLORS.copperBright),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(3).fill(" ").map(() => "#000"),
  ]},
  { chars: "  ██║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║██  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    PORTRAIT_COLORS.copperBright,
    ...Array(19).fill(PORTRAIT_COLORS.metalMid), // scale armor
    PORTRAIT_COLORS.copperBright,
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: " ██╔╣▓░▓░▓░▓░▓░▓░▓░▓░▓░▓╠╗██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(2).fill(PORTRAIT_COLORS.copperBright),
    ...[PORTRAIT_COLORS.metalLight, PORTRAIT_COLORS.metalDark].flatMap(c => [c, c, c, c, c, c, c, c, c, c]).slice(0, 19),
    ...Array(2).fill(PORTRAIT_COLORS.copperBright),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid), " ",
  ]},
  // Line 16-22: Chest armor with scale pattern
  { chars: "██║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    PORTRAIT_COLORS.copperBright, " ",
    ...Array(19).fill(PORTRAIT_COLORS.metalMid),
    " ", PORTRAIT_COLORS.copperBright,
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
  ]},
  { chars: "██║ ░▓░▓░▓░▓░▓░▓░▓░▓░▓░ ║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    PORTRAIT_COLORS.copperBright, " ",
    ...[PORTRAIT_COLORS.metalDark, PORTRAIT_COLORS.metalLight].flatMap(c => [c, c]).slice(0, 19),
    " ", PORTRAIT_COLORS.copperBright,
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
  ]},
  { chars: "██║ ▓░▓░▓░▓░▓░▓░▓░▓░▓░▓ ║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    PORTRAIT_COLORS.copperBright, " ",
    ...[PORTRAIT_COLORS.metalLight, PORTRAIT_COLORS.metalDark].flatMap(c => [c, c]).slice(0, 19),
    " ", PORTRAIT_COLORS.copperBright,
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
  ]},
  { chars: "██╚═══════════════════════╝██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(25).fill(PORTRAIT_COLORS.copperBright),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
  ]},
  { chars: " ██╔═══════╗   ╔═══════╗██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(9).fill(PORTRAIT_COLORS.copperMid),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(9).fill(PORTRAIT_COLORS.copperMid),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid), " ",
  ]},
  // Line 23-28: Belt and legs with copper accents
  { chars: "  ██║░░░░░║   ║░░░░░║██  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    PORTRAIT_COLORS.copperMid,
    ...Array(5).fill(PORTRAIT_COLORS.copperBright),
    PORTRAIT_COLORS.copperMid,
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.copperMid,
    ...Array(5).fill(PORTRAIT_COLORS.copperBright),
    PORTRAIT_COLORS.copperMid,
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: "   ██╚═══╝     ╚═══╝██   ", colors: [
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(5).fill(PORTRAIT_COLORS.copperMid),
    ...Array(5).fill(" ").map(() => "#111"),
    ...Array(5).fill(PORTRAIT_COLORS.copperMid),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(3).fill(" ").map(() => "#000"),
  ]},
  { chars: "    ██▓▓█     █▓▓██    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    PORTRAIT_COLORS.leatherDark,
    ...Array(5).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.leatherDark,
    ...Array(2).fill(PORTRAIT_COLORS.furGray),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "     ██░█     █░██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    PORTRAIT_COLORS.copperDark, PORTRAIT_COLORS.leatherDark,
    ...Array(5).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.leatherDark, PORTRAIT_COLORS.copperDark,
    ...Array(2).fill(PORTRAIT_COLORS.leatherMid),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "      ██▀     ▀██      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.leatherDark),
    " ",
    ...Array(5).fill(" ").map(() => "#111"),
    " ",
    ...Array(2).fill(PORTRAIT_COLORS.leatherDark),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
];

// ============================================================================
// PORTRAIT 3: GOLDEN PALADIN (ref_pic/maxresdefault.png)
// Female in ornate gold Tier 2 plate, horned helmet
// ============================================================================

const GOLDEN_PALADIN_PORTRAIT: ColoredLine[] = [
  // Line 1-5: Horned helmet
  { chars: "       ▄▄▄▄▄       ▄▄▄▄▄       ", colors: [
    ...Array(7).fill(" ").map(() => "#000"),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(7).fill(" ").map(() => "#000"),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(7).fill(" ").map(() => "#000"),
  ]},
  { chars: "      █▀▀▀▀█▄▄▄▄▄▄▄█▀▀▀▀█      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(6).fill(PORTRAIT_COLORS.goldBright),
    ...Array(7).fill(PORTRAIT_COLORS.goldDark),
    ...Array(6).fill(PORTRAIT_COLORS.goldBright),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
  { chars: "     █░░░░░████████████░░░░░█     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright,
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(12).fill(PORTRAIT_COLORS.goldBright),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "    █▀   ▄██▀▀▀▀▀▀▀▀██▄   ▀█    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright,
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(3).fill(PORTRAIT_COLORS.goldMid),
    ...Array(10).fill(PORTRAIT_COLORS.goldBright),
    ...Array(3).fill(PORTRAIT_COLORS.goldMid),
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "    █   ██ ╔═══════╗ ██   █    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright,
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    " ",
    ...Array(9).fill(PORTRAIT_COLORS.goldBright),
    " ",
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  // Line 6-10: Face
  { chars: "    █▌  ██ ║ ◇   ◇ ║ ██  ▐█    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright, ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
    PORTRAIT_COLORS.goldBright, " ",
    "#66ffff", // left eye (blue)
    ...Array(3).fill(" ").map(() => "#ffd5b4"), // skin
    "#66ffff", // right eye
    " ", PORTRAIT_COLORS.goldBright, " ",
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"), PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "    █▌  ██ ║   ▽   ║ ██  ▐█    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright, ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(3).fill(" ").map(() => "#ffd5b4"),
    "#ffc0cb", // nose (slight pink)
    ...Array(3).fill(" ").map(() => "#ffd5b4"),
    PORTRAIT_COLORS.goldBright, " ",
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"), PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "    █▌  ██ ║ ╰───╯ ║ ██  ▐█    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright, ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
    PORTRAIT_COLORS.goldBright, " ",
    ...Array(5).fill("#cc6666"), // lips
    " ", PORTRAIT_COLORS.goldBright, " ",
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"), PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "    █▌  ██ ╚═══════╝ ██  ▐█    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright, ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
    ...Array(9).fill(PORTRAIT_COLORS.goldBright),
    " ", ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"), PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "    █▀  ██▄         ▄██  ▀█    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    PORTRAIT_COLORS.goldBright, ...Array(2).fill(" ").map(() => "#111"),
    ...Array(3).fill(PORTRAIT_COLORS.goldMid),
    ...Array(9).fill(" ").map(() => "#ffd5b4"), // neck/skin
    ...Array(3).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"), PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  // Line 11-16: Shoulders and chest
  { chars: "   ▄█████▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█████▄   ", colors: [
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(17).fill(PORTRAIT_COLORS.goldBright),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(3).fill(" ").map(() => "#000"),
  ]},
  { chars: "  ██▓▓▓▓╔═══════════════╗▓▓▓▓██  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(4).fill(PORTRAIT_COLORS.goldBright),
    ...Array(17).fill(PORTRAIT_COLORS.goldBright),
    ...Array(4).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: " ██╔══╗ ║███████████████║ ╔══╗██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(4).fill(PORTRAIT_COLORS.goldBright), " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(15).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright, " ",
    ...Array(4).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
  ]},
  { chars: "██║██║ ║██░░░░░░░░░██║ ║██║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright, " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(9).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright, " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
  ]},
  { chars: "██║██║ ║██  ╔═══╗  ██║ ║██║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright, " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(5).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright, " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
  ]},
  { chars: "██╚══╝ ║██  ║ ✦ ║  ██║ ╚══╝██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(4).fill(PORTRAIT_COLORS.goldBright), " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.goldBright, " ",
    "#ffffff", // holy symbol
    " ", PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright, " ",
    ...Array(4).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
  ]},
  // Line 17-22: Belt and legs
  { chars: " ██    ║██  ╚═══╝  ██║    ██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(4).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(5).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(4).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
  ]},
  { chars: "  ██   ╚══════════════╝   ██  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(16).fill(PORTRAIT_COLORS.goldBright),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: "   ██  ╔══════╗  ╔══════╗  ██   ", colors: [
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(7).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(7).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(3).fill(" ").map(() => "#000"),
  ]},
  { chars: "    ██ ║██████║  ║██████║ ██    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid), " ",
    PORTRAIT_COLORS.goldBright,
    ...Array(6).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    ...Array(2).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.goldBright,
    ...Array(6).fill(PORTRAIT_COLORS.goldMid),
    PORTRAIT_COLORS.goldBright,
    " ", ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "     ██╚══════╝  ╚══════╝██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(7).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(7).fill(PORTRAIT_COLORS.goldBright),
    ...Array(2).fill(PORTRAIT_COLORS.goldMid),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "      ██▀▀▀██    ██▀▀▀██      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(4).fill(" ").map(() => "#111"),
    ...Array(5).fill(PORTRAIT_COLORS.goldMid),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
];

// ============================================================================
// PORTRAIT 4: RET PALADIN FIRE (ref_pic/title-ret-pally.png)
// Male warrior with fiery red/orange weapon, dark plate with flame accents
// ============================================================================

const RET_PALADIN_FIRE_PORTRAIT: ColoredLine[] = [
  // Line 1-5: Head with dark helm
  solidLine("            ▄▄████▄▄            ", PORTRAIT_COLORS.metalDark),
  { chars: "          ▄██▀▀▀▀▀▀██▄          ", colors: [
    ...Array(10).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.metalDark),
    ...Array(6).fill(PORTRAIT_COLORS.metalMid),
    ...Array(3).fill(PORTRAIT_COLORS.metalDark),
    ...Array(10).fill(" ").map(() => "#000"),
  ]},
  { chars: "         ██  ▄████▄  ██         ", colors: [
    ...Array(9).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(6).fill(PORTRAIT_COLORS.metalMid),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(9).fill(" ").map(() => "#000"),
  ]},
  { chars: "        ██ ╔════════╗ ██        ", colors: [
    ...Array(8).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
    ...Array(10).fill(PORTRAIT_COLORS.metalLight),
    " ", ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(8).fill(" ").map(() => "#000"),
  ]},
  { chars: "        ██ ║ ◆    ◆ ║ ██        ", colors: [
    ...Array(8).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
    PORTRAIT_COLORS.metalLight, " ",
    PORTRAIT_COLORS.fireMid, // left eye (fire glow)
    ...Array(4).fill(" ").map(() => "#ffd5b4"), // skin
    PORTRAIT_COLORS.fireMid, // right eye
    " ", PORTRAIT_COLORS.metalLight,
    " ", ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(8).fill(" ").map(() => "#000"),
  ]},
  // Line 6-10: Face and neck
  { chars: "        ██ ║   ▼    ║ ██        ", colors: [
    ...Array(8).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
    PORTRAIT_COLORS.metalLight,
    ...Array(3).fill(" ").map(() => "#ffd5b4"),
    "#d4a574", // nose shadow
    ...Array(4).fill(" ").map(() => "#ffd5b4"),
    PORTRAIT_COLORS.metalLight,
    " ", ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(8).fill(" ").map(() => "#000"),
  ]},
  { chars: "        ██ ║  ═══   ║ ██        ", colors: [
    ...Array(8).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(" ").map(() => "#ffd5b4"),
    ...Array(3).fill("#8b4513"), // beard
    ...Array(3).fill(" ").map(() => "#ffd5b4"),
    PORTRAIT_COLORS.metalLight,
    " ", ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(8).fill(" ").map(() => "#000"),
  ]},
  { chars: "        ██ ╚════════╝ ██        ", colors: [
    ...Array(8).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
    ...Array(10).fill(PORTRAIT_COLORS.metalLight),
    " ", ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(8).fill(" ").map(() => "#000"),
  ]},
  { chars: "         ██▄▄▄▄▄▄▄▄▄▄██         ", colors: [
    ...Array(9).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(10).fill(PORTRAIT_COLORS.metalMid),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(9).fill(" ").map(() => "#000"),
  ]},
  { chars: "       ▄██▀▀▀▀▀▀▀▀▀▀▀▀██▄       ", colors: [
    ...Array(7).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.metalDark),
    ...Array(12).fill(PORTRAIT_COLORS.metalMid),
    ...Array(3).fill(PORTRAIT_COLORS.metalDark),
    ...Array(7).fill(" ").map(() => "#000"),
  ]},
  // Line 11-16: Shoulders and chest with fire weapon
  { chars: "  ▄██  ██████████████████  ██▄  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(3).fill(PORTRAIT_COLORS.fireMid), // flame glow left
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(18).fill(PORTRAIT_COLORS.metalDark),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(3).fill(PORTRAIT_COLORS.fireMid), // flame glow right
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: " ██░░╔═══════════════════════╗██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.fireDark),
    ...Array(2).fill(PORTRAIT_COLORS.fireMid),
    ...Array(25).fill(PORTRAIT_COLORS.metalLight),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
  ]},
  { chars: "██░▒║██████████████████████████║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.fireDark),
    PORTRAIT_COLORS.fireMid, PORTRAIT_COLORS.fireBright,
    PORTRAIT_COLORS.metalLight,
    ...Array(26).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
  ]},
  { chars: "██▒▓║██░░░░░░░░░░░░░░░░░░░░░░██║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.fireMid),
    PORTRAIT_COLORS.fireBright, PORTRAIT_COLORS.fireBright,
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(22).fill(PORTRAIT_COLORS.copperMid), // copper/red tint armor
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
  ]},
  { chars: "██▓█║██  ╔════════════╗  ██║██", colors: [
    ...Array(2).fill(PORTRAIT_COLORS.fireBright),
    PORTRAIT_COLORS.fireBright, PORTRAIT_COLORS.goldBright,
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(14).fill(PORTRAIT_COLORS.copperBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
  ]},
  { chars: " ██░║██  ║   🔥   ║  ██║██ ", colors: [
    " ", ...Array(2).fill(PORTRAIT_COLORS.fireMid),
    PORTRAIT_COLORS.fireDark,
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(2).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.copperBright,
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(4).fill(PORTRAIT_COLORS.fireBright), // fire symbol center
    ...Array(3).fill(" ").map(() => "#111"),
    PORTRAIT_COLORS.copperBright,
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark), " ",
  ]},
  // Line 17-22: Belt and legs
  { chars: "  ██║██  ╚════════════╝  ██║██  ", colors: [
    ...Array(2).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(14).fill(PORTRAIT_COLORS.copperBright),
    ...Array(2).fill(" ").map(() => "#111"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.metalLight,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(2).fill(" ").map(() => "#000"),
  ]},
  { chars: "   ██╚═════════════════════╝██   ", colors: [
    ...Array(3).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(23).fill(PORTRAIT_COLORS.metalLight),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(3).fill(" ").map(() => "#000"),
  ]},
  { chars: "    ██╔═══════╗ ╔═══════╗██    ", colors: [
    ...Array(4).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(8).fill(PORTRAIT_COLORS.copperMid),
    " ",
    ...Array(8).fill(PORTRAIT_COLORS.copperMid),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(4).fill(" ").map(() => "#000"),
  ]},
  { chars: "     ██║█████║ ║█████║██     ", colors: [
    ...Array(5).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.copperMid,
    ...Array(5).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.copperMid, " ", PORTRAIT_COLORS.copperMid,
    ...Array(5).fill(PORTRAIT_COLORS.metalDark),
    PORTRAIT_COLORS.copperMid,
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(5).fill(" ").map(() => "#000"),
  ]},
  { chars: "      ██╚═══╝   ╚═══╝██      ", colors: [
    ...Array(6).fill(" ").map(() => "#000"),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(5).fill(PORTRAIT_COLORS.copperMid),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(5).fill(PORTRAIT_COLORS.copperMid),
    ...Array(2).fill(PORTRAIT_COLORS.metalDark),
    ...Array(6).fill(" ").map(() => "#000"),
  ]},
  { chars: "       ██▀▀██   ██▀▀██       ", colors: [
    ...Array(7).fill(" ").map(() => "#000"),
    ...Array(4).fill(PORTRAIT_COLORS.metalDark),
    ...Array(3).fill(" ").map(() => "#111"),
    ...Array(4).fill(PORTRAIT_COLORS.metalDark),
    ...Array(7).fill(" ").map(() => "#000"),
  ]},
];

// Portrait type for the reference images
type ReferencePortraitType = "frostblighted" | "rogue_guildmaster" | "golden_paladin" | "ret_paladin_fire";

// Export the reference portraits
export function ReferencePortrait({
  portraitType,
  borderRarity = "epic",
  showFrame = true,
  className,
}: {
  portraitType: ReferencePortraitType;
  borderRarity?: keyof typeof RARITY_COLORS;
  showFrame?: boolean;
  className?: string;
}) {
  const portraitData = {
    frostblighted: FROSTBLIGHTED_PORTRAIT,
    rogue_guildmaster: ROGUE_GUILDMASTER_PORTRAIT,
    golden_paladin: GOLDEN_PALADIN_PORTRAIT,
    ret_paladin_fire: RET_PALADIN_FIRE_PORTRAIT,
  };

  const content = (
    <ColoredPortrait
      lines={portraitData[portraitType]}
      className="text-[7px] sm:text-[8px] md:text-[9px]"
    />
  );

  if (showFrame) {
    return (
      <PortraitFrame rarity={borderRarity} size="large" className={className}>
        {content}
      </PortraitFrame>
    );
  }

  return content;
}

// Demo component for reference portraits
export function ReferencePortraitGallery() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-300 p-6">
      <h1 className="text-3xl font-bold text-amber-400 mb-2 font-mono">
        ═══ REFERENCE IMAGE PORTRAITS ═══
      </h1>
      <p className="text-stone-500 font-mono text-sm mb-8">
        ASCII recreations of ref_pic/ images with ANSI-256 color styling
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Frostblighted */}
        <div>
          <div className="text-stone-400 text-xs mb-2 font-mono">
            frostblighted_armor_th.png - Frost Armor Warrior
          </div>
          <ReferencePortrait portraitType="frostblighted" borderRarity="rare" />
        </div>

        {/* Rogue Guildmaster */}
        <div>
          <div className="text-stone-400 text-xs mb-2 font-mono">
            Master-Taruun-Rakutah.png - Rogue Guildmaster
          </div>
          <ReferencePortrait portraitType="rogue_guildmaster" borderRarity="epic" />
        </div>

        {/* Golden Paladin */}
        <div>
          <div className="text-stone-400 text-xs mb-2 font-mono">
            maxresdefault.png - Golden Paladin (Tier 2)
          </div>
          <ReferencePortrait portraitType="golden_paladin" borderRarity="legendary" />
        </div>

        {/* Ret Paladin Fire */}
        <div>
          <div className="text-stone-400 text-xs mb-2 font-mono">
            title-ret-pally.png - Ret Paladin with Flame
          </div>
          <ReferencePortrait portraitType="ret_paladin_fire" borderRarity="epic" />
        </div>
      </div>

      {/* Color Palette Reference */}
      <div className="mt-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── COLOR PALETTE ───</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-900/50 p-3 border border-stone-700">
            <div className="text-stone-400 text-xs mb-2">Frost/Ice</div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.frostBright }} title="#00ffff"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.frostMid }} title="#66ffff"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.frostDark }} title="#0099cc"></div>
            </div>
          </div>
          <div className="bg-stone-900/50 p-3 border border-stone-700">
            <div className="text-stone-400 text-xs mb-2">Gold/Holy</div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.goldBright }} title="#ffd700"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.goldMid }} title="#ffaa00"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.goldDark }} title="#cc8800"></div>
            </div>
          </div>
          <div className="bg-stone-900/50 p-3 border border-stone-700">
            <div className="text-stone-400 text-xs mb-2">Fire/Flame</div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.fireBright }} title="#ffcc00"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.fireMid }} title="#ff6600"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.fireDark }} title="#ff3300"></div>
            </div>
          </div>
          <div className="bg-stone-900/50 p-3 border border-stone-700">
            <div className="text-stone-400 text-xs mb-2">Metal</div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.metalLight }} title="#aaaaaa"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.metalMid }} title="#888888"></div>
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PORTRAIT_COLORS.metalDark }} title="#666666"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rarity Borders */}
      <div className="mt-8">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── RARITY BORDERS ───</h2>
        <div className="flex flex-wrap gap-4">
          {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((rarity) => (
            <div key={rarity} className="text-center">
              <div className="w-16 h-16 mb-2 border-2 rounded" style={{ borderColor: RARITY_COLORS[rarity], backgroundColor: "#0a0908" }}></div>
              <div className="text-xs font-mono capitalize" style={{ color: RARITY_COLORS[rarity] }}>{rarity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MEDIUM SIZE PORTRAITS (16x20) - For stat panel sidebars
// ============================================================================

const WARRIOR_MEDIUM = `
      ▄████▄
     ██░░░░██
    ██  ▀▀  ██
    █ ╔════╗ █
    █ ║◆  ◆║ █
    █ ║ ▼▼ ║ █
    █ ║╰──╯║ █
    ██╚════╝██
   ╔══▀▀▀▀▀▀══╗
  ╔╣██████████╠╗
  ║ ██████████ ║
  ║ █▓▓▓▓▓▓▓▓█ ║
  ║ █▓▓▓▓▓▓▓▓█ ║
  ║ █▓▓░░░░▓▓█ ║
  ╚═╣▓▓░░░░▓▓╠═╝
    ║▓▓    ▓▓║
    ║▓▓    ▓▓║
   ╔╝▓▓    ▓▓╚╗
   █▀▀      ▀▀█
`;

const MAGE_MEDIUM = `
       ▄▄▄▄
      █ ✦ █
     █  ◇  █
    █  ╱ ╲  █
   ████████████
       ██
     ╭────╮
     │◈  ◈│
     │ ▽▽ │
     │╰──╯│
     ╰─┬┬─╯
    ╭──┴┴──╮
   █░░░░░░░░█
   █░▒▒▒▒▒▒░█
   █░▒▓▓▓▓▒░█
   █░▒▓██▓▒░█
   █░▒▓▓▓▓▒░█
   █░▒▒▒▒▒▒░█
    ╰──────╯
`;

const PRIEST_MEDIUM = `
       ╭✝╮
      ╭┴─┴╮
     ╭┤ ☆ ├╮
      ╲ │ ╱
       ╲│╱
     ╭─────╮
     │ ◡◡  │
     │  △  │
     │ ╰─╯ │
     ╰──┬──╯
      ╱ ☩ ╲
    ╭╱     ╲╮
   █░░░░░░░░░█
   █░░░░░░░░░█
   █░░░░░░░░░█
   █░░░░░░░░░█
   █░░░░░░░░░█
    ╰═══════╯
      │ ☩ │
`;

// ============================================================================
// SMALL SIZE PORTRAITS (8x12) - For party frames, character select grid
// ============================================================================

const WARRIOR_SMALL = `
  ▄██▄
 █◆◆█
 █▼▼█
 ╔══╗
╔╣██╠╗
║████║
║█▓▓█║
║█▓▓█║
╚╗  ╔╝
 █  █
`;

const MAGE_SMALL = `
  ▄▄
 █✦█
████
 ╭╮
 │◈│
 │▽│
█░░█
█▒▒█
█▓▓█
╰──╯
`;

const PRIEST_SMALL = `
 ╭✝╮
 │☆│
 ╲│╱
╭───╮
│◡◡│
│──│
╱ ☩ ╲
█░░░█
█░░░█
╰───╯
`;

// ============================================================================
// XLARGE DETAILED PORTRAITS (32x40+) - For character sheet, level up
// ============================================================================

const WARRIOR_XLARGE = `
                    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                  ▄█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█▄
                ▄█▀  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  ▀█▄
               ██  ▐████████████████████▌  ██
              ██   ████████████████████████   ██
             ██   ██████████████████████████   ██
            ▐█   ████████▀▀▀▀▀▀▀▀▀▀████████   █▌
            █▌   ███████▀          ▀███████   ▐█
            █▌   ██████              ██████   ▐█
            █▌   █████    ╔══════╗    █████   ▐█
            ██   ████    ╔╝      ╚╗    ████   ██
            ▐█   ███    ╔╝ ◆    ◆ ╚╗    ███   █▌
             █▌  ██    ╔╝    ▼▼    ╚╗    ██  ▐█
             ██  █▌   ╔╝            ╚╗   ▐█  ██
              █▄ █    ║    ╰────╯    ║    █ ▄█
              ▐█ █    ╚╗            ╔╝    █ █▌
               █▄█     ╚════════════╝     █▄█
                ██▄                      ▄██
              ▄██▀▀████████████████████████▀▀██▄
            ▄██▀  ╔══════════════════════════╗  ▀██▄
          ▄██▀   ╔╝                          ╚╗   ▀██▄
         ██▀    ╔╝   ╔══════════════════╗    ╚╗    ▀██
        ██     ╔╝   ╔╝▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╚╗   ╚╗     ██
       ▐█     ╔╝   ╔╝▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╚╗   ╚╗     █▌
       █▌    ╔╝   ╔╝▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╚╗   ╚╗    ▐█
       █▌   ╔╝   ╔╝▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╚╗   ╚╗   ▐█
       █▌   ║   ╔╝▓▓▓▓▓▓▓▓░░░░░░░░▓▓▓▓▓▓▓▓▓▓╚╗   ║   ▐█
       █▌   ║  ╔╝▓▓▓▓▓▓▓░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓╚╗  ║   ▐█
       ██   ║  ║▓▓▓▓▓▓▓░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓║  ║   ██
       ▐█   ║  ║▓▓▓▓▓▓▓▓░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓║  ║   █▌
        █▄  ║  ║▓▓▓▓▓▓▓▓▓▓░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓║  ║  ▄█
        ▐█  ║  ╚═══════════════════════════════╝  ║  █▌
         █▄ ╚══╗                              ╔══╝ ▄█
         ▐█    ╚══════╗              ╔══════╝    █▌
          █▄          ║   ╔══════╗   ║          ▄█
          ▐█          ║   ║      ║   ║          █▌
           █▄         ║   ║      ║   ║         ▄█
           ▐█        ╔╝   ║      ║   ╚╗        █▌
            █▄      ╔╝    ║      ║    ╚╗      ▄█
            ▐█▄▄▄▄▄▄█     ║      ║     █▄▄▄▄▄▄█▌
`;

// ============================================================================
// ANIMATED/STATE VARIATIONS
// ============================================================================

const WARRIOR_COMBAT = `
      ▄████▄   ⚔
     ██▀▀▀▀██
    ██ ╔══╗ ██
    █▌ ║◆◆║ ▐█
    █▌ ║▼▼║ ▐█
    ██ ╚══╝ ██
   ╔══▀▀▀▀▀▀══╗
  ╔╣████████╠╗───┐
  ║ ██████████ ║ │
  ║ █▓▓▓▓▓▓▓▓█ ║─┴─⚔
  ║ █▓▓▓▓▓▓▓▓█ ║
  ║ █▓▓░░░░▓▓█ ║
  ╚═╣▓▓░░░░▓▓╠═╝
    ╱▓▓    ▓▓╲
   ╱ ▓▓    ▓▓ ╲
  ╱  ▀▀    ▀▀  ╲
`;

const WARRIOR_DAMAGED = `
      ▄████▄
     ██░░░░██  💔
    ██  ▀▀  ██
    █ ╔════╗ █
    █ ║x  x║ █
    █ ║ ~~ ║ █
    █ ║╰──╯║ █
    ██╚════╝██
   ╔══▀▀▀▀▀▀══╗
  ╔╣██▒▒▒▒▒▒██╠╗
  ║ ██▒▒░░▒▒██ ║
  ║ █▓░░░░░░▓█ ║
  ║ █▓░░╳╳░░▓█ ║
  ║ █▓░░░░░░▓█ ║
  ╚═╣▓▓░░░░▓▓╠═╝
    ║▓▓    ▓▓║
    ║▓░    ░▓║
   ╔╝░░    ░░╚╗
   █▀▀      ▀▀█
`;

const MAGE_CASTING = `
    ✦  ▄▄▄▄  ✦
   ✧  █ ✦ █  ✧
  ✦  █  ◇  █  ✦
    █  ╱ ╲  █
 ★ ████████████ ★
   ✧   ██   ✧
     ╭────╮
     │◈◈◈◈│  ✦
     │ ▽▽ │
  ✦  │╰──╯│  ✧
     ╰─┬┬─╯
    ╭──┴┴──╮
   █▒▒▒▒▒▒▒▒█ ★
  ★█▓▓▓▓▓▓▓▓█
   █▓██████▓█
   █▓██████▓█ ✦
   █▓▓▓▓▓▓▓▓█
   █▒▒▒▒▒▒▒▒█
  ✧ ╰──────╯  ✧
`;

// ============================================================================
// PORTRAIT FRAME COMPONENTS
// ============================================================================

function PortraitFrame({
  children,
  rarity = "common",
  size = "medium",
  className,
}: {
  children: React.ReactNode;
  rarity?: keyof typeof RARITY_COLORS;
  size?: PortraitSize;
  className?: string;
}) {
  const borderColor = RARITY_COLORS[rarity];
  const glowIntensity = rarity === "legendary" ? "0 0 20px" : rarity === "epic" ? "0 0 15px" : "0 0 10px";

  return (
    <div
      className={cn(
        "relative bg-[#0a0908] font-mono",
        size === "small" && "p-1",
        size === "medium" && "p-2",
        size === "large" && "p-3",
        size === "xlarge" && "p-4",
        className
      )}
      style={{
        border: `2px solid ${borderColor}`,
        boxShadow: rarity !== "common" ? `${glowIntensity} ${borderColor}40` : undefined,
      }}
    >
      {/* Corner decorations for epic+ */}
      {(rarity === "epic" || rarity === "legendary") && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor }} />
        </>
      )}

      {/* Legendary gets extra decoration */}
      {rarity === "legendary" && (
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs"
          style={{ color: borderColor }}
        >
          ✦
        </div>
      )}

      {children}
    </div>
  );
}

// ============================================================================
// MAIN PORTRAIT COMPONENT
// ============================================================================

function getPortraitArt(
  characterClass: CharacterClass,
  size: PortraitSize,
  state: PortraitState
): string {
  // Handle state variations first
  if (state === "combat" && characterClass === "warrior") return WARRIOR_COMBAT;
  if (state === "damaged" && characterClass === "warrior") return WARRIOR_DAMAGED;
  if (state === "casting" && characterClass === "mage") return MAGE_CASTING;

  // Size-based selection
  switch (size) {
    case "small":
      switch (characterClass) {
        case "warrior": return WARRIOR_SMALL;
        case "mage": return MAGE_SMALL;
        case "priest": return PRIEST_SMALL;
        default: return WARRIOR_SMALL;
      }
    case "medium":
      switch (characterClass) {
        case "warrior": return WARRIOR_MEDIUM;
        case "mage": return MAGE_MEDIUM;
        case "priest": return PRIEST_MEDIUM;
        default: return WARRIOR_MEDIUM;
      }
    case "large":
      switch (characterClass) {
        case "warrior": return WARRIOR_BLOCK_LARGE;
        case "mage": return MAGE_BLOCK_LARGE;
        case "priest": return PRIEST_BLOCK_LARGE;
        default: return WARRIOR_BLOCK_LARGE;
      }
    case "xlarge":
      return WARRIOR_XLARGE;
    default:
      return WARRIOR_MEDIUM;
  }
}

export function CharacterPortrait({
  characterClass,
  size = "medium",
  style = "block",
  state = "idle",
  borderRarity = "common",
  showFrame = true,
  className,
}: PortraitProps) {
  const art = getPortraitArt(characterClass, size, state);
  const classColor = CLASS_COLORS[characterClass];

  const textSizes = {
    small: "text-[6px]",
    medium: "text-[8px]",
    large: "text-[10px]",
    xlarge: "text-[8px]",
  };

  const content = (
    <pre
      className={cn(
        "font-mono leading-none whitespace-pre select-none",
        textSizes[size]
      )}
      style={{ color: classColor }}
    >
      {art}
    </pre>
  );

  if (showFrame) {
    return (
      <PortraitFrame rarity={borderRarity} size={size} className={className}>
        {content}
      </PortraitFrame>
    );
  }

  return content;
}

// ============================================================================
// DEMO COMPONENT - Showcases all portrait variants
// ============================================================================

export function CharacterPortraitDemo() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-300 p-6">
      <h1 className="text-3xl font-bold text-amber-400 mb-2 font-mono">
        ═══ CHARACTER PORTRAIT CONCEPTS ═══
      </h1>
      <p className="text-stone-500 font-mono text-sm mb-8">
        Multiple techniques, sizes, and states for ASCII character portraits
      </p>

      {/* Size Comparison */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── SIZE COMPARISON (Warrior) ───</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Small (8x12)</div>
            <CharacterPortrait characterClass="warrior" size="small" borderRarity="common" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Medium (16x20)</div>
            <CharacterPortrait characterClass="warrior" size="medium" borderRarity="uncommon" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Large (24x32)</div>
            <CharacterPortrait characterClass="warrior" size="large" borderRarity="rare" />
          </div>
        </div>
      </section>

      {/* Class Comparison - Medium Size */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── CLASS PORTRAITS (Medium) ───</h2>
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono" style={{ color: CLASS_COLORS.warrior }}>
              Warrior
            </div>
            <CharacterPortrait characterClass="warrior" size="medium" borderRarity="rare" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono" style={{ color: CLASS_COLORS.mage }}>
              Mage
            </div>
            <CharacterPortrait characterClass="mage" size="medium" borderRarity="epic" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono" style={{ color: CLASS_COLORS.priest }}>
              Priest
            </div>
            <CharacterPortrait characterClass="priest" size="medium" borderRarity="legendary" />
          </div>
        </div>
      </section>

      {/* Rarity Frame Comparison */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── RARITY BORDER STYLES ───</h2>
        <div className="flex flex-wrap gap-4">
          {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((rarity) => (
            <div key={rarity}>
              <div className="text-xs mb-2 font-mono capitalize" style={{ color: RARITY_COLORS[rarity] }}>
                {rarity}
              </div>
              <CharacterPortrait characterClass="warrior" size="small" borderRarity={rarity} />
            </div>
          ))}
        </div>
      </section>

      {/* State Variations */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── STATE VARIATIONS ───</h2>
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Idle</div>
            <CharacterPortrait characterClass="warrior" size="medium" state="idle" borderRarity="rare" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Combat</div>
            <CharacterPortrait characterClass="warrior" size="medium" state="combat" borderRarity="rare" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Damaged</div>
            <CharacterPortrait characterClass="warrior" size="medium" state="damaged" borderRarity="rare" />
          </div>
          <div>
            <div className="text-stone-500 text-xs mb-2 font-mono">Casting</div>
            <CharacterPortrait characterClass="mage" size="medium" state="casting" borderRarity="epic" />
          </div>
        </div>
      </section>

      {/* Large Detailed Portraits */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── LARGE DETAILED PORTRAITS ───</h2>
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-xs mb-2 font-mono" style={{ color: CLASS_COLORS.warrior }}>
              Warrior (Block Style)
            </div>
            <CharacterPortrait characterClass="warrior" size="large" borderRarity="epic" />
          </div>
          <div>
            <div className="text-xs mb-2 font-mono" style={{ color: CLASS_COLORS.mage }}>
              Mage (Block Style)
            </div>
            <CharacterPortrait characterClass="mage" size="large" borderRarity="legendary" />
          </div>
          <div>
            <div className="text-xs mb-2 font-mono" style={{ color: CLASS_COLORS.priest }}>
              Priest (Block Style)
            </div>
            <CharacterPortrait characterClass="priest" size="large" borderRarity="rare" />
          </div>
        </div>
      </section>

      {/* Alternative Techniques */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── ALTERNATIVE TECHNIQUES ───</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Shaded ASCII */}
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">
              Technique: Shaded ASCII (density: .:-=+*#%@)
            </div>
            <div className="bg-[#0a0a0a] p-3 border border-stone-700">
              <pre className="font-mono text-[8px] leading-none text-amber-600">
                {WARRIOR_SHADED_LARGE}
              </pre>
            </div>
          </div>

          {/* Line Art */}
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">
              Technique: Line Art (box-drawing)
            </div>
            <div className="bg-[#0a0a0a] p-3 border border-stone-700">
              <pre className="font-mono text-[8px] leading-none text-amber-500">
                {WARRIOR_LINE_LARGE}
              </pre>
            </div>
          </div>

          {/* Mage Shaded */}
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">
              Technique: Shaded Mage
            </div>
            <div className="bg-[#0a0a0a] p-3 border border-stone-700">
              <pre className="font-mono text-[8px] leading-none text-cyan-400">
                {MAGE_SHADED_LARGE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Large / Hero Portrait */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── HERO PORTRAIT (XL) ───</h2>
        <div className="text-stone-400 text-xs mb-2 font-mono">
          Full detail for character sheet / level up celebration
        </div>
        <div
          className="bg-[#0a0a0a] p-4 inline-block"
          style={{
            border: `3px solid ${RARITY_COLORS.legendary}`,
            boxShadow: `0 0 30px ${RARITY_COLORS.legendary}40`,
          }}
        >
          <pre className="font-mono text-[6px] leading-none" style={{ color: CLASS_COLORS.warrior }}>
            {WARRIOR_XLARGE}
          </pre>
        </div>
      </section>

      {/* Party Frame Mockup */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── PARTY FRAME MOCKUP ───</h2>
        <div className="bg-[#0a0a0a] p-4 border border-stone-700 inline-block">
          <div className="text-amber-500 font-mono text-xs mb-2">╔═══ PARTY ════════════╗</div>
          <div className="flex gap-2">
            <div className="text-center">
              <CharacterPortrait characterClass="warrior" size="small" borderRarity="rare" showFrame={true} />
              <div className="text-[8px] font-mono mt-1" style={{ color: CLASS_COLORS.warrior }}>Throg</div>
              <div className="text-[6px] font-mono text-green-500">████░░ 67%</div>
            </div>
            <div className="text-center">
              <CharacterPortrait characterClass="mage" size="small" borderRarity="epic" showFrame={true} />
              <div className="text-[8px] font-mono mt-1" style={{ color: CLASS_COLORS.mage }}>Merlin</div>
              <div className="text-[6px] font-mono text-green-500">██████ 100%</div>
            </div>
            <div className="text-center">
              <CharacterPortrait characterClass="priest" size="small" borderRarity="uncommon" showFrame={true} />
              <div className="text-[8px] font-mono mt-1" style={{ color: CLASS_COLORS.priest }}>Healy</div>
              <div className="text-[6px] font-mono text-yellow-500">███░░░ 45%</div>
            </div>
          </div>
          <div className="text-amber-500 font-mono text-xs mt-2">╚══════════════════════╝</div>
        </div>
      </section>

      {/* Technical Notes */}
      <section className="mb-8">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── TECHNICAL NOTES ───</h2>
        <div className="bg-stone-900/30 border border-stone-700 p-4 font-mono text-xs text-stone-400 space-y-2">
          <p>
            <span className="text-amber-400">Block Elements:</span> ░▒▓█ ▀▄▌▐ - Best for solid, bold silhouettes.
            Works well at any size.
          </p>
          <p>
            <span className="text-amber-400">Box-Drawing:</span> ╔═╗║╚╝╠╣╬ - Clean frames and armor details.
            Requires monospace font.
          </p>
          <p>
            <span className="text-amber-400">Shading Density:</span> " .:-=+*#%@" - Classic ASCII art gradient.
            Better for larger portraits.
          </p>
          <p>
            <span className="text-amber-400">Unicode Symbols:</span> ◆◇✦★☆⚔✝☩ - Accent details for weapons, holy symbols.
          </p>
          <p className="border-t border-stone-700 pt-2 mt-2 text-amber-300">
            <span className="text-green-400">Recommendation:</span> Use Block Elements for primary portraits.
            They scale well, render consistently, and have the strongest visual impact.
            Reserve Shading for special "hero" views only.
          </p>
        </div>
      </section>
    </div>
  );
}

export default CharacterPortrait;
