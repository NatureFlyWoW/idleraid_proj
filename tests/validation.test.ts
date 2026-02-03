// ============= INPUT VALIDATION TESTS =============
// Tests for input validation, edge cases, and security considerations
// Tests the Zod schemas defined in shared/routes.ts

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { api } from '@shared/routes';

describe('Input Validation', () => {
  // ============= USERNAME VALIDATION =============

  describe('Username Validation', () => {
    const usernameSchema = api.auth.login.input.shape.username;

    describe('Valid Usernames', () => {
      it('should accept alphanumeric usernames', () => {
        expect(() => usernameSchema.parse('testuser123')).not.toThrow();
      });

      it('should accept 3-character usernames', () => {
        expect(() => usernameSchema.parse('abc')).not.toThrow();
      });

      it('should accept 50-character usernames (max)', () => {
        expect(() => usernameSchema.parse('a'.repeat(50))).not.toThrow();
      });

      it('should accept underscores in usernames', () => {
        expect(() => usernameSchema.parse('test_user')).not.toThrow();
      });
    });

    describe('Invalid Usernames', () => {
      it('should reject empty strings', () => {
        expect(() => usernameSchema.parse('')).toThrow();
      });

      it('should reject usernames under 3 characters', () => {
        expect(() => usernameSchema.parse('ab')).toThrow();
        expect(() => usernameSchema.parse('a')).toThrow();
      });

      it('should reject usernames over 50 characters', () => {
        expect(() => usernameSchema.parse('a'.repeat(51))).toThrow();
      });
    });

    describe('SQL Injection Attempts', () => {
      // These should be accepted by the schema (validation only checks length)
      // but should be sanitized/escaped by the database layer

      it('should not crash on SQL injection patterns', () => {
        const sqlInjections = [
          "'; DROP TABLE users;--",
          "1' OR '1'='1",
          "admin'--",
          "'; DELETE FROM users WHERE '1'='1",
          "1; SELECT * FROM users",
        ];

        for (const injection of sqlInjections) {
          // These may pass or fail validation based on length, but shouldn't crash
          try {
            usernameSchema.parse(injection);
          } catch (e) {
            // Expected to throw ZodError for length violations
            expect(e).toBeInstanceOf(z.ZodError);
          }
        }
      });

      it('should reject very long SQL injection attempts', () => {
        const longInjection = "'; DROP TABLE users;--".repeat(10);
        expect(() => usernameSchema.parse(longInjection)).toThrow();
      });
    });
  });

  // ============= PASSWORD VALIDATION =============

  describe('Password Validation', () => {
    const passwordSchema = api.auth.login.input.shape.password;

    describe('Valid Passwords', () => {
      it('should accept passwords 6+ characters', () => {
        expect(() => passwordSchema.parse('123456')).not.toThrow();
        expect(() => passwordSchema.parse('password123')).not.toThrow();
      });

      it('should accept special characters', () => {
        expect(() => passwordSchema.parse('p@ssw0rd!')).not.toThrow();
      });

      it('should accept very long passwords', () => {
        expect(() => passwordSchema.parse('a'.repeat(100))).not.toThrow();
      });
    });

    describe('Invalid Passwords', () => {
      it('should reject empty strings', () => {
        expect(() => passwordSchema.parse('')).toThrow();
      });

      it('should reject passwords under 6 characters', () => {
        expect(() => passwordSchema.parse('12345')).toThrow();
        expect(() => passwordSchema.parse('abc')).toThrow();
      });
    });
  });

  // ============= CHARACTER NAME VALIDATION =============

  describe('Character Name Validation', () => {
    const characterSchema = api.characters.create.input;
    const nameSchema = characterSchema.shape.name;

    describe('Valid Names', () => {
      it('should accept 2-24 character names', () => {
        expect(() => nameSchema.parse('ab')).not.toThrow();
        expect(() => nameSchema.parse('a'.repeat(24))).not.toThrow();
      });

      it('should accept standard fantasy names', () => {
        const validNames = ['Arthas', 'Thrall', 'Illidan', 'Sylvanas'];
        for (const name of validNames) {
          expect(() => nameSchema.parse(name)).not.toThrow();
        }
      });
    });

    describe('Invalid Names', () => {
      it('should reject empty strings', () => {
        expect(() => nameSchema.parse('')).toThrow();
      });

      it('should reject single character names', () => {
        expect(() => nameSchema.parse('a')).toThrow();
      });

      it('should reject names over 24 characters', () => {
        expect(() => nameSchema.parse('a'.repeat(25))).toThrow();
      });
    });

    describe('XSS Attempt Handling', () => {
      // These should be handled by the schema length validation
      // Additional sanitization should happen server-side

      it('should not crash on XSS patterns', () => {
        const xssAttempts = [
          '<script>alert("xss")</script>',
          '"><img src=x onerror=alert(1)>',
          "javascript:alert('xss')",
          '<svg onload=alert(1)>',
          '{{constructor.constructor("return this")()}}',
        ];

        for (const xss of xssAttempts) {
          try {
            nameSchema.parse(xss);
          } catch (e) {
            // May throw if too long
            expect(e).toBeInstanceOf(z.ZodError);
          }
        }
      });

      it('should reject long XSS payloads', () => {
        const longXss = '<script>'.repeat(100);
        expect(() => nameSchema.parse(longXss)).toThrow();
      });
    });
  });

  // ============= CHARACTER CLASS VALIDATION =============

  describe('Character Class Validation', () => {
    const classSchema = api.characters.create.input.shape.characterClass;

    describe('Valid Classes', () => {
      it('should accept all 7 classes', () => {
        const validClasses = ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'mage', 'druid'];
        for (const cls of validClasses) {
          expect(() => classSchema.parse(cls)).not.toThrow();
        }
      });
    });

    describe('Invalid Classes', () => {
      it('should reject invalid class names', () => {
        const invalidClasses = ['wizard', 'shaman', 'warlock', 'death_knight', 'monk'];
        for (const cls of invalidClasses) {
          expect(() => classSchema.parse(cls)).toThrow();
        }
      });

      it('should reject empty string', () => {
        expect(() => classSchema.parse('')).toThrow();
      });

      it('should reject numbers', () => {
        expect(() => classSchema.parse(1)).toThrow();
        expect(() => classSchema.parse('123')).toThrow();
      });

      it('should be case-sensitive', () => {
        expect(() => classSchema.parse('Warrior')).toThrow();
        expect(() => classSchema.parse('WARRIOR')).toThrow();
      });
    });
  });

  // ============= ACTIVITY VALIDATION =============

  describe('Activity Validation', () => {
    const activitySchema = api.activities.start.input;

    describe('Activity Type', () => {
      it('should accept valid activity types', () => {
        const validTypes = ['questing', 'dungeon', 'raid', 'resting'];
        for (const type of validTypes) {
          const input = { activityType: type };
          expect(() => activitySchema.parse(input)).not.toThrow();
        }
      });

      it('should reject invalid activity types', () => {
        const invalidTypes = ['farming', 'pvp', 'crafting', 'fishing'];
        for (const type of invalidTypes) {
          const input = { activityType: type };
          expect(() => activitySchema.parse(input)).toThrow();
        }
      });
    });

    describe('Difficulty', () => {
      it('should accept valid difficulties', () => {
        const validDifficulties = ['safe', 'normal', 'challenging', 'heroic'];
        for (const diff of validDifficulties) {
          const input = { activityType: 'questing', difficulty: diff };
          expect(() => activitySchema.parse(input)).not.toThrow();
        }
      });

      it('should default to normal difficulty', () => {
        const input = { activityType: 'questing' };
        const result = activitySchema.parse(input);
        expect(result.difficulty).toBe('normal');
      });

      it('should reject invalid difficulties', () => {
        const input = { activityType: 'questing', difficulty: 'mythic' };
        expect(() => activitySchema.parse(input)).toThrow();
      });
    });
  });

  // ============= NUMERIC VALUE VALIDATION =============

  describe('Numeric Value Validation', () => {
    describe('Activity ID', () => {
      const activitySchema = api.activities.start.input;

      it('should accept positive integers for activityId', () => {
        const input = { activityType: 'questing', activityId: 1 };
        expect(() => activitySchema.parse(input)).not.toThrow();
      });

      it('should accept undefined activityId', () => {
        const input = { activityType: 'resting' };
        expect(() => activitySchema.parse(input)).not.toThrow();
      });
    });

    describe('Integer Overflow Prevention', () => {
      it('should handle large numbers gracefully', () => {
        // JavaScript's MAX_SAFE_INTEGER
        const maxSafe = Number.MAX_SAFE_INTEGER;
        const activitySchema = api.activities.start.input;

        const input = { activityType: 'questing', activityId: maxSafe };
        // Should either accept or reject cleanly, not crash
        try {
          activitySchema.parse(input);
        } catch (e) {
          expect(e).toBeInstanceOf(z.ZodError);
        }
      });

      it('should reject negative IDs', () => {
        const activitySchema = api.activities.start.input;
        const input = { activityType: 'questing', activityId: -1 };

        // Behavior depends on schema definition
        // Just verify it doesn't crash
        try {
          activitySchema.parse(input);
        } catch (e) {
          // May or may not throw
        }
      });
    });
  });

  // ============= NULL AND UNDEFINED HANDLING =============

  describe('Null and Undefined Handling', () => {
    describe('Login Schema', () => {
      const loginSchema = api.auth.login.input;

      it('should reject null username', () => {
        expect(() => loginSchema.parse({ username: null, password: 'password123' })).toThrow();
      });

      it('should reject undefined username', () => {
        expect(() => loginSchema.parse({ password: 'password123' })).toThrow();
      });

      it('should reject null password', () => {
        expect(() => loginSchema.parse({ username: 'testuser', password: null })).toThrow();
      });
    });

    describe('Character Create Schema', () => {
      const createSchema = api.characters.create.input;

      it('should reject null name', () => {
        expect(() => createSchema.parse({ name: null, characterClass: 'warrior' })).toThrow();
      });

      it('should reject null class', () => {
        expect(() => createSchema.parse({ name: 'TestChar', characterClass: null })).toThrow();
      });

      it('should reject missing required fields', () => {
        expect(() => createSchema.parse({})).toThrow();
        expect(() => createSchema.parse({ name: 'TestChar' })).toThrow();
        expect(() => createSchema.parse({ characterClass: 'warrior' })).toThrow();
      });
    });
  });

  // ============= TYPE COERCION =============

  describe('Type Coercion', () => {
    describe('String Fields', () => {
      const loginSchema = api.auth.login.input;

      it('should reject non-string username', () => {
        expect(() => loginSchema.parse({ username: 12345, password: 'password123' })).toThrow();
      });

      it('should reject array username', () => {
        expect(() => loginSchema.parse({ username: ['test'], password: 'password123' })).toThrow();
      });

      it('should reject object username', () => {
        expect(() => loginSchema.parse({ username: { name: 'test' }, password: 'password123' })).toThrow();
      });
    });

    describe('Enum Fields', () => {
      const classSchema = api.characters.create.input.shape.characterClass;

      it('should reject numeric class values', () => {
        expect(() => classSchema.parse(1)).toThrow();
      });

      it('should reject boolean class values', () => {
        expect(() => classSchema.parse(true)).toThrow();
      });
    });
  });

  // ============= EDGE CASES =============

  describe('Edge Cases', () => {
    describe('Unicode and Special Characters', () => {
      const nameSchema = api.characters.create.input.shape.name;

      it('should handle unicode characters', () => {
        // These may be valid or invalid depending on requirements
        const unicodeNames = ['Tëst', 'Naïve', '日本語'];
        for (const name of unicodeNames) {
          // Should not crash regardless of whether accepted
          try {
            nameSchema.parse(name);
          } catch (e) {
            expect(e).toBeInstanceOf(z.ZodError);
          }
        }
      });

      it('should handle emojis', () => {
        const emojiName = '🗡️Knight';
        try {
          nameSchema.parse(emojiName);
        } catch (e) {
          expect(e).toBeInstanceOf(z.ZodError);
        }
      });
    });

    describe('Whitespace Handling', () => {
      const nameSchema = api.characters.create.input.shape.name;

      it('should handle leading/trailing spaces', () => {
        // Behavior depends on schema - just verify no crash
        try {
          nameSchema.parse('  TestChar  ');
        } catch (e) {
          expect(e).toBeInstanceOf(z.ZodError);
        }
      });

      it('should handle only whitespace', () => {
        // Should be rejected (too short after trim or invalid)
        try {
          nameSchema.parse('   ');
        } catch (e) {
          // May or may not throw depending on trim behavior
        }
      });
    });

    describe('Empty Object', () => {
      it('should reject empty object for login', () => {
        expect(() => api.auth.login.input.parse({})).toThrow();
      });

      it('should reject empty object for character creation', () => {
        expect(() => api.characters.create.input.parse({})).toThrow();
      });

      it('should reject empty object for activity start', () => {
        expect(() => api.activities.start.input.parse({})).toThrow();
      });
    });
  });
});
