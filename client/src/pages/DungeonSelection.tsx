import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import {
  ArrowLeft,
  Lock,
  Castle,
  Skull,
  Star,
  Users,
  Clock,
  Gift,
  AlertTriangle,
  ChevronRight,
  Trophy,
} from "lucide-react";

// ============================================================================
// DUNGEON SELECTION PAGE - List of available dungeons
// ============================================================================

type DungeonDifficulty = "normal" | "heroic" | "mythic";

interface DungeonBoss {
  name: string;
  level: number;
  abilities: string[];
}

interface DungeonData {
  id: string;
  name: string;
  shortName: string;
  levelRange: [number, number];
  description: string;
  location: string;
  bosses: DungeonBoss[];
  difficulty: DungeonDifficulty;
  estimatedDuration: string; // e.g. "30-45 min"
  recommendedPartySize: number;
  rewards: {
    xpRange: [number, number];
    goldRange: [number, number];
    lootLevel: "green" | "blue" | "purple";
    uniqueDrops: string[];
  };
  unlockRequirement?: string;
  completionCount?: number;
  bestTime?: number; // in seconds
}

// Sample dungeon data
const DUNGEONS: DungeonData[] = [
  {
    id: "deadmines",
    name: "The Deadmines",
    shortName: "DM",
    levelRange: [15, 21],
    description:
      "Deep beneath the town of Moonbrook lies an intricate network of tunnels where the Defias Brotherhood has built a massive underground fortress. At its heart, Edwin VanCleef and his crew are constructing a juggernaut to assault Stormwind.",
    location: "Westfall",
    bosses: [
      { name: "Rhahk'Zor", level: 17, abilities: ["Strike", "Slam"] },
      { name: "Sneed's Shredder", level: 18, abilities: ["Distracting Pain", "Eject Sneed"] },
      { name: "Gilnid", level: 19, abilities: ["Molten Metal", "Melt Ore"] },
      { name: "Mr. Smite", level: 20, abilities: ["Smite Slam", "Stomp", "Weapon Swap"] },
      { name: "Edwin VanCleef", level: 21, abilities: ["Thrash", "Assassin's Blade", "Summon Adds"] },
    ],
    difficulty: "normal",
    estimatedDuration: "30-45 min",
    recommendedPartySize: 5,
    rewards: {
      xpRange: [2500, 4000],
      goldRange: [50, 100],
      lootLevel: "blue",
      uniqueDrops: ["Defias Armor Set", "Cookie's Stirring Rod", "Smite's Mighty Hammer"],
    },
    completionCount: 3,
    bestTime: 1845, // 30:45
  },
  {
    id: "wailing_caverns",
    name: "Wailing Caverns",
    shortName: "WC",
    levelRange: [15, 25],
    description:
      "The Wailing Caverns were once a fertile oasis, but the Emerald Nightmare has twisted the druids who tended it into the Druids of the Fang. They now serve a mysterious creature deep within the caves.",
    location: "The Barrens",
    bosses: [
      { name: "Lady Anacondra", level: 18, abilities: ["Lightning Bolt", "Sleep", "Thorns Aura"] },
      { name: "Lord Cobrahn", level: 19, abilities: ["Poison", "Cobrahn Serpent Form", "Healing Touch"] },
      { name: "Kresh", level: 18, abilities: ["Snap", "Shell Shield"] },
      { name: "Lord Pythas", level: 20, abilities: ["Thunder Clap", "Healing Touch", "Lightning Bolt"] },
      { name: "Skum", level: 20, abilities: ["Chained Bolt", "Skum Spit"] },
      { name: "Lord Serpentis", level: 21, abilities: ["Lightning Bolt", "Sleep", "Serpentis Serpent Form"] },
      { name: "Verdan the Everliving", level: 22, abilities: ["Grasping Vines", "Entangle"] },
      { name: "Mutanus the Devourer", level: 22, abilities: ["Devour", "Terrify", "Thundercrack"] },
    ],
    difficulty: "normal",
    estimatedDuration: "45-60 min",
    recommendedPartySize: 5,
    rewards: {
      xpRange: [3000, 5000],
      goldRange: [60, 120],
      lootLevel: "blue",
      uniqueDrops: ["Armor of the Fang", "Glowing Lizardscale Cloak", "Serpent's Shoulders"],
    },
  },
  {
    id: "shadowfang_keep",
    name: "Shadowfang Keep",
    shortName: "SFK",
    levelRange: [18, 25],
    description:
      "Built by Baron Silverlaine, Shadowfang Keep now serves as the stronghold of Arugal, a mad wizard who has unleashed the worgen curse upon Silverpine Forest. Dark magic permeates every stone.",
    location: "Silverpine Forest",
    bosses: [
      { name: "Baron Ashbury", level: 20, abilities: ["Mend Rotten Flesh", "Dark Archangel Form"] },
      { name: "Baron Silverlaine", level: 21, abilities: ["Cursed Veil", "Veil of Shadow"] },
      { name: "Commander Springvale", level: 21, abilities: ["Holy Light", "Desecration"] },
      { name: "Lord Walden", level: 22, abilities: ["Conjure Poisonous Mixture", "Frost Mixture", "Ice Shards"] },
      { name: "Lord Godfrey", level: 23, abilities: ["Cursed Bullets", "Pistol Barrage", "Mortal Wound"] },
    ],
    difficulty: "normal",
    estimatedDuration: "35-50 min",
    recommendedPartySize: 5,
    rewards: {
      xpRange: [3500, 5500],
      goldRange: [75, 140],
      lootLevel: "blue",
      uniqueDrops: ["Arugal's Robes", "Worgen Hunter's Helm", "Shadowfang"],
    },
    unlockRequirement: "Complete Deadmines",
  },
  {
    id: "blackfathom_deeps",
    name: "Blackfathom Deeps",
    shortName: "BFD",
    levelRange: [20, 30],
    description:
      "These flooded ruins of an ancient temple to Elune have become home to naga, twilight cultists, and creatures corrupted by the Old Gods. Something ancient stirs in the depths below.",
    location: "Ashenvale",
    bosses: [
      { name: "Ghamoo-ra", level: 24, abilities: ["Snap", "Thrash"] },
      { name: "Lady Sarevess", level: 25, abilities: ["Forked Lightning", "Frost Nova", "Slow"] },
      { name: "Gelihast", level: 26, abilities: ["Net", "Strike"] },
      { name: "Twilight Lord Kelris", level: 27, abilities: ["Mind Blast", "Sleep", "Mind Control"] },
      { name: "Aku'mai", level: 28, abilities: ["Frenzy", "Poison Cloud"] },
    ],
    difficulty: "normal",
    estimatedDuration: "40-55 min",
    recommendedPartySize: 5,
    rewards: {
      xpRange: [4000, 6500],
      goldRange: [90, 175],
      lootLevel: "blue",
      uniqueDrops: ["Rod of the Sleepwalker", "Tortoise Armor", "Strike of the Hydra"],
    },
    unlockRequirement: "Reach level 20",
  },
  {
    id: "stockade",
    name: "The Stockade",
    shortName: "Stocks",
    levelRange: [22, 30],
    description:
      "The Stockade is a high-security prison built beneath Stormwind. A recent riot has left the guards overwhelmed and the Defias prisoners running amok through the cell blocks.",
    location: "Stormwind City",
    bosses: [
      { name: "Randolph Moloch", level: 26, abilities: ["Vanish", "Wildly Stabbing", "Sweep"] },
      { name: "Lord Overheat", level: 27, abilities: ["Overheat", "Fire Storm", "Enrage"] },
      { name: "Hogger", level: 28, abilities: ["Vicious Slice", "Maddening Call", "Enrage"] },
    ],
    difficulty: "normal",
    estimatedDuration: "20-30 min",
    recommendedPartySize: 5,
    rewards: {
      xpRange: [2000, 3500],
      goldRange: [40, 80],
      lootLevel: "green",
      uniqueDrops: ["Prison Shank", "Defias Brotherhood Vest"],
    },
    unlockRequirement: "Reach level 22",
  },
];

const DIFFICULTY_CONFIG: Record<DungeonDifficulty, { color: string; label: string }> = {
  normal: { color: "#22c55e", label: "Normal" },
  heroic: { color: "#3b82f6", label: "Heroic" },
  mythic: { color: "#a855f7", label: "Mythic" },
};

const LOOT_LEVEL_CONFIG: Record<string, { color: string; label: string }> = {
  green: { color: "#1eff00", label: "Uncommon" },
  blue: { color: "#0070dd", label: "Rare" },
  purple: { color: "#a335ee", label: "Epic" },
};

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
}

// ============================================================================
// ASCII DUNGEON PORTAL
// ============================================================================

function DungeonPortal({ isLocked }: { isLocked: boolean }) {
  if (isLocked) {
    return (
      <pre className="font-mono text-[10px] leading-none text-stone-600">
{`    ╔═══════╗
    ║ ░░░░░ ║
    ║ ░ ▓ ░ ║
    ║ ░░░░░ ║
    ╚═══════╝`}
      </pre>
    );
  }
  return (
    <pre className="font-mono text-[10px] leading-none text-amber-600">
{`    ╔═══════╗
    ║ ▒▒▒▒▒ ║
    ║ ▒ ▓ ▒ ║
    ║ ▒▒▒▒▒ ║
    ╚═══════╝`}
    </pre>
  );
}

// ============================================================================
// DUNGEON CARD COMPONENT
// ============================================================================

function DungeonCard({
  dungeon,
  characterLevel,
  onEnter,
}: {
  dungeon: DungeonData;
  characterLevel: number;
  onEnter: () => void;
}) {
  const [minLevel, maxLevel] = dungeon.levelRange;
  const isLocked = characterLevel < minLevel;
  const isOverleveled = characterLevel > maxLevel + 5;
  const difficultyConfig = DIFFICULTY_CONFIG[dungeon.difficulty];
  const lootConfig = LOOT_LEVEL_CONFIG[dungeon.rewards.lootLevel];

  return (
    <div
      className={cn(
        "bg-stone-900/50 border-2 transition-all",
        isLocked
          ? "border-stone-700 opacity-60"
          : "border-stone-600 hover:border-amber-700"
      )}
    >
      {/* Header */}
      <div
        className="p-4 border-b border-stone-700"
        style={{ borderLeftWidth: 4, borderLeftColor: difficultyConfig.color }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <DungeonPortal isLocked={isLocked} />
            <div>
              <h3 className="text-lg font-bold font-mono text-amber-400 flex items-center gap-2">
                {isLocked && <Lock className="w-4 h-4 text-stone-500" />}
                {dungeon.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-mono text-stone-500">
                  [{dungeon.shortName}]
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Level {minLevel}-{maxLevel}
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    color: difficultyConfig.color,
                    backgroundColor: `${difficultyConfig.color}20`,
                  }}
                >
                  {difficultyConfig.label}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs font-mono">
            <div className="flex items-center gap-1 text-stone-400">
              <Clock className="w-3 h-3" />
              <span>{dungeon.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-400 mt-1">
              <Users className="w-3 h-3" />
              <span>{dungeon.recommendedPartySize} players</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm text-stone-400 mb-4 line-clamp-2">
          {dungeon.description}
        </p>

        {/* Bosses */}
        <div className="mb-3">
          <div className="text-[10px] text-stone-500 font-mono mb-1 flex items-center gap-1">
            <Skull className="w-3 h-3" /> BOSSES ({dungeon.bosses.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {dungeon.bosses.slice(0, 4).map((boss) => (
              <span
                key={boss.name}
                className="text-[10px] font-mono px-2 py-0.5 bg-red-900/30 border border-red-900/50 text-red-400"
              >
                {boss.name}
              </span>
            ))}
            {dungeon.bosses.length > 4 && (
              <span className="text-[10px] font-mono px-2 py-0.5 text-stone-500">
                +{dungeon.bosses.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Rewards Preview */}
        <div className="mb-4">
          <div className="text-[10px] text-stone-500 font-mono mb-1 flex items-center gap-1">
            <Gift className="w-3 h-3" /> REWARDS
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <span className="text-purple-400">
              {dungeon.rewards.xpRange[0]}-{dungeon.rewards.xpRange[1]} XP
            </span>
            <span className="text-yellow-400">
              {dungeon.rewards.goldRange[0]}-{dungeon.rewards.goldRange[1]}g
            </span>
            <span style={{ color: lootConfig.color }}>
              {lootConfig.label} Gear
            </span>
          </div>
        </div>

        {/* Completion Stats */}
        {dungeon.completionCount !== undefined && dungeon.completionCount > 0 && (
          <div className="mb-4 p-2 bg-stone-800/50 border border-stone-700 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1 text-stone-400">
              <Trophy className="w-3 h-3" />
              <span>Completed {dungeon.completionCount}x</span>
            </div>
            {dungeon.bestTime && (
              <span className="text-amber-400">
                Best: {Math.floor(dungeon.bestTime / 60)}:{String(dungeon.bestTime % 60).padStart(2, "0")}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        {isLocked ? (
          <div className="text-center py-2 bg-stone-800/50 border border-stone-700">
            <span className="text-stone-500 font-mono text-sm">
              {dungeon.unlockRequirement || `Requires Level ${minLevel}`}
            </span>
          </div>
        ) : (
          <button
            onClick={onEnter}
            className={cn(
              "w-full py-3 font-mono text-sm border-2 transition-all flex items-center justify-center gap-2",
              isOverleveled
                ? "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-500"
                : "bg-amber-900/30 border-amber-700 text-amber-400 hover:bg-amber-900/50"
            )}
          >
            <Castle className="w-4 h-4" />
            {isOverleveled ? "Enter (Trivial)" : "Enter Dungeon"}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DUNGEON SELECTION PAGE
// ============================================================================

export default function DungeonSelection() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const characterId = parseInt(params.id || "0");

  const { data: character, isLoading } = useQuery({
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

  const handleEnterDungeon = (dungeonId: string) => {
    console.log(`Entering dungeon: ${dungeonId}`);
    // Would navigate to dungeon instance or start dungeon
    navigate(`/game/${characterId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-500 font-mono animate-pulse">
          Loading dungeons...
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-mono">Character not found</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-sm"
        >
          Back to Characters
        </button>
      </div>
    );
  }

  const unlockedDungeons = DUNGEONS.filter(
    (d) => character.level >= d.levelRange[0]
  );
  const lockedDungeons = DUNGEONS.filter(
    (d) => character.level < d.levelRange[0]
  );

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
            DUNGEON FINDER
          </h1>
          <div className="w-24" />
        </div>

        {/* Character Info Bar */}
        <div className="mb-6 bg-stone-900/50 border border-stone-700 p-4 flex items-center justify-between">
          <div>
            <span className="text-stone-500 font-mono text-sm">Character:</span>{" "}
            <span className="text-amber-400 font-mono">{character.name}</span>
          </div>
          <div>
            <span className="text-stone-500 font-mono text-sm">Level:</span>{" "}
            <span className="text-green-400 font-mono">{character.level}</span>
          </div>
          <div>
            <span className="text-stone-500 font-mono text-sm">Dungeons Available:</span>{" "}
            <span className="text-amber-400 font-mono">
              {unlockedDungeons.length}/{DUNGEONS.length}
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-900/50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs font-mono text-yellow-400">
            Dungeons are dangerous! Make sure you have potions and your equipment is repaired before entering.
          </p>
        </div>

        {/* Available Dungeons */}
        {unlockedDungeons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-amber-500 font-mono text-sm mb-4">
              ═══ AVAILABLE DUNGEONS ═══
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {unlockedDungeons.map((dungeon) => (
                <DungeonCard
                  key={dungeon.id}
                  dungeon={dungeon}
                  characterLevel={character.level}
                  onEnter={() => handleEnterDungeon(dungeon.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Dungeons */}
        {lockedDungeons.length > 0 && (
          <div>
            <h2 className="text-stone-500 font-mono text-sm mb-4">
              ═══ LOCKED DUNGEONS ═══
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lockedDungeons.map((dungeon) => (
                <DungeonCard
                  key={dungeon.id}
                  dungeon={dungeon}
                  characterLevel={character.level}
                  onEnter={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/game/${characterId}`)}
            className="px-6 py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-sm hover:bg-amber-900/50 transition-colors"
          >
            Return to Game
          </button>
        </div>
      </div>
    </div>
  );
}
