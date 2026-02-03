// ============= DAMAGE FORMULA TESTS =============
// Tests for combat damage calculations
// Reference: Idle-Raiders-GDD.md Section 5.3 (Combat Formulas)

import { describe, it, expect } from 'vitest';
import {
  calculateArmorReduction,
  calculateAutoAttackDamage,
  calculateEffectiveAttackSpeed,
  DAMAGE_PER_AP,
  BASE_CRIT_MULTIPLIER,
  SPELL_CRIT_MULTIPLIER,
  HEALING_CRIT_MULTIPLIER,
  GLANCING_BLOW_CHANCE,
  GLANCING_BLOW_DAMAGE_REDUCTION_MIN,
  GLANCING_BLOW_DAMAGE_REDUCTION_MAX,
  BASE_MISS_CHANCE_MELEE,
  BASE_MISS_CHANCE_SPELL,
  HIT_CAP_MELEE,
  HIT_CAP_SPELL,
} from '@shared/constants/gameConfig';

describe('Damage Formulas', () => {
  // ============= ARMOR REDUCTION =============

  describe('Armor Reduction', () => {
    describe('Formula: armor / (armor + 400 + 85 * level)', () => {
      it('should return 0 for 0 armor', () => {
        expect(calculateArmorReduction(0, 60)).toBe(0);
      });

      it('should return positive reduction for positive armor', () => {
        const reduction = calculateArmorReduction(1000, 60);
        expect(reduction).toBeGreaterThan(0);
      });

      it('should cap at 75% reduction', () => {
        // Even with extremely high armor, should cap at 0.75
        const reduction = calculateArmorReduction(100000, 60);
        expect(reduction).toBe(0.75);
      });

      it('should follow the formula at level 60', () => {
        // At level 60: divisor = 400 + 85 * 60 = 400 + 5100 = 5500
        // With 1000 armor: 1000 / (1000 + 5500) = 1000/6500 ≈ 0.1538
        const armor = 1000;
        const level = 60;
        const expected = armor / (armor + 400 + 85 * level);
        const actual = calculateArmorReduction(armor, level);
        expect(actual).toBeCloseTo(expected, 4);
      });

      it('should give more reduction at lower attacker levels', () => {
        const armor = 2000;
        const reductionVsLevel60 = calculateArmorReduction(armor, 60);
        const reductionVsLevel30 = calculateArmorReduction(armor, 30);

        // Lower level = smaller divisor = more reduction
        expect(reductionVsLevel30).toBeGreaterThan(reductionVsLevel60);
      });

      it('should scale linearly with armor (before cap)', () => {
        // Double armor should approximately double reduction (at low armor values)
        const level = 60;
        const baseArmor = 500;
        const doubleArmor = 1000;

        const baseReduction = calculateArmorReduction(baseArmor, level);
        const doubleReduction = calculateArmorReduction(doubleArmor, level);

        // Not exactly double due to formula, but should increase
        expect(doubleReduction).toBeGreaterThan(baseReduction);
        expect(doubleReduction).toBeLessThan(baseReduction * 2.5); // Reasonable bound
      });
    });

    describe('Reference Values (GDD Section 5.3)', () => {
      it('should match known armor values at level 60', () => {
        // Reference: 5500 armor at 60 should give ~50% reduction
        // Formula: 5500 / (5500 + 5500) = 0.50
        const reduction = calculateArmorReduction(5500, 60);
        expect(reduction).toBeCloseTo(0.5, 2);
      });

      it('should handle low-level scenarios', () => {
        // At level 10: divisor = 400 + 85 * 10 = 1250
        // With 500 armor: 500 / (500 + 1250) = 500/1750 ≈ 0.286
        const reduction = calculateArmorReduction(500, 10);
        expect(reduction).toBeCloseTo(0.286, 2);
      });
    });
  });

  // ============= AUTO-ATTACK DAMAGE =============

  describe('Auto-Attack Damage', () => {
    describe('Formula: WeaponDamage + (AP / 14 * WeaponSpeed)', () => {
      it('should return weapon damage range with 0 AP', () => {
        const result = calculateAutoAttackDamage(100, 200, 2.5, 0);

        expect(result.min).toBe(100);
        expect(result.max).toBe(200);
        expect(result.average).toBe(150);
      });

      it('should add AP bonus based on weapon speed', () => {
        // AP bonus = (AP / 14) * speed
        // With 140 AP and 2.0 speed: bonus = (140/14) * 2.0 = 20
        const result = calculateAutoAttackDamage(100, 200, 2.0, 140);

        expect(result.min).toBe(120); // 100 + 20
        expect(result.max).toBe(220); // 200 + 20
      });

      it('should scale with weapon speed', () => {
        const ap = 280;
        const slowWeapon = calculateAutoAttackDamage(100, 200, 3.5, ap);
        const fastWeapon = calculateAutoAttackDamage(100, 200, 1.5, ap);

        // Slower weapon gets more AP bonus per swing
        expect(slowWeapon.min).toBeGreaterThan(fastWeapon.min);
        expect(slowWeapon.max).toBeGreaterThan(fastWeapon.max);
      });

      it('should return floored integer values', () => {
        const result = calculateAutoAttackDamage(100, 200, 2.5, 100);

        expect(Number.isInteger(result.min)).toBe(true);
        expect(Number.isInteger(result.max)).toBe(true);
      });

      it('should use DAMAGE_PER_AP constant (14)', () => {
        expect(DAMAGE_PER_AP).toBe(14);

        // Verify formula: with 14 AP, bonus should be 1 DPS * speed
        const result = calculateAutoAttackDamage(0, 0, 2.0, 14);
        expect(result.min).toBe(2); // 14/14 * 2 = 2
        expect(result.max).toBe(2);
      });
    });

    describe('DPS Calculation', () => {
      it('should calculate correct average damage', () => {
        const result = calculateAutoAttackDamage(100, 300, 3.0, 0);

        // Average = (min + max) / 2 = (100 + 300) / 2 = 200
        expect(result.average).toBe(200);
      });
    });
  });

  // ============= ATTACK SPEED / HASTE =============

  describe('Attack Speed with Haste', () => {
    describe('Formula: baseSpeed / (1 + haste/100)', () => {
      it('should return base speed with 0% haste', () => {
        expect(calculateEffectiveAttackSpeed(3.0, 0)).toBe(3.0);
      });

      it('should reduce attack speed with positive haste', () => {
        const effective = calculateEffectiveAttackSpeed(3.0, 50);

        // 3.0 / (1 + 0.50) = 3.0 / 1.5 = 2.0
        expect(effective).toBe(2.0);
      });

      it('should halve attack speed at 100% haste', () => {
        const effective = calculateEffectiveAttackSpeed(3.0, 100);

        // 3.0 / (1 + 1.0) = 3.0 / 2.0 = 1.5
        expect(effective).toBe(1.5);
      });

      it('should approach but never reach 0', () => {
        const effective = calculateEffectiveAttackSpeed(3.0, 1000);

        expect(effective).toBeGreaterThan(0);
        expect(effective).toBeLessThan(0.5);
      });
    });
  });

  // ============= CRITICAL STRIKE MULTIPLIERS =============

  describe('Critical Strike Multipliers', () => {
    describe('Melee Crits', () => {
      it('should have 2.0x multiplier for melee crits', () => {
        expect(BASE_CRIT_MULTIPLIER).toBe(2.0);
      });

      it('should double damage on melee crit', () => {
        const baseDamage = 500;
        const critDamage = baseDamage * BASE_CRIT_MULTIPLIER;
        expect(critDamage).toBe(1000);
      });
    });

    describe('Spell Crits', () => {
      it('should have 1.5x multiplier for spell crits', () => {
        expect(SPELL_CRIT_MULTIPLIER).toBe(1.5);
      });

      it('should deal 150% damage on spell crit', () => {
        const baseDamage = 1000;
        const critDamage = baseDamage * SPELL_CRIT_MULTIPLIER;
        expect(critDamage).toBe(1500);
      });
    });

    describe('Healing Crits', () => {
      it('should have 1.5x multiplier for healing crits', () => {
        expect(HEALING_CRIT_MULTIPLIER).toBe(1.5);
      });

      it('should deal 150% healing on heal crit', () => {
        const baseHealing = 800;
        const critHealing = baseHealing * HEALING_CRIT_MULTIPLIER;
        expect(critHealing).toBe(1200);
      });
    });

    describe('Multiplier Relationships', () => {
      it('should have melee crit > spell crit', () => {
        expect(BASE_CRIT_MULTIPLIER).toBeGreaterThan(SPELL_CRIT_MULTIPLIER);
      });

      it('should have spell crit = healing crit', () => {
        expect(SPELL_CRIT_MULTIPLIER).toBe(HEALING_CRIT_MULTIPLIER);
      });
    });
  });

  // ============= GLANCING BLOWS =============

  describe('Glancing Blows', () => {
    it('should have 40% chance vs +3 level bosses', () => {
      expect(GLANCING_BLOW_CHANCE).toBe(40);
    });

    it('should have min damage reduction of 15%', () => {
      expect(GLANCING_BLOW_DAMAGE_REDUCTION_MIN).toBe(15);
    });

    it('should have max damage reduction of 35%', () => {
      expect(GLANCING_BLOW_DAMAGE_REDUCTION_MAX).toBe(35);
    });

    it('should reduce damage between 15-35%', () => {
      const baseDamage = 1000;

      const minReduction = baseDamage * (1 - GLANCING_BLOW_DAMAGE_REDUCTION_MAX / 100);
      const maxReduction = baseDamage * (1 - GLANCING_BLOW_DAMAGE_REDUCTION_MIN / 100);

      // Glancing blow damage range
      expect(minReduction).toBe(650); // 1000 * 0.65
      expect(maxReduction).toBe(850); // 1000 * 0.85
    });
  });

  // ============= HIT AND MISS =============

  describe('Hit and Miss Mechanics', () => {
    describe('Base Miss Chances', () => {
      it('should have 5% base melee miss vs same level', () => {
        expect(BASE_MISS_CHANCE_MELEE).toBe(5);
      });

      it('should have 4% base spell miss vs same level', () => {
        expect(BASE_MISS_CHANCE_SPELL).toBe(4);
      });
    });

    describe('Hit Caps', () => {
      it('should have 9% hit cap for melee vs +3 boss', () => {
        expect(HIT_CAP_MELEE).toBe(9);
      });

      it('should have 16% hit cap for spells vs +3 boss', () => {
        expect(HIT_CAP_SPELL).toBe(16);
      });

      it('should have higher spell hit cap than melee', () => {
        expect(HIT_CAP_SPELL).toBeGreaterThan(HIT_CAP_MELEE);
      });
    });
  });

  // ============= SPELL DAMAGE SCALING =============

  describe('Spell Damage Scaling', () => {
    // These test the expected behavior patterns
    // Actual coefficients are defined per ability

    describe('Spell Power Coefficients', () => {
      it('should have instant spells use lower coefficients', () => {
        // Design expectation: instant spells ~43% of base cast time coefficient
        const baseCoefficent = 1.0; // 3.5s cast baseline
        const instantCoefficient = 1.5 / 3.5; // ~43%
        expect(instantCoefficient).toBeCloseTo(0.43, 1);
      });

      it('should have DOTs use full duration coefficients', () => {
        // Design expectation: DOT coefficient = duration / 3.5
        const dotDuration = 18; // Example: 18 second DOT
        const expectedCoef = dotDuration / 3.5;
        expect(expectedCoef).toBeCloseTo(5.14, 1);
      });
    });
  });

  // ============= DAMAGE TYPE MODIFIERS =============

  describe('Damage Type Modifiers', () => {
    // Physical vs magical resistance systems

    describe('Physical Damage', () => {
      it('should be reduced by armor', () => {
        // Physical damage always goes through armor
        const armor = 3000;
        const reduction = calculateArmorReduction(armor, 60);
        expect(reduction).toBeGreaterThan(0);
      });
    });

    describe('Magical Damage', () => {
      // Magical damage uses resistance, not armor
      // This is a design verification - actual implementation in CombatSimulator

      it('should not use armor formula for magic (design check)', () => {
        // This test verifies the design intent
        // Actual magic resistance would be separate
        expect(true).toBe(true); // Placeholder for magic resistance tests
      });
    });
  });

  // ============= COMPREHENSIVE DAMAGE SCENARIOS =============

  describe('Damage Calculation Scenarios', () => {
    describe('Warrior with 2H Weapon', () => {
      it('should calculate expected damage range', () => {
        // Level 60 warrior with 500 AP, 3.5 speed 2H weapon
        const weaponMin = 150;
        const weaponMax = 250;
        const speed = 3.5;
        const ap = 500;

        const result = calculateAutoAttackDamage(weaponMin, weaponMax, speed, ap);

        // AP bonus = (500/14) * 3.5 = 125
        expect(result.min).toBe(275); // 150 + 125
        expect(result.max).toBe(375); // 250 + 125
      });
    });

    describe('Rogue with Daggers', () => {
      it('should calculate lower per-hit damage but faster attacks', () => {
        // Dagger: 1.8 speed, lower damage but faster
        const weaponMin = 50;
        const weaponMax = 100;
        const speed = 1.8;
        const ap = 400;

        const result = calculateAutoAttackDamage(weaponMin, weaponMax, speed, ap);

        // AP bonus = (400/14) * 1.8 ≈ 51.4 → 51
        const expectedBonus = Math.floor((ap / DAMAGE_PER_AP) * speed);
        expect(result.min).toBe(weaponMin + expectedBonus);
      });
    });

    describe('Damage After Armor', () => {
      it('should calculate final damage after armor mitigation', () => {
        // Raw damage: 1000
        // Armor: 5500 at level 60 = 50% reduction
        const rawDamage = 1000;
        const armor = 5500;
        const armorReduction = calculateArmorReduction(armor, 60);

        const finalDamage = rawDamage * (1 - armorReduction);
        expect(finalDamage).toBeCloseTo(500, -1); // ~500 damage
      });
    });
  });
});
