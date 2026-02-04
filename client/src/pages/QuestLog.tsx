import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import {
  Scroll,
  Target,
  Gift,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Circle,
  MapPin,
  Skull,
  Coins,
  Star,
} from "lucide-react";
import { QuestCardSkeleton } from "@/components/game/LoadingStates";
import { TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// ============================================================================
// QUEST LOG PAGE - Active quests with details and progress
// ============================================================================

// Quest objective types
type ObjectiveType = "kill" | "collect" | "explore" | "escort" | "talk";

interface QuestObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  current: number;
  required: number;
  completed: boolean;
}

interface QuestReward {
  type: "xp" | "gold" | "item" | "reputation";
  amount?: number;
  itemName?: string;
  itemRarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

interface Quest {
  id: string;
  name: string;
  description: string;
  zone: string;
  level: number;
  difficulty: "easy" | "normal" | "hard" | "elite";
  objectives: QuestObjective[];
  rewards: QuestReward[];
  isMainQuest: boolean;
  giver: string;
  turnInNpc: string;
}

// Note: Quest data is now fetched from the API via /api/quests/:questId

const DIFFICULTY_CONFIG: Record<string, { color: string; label: string }> = {
  easy: { color: "#22c55e", label: "Easy" },
  normal: { color: "#f59e0b", label: "Normal" },
  hard: { color: "#ef4444", label: "Hard" },
  elite: { color: "#a855f7", label: "Elite" },
};

const RARITY_COLORS: Record<string, string> = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

const OBJECTIVE_ICONS: Record<ObjectiveType, typeof Target> = {
  kill: Skull,
  collect: Gift,
  explore: MapPin,
  escort: ChevronRight,
  talk: Scroll,
};

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
}

// ============================================================================
// ASCII PROGRESS BAR
// ============================================================================

function ASCIIProgressBar({
  current,
  max,
  width = 20,
  filledChar = "█",
  emptyChar = "░",
  showText = true,
}: {
  current: number;
  max: number;
  width?: number;
  filledChar?: string;
  emptyChar?: string;
  showText?: boolean;
}) {
  const percent = max > 0 ? Math.min(1, current / max) : 0;
  const filled = Math.floor(percent * width);
  const empty = width - filled;
  const isComplete = current >= max;

  return (
    <div className="font-mono text-xs flex items-center gap-2">
      <span className={isComplete ? "text-green-400" : "text-amber-500"}>
        {filledChar.repeat(filled)}
      </span>
      <span className="text-stone-600">{emptyChar.repeat(empty)}</span>
      {showText && (
        <span className={isComplete ? "text-green-400" : "text-stone-400"}>
          {current}/{max}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// QUEST CARD COMPONENT
// ============================================================================

function QuestCard({
  quest,
  isSelected,
  onClick,
}: {
  quest: Quest;
  isSelected: boolean;
  onClick: () => void;
}) {
  const totalObjectives = quest.objectives.length;
  const completedObjectives = quest.objectives.filter((o) => o.completed).length;
  const isReadyToTurnIn = completedObjectives === totalObjectives;
  const difficultyConfig = DIFFICULTY_CONFIG[quest.difficulty];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 border-2 transition-all",
        isSelected
          ? "bg-amber-900/30 border-amber-600"
          : "bg-stone-900/50 border-stone-700 hover:border-stone-600"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {quest.isMainQuest && (
              <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            )}
            <h3
              className={cn(
                "font-mono text-sm truncate",
                isReadyToTurnIn ? "text-green-400" : "text-yellow-400"
              )}
            >
              {quest.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-stone-500">
              Lv.{quest.level}
            </span>
            <span
              className="text-[10px] font-mono px-1"
              style={{
                color: difficultyConfig.color,
                backgroundColor: `${difficultyConfig.color}20`,
              }}
            >
              {difficultyConfig.label}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div
            className={cn(
              "text-xs font-mono",
              isReadyToTurnIn ? "text-green-400" : "text-stone-400"
            )}
          >
            {completedObjectives}/{totalObjectives}
          </div>
          {isReadyToTurnIn && (
            <div className="text-[10px] text-green-500 font-mono">READY</div>
          )}
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// QUEST DETAILS PANEL
// ============================================================================

function QuestDetails({
  quest,
  onAbandon,
  onComplete,
  isCompleting,
}: {
  quest: Quest;
  onAbandon: () => void;
  onComplete: () => void;
  isCompleting: boolean;
}) {
  const totalObjectives = quest.objectives.length;
  const completedObjectives = quest.objectives.filter((o) => o.completed).length;
  const isReadyToTurnIn = completedObjectives === totalObjectives;
  const difficultyConfig = DIFFICULTY_CONFIG[quest.difficulty];

  return (
    <div className="bg-stone-900/50 border-2 border-stone-700 h-full flex flex-col">
      {/* Header */}
      <div
        className="p-4 border-b border-stone-700"
        style={{ borderLeftWidth: 4, borderLeftColor: difficultyConfig.color }}
      >
        <div className="flex items-center gap-2 mb-1">
          {quest.isMainQuest && <Star className="w-4 h-4 text-yellow-400" />}
          <h2
            className={cn(
              "text-lg font-bold font-mono",
              isReadyToTurnIn ? "text-green-400" : "text-yellow-400"
            )}
          >
            {quest.name}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-stone-500">Level {quest.level}</span>
          <span
            className="px-2 py-0.5"
            style={{
              color: difficultyConfig.color,
              backgroundColor: `${difficultyConfig.color}20`,
            }}
          >
            {difficultyConfig.label}
          </span>
          <span className="text-stone-500">{quest.zone}</span>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 border-b border-stone-700">
        <p className="text-sm text-stone-400 leading-relaxed">
          {quest.description}
        </p>
        <div className="mt-3 flex gap-4 text-xs font-mono text-stone-500">
          <span>
            Quest Giver: <span className="text-stone-400">{quest.giver}</span>
          </span>
          <span>
            Turn In: <span className="text-stone-400">{quest.turnInNpc}</span>
          </span>
        </div>
      </div>

      {/* Objectives */}
      <div className="p-4 border-b border-stone-700 flex-1">
        <div className="text-[10px] text-stone-500 font-mono mb-3 flex items-center gap-1">
          <Target className="w-3 h-3" /> OBJECTIVES
        </div>
        <div className="space-y-3">
          {quest.objectives.map((objective) => {
            const IconComponent = OBJECTIVE_ICONS[objective.type];
            return (
              <div
                key={objective.id}
                className={cn(
                  "p-2 border",
                  objective.completed
                    ? "bg-green-900/20 border-green-900/50"
                    : "bg-stone-800/50 border-stone-700"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {objective.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-500" />
                  )}
                  <IconComponent
                    className={cn(
                      "w-3 h-3",
                      objective.completed ? "text-green-500" : "text-stone-500"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-mono",
                      objective.completed
                        ? "text-green-400 line-through"
                        : "text-stone-300"
                    )}
                  >
                    {objective.description}
                  </span>
                </div>
                {!objective.completed && (
                  <div className="ml-6">
                    <ASCIIProgressBar
                      current={objective.current}
                      max={objective.required}
                      width={15}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      <div className="p-4 border-b border-stone-700">
        <div className="text-[10px] text-stone-500 font-mono mb-3 flex items-center gap-1">
          <Gift className="w-3 h-3" /> REWARDS
        </div>
        <div className="flex flex-wrap gap-2">
          {quest.rewards.map((reward, index) => {
            if (reward.type === "xp") {
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-900/30 border border-purple-900/50"
                >
                  <Star className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-mono text-purple-400">
                    {reward.amount} XP
                  </span>
                </div>
              );
            }
            if (reward.type === "gold") {
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-900/30 border border-yellow-900/50"
                >
                  <Coins className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs font-mono text-yellow-400">
                    {reward.amount}g
                  </span>
                </div>
              );
            }
            if (reward.type === "item") {
              const rarityColor = RARITY_COLORS[reward.itemRarity || "common"];
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 border"
                  style={{
                    backgroundColor: `${rarityColor}10`,
                    borderColor: `${rarityColor}50`,
                  }}
                >
                  <Gift className="w-3 h-3" style={{ color: rarityColor }} />
                  <span
                    className="text-xs font-mono"
                    style={{ color: rarityColor }}
                  >
                    {reward.itemName}
                  </span>
                </div>
              );
            }
            if (reward.type === "reputation") {
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-cyan-900/30 border border-cyan-900/50"
                >
                  <Star className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400">
                    +{reward.amount} Rep
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-2">
        {isReadyToTurnIn ? (
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className={cn(
              "flex-1 py-3 font-mono text-sm border-2 transition-all",
              isCompleting
                ? "bg-stone-800/50 border-stone-600 text-stone-500 cursor-wait"
                : "bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50"
            )}
          >
            {isCompleting ? "[ Completing... ]" : "[ Turn In Quest ]"}
          </button>
        ) : (
          <div className="flex-1 py-3 font-mono text-sm text-center bg-stone-800/50 border border-stone-700 text-stone-500">
            {completedObjectives}/{totalObjectives} Objectives Complete
          </div>
        )}
        <button
          onClick={onAbandon}
          className="px-4 py-3 font-mono text-sm bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/30 transition-all"
          title="Abandon Quest"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyQuestLog() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <Scroll className="w-16 h-16 text-stone-600 mb-4" />
      <h3 className="text-lg font-mono text-stone-400 mb-2">No Active Quests</h3>
      <p className="text-sm text-stone-500 max-w-sm">
        Visit zones and talk to NPCs to discover quests. Your adventure awaits!
      </p>
    </div>
  );
}

// ============================================================================
// MAIN QUEST LOG PAGE
// ============================================================================

export default function QuestLog() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const characterId = parseInt(params.id || "0");
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: character, isLoading: characterLoading, error: characterError } = useQuery({
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

  // Fetch active quests progress from API
  const { data: apiQuestProgress, isLoading: questsLoading, error: questsError } = useQuery({
    queryKey: ["activeQuests", characterId],
    queryFn: async () => {
      const response = await fetch(
        buildUrl(api.quests.active.path, { characterId })
      );
      if (!response.ok) throw new Error("Failed to fetch active quests");
      return response.json();
    },
    enabled: characterId > 0,
  });

  // Fetch quest definitions for each active quest
  const { data: questDefinitions, isLoading: definitionsLoading } = useQuery({
    queryKey: ["questDefinitions", apiQuestProgress?.map((p: any) => p.questId)],
    queryFn: async () => {
      if (!apiQuestProgress || apiQuestProgress.length === 0) return [];

      // Fetch each quest definition from the API
      const definitions = await Promise.all(
        apiQuestProgress.map(async (progress: any) => {
          const response = await fetch(
            buildUrl(api.quests.get.path, { questId: progress.questId })
          );
          if (!response.ok) return null;
          return response.json();
        })
      );
      return definitions.filter(Boolean);
    },
    enabled: apiQuestProgress && apiQuestProgress.length > 0,
  });

  // Map API quest progress + definitions to local Quest interface
  const quests: Quest[] =
    apiQuestProgress && apiQuestProgress.length > 0 && questDefinitions
      ? apiQuestProgress.map((progress: any) => {
          // Find matching quest definition from API
          const questDef = questDefinitions.find(
            (q: any) => q && q.id === progress.questId
          );

          if (questDef) {
            // Parse objectives from quest definition
            const objectives = (questDef.objectives || []) as Array<{
              type?: string;
              description?: string;
              target?: string;
              count?: number;
            }>;

            // Map objectives with current progress
            const mappedObjectives: QuestObjective[] = objectives.map((obj, idx) => ({
              id: `obj${idx}`,
              type: (obj.type as ObjectiveType) || "kill",
              description: obj.description || obj.target || "Complete objective",
              current: progress.progress?.[idx] ?? 0,
              required: obj.count ?? 1,
              completed: (progress.progress?.[idx] ?? 0) >= (obj.count ?? 1),
            }));

            // Build rewards from quest definition
            const rewards: QuestReward[] = [];
            if (questDef.xpReward) {
              rewards.push({ type: "xp", amount: questDef.xpReward });
            }
            if (questDef.goldReward) {
              rewards.push({ type: "gold", amount: questDef.goldReward });
            }
            // Item rewards would need another query to get item names, so just note count
            if (questDef.itemRewards && questDef.itemRewards.length > 0) {
              for (const itemId of questDef.itemRewards) {
                rewards.push({ type: "item", itemName: `Item #${itemId}`, itemRarity: "uncommon" });
              }
            }

            // Determine difficulty from quest level relative to character
            let difficulty: "easy" | "normal" | "hard" | "elite" = "normal";
            if (character && questDef.level) {
              const levelDiff = questDef.level - character.level;
              if (levelDiff <= -3) difficulty = "easy";
              else if (levelDiff >= 5) difficulty = "elite";
              else if (levelDiff >= 3) difficulty = "hard";
            }

            return {
              id: String(progress.questId),
              name: questDef.name || `Quest ${progress.questId}`,
              description: questDef.description || "No description available.",
              zone: questDef.zoneName || "Unknown",
              level: questDef.level || 1,
              difficulty,
              objectives: mappedObjectives,
              rewards,
              isMainQuest: questDef.type === "main" || questDef.isMainQuest || false,
              giver: questDef.giver || "Quest Giver",
              turnInNpc: questDef.turnInNpc || questDef.giver || "Quest Giver",
            };
          }

          // Fallback: create minimal quest object if definition not found
          return {
            id: String(progress.questId),
            name: `Quest ${progress.questId}`,
            description: "Quest details could not be loaded.",
            zone: "Unknown",
            level: 1,
            difficulty: "normal" as const,
            objectives: [],
            rewards: [],
            isMainQuest: false,
            giver: "Quest Giver",
            turnInNpc: "Quest Giver",
          };
        })
      : [];

  const selectedQuest = quests.find((q: Quest) => q.id === selectedQuestId);

  // Auto-select first quest if none selected
  if (!selectedQuestId && quests.length > 0) {
    setSelectedQuestId(quests[0].id);
  }

  // State for showing reward notification
  const [rewardNotification, setRewardNotification] = useState<{
    xp: number;
    gold: number;
    items: { name: string; rarity: string }[];
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  // Complete quest mutation
  const completeMutation = useMutation({
    mutationFn: async (questId: string) => {
      const response = await fetch(
        buildUrl(api.quests.complete.path, {
          characterId,
          questId: parseInt(questId),
        }),
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to complete quest");
      }
      return response.json() as Promise<{
        success: boolean;
        xpAwarded: number;
        goldAwarded: number;
        itemsAwarded: { id: number; name: string; rarity: string }[];
        leveledUp: boolean;
        newLevel?: number;
      }>;
    },
    onSuccess: (data) => {
      // Show reward notification
      setRewardNotification({
        xp: data.xpAwarded,
        gold: data.goldAwarded,
        items: data.itemsAwarded,
        leveledUp: data.leveledUp,
        newLevel: data.newLevel,
      });
      // Refresh quests and character data
      queryClient.invalidateQueries({ queryKey: ["activeQuests", characterId] });
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      // Clear selection
      setSelectedQuestId(null);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Abandon quest mutation
  const abandonMutation = useMutation({
    mutationFn: async (questId: string) => {
      const response = await fetch(
        buildUrl(api.quests.abandon.path, {
          characterId,
          questId: parseInt(questId),
        }),
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to abandon quest");
      return response.json();
    },
    onSuccess: () => {
      // Refresh active quests after abandoning
      queryClient.invalidateQueries({ queryKey: ["activeQuests", characterId] });
      // Clear selection if the abandoned quest was selected
      if (quests.length > 1) {
        setSelectedQuestId(quests[0].id === selectedQuestId ? quests[1].id : quests[0].id);
      } else {
        setSelectedQuestId(null);
      }
    },
  });

  const handleAbandon = (questId: string) => {
    if (window.confirm("Are you sure you want to abandon this quest?")) {
      abandonMutation.mutate(questId);
    }
  };

  if (characterLoading || questsLoading || definitionsLoading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-6 bg-stone-700/30 rounded animate-pulse"></div>
            <div className="w-48 h-6 bg-stone-700/30 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quest list skeleton */}
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <QuestCardSkeleton key={i} />
              ))}
            </div>

            {/* Quest detail skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-stone-900/50 border-2 border-stone-600 p-6">
                <div className="w-3/4 h-8 bg-stone-700/30 rounded mb-4 animate-pulse"></div>
                <div className="space-y-2 mb-6">
                  <div className="w-full h-4 bg-stone-700/30 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-stone-700/30 rounded animate-pulse"></div>
                  <div className="w-4/6 h-4 bg-stone-700/30 rounded animate-pulse"></div>
                </div>
                <div className="w-48 h-6 bg-stone-700/30 rounded mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full h-6 bg-stone-700/30 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (characterError || questsError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <pre className="font-mono text-xs leading-tight text-red-500">
{`╔════════════════════════════════╗
║      ERROR LOADING DATA        ║
╚════════════════════════════════╝`}
        </pre>
        <div className="text-red-400 font-mono text-sm max-w-md text-center">
          {characterError?.message || questsError?.message || "Failed to load quests"}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-amber-900/30 border border-amber-700 text-yellow-400 font-mono text-sm hover:bg-amber-900/50"
          >
            ← Back to Characters
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-900/30 border border-amber-700 text-yellow-400 font-mono text-sm hover:bg-amber-900/50"
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
          className="px-4 py-2 bg-amber-900/30 border border-amber-700 text-yellow-400 font-mono text-sm"
        >
          Back to Characters
        </button>
      </div>
    );
  }

  // Separate main quests and side quests
  const mainQuests = quests.filter((q: Quest) => q.isMainQuest);
  const sideQuests = quests.filter((q: Quest) => !q.isMainQuest);
  const readyQuests = quests.filter(
    (q: Quest) => q.objectives.every((o: QuestObjective) => o.completed)
  );

  return (
    <div className="min-h-screen bg-black text-stone-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <TerminalButton variant="secondary" onClick={() => navigate(`/game/${characterId}`)}>
            [←] Back
          </TerminalButton>
          <h1 className="text-xl font-bold text-yellow-400 font-mono uppercase tracking-wider">
            Quest Log
          </h1>
          <div className="w-24" />
        </div>

        {/* Character Info Bar */}
        <TerminalPanel variant="yellow" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-yellow-600 font-mono text-sm">Character:</span>{" "}
              <span className="text-yellow-400 font-mono">{character.name}</span>
            </div>
            <div>
              <span className="text-yellow-600 font-mono text-sm">Level:</span>{" "}
              <span className="text-green-400 font-mono">{character.level}</span>
            </div>
            <div>
              <span className="text-yellow-600 font-mono text-sm">Active:</span>{" "}
              <span className="text-yellow-400 font-mono">{quests.length}/25</span>
            </div>
            <div>
              <span className="text-yellow-600 font-mono text-sm">Ready:</span>{" "}
              <span className="text-green-400 font-mono">
                {readyQuests.length}
              </span>
            </div>
          </div>
        </TerminalPanel>

        {quests.length === 0 ? (
          <EmptyQuestLog />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quest List */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main Quests */}
              {mainQuests.length > 0 && (
                <div>
                  <div className="text-amber-500 font-mono text-xs mb-2 flex items-center gap-2">
                    <Star className="w-3 h-3" />
                    MAIN QUESTS ({mainQuests.length})
                  </div>
                  <div className="space-y-1">
                    {mainQuests.map((quest: Quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        isSelected={selectedQuestId === quest.id}
                        onClick={() => setSelectedQuestId(quest.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Side Quests */}
              {sideQuests.length > 0 && (
                <div>
                  <div className="text-stone-500 font-mono text-xs mb-2">
                    SIDE QUESTS ({sideQuests.length})
                  </div>
                  <div className="space-y-1">
                    {sideQuests.map((quest: Quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        isSelected={selectedQuestId === quest.id}
                        onClick={() => setSelectedQuestId(quest.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quest Details */}
            <div className="lg:col-span-2">
              {selectedQuest ? (
                <QuestDetails
                  quest={selectedQuest}
                  onAbandon={() => handleAbandon(selectedQuest.id)}
                  onComplete={() => completeMutation.mutate(selectedQuest.id)}
                  isCompleting={completeMutation.isPending}
                />
              ) : (
                <div className="bg-stone-900/50 border-2 border-stone-700 h-full flex items-center justify-center">
                  <p className="text-stone-500 font-mono">
                    Select a quest to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/game/${characterId}`)}
            className="px-6 py-2 bg-amber-900/30 border border-amber-700 text-yellow-400 font-mono text-sm hover:bg-amber-900/50 transition-colors"
          >
            Return to Game
          </button>
        </div>

        {/* Reward Notification Modal */}
        {rewardNotification && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-stone-900 border-2 border-green-700 p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <pre className="font-mono text-xs text-green-400 leading-tight mb-4">
{`╔══════════════════════════════════════╗
║        QUEST COMPLETE!               ║
╚══════════════════════════════════════╝`}
                </pre>

                {rewardNotification.leveledUp && (
                  <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700">
                    <div className="text-yellow-400 font-mono text-lg">
                      ★ LEVEL UP! ★
                    </div>
                    <div className="text-yellow-300 font-mono text-sm">
                      You are now level {rewardNotification.newLevel}!
                    </div>
                  </div>
                )}

                <div className="text-stone-400 font-mono text-sm mb-4">
                  Rewards Earned:
                </div>

                <div className="space-y-2 mb-6">
                  {rewardNotification.xp > 0 && (
                    <div className="flex items-center justify-center gap-2 text-purple-400 font-mono">
                      <Star className="w-4 h-4" />
                      <span>+{rewardNotification.xp} XP</span>
                    </div>
                  )}
                  {rewardNotification.gold > 0 && (
                    <div className="flex items-center justify-center gap-2 text-yellow-400 font-mono">
                      <Coins className="w-4 h-4" />
                      <span>+{rewardNotification.gold} Gold</span>
                    </div>
                  )}
                  {rewardNotification.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center gap-2 font-mono"
                      style={{ color: RARITY_COLORS[item.rarity] || RARITY_COLORS.common }}
                    >
                      <Gift className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setRewardNotification(null)}
                  className="px-6 py-2 bg-green-900/30 border border-green-700 text-green-400 font-mono text-sm hover:bg-green-900/50 transition-colors"
                >
                  [ Continue ]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
