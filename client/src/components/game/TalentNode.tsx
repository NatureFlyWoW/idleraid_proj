import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, Plus, Minus, Star, Zap, Shield, Swords } from "lucide-react";

// ============================================================================
// TALENT NODE COMPONENT - Individual talent with ranks and tooltips
// ============================================================================

export interface TalentData {
  id: string;
  name: string;
  description: string;
  maxRanks: number;
  currentRank: number;
  tier: number; // 1-7
  position: number; // Position within tier (0, 1, 2...)
  icon?: string;
  iconType?: "offensive" | "defensive" | "utility" | "passive";
  prerequisite?: string; // ID of required talent
  isCapstone?: boolean;
  rankEffects?: string[]; // Description per rank
}

interface TalentNodeProps {
  talent: TalentData;
  isUnlocked: boolean;
  canAddPoint: boolean;
  canRemovePoint: boolean;
  onAddPoint: () => void;
  onRemovePoint: () => void;
  isHighlighted?: boolean;
  className?: string;
}

// Icon mapping based on talent type
const ICON_MAP = {
  offensive: Swords,
  defensive: Shield,
  utility: Zap,
  passive: Star,
};

// ============================================================================
// TALENT TOOLTIP
// ============================================================================

function TalentTooltip({
  talent,
  isUnlocked,
  canAddPoint,
}: {
  talent: TalentData;
  isUnlocked: boolean;
  canAddPoint: boolean;
}) {
  const nextRank = talent.currentRank + 1;
  const hasNextRank = nextRank <= talent.maxRanks;

  return (
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 pointer-events-none">
      <div className="bg-stone-900 border-2 border-stone-600 p-3 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              "font-mono text-sm font-bold",
              talent.isCapstone ? "text-amber-400" : "text-stone-200"
            )}
          >
            {talent.name}
          </span>
          <span className="text-xs font-mono text-stone-500">
            {talent.currentRank}/{talent.maxRanks}
          </span>
        </div>

        {/* Tier indicator */}
        <div className="text-[10px] font-mono text-stone-600 mb-2">
          Tier {talent.tier} {talent.isCapstone && "• Capstone"}
        </div>

        {/* Current effect */}
        {talent.currentRank > 0 && (
          <div className="mb-2">
            <div className="text-[10px] text-stone-500 font-mono">Current:</div>
            <div className="text-xs text-green-400">
              {talent.rankEffects?.[talent.currentRank - 1] || talent.description}
            </div>
          </div>
        )}

        {/* Next rank effect */}
        {hasNextRank && (
          <div className="mb-2">
            <div className="text-[10px] text-stone-500 font-mono">
              {talent.currentRank === 0 ? "Effect:" : "Next Rank:"}
            </div>
            <div
              className={cn(
                "text-xs",
                isUnlocked && canAddPoint ? "text-amber-400" : "text-stone-400"
              )}
            >
              {talent.rankEffects?.[nextRank - 1] || talent.description}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="pt-2 border-t border-stone-700 text-[10px] font-mono">
          {!isUnlocked ? (
            <span className="text-red-400">
              Requires {talent.tier * 5} points in tree
            </span>
          ) : talent.currentRank === talent.maxRanks ? (
            <span className="text-green-400">Maxed</span>
          ) : canAddPoint ? (
            <span className="text-amber-400">Click to learn</span>
          ) : (
            <span className="text-stone-500">No points available</span>
          )}
        </div>
      </div>
      {/* Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-stone-600" />
    </div>
  );
}

// ============================================================================
// MAIN TALENT NODE COMPONENT
// ============================================================================

export function TalentNode({
  talent,
  isUnlocked,
  canAddPoint,
  canRemovePoint,
  onAddPoint,
  onRemovePoint,
  isHighlighted,
  className,
}: TalentNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const IconComponent = ICON_MAP[talent.iconType || "passive"];

  const isMaxed = talent.currentRank === talent.maxRanks;
  const hasPoints = talent.currentRank > 0;

  // Determine border color based on state
  const getBorderColor = () => {
    if (!isUnlocked) return "border-stone-700";
    if (isMaxed) return "border-green-600";
    if (hasPoints) return "border-amber-600";
    return "border-stone-500";
  };

  // Determine background based on state
  const getBackground = () => {
    if (!isUnlocked) return "bg-stone-900/80";
    if (isMaxed) return "bg-green-900/30";
    if (hasPoints) return "bg-amber-900/30";
    return "bg-stone-800/50";
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 2 || e.shiftKey) {
      // Right click or shift+click to remove
      if (canRemovePoint) onRemovePoint();
    } else {
      // Left click to add
      if (canAddPoint && isUnlocked) onAddPoint();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canRemovePoint) onRemovePoint();
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <TalentTooltip
          talent={talent}
          isUnlocked={isUnlocked}
          canAddPoint={canAddPoint}
        />
      )}

      {/* Main Node */}
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        disabled={!isUnlocked && !hasPoints}
        className={cn(
          "relative w-12 h-12 border-2 transition-all",
          getBorderColor(),
          getBackground(),
          isUnlocked && !isMaxed && "hover:border-amber-400 cursor-pointer",
          !isUnlocked && "opacity-50 cursor-not-allowed",
          isHighlighted && "ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-900",
          talent.isCapstone && "w-14 h-14"
        )}
      >
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isUnlocked ? (
            <Lock className="w-4 h-4 text-stone-600" />
          ) : (
            <IconComponent
              className={cn(
                "w-5 h-5",
                isMaxed
                  ? "text-green-400"
                  : hasPoints
                  ? "text-amber-400"
                  : "text-stone-400"
              )}
            />
          )}
        </div>

        {/* Rank indicator */}
        {isUnlocked && (
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center",
              "text-[10px] font-mono font-bold border",
              isMaxed
                ? "bg-green-900 border-green-600 text-green-300"
                : hasPoints
                ? "bg-amber-900 border-amber-600 text-amber-300"
                : "bg-stone-800 border-stone-600 text-stone-400"
            )}
          >
            {talent.currentRank}
          </div>
        )}

        {/* Capstone glow */}
        {talent.isCapstone && isUnlocked && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              hasPoints && "animate-pulse"
            )}
            style={{
              boxShadow: hasPoints
                ? "0 0 15px rgba(251, 191, 36, 0.3)"
                : "0 0 10px rgba(251, 191, 36, 0.1)",
            }}
          />
        )}
      </button>

      {/* Talent name (small) */}
      <div
        className={cn(
          "absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap",
          "text-[8px] font-mono text-center max-w-[60px] truncate",
          isUnlocked ? "text-stone-400" : "text-stone-600"
        )}
      >
        {talent.name}
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT TALENT NODE (for previews)
// ============================================================================

export function CompactTalentNode({
  talent,
  className,
}: {
  talent: TalentData;
  className?: string;
}) {
  const isMaxed = talent.currentRank === talent.maxRanks;
  const hasPoints = talent.currentRank > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 border text-xs font-mono",
        isMaxed
          ? "bg-green-900/20 border-green-900/50 text-green-400"
          : hasPoints
          ? "bg-amber-900/20 border-amber-900/50 text-amber-400"
          : "bg-stone-900/20 border-stone-700 text-stone-500",
        className
      )}
    >
      <span className="truncate flex-1">{talent.name}</span>
      <span>
        {talent.currentRank}/{talent.maxRanks}
      </span>
    </div>
  );
}

// ============================================================================
// DEMO
// ============================================================================

export const SAMPLE_TALENTS: TalentData[] = [
  {
    id: "mortal_strike",
    name: "Mortal Strike",
    description: "Instant attack: weapon damage +160, -50% healing for 10s",
    maxRanks: 1,
    currentRank: 1,
    tier: 7,
    position: 0,
    iconType: "offensive",
    isCapstone: true,
    rankEffects: [
      "Instant attack: weapon damage +160, applies Mortal Wounds reducing healing by 50% for 10s (6s CD, 30 Rage)",
    ],
  },
  {
    id: "deep_wounds",
    name: "Deep Wounds",
    description: "Critical hits cause bleed damage",
    maxRanks: 3,
    currentRank: 2,
    tier: 2,
    position: 1,
    iconType: "offensive",
    rankEffects: [
      "Crits cause 20% weapon damage bleed over 12s",
      "Crits cause 40% weapon damage bleed over 12s",
      "Crits cause 60% weapon damage bleed over 12s",
    ],
  },
  {
    id: "deflection",
    name: "Deflection",
    description: "Increases Parry chance",
    maxRanks: 5,
    currentRank: 0,
    tier: 1,
    position: 1,
    iconType: "defensive",
    rankEffects: [
      "+1% Parry chance",
      "+2% Parry chance",
      "+3% Parry chance",
      "+4% Parry chance",
      "+5% Parry chance",
    ],
  },
];

export function TalentNodeDemo() {
  return (
    <div className="flex flex-wrap gap-8 p-4">
      {/* Maxed capstone */}
      <div className="text-center">
        <TalentNode
          talent={SAMPLE_TALENTS[0]}
          isUnlocked={true}
          canAddPoint={false}
          canRemovePoint={true}
          onAddPoint={() => {}}
          onRemovePoint={() => {}}
        />
        <div className="mt-6 text-[10px] text-stone-500">Maxed Capstone</div>
      </div>

      {/* Partially filled */}
      <div className="text-center">
        <TalentNode
          talent={SAMPLE_TALENTS[1]}
          isUnlocked={true}
          canAddPoint={true}
          canRemovePoint={true}
          onAddPoint={() => {}}
          onRemovePoint={() => {}}
        />
        <div className="mt-6 text-[10px] text-stone-500">Partial</div>
      </div>

      {/* Available */}
      <div className="text-center">
        <TalentNode
          talent={SAMPLE_TALENTS[2]}
          isUnlocked={true}
          canAddPoint={true}
          canRemovePoint={false}
          onAddPoint={() => {}}
          onRemovePoint={() => {}}
        />
        <div className="mt-6 text-[10px] text-stone-500">Available</div>
      </div>

      {/* Locked */}
      <div className="text-center">
        <TalentNode
          talent={{ ...SAMPLE_TALENTS[2], tier: 5 }}
          isUnlocked={false}
          canAddPoint={false}
          canRemovePoint={false}
          onAddPoint={() => {}}
          onRemovePoint={() => {}}
        />
        <div className="mt-6 text-[10px] text-stone-500">Locked</div>
      </div>
    </div>
  );
}
