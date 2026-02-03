// ============= TEST SETUP =============
// Shared test utilities, helpers, and factories for Idle Raiders tests

import type { Express } from 'express';
import type { Server } from 'http';

// ============= TEST APP FACTORY =============

/**
 * Creates a test Express app with all routes registered.
 * Must be called in beforeAll() and cleaned up in afterAll().
 */
export async function createTestApp(): Promise<{ app: Express; server: Server }> {
  // Dynamic imports to avoid module initialization issues
  const express = await import('express');
  const { registerRoutes } = await import('../server/routes');
  const http = await import('http');

  const app = express.default();
  app.use(express.json());

  const server = http.createServer(app);
  await registerRoutes(server, app);

  return { app, server };
}

// ============= TEST USER FACTORY =============

let userCounter = 0;

/**
 * Generates a unique test username
 */
export function generateUsername(): string {
  return `testuser_${Date.now()}_${++userCounter}`;
}

/**
 * Creates test user registration data
 */
export function createTestUserData(overrides?: { username?: string; password?: string }) {
  return {
    username: overrides?.username ?? generateUsername(),
    password: overrides?.password ?? 'testpassword123',
  };
}

// ============= TEST CHARACTER FACTORY =============

let characterCounter = 0;

/**
 * Generates a unique character name
 */
export function generateCharacterName(): string {
  return `TestChar${Date.now()}_${++characterCounter}`;
}

/**
 * Creates test character data
 */
export function createTestCharacterData(overrides?: {
  name?: string;
  characterClass?: string;
}) {
  return {
    name: overrides?.name ?? generateCharacterName(),
    characterClass: overrides?.characterClass ?? 'warrior',
  };
}

// ============= HTTP TEST HELPERS =============

/**
 * Helper to make authenticated requests with session cookie
 */
export class AuthenticatedClient {
  private cookies: string[] = [];

  constructor(private app: Express) {}

  setCookies(cookies: string[]) {
    this.cookies = cookies;
  }

  getCookieHeader(): string {
    return this.cookies.join('; ');
  }

  clearCookies() {
    this.cookies = [];
  }
}

/**
 * Extract cookies from response headers
 */
export function extractCookies(headers: Record<string, string | string[] | undefined>): string[] {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return [];
  if (Array.isArray(setCookie)) {
    return setCookie.map(c => c.split(';')[0]);
  }
  return [setCookie.split(';')[0]];
}

// ============= ASSERTION HELPERS =============

/**
 * Assert that a password hash is NOT the plaintext password
 */
export function assertPasswordHashed(hash: string, plaintext: string): void {
  // Hash should be in format "salt:derivedKey"
  if (hash === plaintext) {
    throw new Error('Password was not hashed - stored as plaintext!');
  }
  if (!hash.includes(':')) {
    throw new Error('Password hash is not in expected salt:key format');
  }
  const [salt, key] = hash.split(':');
  if (!salt || salt.length < 16) {
    throw new Error('Password hash has invalid salt');
  }
  if (!key || key.length < 64) {
    throw new Error('Password hash has invalid derived key');
  }
}

/**
 * Assert that response does not contain password hash
 */
export function assertNoPasswordHash(obj: unknown): void {
  if (typeof obj !== 'object' || obj === null) return;

  if ('passwordHash' in obj) {
    throw new Error('Response contains passwordHash field - should be excluded!');
  }
  if ('password_hash' in obj) {
    throw new Error('Response contains password_hash field - should be excluded!');
  }
}

// ============= SEED DATA CONSTANTS =============

export const EXPECTED_ZONES = [
  'Northshire Valley',
  'Elwynn Forest',
  'Westfall',
  'Redridge Mountains',
  'Duskwood',
];

export const EXPECTED_DUNGEONS = [
  'The Deadmines',
  'Cindermaw Caverns',
  "Serpent's Lament",
];

// Legacy export for backwards compatibility
export const EXPECTED_DUNGEON = 'The Deadmines';

export const IMPLEMENTED_CLASSES = ['warrior', 'mage', 'priest', 'paladin', 'hunter', 'rogue', 'druid'];
export const UNIMPLEMENTED_CLASSES: string[] = []; // All classes are now implemented

// ============= DATABASE CLEANUP =============

/**
 * Creates a unique test user directly in the database for testing
 * Returns the user data needed for login
 */
export async function createTestUserInDb(): Promise<{
  id: number;
  username: string;
  password: string;
}> {
  const { hashPassword } = await import('../server/auth');
  const { storage } = await import('../server/storage');

  const username = generateUsername();
  const password = 'testpassword123';
  const passwordHash = await hashPassword(password);

  const user = await storage.users.createUser({ username, passwordHash });

  return { id: user.id, username, password };
}

/**
 * Deletes a test user and all related data
 */
export async function deleteTestUser(userId: number): Promise<void> {
  const { db } = await import('../server/db');
  const { users } = await import('../shared/schema');
  const { eq } = await import('drizzle-orm');

  // Cascade delete will handle characters
  await db.delete(users).where(eq(users.id, userId));
}
