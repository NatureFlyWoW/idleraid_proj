import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import {
  ArrowLeft,
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

// Sample quest data (would come from API)
const SAMPLE_QUESTS: Quest[] = [
  {
    id: "kobold_candles",
    name: "Kobold Candles",
    description:
      "The Kobolds in Echo Ridge Mine have been stealing candles from Northshire. Venture into the mine and recover the stolen candles from the kobold workers.",
    zone: "Elwynn Forest",
    level: 3,
    difficulty: "easy",
    objectives: [
      {
        id: "obj1",
        type: "collect",
        description: "Collect Large Candles",
        current: 6,
        required: 8,
        completed: false,
      },
      {
        id: "obj2",
        type: "kill",
        description: "Kill Kobold Workers",
        current: 10,
        required: 10,
        completed: true,
      },
    ],
    rewards: [
      { type: "xp", amount: 450 },
      { type: "gold", amount: 75 },
      { type: "item", itemName: "Kobold Mining Boots", itemRarity: "uncommon" },
    ],
    isMainQuest: false,
    giver: "Marshal McBride",
    turnInNpc: "Marshal McBride",
  },
  {
    id: "wolves_at_gate",
    name: "Wolves at the Gate",
    description:
      "The wolf population around Northshire has grown out of control. Thin their numbers before they threaten the abbey's livestock.",
    zone: "Elwynn Forest",
    level: 2,
    difficulty: "easy",
    objectives: [
      {
        id: "obj1",
        type: "kill",
        description: "Kill Young Wolves",
        current: 8,
        required: 8,
        completed: true,
      },
    ],
    rewards: [
      { type: "xp", amount: 250 },
      { type: "gold", amount: 35 },
    ],
    isMainQuest: false,
    giver: "Deputy Willem",
    turnInNpc: "Deputy Willem",
  },
  {
    id: "defias_messenger",
    name: "The Defias Messenger",
    description:
      "Intelligence reports indicate a Defias messenger will be passing through Elwynn Forest tonight. Intercept the messenger and retrieve any documents they carry. This could be the key to unraveling the Brotherhood's plans.",
    zone: "Elwynn Forest",
    level: 8,
    difficulty: "hard",
    objectives: [
      {
        id: "obj1",
        type: "kill",
        description: "Kill the Defias Messenger",
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: "obj2",
        type: "collect",
        description: "Recover Defias Documents",
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      { type: "xp", amount: 900 },
      { type: "gold", amount: 150 },
      { type: "item", itemName: "Spy's Cloak", itemRarity: "rare" },
      { type: "reputation", amount: 250 },
    ],
    isMainQuest: true,
    giver: "Spymaster Mathias Shaw",
    turnInNpc: "Spymaster Mathias Shaw",
  },
  {
    id: "crystal_kelp",
    name: "Crystal Kelp Collection",
    description:
      "The alchemists at the abbey need Crystal Kelp from the lake to brew healing potions. Dive into Crystal Lake and gather what they need.",
    zone: "Elwynn Forest",
    level: 5,
    difficulty: "normal",
    objectives: [
      {
        id: "obj1",
        type: "collect",
        description: "Collect Crystal Kelp",
        current: 3,
        required: 12,
        completed: false,
      },
    ],
    rewards: [
      { type: "xp", amount: 350 },
      { type: "gold", amount: 50 },
      { type: "item", itemName: "Minor Healing Potion", itemRarity: "common" },
      { type: "item", itemName: "Minor Healing Potion", itemRarity: "common" },
    ],
    isMainQuest: false,
    giver: "Brother Neals",
    turnInNpc: "Brother Neals",
  },
];

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
              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
            )}
            <h3
              className={cn(
                "font-mono text-sm truncate",
                isReadyToTurnIn ? "text-green-400" : "text-amber-400"
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
}: {
  quest: Quest;
  onAbandon: () => void;
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
          {quest.isMainQuest && <Star className="w-4 h-4 text-amber-400" />}
          <h2
            className={cn(
              "text-lg font-bold font-mono",
              isReadyToTurnIn ? "text-green-400" : "text-amber-400"
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
          <button className="flex-1 py-3 font-mono text-sm bg-green-900/30 border-2 border-green-700 text-green-400 hover:bg-green-900/50 transition-all">
            Turn In Quest
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

  const { data: character, isLoading: characterLoading } = useQuery({
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

  // Fetch active quests from API
  const { data: apiQuestProgress, isLoading: questsLoading } = useQuery({
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

  // Map API quest progress to local Quest interface
  // Note: API returns CharacterQuestProgress[], we map to Quest[] with sample data as fallback
  const quests =
    apiQuestProgress && apiQuestProgress.length > 0
      ? apiQuestProgress.map((progress: any) => {
          // Find matching sample quest or create a basic one
          const sampleQuest = SAMPLE_QUESTS.find(
            (q) => q.id === String(progress.questId)
          );
          if (sampleQuest) {
            // Update objectives progress from API
            return {
              ...sampleQuest,
              objectives: sampleQuest.objectives.map((obj, idx) => ({
                ...obj,
                current: progress.progress?.[idx] ?? 0,
                completed: progress.progress?.[idx] >= obj.required,
              })),
            };
          }
          // Fallback: create minimal quest object
          return {
            id: String(progress.questId),
            name: `Quest ${progress.questId}`,
            description: "Quest details loading...",
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
      : SAMPLE_QUESTS; // Fallback to sample data

  const selectedQuest = quests.find((q) => q.id === selectedQuestId);

  // Auto-select first quest if none selected
  if (!selectedQuestId && quests.length > 0) {
    setSelectedQuestId(quests[0].id);
  }

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

  if (characterLoading || questsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-500 font-mono animate-pulse">
          Loading quests...
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

  // Separate main quests and side quests
  const mainQuests = quests.filter((q) => q.isMainQuest);
  const sideQuests = quests.filter((q) => !q.isMainQuest);
  const readyQuests = quests.filter(
    (q) => q.objectives.every((o) => o.completed)
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
            QUEST LOG
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
            <span className="text-stone-500 font-mono text-sm">
              Active Quests:
            </span>{" "}
            <span className="text-amber-400 font-mono">{quests.length}/25</span>
          </div>
          <div>
            <span className="text-stone-500 font-mono text-sm">Ready:</span>{" "}
            <span className="text-green-400 font-mono">
              {readyQuests.length}
            </span>
          </div>
        </div>

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
                    {mainQuests.map((quest) => (
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
                    {sideQuests.map((quest) => (
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
            className="px-6 py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-sm hover:bg-amber-900/50 transition-colors"
          >
            Return to Game
          </button>
        </div>
      </div>
    </div>
  );
}
