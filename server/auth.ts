// ============= AUTHENTICATION MODULE =============
// Session-based authentication using Passport.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import type { Express, Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import type { User } from '@shared/schema';

const scryptAsync = promisify(scrypt);

// ============= PASSWORD UTILITIES =============

/**
 * Hash a password using scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedKey] = hash.split(':');
  if (!salt || !storedKey) return false;

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedKeyBuffer = Buffer.from(storedKey, 'hex');

  return timingSafeEqual(derivedKey, storedKeyBuffer);
}

// ============= PASSPORT CONFIGURATION =============

// Serialize user to session (store user ID)
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

// Deserialize user from session (fetch user by ID)
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.users.getUserById(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

// Local strategy for username/password authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.users.getUserByUsername(username);

      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      const isValid = await verifyPassword(password, user.passwordHash);

      if (!isValid) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      // Update last login
      await storage.users.updateUserLastLogin(user.id);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// ============= SESSION SETUP =============

export function setupAuth(app: Express): void {
  // Session configuration
  const sessionSecret = process.env.SESSION_SECRET || 'idle-raiders-dev-secret-change-in-prod';

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
}

// ============= AUTH MIDDLEWARE =============

/**
 * Middleware to require authentication
 * Responds with 401 if user is not authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

/**
 * Middleware to optionally load user if authenticated
 * Does not block unauthenticated requests
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  // User is already loaded by passport if authenticated
  next();
}

/**
 * Get the authenticated user from request
 * Returns undefined if not authenticated
 */
export function getAuthUser(req: Request): User | undefined {
  return req.user as User | undefined;
}

/**
 * Get the authenticated user ID from request
 * Throws if not authenticated (use after requireAuth middleware)
 */
export function getAuthUserId(req: Request): number {
  const user = req.user as User | undefined;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.id;
}

// ============= TYPE AUGMENTATION =============

// Extend Express User type
declare global {
  namespace Express {
    interface User extends Omit<import('@shared/schema').User, 'passwordHash'> {
      id: number;
      username: string;
      passwordHash: string;
    }
  }
}

export { passport };
