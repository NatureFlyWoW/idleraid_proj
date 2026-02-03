import { warriorClass } from './warrior';
import { mageClass } from './mage';
import { priestClass } from './priest';
import { paladinClass } from './paladin';
import { hunterClass } from './hunter';
import { rogueClass } from './rogue';
import { druidClass } from './druid';
import type { ClassDefinition } from '@shared/types';
import type { CharacterClass } from '@shared/schema';

// Export all class definitions
export { warriorClass } from './warrior';
export { mageClass } from './mage';
export { priestClass } from './priest';
export { paladinClass } from './paladin';
export { hunterClass } from './hunter';
export { rogueClass } from './rogue';
export { druidClass } from './druid';

// Map of all available classes
export const CLASS_DEFINITIONS: Record<CharacterClass, ClassDefinition> = {
  warrior: warriorClass,
  mage: mageClass,
  priest: priestClass,
  paladin: paladinClass,
  hunter: hunterClass,
  rogue: rogueClass,
  druid: druidClass,
};

// Get class definition by ID
export function getClassDefinition(classId: CharacterClass): ClassDefinition {
  return CLASS_DEFINITIONS[classId];
}

// Get all classes
export function getAllClasses(): ClassDefinition[] {
  return Object.values(CLASS_DEFINITIONS);
}

// Alias for backwards compatibility
export const getImplementedClasses = getAllClasses;

// Get starting stats for a class
export function getClassStartingStats(classId: CharacterClass) {
  const classDef = getClassDefinition(classId);

  return {
    baseStrength: classDef.baseStats.strength,
    baseAgility: classDef.baseStats.agility,
    baseIntellect: classDef.baseStats.intellect,
    baseStamina: classDef.baseStats.stamina,
    baseSpirit: classDef.baseStats.spirit,
    currentHealth: classDef.baseStats.health + (classDef.baseStats.stamina * classDef.statScaling.staminaToHealth),
    maxHealth: classDef.baseStats.health + (classDef.baseStats.stamina * classDef.statScaling.staminaToHealth),
    currentResource: classDef.resourceType === 'mana'
      ? classDef.baseStats.resource + (classDef.baseStats.intellect * classDef.statScaling.intellectToMana)
      : 0,
    maxResource: classDef.resourceType === 'mana'
      ? classDef.baseStats.resource + (classDef.baseStats.intellect * classDef.statScaling.intellectToMana)
      : 100,
  };
}
