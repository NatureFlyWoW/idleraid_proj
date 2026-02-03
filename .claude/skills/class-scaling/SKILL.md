---
name: class-scaling
description: Use when implementing stat calculations, gear scoring, item generation, talent effects, or any mechanic that depends on how base attributes (STR, AGI, INT, STA) convert to combat stats (Attack Power, Spell Power, Crit, Mana, HP). Each class has unique scaling ratios.
---

# Class Stat Scaling Reference

## Attribute to Combat Stat Conversion

| Class | STR→Melee AP | AGI→Melee AP | AGI→Ranged AP | AGI→Crit | INT→Mana | INT→SP | INT→Spell Crit |
|-------|-------------|-------------|--------------|----------|---------|--------|---------------|
| Warrior | 2.0 | — | — | 0.05% | — | — | — |
| Paladin | 1.5 | — | — | — | 15 | 1.0 | 0.02% |
| Hunter | — | — | 2.0 | 0.1% (ranged) | 15 | 0.5 | — |
| Rogue | 0.8 | 1.8 | — | 0.1% (melee) | — | — | — |
| Priest | — | — | — | — | 15 | 1.2 | 0.03% |
| Mage | — | — | — | — | 15 | 1.5 | 0.03% |
| Druid | 1.5 (bear/cat) | 1.2 (cat only) | — | 0.08% | 15 | 1.2 | 0.02% |

Universal: 1 Stamina = 10 Health for all classes. Druid Bear Form multiplies the Stamina HP bonus by 2.0x.

## Level 1 Starting Stats

| Class | HP | Resource | STR | STA | AGI | INT |
|-------|-----|----------|-----|-----|-----|-----|
| Warrior | 100 | Rage 0/100 | 20 | 18 | 10 | 8 |
| Paladin | 90 | Mana 130 | 16 | 15 | 8 | 13 |
| Hunter | 80 | Mana 145 | 10 | 13 | 22 | 13 |
| Rogue | 75 | Energy 100 | 12 | 12 | 24 | 8 |
| Priest | 70 | Mana 175 | 8 | 11 | 8 | 25 |
| Mage | 65 | Mana 190 | 7 | 10 | 7 | 26 |
| Druid | 80 | Mana 160 | 14 | 14 | 14 | 16 |

## Armor Types
Plate: Warrior, Paladin | Mail (level 40+): Hunter | Leather: Rogue, Druid, Hunter (<40) | Cloth: Priest, Mage

## Talent Trees (7 tiers each, 51 total points from levels 10–60)
Warrior: Arms / Fury / Protection | Paladin: Holy / Protection / Retribution
Hunter: Beast Mastery / Marksmanship / Survival | Rogue: Assassination / Combat / Subtlety
Priest: Discipline / Holy / Shadow | Mage: Arcane / Fire / Frost
Druid: Balance / Feral Combat / Restoration

## Source Files
- shared/constants/gameConfig.ts — Scaling constants
- shared/types/game.ts — Class and stat type definitions
- Idle-Raiders-GDD.md — Section 4: Character Systems
