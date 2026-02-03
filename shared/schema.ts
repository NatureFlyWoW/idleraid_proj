import {
  pgTable, pgEnum, serial, text, integer, boolean,
  timestamp, json, real, varchar, unique, index
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ============= ENUMS =============

export const characterClassEnum = pgEnum('character_class', [
  'warrior', 'paladin', 'hunter', 'rogue', 'priest', 'mage', 'druid'
]);

export const itemRarityEnum = pgEnum('item_rarity', [
  'common', 'uncommon', 'rare', 'epic', 'legendary'
]);

export const itemSlotEnum = pgEnum('item_slot', [
  'head', 'neck', 'shoulders', 'back', 'chest', 'wrist', 'hands',
  'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2',
  'mainHand', 'offHand', 'ranged'
]);

export const activityTypeEnum = pgEnum('activity_type', [
  'idle', 'questing', 'dungeon', 'raid'
]);

export const difficultyEnum = pgEnum('difficulty', [
  'safe', 'normal', 'challenging', 'heroic'
]);

export const questTypeEnum = pgEnum('quest_type', [
  'kill', 'collection', 'delivery', 'boss'
]);

// ============= USERS =============

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isPremium: boolean("is_premium").default(false),
  maxCharacterSlots: integer("max_character_slots").default(4),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// ============= CHARACTERS =============

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 24 }).notNull(),
  characterClass: characterClassEnum("character_class").notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  gold: integer("gold").default(0).notNull(),

  // Base Attributes (without gear)
  baseStrength: integer("base_strength").notNull(),
  baseAgility: integer("base_agility").notNull(),
  baseIntellect: integer("base_intellect").notNull(),
  baseStamina: integer("base_stamina").notNull(),
  baseSpirit: integer("base_spirit").default(10).notNull(),

  // Current Resource State
  currentHealth: integer("current_health").notNull(),
  maxHealth: integer("max_health").notNull(),
  currentResource: integer("current_resource").default(0).notNull(),
  maxResource: integer("max_resource").default(100).notNull(),

  // Talent Points (stored as JSON arrays for each tree)
  talentPointsAvailable: integer("talent_points_available").default(0),
  talentTree1Points: json("talent_tree1_points").$type<number[]>().default([]),
  talentTree2Points: json("talent_tree2_points").$type<number[]>().default([]),
  talentTree3Points: json("talent_tree3_points").$type<number[]>().default([]),
  respecCount: integer("respec_count").default(0),

  // Activity State
  currentActivity: activityTypeEnum("current_activity").default('idle'),
  currentActivityId: integer("current_activity_id"),
  currentDifficulty: difficultyEnum("current_difficulty").default('normal'),
  activityStartedAt: timestamp("activity_started_at"),
  activityCompletesAt: timestamp("activity_completes_at"),
  activityProgress: real("activity_progress").default(0),

  // Rested XP (bonus XP from being offline)
  restedXp: integer("rested_xp").default(0),
  maxRestedXp: integer("max_rested_xp").default(0),

  // Statistics
  totalPlaytime: integer("total_playtime").default(0),
  totalKills: integer("total_kills").default(0),
  totalDeaths: integer("total_deaths").default(0),
  totalDamageDealt: integer("total_damage_dealt").default(0),

  // Meta
  createdAt: timestamp("created_at").defaultNow(),
  lastPlayedAt: timestamp("last_played_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
}, (table) => ({
  userIdx: index("characters_user_idx").on(table.userId),
}));

// ============= ITEM TEMPLATES =============

export const itemTemplates = pgTable("item_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  slot: itemSlotEnum("slot").notNull(),
  rarity: itemRarityEnum("rarity").notNull(),
  itemLevel: integer("item_level").notNull(),
  requiredLevel: integer("required_level").default(1),

  // Class restrictions (null = all classes)
  classRestriction: characterClassEnum("class_restriction"),

  // Weapon-specific
  isWeapon: boolean("is_weapon").default(false),
  weaponType: varchar("weapon_type", { length: 50 }),
  minDamage: integer("min_damage"),
  maxDamage: integer("max_damage"),
  weaponSpeed: real("weapon_speed"),

  // Primary Stats
  strength: integer("strength").default(0),
  agility: integer("agility").default(0),
  intellect: integer("intellect").default(0),
  stamina: integer("stamina").default(0),
  spirit: integer("spirit").default(0),

  // Secondary Stats
  critRating: integer("crit_rating").default(0),
  hitRating: integer("hit_rating").default(0),
  hasteRating: integer("haste_rating").default(0),
  attackPower: integer("attack_power").default(0),
  spellPower: integer("spell_power").default(0),
  armor: integer("armor").default(0),

  // Special Effects
  specialEffects: json("special_effects").$type<{
    procChance?: number;
    procEffect?: string;
    procDamage?: number;
    onEquipBonus?: Record<string, number>;
  }>(),

  // Set Information
  setId: integer("set_id"),

  // Source
  dropSource: varchar("drop_source", { length: 100 }),
  vendorPrice: integer("vendor_price"),
  sellPrice: integer("sell_price"),

  // Generation flags
  isTemplate: boolean("is_template").default(true),
});

// ============= ITEM SETS =============

export const itemSets = pgTable("item_sets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  classRestriction: characterClassEnum("class_restriction"),
  bonuses: json("bonuses").$type<{
    pieces: number;
    description: string;
    stats?: Record<string, number>;
    effect?: string;
  }[]>().notNull(),
});

// ============= CHARACTER ITEMS =============

export const characterItems = pgTable("character_items", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  templateId: integer("template_id").notNull().references(() => itemTemplates.id),

  // Location
  isEquipped: boolean("is_equipped").default(false),
  equippedSlot: itemSlotEnum("equipped_slot"),
  inventorySlot: integer("inventory_slot"),

  // Enchant (future feature)
  enchantId: integer("enchant_id"),

  // Stack info (for stackable items)
  quantity: integer("quantity").default(1),

  acquiredAt: timestamp("acquired_at").defaultNow(),
}, (table) => ({
  characterIdx: index("character_items_char_idx").on(table.characterId),
}));

// ============= CONSUMABLES =============

export const consumableTemplates = pgTable("consumable_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  effect: json("effect").$type<{
    restoreHealth?: number;
    restoreHealthPercent?: number;
    restoreMana?: number;
    restoreManaPercent?: number;
    buffStat?: string;
    buffAmount?: number;
    buffDuration?: number;
  }>().notNull(),
  cooldownSeconds: integer("cooldown_seconds").default(0),
  requiredLevel: integer("required_level").default(1),
  vendorPrice: integer("vendor_price"),
  maxStack: integer("max_stack").default(20),
});

export const characterConsumables = pgTable("character_consumables", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  templateId: integer("template_id").notNull().references(() => consumableTemplates.id),
  quantity: integer("quantity").default(1),
}, (table) => ({
  characterIdx: index("character_consumables_char_idx").on(table.characterId),
  uniqueConsumable: unique("unique_char_consumable").on(table.characterId, table.templateId),
}));

// ============= ZONES =============

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  levelMin: integer("level_min").notNull(),
  levelMax: integer("level_max").notNull(),
  theme: varchar("theme", { length: 50 }),
  unlockRequirement: integer("unlock_requirement"),
  isDiscovered: boolean("is_discovered").default(false),
});

// ============= QUESTS =============

export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id").notNull().references(() => zones.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  type: questTypeEnum("type").notNull(),
  level: integer("level").notNull(),

  // Objectives
  objectives: json("objectives").$type<{
    type: string;
    target?: string;
    count?: number;
    dropRate?: number;
  }[]>().notNull(),

  // Duration & Difficulty
  baseDurationSeconds: integer("base_duration_seconds").notNull(),
  difficultyRating: integer("difficulty_rating").default(1),

  // Rewards
  xpReward: integer("xp_reward").notNull(),
  goldReward: integer("gold_reward").default(0),
  itemRewards: json("item_rewards").$type<number[]>(),

  // Chain
  prerequisiteQuestId: integer("prerequisite_quest_id"),
  chainOrder: integer("chain_order").default(0),
  isRepeatable: boolean("is_repeatable").default(true),
});

// ============= CHARACTER QUEST PROGRESS =============

export const characterQuestProgress = pgTable("character_quest_progress", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  questId: integer("quest_id").notNull().references(() => quests.id),

  progress: json("progress").$type<number[]>().default([]),
  completionCount: integer("completion_count").default(0),
  isActive: boolean("is_active").default(false),
  startedAt: timestamp("started_at"),
  lastCompletedAt: timestamp("last_completed_at"),
}, (table) => ({
  characterIdx: index("quest_progress_char_idx").on(table.characterId),
  uniqueQuest: unique("unique_char_quest").on(table.characterId, table.questId),
}));

// ============= DUNGEONS =============

export const dungeons = pgTable("dungeons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  tier: integer("tier").notNull(),
  levelMin: integer("level_min").notNull(),
  levelMax: integer("level_max").notNull(),

  baseDurationSeconds: integer("base_duration_seconds").notNull(),
  requiredItemLevel: integer("required_item_level"),

  trashPackCount: integer("trash_pack_count").default(5),
  hasHeroicMode: boolean("has_heroic_mode").default(false),
  heroicLockoutHours: integer("heroic_lockout_hours").default(24),
});

// ============= DUNGEON BOSSES =============

export const dungeonBosses = pgTable("dungeon_bosses", {
  id: serial("id").primaryKey(),
  dungeonId: integer("dungeon_id").notNull().references(() => dungeons.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  isFinalBoss: boolean("is_final_boss").default(false),

  // Combat Stats
  health: integer("health").notNull(),
  damage: integer("damage").notNull(),
  armor: integer("armor").default(0),

  // Mechanics
  mechanics: json("mechanics").$type<{
    name: string;
    trigger: string;
    triggerValue?: number;
    effect: string;
    damage?: number;
  }[]>(),

  enrageTimerSeconds: integer("enrage_timer_seconds"),

  // Loot
  lootTable: json("loot_table").$type<{
    itemId: number;
    dropChance: number;
  }[]>(),
});

// ============= RAIDS =============

export const raids = pgTable("raids", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  tier: integer("tier").notNull(),
  requiredLevel: integer("required_level").default(60),
  requiredItemLevel: integer("required_item_level"),
  baseDurationSeconds: integer("base_duration_seconds").notNull(),
  lockoutDays: integer("lockout_days").default(7),
  attunementQuestId: integer("attunement_quest_id"),
});

// ============= RAID BOSSES =============

export const raidBosses = pgTable("raid_bosses", {
  id: serial("id").primaryKey(),
  raidId: integer("raid_id").notNull().references(() => raids.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),

  health: integer("health").notNull(),
  damage: integer("damage").notNull(),
  armor: integer("armor").default(0),

  phases: json("phases").$type<{
    healthThreshold: number;
    name: string;
    mechanics: {
      name: string;
      description: string;
      damage?: number;
      interval?: number;
    }[];
  }[]>(),

  enrageTimerSeconds: integer("enrage_timer_seconds"),

  lootTable: json("loot_table").$type<{
    itemId: number;
    dropChance: number;
  }[]>(),
});

// ============= LOCKOUTS =============

export const characterLockouts = pgTable("character_lockouts", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  contentType: varchar("content_type", { length: 20 }).notNull(),
  contentId: integer("content_id").notNull(),
  bossesKilled: json("bosses_killed").$type<number[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
}, (table) => ({
  characterIdx: index("lockouts_char_idx").on(table.characterId),
}));

// ============= FACTIONS =============

export const factions = pgTable("factions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  rewards: json("rewards").$type<{
    standing: string;
    items?: number[];
    discount?: number;
  }[]>(),
});

export const characterReputations = pgTable("character_reputations", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  factionId: integer("faction_id").notNull().references(() => factions.id),
  reputation: integer("reputation").default(0),
}, (table) => ({
  characterIdx: index("reputations_char_idx").on(table.characterId),
  uniqueFaction: unique("unique_char_faction").on(table.characterId, table.factionId),
}));

// ============= ACHIEVEMENTS =============

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  points: integer("points").default(10),
  iconName: varchar("icon_name", { length: 50 }),

  rewardTitle: varchar("reward_title", { length: 50 }),
  rewardStatBonus: json("reward_stat_bonus").$type<Record<string, number>>(),

  requirements: json("requirements").$type<{
    type: string;
    target?: string;
    count?: number;
  }>().notNull(),

  isHidden: boolean("is_hidden").default(false),
});

export const characterAchievements = pgTable("character_achievements", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  characterIdx: index("achievements_char_idx").on(table.characterId),
  uniqueAchievement: unique("unique_char_achievement").on(table.characterId, table.achievementId),
}));

// ============= COMBAT LOGS =============

export const combatLogs = pgTable("combat_logs", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  activityType: activityTypeEnum("activity_type").notNull(),
  activityId: integer("activity_id"),
  activityName: varchar("activity_name", { length: 100 }),
  difficulty: difficultyEnum("difficulty").default('normal'),

  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  wasVictory: boolean("was_victory"),

  totalDamageDealt: integer("total_damage_dealt").default(0),
  totalDamageTaken: integer("total_damage_taken").default(0),
  totalHealing: integer("total_healing").default(0),
  dps: real("dps"),

  xpEarned: integer("xp_earned").default(0),
  goldEarned: integer("gold_earned").default(0),
  itemsAcquired: json("items_acquired").$type<number[]>(),

  logSummary: json("log_summary").$type<{
    highlights: string[];
    deaths: number;
    criticalHits: number;
  }>(),
}, (table) => ({
  characterIdx: index("combat_logs_char_idx").on(table.characterId),
}));

// ============= CHARACTER SETTINGS =============

export const characterSettings = pgTable("character_settings", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }).unique(),

  // Combat Visualization
  combatMode: varchar("combat_mode", { length: 20 }).default('summary'),

  // Automation
  autoLoot: boolean("auto_loot").default(true),
  autoSellCommon: boolean("auto_sell_common").default(true),
  autoRepair: boolean("auto_repair").default(true),
  autoAcceptQuests: boolean("auto_accept_quests").default(true),
  autoTurnInQuests: boolean("auto_turn_in_quests").default(true),
  autoEquipUpgrades: boolean("auto_equip_upgrades").default(false),

  // Combat Thresholds
  healthPotionThreshold: integer("health_potion_threshold").default(40),
  manaPotionThreshold: integer("mana_potion_threshold").default(30),
  useCooldownsOnBosses: boolean("use_cooldowns_on_bosses").default(true),
  useCooldownsOnTrash: boolean("use_cooldowns_on_trash").default(false),
  fleeOnLowHealth: boolean("flee_on_low_health").default(true),
  fleeHealthThreshold: integer("flee_health_threshold").default(15),

  // Notifications
  notifyLevelUp: boolean("notify_level_up").default(true),
  notifyRareLoot: boolean("notify_rare_loot").default(true),
  notifyDeath: boolean("notify_death").default(true),
  notifyAchievements: boolean("notify_achievements").default(true),
  notifyActivityComplete: boolean("notify_activity_complete").default(true),
});

// ============= OFFLINE PROGRESS =============

export const offlineSessions = pgTable("offline_sessions", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),

  lastOnlineAt: timestamp("last_online_at").notNull(),
  returnedAt: timestamp("returned_at").notNull(),
  offlineDurationSeconds: integer("offline_duration_seconds").notNull(),
  effectiveDurationSeconds: integer("effective_duration_seconds").notNull(),

  activityType: activityTypeEnum("activity_type").notNull(),
  activityId: integer("activity_id"),
  activityName: varchar("activity_name", { length: 100 }),
  difficulty: difficultyEnum("difficulty"),

  cyclesCompleted: integer("cycles_completed").default(0),
  xpEarned: integer("xp_earned").default(0),
  goldEarned: integer("gold_earned").default(0),
  itemsFound: integer("items_found").default(0),

  died: boolean("died").default(false),
  deathReason: varchar("death_reason", { length: 200 }),

  levelsBefore: integer("levels_before"),
  levelsAfter: integer("levels_after"),
});

// ============= JOURNEY LOG (Adventure Diary) =============

export const journeyEntries = pgTable("journey_entries", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),

  entryType: varchar("entry_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),

  relatedLevel: integer("related_level"),
  relatedZone: varchar("related_zone", { length: 100 }),
  relatedItem: varchar("related_item", { length: 100 }),

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  characterIdx: index("journey_char_idx").on(table.characterId),
}));

// ============= RELATIONS =============

export const usersRelations = relations(users, ({ many }) => ({
  characters: many(characters),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  user: one(users, { fields: [characters.userId], references: [users.id] }),
  items: many(characterItems),
  consumables: many(characterConsumables),
  questProgress: many(characterQuestProgress),
  reputations: many(characterReputations),
  achievements: many(characterAchievements),
  combatLogs: many(combatLogs),
  journeyEntries: many(journeyEntries),
  settings: one(characterSettings),
}));

// ============= ZOD SCHEMAS =============

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  lastPlayedAt: true,
  activityStartedAt: true,
});
export const selectCharacterSchema = createSelectSchema(characters);

export const insertItemTemplateSchema = createInsertSchema(itemTemplates).omit({ id: true });
export const insertCharacterItemSchema = createInsertSchema(characterItems).omit({ id: true, acquiredAt: true });

// ============= TYPE EXPORTS =============

// Users
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Characters
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = typeof characters.$inferInsert;

// Items
export type ItemTemplate = typeof itemTemplates.$inferSelect;
export type InsertItemTemplate = typeof itemTemplates.$inferInsert;
export type CharacterItem = typeof characterItems.$inferSelect;
export type InsertCharacterItem = typeof characterItems.$inferInsert;

// Item Sets
export type ItemSet = typeof itemSets.$inferSelect;
export type InsertItemSet = typeof itemSets.$inferInsert;

// Consumables
export type ConsumableTemplate = typeof consumableTemplates.$inferSelect;
export type InsertConsumableTemplate = typeof consumableTemplates.$inferInsert;
export type CharacterConsumable = typeof characterConsumables.$inferSelect;
export type InsertCharacterConsumable = typeof characterConsumables.$inferInsert;

// Zones
export type Zone = typeof zones.$inferSelect;
export type InsertZone = typeof zones.$inferInsert;

// Quests
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = typeof quests.$inferInsert;
export type CharacterQuestProgress = typeof characterQuestProgress.$inferSelect;
export type InsertCharacterQuestProgress = typeof characterQuestProgress.$inferInsert;

// Dungeons
export type Dungeon = typeof dungeons.$inferSelect;
export type InsertDungeon = typeof dungeons.$inferInsert;
export type DungeonBoss = typeof dungeonBosses.$inferSelect;
export type InsertDungeonBoss = typeof dungeonBosses.$inferInsert;

// Raids
export type Raid = typeof raids.$inferSelect;
export type InsertRaid = typeof raids.$inferInsert;
export type RaidBoss = typeof raidBosses.$inferSelect;
export type InsertRaidBoss = typeof raidBosses.$inferInsert;

// Factions & Reputation
export type Faction = typeof factions.$inferSelect;
export type InsertFaction = typeof factions.$inferInsert;
export type CharacterReputation = typeof characterReputations.$inferSelect;
export type InsertCharacterReputation = typeof characterReputations.$inferInsert;

// Achievements
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type CharacterAchievement = typeof characterAchievements.$inferSelect;
export type InsertCharacterAchievement = typeof characterAchievements.$inferInsert;

// Combat Logs
export type CombatLog = typeof combatLogs.$inferSelect;
export type InsertCombatLog = typeof combatLogs.$inferInsert;

// Character Settings
export type CharacterSettings = typeof characterSettings.$inferSelect;
export type InsertCharacterSettings = typeof characterSettings.$inferInsert;

// Lockouts
export type CharacterLockout = typeof characterLockouts.$inferSelect;
export type InsertCharacterLockout = typeof characterLockouts.$inferInsert;

// Offline Sessions
export type OfflineSession = typeof offlineSessions.$inferSelect;
export type InsertOfflineSession = typeof offlineSessions.$inferInsert;

// Journey Entries
export type JourneyEntry = typeof journeyEntries.$inferSelect;
export type InsertJourneyEntry = typeof journeyEntries.$inferInsert;

// Character class type
export type CharacterClass = 'warrior' | 'paladin' | 'hunter' | 'rogue' | 'priest' | 'mage' | 'druid';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemSlot = typeof itemSlotEnum.enumValues[number];
export type ActivityType = 'idle' | 'questing' | 'dungeon' | 'raid';
export type Difficulty = 'safe' | 'normal' | 'challenging' | 'heroic';
