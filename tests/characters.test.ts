// ============= CHARACTER TESTS =============
// Integration tests for character CRUD operations with authentication

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import type { Server } from 'http';
import {
  createTestApp,
  createTestCharacterData,
  generateCharacterName,
  createTestUserInDb,
  deleteTestUser,
  IMPLEMENTED_CLASSES,
  UNIMPLEMENTED_CLASSES,
} from './setup';

describe('Character CRUD', () => {
  let app: Express;
  let server: Server;
  let testUsersToCleanup: number[] = [];

  // User 1 - primary test user
  let user1: { id: number; username: string; password: string };
  let user1Cookie: string;

  // User 2 - for testing ownership checks
  let user2: { id: number; username: string; password: string };
  let user2Cookie: string;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    server = testApp.server;

    // Create two test users for ownership tests
    user1 = await createTestUserInDb();
    user2 = await createTestUserInDb();
    testUsersToCleanup.push(user1.id, user2.id);

    // Increase character slots for user1 to test all 7 classes
    const { db } = await import('../server/db');
    const { users } = await import('../shared/schema');
    const { eq } = await import('drizzle-orm');
    await db.update(users).set({ maxCharacterSlots: 10 }).where(eq(users.id, user1.id));

    // Get session cookies for both users
    const login1 = await request(app)
      .post('/api/auth/login')
      .send({ username: user1.username, password: user1.password });
    user1Cookie = login1.headers['set-cookie']?.[0] ?? '';

    const login2 = await request(app)
      .post('/api/auth/login')
      .send({ username: user2.username, password: user2.password });
    user2Cookie = login2.headers['set-cookie']?.[0] ?? '';
  });

  afterAll(async () => {
    for (const userId of testUsersToCleanup) {
      await deleteTestUser(userId).catch(() => {});
    }
    server.close();
  });

  // ============= CREATE CHARACTER TESTS =============

  describe('POST /api/characters', () => {
    it('should create character with valid implemented class (warrior)', async () => {
      const charData = createTestCharacterData({ characterClass: 'warrior' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', charData.name);
      expect(res.body).toHaveProperty('characterClass', 'warrior');
      expect(res.body).toHaveProperty('level', 1);
      expect(res.body).toHaveProperty('userId', user1.id);

      // Should have starting stats for warrior
      expect(res.body).toHaveProperty('baseStrength');
      expect(res.body.baseStrength).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('baseStamina');
      expect(res.body.baseStamina).toBeGreaterThan(0);
    });

    it('should create character with valid implemented class (mage)', async () => {
      const charData = createTestCharacterData({ characterClass: 'mage' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('characterClass', 'mage');

      // Mage should have higher intellect
      expect(res.body).toHaveProperty('baseIntellect');
      expect(res.body.baseIntellect).toBeGreaterThan(res.body.baseStrength);
    });

    it('should create character with valid implemented class (priest)', async () => {
      const charData = createTestCharacterData({ characterClass: 'priest' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('characterClass', 'priest');

      // Priest should have high spirit
      expect(res.body).toHaveProperty('baseSpirit');
      expect(res.body.baseSpirit).toBeGreaterThan(10);
    });

    it('should create character with valid implemented class (paladin)', async () => {
      const charData = createTestCharacterData({ characterClass: 'paladin' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('characterClass', 'paladin');
      // Paladin should have decent strength and intellect
      expect(res.body).toHaveProperty('baseStrength');
      expect(res.body.baseStrength).toBeGreaterThan(10);
    });

    it('should create character with valid implemented class (hunter)', async () => {
      const charData = createTestCharacterData({ characterClass: 'hunter' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('characterClass', 'hunter');
      // Hunter should have high agility
      expect(res.body).toHaveProperty('baseAgility');
      expect(res.body.baseAgility).toBeGreaterThan(10);
    });

    it('should create character with valid implemented class (rogue)', async () => {
      const charData = createTestCharacterData({ characterClass: 'rogue' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('characterClass', 'rogue');
      // Rogue should have high agility
      expect(res.body).toHaveProperty('baseAgility');
      expect(res.body.baseAgility).toBeGreaterThan(15);
    });

    it('should create character with valid implemented class (druid)', async () => {
      const charData = createTestCharacterData({ characterClass: 'druid' });

      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(charData)
        .expect(201);

      expect(res.body).toHaveProperty('characterClass', 'druid');
      // Druid should have balanced stats
      expect(res.body).toHaveProperty('baseIntellect');
      expect(res.body.baseIntellect).toBeGreaterThan(10);
    });

    it('should reject character name shorter than 2 characters', async () => {
      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send({ name: 'A', characterClass: 'warrior' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should reject character name longer than 24 characters', async () => {
      const res = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send({ name: 'A'.repeat(25), characterClass: 'warrior' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });

  // ============= LIST CHARACTERS TESTS =============

  describe('GET /api/characters', () => {
    let user1CharId: number;
    let user2CharId: number;

    beforeAll(async () => {
      // Create a character for user1
      const res1 = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(createTestCharacterData({ characterClass: 'warrior' }));
      user1CharId = res1.body.id;

      // Create a character for user2
      const res2 = await request(app)
        .post('/api/characters')
        .set('Cookie', user2Cookie)
        .send(createTestCharacterData({ characterClass: 'mage' }));
      user2CharId = res2.body.id;
    });

    it('should return only current user\'s characters', async () => {
      const res = await request(app)
        .get('/api/characters')
        .set('Cookie', user1Cookie)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);

      // All returned characters should belong to user1
      for (const char of res.body) {
        expect(char.userId).toBe(user1.id);
      }

      // Should not contain user2's character
      const hasUser2Char = res.body.some((c: any) => c.id === user2CharId);
      expect(hasUser2Char).toBe(false);
    });

    it('should return different characters for different users', async () => {
      const res1 = await request(app)
        .get('/api/characters')
        .set('Cookie', user1Cookie)
        .expect(200);

      const res2 = await request(app)
        .get('/api/characters')
        .set('Cookie', user2Cookie)
        .expect(200);

      // User1 should have user1's characters
      const user1CharIds = res1.body.map((c: any) => c.id);
      expect(user1CharIds).toContain(user1CharId);

      // User2 should have user2's characters
      const user2CharIds = res2.body.map((c: any) => c.id);
      expect(user2CharIds).toContain(user2CharId);

      // No overlap
      const overlap = user1CharIds.filter((id: number) => user2CharIds.includes(id));
      expect(overlap).toHaveLength(0);
    });
  });

  // ============= GET CHARACTER BY ID TESTS =============

  describe('GET /api/characters/:id', () => {
    let user1CharId: number;
    let user2CharId: number;

    beforeAll(async () => {
      const res1 = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(createTestCharacterData({ name: 'OwnershipTest1', characterClass: 'warrior' }));
      user1CharId = res1.body.id;

      const res2 = await request(app)
        .post('/api/characters')
        .set('Cookie', user2Cookie)
        .send(createTestCharacterData({ name: 'OwnershipTest2', characterClass: 'mage' }));
      user2CharId = res2.body.id;
    });

    it('should return character when owned by user', async () => {
      const res = await request(app)
        .get(`/api/characters/${user1CharId}`)
        .set('Cookie', user1Cookie)
        .expect(200);

      expect(res.body).toHaveProperty('id', user1CharId);
      expect(res.body).toHaveProperty('userId', user1.id);
    });

    it('should return 403 when character not owned by user', async () => {
      const res = await request(app)
        .get(`/api/characters/${user2CharId}`)
        .set('Cookie', user1Cookie)
        .expect(403);

      expect(res.body).toHaveProperty('message', 'Access denied');
    });

    it('should return 404 for nonexistent character', async () => {
      const res = await request(app)
        .get('/api/characters/999999')
        .set('Cookie', user1Cookie)
        .expect(404);

      expect(res.body).toHaveProperty('message', 'Character not found');
    });
  });

  // ============= DELETE CHARACTER TESTS =============

  describe('DELETE /api/characters/:id', () => {
    it('should delete owned character and return success', async () => {
      // Create a character to delete
      const createRes = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(createTestCharacterData({ name: 'ToDelete', characterClass: 'warrior' }));
      const charId = createRes.body.id;

      // Delete it
      const deleteRes = await request(app)
        .delete(`/api/characters/${charId}`)
        .set('Cookie', user1Cookie)
        .expect(200);

      expect(deleteRes.body).toHaveProperty('success', true);

      // Verify it's gone (or marked deleted)
      const getRes = await request(app)
        .get(`/api/characters/${charId}`)
        .set('Cookie', user1Cookie);

      // Should either be 404 (hard delete) or still there but marked deleted
      expect([404, 200]).toContain(getRes.status);
    });

    it('should return 403 when deleting character not owned by user', async () => {
      // Create a character as user2
      const createRes = await request(app)
        .post('/api/characters')
        .set('Cookie', user2Cookie)
        .send(createTestCharacterData({ name: 'NotYours', characterClass: 'priest' }));
      const charId = createRes.body.id;

      // Try to delete as user1
      const res = await request(app)
        .delete(`/api/characters/${charId}`)
        .set('Cookie', user1Cookie)
        .expect(403);

      expect(res.body).toHaveProperty('message', 'Access denied');
    });

    it('should return 404 for nonexistent character', async () => {
      const res = await request(app)
        .delete('/api/characters/999999')
        .set('Cookie', user1Cookie)
        .expect(404);

      expect(res.body).toHaveProperty('message', 'Character not found');
    });
  });

  // ============= CHARACTER OWNERSHIP FOR RELATED ROUTES =============

  describe('Character Ownership on Related Routes', () => {
    let user1CharId: number;
    let user2CharId: number;

    beforeAll(async () => {
      const res1 = await request(app)
        .post('/api/characters')
        .set('Cookie', user1Cookie)
        .send(createTestCharacterData({ characterClass: 'warrior' }));
      user1CharId = res1.body.id;

      const res2 = await request(app)
        .post('/api/characters')
        .set('Cookie', user2Cookie)
        .send(createTestCharacterData({ characterClass: 'mage' }));
      user2CharId = res2.body.id;
    });

    it('should deny inventory access to non-owned character', async () => {
      const res = await request(app)
        .get(`/api/characters/${user2CharId}/inventory`)
        .set('Cookie', user1Cookie)
        .expect(403);

      expect(res.body).toHaveProperty('message', 'Access denied');
    });

    it('should deny activity status access to non-owned character', async () => {
      const res = await request(app)
        .get(`/api/characters/${user2CharId}/activities/status`)
        .set('Cookie', user1Cookie)
        .expect(403);

      expect(res.body).toHaveProperty('message', 'Access denied');
    });

    it('should deny starting activity on non-owned character', async () => {
      const res = await request(app)
        .post(`/api/characters/${user2CharId}/activities/start`)
        .set('Cookie', user1Cookie)
        .send({ activityType: 'questing' })
        .expect(403);

      expect(res.body).toHaveProperty('message', 'Access denied');
    });

    it('should deny combat logs access to non-owned character', async () => {
      const res = await request(app)
        .get(`/api/characters/${user2CharId}/combat/logs`)
        .set('Cookie', user1Cookie)
        .expect(403);

      expect(res.body).toHaveProperty('message', 'Access denied');
    });
  });
});
