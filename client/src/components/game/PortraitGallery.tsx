import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReferencePortrait } from "./CharacterPortrait";

// ============================================================================
// ADVANCED PORTRAIT GALLERY - Intensive Concept Exploration
// ============================================================================
// This file contains advanced ASCII art concepts with:
// - Multi-color layered portraits
// - ANSI-style gradients
// - Detailed armor/weapon rendering
// - Multiple artistic interpretations per class
// ============================================================================

const RARITY_COLORS = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

const CLASS_COLORS = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// Extended palette for detailed portraits
const PALETTE = {
  // Metals
  steel: "#71797E",
  iron: "#48494B",
  gold: "#FFD700",
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  // Fabrics
  cloth_white: "#F5F5F5",
  cloth_blue: "#4169E1",
  cloth_purple: "#9370DB",
  leather_brown: "#8B4513",
  leather_dark: "#3D2914",
  // Effects
  holy_glow: "#FFFACD",
  arcane_purple: "#DA70D6",
  fire_orange: "#FF4500",
  shadow_purple: "#4B0082",
  nature_green: "#32CD32",
  frost_blue: "#87CEEB",
  // Skin/Features
  skin_light: "#FDBCB4",
  skin_tan: "#D2691E",
  eyes_glow: "#00FF00",
  blood_red: "#8B0000",
};

// ============================================================================
// WARRIOR PORTRAITS - Multiple Concepts
// ============================================================================

// Concept 1: Arms Warrior with Two-Handed Sword
const WARRIOR_ARMS_DETAILED = {
  name: "Arms Warrior",
  description: "Two-handed sword specialist, heavy plate armor",
  art: `
                          ▄▄▄████▄▄▄
                        ▄██▀▀▀▀▀▀▀▀██▄
                      ▄██▀  ▄████▄  ▀██▄
                     ███  ▄██▀▀▀▀██▄  ███
                    ███  ███ ▄▄▄▄ ███  ███
                    ██▌  ███ ████ ███  ▐██
                    ██▌  ▀██▄▄▄▄██▀   ▐██
                    ███    ▀▀▀▀▀▀     ███
                     ██▄  ╔══════╗   ▄██
              ┌──────▀██▄ ║ ●  ● ║ ▄██▀──────┐
              │        ██ ║   ▼  ║ ██        │
              │        ▐█ ║ ╰──╯ ║ █▌        │
              │         █▄╚══════╝▄█         │
            ╔═╧═╗     ▄████▀▀▀▀▀▀████▄     ╔═╧═╗
            ║ ▓ ║   ▄██▀ ╔══════╗ ▀██▄   ║ ▓ ║
            ║ ▓ ║  ██▀  ╔╣██████╠╗  ▀██  ║ ▓ ║
            ║ ▓ ║ ██   ╔╝████████╚╗   ██ ║ ▓ ║
            ║ ▓ ║ █▌  ╔╝██████████╚╗  ▐█ ║ ▓ ║
            ║ ▓ ║ █▌  ║████████████║  ▐█ ║ ▓ ║
            ║ ▓ ║ █▌  ║███▓▓▓▓▓▓███║  ▐█ ║ ▓ ║
            ║ ▓ ║ ██  ║███▓░░░░▓███║  ██ ║ ▓ ║
            ║ ▓ ║ ▐█  ║███▓░░░░▓███║  █▌ ║ ▓ ║
            ║ ▓ ║  █▄ ╚════════════╝ ▄█  ║ ▓ ║
            ║ ▓ ║  ▐█▄    ║  ║    ▄█▌  ║ ▓ ║
            ╚═╤═╝   ██▄   ║  ║   ▄██   ╚═╤═╝
              │     ▐██   ║  ║   ██▌     │
              │      ██  ╔╝  ╚╗  ██      │
              │      ▐█▄▄█    █▄▄█▌      │
              └──────────────────────────┘
  `,
  colors: {
    helmet: PALETTE.steel,
    armor: PALETTE.iron,
    trim: PALETTE.gold,
    skin: PALETTE.skin_light,
    weapon: PALETTE.steel,
  },
};

// Concept 2: Protection Warrior with Shield
const WARRIOR_PROT_DETAILED = {
  name: "Protection Warrior",
  description: "Shield and sword, defensive stance",
  art: `
                       ▄▄▄████▄▄▄
                     ▄██▀▀▀▀▀▀▀▀██▄
                   ▄██  ▄██████▄  ██▄
                  ██▌  ████▀▀████  ▐██
                  ██  ████ ▄▄ ████  ██
                  ██  ▀███▄▄▄███▀   ██
                  ▐█▄   ▀▀████▀▀   ▄█▌
                   ██▄  ╔══════╗  ▄██
                    ██  ║ ●  ● ║  ██
                    ▐█  ║   ▼  ║  █▌
                    ▐█  ║ ╰──╯ ║  █▌
                     █▄ ╚══════╝ ▄█
    ╔═══════════╗  ▄████▀▀▀▀▀▀████▄  ┌─────┐
    ║███████████║▄██ ╔════════╗ ██▄ │█████│
    ║███████████████╔╣████████╠╗████│█████│
    ║██▓▓▓▓▓▓▓██████╝██████████╚████│█▓▓▓█│
    ║██▓▓███▓▓███████████████████████│█▓▓▓█│
    ║██▓▓▓▓▓▓▓███████▓▓▓▓▓▓▓▓███████│█▓▓▓█│
    ║██▓░░░░░▓███████▓░░░░░░▓███████│█░░░█│
    ║██▓░░░░░▓███████▓░░░░░░▓███████│█░░░█│
    ║██▓▓▓▓▓▓▓██████╔════════╗██████│█▓▓▓█│
    ║███████████████║        ║██████│█████│
    ╚═══════════╝▐██║        ║██▌  └─────┘
                  ██ ╚═══╗╔═══╝ ██
                  ▐█    ║║║║    █▌
                   █▄  ╔╝║║╚╗  ▄█
                   ▐█▄▄█ ║║ █▄▄█▌
                        ╚╝╚╝
  `,
};

// Concept 3: Fury Warrior - Dual Wielding
const WARRIOR_FURY_DETAILED = {
  name: "Fury Warrior",
  description: "Dual-wielding berserker in blood rage",
  art: `
                        ▄▄▄████▄▄▄
                      ▄██▀▀░░░░▀▀██▄
                    ▄██░░▄████▄░░░██▄
                   ██░░▄██▀▀▀▀██▄░░██
                  ██░░███ ▓▓▓▓ ███░░██
                  █▌░░███ ████ ███░░▐█
                  █▌░░▀██▄▄▄▄██▀░░░▐█
                  ██░░░░▀▀▀▀▀▀░░░░░██
                   █▄░░╔══════╗░░░▄█
        ┌────────┐ ▐█░░║ ◆  ◆ ║░░█▌ ┌────────┐
        │▓▓▓▓▓▓▓▓│  █░░║   ▼  ║░░█  │▓▓▓▓▓▓▓▓│
        │▓▓▓▓▓▓▓▓│  █░░║ ≈≈≈≈ ║░░█  │▓▓▓▓▓▓▓▓│
        │▓▓░░░░▓▓│  █▄░╚══════╝░▄█  │▓▓░░░░▓▓│
        │▓░░░░░░▓│▄████▀░░░░░░▀████▄│▓░░░░░░▓│
        │░░░░░░░░███░╔════════╗░░███│░░░░░░░░│
        │▓░░░░░░▓██░╔╣████████╠╗░██│▓░░░░░░▓│
        │▓▓░░░░▓▓█░╔╝██▓▓▓▓▓▓██╚╗░█│▓▓░░░░▓▓│
        │▓▓▓▓▓▓▓▓█░║███▓░░░░▓███║░█│▓▓▓▓▓▓▓▓│
        │▓▓▓▓▓▓▓▓█░║███▓░░░░▓███║░█│▓▓▓▓▓▓▓▓│
        └────────┘ █░╚════════════╝░█ └────────┘
                   ▐█░░░║░░░░║░░░█▌
                    █▄░░║░░░░║░░▄█
                    ▐█░╔╝░░░░╚╗░█▌
                     █▄█░░░░░░█▄█
                       ▀▀░░░░▀▀
  `,
};

// ============================================================================
// MAGE PORTRAITS - Multiple Concepts
// ============================================================================

// Concept 1: Frost Mage
const MAGE_FROST_DETAILED = {
  name: "Frost Mage",
  description: "Master of ice and cold, conjured blizzards",
  art: `
                ❄        ❄        ❄
                  ❄    ▄▄▄▄    ❄
               ❄    ▄█▀    ▀█▄    ❄
                  ▄█▀   ❄   ▀█▄
                 █▀    ╱ ╲    ▀█
            ❄   █    ╱   ╲    █   ❄
               █▄  ╱  ❄  ╲  ▄█
            ████████████████████████
                     ██
                   ╭────╮
              ❄    │◈  ◈│    ❄
                   │ ❄❄ │
                   │╰──╯│
                   ╰─┬┬─╯
                  ╭──┴┴──╮
            ❄   █░░░░░░░░░░█   ❄
               █░▒▒▒▒▒▒▒▒▒▒░█
              █░▒▓▓▓▓▓▓▓▓▓▓▒░█
              █░▒▓████████▓▒░█
         ❄    █░▒▓██❄❄❄❄██▓▒░█    ❄
              █░▒▓████████▓▒░█
              █░▒▓▓▓▓▓▓▓▓▓▓▒░█
               █░▒▒▒▒▒▒▒▒▒▒░█
            ❄   ╰──────────╯   ❄
                   │    │
                  ╱      ╲
                ❄          ❄
  `,
  colors: {
    hat: PALETTE.cloth_blue,
    skin: PALETTE.skin_light,
    robe: PALETTE.frost_blue,
    magic: "#ADD8E6",
  },
};

// Concept 2: Fire Mage
const MAGE_FIRE_DETAILED = {
  name: "Fire Mage",
  description: "Pyromaniac destruction specialist",
  art: `
              🔥    🔥    🔥
                  ▄▄▄▄
              🔥 █ 🔥 █ 🔥
                █  ◇  █
               █  ╱ ╲  █
              █  ╱ 🔥 ╲  █
             ████████████████
              🔥   ██   🔥
                 ╭────╮
                 │◈🔥◈│
                 │ ▽▽ │
                 │╰──╯│
                 ╰─┬┬─╯
              🔥╭──┴┴──╮🔥
               █▓▓▓▓▓▓▓▓█
              █▓██████████▓█
              █▓█🔥🔥🔥🔥🔥█▓█
           🔥 █▓█▓▓▓▓▓▓▓▓█▓█ 🔥
              █▓█🔥🔥🔥🔥🔥█▓█
              █▓██████████▓█
               █▓▓▓▓▓▓▓▓█
            🔥  ╰──────╯  🔥
                 │ 🔥 │
                ╱      ╲
              🔥          🔥
  `,
};

// Concept 3: Arcane Mage
const MAGE_ARCANE_DETAILED = {
  name: "Arcane Mage",
  description: "Pure magical energy manipulation",
  art: `
               ✧ ✦ ★ ✦ ✧
                  ▄▄▄▄
             ✧  █ ★ █  ✧
               █  ◇  █
              █  ╱ ╲  █
             █  ╱ ✦ ╲  █
        ★ ████████████████ ★
          ✧    ██    ✧
               ╭────╮
               │◈✧◈│
          ✦    │ ▽▽ │    ✦
               │╰──╯│
               ╰─┬┬─╯
            ╭───┴┴───╮
        ✧  █▒▒▒▒▒▒▒▒▒▒█  ✧
          █▒▓▓▓▓▓▓▓▓▓▓▒█
          █▒▓★✧★✧★✧★✧▓▒█
      ★   █▒▓▓▓▓▓▓▓▓▓▓▓▒█   ★
          █▒▓✧★✧★✧★✧★▓▒█
          █▒▓▓▓▓▓▓▓▓▓▓▓▒█
        ✧  █▒▒▒▒▒▒▒▒▒▒█  ✧
            ╰────────╯
              │ ✦ │
             ╱      ╲
           ✧    ★    ✧
  `,
};

// ============================================================================
// PRIEST PORTRAITS - Multiple Concepts
// ============================================================================

// Concept 1: Holy Priest
const PRIEST_HOLY_DETAILED = {
  name: "Holy Priest",
  description: "Divine healer radiating holy light",
  art: `
                    ╭───╮
                   ╭┤ ✝ ├╮
                  ╭┤  │  ├╮
                 ╭┤   │   ├╮
                 │  ★ │ ★  │
                  ╲ ──┴── ╱
                   ╲     ╱
              ════════════════
                    │ │
                  ╭─┴─┴─╮
                 ╭┤     ├╮
             ★   │ ◡ ◡ │   ★
                 │  △  │
                 │ ╰─╯ │
                 ╰──┬──╯
                  ╱ ☩ ╲
           ★   ╭╱     ╲╮   ★
              █░░░░░░░░░░█
             █░░░░░░░░░░░░█
            █░░░▒▒▒▒▒▒▒░░░█
        ★  █░░░▒▓▓▓▓▓▓▒░░░█  ★
           █░░░▒▓ ☩☩ ▓▒░░░█
           █░░░▒▓▓▓▓▓▓▒░░░█
            █░░░▒▒▒▒▒▒▒░░░█
         ★   █░░░░░░░░░░█   ★
              ╰═════════╯
                 │ ☩ │
                ╱     ╲
              ★         ★
  `,
};

// Concept 2: Shadow Priest
const PRIEST_SHADOW_DETAILED = {
  name: "Shadow Priest",
  description: "Dark void magic, mind assault specialist",
  art: `
                ░░░░░░░░░░░░
               ░▒▓█████████▓▒░
              ░▒▓█▀▀▀▀▀▀▀▀▀█▓▒░
             ░▒▓█           █▓▒░
             ░▒▓█   ◈   ◈   █▓▒░
              ░▒█           █▒░
               ░█   ╭───╮   █░
                █   │ ◈ │   █
                █   │▓▓▓│   █
                █   │▓▓▓│   █
                █   ╰───╯   █
                 █         █
                ▓█▄▄▄▄▄▄▄▄▄█▓
              ▓▓▓▓░░░░░░░░░▓▓▓▓
             ▓▓░░▒▒▒▒▒▒▒▒▒▒░░▓▓
            ▓▓░▒▓▓▓▓▓▓▓▓▓▓▓▓▒░▓▓
           ▓▓░▒▓████████████▓▒░▓▓
           ▓▓░▒▓█ SHADOW █▓▒░▓▓
           ▓▓░▒▓████████████▓▒░▓▓
            ▓▓░▒▓▓▓▓▓▓▓▓▓▓▓▓▒░▓▓
             ▓▓░░▒▒▒▒▒▒▒▒▒▒░░▓▓
              ▓▓▓░░░░░░░░░░▓▓▓
                 ▓▓▓▓▓▓▓▓▓▓
                   ▓▓  ▓▓
                  ▓▓    ▓▓
  `,
};

// ============================================================================
// PALADIN PORTRAIT
// ============================================================================

const PALADIN_DETAILED = {
  name: "Paladin",
  description: "Holy knight in blessed plate armor",
  art: `
                    ╭─────╮
                   ╭┤  ✝  ├╮
                  ▄██▀▀▀▀▀██▄
                 ██▀  ███  ▀██
                ██  ███████  ██
               ██  █████████  ██
               █▌  ███▀▀▀███  ▐█
               █▌   ▀▀▀▀▀▀▀   ▐█
               ██   ╔═════╗   ██
                █▄  ║ ● ● ║  ▄█
                ▐█  ║  ▼  ║  █▌
                ▐█  ║╰───╯║  █▌
                 █▄ ╚═════╝ ▄█
              ▄▄████▀▀▀▀▀▀▀████▄▄
            ▄██▀ ╔═══════════╗ ▀██▄
           ██▀  ╔╣███████████╠╗  ▀██
          ██   ╔╝█████████████╚╗   ██
         ▐█   ╔╝███████████████╚╗   █▌
         █▌   ║█████████████████║   ▐█
         █▌   ║████▓▓▓▓▓▓▓▓████║   ▐█
         █▌   ║████▓  ✝✝  ▓████║   ▐█
         ██   ║████▓▓▓▓▓▓▓▓████║   ██
         ▐█   ╚═══════════════════╝   █▌
          █▄      ║        ║      ▄█
          ▐█▄     ║   ✝✝   ║     ▄█▌
           ██▄   ╔╝        ╚╗   ▄██
            ▀█▄▄▄█          █▄▄▄█▀
  `,
};

// ============================================================================
// ROGUE PORTRAIT
// ============================================================================

const ROGUE_DETAILED = {
  name: "Rogue",
  description: "Stealthy assassin lurking in shadows",
  art: `
                    ░░░░░░░░
                  ░░▒▒▒▒▒▒▒▒░░
                ░░▒▓▓▓▓▓▓▓▓▓▓▒░░
               ░▒▓▓▓▓▀▀▀▀▀▀▓▓▓▓▒░
              ░▒▓▓▀          ▀▓▓▒░
              ░▒▓▓  ╔══════╗  ▓▓▒░
               ░▓▓  ║ ◆  ◆ ║  ▓▓░
                ░▓  ║   ▼  ║  ▓░
                ░▓  ║ ──── ║  ▓░
                 ▓▓ ╚══════╝ ▓▓
                  ▓▓▄▄▄▄▄▄▄▄▓▓
       ┌────────┐ ▓░░░░░░░░░░▓ ┌────────┐
       │▒▒▒▒▒▒▒▒│▓░░▒▒▒▒▒▒▒▒░░▓│▒▒▒▒▒▒▒▒│
       │▒░░░░░░▒│▓░▒▓▓▓▓▓▓▓▓▒░▓│▒░░░░░░▒│
       │▒░░░░░░▒│▓░▒▓▓▓▓▓▓▓▓▒░▓│▒░░░░░░▒│
       │▒▒▒▒▒▒▒▒│▓░▒▓░░░░░░▓▒░▓│▒▒▒▒▒▒▒▒│
       └────────┘▓░▒▓░░░░░░▓▒░▓└────────┘
                 ▓░▒▓▓▓▓▓▓▓▓▒░▓
                 ▓░░▒▒▒▒▒▒▒▒░░▓
                  ▓▓░░░░░░░░▓▓
                   ▓▓▓░░░░▓▓▓
                    ░▓▓  ▓▓░
                   ░▓▓    ▓▓░
  `,
};

// ============================================================================
// HUNTER PORTRAIT
// ============================================================================

const HUNTER_DETAILED = {
  name: "Hunter",
  description: "Ranged marksman with loyal pet",
  art: `
                     ╱╲
                    ╱  ╲
                   ╱ ◇◇ ╲
                  ╱──────╲
                 ╱        ╲
                ████████████
                    ██
                  ╭────╮
                  │◈  ◈│
                  │ ▽▽ │
                  │╰──╯│
                  ╰─┬┬─╯
               ╭───┴┴───╮
              █░░░░░░░░░░█    ╭───╮
             █░▒▒▒▒▒▒▒▒▒░█   ╱ ● ●╲
             █░▒▓▓▓▓▓▓▓▒░█  │  ▽  │
             █░▒▓▓▓▓▓▓▓▒░█  │ ╰──╯│
    ╭────────█░▒▓░░░░░▓▒░█──┤     │
    │▒▒▒▒▒▒▒▒█░▒▓░░░░░▓▒░█  │ ▄▄▄ │
    │▒▒▒▒▒▒▒▒█░▒▓▓▓▓▓▓▓▒░█  │█████│
    │▒░░░░░░▒█░░▒▒▒▒▒▒▒░░█  │█▓▓▓█│
    │▒▒▒▒▒▒▒▒ ╰─────────╯   │█▓▓▓█│
    ╰────────╯   │    │     │█▓▓▓█│
                ╱      ╲    ╰─────╯
               ╱        ╲   ╱     ╲
                           ╱   ●   ╲
  `,
};

// ============================================================================
// DRUID PORTRAIT
// ============================================================================

const DRUID_DETAILED = {
  name: "Druid",
  description: "Nature's guardian, master shapeshifter",
  art: `
                 🌿   🌿   🌿
                   ▄▄████▄▄
                 ▄█▀░░░░░░▀█▄
                █▀░▄██████▄░▀█
               █░▄██▀▀▀▀▀▀██▄░█
               █░██ 🌿  🌿 ██░█
               █░▀██▄    ▄██▀░█
               ▀█░░▀▀████▀▀░░█▀
                ▀█░╔══════╗░█▀
             🌿  █░║ ◈  ◈ ║░█  🌿
                 █░║   ▼  ║░█
                 █░║ ╰──╯ ║░█
                 ▀█╚══════╝█▀
               ▄▄███▀▀▀▀▀▀███▄▄
              █▀░╔══════════╗░▀█
            🌿█░╔╣▓▓▓▓▓▓▓▓▓▓╠╗░█🌿
             █░╔╝▓▓▓▓▓▓▓▓▓▓▓▓╚╗░█
             █░║▓▓▓🌿▓▓▓▓🌿▓▓▓║░█
             █░║▓▓▓▓▓▓▓▓▓▓▓▓▓▓║░█
          🌿 █░║▓▓▓▓🌿▓▓🌿▓▓▓▓║░█ 🌿
             █░╚══════════════╝░█
              █░░░░░░░░░░░░░░░░█
               ▀█░░░░░░░░░░░░█▀
             🌿  ▀█▄░░░░░░▄█▀  🌿
                   ▀▀████▀▀
  `,
};

// ============================================================================
// COLORIZED PORTRAIT RENDERER
// ============================================================================

interface ColorMap {
  [char: string]: string;
}

function ColorizedPortrait({
  art,
  colorMap,
  baseColor,
  className,
}: {
  art: string;
  colorMap?: ColorMap;
  baseColor?: string;
  className?: string;
}) {
  const defaultColorMap: ColorMap = {
    "█": baseColor || "#888",
    "▓": baseColor ? `${baseColor}cc` : "#666",
    "▒": baseColor ? `${baseColor}99` : "#444",
    "░": baseColor ? `${baseColor}66` : "#333",
    "◆": PALETTE.eyes_glow,
    "◈": PALETTE.eyes_glow,
    "●": "#fff",
    "✝": PALETTE.gold,
    "☩": PALETTE.gold,
    "★": PALETTE.gold,
    "✦": PALETTE.arcane_purple,
    "✧": PALETTE.arcane_purple,
    "❄": PALETTE.frost_blue,
    "🔥": PALETTE.fire_orange,
    "🌿": PALETTE.nature_green,
    "═": PALETTE.gold,
    "║": PALETTE.gold,
    "╔": PALETTE.gold,
    "╗": PALETTE.gold,
    "╚": PALETTE.gold,
    "╝": PALETTE.gold,
    "╠": PALETTE.gold,
    "╣": PALETTE.gold,
    ...colorMap,
  };

  return (
    <pre className={cn("font-mono leading-none whitespace-pre select-none text-[8px]", className)}>
      {art.split("\n").map((line, lineIdx) => (
        <div key={lineIdx}>
          {line.split("").map((char, charIdx) => (
            <span key={charIdx} style={{ color: defaultColorMap[char] || baseColor || "#888" }}>
              {char}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
}

// ============================================================================
// PORTRAIT CARD COMPONENT
// ============================================================================

function PortraitCard({
  title,
  description,
  art,
  baseColor,
  borderRarity = "rare",
}: {
  title: string;
  description: string;
  art: string;
  baseColor: string;
  borderRarity?: keyof typeof RARITY_COLORS;
}) {
  const borderColor = RARITY_COLORS[borderRarity];

  return (
    <div
      className="bg-[#0a0908] p-4"
      style={{
        border: `2px solid ${borderColor}`,
        boxShadow: borderRarity !== "common" ? `0 0 15px ${borderColor}40` : undefined,
      }}
    >
      <div className="text-center mb-2">
        <div className="font-mono text-sm font-bold" style={{ color: baseColor }}>
          {title}
        </div>
        <div className="font-mono text-[10px] text-stone-500">{description}</div>
      </div>
      <ColorizedPortrait art={art} baseColor={baseColor} />
    </div>
  );
}

// ============================================================================
// MAIN GALLERY COMPONENT
// ============================================================================

export function PortraitGallery() {
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const classes = ["all", "warrior", "mage", "priest", "paladin", "rogue", "hunter", "druid"];

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-300 p-6">
      <h1 className="text-3xl font-bold text-amber-400 mb-2 font-mono">
        ═══ PORTRAIT GALLERY - ADVANCED CONCEPTS ═══
      </h1>
      <p className="text-stone-500 font-mono text-sm mb-6">
        Intensive character portrait exploration with multiple techniques and class specializations
      </p>

      {/* Class Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={cn(
              "px-3 py-1 font-mono text-xs border transition-all capitalize",
              selectedClass === cls
                ? "border-amber-500 bg-amber-900/30 text-amber-300"
                : "border-stone-700 text-stone-500 hover:border-stone-500"
            )}
            style={{
              color: cls !== "all" ? CLASS_COLORS[cls as keyof typeof CLASS_COLORS] : undefined,
            }}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Warrior Portraits */}
      {(selectedClass === "all" || selectedClass === "warrior") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.warrior }}>
            ─── WARRIOR SPECIALIZATIONS ───
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PortraitCard
              title={WARRIOR_ARMS_DETAILED.name}
              description={WARRIOR_ARMS_DETAILED.description}
              art={WARRIOR_ARMS_DETAILED.art}
              baseColor={CLASS_COLORS.warrior}
              borderRarity="epic"
            />
            <PortraitCard
              title={WARRIOR_PROT_DETAILED.name}
              description={WARRIOR_PROT_DETAILED.description}
              art={WARRIOR_PROT_DETAILED.art}
              baseColor={CLASS_COLORS.warrior}
              borderRarity="rare"
            />
            <PortraitCard
              title={WARRIOR_FURY_DETAILED.name}
              description={WARRIOR_FURY_DETAILED.description}
              art={WARRIOR_FURY_DETAILED.art}
              baseColor={CLASS_COLORS.warrior}
              borderRarity="legendary"
            />
          </div>
        </section>
      )}

      {/* Mage Portraits */}
      {(selectedClass === "all" || selectedClass === "mage") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.mage }}>
            ─── MAGE SPECIALIZATIONS ───
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PortraitCard
              title={MAGE_FROST_DETAILED.name}
              description={MAGE_FROST_DETAILED.description}
              art={MAGE_FROST_DETAILED.art}
              baseColor={PALETTE.frost_blue}
              borderRarity="rare"
            />
            <PortraitCard
              title={MAGE_FIRE_DETAILED.name}
              description={MAGE_FIRE_DETAILED.description}
              art={MAGE_FIRE_DETAILED.art}
              baseColor={PALETTE.fire_orange}
              borderRarity="epic"
            />
            <PortraitCard
              title={MAGE_ARCANE_DETAILED.name}
              description={MAGE_ARCANE_DETAILED.description}
              art={MAGE_ARCANE_DETAILED.art}
              baseColor={PALETTE.arcane_purple}
              borderRarity="legendary"
            />
          </div>
        </section>
      )}

      {/* Priest Portraits */}
      {(selectedClass === "all" || selectedClass === "priest") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.priest }}>
            ─── PRIEST SPECIALIZATIONS ───
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PortraitCard
              title={PRIEST_HOLY_DETAILED.name}
              description={PRIEST_HOLY_DETAILED.description}
              art={PRIEST_HOLY_DETAILED.art}
              baseColor={CLASS_COLORS.priest}
              borderRarity="epic"
            />
            <PortraitCard
              title={PRIEST_SHADOW_DETAILED.name}
              description={PRIEST_SHADOW_DETAILED.description}
              art={PRIEST_SHADOW_DETAILED.art}
              baseColor={PALETTE.shadow_purple}
              borderRarity="rare"
            />
          </div>
        </section>
      )}

      {/* Other Classes */}
      {(selectedClass === "all" || selectedClass === "paladin") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.paladin }}>
            ─── PALADIN ───
          </h2>
          <div className="max-w-md">
            <PortraitCard
              title={PALADIN_DETAILED.name}
              description={PALADIN_DETAILED.description}
              art={PALADIN_DETAILED.art}
              baseColor={CLASS_COLORS.paladin}
              borderRarity="legendary"
            />
          </div>
        </section>
      )}

      {(selectedClass === "all" || selectedClass === "rogue") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.rogue }}>
            ─── ROGUE ───
          </h2>
          <div className="max-w-md">
            <PortraitCard
              title={ROGUE_DETAILED.name}
              description={ROGUE_DETAILED.description}
              art={ROGUE_DETAILED.art}
              baseColor={CLASS_COLORS.rogue}
              borderRarity="epic"
            />
          </div>
        </section>
      )}

      {(selectedClass === "all" || selectedClass === "hunter") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.hunter }}>
            ─── HUNTER ───
          </h2>
          <div className="max-w-md">
            <PortraitCard
              title={HUNTER_DETAILED.name}
              description={HUNTER_DETAILED.description}
              art={HUNTER_DETAILED.art}
              baseColor={CLASS_COLORS.hunter}
              borderRarity="rare"
            />
          </div>
        </section>
      )}

      {(selectedClass === "all" || selectedClass === "druid") && (
        <section className="mb-12">
          <h2 className="text-xl font-mono mb-4" style={{ color: CLASS_COLORS.druid }}>
            ─── DRUID ───
          </h2>
          <div className="max-w-md">
            <PortraitCard
              title={DRUID_DETAILED.name}
              description={DRUID_DETAILED.description}
              art={DRUID_DETAILED.art}
              baseColor={CLASS_COLORS.druid}
              borderRarity="epic"
            />
          </div>
        </section>
      )}

      {/* Reference-Based Portraits - NEW */}
      <section className="mb-12">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── REFERENCE IMAGE PORTRAITS ───</h2>
        <p className="text-stone-500 font-mono text-xs mb-4">
          ASCII recreations of ref_pic/ reference images with multi-color ANSI styling
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">Frostblighted Armor (EverQuest)</div>
            <ReferencePortrait portraitType="frostblighted" borderRarity="rare" />
          </div>
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">Rogue Guildmaster (Khajiit)</div>
            <ReferencePortrait portraitType="rogue_guildmaster" borderRarity="epic" />
          </div>
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">Golden Paladin (WoW Tier 2)</div>
            <ReferencePortrait portraitType="golden_paladin" borderRarity="legendary" />
          </div>
          <div>
            <div className="text-stone-400 text-xs mb-2 font-mono">Ret Paladin with Flame</div>
            <ReferencePortrait portraitType="ret_paladin_fire" borderRarity="epic" />
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="mb-8">
        <h2 className="text-xl text-amber-500 font-mono mb-4">─── DESIGN PHILOSOPHY ───</h2>
        <div className="bg-stone-900/30 border border-stone-700 p-4 font-mono text-xs text-stone-400 space-y-3">
          <p>
            <span className="text-amber-400">Visual Identity:</span> Each class has distinct silhouette, iconography,
            and color palette. Warriors are broad and armored, Mages are tall with pointed hats, Priests radiate holy
            symbols.
          </p>
          <p>
            <span className="text-amber-400">Specialization Variants:</span> Talent specializations get unique visual
            treatments. Frost Mage vs Fire Mage have completely different color palettes and magical effects.
          </p>
          <p>
            <span className="text-amber-400">Layered Shading:</span> Using ░▒▓█ creates depth and dimension.
            Lighter shading on edges suggests armor highlights.
          </p>
          <p>
            <span className="text-amber-400">Symbolic Details:</span> Holy symbols (✝☩), magical runes (✦★◇),
            and nature elements (🌿) reinforce class fantasy.
          </p>
          <p>
            <span className="text-amber-400">Weapons & Equipment:</span> Signature weapons are visible -
            two-handed swords for Arms Warriors, shields for Protection, daggers for Rogues.
          </p>
          <p className="border-t border-stone-700 pt-3 text-green-400">
            <span className="text-amber-400">Next Steps:</span> These concepts can be refined further.
            Consider: animated spell effects, damage states, equipment-based variations,
            and procedural generation for unique character looks.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PortraitGallery;
