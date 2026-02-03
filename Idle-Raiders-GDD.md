# Idle Raiders - Comprehensive Game Design Document

**Version:** 1.0  
**Date:** February 1, 2026  
**Document Type:** Game Design Document (GDD)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Concept](#core-concept)
3. [Gameplay Loop](#gameplay-loop)
4. [Character Systems](#character-systems)
5. [Combat Mechanics](#combat-mechanics)
6. [Progression Systems](#progression-systems)
7. [Content Structure](#content-structure)
8. [UI/UX Design](#uiux-design)
9. [Monetization & Retention](#monetization--retention)
10. [Technical Considerations](#technical-considerations)

---

## Executive Summary

**Idle Raiders** is a menu-based, offline incremental/idle game that captures the core progression and satisfaction of classic MMORPGs (World of Warcraft Classic, EverQuest) while removing the time-intensive tedium. Inspired by the relationship between Melvor Idle and RuneScape, Idle Raiders translates the WoW experience into an accessible, progress-focused idle format.

**Core Appeal:**
- MMORPG progression without the grind commitment
- Fully offline functionality with meaningful AFK advancement
- Deep character customization through classes, talents, and equipment
- Endgame dungeon and raid content with rare loot chase

**Target Audience:** 
- Former/current MMORPG players seeking nostalgia without time commitment
- Incremental game enthusiasts who enjoy deep systems
- Players aged 25-45 with limited gaming time

---

## Core Concept

### Vision Statement

"Experience the thrill of MMORPG progression—leveling, gearing, raiding—distilled into an accessible idle format that respects your time while delivering satisfying advancement."

### Inspiration Analysis

**From World of Warcraft Classic:**
- Class fantasy and identity
- Talent tree customization
- Attribute-based character building
- Dungeon/raid progression structure
- Equipment rarity tiers (Common → Legendary)
- Resource systems (Rage, Mana, Energy)

**From Melvor Idle:**
- Menu-driven interface
- Offline progress tracking (up to 18-24 hours)
- Skill-based progression with mastery systems
- Combat automation with strategic setup
- Equipment slot system
- Clear numerical progression

**Unique Differentiators:**
- Focus on WoW-style combat simulation vs. RuneScape-style skilling
- Deep talent tree systems (3 trees per class)
- Raid-tier progression as primary endgame
- Classic MMORPG attribute scaling formulas

---

## Gameplay Loop

### Core Loop Structure

```
┌─────────────────────────────────────┐
│   SELECT ACTIVITY                   │
│   (Quest/Dungeon/Raid)              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   AUTOMATED COMBAT                  │
│   (Time-based simulation)           │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   EARN REWARDS                      │
│   (XP, Gold, Equipment)             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   UPGRADE CHARACTER                 │
│   (Equip Gear, Spend Talents)       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   UNLOCK NEW CONTENT                │
│   (Higher Dungeons/Raids)           │
└──────────┬──────────────────────────┘
           │
           └─────────────┐
                         │
                         ▼
             ┌──────────────────────┐
             │  RETURN TO START     │
             └──────────────────────┘
```

### Session Flow

**Early Game (Levels 1-20):**
- 3-5 minute active sessions
- Quest-based leveling
- Frequent equipment upgrades
- Tutorial talent points
- Simple combat encounters

**Mid Game (Levels 20-60):**
- 10-15 minute check-ins
- Zone-based questing
- First dungeon experiences
- Talent specialization decisions
- Resource management learning

**Endgame (Level 60+):**
- 15-30 minute sessions (dungeon runs)
- Raid attempts (30-60 minutes each)
- Equipment optimization
- Achievement hunting
- Prestige/alternate character options

### Offline Progression

**Offline Mechanics:**
- Maximum 18-24 hours of accumulated progress
- Combat continues with last selected activity
- Auto-loot collection
- Death protection: Combat stops on player death (requires manual restart)
- Condensed combat log available on return

**Online Benefits:**
- Real-time progress monitoring
- Manual potion use and emergency actions
- Ability to switch activities mid-completion
- Achievement notifications
- Social features (future expansion)

---

## Character Systems

### Class Design Philosophy

Each class should feel distinct with clear strengths, resource management styles, and scaling patterns that mirror WoW Classic while functioning in an idle format.

### Class Roster

#### 1. Warrior

**Identity:** Frontline melee DPS/Tank with rage-based resource management

**Primary Attributes:**
- Strength: 1 STR = 2.0 Melee Attack Power
- Stamina: 1 STA = 10 Health
- Agility: 1 AGI = 0.05% Melee Crit

**Resource:** Rage (0-100)
- Generates 2-5 rage per auto-attack based on weapon speed
- Rage decays at 1 per second outside combat
- Abilities consume rage

**Armor Type:** Plate (highest armor values)

**Starting Stats (Level 1):**
- Health: 100
- Rage: 0/100
- Strength: 20
- Stamina: 18
- Agility: 10
- Intellect: 8

**Talent Trees:**
1. **Arms** (Two-Handed DPS)
   - Focus: Burst damage, mortal strike mechanics
   - Key Talents: Mortal Strike, Sweeping Strikes, Improved Execute
   
2. **Fury** (Dual-Wield DPS)
   - Focus: Sustained DPS, frenzy mechanics
   - Key Talents: Bloodthirst, Flurry, Enrage
   
3. **Protection** (Tanking)
   - Focus: Survival, threat generation
   - Key Talents: Shield Slam, Last Stand, Defiance

#### 2. Paladin

**Identity:** Holy warrior with versatile roles (Tank/DPS/Heal)

**Primary Attributes:**
- Strength: 1 STR = 1.5 Melee Attack Power (Ret/Prot)
- Intellect: 1 INT = 15 Mana, 1.0 Spell Power, 0.02% Spell Crit
- Stamina: 1 STA = 10 Health

**Resource:** Mana (base 100 + INT × 15)
- Regenerates based on Spirit (5% of max mana per 5 seconds)
- Abilities consume mana

**Armor Type:** Plate

**Starting Stats (Level 1):**
- Health: 90
- Mana: 130
- Strength: 16
- Stamina: 15
- Agility: 8
- Intellect: 13

**Talent Trees:**
1. **Holy** (Healing)
   - Focus: Healing output, mana efficiency
   - Key Talents: Holy Shock, Divine Favor, Illumination
   
2. **Protection** (Tanking)
   - Focus: Blocking, holy threat generation
   - Key Talents: Holy Shield, Blessing of Sanctuary, Reckoning
   
3. **Retribution** (Melee DPS)
   - Focus: Melee burst, judgment mechanics
   - Key Talents: Seal of Command, Vengeance, Repentance

#### 3. Hunter

**Identity:** Ranged physical DPS with pet companion

**Primary Attributes:**
- Agility: 1 AGI = 2.0 Ranged Attack Power, 0.1% Ranged Crit
- Intellect: 1 INT = 15 Mana, 0.5 Spell Power (for arcane shot, etc.)
- Stamina: 1 STA = 10 Health

**Resource:** Mana (base 100 + INT × 15)
- Regenerates based on Spirit
- Aspect management affects regeneration

**Armor Type:** Mail (Level 40+), Leather (pre-40)

**Starting Stats (Level 1):**
- Health: 80
- Mana: 145
- Strength: 10
- Stamina: 13
- Agility: 22
- Intellect: 13

**Pet System:**
- Pet contributes 30-40% of total DPS
- Pet has own happiness/loyalty system (simplified for idle)
- Pet abilities learned through taming different beasts

**Talent Trees:**
1. **Beast Mastery** (Pet-focused)
   - Focus: Pet damage and utility
   - Key Talents: Bestial Wrath, Intimidation, Frenzy
   
2. **Marksmanship** (Ranged DPS)
   - Focus: Critical strikes, aimed shot
   - Key Talents: Aimed Shot, Trueshot Aura, Mortal Shots
   
3. **Survival** (Utility/Traps)
   - Focus: Sustained damage, traps, melee
   - Key Talents: Lacerate, Wyvern Sting, Lightning Reflexes

#### 4. Rogue

**Identity:** Stealth melee DPS with combo point finishers

**Primary Attributes:**
- Agility: 1 AGI = 1.8 Melee Attack Power, 0.1% Melee Crit
- Strength: 1 STR = 0.8 Melee Attack Power
- Stamina: 1 STA = 10 Health

**Resource:** Energy (100 max)
- Regenerates 10 energy per second
- Combo Points (0-5) built through builders, spent on finishers

**Armor Type:** Leather

**Starting Stats (Level 1):**
- Health: 75
- Energy: 100/100
- Strength: 12
- Stamina: 12
- Agility: 24
- Intellect: 8

**Talent Trees:**
1. **Assassination** (Dagger DPS)
   - Focus: Poison damage, critical finishers
   - Key Talents: Mutilate, Seal Fate, Vigor
   
2. **Combat** (Sword/Fist DPS)
   - Focus: Sustained combat, blade flurry
   - Key Talents: Blade Flurry, Adrenaline Rush, Sword Specialization
   
3. **Subtlety** (Stealth/Control)
   - Focus: Ambush, stealth bonuses
   - Key Talents: Hemorrhage, Premeditation, Preparation

#### 5. Priest

**Identity:** Cloth caster specializing in healing with shadow DPS option

**Primary Attributes:**
- Intellect: 1 INT = 15 Mana, 1.2 Spell Power, 0.03% Spell Crit
- Spirit: Affects mana regeneration and some healing
- Stamina: 1 STA = 10 Health

**Resource:** Mana (base 100 + INT × 15)
- High Spirit increases regeneration
- Five-Second Rule applies (regeneration pauses 5s after casting)

**Armor Type:** Cloth

**Starting Stats (Level 1):**
- Health: 70
- Mana: 175
- Strength: 8
- Stamina: 11
- Agility: 8
- Intellect: 25

**Talent Trees:**
1. **Discipline** (Support/Shield)
   - Focus: Damage prevention, mana efficiency
   - Key Talents: Power Infusion, Inner Focus, Pain Suppression
   
2. **Holy** (Pure Healing)
   - Focus: Healing throughput, group healing
   - Key Talents: Circle of Healing, Lightwell, Spiritual Healing
   
3. **Shadow** (DPS)
   - Focus: DOT damage, Shadow Form
   - Key Talents: Shadowform, Mind Flay, Vampiric Embrace

#### 6. Mage

**Identity:** Glass cannon caster with extreme burst damage

**Primary Attributes:**
- Intellect: 1 INT = 15 Mana, 1.5 Spell Power, 0.03% Spell Crit
- Stamina: 1 STA = 10 Health

**Resource:** Mana (base 100 + INT × 15)
- Evocation ability restores mana
- Mana Gems provide emergency mana

**Armor Type:** Cloth

**Starting Stats (Level 1):**
- Health: 65
- Mana: 190
- Strength: 7
- Stamina: 10
- Agility: 7
- Intellect: 26

**Talent Trees:**
1. **Arcane** (Mana/Utility)
   - Focus: Mana management, arcane power
   - Key Talents: Arcane Power, Presence of Mind, Arcane Mind
   
2. **Fire** (Burst Damage)
   - Focus: Critical strikes, combustion
   - Key Talents: Combustion, Pyroblast, Ignite
   
3. **Frost** (Control/Consistent DPS)
   - Focus: Slows, shatter combos
   - Key Talents: Ice Barrier, Shatter, Cold Snap

#### 7. Druid

**Identity:** Shapeshifting hybrid with four role options

**Primary Attributes:**
- Strength: 1 STR = 1.5 Melee Attack Power (Bear/Cat form)
- Agility: 1 AGI = 1.2 Melee Attack Power (Cat), 0.08% Crit
- Intellect: 1 INT = 15 Mana, 1.2 Spell Power, 0.02% Spell Crit
- Stamina: 1 STA = 10 Health (multiplied in Bear form by 2.0)

**Resource:** Mana (base 100 + INT × 15)
- Bear Form: Rage (same as Warrior)
- Cat Form: Energy (same as Rogue)

**Armor Type:** Leather

**Starting Stats (Level 1):**
- Health: 80
- Mana: 160
- Strength: 14
- Stamina: 14
- Agility: 14
- Intellect: 16

**Talent Trees:**
1. **Balance** (Caster DPS)
   - Focus: Nature/Arcane spells, moonkin form
   - Key Talents: Moonkin Form, Starfire, Nature's Grace
   
2. **Feral Combat** (Melee/Tank)
   - Focus: Cat DPS or Bear tanking
   - Key Talents: Leader of the Pack, Mangle, Heart of the Wild
   
3. **Restoration** (Healing)
   - Focus: HOT healing, tree of life
   - Key Talents: Tree of Life, Swiftmend, Nature's Swiftness

---

### Hunter Pet System

The Hunter class features a unique pet companion system that provides 30-40% of total DPS and offers strategic choices for different content types.

#### Pet Acquisition

**Taming Process:**
- Hunters learn "Tame Beast" at level 10
- Taming requires channeling for 20 seconds while the beast attacks
- Pet level cannot exceed Hunter level
- Taming higher-level beasts has lower success rate

**Pet Stable:**
- 2 active pet slots (switchable outside combat)
- 3 stable slots for storing additional pets
- Stable Master NPCs in major cities
- Premium: +2 stable slots purchasable

#### Pet Families

Each pet family has unique abilities and stat distributions.

**Ferocity Pets (DPS-focused):**

| Family | Special Ability | Stats | Taming Locations |
|--------|-----------------|-------|------------------|
| Cat | Prowl (stealth opener) | High AGI, Low STA | Silverleaf Glade, Shadowmere Woods |
| Raptor | Savage Rend (+bleed) | High STR, Med AGI | Bonedust Barrens, Razorthorn Gulch |
| Wolf | Furious Howl (+AP buff) | Balanced | Ashford Plains, Stormridge Mountains |
| Bat | Screech (-AP debuff) | Med AGI, High Speed | Dreadhollow Manor, Thornbarrow Crypt |
| Ravager | Gore (+armor pen) | Very High STR | Hive of the Swarm-God (raid) |

**Tenacity Pets (Tank-focused):**

| Family | Special Ability | Stats | Taming Locations |
|--------|-----------------|-------|------------------|
| Bear | Swipe (AoE threat) | High STA, High Armor | Stormridge Mountains, Emberveil Peaks |
| Boar | Charge (+threat) | Med STA, Med STR | Ashford Plains, Desolation Flats |
| Turtle | Shell Shield (50% DR) | Very High Armor | Drowned Temple, coastal zones |
| Gorilla | Thunderstomp (AoE) | High STA, Med STR | Serpent's Lament |
| Crab | Pin (root) | High Armor, Low Speed | Coastal zones |

**Cunning Pets (Utility-focused):**

| Family | Special Ability | Stats | Taming Locations |
|--------|-----------------|-------|------------------|
| Spider | Web (root) | Med AGI, Med STA | Necropolis Academy, caves |
| Serpent | Poison Spit (DoT) | Med AGI | Serpent's Lament, Serpentshrine Temple |
| Bird of Prey | Snatch (disarm) | High AGI, Low STA | Mountains, high zones |
| Hyena | Tendon Rip (slow) | Balanced | Scorchwind Canyon |
| Wind Serpent | Lightning Breath (nature) | High INT scaling | Sandscar Ruins |

#### Pet Stats & Scaling

**Base Stats (Level 60 Pet):**
```
Health = 1,800 + (Pet Level × 50) + (Hunter STA × 0.3)
Armor = Base Family Armor + (Hunter Armor × 0.35)
Attack Power = 120 + (Hunter RAP × 0.22)
Damage = Pet AP / 14 × Attack Speed
```

**Pet Stat Inheritance:**
| Stat | Inheritance Rate |
|------|------------------|
| Stamina | 30% of Hunter |
| Armor | 35% of Hunter |
| Attack Power | 22% of Hunter RAP |
| Resistances | 40% of Hunter |
| Hit/Crit | 100% of Hunter |

**Pet Scaling by Family:**
| Family Type | Health | Armor | Damage |
|-------------|--------|-------|--------|
| Ferocity | 85% | 85% | 110% |
| Tenacity | 110% | 120% | 90% |
| Cunning | 95% | 95% | 100% |

#### Pet Abilities

**Universal Abilities (All Pets):**

| Ability | Rank | Effect | Training Cost |
|---------|------|--------|---------------|
| Growl | 1-8 | Generates threat, taunts target | Free (auto-learned) |
| Cower | 1-8 | -30% threat for 6s | 10 TP |
| Dash/Dive | 1-3 | +80% speed for 15s | 15 TP |
| Bite | 1-9 | Instant damage (Focus cost) | 15 TP |
| Claw | 1-9 | Instant damage (lower Focus cost) | 15 TP |

**Focus System:**
- Pets have 100 Focus (like Energy)
- Regenerates at 5 Focus/second
- Abilities cost 25-35 Focus
- Special abilities cost 50+ Focus

**Family-Specific Abilities:**

| Family | Ability | Rank | Effect |
|--------|---------|------|--------|
| Cat | Prowl | 1-3 | Stealth, +20/40/60% opener damage |
| Wolf | Furious Howl | 1-4 | Party +45/60/75/90 AP for 10s |
| Bear | Swipe | 1-4 | AoE damage + threat |
| Boar | Charge | 1-6 | Rush + 50-120 damage + immobilize |
| Turtle | Shell Shield | 1 | -50% damage taken for 12s (2 min CD) |
| Spider | Web | 1-4 | Root target for 4/5/6/8s |
| Serpent | Poison Spit | 1-4 | Nature DoT, stacks 5x |
| Wind Serpent | Lightning Breath | 1-6 | Nature damage, scales with INT |
| Ravager | Gore | 1-3 | +10/20/30% armor penetration for 12s |

#### Pet Training & Leveling

**Pet Experience:**
- Pets gain XP equal to 50% of Hunter XP when active
- Pets cannot exceed Hunter level
- Stable pets do not gain XP
- Pet level affects stat scaling and ability ranks

**Training Points (TP):**
```
Training Points = Pet Level + Pet Loyalty Bonus
Loyalty Bonus: 0/5/10/15/20/25 TP based on loyalty level
```

**Ability Training:**
1. Hunter tames beast with desired ability
2. Hunter "learns" ability by using pet in combat (10 uses)
3. Hunter can teach ability to other pets using TP

**Pet Skill Tree (Simplified):**
```
├── Offense Branch (requires 0/5/10/15/20 TP spent)
│   ├── Improved Claw (5 ranks): +10% Claw damage per rank
│   ├── Improved Bite (5 ranks): +10% Bite damage per rank
│   ├── Spiked Collar (3 ranks): +3/6/9% pet damage
│   └── Avoidance (2 ranks): -25/50% AoE damage taken
│
├── Defense Branch
│   ├── Great Stamina (5 ranks): +4% HP per rank
│   ├── Natural Armor (5 ranks): +5% armor per rank
│   ├── Blood of the Rhino (1 rank): +20% healing received
│   └── Last Stand (1 rank): +30% HP for 20s (3 min CD)
│
└── Utility Branch
    ├── Cobra Reflexes (2 ranks): +15/30% attack speed, -15/30% damage
    ├── Lionhearted (2 ranks): -15/30% fear duration
    └── Improved Dash (2 ranks): -10/20s Dash cooldown
```

#### Pet Happiness & Loyalty

**Happiness Levels:**
| Level | Name | Damage Modifier | Icon |
|-------|------|-----------------|------|
| 1 | Unhappy | 75% damage | Red |
| 2 | Content | 100% damage | Yellow |
| 3 | Happy | 125% damage | Green |

**Happiness Decay:**
- Decreases by 1 point per minute in combat
- Decreases by 0.1 point per minute out of combat
- Feeding restores 10-35 happiness (based on food quality)
- Death reduces happiness by 50 points

**Feeding:**
| Pet Diet | Food Types | Happiness Restored |
|----------|------------|-------------------|
| Meat | Raw meat, fish | 10-35 |
| Fish | Fish, bread | 10-35 |
| Bread | Bread, fungus | 10-30 |
| Fungus | Mushrooms | 10-25 |
| Fruit | Fruit, vegetables | 10-30 |

**Loyalty Levels:**
| Level | Name | Requirement | Bonus |
|-------|------|-------------|-------|
| 1 | Rebellious | New pet | 0 TP, may flee |
| 2 | Unruly | 5 minutes happy | +5 TP |
| 3 | Submissive | 30 minutes happy | +10 TP |
| 4 | Dependable | 2 hours happy | +15 TP |
| 5 | Faithful | 6 hours happy | +20 TP |
| 6 | Best Friend | 12 hours happy | +25 TP |

*At Loyalty 1, pet may abandon Hunter if happiness reaches 0.*

#### Pet AI in Idle Combat

**Default Pet Behavior:**
```
Priority System:
1. IF Hunter targeting enemy AND no threat: Growl
2. IF pet HP < 30%: Cower (if enabled)
3. IF Focus > 50 AND special ability ready: Use special ability
4. IF Focus > 25: Bite/Claw
5. ELSE: Auto-attack

Defensive triggers:
- IF Hunter HP < 40%: Pet uses defensive cooldowns
- IF add spawns: Pet may switch targets (based on setting)
```

**Pet Commands (Player Settings):**
- **Aggressive**: Attack anything Hunter attacks
- **Defensive**: Attack only if Hunter or pet attacked
- **Passive**: Never attack unless commanded
- **Follow/Stay**: Movement behavior
- **Attack/Recall**: Direct target control

#### Pet in Dungeons & Raids

**Dungeon Content:**
- Pets contribute ~30% of Hunter DPS
- Tenacity pets can off-tank adds
- Pet death doesn't end run but reduces DPS significantly
- Revive Pet: 10s channel, 35% mana cost

**Raid Content:**
- Pets contribute ~25% of Hunter DPS (scaled down)
- Pet survivability crucial (AoE avoidance talents)
- Furious Howl (Wolf) provides raid-wide AP buff
- Pet assignment: DPS pet vs. off-tank utility

**Companion System Integration:**
- Hunter pets stack with NPC companions
- Pet counts as 0.5 companion for party size calculations
- In raids: Hunter + 4 companions + pet = 5.5 "units"

---

### Talent System Design

**Talent Point Acquisition:**
- 1 talent point per level from 10-60 = 51 total points
- Points can be spent in any of 3 trees
- Must spend at least 5 points per tier to unlock next tier
- Each tree has 7 tiers (5/10/15/20/25/30/35 points required)

**Talent Types:**

1. **Passive Talents** (Most common)
   - Example: "Increases Strength by 3/6/9/12/15%" (5 ranks)
   - Auto-applied when learned

2. **Active Ability Talents**
   - Example: "Mortal Strike" (single rank)
   - Adds new ability to rotation
   - AI uses optimally in idle combat

3. **Proc-Based Talents**
   - Example: "20% chance on crit to gain 10 rage"
   - Calculated during combat simulation

4. **Capstone Talents** (Tier 7)
   - Require 30+ points in tree
   - Powerful signature abilities
   - Define specialization identity

**Respeccing:**
- Cost: 1 Gold × (respecs completed)
- Maximum cost: 50 Gold
- Resets all talent points for redistribution
- Unlocked at level 10

**Talent UI:**
- Tree visualization showing prerequisites
- Show/hide unlearned talents option
- Talent calculator preview before spending
- Export/import talent builds (share codes)

---

## Combat Mechanics

### Combat Simulation Overview

Combat in Idle Raiders simulates classic MMORPG combat through calculated rounds processed over time. Unlike active combat, the system resolves all mechanics mathematically to determine outcomes.

### Time Structure

**Combat Rounds:**
- 1 Combat Round = 1 second of game time
- Auto-attacks occur based on weapon speed
- Abilities trigger on cooldown (handled by AI priority system)
- Periodic effects (DOTs, HOTs) tick per their intervals

**Combat Duration:**
- Quest mobs: 10-30 seconds average
- Dungeon trash: 30-60 seconds
- Dungeon bosses: 2-5 minutes
- Raid bosses: 5-15 minutes

### Core Combat Stats

**Offensive Stats:**

| Stat | Function | Scaling |
|------|----------|---------|
| Melee Attack Power | Increases physical melee damage | +1 Damage per 14 AP |
| Ranged Attack Power | Increases physical ranged damage | +1 Damage per 14 AP |
| Spell Power | Increases spell damage/healing | Varies by spell (coefficient) |
| Critical Strike Rating | % chance to deal 2x damage | Varies by class |
| Hit Rating | % chance to land attacks | 1% per 10 rating (level 60) |
| Haste Rating | Reduces cast time / attack speed | 10 rating = 1% haste |

**Defensive Stats:**

| Stat | Function | Scaling |
|------|----------|---------|
| Armor | Reduces physical damage taken | Damage × (Armor / (Armor + 400 + 85 × Level)) |
| Dodge | % chance to avoid attack | Base 5% + modifiers |
| Parry | % chance to deflect attack (melee) | Requires training |
| Block | % chance to reduce damage (shield) | 30% damage reduction when blocks |
| Spell Resistance | Reduces magical damage taken | Similar to armor formula |

**Resource Stats:**

| Resource | Base | Scaling |
|----------|------|---------|
| Health | 100 | +10 per Stamina point |
| Mana | 100 | +15 per Intellect point |
| Rage | 0 (100 max) | Generated by taking/dealing damage |
| Energy | 100 | Fixed, regenerates 10/second |

---

### Damage Calculation Formulas

#### Auto-Attack (White) Damage

**Formula:**
```
Base Damage = (Weapon Min/Max Damage + (Attack Power / 14 × Weapon Speed))
Armor Mitigation = 1 - (Target Armor / (Target Armor + 400 + 85 × Attacker Level))
Final Damage = Base Damage × Armor Mitigation × Other Modifiers
```

**Example Calculation:**
```
Weapon: 50-75 damage, 2.5 speed
Attack Power: 350
Random roll: 62.5 (average of range)

Base Damage = 62.5 + (350 / 14 × 2.5) = 62.5 + 62.5 = 125

Target Armor: 3000
Armor Mitigation = 1 - (3000 / (3000 + 400 + 85 × 60)) = 1 - (3000 / 8500) = 0.647

Final Damage = 125 × 0.647 = 80.88 ≈ 81 damage
```

**Attack Speed:**
```
Effective Attack Speed = Base Weapon Speed / (1 + (Haste% / 100))

Example: 2.5 speed weapon with 20% haste
= 2.5 / (1 + 0.20) = 2.5 / 1.2 = 2.08 seconds per swing
```

#### Ability (Yellow) Damage

**Direct Damage Ability Formula:**
```
Base Ability Damage = Tooltip Damage + (Attack Power × AP Coefficient)
or
Base Ability Damage = Tooltip Damage + (Spell Power × SP Coefficient)

Final Damage = Base Ability Damage × (1 - Armor/Resistance Mitigation) × Crit Modifier × Other Modifiers
```

**Spell Damage Example:**
```
Fireball: 400 base damage, 0.857 spell power coefficient
Spell Power: 500
Crit Multiplier: 1.5x

Base Damage = 400 + (500 × 0.857) = 400 + 428.5 = 828.5
Critical Hit: 828.5 × 1.5 = 1242.75

Target Spell Resistance: 150
Resistance Mitigation = 1 - (150 / (150 + 400 + 85 × 60)) = 0.973

Final Critical Fireball = 1242.75 × 0.973 = 1,209.4 damage
```

**Ability Coefficients by Type:**

| Ability Type | Typical Coefficient | Example |
|--------------|---------------------|---------|
| Instant Physical | 0.0 - 0.2 × AP | Mortal Strike: Base + 0.1 × AP |
| Instant Spell | 0.2 - 0.4 × SP | Shadow Word: Pain: Base + 0.3 × SP |
| Cast Time Spell (1.5s) | 0.57 × SP | Lightning Bolt |
| Cast Time Spell (3.0s) | 0.857 × SP | Fireball |
| DOT (full duration) | 1.0 × SP | Corruption (18s total) |
| HOT (full duration) | 1.0 × SP | Rejuvenation (12s total) |

#### Critical Strike Mechanics

**Critical Strike Chance:**
```
Base Crit Chance = Class Base + (Agility/Intellect × Conversion Rate) + Crit Rating + Talent Bonuses

Class Base Crit (Level 60):
- Warrior/Rogue: 5% (physical)
- Mage: 3% (spell)
- Hunter: 3.6% (ranged)
- Priest: 3% (spell)
- Paladin: 3.5% (melee), 1.8% (spell)
- Druid: 5% (feral), 3% (spell)

Attribute Conversion (approximate):
- Melee/Ranged: 1% crit per 20 Agility (varies by class)
- Spell: 1% crit per 30 Intellect (varies by class)
```

**Critical Strike Multiplier:**
- Base: 2.0x damage
- Modified by talents (e.g., Ruin for Warlocks: 2.5x)
- Modified by abilities (e.g., Impale for Warriors: +20% crit damage)

**Critical Strike in Idle Combat:**
```python
def calculate_crit_damage(base_damage, crit_chance, crit_multiplier):
    if random.random() < (crit_chance / 100):
        return base_damage * crit_multiplier
    return base_damage
```

#### Special Attack Results

**Attack Table (Priority Order):**
1. Miss (if Hit% < 100%)
2. Dodge (target's dodge%)
3. Parry (target's parry%, melee only, frontal)
4. Block (target's block%, shield users, reduces damage)
5. Critical Hit (attacker's crit%)
6. Normal Hit

**Miss Chance (vs. Same Level):**
- Melee: 9% base (5% with capped weapon skill)
- Ranged: 9% base (5% with capped weapon skill)
- Spell: 16% base (1% minimum with hit cap)

**Hit Cap Values (Level 60 vs Level 63 Boss):**
- Melee/Ranged: 9% hit needed to cap
- Spell: 16% hit needed to cap

**Glancing Blows (vs. Higher Level):**
- Occurs vs. mobs 3+ levels higher
- Penalty: 15-35% reduced damage (weapon skill dependent)
- Chance: 40% against bosses

#### Damage Over Time (DOT) Mechanics

**DOT Calculation:**
```
Total DOT Damage = Base Damage + (Spell Power × Coefficient)
Tick Damage = Total DOT Damage / Number of Ticks
Tick Interval = 3 seconds (standard)

Example: Corruption (18 second duration)
Base: 900 damage
Spell Power: 400
Coefficient: 1.0 (full duration)

Total Damage = 900 + (400 × 1.0) = 1,300 damage over 18 seconds
Ticks: 6 ticks (18s / 3s per tick)
Per Tick: 1,300 / 6 = 216.67 damage per tick
```

**DOT Snapshotting:**
- DOTs snapshot stats when cast (buffs, debuffs, spell power at cast time)
- Refreshing early combines remaining damage + new application
- Critical ticks possible (separate roll per tick)

---

### Healing Mechanics

**Healing Formula:**
```
Base Healing = Tooltip Healing + (Spell Power × Coefficient)
Final Healing = Base Healing × (1 + Healing Taken Modifiers)
Overheal = Healing that exceeds max health (wasted)
```

**Healing Coefficients:**
- Instant Heals: 0.15 - 0.3 × SP
- 1.5s Cast Heals: 0.57 × SP
- 2.5s Cast Heals: 0.714 × SP
- HOTs (full duration): 1.0 × SP

**Healing Critical Strikes:**
- Healing can critically heal for 1.5x (2.0x with talents)
- Based on Spell Crit chance
- Overheal from crits still counts as wasted

**Efficient Healing AI Priority (Idle Mode):**
1. Use HOTs if damage is predictable and sustained
2. Use fast heals if health drops below 40%
3. Use efficient large heals if health between 40-80%
4. Reserve instant heals for emergencies (<30% health)

---

### Threat Mechanics (For Tank Roles)

Threat determines which character enemies attack. In idle combat, the threat system runs automatically with AI managing tank rotations and DPS throttling.

#### Threat Generation Formula

**Base Threat Calculation:**
```
Threat = (Damage × DamageModifier) + (Healing × HealingModifier) + FlatThreat

Where:
- DamageModifier = Stance/Form modifier
- HealingModifier = 0.5 (healing generates 50% of amount as threat)
- FlatThreat = Bonus threat from abilities
```

**Stance/Form Threat Modifiers:**

| Stance/Form | Threat Modifier | Class |
|-------------|-----------------|-------|
| Defensive Stance | 1.30x | Warrior |
| Berserker Stance | 0.80x | Warrior |
| Battle Stance | 1.00x | Warrior |
| Bear Form | 1.30x | Druid |
| Cat Form | 0.71x | Druid |
| Righteous Fury (active) | 1.60x | Paladin |
| Shadowform | 0.70x | Priest |
| Subtlety talents | 0.70-0.80x | Rogue |
| Fade (temporary) | -threat | Priest |

**High-Threat Abilities:**

| Ability | Threat | Class |
|---------|--------|-------|
| Sunder Armor | Damage + 260 | Warrior |
| Shield Slam | Damage + 250 | Warrior |
| Heroic Strike | Damage + 175 | Warrior |
| Revenge | Damage + 315 | Warrior |
| Taunt | Sets threat to highest + 10% | Warrior |
| Maul | Damage × 1.75 | Druid |
| Swipe | Damage + 180 (AoE) | Druid |
| Growl | Sets threat to highest + 10% | Druid |
| Holy Shield | Damage + 130 per block | Paladin |
| Consecration | Damage + 90 per tick | Paladin |
| Righteous Defense | Transfers threat | Paladin |

**Threat Reduction Abilities:**

| Ability | Effect | Class |
|---------|--------|-------|
| Fade | -threat (temporary, 10s) | Priest |
| Feign Death | -100% threat (if successful) | Hunter |
| Vanish | -100% threat | Rogue |
| Soulshatter | -50% threat | Warlock |
| Invisibility | -100% threat | Mage |
| Cower (Pet) | -30% pet threat | Hunter |

---

#### Threat Decay & Management

**Threat Decay Over Time:**
```
Out of Combat: Threat resets to 0 after 6 seconds
In Combat: No natural decay (threat persists)
Target Death: Threat on that target resets
```

**Threat Transfer (Adds/Switches):**
- New enemies start with 0 threat on all combatants
- First damage/heal generates initial threat
- Tanks should use high-threat abilities immediately on new adds

**Aggro Threshold:**
```
Melee Range: Must exceed current target's threat by 10% to pull aggro
Ranged: Must exceed current target's threat by 30% to pull aggro

Formula: RequiredThreat = CurrentTankThreat × (1 + AggroThreshold)
```

---

#### Idle Combat Threat Simulation

**AI Threat Management:**

The idle combat AI handles threat automatically with configurable behavior:

**Tank AI Priority:**
```
1. IF new add spawns: Taunt or high-threat ability immediately
2. IF threat < 110% of next highest: Use threat ability
3. IF threat > 150% of next highest: Can use DPS abilities
4. IF multiple mobs: Rotate threat abilities across targets
5. Default: Auto-attack + threat rotation
```

**DPS AI Throttling:**
```
1. IF threat > 90% of tank: Reduce damage output by 20%
2. IF threat > 100% of tank: Use threat reduction ability
3. IF threat > 110% of tank: Stop attacking for 2 seconds
4. IF threat reduction on CD: Continue at 50% damage
```

**Healer AI Threat Management:**
```
1. Spread healing across targets to distribute threat
2. Use Fade/threat reduction proactively before big heals
3. Pre-HoT before combat to bank threat early
4. If aggro: Stop casting, wait for tank taunt
```

---

#### Threat Display in Combat Log

**Real-Time Threat Meter:**
```
┌─────────────────────────────────────┐
│ THREAT METER                        │
├─────────────────────────────────────┤
│ Thrognar (Tank) ████████████ 100%   │
│ Elindra (Mage)  ██████░░░░░  58%    │
│ Kira (Rogue)    █████░░░░░░  47%    │
│ Seraphine (Heal)███░░░░░░░░  32%    │
└─────────────────────────────────────┘
```

**Threat Events in Log:**
```
[00:15] Thrognar uses Shield Slam (2,450 threat)
[00:16] Elindra's Fireball crits! (1,850 threat) ⚠️ HIGH THREAT
[00:17] Elindra uses Invisibility (-100% threat)
[00:18] Boss targets Kira! Thrognar uses Taunt
[00:19] Threat stabilized - Tank has aggro
```

---

#### Threat Failure Consequences

**Threat Loss Scenarios:**

| Scenario | Consequence | Prevention |
|----------|-------------|------------|
| DPS pulls aggro | DPS takes damage (survival check) | Throttle DPS |
| Healer pulls aggro | Healer takes damage | Fade, tank taunt |
| Tank dies | Wipe (run fails) | Heal priority |
| Add not picked up | Random target attacked | AoE threat |

**Threat Management Score:**
```
Score = (Time tank held aggro / Total combat time) × 100

90-100%: Excellent - No damage to non-tanks
70-89%: Good - Minor damage to DPS
50-69%: Poor - Significant damage to party
<50%: Failure - High chance of wipe
```

**Idle Combat Success Modifier:**
```
If ThreatScore < 70%:
  SuccessRate = BaseSuccessRate × (ThreatScore / 100)

Example: 95% success rate with 60% threat score = 57% actual success
```

---

#### Threat Talents & Gear

**Tank Threat Talents:**

| Talent | Effect | Class |
|--------|--------|-------|
| Defiance | +3/6/9/12/15% threat | Warrior |
| Improved Righteous Fury | +16/33/50% threat | Paladin |
| Feral Instinct | +15/30/45% Swipe damage | Druid |

**Threat-Related Stats:**

| Stat | Effect |
|------|--------|
| Hit Rating | Missed attacks = 0 threat |
| Expertise | Dodged/parried attacks = 0 threat |
| Block Value | Increases Holy Shield threat |
| Spell Power | Increases Consecration threat |

**Threat Gear Examples:**

| Item | Stats | Effect |
|------|-------|--------|
| Onslaught Girdle | +2% threat | Threat boost |
| Sapphiron's Scale Boots | -2% threat | Threat reduction |
| Fetish of the Sand Reaver | +threat on use | Burst threat |

---

### AI Combat Priority System

Since combat is idle/automated, each class needs an optimized ability rotation handled by AI.

**Priority System Structure:**
```
1. Resource Builders (if resource < 40%)
2. Resource Spenders (if resource > 80% or boss < 20%)
3. Cooldowns (if available and optimal)
4. Filler Abilities (if nothing else)
5. Auto-Attack (always occurs)
```

**Example: Warrior (Arms) Priority:**
```
1. IF Rage < 30: Continue auto-attacking (builds rage)
2. IF Target Health < 20%: Execute (if rage > 15)
3. IF Mortal Strike off cooldown AND Rage > 30: Mortal Strike
4. IF Overpower procced: Overpower
5. IF Rage > 80: Heroic Strike (rage dump)
6. ELSE: Auto-attack
```

**Example: Mage (Fire) Priority:**
```
1. IF Combustion off cooldown: Combustion → Fireball chain
2. IF Fireball cast time remaining: Continue casting
3. IF Target lacks Scorch debuff: Scorch
4. IF Mana > 70%: Fireball
5. IF Mana < 30%: Evocation (if off cooldown)
6. ELSE: Scorch (cheaper filler)
```

**Player Controls (Even During Idle):**
- Set ability priority order (advanced option)
- Toggle cooldown usage (use/save for bosses)
- Potion thresholds (health %, mana %)
- Combat stop conditions (health < X%, mobs remaining < Y)

---

### Combat Results & Rewards

**Victory Conditions:**
- Player health > 0 at end
- All enemies defeated
- Special objectives completed (dungeon-specific)

**Defeat Conditions:**
- Player health reaches 0
- Enrage timer expires (raid bosses)
- Fail boss mechanic (simulated)

**Experience Calculation:**
```
Base XP = Mob Level × 45 + (Mob Level × Mob Rarity Multiplier)

Rarity Multipliers:
- Normal: 1.0x
- Elite: 2.0x
- Boss: 5.0x
- Raid Boss: 10.0x

Level Difference Modifier:
- Gray (5+ levels below): 0 XP
- Green (3-4 below): 50% XP
- Yellow (±2 levels): 100% XP
- Orange (3-4 above): 110% XP
- Red (5+ above): 125% XP

Rested Bonus: +100% XP (accumulated offline, 1 level worth max)
```

**Loot Generation:**
```
Loot Roll Process:
1. Determine # of items (1-3 for normal, 5-10 for bosses)
2. Roll rarity for each item (weighted probabilities)
3. Roll item type (weapon/armor based on loot table)
4. Roll item stats (appropriate for player level ±2)
5. Present loot to player (auto-pickup in idle mode)

Rarity Probabilities (Normal Mob, Level 60):
- Common (White): 45%
- Uncommon (Green): 35%
- Rare (Blue): 18%
- Epic (Purple): 2%
- Legendary (Orange): 0% (raid-only)

Boss Loot (Guaranteed Rare+):
- Rare: 65%
- Epic: 30%
- Legendary: 5% (raid bosses only)
```

**Gold Rewards:**
```
Gold per Kill = (Mob Level × 0.5) + Random(0, Mob Level × 0.2)

Example Level 60 Elite:
= (60 × 0.5) + Random(0, 12)
= 30 + 8 = 38 gold
```

---

## Progression Systems

### Leveling System

**Level Cap:** 60 (classic WoW-style)

**Experience Requirements:**
```
XP Required per Level = BaseXP × (Level^2.5)

Level 1→2: 400 XP
Level 2→3: 900 XP
Level 10→11: 6,200 XP
Level 20→21: 24,300 XP
Level 30→31: 66,800 XP
Level 40→41: 145,600 XP
Level 50→51: 290,800 XP
Level 59→60: 517,000 XP

Total XP 1→60: ~4,800,000 XP
```

**Leveling Speed Curve:**
- Levels 1-10: ~15-30 minutes each (with quests)
- Levels 10-30: ~30-60 minutes each
- Levels 30-50: ~1-2 hours each
- Levels 50-60: ~2-4 hours each
- Total Time 1→60: ~60-80 hours (with optimal efficiency)

**Level Milestones:**

| Level | Unlocks |
|-------|---------|
| 1 | Character creation, starting zone quests |
| 10 | First talent point, specialization choice |
| 15 | First dungeon access (Ragefire Chasm equivalent) |
| 20 | Mount training (-30% travel time for quests) |
| 25 | Second dungeon tier |
| 30 | Advanced class abilities |
| 40 | Epic mount training (-60% travel time) |
| 45 | Third dungeon tier |
| 55 | Pre-raid dungeons (Scholomance, Stratholme equivalent) |
| 60 | Raid access, endgame content unlocked |

---

### Equipment System

#### Equipment Slots

**14 Total Slots:**
1. Head
2. Neck
3. Shoulders
4. Back (Cloak)
5. Chest
6. Wrist
7. Hands
8. Waist
9. Legs
10. Feet
11. Ring 1
12. Ring 2
13. Trinket 1
14. Trinket 2
15. Main Hand (Weapon)
16. Off Hand (Weapon/Shield)
17. Ranged (Hunter/Warrior/Rogue only)

#### Item Rarity & Power Budget

**Rarity Tiers:**

| Rarity | Color | Item Level Modifier | Drop Source |
|--------|-------|---------------------|-------------|
| Common | Gray/White | 0.7x | Vendor trash, early quests |
| Uncommon | Green | 1.0x | Quests, normal mobs, low dungeons |
| Rare | Blue | 1.3x | Dungeons, rare spawns, difficult quests |
| Epic | Purple | 1.6x | Raids, high-end dungeons, world bosses |
| Legendary | Orange | 2.0x | Raid final bosses, extreme rare drops |

**Item Level (ilvl) System:**
```
Base ilvl = Player Level + Rarity Modifier

Example Level 60 Equipment:
- Uncommon (Green): ilvl 60
- Rare (Blue): ilvl 65
- Epic (Purple): ilvl 70
- Legendary (Orange): ilvl 80

Stat Budget = ilvl × Stat Weight × Slot Weight
```

**Stat Weights by Slot:**

| Slot | Primary Stat Budget | Secondary Stat Budget |
|------|---------------------|----------------------|
| Chest | 100% | 100% |
| Legs | 90% | 90% |
| Head | 85% | 85% |
| Shoulders | 70% | 70% |
| Hands/Waist/Feet | 60% each | 60% each |
| Wrist | 50% | 50% |
| Neck/Rings | 0% (no primary) | 80% each |
| Trinkets | 0% (special effects) | 100% (unique) |

**Item Stat Generation:**
```
Primary Stats (Str/Agi/Int/Sta):
Total Primary = (ilvl × 0.5) × Slot Weight

Example: ilvl 65 (Rare) Chest
= (65 × 0.5) × 1.0 = 32.5 ≈ 33 Strength

Secondary Stats (Crit, Hit, Haste, etc.):
Total Secondary = (ilvl × 0.3) × Slot Weight

Example: ilvl 65 (Rare) Chest
= (65 × 0.3) × 1.0 = 19.5 ≈ 20 rating distributed across 2-3 stats
```

#### Weapon System

**Weapon Types:**
- One-Hand: Sword, Axe, Mace, Dagger, Fist Weapon
- Two-Hand: Sword, Axe, Mace, Polearm, Staff
- Ranged: Bow, Gun, Crossbow, Wand, Thrown

**Weapon Damage Formula:**
```
Weapon DPS = ((Min Damage + Max Damage) / 2) / Weapon Speed

Weapon Damage Budget = ilvl × 0.3 × Speed Modifier

Speed Modifiers:
- Dagger (1.8 speed): 0.9x damage (fast, rogue-friendly)
- Fast (2.0-2.4): 1.0x damage
- Medium (2.5-2.9): 1.15x damage
- Slow (3.0-3.5): 1.3x damage (ability damage scaling)
- Very Slow (3.6-4.0): 1.4x damage

Example: ilvl 70 (Epic) Two-Hand Sword, 3.5 speed
Damage Budget = 70 × 0.3 × 1.3 = 27.3 DPS
Total Damage = 27.3 × 3.5 = 95.55 damage per hit
Damage Range = 95.55 ± 20% = 76-115 damage
```

**Weapon Special Properties:**
- Proc Effects (chance on hit): "2% chance to deal 200 fire damage"
- Unique Abilities: "Increases Nature spell damage by 20"
- Set Bonuses: Part of item sets (see below)

---

### Item Sets & Set Bonuses

**Set Structure:**
- 5-8 pieces per set
- Tier sets from raids (Tier 1, Tier 2, Tier 3)
- Dungeon sets from pre-raid content
- PvP sets (future expansion possibility)

**Set Bonus Example (Warrior Tier 1 - "Might"):**

| Pieces Equipped | Bonus |
|-----------------|-------|
| 2-piece | +200 Armor |
| 4-piece | 20% reduced cooldown on Shield Wall |
| 6-piece | +40 Strength |
| 8-piece | +8% damage on all abilities |

**Set Synergies:**
- Sets designed around class specializations
- Encourages targeting specific raid bosses
- Creates long-term goals ("I need 3 more pieces for 6-set!")

---

### Enchanting & Consumables

#### Enchanting System

**Enchantable Slots:**
- Head (via reputation rewards)
- Shoulders (via reputation rewards)
- Back (Cloak)
- Chest
- Wrist (Bracers)
- Hands (Gloves)
- Legs (via crafting item)
- Feet (Boots)
- Main Hand Weapon
- Off Hand Weapon

**Enchant Tiers:**

| Tier | Unlocked At | Stat Range | Cost |
|------|-------------|------------|------|
| Minor | Level 10 | +3-5 stats | 5 Gold |
| Lesser | Level 25 | +7-10 stats | 15 Gold |
| Standard | Level 40 | +12-15 stats | 40 Gold |
| Superior | Level 55 | +18-22 stats | 100 Gold |
| Legendary | Level 60, Raids | +25-30 stats | 500 Gold + Materials |

**Enchant Examples:**
- Weapon: "Crusader" (+100 Strength proc)
- Chest: "+4 to All Stats"
- Boots: "Minor Speed" (+8% movement speed, reduces quest time)
- Gloves: "+15 Agility"

**Enchanting as Idle Activity:**
- No profession grinding required (simplified from WoW)
- Purchase enchants with gold from NPC enchanters
- Higher tier enchants unlocked via dungeon/raid achievements
- Some enchants require rare materials from bosses

#### Consumable System

**Consumable Types:**

1. **Health Potions**
   - Minor: Restores 200 HP (1 second cooldown)
   - Lesser: Restores 500 HP
   - Standard: Restores 1,000 HP
   - Greater: Restores 2,000 HP
   - Major: Restores 3,500 HP

2. **Mana Potions**
   - Same structure as health potions

3. **Buff Potions (30-minute duration)**
   - Strength Elixir: +20 Strength
   - Agility Elixir: +25 Agility
   - Intellect Elixir: +18 Intellect
   - Armor Elixir: +450 Armor

4. **Food Buffs (30-minute duration)**
   - Well Fed: +10 Stamina, +10 Spirit

5. **Flasks (2-hour duration, raid-tier)**
   - Flask of the Titans: +400 Health
   - Flask of Supreme Power: +70 Spell Power
   - Flask of Distilled Wisdom: +2,000 Mana

**Auto-Consumption (Idle Mode):**
- Set thresholds: "Use Health Potion when below 40%"
- Buff auto-renewal: "Maintain Strength Elixir during combat"
- Flask management: "Reserve flasks for raid bosses only"
- Consumable inventory tracking with low-stock warnings

---

### Reputation & Faction System

**Faction Structure:**
- 5-7 major factions (Alliance/Horde themed)
- Reputation gained through:
  - Quests in faction zones
  - Dungeon runs for faction-specific dungeons
  - Raid boss kills
  - Repeatable turn-ins (cloth, materials)

**Reputation Levels:**

| Level | Points Required | Unlocks |
|-------|-----------------|---------|
| Hated | -42,000 | - |
| Hostile | -6,000 | - |
| Unfriendly | -3,000 | - |
| Neutral | 0 | Starting point |
| Friendly | 3,000 | Faction discounts (10% off) |
| Honored | 9,000 | First reputation rewards (enchants) |
| Revered | 21,000 | Superior reputation rewards (patterns) |
| Exalted | 42,000 | Epic mounts, best-in-slot items |

**Reputation Rewards Examples:**

**Faction: Ironforge Guard (Alliance)**
- Honored: Head Enchant (+18 Stamina)
- Revered: Epic Mount (for Dwarves, discount for others)
- Exalted: Tabard (cosmetic), Ring (ilvl 68)

**Reputation Gating:**
- Some raid attunements require Honored with specific factions
- Best enchants locked behind Revered/Exalted
- Provides long-term goal beyond gear

---

### Achievement System

Achievements provide long-term goals, cosmetic rewards, and account-wide progression bonuses. Each achievement has a point value contributing to total Achievement Score.

#### Achievement Point System

| Point Value | Achievement Tier | Difficulty |
|-------------|------------------|------------|
| 5 | Basic | Tutorial/Early game |
| 10 | Standard | Normal progression |
| 25 | Notable | Dedicated effort |
| 50 | Epic | Significant challenge |
| 100 | Legendary | Extreme rarity/difficulty |

**Achievement Score Milestones:**
| Score | Reward |
|-------|--------|
| 100 | Title: "Achiever" |
| 250 | +25 Account-wide Health |
| 500 | Title: "Dedicated" |
| 1000 | +50 Account-wide Health, +0.5% Crit |
| 2000 | Title: "Veteran", Cosmetic Tabard |
| 3500 | +100 Account-wide Health, +1% Crit |
| 5000 | Title: "Legend of Valdoria", Unique Mount |

---

#### Category 1: Character Progression (280 points)

**Leveling:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| First Steps | Reach Level 5 | 5 | - |
| Getting Started | Reach Level 10 | 5 | - |
| Apprentice | Reach Level 20 | 10 | - |
| Journeyman | Reach Level 30 | 10 | - |
| Expert | Reach Level 40 | 10 | - |
| Artisan | Reach Level 50 | 10 | - |
| Master | Reach Level 60 | 25 | Title: "the Leveled" |

**Talent Progression:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Talented | Spend first talent point | 5 | - |
| Specialized | Reach 31 points in one tree | 10 | - |
| Dual Spec | Have 2 saved talent builds | 10 | - |
| Jack of All Trades | Spend points in all 3 trees | 25 | - |

**Gold Accumulation:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Pocket Change | Earn 100 gold total | 5 | - |
| Comfortable | Earn 1,000 gold total | 10 | - |
| Wealthy | Earn 10,000 gold total | 10 | - |
| Affluent | Earn 50,000 gold total | 25 | - |
| Tycoon | Earn 100,000 gold total | 50 | Title: "the Rich" |
| Mogul | Have 50,000 gold at once | 25 | - |

**Questing:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Quest Accepted | Complete 10 quests | 5 | - |
| Adventurer | Complete 50 quests | 10 | - |
| Seeker | Complete 100 quests | 10 | - |
| Loremaster | Complete 250 quests | 25 | - |
| Legend | Complete 500 quests | 50 | Title: "Loremaster" |

---

#### Category 2: Dungeon Achievements (425 points)

**Dungeon Completion:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Cindermaw Conqueror | Complete Cindermaw Caverns | 10 | - |
| Depths Delver | Complete The Hollowed Depths | 10 | - |
| Serpent Slayer | Complete Serpent's Lament | 10 | - |
| Manor Master | Complete Dreadhollow Manor | 10 | - |
| Temple Desecrator | Complete Drowned Temple | 10 | - |
| Foundry Forged | Complete Gearwreck Foundry | 10 | - |
| Sanctum Purifier | Complete Crimson Sanctum (all wings) | 25 | - |
| Crypt Clearer | Complete Thornbarrow Crypt | 10 | - |
| Titan's Chosen | Complete Titan's Repose | 10 | - |
| Ruins Explorer | Complete Sandscar Ruins | 10 | - |
| Earthbound | Complete Earthmother's Tomb | 10 | - |
| Serpentshrine Savior | Complete Serpentshrine Temple | 10 | - |
| Citadel Crusher | Complete Molten Citadel | 25 | - |
| City Liberator | Complete Ashcrown City (both sides) | 25 | - |
| Academy Graduate | Complete Necropolis Academy | 25 | - |
| **Dungeon Master** | Complete all 15 dungeons | 50 | Title: "Dungeon Master" |

**Heroic Dungeons:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Heroic: Molten Citadel | Complete on Heroic | 25 | - |
| Heroic: Ashcrown City | Complete on Heroic | 25 | - |
| Heroic: Necropolis Academy | Complete on Heroic | 25 | - |
| **Heroic Champion** | Complete all Heroic dungeons | 50 | Title: "the Heroic" |

**Speed Runs:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Speed Demon | Clear any dungeon in <15 min | 10 | - |
| Velocity | Clear 5 dungeons in <12 min each | 25 | - |
| Lightning Fast | Clear any dungeon in <8 min | 50 | Title: "the Swift" |

---

#### Category 3: Raid Achievements (650 points)

**Heart of the Inferno (T1):**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Inferno Initiate | Kill first boss | 10 | - |
| Pyroclast's End | Defeat Pyraxion | 25 | - |
| **Heart of Fire** | Clear all T1 bosses | 50 | Title: "of the Inferno" |

**Drakescale Sanctum (T2):**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Dragonslayer | Defeat Vyrmorthos | 50 | - |
| Chromatic Challenger | Defeat Chromaggus | 25 | - |
| **Sanctum Savior** | Clear all T2 bosses | 50 | Title: "Dragonslayer" |

**Hive of the Swarm-God (T2.5):**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Old God's Bane | Defeat C'Thun | 50 | - |
| Twin Emperor Toppler | Defeat Vek'lor & Vek'nilash | 25 | - |
| **Hive Destroyer** | Clear all T2.5 bosses | 50 | Title: "the Silithid Slayer" |

**Citadel of the Damned (T3):**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Deathweaver's Doom | Defeat Maltheon | 100 | - |
| Sapphiron Shatterer | Defeat Sapphiron | 50 | - |
| Four Horsemen Vanquisher | Defeat the Four Horsemen | 50 | - |
| **Citadel Conqueror** | Clear all T3 bosses | 100 | Title: "Champion of the Damned" |

**Raid Meta-Achievements:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| **Raider** | Clear any raid | 25 | - |
| **Veteran Raider** | Clear 2 different raids | 50 | - |
| **Elite Raider** | Clear all 4 raids | 100 | Title: "the Undying", Mount: Spectral Wyvern |

---

#### Category 4: Combat Achievements (350 points)

**Damage Dealt:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Apprentice Striker | Deal 100,000 total damage | 5 | - |
| Damage Dealer | Deal 1,000,000 total damage | 10 | - |
| Devastator | Deal 10,000,000 total damage | 25 | - |
| Annihilator | Deal 100,000,000 total damage | 50 | Title: "the Annihilator" |
| One Million Damage | Deal 1,000,000 in single encounter | 50 | - |

**Healing Done:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Bandage Applier | Heal 50,000 total | 5 | - |
| Healer | Heal 500,000 total | 10 | - |
| Lifesaver | Heal 5,000,000 total | 25 | - |
| Miracle Worker | Heal 50,000,000 total | 50 | Title: "the Healer" |

**Kill Counts:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Pest Control | Kill 100 enemies | 5 | - |
| Exterminator | Kill 1,000 enemies | 10 | - |
| Slayer | Kill 10,000 enemies | 25 | - |
| Genocide | Kill 50,000 enemies | 50 | Title: "the Slayer" |
| Armageddon | Kill 100,000 enemies | 100 | Title: "Bane of Valdoria" |

**Critical Strikes:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Lucky Hit | Land 100 critical strikes | 5 | - |
| Critical Mass | Land 10,000 critical strikes | 25 | - |
| Critical Mastery | Land 100,000 critical strikes | 50 | - |

---

#### Category 5: Collection Achievements (400 points)

**Equipment Quality:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Uncommon Find | Equip first Uncommon item | 5 | - |
| Rare Discovery | Equip first Rare item | 5 | - |
| Epic Moment | Equip first Epic item | 10 | - |
| Legendary! | Equip a Legendary item | 100 | Title: "the Legendary" |

**Equipment Quantity:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Collector | Own 25 Epic items | 10 | - |
| Hoarder | Own 50 Epic items | 25 | - |
| Treasure Hunter | Own 100 Epic items | 50 | Title: "Treasure Hunter" |

**Tier Sets:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| T1 Initiate | Collect 4-piece T1 set | 25 | - |
| T1 Complete | Collect 8-piece T1 set | 50 | - |
| T2 Initiate | Collect 4-piece T2 set | 25 | - |
| T2 Complete | Collect 8-piece T2 set | 50 | - |
| T3 Initiate | Collect 4-piece T3 set | 50 | - |
| T3 Complete | Collect 8-piece T3 set | 100 | Title: "of the Tier Three" |

---

#### Category 6: Exploration Achievements (200 points)

**Zone Discovery:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Silverleaf Scout | Explore Silverleaf Glade | 5 | - |
| Ashford Wanderer | Explore Ashford Plains | 5 | - |
| Mountain Climber | Explore Stormridge Mountains | 10 | - |
| Shadow Walker | Explore Shadowmere Woods | 10 | - |
| Canyon Crosser | Explore Scorchwind Canyon | 10 | - |
| Peak Conqueror | Explore Emberveil Peaks | 10 | - |
| **Explorer of Valdoria** | Explore all 12 zones | 50 | Title: "the Explorer" |

**Zone Completion:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Glade Guardian | Complete all Silverleaf quests | 10 | - |
| Plains Protector | Complete all Ashford quests | 10 | - |
| Mountain Master | Complete all Stormridge quests | 10 | - |
| Shadow Sovereign | Complete all Shadowmere quests | 10 | - |
| Canyon Champion | Complete all Scorchwind quests | 10 | - |
| Peak Paragon | Complete all Emberveil quests | 10 | - |
| **Valdorian Completionist** | Complete all zone quests | 100 | Title: "Completionist" |

---

#### Category 7: Reputation Achievements (150 points)

| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Friendly Face | Reach Friendly with any faction | 5 | - |
| Honored Ally | Reach Honored with any faction | 10 | - |
| Revered Champion | Reach Revered with any faction | 25 | - |
| Exalted | Reach Exalted with any faction | 50 | Title: "the Exalted" |
| Diplomat | Reach Exalted with 3 factions | 50 | Title: "Ambassador" |

---

#### Category 8: Class-Specific Achievements (175 points per class)

**Warrior:**
| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Rage Machine | Spend 10,000 total Rage | 25 | - |
| Execute Master | Kill 500 enemies with Execute | 25 | - |
| Shield Wall Savior | Block 100,000 damage | 25 | - |
| Arms Master | Deal 1M damage with Mortal Strike | 50 | Title: "Arms Master" |
| Fury Incarnate | Deal 1M damage with Bloodthirst | 50 | Title: "the Furious" |

*(Similar achievements exist for all 7 classes)*

---

#### Meta-Achievements

| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| **Completionist** | Earn 1000 achievement points | 0 | Title, Tabard |
| **Perfectionist** | Earn 2500 achievement points | 0 | Title, Mount |
| **Absolute Legend** | Earn 5000 achievement points | 0 | Title: "Absolute Legend", Unique Visual Effect |

---

#### Feats of Strength (No Points)

*Rare achievements that are not required for completion but show prestige.*

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| Deathcharger | Obtain Deathcharger's Reins | Mount, Title: "Baron" |
| Ashbringer | Obtain Ashbringer of the Inferno | Title: "Ashbringer" |
| Scarab Lord | First to complete Swarm-God attunement | Title: "Scarab Lord" |
| Realm First: Level 60 | First to reach 60 on server | Title: "the Supreme" |
| Undying | Clear T3 without any deaths | Title: "the Undying" |

---

## Content Structure

### Zone & Questing System

#### World Structure

**12 Zones (6 Alliance, 6 Horde-themed, accessible by both):**

| Zone | Level Range | Theme | Primary Faction |
|------|-------------|-------|----------------|
| Elwynn Forest / Durotar | 1-10 | Starting zone | Alliance / Horde |
| Westfall / Barrens | 10-20 | Farmlands / Savannah | Alliance / Horde |
| Redridge / Stonetalon | 20-30 | Mountains | Alliance / Horde |
| Duskwood / Desolace | 30-40 | Haunted forest / Wasteland | Neutral |
| Badlands / Thousand Needles | 40-50 | Desert / Canyons | Neutral |
| Burning Steppes / Un'Goro | 50-60 | Volcanic / Jungle | Neutral |

**Quest Types:**

1. **Kill Quests** (60% of quests)
   - "Kill 10 Defias Bandits"
   - Simple combat, fast completion
   - Base XP + kill XP

2. **Collection Quests** (25%)
   - "Collect 8 Kobold Candles" (drop rate: 40%)
   - Requires killing mobs for drops
   - Base XP + completion bonus

3. **Delivery Quests** (10%)
   - "Deliver letter to Stormwind"
   - No combat, instant completion (time-based in idle)
   - Lower XP but fast

4. **Boss Quests** (5%)
   - "Defeat Hogger"
   - Elite mob encounters
   - High XP + guaranteed rare item

**Quest Chains:**
- 3-5 connected quests telling story
- Final quest rewards rare/epic item
- Example: "Defias Brotherhood" chain (5 quests) → Blue dagger reward

**Quest UI:**
- Quest log shows up to 25 active quests
- Track quest progress automatically
- Auto-turn-in when completed (optional)
- Quest helper shows nearest objectives

---

### Dungeon System

**Dungeon Structure:**
- 5 trash mob packs (optional, bonus loot)
- 3 mini-bosses (guaranteed loot, 1 item each)
- 1 final boss (guaranteed 2-3 items, higher rarity chance)
- Total time: 15-30 minutes per clear

**Dungeon Tiers:**

| Tier | Level | Dungeons | Difficulty |
|------|-------|----------|------------|
| 1 | 15-25 | Ragefire Chasm, Deadmines, Wailing Caverns | Easy (intro to mechanics) |
| 2 | 25-35 | Shadowfang Keep, Blackfathom Deeps | Medium (requires gear) |
| 3 | 35-45 | Scarlet Monastery, Uldaman | Medium-Hard (mechanics matter) |
| 4 | 45-55 | Zul'Farrak, Maraudon, Temple of Atal'Hakkar | Hard (requires strategy) |
| 5 | 55-60 | Scholomance, Stratholme, Blackrock Depths | Very Hard (pre-raid gear) |

**Dungeon Mechanics (Simplified for Idle):**
- Boss abilities trigger on timers (AI dodges/handles)
- Success rate shown as percentage before entry
- Higher success rate = better AI performance = more loot
- Improving success rate requires better gear/talents

**Example Dungeon: "Deadmines" (Level 18-22)**

**Trash Packs:**
- 5 packs of 3-4 mobs each
- Average 30-45 seconds per pack
- Loot: Uncommon items, gold, vendor trash

**Bosses:**
1. **Rhahk'Zor** (Mini-Boss)
   - Health: 5,000
   - Mechanic: Enrage at 20% (+50% damage)
   - Loot: 1 Uncommon/Rare item

2. **Sneed's Shredder** (Mini-Boss)
   - Health: 7,000
   - Mechanic: Two phases (mech → pilot)
   - Loot: 1 Rare item

3. **Mr. Smite** (Mini-Boss)
   - Health: 6,500
   - Mechanic: Stun attack every 20 seconds
   - Loot: 1 Rare item

4. **Edwin VanCleef** (Final Boss)
   - Health: 12,000
   - Mechanic: Summons adds at 50%, hard enrage at 3 minutes
   - Loot: 2-3 Rare items, 5% chance Epic (Chest piece)

**Dungeon Lockouts:**
- Can repeat infinitely (no lockout for normal mode)
- Heroic mode (Level 60): Daily lockout, better loot
- Encourages farming for specific items

---

### Raid System

**Raid Structure:**
- 8-12 bosses per raid
- Completion time: 2-4 hours per clear (idle time)
- Weekly lockout (can only loot each boss once per week)
- Progressive difficulty (later bosses harder)

**Raid Tiers:**

| Raid | Level | Bosses | Gear ilvl | Special Feature |
|------|-------|--------|-----------|-----------------|
| Molten Core (Tier 1) | 60 | 10 | 66-71 | Introduction to raiding |
| Blackwing Lair (Tier 2) | 60 | 8 | 71-76 | Harder mechanics |
| Ahn'Qiraj (Tier 2.5) | 60 | 9 | 76-81 | Epic quest line |
| Naxxramas (Tier 3) | 60 | 15 | 81-88 | Ultimate challenge |

**Raid Boss Mechanics:**
- More complex than dungeons
- Multiple phases (2-3 per boss)
- Enrage timers (DPS checks)
- Positioning mechanics (handled by AI)

**Example Raid Boss: "Ragnaros" (Molten Core Final Boss)**

**Stats:**
- Health: 1,000,000
- Enrage Timer: 10 minutes
- Phases: 2

**Phase 1 (100-50%):**
- Summons Fire Elementals every 30 seconds (adds 200k total HP pool)
- Lava Burst: 3,000 damage AOE every 10 seconds
- Requires: Kill adds quickly, maintain healing

**Phase 2 (50-0%):**
- Enrage: +50% damage
- Meteor: 5,000 damage single-target every 8 seconds
- Requires: High DPS, careful cooldown management

**Loot:**
- 3-4 Epic items per kill
- Tier 1 set pieces (legs guaranteed)
- 1% chance for Legendary weapon (Sulfuras, Hand of Ragnaros)

**Raid Success Metrics:**
```
Success Chance = (Player DPS / Required DPS) × (Player Survivability / Required Survivability) × 100

Required DPS = Boss Health / (Enrage Timer - 60s safety margin)
Required Survivability = Player must survive average DPS taken over encounter

Example Ragnaros:
Required DPS = 1,000,000 / (600s - 60s) = 1,851 DPS
If Player DPS = 2,400 DPS → DPS Check: 130% ✓
If Player Survivability = 85% → Survivability Check: 85% ✓
Success Chance = (130% × 85%) = 110.5% → 100% (capped)
```

**Raid Progression:**
- Must defeat all Tier 1 bosses to unlock Tier 2
- Must defeat all Tier 2 to unlock Tier 2.5
- Attunement quests required (one-time, story-driven)

---

## UI/UX Design

### Navigation Structure

**Main Menu Tabs:**
1. **Character** (stats, equipment, talents)
2. **World Map** (zone selection, quest tracking)
3. **Combat Log** (real-time/historical)
4. **Inventory** (items, consumables, currency)
5. **Dungeon Finder** (dungeon/raid list)
6. **Achievements** (progress tracking)
7. **Settings** (options, save management)

**Top Bar (Always Visible):**
- Character portrait with health/resource bars
- Level progress bar
- Current gold
- Current activity status ("Questing in Westfall - 2:34 remaining")
- Offline progress indicator when game closed

---

### Character Screen

**Layout:**

```
┌─────────────────────────────────────────────────┐
│  CHARACTER: Thrognar (Level 45 Warrior)        │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  EQUIPMENT  │     CHARACTER STATS               │
│   MODEL     │                                   │
│  (Center)   │  Health: 3,450 / 3,450            │
│             │  Rage: 0 / 100                    │
│  [Head]     │                                   │
│  [Neck]     │  Strength: 245 (+125 from gear)  │
│  [Shoulder] │  Agility: 108 (+45 from gear)    │
│  [Back]     │  Stamina: 198 (+95 from gear)    │
│  [Chest]    │  Intellect: 42 (+10 from gear)   │
│  [Wrist]    │                                   │
│  [Hands]    │  Attack Power: 612               │
│  [Waist]    │  Melee Crit: 18.4%               │
│  [Legs]     │  Hit Chance: 6.2%                │
│  [Feet]     │  Armor: 5,420                    │
│  [Ring 1]   │                                   │
│  [Ring 2]   │  DPS: 287.5                      │
│  [Trinket 1]│                                   │
│  [Trinket 2]│  [TALENT TREE BUTTON]           │
│  [Main Hand]│  [REPUTATION BUTTON]             │
│  [Off Hand] │                                   │
│  [Ranged]   │                                   │
└─────────────┴───────────────────────────────────┘
```

**Equipment Slot Interactions:**
- Click slot → show inventory items for that slot
- Hover → tooltip shows current item stats
- Right-click → unequip item
- Compare mode: Shows stat changes when hovering inventory item

---

### World Map & Quest System

**Map Screen:**

```
┌─────────────────────────────────────────────────┐
│  WORLD MAP                    [Zone List ▼]    │
├─────────────────────────────────────────────────┤
│                                                 │
│      ┌─────────────────────────┐               │
│      │                         │  WESTFALL      │
│      │    [Hex-based map]      │  Level 10-20   │
│      │    with quest markers   │                │
│      │         [!] [!]         │  Active Quests:│
│      │      [!]    [?]         │  - Defias      │
│      │         [★]             │    Brotherhood │
│      │    [!]     [!]          │    (3/5)       │
│      │                         │  - Murloc      │
│      │                         │    Menace      │
│      └─────────────────────────┘    (8/12)     │
│                                                 │
│  [START QUESTING] - Est: 15:30 remaining       │
│  [VIEW QUEST LOG]                               │
└─────────────────────────────────────────────────┘
```

**Quest Log:**
- Lists all active quests (max 25)
- Sortable by: Level, Progress, Zone
- Quest details: Objectives, rewards preview, recommended level
- Auto-path: "Go to quest objective" button (reduces time by 10%)

---

### Combat Log Screen

**Real-Time Combat View:**

```
┌─────────────────────────────────────────────────┐
│  COMBAT: Scarlet Monastery Boss Fight           │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Player HP: ████████████░░ 82%]               │
│  [Boss HP:   ██████░░░░░░░░ 45%]               │
│                                                 │
│  00:32  You hit Interrogator Vishas for 287    │
│  00:33  Interrogator Vishas hits you for 156   │
│  00:34  You critically hit for 574 (Mortal     │
│          Strike)                                │
│  00:35  You gain 25 Rage                       │
│  00:36  Interrogator Vishas casts Shadow Bolt  │
│  00:38  You are hit by Shadow Bolt for 412     │
│  00:39  You hit for 298                        │
│  00:40  You use Health Potion (restores 1,000) │
│                                                 │
│  [PAUSE COMBAT] [FLEE COMBAT] [USE POTION]     │
└─────────────────────────────────────────────────┘
```

**Summary View (Post-Combat):**
- Total damage dealt/taken
- DPS/HPS metrics
- Experience earned
- Loot acquired
- Combat duration

---

### Inventory & Equipment Management

**Inventory Screen:**

```
┌─────────────────────────────────────────────────┐
│  INVENTORY                    Gold: 1,247       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Filters: [All] [Weapons] [Armor] [Consumables]│
│           [Quest Items] [Junk]                  │
│                                                 │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐  │
│  │[Axe]│[Helm│[Ring│[Pot]│[Ore]│     │     │  │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤  │
│  │[Swrd│[Chest[Cloak[Pot]│     │     │     │  │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤  │
│  │[Boot│[Glove[Food][Food][Food│     │     │  │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤  │
│  │     │     │     │     │     │     │     │  │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘  │
│                                                 │
│  Capacity: 28 / 80 (Bag upgrades available)    │
│                                                 │
│  [SELL JUNK] [AUTO-SORT] [MANAGE BAGS]         │
└─────────────────────────────────────────────────┘
```

**Item Tooltip:**
```
┌─────────────────────────────────┐
│ Blade of Eternal Darkness       │
│ Item Level 68                   │
│ Rare (Blue)                     │
│ ───────────────────────────────│
│ Main Hand Sword                 │
│ 95-142 Damage  Speed 2.6        │
│ (45.6 DPS)                      │
│ ───────────────────────────────│
│ +18 Strength                    │
│ +12 Stamina                     │
│ +24 Attack Power                │
│ +1.2% Critical Strike           │
│ ───────────────────────────────│
│ Equip: 2% chance on hit to      │
│ drain 50 life from target       │
│ ───────────────────────────────│
│ Requires Level 58               │
│ Dropped by: Ramstein (Strath)  │
│ ───────────────────────────────│
│ [EQUIP] [SELL: 12g 54s]        │
└─────────────────────────────────┘
```

---

### Talent Tree Interface

**Talent Screen Layout:**

```
┌─────────────────────────────────────────────────┐
│  TALENTS: Warrior (45/51 Points Spent)          │
│  [ARMS: 31] [FURY: 14] [PROTECTION: 0]         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ARMS TREE               FURY TREE              │
│                                                 │
│  Tier 1 (0 points)       Tier 1 (0 points)     │
│  ┌───┬───┬───┐          ┌───┬───┬───┐         │
│  │ ● │ ● │ ● │          │ ● │   │ ● │         │
│  └───┴───┴───┘          └───┴───┴───┘         │
│   5/5  3/3  5/5           5/5      3/3         │
│                                                 │
│  Tier 2 (5 points)       Tier 2 (5 points)     │
│  ┌───┬───┬───┐          ┌───┬───┬───┐         │
│  │ ● │ ○ │ ● │          │ ● │ ○ │ ○ │         │
│  └───┴───┴───┘          └───┴───┴───┘         │
│   2/2      3/3           3/3                    │
│                                                 │
│  [Continue down trees...]                       │
│                                                 │
│  Tier 7 (30 points)                             │
│       ┌───┐                                     │
│       │ ● │ MORTAL STRIKE                      │
│       └───┘ (Signature Ability)                │
│        1/1                                      │
│                                                 │
│  Points Remaining: 6                            │
│  [RESET TALENTS: 15 Gold] [PREVIEW BUILD]      │
└─────────────────────────────────────────────────┘
```

**Talent Tooltip:**
```
┌─────────────────────────────────┐
│ Mortal Strike (Rank 1/1)        │
│ Requires: 30 points in Arms     │
│ ───────────────────────────────│
│ Instant Cast  6 second cooldown │
│ Requires: Melee Weapon          │
│ Costs: 30 Rage                  │
│ ───────────────────────────────│
│ A vicious strike that deals     │
│ weapon damage plus 160 and      │
│ reduces healing on target by    │
│ 50% for 10 seconds.             │
│ ───────────────────────────────│
│ [LEARN] [MORE INFO]             │
└─────────────────────────────────┘
```

---

### Dungeon/Raid Finder

**Dungeon List:**

```
┌─────────────────────────────────────────────────┐
│  DUNGEON FINDER          [Dungeons] [Raids ▼]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ╔═══════════════════════════════════════════╗ │
│  ║ SCHOLOMANCE                  Level 58-60  ║ │
│  ║───────────────────────────────────────────║ │
│  ║ Estimated Time: 28 minutes               ║ │
│  ║ Success Rate: 94%                         ║ │
│  ║                                           ║ │
│  ║ Loot Table Preview:                       ║ │
│  ║ - [Epic] Necromancer's Mantle (4% drop)  ║ │
│  ║ - [Rare] Death's Clutch (12% drop)       ║ │
│  ║ - [Rare] Various class items             ║ │
│  ║                                           ║ │
│  ║ Last Completed: 2 days ago                ║ │
│  ║ Total Clears: 14                          ║ │
│  ║                                           ║ │
│  ║ [START DUNGEON] [VIEW BOSSES]            ║ │
│  ╚═══════════════════════════════════════════╝ │
│                                                 │
│  ╔═══════════════════════════════════════════╗ │
│  ║ STRATHOLME (LIVE SIDE)       Level 58-60  ║ │
│  ║───────────────────────────────────────────║ │
│  ║ Estimated Time: 32 minutes               ║ │
│  ║ Success Rate: 89%                         ║ │
│  ║ [START DUNGEON] [VIEW BOSSES]            ║ │
│  ╚═══════════════════════════════════════════╝ │
└─────────────────────────────────────────────────┘
```

**Raid Selection:**
```
┌─────────────────────────────────────────────────┐
│  MOLTEN CORE (Tier 1 Raid)                      │
├─────────────────────────────────────────────────┤
│  Status: Cleared 3/10 bosses this week          │
│  Next Available: 4 days 18 hours               │
│                                                 │
│  Boss Progress:                                 │
│  ✓ Lucifron (Defeated)                         │
│  ✓ Magmadar (Defeated)                         │
│  ✓ Gehennas (Defeated)                         │
│  ○ Garr (Not Attempted)                        │
│  ○ Baron Geddon (Locked)                       │
│  ...                                            │
│                                                 │
│  [CONTINUE RAID] (Resume from Garr)            │
│  [VIEW LOOT HISTORY]                            │
└─────────────────────────────────────────────────┘
```

---

### Settings & Automation

**Settings Menu:**

```
┌─────────────────────────────────────────────────┐
│  SETTINGS                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  AUTOMATION                                     │
│  ☑ Auto-loot items                             │
│  ☑ Auto-sell gray items                        │
│  ☑ Auto-repair equipment (cost: ~5g/repair)    │
│  ☑ Auto-accept quests                          │
│  ☑ Auto-turn-in completed quests               │
│  ☐ Auto-equip better items (compares stats)    │
│                                                 │
│  COMBAT                                         │
│  Health Potion Threshold: [40%]                 │
│  Mana Potion Threshold: [30%]                   │
│  Auto-use cooldowns: [✓] Bosses [✓] Trash     │
│  Combat Stop Condition: [Health < 10%]         │
│                                                 │
│  NOTIFICATIONS                                  │
│  ☑ Level up notifications                      │
│  ☑ Epic/Legendary loot notifications           │
│  ☑ Death notifications                         │
│  ☑ Achievement unlocks                         │
│  ☐ Dungeon completion                          │
│                                                 │
│  OFFLINE PROGRESS                               │
│  Max Offline Time: 18 hours                     │
│  Offline Activity: [Last Activity] [Set...]    │
│                                                 │
│  [SAVE SETTINGS]                                │
└─────────────────────────────────────────────────┘
```

---

## Monetization & Retention

### Monetization Philosophy

**Core Principle:** The game should be 100% playable and completable without spending money. Monetization focuses on convenience and cosmetics, never power.

### Revenue Streams

#### 1. One-Time Premium Purchase (Optional)

**"Raider's Edition" - $4.99**
- Removes all ads (if ads implemented in free version)
- +1 additional character slot (5 total vs. 4 free)
- Exclusive cosmetic transmog set
- Permanent +10% gold gain
- Priority customer support

#### 2. Cosmetic Microtransactions

**Transmog Appearances ($0.99 - $2.99 each):**
- Weapon skins
- Armor set appearances
- Mount skins (when mounts added)
- Pet companions (cosmetic followers)

**Bundles ($4.99 - $9.99):**
- Themed transmog collections
- "Class Fantasy Pack" (5 themed appearances)

#### 3. Convenience (Time-Savers, NOT Pay-to-Win)

**Quality of Life Features ($1.99 - $4.99 one-time):**
- Additional character slots (up to 10 total)
- Expanded inventory space (one-time upgrade)
- Instant talent respec (no gold cost)
- Combat log export (CSV data for analysis)

**NOT Monetized (Important):**
- Experience boosts (affects progression balance)
- Loot drop rate increases (undermines grind)
- Direct stat purchases (pay-to-win)
- Dungeon/Raid skip tickets (defeats purpose)

#### 4. Battle Pass (Seasonal, Optional)

The Battle Pass provides a structured seasonal progression system with cosmetic rewards. All gameplay-affecting items remain accessible through normal play; the pass offers convenience and exclusive visuals only.

**Season Duration:** 3 months (12 weeks)
**Pass Levels:** 50
**XP per Level:** 1,000 Pass XP (50,000 total to complete)

---

##### Pass XP Sources

| Activity | Pass XP Earned | Daily/Weekly Cap |
|----------|----------------|------------------|
| Kill any enemy | 1 XP | Uncapped |
| Complete dungeon | 50 XP | Uncapped |
| Complete raid boss | 100 XP | Uncapped |
| Daily quest completion | 75 XP | 225/day (3 quests) |
| Weekly quest completion | 500 XP | 500/week |
| Daily login | 50 XP | 50/day |
| Arena match (win) | 30 XP | 300/day |
| Arena match (loss) | 15 XP | 150/day |
| First dungeon of day | +100 XP bonus | 100/day |
| Achievement unlock | 25 XP | Uncapped |

**Estimated Completion Time:**
- Casual (30 min/day): ~10 weeks
- Regular (1 hr/day): ~7 weeks
- Dedicated (2+ hr/day): ~4 weeks

---

##### Complete 50-Level Reward Track

| Level | Free Track | Premium Track |
|-------|------------|---------------|
| 1 | 100 Gold | Seasonal Portrait Frame |
| 2 | 5× Health Potions | 200 Gold |
| 3 | 150 Gold | Title: "Adventurer" |
| 4 | 5× Mana Potions | 300 Gold |
| 5 | **Transmog: Common Weapon Skin** | **Transmog: Rare Weapon Skin** |
| 6 | 200 Gold | 10× Health Potions |
| 7 | 10× Health Potions | 400 Gold |
| 8 | 250 Gold | Title: "Journeyman" |
| 9 | 10× Mana Potions | 500 Gold |
| 10 | **Transmog: Common Helm Skin** | **Transmog: Rare Helm Skin + Pet: Season Mascot** |
| 11 | 300 Gold | 15× Health Potions |
| 12 | 15× Health Potions | 600 Gold |
| 13 | 350 Gold | Back Attachment: Seasonal Cloak |
| 14 | 15× Mana Potions | 700 Gold |
| 15 | **Transmog: Common Chest Skin** | **Transmog: Epic Chest Skin** |
| 16 | 400 Gold | 20× Health Potions |
| 17 | 20× Health Potions | 800 Gold |
| 18 | 450 Gold | Title: "Veteran" |
| 19 | 20× Mana Potions | 900 Gold |
| 20 | **Transmog: Common Shoulders** | **Transmog: Epic Shoulders + Emote: Seasonal Dance** |
| 21 | 500 Gold | 25× Health Potions |
| 22 | 25× Health Potions | 1,000 Gold |
| 23 | 550 Gold | Weapon Trail Effect (Blue) |
| 24 | 25× Mana Potions | 1,100 Gold |
| 25 | **Transmog: Common Gloves** | **Transmog: Epic Gloves + Mount Armor: Seasonal Barding** |
| 26 | 600 Gold | 30× Health Potions |
| 27 | 30× Health Potions | 1,200 Gold |
| 28 | 650 Gold | Title: "Hero" |
| 29 | 30× Mana Potions | 1,300 Gold |
| 30 | **Transmog: Common Boots** | **Transmog: Epic Boots + Footstep Effect** |
| 31 | 700 Gold | 35× Health Potions |
| 32 | 35× Health Potions | 1,400 Gold |
| 33 | 750 Gold | Nameplate Flair: Seasonal Icon |
| 34 | 35× Mana Potions | 1,500 Gold |
| 35 | **Transmog: Uncommon Set Piece** | **Transmog: Epic Weapon Skin (Glowing)** |
| 36 | 800 Gold | 40× Health Potions |
| 37 | 40× Health Potions | 1,600 Gold |
| 38 | 850 Gold | Title: "Champion" |
| 39 | 40× Mana Potions | 1,700 Gold |
| 40 | **Transmog: Uncommon Complete Set** | **Transmog: Epic Belt + Aura Effect (Subtle)** |
| 41 | 900 Gold | 45× Health Potions |
| 42 | 45× Health Potions | 1,800 Gold |
| 43 | 950 Gold | Combat Text Color: Seasonal |
| 44 | 45× Mana Potions | 1,900 Gold |
| 45 | **Rare Equipment Cache** | **Epic Equipment Cache + Hearthstone Visual** |
| 46 | 1,000 Gold | 50× Health Potions |
| 47 | 50× Health Potions | 2,000 Gold |
| 48 | 1,100 Gold | Title: "Legend" |
| 49 | 50× Mana Potions | 2,500 Gold |
| 50 | **Title: "Seasonal Victor"** | **Legendary Transmog Set + Mount: Seasonal Exclusive + Title: "Eternal [Season Name]"** |

**Total Free Track Value:** ~15,000 Gold equivalent
**Total Premium Track Value:** ~50,000 Gold equivalent + exclusive cosmetics

---

##### Catch-Up Mechanics

**For Late Starters:**
1. **Accelerated XP Weeks:** Final 2 weeks of season grant +50% Pass XP
2. **Retroactive Credit:** Activities completed before purchasing premium track grant credit
3. **Level Purchasing:** Buy up to 10 levels at 100 Gold each (convenience, not required)
4. **Bonus XP Events:** Occasional double Pass XP weekends

**For Returning Players:**
- Pass progress saves if you miss days
- No penalty for breaks during season
- Can purchase premium track at any point and receive all earned rewards

---

##### Season Themes

Each 3-month season has a unique theme affecting cosmetic rewards:

| Season | Theme | Mount | Transmog Style |
|--------|-------|-------|----------------|
| 1 | Flame & Fury | Ember Steed | Molten/Volcanic |
| 2 | Frost's Embrace | Glacial Wolf | Ice/Crystal |
| 3 | Shadow's Call | Void Panther | Dark/Shadowy |
| 4 | Nature's Wrath | Ancient Treant | Living Wood/Verdant |
| 5 | Storm's Fury | Thunder Hawk | Lightning/Electric |
| 6 | Golden Age | Gilded Griffin | Ornate/Regal |

*Seasons repeat annually with new "Year 2" variants.*

---

##### Premium Track Pricing & Value

**Standard Price:** $4.99 per season
**Bundle:** $14.99 for 4-season pass (Year Pass, 25% savings)

**Premium Track Includes:**
- All premium rewards (50 levels)
- +10% Pass XP gain
- Exclusive seasonal portrait frame
- Early access to next season's theme preview

**Ethical Monetization Notes:**
- No gameplay advantages (stats, XP, drop rates)
- Free track provides meaningful rewards
- All premium items are cosmetic only
- Season length allows casual completion
- No expiring premium currency

---

### Retention Mechanics

#### Daily Engagement

**Daily Login Rewards (Incremental):**
- Day 1: 50 Gold
- Day 2: 100 Gold
- Day 3: Health Potions (×10)
- Day 4: 200 Gold
- Day 5: Rare quality equipment cache
- Day 6: 300 Gold
- Day 7: Epic quality equipment cache

**Daily Quests (3 per day):**
- "Kill 50 enemies" (15 minute quest)
- "Complete 1 dungeon" (30 minute activity)
- "Earn 500 gold" (various activities)
- Rewards: Bonus XP, gold, consumables

#### Weekly Engagement

**Weekly Raid Lockouts:**
- Incentivizes weekly check-ins for loot
- Reset every 7 days (specific day/time)

**Weekly Quests (1 per week):**
- "Complete 5 dungeons" (high gold reward)
- "Earn Exalted with any faction" (reputation boost)

#### Long-Term Goals

**Achievement Hunting:**
- 100+ achievements spanning all content
- Meta-achievements ("Complete all dungeon achievements")
- Feats of Strength (rare, prestigious)

**Collection Systems:**
- Transmog collecting (visual variety)
- Mount collecting (future feature, 20+ mounts)
- Pet collecting (companion pets, 30+ types)
- Title collecting (40+ titles)

#### Prestige System (Post-60 Content)

**"Ascension" System (Future Update):**
- Reset character to level 1, keep achievements/transmog
- Gain permanent account-wide bonuses per ascension
- Example: "+1% damage per ascension level"
- New player model colors/effects (visual prestige)
- Prestige-only zones with exclusive cosmetics

---

### Player Psychology Hooks

**Progression Satisfaction:**
- Frequent small rewards (every quest, every kill)
- Medium rewards daily (login bonuses, daily quests)
- Large rewards weekly (raid lockouts, cache boxes)
- Huge milestones (level cap, tier set completion, legendaries)

**FOMO (Fear of Missing Out):**
- Weekly raid lockouts (miss a week = miss loot chance)
- Seasonal events (limited-time transmogs, achievements)
- Daily quests (miss a day = less efficient progression)

**Social Comparison (Future Features):**
- Leaderboards (fastest dungeon clears, highest DPS)
- Guild systems (collaborate on goals)
- Inspect other players' characters

**Sunk Cost Fallacy:**
- Time investment makes quitting harder
- Collection completion drives continued play
- Achievement progress % visible (85% → "just 15% more!")

---

## PvP Arena System (Future Content)

*This section describes the planned asynchronous PvP system for post-launch implementation.*

### PvP Design Philosophy

**Asynchronous PvP:**
Since Idle Raiders is an idle game, real-time PvP is not suitable. Instead, the Arena system uses AI-controlled representations of player characters fighting other AI-controlled player characters.

**Key Principles:**
- No real-time requirements
- Gear and talents matter, but skill expression through build optimization
- Separate PvP stat template to prevent PvE imbalance
- Seasons with resets for fresh competition
- Rewards focused on cosmetics and titles

---

### Arena Brackets

#### Solo Arena (1v1)
*Your character vs. another player's character.*

**Format:**
- Queue for match (instant via AI)
- Watch combat replay or skip to results
- Win/loss affects rating
- 10 matches per day (reset at daily reset)

**Best Classes for 1v1:**
| Tier | Classes | Reason |
|------|---------|--------|
| S | Rogue, Mage | Burst + Control |
| A | Warrior, Paladin | Sustain + Burst |
| B | Hunter, Priest | Utility-dependent |
| C | Druid | Jack-of-all-trades |

---

#### Duo Arena (2v2)
*Your character + 1 NPC companion vs. enemy team.*

**Format:**
- Select which companion to bring
- Complementary team composition matters
- 10 matches per day

**Popular Compositions:**
| Comp | Strategy |
|------|----------|
| Warrior + Healer | Sustained pressure |
| Rogue + Mage | Double DPS burst |
| Hunter + Paladin | Ranged + Support |
| Priest + Mage | Control + Damage |

---

#### Team Arena (3v3)
*Your character + 2 NPC companions vs. enemy team.*

**Format:**
- Full team composition choices
- Most strategic bracket
- 5 matches per day

**Meta Compositions:**
| Comp | Rating |
|------|--------|
| Warrior/Paladin/Priest | A-tier (sustain cleave) |
| Rogue/Mage/Priest | S-tier (RMP) |
| Hunter/Druid/Warrior | A-tier (jungle cleave) |
| Warlock/Shaman/Paladin | B-tier (drain) |

---

### Rating System

**Elo-Based Rating:**
```
Starting Rating: 1500
K-factor: 32 (new), 24 (established), 16 (high rating)

Rating Change = K × (Actual - Expected)
Expected = 1 / (1 + 10^((OpponentRating - YourRating) / 400))
```

**Rating Brackets:**
| Rating | Bracket | Population |
|--------|---------|------------|
| 0-1399 | Bronze | Bottom 40% |
| 1400-1599 | Silver | Next 30% |
| 1600-1799 | Gold | Next 20% |
| 1800-1999 | Platinum | Top 10% |
| 2000-2199 | Diamond | Top 3% |
| 2200+ | Gladiator | Top 0.5% |

---

### Season Structure

**Season Length:** 3 months

**Season Rewards:**
| Rating | Reward |
|--------|--------|
| Bronze | 100 Gold |
| Silver | 250 Gold, Bronze Weapon Skin |
| Gold | 500 Gold, Silver Weapon Skin |
| Platinum | 1,000 Gold, Gold Armor Skin |
| Diamond | 2,500 Gold, Platinum Mount |
| Gladiator | 5,000 Gold, Gladiator Title, Unique Mount |

**End-of-Season:**
- Ratings soft reset (Rating = (Current + 1500) / 2)
- Rewards distributed
- New season begins with updated balance

---

### PvP Stat Templates

**Stat Normalization:**
To prevent extreme gear gaps, PvP uses templates:

```
PvP Health = Base + (Gear HP × 0.5)
PvP Damage = Base + (Gear Damage × 0.6)
PvP Healing = Base + (Gear Healing × 0.6)

All ratings (crit, hit, haste) capped at 15%
Resilience reduces crit damage by 10% per 100 rating (max 40%)
```

**PvP-Specific Stats:**
| Stat | Effect | Source |
|------|--------|--------|
| Resilience | -crit damage taken | PvP gear only |
| PvP Power | +damage in PvP | PvP gear only |
| Tenacity | -CC duration | PvP gear only |

---

### PvP Gear

**Acquisition:**
- Purchase with Honor Points (earned from wins)
- Conquest Points (earned from rated wins)
- Weekly cap on Conquest

**Honor Gear (ilvl 70):**
| Slot | Cost | Stats |
|------|------|-------|
| Weapon | 2,000 HP | +Resilience |
| Chest | 1,500 HP | +PvP Power |
| Head | 1,200 HP | +Resilience |
| Other | 800 HP | Mixed |

**Conquest Gear (ilvl 78):**
| Slot | Cost | Weekly Cap |
|------|------|------------|
| Weapon | 2,200 CP | 1,650/week |
| Chest | 1,650 CP | 1,650/week |
| Head | 1,320 CP | 1,650/week |
| Other | 880 CP | 1,650/week |

---

### Arena AI Behavior

**Character AI Settings:**
Players can customize their character's AI for Arena:

**Offensive Priority:**
- Focus healer first
- Focus lowest HP
- Focus highest damage
- Focus random

**Defensive Priority:**
- Use defensive at 50/40/30/20% HP
- Save trinket for stun/silence/fear
- Kite when low HP (ranged)

**Ability Usage:**
- Use cooldowns early/late/optimal
- Interrupt priority (heals, CC, damage)
- CC usage (on cooldown, save for setup)

---

### Leaderboards

**Global Leaderboards:**
- Top 100 per bracket (1v1, 2v2, 3v3)
- Updated hourly
- Inspect top players' gear and talents
- Copy talent builds

**Personal Stats:**
- Win/Loss record
- Highest rating achieved
- Total matches played
- Class-specific stats (damage, healing, kills)

---

### Anti-Wintrading Measures

**Detection Systems:**
- Pattern recognition for suspicious matches
- Rating gain limits per hour
- Manual review for top 100
- Season bans for confirmed abuse

---

### PvP Achievements (150 points)

| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Arena Novice | Win 10 Arena matches | 10 | - |
| Arena Veteran | Win 100 Arena matches | 25 | - |
| Arena Master | Win 500 Arena matches | 50 | Title: "Arena Master" |
| Rising Star | Reach 1600 rating | 25 | - |
| Platinum Player | Reach 1800 rating | 25 | - |
| Diamond Hands | Reach 2000 rating | 50 | - |
| Gladiator | Reach 2200 rating | 100 | Title: "Gladiator" |
| Season Champion | Finish #1 in any bracket | 100 | Title: "Champion" |

---

## Guild System (Future Content)

*This section describes the planned Guild system for post-launch implementation.*

### Guild Design Philosophy

**Asynchronous Collaboration:**
Since Idle Raiders is primarily a single-player idle game, guilds function as loose cooperative groups that share progress, contribute to goals, and compete against other guilds without requiring real-time coordination.

**Key Principles:**
- No real-time requirements for guild activities
- Individual contributions aggregate toward shared goals
- Social features for community building
- Rewards that enhance solo play, not gatekeep it

---

### Guild Creation & Management

#### Creating a Guild

**Requirements:**
- Character level 20+
- 500 Gold creation fee
- Unique guild name (3-24 characters, alphanumeric + spaces)

**Guild Settings:**
- Guild name and tag (3-4 letter abbreviation)
- Guild description (500 characters max)
- Recruitment status: Open / Apply Only / Closed
- Minimum level requirement (0-60)

---

#### Guild Ranks

| Rank | Default Name | Permissions |
|------|--------------|-------------|
| 0 | Guild Master | All permissions, transfer leadership, disband |
| 1 | Officer | Invite, kick (below rank), edit MOTD, withdraw gold |
| 2 | Veteran | Invite, deposit to bank, access Rank 2 bank tabs |
| 3 | Member | Deposit to bank, access Rank 3 bank tabs |
| 4 | Initiate | View bank only, no deposits |

**Custom Ranks:** Guild Master can rename ranks and adjust permissions.

---

### Guild Bank

#### Bank Tabs

| Tab | Unlock Cost | Slots | Default Access |
|-----|-------------|-------|----------------|
| 1 | Free | 50 | All members |
| 2 | 1,000 Gold | 50 | Rank 3+ |
| 3 | 5,000 Gold | 50 | Rank 2+ |
| 4 | 10,000 Gold | 50 | Rank 1+ |
| 5 | 25,000 Gold | 50 | Rank 1+ |
| 6 | 50,000 Gold | 50 | Officers only |

**Total Capacity:** 300 item slots (6 tabs × 50 slots)

#### Gold Storage

- Guild gold pool (unlimited storage)
- Deposit: Any member
- Withdraw: Officer+ (daily limit configurable by GM)
- Withdrawal log visible to Officers+

---

### Guild Quests

Weekly guild quests require collective member contributions.

#### Weekly Guild Quests (Choose 3)

| Quest | Requirement | Reward |
|-------|-------------|--------|
| Dungeon Delvers | Guild completes 100 dungeons | 5,000 Guild XP, 1,000 Gold |
| Raid Ready | Guild kills 20 raid bosses | 10,000 Guild XP, 2,500 Gold |
| Arena Champions | Guild wins 200 Arena matches | 7,500 Guild XP, 2,000 Gold |
| Gold Rush | Guild earns 50,000 Gold | 5,000 Guild XP, Bonus gold split |
| Achievement Hunters | Guild earns 500 achievement points | 3,000 Guild XP, Title tokens |
| Level Grind | Guild gains 100 total levels | 4,000 Guild XP, XP potions |

**Contribution Tracking:**
- Individual contributions visible on guild roster
- Weekly leaderboard for top contributors
- Personal rewards scale with contribution %

---

### Guild Perks

Guilds earn XP from member activities and quests, unlocking permanent perks.

#### Guild Levels & Perks

| Level | XP Required | Perk Unlocked |
|-------|-------------|---------------|
| 1 | 0 | Guild created, Bank Tab 1 |
| 2 | 10,000 | +2% Gold from all sources |
| 3 | 25,000 | +5% Experience gain |
| 4 | 50,000 | Guild Hearthstone (instant return to capital) |
| 5 | 100,000 | +3% Gold, +2% XP (stacks with earlier) |
| 6 | 175,000 | +5% reputation gain |
| 7 | 275,000 | Guild Mount: Standard Guild Tabard Horse |
| 8 | 400,000 | +10% faster dungeon completion |
| 9 | 550,000 | +5% item drop rate (cosmetic items only) |
| 10 | 750,000 | Guild Mount: Armored Guild Warhorse |
| 11 | 1,000,000 | +5% Gold, +5% XP (stacks) |
| 12 | 1,300,000 | Reduced repair costs (50% off) |
| 13 | 1,650,000 | +10% reputation gain (stacks) |
| 14 | 2,050,000 | Guild Portal: Teleport to any capital |
| 15 | 2,500,000 | +5% raid damage |
| 16 | 3,000,000 | Bank Tab repair: Items don't lose durability |
| 17 | 3,600,000 | +10% Gold, +10% XP (final stack) |
| 18 | 4,300,000 | Guild Summon: Summon any member to your location |
| 19 | 5,100,000 | Legendary Guild Tabard (unique transmog) |
| 20 | 6,000,000 | Guild Mount: Legendary Phoenix (guild-exclusive) |

**Max Guild Level:** 20
**Total Bonuses at Max:** +20% Gold, +17% XP, +15% Reputation, +10% Dungeon Speed, +5% Raid Damage

---

### Guild Achievements

| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Founders | Create a guild | 10 | - |
| Growing Family | Reach 10 members | 10 | - |
| Full House | Reach 50 members | 25 | - |
| Massive Guild | Reach 100 members | 50 | - |
| Working Together | Complete 10 guild quests | 10 | - |
| Quest Masters | Complete 100 guild quests | 50 | - |
| Level 10 Guild | Reach guild level 10 | 25 | - |
| Level 20 Guild | Reach guild level 20 | 100 | Title: "Guildmaster" |
| Bank Hoarders | Store 1,000,000 Gold | 50 | - |
| Raid Team | Kill all T1 raid bosses in one week | 50 | - |
| Progression Guild | Kill all T3 raid bosses | 100 | Title: "Elite" |

---

## Profession System (Future Content)

*This section describes the planned Profession system for post-launch implementation.*

### Profession Design Philosophy

**Idle-Friendly Crafting:**
Professions provide passive benefits and crafting queues that progress while offline. No complex mini-games or real-time requirements.

**Key Principles:**
- Gathering happens automatically during combat/exploration
- Crafting queues process over time
- Crafted items competitive with dungeon drops
- No mandatory professions for endgame

---

### Gathering Professions

Each character can learn 2 gathering professions.

#### Mining

**Skill Cap:** 300
**Gathered Material:** Ore, Gems, Stone

| Skill Range | Zone Tier | Materials |
|-------------|-----------|-----------|
| 1-75 | Starter zones (1-20) | Copper Ore, Rough Stone |
| 75-150 | Mid zones (20-40) | Tin Ore, Bronze Ore, Jade |
| 150-225 | High zones (40-55) | Iron Ore, Gold Ore, Citrine |
| 225-275 | Endgame zones (55-60) | Thorium Ore, Arcane Crystal |
| 275-300 | Raids only | Dark Iron Ore, Blood of the Mountain |

**Passive Gathering:**
- While in a zone, gather 1 ore per 5 minutes of activity
- +50% gathering during dungeon runs
- Gathering bag holds 100 materials (expandable)

---

#### Herbalism

**Skill Cap:** 300
**Gathered Material:** Herbs, Flowers, Seeds

| Skill Range | Zone Tier | Materials |
|-------------|-----------|-----------|
| 1-75 | Starter zones | Silverleaf, Peacebloom |
| 75-150 | Mid zones | Bruiseweed, Briarthorn |
| 150-225 | High zones | Goldthorn, Khadgar's Whisker |
| 225-275 | Endgame zones | Dreamfoil, Mountain Silversage |
| 275-300 | Raids only | Black Lotus, Bloodvine |

---

#### Skinning

**Skill Cap:** 300
**Gathered Material:** Leather, Hide, Scales

| Skill Range | Enemy Level | Materials |
|-------------|-------------|-----------|
| 1-75 | Beasts 1-20 | Light Leather, Light Hide |
| 75-150 | Beasts 20-40 | Medium Leather, Medium Hide |
| 150-225 | Beasts 40-55 | Heavy Leather, Thick Hide |
| 225-275 | Beasts 55-60 | Rugged Leather, Rugged Hide |
| 275-300 | Raid beasts | Core Leather, Pristine Hide |

**Passive Skinning:**
- Automatically skin beasts killed in combat
- Skinning chance: 80% base + 0.1% per skill level

---

### Crafting Professions

Each character can learn 2 crafting professions.

#### Blacksmithing

**Skill Cap:** 300
**Creates:** Plate/Mail armor, Weapons, Weapon enhancements

**Sample Recipes:**

| Item | Skill | Materials | Stats |
|------|-------|-----------|-------|
| Copper Chain Belt | 25 | 6 Copper Ore | +3 Armor, +1 Stamina |
| Bronze Greatsword | 75 | 10 Bronze Ore, 2 Rough Stone | 15-22 Damage, 3.2 Speed |
| Iron Breastplate | 150 | 20 Iron Ore, 4 Heavy Leather | +180 Armor, +8 Stamina |
| Thorium Helm | 250 | 18 Thorium Ore, 1 Arcane Crystal | +320 Armor, +15 Stamina, +10 Strength |
| Arcanite Champion | 300 | 30 Thorium, 4 Arcane Crystal, 2 Essence of Fire | 82-136 Damage, 2.7 Speed, +20 Strength |

**Specializations (Skill 200+):**
- **Armorsmith:** Better armor recipes, +5% armor on crafted items
- **Weaponsmith:** Better weapon recipes, +3% damage on crafted weapons

---

#### Leatherworking

**Skill Cap:** 300
**Creates:** Leather/Mail armor, Armor kits, Bags

**Sample Recipes:**

| Item | Skill | Materials | Stats |
|------|-------|-----------|-------|
| Light Armor Kit | 25 | 4 Light Leather | Apply: +8 Armor to chest |
| Hillman's Cloak | 100 | 8 Medium Leather, 2 Bolt of Silk | +15 Armor, +5 Agility |
| Nightscape Tunic | 175 | 14 Heavy Leather, 2 Silken Thread | +110 Armor, +12 Agility, +8 Stamina |
| Warbear Harness | 250 | 22 Rugged Leather, 4 Cured Rugged Hide | +185 Armor, +20 Agility, +15 Stamina |
| Devilsaur Gauntlets | 300 | 8 Devilsaur Leather, 4 Rugged Leather | +95 Armor, +28 AP, +1% Crit |

**Specializations:**
- **Dragonscale:** Mail armor with elemental resistance
- **Elemental:** Enhanced leather with procs

---

#### Alchemy

**Skill Cap:** 300
**Creates:** Potions, Elixirs, Flasks, Transmutations

**Sample Recipes:**

| Item | Skill | Materials | Effect |
|------|-------|-----------|--------|
| Minor Healing Potion | 1 | 1 Silverleaf, 1 Peacebloom | Restore 70 Health |
| Swiftness Potion | 75 | 1 Swiftthistle, 1 Briarthorn | +50% Move Speed, 15 sec |
| Greater Mana Potion | 150 | 2 Goldthorn, 1 Khadgar's Whisker | Restore 700 Mana |
| Elixir of the Mongoose | 225 | 2 Dreamfoil, 1 Mountain Silversage | +25 Agility, +2% Crit, 1 hr |
| Flask of Supreme Power | 300 | 4 Dreamfoil, 3 Black Lotus, 1 Crystal Vial | +150 Spell Power, 2 hr (persists through death) |

**Transmutation (1/day):**
- Iron → Gold (Skill 225)
- Mithril → Truesilver (Skill 250)
- Arcanite Bar creation (Skill 275)

---

#### Enchanting

**Skill Cap:** 300
**Creates:** Permanent item enchantments

**Sample Enchants:**

| Enchant | Skill | Materials | Effect |
|---------|-------|-----------|--------|
| Minor Health | 1 | 1 Strange Dust | +5 Health to chest |
| Lesser Agility | 75 | 3 Soul Dust, 1 Lesser Astral Essence | +3 Agility to boots |
| Greater Strength | 150 | 4 Vision Dust, 2 Greater Nether Essence | +7 Strength to gloves |
| Superior Striking | 225 | 4 Dream Dust, 2 Large Brilliant Shard | +9 Weapon Damage |
| Crusader | 300 | 4 Large Brilliant Shard, 2 Righteous Orb | Chance on hit: Heal 100, +100 Strength for 15 sec |

**Disenchanting:**
- Destroy magic items to obtain materials
- Rarity determines materials received

---

### Crafting Queue System

**Queue Mechanics:**
- Queue up to 20 items for crafting
- Items craft over time (1-60 minutes based on complexity)
- Crafting continues while offline
- Notification when queue completes

**Crafting Time by Skill Requirement:**

| Skill Range | Base Craft Time |
|-------------|-----------------|
| 1-75 | 1 minute |
| 76-150 | 5 minutes |
| 151-225 | 15 minutes |
| 226-275 | 30 minutes |
| 276-300 | 60 minutes |

**Speed Bonuses:**
- Guild perk: -10% craft time
- Premium: -20% craft time
- Profession specialization: -15% for specialty items

---

## Mount System (Future Content)

*This section describes the planned Mount system for post-launch implementation.*

### Mount Design Philosophy

**Travel Time Reduction:**
In an idle game, mounts don't literally move faster—they reduce the time cost of activities that involve travel (zone transitions, dungeon runs, raid clears).

**Key Principles:**
- Mounts are primarily cosmetic with minor convenience
- Speed bonuses affect simulation time, not real-time
- Mount collection provides long-term goals
- No mount required for any content

---

### Mount Training

| Training Level | Cost | Requirement | Speed Bonus |
|----------------|------|-------------|-------------|
| Apprentice | 100 Gold | Level 20 | -10% activity time |
| Journeyman | 500 Gold | Level 40 | -20% activity time |
| Expert | 1,000 Gold | Level 60 | -30% activity time |
| Artisan (Flying*) | 5,000 Gold | Level 60 + Achievement | -40% activity time |

*Flying mounts are cosmetic; the speed bonus applies equally to all mount types at this tier.

---

### Mount Categories

#### Ground Mounts

**Basic Mounts (Level 20):**

| Mount | Source | Cost/Requirement |
|-------|--------|------------------|
| Chestnut Mare | Vendor | 80 Gold |
| Gray Wolf | Vendor | 80 Gold |
| Brown Kodo | Vendor | 80 Gold |
| Striped Nightsaber | Vendor | 80 Gold |
| Palomino | Vendor | 80 Gold |
| Black Stallion | Vendor | 80 Gold |

**Epic Mounts (Level 40):**

| Mount | Source | Cost/Requirement |
|-------|--------|------------------|
| Swift White Steed | Vendor | 800 Gold |
| Swift Gray Wolf | Vendor | 800 Gold |
| Great White Kodo | Vendor | 800 Gold |
| Swift Frostsaber | Vendor | 800 Gold |
| Swift Palomino | Vendor | 800 Gold |
| Swift Brown Steed | Vendor | 800 Gold |

---

#### Rare Mounts

**Dungeon Drops (0.5% drop rate):**

| Mount | Source | Visual |
|-------|--------|--------|
| Deathcharger's Reins | Baron Rivendare (Necropolis Academy) | Skeletal warhorse with blue flames |
| Swift Zulian Tiger | Shadowfang Crypts rare spawn | Orange tiger with tribal markings |
| Raven Lord | Whispering Pines hidden boss | Giant purple/black raven |

**Raid Drops (1% drop rate):**

| Mount | Source | Visual |
|-------|--------|--------|
| Fiery Warhorse | Charmaster Emberclaw (Heart of the Inferno) | Flaming horse with molten hooves |
| Ashes of Al'ar | Infernus the Undying (Heart of the Inferno) | Phoenix made of pure fire |
| Mimiron's Head | Cogmaster Prime (Citadel of the Damned) | Mechanical flying head |

---

#### Achievement Mounts

| Mount | Achievement Required | Visual |
|-------|---------------------|--------|
| Black War Bear | 100 Arena wins | Armored black bear |
| Red Proto-Drake | Glory of the Raider (all raid achievements) | Red dragon with armor |
| Violet Proto-Drake | What A Long, Strange Trip (all seasonal events) | Purple dragon |
| Ironbound Proto-Drake | Glory of the Ulduar Raider | Blue/silver mechanical dragon |
| Bloodbathed Frostbrood Vanquisher | Citadel Glory achievements | Undead frost dragon |

---

#### Reputation Mounts

| Mount | Faction | Reputation | Cost |
|-------|---------|------------|------|
| Winterspring Frostsaber | Wintersaber Trainers | Exalted | 900 Gold |
| Netherwing Drake | Netherwing | Exalted | 200 Gold |
| Cenarion War Hippogryph | Cenarion Expedition | Exalted | 1,600 Gold |
| Nether Ray | Sha'tari Skyguard | Exalted | 200 Gold |
| Talbuk (8 colors) | Kurenai/Mag'har | Exalted | 70 Gold each |

---

#### Special Mounts

**Battle Pass Exclusive (one per season):**

| Season | Mount | Visual |
|--------|-------|--------|
| 1 | Ember Steed | Horse with flame mane and tail |
| 2 | Glacial Wolf | Wolf with frost breath |
| 3 | Void Panther | Shadow panther with purple particles |
| 4 | Ancient Treant | Walking tree mount |
| 5 | Thunder Hawk | Electric eagle mount |
| 6 | Gilded Griffin | Gold and white griffin |

**Guild Mounts:**

| Mount | Guild Level | Visual |
|-------|-------------|--------|
| Guild Tabard Horse | 7 | Horse wearing guild tabard |
| Armored Guild Warhorse | 10 | Armored horse with guild banner |
| Legendary Phoenix | 20 | Phoenix in guild colors |

---

### Mount Collection Interface

**Mount Tab Display:**

```
╔══════════════════════════════════════════════════════════════╗
║  MOUNT COLLECTION                          [124/200 Mounts]  ║
╠══════════════════════════════════════════════════════════════╣
║  Filter: [All▼] [Ground▼] [Flying▼] [Aquatic▼]               ║
║  Sort: [Name▼] [Source▼] [Rarity▼]                           ║
╠══════════════════════════════════════════════════════════════╣
║  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            ║
║  │ ≋≋≋≋≋≋≋ │ │ ▓▓▓▓▓▓▓ │ │ ░░░░░░░ │ │ ▒▒▒▒▒▒▒ │            ║
║  │ HORSE   │ │ WOLF    │ │ ???     │ │ TIGER   │            ║
║  │ [OWNED] │ │ [OWNED] │ │ [LOCKED]│ │ [OWNED] │            ║
║  └─────────┘ └─────────┘ └─────────┘ └─────────┘            ║
║                                                              ║
║  SELECTED: Swift White Steed                                 ║
║  Source: Vendor (800 Gold)                                   ║
║  Speed: -20% activity time (Journeyman)                      ║
║  ─────────────────────────────────────────                   ║
║  [Set as Active]  [Preview]  [Favorite ☆]                    ║
╚══════════════════════════════════════════════════════════════╝
```

---

### Mount Achievements (100 points)

| Achievement | Requirement | Points | Reward |
|-------------|-------------|--------|--------|
| Apprentice Rider | Learn Apprentice Riding | 5 | - |
| Journeyman Rider | Learn Journeyman Riding | 10 | - |
| Expert Rider | Learn Expert Riding | 10 | - |
| Artisan Rider | Learn Artisan Riding | 25 | - |
| Stable Keeper | Collect 10 mounts | 10 | - |
| Mount Parade | Collect 25 mounts | 25 | Title: "The Rider" |
| Mountain o' Mounts | Collect 50 mounts | 50 | Mount: Albino Drake |
| We're Going to Need More Stables | Collect 100 mounts | 100 | Mount: Blue Dragonhawk |
| Mount Maniac | Collect 150 mounts | 150 | Mount: Heavenly Steed |
| Lord of the Reins | Collect 200 mounts | 200 | Title: "Lord of the Reins" |

---

## Technical Considerations

### Save System

**Save Data Structure:**
```json
{
  "character": {
    "name": "Thrognar",
    "class": "Warrior",
    "level": 45,
    "experience": 285000,
    "gold": 1247,
    "attributes": {
      "strength": 245,
      "agility": 108,
      "stamina": 198,
      "intellect": 42
    },
    "talents": {
      "arms": [1,1,1,3,5,3,5,2,1,3,5,1],
      "fury": [3,0,2,5,2,0,0,0,0,0,0,0],
      "protection": [0,0,0,0,0,0,0,0,0,0,0,0]
    }
  },
  "equipment": {
    "head": {"id": 12450, "enchant": 23},
    "neck": {"id": 14551, "enchant": null},
    ...
  },
  "inventory": [
    {"id": 15234, "quantity": 1, "slot": 0},
    {"id": 3456, "quantity": 20, "slot": 1},
    ...
  ],
  "quests": {
    "completed": [101, 102, 105, 230, ...],
    "active": [
      {"id": 345, "progress": [8, 12], "started": 1622547800}
    ]
  },
  "progression": {
    "dungeons_cleared": {"deadmines": 14, "scholomance": 3},
    "raid_lockouts": {
      "molten_core": {
        "week_start": 1622390400,
        "bosses_killed": [1, 2, 3]
      }
    },
    "reputations": {
      "ironforge": 18500,
      "stormwind": 12300
    }
  },
  "achievements": [1, 5, 12, 23, 45, 67, ...],
  "settings": {
    "auto_loot": true,
    "health_potion_threshold": 40,
    ...
  },
  "meta": {
    "created": 1620000000,
    "last_played": 1622547800,
    "total_playtime": 145200,
    "version": "1.0.0"
  }
}
```

**Save Frequency:**
- Auto-save every 60 seconds during active play
- Save on activity completion (quest, dungeon, etc.)
- Save on app close/minimize
- Cloud sync (optional): Save every 5 minutes, sync across devices

**Save File Protection:**
- Local encrypted save file
- Cloud backup (optional, requires account)
- Import/export save codes (base64 encoded JSON)

---

### Performance Optimization

**Combat Calculation Optimization:**
```python
# Instead of simulating every second in real-time
# Pre-calculate outcomes based on player stats

def calculate_combat_outcome(player, enemy, duration):
    # Calculate average DPS
    player_dps = calculate_player_dps(player)
    enemy_dps = calculate_enemy_dps(enemy)
    
    # Time to kill
    ttk_player_kills_enemy = enemy.health / player_dps
    ttk_enemy_kills_player = player.health / enemy_dps
    
    # Determine winner
    if ttk_player_kills_enemy < ttk_enemy_kills_player:
        return {
            "victory": True,
            "duration": ttk_player_kills_enemy,
            "player_health_remaining": player.health - (enemy_dps * ttk_player_kills_enemy),
            "experience": enemy.xp_reward,
            "loot": generate_loot(enemy)
        }
    else:
        return {
            "victory": False,
            "duration": ttk_enemy_kills_player,
            "player_health_remaining": 0
        }
```

**Database Structure (Items):**
- Procedurally generated items based on formulas (not 10,000 hardcoded items)
- Template system: Base item + level + rarity → generated stats
- Special items (legendaries, set pieces) hardcoded

**Offline Calculation:**
```python
def process_offline_progress(last_played_time, current_time):
    offline_duration = current_time - last_played_time
    max_offline = 18 * 3600  # 18 hours in seconds
    
    effective_duration = min(offline_duration, max_offline)
    
    # Get last activity
    activity = player.last_activity  # e.g., "questing_in_westfall"
    
    # Calculate how many cycles completed
    activity_duration = get_activity_duration(activity)  # e.g., 15 minutes
    completed_cycles = effective_duration // activity_duration
    
    # Apply rewards
    for i in range(completed_cycles):
        apply_activity_rewards(player, activity)
        check_for_death(player)  # Stop if died
        if player.health <= 0:
            break
    
    # Generate summary
    return offline_summary(completed_cycles, activity)
```

---

### Platform Considerations

**Target Platforms:**
- **Primary:** Mobile (iOS, Android)
- **Secondary:** PC (Steam, browser-based)
- **Future:** Console (Switch, if viable)

**Mobile-Specific Design:**
- Touch-friendly UI (large buttons, minimal text input)
- Portrait mode support (easier one-handed play)
- Battery optimization (lightweight graphics, efficient processing)
- Notification system (dungeon completed, character died, etc.)

**PC-Specific Features:**
- Keyboard shortcuts for common actions
- Mouse hover tooltips (more detailed)
- Higher resolution asset support
- Longer play sessions expected (adjust pacing)

---

### Balancing Philosophy

**Core Balancing Goals:**
1. **No Dead Content:** All dungeons/raids remain relevant (badges, transmog)
2. **Multiple Viable Specs:** All talent trees functional for their role
3. **Gear Treadmill:** Always something better to chase
4. **Time Investment = Reward:** More time = more power (no RNG walls)

**Balancing Metrics to Track:**
- Average time to level 60 (target: 60-80 hours)
- Average time to first raid-ready (target: +10-15 hours post-60)
- Player retention at 1 day, 7 days, 30 days
- Most/least popular classes (adjust if skewed)
- Most/least popular specs (buffs/nerfs as needed)

**Patch Cycle:**
- Balance patches every 2 weeks (tuning)
- Content patches every 2-3 months (new dungeons, raids)
- Major expansions every 6-12 months (new level cap, zones)

---

## Changelog

### Version 1.8 (February 2, 2026)
- Added complete Battle Pass reward track (50 levels with Free/Premium tracks)
- Pass XP sources, catch-up mechanics, season themes
- Added Guild System (Future Content)
  - Guild creation, ranks, permissions
  - Guild bank with 6 tabs (300 slots)
  - Weekly guild quests and contribution tracking
  - 20 guild levels with cumulative perks (+20% Gold, +17% XP, etc.)
- Added Profession System (Future Content)
  - 3 Gathering professions: Mining, Herbalism, Skinning
  - 4 Crafting professions: Blacksmithing, Leatherworking, Alchemy, Enchanting
  - Skill-tiered materials and recipes
  - Idle-friendly crafting queue system
- Added Mount System (Future Content)
  - Mount training tiers with activity time reduction
  - Ground mounts, rare dungeon/raid drops, achievement mounts
  - Reputation mounts, Battle Pass exclusives, Guild mounts
  - Mount collection interface mockup
- Expanded Threat Mechanics with AI simulation details

### Version 1.7 (February 2, 2026)
- Added PvP Arena System (Future Content section)
- Asynchronous 1v1, 2v2, 3v3 brackets
- Elo-based rating system with seasonal rewards
- PvP stat templates and gear
- Arena AI customization
- Leaderboards and anti-wintrading measures

### Version 1.6 (February 2, 2026)
- Expanded Achievement System with full specifications
- 8 achievement categories with 2,500+ total points available
- Point-based milestone rewards
- Meta-achievements and Feats of Strength
- Class-specific achievement tracks

### Version 1.5 (February 2, 2026)
- Added Appendix F: Complete Talent Trees (all 21 specializations)
- Full 7-tier talent specifications for all classes
- Capstone talents and synergy guidelines
- Recommended specs for idle combat by role

### Version 1.4 (February 2, 2026)
- Added Section 4.7: Hunter Pet System
- Pet families (Ferocity, Tenacity, Cunning) with unique abilities
- Pet stats, scaling, and inheritance formulas
- Training points and pet skill trees
- Happiness and loyalty mechanics
- Pet AI behavior for idle combat

### Version 1.3 (February 2, 2026)
- Added Appendix E: Complete Raid Boss Mechanics (all 42 bosses across 4 raids)
- Heart of the Inferno (T1): 10 bosses with entry-level mechanics
- Drakescale Sanctum (T2): 8 bosses with tank-swap and multi-phase encounters
- Hive of the Swarm-God (T2.5): 9 bosses with unique insectoid mechanics
- Citadel of the Damned (T3): 15 bosses with highest complexity encounters
- Full ability lists, enrage timers, phase breakdowns, and loot tables per boss
- Legendary item specifications for each raid tier

### Version 1.2 (February 2, 2026)
- Added Appendix D: Complete Dungeon Loot Tables (all 15 dungeons)
- 50+ unique bosses with original fantasy naming
- 200+ items with level-appropriate stat scaling
- Replaced placeholder loot examples with comprehensive tables
- Added stat scaling formulas and rarity distribution guidelines

### Version 1.1 (February 2, 2026)
- Added Appendix B: Original Fantasy Naming Compendium
- Added Appendix C: MMO to Incremental Design Translation
- Added NPC Companion system specification
- Verified all formulas against shared/constants/gameConfig.ts
- Documented balance issues for Backend Agent review
- Added engagement loop design framework
- Added depth layering for player types

### Version 1.0 (February 1, 2026)
- Initial comprehensive GDD
- All 7 class specifications
- Combat mechanics and formulas
- Dungeon and raid structure
- UI/UX mockups
- Monetization philosophy
- Technical considerations

---

## Appendix

### Class Balance Matrix

Quick reference for attribute scaling:

| Class | STR | AGI | INT | STA | Primary Role | Resources |
|-------|-----|-----|-----|-----|--------------|-----------|
| Warrior | ●●● | ○ | - | ●● | Melee DPS/Tank | Rage |
| Paladin | ●● | - | ●● | ●● | Hybrid (All) | Mana |
| Hunter | - | ●●● | ○ | ● | Ranged DPS | Mana |
| Rogue | ○ | ●●● | - | ● | Melee DPS | Energy/Combo |
| Priest | - | - | ●●● | ●● | Healer/Caster DPS | Mana |
| Mage | - | - | ●●● | ● | Caster DPS | Mana |
| Druid | ●● | ●● | ●● | ●● | Hybrid (All) | Mana/Rage/Energy |

**Legend:** ●●● = Excellent scaling | ●● = Good scaling | ○ = Minor scaling | - = No/minimal scaling

---

### Appendix D: Complete Dungeon Loot Tables

All items use original Idle Raiders naming. Stats scale based on dungeon level using the formula: Primary = (ilvl × 0.5) × Slot Weight, Secondary = (ilvl × 0.3) × Slot Weight.

---

#### 1. Cindermaw Caverns (Level 15-18)
*A volcanic cave system inhabited by fire elementals and their orc cultist masters.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Flamewarden Gorrak** | Charred Leather Tunic | Chest (Leather) | Uncommon | +8 AGI, +6 STA |
| | Ember-Touched Gloves | Hands (Mail) | Uncommon | +5 STR, +4 STA |
| | Gorrak's Cinderblade | Main Hand (Sword) | Uncommon | 12-23 dmg, +4 STR |
| **Molten Lurker** | Slag-Encrusted Shield | Off Hand (Shield) | Uncommon | 420 Armor, +6 STA, +15 Block |
| | Lavawalker Boots | Feet (Plate) | Uncommon | +5 STR, +5 STA |
| | Crystallized Magma Shard | Trinket | Uncommon | +8 Fire Resistance |
| **Pyroclast the Burning** *(Final)* | Pyroclast's Molten Blade | Two-Hand (Sword) | Rare | 28-45 dmg, +10 STR, +6 STA |
| | Volcanic Shoulderguards | Shoulders (Plate) | Rare | +8 STR, +7 STA, +5 Fire Res |
| | Cindermaw Heart | Trinket | Rare | Equip: 2% chance on hit to deal 15 fire damage |
| | Ashen Robes | Chest (Cloth) | Uncommon | +9 INT, +6 STA, +5 Spirit |

---

#### 2. The Hollowed Depths (Level 17-21)
*An abandoned mine complex overtaken by the Blackmantle Brotherhood, a band of ruthless smugglers.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Ironjaw the Overseer** | Taskmaster's Leather Belt | Waist (Leather) | Uncommon | +6 AGI, +5 STA |
| | Overseer's Cudgel | Main Hand (Mace) | Uncommon | 14-26 dmg, +5 STR |
| | Miners' Hardhat | Head (Leather) | Uncommon | +7 STA, +4 AGI |
| **Cogsworth's Shredder** | Shredder Operator's Goggles | Head (Cloth) | Uncommon | +8 INT, +5 STA |
| | Mechanical Pauldrons | Shoulders (Mail) | Rare | +7 AGI, +6 STA, +8 AP |
| | Cogsworth's Pocket Wrench | Trinket | Uncommon | Use: Restore 150 health (5 min cooldown) |
| | Reinforced Mining Vest | Chest (Mail) | Uncommon | +8 AGI, +7 STA |
| **Grimjaw the Enforcer** | Enforcer's Cutlass | Main Hand (Sword) | Rare | 18-34 dmg, +7 AGI, +4 STA |
| | Grimjaw's Heavy Knuckles | Hands (Plate) | Uncommon | +6 STR, +5 STA |
| | Intimidator's Shoulderpads | Shoulders (Leather) | Uncommon | +6 AGI, +5 STA |
| **Corwin Blackmantle** *(Final)* | Blackmantle's Saber | Main Hand (Sword) | Rare | 22-38 dmg, +9 AGI, +6 STA, +12 AP |
| | Cape of the Brotherhood | Back | Rare | +10 AGI, +6 STA, +8 AP |
| | Blackmantle's Chestpiece | Chest (Leather) | Epic | +14 AGI, +10 STA, +1% Crit |
| | Smuggler's Eyepatch | Head (Leather) | Rare | +8 AGI, +6 STA, +0.5% Hit |
| | Corrupted Gold Medallion | Neck | Rare | +8 AGI, +6 STA |

---

#### 3. Serpent's Lament (Level 18-25)
*A network of underground caverns where the druids of the Fang conduct dark nature rituals.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Viper Lord Sethrix** | Serpentscale Leggings | Legs (Leather) | Uncommon | +9 AGI, +7 STA |
| | Fanged Striker | Main Hand (Dagger) | Uncommon | 11-22 dmg, +6 AGI, Nature Proc |
| | Viper Hood | Head (Leather) | Uncommon | +7 AGI, +5 STA, +6 Nature Res |
| **Lady Anacondria** | Serpent's Coil | Staff | Rare | 32-52 dmg, +12 INT, +8 Spirit |
| | Anacondria's Robes | Chest (Cloth) | Rare | +11 INT, +8 STA, +10 Spirit |
| | Scaled Bracers of the Fang | Wrist (Leather) | Uncommon | +5 AGI, +4 STA |
| **Pythonas the Dreamer** | Dreamer's Circlet | Head (Cloth) | Rare | +10 INT, +7 STA, +8 Spirit |
| | Nightmare Staff | Staff | Uncommon | 28-46 dmg, +10 INT, +6 Spirit |
| | Robes of Living Sleep | Chest (Cloth) | Uncommon | +9 INT, +6 STA, +8 Spirit |
| **Verdan the Evergrowing** *(Final)* | Living Branch | Two-Hand (Mace) | Rare | 36-58 dmg, +14 STR, +10 STA |
| | Moss-Covered Pauldrons | Shoulders (Leather) | Rare | +10 AGI, +8 STA, +8 Nature Res |
| | Heart of the Evergrowing | Trinket | Epic | +15 Nature Resistance, Equip: Restore 5 HP/5s |
| | Verdant Keeper's Aim | Ranged (Bow) | Rare | 18-34 dmg, +8 AGI, +6 STA |

---

#### 4. Dreadhollow Manor (Level 22-30)
*A haunted estate ruled by the cursed Shadowmane family, now twisted into worgen and undead.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Razortooth the Butler** | Butler's Formal Vest | Chest (Cloth) | Uncommon | +11 INT, +8 STA |
| | Razortooth's Serving Tray | Off Hand (Shield) | Uncommon | 580 Armor, +8 STA, +18 Block |
| | Cursed Dinner Knife | Main Hand (Dagger) | Uncommon | 16-30 dmg, +7 AGI |
| **Baron Ashbury** | Ghoulskin Leggings | Legs (Cloth) | Rare | +12 INT, +9 STA, +10 Spirit |
| | Baron's Scepter | Main Hand (Mace) | Rare | 24-42 dmg, +10 INT, +8 Spirit |
| | Ashbury's Signet | Ring | Uncommon | +8 INT, +6 Spirit |
| **Commander Springvale** | Phantom Legplates | Legs (Plate) | Rare | +13 STR, +11 STA |
| | Springvale's Sharpened Blade | Main Hand (Sword) | Rare | 28-48 dmg, +11 STR, +8 STA |
| | Commander's Crest | Off Hand (Shield) | Uncommon | 640 Armor, +10 STA, +22 Block |
| **Lord Aldric Shadowmane** *(Final)* | Shadowmane's Mantle | Shoulders (Cloth) | Rare | +12 INT, +9 STA, +12 Shadow Res |
| | Cursed Nobleman's Ring | Ring | Rare | +10 INT, +8 STA, +15 Spell Power |
| | Worgen Claw Necklace | Neck | Epic | +14 AGI, +10 STA, +18 AP |
| | Fang of the Wolf Lord | Main Hand (Dagger) | Epic | 26-44 dmg, +12 AGI, +8 STA, Proc: Bleed |
| | Shadowmane Family Blade | Two-Hand (Sword) | Rare | 52-84 dmg, +16 STR, +12 STA |

---

#### 5. Drowned Temple (Level 24-32)
*An ancient elven temple submerged beneath the tides, now home to naga and old god cultists.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Ghamoo-ra the Ancient** | Ancient Tortoise Shell | Off Hand (Shield) | Rare | 720 Armor, +12 STA, +26 Block |
| | Ghamoo-ra's Scale Mail | Chest (Mail) | Uncommon | +11 AGI, +10 STA |
| | Petrified Barnacle Ring | Ring | Uncommon | +8 STA, +6 Spirit |
| **Lady Sarevess** | Naga Heartpiercer | Ranged (Bow) | Rare | 22-40 dmg, +10 AGI, +7 STA |
| | Sarevess's Trident | Polearm | Uncommon | 38-62 dmg, +12 AGI, +8 STA |
| | Sea Witch's Bag | Trinket | Uncommon | +50 Mana, +4 Spirit |
| **Twilight Lord Kelris** | Kelris's Invoker Mantle | Shoulders (Cloth) | Rare | +13 INT, +10 STA, +14 SP |
| | Staff of the Drowned | Staff | Rare | 42-68 dmg, +14 INT, +10 Spirit, +18 SP |
| | Twilight Orb | Off Hand | Uncommon | +10 INT, +8 Spirit |
| **Aku'mai the Devourer** *(Final)* | Aku'mai's Fin | Main Hand (Fist) | Rare | 24-42 dmg, +12 AGI, +9 STA |
| | Leggings of the Fathoms | Legs (Mail) | Rare | +14 AGI, +12 STA, +12 Frost Res |
| | Devourer's Gullet | Trinket | Epic | Equip: +20 Frost Res, Use: Absorb 300 damage (3 min CD) |
| | Strike of the Drowned | Two-Hand (Mace) | Epic | 58-94 dmg, +18 STR, +14 STA, Proc: Frost damage |
| | Blessed Prayer Beads | Neck | Rare | +12 INT, +10 Spirit, +16 Healing |

---

#### 6. Gearwreck Foundry (Level 29-38)
*A gnomish city overrun by troggs and malfunctioning mechanicals.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Grubbis & Chomper** | Chomper's Feeding Tube | Main Hand (Mace) | Uncommon | 28-48 dmg, +10 STR, +8 STA |
| | Grubbis's Paw | Hands (Leather) | Uncommon | +9 AGI, +7 STA |
| | Trogg Slicer | Main Hand (Sword) | Uncommon | 26-44 dmg, +9 STR |
| **Electrocutioner 3000** | Charged Gear | Trinket | Rare | Equip: +12 Nature Res, 3% spell crit |
| | Electrocutioner's Coil | Wrist (Mail) | Rare | +10 AGI, +9 STA, +10 Nature Res |
| | Sparking Static Cloak | Back | Uncommon | +10 AGI, +8 STA |
| **Mekgineer Overload** | Overload's Core | Trinket | Rare | Use: Deal 150 AoE damage (5 min CD) |
| | Servo-Arm Gauntlets | Hands (Plate) | Rare | +12 STR, +10 STA |
| | Manual Crowd Pummeler | Main Hand (Mace) | Rare | 32-54 dmg, +14 STR, Proc: Haste |
| **Mekgineer Thermaplugg** *(Final)* | Thermaplugg's Left Arm | Main Hand (Mace) | Rare | 38-64 dmg, +16 STR, +12 STA |
| | Geargrinder's Vest | Chest (Mail) | Rare | +16 AGI, +14 STA |
| | Electromagnetic Gigaflux Reactivator | Head (Cloth) | Epic | +18 INT, +14 STA, +22 SP |
| | Schematic Mind | Trinket | Epic | Equip: +30 SP, Use: Next spell costs no mana (3 min CD) |
| | Thermaplugg's Central Core | Neck | Rare | +14 INT, +12 STA |

---

#### 7. Crimson Sanctum (Level 34-45)
*A sprawling cathedral complex occupied by the fanatical Scarlet Order.*

**Wings:** Graveyard, Library, Armory, Cathedral

**Graveyard Wing:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Interrogator Volkhan** | Volkhan's Hood | Head (Cloth) | Rare | +16 INT, +12 STA, +18 SP |
| | Interrogator's Shackles | Wrist (Cloth) | Uncommon | +10 INT, +8 STA |
| | Bloody Brass Knuckles | Main Hand (Fist) | Uncommon | 28-48 dmg, +12 AGI |
| **Bloodmage Tyranna** | Bloodmage's Robes | Chest (Cloth) | Rare | +18 INT, +14 STA, +24 SP |
| | Orb of Burning Invocations | Off Hand | Rare | +14 INT, +20 Fire SP |
| | Tyranna's Cord | Waist (Cloth) | Uncommon | +12 INT, +10 STA |

**Library Wing:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Houndmaster Loksey** | Houndmaster's Bow | Ranged (Bow) | Rare | 32-54 dmg, +14 AGI, +10 STA |
| | Wolfslayer's Leggings | Legs (Mail) | Uncommon | +14 AGI, +12 STA |
| | Dog Whistle | Trinket | Rare | Use: Summon wolfhound pet for 30s (10 min CD) |
| **Arcanist Doan** | Hypnotic Blade | Main Hand (Dagger) | Rare | 28-48 dmg, +14 INT, +18 SP |
| | Mantle of Doan | Shoulders (Cloth) | Rare | +16 INT, +12 STA, +20 SP |
| | Illusionary Rod | Staff | Epic | 56-92 dmg, +22 INT, +16 STA, +28 SP |

**Armory Wing:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Herod the Champion** | Herod's Raging Berserker Helm | Head (Plate) | Rare | +20 STR, +16 STA |
| | Ravager | Two-Hand (Axe) | Epic | 68-114 dmg, +24 STR, +18 STA, Proc: Whirlwind |
| | Herod's Shoulder | Shoulders (Plate) | Rare | +18 STR, +14 STA |
| | Scarlet Leggings | Legs (Plate) | Uncommon | +16 STR, +14 STA |

**Cathedral Wing:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **High Inquisitor Fairbanks** | Inquisitor's Shawl | Back | Rare | +14 INT, +12 STA, +16 Spirit |
| | Dusty Prayer Book | Off Hand | Uncommon | +12 INT, +10 Spirit |
| **Scarlet Commander Morgraine** | Morgraine's Might | Main Hand (Mace) | Rare | 42-70 dmg, +18 STR, +14 STA |
| | Aegis of the Scarlet Commander | Off Hand (Shield) | Rare | 920 Armor, +16 STA, +34 Block |
| | Gauntlets of Divinity | Hands (Plate) | Rare | +16 STR, +14 STA |
| **Arch-Confessor Seraphine** *(Final)* | Seraphine's Righteous Fire | Main Hand (Mace) | Epic | 48-80 dmg, +20 INT, +16 STA, +32 Healing |
| | Whitemane's Chapeau | Head (Cloth) | Epic | +24 INT, +18 STA, +30 SP, +28 Healing |
| | Triune Amulet | Neck | Rare | +16 INT, +14 Spirit, +22 Healing |
| | Scarlet Crusader's Breastplate | Chest (Plate) | Rare | +22 STR, +20 STA |

---

#### 8. Thornbarrow Crypt (Level 36-44)
*An underground burial complex of the quilboar, now overrun by undead.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Tuten'kash** | Tuten'kash's Carapace | Chest (Mail) | Rare | +18 AGI, +16 STA |
| | Silky Spider Cape | Back | Uncommon | +12 AGI, +10 STA |
| | Death's Head Vestments | Chest (Cloth) | Uncommon | +14 INT, +12 STA |
| **Mordresh Fire Eye** | Mordresh's Lifeless Skull | Off Hand | Rare | +16 INT, +14 SP |
| | Burning Skull Pendant | Neck | Rare | +14 INT, +12 STA, +16 Fire SP |
| | Glowing Eye of Mordresh | Trinket | Uncommon | Equip: +18 Fire SP |
| **Glutton** | Glutton's Cleaver | Main Hand (Axe) | Rare | 38-64 dmg, +16 STR, +12 STA |
| | Fleshhide Shoulders | Shoulders (Leather) | Uncommon | +14 AGI, +12 STA |
| **Amnennar the Coldbringer** *(Final)* | Coldrage Dagger | Main Hand (Dagger) | Rare | 34-58 dmg, +14 AGI, +12 STA, Frost Proc |
| | Robes of the Lich | Chest (Cloth) | Epic | +22 INT, +18 STA, +28 SP, +20 Frost SP |
| | Amnennar's Wraithplate | Chest (Plate) | Rare | +20 STR, +18 STA, +18 Frost Res |
| | Deathchill Armor | Chest (Mail) | Rare | +18 AGI, +16 STA, +14 Frost Res |
| | Icemetal Barbute | Head (Plate) | Epic | +22 STR, +20 STA, +20 Frost Res |

---

#### 9. Titan's Repose (Level 41-51)
*An ancient titan excavation site filled with troggs, earthen, and powerful stone guardians.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Revelosh** | Revelosh's Spaulders | Shoulders (Mail) | Rare | +18 AGI, +16 STA |
| | Revelosh's Armguards | Wrist (Mail) | Uncommon | +12 AGI, +10 STA |
| | The Rockpounder | Main Hand (Mace) | Rare | 44-74 dmg, +18 STR, +14 STA |
| **Ironaya** | Stoneslayer | Two-Hand (Sword) | Rare | 72-120 dmg, +24 STR, +20 STA |
| | Ironshod Bludgeon | Main Hand (Mace) | Rare | 42-70 dmg, +18 STR, +14 STA |
| | Ironaya's Bracers | Wrist (Plate) | Uncommon | +14 STR, +12 STA |
| **Obsidian Sentinel** | Obsidian Plate Armor | Chest (Plate) | Rare | +24 STR, +22 STA |
| | The Shatterer | Main Hand (Mace) | Rare | 46-78 dmg, +20 STR, +16 STA, Proc: Armor shred |
| **Archaedas** *(Final)* | Archaedas's Stone Scepter | Main Hand (Mace) | Epic | 52-88 dmg, +24 STR, +20 STA |
| | Stoneslate Legplates | Legs (Plate) | Epic | +28 STR, +24 STA |
| | Earthen Rod | Staff | Rare | 62-104 dmg, +24 INT, +20 Spirit, +28 SP |
| | The Gavel of the Makers | Two-Hand (Mace) | Epic | 84-140 dmg, +32 STR, +26 STA, Proc: Stun |
| | Titan's Sigil | Trinket | Rare | +40 Armor, +15 to all resistances |

---

#### 10. Sandscar Ruins (Level 44-54)
*A troll city buried in the desert, now inhabited by the Sandfury tribe.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Antusul** | Sang'thraze the Deflector | Main Hand (Sword) | Rare | 42-72 dmg, +18 AGI, +14 STA |
| | Sandfury Sandals | Feet (Cloth) | Uncommon | +14 INT, +12 STA |
| | Basilisk Hide Pants | Legs (Leather) | Rare | +20 AGI, +18 STA |
| **Witch Doctor Zum'rah** | Zum'rah's Vexing Cane | Staff | Rare | 58-98 dmg, +22 INT, +18 Spirit, +26 SP |
| | Hexweave Mantle | Shoulders (Cloth) | Rare | +18 INT, +14 STA, +20 SP |
| | Bad Mojo Mask | Head (Cloth) | Uncommon | +16 INT, +14 STA |
| **Nekrum Gutchewer & Sezz'ziz** | Nekrum's Medallion | Neck | Rare | +16 STR, +14 STA |
| | Sezz'ziz's Voodoo Claw | Main Hand (Fist) | Rare | 38-64 dmg, +16 AGI, +12 STA |
| | Jinxed Hoodoo Kilt | Legs (Cloth) | Uncommon | +18 INT, +14 STA |
| **Chief Ukorz Sandscalp** *(Final)* | Executioner's Cleaver | Two-Hand (Axe) | Epic | 82-138 dmg, +30 STR, +24 STA |
| | Big Bad Pauldrons | Shoulders (Plate) | Epic | +26 STR, +22 STA |
| | Sandscar Bracers | Wrist (Plate) | Rare | +18 STR, +16 STA |
| | Jang'thraze the Protector | Main Hand (Sword) | Rare | 44-74 dmg, +20 AGI, +16 STA |
| | The Sultan's Seal | Ring | Rare | +14 AGI, +12 STA, +18 AP |

---

#### 11. Earthmother's Tomb (Level 46-55)
*A vast cavern system sacred to centaur clans, corrupted by elemental forces.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Noxxion** | Noxxious Shooter | Ranged (Gun) | Rare | 38-66 dmg, +18 AGI, +14 STA |
| | Heart of Noxxion | Trinket | Rare | Equip: +22 Nature Res, Use: Cleanse poison |
| | Vinerot Sandals | Feet (Leather) | Uncommon | +16 AGI, +14 STA |
| **Razorlash** | Claw of Celebras | Main Hand (Dagger) | Rare | 40-68 dmg, +18 AGI, +14 STA, Nature Proc |
| | Chloromesh Girdle | Waist (Leather) | Rare | +18 AGI, +16 STA |
| | Verdant Footpads | Feet (Leather) | Uncommon | +16 AGI, +14 STA |
| **Celebras the Cursed** | Celebras's Rod | Staff | Rare | 64-108 dmg, +26 INT, +22 Spirit, +30 SP |
| | Soothsayer's Headdress | Head (Cloth) | Rare | +22 INT, +18 STA, +24 SP |
| **Princess Theradras** *(Final)* | Blackstone Ring | Ring | Rare | +18 STA, +30 Armor |
| | Gemshard Heart | Trinket | Epic | +100 Health, Use: Stone Shield (500 absorb, 5 min CD) |
| | Princess Theradras's Scepter | Main Hand (Mace) | Epic | 52-88 dmg, +24 INT, +20 STA, +32 SP |
| | Elemental Rockridge Leggings | Legs (Mail) | Epic | +28 AGI, +24 STA |
| | Thrash Blade | Main Hand (Sword) | Rare | 46-78 dmg, +20 STR, Proc: Extra attack |

---

#### 12. Serpentshrine Temple (Level 50-56)
*A sunken temple to an ancient serpent god, overrun by trolls and dragonkin.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Atal'alarion** | Atal'ai Spaulders | Shoulders (Mail) | Rare | +20 AGI, +18 STA |
| | Atal'ai Gloves | Hands (Leather) | Uncommon | +16 AGI, +14 STA |
| | Atal'ai Breastplate | Chest (Mail) | Uncommon | +22 AGI, +20 STA |
| **Dreamscythe & Weaver** | Dragon's Call | Main Hand (Sword) | Rare | 46-78 dmg, +20 STR, +16 STA, Proc: Summon Whelp |
| | Drakeclaw Band | Ring | Rare | +16 AGI, +14 STA, +20 AP |
| | Wyrmfury Pauldrons | Shoulders (Plate) | Rare | +22 STR, +20 STA |
| **Avatar of Hakkar** | Embrace of the Wind Serpent | Chest (Cloth) | Rare | +24 INT, +20 STA, +28 SP |
| | Windscale Sarong | Legs (Leather) | Rare | +22 AGI, +20 STA |
| **Shade of Eranikus** *(Final)* | Dragon's Eye | Trinket | Epic | +20 to all resistances, Use: See invisibility |
| | Dire Nail | Main Hand (Fist) | Rare | 44-74 dmg, +20 AGI, +16 STA |
| | Blade of the Wretched | Main Hand (Sword) | Epic | 52-88 dmg, +24 AGI, +20 STA, +30 AP |
| | Nightfall Drape | Back | Rare | +18 AGI, +16 STA, +22 AP |
| | Moss Cinch | Waist (Leather) | Rare | +20 AGI, +18 STA |

---

#### 13. Molten Citadel (Level 55-60)
*A massive underground fortress controlled by the Dark Iron dwarves and their fire elemental masters.*

**This dungeon has 7 mini-bosses and 1 final boss across multiple wings.**

**Detention Block:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **High Interrogator Gerstahn** | Arbiter's Robe | Chest (Cloth) | Rare | +26 INT, +22 STA, +32 SP |
| | Kentic Amice | Shoulders (Cloth) | Rare | +22 INT, +18 STA, +24 SP |
| | Interrogator's Shackles | Wrist (Plate) | Uncommon | +18 STA, +16 STR |

**Shadowforge City:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Lord Incendius** | Cinderhide Armsplints | Wrist (Leather) | Rare | +18 AGI, +16 STA, +16 Fire Res |
| | Flame Walkers | Feet (Plate) | Rare | +22 STR, +20 STA, +18 Fire Res |
| | Incendic Bracers | Wrist (Mail) | Uncommon | +16 AGI, +14 STA |
| **Bael'Gar** | Sash of the Burning Heart | Waist (Cloth) | Rare | +20 INT, +18 STA, +24 Fire SP |
| | Bael'Gar's Favor | Ring | Rare | +16 INT, +14 STA, +20 Fire SP |
| **General Angerforge** | Angerforge's Battle Axe | Main Hand (Axe) | Rare | 50-84 dmg, +24 STR, +20 STA |
| | Force of Will | Trinket | Rare | +100 Armor, Use: +70 Armor for 20s |
| | Warstrife Leggings | Legs (Plate) | Rare | +28 STR, +26 STA |

**The Grim Guzzler (Tavern):**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Phalanx** | Bloodfist | Main Hand (Fist) | Rare | 48-82 dmg, +22 STR, +18 STA, Proc: Lifesteal |
| | Battlechaser's Greaves | Feet (Plate) | Rare | +22 STR, +20 STA |
| **Plugger Spazzring** | Barman's Shanker | Main Hand (Dagger) | Rare | 44-74 dmg, +20 AGI, +16 STA |
| | Mixologist's Tunic | Chest (Leather) | Uncommon | +22 AGI, +20 STA |

**Imperial Seat:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Ambassador Flamelash** | Flameguard Gauntlets | Hands (Plate) | Rare | +24 STR, +22 STA, +20 Fire Res |
| | Cape of the Fire Salamander | Back | Rare | +20 INT, +18 STA, +28 Fire SP |
| **Emperor Dagran Thaurissan** *(Final)* | Ironfoe | Main Hand (Mace) | Epic | 56-96 dmg, +28 STR, +24 STA, Proc: Extra attacks |
| | Hand of Justice | Trinket | Epic | Equip: 2% chance on hit for extra attack |
| | Imperial Jewel | Neck | Rare | +22 STA, +20 to all resistances |
| | Emperor's Seal | Ring | Epic | +24 STR, +22 STA |
| | Robes of the Royal Crown | Chest (Cloth) | Rare | +28 INT, +24 STA, +36 SP |
| | Guiding Stave of Wisdom | Staff | Epic | 72-122 dmg, +32 INT, +28 Spirit, +42 SP |

---

#### 14. Ashcrown City (Level 58-60)
*The ruins of a once-great city, now overrun by the undead Scourge.*

**Two Routes: Scarlet Bastion (Living Side) and Slaughter Square (Undead Side)**

**Scarlet Bastion:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Hearthsinger Forresten** | Piccolo of the Flaming Fire | Trinket | Rare | Use: Nearby allies dance (fun item) |
| | Songbird Blouse | Chest (Cloth) | Rare | +26 INT, +22 STA, +28 SP |
| **Timmy the Cruel** | Grimgore Noose | Neck | Rare | +22 STR, +20 STA |
| | Timmy's Galoshes | Feet (Plate) | Uncommon | +20 STR, +18 STA |
| **Instructor Malicia** | Malicia's Staff of Discipline | Staff | Rare | 68-116 dmg, +28 INT, +24 STA, +34 SP |
| **Balnazzar the Deceiver** *(Final - Living)* | Gift of the Dreadlord | Trinket | Epic | +40 Shadow Res, Equip: +28 Shadow SP |
| | Dreadmist Mantle | Shoulders (Cloth) | Epic | +28 INT, +24 STA, +36 SP |
| | Star of Mystaria | Neck | Rare | +24 INT, +20 Spirit, +30 Healing |
| | Shroud of the Nathrezim | Back | Epic | +26 AGI, +22 STA, +32 AP |

**Slaughter Square:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Nerub'enkan** | Crypt Stalker Leggings | Legs (Leather) | Rare | +26 AGI, +24 STA |
| | Chitinous Shoulderguards | Shoulders (Mail) | Rare | +24 AGI, +22 STA |
| **Baroness Anastari** | Banshee Finger | Wand | Rare | 48-90 Shadow dmg, +22 INT, +18 STA |
| | Shadowy Lace Handwraps | Hands (Cloth) | Rare | +22 INT, +20 STA, +26 SP |
| **Maleki the Pallid** | Pale Moon Cloak | Back | Rare | +22 INT, +20 STA, +26 SP |
| | Maleki's Footwraps | Feet (Cloth) | Uncommon | +20 INT, +18 STA |
| **Baron Rivendare** *(Final - Undead)* | Runeblade of Baron Rivendare | Two-Hand (Sword) | Epic | 86-146 dmg, +38 STR, +32 STA |
| | Deathcharger's Reins | Mount | Legendary | Summons Deathcharger mount (0.5% drop) |
| | Seal of Rivendare | Ring | Epic | +26 STA, +24 STR |
| | Cape of the Black Baron | Back | Rare | +24 AGI, +22 STA, +28 AP |
| | Skullforge Reaver | Main Hand (Sword) | Rare | 52-88 dmg, +26 STR, +22 STA |

---

#### 15. Necropolis Academy (Level 58-60)
*A school of necromancy where the cult of the damned trains new servants of the Lich.*

**Bosses:**

| Boss | Item | Type | Rarity | Stats |
|------|------|------|--------|-------|
| **Instructor Malicia** | Boots of the Shrieker | Feet (Cloth) | Rare | +24 INT, +20 STA, +28 SP |
| | Ghostloom Leggings | Legs (Cloth) | Uncommon | +22 INT, +20 STA |
| **Rattlegore** | Rattlecage Buckler | Off Hand (Shield) | Rare | 1020 Armor, +24 STA, +42 Block |
| | Bone Golem Shoulders | Shoulders (Plate) | Rare | +26 STR, +24 STA |
| | Corpselight Greaves | Feet (Plate) | Uncommon | +22 STR, +20 STA |
| **Marduk Blackpool** | Marduk's Hex | Wand | Rare | 52-96 Shadow dmg, +24 INT, +20 STA |
| | Darkweave Breeches | Legs (Cloth) | Rare | +26 INT, +22 STA, +30 SP |
| **Vectus & Marduk** | Dawn's Edge | Two-Hand (Sword) | Rare | 78-132 dmg, +32 STR, +28 STA |
| | Necropile Boots | Feet (Cloth) | Uncommon | +22 INT, +20 STA |
| **Ras Frostwhisper** | Ras's Frost Whisper | Main Hand (Dagger) | Rare | 46-78 dmg, +22 INT, +18 STA, +28 Frost SP |
| | Frostwhisper's Robes | Chest (Cloth) | Rare | +28 INT, +24 STA, +34 SP |
| | Bonechill Hammer | Two-Hand (Mace) | Rare | 82-138 dmg, +30 INT, +26 STA, Frost Proc |
| **Darkmaster Gandling** *(Final)* | Gandling's Grasp | Staff | Epic | 76-128 dmg, +36 INT, +30 STA, +48 SP |
| | Headmaster's Charge | Staff | Epic | 80-136 dmg, +38 INT, +32 Spirit, +52 SP |
| | Darkmaster's Shroud | Back | Rare | +26 INT, +22 STA, +32 SP |
| | Necropile Raiment | Chest (Cloth) | Epic | +32 INT, +28 STA, +42 SP |
| | Bonecreeper Stylus | Wand | Rare | 56-104 Shadow dmg, +26 INT, +22 STA |
| | Ghostshroud | Head (Cloth) | Epic | +30 INT, +26 STA, +38 SP, +28 Shadow Res |

---

### Loot Table Design Notes

**Stat Scaling by Dungeon Level:**
- Levels 15-25: Primary stats 5-12, Secondary stats 4-10
- Levels 25-35: Primary stats 10-18, Secondary stats 8-14
- Levels 35-45: Primary stats 14-24, Secondary stats 12-20
- Levels 45-55: Primary stats 20-30, Secondary stats 16-26
- Levels 55-60: Primary stats 24-38, Secondary stats 20-32

**Rarity Distribution per Dungeon:**
- Mini-bosses: 60% Uncommon, 40% Rare
- Final bosses: 30% Rare, 60% Epic, 10% Legendary (where applicable)

**Class Distribution:**
Each dungeon contains loot for all armor types (Cloth, Leather, Mail, Plate) and weapon preferences to ensure all classes have upgrade opportunities.

---

### Talent Tree Examples (Detailed)

**Warrior - Arms Tree:**

**Tier 1 (0 points required):**
- **Improved Heroic Strike** (3 ranks): Reduces Rage cost by 1/2/3
- **Deflection** (5 ranks): Increases Parry by 1/2/3/4/5%
- **Improved Rend** (3 ranks): Increases Rend damage by 15/25/35%

**Tier 2 (5 points required):**
- **Deep Wounds** (3 ranks): Crits cause enemy to bleed for 20/40/60% weapon damage over 12s
- **Tactical Mastery** (5 ranks): Retain up to 5/10/15/20/25 Rage when switching stances

**Tier 3 (10 points required):**
- **Improved Charge** (2 ranks): Increases Rage from Charge by 3/6
- **Improved Overpower** (2 ranks): Increases Overpower crit by 25/50%

**Tier 4 (15 points required):**
- **Anger Management** (1 rank): Gain 1 Rage every 3 seconds (passive)
- **Impale** (2 ranks): Increases crit damage bonus by 10/20%

**Tier 5 (20 points required):**
- **Two-Handed Weapon Specialization** (5 ranks): Increases two-hand weapon damage by 1/2/3/4/5%
- **Sweeping Strikes** (1 rank): Next 5 melee attacks hit 1 additional target (30s cooldown)

**Tier 6 (25 points required):**
- **Improved Hamstring** (3 ranks): Gives Hamstring 5/10/15% chance to immobilize

**Tier 7 (30 points required):**
- **Mortal Strike** (1 rank): Instant attack dealing weapon damage + 160, reduces healing on target by 50% for 10s (6s cooldown, 30 Rage)

---

### Frequently Asked Questions (Design)

**Q: Why no PvP?**
A: PvP requires real-time or asynchronous competitive balancing, which conflicts with idle mechanics. Future expansion possibility with asynchronous arena system.

**Q: Why 18-hour offline cap?**
A: Prevents infinite offline stacking while accommodating daily check-in cadence. Balances "idle" with "engagement."

**Q: Why no guilds at launch?**
A: Social systems require server infrastructure and moderation. Planned for post-launch update after single-player core is stable.

**Q: How does multiclassing work?**
A: Players can create multiple characters (4 slots free, up to 10 with purchases). No single-character multiclassing to preserve class identity.

**Q: Will there be expansions?**
A: Yes, planned content roadmap includes:
- **6 months:** Tier 2.5 raid (AQ), new zone
- **12 months:** Level cap increase to 70, new zones, flying mounts
- **18 months:** New classes (Death Knight, Shaman, Warlock)

**Q: Can I play offline permanently?**
A: Yes, core game is fully offline. Cloud saves and leaderboards optional (require account).

**Q: How do you prevent save editing/cheating?**
A: Encrypted save files, server-side validation for leaderboards, offline play allows cheating but doesn't affect others.

**Q: What about accessibility?**
A: Color-blind modes, text size options, auto-combat (already idle), one-handed mobile play support.

---

### Development Roadmap (Suggested)

**Phase 1 - Core Prototype (Months 1-3):**
- 3 classes (Warrior, Mage, Priest)
- Levels 1-20
- 5 zones
- 2 dungeons
- Core combat simulation
- Basic UI mockup

**Phase 2 - Alpha (Months 4-6):**
- All 7 classes
- Levels 1-60
- All 12 zones
- 10 dungeons
- Talent systems fully implemented
- Equipment system complete

**Phase 3 - Beta (Months 7-9):**
- All content playable
- 2 raids (Tier 1, Tier 2)
- Polish UI/UX
- Balancing pass
- Offline progress testing
- Achievement system

**Phase 4 - Launch Prep (Months 10-12):**
- Bug fixing
- Performance optimization
- Monetization integration
- Marketing materials
- Closed beta testing
- Final balancing

**Launch:**
- Soft launch (single region)
- Monitor metrics
- Rapid iteration based on feedback
- Global launch (1-2 months post soft launch)

---

## Appendix B: Original Fantasy Naming Compendium

### World & Faction Names

| Original WoW Name | Idle Raiders Name | Reasoning |
|-------------------|-------------------|-----------|
| Azeroth | Valdoria | Original; "val" (valor) + fantasy suffix |
| Alliance | Covenant of Dawn | Evokes unity and light themes |
| Horde | Ironbound Pact | Emphasizes strength and sworn allegiance |
| Stormwind | Thornhaven | Original city name |
| Orgrimmar | Krag'dar | Orcish-sounding original |
| Ironforge | Deepdelve | Dwarven mountain-home |

### Zone Names (12 Zones)

| Tier | Covenant Zone | Ironbound Zone |
|------|---------------|----------------|
| 1-10 | Silverleaf Glade | Redmaw Wastes |
| 10-20 | Ashford Plains | Bonedust Barrens |
| 20-30 | Stormridge Mountains | Ironpeak Crags |
| 30-40 | Shadowmere Woods | Desolation Flats |
| 40-50 | Scorchwind Canyon | Razorthorn Gulch |
| 50-60 | Emberveil Peaks | Bloodfire Caldera |

### Dungeon Names (15 Dungeons)

| Level | Original Name | Idle Raiders Name |
|-------|---------------|-------------------|
| 15-18 | Ragefire Chasm | Cindermaw Caverns |
| 17-21 | Deadmines | The Hollowed Depths |
| 18-25 | Wailing Caverns | Serpent's Lament |
| 22-30 | Shadowfang Keep | Dreadhollow Manor |
| 24-32 | Blackfathom Deeps | Drowned Temple |
| 29-38 | Gnomeregan | Gearwreck Foundry |
| 34-45 | Scarlet Monastery | Crimson Sanctum |
| 36-44 | Razorfen Downs | Thornbarrow Crypt |
| 41-51 | Uldaman | Titan's Repose |
| 44-54 | Zul'Farrak | Sandscar Ruins |
| 46-55 | Maraudon | Earthmother's Tomb |
| 50-56 | Temple of Atal'Hakkar | Serpentshrine Temple |
| 55-60 | Blackrock Depths | Molten Citadel |
| 58-60 | Stratholme | Ashcrown City |
| 58-60 | Scholomance | Necropolis Academy |

### Raid Names (4 Raid Tiers)

| Tier | Original Name | Idle Raiders Name |
|------|---------------|-------------------|
| T1 | Molten Core | Heart of the Inferno |
| T2 | Blackwing Lair | Drakescale Sanctum |
| T2.5 | Temple of Ahn'Qiraj | Hive of the Swarm-God |
| T3 | Naxxramas | Citadel of the Damned |

### Boss Names (Key Examples)

| Dungeon | Original Boss | Idle Raiders Boss |
|---------|---------------|-------------------|
| Hollowed Depths | Edwin VanCleef | Corwin Blackmantle |
| Hollowed Depths | Mr. Smite | Grimjaw the Enforcer |
| Crimson Sanctum | High Inquisitor Whitemane | Arch-Confessor Seraphine |
| Heart of the Inferno | Ragnaros | Pyraxion, Lord of Cinders |
| Drakescale Sanctum | Nefarian | Vyrmorthos the Corrupted |
| Citadel of the Damned | Kel'Thuzad | Maltheon the Deathweaver |

### Class Ability Names (Originalized)

**Warrior:**
| Original | Idle Raiders | Effect |
|----------|--------------|--------|
| Mortal Strike | Grievous Blow | Weapon damage + healing reduction |
| Bloodthirst | Crimson Frenzy | Attack restoring health |
| Shield Slam | Bulwark Crash | Shield-based high-threat attack |
| Execute | Executioner's Strike | High damage on low-health targets |

**Mage:**
| Original | Idle Raiders | Effect |
|----------|--------------|--------|
| Fireball | Blazing Sphere | Cast-time fire damage |
| Frostbolt | Glacial Lance | Cast-time frost damage + slow |
| Arcane Power | Arcane Surge | Damage cooldown |
| Combustion | Conflagration | Fire crit stacking buff |

**Priest:**
| Original | Idle Raiders | Effect |
|----------|--------------|--------|
| Power Word: Shield | Divine Aegis | Absorb shield |
| Shadow Word: Pain | Torment | Shadow DOT |
| Shadowform | Void Aspect | Shadow damage increase form |
| Circle of Healing | Sanctified Wave | AOE heal |

---

## Appendix C: MMO to Incremental Design Translation

### Core Translation Principles

This section documents how traditional MMO mechanics are adapted for idle/incremental gameplay while preserving the satisfaction of the original systems.

### Combat Translation

| MMO Mechanic | Incremental Translation | Preservation Strategy |
|--------------|------------------------|----------------------|
| Real-time combat | Tick-based simulation (1 tick = 1 second) | Combat log shows per-tick breakdown |
| Manual rotations | AI priority system | Player sets priority order; AI executes |
| Reaction-based mechanics | Success rate calculations | Gear/talents improve success chance |
| Positioning | Abstracted to "front/back" for tank threat | Tank stance grants positional bonuses |
| Resource management | Auto-optimal usage with thresholds | Player sets "use mana pot at 30%" |

### Progression Translation

| MMO Mechanic | Incremental Translation | Preservation Strategy |
|--------------|------------------------|----------------------|
| Grinding mobs | Idle questing in zones | Same XP curve, auto-completion |
| Dungeon runs | Simulated runs with loot tables | 15-30 min per clear, same bosses |
| Raid lockouts | Weekly lockouts preserved | Creates anticipation/return hooks |
| Attunement quests | One-time unlocks | Story preserved in quest text |

### Social Translation

| MMO Mechanic | Incremental Translation | Preservation Strategy |
|--------------|------------------------|----------------------|
| Party/group play | NPC Companions system | Hire "party members" for dungeons |
| Guilds | Future: Async guild progression | Shared goals, contribution tracking |
| Trade | NPC auction house | Buy/sell without real players |
| Leaderboards | Async competition | Fastest clears, highest DPS |

### NPC Companion System (Key Addition)

Since players cannot form groups, NPC companions simulate party play:

**Companion Types:**
- **Tank Companion**: Absorbs damage, generates threat
- **Healer Companion**: Restores health, removes debuffs
- **DPS Companion**: Deals damage, applies debuffs

**Companion Progression:**
- Unlock at Level 15 (first dungeon)
- Level up alongside player
- Equip gear (hand-me-downs from player)
- Talent-like specialization choices

**Party Composition for Dungeons:**
- Solo + 1 companion: Normal dungeons
- Solo + 2 companions: Heroic dungeons
- Solo + 4 companions: Raids

### Engagement Loop Design

**Micro-Loop (Minutes):**
- Combat tick → Reward → Stat check → Continue/upgrade

**Session Loop (10-30 minutes):**
- Select activity → Complete dungeon/quest chain → Evaluate loot → Optimize gear

**Daily Loop:**
- Daily quests → Login rewards → Check raid lockouts

**Weekly Loop:**
- Raid clears → Reputation turn-ins → Weekly quests

**Monthly Loop:**
- Season pass progression → Meta-achievement progress → New content anticipation

### Depth Layering

**Casual Player (80% of users):**
- Auto-equip best gear
- Follow quest markers
- Use recommended talents
- Enjoy progression numbers

**Engaged Player (15% of users):**
- Manual gear comparison
- Optimize talent builds
- Target specific dungeon drops
- Min-max consumable usage

**Theorycrafter (5% of users):**
- Export combat logs
- Calculate exact DPS breakpoints
- Share optimal builds
- Race leaderboards

---

## Appendix E: Complete Raid Boss Mechanics

This appendix details all 42 raid bosses across the four raid tiers. Each boss includes mechanics designed for idle combat simulation with success rate calculations based on gear, talents, and companion composition.

### Raid Design Philosophy

**Idle Raid Mechanics:**
- Mechanics translate to success rate modifiers
- Better gear/talents = higher success rate
- AI handles mechanic execution based on player power
- Failed mechanics reduce success rate, not instant wipes
- Enrage timers create hard DPS checks

**Raid Difficulty Scaling:**
| Tier | Base Success Rate | Gear Requirement | Enrage Severity |
|------|-------------------|------------------|-----------------|
| T1 | 70% at entry gear | ilvl 60-66 | Soft (gradual) |
| T2 | 60% at entry gear | ilvl 66-72 | Medium |
| T2.5 | 55% at entry gear | ilvl 72-78 | Hard |
| T3 | 50% at entry gear | ilvl 78-88 | Brutal |

---

### Heart of the Inferno (Tier 1 - 10 Bosses)

*The molten heart of an ancient volcano, now home to Pyraxion and his fire elemental lieutenants. Entry-level raiding designed to teach basic raid mechanics.*

**Raid Summary:**
- Location: Volcanic caverns beneath Emberveil Peaks
- Theme: Fire elementals, Dark Iron servants
- Recommended Party: Player + 4 companions (Tank, Healer, 2 DPS)
- Clear Time: 2-3 hours (idle)
- Weekly Lockout: Yes

---

#### Boss 1: Infernus
*A corrupted fire hound, twisted by elemental energies. Serves as the gatekeeper to the Inferno.*

| Attribute | Value |
|-----------|-------|
| Role | Entry Boss |
| Health | 450,000 |
| Enrage | None |
| Mechanics | 2 |

**Abilities:**
- **Magma Spit** (8s cooldown): Deals 800 fire damage to current target. *Tank must maintain threat.*
- **Burning Howl** (25s cooldown): Raid-wide 400 fire damage. *Healer check.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Infernus's Burning Collar | Neck | +24 STR, +20 STA, +18 Fire Res |
| Hound Handler's Bindings | Wrist (Leather) | +20 AGI, +18 STA |

---

#### Boss 2: Moltar the Gatekeeper
*A massive core hound with two heads, each breathing different elemental fire.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 580,000 |
| Enrage | 5 minutes (soft) |
| Mechanics | 2 |

**Abilities:**
- **Twin Breath** (12s cooldown): Both heads breathe fire for 600 damage each. *Spread damage.*
- **Magma Pools** (30s cooldown): Creates burning ground dealing 200/tick for 15s. *Movement check (simulated as avoidance roll).*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Corehound Tooth Necklace | Neck | +22 AGI, +20 STA, +16 Crit |
| Magma Tempered Boots | Feet (Plate) | +26 STR, +24 STA, +20 Fire Res |

---

#### Boss 3: Gehennar the Flamecaller
*A powerful flamewaker sorcerer who commands lesser fire elementals.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 620,000 |
| Enrage | 5 minutes (soft) |
| Mechanics | 3 |

**Abilities:**
- **Rain of Fire** (20s cooldown): 15s channel dealing 300 raid-wide damage per tick. *Healer throughput check.*
- **Summon Flamespawn** (45s cooldown): Spawns 2 adds with 30,000 HP each. *DPS priority switch.*
- **Curse of Flames** (35s cooldown): -50% healing received on random target for 10s. *Dispel check.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Flamecaller's Rod | Staff | 68-116 dmg, +32 INT, +26 STA, +38 SP |
| Mantle of the Flamewaker | Shoulders (Cloth) | +28 INT, +24 STA, +32 SP |

---

#### Boss 4: Baron Charstone
*A Dark Iron dwarf commander who oversees mining operations in the Inferno.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 680,000 |
| Enrage | 6 minutes (medium) |
| Mechanics | 3 |

**Abilities:**
- **Molten Shackles** (25s cooldown): Roots tank for 4s, deals 1,500 damage. *Tank cooldown check.*
- **Earthquake** (40s cooldown): 8s channel, 500 raid-wide damage per tick. *Interrupt check.*
- **Summon Reinforcements** (60s cooldown): 4 Dark Iron adds with 15,000 HP each. *AoE check.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Baron's Heavy Maul | Two-Hand (Mace) | 88-148 dmg, +38 STR, +32 STA |
| Dark Iron Plate Helm | Head (Plate) | +32 STR, +30 STA, +24 Fire Res |

---

#### Boss 5: Volcanus
*A living volcano elemental, one of the elder fire lords.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 800,000 |
| Enrage | 6 minutes (medium) |
| Mechanics | 4 |

**Abilities:**
- **Lava Burst** (10s cooldown): 2,000 fire damage to tank. *Tank healer coordination.*
- **Volcanic Eruption** (30s cooldown): 800 raid-wide damage, leaves burning ground. *Positioning.*
- **Molten Armor** (45s cooldown): 50% damage reduction for 15s. *DPS hold or burn through.*
- **Magma Splash** (20s cooldown): Random target takes 1,200 damage + 400/tick DoT for 12s. *Spot healing.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Heart of Volcanus | Trinket | +150 Health, Equip: Fire spells deal 5% more damage |
| Molten Core Bindings | Wrist (Mail) | +24 AGI, +22 STA, +22 Fire Res |
| Lava Dredger | Main Hand (Mace) | 56-96 dmg, +28 STR, +24 STA, Fire Proc |

---

#### Boss 6: Ashemaul, Herald of Flame
*An ancient flamewaker lord, herald to Pyraxion himself.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 720,000 |
| Enrage | 6 minutes (medium) |
| Mechanics | 3 |

**Abilities:**
- **Searing Blade** (8s cooldown): 2,200 physical damage to tank. *Armor check.*
- **Flame Buffet** (15s cooldown): Stacking fire debuff, +10% fire damage taken per stack. *Dispel management.*
- **Herald's Call** (50s cooldown): +25% damage to all enemies for 20s. *Burn phase or survive.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Ashemaul's Flamberge | Two-Hand (Sword) | 92-156 dmg, +40 STR, +34 STA |
| Herald's Plate Pauldrons | Shoulders (Plate) | +30 STR, +28 STA, +22 Fire Res |

---

#### Boss 7: Flamewrath Twins - Scoria & Cinder
*Twin fire elemental princesses who fight in perfect synchronization.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 500,000 each (1,000,000 total) |
| Enrage | 7 minutes (hard) |
| Mechanics | 4 |

**Abilities:**
- **Twin Bond**: If one twin dies, the other enrages (+100% damage). *Must kill within 15s of each other.*
- **Scoria's Magma Chains** (30s cooldown): Links 2 raid members, 500 damage/tick if too far apart.
- **Cinder's Flash Fire** (25s cooldown): Random target takes 1,800 damage, spreads to nearby allies.
- **Synchronized Blast** (45s cooldown): Both twins channel 2,000 raid-wide damage over 5s. *Healing cooldown.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Band of Twin Flames | Ring | +26 INT, +22 STA, +30 SP |
| Cinder's Ember | Off Hand | +28 INT, +34 Fire SP |
| Scoria's Molten Girdle | Waist (Mail) | +26 AGI, +24 STA, +20 Crit |

---

#### Boss 8: Forgemaster Ignatius
*The master craftsman of the Dark Iron dwarves, creator of living fire constructs.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 850,000 |
| Enrage | 7 minutes (medium) |
| Mechanics | 3 |

**Abilities:**
- **Forgehammer Strike** (12s cooldown): 3,000 physical damage to tank, -15% armor for 20s. *Tank swap or cooldown.*
- **Create Construct** (40s cooldown): Summons Fire Golem with 80,000 HP. *Off-tank pickup.*
- **Overheat** (60s cooldown): Self-buff, +50% damage for 20s, takes 25% more damage. *Burn window.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Forgemaster's Apron | Chest (Leather) | +34 AGI, +30 STA, +28 Fire Res |
| Ignatius's Sledge | Main Hand (Mace) | 62-106 dmg, +32 STR, +28 STA, Proc: Stun |

---

#### Boss 9: Sulfurias, the Molten Warden
*Pyraxion's personal guardian, an elemental of pure molten fury.*

| Attribute | Value |
|-----------|-------|
| Role | Penultimate Boss |
| Health | 1,100,000 |
| Enrage | 8 minutes (hard) |
| Mechanics | 5 |

**Abilities:**
- **Molten Strike** (6s cooldown): 2,500 fire damage to tank + 500 splash to melee. *Melee positioning.*
- **Lava Tsunami** (35s cooldown): 3s cast, 2,000 raid-wide damage. *Interrupt or heal through.*
- **Warden's Blessing** (90s cooldown): Heals for 10% of max HP. *Must be interrupted.*
- **Infernal Rage** (25% HP): Permanent +30% damage, +20% attack speed. *Final burn phase.*
- **Summon Lava Spawn** (45s cooldown): 3 adds with 25,000 HP each, explode on death for 800 damage.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Sulfurias's Molten Defender | Off Hand (Shield) | 1,180 Armor, +32 STA, +48 Block, +28 Fire Res |
| Warden's Flamebrand | Main Hand (Sword) | 64-110 dmg, +30 STR, +28 STA, +22 AP |
| Mantle of the Warden | Shoulders (Plate) | +34 STR, +32 STA, +26 Fire Res |

---

#### Boss 10: Pyraxion, Lord of Cinders
*The fire lord himself, an elemental god of destruction who has claimed this volcanic realm.*

| Attribute | Value |
|-----------|-------|
| Role | Final Boss |
| Health | 1,500,000 |
| Enrage | 10 minutes (brutal) |
| Mechanics | 6 |
| Phases | 2 |

**Phase 1 (100% - 50% HP):**
- **Pyroclasm** (10s cooldown): 3,000 fire damage to tank + cleave. *Tank positioning.*
- **Inferno Blast** (20s cooldown): Random target takes 2,500 damage, leaves fire pool. *Movement.*
- **Summon Ember Servants** (45s cooldown): 2 adds with 50,000 HP. *Priority targets.*
- **Living Bomb** (30s cooldown): Random player explodes after 8s for 2,000 damage to nearby. *Spread.*

**Phase 2 (50% - 0% HP):**
- **Ascendant Form**: Pyraxion grows larger, all abilities deal 25% more damage.
- **Rain of Cinders** (15s cooldown): 1,500 raid-wide damage, 10s duration. *Healing intensive.*
- **Hand of Pyraxion** (60s cooldown): Massive slam dealing 8,000 damage split among raid. *Stack.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Pyraxion's Blazing Greatsword | Two-Hand (Sword) | 108-184 dmg, +48 STR, +42 STA, Proc: 150 Fire AoE |
| Crown of the Fire Lord | Head (Plate) | +40 STR, +38 STA, +32 Fire Res |
| Ember of Pyraxion | Trinket | +200 Health, Use: +100 Fire SP for 20s (3 min CD) |
| Legs of the Inferno | Legs (Plate) | +42 STR, +40 STA, +30 Fire Res |
| Cinder Lord's Vestments | Chest (Cloth) | +44 INT, +40 STA, +58 SP |

**Legendary Drop (1% chance):**
| Item | Type | Stats |
|------|------|-------|
| Ashbringer of the Inferno | Two-Hand (Sword) | 128-216 dmg, +55 STR, +50 STA, Equip: Melee attacks have 5% chance to deal 300 fire damage |

---

### Drakescale Sanctum (Tier 2 - 8 Bosses)

*The lair of Vyrmorthos, a corrupted black dragon who experiments on dragonkind. Features complex multi-phase encounters and introduces tank-swap mechanics.*

**Raid Summary:**
- Location: Volcanic mountain fortress
- Theme: Dragons, dragonkin, draconic experiments
- Recommended Party: Player + 4 companions (2 Tanks, Healer, DPS)
- Clear Time: 2.5-3.5 hours (idle)
- Weekly Lockout: Yes

---

#### Boss 1: Razorgore the Untamed
*A chromatic drake experiment, chained but still deadly.*

| Attribute | Value |
|-----------|-------|
| Role | Entry Boss |
| Health | 900,000 |
| Enrage | 6 minutes |
| Mechanics | 3 |

**Abilities:**
- **Chromatic Breath** (12s cooldown): 2,000 damage cone, rotates element (Fire/Frost/Nature/Arcane).
- **Thrash** (passive): 30% chance for extra melee attack. *Tank mitigation.*
- **Conflagration** (30s cooldown): Random target burns for 500/tick for 15s, spreads on contact.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Razorgore's Untamed Scale | Trinket | +25 to all resistances |
| Chromatic Gauntlets | Hands (Plate) | +32 STR, +30 STA |

---

#### Boss 2: Vaelstrasz the Corrupt
*A red dragon corrupted by Vyrmorthos, forced to fight against his will.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 1,000,000 |
| Enrage | 3 minutes (intentionally short) |
| Mechanics | 4 |

**Special Mechanic - Essence of the Red:**
At fight start, all raid members gain unlimited resources for 3 minutes. This is a pure DPS race.

**Abilities:**
- **Flame Breath** (15s cooldown): 4,000 fire damage cone. *Tank positioning critical.*
- **Burning Adrenaline** (20s cooldown): Random DPS gains +100% damage but dies after 20s. *Maximize damage before death.*
- **Fire Nova** (30s cooldown): 2,000 raid-wide fire damage. *Healer check.*
- **Tail Sweep** (10s cooldown): Knockback + 1,500 damage to melee behind. *Positioning.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Dragonfang Blade | Main Hand (Dagger) | 52-88 dmg, +28 AGI, +26 STA, +32 AP |
| Red Dragonscale Protector | Off Hand (Shield) | 1,240 Armor, +38 STA, +52 Block |

---

#### Boss 3: Broodlord Lashlayer
*Commander of Vyrmorthos's drakonid army, a brutal warrior.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 1,100,000 |
| Enrage | 7 minutes |
| Mechanics | 3 |

**Abilities:**
- **Mortal Strike** (8s cooldown): 4,000 physical damage, -50% healing for 5s. *Tank swap trigger.*
- **Blast Wave** (25s cooldown): 2,500 AoE damage, knockback. *Melee positioning.*
- **Knock Away** (15s cooldown): Tank knocked back, threat reduced by 50%. *Taunt swap.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Broodlord's Shoulderguards | Shoulders (Plate) | +36 STR, +34 STA |
| Lifegiving Gem | Trinket | Use: Heal for 1,500 HP (5 min CD) |

---

#### Boss 4: Firemaw
*One of three chromatic drake guardians, master of flame.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 1,200,000 |
| Enrage | 8 minutes |
| Mechanics | 4 |

**Abilities:**
- **Flame Buffet** (2s cooldown): Stacking debuff, +100 fire damage taken per stack. *Line of sight to reset.*
- **Shadow Flame** (20s cooldown): 4,000 shadow damage cone. *Cannot be resisted with fire resistance.*
- **Wing Buffet** (30s cooldown): Knockback + threat reset. *Tank swap.*
- **Thrash** (passive): 30% extra attack chance.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Firemaw's Dragonhide | Chest (Leather) | +38 AGI, +36 STA, +28 Fire Res |
| Cloak of Firemaw | Back | +28 AGI, +26 STA, +24 Fire Res |

---

#### Boss 5: Ebonroc
*Chromatic drake guardian, master of shadow magic.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 1,200,000 |
| Enrage | 8 minutes |
| Mechanics | 4 |

**Abilities:**
- **Shadow Flame** (20s cooldown): 4,000 shadow damage cone.
- **Shadow of Ebonroc** (25s cooldown): Tank debuff, heals Ebonroc for damage dealt. *Tank swap immediately.*
- **Thrash** (passive): 30% extra attack chance.
- **Wing Buffet** (30s cooldown): Knockback + threat reset.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Ebony Flame Gloves | Hands (Cloth) | +32 INT, +28 STA, +40 SP |
| Drake Fang Talisman | Trinket | +56 AP, +2% Hit |

---

#### Boss 6: Flamegor
*Chromatic drake guardian, the most aggressive of the three.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 1,200,000 |
| Enrage | 7 minutes (shorter) |
| Mechanics | 4 |

**Abilities:**
- **Shadow Flame** (20s cooldown): 4,000 shadow damage cone.
- **Frenzy** (passive): At 50% HP, +50% attack speed permanently.
- **Fire Nova** (25s cooldown): 3,000 fire damage to all. *Healing intensive in frenzy.*
- **Thrash** (passive): 30% extra attack chance.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Herald of Woe | Two-Hand (Mace) | 98-166 dmg, +44 STR, +40 STA |
| Rejuvenating Gem | Trinket | Use: Heal for 2,000 HP over 20s (5 min CD) |

---

#### Boss 7: Chromaggus
*Vyrmorthos's ultimate experiment - a two-headed chromatic beast with all dragon powers.*

| Attribute | Value |
|-----------|-------|
| Role | Penultimate Boss |
| Health | 1,600,000 |
| Enrage | 10 minutes |
| Mechanics | 6 |

**Special Mechanic - Chromatic Mutation:**
Chromaggus has 5 random breath attacks (chosen at instance reset). Each breath applies a different debuff.

**Breath Types (2 random per instance):**
- **Incinerate**: 3,000 fire damage + DoT
- **Frost Burn**: 2,000 frost damage + -50% attack speed
- **Corrosive Acid**: 1,500 nature damage + -50% armor
- **Ignite Flesh**: 1,000 fire damage + healing debuff
- **Time Lapse**: Stun for 6s + threat reset

**Abilities:**
- **Chromatic Breath** (30s cooldown): Random breath attack.
- **Brood Affliction** (passive): Random raid members gain colored debuffs. 5 stacks = death.
- **Enrage** (15% HP): +100% damage. *Final burn.*
- **Shimmer** (passive): Changes damage vulnerability every 45s.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Chromatic Boots | Feet (Plate) | +36 STR, +34 STA, +20 to all resistances |
| Elementium Threaded Cloak | Back | +30 STA, +22 to all resistances |
| Ashjre'thul, Crossbow of Smiting | Ranged (Crossbow) | 68-124 dmg, +36 AGI, +34 STA |

---

#### Boss 8: Vyrmorthos the Corrupted
*The corrupted black dragon lord, master of the Drakescale Sanctum.*

| Attribute | Value |
|-----------|-------|
| Role | Final Boss |
| Health | 2,200,000 |
| Enrage | 12 minutes |
| Mechanics | 8 |
| Phases | 3 |

**Phase 1 (100% - 70% HP) - Ground Phase:**
- **Shadow Flame** (18s cooldown): 5,000 shadow damage cone. *Tank positioning critical.*
- **Cleave** (6s cooldown): 3,500 physical damage to tank + nearest. *Only main tank in melee.*
- **Tail Lash** (8s cooldown): 2,000 damage + stun to melee behind.
- **Bellowing Roar** (35s cooldown): AoE fear for 3s. *Tremor totem / fear break.*

**Phase 2 (70% - 40% HP) - Flight Phase:**
- Vyrmorthos takes flight, spawning adds and breathing fire.
- **Shadowflame Barrage** (every 10s): Random locations hit for 3,000 shadow damage.
- **Corrupted Spawn** (every 30s): 2 drakonid adds with 60,000 HP.
- Phase ends when all adds are dead and 30 seconds pass.

**Phase 3 (40% - 0% HP) - Corrupted Rage:**
- **All Phase 1 abilities** with 20% increased damage.
- **Corruption Aura** (passive): Raid takes 300 shadow damage per tick.
- **Nefarian's Curse** (45s cooldown): Random class debuff (Warrior: stuck in Berserker Stance, Healer: heals damage, etc.)
- **Bone Constructs** (60s cooldown): Raises 4 skeleton adds from defeated enemies.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Crul'shorukh, Edge of Chaos | Main Hand (Axe) | 68-128 dmg, +36 STR, +32 STA, Proc: 200 Shadow damage |
| Neltharion's Tear | Trinket | +44 SP, +2% Spell Hit |
| Head of Vyrmorthos | Quest Item | Turn in for class-specific neck (ilvl 83) |
| Chromatic Tempered Sword | Main Hand (Sword) | 62-116 dmg, +34 STR, +30 STA, +28 AP |
| Robes of the Corruptor | Chest (Cloth) | +48 INT, +44 STA, +62 SP |
| Dragonstalker's Helm | Head (Mail) | +40 AGI, +38 STA, +32 AP (Hunter T2) |

**Legendary Drop (0.5% chance):**
| Item | Type | Stats |
|------|------|-------|
| Ashkandi, Greatsword of the Corrupted | Two-Hand (Sword) | 138-232 dmg, +62 STR, +58 STA, Equip: +86 AP |

---

### Hive of the Swarm-God (Tier 2.5 - 9 Bosses)

*An ancient insectoid temple awakened by dark rituals. Features unique swarm mechanics and nature/shadow damage themes.*

**Raid Summary:**
- Location: Desert catacombs beneath Scorchwind Canyon
- Theme: Silithid insects, Qiraji warriors, Old God influence
- Recommended Party: Player + 4 companions (2 Tanks, Healer, DPS)
- Clear Time: 3-4 hours (idle)
- Weekly Lockout: Yes

---

#### Boss 1: Skeram the Prophet
*A qiraji prophet who guards the temple entrance with illusions and mind control.*

| Attribute | Value |
|-----------|-------|
| Role | Entry Boss |
| Health | 1,300,000 |
| Enrage | 8 minutes |
| Mechanics | 4 |

**Abilities:**
- **Arcane Explosion** (12s cooldown): 2,000 arcane damage to all within 10 yards. *Melee must run out.*
- **Earth Shock** (8s cooldown): 2,500 nature damage to tank, interrupts casting.
- **True Fulfillment** (30s cooldown): Mind controls 1 player for 15s. *CC or damage break.*
- **Split** (at 75%, 50%, 25% HP): Creates 2 illusions with 25% HP each. *Must kill adds.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Cloak of Concentrated Hatred | Back | +30 AGI, +28 STA, +34 AP |
| Ring of the Qiraji Fury | Ring | +28 STR, +26 STA |

---

#### Boss 2: Battleguard Sartura
*Commander of the qiraji forces, a whirlwind of blades.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 1,400,000 |
| Enrage | 10 minutes (berserk at low HP) |
| Mechanics | 4 |

**Abilities:**
- **Whirlwind** (20s cooldown): 10s channel, moves randomly, 2,000 damage to anyone hit. *Avoid.*
- **Knockback** (15s cooldown): Tank knocked back, threat reduced. *Taunt ready.*
- **Sundering Cleave** (10s cooldown): 3,000 physical damage, -20% armor for 20s.
- **Enrage** (below 20% HP): +100% attack speed. *Burn or die.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Recomposed Boots | Feet (Leather) | +34 AGI, +32 STA |
| Thick Qirajihide Belt | Waist (Leather) | +32 AGI, +30 STA, +26 AP |

---

#### Boss 3: Fankriss the Unyielding
*A massive sand worm that burrows through the temple.*

| Attribute | Value |
|-----------|-------|
| Role | Mini-Boss |
| Health | 1,500,000 |
| Enrage | 10 minutes |
| Mechanics | 4 |

**Abilities:**
- **Mortal Wound** (8s cooldown): 4,000 damage, stacking -10% healing received. *Tank swap at 5 stacks.*
- **Entangle** (25s cooldown): Random player rooted, takes 500 damage/tick. *Break root DPS.*
- **Summon Worm** (45s cooldown): Spawns Spawn of Fankriss (40,000 HP) that fixates random player.
- **Burrow** (90s cooldown): Submerges, random player takes 6,000 damage when emerges.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Robes of the Guardian Saint | Chest (Cloth) | +46 INT, +42 STA, +56 SP, +40 Healing |
| Barbed Choker | Neck | +30 AGI, +28 STA, +24 Crit |

---

#### Boss 4: Viscidus
*A poison slime lord, requires special tactics to defeat.*

| Attribute | Value |
|-----------|-------|
| Role | Optional Boss |
| Health | 1,000,000 |
| Enrage | None (but regenerates) |
| Mechanics | 3 (unique) |

**Special Mechanic - Shatter:**
Viscidus is immune to normal damage. Must be frozen then shattered.
1. Deal 200 frost damage instances to freeze Viscidus solid
2. Deal 100 melee hits to shatter into 20 Globs
3. Kill Globs before they reform (if 5+ survive, Viscidus reforms at 5% HP per glob)

**Abilities:**
- **Poison Bolt Volley** (10s cooldown): 2,000 nature damage to all. *Nature resistance helps.*
- **Toxin Cloud** (30s cooldown): Poison pool dealing 800/tick. *Move out.*
- **Poison Shock** (20s cooldown): 3,000 nature damage to melee.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Qiraji Bindings of Command | Wrist (Plate) | +28 STR, +26 STA (Warrior T2.5) |
| Sharpened Silithid Femur | Main Hand (Dagger) | 48-82 dmg, +26 AGI, +24 STA, Proc: Poison |

---

#### Boss 5: Princess Huhuran
*Queen of the silithid wasps, a deadly poison master.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 1,600,000 |
| Enrage | 8 minutes |
| Mechanics | 5 |

**Abilities:**
- **Frenzy** (every 25-35s): +50% attack speed for 8s. *Tranquilizing Shot or Hunter ability to remove.*
- **Wyvern Sting** (20s cooldown): Random target sleeps for 12s, wakes with 3,000 nature damage.
- **Poison Bolt** (8s cooldown): 2,500 nature damage to tank.
- **Noxious Poison** (15s cooldown): 30-yard AoE 2,000 nature damage.
- **Berserk** (below 30% HP): Spams Poison Bolt on entire raid. *Must burn quickly.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Hive Defiler Wristguards | Wrist (Mail) | +30 AGI, +28 STA (Hunter T2.5) |
| Wasphide Gauntlets | Hands (Leather) | +34 AGI, +32 STA, +28 AP |

---

#### Boss 6: The Twin Emperors - Vek'lor & Vek'nilash
*Twin qiraji emperors who share power across dimensions.*

| Attribute | Value |
|-----------|-------|
| Role | Major Boss |
| Health | 1,100,000 each (2,200,000 total) |
| Enrage | 15 minutes |
| Mechanics | 6 |

**Special Mechanic - Emperor Bond:**
- Vek'lor (caster) is immune to physical damage
- Vek'nilash (melee) is immune to magical damage
- They heal to full if within 60 yards of each other
- Every 30-40s they teleport and swap positions

**Vek'lor Abilities (Caster):**
- **Shadow Bolt** (3s cooldown): 3,000 shadow damage to tank. *Warlock tank.*
- **Arcane Burst** (20s cooldown): 3,500 arcane damage to melee. *Keep melee away.*
- **Blizzard** (30s cooldown): AoE frost damage zone.

**Vek'nilash Abilities (Melee):**
- **Uppercut** (15s cooldown): 4,000 damage + knockback. *Tank against wall.*
- **Unbalancing Strike** (10s cooldown): 3,500 damage, -100% defense for 6s. *Tank swap.*
- **Mutate Bug** (25s cooldown): Transforms nearby bug into Exploding Bug.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Vek'lor's Diadem | Head (Cloth) | +42 INT, +38 STA, +52 SP |
| Vek'nilash's Gloves | Hands (Plate) | +38 STR, +36 STA (Warrior T2.5) |
| Amulet of Vek'nilash | Neck | +34 STR, +32 STA, +36 AP |
| Royal Qiraji Belt | Waist (Plate) | +36 STR, +34 STA, +28 AP |

---

#### Boss 7: Ouro
*An ancient sand worm of immense size, worshipped by the qiraji.*

| Attribute | Value |
|-----------|-------|
| Role | Optional Boss |
| Health | 2,000,000 |
| Enrage | 12 minutes |
| Mechanics | 5 |

**Abilities:**
- **Sweep** (8s cooldown): 4,000 damage + knockback to tank and melee. *Stand at max range.*
- **Sand Blast** (20s cooldown): 3,500 damage cone + silence for 4s.
- **Ground Rupture** (15s cooldown): Random locations erupt for 2,000 damage.
- **Submerge** (every 90s): Ouro burrows, spawns Ouro Scarabs (5 adds, 20,000 HP each).
- **Enrage** (at 20% HP): No more submerge, +50% damage.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Ouro's Intact Hide | Quest Item | Turn in for caster cloak |
| Wormscale Blocker | Off Hand (Shield) | 1,320 Armor, +42 STA, +58 Block |
| Larvae of the Great Worm | Trinket | Use: Summon Ouro Scarab pet for 30s (10 min CD) |

---

#### Boss 8: Eye of C'Thun
*The first stage of the final encounter - the eye of an old god.*

| Attribute | Value |
|-----------|-------|
| Role | Final Boss (Phase 1) |
| Health | 1,500,000 |
| Enrage | Combined with C'Thun |
| Mechanics | 4 |

**Abilities:**
- **Eye Beam** (3s cooldown): 3,000 arcane damage to random player, chains to nearby players.
- **Dark Glare** (45s cooldown): 40s sweeping beam dealing 5,000 shadow damage. *Rotate away.*
- **Summon Claw Tentacle** (15s cooldown): Spawns tentacle (20,000 HP) that attacks nearest player.
- **Summon Eye Tentacle** (30s cooldown): Spawns eye (10,000 HP) that casts Mind Flay.

*At 0% HP, Eye phase ends and C'Thun emerges.*

---

#### Boss 9: C'Thun, the Old God
*An ancient god of chaos, imprisoned beneath the sands for millennia.*

| Attribute | Value |
|-----------|-------|
| Role | Final Boss (Phase 2) |
| Health | 2,500,000 |
| Enrage | 15 minutes (total encounter) |
| Mechanics | 7 |
| Phases | 2 (including Eye) |

**Phase 2 - Body Phase:**

**Abilities:**
- **Mouth Tentacle** (constant): Tank the massive tentacle that emerges. 5,000 damage cleave.
- **Giant Claw Tentacle** (45s cooldown): Massive tentacle (60,000 HP) that must be killed.
- **Giant Eye Tentacle** (60s cooldown): Massive eye (40,000 HP) with powerful Mind Flay.
- **Digestive Acid** (inside stomach): Players swallowed take 3,000/tick, must kill Flesh Tentacles to weaken C'Thun.
- **Swallow** (20s cooldown): Random player teleported to stomach. Killing 2 Flesh Tentacles inside weakens C'Thun.
- **Weakened State** (after stomach tentacles die): C'Thun takes +100% damage for 45s.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Eyestalk Waist Cord | Waist (Cloth) | +38 INT, +34 STA, +46 SP |
| Gauntlets of Annihilation | Hands (Plate) | +42 STR, +40 STA |
| Dark Edge of Insanity | Two-Hand (Axe) | 112-188 dmg, +50 STR, +48 STA, Proc: Shadow damage |
| Death's Sting | Main Hand (Dagger) | 56-94 dmg, +32 AGI, +30 STA, +40 AP |
| Scepter of the False Prophet | Staff | 82-138 dmg, +52 INT, +48 STA, +68 SP |
| Cloak of the Devoured | Back | +34 INT, +32 STA, +42 SP |

**Legendary Drop (0.5% chance):**
| Item | Type | Stats |
|------|------|-------|
| Eye of C'Thun | Trinket | +30 to all stats, Equip: Your attacks ignore 300 armor, Use: Deal 2,000 shadow damage to target (5 min CD) |

---

### Citadel of the Damned (Tier 3 - 15 Bosses)

*The floating necropolis of Maltheon the Deathweaver, final challenge for raiders. Features the most complex encounters with strict execution requirements.*

**Raid Summary:**
- Location: Floating citadel above Bloodfire Caldera
- Theme: Undead, necromancy, frost/shadow damage
- Recommended Party: Player + 4 companions (fully optimized)
- Clear Time: 4-6 hours (idle)
- Weekly Lockout: Yes

**Wings:** Arachnid Quarter, Plague Quarter, Military Quarter, Construct Quarter, Frostwyrm Lair

---

### Arachnid Quarter (3 Bosses)

#### Boss 1: Anub'Rekhan
*A massive crypt lord, master of the arachnid quarter.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,000,000 |
| Enrage | 10 minutes |
| Mechanics | 4 |

**Abilities:**
- **Impale** (15s cooldown): Line attack dealing 4,000 damage + knockup.
- **Locust Swarm** (90s cooldown): 20s channel, AoE 1,000 nature damage/tick, Anub'Rekhan moves around.
- **Summon Crypt Guard** (45s cooldown): Spawns elite add (150,000 HP). *Off-tank.*
- **Corpse Scarabs** (on Crypt Guard death): 10 scarabs spawn from dead guard.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Cryptstalker Helm | Head (Mail) | +46 AGI, +44 STA, +38 AP (Hunter T3) |
| Webbed Death | Main Hand (Dagger) | 54-92 dmg, +30 AGI, +28 STA, Proc: Web (slow) |

---

#### Boss 2: Grand Widow Faerlina
*A high priestess of the cult, master of poisons and mind control.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,200,000 |
| Enrage | 10 minutes |
| Mechanics | 5 |

**Abilities:**
- **Poison Bolt Volley** (10s cooldown): 2,500 nature damage to 3 random targets.
- **Rain of Fire** (25s cooldown): 15s AoE, 1,500 fire damage/tick.
- **Enrage** (60s cooldown): +150% damage for 60s. *Sacrifice Worshipper to dispel.*
- **Worshippers** (4 adds at start): Can be mind controlled to sacrifice, dispelling Enrage.
- **Widow's Embrace** (sacrifice effect): Faerlina stunned and silenced for 30s.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Widow's Remorse | Main Hand (Sword) | 60-102 dmg, +32 STR, +30 STA, +38 AP |
| Faerlina's Vestments | Chest (Cloth) | +52 INT, +48 STA, +68 SP |

---

#### Boss 3: Maexxna
*Giant spider queen, final boss of the Arachnid Quarter.*

| Attribute | Value |
|-----------|-------|
| Role | Quarter Final |
| Health | 2,500,000 |
| Enrage | 12 minutes |
| Mechanics | 5 |

**Abilities:**
- **Web Wrap** (40s cooldown): 3 players wrapped on wall, take 2,000/tick until freed.
- **Web Spray** (40s cooldown): Raid-wide stun for 6s. *Timed with Web Wrap - dangerous.*
- **Poison Shock** (15s cooldown): 3,500 nature damage to melee.
- **Necrotic Poison** (20s cooldown): Tank debuff, -90% healing received for 30s. *Swap or cleanse.*
- **Frenzy** (below 30% HP): +50% damage, +50% attack speed. *Burn phase.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Wraith Blade | Main Hand (Sword) | 62-106 dmg, +34 STR, +32 STA, Proc: Life drain |
| Kiss of the Spider | Trinket | +40 Crit rating, +30 AP |
| Maexxna's Fang | Main Hand (Dagger) | 52-88 dmg, +28 AGI, +26 STA, Proc: Poison DoT |

---

### Plague Quarter (3 Bosses)

#### Boss 4: Noth the Plaguebringer
*Necromancer who specializes in raising the dead.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,200,000 |
| Enrage | 10 minutes |
| Mechanics | 4 |

**Abilities:**
- **Curse of the Plaguebringer** (30s cooldown): 3 players cursed, 10s countdown, explodes for 4,000 shadow damage to nearby.
- **Cripple** (25s cooldown): Random target slowed 75%, -50% damage for 15s.
- **Blink** (every 90s): Teleports to balcony, becomes untargetable, summons waves of undead (30s duration).
- **Summon Plagued Warriors** (during Blink): 6 skeletons with 30,000 HP each.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Noth's Frigid Heart | Trinket | +30 Frost SP, Use: Frost Nova (3 min CD) |
| Plaguebringer's Boots | Feet (Cloth) | +38 INT, +34 STA, +46 SP |

---

#### Boss 5: Heigan the Unclean
*Master of the Plague Dance, most mechanically demanding fight.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,400,000 |
| Enrage | 10 minutes |
| Mechanics | 4 |

**Special Mechanic - Safety Dance:**
The platform has 4 quadrants. Plague eruptions cycle through quadrants in order. Must move to safe zones or take 8,000 damage.

**Abilities:**
- **Decrepit Fever** (20s cooldown): Random targets diseased, -50% damage dealt.
- **Disruption** (periodic during dance): 3,000 shadow damage if in wrong quadrant.
- **Teleport** (every 90s): Heigan teleports to platform, raid must fight on stage while dodging eruptions.
- **Plague Cloud** (stage phase): Safe zone shrinks over time.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Icebane Leggings | Legs (Plate) | +46 STA, +40 Frost Res |
| Necklace of Necropsy | Neck | +36 INT, +32 STA, +44 SP |

---

#### Boss 6: Loatheb
*A massive fungal monstrosity, the Plague Quarter's final challenge.*

| Attribute | Value |
|-----------|-------|
| Role | Quarter Final |
| Health | 3,000,000 |
| Enrage | 12 minutes |
| Mechanics | 4 |

**Special Mechanic - Corrupted Mind:**
Healing is only possible for 3 seconds every 60 seconds. Plan healing windows carefully.

**Abilities:**
- **Inevitable Doom** (every 30s, then 15s below 50%): Raid-wide 4,000 shadow damage after 10s delay.
- **Spore** (periodic): Spores spawn, killing them gives crit buff to nearby players.
- **Fungal Bloom** (on death): Spore death heals nearby players for 5,000.
- **Necrotic Aura** (passive): -100% healing done except during windows.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| The End of Dreams | Staff | 88-148 dmg, +56 INT, +52 STA, +74 SP |
| Fungi-Stained Coverings | Legs (Leather) | +44 AGI, +42 STA, +36 AP |

---

### Military Quarter (3 Bosses)

#### Boss 7: Instructor Razuvious
*Death knight combat instructor, hits incredibly hard.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,600,000 |
| Enrage | 10 minutes |
| Mechanics | 4 |

**Special Mechanic - Understudy Tanks:**
Razuvious hits for 20,000+ per swing. Must mind control his Understudies to tank him.

**Abilities:**
- **Unbalancing Strike** (12s cooldown): 8,000 damage, +100% damage taken for 6s. *Swap Understudies.*
- **Disrupting Shout** (25s cooldown): Raid-wide 2,500 damage + interrupt.
- **Understudies** (2 adds): Can be mind controlled, have taunt and shield wall abilities.
- **Jagged Knife** (15s cooldown): Random target bleeds for 500/tick for 30s.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Girdle of the Mentor | Waist (Plate) | +42 STR, +40 STA |
| Idol of Ferocity | Relic (Druid) | +50 Feral AP |

---

#### Boss 8: Gothik the Harvester
*Necromancer who raises his own kills to fight again.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,400,000 |
| Enrage | 10 minutes |
| Mechanics | 5 |

**Special Mechanic - Living vs Dead:**
Raid splits into two sides. Living adds on one side become undead adds on other when killed.

**Abilities:**
- **Harvest Soul** (on add death): Living side kills create undead adds on dead side.
- **Shadow Bolt** (6s cooldown): 3,500 shadow damage to random target (once Gothik lands).
- **Living Trainees/Knights/Riders** (waves): Living adds spawn on living side.
- **Undead versions**: Spectral adds spawn on dead side.
- **Gate Opens** (at 3:30): Gothik lands, gate opens, raid combines.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Sadist's Collar | Neck | +38 AGI, +36 STA, +44 AP |
| Boots of Displacement | Feet (Leather) | +40 AGI, +38 STA |

---

#### Boss 9: The Four Horsemen
*Four death knight generals who must be fought simultaneously.*

| Attribute | Value |
|-----------|-------|
| Role | Quarter Final |
| Health | 900,000 each (3,600,000 total) |
| Enrage | 12 minutes |
| Mechanics | 8 |

**Special Mechanic - Mark of the Horseman:**
Each Horseman applies a stacking mark every 12s. At 4+ stacks, player dies. Must rotate tanks.

**The Four Horsemen:**

**Alexandros (Front Left):**
- **Mark of Alexandros**: Shadow damage mark.
- **Void Zone**: Shadow pool dealing 4,000/tick.

**Korth'azz (Front Right):**
- **Mark of Korth'azz**: Fire damage mark.
- **Meteor**: 5,000 fire damage split among nearby.

**Blaumeux (Back Left):**
- **Mark of Blaumeux**: Shadow damage mark.
- **Shadow Bolt**: 3,000 shadow damage to distant targets.

**Zeliek (Back Right):**
- **Mark of Zeliek**: Holy damage mark.
- **Holy Bolt**: 2,500 holy damage chain lightning to distant targets.

*All marks deal 2,500 damage per stack every 12 seconds.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Corrupted Ashbringer | Two-Hand (Sword) | 134-226 dmg, +60 STR, +56 STA, Proc: Shadow damage (if owned Ashbringer) |
| Damnation | Staff | 92-156 dmg, +58 INT, +54 STA, +76 SP |
| Soulstring | Ranged (Bow) | 76-142 dmg, +42 AGI, +40 STA |
| Legplates of Carnage | Legs (Plate) | +50 STR, +48 STA (Warrior T3) |

---

### Construct Quarter (3 Bosses)

#### Boss 10: Patchwerk
*A flesh golem, pure DPS and healing check with no mechanics.*

| Attribute | Value |
|-----------|-------|
| Role | Gear Check |
| Health | 4,000,000 |
| Enrage | 7 minutes (brutal) |
| Mechanics | 2 |

**Abilities:**
- **Hateful Strike** (1s cooldown): 8,000 damage to highest-HP player in melee. *Requires 3 tanks soaking.*
- **Frenzy** (below 5% HP): +500% damage. *Kill before frenzy or wipe.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Severance | Two-Hand (Axe) | 118-198 dmg, +55 STR, +52 STA |
| Band of Reanimation | Ring | +40 STR, +38 STA |

---

#### Boss 11: Grobbulus
*A poison-injected abomination that spreads disease.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,800,000 |
| Enrage | 12 minutes |
| Mechanics | 4 |

**Abilities:**
- **Mutating Injection** (20s cooldown): Random player injected, 10s later explodes into poison cloud.
- **Poison Cloud** (from injection): 3,000 nature damage/tick. *Drop at wall.*
- **Slime Spray** (15s cooldown): Cone attack, 4,000 nature damage + slow.
- **Fallout Slime** (on cloud creation): Small add spawns from each cloud.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Toxin Injector | Ranged (Gun) | 72-134 dmg, +40 AGI, +38 STA, Proc: Poison |
| Blistering Buckler | Off Hand (Shield) | 1,380 Armor, +48 STA, +62 Block |

---

#### Boss 12: Gluth
*A massive undead dog that devours zombies to heal.*

| Attribute | Value |
|-----------|-------|
| Role | Wing Boss |
| Health | 2,600,000 |
| Enrage | 10 minutes |
| Mechanics | 5 |

**Abilities:**
- **Mortal Wound** (8s cooldown): -10% healing received, stacks. *Tank swap at 5 stacks.*
- **Decimate** (every 90s): All players and zombies reduced to 5% HP. *Mass heal immediately.*
- **Zombie Chow** (constant): Zombies spawn from grates, must be kited. If Gluth eats them, heals 5%.
- **Frenzy** (periodic): +50% attack speed. *Hunter tranq shot.*
- **Terrifying Roar** (20s cooldown): Fear for 3s.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Digested Hand of Power | Off Hand | +42 INT, +54 SP |
| Gluth's Missing Collar | Neck | +40 STA, +38 STR |

---

#### Boss 13: Thaddius
*Massive flesh golem powered by electricity, requires precise coordination.*

| Attribute | Value |
|-----------|-------|
| Role | Quarter Final |
| Health | 3,200,000 |
| Enrage | 10 minutes |
| Mechanics | 5 |

**Phase 1 - Feugen & Stalagg:**
Must kill both mini-bosses within 5 seconds of each other or they resurrect.

- **Feugen** (600,000 HP): Static Field (3,000 nature damage to melee).
- **Stalagg** (600,000 HP): Power Surge (+50% damage buff, must tank swap).

**Phase 2 - Thaddius:**

**Special Mechanic - Polarity Shift:**
Every 30s, all players gain Positive or Negative charge. Same charges boost damage; opposite charges deal 5,000 damage to each other. *Must separate.*

**Abilities:**
- **Polarity Shift** (30s cooldown): Randomizes charges. Move to correct side.
- **Chain Lightning** (10s cooldown): 3,500 nature damage, chains to nearby.
- **Ball Lightning** (15s cooldown): Orbs deal 2,000 damage on contact.

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Plated Abomination Ribcage | Chest (Plate) | +56 STR, +54 STA (Warrior T3) |
| Wand of the Archivist | Wand | 72-134 Shadow dmg, +42 INT, +38 STA |

---

### Frostwyrm Lair (2 Bosses)

#### Boss 14: Sapphiron
*An ancient blue dragon raised as a frost wyrm, guardian of Maltheon.*

| Attribute | Value |
|-----------|-------|
| Role | Penultimate Boss |
| Health | 3,500,000 |
| Enrage | 15 minutes |
| Mechanics | 6 |

**Abilities:**
- **Frost Aura** (passive): 600 frost damage/tick to all. *Frost resistance crucial.*
- **Life Drain** (20s cooldown): 3,500 shadow damage, heals Sapphiron.
- **Chill** (8s cooldown): Random target slowed 50%, 3,000 frost damage.
- **Blizzard** (25s cooldown): Moving frost storm, 4,000 damage/tick.
- **Icebolt** (air phase): 5 random players frozen into ice blocks.
- **Frost Breath** (air phase): Massive cone breath dealing 15,000 damage. *Must hide behind ice blocks.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Sapphiron's Left Eye | Trinket | +26 Spell Hit, +40 SP |
| Glyph of Deflection | Trinket | +50 Defense rating |
| Frostfire Ring | Ring | +36 INT, +34 STA, +44 SP, +30 Frost Res |
| Shroud of Dominion | Head (Cloth) | +48 INT, +44 STA, +62 SP |

---

#### Boss 15: Maltheon the Deathweaver
*The lich lord himself, master of the Citadel of the Damned, final boss of the raid.*

| Attribute | Value |
|-----------|-------|
| Role | Final Boss |
| Health | 5,000,000 |
| Enrage | 20 minutes |
| Mechanics | 12 |
| Phases | 5 |

**Phase 1 (100% - 75% HP) - The Deathweaver:**
- **Shadow Bolt** (2s cooldown): 4,000 shadow damage to tank.
- **Frost Blast** (30s cooldown): Random target + nearby frozen, take 3,000 frost damage/tick for 5s. *Mass dispel.*
- **Chains of Maltheon** (20s cooldown): 3 players chained, must move toward each other or take 6,000 damage.
- **Shadow Fissure** (15s cooldown): Void zone dealing 10,000 damage after 3s. *Move out.*

**Phase 2 (75% HP) - Guardians:**
Maltheon becomes immune. Two Guardians of Icecrown spawn (500,000 HP each). Kill both within 15 seconds.

**Phase 3 (75% - 45% HP) - Soul Weaver:**
- All Phase 1 abilities continue.
- **Detonate Mana** (25s cooldown): Burns all mana from random target, deals damage equal to mana burned.
- **Summon Banshees** (45s cooldown): 2 Banshees (80,000 HP) with wail that sleeps.

**Phase 4 (45% HP) - The Fallen:**
- 5 random raid members mind controlled for 20s as "Fallen" soldiers.
- Must CC or damage to 50% HP to break control.
- Maltheon immune during this phase.

**Phase 5 (45% - 0% HP) - Armageddon:**
- All previous abilities with 30% increased damage.
- **Void Blast** (20s cooldown): 6,000 shadow damage to entire raid.
- **Chains of Frost** (15s cooldown): Tank chained and frozen, must be broken free.
- **Guardian of the Damned** (60s cooldown): One add spawns (300,000 HP).
- **Inevitable Doom** (30s cooldown): After 10s, deals 5,000 damage to entire raid. *Increases in frequency as fight continues.*

**Loot Highlights:**
| Item | Type | Stats |
|------|------|-------|
| Atiesh, Greatstaff of the Guardian | Staff (Legendary) | 98-166 dmg, +70 INT, +65 STA, +100 SP, Equip: Portal to Citadel |
| Frostmourne's Echo | Two-Hand (Sword) | 148-250 dmg, +75 STR, +70 STA, Proc: Frost damage + slow |
| The Soul Harvester | Two-Hand (Polearm) | 142-240 dmg, +72 AGI, +68 STA, +88 AP |
| Maltheon's Phylactery | Trinket | +50 to all stats, Use: Cheat death once (30 min CD) |
| Crown of the Deathweaver | Head (Cloth) | +58 INT, +54 STA, +78 SP, +35 Shadow Res |
| Dreadnaught Breastplate | Chest (Plate) | +62 STR, +60 STA (Warrior T3) |
| Cryptstalker Tunic | Chest (Mail) | +58 AGI, +56 STA, +48 AP (Hunter T3) |
| Frostfire Robe | Chest (Cloth) | +60 INT, +56 STA, +80 SP (Mage T3) |
| Redemption Tunic | Chest (Plate) | +56 INT, +54 STA, +70 Healing (Paladin T3) |

**Legendary Drop (0.1% chance per piece, requires quest):**
| Item | Type | Stats |
|------|------|-------|
| Atiesh, Greatstaff of the Guardian | Legendary Staff | Assembled from 40 Splinters dropped by all bosses |

---

### Raid Loot Distribution Summary

| Raid | ilvl Range | Legendary Chance | Clear Bonus |
|------|-----------|------------------|-------------|
| Heart of the Inferno (T1) | 66-76 | 1% (final boss) | 500 Gold |
| Drakescale Sanctum (T2) | 72-83 | 0.5% (final boss) | 750 Gold |
| Hive of the Swarm-God (T2.5) | 78-86 | 0.5% (final boss) | 1,000 Gold |
| Citadel of the Damned (T3) | 83-92 | Quest-based (Atiesh) | 2,000 Gold |

---

## Appendix F: Complete Talent Trees

This appendix contains the full talent tree specifications for all 7 classes (21 specializations). Each tree has 7 tiers with 51 total talent points available (levels 10-60).

**Talent System Rules:**
- 1 talent point per level from 10-60 (51 total)
- Must spend 5 points per tier to unlock the next tier
- Tier requirements: 0/5/10/15/20/25/30 points in tree
- Capstone (31-point) talents define specialization identity
- Most talents have multiple ranks (1-5)

---

### Warrior Talent Trees

#### Arms (Two-Handed DPS)
*Focus: Burst damage, bleed effects, and execute mechanics.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Heroic Strike | 3 | Reduces Rage cost of Heroic Strike by 1/2/3 |
| Deflection | 5 | Increases Parry chance by 1/2/3/4/5% |
| Improved Rend | 3 | Increases Rend bleed damage by 15/25/35% |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Tactical Mastery | 5 | Retain 5/10/15/20/25 Rage when switching stances |
| Deep Wounds | 3 | Critical hits cause bleed for 20/40/60% weapon damage over 12s |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Charge | 2 | Increases Rage from Charge by 3/6 |
| Improved Overpower | 2 | Increases Overpower crit chance by 25/50% |
| Anger Management | 1 | Generates 1 Rage every 3 seconds |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Impale | 2 | Increases critical strike bonus damage by 10/20% |
| Two-Handed Weapon Spec | 5 | Increases two-handed weapon damage by 1/2/3/4/5% |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Sweeping Strikes | 1 | Next 5 melee attacks hit 1 additional target (30s CD) |
| Mace Specialization | 5 | Mace hits have 1/2/3/4/5% chance to stun for 3s |
| Sword Specialization | 5 | Sword hits have 1/2/3/4/5% chance for extra attack |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Hamstring | 3 | Hamstring has 5/10/15% chance to immobilize for 5s |
| Trauma | 2 | Bleeds cause +15/30% physical damage to target |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Mortal Strike** | 1 | Instant attack: weapon damage +160, -50% healing for 10s (6s CD, 30 Rage) |

---

#### Fury (Dual-Wield DPS)
*Focus: Sustained damage, enrage effects, and frenzy mechanics.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Booming Voice | 5 | Increases Battle/Commanding Shout duration by 10/20/30/40/50% |
| Cruelty | 5 | Increases melee critical strike chance by 1/2/3/4/5% |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Unbridled Wrath | 5 | 8/16/24/32/40% chance to gain 1 Rage on hit |
| Improved Cleave | 3 | Increases Cleave damage by 40/80/120% |
| Piercing Howl | 1 | All enemies within 10 yards dazed, reducing speed 50% for 6s |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Blood Craze | 3 | Regenerate 1/2/3% HP over 6s after being crit |
| Improved Battle Shout | 5 | Increases AP bonus of Battle Shout by 5/10/15/20/25% |
| Dual Wield Specialization | 5 | Increases off-hand damage by 5/10/15/20/25% |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Execute | 2 | Reduces Rage cost of Execute by 2/5 |
| Enrage | 5 | 5/10/15/20/25% chance after being crit to gain +10% damage for 12s |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Death Wish | 1 | +20% damage, take +5% damage for 30s (3 min CD) |
| Improved Berserker Rage | 2 | Berserker Rage generates 5/10 Rage |
| Flurry | 5 | After crit, +10/15/20/25/30% attack speed for next 3 swings |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Whirlwind | 2 | Reduces Whirlwind cooldown by 1/2s |
| Bloodthirst Prep | 2 | Reduces Bloodthirst cooldown by 1/2s |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Bloodthirst** | 1 | Instant attack: 45% of AP as damage, heals for 20% of damage dealt (6s CD, 30 Rage) |

---

#### Protection (Tanking)
*Focus: Damage mitigation, threat generation, and survival cooldowns.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Shield Specialization | 5 | Increases block chance by 1/2/3/4/5%, +1 Rage on block |
| Anticipation | 5 | Increases Defense skill by 2/4/6/8/10 |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Bloodrage | 2 | Bloodrage generates 5/10 extra Rage |
| Toughness | 5 | Increases armor from items by 2/4/6/8/10% |
| Iron Will | 5 | Reduces stun/charm duration by 3/6/9/12/15% |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Last Stand | 1 | +30% max HP for 20s (10 min CD) |
| Improved Shield Block | 3 | Shield Block lasts 0.5/1/1.5s longer |
| Improved Revenge | 3 | Increases Revenge damage by 20/40/60%, +15/30/45% chance to stun |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Defiance | 5 | Increases threat by 3/6/9/12/15% in Defensive Stance |
| Improved Sunder Armor | 3 | Reduces Sunder cost by 1/2/3 Rage |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Shield Wall | 2 | Reduces Shield Wall cooldown by 3/6 minutes |
| Concussion Blow | 1 | Stuns target for 5s, 45s CD, generates high threat |
| Improved Taunt | 2 | Reduces Taunt cooldown by 1/2s |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| One-Handed Weapon Spec | 5 | Increases one-handed damage by 2/4/6/8/10% |
| Shield Bash Improved | 2 | Shield Bash silences for 2/4s |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Shield Slam** | 1 | Instant attack: 225 + block value as damage, dispels 1 magic effect, high threat (6s CD, 20 Rage) |

---

### Paladin Talent Trees

#### Holy (Healing)
*Focus: Healing throughput, mana efficiency, and Holy damage support.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Divine Strength | 5 | Increases STR by 2/4/6/8/10% |
| Divine Intellect | 5 | Increases INT by 2/4/6/8/10% |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Spiritual Focus | 5 | 14/28/42/56/70% chance to avoid pushback on Holy spells |
| Healing Light | 3 | Increases Holy Light/Flash healing by 4/8/12% |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Consecration | 1 | Consecrates ground for 8s, dealing Holy damage per tick |
| Improved Lay on Hands | 2 | Reduces Lay on Hands cooldown by 10/20 min, gives +15/30% armor |
| Unyielding Faith | 2 | Reduces fear/disorient duration by 10/20% |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Illumination | 5 | Holy crit returns 20/40/60/80/100% mana cost |
| Improved Blessing of Wisdom | 2 | Increases BoW mana regen by 10/20% |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Divine Favor | 1 | Next Holy spell guaranteed crit (2 min CD) |
| Sanctified Light | 3 | Increases Holy Light crit chance by 2/4/6% |
| Lasting Judgement | 3 | Increases Judgement duration by 10/20/30s |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Holy Power | 5 | Increases Holy spell crit by 1/2/3/4/5% |
| Light's Grace | 3 | Holy Light crit reduces next Holy Light cast time by 0.17/0.33/0.5s |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Holy Shock** | 1 | Instant Holy damage (enemy) or heal (ally), 15s CD |

---

#### Protection (Tanking)
*Focus: Block mechanics, Holy threat, and defensive cooldowns.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Devotion Aura | 5 | Increases Devotion Aura armor by 5/10/15/20/25% |
| Redoubt | 5 | After being crit, +10/20/30/40/50% block chance for 10s |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Precision | 3 | Increases hit chance by 1/2/3% |
| Guardian's Favor | 2 | Reduces BoP cooldown by 60/120s, BoF duration +2/4s |
| Toughness | 5 | Increases armor from items by 2/4/6/8/10% |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Blessing of Kings | 1 | Increases all stats by 10% |
| Improved Righteous Fury | 3 | Reduces damage taken by 2/4/6% with Righteous Fury |
| Shield Specialization | 3 | Increases block value by 10/20/30% |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Anticipation | 5 | Increases Defense skill by 4/8/12/16/20 |
| Improved Hammer of Justice | 3 | Reduces HoJ cooldown by 5/10/15s |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Blessing of Sanctuary | 1 | -3% damage taken, deals Holy damage on block (unlocks Sanc Aura) |
| Reckoning | 5 | 2/4/6/8/10% chance after being hit: next 4 attacks extra attack |
| Sacred Duty | 2 | Increases STA by 3/6% |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| One-Handed Weapon Spec | 5 | Increases 1H damage by 2/4/6/8/10% |
| Holy Shield Prep | 2 | Reduces Holy Shield cooldown by 2/4s |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Holy Shield** | 1 | +30% block for 10s, blocked attacks deal Holy damage (10s CD) |

---

#### Retribution (Melee DPS)
*Focus: Seal/Judgement damage, burst damage, and melee Holy hybrid.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Blessing of Might | 5 | Increases BoM AP by 4/8/12/16/20% |
| Benediction | 5 | Reduces Seal/Judgement mana cost by 3/6/9/12/15% |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Judgement | 2 | Reduces Judgement cooldown by 1/2s |
| Improved Seal of the Crusader | 3 | SotC increases Holy damage by 3/6/9% |
| Deflection | 5 | Increases Parry chance by 1/2/3/4/5% |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Vindication | 3 | Melee hits reduce target stats by 5/10/15% |
| Conviction | 5 | Increases crit chance by 1/2/3/4/5% |
| Seal of Command | 1 | Chance on hit: deal 70% weapon damage as Holy |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Pursuit of Justice | 2 | +4/8% movement speed, reduces disarm duration by 25/50% |
| Eye for an Eye | 2 | 15/30% chance to reflect 30% of spell damage |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Sanctity Aura | 1 | +10% Holy damage to party |
| Two-Handed Weapon Spec | 3 | +2/4/6% 2H damage |
| Vengeance | 5 | +3/6/9/12/15% Holy/Physical damage for 8s after crit |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Sanctity Aura | 2 | Sanctity Aura +1/2% damage |
| Crusader Strike | 1 | Instant melee attack refreshing all Judgements (6s CD) |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Repentance** | 1 | Incapacitates humanoid/undead for 6s (1 min CD) |

---

### Hunter Talent Trees

#### Beast Mastery (Pet-focused)
*Focus: Pet damage, pet survivability, and Beast Mastery abilities.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Aspect of the Hawk | 5 | Hawk procs +30% ranged speed for 12s (1/2/3/4/5% chance) |
| Endurance Training | 5 | Increases pet/Hunter HP by 2/4/6/8/10% |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Focused Fire | 2 | +1/2% damage when pet is active, +10/20% Kill Command damage |
| Improved Aspect of the Monkey | 5 | +1/2/3/4/5% dodge in Monkey Aspect |
| Thick Hide | 3 | +10/20/30% pet armor |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Pathfinding | 2 | +4/8% mounted speed, +6/12% Aspect of the Cheetah speed |
| Bestial Swiftness | 1 | Pet has +30% movement speed |
| Unleashed Fury | 5 | +4/8/12/16/20% pet damage |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Mend Pet | 2 | +15/30% Mend Pet healing, dispels 1 effect |
| Ferocity | 5 | +4/8/12/16/20% pet crit chance |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Spirit Bond | 2 | Hunter and pet regen 1/2% HP every 10s |
| Intimidation | 1 | Pet stuns target for 3s (1 min CD) |
| Bestial Discipline | 2 | +25/50% pet Focus regen |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Frenzy | 5 | Pet crit gives 30% attack speed for 8s (20/40/60/80/100% proc) |
| Animal Handler | 2 | +4/8% pet hit chance, +5/10% mounted speed |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Bestial Wrath** | 1 | Pet: +50% damage, immune to CC for 18s (2 min CD) |

---

#### Marksmanship (Ranged DPS)
*Focus: Ranged damage, critical strikes, and aimed shot mechanics.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Concussive Shot | 5 | +4/8/12/16/20% stun chance |
| Lethal Shots | 5 | +1/2/3/4/5% ranged crit |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Efficiency | 5 | -2/4/6/8/10% shot mana cost |
| Improved Hunter's Mark | 5 | +3/6/9/12/15% Hunter's Mark RAP bonus |
| Go for the Throat | 2 | Ranged crit gives pet 25/50 Focus |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Aimed Shot | 1 | +RAP shot with 6s CD, -50% healing on target |
| Improved Arcane Shot | 5 | +6/12/18/24/30% Arcane Shot damage |
| Rapid Killing | 2 | Reduces Rapid Fire CD by 1/2 min after kill |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Mortal Shots | 5 | +6/12/18/24/30% ranged crit damage |
| Improved Stings | 5 | +6/12/18/24/30% Sting damage |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Scatter Shot | 1 | Disorients target for 4s (30s CD) |
| Barrage | 3 | +4/8/12% Multi-Shot and Volley damage |
| Ranged Weapon Specialization | 5 | +1/2/3/4/5% ranged damage |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Combat Experience | 2 | +1/2% AGI, +3/6% INT |
| Trueshot Aura | 1 | Party gains +100 RAP |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Silencing Shot** | 1 | Instant shot that silences for 3s (20s CD) |

---

#### Survival (Utility/Traps)
*Focus: Trap mastery, melee capabilities, and survivability.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Monster Slaying | 3 | +1/2/3% damage vs Beasts/Giants/Dragonkin |
| Humanoid Slaying | 3 | +1/2/3% damage vs Humanoids |
| Hawk Eye | 3 | +2/4/6 yard range |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Savage Strikes | 2 | +10/20% crit on Raptor Strike/Mongoose Bite |
| Entrapment | 5 | Traps have 5/10/15/20/25% root chance for 5s |
| Deflection | 5 | +1/2/3/4/5% Parry |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Wing Clip | 3 | +7/14/20% immobilize chance |
| Clever Traps | 2 | +15/30% trap damage, +15/30% trap duration |
| Survivalist | 5 | +2/4/6/8/10% max HP |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Deterrence | 1 | +25% Parry/Dodge for 10s (5 min CD) |
| Trap Mastery | 2 | -15/30s trap cooldown |
| Surefooted | 3 | +1/2/3% hit, +5/10/15% snare/root resist |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Feign Death | 2 | +4/8% resist on FD, -5/10s CD |
| Survival Instincts | 2 | +2/4% crit on Arcane/Steady Shot |
| Killer Instinct | 3 | +1/2/3% crit |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Lightning Reflexes | 5 | +3/6/9/12/15% AGI |
| Resourcefulness | 3 | -20/40/60s trap CD, -33/66/100% melee cost |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Wyvern Sting** | 1 | Sleeps target for 12s, then DoT for 12s (2 min CD) |

---

### Rogue Talent Trees

#### Assassination (Dagger/Poison)
*Focus: Poison damage, finisher crits, and dagger specialization.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Eviscerate | 3 | +5/10/15% Eviscerate damage |
| Malice | 5 | +1/2/3/4/5% crit |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Ruthlessness | 3 | +20/40/60% chance to add combo point on finisher |
| Murder | 2 | +1/2% damage to all targets |
| Relentless Strikes | 1 | Finishers restore 25 Energy per combo point (20% per CP) |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Slice and Dice | 3 | +15/30/45% SnD duration |
| Lethality | 5 | +6/12/18/24/30% crit damage on Backstab, Ambush, etc. |
| Vile Poisons | 5 | +4/8/12/16/20% poison damage, +8/16/24/32/40% Envenom |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Poisons | 5 | +2/4/6/8/10% poison apply chance |
| Fleet Footed | 2 | +4/8% movement, +10/20% snare resist |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Cold Blood | 1 | Next offensive ability guaranteed crit (3 min CD) |
| Improved Kidney Shot | 3 | +1/2/3s Kidney Shot duration |
| Seal Fate | 5 | +20/40/60/80/100% CP on crit |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Vigor | 1 | +10 max Energy (110 total) |
| Deadened Nerves | 5 | -1/2/3/4/5% damage taken |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Mutilate** | 1 | 2x dagger strike, +50% damage if poisoned (requires daggers) |

---

#### Combat (Sword/Mace/Fist)
*Focus: Sustained combat, weapon specialization, and combat finishers.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Gouge | 3 | +0.5/1/1.5s Gouge duration |
| Improved Sinister Strike | 2 | -3/5 Energy cost |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Lightning Reflexes | 5 | +1/2/3/4/5% Dodge |
| Improved Backstab | 3 | -10/20/30 Backstab Energy cost |
| Deflection | 5 | +1/2/3/4/5% Parry |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Precision | 5 | +1/2/3/4/5% hit |
| Riposte | 1 | After parry: instant 150% weapon damage (6s CD) |
| Endurance | 2 | -15/30% CD on Sprint/Evasion |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Kick | 2 | +2/4s Kick silence |
| Dual Wield Specialization | 5 | +10/20/30/40/50% off-hand damage |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Blade Flurry | 1 | +20% attack speed, attacks hit second target for 15s (2 min CD) |
| Sword Specialization | 5 | 1/2/3/4/5% extra attack on sword hit |
| Fist Specialization | 5 | 1/2/3/4/5% increased crit with fist weapons |
| Mace Specialization | 5 | 1/2/3/4/5% armor ignore with maces |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Weapon Expertise | 2 | +3/5 weapon skill |
| Aggression | 3 | +2/4/6% Sinister Strike/Eviscerate damage |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Adrenaline Rush** | 1 | +100% Energy regen for 15s (5 min CD) |

---

#### Subtlety (Stealth/Control)
*Focus: Stealth bonuses, control abilities, and opener damage.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Master of Deception | 5 | +3/6/9/12/15 effective stealth level |
| Opportunity | 5 | +4/8/12/16/20% Backstab/Ambush/Garrote damage |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Sleight of Hand | 2 | -2/4% crit against you |
| Dirty Tricks | 2 | +1/2 range on Blind/Sap |
| Camouflage | 5 | +3/6/9/12/15% stealth speed, -1/2/3/4/5s stealth CD |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Initiative | 3 | +25/50/75% CP on opener |
| Ghostly Strike | 1 | 125% weapon damage, +15% dodge for 7s (20s CD) |
| Improved Ambush | 3 | +15/30/45% Ambush crit |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Setup | 3 | +33/67/100% CP on dodge |
| Elusiveness | 2 | -75/150s Vanish/Blind CD |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Serrated Blades | 3 | +3/6/9% armor ignore, +10/20/30% Rupture crit |
| Hemorrhage | 1 | Replaces Sinister Strike: +3 physical damage per attack (30 charges) |
| Heightened Senses | 2 | +3/6 stealth detection, +2/4% hit |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Deadliness | 5 | +2/4/6/8/10% AP |
| Premeditation | 1 | From stealth: add 2 CP to target (2 min CD) |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Preparation** | 1 | Resets CD on Evasion, Sprint, Vanish, Cold Blood, etc. (10 min CD) |

---

### Priest Talent Trees

#### Discipline (Shields/Mana)
*Focus: Damage prevention, mana efficiency, and power buffs.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Unbreakable Will | 5 | +3/6/9/12/15% stun/fear/silence resist |
| Wand Specialization | 5 | +5/10/15/20/25% wand damage |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Silent Resolve | 5 | -4/8/12/16/20% threat |
| Improved Power Word: Fortitude | 2 | +15/30% Fortitude STA |
| Improved Power Word: Shield | 3 | +5/10/15% PW:S absorb |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Martyrdom | 2 | After crit: +10/20% Smite/Holy Fire crit, no pushback |
| Inner Focus | 1 | Next spell free and +25% crit (3 min CD) |
| Meditation | 3 | +5/10/15% mana regen while casting |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Inner Fire | 3 | +10/20/30% Inner Fire armor |
| Mental Agility | 5 | -2/4/6/8/10% instant spell mana cost |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Divine Spirit | 1 | Buff target: +spirit |
| Improved Divine Spirit | 2 | Divine Spirit also +5/10% of Spirit as SP |
| Absolution | 3 | -5/10/15% Dispel/Cure/Abolish mana cost |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Mental Strength | 5 | +2/4/6/8/10% max mana |
| Focused Power | 2 | +2/4% damage, +1/2 Mass Dispel range |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Power Infusion** | 1 | Target: +20% spell damage, -20% mana cost for 15s (3 min CD) |

---

#### Holy (Pure Healing)
*Focus: Raw healing throughput, group healing, and Holy synergies.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Healing Focus | 2 | +35/70% pushback resist on healing |
| Improved Renew | 3 | +5/10/15% Renew healing |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Holy Specialization | 5 | +1/2/3/4/5% Holy spell crit |
| Spell Warding | 5 | -2/4/6/8/10% spell damage taken |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Divine Fury | 5 | -0.1/0.2/0.3/0.4/0.5s Smite/Holy Fire/Heal cast |
| Desperate Prayer | 1 | Instant self-heal (10 min CD) |
| Blessed Recovery | 3 | After crit received: HoT for 25/50/75% of damage |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Inspiration | 3 | Heal crit: +8/16/25% target armor for 15s |
| Holy Reach | 2 | +10/20% Holy spell range |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Healing | 3 | -5/10/15% Heal/Greater Heal mana cost |
| Searing Light | 2 | +5/10% Smite/Holy Fire damage |
| Spirit of Redemption | 1 | On death: Spirit form for 15s, can cast free heals |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Spiritual Guidance | 5 | +5/10/15/20/25% of Spirit as SP |
| Surge of Light | 2 | Spell crit: 25/50% chance for free instant Smite/Flash Heal |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Circle of Healing** | 1 | Instant: heals 5 party members (6s CD) |

---

#### Shadow (DPS)
*Focus: Shadow damage over time, Shadowform, and mana regeneration.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Spirit Tap | 5 | On kill: +100% mana regen, +5/10/15/20/25% of Spirit for 15s |
| Blackout | 5 | Shadow damage: 2/4/6/8/10% stun for 3s |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Shadow Affinity | 3 | -8/16/25% Shadow threat |
| Improved Shadow Word: Pain | 2 | +3/6% SW:P damage |
| Shadow Focus | 5 | -2/4/6/8/10% Shadow hit required |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Psychic Scream | 2 | -4/8s Psychic Scream CD |
| Improved Mind Blast | 5 | -0.5/1/1.5/2/2.5s Mind Blast CD |
| Mind Flay | 1 | Channels Shadow damage, slows 50% for 3s |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Fade | 2 | -3/6s Fade CD |
| Shadow Reach | 2 | +10/20% Shadow spell range |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Shadow Weaving | 5 | Shadow spells: stack +3% Shadow damage on target (max 5) |
| Silence | 1 | Silences target for 5s (45s CD) |
| Vampiric Embrace | 1 | Affliction heals party for 15% of Shadow damage |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Darkness | 5 | +2/4/6/8/10% Shadow damage |
| Shadowform | 1 | +15% Shadow damage, -15% Physical damage taken, can't cast Holy |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Vampiric Touch** | 1 | DoT: damage and restores mana to party equal to 5% of damage |

---

### Mage Talent Trees

#### Arcane (Mana/Utility)
*Focus: Mana management, spell efficiency, and arcane burst damage.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Arcane Subtlety | 2 | -20/40% Arcane threat |
| Arcane Focus | 5 | -1/2/3/4/5% Arcane hit required |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Arcane Missiles | 5 | -0.2/0.4/0.6/0.8/1s AM channel time |
| Wand Specialization | 2 | +12.5/25% wand damage |
| Arcane Concentration | 5 | 2/4/6/8/10% chance: Clearcasting (free spell) |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Counterspell | 2 | CS silences for 2/4s |
| Arcane Meditation | 3 | +5/10/15% mana regen while casting |
| Improved Arcane Explosion | 3 | +6/12/18% AE crit |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Mana Shield | 2 | -12.5/25% MS mana drain |
| Improved Blink | 2 | -0.5/1s Blink delay, +0/100% snare remove |
| Arcane Mind | 5 | +3/6/9/12/15% max mana |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Presence of Mind | 1 | Next spell instant (3 min CD) |
| Arcane Instability | 3 | +1/2/3% spell damage and crit |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Arcane Potency | 3 | Clearcasting: +10/20/30% spell crit |
| Empowered Arcane Missiles | 3 | +15/30/45% of SP to AM |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Arcane Power** | 1 | +30% damage, +30% mana cost for 15s (3 min CD) |

---

#### Fire (Burst DPS)
*Focus: Critical strikes, Ignite, and burst damage windows.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Fireball | 5 | -0.1/0.2/0.3/0.4/0.5s Fireball cast |
| Impact | 5 | Fire damage: 2/4/6/8/10% stun for 2s |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Ignite | 5 | Fire crit: DoT for 8/16/24/32/40% of damage over 4s |
| Flame Throwing | 2 | +3/6 yard Fire spell range |
| Improved Fire Blast | 5 | -0.5/1/1.5/2/2.5s Fire Blast CD |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Incineration | 2 | +2/4% Fire Blast/Scorch crit |
| Improved Flamestrike | 3 | +5/10/15% Flamestrike crit |
| Pyroblast | 1 | 6s cast: massive Fire damage + DoT |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Burning Soul | 2 | +35/70% pushback resist, -5/10% Fire threat |
| Improved Scorch | 3 | Scorch stacks +3% Fire damage on target (max 5) |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Master of Elements | 3 | Fire/Frost crit: restore 10/20/30% of mana cost |
| Playing with Fire | 3 | +1/2/3% Fire damage |
| Critical Mass | 3 | +2/4/6% Fire crit |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Blast Wave | 1 | AoE Fire damage + knockback (45s CD) |
| Fire Power | 5 | +2/4/6/8/10% Fire damage |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Combustion** | 1 | +10% Fire crit per cast until 3 crits (3 min CD) |

---

#### Frost (Control/Sustained)
*Focus: Slows, shatter combos, and sustained damage.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Frost Warding | 2 | +15/30% Frost Armor, +15/30% Frost Ward absorb |
| Improved Frostbolt | 5 | -0.1/0.2/0.3/0.4/0.5s Frostbolt cast |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Elemental Precision | 3 | -1/2/3% Frost/Fire hit required |
| Ice Shards | 5 | +20/40/60/80/100% Frost crit damage |
| Frostbite | 3 | Frost chill: 5/10/15% freeze for 5s |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Frost Nova | 2 | -15/30s Frost Nova CD |
| Permafrost | 3 | +4/7/10% slow effectiveness, +1/2/3s duration |
| Piercing Ice | 3 | +2/4/6% Frost damage |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Cold Snap | 1 | Resets all Frost CDs (10 min CD) |
| Improved Blizzard | 3 | Blizzard slows 25/50/75% |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Arctic Reach | 2 | +10/20% Frost spell range |
| Frost Channeling | 3 | -4/7/10% Frost mana cost |
| Shatter | 5 | +10/20/30/40/50% crit vs Frozen targets |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Ice Barrier | 1 | Absorb shield, prevents pushback (30s CD) |
| Ice Floes | 2 | -10/20% Cone/Blizzard CD |
| Winter's Chill | 5 | Frost crit: +2% Frost crit to target (max 5) |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Summon Water Elemental** | 1 | Summons Water Elemental pet for 45s (3 min CD) |

---

### Druid Talent Trees

#### Balance (Caster DPS)
*Focus: Nature/Arcane damage, Moonkin form, and spell crit.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Starlight Wrath | 5 | -0.1/0.2/0.3/0.4/0.5s Wrath/Starfire cast |
| Nature's Grasp | 1 | Next melee attacker rooted (automatic proc) |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Nature's Grasp | 4 | +15/30/45/65% Nature's Grasp chance |
| Control of Nature | 3 | -25/50/70% Roots/Cyclone pushback |
| Focused Starlight | 2 | +2/4% Wrath/Starfire crit |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Moonfire | 2 | +5/10% MF damage and crit |
| Brambles | 3 | +25/50/75% Thorns/Treants damage |
| Insect Swarm | 1 | DoT: Nature damage + target -2% hit |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Nature's Reach | 2 | +10/20% Balance spell range |
| Vengeance | 5 | +20/40/60/80/100% crit damage |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Celestial Focus | 3 | +1/2/3% Wrath/Starfire hit |
| Lunar Guidance | 3 | +8/16/25% INT as SP |
| Nature's Grace | 1 | Spell crit: -0.5s next cast |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Moonglow | 3 | -3/6/9% Moonfire/Starfire/Wrath mana cost |
| Moonfury | 5 | +2/4/6/8/10% Arcane/Nature damage |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Moonkin Form** | 1 | +5% spell crit to party, +150% armor, only Balance spells |

---

#### Feral Combat (Melee/Tank)
*Focus: Cat DPS, Bear tanking, and shapeshifting synergies.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Ferocity | 5 | -1/2/3/4/5 Rage/Energy cost on abilities |
| Feral Aggression | 5 | +3/6/9/12/15% Ferocious Bite damage |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Feral Instinct | 3 | +5/10/15% Swipe damage, +3/6/9% stealth |
| Brutal Impact | 2 | +0.5/1s Bash stun, +10/20% Pounce damage |
| Thick Hide | 3 | +4/7/10% armor from items |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Feral Swiftness | 2 | +15/30% outdoor speed, +2/4% dodge in forms |
| Feral Charge | 1 | Bear: charge + interrupt, Cat: leap behind target |
| Sharpened Claws | 3 | +2/4/6% crit in forms |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Shredding Attacks | 2 | -9/18 Shred Energy, -1/2 Lacerate Rage |
| Predatory Strikes | 3 | +50/100/150% level as feral AP |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Primal Fury | 2 | Crit in Bear: +5/10 Rage, Crit in Cat: +1/2 CP |
| Savage Fury | 2 | +10/20% Claw/Rake/Mangle/Maul damage |
| Faerie Fire (Feral) | 1 | Usable in forms: -armor, prevents stealth |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Nurturing Instinct | 2 | +25/50% of AGI as healing SP |
| Heart of the Wild | 5 | +4/8/12/16/20% INT, +4/8/12/16/20% Bear STA, +4/8/12/16/20% Cat AP |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Leader of the Pack** | 1 | Party: +5% melee crit in Cat/Bear form |

---

#### Restoration (Healing)
*Focus: HoT healing, Nature's Swiftness, and mana efficiency.*

**Tier 1 (0 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Improved Mark of the Wild | 5 | +7/14/21/28/35% MotW stats |
| Nature's Focus | 5 | +14/28/42/56/70% Healing/Regrowth pushback resist |

**Tier 2 (5 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Furor | 5 | Shift to Bear: +10/20/30/40/50% Rage, Cat: +0/20/40/60/80% Energy |
| Naturalist | 5 | -0.1/0.2/0.3/0.4/0.5s Healing Touch cast |
| Natural Shapeshifter | 3 | -10/20/30% shapeshift mana cost |

**Tier 3 (10 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Intensity | 3 | +5/10/15% mana regen in forms |
| Subtlety | 5 | -4/8/12/16/20% threat from healing |
| Omen of Clarity | 1 | Melee: chance for free spell/ability |

**Tier 4 (15 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Tranquil Spirit | 5 | -2/4/6/8/10% HT/Tranquility mana cost |
| Improved Rejuvenation | 3 | +5/10/15% Rejuvenation healing |

**Tier 5 (20 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Nature's Swiftness | 1 | Next Nature spell instant (3 min CD) |
| Gift of Nature | 5 | +2/4/6/8/10% all healing |
| Improved Tranquility | 2 | -50/100% Tranquility threat |

**Tier 6 (25 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| Empowered Touch | 2 | +10/20% SP to Healing Touch |
| Improved Regrowth | 5 | +10/20/30/40/50% Regrowth crit |

**Tier 7 (30 points required):**
| Talent | Ranks | Effect |
|--------|-------|--------|
| **Swiftmend** | 1 | Instantly consumes Rejuv/Regrowth for burst heal |

---

### Talent Synergy Guidelines

**Cross-tree Synergies:**
- Warriors: Arms/Fury hybrid for sustained damage
- Paladins: Holy/Prot for healing tanks
- Hunters: BM/MM for pet + ranged balance
- Rogues: Combat/Sub for Hemorrhage + Blade Flurry
- Priests: Disc/Holy for shield + healing
- Mages: Frost/Arcane for control + burst
- Druids: Feral/Resto for off-healing tanks

**Recommended Specs for Idle Combat:**

| Class | Role | Recommended Spec | Key Talents |
|-------|------|------------------|-------------|
| Warrior | DPS | 31/20/0 (MS/Fury) | Mortal Strike + Flurry |
| Warrior | Tank | 0/5/46 (Prot) | Shield Slam + Last Stand |
| Paladin | Heal | 35/11/5 (Holy) | Holy Shock + Illumination |
| Paladin | Tank | 0/42/9 (Prot) | Holy Shield + Reckoning |
| Hunter | DPS | 20/31/0 (MM) | Silencing Shot + Trueshot |
| Hunter | Pet | 41/10/0 (BM) | Bestial Wrath + Unleashed Fury |
| Rogue | DPS | 15/31/5 (Combat) | Adrenaline Rush + Blade Flurry |
| Priest | Heal | 23/28/0 (Disc/Holy) | Power Infusion + Spirit Redemption |
| Priest | DPS | 0/0/45 (Shadow) | Vampiric Touch + Shadowform |
| Mage | DPS | 10/41/0 (Fire) | Combustion + Ignite |
| Mage | Control | 0/0/41 (Frost) | Water Elemental + Shatter |
| Druid | Heal | 0/0/51 (Resto) | Swiftmend + Nature's Swiftness |
| Druid | Tank | 0/46/5 (Feral) | Leader of the Pack + Heart of the Wild |

---

## Conclusion

**Idle Raiders** combines the depth and satisfaction of classic MMORPG progression with the accessibility of modern idle games. By focusing on meaningful combat simulation, robust character customization, and respect for player time, the game offers a unique experience in the incremental genre.

**Core Strengths:**
- Deep, authentic MMORPG systems (talents, gear, raids)
- Fully offline functionality with meaningful progression
- Long-term goals spanning 60+ hours of engagement
- Fair monetization focused on convenience and cosmetics

**Next Steps:**
- Prototype core combat system
- Build vertical slice (1 class, 1-10 leveling, 1 dungeon)
- Playtest and iterate on "fun per minute"
- Expand to full class roster and endgame systems

This document serves as the foundation for development and can be expanded with specific ability lists, full dungeon designs, and detailed loot tables as needed.

---

**Document End**

---

## TODO Sections

### Completed:
- [x] **Appendix D**: Full 15-dungeon loot table expansion (200+ items)
- [x] **Appendix E**: Complete raid boss mechanics for all 42 bosses
- [x] **Section 4.7**: Hunter Pet System (families, abilities, training, AI)
- [x] **Appendix F**: Complete talent trees for all 21 specs
- [x] **Section 6.5**: Achievement System expansion (2,500+ points, 8 categories)
- [x] **Section 11**: PvP Arena System (future content design)
- [x] **Backend Fixes**: Rage generation, Priest SP scaling, Spell crit multiplier (all fixed)

### Incomplete - Requires Further Development:
- [x] **Section 5.6**: Threat mechanics simulation details (completed v1.8)
- [ ] **Section 8.4**: Mobile UI wireframes (currently ASCII mockups only)
- [x] **Section 9.3**: Battle Pass reward track specifics (50 levels, completed v1.8)

### Future Expansion Placeholders:
- [x] Guild system specification (completed v1.8)
- [x] Profession system (Blacksmithing, Alchemy, etc.) (completed v1.8)
- [ ] Detailed reputation rewards per faction
- [x] Mount system and collection (completed v1.8)
- [ ] Level 70 expansion content
- [ ] New classes (Death Knight, Shaman, Warlock)