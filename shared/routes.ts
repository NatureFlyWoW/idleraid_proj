import { z } from 'zod';
import {
  insertUserSchema,
  insertCharacterSchema,
  users,
  characters,
  characterItems,
  characterQuestProgress,
  zones,
  quests,
  dungeons,
  characterClassEnum,
} from './schema';

// ============= SHARED API ROUTE DEFINITIONS =============

export const api = {
  // ============= AUTH =============
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        username: z.string().min(3).max(50),  // Match registration schema max length
        password: z.string().min(6),
      }),
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          token: z.string(),
        }),
        401: z.object({ message: z.string() }),
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        201: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          token: z.string(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
  },

  // ============= CHARACTERS =============
  characters: {
    list: {
      method: 'GET' as const,
      path: '/api/characters',
      responses: {
        200: z.array(z.custom<typeof characters.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/characters/:id',
      responses: {
        200: z.custom<typeof characters.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/characters',
      input: z.object({
        name: z.string().min(2).max(24),
        characterClass: z.enum(['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'mage', 'druid']),
      }),
      responses: {
        201: z.custom<typeof characters.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/characters/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: z.object({ message: z.string() }),
      },
    },
    getStats: {
      method: 'GET' as const,
      path: '/api/characters/:id/stats',
      responses: {
        200: z.object({
          stats: z.any(),
          attributes: z.any(),
          equipment: z.any(),
        }),
        404: z.object({ message: z.string() }),
      },
    },
  },

  // ============= INVENTORY =============
  inventory: {
    list: {
      method: 'GET' as const,
      path: '/api/characters/:characterId/inventory',
      responses: {
        200: z.array(z.custom<typeof characterItems.$inferSelect>()),
      },
    },
    equip: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/inventory/:itemId/equip',
      responses: {
        200: z.custom<typeof characterItems.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    unequip: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/inventory/:itemId/unequip',
      responses: {
        200: z.custom<typeof characterItems.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    sell: {
      method: 'DELETE' as const,
      path: '/api/characters/:characterId/inventory/:itemId',
      responses: {
        200: z.object({ goldGained: z.number() }),
        404: z.object({ message: z.string() }),
      },
    },
  },

  // ============= ACTIVITIES =============
  activities: {
    start: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/activities/start',
      input: z.object({
        activityType: z.enum(['questing', 'dungeon', 'raid', 'resting']),
        activityId: z.number().optional(),
        difficulty: z.enum(['safe', 'normal', 'challenging', 'heroic']).default('normal'),
      }),
      responses: {
        200: z.object({
          started: z.boolean(),
          activityType: z.string(),
          estimatedCompletionAt: z.string(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    stop: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/activities/stop',
      responses: {
        200: z.object({ stopped: z.boolean() }),
        400: z.object({ message: z.string() }),
      },
    },
    status: {
      method: 'GET' as const,
      path: '/api/characters/:characterId/activities/status',
      responses: {
        200: z.object({
          isActive: z.boolean(),
          activityType: z.string().nullable(),
          activityId: z.number().nullable(),
          progressPercent: z.number(),
          startedAt: z.string().nullable(),
          completesAt: z.string().nullable(),
        }),
      },
    },
    collect: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/activities/collect',
      responses: {
        200: z.object({
          xpGained: z.number(),
          goldGained: z.number(),
          itemsGained: z.array(z.any()),
          leveledUp: z.boolean(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
  },

  // ============= QUESTS =============
  quests: {
    available: {
      method: 'GET' as const,
      path: '/api/characters/:characterId/quests/available',
      responses: {
        200: z.array(z.custom<typeof quests.$inferSelect>()),
      },
    },
    active: {
      method: 'GET' as const,
      path: '/api/characters/:characterId/quests/active',
      responses: {
        200: z.array(z.custom<typeof characterQuestProgress.$inferSelect>()),
      },
    },
    accept: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/quests/:questId/accept',
      responses: {
        200: z.custom<typeof characterQuestProgress.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    abandon: {
      method: 'DELETE' as const,
      path: '/api/characters/:characterId/quests/:questId',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: z.object({ message: z.string() }),
      },
    },
    complete: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/quests/:questId/complete',
      responses: {
        200: z.object({
          success: z.boolean(),
          xpAwarded: z.number(),
          goldAwarded: z.number(),
          itemsAwarded: z.array(z.object({
            id: z.number(),
            name: z.string(),
            rarity: z.string(),
          })),
          leveledUp: z.boolean(),
          newLevel: z.number().optional(),
        }),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    updateProgress: {
      method: 'PATCH' as const,
      path: '/api/characters/:characterId/quests/:questId/progress',
      input: z.object({
        objectiveIndex: z.number().int().min(0),
        progressDelta: z.number().int().min(1),
      }),
      responses: {
        200: z.custom<typeof characterQuestProgress.$inferSelect>(),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },

  // ============= ZONES =============
  zones: {
    list: {
      method: 'GET' as const,
      path: '/api/zones',
      responses: {
        200: z.array(z.custom<typeof zones.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/zones/:id',
      responses: {
        200: z.custom<typeof zones.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    forLevel: {
      method: 'GET' as const,
      path: '/api/zones/level/:level',
      responses: {
        200: z.array(z.custom<typeof zones.$inferSelect>()),
      },
    },
  },

  // ============= DUNGEONS =============
  dungeons: {
    list: {
      method: 'GET' as const,
      path: '/api/dungeons',
      responses: {
        200: z.array(z.custom<typeof dungeons.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/dungeons/:id',
      responses: {
        200: z.object({
          dungeon: z.custom<typeof dungeons.$inferSelect>(),
          bosses: z.array(z.any()),
        }),
        404: z.object({ message: z.string() }),
      },
    },
    forLevel: {
      method: 'GET' as const,
      path: '/api/dungeons/level/:level',
      responses: {
        200: z.array(z.custom<typeof dungeons.$inferSelect>()),
      },
    },
  },

  // ============= COMBAT =============
  combat: {
    simulate: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/combat/simulate',
      input: z.object({
        enemyId: z.string(),
        difficulty: z.enum(['safe', 'normal', 'challenging', 'heroic']).default('normal'),
      }),
      responses: {
        200: z.object({
          victory: z.boolean(),
          durationSeconds: z.number(),
          dps: z.number(),
          playerHealthPercent: z.number(),
          rewards: z.object({
            experience: z.number(),
            gold: z.number(),
            items: z.array(z.any()),
          }).optional(),
          combatLog: z.array(z.any()),
          highlights: z.array(z.string()),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    logs: {
      method: 'GET' as const,
      path: '/api/characters/:characterId/combat/logs',
      responses: {
        200: z.array(z.any()),
      },
    },
  },

  // ============= OFFLINE PROGRESS =============
  offline: {
    calculate: {
      method: 'GET' as const,
      path: '/api/characters/:characterId/offline',
      responses: {
        200: z.object({
          hasProgress: z.boolean(),
          offlineDuration: z.number(),
          xpGained: z.number(),
          goldGained: z.number(),
          itemsFound: z.array(z.any()),
          levelsGained: z.number(),
          died: z.boolean(),
        }),
      },
    },
    claim: {
      method: 'POST' as const,
      path: '/api/characters/:characterId/offline/claim',
      responses: {
        200: z.object({
          claimed: z.boolean(),
          xpGained: z.number(),
          goldGained: z.number(),
          itemsGained: z.array(z.any()),
          newLevel: z.number(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
  },

  // ============= GAME DATA =============
  gameData: {
    classes: {
      method: 'GET' as const,
      path: '/api/game/classes',
      responses: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          resourceType: z.string(),
          armorType: z.string(),
        })),
      },
    },
    class: {
      method: 'GET' as const,
      path: '/api/game/classes/:classId',
      responses: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          resourceType: z.string(),
          armorType: z.string(),
          baseStats: z.any(),
          abilities: z.array(z.any()),
          talentTrees: z.array(z.any()),
        }),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

// ============= UTILITY FUNCTIONS =============

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Type exports for use in client and server
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
