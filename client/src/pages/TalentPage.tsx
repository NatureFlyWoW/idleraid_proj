import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import { TalentTree, TalentTreeData, CompactTalentTree, SAMPLE_ARMS_TREE } from "@/components/game/TalentTree";
import { TalentData } from "@/components/game/TalentNode";
import {
  RotateCcw,
  Save,
  AlertTriangle,
  Coins,
  Star,
  Swords,
  Shield,
  Zap,
} from "lucide-react";
import { TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// ============================================================================
// TALENT PAGE - Full talent management with 3 specialization trees
// ============================================================================

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
  gold: number;
}

interface TalentState {
  pointsSpent: Record<string, number>; // tree id -> points
  talents: Record<string, number>; // talent id -> current rank
}

// Class specialization configurations
const CLASS_SPECS: Record<string, { trees: Omit<TalentTreeData, "talents">[]; icon: typeof Swords }> = {
  warrior: {
    icon: Swords,
    trees: [
      { id: "arms", name: "Arms", specName: "Two-Handed DPS", description: "Burst damage, bleed effects, and execute mechanics.", color: "#C79C6E" },
      { id: "fury", name: "Fury", specName: "Dual-Wield DPS", description: "Sustained damage, enrage effects, and frenzy mechanics.", color: "#C79C6E" },
      { id: "protection", name: "Protection", specName: "Tanking", description: "Damage mitigation, threat generation, and survival.", color: "#C79C6E" },
    ],
  },
  paladin: {
    icon: Shield,
    trees: [
      { id: "holy", name: "Holy", specName: "Healing", description: "Healing throughput, mana efficiency, and Holy damage support.", color: "#F58CBA" },
      { id: "protection", name: "Protection", specName: "Tanking", description: "Block mechanics, Holy threat, and defensive cooldowns.", color: "#F58CBA" },
      { id: "retribution", name: "Retribution", specName: "Melee DPS", description: "Seal/Judgement damage, burst damage, and melee Holy hybrid.", color: "#F58CBA" },
    ],
  },
  hunter: {
    icon: Zap,
    trees: [
      { id: "beast_mastery", name: "Beast Mastery", specName: "Pet DPS", description: "Pet damage, pet survivability, and exotic beasts.", color: "#ABD473" },
      { id: "marksmanship", name: "Marksmanship", specName: "Ranged DPS", description: "Ranged damage, critical strikes, and aimed shots.", color: "#ABD473" },
      { id: "survival", name: "Survival", specName: "Utility/Traps", description: "Traps, survival skills, and melee backup.", color: "#ABD473" },
    ],
  },
  rogue: {
    icon: Swords,
    trees: [
      { id: "assassination", name: "Assassination", specName: "Poison DPS", description: "Poison damage, critical strikes, and instant attacks.", color: "#FFF569" },
      { id: "combat", name: "Combat", specName: "Sustained DPS", description: "Sustained damage, weapon specializations, and combo points.", color: "#FFF569" },
      { id: "subtlety", name: "Subtlety", specName: "Stealth/Utility", description: "Stealth, ambush damage, and crowd control.", color: "#FFF569" },
    ],
  },
  priest: {
    icon: Star,
    trees: [
      { id: "discipline", name: "Discipline", specName: "Hybrid", description: "Damage prevention, mana efficiency, and buffs.", color: "#FFFFFF" },
      { id: "holy", name: "Holy", specName: "Healing", description: "Direct healing, AoE healing, and spirit-based regen.", color: "#FFFFFF" },
      { id: "shadow", name: "Shadow", specName: "DoT DPS", description: "Shadow damage, DoTs, and mana return mechanics.", color: "#FFFFFF" },
    ],
  },
  mage: {
    icon: Zap,
    trees: [
      { id: "arcane", name: "Arcane", specName: "Burst DPS", description: "Burst damage, mana management, and cooldown reduction.", color: "#69CCF0" },
      { id: "fire", name: "Fire", specName: "DoT/Crit DPS", description: "Fire damage, critical strikes, and ignite effects.", color: "#69CCF0" },
      { id: "frost", name: "Frost", specName: "Control/Sustained", description: "Frost damage, slows, and shatter combos.", color: "#69CCF0" },
    ],
  },
  druid: {
    icon: Star,
    trees: [
      { id: "balance", name: "Balance", specName: "Caster DPS", description: "Nature/Arcane damage, eclipse mechanics, and moonfire.", color: "#FF7D0A" },
      { id: "feral", name: "Feral", specName: "Melee/Tank", description: "Cat DPS, bear tanking, and shapeshifting.", color: "#FF7D0A" },
      { id: "restoration", name: "Restoration", specName: "Healing", description: "HoT healing, nature spells, and innervate.", color: "#FF7D0A" },
    ],
  },
};

// Generate placeholder talents for a tree
function generatePlaceholderTalents(treeId: string, classColor: string): TalentData[] {
  const talents: TalentData[] = [];

  // Tier 1 - 3 talents
  talents.push(
    { id: `${treeId}_t1_1`, name: "Tier 1 Talent A", description: "Placeholder talent", maxRanks: 5, currentRank: 0, tier: 1, position: 0, iconType: "offensive" },
    { id: `${treeId}_t1_2`, name: "Tier 1 Talent B", description: "Placeholder talent", maxRanks: 5, currentRank: 0, tier: 1, position: 1, iconType: "defensive" },
    { id: `${treeId}_t1_3`, name: "Tier 1 Talent C", description: "Placeholder talent", maxRanks: 3, currentRank: 0, tier: 1, position: 2, iconType: "utility" }
  );

  // Tier 2 - 2-3 talents
  talents.push(
    { id: `${treeId}_t2_1`, name: "Tier 2 Talent A", description: "Placeholder talent", maxRanks: 5, currentRank: 0, tier: 2, position: 0, iconType: "offensive" },
    { id: `${treeId}_t2_2`, name: "Tier 2 Talent B", description: "Placeholder talent", maxRanks: 3, currentRank: 0, tier: 2, position: 1, iconType: "passive" }
  );

  // Tier 3 - 3 talents
  talents.push(
    { id: `${treeId}_t3_1`, name: "Tier 3 Talent A", description: "Placeholder talent", maxRanks: 2, currentRank: 0, tier: 3, position: 0, iconType: "utility" },
    { id: `${treeId}_t3_2`, name: "Tier 3 Talent B", description: "Placeholder talent", maxRanks: 2, currentRank: 0, tier: 3, position: 1, iconType: "offensive" },
    { id: `${treeId}_t3_3`, name: "Tier 3 Talent C", description: "Placeholder talent", maxRanks: 1, currentRank: 0, tier: 3, position: 2, iconType: "passive" }
  );

  // Tier 4 - 2 talents
  talents.push(
    { id: `${treeId}_t4_1`, name: "Tier 4 Talent A", description: "Placeholder talent", maxRanks: 2, currentRank: 0, tier: 4, position: 0, iconType: "offensive" },
    { id: `${treeId}_t4_2`, name: "Tier 4 Talent B", description: "Placeholder talent", maxRanks: 5, currentRank: 0, tier: 4, position: 1, iconType: "passive" }
  );

  // Tier 5 - 3 talents
  talents.push(
    { id: `${treeId}_t5_1`, name: "Tier 5 Talent A", description: "Placeholder talent", maxRanks: 1, currentRank: 0, tier: 5, position: 0, iconType: "offensive" },
    { id: `${treeId}_t5_2`, name: "Tier 5 Talent B", description: "Placeholder talent", maxRanks: 5, currentRank: 0, tier: 5, position: 1, iconType: "passive" },
    { id: `${treeId}_t5_3`, name: "Tier 5 Talent C", description: "Placeholder talent", maxRanks: 5, currentRank: 0, tier: 5, position: 2, iconType: "defensive" }
  );

  // Tier 6 - 2 talents
  talents.push(
    { id: `${treeId}_t6_1`, name: "Tier 6 Talent A", description: "Placeholder talent", maxRanks: 3, currentRank: 0, tier: 6, position: 0, iconType: "utility" },
    { id: `${treeId}_t6_2`, name: "Tier 6 Talent B", description: "Placeholder talent", maxRanks: 2, currentRank: 0, tier: 6, position: 1, iconType: "offensive" }
  );

  // Tier 7 - Capstone
  talents.push(
    { id: `${treeId}_capstone`, name: "Capstone Ability", description: "Powerful 31-point talent", maxRanks: 1, currentRank: 0, tier: 7, position: 0, iconType: "offensive", isCapstone: true }
  );

  return talents;
}

// ============================================================================
// MAIN TALENT PAGE
// ============================================================================

export default function TalentPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const characterId = parseInt(params.id || "0");

  const [activeTree, setActiveTree] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [localTalents, setLocalTalents] = useState<Record<string, number>>({});

  // Fetch character data
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

  // Fetch talent data from API
  const { data: talentData, isLoading: talentsLoading } = useQuery({
    queryKey: ["talents", characterId],
    queryFn: async () => {
      const response = await fetch(`/api/characters/${characterId}/talents`);
      if (!response.ok) throw new Error("Failed to fetch talents");
      return response.json();
    },
    enabled: characterId > 0,
  });

  // Apply talents mutation
  const applyMutation = useMutation({
    mutationFn: async (talents: Record<string, number>) => {
      const response = await fetch(`/api/characters/${characterId}/talents/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talents }),
      });
      if (!response.ok) throw new Error("Failed to apply talents");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talents", characterId] });
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      setHasChanges(false);
    },
  });

  // Reset talents mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/characters/${characterId}/talents/reset`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to reset talents");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talents", characterId] });
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      setLocalTalents({});
      setHasChanges(false);
    },
  });

  // Calculate available points
  const totalPoints = character ? Math.max(0, character.level - 9) : 0; // Points start at level 10

  // Get class specs
  const classSpecs = character ? CLASS_SPECS[character.characterClass.toLowerCase()] : null;

  // Build trees with talents
  const trees: TalentTreeData[] = classSpecs?.trees.map((spec) => {
    // Use Arms sample for first warrior tree, placeholders for others
    if (character?.characterClass.toLowerCase() === "warrior" && spec.id === "arms") {
      return { ...SAMPLE_ARMS_TREE };
    }
    return {
      ...spec,
      talents: generatePlaceholderTalents(spec.id, spec.color),
    };
  }) || [];

  // Calculate points spent per tree
  const getPointsSpent = (tree: TalentTreeData) => {
    return tree.talents.reduce((sum, t) => {
      const localRank = localTalents[t.id];
      return sum + (localRank !== undefined ? localRank : t.currentRank);
    }, 0);
  };

  const totalSpent = trees.reduce((sum, tree) => sum + getPointsSpent(tree), 0);
  const availablePoints = totalPoints - totalSpent;

  // Handle adding/removing points
  const handleAddPoint = (treeId: string, talentId: string) => {
    if (availablePoints <= 0) return;

    const tree = trees.find((t) => t.id === treeId);
    const talent = tree?.talents.find((t) => t.id === talentId);
    if (!talent) return;

    const currentRank = localTalents[talentId] ?? talent.currentRank;
    if (currentRank >= talent.maxRanks) return;

    setLocalTalents((prev) => ({ ...prev, [talentId]: currentRank + 1 }));
    setHasChanges(true);
  };

  const handleRemovePoint = (treeId: string, talentId: string) => {
    const tree = trees.find((t) => t.id === treeId);
    const talent = tree?.talents.find((t) => t.id === talentId);
    if (!talent) return;

    const currentRank = localTalents[talentId] ?? talent.currentRank;
    if (currentRank <= 0) return;

    setLocalTalents((prev) => ({ ...prev, [talentId]: currentRank - 1 }));
    setHasChanges(true);
  };

  const handleSave = () => {
    applyMutation.mutate(localTalents);
  };

  const handleReset = () => {
    if (confirm("Reset all talents? This costs gold!")) {
      resetMutation.mutate();
    }
  };

  // Loading state
  if (characterLoading || talentsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500 font-mono animate-pulse">Loading talents...</div>
      </div>
    );
  }

  // Character not found
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

  const ClassIcon = classSpecs?.icon || Swords;

  return (
    <div className="min-h-screen bg-black text-stone-300 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <TerminalButton variant="secondary" onClick={() => navigate(`/game/${characterId}`)}>
            [←] Back
          </TerminalButton>
          <h1 className="text-xl font-bold text-yellow-400 font-mono uppercase tracking-wider">
            Talent Trees
          </h1>
          <div className="w-24" />
        </div>

        {/* Character & Points Info */}
        <TerminalPanel variant="green" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ClassIcon className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-yellow-400 font-mono font-bold">{character.name}</div>
                <div className="text-xs font-mono text-stone-500 capitalize">
                  Level {character.level} {character.characterClass}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Points display */}
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-yellow-400">
                  {availablePoints}
                </div>
                <div className="text-[10px] font-mono text-stone-500">
                  Points Available
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-stone-400">
                  {totalSpent}/{totalPoints}
                </div>
                <div className="text-[10px] font-mono text-stone-500">
                  Points Spent
                </div>
              </div>

              {/* Gold */}
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-mono text-yellow-400">{character.gold}</span>
              </div>
            </div>
          </div>

          {/* Unsaved changes warning */}
          {hasChanges && (
            <div className="mt-4 p-2 bg-amber-900/20 border border-amber-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-mono text-yellow-400">
                  You have unsaved talent changes
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLocalTalents({});
                    setHasChanges(false);
                  }}
                  className="px-3 py-1 text-xs font-mono bg-stone-800 border border-stone-600 text-stone-400 hover:bg-stone-700"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={applyMutation.isPending}
                  className="px-3 py-1 text-xs font-mono bg-green-900/30 border border-green-700 text-green-400 hover:bg-green-900/50 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  {applyMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </TerminalPanel>

        {/* Level requirement notice */}
        {character.level < 10 && (
          <div className="mb-6 p-4 bg-stone-800/50 border border-stone-700 text-center">
            <div className="text-stone-400 font-mono">
              Talents unlock at level 10. You are level {character.level}.
            </div>
          </div>
        )}

        {/* Talent Trees */}
        {character.level >= 10 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {trees.map((tree) => {
              // Apply local changes to talent ranks
              const treeWithLocalChanges = {
                ...tree,
                talents: tree.talents.map((t) => ({
                  ...t,
                  currentRank: localTalents[t.id] ?? t.currentRank,
                })),
              };

              return (
                <TalentTree
                  key={tree.id}
                  tree={treeWithLocalChanges}
                  pointsSpent={getPointsSpent(treeWithLocalChanges)}
                  totalPoints={availablePoints}
                  onAddPoint={(talentId) => handleAddPoint(tree.id, talentId)}
                  onRemovePoint={(talentId) => handleRemovePoint(tree.id, talentId)}
                  isActive={activeTree === tree.id}
                />
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleReset}
            disabled={resetMutation.isPending || totalSpent === 0}
            className="px-6 py-2 font-mono text-sm bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {resetMutation.isPending ? "Resetting..." : "Reset All Talents (15g)"}
          </button>
          <button
            onClick={() => navigate(`/game/${characterId}`)}
            className="px-6 py-2 font-mono text-sm bg-amber-900/30 border border-amber-700 text-yellow-400 hover:bg-amber-900/50"
          >
            Return to Game
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-xs font-mono text-stone-600">
          <p>Left-click to add points • Right-click or Shift+click to remove points</p>
          <p className="mt-1">Spend 5 points per tier to unlock the next tier</p>
        </div>
      </div>
    </div>
  );
}
