import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import { ArrowLeft } from "lucide-react";

// ============================================================================
// CHARACTER SHEET PAGE - Detailed stats and equipment view
// ============================================================================

// Class colors (WoW-style)
const CLASS_COLORS: Record<string, string> = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// Resource types and colors
const RESOURCE_CONFIG: Record<string, { name: string; color: string }> = {
  warrior: { name: "Rage", color: "#dc2626" },
  paladin: { name: "Mana", color: "#2563eb" },
  hunter: { name: "Mana", color: "#2563eb" },
  rogue: { name: "Energy", color: "#eab308" },
  priest: { name: "Mana", color: "#2563eb" },
  mage: { name: "Mana", color: "#2563eb" },
  druid: { name: "Mana", color: "#2563eb" },
};

// Equipment slot positions for visualization
const EQUIPMENT_SLOTS = [
  { id: "head", name: "Head", row: 0, col: 1 },
  { id: "neck", name: "Neck", row: 1, col: 0 },
  { id: "shoulders", name: "Shoulders", row: 1, col: 2 },
  { id: "chest", name: "Chest", row: 2, col: 1 },
  { id: "back", name: "Back", row: 2, col: 0 },
  { id: "wrist", name: "Wrist", row: 2, col: 2 },
  { id: "hands", name: "Hands", row: 3, col: 0 },
  { id: "waist", name: "Waist", row: 3, col: 1 },
  { id: "legs", name: "Legs", row: 3, col: 2 },
  { id: "feet", name: "Feet", row: 4, col: 1 },
  { id: "ring1", name: "Ring", row: 4, col: 0 },
  { id: "ring2", name: "Ring", row: 4, col: 2 },
  { id: "trinket1", name: "Trinket", row: 5, col: 0 },
  { id: "trinket2", name: "Trinket", row: 5, col: 2 },
  { id: "mainHand", name: "Main Hand", row: 6, col: 0 },
  { id: "offHand", name: "Off Hand", row: 6, col: 2 },
];

// Rarity colors
const RARITY_COLORS: Record<string, string> = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
  experience: number;
  gold: number;
  currentHealth: number;
  maxHealth: number;
  currentResource: number;
  maxResource: number;
  baseStrength: number;
  baseAgility: number;
  baseIntellect: number;
  baseStamina: number;
  baseSpirit: number;
}

// ============================================================================
// ASCII PROGRESS BAR
// ============================================================================

function ASCIIProgressBar({
  current,
  max,
  color,
  width = 20,
  showValues = true,
}: {
  current: number;
  max: number;
  color: string;
  width?: number;
  showValues?: boolean;
}) {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));
  const filled = Math.floor((percent / 100) * width);
  const empty = width - filled;

  return (
    <div className="font-mono text-xs flex items-center gap-2">
      <span className="text-stone-600">[</span>
      <span style={{ color }}>{"█".repeat(filled)}</span>
      <span className="text-stone-800">{"░".repeat(empty)}</span>
      <span className="text-stone-600">]</span>
      {showValues && (
        <span className="text-stone-400 min-w-[80px] text-right">
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// ASCII FRAME COMPONENT
// ============================================================================

function ASCIIFrame({
  title,
  children,
  className,
  titleColor = "#d97706",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleColor?: string;
}) {
  return (
    <div className={cn("font-mono text-xs", className)}>
      {/* Top border */}
      <div className="text-amber-700 whitespace-pre">
        {title ? (
          <span>
            ╔═══ <span style={{ color: titleColor }}>{title}</span> {"═".repeat(Math.max(0, 30 - title.length))}═══╗
          </span>
        ) : (
          <span>╔{"═".repeat(40)}╗</span>
        )}
      </div>
      {/* Content with side borders */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 text-amber-700">║</div>
        <div className="absolute right-0 top-0 bottom-0 text-amber-700">║</div>
        <div className="px-3 py-2">{children}</div>
      </div>
      {/* Bottom border */}
      <div className="text-amber-700 whitespace-pre">
        <span>╚{"═".repeat(40)}╝</span>
      </div>
    </div>
  );
}

// ============================================================================
// STAT ROW COMPONENT
// ============================================================================

function StatRow({
  label,
  value,
  bonus,
  color = "#a1a1aa",
}: {
  label: string;
  value: number | string;
  bonus?: number;
  color?: string;
}) {
  return (
    <div className="flex justify-between items-center py-0.5 border-b border-stone-800 last:border-0">
      <span className="text-stone-500">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-bold" style={{ color }}>
          {value}
        </span>
        {bonus !== undefined && bonus > 0 && (
          <span className="text-green-500 text-[10px]">(+{bonus})</span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EQUIPMENT SLOT COMPONENT
// ============================================================================

function EquipmentSlot({
  slot,
  item,
}: {
  slot: { id: string; name: string };
  item?: { name: string; rarity: string; itemLevel: number } | null;
}) {
  const rarityColor = item ? RARITY_COLORS[item.rarity] || RARITY_COLORS.common : "#4a4a4a";

  return (
    <div
      className="w-24 h-16 border-2 flex flex-col items-center justify-center text-center p-1 transition-all hover:border-amber-600/50"
      style={{ borderColor: item ? rarityColor : "#3f3f46" }}
    >
      {item ? (
        <>
          <div
            className="text-[10px] font-mono truncate w-full"
            style={{ color: rarityColor }}
            title={item.name}
          >
            {item.name}
          </div>
          <div className="text-[9px] text-stone-500">iLvl {item.itemLevel}</div>
        </>
      ) : (
        <>
          <div className="text-stone-600 text-[10px] font-mono">{slot.name}</div>
          <div className="text-stone-700 text-[9px]">Empty</div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN CHARACTER SHEET COMPONENT
// ============================================================================

export default function CharacterSheet() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const characterId = parseInt(params.id || "0");

  const { data: character, isLoading, error } = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => {
      const response = await fetch(
        buildUrl(api.characters.get.path, { id: characterId })
      );
      if (!response.ok) throw new Error("Failed to fetch character");
      return response.json() as Promise<Character>;
    },
    enabled: characterId > 0,
  });

  // Calculate derived stats (mock calculations - would come from backend)
  const calculateDerivedStats = (char: Character) => {
    const strengthBonus = char.baseStrength * 2;
    const agilityBonus = Math.floor(char.baseAgility * 0.5);
    const intellectBonus = char.baseIntellect * 15;

    return {
      attackPower: strengthBonus + char.level * 3,
      spellPower: intellectBonus,
      critChance: 5 + (char.baseAgility / 20),
      armor: 100 + char.level * 10 + char.baseAgility,
      dodge: 5 + (char.baseAgility / 25),
      block: char.characterClass === "warrior" || char.characterClass === "paladin" ? 5 : 0,
    };
  };

  // Calculate XP requirements (simplified)
  const getXpForLevel = (level: number) => level * 1000;
  const xpToNextLevel = character ? getXpForLevel(character.level) : 1000;
  const xpProgress = character ? character.experience % xpToNextLevel : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-500 font-mono animate-pulse">Loading character...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-mono">Character not found</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-sm hover:bg-amber-900/50"
        >
          Back to Characters
        </button>
      </div>
    );
  }

  const classColor = CLASS_COLORS[character.characterClass] || "#888";
  const resourceConfig = RESOURCE_CONFIG[character.characterClass] || { name: "Mana", color: "#2563eb" };
  const derivedStats = calculateDerivedStats(character);

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/game/${characterId}`)}
            className="flex items-center gap-2 px-3 py-1 text-stone-400 hover:text-amber-400 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Game
          </button>
          <h1 className="text-xl font-bold text-amber-400 font-mono">
            CHARACTER SHEET
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Character Header Banner */}
        <div className="mb-6 bg-stone-900/50 border border-stone-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-mono" style={{ color: classColor }}>
                {character.name}
              </h2>
              <div className="text-stone-500 font-mono text-sm capitalize">
                Level {character.level} {character.characterClass}
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-500 font-mono">
                <span className="text-stone-500">Gold:</span> {character.gold.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Resource Bars */}
          <div className="mt-4 space-y-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-red-400">Health</span>
                <span className="text-stone-500">{Math.floor((character.currentHealth / character.maxHealth) * 100)}%</span>
              </div>
              <ASCIIProgressBar
                current={character.currentHealth}
                max={character.maxHealth}
                color="#dc2626"
                width={30}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span style={{ color: resourceConfig.color }}>{resourceConfig.name}</span>
                <span className="text-stone-500">{Math.floor((character.currentResource / character.maxResource) * 100)}%</span>
              </div>
              <ASCIIProgressBar
                current={character.currentResource}
                max={character.maxResource}
                color={resourceConfig.color}
                width={30}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-purple-400">Experience</span>
                <span className="text-stone-500">{Math.floor((xpProgress / xpToNextLevel) * 100)}% to Level {character.level + 1}</span>
              </div>
              <ASCIIProgressBar
                current={xpProgress}
                max={xpToNextLevel}
                color="#a855f7"
                width={30}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Stats */}
          <div className="space-y-4">
            <ASCIIFrame title="PRIMARY ATTRIBUTES">
              <div className="space-y-1">
                <StatRow label="Strength" value={character.baseStrength} color="#f59e0b" />
                <StatRow label="Agility" value={character.baseAgility} color="#22c55e" />
                <StatRow label="Intellect" value={character.baseIntellect} color="#3b82f6" />
                <StatRow label="Stamina" value={character.baseStamina} color="#ef4444" />
                <StatRow label="Spirit" value={character.baseSpirit} color="#06b6d4" />
              </div>
            </ASCIIFrame>

            <ASCIIFrame title="DERIVED STATS">
              <div className="space-y-1">
                <StatRow label="Attack Power" value={derivedStats.attackPower} color="#f59e0b" />
                <StatRow label="Spell Power" value={derivedStats.spellPower} color="#a855f7" />
                <StatRow label="Crit Chance" value={`${derivedStats.critChance.toFixed(1)}%`} color="#ef4444" />
                <StatRow label="Armor" value={derivedStats.armor} color="#71717a" />
                <StatRow label="Dodge" value={`${derivedStats.dodge.toFixed(1)}%`} color="#22c55e" />
                {derivedStats.block > 0 && (
                  <StatRow label="Block" value={`${derivedStats.block}%`} color="#3b82f6" />
                )}
              </div>
            </ASCIIFrame>

            <ASCIIFrame title="RESISTANCES">
              <div className="space-y-1">
                <StatRow label="Fire" value={0} color="#ef4444" />
                <StatRow label="Frost" value={0} color="#06b6d4" />
                <StatRow label="Nature" value={0} color="#22c55e" />
                <StatRow label="Arcane" value={0} color="#a855f7" />
                <StatRow label="Shadow" value={0} color="#7c3aed" />
              </div>
            </ASCIIFrame>
          </div>

          {/* Center Column - Character Model / Equipment */}
          <div>
            <ASCIIFrame title="EQUIPMENT" titleColor={classColor}>
              <div className="text-center mb-4">
                <div className="text-stone-500 text-[10px] font-mono">
                  Average Item Level: <span className="text-amber-400">0</span>
                </div>
              </div>

              {/* Equipment Grid */}
              <div className="grid grid-cols-3 gap-2 justify-items-center">
                {/* Row by row equipment layout */}
                {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                  <div key={row} className="contents">
                    {EQUIPMENT_SLOTS.filter((s) => s.row === row).map((slot) => (
                      <div
                        key={slot.id}
                        className={cn(
                          slot.col === 1 && "col-start-2",
                          slot.col === 0 && "col-start-1",
                          slot.col === 2 && "col-start-3"
                        )}
                      >
                        <EquipmentSlot slot={slot} item={null} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Character Silhouette placeholder */}
              <div className="mt-4 text-center">
                <pre className="text-stone-700 text-[8px] leading-none font-mono inline-block">
{`      ▄▄▄▄▄
     █ ◆ ◆ █
     █  ▼  █
     █╰───╯█
    ╔═══════╗
   ╔╣███████╠╗
   ║ ███████ ║
   ║ █▓▓▓▓▓█ ║
   ╚═╣▓▓▓▓▓╠═╝
     ║▓   ▓║
     ║▓   ▓║
    ╔╝     ╚╗
    █       █`}
                </pre>
              </div>
            </ASCIIFrame>
          </div>

          {/* Right Column - Combat Stats & Info */}
          <div className="space-y-4">
            <ASCIIFrame title="COMBAT STATS">
              <div className="space-y-1">
                <StatRow label="DPS" value="0.0" color="#ef4444" />
                <StatRow label="Hit Chance" value="95%" color="#22c55e" />
                <StatRow label="Haste" value="0%" color="#f59e0b" />
                <StatRow label="Mana/5s" value="0" color="#3b82f6" />
                <StatRow label="Health/5s" value="0" color="#ef4444" />
              </div>
            </ASCIIFrame>

            <ASCIIFrame title="WEAPON">
              <div className="text-center py-4 text-stone-600">
                <div className="font-mono text-xs">No weapon equipped</div>
                <div className="text-[10px] mt-1">Equip a weapon to see stats</div>
              </div>
            </ASCIIFrame>

            <ASCIIFrame title="REPUTATION">
              <div className="text-center py-4 text-stone-600">
                <div className="font-mono text-xs">No factions discovered</div>
                <div className="text-[10px] mt-1">Explore the world to meet factions</div>
              </div>
            </ASCIIFrame>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/character/${characterId}/inventory`)}
                className="w-full py-2 bg-stone-800 border border-stone-700 text-stone-400 font-mono text-xs hover:border-amber-700 hover:text-amber-400 transition-colors"
              >
                Open Inventory
              </button>
              <button
                onClick={() => navigate(`/game/${characterId}`)}
                className="w-full py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-xs hover:bg-amber-900/50 transition-colors"
              >
                Return to Game
              </button>
            </div>
          </div>
        </div>

        {/* Footer Stats Summary */}
        <div className="mt-6 p-4 bg-stone-900/30 border border-stone-800">
          <div className="font-mono text-xs text-stone-600 text-center">
            {"═".repeat(20)} CHARACTER SUMMARY {"═".repeat(20)}
          </div>
          <div className="flex justify-center gap-8 mt-2 font-mono text-xs">
            <span>
              <span className="text-stone-500">Kills:</span>{" "}
              <span className="text-green-400">0</span>
            </span>
            <span>
              <span className="text-stone-500">Deaths:</span>{" "}
              <span className="text-red-400">0</span>
            </span>
            <span>
              <span className="text-stone-500">Quests:</span>{" "}
              <span className="text-amber-400">0</span>
            </span>
            <span>
              <span className="text-stone-500">Dungeons:</span>{" "}
              <span className="text-purple-400">0</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
