import { cn } from "@/lib/utils";
import {
  Castle,
  Skull,
  CheckCircle2,
  Circle,
  Play,
  Timer,
  Heart,
  Zap,
  Shield,
  Users,
  Gift,
  ChevronRight,
  AlertTriangle,
  Trophy,
} from "lucide-react";

// ============================================================================
// DUNGEON PROGRESS - In-progress dungeon tracker
// ============================================================================

export type BossStatus = "locked" | "available" | "in_progress" | "defeated" | "failed";

export interface DungeonBoss {
  id: string;
  name: string;
  level: number;
  status: BossStatus;
  health?: number;
  maxHealth?: number;
  abilities: string[];
  rewards?: {
    xp: number;
    gold: number;
    loot?: string[];
  };
}

export interface DungeonRoom {
  id: string;
  name: string;
  type: "trash" | "boss" | "event" | "treasure";
  status: "locked" | "cleared" | "current" | "available";
  enemies?: number;
  enemiesDefeated?: number;
}

export interface DungeonInstance {
  id: string;
  name: string;
  shortName: string;
  startTime: number;
  currentRoom: number;
  totalRooms: number;
  rooms: DungeonRoom[];
  bosses: DungeonBoss[];
  totalEnemiesKilled: number;
  totalXpGained: number;
  totalGoldGained: number;
  deathCount: number;
  partyHealth: {
    current: number;
    max: number;
  };
}

const BOSS_STATUS_CONFIG: Record<BossStatus, { color: string; label: string }> = {
  locked: { color: "#6b7280", label: "Locked" },
  available: { color: "#f59e0b", label: "Available" },
  in_progress: { color: "#ef4444", label: "In Combat" },
  defeated: { color: "#22c55e", label: "Defeated" },
  failed: { color: "#dc2626", label: "Failed" },
};

const ROOM_TYPE_CONFIG: Record<string, { color: string; icon: typeof Skull }> = {
  trash: { color: "#6b7280", icon: Users },
  boss: { color: "#a855f7", icon: Skull },
  event: { color: "#3b82f6", icon: AlertTriangle },
  treasure: { color: "#f59e0b", icon: Gift },
};

// ============================================================================
// BOSS PROGRESS CARD
// ============================================================================

function BossProgressCard({ boss }: { boss: DungeonBoss }) {
  const statusConfig = BOSS_STATUS_CONFIG[boss.status];
  const healthPercent = boss.maxHealth ? (boss.health || 0) / boss.maxHealth * 100 : 100;

  return (
    <div
      className={cn(
        "border p-3 transition-all",
        boss.status === "defeated"
          ? "bg-green-900/10 border-green-900/50"
          : boss.status === "in_progress"
          ? "bg-red-900/20 border-red-700 animate-pulse"
          : boss.status === "available"
          ? "bg-amber-900/10 border-amber-900/50"
          : "bg-stone-900/30 border-stone-700 opacity-50"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {boss.status === "defeated" ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : boss.status === "in_progress" ? (
            <Skull className="w-4 h-4 text-red-500 animate-pulse" />
          ) : boss.status === "available" ? (
            <Circle className="w-4 h-4 text-amber-500" />
          ) : (
            <Circle className="w-4 h-4 text-stone-600" />
          )}
          <span
            className={cn(
              "font-mono text-sm font-bold",
              boss.status === "defeated" && "line-through text-stone-500"
            )}
            style={{ color: boss.status !== "defeated" ? statusConfig.color : undefined }}
          >
            {boss.name}
          </span>
        </div>
        <span
          className="text-[10px] font-mono px-2 py-0.5"
          style={{
            color: statusConfig.color,
            backgroundColor: `${statusConfig.color}20`,
          }}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Health Bar for in-progress */}
      {boss.status === "in_progress" && boss.maxHealth && (
        <div className="mb-2">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-red-400">HP</span>
            <span className="text-red-400">
              {boss.health?.toLocaleString()}/{boss.maxHealth.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-stone-800 border border-stone-700">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Abilities */}
      {boss.status !== "locked" && boss.status !== "defeated" && (
        <div className="flex flex-wrap gap-1">
          {boss.abilities.map((ability) => (
            <span
              key={ability}
              className="text-[10px] font-mono px-1 py-0.5 bg-red-900/30 border border-red-900/50 text-red-300"
            >
              {ability}
            </span>
          ))}
        </div>
      )}

      {/* Rewards (if defeated) */}
      {boss.status === "defeated" && boss.rewards && (
        <div className="mt-2 pt-2 border-t border-stone-700 flex gap-2 text-[10px] font-mono">
          <span className="text-purple-400">+{boss.rewards.xp} XP</span>
          <span className="text-yellow-400">+{boss.rewards.gold}g</span>
          {boss.rewards.loot && boss.rewards.loot.length > 0 && (
            <span className="text-blue-400">+{boss.rewards.loot.length} items</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ROOM PROGRESS TRACKER
// ============================================================================

function RoomProgressTracker({ rooms }: { rooms: DungeonRoom[] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {rooms.map((room, index) => {
        const typeConfig = ROOM_TYPE_CONFIG[room.type];
        const IconComponent = typeConfig.icon;

        return (
          <div key={room.id} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center border transition-all",
                room.status === "cleared"
                  ? "bg-green-900/30 border-green-700"
                  : room.status === "current"
                  ? "bg-amber-900/30 border-amber-500 animate-pulse"
                  : room.status === "available"
                  ? "bg-stone-800 border-stone-600"
                  : "bg-stone-900 border-stone-700 opacity-40"
              )}
              title={room.name}
            >
              <IconComponent
                className="w-4 h-4"
                style={{
                  color: room.status === "cleared" ? "#22c55e" : typeConfig.color,
                }}
              />
            </div>
            {index < rooms.length - 1 && (
              <div
                className={cn(
                  "w-4 h-0.5",
                  room.status === "cleared" ? "bg-green-700" : "bg-stone-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// DUNGEON STATS BAR
// ============================================================================

function DungeonStatsBar({ instance }: { instance: DungeonInstance }) {
  const elapsedTime = Math.floor((Date.now() - instance.startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="grid grid-cols-4 gap-2 text-xs font-mono">
      <div className="bg-stone-800/50 border border-stone-700 p-2 text-center">
        <Timer className="w-4 h-4 mx-auto text-stone-400 mb-1" />
        <div className="text-amber-400">
          {minutes}:{String(seconds).padStart(2, "0")}
        </div>
        <div className="text-[10px] text-stone-500">Time</div>
      </div>
      <div className="bg-stone-800/50 border border-stone-700 p-2 text-center">
        <Skull className="w-4 h-4 mx-auto text-red-400 mb-1" />
        <div className="text-red-400">{instance.totalEnemiesKilled}</div>
        <div className="text-[10px] text-stone-500">Kills</div>
      </div>
      <div className="bg-stone-800/50 border border-stone-700 p-2 text-center">
        <Gift className="w-4 h-4 mx-auto text-purple-400 mb-1" />
        <div className="text-purple-400">{instance.totalXpGained}</div>
        <div className="text-[10px] text-stone-500">XP</div>
      </div>
      <div className="bg-stone-800/50 border border-stone-700 p-2 text-center">
        <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
        <div className={instance.deathCount > 0 ? "text-red-400" : "text-green-400"}>
          {instance.deathCount}
        </div>
        <div className="text-[10px] text-stone-500">Deaths</div>
      </div>
    </div>
  );
}

// ============================================================================
// PARTY HEALTH BAR
// ============================================================================

function PartyHealthBar({ current, max }: { current: number; max: number }) {
  const percent = max > 0 ? (current / max) * 100 : 0;
  const color = percent > 60 ? "#22c55e" : percent > 30 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-stone-800/50 border border-stone-700 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color }} />
          <span className="text-xs font-mono text-stone-400">Party Health</span>
        </div>
        <span className="text-xs font-mono" style={{ color }}>
          {current.toLocaleString()}/{max.toLocaleString()}
        </span>
      </div>
      <div className="h-3 bg-stone-900 border border-stone-700">
        <div
          className="h-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DUNGEON PROGRESS COMPONENT
// ============================================================================

interface DungeonProgressProps {
  instance: DungeonInstance;
  onContinue?: () => void;
  onLeave?: () => void;
  className?: string;
}

export function DungeonProgress({
  instance,
  onContinue,
  onLeave,
  className,
}: DungeonProgressProps) {
  const defeatedBosses = instance.bosses.filter((b) => b.status === "defeated").length;
  const totalBosses = instance.bosses.length;
  const currentBoss = instance.bosses.find((b) => b.status === "in_progress");
  const nextBoss = instance.bosses.find((b) => b.status === "available");
  const isComplete = defeatedBosses === totalBosses;

  return (
    <div className={cn("bg-[#0a0908] border-2 border-stone-700", className)}>
      {/* Header */}
      <div className="p-4 border-b border-stone-700 bg-stone-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Castle className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-lg font-mono font-bold text-amber-400">
                {instance.name}
              </h2>
              <span className="text-xs font-mono text-stone-500">
                [{instance.shortName}]
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-amber-400">
              {defeatedBosses}/{totalBosses}
            </div>
            <div className="text-[10px] text-stone-500">Bosses Defeated</div>
          </div>
        </div>
      </div>

      {/* Room Progress */}
      <div className="p-4 border-b border-stone-700">
        <div className="text-[10px] font-mono text-stone-500 mb-2">PROGRESS</div>
        <RoomProgressTracker rooms={instance.rooms} />
        <div className="text-xs font-mono text-stone-400 mt-2">
          Room {instance.currentRoom}/{instance.totalRooms}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-stone-700">
        <DungeonStatsBar instance={instance} />
      </div>

      {/* Party Health */}
      <div className="p-4 border-b border-stone-700">
        <PartyHealthBar
          current={instance.partyHealth.current}
          max={instance.partyHealth.max}
        />
      </div>

      {/* Current/Next Boss */}
      <div className="p-4 border-b border-stone-700">
        <div className="text-[10px] font-mono text-stone-500 mb-2">
          {currentBoss ? "CURRENT BOSS" : nextBoss ? "NEXT BOSS" : "ALL BOSSES DEFEATED"}
        </div>
        {currentBoss ? (
          <BossProgressCard boss={currentBoss} />
        ) : nextBoss ? (
          <BossProgressCard boss={nextBoss} />
        ) : (
          <div className="bg-green-900/20 border border-green-700 p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <div className="text-green-400 font-mono">Dungeon Complete!</div>
          </div>
        )}
      </div>

      {/* All Bosses */}
      <div className="p-4 border-b border-stone-700">
        <div className="text-[10px] font-mono text-stone-500 mb-2">ALL BOSSES</div>
        <div className="space-y-2">
          {instance.bosses.map((boss) => (
            <BossProgressCard key={boss.id} boss={boss} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-3">
        {onLeave && (
          <button
            onClick={onLeave}
            className="flex-1 py-3 font-mono text-sm bg-stone-800 border border-stone-600 text-stone-400 hover:bg-stone-700 transition-all"
          >
            Leave Dungeon
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            className={cn(
              "flex-1 py-3 font-mono text-sm border-2 transition-all flex items-center justify-center gap-2",
              isComplete
                ? "bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50"
                : "bg-amber-900/30 border-amber-700 text-amber-400 hover:bg-amber-900/50"
            )}
          >
            {isComplete ? (
              <>
                <Trophy className="w-4 h-4" />
                Claim Rewards
              </>
            ) : currentBoss ? (
              <>
                <Play className="w-4 h-4" />
                Continue Fight
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                Next Room
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT VERSION (for sidebar)
// ============================================================================

export function CompactDungeonProgress({
  instance,
  className,
}: {
  instance: DungeonInstance;
  className?: string;
}) {
  const defeatedBosses = instance.bosses.filter((b) => b.status === "defeated").length;
  const totalBosses = instance.bosses.length;
  const elapsedTime = Math.floor((Date.now() - instance.startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className={cn("bg-stone-900/50 border border-stone-700 p-3", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Castle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-mono text-amber-400 truncate">
          {instance.shortName}
        </span>
        <span className="ml-auto text-[10px] font-mono text-stone-500">
          {minutes}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <div className="text-[10px] font-mono text-stone-400">
        {defeatedBosses}/{totalBosses} bosses | Room {instance.currentRoom}/{instance.totalRooms}
      </div>
    </div>
  );
}

// ============================================================================
// DEMO DATA
// ============================================================================

export const SAMPLE_DUNGEON_INSTANCE: DungeonInstance = {
  id: "dm_1",
  name: "The Deadmines",
  shortName: "DM",
  startTime: Date.now() - 1200000, // 20 minutes ago
  currentRoom: 4,
  totalRooms: 8,
  rooms: [
    { id: "r1", name: "Mine Entrance", type: "trash", status: "cleared", enemies: 5, enemiesDefeated: 5 },
    { id: "r2", name: "Rhahk'Zor's Chamber", type: "boss", status: "cleared" },
    { id: "r3", name: "Goblin Foundry", type: "trash", status: "cleared", enemies: 8, enemiesDefeated: 8 },
    { id: "r4", name: "Sneed's Shredder Bay", type: "boss", status: "current" },
    { id: "r5", name: "Smelting Room", type: "event", status: "locked" },
    { id: "r6", name: "Gilnid's Workshop", type: "boss", status: "locked" },
    { id: "r7", name: "Hidden Treasure", type: "treasure", status: "locked" },
    { id: "r8", name: "VanCleef's Ship", type: "boss", status: "locked" },
  ],
  bosses: [
    {
      id: "b1",
      name: "Rhahk'Zor",
      level: 17,
      status: "defeated",
      abilities: ["Strike", "Slam"],
      rewards: { xp: 350, gold: 15, loot: ["Rhahk'Zor's Hammer"] },
    },
    {
      id: "b2",
      name: "Sneed's Shredder",
      level: 18,
      status: "in_progress",
      health: 2340,
      maxHealth: 5600,
      abilities: ["Distracting Pain", "Eject Sneed"],
    },
    {
      id: "b3",
      name: "Gilnid",
      level: 19,
      status: "locked",
      abilities: ["Molten Metal", "Melt Ore"],
    },
    {
      id: "b4",
      name: "Mr. Smite",
      level: 20,
      status: "locked",
      abilities: ["Smite Slam", "Stomp", "Weapon Swap"],
    },
    {
      id: "b5",
      name: "Edwin VanCleef",
      level: 21,
      status: "locked",
      abilities: ["Thrash", "Assassin's Blade", "Summon Adds"],
    },
  ],
  totalEnemiesKilled: 23,
  totalXpGained: 1250,
  totalGoldGained: 45,
  deathCount: 1,
  partyHealth: { current: 1850, max: 2500 },
};

export function DungeonProgressDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-md">
        <DungeonProgress
          instance={SAMPLE_DUNGEON_INSTANCE}
          onContinue={() => console.log("Continue")}
          onLeave={() => console.log("Leave")}
        />
      </div>
      <div className="max-w-xs">
        <h3 className="text-amber-400 font-mono text-sm mb-2">Compact View</h3>
        <CompactDungeonProgress instance={SAMPLE_DUNGEON_INSTANCE} />
      </div>
    </div>
  );
}
