import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import { TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// ============================================================================
// CHARACTER SHEET PAGE - Terminal aesthetic detailed stats view
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
  paladin: { name: "Mana", color: "#3b82f6" },
  hunter: { name: "Mana", color: "#3b82f6" },
  rogue: { name: "Energy", color: "#eab308" },
  priest: { name: "Mana", color: "#3b82f6" },
  mage: { name: "Mana", color: "#3b82f6" },
  druid: { name: "Mana", color: "#3b82f6" },
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
// ASCII PROGRESS BAR - Terminal style
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
      <span className="text-green-700">[</span>
      <span style={{ color }}>{"█".repeat(filled)}</span>
      <span className="text-green-900">{"░".repeat(empty)}</span>
      <span className="text-green-700">]</span>
      {showValues && (
        <span className="text-green-600 min-w-[80px] text-right">
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// STAT ROW COMPONENT - Terminal style
// ============================================================================

function StatRow({
  label,
  value,
  bonus,
  color = "#22c55e",
}: {
  label: string;
  value: number | string;
  bonus?: number;
  color?: string;
}) {
  return (
    <div className="flex justify-between items-center py-0.5 border-b border-green-900/50 last:border-0">
      <span className="text-green-600">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-bold" style={{ color }}>
          {value}
        </span>
        {bonus !== undefined && bonus > 0 && (
          <span className="text-green-400 text-[10px]">(+{bonus})</span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EQUIPMENT SLOT COMPONENT - Terminal style
// ============================================================================

function EquipmentSlot({
  slot,
  item,
}: {
  slot: { id: string; name: string };
  item?: { name: string; rarity: string; itemLevel: number } | null;
}) {
  const rarityColor = item ? RARITY_COLORS[item.rarity] || RARITY_COLORS.common : "#166534";

  return (
    <div
      className="w-24 h-16 border flex flex-col items-center justify-center text-center p-1 transition-all bg-black hover:border-green-500"
      style={{ borderColor: item ? rarityColor : "#166534" }}
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
          <div className="text-[9px] text-green-700">iLvl {item.itemLevel}</div>
        </>
      ) : (
        <>
          <div className="text-green-700 text-[10px] font-mono">{slot.name}</div>
          <div className="text-green-900 text-[9px]">[ Empty ]</div>
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          {">"} Loading character data...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !character) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <pre className="text-red-500 font-mono text-center">
{`╔════════════════════════════════════╗
║         CHARACTER NOT FOUND        ║
║                                    ║
║   The requested character does     ║
║   not exist or is unavailable.     ║
╚════════════════════════════════════╝`}
        </pre>
        <TerminalButton onClick={() => navigate("/")}>
          [←] Back to Characters
        </TerminalButton>
      </div>
    );
  }

  const classColor = CLASS_COLORS[character.characterClass] || "#22c55e";
  const resourceConfig = RESOURCE_CONFIG[character.characterClass] || { name: "Mana", color: "#3b82f6" };
  const derivedStats = calculateDerivedStats(character);

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* ASCII Header */}
        <div className="text-center mb-4">
          <pre className="text-green-600 text-xs">
{"═".repeat(60)}
          </pre>
          <h1 className="text-2xl font-bold text-yellow-400 tracking-wider my-2">
            CHARACTER SHEET
          </h1>
          <pre className="text-green-600 text-xs">
{"═".repeat(60)}
          </pre>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <TerminalButton variant="secondary" onClick={() => navigate(`/game/${characterId}`)}>
            [←] Back to Game
          </TerminalButton>
          <div className="text-green-600 text-xs">
            ID: {character.id} | Session Active
          </div>
        </div>

        {/* Character Header Banner */}
        <TerminalPanel variant="green" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: classColor }}>
                {character.name}
              </h2>
              <div className="text-green-600 text-sm capitalize">
                Level {character.level} {character.characterClass}
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 text-lg">
                <span className="text-green-600 text-sm">Gold:</span> {character.gold.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Resource Bars */}
          <div className="space-y-3 border-t border-green-800 pt-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400">HEALTH</span>
                <span className="text-green-600">{Math.floor((character.currentHealth / character.maxHealth) * 100)}%</span>
              </div>
              <ASCIIProgressBar
                current={character.currentHealth}
                max={character.maxHealth}
                color="#dc2626"
                width={30}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: resourceConfig.color }}>{resourceConfig.name.toUpperCase()}</span>
                <span className="text-green-600">{Math.floor((character.currentResource / character.maxResource) * 100)}%</span>
              </div>
              <ASCIIProgressBar
                current={character.currentResource}
                max={character.maxResource}
                color={resourceConfig.color}
                width={30}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-purple-400">EXPERIENCE</span>
                <span className="text-green-600">{Math.floor((xpProgress / xpToNextLevel) * 100)}% to Level {character.level + 1}</span>
              </div>
              <ASCIIProgressBar
                current={xpProgress}
                max={xpToNextLevel}
                color="#a855f7"
                width={30}
              />
            </div>
          </div>
        </TerminalPanel>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Stats */}
          <div className="space-y-4">
            <TerminalPanel variant="green" title="PRIMARY ATTRIBUTES">
              <div className="space-y-1 text-sm">
                <StatRow label="Strength" value={character.baseStrength} color="#f59e0b" />
                <StatRow label="Agility" value={character.baseAgility} color="#22c55e" />
                <StatRow label="Intellect" value={character.baseIntellect} color="#3b82f6" />
                <StatRow label="Stamina" value={character.baseStamina} color="#ef4444" />
                <StatRow label="Spirit" value={character.baseSpirit} color="#06b6d4" />
              </div>
            </TerminalPanel>

            <TerminalPanel variant="yellow" title="DERIVED STATS">
              <div className="space-y-1 text-sm">
                <StatRow label="Attack Power" value={derivedStats.attackPower} color="#f59e0b" />
                <StatRow label="Spell Power" value={derivedStats.spellPower} color="#a855f7" />
                <StatRow label="Crit Chance" value={`${derivedStats.critChance.toFixed(1)}%`} color="#ef4444" />
                <StatRow label="Armor" value={derivedStats.armor} color="#71717a" />
                <StatRow label="Dodge" value={`${derivedStats.dodge.toFixed(1)}%`} color="#22c55e" />
                {derivedStats.block > 0 && (
                  <StatRow label="Block" value={`${derivedStats.block}%`} color="#3b82f6" />
                )}
              </div>
            </TerminalPanel>

            <TerminalPanel variant="cyan" title="RESISTANCES">
              <div className="space-y-1 text-sm">
                <StatRow label="Fire" value={0} color="#ef4444" />
                <StatRow label="Frost" value={0} color="#06b6d4" />
                <StatRow label="Nature" value={0} color="#22c55e" />
                <StatRow label="Arcane" value={0} color="#a855f7" />
                <StatRow label="Shadow" value={0} color="#7c3aed" />
              </div>
            </TerminalPanel>
          </div>

          {/* Center Column - Character Model / Equipment */}
          <div>
            <TerminalPanel variant="green" title="EQUIPMENT">
              <div className="text-center mb-4">
                <div className="text-green-600 text-xs">
                  Average Item Level: <span className="text-yellow-400">0</span>
                </div>
              </div>

              {/* Equipment Grid */}
              <div className="grid grid-cols-3 gap-2 justify-items-center">
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

              {/* Character Silhouette */}
              <div className="mt-4 text-center">
                <pre className="text-green-800 text-[8px] leading-none inline-block">
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
            </TerminalPanel>
          </div>

          {/* Right Column - Combat Stats & Info */}
          <div className="space-y-4">
            <TerminalPanel variant="red" title="COMBAT STATS">
              <div className="space-y-1 text-sm">
                <StatRow label="DPS" value="0.0" color="#ef4444" />
                <StatRow label="Hit Chance" value="95%" color="#22c55e" />
                <StatRow label="Haste" value="0%" color="#f59e0b" />
                <StatRow label="Mana/5s" value="0" color="#3b82f6" />
                <StatRow label="Health/5s" value="0" color="#ef4444" />
              </div>
            </TerminalPanel>

            <TerminalPanel variant="yellow" title="WEAPON">
              <div className="text-center py-4 text-green-700">
                <div className="text-xs">[ No weapon equipped ]</div>
                <div className="text-[10px] mt-1 text-green-800">Equip a weapon to see stats</div>
              </div>
            </TerminalPanel>

            <TerminalPanel variant="cyan" title="REPUTATION">
              <div className="text-center py-4 text-green-700">
                <div className="text-xs">[ No factions discovered ]</div>
                <div className="text-[10px] mt-1 text-green-800">Explore the world to meet factions</div>
              </div>
            </TerminalPanel>

            {/* Quick Actions */}
            <div className="space-y-2">
              <TerminalButton
                variant="secondary"
                onClick={() => navigate(`/character/${characterId}/inventory`)}
                className="w-full"
              >
                [◆] Open Inventory
              </TerminalButton>
              <TerminalButton
                variant="primary"
                onClick={() => navigate(`/game/${characterId}`)}
                className="w-full"
              >
                [▶] Return to Game
              </TerminalButton>
            </div>
          </div>
        </div>

        {/* Footer Stats Summary */}
        <div className="mt-6 border border-green-800 bg-black p-4">
          <div className="text-xs text-green-600 text-center">
            {"═".repeat(20)} CHARACTER SUMMARY {"═".repeat(20)}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-xs">
            <span>
              <span className="text-green-700">Kills:</span>{" "}
              <span className="text-green-400">0</span>
            </span>
            <span>
              <span className="text-green-700">Deaths:</span>{" "}
              <span className="text-red-400">0</span>
            </span>
            <span>
              <span className="text-green-700">Quests:</span>{" "}
              <span className="text-yellow-400">0</span>
            </span>
            <span>
              <span className="text-green-700">Dungeons:</span>{" "}
              <span className="text-purple-400">0</span>
            </span>
          </div>
          <div className="text-center mt-4 text-green-800 text-[10px]">
            {"─".repeat(50)}
          </div>
        </div>
      </div>
    </div>
  );
}
