import { cn } from "@/lib/utils";
import { Castle, Swords, Scroll, Backpack, User, Map, Trophy } from "lucide-react";

// ============================================================================
// LOADING STATES & SKELETONS - Game-themed loading indicators
// ============================================================================

// ============================================================================
// ASCII LOADING SPINNER
// ============================================================================

const SPINNER_FRAMES = ["◐", "◓", "◑", "◒"];
const SWORD_FRAMES = ["⚔", "🗡", "⚔", "🗡"];
const DOTS_FRAMES = [".", "..", "...", ".."];

export function ASCIISpinner({
  type = "default",
  className,
}: {
  type?: "default" | "sword" | "dots";
  className?: string;
}) {
  const frames = type === "sword" ? SWORD_FRAMES : type === "dots" ? DOTS_FRAMES : SPINNER_FRAMES;

  return (
    <span className={cn("inline-block animate-spin-slow", className)}>
      {frames[0]}
    </span>
  );
}

// ============================================================================
// LOADING BAR (ASCII-style)
// ============================================================================

export function ASCIILoadingBar({
  width = 20,
  animated = true,
  label,
  className,
}: {
  width?: number;
  animated?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("font-mono text-xs", className)}>
      {label && (
        <div className="text-stone-500 mb-1">{label}</div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-stone-700">[</span>
        <span className={cn("text-amber-500", animated && "animate-pulse")}>
          {"░".repeat(width)}
        </span>
        <span className="text-stone-700">]</span>
      </div>
    </div>
  );
}

// ============================================================================
// SKELETON COMPONENTS (Game-themed)
// ============================================================================

function SkeletonBlock({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-stone-800/50 border border-stone-700",
        className
      )}
    >
      {children}
    </div>
  );
}

// Character Card Skeleton
export function CharacterCardSkeleton() {
  return (
    <div className="bg-stone-900/50 border-2 border-stone-700 p-4">
      <div className="flex items-center gap-4">
        {/* Portrait placeholder */}
        <SkeletonBlock className="w-16 h-16 rounded" />
        <div className="flex-1 space-y-2">
          {/* Name */}
          <SkeletonBlock className="h-5 w-32" />
          {/* Class & Level */}
          <SkeletonBlock className="h-4 w-24" />
        </div>
      </div>
      {/* Stats */}
      <div className="mt-4 space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-3/4" />
      </div>
    </div>
  );
}

// Stat Panel Skeleton
export function StatPanelSkeleton() {
  return (
    <div className="bg-stone-900/50 border border-stone-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <SkeletonBlock className="w-4 h-4" />
        <SkeletonBlock className="h-4 w-24" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Item Slot Skeleton
export function ItemSlotSkeleton({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <SkeletonBlock className={cn(sizeClasses[size], "flex items-center justify-center")}>
      <div className="w-6 h-6 bg-stone-700/50 animate-pulse" />
    </SkeletonBlock>
  );
}

// Inventory Grid Skeleton
export function InventoryGridSkeleton({ slots = 16 }: { slots?: number }) {
  return (
    <div className="grid grid-cols-4 gap-1 p-2 bg-stone-900/50 border border-stone-700">
      {Array.from({ length: slots }).map((_, i) => (
        <ItemSlotSkeleton key={i} size="medium" />
      ))}
    </div>
  );
}

// Quest Card Skeleton
export function QuestCardSkeleton() {
  return (
    <div className="bg-stone-900/50 border border-stone-700 p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-2 flex-1">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
        <SkeletonBlock className="w-8 h-8" />
      </div>
      <SkeletonBlock className="h-2 w-full mt-2" />
    </div>
  );
}

// Zone Card Skeleton
export function ZoneCardSkeleton() {
  return (
    <div className="bg-stone-900/50 border-2 border-stone-700">
      <div className="p-4 border-b border-stone-700">
        <div className="flex justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <SkeletonBlock className="w-12 h-12" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <div className="flex gap-1 pt-2">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-5 w-16" />
        </div>
        <SkeletonBlock className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

// Dungeon Card Skeleton
export function DungeonCardSkeleton() {
  return (
    <div className="bg-stone-900/50 border-2 border-stone-700">
      <div className="p-4 border-b border-stone-700">
        <div className="flex items-start gap-3">
          <SkeletonBlock className="w-16 h-16" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
        <div className="flex gap-1 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-5 w-20" />
          ))}
        </div>
        <SkeletonBlock className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

// Combat Log Skeleton
export function CombatLogSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="bg-stone-900/50 border border-stone-700">
      <div className="px-3 py-2 border-b border-stone-700">
        <SkeletonBlock className="h-4 w-24" />
      </div>
      <div className="p-2 space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonBlock className="h-3 w-12" />
            <SkeletonBlock className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FULL PAGE LOADING STATES
// ============================================================================

interface FullPageLoadingProps {
  message?: string;
  icon?: "character" | "dungeon" | "combat" | "quest" | "inventory" | "world" | "achievements";
  className?: string;
}

const LOADING_ICONS = {
  character: User,
  dungeon: Castle,
  combat: Swords,
  quest: Scroll,
  inventory: Backpack,
  world: Map,
  achievements: Trophy,
};

export function FullPageLoading({
  message = "Loading...",
  icon = "character",
  className,
}: FullPageLoadingProps) {
  const IconComponent = LOADING_ICONS[icon];

  return (
    <div
      className={cn(
        "min-h-screen bg-[#0a0908] flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="text-center">
        {/* Animated Icon */}
        <div className="mb-6">
          <IconComponent className="w-16 h-16 text-amber-500/50 animate-pulse mx-auto" />
        </div>

        {/* ASCII Loading Bar */}
        <pre className="font-mono text-xs text-amber-500 mb-4 animate-pulse">
{`╔════════════════════════════════╗
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║
╚════════════════════════════════╝`}
        </pre>

        {/* Message */}
        <div className="text-amber-400 font-mono text-sm animate-pulse">
          {message}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INLINE LOADING STATES
// ============================================================================

export function InlineLoading({
  message = "Loading",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-amber-400 font-mono text-sm", className)}>
      <span className="animate-pulse">⟳</span>
      <span>{message}</span>
      <span className="animate-pulse">...</span>
    </div>
  );
}

// Button Loading State
export function ButtonLoading({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="animate-spin">◐</span>
      <span className="animate-pulse">Processing...</span>
    </span>
  );
}

// ============================================================================
// PAGE-SPECIFIC LOADING SCREENS
// ============================================================================

export function CharacterSelectLoading() {
  return (
    <div className="min-h-screen bg-[#0a0908] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <SkeletonBlock className="h-8 w-48 mx-auto mb-2" />
          <SkeletonBlock className="h-4 w-32 mx-auto" />
        </div>
        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <CharacterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GamePageLoading() {
  return (
    <div className="min-h-screen bg-[#0a0908] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <SkeletonBlock className="h-8 w-24" />
          <SkeletonBlock className="h-8 w-32" />
          <SkeletonBlock className="h-8 w-8" />
        </div>
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <CharacterCardSkeleton />
            <StatPanelSkeleton />
          </div>
          {/* Main Content */}
          <div className="lg:col-span-2">
            <SkeletonBlock className="h-10 w-full mb-4" />
            <div className="grid gap-4">
              <ZoneCardSkeleton />
              <ZoneCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventoryPageLoading() {
  return (
    <div className="min-h-screen bg-[#0a0908] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <SkeletonBlock className="h-6 w-24" />
          <SkeletonBlock className="h-6 w-32" />
          <SkeletonBlock className="h-6 w-24" />
        </div>
        {/* Info Bar */}
        <SkeletonBlock className="h-16 w-full mb-6" />
        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InventoryGridSkeleton slots={32} />
          </div>
          <div>
            <StatPanelSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuestLogLoading() {
  return (
    <div className="min-h-screen bg-[#0a0908] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <SkeletonBlock className="h-6 w-24" />
          <SkeletonBlock className="h-6 w-32" />
          <SkeletonBlock className="h-6 w-24" />
        </div>
        {/* Info Bar */}
        <SkeletonBlock className="h-16 w-full mb-6" />
        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <QuestCardSkeleton key={i} />
            ))}
          </div>
          <div className="lg:col-span-2">
            <SkeletonBlock className="h-96 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEMO
// ============================================================================

export function LoadingStatesDemo() {
  return (
    <div className="space-y-8 p-4 bg-[#0a0908]">
      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Full Page Loading</h3>
        <div className="h-64 border border-stone-700 relative overflow-hidden">
          <FullPageLoading message="Loading character..." icon="character" />
        </div>
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Inline Loading</h3>
        <InlineLoading message="Fetching data" />
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">ASCII Loading Bar</h3>
        <ASCIILoadingBar width={30} label="Loading assets..." />
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Skeleton Components</h3>
        <div className="grid grid-cols-2 gap-4">
          <CharacterCardSkeleton />
          <StatPanelSkeleton />
        </div>
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Item Slots</h3>
        <div className="flex gap-2">
          <ItemSlotSkeleton size="small" />
          <ItemSlotSkeleton size="medium" />
          <ItemSlotSkeleton size="large" />
        </div>
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Inventory Grid</h3>
        <InventoryGridSkeleton slots={8} />
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Quest Card</h3>
        <QuestCardSkeleton />
      </div>

      <div>
        <h3 className="text-amber-400 font-mono text-sm mb-4">Combat Log</h3>
        <CombatLogSkeleton lines={3} />
      </div>
    </div>
  );
}
