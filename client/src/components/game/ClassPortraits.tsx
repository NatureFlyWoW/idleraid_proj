import { cn } from "@/lib/utils";

// ============================================================================
// CLASS PORTRAITS - ASCII portraits for all 7 classes
// ============================================================================

// WoW Class Colors
const CLASS_COLORS = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// Accent colors for each class
const CLASS_ACCENTS = {
  warrior: { armor: "#4a4a4a", weapon: "#c0c0c0", blood: "#8b0000" },
  paladin: { armor: "#ffd700", holy: "#fffacd", shield: "#c0c0c0" },
  hunter: { armor: "#654321", bow: "#8b7355", nature: "#228b22" },
  rogue: { armor: "#1a1a1a", dagger: "#c0c0c0", shadow: "#2f2f2f" },
  priest: { cloth: "#e8e8e8", holy: "#fffacd", shadow: "#4b0082" },
  mage: { cloth: "#4169e1", arcane: "#da70d6", fire: "#ff4500" },
  druid: { nature: "#32cd32", bark: "#8b4513", moonlight: "#87ceeb" },
};

type CharacterClass = keyof typeof CLASS_COLORS;

// ============================================================================
// ASCII PORTRAIT DATA
// ============================================================================

// Warrior - Armored plate warrior with sword
const WARRIOR_PORTRAIT = {
  lines: [
    "      ╔═══╗      ",
    "     ╔╝▓▓▓╚╗     ",
    "    ╔╝░▓▓▓░╚╗    ",
    "   ╔╝  ╔═╗  ╚╗   ",
    "   ║  ╔╣▓╠╗  ║   ",
    "   ║  ║▓▓▓║  ║   ",
    "  ╔╝  ╚═══╝  ╚╗  ",
    " ╔╝ ╔═══════╗ ╚╗ ",
    " ║ ╔╣███████╠╗ ║ ",
    " ║ ║▓███████▓║ ║ ",
    " ║ ║▓███████▓║ ║ ",
    " ║ ╚═════════╝ ║ ",
    " ║ ░░░░║░░░░ ║ ║ ",
    " ╚╗░░░░║░░░░╔╝ ║ ",
    "  ╚════╩════╝  ║ ",
    "     ║   ║    ═╣ ",
    "     ║   ║    ═╣ ",
    "    ╔╝   ╚╗     ",
    "   ╔╝     ╚╗    ",
  ],
  colorMap: {
    "▓": CLASS_COLORS.warrior,
    "█": CLASS_ACCENTS.warrior.armor,
    "░": CLASS_ACCENTS.warrior.weapon,
    "═": CLASS_ACCENTS.warrior.weapon,
    "╣": CLASS_ACCENTS.warrior.weapon,
  },
};

// Paladin - Holy knight with shield and hammer
const PALADIN_PORTRAIT = {
  lines: [
    "      ╭─✦─╮      ",
    "     ╭╯ ☀ ╰╮     ",
    "    ╭╯░░░░░╰╮    ",
    "   ╭╯  ╔═╗  ╰╮   ",
    "   │  ╔╣☼╠╗  │   ",
    "   │  ║░░░║  │   ",
    "  ╭╯  ╚═══╝  ╰╮  ",
    " ╭╯ ╔═══════╗ ╰╮ ",
    " │ ╔╣▓▓▓▓▓▓▓╠╗ │ ",
    " │ ║▓▓▓✚▓▓▓▓║ │ ",
    " │ ║▓▓▓▓▓▓▓▓║ │ ",
    " │ ╚═════════╝ │ ",
    " │ ╔══╗ │ ╔══╗ │ ",
    " ╰╮║▓▓║ │ ║▓▓║╭╯ ",
    "  ╰╚══╝─┴─╚══╝╯  ",
    "     ║   ║      ",
    "    ╔╩═══╩╗     ",
    "    ║ ╔═╗ ║     ",
    "    ╚═╝ ╚═╝     ",
  ],
  colorMap: {
    "▓": CLASS_ACCENTS.paladin.armor,
    "☀": CLASS_ACCENTS.paladin.holy,
    "☼": CLASS_ACCENTS.paladin.holy,
    "✦": CLASS_ACCENTS.paladin.holy,
    "✚": CLASS_COLORS.paladin,
    "░": CLASS_COLORS.paladin,
  },
};

// Hunter - Ranger with bow and hood
const HUNTER_PORTRAIT = {
  lines: [
    "      ╭───╮      ",
    "     ╭╯▒▒▒╰╮     ",
    "    ╭╯▒▒▒▒▒╰╮    ",
    "   ╭╯  ╭─╮  ╰╮   ",
    "   │  ╭┤░├╮  │   ",
    "   │  │░░░│  │   ",
    "  ╭╯  ╰───╯  ╰╮  ",
    " ╭╯ ╭───────╮ ╰╮ ",
    " │ ╭┤▓▓▓▓▓▓▓├╮ │ ",
    " │ │▓▓▓▓▓▓▓▓│)│ ",
    " │ │▓▓▓▓▓▓▓▓│)│ ",
    " │ ╰─────────╯)│ ",
    " │  ░░░ │ ░░░ )│ ",
    " ╰╮ ░░░ │ ░░░)╭╯ ",
    "  ╰─────┴───)─╯  ",
    "     │   │ )    ",
    "     │   │)     ",
    "    ╭╯   ╰╮     ",
    "   ╭╯     ╰╮    ",
  ],
  colorMap: {
    "▓": CLASS_ACCENTS.hunter.armor,
    "▒": CLASS_COLORS.hunter,
    "░": CLASS_ACCENTS.hunter.nature,
    ")": CLASS_ACCENTS.hunter.bow,
  },
};

// Rogue - Hooded assassin with daggers
const ROGUE_PORTRAIT = {
  lines: [
    "      ╭▓▓▓╮      ",
    "     ╭╯▓▓▓╰╮     ",
    "    ╭╯▓▓▓▓▓╰╮    ",
    "   ╭╯  ╭─╮  ╰╮   ",
    "   │  ╭┤·├╮  │   ",
    "   │  │·─·│  │   ",
    "  ╭╯  ╰───╯  ╰╮  ",
    " ╭╯ ╭───────╮ ╰╮ ",
    " │ ╭┤░░░░░░░├╮ │ ",
    "╱│ │░░░░░░░░│ │╲ ",
    "║│ │░░░░░░░░│ │║ ",
    "║│ ╰─────────╯ │║ ",
    "║│  ▒▒▒ │ ▒▒▒  │║ ",
    "╲╰╮ ▒▒▒ │ ▒▒▒ ╭╯╱ ",
    " ║╰─────┴─────╯║  ",
    " ╲    │   │   ╱  ",
    "      │   │      ",
    "     ╭╯   ╰╮     ",
    "    ╭╯     ╰╮    ",
  ],
  colorMap: {
    "▓": CLASS_ACCENTS.rogue.shadow,
    "░": CLASS_ACCENTS.rogue.armor,
    "▒": CLASS_COLORS.rogue,
    "·": CLASS_COLORS.rogue,
    "╱": CLASS_ACCENTS.rogue.dagger,
    "╲": CLASS_ACCENTS.rogue.dagger,
    "║": CLASS_ACCENTS.rogue.dagger,
  },
};

// Priest - Robed holy caster with staff
const PRIEST_PORTRAIT = {
  lines: [
    "      ╭─╮       ",
    "      │☼│       ",
    "     ╭╯─╰╮      ",
    "    ╭╯░░░╰╮     ",
    "   ╭╯  ╭─╮ ╰╮   ",
    "   │  ╭┤○├╮ │   ",
    "   │  │░░░│ │   ",
    "  ╭╯  ╰───╯ ╰╮  ",
    " ╭╯ ╭───────╮╰╮ ",
    " │ ╭┤▓▓▓▓▓▓▓├╮│ ",
    " │ │▓▓▓✚▓▓▓▓││ ",
    " │ │▓▓▓▓▓▓▓▓││ ",
    " │ ╰─────────╯│ ",
    " │ ╭─────────╮│ ",
    " ╰╮│▓▓▓▓▓▓▓▓▓│╯ ",
    "  ╰│▓▓▓▓▓▓▓▓▓│  ",
    "   │▓▓▓▓▓▓▓▓▓│  ",
    "   ╰─────────╯  ",
    "                ",
  ],
  colorMap: {
    "▓": CLASS_ACCENTS.priest.cloth,
    "☼": CLASS_ACCENTS.priest.holy,
    "✚": CLASS_ACCENTS.priest.holy,
    "○": CLASS_COLORS.priest,
    "░": CLASS_COLORS.priest,
  },
};

// Mage - Robed spellcaster with staff and arcane energy
const MAGE_PORTRAIT = {
  lines: [
    "      ╭─╮  ✦    ",
    "      │◇│ ✦ ✦   ",
    "     ╭╯─╰╮  ✦   ",
    "    ╭╯▒▒▒╰╮     ",
    "   ╭╯  ╭─╮ ╰╮   ",
    "   │  ╭┤◆├╮ │   ",
    "   │  │▒▒▒│ │   ",
    "  ╭╯  ╰───╯ ╰╮  ",
    " ╭╯ ╭───────╮╰╮ ",
    " │ ╭┤▓▓▓▓▓▓▓├╮│ ",
    " │ │▓▓▓▓▓▓▓▓││ ",
    " │ │▓▓▓▓▓▓▓▓││ ",
    " │ ╰─────────╯│ ",
    " │ ╭─────────╮│ ",
    " ╰╮│▓▓▓▓▓▓▓▓▓│╯ ",
    "  ╰│▓▓▓▓▓▓▓▓▓│  ",
    "   │▓▓▓▓▓▓▓▓▓│  ",
    "   ╰─────────╯  ",
    "                ",
  ],
  colorMap: {
    "▓": CLASS_ACCENTS.mage.cloth,
    "▒": CLASS_COLORS.mage,
    "◇": CLASS_ACCENTS.mage.arcane,
    "◆": CLASS_COLORS.mage,
    "✦": CLASS_ACCENTS.mage.arcane,
  },
};

// Druid - Nature-themed shapeshifter with antlers
const DRUID_PORTRAIT = {
  lines: [
    "   ╲╱     ╲╱    ",
    "    │╲   ╱│     ",
    "    │ ╲ ╱ │     ",
    "     ╭───╮      ",
    "    ╭╯▒▒▒╰╮     ",
    "   ╭╯  ╭─╮ ╰╮   ",
    "   │  ╭┤☘├╮ │   ",
    "   │  │▒▒▒│ │   ",
    "  ╭╯  ╰───╯ ╰╮  ",
    " ╭╯ ╭───────╮╰╮ ",
    " │ ╭┤▓▓▓▓▓▓▓├╮│ ",
    " │ │▓▓▓❀▓▓▓▓││ ",
    " │ │▓▓▓▓▓▓▓▓││ ",
    " │ ╰─────────╯│ ",
    " │ ╭─────────╮│ ",
    " ╰╮│▓▓▓▓▓▓▓▓▓│╯ ",
    "  ╰│▓▓▓▓▓▓▓▓▓│  ",
    "   │▓▓▓▓▓▓▓▓▓│  ",
    "   ╰─────────╯  ",
  ],
  colorMap: {
    "▓": CLASS_ACCENTS.druid.bark,
    "▒": CLASS_COLORS.druid,
    "☘": CLASS_ACCENTS.druid.nature,
    "❀": CLASS_ACCENTS.druid.nature,
    "╲": CLASS_ACCENTS.druid.bark,
    "╱": CLASS_ACCENTS.druid.bark,
  },
};

const CLASS_PORTRAITS: Record<CharacterClass, typeof WARRIOR_PORTRAIT> = {
  warrior: WARRIOR_PORTRAIT,
  paladin: PALADIN_PORTRAIT,
  hunter: HUNTER_PORTRAIT,
  rogue: ROGUE_PORTRAIT,
  priest: PRIEST_PORTRAIT,
  mage: MAGE_PORTRAIT,
  druid: DRUID_PORTRAIT,
};

// ============================================================================
// CLASS PORTRAIT COMPONENT
// ============================================================================

interface ClassPortraitProps {
  characterClass: CharacterClass;
  size?: "small" | "medium" | "large";
  showFrame?: boolean;
  frameColor?: string;
  className?: string;
}

export function ClassPortrait({
  characterClass,
  size = "medium",
  showFrame = true,
  frameColor,
  className,
}: ClassPortraitProps) {
  const portrait = CLASS_PORTRAITS[characterClass];
  const classColor = CLASS_COLORS[characterClass];

  if (!portrait) return null;

  const sizeClasses = {
    small: "text-[6px]",
    medium: "text-[8px]",
    large: "text-[10px]",
  };

  // Render a line with color mapping
  const renderLine = (line: string) => {
    return line.split("").map((char, i) => {
      const color = portrait.colorMap[char] || classColor;
      return (
        <span key={i} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div
      className={cn(
        "font-mono leading-none whitespace-pre",
        sizeClasses[size],
        showFrame && "p-2 border-2",
        className
      )}
      style={{
        borderColor: showFrame ? (frameColor || classColor) : undefined,
        backgroundColor: showFrame ? "rgba(0,0,0,0.5)" : undefined,
      }}
    >
      {portrait.lines.map((line, i) => (
        <div key={i}>{renderLine(line)}</div>
      ))}
    </div>
  );
}

// ============================================================================
// MINI CLASS ICON (for lists/headers)
// ============================================================================

const MINI_CLASS_ICONS: Record<CharacterClass, string[]> = {
  warrior: [
    "╔═╗",
    "║▓║",
    "╚═╝",
  ],
  paladin: [
    "╭✦╮",
    "│☼│",
    "╰─╯",
  ],
  hunter: [
    "╭─╮",
    "│◎│",
    "╰)╯",
  ],
  rogue: [
    "╭▓╮",
    "│·│",
    "╱ ╲",
  ],
  priest: [
    "╭✚╮",
    "│○│",
    "╰─╯",
  ],
  mage: [
    "╭◇╮",
    "│✦│",
    "╰─╯",
  ],
  druid: [
    "╲ ╱",
    "│☘│",
    "╰─╯",
  ],
};

export function MiniClassIcon({
  characterClass,
  className,
}: {
  characterClass: CharacterClass;
  className?: string;
}) {
  const icon = MINI_CLASS_ICONS[characterClass];
  const color = CLASS_COLORS[characterClass];

  return (
    <pre
      className={cn("font-mono text-[8px] leading-none", className)}
      style={{ color }}
    >
      {icon.join("\n")}
    </pre>
  );
}

// ============================================================================
// CLASS BADGE (text-based)
// ============================================================================

export function ClassBadge({
  characterClass,
  className,
}: {
  characterClass: CharacterClass;
  className?: string;
}) {
  const color = CLASS_COLORS[characterClass];

  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-mono border capitalize",
        className
      )}
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}20`,
      }}
    >
      {characterClass}
    </span>
  );
}

// ============================================================================
// PORTRAIT GALLERY
// ============================================================================

export function ClassPortraitGallery() {
  const classes: CharacterClass[] = [
    "warrior",
    "paladin",
    "hunter",
    "rogue",
    "priest",
    "mage",
    "druid",
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-amber-400 font-mono text-lg">Class Portraits</h2>

      {/* Large portraits */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {classes.map((cls) => (
          <div key={cls} className="text-center">
            <ClassPortrait characterClass={cls} size="medium" />
            <div
              className="mt-2 text-xs font-mono capitalize"
              style={{ color: CLASS_COLORS[cls] }}
            >
              {cls}
            </div>
          </div>
        ))}
      </div>

      {/* Mini icons */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Mini Icons</h3>
        <div className="flex gap-4 flex-wrap">
          {classes.map((cls) => (
            <div key={cls} className="text-center">
              <MiniClassIcon characterClass={cls} />
              <div
                className="mt-1 text-[8px] font-mono capitalize"
                style={{ color: CLASS_COLORS[cls] }}
              >
                {cls}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Class Badges</h3>
        <div className="flex gap-2 flex-wrap">
          {classes.map((cls) => (
            <ClassBadge key={cls} characterClass={cls} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassPortrait;
