import { cn } from "@/lib/utils";
import {
  Swords,
  Shield,
  Heart,
  Zap,
  Skull,
  AlertTriangle,
  ChevronRight,
  Star,
} from "lucide-react";

// ============================================================================
// COMBAT PREVIEW - Pre-combat screen showing enemy details
// ============================================================================

export interface EnemyPreview {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  type: "normal" | "elite" | "rare" | "boss";
  abilities: string[];
  weaknesses?: string[];
  resistances?: string[];
  lootChance: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
  };
  xpReward: number;
  goldReward: { min: number; max: number };
}

export interface PlayerPreview {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  characterClass: string;
  estimatedDamage: { min: number; max: number };
  estimatedDuration: string;
  winChance: number;
}

const ENEMY_TYPE_CONFIG: Record<
  EnemyPreview["type"],
  { color: string; label: string; icon: typeof Skull }
> = {
  normal: { color: "#9d9d9d", label: "Normal", icon: Skull },
  elite: { color: "#f59e0b", label: "Elite", icon: Star },
  rare: { color: "#0070dd", label: "Rare", icon: Star },
  boss: { color: "#a855f7", label: "Boss", icon: Skull },
};

const CLASS_COLORS: Record<string, string> = {
  warrior: "#c69b6d",
  paladin: "#f48cba",
  hunter: "#aad372",
  rogue: "#fff468",
  priest: "#ffffff",
  mage: "#3fc7eb",
  druid: "#ff7c0a",
};

// ============================================================================
// ASCII HEALTH BAR
// ============================================================================

function ASCIIHealthBar({
  current,
  max,
  width = 20,
  color = "#ef4444",
}: {
  current: number;
  max: number;
  width?: number;
  color?: string;
}) {
  const percent = max > 0 ? Math.min(1, current / max) : 0;
  const filled = Math.floor(percent * width);
  const empty = width - filled;

  return (
    <div className="font-mono text-xs">
      <span style={{ color }}>{"█".repeat(filled)}</span>
      <span className="text-stone-700">{"░".repeat(empty)}</span>
      <span className="text-stone-400 ml-2">
        {current}/{max}
      </span>
    </div>
  );
}

// ============================================================================
// ENEMY PORTRAIT (ASCII Style)
// ============================================================================

function EnemyPortrait({ enemy }: { enemy: EnemyPreview }) {
  const typeConfig = ENEMY_TYPE_CONFIG[enemy.type];

  // Simple ASCII enemy based on type
  const getEnemyArt = () => {
    if (enemy.type === "boss") {
      return [
        "    ╔═══╗    ",
        "   ╔╝ ▲ ╚╗   ",
        "  ╔╝ ◄►◄► ╚╗ ",
        "  ║ ╔═══╗  ║ ",
        "  ║ ║▓▓▓║  ║ ",
        "  ╚═╩═══╩══╝ ",
      ];
    }
    if (enemy.type === "elite") {
      return [
        "   ╔═══╗   ",
        "   ║ ★ ║   ",
        "  ╔╩═══╩╗  ",
        "  ║ ◄ ► ║  ",
        "  ╚══╦══╝  ",
        "     ╩     ",
      ];
    }
    if (enemy.type === "rare") {
      return [
        "   ┌───┐   ",
        "   │ ✦ │   ",
        "  ┌┴───┴┐  ",
        "  │ • • │  ",
        "  └──┬──┘  ",
        "     │     ",
      ];
    }
    return [
      "   ┌───┐   ",
      "   │ · │   ",
      "   ├───┤   ",
      "   │ x │   ",
      "   └─┬─┘   ",
      "     │     ",
    ];
  };

  return (
    <div className="text-center">
      <pre
        className="font-mono text-xs leading-none"
        style={{ color: typeConfig.color }}
      >
        {getEnemyArt().join("\n")}
      </pre>
      <div
        className="mt-2 text-sm font-mono font-bold"
        style={{ color: typeConfig.color }}
      >
        {enemy.name}
      </div>
      <div className="flex items-center justify-center gap-2 mt-1">
        <span className="text-[10px] font-mono text-stone-500">
          Lv.{enemy.level}
        </span>
        <span
          className="text-[10px] font-mono px-1"
          style={{
            color: typeConfig.color,
            backgroundColor: `${typeConfig.color}20`,
          }}
        >
          {typeConfig.label}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// STAT COMPARISON
// ============================================================================

function StatComparison({
  label,
  playerValue,
  enemyValue,
  icon: Icon,
}: {
  label: string;
  playerValue: number;
  enemyValue: number;
  icon: typeof Heart;
}) {
  const diff = playerValue - enemyValue;
  const advantage = diff > 0 ? "player" : diff < 0 ? "enemy" : "neutral";

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <div className="flex-1 text-right">
        <span
          className={cn(
            advantage === "player" ? "text-green-400" : "text-stone-400"
          )}
        >
          {playerValue}
        </span>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-stone-800 border border-stone-700 min-w-[80px] justify-center">
        <Icon className="w-3 h-3 text-stone-500" />
        <span className="text-stone-500">{label}</span>
      </div>
      <div className="flex-1 text-left">
        <span
          className={cn(
            advantage === "enemy" ? "text-red-400" : "text-stone-400"
          )}
        >
          {enemyValue}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// WIN CHANCE INDICATOR
// ============================================================================

function WinChanceIndicator({ chance }: { chance: number }) {
  let color = "#22c55e"; // green
  let label = "High";
  if (chance < 30) {
    color = "#ef4444";
    label = "Low";
  } else if (chance < 60) {
    color = "#f59e0b";
    label = "Medium";
  } else if (chance < 80) {
    color = "#84cc16";
    label = "Good";
  }

  return (
    <div className="text-center">
      <div className="text-[10px] font-mono text-stone-500 mb-1">WIN CHANCE</div>
      <div
        className="text-2xl font-mono font-bold"
        style={{ color }}
      >
        {chance}%
      </div>
      <div
        className="text-xs font-mono"
        style={{ color }}
      >
        {label}
      </div>
    </div>
  );
}

// ============================================================================
// REWARDS PREVIEW
// ============================================================================

function RewardsPreview({ enemy }: { enemy: EnemyPreview }) {
  return (
    <div className="bg-stone-900/50 border border-stone-700 p-3">
      <div className="text-[10px] font-mono text-stone-500 mb-2">
        POTENTIAL REWARDS
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Star className="w-3 h-3 text-purple-400" />
          <span className="text-purple-400">{enemy.xpReward} XP</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">
            {enemy.goldReward.min}-{enemy.goldReward.max}g
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-stone-700">
        <div className="text-[10px] text-stone-500 mb-1">Loot Chances:</div>
        <div className="flex gap-2 text-[10px] font-mono">
          {enemy.lootChance.epic > 0 && (
            <span className="text-[#a335ee]">{enemy.lootChance.epic}% Epic</span>
          )}
          {enemy.lootChance.rare > 0 && (
            <span className="text-[#0070dd]">{enemy.lootChance.rare}% Rare</span>
          )}
          {enemy.lootChance.uncommon > 0 && (
            <span className="text-[#1eff00]">{enemy.lootChance.uncommon}% Uncommon</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMBAT PREVIEW COMPONENT
// ============================================================================

interface CombatPreviewProps {
  player: PlayerPreview;
  enemy: EnemyPreview;
  onStartCombat: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CombatPreview({
  player,
  enemy,
  onStartCombat,
  onCancel,
  isLoading = false,
}: CombatPreviewProps) {
  const levelDiff = player.level - enemy.level;
  const typeConfig = ENEMY_TYPE_CONFIG[enemy.type];

  return (
    <div className="bg-[#0a0908] border-2 border-stone-700 max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-stone-700 bg-stone-900/50">
        <div className="flex items-center justify-center gap-2">
          <Swords className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-mono font-bold text-red-500">
            COMBAT PREVIEW
          </h2>
          <Swords className="w-5 h-5 text-red-500" />
        </div>
      </div>

      {/* VS Display */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Player Side */}
          <div className="text-center">
            <div
              className="text-sm font-mono font-bold mb-2"
              style={{ color: CLASS_COLORS[player.characterClass] || "#f59e0b" }}
            >
              {player.name}
            </div>
            <div className="text-[10px] font-mono text-stone-500 mb-2">
              Lv.{player.level} {player.characterClass}
            </div>
            <ASCIIHealthBar
              current={player.health}
              max={player.maxHealth}
              width={12}
              color="#22c55e"
            />
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-red-600">VS</div>
            {levelDiff !== 0 && (
              <div
                className={cn(
                  "text-xs font-mono mt-1",
                  levelDiff > 0 ? "text-green-400" : "text-red-400"
                )}
              >
                {levelDiff > 0 ? `+${levelDiff}` : levelDiff} levels
              </div>
            )}
          </div>

          {/* Enemy Side */}
          <div className="text-center">
            <EnemyPortrait enemy={enemy} />
            <div className="mt-2">
              <ASCIIHealthBar
                current={enemy.health}
                max={enemy.maxHealth}
                width={12}
                color={typeConfig.color}
              />
            </div>
          </div>
        </div>

        {/* Stat Comparisons */}
        <div className="mt-6 space-y-2">
          <StatComparison
            label="HP"
            playerValue={player.maxHealth}
            enemyValue={enemy.maxHealth}
            icon={Heart}
          />
        </div>

        {/* Enemy Abilities */}
        {enemy.abilities.length > 0 && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50">
            <div className="text-[10px] font-mono text-red-400 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> ENEMY ABILITIES
            </div>
            <div className="flex flex-wrap gap-1">
              {enemy.abilities.map((ability) => (
                <span
                  key={ability}
                  className="text-[10px] font-mono px-2 py-0.5 bg-red-900/30 border border-red-900/50 text-red-300"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* Rewards */}
          <RewardsPreview enemy={enemy} />

          {/* Win Chance & Duration */}
          <div className="bg-stone-900/50 border border-stone-700 p-3 flex flex-col items-center justify-center">
            <WinChanceIndicator chance={player.winChance} />
            <div className="mt-2 text-[10px] font-mono text-stone-500">
              Est. Duration: {player.estimatedDuration}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-stone-700 bg-stone-900/30 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 font-mono text-sm bg-stone-800 border border-stone-600 text-stone-400 hover:bg-stone-700 transition-all"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onStartCombat}
          disabled={isLoading}
          className={cn(
            "flex-1 py-3 font-mono text-sm border-2 transition-all flex items-center justify-center gap-2",
            isLoading
              ? "bg-stone-800 border-stone-600 text-stone-500"
              : "bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50"
          )}
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Engaging...</span>
            </>
          ) : (
            <>
              <Swords className="w-4 h-4" />
              Start Combat
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// DEMO DATA
// ============================================================================

export const SAMPLE_PLAYER: PlayerPreview = {
  name: "Thoradin",
  level: 8,
  health: 450,
  maxHealth: 450,
  characterClass: "warrior",
  estimatedDamage: { min: 35, max: 55 },
  estimatedDuration: "45s",
  winChance: 78,
};

export const SAMPLE_ENEMY: EnemyPreview = {
  id: "kobold_1",
  name: "Kobold Tunneler",
  level: 6,
  health: 280,
  maxHealth: 280,
  type: "normal",
  abilities: ["Tunnel", "Pickaxe Strike"],
  xpReward: 125,
  goldReward: { min: 5, max: 12 },
  lootChance: {
    common: 80,
    uncommon: 15,
    rare: 4,
    epic: 1,
  },
};

export const SAMPLE_ELITE_ENEMY: EnemyPreview = {
  id: "defias_1",
  name: "Defias Pillager",
  level: 10,
  health: 650,
  maxHealth: 650,
  type: "elite",
  abilities: ["Fireball", "Fire Shield", "Flame Strike"],
  weaknesses: ["Frost"],
  resistances: ["Fire"],
  xpReward: 450,
  goldReward: { min: 25, max: 50 },
  lootChance: {
    common: 60,
    uncommon: 25,
    rare: 12,
    epic: 3,
  },
};

export function CombatPreviewDemo() {
  return (
    <div className="space-y-8">
      <CombatPreview
        player={SAMPLE_PLAYER}
        enemy={SAMPLE_ENEMY}
        onStartCombat={() => console.log("Start combat")}
        onCancel={() => console.log("Cancel")}
      />
      <CombatPreview
        player={{ ...SAMPLE_PLAYER, winChance: 45 }}
        enemy={SAMPLE_ELITE_ENEMY}
        onStartCombat={() => console.log("Start combat")}
        onCancel={() => console.log("Cancel")}
      />
    </div>
  );
}
