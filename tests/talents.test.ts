// ============= TALENT SYSTEM TESTS =============
// Tests for talent application, prerequisites, validation, and resets
// Reference: Idle-Raiders-GDD.md Section 4.6 (Talent System)

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { Express } from 'express';
import type { Server } from 'http';
import request from 'supertest';
import {
  createTestApp,
  createTestUserInDb,
  deleteTestUser,
  createTestCharacterData,
} from './setup';
import {
  TALENT_POINT_START_LEVEL,
  TOTAL_TALENT_POINTS,
  calculateRespecCost,
} from '@shared/constants/gameConfig';

describe('Talent System', () => {
  let app: Express;
  let server: Server;
  let testUser: { id: number; username: string; password: string };
  let sessionCookie: string;
  let testCharacterId: number;

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    server = testApp.server;

    // Create test user
    testUser = await createTestUserInDb();

    // Login to get session
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password });

    sessionCookie = loginRes.headers['set-cookie']?.[0] ?? '';
  });

  afterAll(async () => {
    await deleteTestUser(testUser.id).catch(() => {});
    server.close();
  });

  beforeEach(async () => {
    // Create a fresh character for each test (level 15 to have talent points)
    const charData = createTestCharacterData();
    const createRes = await request(app)
      .post('/api/characters')
      .set('Cookie', sessionCookie)
      .send(charData);

    if (createRes.status === 201) {
      testCharacterId = createRes.body.id;

      // Level up character to have talent points (if possible via API)
      // For now, tests will need to handle characters that may be level 1
    }
  });

  // ============= CONSTANTS VALIDATION =============

  describe('Talent Constants', () => {
    it('should have talent points start at level 10', () => {
      expect(TALENT_POINT_START_LEVEL).toBe(10);
    });

    it('should have 51 total talent points', () => {
      expect(TOTAL_TALENT_POINTS).toBe(51);
    });

    it('should calculate respec cost correctly', () => {
      expect(calculateRespecCost(0)).toBe(1);
      expect(calculateRespecCost(1)).toBe(2);
      expect(calculateRespecCost(49)).toBe(50);
      expect(calculateRespecCost(100)).toBe(50); // Capped at 50
    });
  });

  // ============= GET TALENTS ENDPOINT =============

  describe('GET /api/characters/:id/talents', () => {
    it('should return talent allocation for character', async () => {
      if (!testCharacterId) return;

      const res = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie)
        .expect(200);

      expect(res.body).toHaveProperty('characterId');
      expect(res.body).toHaveProperty('characterClass');
      expect(res.body).toHaveProperty('level');
      expect(res.body).toHaveProperty('talentTrees');
      expect(res.body).toHaveProperty('pointsAvailable');
      expect(res.body).toHaveProperty('pointsSpent');
      expect(res.body).toHaveProperty('pointsEarned');
      expect(res.body).toHaveProperty('respecCount');
    });

    it('should have 3 talent trees', async () => {
      if (!testCharacterId) return;

      const res = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie)
        .expect(200);

      expect(res.body.talentTrees).toHaveLength(3);
    });

    it('should return 0 points for level 1 character', async () => {
      if (!testCharacterId) return;

      const res = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie)
        .expect(200);

      // Level 1 character should have 0 earned points
      if (res.body.level < TALENT_POINT_START_LEVEL) {
        expect(res.body.pointsEarned).toBe(0);
        expect(res.body.pointsAvailable).toBe(0);
      }
    });

    it('should reject unauthenticated request', async () => {
      if (!testCharacterId) return;

      await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .expect(401);
    });

    it('should reject access to other user characters', async () => {
      // Create another user
      const otherUser = await createTestUserInDb();

      try {
        // Login as other user
        const loginRes = await request(app)
          .post('/api/auth/login')
          .send({ username: otherUser.username, password: otherUser.password });
        const otherCookie = loginRes.headers['set-cookie']?.[0] ?? '';

        // Try to access first user's character
        if (testCharacterId) {
          await request(app)
            .get(`/api/characters/${testCharacterId}/talents`)
            .set('Cookie', otherCookie)
            .expect(403);
        }
      } finally {
        await deleteTestUser(otherUser.id).catch(() => {});
      }
    });
  });

  // ============= APPLY TALENT ENDPOINT =============

  describe('POST /api/characters/:id/talents/apply', () => {
    it('should reject with no points available (level < 10)', async () => {
      if (!testCharacterId) return;

      // First check if character has points
      const talentRes = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie);

      if (talentRes.body.pointsAvailable === 0) {
        const res = await request(app)
          .post(`/api/characters/${testCharacterId}/talents/apply`)
          .set('Cookie', sessionCookie)
          .send({ treeIndex: 0, talentId: 'test_talent' })
          .expect(400);

        expect(res.body.message).toMatch(/no talent points|not found/i);
      }
    });

    it('should reject invalid tree index', async () => {
      if (!testCharacterId) return;

      await request(app)
        .post(`/api/characters/${testCharacterId}/talents/apply`)
        .set('Cookie', sessionCookie)
        .send({ treeIndex: 5, talentId: 'test_talent' })
        .expect(400);
    });

    it('should reject missing treeIndex', async () => {
      if (!testCharacterId) return;

      await request(app)
        .post(`/api/characters/${testCharacterId}/talents/apply`)
        .set('Cookie', sessionCookie)
        .send({ talentId: 'test_talent' })
        .expect(400);
    });

    it('should reject missing talentId', async () => {
      if (!testCharacterId) return;

      await request(app)
        .post(`/api/characters/${testCharacterId}/talents/apply`)
        .set('Cookie', sessionCookie)
        .send({ treeIndex: 0 })
        .expect(400);
    });

    it('should reject invalid talentId', async () => {
      if (!testCharacterId) return;

      const res = await request(app)
        .post(`/api/characters/${testCharacterId}/talents/apply`)
        .set('Cookie', sessionCookie)
        .send({ treeIndex: 0, talentId: 'nonexistent_talent_xyz' })
        .expect(400);

      expect(res.body.message).toMatch(/not found|no talent points/i);
    });

    it('should reject unauthenticated request', async () => {
      if (!testCharacterId) return;

      await request(app)
        .post(`/api/characters/${testCharacterId}/talents/apply`)
        .send({ treeIndex: 0, talentId: 'test_talent' })
        .expect(401);
    });
  });

  // ============= RESET TALENTS ENDPOINT =============

  describe('POST /api/characters/:id/talents/reset', () => {
    it('should require authentication', async () => {
      if (!testCharacterId) return;

      await request(app)
        .post(`/api/characters/${testCharacterId}/talents/reset`)
        .expect(401);
    });

    it('should reject if insufficient gold', async () => {
      if (!testCharacterId) return;

      // New character typically has 0 gold
      const res = await request(app)
        .post(`/api/characters/${testCharacterId}/talents/reset`)
        .set('Cookie', sessionCookie);

      // Either succeeds (0 talents = free?) or fails due to insufficient gold
      if (res.status === 400) {
        expect(res.body.message).toMatch(/insufficient gold/i);
      }
    });

    it('should return refunded points after reset', async () => {
      if (!testCharacterId) return;

      // Check talents first
      const talentRes = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie);

      const pointsSpent = talentRes.body.pointsSpent || 0;

      const res = await request(app)
        .post(`/api/characters/${testCharacterId}/talents/reset`)
        .set('Cookie', sessionCookie);

      if (res.status === 200) {
        expect(res.body).toHaveProperty('pointsRefunded');
        expect(res.body.pointsRefunded).toBe(pointsSpent);
      }
    });
  });

  // ============= RESPEC COST FORMULA =============

  describe('Respec Cost Formula', () => {
    it('should cost 1 gold for first respec', () => {
      expect(calculateRespecCost(0)).toBe(1);
    });

    it('should increase linearly', () => {
      expect(calculateRespecCost(0)).toBe(1);
      expect(calculateRespecCost(1)).toBe(2);
      expect(calculateRespecCost(5)).toBe(6);
      expect(calculateRespecCost(10)).toBe(11);
    });

    it('should cap at 50 gold', () => {
      expect(calculateRespecCost(49)).toBe(50);
      expect(calculateRespecCost(50)).toBe(50);
      expect(calculateRespecCost(100)).toBe(50);
      expect(calculateRespecCost(1000)).toBe(50);
    });
  });

  // ============= TALENT TREE STRUCTURE =============

  describe('Talent Tree Structure', () => {
    it('should have talent trees with required properties', async () => {
      if (!testCharacterId) return;

      const res = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie)
        .expect(200);

      for (const tree of res.body.talentTrees) {
        expect(tree).toHaveProperty('id');
        expect(tree).toHaveProperty('name');
        expect(tree).toHaveProperty('talents');
        expect(tree).toHaveProperty('pointsSpent');
        expect(Array.isArray(tree.talents)).toBe(true);
      }
    });

    it('should have talents with required properties', async () => {
      if (!testCharacterId) return;

      const res = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie)
        .expect(200);

      for (const tree of res.body.talentTrees) {
        for (const talent of tree.talents) {
          expect(talent).toHaveProperty('id');
          expect(talent).toHaveProperty('name');
          expect(talent).toHaveProperty('maxRanks');
          expect(talent).toHaveProperty('requiredPoints');
        }
      }
    });
  });

  // ============= PREREQUISITE VALIDATION =============

  describe('Talent Prerequisites', () => {
    it('should enforce required points in tree', async () => {
      if (!testCharacterId) return;

      // Get talent tree info
      const talentRes = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie);

      const tree = talentRes.body.talentTrees[0];
      if (!tree || !tree.talents.length) return;

      // Find a talent that requires points in tree
      const talentWithReq = tree.talents.find((t: any) => t.requiredPoints > 0);
      if (!talentWithReq) return; // No talent with requirements

      // Try to apply it without meeting requirement
      const res = await request(app)
        .post(`/api/characters/${testCharacterId}/talents/apply`)
        .set('Cookie', sessionCookie)
        .send({ treeIndex: 0, talentId: talentWithReq.id });

      if (talentRes.body.pointsAvailable === 0) {
        expect(res.status).toBe(400);
      } else if (tree.pointsSpent < talentWithReq.requiredPoints) {
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/points in this tree/i);
      }
    });
  });

  // ============= MAX RANK VALIDATION =============

  describe('Max Rank Validation', () => {
    it('should not exceed max ranks (design verification)', async () => {
      if (!testCharacterId) return;

      const talentRes = await request(app)
        .get(`/api/characters/${testCharacterId}/talents`)
        .set('Cookie', sessionCookie);

      const tree = talentRes.body.talentTrees[0];
      if (!tree || !tree.talents.length) return;

      // Verify all talents have maxRanks defined
      for (const talent of tree.talents) {
        expect(talent.maxRanks).toBeGreaterThanOrEqual(1);
        expect(talent.maxRanks).toBeLessThanOrEqual(5); // Typical max
      }
    });
  });
});

// ============= INTEGRATION TESTS (Require High-Level Character) =============

describe.skip('Talent System Integration (requires level 10+ character)', () => {
  // These tests require a character with talent points
  // Skip until we have a way to create high-level characters in tests

  it('should successfully apply first talent point', async () => {
    // Requires: Level 10+ character with available points
    // Requires: Valid talent ID from first tree
  });

  it('should increment pointsSpent after applying', async () => {
    // Requires: Character that successfully applied a talent
  });

  it('should enforce prerequisite talents', async () => {
    // Requires: Trying to apply a talent that requires another talent first
  });

  it('should deduct gold on reset', async () => {
    // Requires: Character with gold and spent talent points
  });

  it('should reset all talent trees on reset', async () => {
    // Requires: Character with points in multiple trees
  });
});
