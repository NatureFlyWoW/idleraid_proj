# Idle Raiders — Master Item Catalog

> **Owner:** 🎲 Item Balance Agent
> **Last Updated:** 2026-02-02
> **Version:** 0.1

## Overview

This document is the authoritative source for all item definitions in Idle Raiders. Items defined here are implemented by Backend Agent and visualized by Item Art Agent.

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-02-02 | Initial catalog structure created |

---

## 1. Design Philosophy

### 1.1 Power Budget System

Each item has a **power budget** based on:
- **Item Level**: Base budget = itemLevel × rarityMultiplier
- **Rarity Multipliers**: Common (1.0), Uncommon (1.15), Rare (1.3), Epic (1.5), Legendary (2.0)
- **Slot Weight**: Two-handed weapons get 2× budget, trinkets get 0.8×

### 1.2 Stat Distribution Guidelines

| Armor Type | Primary Focus | Secondary Focus |
|------------|---------------|-----------------|
| Cloth | Intellect, Spirit | Spell Power, MP5, Crit |
| Leather | Agility OR Intellect | Attack Power/Spell Power, Crit, Hit |
| Mail | Agility OR Intellect | Attack Power/Spell Power, Crit, Haste |
| Plate | Strength OR Stamina | Attack Power, Parry, Block |

### 1.3 Special Effect Philosophy

- **Common/Uncommon**: No special effects
- **Rare**: Simple proc effects (5-10% chance)
- **Epic**: Moderate procs OR on-use effects
- **Legendary**: Powerful procs AND unique mechanics

---

## 2. Item Templates by Slot

### 2.1 Weapons

#### One-Handed Swords
```
Template: 1h_sword_[level]_[rarity]
Base DPS: (itemLevel × 0.8) × rarityMult
Speed: 1.8 attacks/second
Stat Budget: itemLevel × rarityMult × 1.0
```

<!-- TODO: Add specific weapon templates -->

### 2.2 Armor Sets

<!-- TODO: Define armor sets by tier -->

### 2.3 Accessories

<!-- TODO: Define accessory templates -->

---

## 3. Named Items

### 3.1 Dungeon Drops

<!-- TODO: Define dungeon boss drops -->

### 3.2 Quest Rewards

<!-- TODO: Define quest reward items -->

### 3.3 Crafted Items

<!-- TODO: Define profession-crafted items -->

---

## 4. Set Items

### 4.1 Tier 1 Sets (Levels 15-25)

<!-- TODO: Define T1 sets for each class -->

### 4.2 Tier 2 Sets (Levels 25-35)

<!-- TODO: Define T2 sets -->

---

## 5. Legendary Items

### 5.1 World Drops

<!-- TODO: Define rare world-drop legendaries -->

### 5.2 Raid Drops

<!-- TODO: Define raid legendary items -->

---

## 6. Generation Rules

### 6.1 Random Stat Allocation

For procedurally generated items:

1. Determine power budget from itemLevel × rarityMult
2. Select 2-4 stats based on slot and armor type
3. Distribute budget across stats with weighting:
   - Primary stat: 40-50% of budget
   - Secondary stats: 20-30% each
   - Tertiary stat (if any): 10-20%

### 6.2 Affix System

| Prefix | Effect | Budget Cost |
|--------|--------|-------------|
| Burning | +Fire damage proc | 15% |
| Frozen | Slow on hit | 12% |
| Vampiric | Lifesteal on hit | 18% |
| Swift | +Haste | 10% |
| Sturdy | +Stamina | 8% |

| Suffix | Effect | Budget Cost |
|--------|--------|-------------|
| of the Bear | +Stamina, +Armor | 15% |
| of the Eagle | +Agility, +Crit | 15% |
| of the Owl | +Intellect, +Spirit | 15% |
| of the Tiger | +Strength, +Attack Power | 15% |
| of Destruction | +Crit, +Hit | 18% |

---

## 7. Item Art Descriptors

When defining items, include visual hints for Item Art Agent:

```yaml
name: "Blazing Greatsword of the Phoenix"
visual_hints:
  theme: fire
  material: darksteel
  accent: ruby
  condition: pristine
  glow: bright
  particles: flames
```

---

<!-- Append new items above this line -->
