import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Skull,
  Star,
  Coins,
  Gift,
  ArrowUp,
  ChevronRight,
  Sparkles,
  Heart,
  Clock,
  Swords,
} from "lucide-react";

// ============================================================================
// COMBAT RESULTS - Post-combat summary screen
// ============================================================================

export interface LootItem {
  id: string;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type: "weapon" | "armor" | "accessory" | "consumable" | "material" | "quest";
  quantity: number;
  icon?: string;
}

export interface CombatResultsData {
  victory: boolean;
  enemyName: string;
  enemyLevel: number;
  playerName: string;
  playerClass: string;

  // Combat stats
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
  duration: number; // in seconds
  criticalHits: number;

  // Health remaining
  healthRemaining: number;
  maxHealth: number;

  // Rewards (only if victory)
  xpGained?: number;
  goldGained?: number;
  loot?: LootItem[];

  // Level up
  leveledUp?: boolean;
  newLevel?: number;
  previousXp?: number;
  currentXp?: number;
  xpToNextLevel?: number;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
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
// ASCII VICTORY/DEFEAT BANNERS
// ============================================================================

const VICTORY_BANNER = [
  "╔═══════════════════════════════════════╗",
  "║     ★ ★ ★  V I C T O R Y  ★ ★ ★      ║",
  "╚═══════════════════════════════════════╝",
];

const DEFEAT_BANNER = [
  "╔═══════════════════════════════════════╗",
  "║     ✖ ✖ ✖   D E F E A T   ✖ ✖ ✖      ║",
  "╚═══════════════════════════════════════╝",
];

const LEVEL_UP_BANNER = [
  "┌─────────────────────────────────┐",
  "│   ↑ ↑ ↑  L E V E L  U P  ↑ ↑ ↑  │",
  "└─────────────────────────────────┘",
];

// ============================================================================
// XP PROGRESS BAR
// ============================================================================

function XPProgressBar({
  previous,
  current,
  max,
  gained,
}: {
  previous: number;
  current: number;
  max: number;
  gained: number;
}) {
  const width = 30;
  const previousPercent = max > 0 ? previous / max : 0;
  const currentPercent = max > 0 ? current / max : 0;
  const previousFilled = Math.floor(previousPercent * width);
  const currentFilled = Math.floor(currentPercent * width);
  const gainedFilled = currentFilled - previousFilled;
  const empty = width - currentFilled;

  return (
    <div className="font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="text-stone-400">
          {"█".repeat(previousFilled)}
        </span>
        <span className="text-purple-400 animate-pulse">
          {"█".repeat(Math.max(0, gainedFilled))}
        </span>
        <span className="text-stone-700">{"░".repeat(empty)}</span>
      </div>
      <div className="flex justify-between mt-1 text-[10px]">
        <span className="text-stone-500">{current.toLocaleString()} XP</span>
        <span className="text-purple-400">+{gained.toLocaleString()}</span>
        <span className="text-stone-500">{max.toLocaleString()} XP</span>
      </div>
    </div>
  );
}

// ============================================================================
// STAT ROW
// ============================================================================

function StatRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Heart;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3" style={{ color }} />
        <span className="text-xs font-mono text-stone-500">{label}</span>
      </div>
      <span className="text-xs font-mono" style={{ color }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

// ============================================================================
// LOOT ITEM DISPLAY
// ============================================================================

function LootItemDisplay({ item }: { item: LootItem }) {
  const color = RARITY_COLORS[item.rarity];

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 border"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}50`,
      }}
    >
      <Gift className="w-3 h-3" style={{ color }} />
      <span className="text-xs font-mono" style={{ color }}>
        {item.name}
      </span>
      {item.quantity > 1 && (
        <span className="text-[10px] font-mono text-stone-500">
          x{item.quantity}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMBAT RESULTS COMPONENT
// ============================================================================

interface CombatResultsProps {
  results: CombatResultsData;
  onContinue: () => void;
  onRetry?: () => void; // Only shown on defeat
}

export function CombatResults({
  results,
  onContinue,
  onRetry,
}: CombatResultsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const classColor = CLASS_COLORS[results.playerClass] || "#f59e0b";

  // Health percentage for visual
  const healthPercent = results.maxHealth > 0
    ? (results.healthRemaining / results.maxHealth) * 100
    : 0;

  return (
    <div className="bg-[#0a0908] border-2 border-stone-700 max-w-lg mx-auto">
      {/* Banner */}
      <div
        className={cn(
          "p-4 text-center border-b border-stone-700",
          results.victory ? "bg-green-900/20" : "bg-red-900/20"
        )}
      >
        <pre
          className={cn(
            "font-mono text-sm leading-tight",
            results.victory ? "text-green-500" : "text-red-500"
          )}
        >
          {(results.victory ? VICTORY_BANNER : DEFEAT_BANNER).join("\n")}
        </pre>
      </div>

      {/* Enemy Defeated */}
      <div className="p-4 border-b border-stone-700">
        <div className="text-center">
          <span className="text-xs font-mono text-stone-500">
            {results.victory ? "ENEMY DEFEATED" : "DEFEATED BY"}
          </span>
          <div className="text-lg font-mono font-bold text-amber-400 mt-1">
            {results.enemyName}
          </div>
          <span className="text-xs font-mono text-stone-500">
            Level {results.enemyLevel}
          </span>
        </div>
      </div>

      {/* Level Up Banner */}
      {results.leveledUp && (
        <div className="p-4 border-b border-stone-700 bg-amber-900/20">
          <pre className="font-mono text-xs leading-tight text-amber-400 text-center">
            {LEVEL_UP_BANNER.join("\n")}
          </pre>
          <div className="text-center mt-2">
            <span className="text-2xl font-mono font-bold text-amber-400">
              Level {results.newLevel}
            </span>
          </div>
        </div>
      )}

      {/* Rewards (Victory Only) */}
      {results.victory && (
        <div className="p-4 border-b border-stone-700">
          <div className="text-[10px] font-mono text-stone-500 mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> REWARDS
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* XP */}
            {results.xpGained && (
              <div className="bg-purple-900/20 border border-purple-900/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-purple-400">
                  <Star className="w-4 h-4" />
                  <span className="text-lg font-mono font-bold">
                    +{results.xpGained.toLocaleString()}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-purple-300">
                  Experience
                </div>
              </div>
            )}

            {/* Gold */}
            {results.goldGained && results.goldGained > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-900/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                  <Coins className="w-4 h-4" />
                  <span className="text-lg font-mono font-bold">
                    +{results.goldGained.toLocaleString()}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-yellow-300">
                  Gold
                </div>
              </div>
            )}
          </div>

          {/* XP Progress Bar */}
          {results.previousXp !== undefined &&
           results.currentXp !== undefined &&
           results.xpToNextLevel !== undefined && (
            <div className="mb-4">
              <XPProgressBar
                previous={results.previousXp}
                current={results.currentXp}
                max={results.xpToNextLevel}
                gained={results.xpGained || 0}
              />
            </div>
          )}

          {/* Loot */}
          {results.loot && results.loot.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-stone-500 mb-2 flex items-center gap-1">
                <Gift className="w-3 h-3" /> LOOT
              </div>
              <div className="flex flex-wrap gap-1">
                {results.loot.map((item) => (
                  <LootItemDisplay key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Combat Stats (Collapsible) */}
      <div className="border-b border-stone-700">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-3 flex items-center justify-between text-stone-400 hover:text-stone-300 transition-colors"
        >
          <span className="text-xs font-mono">Combat Statistics</span>
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              showDetails && "rotate-90"
            )}
          />
        </button>

        {showDetails && (
          <div className="px-4 pb-4 space-y-1">
            <StatRow
              icon={Swords}
              label="Damage Dealt"
              value={results.damageDealt}
              color="#f59e0b"
            />
            <StatRow
              icon={Heart}
              label="Damage Taken"
              value={results.damageTaken}
              color="#ef4444"
            />
            {results.healingDone > 0 && (
              <StatRow
                icon={Heart}
                label="Healing Done"
                value={results.healingDone}
                color="#22c55e"
              />
            )}
            <StatRow
              icon={Star}
              label="Critical Hits"
              value={results.criticalHits}
              color="#ff8000"
            />
            <StatRow
              icon={Clock}
              label="Duration"
              value={`${results.duration}s`}
              color="#94a3b8"
            />
            <div className="pt-2 mt-2 border-t border-stone-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500">
                  Health Remaining
                </span>
                <span
                  className={cn(
                    "text-xs font-mono",
                    healthPercent > 50
                      ? "text-green-400"
                      : healthPercent > 25
                      ? "text-yellow-400"
                      : "text-red-400"
                  )}
                >
                  {results.healthRemaining}/{results.maxHealth} ({Math.round(healthPercent)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-3">
        {!results.victory && onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 py-3 font-mono text-sm bg-red-900/30 border border-red-700 text-red-400 hover:bg-red-900/50 transition-all flex items-center justify-center gap-2"
          >
            <Skull className="w-4 h-4" />
            Retry
          </button>
        )}
        <button
          onClick={onContinue}
          className={cn(
            "py-3 font-mono text-sm border-2 transition-all flex items-center justify-center gap-2",
            results.victory
              ? "flex-1 bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50"
              : !onRetry
              ? "flex-1 bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700"
              : "flex-1 bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700"
          )}
        >
          {results.victory ? (
            <>
              <Trophy className="w-4 h-4" />
              Continue
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Return to Town
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

export const SAMPLE_VICTORY_RESULTS: CombatResultsData = {
  victory: true,
  enemyName: "Kobold Tunneler",
  enemyLevel: 6,
  playerName: "Thoradin",
  playerClass: "warrior",
  damageDealt: 892,
  damageTaken: 156,
  healingDone: 0,
  duration: 34,
  criticalHits: 3,
  healthRemaining: 294,
  maxHealth: 450,
  xpGained: 125,
  goldGained: 8,
  loot: [
    { id: "1", name: "Large Candle", rarity: "common", type: "quest", quantity: 2 },
    { id: "2", name: "Kobold Mining Pick", rarity: "uncommon", type: "weapon", quantity: 1 },
  ],
  leveledUp: false,
  previousXp: 750,
  currentXp: 875,
  xpToNextLevel: 1000,
};

export const SAMPLE_LEVELUP_RESULTS: CombatResultsData = {
  victory: true,
  enemyName: "Defias Pillager",
  enemyLevel: 10,
  playerName: "Thoradin",
  playerClass: "warrior",
  damageDealt: 1856,
  damageTaken: 423,
  healingDone: 0,
  duration: 67,
  criticalHits: 7,
  healthRemaining: 127,
  maxHealth: 550,
  xpGained: 450,
  goldGained: 35,
  loot: [
    { id: "1", name: "Defias Bandana", rarity: "rare", type: "armor", quantity: 1 },
    { id: "2", name: "Red Silk Bandana", rarity: "uncommon", type: "material", quantity: 3 },
    { id: "3", name: "Healing Potion", rarity: "common", type: "consumable", quantity: 1 },
  ],
  leveledUp: true,
  newLevel: 9,
  previousXp: 800,
  currentXp: 250, // After level up, XP resets
  xpToNextLevel: 1200,
};

export const SAMPLE_DEFEAT_RESULTS: CombatResultsData = {
  victory: false,
  enemyName: "Hogger",
  enemyLevel: 11,
  playerName: "Thoradin",
  playerClass: "warrior",
  damageDealt: 534,
  damageTaken: 550,
  healingDone: 0,
  duration: 28,
  criticalHits: 2,
  healthRemaining: 0,
  maxHealth: 450,
};

export function CombatResultsDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-2">Victory</h3>
        <CombatResults
          results={SAMPLE_VICTORY_RESULTS}
          onContinue={() => console.log("Continue")}
        />
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-2">Victory + Level Up</h3>
        <CombatResults
          results={SAMPLE_LEVELUP_RESULTS}
          onContinue={() => console.log("Continue")}
        />
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-2">Defeat</h3>
        <CombatResults
          results={SAMPLE_DEFEAT_RESULTS}
          onContinue={() => console.log("Return to town")}
          onRetry={() => console.log("Retry")}
        />
      </div>
    </div>
  );
}
