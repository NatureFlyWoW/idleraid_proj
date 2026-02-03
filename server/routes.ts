import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { getClassDefinition, getImplementedClasses, getClassStartingStats } from "./game/data/classes";
import { setupAuth, requireAuth, getAuthUserId, hashPassword, passport } from "./auth";
import { calculateOfflineProgress, applyOfflineProgress, hasPendingOfflineProgress } from "./game/systems/OfflineCalculator";
import { previewCombat, runQuestCombat, runDungeonCombat } from "./game/systems/CombatService";

// Helper to safely get string param value
function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0];
  return param ?? '';
}

// Helper to safely parse integer param
function getIntParam(param: string | string[] | undefined): number {
  return parseInt(getParam(param));
}

// Helper to verify character ownership
async function verifyCharacterOwnership(characterId: number, userId: number): Promise<boolean> {
  const character = await storage.characters.getCharacterById(characterId);
  return character !== undefined && character.userId === userId;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // ============= AUTHENTICATION SETUP =============
  setupAuth(app);

  // ============= AUTH ROUTES =============

  // Register new user
  // Note: Using custom validation since insertUserSchema expects passwordHash, not password
  const registerInputSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  app.post(api.auth.register.path, async (req: Request, res: Response) => {
    try {
      const input = registerInputSchema.parse(req.body);

      // Check if username already exists
      const existingUser = await storage.users.getUserByUsername(input.username);
      if (existingUser) {
        res.status(400).json({ message: 'Username already taken' });
        return;
      }

      // Hash password and create user
      const passwordHash = await hashPassword(input.password);
      const user = await storage.users.createUser({
        username: input.username,
        passwordHash,
      });

      // Log in the new user
      req.login(user, (err) => {
        if (err) {
          res.status(500).json({ message: 'Registration successful but login failed' });
          return;
        }

        // Return user without password hash
        const { passwordHash: _, ...safeUser } = user;
        res.status(201).json({ user: safeUser, token: 'session' });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Login
  app.post(api.auth.login.path, (req: Request, res: Response, next) => {
    try {
      // Validate input first
      api.auth.login.input.parse(req.body);

      passport.authenticate('local', (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(401).json({ message: info?.message || 'Invalid credentials' });
        }

        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }

          // Return user without password hash
          const { passwordHash: _, ...safeUser } = user as any;
          return res.json({ user: safeUser, token: 'session' });
        });
      })(req, res, next);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Get current user
  app.get(api.auth.me.path, requireAuth, (req: Request, res: Response) => {
    const user = req.user as any;
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: 'Logout failed' });
        return;
      }
      res.json({ success: true });
    });
  });

  // ============= GAME DATA ROUTES =============

  // Get all implemented classes
  app.get(api.gameData.classes.path, async (_req, res) => {
    const classes = getImplementedClasses();
    res.json(classes.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      resourceType: c.resourceType,
      armorType: c.armorType,
    })));
  });

  // Get class details
  app.get(api.gameData.class.path, async (req, res) => {
    const classId = getParam(req.params.classId);
    const classDef = getClassDefinition(classId as any);

    if (!classDef) {
      res.status(404).json({ message: `Class ${classId} not found or not implemented` });
      return;
    }

    res.json({
      id: classDef.id,
      name: classDef.name,
      description: classDef.description,
      resourceType: classDef.resourceType,
      armorType: classDef.armorType,
      baseStats: classDef.baseStats,
      abilities: classDef.abilities,
      talentTrees: classDef.talentTrees,
    });
  });

  // ============= CHARACTER ROUTES =============

  // List characters for user
  app.get(api.characters.list.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characters = await storage.characters.getCharactersByUserId(userId);
    res.json(characters);
  });

  // Get character by ID
  app.get(api.characters.get.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const id = getIntParam(req.params.id);
    const character = await storage.characters.getCharacterById(id);

    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Verify ownership
    if (character.userId !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json(character);
  });

  // Create character
  app.post(api.characters.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.characters.create.input.parse(req.body);
      const userId = getAuthUserId(req);

      // Check character slot limit
      const existingCharacters = await storage.characters.getCharactersByUserId(userId);
      const user = await storage.users.getUserById(userId);
      const maxSlots = user?.maxCharacterSlots ?? 4;

      if (existingCharacters.length >= maxSlots) {
        res.status(400).json({ message: `Character limit reached (${maxSlots} slots)` });
        return;
      }

      // Check if class is implemented
      const classDef = getClassDefinition(input.characterClass as any);
      if (!classDef) {
        res.status(400).json({ message: `Class ${input.characterClass} is not yet implemented` });
        return;
      }

      // Get starting stats for the class
      const startingStats = getClassStartingStats(input.characterClass as any);

      const character = await storage.characters.createCharacter({
        userId,
        name: input.name,
        characterClass: input.characterClass as any,
        ...startingStats,
      });

      res.status(201).json(character);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Delete character
  app.delete(api.characters.delete.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const id = getIntParam(req.params.id);
    const character = await storage.characters.getCharacterById(id);

    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Verify ownership
    if (character.userId !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await storage.characters.deleteCharacter(id);
    res.json({ success: true });
  });

  // ============= INVENTORY ROUTES =============

  // List character items
  app.get(api.inventory.list.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const items = await storage.inventory.getCharacterItems(characterId);
    res.json(items);
  });

  // Equip item
  app.post(api.inventory.equip.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);
    const itemId = getIntParam(req.params.itemId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // TODO: Validate slot availability, level requirement
    await storage.inventory.equipItem(itemId, 'mainHand'); // Placeholder slot
    const items = await storage.inventory.getCharacterItems(characterId);
    res.json(items.find(i => i.id === itemId));
  });

  // Unequip item
  app.post(api.inventory.unequip.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);
    const itemId = getIntParam(req.params.itemId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await storage.inventory.unequipItem(itemId);
    const items = await storage.inventory.getCharacterItems(characterId);
    res.json(items.find(i => i.id === itemId));
  });

  // ============= ZONE ROUTES =============

  // List all zones
  app.get(api.zones.list.path, async (_req, res) => {
    const zones = await storage.content.getAllZones();
    res.json(zones);
  });

  // Get zone by ID
  app.get(api.zones.get.path, async (req, res) => {
    const id = getIntParam(req.params.id);
    const zone = await storage.content.getZoneById(id);

    if (!zone) {
      res.status(404).json({ message: 'Zone not found' });
      return;
    }

    res.json(zone);
  });

  // Get zones for level
  app.get(api.zones.forLevel.path, async (req, res) => {
    const level = getIntParam(req.params.level);
    const zones = await storage.content.getZonesByLevelRange(level - 5, level + 5);
    res.json(zones);
  });

  // ============= QUEST ROUTES =============

  // Get available quests for character
  app.get(api.quests.available.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Get zones appropriate for character level (+/- 10 levels)
    const zones = await storage.content.getZonesByLevelRange(
      Math.max(1, character.level - 10),
      character.level + 10
    );

    // Get all quests from these zones
    const questsByZone = await Promise.all(
      zones.map(zone => storage.content.getQuestsByZone(zone.id))
    );
    const allQuests = questsByZone.flat();

    // Get character's quest progress to filter out active/completed
    const questProgress = await storage.quests.getQuestProgress(characterId);
    const activeQuestIds = new Set(
      questProgress
        .filter(p => p.isActive)
        .map(p => p.questId)
    );
    const completedQuestIds = new Set(
      questProgress
        .filter(p => !p.isActive && p.completionCount > 0)
        .map(p => p.questId)
    );

    // Filter to only show quests character hasn't started or completed
    const availableQuests = allQuests.filter(
      quest => !activeQuestIds.has(quest.id) && !completedQuestIds.has(quest.id)
    );

    res.json(availableQuests);
  });

  // Get active quests for character
  app.get(api.quests.active.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const activeQuests = await storage.quests.getActiveQuests(characterId);
    res.json(activeQuests);
  });

  // Accept a quest
  app.post(api.quests.accept.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);
    const questId = getIntParam(req.params.questId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    const quest = await storage.content.getQuestById(questId);
    if (!quest) {
      res.status(404).json({ message: 'Quest not found' });
      return;
    }

    // Check if quest is already active or completed
    const existingProgress = await storage.quests.getQuestProgress(characterId);
    const existing = existingProgress.find(p => p.questId === questId);

    if (existing && existing.isActive) {
      res.status(400).json({ message: 'Quest already active' });
      return;
    }

    // Check level requirement (quest level shouldn't be more than 5 levels above character)
    if (quest.level > character.level + 5) {
      res.status(400).json({ message: 'Character level too low for this quest' });
      return;
    }

    // Create quest progress entry
    const questProgress = await storage.quests.startQuest({
      characterId,
      questId,
      progress: Array(quest.objectives.length).fill(0),
      isActive: true,
      startedAt: new Date(),
      completionCount: 0,
    });

    res.json(questProgress);
  });

  // Abandon a quest
  app.delete(api.quests.abandon.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);
    const questId = getIntParam(req.params.questId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // Find the quest progress entry
    const questProgress = await storage.quests.getQuestProgress(characterId);
    const progress = questProgress.find(p => p.questId === questId && p.isActive);

    if (!progress) {
      res.status(404).json({ message: 'Active quest not found' });
      return;
    }

    // Abandon the quest
    await storage.quests.abandonQuest(progress.id);
    res.json({ success: true });
  });

  // ============= DUNGEON ROUTES =============

  // List all dungeons
  app.get(api.dungeons.list.path, async (_req, res) => {
    const dungeons = await storage.content.getAllDungeons();
    res.json(dungeons);
  });

  // Get dungeon by ID with bosses
  app.get(api.dungeons.get.path, async (req, res) => {
    const id = getIntParam(req.params.id);
    const dungeon = await storage.content.getDungeonById(id);

    if (!dungeon) {
      res.status(404).json({ message: 'Dungeon not found' });
      return;
    }

    const bosses = await storage.content.getDungeonBosses(id);
    res.json({ dungeon, bosses });
  });

  // Get dungeons for level
  app.get(api.dungeons.forLevel.path, async (req, res) => {
    const level = getIntParam(req.params.level);
    const dungeons = await storage.content.getDungeonsByLevel(level);
    res.json(dungeons);
  });

  // ============= ACTIVITY ROUTES =============

  // Get activity status
  app.get(api.activities.status.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    const isActive = character.currentActivity !== null && character.currentActivity !== 'idle';
    let progressPercent = 0;

    if (isActive && character.activityStartedAt && character.activityCompletesAt) {
      const now = new Date().getTime();
      const start = new Date(character.activityStartedAt).getTime();
      const end = new Date(character.activityCompletesAt).getTime();
      progressPercent = Math.min(100, ((now - start) / (end - start)) * 100);
    }

    res.json({
      isActive,
      activityType: character.currentActivity,
      activityId: character.currentActivityId,
      progressPercent: Math.floor(progressPercent),
      startedAt: character.activityStartedAt?.toISOString() ?? null,
      completesAt: character.activityCompletesAt?.toISOString() ?? null,
    });
  });

  // Start activity
  app.post(api.activities.start.path, requireAuth, async (req, res) => {
    try {
      const userId = getAuthUserId(req);
      const characterId = getIntParam(req.params.characterId);

      if (!await verifyCharacterOwnership(characterId, userId)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      const input = api.activities.start.input.parse(req.body);

      const character = await storage.characters.getCharacterById(characterId);
      if (!character) {
        res.status(404).json({ message: 'Character not found' });
        return;
      }

      if (character.currentActivity && character.currentActivity !== 'idle') {
        res.status(400).json({ message: 'Character is already engaged in an activity' });
        return;
      }

      // Calculate activity duration based on type and difficulty
      const baseDurations: Record<string, number> = {
        questing: 60,   // 1 minute base
        dungeon: 300,   // 5 minutes base
        raid: 600,      // 10 minutes base
        resting: 30,    // 30 seconds
      };

      const durationSeconds = baseDurations[input.activityType] || 60;
      const startedAt = new Date();
      const completesAt = new Date(startedAt.getTime() + durationSeconds * 1000);

      await storage.characters.updateCharacterActivity(
        characterId,
        input.activityType,
        input.activityId ?? null,
        startedAt,
        completesAt
      );

      res.json({
        started: true,
        activityType: input.activityType,
        estimatedCompletionAt: completesAt.toISOString(),
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Stop activity
  app.post(api.activities.stop.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    await storage.characters.clearCharacterActivity(characterId);
    res.json({ stopped: true });
  });

  // Collect activity rewards
  app.post(api.activities.collect.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    if (!character.currentActivity || character.currentActivity === 'idle' || !character.activityCompletesAt) {
      res.status(400).json({ message: 'No activity to collect' });
      return;
    }

    const now = new Date();
    if (now < character.activityCompletesAt) {
      res.status(400).json({ message: 'Activity not yet complete' });
      return;
    }

    // TODO: Calculate actual rewards based on activity type, difficulty, character level
    const xpGained = 100;
    const goldGained = 10;
    const itemsGained: any[] = [];

    // Update character
    const newExperience = character.experience + xpGained;
    const newGold = character.gold + goldGained;

    // TODO: Calculate if level up occurred
    const leveledUp = false;

    await storage.characters.updateCharacterExperience(characterId, newExperience, character.level);
    await storage.characters.updateCharacterGold(characterId, newGold);
    await storage.characters.clearCharacterActivity(characterId);

    res.json({
      xpGained,
      goldGained,
      itemsGained,
      leveledUp,
    });
  });

  // ============= COMBAT ROUTES =============

  // Simulate combat
  app.post(api.combat.simulate.path, requireAuth, async (req, res) => {
    try {
      const userId = getAuthUserId(req);
      const characterId = getIntParam(req.params.characterId);

      if (!await verifyCharacterOwnership(characterId, userId)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      const input = api.combat.simulate.input.parse(req.body);

      const character = await storage.characters.getCharacterById(characterId);
      if (!character) {
        res.status(404).json({ message: 'Character not found' });
        return;
      }

      // Run combat preview
      const result = await previewCombat(character, input.enemyId, input.difficulty);

      res.json({
        victory: result.victory,
        durationSeconds: result.durationSeconds,
        dps: result.dps,
        playerHealthPercent: result.playerHealthPercent,
        rewards: result.rewards,
        combatLog: result.combatLog,
        highlights: result.highlights,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Get combat logs
  app.get(api.combat.logs.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const logs = await storage.combatLogs.getRecentCombatLogs(characterId, 50);
    res.json(logs);
  });

  // ============= OFFLINE PROGRESS ROUTES =============

  // Calculate (preview) offline progress
  app.get(api.offline.calculate.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Check if there's pending offline progress
    const hasPending = await hasPendingOfflineProgress(character);
    if (!hasPending) {
      res.json({
        hasProgress: false,
        offlineDuration: 0,
        xpGained: 0,
        goldGained: 0,
        itemsFound: [],
        levelsGained: 0,
        died: false,
      });
      return;
    }

    // Calculate offline progress
    const lastOnlineAt = new Date(character.lastPlayedAt!);
    const returnedAt = new Date();
    const progress = await calculateOfflineProgress(character, lastOnlineAt, returnedAt);

    // Resolve item IDs to names and rarities for Frontend
    const itemsWithDetails = await Promise.all(
      progress.itemsFound.map(async (templateId) => {
        const template = await storage.content.getItemTemplate(templateId);
        return template
          ? { name: template.name, rarity: template.rarity }
          : { name: 'Unknown Item', rarity: 'common' };
      })
    );

    res.json({
      hasProgress: true,
      offlineDuration: progress.offlineDurationSeconds,
      effectiveDuration: progress.effectiveDurationSeconds,
      cappedAt18Hours: progress.cappedAt18Hours,
      activityPerformed: progress.activityPerformed,
      cyclesCompleted: progress.cyclesCompleted,
      xpGained: progress.xpEarned,
      goldGained: progress.goldEarned,
      itemsFound: itemsWithDetails,
      levelsGained: progress.levelsGained,
      previousLevel: progress.previousLevel,
      currentLevel: progress.currentLevel,
      died: progress.died,
      deathReason: progress.deathReason,
    });
  });

  // Claim offline progress
  app.post(api.offline.claim.path, requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Check if there's pending offline progress
    const hasPending = await hasPendingOfflineProgress(character);
    if (!hasPending) {
      res.status(400).json({ message: 'No offline progress to claim' });
      return;
    }

    // Calculate and apply offline progress
    const lastOnlineAt = new Date(character.lastPlayedAt!);
    const returnedAt = new Date();
    const progress = await calculateOfflineProgress(character, lastOnlineAt, returnedAt);

    try {
      await applyOfflineProgress(characterId, progress);

      // Get updated character for response
      const updatedCharacter = await storage.characters.getCharacterById(characterId);

      // Resolve item IDs to names and rarities for Frontend
      const itemsWithDetails = await Promise.all(
        progress.itemsFound.map(async (templateId) => {
          const template = await storage.content.getItemTemplate(templateId);
          return template
            ? { name: template.name, rarity: template.rarity }
            : { name: 'Unknown Item', rarity: 'common' };
        })
      );

      res.json({
        claimed: true,
        xpGained: progress.xpEarned,
        goldGained: progress.goldEarned,
        itemsGained: itemsWithDetails,
        newLevel: updatedCharacter?.level ?? progress.currentLevel,
        levelsGained: progress.levelsGained,
        cyclesCompleted: progress.cyclesCompleted,
        died: progress.died,
        deathReason: progress.deathReason,
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to apply offline progress' });
    }
  });

  // ============= TALENT ROUTES =============

  // Get character's talent allocation
  app.get('/api/characters/:characterId/talents', requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Get class definition for talent tree info
    const classDef = getClassDefinition(character.characterClass);

    // Calculate available talent points
    const TALENT_START_LEVEL = 10;
    const earnedPoints = Math.max(0, character.level - TALENT_START_LEVEL + 1);
    const tree1Spent = (character.talentTree1Points ?? []).reduce((a, b) => a + b, 0);
    const tree2Spent = (character.talentTree2Points ?? []).reduce((a, b) => a + b, 0);
    const tree3Spent = (character.talentTree3Points ?? []).reduce((a, b) => a + b, 0);
    const totalSpent = tree1Spent + tree2Spent + tree3Spent;
    const available = earnedPoints - totalSpent;

    res.json({
      characterId,
      characterClass: character.characterClass,
      level: character.level,
      talentTrees: classDef.talentTrees.map((tree, index) => ({
        id: tree.id,
        name: tree.name,
        description: tree.description,
        role: tree.role,
        pointsSpent: index === 0 ? tree1Spent : index === 1 ? tree2Spent : tree3Spent,
        talents: tree.talents,
        allocation: index === 0 ? character.talentTree1Points
          : index === 1 ? character.talentTree2Points
          : character.talentTree3Points,
      })),
      pointsAvailable: available,
      pointsSpent: totalSpent,
      pointsEarned: earnedPoints,
      respecCount: character.respecCount ?? 0,
    });
  });

  // Apply a talent point
  app.post('/api/characters/:characterId/talents/apply', requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const schema = z.object({
      treeIndex: z.number().min(0).max(2),
      talentId: z.string(),
    });

    const input = schema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ message: 'Invalid input', errors: input.error.errors });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Check if player has available points
    const TALENT_START_LEVEL = 10;
    const earnedPoints = Math.max(0, character.level - TALENT_START_LEVEL + 1);
    const tree1Spent = (character.talentTree1Points ?? []).reduce((a, b) => a + b, 0);
    const tree2Spent = (character.talentTree2Points ?? []).reduce((a, b) => a + b, 0);
    const tree3Spent = (character.talentTree3Points ?? []).reduce((a, b) => a + b, 0);
    const totalSpent = tree1Spent + tree2Spent + tree3Spent;

    if (totalSpent >= earnedPoints) {
      res.status(400).json({ message: 'No talent points available' });
      return;
    }

    // Get class talent tree
    const classDef = getClassDefinition(character.characterClass);
    const talentTree = classDef.talentTrees[input.data.treeIndex];
    if (!talentTree) {
      res.status(400).json({ message: 'Invalid talent tree' });
      return;
    }

    // Find the talent
    const talentIndex = talentTree.talents.findIndex(t => t.id === input.data.talentId);
    if (talentIndex === -1) {
      res.status(400).json({ message: 'Talent not found' });
      return;
    }

    const talent = talentTree.talents[talentIndex];

    // Get current allocation for this tree
    const currentAllocation = input.data.treeIndex === 0
      ? [...(character.talentTree1Points ?? [])]
      : input.data.treeIndex === 1
      ? [...(character.talentTree2Points ?? [])]
      : [...(character.talentTree3Points ?? [])];

    // Ensure array is long enough
    while (currentAllocation.length <= talentIndex) {
      currentAllocation.push(0);
    }

    // Check if talent is already maxed
    if (currentAllocation[talentIndex] >= talent.maxRanks) {
      res.status(400).json({ message: 'Talent already at maximum ranks' });
      return;
    }

    // Check required points in tree
    const pointsInTree = input.data.treeIndex === 0 ? tree1Spent
      : input.data.treeIndex === 1 ? tree2Spent : tree3Spent;
    if (pointsInTree < talent.requiredPoints) {
      res.status(400).json({
        message: `Need ${talent.requiredPoints} points in this tree to unlock this talent`,
      });
      return;
    }

    // Check prerequisite talent
    if (talent.requiredTalentId) {
      const prereqIndex = talentTree.talents.findIndex(t => t.id === talent.requiredTalentId);
      if (prereqIndex === -1 || (currentAllocation[prereqIndex] ?? 0) === 0) {
        res.status(400).json({ message: 'Prerequisite talent not learned' });
        return;
      }
    }

    // Apply the talent point
    currentAllocation[talentIndex]++;

    // Update the character
    const updateData = input.data.treeIndex === 0
      ? { talentTree1Points: currentAllocation }
      : input.data.treeIndex === 1
      ? { talentTree2Points: currentAllocation }
      : { talentTree3Points: currentAllocation };

    await storage.characters.updateCharacter(characterId, updateData);

    res.json({
      success: true,
      talentId: input.data.talentId,
      newRank: currentAllocation[talentIndex],
      pointsRemaining: earnedPoints - totalSpent - 1,
    });
  });

  // Reset all talents
  app.post('/api/characters/:characterId/talents/reset', requireAuth, async (req, res) => {
    const userId = getAuthUserId(req);
    const characterId = getIntParam(req.params.characterId);

    if (!await verifyCharacterOwnership(characterId, userId)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const character = await storage.characters.getCharacterById(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    // Calculate respec cost
    const respecCount = character.respecCount ?? 0;
    const cost = Math.min(50, respecCount + 1);

    if (character.gold < cost) {
      res.status(400).json({ message: `Insufficient gold. Need ${cost} gold to respec.` });
      return;
    }

    // Reset talents and deduct gold
    await storage.characters.updateCharacter(characterId, {
      talentTree1Points: [],
      talentTree2Points: [],
      talentTree3Points: [],
      respecCount: respecCount + 1,
    });
    await storage.characters.updateCharacterGold(characterId, character.gold - cost);

    // Calculate refunded points
    const TALENT_START_LEVEL = 10;
    const earnedPoints = Math.max(0, character.level - TALENT_START_LEVEL + 1);

    res.json({
      success: true,
      goldSpent: cost,
      goldRemaining: character.gold - cost,
      pointsRefunded: earnedPoints,
      nextRespecCost: Math.min(50, respecCount + 2),
    });
  });

  return httpServer;
}
