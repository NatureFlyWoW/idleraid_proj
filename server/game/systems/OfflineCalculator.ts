// ============= OFFLINE PROGRESS CALCULATOR =============
// Calculates rewards for time spent away from the game

import type { Character, Quest, Dungeon, Difficulty } from '@shared/schema';
import {
  MAX_OFFLINE_HOURS,
  calculateXpGain,
  calculateGoldDrop,
  calculateSuccessRate,
  getXpRequiredForLevel,
  calculateRestedXpGain,
  RESTED_XP_MAX_PERCENT,
  MAX_LEVEL,
} from '@shared/constants/gameConfig';
import { storage } from '../../storage';

// ============= TYPES =============

export interface OfflineProgressResult {
  offlineDurationSeconds: number;
  effectiveDurationSeconds: number;
  cappedAt18Hours: boolean;

  activityPerformed: string;
  cyclesCompleted: number;

  xpEarned: number;
  goldEarned: number;
  itemsFound: number[];

  levelsGained: number;
  previousLevel: number;
  currentLevel: number;

  // Rested XP tracking
  restedXpAccumulated: number;  // Rested XP gained from being offline
  restedXpConsumed: number;     // Rested XP consumed for 200% bonus
  restedXpRemaining: number;    // Rested XP left after combat
  bonusXpFromRested: number;    // Extra XP earned from rested bonus

  died: boolean;
  deathReason?: string;
  diedAfterCycles?: number;
}

interface ActivityConfig {
  name: string;
  durationSeconds: number;
  mobLevel: number;
  mobType: 'normal' | 'elite' | 'boss' | 'raid_boss';
  xpPerCycle: number;
  goldPerCycle: number;
  lootChance: number;
  lootTableIds: number[];
  deathChanceOnFail: number;
}

// ============= HELPER FUNCTIONS =============

/**
 * Calculate character's effective power level based on stats
 */
function calculateCharacterPower(character: Character): number {
  // Simple power calculation based on level and base stats
  const statSum = character.baseStrength + character.baseAgility +
    character.baseIntellect + character.baseStamina + character.baseSpirit;

  return character.level * 10 + statSum;
}

/**
 * Calculate required power for an activity
 */
function calculateRequiredPower(level: number, type: 'quest' | 'dungeon'): number {
  const baseMultiplier = type === 'dungeon' ? 1.5 : 1.0;
  return level * 10 * baseMultiplier;
}

/**
 * Roll for success based on success rate
 */
function rollSuccess(successRate: number): boolean {
  return Math.random() * 100 < successRate;
}

/**
 * Roll for death on failure
 */
function rollDeath(deathChance: number): boolean {
  return Math.random() * 100 < deathChance;
}

/**
 * Roll for loot drop
 */
function rollLoot(lootChance: number, lootTableIds: number[]): number | null {
  if (Math.random() * 100 < lootChance && lootTableIds.length > 0) {
    return lootTableIds[Math.floor(Math.random() * lootTableIds.length)];
  }
  return null;
}

/**
 * Calculate level after gaining XP
 */
function calculateNewLevel(currentLevel: number, currentXp: number, xpGained: number): { newLevel: number; newXp: number } {
  let level = currentLevel;
  let xp = currentXp + xpGained;

  while (level < MAX_LEVEL) {
    const xpForNextLevel = getXpRequiredForLevel(level + 1);
    if (xp >= xpForNextLevel) {
      xp -= xpForNextLevel;
      level++;
    } else {
      break;
    }
  }

  return { newLevel: level, newXp: xp };
}

// ============= ACTIVITY CONFIG BUILDERS =============

async function getQuestActivityConfig(quest: Quest, difficulty: Difficulty): Promise<ActivityConfig> {
  const difficultyMods = {
    safe: { xpMod: 0.5, goldMod: 0.5, lootMod: 0.5, deathChance: 0 },
    normal: { xpMod: 1.0, goldMod: 1.0, lootMod: 1.0, deathChance: 5 },
    challenging: { xpMod: 1.5, goldMod: 1.5, lootMod: 1.5, deathChance: 15 },
    heroic: { xpMod: 2.0, goldMod: 2.0, lootMod: 2.0, deathChance: 30 },
  };

  const mods = difficultyMods[difficulty];

  return {
    name: quest.name,
    durationSeconds: quest.baseDurationSeconds,
    mobLevel: quest.level,
    mobType: quest.type === 'boss' ? 'boss' : 'normal',
    xpPerCycle: Math.floor(quest.xpReward * mods.xpMod),
    goldPerCycle: Math.floor((quest.goldReward ?? 0) * mods.goldMod),
    lootChance: 20 * mods.lootMod,
    lootTableIds: quest.itemRewards ?? [],
    deathChanceOnFail: mods.deathChance,
  };
}

async function getDungeonActivityConfig(dungeon: Dungeon, difficulty: Difficulty): Promise<ActivityConfig> {
  const difficultyMods = {
    safe: { xpMod: 0.5, goldMod: 0.5, lootMod: 0.5, deathChance: 0 },
    normal: { xpMod: 1.0, goldMod: 1.0, lootMod: 1.0, deathChance: 10 },
    challenging: { xpMod: 1.5, goldMod: 1.5, lootMod: 1.5, deathChance: 25 },
    heroic: { xpMod: 2.0, goldMod: 2.0, lootMod: 2.0, deathChance: 50 },
  };

  const mods = difficultyMods[difficulty];
  const avgLevel = Math.floor((dungeon.levelMin + dungeon.levelMax) / 2);

  // Get bosses to determine loot table
  const bosses = await storage.content.getDungeonBosses(dungeon.id);
  const lootTableIds: number[] = [];
  bosses.forEach(boss => {
    if (boss.lootTable) {
      boss.lootTable.forEach(loot => lootTableIds.push(loot.itemId));
    }
  });

  return {
    name: dungeon.name,
    durationSeconds: dungeon.baseDurationSeconds,
    mobLevel: avgLevel,
    mobType: 'elite',
    xpPerCycle: Math.floor(calculateXpGain(avgLevel, avgLevel, 'elite', false) * (dungeon.trashPackCount ?? 5) * mods.xpMod),
    goldPerCycle: Math.floor(calculateGoldDrop(avgLevel, 'elite') * (dungeon.trashPackCount ?? 5) * mods.goldMod),
    lootChance: 40 * mods.lootMod,
    lootTableIds,
    deathChanceOnFail: mods.deathChance,
  };
}

async function getIdleActivityConfig(characterLevel: number): Promise<ActivityConfig> {
  // When idle, minimal passive gains
  return {
    name: 'Resting',
    durationSeconds: 60, // 1 minute per "cycle"
    mobLevel: 0,
    mobType: 'normal',
    xpPerCycle: 0,
    goldPerCycle: 0,
    lootChance: 0,
    lootTableIds: [],
    deathChanceOnFail: 0,
  };
}

// ============= MAIN CALCULATOR =============

/**
 * Calculate offline progress for a character
 */
export async function calculateOfflineProgress(
  character: Character,
  lastOnlineAt: Date,
  returnedAt: Date
): Promise<OfflineProgressResult> {
  // Calculate offline duration
  const offlineDurationMs = returnedAt.getTime() - lastOnlineAt.getTime();
  const offlineDurationSeconds = Math.floor(offlineDurationMs / 1000);

  // Cap at 18 hours
  const maxSeconds = MAX_OFFLINE_HOURS * 60 * 60;
  const effectiveDurationSeconds = Math.min(offlineDurationSeconds, maxSeconds);
  const cappedAt18Hours = offlineDurationSeconds > maxSeconds;

  // Calculate rested XP accumulated during offline time
  const hoursOffline = effectiveDurationSeconds / 3600;
  const currentLevelXpRequired = getXpRequiredForLevel(character.level + 1);
  const restedXpAccumulated = calculateRestedXpGain(hoursOffline, currentLevelXpRequired);

  // Calculate max rested XP for this level (100% of level's XP requirement)
  const maxRestedXp = Math.floor((currentLevelXpRequired * RESTED_XP_MAX_PERCENT) / 100);

  // Total rested XP available (existing + accumulated, capped at max)
  const existingRestedXp = character.restedXp ?? 0;
  let availableRestedXp = Math.min(existingRestedXp + restedXpAccumulated, maxRestedXp);

  // Initialize result
  const result: OfflineProgressResult = {
    offlineDurationSeconds,
    effectiveDurationSeconds,
    cappedAt18Hours,
    activityPerformed: 'Resting',
    cyclesCompleted: 0,
    xpEarned: 0,
    goldEarned: 0,
    itemsFound: [],
    levelsGained: 0,
    previousLevel: character.level,
    currentLevel: character.level,
    restedXpAccumulated,
    restedXpConsumed: 0,
    restedXpRemaining: availableRestedXp,
    bonusXpFromRested: 0,
    died: false,
  };

  // If no activity or idle, just accumulate rested XP
  if (!character.currentActivity || character.currentActivity === 'idle') {
    result.activityPerformed = 'Resting';
    return result;
  }

  // Get activity configuration
  let activityConfig: ActivityConfig;

  try {
    if (character.currentActivity === 'questing' && character.currentActivityId) {
      const quest = await storage.content.getQuestById(character.currentActivityId);
      if (!quest) {
        result.activityPerformed = 'Unknown Quest';
        return result;
      }
      activityConfig = await getQuestActivityConfig(quest, character.currentDifficulty ?? 'normal');
    } else if (character.currentActivity === 'dungeon' && character.currentActivityId) {
      const dungeon = await storage.content.getDungeonById(character.currentActivityId);
      if (!dungeon) {
        result.activityPerformed = 'Unknown Dungeon';
        return result;
      }
      activityConfig = await getDungeonActivityConfig(dungeon, character.currentDifficulty ?? 'normal');
    } else {
      activityConfig = await getIdleActivityConfig(character.level);
    }
  } catch {
    activityConfig = await getIdleActivityConfig(character.level);
  }

  result.activityPerformed = activityConfig.name;

  // Calculate character power vs required power
  const characterPower = calculateCharacterPower(character);
  const requiredPower = calculateRequiredPower(
    activityConfig.mobLevel,
    character.currentActivity === 'dungeon' ? 'dungeon' : 'quest'
  );
  const successRate = calculateSuccessRate(
    characterPower,
    requiredPower,
    character.currentDifficulty ?? 'normal'
  );

  // Simulate cycles
  let remainingSeconds = effectiveDurationSeconds;
  let currentXp = character.experience;
  let currentLevel = character.level;

  while (remainingSeconds >= activityConfig.durationSeconds) {
    remainingSeconds -= activityConfig.durationSeconds;

    // Roll for success
    const success = rollSuccess(successRate);

    if (success) {
      // Award base XP
      let xpGained = activityConfig.xpPerCycle;
      let bonusXp = 0;

      // Apply rested XP bonus (200% = double XP) if available
      if (availableRestedXp > 0 && xpGained > 0) {
        // Bonus XP equals base XP (making total 200%)
        // But limited by available rested XP
        bonusXp = Math.min(xpGained, availableRestedXp);
        availableRestedXp -= bonusXp;
        result.restedXpConsumed += bonusXp;
        result.bonusXpFromRested += bonusXp;
      }

      const totalXpGained = xpGained + bonusXp;
      result.xpEarned += totalXpGained;

      // Award gold
      result.goldEarned += activityConfig.goldPerCycle;

      // Roll for loot
      const lootItem = rollLoot(activityConfig.lootChance, activityConfig.lootTableIds);
      if (lootItem !== null) {
        result.itemsFound.push(lootItem);
      }

      // Check for level up
      const levelResult = calculateNewLevel(currentLevel, currentXp, totalXpGained);
      if (levelResult.newLevel > currentLevel) {
        result.levelsGained += levelResult.newLevel - currentLevel;
        currentLevel = levelResult.newLevel;
        currentXp = levelResult.newXp;
      } else {
        currentXp += totalXpGained;
      }

      result.cyclesCompleted++;
    } else {
      // Failed - check for death
      if (rollDeath(activityConfig.deathChanceOnFail)) {
        result.died = true;
        result.deathReason = `Defeated during ${activityConfig.name}`;
        result.diedAfterCycles = result.cyclesCompleted;
        break;
      }

      // Failed but survived - still count as an attempt
      result.cyclesCompleted++;
    }
  }

  result.currentLevel = currentLevel;
  result.restedXpRemaining = availableRestedXp;

  return result;
}

/**
 * Apply offline progress to a character
 */
export async function applyOfflineProgress(
  characterId: number,
  progress: OfflineProgressResult
): Promise<void> {
  const character = await storage.characters.getCharacterById(characterId);
  if (!character) {
    throw new Error('Character not found');
  }

  // Calculate new experience and level
  const newXp = character.experience + progress.xpEarned;
  const { newLevel, newXp: finalXp } = calculateNewLevel(
    character.level,
    character.experience,
    progress.xpEarned
  );

  // Update character stats
  await storage.characters.updateCharacterExperience(characterId, finalXp, newLevel);
  await storage.characters.updateCharacterGold(characterId, character.gold + progress.goldEarned);

  // Update rested XP
  const newLevelXpRequired = getXpRequiredForLevel(newLevel + 1);
  const maxRestedXp = Math.floor((newLevelXpRequired * RESTED_XP_MAX_PERCENT) / 100);
  await storage.characters.updateCharacter(characterId, {
    restedXp: progress.restedXpRemaining,
    maxRestedXp: maxRestedXp,
  });

  // Add items to inventory
  for (const itemTemplateId of progress.itemsFound) {
    await storage.inventory.addItem({
      characterId,
      templateId: itemTemplateId,
      isEquipped: false,
      quantity: 1,
    });
  }

  // If died, set character activity to idle and reduce health
  if (progress.died) {
    await storage.characters.clearCharacterActivity(characterId);
    await storage.characters.updateCharacterResources(
      characterId,
      Math.floor(character.maxHealth * 0.1), // 10% health on death
      character.currentResource
    );

    // Update death count
    await storage.characters.updateCharacter(characterId, {
      totalDeaths: (character.totalDeaths ?? 0) + 1,
    });
  }

  // Record offline session
  await storage.offline.createOfflineSession({
    characterId,
    lastOnlineAt: new Date(Date.now() - progress.offlineDurationSeconds * 1000),
    returnedAt: new Date(),
    offlineDurationSeconds: progress.offlineDurationSeconds,
    effectiveDurationSeconds: progress.effectiveDurationSeconds,
    activityType: character.currentActivity ?? 'idle',
    activityId: character.currentActivityId ?? undefined,
    activityName: progress.activityPerformed,
    difficulty: character.currentDifficulty ?? 'normal',
    cyclesCompleted: progress.cyclesCompleted,
    xpEarned: progress.xpEarned,
    goldEarned: progress.goldEarned,
    itemsFound: progress.itemsFound.length,
    died: progress.died,
    deathReason: progress.deathReason ?? undefined,
    levelsBefore: progress.previousLevel,
    levelsAfter: progress.currentLevel,
  });

  // Update last played timestamp
  await storage.characters.updateCharacter(characterId, {
    lastPlayedAt: new Date(),
  });
}

/**
 * Check if character has pending offline progress
 */
export async function hasPendingOfflineProgress(character: Character): Promise<boolean> {
  if (!character.lastPlayedAt) return false;

  const lastPlayed = new Date(character.lastPlayedAt);
  const now = new Date();
  const offlineMs = now.getTime() - lastPlayed.getTime();

  // Consider offline if more than 1 minute has passed
  return offlineMs > 60 * 1000;
}
