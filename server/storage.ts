// ============= GAME STORAGE LAYER =============
// Database access layer for Idle Raiders

import {
  users,
  characters,
  characterItems,
  characterConsumables,
  characterQuestProgress,
  characterReputations,
  characterAchievements,
  characterSettings,
  characterLockouts,
  combatLogs,
  journeyEntries,
  offlineSessions,
  itemTemplates,
  consumableTemplates,
  zones,
  quests,
  dungeons,
  dungeonBosses,
  raids,
  raidBosses,
  factions,
  achievements,
  type User,
  type InsertUser,
  type Character,
  type InsertCharacter,
  type CharacterItem,
  type InsertCharacterItem,
  type CharacterConsumable,
  type InsertCharacterConsumable,
  type CharacterQuestProgress,
  type InsertCharacterQuestProgress,
  type CharacterReputation,
  type InsertCharacterReputation,
  type CharacterAchievement,
  type InsertCharacterAchievement,
  type CharacterSettings,
  type InsertCharacterSettings,
  type CharacterLockout,
  type InsertCharacterLockout,
  type CombatLog,
  type InsertCombatLog,
  type JourneyEntry,
  type InsertJourneyEntry,
  type OfflineSession,
  type InsertOfflineSession,
  type ItemTemplate,
  type ConsumableTemplate,
  type Zone,
  type Quest,
  type Dungeon,
  type DungeonBoss,
  type Raid,
  type RaidBoss,
  type Faction,
  type Achievement,
  type ItemSlot,
} from '@shared/schema';
import { db } from './db';
import { eq, and, desc, asc, gte, lte, sql } from 'drizzle-orm';

// ============= USER STORAGE =============

export interface IUserStorage {
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  updateUserLastLogin(id: number): Promise<void>;
}

class UserStorage implements IUserStorage {
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
  }
}

// ============= CHARACTER STORAGE =============

export interface ICharacterStorage {
  getCharacterById(id: number): Promise<Character | undefined>;
  getCharactersByUserId(userId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<void>;

  // Character resources
  updateCharacterResources(id: number, health: number, resource: number): Promise<void>;
  updateCharacterExperience(id: number, experience: number, level: number): Promise<void>;
  updateCharacterGold(id: number, gold: number): Promise<void>;

  // Activity state
  updateCharacterActivity(
    id: number,
    activityType: string | null,
    activityId: number | null,
    activityStartedAt: Date | null,
    activityCompletesAt: Date | null
  ): Promise<void>;
  clearCharacterActivity(id: number): Promise<void>;
}

class CharacterStorage implements ICharacterStorage {
  async getCharacterById(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }

  async getCharactersByUserId(userId: number): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.userId, userId));
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db.insert(characters).values(insertCharacter).returning();
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined> {
    const [character] = await db
      .update(characters)
      .set({ ...updates, lastPlayedAt: new Date() })
      .where(eq(characters.id, id))
      .returning();
    return character;
  }

  async deleteCharacter(id: number): Promise<void> {
    await db.delete(characters).where(eq(characters.id, id));
  }

  async updateCharacterResources(id: number, health: number, resource: number): Promise<void> {
    await db
      .update(characters)
      .set({ currentHealth: health, currentResource: resource, lastPlayedAt: new Date() })
      .where(eq(characters.id, id));
  }

  async updateCharacterExperience(id: number, experience: number, level: number): Promise<void> {
    await db
      .update(characters)
      .set({ experience, level, lastPlayedAt: new Date() })
      .where(eq(characters.id, id));
  }

  async updateCharacterGold(id: number, gold: number): Promise<void> {
    await db.update(characters).set({ gold, lastPlayedAt: new Date() }).where(eq(characters.id, id));
  }

  async updateCharacterActivity(
    id: number,
    activityType: string | null,
    activityId: number | null,
    activityStartedAt: Date | null,
    activityCompletesAt: Date | null
  ): Promise<void> {
    await db
      .update(characters)
      .set({
        currentActivity: activityType as any,
        currentActivityId: activityId,
        activityStartedAt,
        activityCompletesAt,
        lastPlayedAt: new Date(),
      })
      .where(eq(characters.id, id));
  }

  async clearCharacterActivity(id: number): Promise<void> {
    await this.updateCharacterActivity(id, null, null, null, null);
  }
}

// ============= INVENTORY STORAGE =============

export interface IInventoryStorage {
  getCharacterItems(characterId: number): Promise<CharacterItem[]>;
  getEquippedItems(characterId: number): Promise<CharacterItem[]>;
  getInventoryItems(characterId: number): Promise<CharacterItem[]>;
  addItem(item: InsertCharacterItem): Promise<CharacterItem>;
  updateItem(id: number, updates: Partial<CharacterItem>): Promise<CharacterItem | undefined>;
  removeItem(id: number): Promise<void>;
  equipItem(id: number, slot: ItemSlot): Promise<void>;
  unequipItem(id: number): Promise<void>;

  getCharacterConsumables(characterId: number): Promise<CharacterConsumable[]>;
  addConsumable(consumable: InsertCharacterConsumable): Promise<CharacterConsumable>;
  updateConsumableQuantity(id: number, quantity: number): Promise<void>;
  removeConsumable(id: number): Promise<void>;
}

class InventoryStorage implements IInventoryStorage {
  async getCharacterItems(characterId: number): Promise<CharacterItem[]> {
    return await db.select().from(characterItems).where(eq(characterItems.characterId, characterId));
  }

  async getEquippedItems(characterId: number): Promise<CharacterItem[]> {
    return await db
      .select()
      .from(characterItems)
      .where(and(eq(characterItems.characterId, characterId), eq(characterItems.isEquipped, true)));
  }

  async getInventoryItems(characterId: number): Promise<CharacterItem[]> {
    return await db
      .select()
      .from(characterItems)
      .where(and(eq(characterItems.characterId, characterId), eq(characterItems.isEquipped, false)));
  }

  async addItem(item: InsertCharacterItem): Promise<CharacterItem> {
    const [newItem] = await db.insert(characterItems).values(item).returning();
    return newItem;
  }

  async updateItem(id: number, updates: Partial<CharacterItem>): Promise<CharacterItem | undefined> {
    const [item] = await db
      .update(characterItems)
      .set(updates)
      .where(eq(characterItems.id, id))
      .returning();
    return item;
  }

  async removeItem(id: number): Promise<void> {
    await db.delete(characterItems).where(eq(characterItems.id, id));
  }

  async equipItem(id: number, slot: ItemSlot): Promise<void> {
    await db
      .update(characterItems)
      .set({ isEquipped: true, equippedSlot: slot })
      .where(eq(characterItems.id, id));
  }

  async unequipItem(id: number): Promise<void> {
    await db
      .update(characterItems)
      .set({ isEquipped: false, equippedSlot: null })
      .where(eq(characterItems.id, id));
  }

  async getCharacterConsumables(characterId: number): Promise<CharacterConsumable[]> {
    return await db
      .select()
      .from(characterConsumables)
      .where(eq(characterConsumables.characterId, characterId));
  }

  async addConsumable(consumable: InsertCharacterConsumable): Promise<CharacterConsumable> {
    const [newConsumable] = await db.insert(characterConsumables).values(consumable).returning();
    return newConsumable;
  }

  async updateConsumableQuantity(id: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await db.delete(characterConsumables).where(eq(characterConsumables.id, id));
    } else {
      await db
        .update(characterConsumables)
        .set({ quantity })
        .where(eq(characterConsumables.id, id));
    }
  }

  async removeConsumable(id: number): Promise<void> {
    await db.delete(characterConsumables).where(eq(characterConsumables.id, id));
  }
}

// ============= QUEST STORAGE =============

export interface IQuestStorage {
  getQuestProgress(characterId: number): Promise<CharacterQuestProgress[]>;
  getActiveQuests(characterId: number): Promise<CharacterQuestProgress[]>;
  getCompletedQuests(characterId: number): Promise<CharacterQuestProgress[]>;
  startQuest(progress: InsertCharacterQuestProgress): Promise<CharacterQuestProgress>;
  updateQuestProgress(id: number, progress: number[]): Promise<void>;
  completeQuest(id: number): Promise<void>;
  abandonQuest(id: number): Promise<void>;
}

class QuestStorage implements IQuestStorage {
  async getQuestProgress(characterId: number): Promise<CharacterQuestProgress[]> {
    return await db
      .select()
      .from(characterQuestProgress)
      .where(eq(characterQuestProgress.characterId, characterId));
  }

  async getActiveQuests(characterId: number): Promise<CharacterQuestProgress[]> {
    return await db
      .select()
      .from(characterQuestProgress)
      .where(
        and(
          eq(characterQuestProgress.characterId, characterId),
          eq(characterQuestProgress.isActive, true)
        )
      );
  }

  async getCompletedQuests(characterId: number): Promise<CharacterQuestProgress[]> {
    return await db
      .select()
      .from(characterQuestProgress)
      .where(
        and(
          eq(characterQuestProgress.characterId, characterId),
          eq(characterQuestProgress.isActive, false)
        )
      );
  }

  async startQuest(progress: InsertCharacterQuestProgress): Promise<CharacterQuestProgress> {
    const [questProgress] = await db.insert(characterQuestProgress).values(progress).returning();
    return questProgress;
  }

  async updateQuestProgress(id: number, progress: number[]): Promise<void> {
    await db
      .update(characterQuestProgress)
      .set({ progress })
      .where(eq(characterQuestProgress.id, id));
  }

  async completeQuest(id: number): Promise<void> {
    await db
      .update(characterQuestProgress)
      .set({ isActive: false, lastCompletedAt: new Date(), completionCount: sql`${characterQuestProgress.completionCount} + 1` })
      .where(eq(characterQuestProgress.id, id));
  }

  async abandonQuest(id: number): Promise<void> {
    await db.delete(characterQuestProgress).where(eq(characterQuestProgress.id, id));
  }
}

// ============= REPUTATION STORAGE =============

export interface IReputationStorage {
  getCharacterReputations(characterId: number): Promise<CharacterReputation[]>;
  getReputation(characterId: number, factionId: number): Promise<CharacterReputation | undefined>;
  setReputation(rep: InsertCharacterReputation): Promise<CharacterReputation>;
  updateReputation(characterId: number, factionId: number, amount: number): Promise<void>;
}

class ReputationStorage implements IReputationStorage {
  async getCharacterReputations(characterId: number): Promise<CharacterReputation[]> {
    return await db
      .select()
      .from(characterReputations)
      .where(eq(characterReputations.characterId, characterId));
  }

  async getReputation(characterId: number, factionId: number): Promise<CharacterReputation | undefined> {
    const [rep] = await db
      .select()
      .from(characterReputations)
      .where(
        and(
          eq(characterReputations.characterId, characterId),
          eq(characterReputations.factionId, factionId)
        )
      );
    return rep;
  }

  async setReputation(rep: InsertCharacterReputation): Promise<CharacterReputation> {
    const [reputation] = await db.insert(characterReputations).values(rep).returning();
    return reputation;
  }

  async updateReputation(characterId: number, factionId: number, amount: number): Promise<void> {
    await db
      .update(characterReputations)
      .set({ reputation: sql`${characterReputations.reputation} + ${amount}` })
      .where(
        and(
          eq(characterReputations.characterId, characterId),
          eq(characterReputations.factionId, factionId)
        )
      );
  }
}

// ============= ACHIEVEMENT STORAGE =============

export interface IAchievementStorage {
  getCharacterAchievements(characterId: number): Promise<CharacterAchievement[]>;
  getUnlockedAchievements(characterId: number): Promise<CharacterAchievement[]>;
  trackAchievement(achievement: InsertCharacterAchievement): Promise<CharacterAchievement>;
  updateAchievementProgress(id: number, progress: number): Promise<void>;
  unlockAchievement(id: number): Promise<void>;
  getAllAchievements(): Promise<Achievement[]>;
}

class AchievementStorage implements IAchievementStorage {
  async getCharacterAchievements(characterId: number): Promise<CharacterAchievement[]> {
    return await db
      .select()
      .from(characterAchievements)
      .where(eq(characterAchievements.characterId, characterId));
  }

  async getUnlockedAchievements(characterId: number): Promise<CharacterAchievement[]> {
    return await db
      .select()
      .from(characterAchievements)
      .where(
        and(
          eq(characterAchievements.characterId, characterId),
          eq(characterAchievements.isCompleted, true)
        )
      );
  }

  async trackAchievement(achievement: InsertCharacterAchievement): Promise<CharacterAchievement> {
    const [tracked] = await db.insert(characterAchievements).values(achievement).returning();
    return tracked;
  }

  async updateAchievementProgress(id: number, progress: number): Promise<void> {
    await db
      .update(characterAchievements)
      .set({ progress })
      .where(eq(characterAchievements.id, id));
  }

  async unlockAchievement(id: number): Promise<void> {
    await db
      .update(characterAchievements)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(eq(characterAchievements.id, id));
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }
}

// ============= COMBAT LOG STORAGE =============

export interface ICombatLogStorage {
  addCombatLog(log: InsertCombatLog): Promise<CombatLog>;
  getRecentCombatLogs(characterId: number, limit?: number): Promise<CombatLog[]>;
  getCombatLogsByDate(characterId: number, startDate: Date, endDate: Date): Promise<CombatLog[]>;
}

class CombatLogStorage implements ICombatLogStorage {
  async addCombatLog(log: InsertCombatLog): Promise<CombatLog> {
    const [combatLog] = await db.insert(combatLogs).values(log).returning();
    return combatLog;
  }

  async getRecentCombatLogs(characterId: number, limit: number = 50): Promise<CombatLog[]> {
    return await db
      .select()
      .from(combatLogs)
      .where(eq(combatLogs.characterId, characterId))
      .orderBy(desc(combatLogs.startedAt))
      .limit(limit);
  }

  async getCombatLogsByDate(
    characterId: number,
    startDate: Date,
    endDate: Date
  ): Promise<CombatLog[]> {
    return await db
      .select()
      .from(combatLogs)
      .where(
        and(
          eq(combatLogs.characterId, characterId),
          gte(combatLogs.startedAt, startDate),
          lte(combatLogs.startedAt, endDate)
        )
      )
      .orderBy(desc(combatLogs.startedAt));
  }
}

// ============= JOURNEY LOG STORAGE =============

export interface IJourneyStorage {
  addJourneyEntry(entry: InsertJourneyEntry): Promise<JourneyEntry>;
  getJourneyEntries(characterId: number): Promise<JourneyEntry[]>;
  getJourneyEntriesByType(characterId: number, entryType: string): Promise<JourneyEntry[]>;
}

class JourneyStorage implements IJourneyStorage {
  async addJourneyEntry(entry: InsertJourneyEntry): Promise<JourneyEntry> {
    const [journeyEntry] = await db.insert(journeyEntries).values(entry).returning();
    return journeyEntry;
  }

  async getJourneyEntries(characterId: number): Promise<JourneyEntry[]> {
    return await db
      .select()
      .from(journeyEntries)
      .where(eq(journeyEntries.characterId, characterId))
      .orderBy(asc(journeyEntries.createdAt));
  }

  async getJourneyEntriesByType(characterId: number, entryType: string): Promise<JourneyEntry[]> {
    return await db
      .select()
      .from(journeyEntries)
      .where(
        and(eq(journeyEntries.characterId, characterId), eq(journeyEntries.entryType, entryType))
      )
      .orderBy(asc(journeyEntries.createdAt));
  }
}

// ============= OFFLINE SESSION STORAGE =============

export interface IOfflineStorage {
  createOfflineSession(session: InsertOfflineSession): Promise<OfflineSession>;
  getLastOfflineSession(characterId: number): Promise<OfflineSession | undefined>;
  updateOfflineSession(id: number, updates: Partial<OfflineSession>): Promise<void>;
}

class OfflineStorage implements IOfflineStorage {
  async createOfflineSession(session: InsertOfflineSession): Promise<OfflineSession> {
    const [offlineSession] = await db.insert(offlineSessions).values(session).returning();
    return offlineSession;
  }

  async getLastOfflineSession(characterId: number): Promise<OfflineSession | undefined> {
    const [session] = await db
      .select()
      .from(offlineSessions)
      .where(eq(offlineSessions.characterId, characterId))
      .orderBy(desc(offlineSessions.lastOnlineAt))
      .limit(1);
    return session;
  }

  async updateOfflineSession(id: number, updates: Partial<OfflineSession>): Promise<void> {
    await db.update(offlineSessions).set(updates).where(eq(offlineSessions.id, id));
  }
}

// ============= GAME CONTENT STORAGE =============

export interface IGameContentStorage {
  // Zones
  getAllZones(): Promise<Zone[]>;
  getZoneById(id: number): Promise<Zone | undefined>;
  getZonesByLevelRange(minLevel: number, maxLevel: number): Promise<Zone[]>;

  // Quests
  getQuestsByZone(zoneId: number): Promise<Quest[]>;
  getQuestById(id: number): Promise<Quest | undefined>;

  // Dungeons
  getAllDungeons(): Promise<Dungeon[]>;
  getDungeonById(id: number): Promise<Dungeon | undefined>;
  getDungeonsByLevel(level: number): Promise<Dungeon[]>;
  getDungeonBosses(dungeonId: number): Promise<DungeonBoss[]>;

  // Raids
  getAllRaids(): Promise<Raid[]>;
  getRaidById(id: number): Promise<Raid | undefined>;
  getRaidBosses(raidId: number): Promise<RaidBoss[]>;

  // Items
  getItemTemplate(id: number): Promise<ItemTemplate | undefined>;
  getItemTemplatesBySlot(slot: ItemSlot): Promise<ItemTemplate[]>;
  getConsumableTemplate(id: number): Promise<ConsumableTemplate | undefined>;

  // Factions
  getAllFactions(): Promise<Faction[]>;
  getFactionById(id: number): Promise<Faction | undefined>;
}

class GameContentStorage implements IGameContentStorage {
  async getAllZones(): Promise<Zone[]> {
    return await db.select().from(zones).orderBy(asc(zones.levelMin));
  }

  async getZoneById(id: number): Promise<Zone | undefined> {
    const [zone] = await db.select().from(zones).where(eq(zones.id, id));
    return zone;
  }

  async getZonesByLevelRange(minLevel: number, maxLevel: number): Promise<Zone[]> {
    return await db
      .select()
      .from(zones)
      .where(and(lte(zones.levelMin, maxLevel), gte(zones.levelMax, minLevel)))
      .orderBy(asc(zones.levelMin));
  }

  async getQuestsByZone(zoneId: number): Promise<Quest[]> {
    return await db.select().from(quests).where(eq(quests.zoneId, zoneId));
  }

  async getQuestById(id: number): Promise<Quest | undefined> {
    const [quest] = await db.select().from(quests).where(eq(quests.id, id));
    return quest;
  }

  async getAllDungeons(): Promise<Dungeon[]> {
    return await db.select().from(dungeons).orderBy(asc(dungeons.levelMin));
  }

  async getDungeonById(id: number): Promise<Dungeon | undefined> {
    const [dungeon] = await db.select().from(dungeons).where(eq(dungeons.id, id));
    return dungeon;
  }

  async getDungeonsByLevel(level: number): Promise<Dungeon[]> {
    return await db
      .select()
      .from(dungeons)
      .where(and(lte(dungeons.levelMin, level), gte(dungeons.levelMax, level)))
      .orderBy(asc(dungeons.levelMin));
  }

  async getDungeonBosses(dungeonId: number): Promise<DungeonBoss[]> {
    return await db
      .select()
      .from(dungeonBosses)
      .where(eq(dungeonBosses.dungeonId, dungeonId))
      .orderBy(asc(dungeonBosses.orderIndex));
  }

  async getAllRaids(): Promise<Raid[]> {
    return await db.select().from(raids).orderBy(asc(raids.tier));
  }

  async getRaidById(id: number): Promise<Raid | undefined> {
    const [raid] = await db.select().from(raids).where(eq(raids.id, id));
    return raid;
  }

  async getRaidBosses(raidId: number): Promise<RaidBoss[]> {
    return await db
      .select()
      .from(raidBosses)
      .where(eq(raidBosses.raidId, raidId))
      .orderBy(asc(raidBosses.orderIndex));
  }

  async getItemTemplate(id: number): Promise<ItemTemplate | undefined> {
    const [template] = await db.select().from(itemTemplates).where(eq(itemTemplates.id, id));
    return template;
  }

  async getItemTemplatesBySlot(slot: ItemSlot): Promise<ItemTemplate[]> {
    return await db.select().from(itemTemplates).where(eq(itemTemplates.slot, slot));
  }

  async getConsumableTemplate(id: number): Promise<ConsumableTemplate | undefined> {
    const [template] = await db
      .select()
      .from(consumableTemplates)
      .where(eq(consumableTemplates.id, id));
    return template;
  }

  async getAllFactions(): Promise<Faction[]> {
    return await db.select().from(factions);
  }

  async getFactionById(id: number): Promise<Faction | undefined> {
    const [faction] = await db.select().from(factions).where(eq(factions.id, id));
    return faction;
  }
}

// ============= SETTINGS STORAGE =============

export interface ISettingsStorage {
  getCharacterSettings(characterId: number): Promise<CharacterSettings | undefined>;
  createCharacterSettings(settings: InsertCharacterSettings): Promise<CharacterSettings>;
  updateCharacterSettings(
    characterId: number,
    updates: Partial<CharacterSettings>
  ): Promise<CharacterSettings | undefined>;
}

class SettingsStorage implements ISettingsStorage {
  async getCharacterSettings(characterId: number): Promise<CharacterSettings | undefined> {
    const [settings] = await db
      .select()
      .from(characterSettings)
      .where(eq(characterSettings.characterId, characterId));
    return settings;
  }

  async createCharacterSettings(settings: InsertCharacterSettings): Promise<CharacterSettings> {
    const [newSettings] = await db.insert(characterSettings).values(settings).returning();
    return newSettings;
  }

  async updateCharacterSettings(
    characterId: number,
    updates: Partial<CharacterSettings>
  ): Promise<CharacterSettings | undefined> {
    const [settings] = await db
      .update(characterSettings)
      .set(updates)
      .where(eq(characterSettings.characterId, characterId))
      .returning();
    return settings;
  }
}

// ============= LOCKOUT STORAGE =============

export interface ILockoutStorage {
  getCharacterLockouts(characterId: number): Promise<CharacterLockout[]>;
  addLockout(lockout: InsertCharacterLockout): Promise<CharacterLockout>;
  checkLockout(
    characterId: number,
    contentType: string,
    contentId: number
  ): Promise<CharacterLockout | undefined>;
  clearExpiredLockouts(): Promise<void>;
}

class LockoutStorage implements ILockoutStorage {
  async getCharacterLockouts(characterId: number): Promise<CharacterLockout[]> {
    return await db
      .select()
      .from(characterLockouts)
      .where(eq(characterLockouts.characterId, characterId));
  }

  async addLockout(lockout: InsertCharacterLockout): Promise<CharacterLockout> {
    const [newLockout] = await db.insert(characterLockouts).values(lockout).returning();
    return newLockout;
  }

  async checkLockout(
    characterId: number,
    contentType: string,
    contentId: number
  ): Promise<CharacterLockout | undefined> {
    const now = new Date();
    const [lockout] = await db
      .select()
      .from(characterLockouts)
      .where(
        and(
          eq(characterLockouts.characterId, characterId),
          eq(characterLockouts.contentType, contentType),
          eq(characterLockouts.contentId, contentId),
          gte(characterLockouts.expiresAt, now)
        )
      );
    return lockout;
  }

  async clearExpiredLockouts(): Promise<void> {
    const now = new Date();
    await db.delete(characterLockouts).where(lte(characterLockouts.expiresAt, now));
  }
}

// ============= COMBINED STORAGE EXPORT =============

export interface IGameStorage {
  users: IUserStorage;
  characters: ICharacterStorage;
  inventory: IInventoryStorage;
  quests: IQuestStorage;
  reputations: IReputationStorage;
  achievements: IAchievementStorage;
  combatLogs: ICombatLogStorage;
  journey: IJourneyStorage;
  offline: IOfflineStorage;
  content: IGameContentStorage;
  settings: ISettingsStorage;
  lockouts: ILockoutStorage;
}

class GameStorage implements IGameStorage {
  users = new UserStorage();
  characters = new CharacterStorage();
  inventory = new InventoryStorage();
  quests = new QuestStorage();
  reputations = new ReputationStorage();
  achievements = new AchievementStorage();
  combatLogs = new CombatLogStorage();
  journey = new JourneyStorage();
  offline = new OfflineStorage();
  content = new GameContentStorage();
  settings = new SettingsStorage();
  lockouts = new LockoutStorage();
}

export const storage = new GameStorage();
