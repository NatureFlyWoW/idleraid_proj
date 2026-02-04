import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { cn } from "@/lib/utils";
import { OfflineProgressModal, useOfflineProgress } from "@/components/game/OfflineProgressModal";
import { ASCIIHeader, TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// WoW Class colors
const classColors: Record<string, string> = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// Class icons
const classIcons: Record<string, string> = {
  warrior: "⚔",
  paladin: "✚",
  hunter: "⚑",
  rogue: "†",
  priest: "✞",
  mage: "★",
  druid: "❀",
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
  currentActivity: string | null;
  activityStartedAt: string | null;
  activityCompletesAt: string | null;
}

// ASCII Progress Bar
function ASCIIBar({
  current,
  max,
  width = 20,
  filledChar = "█",
  emptyChar = "░",
  color = "text-green-400",
}: {
  current: number;
  max: number;
  width?: number;
  filledChar?: string;
  emptyChar?: string;
  color?: string;
}) {
  const percent = max > 0 ? current / max : 0;
  const filled = Math.round(percent * width);
  const empty = width - filled;

  return (
    <span className={cn("font-mono", color)}>
      [{filledChar.repeat(filled)}
      <span className="text-stone-700">{emptyChar.repeat(empty)}</span>]
    </span>
  );
}

// Stat row with ASCII bar
function StatRow({
  label,
  current,
  max,
  color,
  showNumbers = true,
}: {
  label: string;
  current: number;
  max: number;
  color: string;
  showNumbers?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm font-mono">
      <span className={cn("uppercase w-16", color)}>{label}</span>
      <ASCIIBar current={current} max={max} width={15} color={color} />
      {showNumbers && (
        <span className="text-green-600 text-xs w-20 text-right">
          {current.toLocaleString()}/{max.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function CharacterPanel({ character }: { character: Character }) {
  const resourceType =
    character.characterClass === "warrior"
      ? "Rage"
      : character.characterClass === "rogue"
      ? "Energy"
      : "Mana";

  const resourceColor =
    character.characterClass === "warrior"
      ? "text-red-500"
      : character.characterClass === "rogue"
      ? "text-yellow-500"
      : "text-blue-400";

  const classColor = classColors[character.characterClass] || "#22c55e";
  const classIcon = classIcons[character.characterClass] || "?";

  return (
    <TerminalPanel variant="green">
      {/* Character Header */}
      <div className="text-center border-b border-green-800 pb-3 mb-3">
        <pre className="text-3xl mb-1" style={{ color: classColor }}>
          {classIcon}
        </pre>
        <h2
          className="text-xl font-bold uppercase tracking-wider"
          style={{ color: classColor }}
        >
          {character.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-green-600 text-sm capitalize">
            {character.characterClass}
          </span>
          <span className="text-yellow-500 text-sm">
            [LVL {character.level}]
          </span>
        </div>
      </div>

      {/* Vital Bars */}
      <div className="space-y-2 mb-4">
        <StatRow
          label="HP"
          current={character.currentHealth}
          max={character.maxHealth}
          color="text-red-500"
        />
        <StatRow
          label={resourceType.slice(0, 4)}
          current={character.currentResource}
          max={character.maxResource}
          color={resourceColor}
        />
        <StatRow
          label="XP"
          current={character.experience % 1000}
          max={1000}
          color="text-purple-400"
        />
      </div>

      {/* Gold */}
      <div className="flex justify-between items-center py-2 border-t border-green-800">
        <span className="text-yellow-600 uppercase text-sm">Gold</span>
        <span className="text-yellow-400 font-bold">
          {character.gold.toLocaleString()} G
        </span>
      </div>

      {/* Attributes */}
      <div className="border-t border-green-800 pt-3 mt-2">
        <div className="text-xs text-green-600 uppercase mb-2">Attributes</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-green-600">STR</span>
            <span className="text-green-400">{character.baseStrength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">AGI</span>
            <span className="text-green-400">{character.baseAgility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">INT</span>
            <span className="text-green-400">{character.baseIntellect}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">STA</span>
            <span className="text-green-400">{character.baseStamina}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">SPI</span>
            <span className="text-green-400">{character.baseSpirit}</span>
          </div>
        </div>
      </div>
    </TerminalPanel>
  );
}

function ActivityPanel({
  character,
  characterId,
  onCollectSuccess,
}: {
  character: Character;
  characterId: number;
  onCollectSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [rewardNotification, setRewardNotification] = useState<{
    xp: number;
    gold: number;
    items: { name: string; rarity: string }[];
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  // Stop activity mutation
  const stopActivityMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        buildUrl(api.activities.stop.path, { characterId }),
        { method: "POST" }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to stop activity");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
    },
  });

  // Collect rewards mutation
  const collectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        buildUrl(api.activities.collect.path, { characterId }),
        { method: "POST" }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to collect rewards");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Show reward notification
      setRewardNotification({
        xp: data.xpGained,
        gold: data.goldGained,
        items: data.itemsGained || [],
        leveledUp: data.leveledUp,
        newLevel: data.newLevel,
      });
      // Refresh character data
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", characterId] });
      onCollectSuccess?.();
    },
  });

  // Calculate progress
  let progressPercent = 0;
  let isComplete = false;
  if (character.activityStartedAt && character.activityCompletesAt) {
    const now = Date.now();
    const start = new Date(character.activityStartedAt).getTime();
    const end = new Date(character.activityCompletesAt).getTime();
    progressPercent = Math.min(100, ((now - start) / (end - start)) * 100);
    isComplete = now >= end;
  }

  // Idle state - show navigation buttons
  if (!character.currentActivity || character.currentActivity === 'idle') {
    return (
      <TerminalPanel variant="cyan">
        <div className="text-center">
          <pre className="text-cyan-400 text-xs mb-2">
            ╔════════════════════╗{"\n"}
            ║     ACTIVITY       ║{"\n"}
            ╚════════════════════╝
          </pre>
          <p className="text-cyan-500 mb-3">Character is idle.</p>
          <div className="space-y-2">
            <TerminalButton
              variant="primary"
              className="w-full text-xs"
              onClick={() => navigate(`/character/${characterId}/zones`)}
            >
              [▶] Start Questing
            </TerminalButton>
            <TerminalButton
              variant="secondary"
              className="w-full text-xs"
              onClick={() => navigate(`/character/${characterId}/dungeons`)}
            >
              [⌂] Enter Dungeon
            </TerminalButton>
          </div>
        </div>
      </TerminalPanel>
    );
  }

  return (
    <>
      <TerminalPanel variant="yellow">
        <div className="text-center">
          <pre className="text-yellow-400 text-xs mb-2">
            ╔════════════════════╗{"\n"}
            ║  CURRENT ACTIVITY  ║{"\n"}
            ╚════════════════════╝
          </pre>
          <p className="text-yellow-400 uppercase font-bold mb-2">
            {character.currentActivity}
          </p>
          <div className="mb-2">
            <ASCIIBar
              current={progressPercent}
              max={100}
              width={20}
              color={isComplete ? "text-green-400" : "text-yellow-400"}
            />
          </div>
          <p className={cn("text-xs mb-3", isComplete ? "text-green-400" : "text-yellow-600")}>
            {isComplete ? "Complete! Collect rewards" : `${Math.floor(progressPercent)}% complete`}
          </p>
          <div className="space-y-2">
            {isComplete ? (
              <TerminalButton
                variant="primary"
                className="w-full text-xs"
                onClick={() => collectMutation.mutate()}
                disabled={collectMutation.isPending}
              >
                {collectMutation.isPending ? "[...] Collecting..." : "[✓] Collect Rewards"}
              </TerminalButton>
            ) : (
              <TerminalButton
                variant="danger"
                className="w-full text-xs"
                onClick={() => stopActivityMutation.mutate()}
                disabled={stopActivityMutation.isPending}
              >
                {stopActivityMutation.isPending ? "[...] Stopping..." : "[X] Stop Activity"}
              </TerminalButton>
            )}
          </div>
        </div>
      </TerminalPanel>

      {/* Reward Notification Modal */}
      {rewardNotification && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-stone-900 border-2 border-green-700 p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <pre className="font-mono text-xs text-green-400 leading-tight mb-4">
{`╔══════════════════════════════════════╗
║         REWARDS COLLECTED!           ║
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

              <div className="space-y-2 mb-6">
                {rewardNotification.xp > 0 && (
                  <div className="text-purple-400 font-mono">
                    +{rewardNotification.xp} XP
                  </div>
                )}
                {rewardNotification.gold > 0 && (
                  <div className="text-yellow-400 font-mono">
                    +{rewardNotification.gold} Gold
                  </div>
                )}
                {rewardNotification.items.map((item, idx) => (
                  <div key={idx} className="text-green-400 font-mono text-sm">
                    + {item.name}
                  </div>
                ))}
              </div>

              <TerminalButton
                variant="primary"
                onClick={() => setRewardNotification(null)}
              >
                [ Continue ]
              </TerminalButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type TabType = "character" | "world" | "dungeons" | "inventory" | "quests" | "talents";

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-2 font-mono text-xs uppercase tracking-wider transition-all border-b-2",
        active
          ? "text-yellow-400 border-yellow-500 bg-yellow-500/10"
          : "text-green-600 border-transparent hover:text-green-400 hover:border-green-600"
      )}
    >
      <span className="mr-1">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function WorldMapTab({ navigate, characterId }: { navigate: (path: string) => void; characterId: number }) {
  return (
    <div className="space-y-4">
      <TerminalPanel variant="green">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-green-400 font-bold uppercase">Elwynn Forest</h3>
            <p className="text-green-600 text-xs">Level 1-10 | Starting Zone</p>
          </div>
          <span className="text-green-500">[UNLOCKED]</span>
        </div>
        <p className="text-green-500 text-sm mb-3">
          The peaceful forests around Stormwind, home to wolves and kobolds.
        </p>
        <TerminalButton
          variant="primary"
          className="w-full"
          onClick={() => navigate(`/character/${characterId}/zones`)}
        >
          [▶] View Zones
        </TerminalButton>
      </TerminalPanel>

      <TerminalPanel variant="green" className="opacity-50">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-green-700 font-bold uppercase">Westfall</h3>
            <p className="text-green-800 text-xs">Level 10-20 | Locked</p>
          </div>
          <span className="text-red-600">[LOCKED]</span>
        </div>
        <p className="text-green-700 text-sm">
          Reach level 10 to unlock this zone.
        </p>
      </TerminalPanel>
    </div>
  );
}

function DungeonsTab({ navigate, characterId }: { navigate: (path: string) => void; characterId: number }) {
  return (
    <div className="space-y-4">
      <TerminalPanel variant="cyan" className="opacity-50">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-cyan-700 font-bold uppercase">Deadmines</h3>
            <p className="text-cyan-800 text-xs">Level 15-21 | Locked</p>
          </div>
          <span className="text-red-600">[LOCKED]</span>
        </div>
        <p className="text-cyan-700 text-sm">
          Reach level 15 to enter this dungeon.
        </p>
      </TerminalPanel>

      <TerminalButton
        variant="secondary"
        className="w-full"
        onClick={() => navigate(`/character/${characterId}/dungeons`)}
      >
        [▶] View All Dungeons
      </TerminalButton>
    </div>
  );
}

function InventoryTab({ navigate, characterId }: { navigate: (path: string) => void; characterId: number }) {
  return (
    <div className="text-center py-8">
      <pre className="text-green-600 text-4xl mb-4">◇</pre>
      <p className="text-green-500 mb-2">Your inventory is empty.</p>
      <p className="text-green-700 text-sm mb-4">
        Complete activities to earn items!
      </p>
      <TerminalButton
        variant="primary"
        onClick={() => navigate(`/character/${characterId}/inventory`)}
      >
        [▶] Open Inventory
      </TerminalButton>
    </div>
  );
}

function QuestsTab({ navigate, characterId }: { navigate: (path: string) => void; characterId: number }) {
  return (
    <div className="text-center py-8">
      <pre className="text-yellow-600 text-4xl mb-4">!</pre>
      <p className="text-yellow-500 mb-2">No active quests.</p>
      <p className="text-yellow-700 text-sm mb-4">
        Explore zones to find quests!
      </p>
      <TerminalButton
        variant="secondary"
        onClick={() => navigate(`/character/${characterId}/quests`)}
      >
        [▶] Quest Log
      </TerminalButton>
    </div>
  );
}

function TalentsTab({ navigate, characterId, level }: { navigate: (path: string) => void; characterId: number; level: number }) {
  if (level < 10) {
    return (
      <div className="text-center py-8">
        <pre className="text-green-700 text-4xl mb-4">★</pre>
        <p className="text-green-600 mb-2">Talents locked.</p>
        <p className="text-green-800 text-sm">
          Reach level 10 to unlock the talent system.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <pre className="text-yellow-400 text-4xl mb-4">★</pre>
      <p className="text-yellow-500 mb-2">Talents available!</p>
      <p className="text-yellow-700 text-sm mb-4">
        Customize your character's abilities.
      </p>
      <TerminalButton
        variant="secondary"
        onClick={() => navigate(`/character/${characterId}/talents`)}
      >
        [▶] Open Talent Trees
      </TerminalButton>
    </div>
  );
}

function CharacterTab({ character }: { character: Character }) {
  return (
    <TerminalPanel variant="green">
      <pre className="text-green-600 text-xs mb-4">
        ╔══════════════════════════════════════╗{"\n"}
        ║        CHARACTER DETAILS             ║{"\n"}
        ╚══════════════════════════════════════╝
      </pre>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-green-600 uppercase text-xs mb-1">Name</div>
          <div className="text-green-400">{character.name}</div>
        </div>
        <div>
          <div className="text-green-600 uppercase text-xs mb-1">Class</div>
          <div className="text-green-400 capitalize">{character.characterClass}</div>
        </div>
        <div>
          <div className="text-green-600 uppercase text-xs mb-1">Level</div>
          <div className="text-yellow-400">{character.level}</div>
        </div>
        <div>
          <div className="text-green-600 uppercase text-xs mb-1">Total XP</div>
          <div className="text-purple-400">{character.experience.toLocaleString()}</div>
        </div>
      </div>
      <p className="text-green-700 text-xs mt-4">
        Equipment and detailed stats will be displayed here.
      </p>
    </TerminalPanel>
  );
}

export default function Game() {
  const params = useParams<{ characterId: string }>();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("world");

  const characterId = parseInt(params.characterId || "0");

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

  // Offline progress modal
  const {
    showModal: showOfflineModal,
    progress: offlineProgress,
    checkOfflineProgress,
    closeModal: closeOfflineModal,
  } = useOfflineProgress(characterId);

  // Check for offline progress on mount (after character is loaded)
  useEffect(() => {
    if (character && characterId > 0) {
      checkOfflineProgress();
    }
  }, [character, characterId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-6xl mx-auto">
          <ASCIIHeader variant="double">Loading...</ASCIIHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TerminalPanel variant="green">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-green-900/30 rounded"></div>
                <div className="h-4 bg-green-900/30 rounded w-3/4"></div>
                <div className="h-4 bg-green-900/30 rounded w-1/2"></div>
              </div>
            </TerminalPanel>
            <div className="lg:col-span-2">
              <TerminalPanel variant="green">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-green-900/30 rounded"></div>
                  <div className="h-32 bg-green-900/30 rounded"></div>
                </div>
              </TerminalPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-6xl mx-auto text-center py-12">
          <ASCIIHeader variant="double">Error</ASCIIHeader>
          <TerminalPanel variant="red" className="max-w-md mx-auto">
            <p className="text-red-400 mb-4">Character not found.</p>
            <TerminalButton variant="secondary" onClick={() => navigate("/")}>
              [←] Back to Character Select
            </TerminalButton>
          </TerminalPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <TerminalButton variant="secondary" onClick={() => navigate("/")}>
            [←] Characters
          </TerminalButton>
          <h1 className="text-xl font-bold text-yellow-400 uppercase tracking-wider font-mono">
            Idle Raiders
          </h1>
          <TerminalButton variant="secondary">
            [⚙] Settings
          </TerminalButton>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Sidebar - Character Info */}
          <div className="space-y-4">
            <CharacterPanel character={character} />
            <ActivityPanel character={character} characterId={characterId} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex border-b border-green-800 mb-4 overflow-x-auto">
              <TabButton
                active={activeTab === "character"}
                onClick={() => setActiveTab("character")}
                icon="☺"
                label="Character"
              />
              <TabButton
                active={activeTab === "world"}
                onClick={() => setActiveTab("world")}
                icon="⚐"
                label="World"
              />
              <TabButton
                active={activeTab === "dungeons"}
                onClick={() => setActiveTab("dungeons")}
                icon="⌂"
                label="Dungeons"
              />
              <TabButton
                active={activeTab === "inventory"}
                onClick={() => setActiveTab("inventory")}
                icon="◇"
                label="Inventory"
              />
              <TabButton
                active={activeTab === "quests"}
                onClick={() => setActiveTab("quests")}
                icon="!"
                label="Quests"
              />
              <TabButton
                active={activeTab === "talents"}
                onClick={() => setActiveTab("talents")}
                icon="★"
                label="Talents"
              />
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "character" && <CharacterTab character={character} />}
              {activeTab === "world" && <WorldMapTab navigate={navigate} characterId={characterId} />}
              {activeTab === "dungeons" && <DungeonsTab navigate={navigate} characterId={characterId} />}
              {activeTab === "inventory" && <InventoryTab navigate={navigate} characterId={characterId} />}
              {activeTab === "quests" && <QuestsTab navigate={navigate} characterId={characterId} />}
              {activeTab === "talents" && <TalentsTab navigate={navigate} characterId={characterId} level={character.level} />}
            </div>
          </div>
        </div>

        {/* ASCII Footer */}
        <div className="mt-8 text-center">
          <pre className="text-green-800 text-xs leading-tight">
            {"═".repeat(60)}
          </pre>
        </div>
      </div>

      {/* Offline Progress Modal */}
      {offlineProgress && (
        <OfflineProgressModal
          isOpen={showOfflineModal}
          onClose={closeOfflineModal}
          characterId={characterId}
          characterName={character.name}
          characterClass={character.characterClass}
          currentLevel={character.level}
          currentXp={character.experience}
          xpToNextLevel={1000}
          progress={offlineProgress}
        />
      )}
    </div>
  );
}
