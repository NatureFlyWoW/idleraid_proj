// ============= QUEST ENDPOINT TESTS =============
// Integration tests for quest turn-in and progress update endpoints

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import type { Server } from 'http';
import {
  createTestApp,
  createTestCharacterData,
  createTestUserInDb,
  deleteTestUser,
} from './setup';

describe('Quest Endpoints', () => {
  let app: Express;
  let server: Server;
  let testUser: { id: number; username: string; password: string };
  let userCookie: string;
  let testCharacterId: number;
  let testQuestId: number;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    server = testApp.server;

    // Create test user
    testUser = await createTestUserInDb();

    // Login
    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    userCookie = login.headers['set-cookie']?.[0] ?? '';

    // Create test character
    const charData = createTestCharacterData({ characterClass: 'warrior' });
    const charRes = await request(app)
      .post('/api/characters')
      .set('Cookie', userCookie)
      .send(charData);
    testCharacterId = charRes.body.id;

    // Get an available quest for this character
    const questsRes = await request(app)
      .get(`/api/characters/${testCharacterId}/quests/available`)
      .set('Cookie', userCookie);

    if (questsRes.body.length > 0) {
      testQuestId = questsRes.body[0].id;
    }
  });

  afterAll(async () => {
    await deleteTestUser(testUser.id).catch(() => {});
    server.close();
  });

  // ============= QUEST PROGRESS UPDATE TESTS =============

  describe('PATCH /api/characters/:characterId/quests/:questId/progress', () => {
    let acceptedQuestId: number;

    beforeAll(async () => {
      // Accept a quest first
      if (testQuestId) {
        await request(app)
          .post(`/api/characters/${testCharacterId}/quests/${testQuestId}/accept`)
          .set('Cookie', userCookie);
        acceptedQuestId = testQuestId;
      }
    });

    it('should update quest progress for valid objective', async () => {
      if (!acceptedQuestId) {
        console.log('Skipping test - no quest available');
        return;
      }

      const res = await request(app)
        .patch(`/api/characters/${testCharacterId}/quests/${acceptedQuestId}/progress`)
        .set('Cookie', userCookie)
        .send({ objectiveIndex: 0, progressDelta: 1 })
        .expect(200);

      expect(res.body).toHaveProperty('progress');
      expect(Array.isArray(res.body.progress)).toBe(true);
      expect(res.body.progress[0]).toBeGreaterThanOrEqual(1);
    });

    it('should reject invalid objective index', async () => {
      if (!acceptedQuestId) {
        console.log('Skipping test - no quest available');
        return;
      }

      await request(app)
        .patch(`/api/characters/${testCharacterId}/quests/${acceptedQuestId}/progress`)
        .set('Cookie', userCookie)
        .send({ objectiveIndex: 999, progressDelta: 1 })
        .expect(400);
    });

    it('should reject negative progressDelta', async () => {
      if (!acceptedQuestId) {
        console.log('Skipping test - no quest available');
        return;
      }

      await request(app)
        .patch(`/api/characters/${testCharacterId}/quests/${acceptedQuestId}/progress`)
        .set('Cookie', userCookie)
        .send({ objectiveIndex: 0, progressDelta: -1 })
        .expect(400);
    });

    it('should reject unauthenticated request', async () => {
      if (!acceptedQuestId) {
        console.log('Skipping test - no quest available');
        return;
      }

      await request(app)
        .patch(`/api/characters/${testCharacterId}/quests/${acceptedQuestId}/progress`)
        .send({ objectiveIndex: 0, progressDelta: 1 })
        .expect(401);
    });

    it('should return 404 for non-active quest', async () => {
      await request(app)
        .patch(`/api/characters/${testCharacterId}/quests/99999/progress`)
        .set('Cookie', userCookie)
        .send({ objectiveIndex: 0, progressDelta: 1 })
        .expect(404);
    });
  });

  // ============= QUEST COMPLETION TESTS =============

  describe('POST /api/characters/:characterId/quests/:questId/complete', () => {
    it('should reject completion when objectives incomplete', async () => {
      if (!testQuestId) {
        console.log('Skipping test - no quest available');
        return;
      }

      // Accept a fresh quest
      const questsRes = await request(app)
        .get(`/api/characters/${testCharacterId}/quests/available`)
        .set('Cookie', userCookie);

      if (questsRes.body.length === 0) {
        console.log('Skipping test - no quests available');
        return;
      }

      const freshQuestId = questsRes.body[0].id;

      await request(app)
        .post(`/api/characters/${testCharacterId}/quests/${freshQuestId}/accept`)
        .set('Cookie', userCookie);

      // Try to complete without finishing objectives
      const res = await request(app)
        .post(`/api/characters/${testCharacterId}/quests/${freshQuestId}/complete`)
        .set('Cookie', userCookie)
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('not yet complete');
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .post(`/api/characters/${testCharacterId}/quests/1/complete`)
        .expect(401);
    });

    it('should return 404 for non-existent quest', async () => {
      await request(app)
        .post(`/api/characters/${testCharacterId}/quests/99999/complete`)
        .set('Cookie', userCookie)
        .expect(404);
    });

    it('should return 404 for non-active quest', async () => {
      // Quest exists but character hasn't accepted it
      const questsRes = await request(app)
        .get(`/api/characters/${testCharacterId}/quests/available`)
        .set('Cookie', userCookie);

      if (questsRes.body.length === 0) {
        console.log('Skipping test - no quests available');
        return;
      }

      // Don't accept it, just try to complete
      const questId = questsRes.body[questsRes.body.length - 1].id; // Get last available quest

      await request(app)
        .post(`/api/characters/${testCharacterId}/quests/${questId}/complete`)
        .set('Cookie', userCookie)
        .expect(404);
    });
  });

  // ============= OWNERSHIP TESTS =============

  describe('Quest ownership verification', () => {
    let otherUser: { id: number; username: string; password: string };
    let otherUserCookie: string;

    beforeAll(async () => {
      otherUser = await createTestUserInDb();
      const login = await request(app)
        .post('/api/auth/login')
        .send({ username: otherUser.username, password: otherUser.password });
      otherUserCookie = login.headers['set-cookie']?.[0] ?? '';
    });

    afterAll(async () => {
      await deleteTestUser(otherUser.id).catch(() => {});
    });

    it('should reject progress update for other user\'s character', async () => {
      await request(app)
        .patch(`/api/characters/${testCharacterId}/quests/1/progress`)
        .set('Cookie', otherUserCookie)
        .send({ objectiveIndex: 0, progressDelta: 1 })
        .expect(403);
    });

    it('should reject quest completion for other user\'s character', async () => {
      await request(app)
        .post(`/api/characters/${testCharacterId}/quests/1/complete`)
        .set('Cookie', otherUserCookie)
        .expect(403);
    });
  });
});
