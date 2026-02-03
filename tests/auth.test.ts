// ============= AUTHENTICATION TESTS =============
// Integration tests for auth registration, login, sessions, and protected routes

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import type { Server } from 'http';
import {
  createTestApp,
  createTestUserData,
  generateUsername,
  assertPasswordHashed,
  assertNoPasswordHash,
  createTestUserInDb,
  deleteTestUser,
} from './setup';

describe('Authentication', () => {
  let app: Express;
  let server: Server;
  let testUsersToCleanup: number[] = [];

  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    server = testApp.server;
  });

  afterAll(async () => {
    // Cleanup test users
    for (const userId of testUsersToCleanup) {
      await deleteTestUser(userId).catch(() => {}); // Ignore errors if already deleted
    }
    server.close();
  });

  // ============= REGISTRATION TESTS =============

  describe('POST /api/auth/register', () => {
    it('should register with valid username/password and return user + session', async () => {
      const userData = createTestUserData();

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('username', userData.username);
      expect(res.body).toHaveProperty('token', 'session');

      // Should not return password hash
      assertNoPasswordHash(res.body.user);

      // Should set session cookie
      expect(res.headers['set-cookie']).toBeDefined();

      // Track for cleanup
      testUsersToCleanup.push(res.body.user.id);
    });

    it('should reject duplicate username with 400', async () => {
      const userData = createTestUserData();

      // First registration
      const res1 = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      testUsersToCleanup.push(res1.body.user.id);

      // Second registration with same username
      const res2 = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res2.body).toHaveProperty('message', 'Username already taken');
    });

    it('should reject username shorter than 3 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'ab', password: 'validpassword123' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message.toLowerCase()).toContain('username');
    });

    it('should reject password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: generateUsername(), password: '12345' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message.toLowerCase()).toContain('password');
    });

    it('should hash password (not store plaintext)', async () => {
      const userData = createTestUserData();
      const password = userData.password;

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      testUsersToCleanup.push(res.body.user.id);

      // Get user directly from database to check passwordHash
      const { storage } = await import('../server/storage');
      const dbUser = await storage.users.getUserById(res.body.user.id);

      expect(dbUser).toBeDefined();
      assertPasswordHashed(dbUser!.passwordHash, password);
    });
  });

  // ============= LOGIN TESTS =============

  describe('POST /api/auth/login', () => {
    let testUser: { id: number; username: string; password: string };

    beforeAll(async () => {
      testUser = await createTestUserInDb();
      testUsersToCleanup.push(testUser.id);
    });

    it('should login with valid credentials and return user + session', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('username', testUser.username);
      expect(res.body).toHaveProperty('token', 'session');

      // Should not return password hash
      assertNoPasswordHash(res.body.user);

      // Should set session cookie
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject wrong password with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongpassword' })
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should reject nonexistent user with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent_user_12345', password: 'anypassword' })
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should update lastLoginAt timestamp on successful login', async () => {
      const { storage } = await import('../server/storage');

      // Get initial lastLoginAt
      const userBefore = await storage.users.getUserById(testUser.id);
      const lastLoginBefore = userBefore?.lastLoginAt;

      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 50));

      // Login
      await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password })
        .expect(200);

      // Check lastLoginAt was updated
      const userAfter = await storage.users.getUserById(testUser.id);
      expect(userAfter?.lastLoginAt).toBeDefined();

      if (lastLoginBefore) {
        expect(userAfter!.lastLoginAt!.getTime()).toBeGreaterThan(lastLoginBefore.getTime());
      }
    });
  });

  // ============= SESSION TESTS =============

  describe('Session Management', () => {
    let sessionCookie: string;
    let testUser: { id: number; username: string; password: string };

    beforeAll(async () => {
      testUser = await createTestUserInDb();
      testUsersToCleanup.push(testUser.id);
    });

    beforeEach(async () => {
      // Get fresh session
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password });

      sessionCookie = loginRes.headers['set-cookie']?.[0] ?? '';
    });

    it('GET /api/auth/me should return user with valid session', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', sessionCookie)
        .expect(200);

      expect(res.body).toHaveProperty('username', testUser.username);
      expect(res.body).toHaveProperty('id', testUser.id);

      // Should not return password hash
      assertNoPasswordHash(res.body);
    });

    it('GET /api/auth/me should return 401 without session', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });

    it('POST /api/auth/logout should clear session', async () => {
      // Logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', sessionCookie)
        .expect(200);

      expect(logoutRes.body).toHaveProperty('success', true);
    });

    it('GET /api/auth/me should return 401 after logout', async () => {
      // Logout first
      await request(app)
        .post('/api/auth/logout')
        .set('Cookie', sessionCookie)
        .expect(200);

      // Try to access /me with same cookie
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', sessionCookie)
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });
  });

  // ============= PROTECTED ROUTES TESTS =============

  describe('Protected Routes', () => {
    it('GET /api/characters should return 401 without auth', async () => {
      const res = await request(app)
        .get('/api/characters')
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });

    it('POST /api/characters should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/characters')
        .send({ name: 'TestChar', characterClass: 'warrior' })
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });

    it('GET /api/characters/:id should return 401 without auth', async () => {
      const res = await request(app)
        .get('/api/characters/1')
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });

    it('DELETE /api/characters/:id should return 401 without auth', async () => {
      const res = await request(app)
        .delete('/api/characters/1')
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });

    it('GET /api/characters/:id/inventory should return 401 without auth', async () => {
      const res = await request(app)
        .get('/api/characters/1/inventory')
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Authentication required');
    });
  });
});
