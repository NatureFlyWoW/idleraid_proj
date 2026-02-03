import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { TalentNode, TalentData, CompactTalentNode } from "./TalentNode";
import { ChevronDown, Star } from "lucide-react";

// ============================================================================
// TALENT TREE COMPONENT - Visual talent tree with 7 tiers
// ============================================================================

export interface TalentTreeData {
  id: string;
  name: string;
  specName: string;
  description: string;
  icon?: string;
  color: string;
  talents: TalentData[];
}

interface TalentTreeProps {
  tree: TalentTreeData;
  pointsSpent: number;
  totalPoints: number;
  onAddPoint: (talentId: string) => void;
  onRemovePoint: (talentId: string) => void;
  isActive?: boolean;
  className?: string;
}

// Points required per tier
const TIER_REQUIREMENTS = [0, 5, 10, 15, 20, 25, 30];

// ============================================================================
// TIER COMPONENT
// ============================================================================

function TalentTier({
  tier,
  talents,
  pointsInTree,
  totalPoints,
  onAddPoint,
  onRemovePoint,
  treeColor,
}: {
  tier: number;
  talents: TalentData[];
  pointsInTree: number;
  totalPoints: number;
  onAddPoint: (talentId: string) => void;
  onRemovePoint: (talentId: string) => void;
  treeColor: string;
}) {
  const requiredPoints = TIER_REQUIREMENTS[tier - 1];
  const isUnlocked = pointsInTree >= requiredPoints;
  const isCapstone = tier === 7;

  // Sort talents by position
  const sortedTalents = [...talents].sort((a, b) => a.position - b.position);

  // Check if we can remove points (no higher tier talents depend on this)
  const canRemovePointFromTalent = (talent: TalentData) => {
    if (talent.currentRank === 0) return false;
    // Simplified: can always remove if talent has points
    // In production, check dependency chain
    return true;
  };

  // Check if we can add points
  const canAddPointToTalent = (talent: TalentData) => {
    if (!isUnlocked) return false;
    if (talent.currentRank >= talent.maxRanks) return false;
    if (totalPoints <= 0) return false;
    return true;
  };

  return (
    <div
      className={cn(
        "relative py-4",
        !isUnlocked && "opacity-50"
      )}
    >
      {/* Tier indicator */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2">
        <div
          className={cn(
            "text-[10px] font-mono",
            isUnlocked ? "text-stone-400" : "text-stone-600"
          )}
        >
          T{tier}
        </div>
        {requiredPoints > 0 && (
          <div
            className={cn(
              "text-[8px] font-mono",
              isUnlocked ? "text-green-500" : "text-stone-600"
            )}
          >
            {requiredPoints}pts
          </div>
        )}
      </div>

      {/* Talents */}
      <div
        className={cn(
          "flex justify-center gap-4",
          isCapstone && "pt-2"
        )}
      >
        {sortedTalents.map((talent) => (
          <TalentNode
            key={talent.id}
            talent={talent}
            isUnlocked={isUnlocked}
            canAddPoint={canAddPointToTalent(talent)}
            canRemovePoint={canRemovePointFromTalent(talent)}
            onAddPoint={() => onAddPoint(talent.id)}
            onRemovePoint={() => onRemovePoint(talent.id)}
          />
        ))}
      </div>

      {/* Connector lines to next tier */}
      {tier < 7 && isUnlocked && (
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full">
          <ChevronDown
            className="w-4 h-4 text-stone-600"
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN TALENT TREE COMPONENT
// ============================================================================

export function TalentTree({
  tree,
  pointsSpent,
  totalPoints,
  onAddPoint,
  onRemovePoint,
  isActive,
  className,
}: TalentTreeProps) {
  // Group talents by tier
  const talentsByTier = useMemo(() => {
    const grouped: Record<number, TalentData[]> = {};
    for (let i = 1; i <= 7; i++) {
      grouped[i] = tree.talents.filter((t) => t.tier === i);
    }
    return grouped;
  }, [tree.talents]);

  // Find capstone talent
  const capstoneTalent = tree.talents.find((t) => t.isCapstone);

  return (
    <div
      className={cn(
        "bg-stone-900/50 border-2 transition-all",
        isActive ? "border-amber-600" : "border-stone-700",
        className
      )}
    >
      {/* Header */}
      <div
        className="p-4 border-b border-stone-700"
        style={{ borderTopWidth: 4, borderTopColor: tree.color }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-mono" style={{ color: tree.color }}>
              {tree.name}
            </h3>
            <div className="text-xs font-mono text-stone-500">
              {tree.specName}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold" style={{ color: tree.color }}>
              {pointsSpent}
            </div>
            <div className="text-[10px] font-mono text-stone-500">
              Points Spent
            </div>
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-2">{tree.description}</p>
      </div>

      {/* Talent Tiers */}
      <div className="p-4 pl-10 space-y-2">
        {[1, 2, 3, 4, 5, 6, 7].map((tier) => (
          <TalentTier
            key={tier}
            tier={tier}
            talents={talentsByTier[tier] || []}
            pointsInTree={pointsSpent}
            totalPoints={totalPoints}
            onAddPoint={onAddPoint}
            onRemovePoint={onRemovePoint}
            treeColor={tree.color}
          />
        ))}
      </div>

      {/* Capstone Info */}
      {capstoneTalent && (
        <div className="p-4 border-t border-stone-700 bg-stone-900/30">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color: tree.color }} />
            <span className="text-xs font-mono text-stone-500">
              31-Point Talent: <span style={{ color: tree.color }}>{capstoneTalent.name}</span>
            </span>
          </div>
          <p className="text-xs text-stone-400">
            {capstoneTalent.description}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPACT TREE VIEW (for summaries)
// ============================================================================

export function CompactTalentTree({
  tree,
  pointsSpent,
  className,
}: {
  tree: TalentTreeData;
  pointsSpent: number;
  className?: string;
}) {
  const learnedTalents = tree.talents.filter((t) => t.currentRank > 0);

  return (
    <div className={cn("bg-stone-900/50 border border-stone-700 p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-sm font-bold" style={{ color: tree.color }}>
          {tree.name}
        </span>
        <span className="text-xs font-mono text-stone-400">{pointsSpent} pts</span>
      </div>
      <div className="space-y-1">
        {learnedTalents.slice(0, 5).map((talent) => (
          <CompactTalentNode key={talent.id} talent={talent} />
        ))}
        {learnedTalents.length > 5 && (
          <div className="text-[10px] font-mono text-stone-500 text-center">
            +{learnedTalents.length - 5} more
          </div>
        )}
        {learnedTalents.length === 0 && (
          <div className="text-[10px] font-mono text-stone-500 text-center py-2">
            No talents learned
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

export const SAMPLE_ARMS_TREE: TalentTreeData = {
  id: "arms",
  name: "Arms",
  specName: "Two-Handed DPS",
  description: "Burst damage, bleed effects, and execute mechanics.",
  color: "#C79C6E",
  talents: [
    // Tier 1
    {
      id: "improved_heroic_strike",
      name: "Improved Heroic Strike",
      description: "Reduces Rage cost of Heroic Strike",
      maxRanks: 3,
      currentRank: 3,
      tier: 1,
      position: 0,
      iconType: "offensive",
      rankEffects: [
        "Reduces Heroic Strike cost by 1 Rage",
        "Reduces Heroic Strike cost by 2 Rage",
        "Reduces Heroic Strike cost by 3 Rage",
      ],
    },
    {
      id: "deflection",
      name: "Deflection",
      description: "Increases Parry chance",
      maxRanks: 5,
      currentRank: 5,
      tier: 1,
      position: 1,
      iconType: "defensive",
      rankEffects: [
        "+1% Parry",
        "+2% Parry",
        "+3% Parry",
        "+4% Parry",
        "+5% Parry",
      ],
    },
    {
      id: "improved_rend",
      name: "Improved Rend",
      description: "Increases Rend bleed damage",
      maxRanks: 3,
      currentRank: 2,
      tier: 1,
      position: 2,
      iconType: "offensive",
      rankEffects: [
        "+15% Rend damage",
        "+25% Rend damage",
        "+35% Rend damage",
      ],
    },
    // Tier 2
    {
      id: "tactical_mastery",
      name: "Tactical Mastery",
      description: "Retain Rage when switching stances",
      maxRanks: 5,
      currentRank: 5,
      tier: 2,
      position: 0,
      iconType: "utility",
      rankEffects: [
        "Retain 5 Rage",
        "Retain 10 Rage",
        "Retain 15 Rage",
        "Retain 20 Rage",
        "Retain 25 Rage",
      ],
    },
    {
      id: "deep_wounds",
      name: "Deep Wounds",
      description: "Critical hits cause bleed",
      maxRanks: 3,
      currentRank: 3,
      tier: 2,
      position: 1,
      iconType: "offensive",
      rankEffects: [
        "Crits cause 20% weapon damage bleed over 12s",
        "Crits cause 40% weapon damage bleed over 12s",
        "Crits cause 60% weapon damage bleed over 12s",
      ],
    },
    // Tier 3
    {
      id: "improved_charge",
      name: "Improved Charge",
      description: "Increases Rage from Charge",
      maxRanks: 2,
      currentRank: 2,
      tier: 3,
      position: 0,
      iconType: "utility",
      rankEffects: ["+3 Rage from Charge", "+6 Rage from Charge"],
    },
    {
      id: "improved_overpower",
      name: "Improved Overpower",
      description: "Increases Overpower crit chance",
      maxRanks: 2,
      currentRank: 2,
      tier: 3,
      position: 1,
      iconType: "offensive",
      rankEffects: ["+25% Overpower crit", "+50% Overpower crit"],
    },
    {
      id: "anger_management",
      name: "Anger Management",
      description: "Passive Rage generation",
      maxRanks: 1,
      currentRank: 1,
      tier: 3,
      position: 2,
      iconType: "passive",
      rankEffects: ["Generate 1 Rage every 3 seconds"],
    },
    // Tier 4
    {
      id: "impale",
      name: "Impale",
      description: "Increases critical strike bonus damage",
      maxRanks: 2,
      currentRank: 2,
      tier: 4,
      position: 0,
      iconType: "offensive",
      rankEffects: ["+10% crit damage", "+20% crit damage"],
    },
    {
      id: "two_handed_weapon_spec",
      name: "Two-Handed Spec",
      description: "Increases two-handed weapon damage",
      maxRanks: 5,
      currentRank: 5,
      tier: 4,
      position: 1,
      iconType: "passive",
      rankEffects: ["+1% 2H damage", "+2% 2H damage", "+3% 2H damage", "+4% 2H damage", "+5% 2H damage"],
    },
    // Tier 5
    {
      id: "sweeping_strikes",
      name: "Sweeping Strikes",
      description: "Next 5 melee attacks hit additional target",
      maxRanks: 1,
      currentRank: 1,
      tier: 5,
      position: 0,
      iconType: "offensive",
      rankEffects: ["Next 5 attacks hit 1 additional target (30s CD)"],
    },
    {
      id: "sword_specialization",
      name: "Sword Spec",
      description: "Sword hits can proc extra attack",
      maxRanks: 5,
      currentRank: 3,
      tier: 5,
      position: 1,
      iconType: "passive",
      rankEffects: [
        "1% extra attack chance",
        "2% extra attack chance",
        "3% extra attack chance",
        "4% extra attack chance",
        "5% extra attack chance",
      ],
    },
    // Tier 6
    {
      id: "improved_hamstring",
      name: "Improved Hamstring",
      description: "Hamstring can immobilize",
      maxRanks: 3,
      currentRank: 0,
      tier: 6,
      position: 0,
      iconType: "utility",
      rankEffects: [
        "5% immobilize chance",
        "10% immobilize chance",
        "15% immobilize chance",
      ],
    },
    {
      id: "trauma",
      name: "Trauma",
      description: "Bleeds increase physical damage",
      maxRanks: 2,
      currentRank: 0,
      tier: 6,
      position: 1,
      iconType: "offensive",
      rankEffects: ["+15% physical damage", "+30% physical damage"],
    },
    // Tier 7 (Capstone)
    {
      id: "mortal_strike",
      name: "Mortal Strike",
      description: "Instant attack with healing reduction",
      maxRanks: 1,
      currentRank: 1,
      tier: 7,
      position: 0,
      iconType: "offensive",
      isCapstone: true,
      rankEffects: [
        "Instant: weapon damage +160, -50% healing for 10s (6s CD, 30 Rage)",
      ],
    },
  ],
};

export function TalentTreeDemo() {
  const pointsSpent = SAMPLE_ARMS_TREE.talents.reduce((sum, t) => sum + t.currentRank, 0);

  return (
    <div className="max-w-sm">
      <TalentTree
        tree={SAMPLE_ARMS_TREE}
        pointsSpent={pointsSpent}
        totalPoints={51 - pointsSpent}
        onAddPoint={(id) => console.log("Add point to:", id)}
        onRemovePoint={(id) => console.log("Remove point from:", id)}
        isActive={true}
      />
    </div>
  );
}
