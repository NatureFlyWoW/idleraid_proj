// ============= COMBAT SERVICE =============
// Integrates CombatSimulator with the activity system
// Handles building combat inputs from characters and content

import type { Character, Quest, Dungeon, DungeonBoss, Difficulty, ItemSlot } from '@shared/schema';
import type { CombatStats, CombatSimulationInput, CombatSimulationOutput, EnemyDefinition, AbilityDefinition } from '@shared/types';
import { simulateCombat } from '../engine/CombatSimulator';
import { calculateCombatStats, calculateTalentBonuses, getDefaultBuffEffects, type CharacterData, type EquipmentSet } from './StatCalculator';
import { getClassDefinition } from '../data/classes';
import { storage } from '../../storage';

// ============= INTERFACES =============

export interface CombatSetup {
  characterStats: CombatStats;
  characterLevel: number;
  characterClass: Character['characterClass'];
  abilities: AbilityDefinition[];
  enemy: EnemyDefinition;
  difficulty: Difficulty;
}

export interface CombatServiceResult {
  success: boolean;
  combatResult: CombatSimulationOutput;
  rewards?: {
    xp: number;
    gold: number;
    itemTemplateIds: number[];
  };
}

// ============= ENEMY BUILDERS =============

/**
 * Create an enemy definition from a quest
 */
function createQuestEnemy(quest: Quest): EnemyDefinition {
  // Calculate enemy stats based on quest level
  const level = quest.level;
  const isElite = quest.difficultyRating && quest.difficultyRating >= 3;
  const isBoss = quest.type === 'boss';

  const baseHealth = level * 100;
  const baseDamage = level * 8;

  const typeMultipliers = {
    normal: { health: 1, damage: 1 },
    elite: { health: 2.5, damage: 1.5 },
    boss: { health: 5, damage: 2 },
  };

  const type = isBoss ? 'boss' : isElite ? 'elite' : 'normal';
  const mult = isBoss ? typeMultipliers.boss : isElite ? typeMultipliers.elite : typeMultipliers.normal;

  return {
    id: `quest_${quest.id}`,
    name: quest.name,
    level,
    type: type as 'normal' | 'elite' | 'boss',
    health: Math.floor(baseHealth * mult.health),
    damage: Math.floor(baseDamage * mult.damage),
    attackSpeed: 2.0,
    armor: level * 20,
    abilities: [],
    baseXp: quest.xpReward,
    goldMin: quest.goldReward ? Math.floor(quest.goldReward * 0.8) : 0,
    goldMax: quest.goldReward ? Math.floor(quest.goldReward * 1.2) : 0,
  };
}

/**
 * Create an enemy definition from a dungeon boss
 */
function createDungeonBossEnemy(boss: DungeonBoss, dungeon: Dungeon): EnemyDefinition {
  const avgLevel = Math.floor((dungeon.levelMin + dungeon.levelMax) / 2);

  // Build abilities from boss mechanics
  const abilities: EnemyDefinition['abilities'] = [];
  if (boss.mechanics) {
    for (const mech of boss.mechanics) {
      abilities.push({
        name: mech.name,
        damage: mech.damage ?? 0,
        cooldown: 15,
        trigger: mech.trigger === 'health_percent' ? 'health_percent' : 'timer',
        triggerValue: mech.triggerValue ?? 30,
      });
    }
  }

  return {
    id: `boss_${boss.id}`,
    name: boss.name,
    level: avgLevel + 2, // Bosses are 2 levels higher
    type: boss.isFinalBoss ? 'boss' : 'elite',
    health: boss.health,
    damage: boss.damage,
    attackSpeed: 2.0,
    armor: boss.armor ?? avgLevel * 50,
    abilities,
    baseXp: avgLevel * 200, // Base XP for bosses
    goldMin: avgLevel * 10,
    goldMax: avgLevel * 20,
  };
}

/**
 * Create a trash mob enemy for dungeon trash packs
 */
function createDungeonTrashEnemy(dungeon: Dungeon, packIndex: number): EnemyDefinition {
  const avgLevel = Math.floor((dungeon.levelMin + dungeon.levelMax) / 2);

  return {
    id: `trash_${dungeon.id}_${packIndex}`,
    name: `${dungeon.name} Guardian`,
    level: avgLevel,
    type: 'elite',
    health: avgLevel * 250,
    damage: avgLevel * 12,
    attackSpeed: 2.0,
    armor: avgLevel * 30,
    abilities: [],
    baseXp: avgLevel * 45 * 2, // Elite XP
    goldMin: avgLevel * 2,
    goldMax: avgLevel * 5,
  };
}

// ============= CHARACTER DATA BUILDERS =============

/**
 * Build CharacterData from a Character entity
 */
function buildCharacterData(character: Character): CharacterData {
  return {
    level: character.level,
    characterClass: character.characterClass,
    baseStrength: character.baseStrength,
    baseAgility: character.baseAgility,
    baseIntellect: character.baseIntellect,
    baseStamina: character.baseStamina,
    baseSpirit: character.baseSpirit,
    currentHealth: character.currentHealth,
    currentResource: character.currentResource,
  };
}

/**
 * Build EquipmentSet from character's equipped items
 */
async function buildEquipmentSet(characterId: number): Promise<EquipmentSet> {
  const equippedItems = await storage.inventory.getEquippedItems(characterId);
  const items = new Map<ItemSlot, null>();

  // Initialize all slots as empty
  const slots: ItemSlot[] = [
    'head', 'neck', 'shoulders', 'back', 'chest', 'wrist', 'hands',
    'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2',
    'mainHand', 'offHand', 'ranged'
  ];
  for (const slot of slots) {
    items.set(slot, null);
  }

  // Fill in equipped items
  for (const item of equippedItems) {
    if (item.equippedSlot) {
      const template = await storage.content.getItemTemplate(item.templateId);
      if (template) {
        // Convert ItemTemplate to GeneratedItem format
        const generatedItem = {
          templateId: template.id,
          name: template.name,
          description: template.description ?? undefined,
          slot: template.slot,
          rarity: template.rarity,
          itemLevel: template.itemLevel,
          requiredLevel: template.requiredLevel ?? 1,
          stats: {
            strength: template.strength ?? 0,
            agility: template.agility ?? 0,
            intellect: template.intellect ?? 0,
            stamina: template.stamina ?? 0,
            spirit: template.spirit ?? 0,
            critRating: template.critRating ?? 0,
            hitRating: template.hitRating ?? 0,
            hasteRating: template.hasteRating ?? 0,
            attackPower: template.attackPower ?? 0,
            spellPower: template.spellPower ?? 0,
            armor: template.armor ?? 0,
          },
          isWeapon: template.isWeapon ?? false,
          weaponDamageMin: template.minDamage ?? undefined,
          weaponDamageMax: template.maxDamage ?? undefined,
          weaponSpeed: template.weaponSpeed ?? undefined,
          weaponDps: template.minDamage && template.maxDamage && template.weaponSpeed
            ? ((template.minDamage + template.maxDamage) / 2) / template.weaponSpeed
            : undefined,
        };
        (items as any).set(item.equippedSlot, generatedItem);
      }
    }
  }

  return { items };
}

// ============= MAIN SERVICE FUNCTIONS =============

/**
 * Run combat for a quest
 */
export async function runQuestCombat(
  character: Character,
  quest: Quest,
  difficulty: Difficulty
): Promise<CombatServiceResult> {
  // Build character data
  const characterData = buildCharacterData(character);
  const equipment = await buildEquipmentSet(character.id);

  // Calculate talent bonuses from character's allocation
  const talentBonuses = calculateTalentBonuses(
    character.characterClass,
    character.talentTree1Points,
    character.talentTree2Points,
    character.talentTree3Points
  );

  // Calculate combat stats
  const { stats } = calculateCombatStats(
    characterData,
    equipment,
    talentBonuses,
    getDefaultBuffEffects()
  );

  // Get class abilities
  const classDef = getClassDefinition(character.characterClass);
  if (!classDef) {
    throw new Error(`Class ${character.characterClass} not implemented`);
  }

  // Filter abilities by level
  const availableAbilities = classDef.abilities.filter(
    ability => ability.levelRequired <= character.level
  );

  // Create enemy
  const enemy = createQuestEnemy(quest);

  // Build simulation input
  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: character.level,
    characterClass: character.characterClass,
    abilities: availableAbilities,
    enemy,
    maxDurationSeconds: 300, // 5 minute max
    difficulty,
    settings: {
      healthPotionThreshold: 40,
      manaPotionThreshold: 30,
      useCooldowns: true,
      fleeOnLowHealth: true,
      fleeHealthThreshold: 15,
    },
    consumables: {
      healthPotions: 3,
      manaPotions: 3,
      buffPotions: [],
    },
  };

  // Run simulation
  const combatResult = simulateCombat(input);

  // Build rewards if successful
  let rewards;
  if (combatResult.victory) {
    rewards = {
      xp: quest.xpReward,
      gold: quest.goldReward ?? 0,
      itemTemplateIds: quest.itemRewards ?? [],
    };
  }

  return {
    success: combatResult.victory,
    combatResult,
    rewards,
  };
}

/**
 * Run combat for a dungeon (full clear)
 */
export async function runDungeonCombat(
  character: Character,
  dungeon: Dungeon,
  difficulty: Difficulty
): Promise<CombatServiceResult> {
  // Build character data
  const characterData = buildCharacterData(character);
  const equipment = await buildEquipmentSet(character.id);

  // Calculate talent bonuses from character's allocation
  const talentBonuses = calculateTalentBonuses(
    character.characterClass,
    character.talentTree1Points,
    character.talentTree2Points,
    character.talentTree3Points
  );

  // Calculate combat stats
  const { stats } = calculateCombatStats(
    characterData,
    equipment,
    talentBonuses,
    getDefaultBuffEffects()
  );

  // Get class abilities
  const classDef = getClassDefinition(character.characterClass);
  if (!classDef) {
    throw new Error(`Class ${character.characterClass} not implemented`);
  }

  const availableAbilities = classDef.abilities.filter(
    ability => ability.levelRequired <= character.level
  );

  // Get dungeon bosses
  const bosses = await storage.content.getDungeonBosses(dungeon.id);

  // Aggregate results
  let totalXp = 0;
  let totalGold = 0;
  const allItems: number[] = [];
  const allCombatLogs: CombatSimulationOutput['combatLog'] = [];
  const allHighlights: string[] = [];
  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  let totalHealing = 0;
  let totalDuration = 0;
  let currentPlayerHealth = stats.maxHealth;
  let currentPlayerResource = stats.maxResource;

  // First, fight trash packs
  const trashPackCount = dungeon.trashPackCount ?? 5;
  for (let i = 0; i < trashPackCount; i++) {
    const trashEnemy = createDungeonTrashEnemy(dungeon, i);

    // Adjust player starting health based on previous fights
    const adjustedStats = { ...stats };
    adjustedStats.maxHealth = currentPlayerHealth; // Carry over health

    const input: CombatSimulationInput = {
      characterStats: adjustedStats,
      characterLevel: character.level,
      characterClass: character.characterClass,
      abilities: availableAbilities,
      enemy: trashEnemy,
      maxDurationSeconds: 120,
      difficulty,
      settings: {
        healthPotionThreshold: 40,
        manaPotionThreshold: 30,
        useCooldowns: false, // Save cooldowns for bosses
        fleeOnLowHealth: true,
        fleeHealthThreshold: 15,
      },
      consumables: {
        healthPotions: 2,
        manaPotions: 2,
        buffPotions: [],
      },
    };

    const result = simulateCombat(input);

    if (!result.victory) {
      // Died to trash - return failure
      return {
        success: false,
        combatResult: {
          ...result,
          totalDamageDealt,
          totalDamageTaken,
          totalHealing,
          durationSeconds: totalDuration,
          highlights: [...allHighlights, `Defeated by ${trashEnemy.name}`],
          deathReason: `Killed by ${trashEnemy.name}`,
        },
      };
    }

    // Update running totals
    totalXp += trashEnemy.baseXp;
    totalGold += Math.floor((trashEnemy.goldMin + trashEnemy.goldMax) / 2);
    totalDamageDealt += result.totalDamageDealt;
    totalDamageTaken += result.totalDamageTaken;
    totalHealing += result.totalHealing;
    totalDuration += result.durationSeconds;
    currentPlayerHealth = Math.floor(result.playerHealthRemaining * stats.maxHealth / 100);
    allHighlights.push(`Cleared trash pack ${i + 1}/${trashPackCount}`);

    // Regenerate some health/mana between packs
    currentPlayerHealth = Math.min(stats.maxHealth, currentPlayerHealth + Math.floor(stats.maxHealth * 0.1));
    currentPlayerResource = Math.min(stats.maxResource, currentPlayerResource + Math.floor(stats.maxResource * 0.2));
  }

  // Then fight bosses
  for (const boss of bosses) {
    const bossEnemy = createDungeonBossEnemy(boss, dungeon);

    const adjustedStats = { ...stats };
    adjustedStats.maxHealth = currentPlayerHealth;

    const input: CombatSimulationInput = {
      characterStats: adjustedStats,
      characterLevel: character.level,
      characterClass: character.characterClass,
      abilities: availableAbilities,
      enemy: bossEnemy,
      maxDurationSeconds: boss.enrageTimerSeconds ?? 300,
      difficulty,
      settings: {
        healthPotionThreshold: 40,
        manaPotionThreshold: 30,
        useCooldowns: true, // Use cooldowns on bosses
        fleeOnLowHealth: false, // Can't flee from bosses
        fleeHealthThreshold: 0,
      },
      consumables: {
        healthPotions: 3,
        manaPotions: 3,
        buffPotions: [],
      },
    };

    const result = simulateCombat(input);

    if (!result.victory) {
      return {
        success: false,
        combatResult: {
          ...result,
          totalDamageDealt,
          totalDamageTaken,
          totalHealing,
          durationSeconds: totalDuration,
          highlights: [...allHighlights, `Defeated by ${boss.name}`],
          deathReason: `Killed by ${boss.name}`,
        },
      };
    }

    // Update totals
    totalXp += bossEnemy.baseXp;
    totalGold += Math.floor((bossEnemy.goldMin + bossEnemy.goldMax) / 2);
    totalDamageDealt += result.totalDamageDealt;
    totalDamageTaken += result.totalDamageTaken;
    totalHealing += result.totalHealing;
    totalDuration += result.durationSeconds;
    currentPlayerHealth = Math.floor(result.playerHealthRemaining * stats.maxHealth / 100);
    allHighlights.push(`Defeated ${boss.name}!`);

    // Add boss loot
    if (boss.lootTable) {
      for (const loot of boss.lootTable) {
        if (Math.random() * 100 < loot.dropChance) {
          allItems.push(loot.itemId);
        }
      }
    }

    // Regenerate between bosses
    currentPlayerHealth = Math.min(stats.maxHealth, currentPlayerHealth + Math.floor(stats.maxHealth * 0.2));
    currentPlayerResource = stats.maxResource; // Full mana/resource regen
  }

  // Success - dungeon cleared
  return {
    success: true,
    combatResult: {
      victory: true,
      durationSeconds: totalDuration,
      playerHealthRemaining: currentPlayerHealth,
      playerHealthPercent: (currentPlayerHealth / stats.maxHealth) * 100,
      totalDamageDealt,
      totalDamageTaken,
      totalHealing,
      dps: totalDuration > 0 ? totalDamageDealt / totalDuration : 0,
      combatLog: allCombatLogs,
      highlights: allHighlights,
      critCount: 0,
      missCount: 0,
      rewards: {
        experience: totalXp,
        gold: totalGold,
        items: allItems,
      },
    },
    rewards: {
      xp: totalXp,
      gold: totalGold,
      itemTemplateIds: allItems,
    },
  };
}

/**
 * Simulate combat and return a preview (doesn't apply rewards)
 */
export async function previewCombat(
  character: Character,
  enemyId: string,
  difficulty: Difficulty
): Promise<CombatSimulationOutput> {
  // Build character data
  const characterData = buildCharacterData(character);
  const equipment = await buildEquipmentSet(character.id);

  // Calculate talent bonuses from character's allocation
  const talentBonuses = calculateTalentBonuses(
    character.characterClass,
    character.talentTree1Points,
    character.talentTree2Points,
    character.talentTree3Points
  );

  // Calculate combat stats
  const { stats } = calculateCombatStats(
    characterData,
    equipment,
    talentBonuses,
    getDefaultBuffEffects()
  );

  // Get class abilities
  const classDef = getClassDefinition(character.characterClass);
  if (!classDef) {
    throw new Error(`Class ${character.characterClass} not implemented`);
  }

  const availableAbilities = classDef.abilities.filter(
    ability => ability.levelRequired <= character.level
  );

  // Create a generic enemy based on character level for preview
  const enemy: EnemyDefinition = {
    id: enemyId,
    name: 'Target Dummy',
    level: character.level,
    type: 'normal',
    health: character.level * 150,
    damage: character.level * 10,
    attackSpeed: 2.0,
    armor: character.level * 20,
    abilities: [],
    baseXp: character.level * 45,
    goldMin: character.level * 1,
    goldMax: character.level * 3,
  };

  const input: CombatSimulationInput = {
    characterStats: stats,
    characterLevel: character.level,
    characterClass: character.characterClass,
    abilities: availableAbilities,
    enemy,
    maxDurationSeconds: 60,
    difficulty,
    settings: {
      healthPotionThreshold: 40,
      manaPotionThreshold: 30,
      useCooldowns: true,
      fleeOnLowHealth: false,
      fleeHealthThreshold: 0,
    },
    consumables: {
      healthPotions: 0,
      manaPotions: 0,
      buffPotions: [],
    },
  };

  return simulateCombat(input);
}
