import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import { Lock, MapPin, Skull, Star } from "lucide-react";
import { ZoneCardSkeleton } from "@/components/game/LoadingStates";
import { ASCIIHeader, TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// ============================================================================
// ZONE SELECTION PAGE - List of available zones
// ============================================================================

// Zone data (would come from shared/constants or API)
const ZONES = [
  {
    id: "elwynn_forest",
    name: "Elwynn Forest",
    levelRange: [1, 10],
    description: "The peaceful forests surrounding Stormwind. Home to wolves, kobolds, and the occasional bandit.",
    questCount: 12,
    difficulty: "easy",
    enemyTypes: ["Wolves", "Kobolds", "Defias"],
    rewards: ["Starter gear", "Basic crafting materials"],
    completionReward: "Access to Westfall",
  },
  {
    id: "westfall",
    name: "Westfall",
    levelRange: [10, 20],
    description: "Once fertile farmlands now overrun by the Defias Brotherhood. Deadmines lurks beneath.",
    questCount: 18,
    difficulty: "normal",
    enemyTypes: ["Defias", "Harvest Golems", "Gnolls"],
    rewards: ["Green-quality gear", "Deadmines access"],
    completionReward: "Access to Redridge Mountains",
  },
  {
    id: "redridge",
    name: "Redridge Mountains",
    levelRange: [15, 25],
    description: "A mountainous region besieged by orcs from Blackrock. The town of Lakeshire needs defenders.",
    questCount: 22,
    difficulty: "normal",
    enemyTypes: ["Blackrock Orcs", "Gnolls", "Murlocs"],
    rewards: ["Blue-quality chance", "Reputation tokens"],
    completionReward: "Access to Duskwood",
  },
  {
    id: "duskwood",
    name: "Duskwood",
    levelRange: [20, 30],
    description: "A cursed forest shrouded in eternal twilight. The undead and worgen roam freely here.",
    questCount: 25,
    difficulty: "hard",
    enemyTypes: ["Undead", "Worgen", "Spiders"],
    rewards: ["Rare drops", "Dark runes"],
    completionReward: "Access to Stranglethorn Vale",
  },
  {
    id: "stranglethorn",
    name: "Stranglethorn Vale",
    levelRange: [30, 45],
    description: "A vast jungle teeming with trolls, pirates, and exotic beasts. Danger lurks everywhere.",
    questCount: 35,
    difficulty: "hard",
    enemyTypes: ["Bloodscalp Trolls", "Pirates", "Tigers"],
    rewards: ["Epic chance", "Exotic materials"],
    completionReward: "Access to Blasted Lands",
  },
  {
    id: "blasted_lands",
    name: "Blasted Lands",
    levelRange: [45, 55],
    description: "A desolate wasteland corrupted by demonic energies. The Dark Portal looms on the horizon.",
    questCount: 20,
    difficulty: "very_hard",
    enemyTypes: ["Demons", "Corrupted Beasts", "Cultists"],
    rewards: ["Pre-raid gear", "Demonic essences"],
    completionReward: "Raid unlocks",
  },
];

const DIFFICULTY_COLORS: Record<string, { color: string; label: string }> = {
  easy: { color: "#22c55e", label: "Easy" },
  normal: { color: "#f59e0b", label: "Normal" },
  hard: { color: "#ef4444", label: "Hard" },
  very_hard: { color: "#a855f7", label: "Very Hard" },
};

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
}

// ============================================================================
// ZONE CARD COMPONENT
// ============================================================================

function ZoneCard({
  zone,
  characterLevel,
  onTravel,
}: {
  zone: typeof ZONES[0];
  characterLevel: number;
  onTravel: () => void;
}) {
  const [minLevel, maxLevel] = zone.levelRange;
  const isLocked = characterLevel < minLevel;
  const isHighLevel = characterLevel > maxLevel + 5;
  const difficultyConfig = DIFFICULTY_COLORS[zone.difficulty];

  // Calculate relative difficulty for this character
  let relativeDifficulty = "Normal";
  let relativeColor = "#f59e0b";
  if (characterLevel < minLevel) {
    relativeDifficulty = "Locked";
    relativeColor = "#6b7280";
  } else if (characterLevel < minLevel + 2) {
    relativeDifficulty = "Challenging";
    relativeColor = "#ef4444";
  } else if (characterLevel > maxLevel) {
    relativeDifficulty = "Trivial";
    relativeColor = "#22c55e";
  }

  return (
    <div
      className={cn(
        "bg-stone-900/50 border-2 transition-all",
        isLocked
          ? "border-stone-700 opacity-60"
          : "border-stone-600 hover:border-green-600"
      )}
    >
      {/* Zone Header */}
      <div
        className="p-4 border-b border-stone-700"
        style={{ borderLeftWidth: 4, borderLeftColor: difficultyConfig.color }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold font-mono text-green-400 flex items-center gap-2">
              {isLocked && <Lock className="w-4 h-4 text-stone-500" />}
              {zone.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono text-stone-500">
                Level {minLevel}-{maxLevel}
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ color: difficultyConfig.color, backgroundColor: `${difficultyConfig.color}20` }}
              >
                {difficultyConfig.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-500">
              <MapPin className="w-4 h-4" />
              <span className="font-mono text-sm">{zone.questCount}</span>
            </div>
            <div className="text-[10px] text-stone-500">Quests</div>
          </div>
        </div>
      </div>

      {/* Zone Description */}
      <div className="p-4">
        <p className="text-sm text-stone-400 mb-4">{zone.description}</p>

        {/* Enemy Types */}
        <div className="mb-3">
          <div className="text-[10px] text-stone-500 font-mono mb-1 flex items-center gap-1">
            <Skull className="w-3 h-3" /> ENEMIES
          </div>
          <div className="flex flex-wrap gap-1">
            {zone.enemyTypes.map((enemy) => (
              <span
                key={enemy}
                className="text-[10px] font-mono px-2 py-0.5 bg-red-900/30 border border-red-900/50 text-red-400"
              >
                {enemy}
              </span>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-4">
          <div className="text-[10px] text-stone-500 font-mono mb-1 flex items-center gap-1">
            <Star className="w-3 h-3" /> REWARDS
          </div>
          <div className="flex flex-wrap gap-1">
            {zone.rewards.map((reward) => (
              <span
                key={reward}
                className="text-[10px] font-mono px-2 py-0.5 bg-green-900/30 border border-amber-900/50 text-green-400"
              >
                {reward}
              </span>
            ))}
          </div>
        </div>

        {/* Your Status */}
        {!isLocked && (
          <div className="mb-4 p-2 bg-stone-800/50 border border-stone-700">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-stone-500">Your Level:</span>
              <span style={{ color: relativeColor }}>{characterLevel} ({relativeDifficulty})</span>
            </div>
          </div>
        )}

        {/* Travel Button */}
        {isLocked ? (
          <div className="text-center py-2 bg-stone-800/50 border border-stone-700">
            <span className="text-stone-500 font-mono text-sm">
              Requires Level {minLevel}
            </span>
          </div>
        ) : (
          <button
            onClick={onTravel}
            className={cn(
              "w-full py-3 font-mono text-sm border-2 transition-all",
              isHighLevel
                ? "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-500"
                : "bg-green-900/30 border-amber-700 text-green-400 hover:bg-amber-900/50"
            )}
          >
            {isHighLevel ? "Travel (Trivial)" : "Travel to Zone"}
          </button>
        )}
      </div>

      {/* Completion Reward */}
      {zone.completionReward && !isLocked && (
        <div className="px-4 pb-4">
          <div className="text-[10px] text-stone-600 font-mono">
            Complete all quests to unlock: <span className="text-green-400">{zone.completionReward}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN ZONE SELECTION PAGE
// ============================================================================

export default function ZoneSelection() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const characterId = parseInt(params.id || "0");
  const queryClient = useQueryClient();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'safe' | 'normal' | 'challenging' | 'heroic'>('normal');

  const { data: character, isLoading: charLoading, error: charError } = useQuery({
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

  // Fetch zones from API
  const { data: apiZones, isLoading: zonesLoading, error: zonesError } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const response = await fetch(api.zones.list.path);
      if (!response.ok) throw new Error("Failed to fetch zones");
      return response.json();
    },
  });

  // Fetch available quests for the character
  const { data: availableQuests } = useQuery({
    queryKey: ["availableQuests", characterId],
    queryFn: async () => {
      const response = await fetch(
        buildUrl(api.quests.available.path, { characterId })
      );
      if (!response.ok) return [];
      return response.json();
    },
    enabled: characterId > 0,
  });

  // Start questing activity mutation
  const startActivityMutation = useMutation({
    mutationFn: async ({ questId, difficulty }: { questId: number; difficulty: string }) => {
      const response = await fetch(
        buildUrl(api.activities.start.path, { characterId }),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityType: "questing",
            activityId: questId,
            difficulty,
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start activity");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      navigate(`/game/${characterId}`);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Map API zones to our format, fallback to mock data
  const zones = apiZones?.length > 0 ? apiZones.map((z: any) => ({
    id: z.id?.toString() || z.name?.toLowerCase().replace(/\s/g, '_'),
    name: z.name,
    levelRange: [z.minLevel || z.levelMin || 1, z.maxLevel || z.levelMax || 10] as [number, number],
    description: z.description || "An adventurous zone awaits.",
    questCount: z.questCount || 10,
    difficulty: z.difficulty || "normal",
    enemyTypes: z.enemyTypes || ["Various Creatures"],
    rewards: z.rewards || ["Experience", "Gold"],
    completionReward: z.completionReward,
    zoneId: z.id, // Keep numeric ID for quest lookup
  })) : ZONES;

  const handleTravel = (zoneId: string, numericZoneId?: number) => {
    // Find a quest in this zone to start
    const zoneQuests = availableQuests?.filter((q: any) => q.zoneId === numericZoneId) || [];

    if (zoneQuests.length > 0) {
      // Start activity with the first available quest from the zone
      startActivityMutation.mutate({
        questId: zoneQuests[0].id,
        difficulty: selectedDifficulty,
      });
    } else {
      // No quests available, just navigate
      navigate(`/game/${characterId}`);
    }
  };

  const isLoading = charLoading || zonesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-6 bg-stone-700/30 rounded animate-pulse"></div>
            <div className="w-48 h-6 bg-stone-700/30 rounded animate-pulse"></div>
          </div>

          {/* Available zones skeleton */}
          <div className="mb-8">
            <div className="w-48 h-8 bg-stone-700/30 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <ZoneCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (charError || zonesError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <pre className="font-mono text-xs leading-tight text-red-500">
{`╔════════════════════════════════╗
║      ERROR LOADING DATA        ║
╚════════════════════════════════╝`}
        </pre>
        <div className="text-red-400 font-mono text-sm max-w-md text-center">
          {charError?.message || zonesError?.message || "Failed to load zones"}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-900/30 border border-amber-700 text-green-400 font-mono text-sm hover:bg-amber-900/50"
          >
            ← Back to Characters
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-900/30 border border-amber-700 text-green-400 font-mono text-sm hover:bg-amber-900/50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-mono">Character not found</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-green-900/30 border border-amber-700 text-green-400 font-mono text-sm"
        >
          Back to Characters
        </button>
      </div>
    );
  }

  // Filter zones by unlock status
  const unlockedZones = zones.filter((z: typeof ZONES[0]) => character.level >= z.levelRange[0]);
  const lockedZones = zones.filter((z: typeof ZONES[0]) => character.level < z.levelRange[0]);

  return (
    <div className="min-h-screen bg-black text-stone-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <TerminalButton variant="secondary" onClick={() => navigate(`/game/${characterId}`)}>
            [←] Back
          </TerminalButton>
          <h1 className="text-xl font-bold text-yellow-400 font-mono uppercase tracking-wider">
            Zone Selection
          </h1>
          <div className="w-24" />
        </div>

        {/* Character Info Bar */}
        <TerminalPanel variant="green" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-green-600 font-mono text-sm">Character:</span>{" "}
              <span className="text-green-400 font-mono">{character.name}</span>
            </div>
            <div>
              <span className="text-green-600 font-mono text-sm">Level:</span>{" "}
              <span className="text-yellow-400 font-mono">{character.level}</span>
            </div>
            <div>
              <span className="text-green-600 font-mono text-sm">Zones:</span>{" "}
              <span className="text-cyan-400 font-mono">{unlockedZones.length}/{zones.length}</span>
            </div>
          </div>
        </TerminalPanel>

        {/* Available Zones */}
        {unlockedZones.length > 0 && (
          <div className="mb-8">
            <h2 className="text-green-400 font-mono text-sm mb-4 uppercase">
              ═══ Available Zones ═══
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedZones.map((zone: any) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  characterLevel={character.level}
                  onTravel={() => handleTravel(zone.id, zone.zoneId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Zones */}
        {lockedZones.length > 0 && (
          <div>
            <h2 className="text-green-700 font-mono text-sm mb-4 uppercase">
              ═══ Locked Zones ═══
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedZones.map((zone: typeof ZONES[0]) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  characterLevel={character.level}
                  onTravel={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <TerminalButton variant="primary" onClick={() => navigate(`/game/${characterId}`)}>
            [▶] Return to Game
          </TerminalButton>
          <pre className="text-green-800 text-xs leading-tight mt-4">
            {"═".repeat(50)}
          </pre>
        </div>
      </div>
    </div>
  );
}
