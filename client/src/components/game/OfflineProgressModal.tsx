import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// ============================================================================
// OFFLINE PROGRESS MODAL - Claim rewards after being away
// ============================================================================

// Rarity colors
const RARITY_COLORS: Record<string, string> = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

// Types based on shared/types/game.ts
interface GeneratedItem {
  templateId: number;
  name: string;
  description?: string;
  slot: string;
  rarity: string;
  itemLevel: number;
  requiredLevel: number;
  stats: {
    strength?: number;
    agility?: number;
    intellect?: number;
    stamina?: number;
    spirit?: number;
  };
}

interface OfflineProgress {
  hasProgress: boolean;
  offlineDuration: number; // in seconds
  xpGained: number;
  goldGained: number;
  itemsFound: GeneratedItem[];
  levelsGained: number;
  died: boolean;
  deathCount?: number;
}

interface OfflineProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: number;
  characterName: string;
  characterClass: string;
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  progress: OfflineProgress;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

// Death messages for humor
const DEATH_MESSAGES = [
  "Your corpse collected some dust while you were away.",
  "The monsters partied on your grave. Twice.",
  "You died heroically... while AFK.",
  "The respawn point got to know you better.",
  "Your ghost had time to explore the afterlife.",
];

function getDeathMessage(count: number): string {
  if (count === 1) {
    return DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
  }
  return `You died ${count} times while AFK. The graveyard keeper sends regards.`;
}

// ============================================================================
// ASCII BOX FRAME COMPONENT
// ============================================================================

function ASCIIFrame({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("font-mono", className)}>
      {/* Top border */}
      <div className="text-amber-600 text-xs">
        {title ? (
          <>
            <span>{"╔═══"}</span>
            <span className="text-amber-400 px-1">{title}</span>
            <span>{"═".repeat(Math.max(0, 40 - title.length))}</span>
            <span>{"═══╗"}</span>
          </>
        ) : (
          <span>{"╔" + "═".repeat(50) + "╗"}</span>
        )}
      </div>
      {/* Content */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 text-amber-600 text-xs">║</div>
        <div className="absolute right-0 top-0 bottom-0 text-amber-600 text-xs">║</div>
        <div className="px-4 py-2">{children}</div>
      </div>
      {/* Bottom border */}
      <div className="text-amber-600 text-xs">
        <span>{"╚" + "═".repeat(50) + "╝"}</span>
      </div>
    </div>
  );
}

// ============================================================================
// PROGRESS BAR (ASCII STYLE)
// ============================================================================

function ASCIIProgressBar({
  current,
  max,
  label,
  color,
  showPercent = true,
}: {
  current: number;
  max: number;
  label?: string;
  color: string;
  showPercent?: boolean;
}) {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));
  const filledBlocks = Math.floor(percent / 5); // 20 blocks total
  const emptyBlocks = 20 - filledBlocks;

  return (
    <div className="font-mono text-xs">
      {label && <div className="text-stone-400 mb-1">{label}</div>}
      <div className="flex items-center gap-2">
        <span className="text-stone-600">[</span>
        <span style={{ color }}>{"█".repeat(filledBlocks)}</span>
        <span className="text-stone-800">{"░".repeat(emptyBlocks)}</span>
        <span className="text-stone-600">]</span>
        {showPercent && <span className="text-stone-400">{Math.floor(percent)}%</span>}
      </div>
    </div>
  );
}

// ============================================================================
// ITEM DISPLAY (RARITY COLORED)
// ============================================================================

function ItemDisplay({ item }: { item: GeneratedItem }) {
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 bg-stone-900/50 border border-stone-700 text-xs font-mono"
      style={{ borderLeftColor: rarityColor, borderLeftWidth: 3 }}
    >
      <span className="text-stone-500">[</span>
      <span style={{ color: rarityColor }}>{item.name}</span>
      <span className="text-stone-500">]</span>
      <span className="text-stone-600 text-[10px]">iLvl {item.itemLevel}</span>
    </div>
  );
}

// ============================================================================
// STAT ROW
// ============================================================================

function StatRow({
  icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  subtext?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-stone-800 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-stone-400 text-xs font-mono">{label}</span>
      </div>
      <div className="text-right">
        <span className="font-mono font-bold" style={{ color }}>
          {typeof value === "number" ? formatNumber(value) : value}
        </span>
        {subtext && <div className="text-[10px] text-stone-500">{subtext}</div>}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export function OfflineProgressModal({
  isOpen,
  onClose,
  characterId,
  characterName,
  characterClass,
  currentLevel,
  currentXp,
  xpToNextLevel,
  progress,
}: OfflineProgressModalProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const queryClient = useQueryClient();

  // Claim mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/characters/${characterId}/offline/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to claim progress");
      }
      return response.json();
    },
    onSuccess: () => {
      setClaimed(true);
      // Refresh character data
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    },
  });

  const handleClaim = async () => {
    setIsClaiming(true);
    await claimMutation.mutateAsync();
  };

  if (!isOpen) return null;

  const xpAfterGain = currentXp + progress.xpGained;
  const xpPercent = Math.min(100, (xpAfterGain / xpToNextLevel) * 100);

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in duration-300">
        {/* ASCII-styled modal */}
        <div className="bg-[#0d0b08] border-2 border-amber-900/70 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-900/30 to-transparent px-4 py-3 border-b border-amber-900/50">
            <div className="text-center">
              <div className="font-mono text-amber-500 text-xs mb-1">
                {"═".repeat(15)} WELCOME BACK {"═".repeat(15)}
              </div>
              <h2 className="text-xl font-bold text-amber-400 font-mono">
                {characterName}
              </h2>
              <div className="text-stone-500 text-xs font-mono capitalize">
                Level {currentLevel} {characterClass}
              </div>
            </div>
          </div>

          {/* Time Away */}
          <div className="px-4 py-3 border-b border-stone-800 bg-stone-900/30">
            <div className="text-center">
              <div className="text-stone-500 text-xs font-mono mb-1">You were away for</div>
              <div className="text-2xl font-bold text-amber-300 font-mono">
                {formatDuration(progress.offlineDuration)}
              </div>
            </div>
          </div>

          {/* Rewards Summary */}
          <div className="px-4 py-4 space-y-3">
            {/* Level Up Banner */}
            {progress.levelsGained > 0 && (
              <div className="bg-amber-900/30 border border-amber-600/50 px-3 py-2 text-center animate-pulse">
                <div className="text-amber-400 font-mono text-xs">
                  {"★".repeat(progress.levelsGained)} LEVEL UP! {"★".repeat(progress.levelsGained)}
                </div>
                <div className="text-amber-300 font-bold text-lg font-mono">
                  Level {currentLevel - progress.levelsGained} → Level {currentLevel}
                </div>
              </div>
            )}

            {/* XP & Gold */}
            <ASCIIFrame title="REWARDS" className="text-xs">
              <div className="space-y-2">
                <StatRow
                  icon="✨"
                  label="Experience"
                  value={`+${formatNumber(progress.xpGained)}`}
                  color="#a855f7"
                  subtext={progress.levelsGained > 0 ? `${progress.levelsGained} level(s) gained!` : undefined}
                />
                <StatRow icon="💰" label="Gold" value={`+${formatNumber(progress.goldGained)}`} color="#fbbf24" />
              </div>

              {/* XP Progress Bar */}
              {progress.levelsGained === 0 && (
                <div className="mt-3 pt-2 border-t border-stone-800">
                  <ASCIIProgressBar
                    current={xpAfterGain}
                    max={xpToNextLevel}
                    label={`XP to Level ${currentLevel + 1}`}
                    color="#a855f7"
                  />
                </div>
              )}
            </ASCIIFrame>

            {/* Items Found */}
            {progress.itemsFound.length > 0 && (
              <ASCIIFrame title="LOOT" className="text-xs">
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {progress.itemsFound.map((item, idx) => (
                    <ItemDisplay key={idx} item={item} />
                  ))}
                </div>
                <div className="text-stone-500 text-[10px] mt-2 text-center">
                  {progress.itemsFound.length} item{progress.itemsFound.length !== 1 ? "s" : ""} found
                </div>
              </ASCIIFrame>
            )}

            {/* Death Notice */}
            {progress.died && (
              <div className="bg-red-900/20 border border-red-900/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">💀</span>
                  <div>
                    <div className="text-red-400 font-mono text-xs font-bold">YOU DIED</div>
                    <div className="text-red-300/70 text-[10px] font-mono">
                      {getDeathMessage(progress.deathCount || 1)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer / Claim Button */}
          <div className="px-4 py-3 border-t border-stone-800 bg-stone-900/30">
            {claimed ? (
              <div className="text-center py-2">
                <div className="text-green-400 font-mono text-sm animate-pulse">
                  ✓ REWARDS CLAIMED!
                </div>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className={cn(
                  "w-full py-3 font-mono font-bold text-sm transition-all",
                  "border-2 border-amber-600",
                  isClaiming
                    ? "bg-stone-800 text-stone-500 cursor-wait"
                    : "bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:from-amber-600 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-900/50"
                )}
              >
                {isClaiming ? (
                  <span className="animate-pulse">CLAIMING...</span>
                ) : (
                  <>
                    <span className="text-amber-200">⚔</span>
                    {" CLAIM REWARDS "}
                    <span className="text-amber-200">⚔</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-600/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-600/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600/50" />
        </div>

        {/* Close button (X) - top right outside modal */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-stone-800 border border-stone-600 text-stone-400 hover:text-white hover:border-stone-500 font-mono text-sm flex items-center justify-center"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// HOOK: useOfflineProgress
// ============================================================================

export function useOfflineProgress(characterId: number) {
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState<OfflineProgress | null>(null);

  const checkOfflineProgress = async () => {
    try {
      const response = await fetch(`/api/characters/${characterId}/offline`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.hasProgress) {
        setProgress(data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Failed to check offline progress:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setProgress(null);
  };

  return {
    showModal,
    progress,
    checkOfflineProgress,
    closeModal,
  };
}

// ============================================================================
// DEMO COMPONENT (for DevTest page)
// ============================================================================

export function OfflineProgressModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  const mockProgress: OfflineProgress = {
    hasProgress: true,
    offlineDuration: 7 * 3600 + 23 * 60, // 7h 23m
    xpGained: 12450,
    goldGained: 847,
    itemsFound: [
      {
        templateId: 1,
        name: "Worn Leather Belt",
        slot: "waist",
        rarity: "common",
        itemLevel: 12,
        requiredLevel: 10,
        stats: { stamina: 3 },
      },
      {
        templateId: 2,
        name: "Blade of Cunning",
        slot: "mainHand",
        rarity: "rare",
        itemLevel: 24,
        requiredLevel: 20,
        stats: { agility: 8, stamina: 5 },
      },
      {
        templateId: 3,
        name: "Shadowfang",
        slot: "mainHand",
        rarity: "epic",
        itemLevel: 32,
        requiredLevel: 28,
        stats: { strength: 12, agility: 8 },
      },
    ],
    levelsGained: 2,
    died: true,
    deathCount: 3,
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-amber-600 text-white font-mono text-sm hover:bg-amber-500"
      >
        Show Offline Progress Modal
      </button>

      <OfflineProgressModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        characterId={1}
        characterName="Thrognar"
        characterClass="warrior"
        currentLevel={24}
        currentXp={8500}
        xpToNextLevel={24000}
        progress={mockProgress}
      />
    </div>
  );
}

export default OfflineProgressModal;
