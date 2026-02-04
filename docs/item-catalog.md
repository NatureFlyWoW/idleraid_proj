# Idle Raiders — Master Item Catalog

> **Owner:** 🎲 Item Balance Agent
> **Last Updated:** 2026-02-02
> **Version:** 0.1

## Overview

This document is the authoritative source for all item definitions in Idle Raiders. Items defined here are implemented by Backend Agent and visualized by Item Art Agent.

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.2 | 2026-02-04 | Added power budget formulas, 12 epic items, Cindermaw Battlegear set |
| 0.1 | 2026-02-02 | Initial catalog structure created |

---

## 1. Design Philosophy

### 1.1 Power Budget System

Each item has a **power budget** based on:
- **Item Level**: Base budget = itemLevel × rarityMultiplier
- **Rarity Multipliers**: Common (1.0), Uncommon (1.15), Rare (1.3), Epic (1.5), Legendary (2.0)
- **Slot Weight**: Two-handed weapons get 2× budget, trinkets get 0.8×

#### Detailed Power Budget Formulas

```
Base Budget = itemLevel × rarityMultiplier × slotWeight

Rarity Multipliers:
  Common:    1.0
  Uncommon:  1.15
  Rare:      1.3
  Epic:      1.5
  Legendary: 2.0

Slot Weights:
  Two-Hand Weapon: 2.0
  One-Hand Weapon: 1.0
  Off-Hand:        0.8
  Head:            1.0
  Chest:           1.0
  Shoulders:       0.8
  Hands:           0.7
  Legs:            0.9
  Feet:            0.7
  Waist:           0.6
  Wrist:           0.5
  Back:            0.6
  Neck:            0.7
  Ring:            0.6
  Trinket:         0.8

Stat Conversion (1 budget point =):
  Strength:     1.0 point
  Agility:      1.0 point
  Intellect:    1.0 point
  Stamina:      1.0 point
  Spirit:       1.0 point
  Attack Power: 2.0 points
  Spell Power:  1.5 points
  Crit Rating:  1.2 points
  Hit Rating:   1.5 points
  Haste Rating: 1.2 points
  Armor:        4.0 points
```

#### Example Calculations

**Level 50 Epic Chestplate:**
```
Budget = 50 × 1.5 × 1.0 = 75 points
Distribution:
  - Stamina: 30 points = 30 STA (40%)
  - Strength: 22 points = 22 STR (29%)
  - Crit Rating: 23 points = 19 Crit (31%)
```

**Level 55 Epic Two-Hand Staff:**
```
Budget = 55 × 1.5 × 2.0 = 165 points
Distribution:
  - Intellect: 66 points = 66 INT (40%)
  - Spell Power: 50 points = 33 SP (30%)
  - Spirit: 33 points = 33 SPI (20%)
  - Crit Rating: 16 points = 13 Crit (10%)
```

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

### 4.1 Cindermaw Battlegear (Plate Tank Set, Level 20-25)

> **Source:** Cindermaw Caverns dungeon bosses
> **Classes:** Warrior, Paladin
> **Theme:** Fire-forged volcanic armor

#### Set Bonuses
| Pieces | Bonus |
|--------|-------|
| 2 | +15 Fire Resistance |
| 3 | +5% Block Value |
| 5 | Melee attacks have 8% chance to deal 75 Fire damage |

#### Set Pieces

##### Cindermaw Greathelm (Head)
```yaml
slot: head
type: plate
itemLevel: 22
rarity: rare
requiredLevel: 20
setId: cindermaw_battlegear

stats:
  armor: 420
  stamina: 18
  strength: 12
  fireResistance: 10

dropSource: "Flamewarden Gorrak"
dropChance: 18%

visualHints:
  theme: fire
  material: darksteel
  accent: ruby
  glow: dim
```

##### Cindermaw Pauldrons (Shoulders)
```yaml
slot: shoulders
type: plate
itemLevel: 23
rarity: rare
requiredLevel: 20
setId: cindermaw_battlegear

stats:
  armor: 380
  stamina: 15
  strength: 10
  blockRating: 8

dropSource: "Molten Lurker"
dropChance: 20%

visualHints:
  theme: fire
  material: darksteel
  accent: ruby
```

##### Cindermaw Breastplate (Chest)
```yaml
slot: chest
type: plate
itemLevel: 25
rarity: rare
requiredLevel: 22
setId: cindermaw_battlegear

stats:
  armor: 520
  stamina: 22
  strength: 15
  fireResistance: 12
  parryRating: 10

dropSource: "Pyroclast the Eternal"
dropChance: 15%

visualHints:
  theme: fire
  material: darksteel
  accent: ruby
  glow: dim
  particles: embers
```

##### Cindermaw Gauntlets (Hands)
```yaml
slot: hands
type: plate
itemLevel: 21
rarity: rare
requiredLevel: 19
setId: cindermaw_battlegear

stats:
  armor: 320
  stamina: 12
  strength: 10
  hitRating: 6

dropSource: "Flamewarden Gorrak"
dropChance: 22%

visualHints:
  theme: fire
  material: darksteel
  accent: ruby
```

##### Cindermaw Legguards (Legs)
```yaml
slot: legs
type: plate
itemLevel: 24
rarity: rare
requiredLevel: 21
setId: cindermaw_battlegear

stats:
  armor: 480
  stamina: 20
  strength: 14
  fireResistance: 8
  defenseRating: 10

dropSource: "Pyroclast the Eternal"
dropChance: 18%

visualHints:
  theme: fire
  material: darksteel
  accent: ruby
```

#### Set Summary Table

| Piece | Slot | iLvl | Key Stats | Drop Source |
|-------|------|------|-----------|-------------|
| Cindermaw Greathelm | Head | 22 | +18 STA, +12 STR | Flamewarden Gorrak |
| Cindermaw Pauldrons | Shoulders | 23 | +15 STA, +10 STR | Molten Lurker |
| Cindermaw Breastplate | Chest | 25 | +22 STA, +15 STR | Pyroclast |
| Cindermaw Gauntlets | Hands | 21 | +12 STA, +10 STR | Flamewarden Gorrak |
| Cindermaw Legguards | Legs | 24 | +20 STA, +14 STR | Pyroclast |

**Full Set Stats (5/5):**
- +680 Armor total
- +87 Stamina
- +61 Strength
- +30 Fire Resistance
- +8 Block Rating
- +10 Parry Rating
- +10 Defense Rating
- +6 Hit Rating

---

### 4.2 Serpentscale Vestments (Leather Healer Set, Level 20-25)

> **Source:** Serpent's Lament dungeon bosses
> **Classes:** Druid
> **Theme:** Nature-infused serpent scales

#### Set Bonuses
| Pieces | Bonus |
|--------|-------|
| 2 | +8 MP5 (mana per 5 seconds) |
| 3 | +3% healing done |
| 5 | Your heals have 10% chance to restore 50 mana |

#### Set Pieces

##### Serpentscale Hood (Head)
```yaml
slot: head
type: leather
itemLevel: 23
rarity: rare
requiredLevel: 20
setId: serpentscale_vestments

stats:
  armor: 180
  intellect: 16
  spirit: 14
  spellPower: 18

dropSource: "Lady Anacondria"
dropChance: 18%

visualHints:
  theme: nature
  material: leather
  accent: emerald
```

##### Serpentscale Spaulders (Shoulders)
```yaml
slot: shoulders
type: leather
itemLevel: 22
rarity: rare
requiredLevel: 19
setId: serpentscale_vestments

stats:
  armor: 160
  intellect: 12
  spirit: 12
  mp5: 4

dropSource: "Viper Lord Sethrix"
dropChance: 20%

visualHints:
  theme: nature
  material: leather
  accent: emerald
```

##### Serpentscale Tunic (Chest)
```yaml
slot: chest
type: leather
itemLevel: 25
rarity: rare
requiredLevel: 22
setId: serpentscale_vestments

stats:
  armor: 220
  intellect: 20
  spirit: 18
  spellPower: 25
  natureResistance: 10

dropSource: "Verdan the Ever-Living"
dropChance: 15%

visualHints:
  theme: nature
  material: leather
  accent: emerald
  glow: dim
```

##### Serpentscale Gloves (Hands)
```yaml
slot: hands
type: leather
itemLevel: 21
rarity: rare
requiredLevel: 18
setId: serpentscale_vestments

stats:
  armor: 140
  intellect: 10
  spirit: 10
  critRating: 8

dropSource: "Pythonas the Dreamer"
dropChance: 22%

visualHints:
  theme: nature
  material: leather
  accent: emerald
```

##### Serpentscale Leggings (Legs)
```yaml
slot: legs
type: leather
itemLevel: 24
rarity: rare
requiredLevel: 21
setId: serpentscale_vestments

stats:
  armor: 200
  intellect: 18
  spirit: 15
  spellPower: 20
  mp5: 5

dropSource: "Verdan the Ever-Living"
dropChance: 18%

visualHints:
  theme: nature
  material: leather
  accent: emerald
```

---

### 4.3 Future Sets (Planned)

| Set Name | Type | Level | Classes | Source |
|----------|------|-------|---------|--------|
| Deadmines Defiance | Mail DPS | 18-22 | Hunter, Shaman | The Deadmines |
| Shadowfang Regalia | Cloth DPS | 22-26 | Mage, Warlock | Shadowfang Keep |
| Scarlet Crusade | Plate DPS | 28-32 | Warrior, Paladin | Scarlet Monastery |
| Wildheart | Leather Feral | 55-60 | Druid | Pre-Raid Dungeons |
| Lightforge | Plate Holy | 55-60 | Paladin | Pre-Raid Dungeons |
| Shadowcraft | Leather Melee | 55-60 | Rogue | Pre-Raid Dungeons |

<!-- TODO: Define remaining T1 sets for each class -->

---

## 5. Epic Items (Level 45-60)

### 5.1 Pre-Raid Epic Weapons

#### Blade of the Fallen Champion
```yaml
slot: mainHand
type: sword
itemLevel: 55
rarity: epic
requiredLevel: 50

stats:
  minDamage: 85
  maxDamage: 128
  speed: 2.6
  strength: 22
  stamina: 18
  critRating: 15

specialEffect:
  name: "Champion's Fury"
  type: proc
  chance: 8%
  effect: "Your next attack deals 150% damage"
  duration: 10s

visualHints:
  theme: royal
  material: darksteel
  accent: sapphire
  glow: dim
```

#### Shadowstrike Dagger
```yaml
slot: mainHand
type: dagger
itemLevel: 52
rarity: epic
requiredLevel: 48
classRestriction: [rogue]

stats:
  minDamage: 45
  maxDamage: 85
  speed: 1.4
  agility: 28
  critRating: 20
  hitRating: 12

specialEffect:
  name: "Shadow Strike"
  type: proc
  chance: 10%
  effect: "Deal 100 shadow damage and heal for 50% of damage dealt"

visualHints:
  theme: shadow
  material: darksteel
  accent: onyx
  glow: faint
```

#### Staff of Arcane Dominion
```yaml
slot: twoHand
type: staff
itemLevel: 58
rarity: epic
requiredLevel: 53
classRestriction: [mage, warlock]

stats:
  minDamage: 95
  maxDamage: 145
  speed: 3.0
  intellect: 45
  spellPower: 65
  spirit: 22
  critRating: 18

specialEffect:
  name: "Arcane Surge"
  type: onUse
  cooldown: 120s
  effect: "Increase spell power by 150 for 15 seconds"

visualHints:
  theme: arcane
  material: crystal
  accent: amethyst
  glow: bright
  particles: sparkles
```

#### Truthseeker's Mace
```yaml
slot: mainHand
type: mace
itemLevel: 54
rarity: epic
requiredLevel: 49
classRestriction: [paladin, priest]

stats:
  minDamage: 60
  maxDamage: 112
  speed: 2.4
  intellect: 25
  spellPower: 42
  spirit: 20
  stamina: 15

specialEffect:
  name: "Divine Truth"
  type: proc
  chance: 5%
  effect: "Your next heal is increased by 25%"
  duration: 15s

visualHints:
  theme: holy
  material: gold
  accent: diamond
  glow: bright
```

### 5.2 Pre-Raid Epic Armor

#### Dragonscale Breastplate
```yaml
slot: chest
type: plate
itemLevel: 56
rarity: epic
requiredLevel: 51
classRestriction: [warrior, paladin]

stats:
  armor: 850
  strength: 28
  stamina: 35
  critRating: 18

specialEffect:
  name: "Dragonscale Shield"
  type: proc
  chance: 10%
  effect: "Absorb 200 damage when struck"
  duration: 8s

visualHints:
  theme: dragon
  material: darksteel
  accent: ruby
  glow: dim
```

#### Robes of the Archmage
```yaml
slot: chest
type: cloth
itemLevel: 55
rarity: epic
requiredLevel: 50
classRestriction: [mage, warlock, priest]

stats:
  armor: 180
  intellect: 38
  spellPower: 55
  spirit: 25
  critRating: 15

specialEffect:
  name: "Arcane Resilience"
  type: passive
  effect: "+5% mana regeneration in combat"

visualHints:
  theme: arcane
  material: cloth
  accent: sapphire
  glow: dim
```

#### Stalker's Leather Helm
```yaml
slot: head
type: leather
itemLevel: 53
rarity: epic
requiredLevel: 48
classRestriction: [rogue, druid]

stats:
  armor: 280
  agility: 32
  stamina: 20
  critRating: 22
  hitRating: 10

specialEffect:
  name: "Predator's Sight"
  type: passive
  effect: "+2% critical strike damage"

visualHints:
  theme: beast
  material: leather
  accent: emerald
```

#### Windstrider Boots
```yaml
slot: feet
type: mail
itemLevel: 50
rarity: epic
requiredLevel: 45
classRestriction: [hunter, shaman]

stats:
  armor: 380
  agility: 24
  stamina: 18
  critRating: 16
  hasteRating: 12

specialEffect:
  name: "Wind Walk"
  type: passive
  effect: "Activity completion time reduced by 2%"

visualHints:
  theme: wind
  material: bronze
  accent: sapphire
```

### 5.3 Pre-Raid Epic Accessories

#### Amulet of the Undying
```yaml
slot: neck
itemLevel: 54
rarity: epic
requiredLevel: 49

stats:
  stamina: 28
  spirit: 18
  critRating: 12

specialEffect:
  name: "Undying Will"
  type: proc
  chance: 5%
  effect: "When struck below 20% health, heal for 500 HP"
  cooldown: 300s

visualHints:
  theme: death
  material: bone
  accent: onyx
  glow: faint
```

#### Signet of the Arcane Council
```yaml
slot: ring
itemLevel: 52
rarity: epic
requiredLevel: 47
classRestriction: [mage, warlock, priest]

stats:
  intellect: 20
  spellPower: 28
  critRating: 14

specialEffect:
  name: "Arcane Attunement"
  type: passive
  effect: "+3% spell critical strike chance"

visualHints:
  theme: arcane
  material: gold
  accent: amethyst
  glow: dim
```

#### Warlord's Signet
```yaml
slot: ring
itemLevel: 52
rarity: epic
requiredLevel: 47
classRestriction: [warrior, paladin, rogue]

stats:
  strength: 18
  stamina: 15
  attackPower: 32
  critRating: 12

specialEffect:
  name: "Battle Rage"
  type: proc
  chance: 8%
  effect: "+50 attack power for 10 seconds on critical strike"

visualHints:
  theme: war
  material: darksteel
  accent: ruby
```

#### Talisman of Primal Forces
```yaml
slot: trinket
itemLevel: 55
rarity: epic
requiredLevel: 50

stats:
  stamina: 20

specialEffect:
  name: "Primal Surge"
  type: onUse
  cooldown: 180s
  effect: "Increase primary stat by 100 for 20 seconds"

visualHints:
  theme: nature
  material: bone
  accent: emerald
  glow: bright
```

---

## 6. Legendary Items

### 6.1 World Drops

<!-- TODO: Define rare world-drop legendaries -->

### 6.2 Raid Drops

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
