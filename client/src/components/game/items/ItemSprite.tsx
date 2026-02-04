// ============================================================================
// ITEM SPRITE COMPONENT - Procedural ASCII art for items
// ============================================================================

import { cn } from "@/lib/utils";
import { WEAPON_SPRITES, WeaponType, WEAPON_COLOR_KEYS } from "./sprites/weapons";
import { ARMOR_SPRITES, ArmorType, ARMOR_COLOR_KEYS } from "./sprites/armor";

// ============================================================================
// RARITY COLORS - Match the game's rarity system
// ============================================================================

const RARITY_COLORS = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

// Material color palettes
const MATERIAL_COLORS = {
  iron: { main: "#707070", metal: "#4a4a4a", trim: "#555555" },
  steel: { main: "#c0c0c0", metal: "#a0a0a0", trim: "#808080" },
  bronze: { main: "#cd7f32", metal: "#8b5a2b", trim: "#a0522d" },
  gold: { main: "#ffd700", metal: "#daa520", trim: "#b8860b" },
  darksteel: { main: "#2f2f2f", metal: "#1a1a1a", trim: "#3f3f3f" },
  crystal: { main: "#87ceeb", metal: "#b0e0e6", trim: "#add8e6" },
  bone: { main: "#f5f5dc", metal: "#fffacd", trim: "#faf0e6" },
  leather: { main: "#8b4513", metal: "#654321", trim: "#a0522d" },
  cloth: { main: "#4a4a6a", metal: "#3a3a5a", trim: "#5a5a7a" },
};

type Rarity = keyof typeof RARITY_COLORS;
type Material = keyof typeof MATERIAL_COLORS;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ItemType = WeaponType | ArmorType;

export interface ItemSpriteProps {
  itemType: ItemType;
  rarity?: Rarity;
  material?: Material;
  size?: "small" | "medium" | "large";
  showGlow?: boolean;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isWeaponType(type: ItemType): type is WeaponType {
  return type in WEAPON_SPRITES;
}

function getSprite(itemType: ItemType) {
  if (isWeaponType(itemType)) {
    return WEAPON_SPRITES[itemType];
  }
  return ARMOR_SPRITES[itemType as ArmorType];
}

function resolveColor(
  colorKey: string,
  rarity: Rarity,
  material: Material
): string {
  const rarityColor = RARITY_COLORS[rarity];
  const materialPalette = MATERIAL_COLORS[material];

  // Map color keys to actual colors
  const colorMapping: Record<string, string> = {
    // Weapon keys
    [WEAPON_COLOR_KEYS.blade]: materialPalette.main,
    [WEAPON_COLOR_KEYS.hilt]: materialPalette.trim,
    [WEAPON_COLOR_KEYS.gem]: rarityColor,
    [WEAPON_COLOR_KEYS.glow]: rarityColor,
    [WEAPON_COLOR_KEYS.metal]: materialPalette.metal,
    // Armor keys
    [ARMOR_COLOR_KEYS.main]: materialPalette.main,
    [ARMOR_COLOR_KEYS.trim]: materialPalette.trim,
    [ARMOR_COLOR_KEYS.gem]: rarityColor,
    [ARMOR_COLOR_KEYS.glow]: rarityColor,
    [ARMOR_COLOR_KEYS.metal]: materialPalette.metal,
  };

  return colorMapping[colorKey] || rarityColor;
}

// ============================================================================
// ITEM SPRITE COMPONENT
// ============================================================================

export function ItemSprite({
  itemType,
  rarity = "common",
  material = "iron",
  size = "medium",
  showGlow = false,
  className,
}: ItemSpriteProps) {
  const sprite = getSprite(itemType);

  if (!sprite) {
    return null;
  }

  const sizeClasses = {
    small: "text-[6px]",
    medium: "text-[8px]",
    large: "text-[10px]",
  };

  // Build resolved color map
  const resolvedColorMap: Record<string, string> = {};
  for (const [char, colorKey] of Object.entries(sprite.colorMap)) {
    resolvedColorMap[char] = resolveColor(colorKey, rarity, material);
  }

  // Render a line with color mapping
  const renderLine = (line: string) => {
    return line.split("").map((char, i) => {
      const color = resolvedColorMap[char] || RARITY_COLORS[rarity];
      return (
        <span key={i} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  const glowColor = RARITY_COLORS[rarity];

  return (
    <div
      className={cn(
        "font-mono leading-none whitespace-pre inline-block",
        sizeClasses[size],
        className
      )}
      style={{
        filter: showGlow && rarity !== "common"
          ? `drop-shadow(0 0 4px ${glowColor})`
          : undefined,
      }}
    >
      {sprite.lines.map((line, i) => (
        <div key={i}>{renderLine(line)}</div>
      ))}
    </div>
  );
}

// ============================================================================
// ITEM SLOT TO TYPE MAPPING
// ============================================================================

export function mapSlotToItemType(
  slot: string,
  weaponType?: string
): ItemType {
  // Map equipment slots to sprite types
  const slotMapping: Record<string, ItemType> = {
    mainHand: "sword",
    offHand: "shield",
    head: "helm",
    chest: "chestplate",
    hands: "gloves",
    feet: "boots",
    finger1: "ring",
    finger2: "ring",
    trinket1: "trinket",
    trinket2: "trinket",
    neck: "necklace",
    back: "cape",
  };

  // Use weaponType override if provided
  if (slot === "mainHand" && weaponType) {
    const weaponMapping: Record<string, WeaponType> = {
      sword: "sword",
      dagger: "dagger",
      mace: "mace",
      axe: "axe",
      staff: "staff",
      bow: "bow",
      wand: "wand",
      polearm: "polearm",
    };
    return weaponMapping[weaponType] || "sword";
  }

  return slotMapping[slot] || "trinket";
}

// ============================================================================
// GALLERY COMPONENT (for testing/preview)
// ============================================================================

export function ItemSpriteGallery() {
  const weapons: WeaponType[] = [
    "sword", "dagger", "mace", "axe",
    "greatsword", "staff", "polearm", "bow", "wand"
  ];

  const armor: ArmorType[] = [
    "helm", "hood", "chestplate", "robe",
    "gloves", "boots", "ring", "trinket", "necklace", "cape", "shield"
  ];

  const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

  return (
    <div className="space-y-8 p-4 bg-black text-white">
      <h2 className="text-amber-400 font-mono text-lg">Item Sprites</h2>

      {/* Weapons */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Weapons</h3>
        <div className="flex gap-4 flex-wrap">
          {weapons.map((type) => (
            <div key={type} className="text-center">
              <ItemSprite itemType={type} rarity="rare" material="steel" />
              <div className="mt-1 text-[8px] font-mono text-stone-500">
                {type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Armor */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Armor</h3>
        <div className="flex gap-4 flex-wrap">
          {armor.map((type) => (
            <div key={type} className="text-center">
              <ItemSprite itemType={type} rarity="rare" material="steel" />
              <div className="mt-1 text-[8px] font-mono text-stone-500">
                {type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rarity showcase */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Rarity Comparison (Sword)</h3>
        <div className="flex gap-4 flex-wrap">
          {rarities.map((rarity) => (
            <div key={rarity} className="text-center">
              <ItemSprite
                itemType="sword"
                rarity={rarity}
                material="steel"
                showGlow={rarity !== "common"}
              />
              <div
                className="mt-1 text-[8px] font-mono capitalize"
                style={{ color: RARITY_COLORS[rarity] }}
              >
                {rarity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemSprite;
