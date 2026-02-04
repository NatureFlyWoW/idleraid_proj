// ============= SEED DATA FOR IDLE RAIDERS =============
// Starting content for levels 1-20

import { db } from '../../db';
import {
  zones,
  quests,
  dungeons,
  dungeonBosses,
  itemTemplates,
  itemSets,
  factions,
} from '@shared/schema';

// ============= ZONES =============

const STARTING_ZONES = [
  {
    name: 'Northshire Valley',
    description: 'A peaceful valley nestled in the foothills of Elwynn Forest. New adventurers train here under the watchful eye of Marshal McBride.',
    levelMin: 1,
    levelMax: 6,
    theme: 'forest',
  },
  {
    name: 'Elwynn Forest',
    description: 'A verdant woodland surrounding the human capital of Stormwind. Kobolds infest the mines while gnolls prowl the western reaches.',
    levelMin: 5,
    levelMax: 12,
    theme: 'forest',
  },
  {
    name: 'Westfall',
    description: 'Once fertile farmland, now overrun by the Defias Brotherhood and their mechanical harvest golems. The People\'s Militia struggles to maintain order.',
    levelMin: 10,
    levelMax: 20,
    theme: 'plains',
  },
  // Level 20-30 zones
  {
    name: 'Redridge Mountains',
    description: 'A mountainous region east of Elwynn Forest. The town of Lakeshire is under constant siege by Blackrock orcs from the Burning Steppes.',
    levelMin: 20,
    levelMax: 30,
    theme: 'mountains',
  },
  // Level 30-40 zones
  {
    name: 'Duskwood',
    description: 'A cursed forest shrouded in eternal twilight. Worgen, undead, and dark magic plague the town of Darkshire as the Night Watch struggles to protect its citizens.',
    levelMin: 30,
    levelMax: 40,
    theme: 'haunted_forest',
  },
];

// ============= QUESTS =============

const STARTING_QUESTS = [
  // Northshire Valley (1-6)
  {
    zoneId: 1, // Will be replaced with actual ID
    name: 'Wolves at the Gate',
    description: 'The wolves in Northshire have grown bold. Thin their numbers to protect the abbey.',
    type: 'kill' as const,
    level: 1,
    objectives: [{ type: 'kill', target: 'Timber Wolf', count: 8 }],
    baseDurationSeconds: 45,
    difficultyRating: 1,
    xpReward: 50,
    goldReward: 5,
    isRepeatable: true,
  },
  {
    zoneId: 1,
    name: 'Candle Collection',
    description: 'The abbey needs candles for evening prayers. Gather them from the kobolds in the nearby mine.',
    type: 'collection' as const,
    level: 2,
    objectives: [{ type: 'collect', target: 'Kobold Candle', count: 6, dropRate: 0.5 }],
    baseDurationSeconds: 60,
    difficultyRating: 1,
    xpReward: 75,
    goldReward: 8,
    isRepeatable: true,
  },
  {
    zoneId: 1,
    name: 'Kobold Menace',
    description: 'The kobolds have infested Echo Ridge Mine. Clear them out before they tunnel too deep.',
    type: 'kill' as const,
    level: 3,
    objectives: [{ type: 'kill', target: 'Kobold Worker', count: 10 }],
    baseDurationSeconds: 75,
    difficultyRating: 2,
    xpReward: 100,
    goldReward: 12,
    isRepeatable: true,
  },
  {
    zoneId: 1,
    name: 'Garrick Padfoot',
    description: 'A notorious bandit named Garrick Padfoot has been spotted in the vineyards. End his threat.',
    type: 'boss' as const,
    level: 5,
    objectives: [{ type: 'kill', target: 'Garrick Padfoot', count: 1 }],
    baseDurationSeconds: 90,
    difficultyRating: 3,
    xpReward: 200,
    goldReward: 25,
    isRepeatable: false,
    chainOrder: 1,
  },

  // Elwynn Forest (5-12)
  {
    zoneId: 2,
    name: 'Gold Dust Exchange',
    description: 'The Stormwind Mining Guild pays well for gold dust collected from the kobolds in Fargodeep Mine.',
    type: 'collection' as const,
    level: 6,
    objectives: [{ type: 'collect', target: 'Gold Dust', count: 10, dropRate: 0.4 }],
    baseDurationSeconds: 90,
    difficultyRating: 2,
    xpReward: 150,
    goldReward: 20,
    isRepeatable: true,
  },
  {
    zoneId: 2,
    name: 'Gnoll Incursion',
    description: 'Riverpaw gnolls have been raiding farms along the western border. Push them back.',
    type: 'kill' as const,
    level: 8,
    objectives: [{ type: 'kill', target: 'Riverpaw Gnoll', count: 12 }],
    baseDurationSeconds: 120,
    difficultyRating: 3,
    xpReward: 225,
    goldReward: 30,
    isRepeatable: true,
  },
  {
    zoneId: 2,
    name: 'Hogger',
    description: 'The gnoll warlord Hogger terrorizes travelers on the road to Westfall. This menace must be stopped.',
    type: 'boss' as const,
    level: 11,
    objectives: [{ type: 'kill', target: 'Hogger', count: 1 }],
    baseDurationSeconds: 180,
    difficultyRating: 5,
    xpReward: 500,
    goldReward: 75,
    isRepeatable: false,
    chainOrder: 1,
  },

  // Westfall (10-20)
  {
    zoneId: 3,
    name: 'Harvest Watchers',
    description: 'The Defias have activated old harvest golems to terrorize farmers. Destroy them.',
    type: 'kill' as const,
    level: 12,
    objectives: [{ type: 'kill', target: 'Harvest Watcher', count: 10 }],
    baseDurationSeconds: 120,
    difficultyRating: 3,
    xpReward: 300,
    goldReward: 40,
    isRepeatable: true,
  },
  {
    zoneId: 3,
    name: 'Red Bandanas',
    description: 'The People\'s Militia needs proof of Defias activity. Collect their red bandanas.',
    type: 'collection' as const,
    level: 14,
    objectives: [{ type: 'collect', target: 'Red Bandana', count: 15, dropRate: 0.35 }],
    baseDurationSeconds: 150,
    difficultyRating: 4,
    xpReward: 400,
    goldReward: 55,
    isRepeatable: true,
  },
  {
    zoneId: 3,
    name: 'The Defias Kingpin',
    description: 'Edwin VanCleef leads the Defias Brotherhood from his hidden stronghold. Find him.',
    type: 'boss' as const,
    level: 18,
    objectives: [{ type: 'kill', target: 'Edwin VanCleef', count: 1 }],
    baseDurationSeconds: 300,
    difficultyRating: 6,
    xpReward: 1000,
    goldReward: 150,
    isRepeatable: false,
    chainOrder: 1,
  },

  // Redridge Mountains (20-30)
  {
    zoneId: 4,
    name: 'Blackrock Incursion',
    description: 'Blackrock orcs have been raiding caravans along the main road. Defend the travelers.',
    type: 'kill' as const,
    level: 22,
    objectives: [{ type: 'kill', target: 'Blackrock Grunt', count: 12 }],
    baseDurationSeconds: 180,
    difficultyRating: 4,
    xpReward: 550,
    goldReward: 75,
    isRepeatable: true,
  },
  {
    zoneId: 4,
    name: 'Lake Everstill Defense',
    description: 'Murlocs from the lake have grown aggressive. Thin their numbers before they overrun Lakeshire.',
    type: 'kill' as const,
    level: 24,
    objectives: [{ type: 'kill', target: 'Murloc Tidehunter', count: 15 }],
    baseDurationSeconds: 210,
    difficultyRating: 4,
    xpReward: 700,
    goldReward: 90,
    isRepeatable: true,
  },
  {
    zoneId: 4,
    name: 'The Blackrock Warlord',
    description: 'Warlord Tharok commands the Blackrock forces from Stonewatch Keep. His reign of terror must end.',
    type: 'boss' as const,
    level: 28,
    objectives: [{ type: 'kill', target: 'Warlord Tharok', count: 1 }],
    baseDurationSeconds: 360,
    difficultyRating: 6,
    xpReward: 1500,
    goldReward: 200,
    isRepeatable: false,
    chainOrder: 1,
  },

  // Duskwood (30-40)
  {
    zoneId: 5,
    name: 'Worgen in the Woods',
    description: 'Feral worgen have been attacking travelers. Hunt them down before more lives are lost.',
    type: 'kill' as const,
    level: 32,
    objectives: [{ type: 'kill', target: 'Nightbane Worgen', count: 12 }],
    baseDurationSeconds: 240,
    difficultyRating: 5,
    xpReward: 900,
    goldReward: 120,
    isRepeatable: true,
  },
  {
    zoneId: 5,
    name: 'Ghoul Epidemic',
    description: 'The undead are rising from Raven Hill Cemetery. Destroy the ghouls and collect proof of their destruction.',
    type: 'collection' as const,
    level: 35,
    objectives: [{ type: 'collect', target: 'Ghoul Fang', count: 20, dropRate: 0.4 }],
    baseDurationSeconds: 300,
    difficultyRating: 5,
    xpReward: 1100,
    goldReward: 150,
    isRepeatable: true,
  },
  {
    zoneId: 5,
    name: 'The Dark Rider',
    description: 'A mysterious Dark Rider has been seen near Manor Mistmantle. Uncover the truth behind the curse.',
    type: 'boss' as const,
    level: 38,
    objectives: [{ type: 'kill', target: 'Dark Rider of Duskwood', count: 1 }],
    baseDurationSeconds: 420,
    difficultyRating: 7,
    xpReward: 2000,
    goldReward: 300,
    isRepeatable: false,
    chainOrder: 1,
  },
];

// ============= DUNGEONS =============

const STARTING_DUNGEONS = [
  {
    name: 'Cindermaw Caverns',
    description: 'A volcanic cave system inhabited by fire elementals and their orc cultist masters. The flames within burn eternal.',
    tier: 1,
    levelMin: 15,
    levelMax: 18,
    baseDurationSeconds: 480, // 8 minutes
    requiredItemLevel: 8,
    trashPackCount: 6,
    hasHeroicMode: false,
  },
  {
    name: 'The Deadmines',
    description: 'Hidden beneath the town of Moonbrook lies the stronghold of the Defias Brotherhood. Navigate the twisting mine tunnels to confront Edwin VanCleef aboard his massive warship.',
    tier: 1,
    levelMin: 17,
    levelMax: 21,
    baseDurationSeconds: 600, // 10 minutes
    requiredItemLevel: 10,
    trashPackCount: 8,
    hasHeroicMode: false,
  },
  {
    name: 'Serpent\'s Lament',
    description: 'A network of underground caverns where the druids of the Fang conduct dark nature rituals. The serpents here have grown twisted by corruption.',
    tier: 1,
    levelMin: 18,
    levelMax: 25,
    baseDurationSeconds: 720, // 12 minutes
    requiredItemLevel: 12,
    trashPackCount: 10,
    hasHeroicMode: false,
  },
];

// Cindermaw Caverns bosses - loot table itemId references array index + 1
// Items 14-20 are regular Cindermaw drops, items 31-35 are Cindermaw Battlegear set pieces
const CINDERMAW_BOSSES = [
  {
    name: 'Flamewarden Gorrak',
    description: 'An orc cultist who has mastered the art of fire magic. His flames burn hotter than any forge.',
    orderIndex: 1,
    isFinalBoss: false,
    health: 2200,
    damage: 40,
    armor: 180,
    mechanics: [
      { name: 'Flame Strike', trigger: 'timer', triggerValue: 12, effect: 'damage', damage: 65 },
    ],
    lootTable: [
      { itemId: 14, dropChance: 0.20 }, // Flamewarden's Torch
      { itemId: 15, dropChance: 0.15 }, // Cultist's Cindercloth Robe
      { itemId: 31, dropChance: 0.18 }, // Cindermaw Greathelm (set piece)
    ],
  },
  {
    name: 'Molten Lurker',
    description: 'A fire elemental that dwells in the deepest lava pools. It emerges only to consume the unwary.',
    orderIndex: 2,
    isFinalBoss: false,
    health: 2800,
    damage: 50,
    armor: 250,
    mechanics: [
      { name: 'Molten Armor', trigger: 'health', triggerValue: 50, effect: 'buff', damage: 0 },
      { name: 'Lava Burst', trigger: 'timer', triggerValue: 15, effect: 'damage', damage: 75 },
    ],
    lootTable: [
      { itemId: 16, dropChance: 0.20 }, // Molten Core Fragment
      { itemId: 17, dropChance: 0.15 }, // Magma-Forged Bracers
      { itemId: 32, dropChance: 0.20 }, // Cindermaw Pauldrons (set piece)
      { itemId: 34, dropChance: 0.18 }, // Cindermaw Gauntlets (set piece)
    ],
  },
  {
    name: 'Pyroclast the Burning',
    description: 'The ancient elemental lord of Cindermaw. His power could turn entire mountains to ash.',
    orderIndex: 3,
    isFinalBoss: true,
    health: 4200,
    damage: 65,
    armor: 350,
    enrageTimerSeconds: 240,
    mechanics: [
      { name: 'Pyroclastic Flow', trigger: 'timer', triggerValue: 20, effect: 'damage', damage: 100 },
      { name: 'Inferno', trigger: 'health', triggerValue: 30, effect: 'dot', damage: 30 },
    ],
    lootTable: [
      { itemId: 18, dropChance: 0.25 }, // Pyroclast's Infernal Blade
      { itemId: 19, dropChance: 0.20 }, // Crown of Cinders
      { itemId: 20, dropChance: 0.15 }, // Lavawalker Boots
      { itemId: 33, dropChance: 0.15 }, // Cindermaw Breastplate (set piece)
      { itemId: 35, dropChance: 0.18 }, // Cindermaw Greaves (set piece)
    ],
  },
];

// Deadmines bosses - loot table itemId references STARTING_ITEMS array index + 1
// Items 7-13 are Deadmines drops (Rhahk'zor's Hammer through VanCleef's Battle Gear)
const DEADMINES_BOSSES = [
  {
    name: 'Rhahk\'zor',
    description: 'A massive ogre overseer who guards the entrance to the deeper tunnels.',
    orderIndex: 1,
    isFinalBoss: false,
    health: 2500,
    damage: 45,
    armor: 200,
    mechanics: [
      { name: 'Rhahk\'zor Slam', trigger: 'timer', triggerValue: 15, effect: 'damage', damage: 80 },
    ],
    lootTable: [
      { itemId: 7, dropChance: 0.15 },  // Rhahk'zor's Hammer
      { itemId: 8, dropChance: 0.15 },  // Miner's Cape
    ],
  },
  {
    name: 'Sneed\'s Shredder',
    description: 'A goblin-piloted lumber shredder that guards the foundry.',
    orderIndex: 2,
    isFinalBoss: false,
    health: 3500,
    damage: 55,
    armor: 350,
    mechanics: [
      { name: 'Terrifying Screech', trigger: 'health', triggerValue: 50, effect: 'fear', damage: 0 },
      { name: 'Distracting Pain', trigger: 'timer', triggerValue: 20, effect: 'damage', damage: 60 },
    ],
    lootTable: [
      { itemId: 9, dropChance: 0.20 },  // Buzzer Blade
      { itemId: 10, dropChance: 0.15 }, // Gnomish Mechanic's Goggles
    ],
  },
  {
    name: 'Edwin VanCleef',
    description: 'The mastermind behind the Defias Brotherhood, a former stonemason seeking revenge on Stormwind.',
    orderIndex: 3,
    isFinalBoss: true,
    health: 5000,
    damage: 70,
    armor: 400,
    enrageTimerSeconds: 300,
    mechanics: [
      { name: 'Deadly Poison', trigger: 'timer', triggerValue: 10, effect: 'dot', damage: 25 },
      { name: 'Allies', trigger: 'health', triggerValue: 50, effect: 'summon_adds', damage: 0 },
      { name: 'Thrash', trigger: 'timer', triggerValue: 8, effect: 'damage', damage: 90 },
    ],
    lootTable: [
      { itemId: 11, dropChance: 0.25 }, // Cruel Barb
      { itemId: 12, dropChance: 0.20 }, // Cape of the Brotherhood
      { itemId: 13, dropChance: 0.15 }, // VanCleef's Battle Gear
    ],
  },
];

// Serpent's Lament bosses - loot table itemId references array index + 1
// Items 21-30 are regular drops, items 36-40 are Serpentscale Vestments set pieces
const SERPENT_BOSSES = [
  {
    name: 'Viper Lord Sethrix',
    description: 'A massive serpent who commands the lesser vipers. His venom can paralyze in seconds.',
    orderIndex: 1,
    isFinalBoss: false,
    health: 3000,
    damage: 48,
    armor: 200,
    mechanics: [
      { name: 'Venomous Bite', trigger: 'timer', triggerValue: 10, effect: 'dot', damage: 20 },
    ],
    lootTable: [
      { itemId: 21, dropChance: 0.20 }, // Serpent Fang Dagger
      { itemId: 22, dropChance: 0.15 }, // Venom-Stained Bracers
      { itemId: 37, dropChance: 0.20 }, // Serpentscale Spaulders (set piece)
    ],
  },
  {
    name: 'Lady Anacondria',
    description: 'A druid of the Fang who has embraced the serpent\'s form. Her magic corrupts all it touches.',
    orderIndex: 2,
    isFinalBoss: false,
    health: 3500,
    damage: 55,
    armor: 180,
    mechanics: [
      { name: 'Lightning Bolt', trigger: 'timer', triggerValue: 8, effect: 'damage', damage: 85 },
      { name: 'Healing Touch', trigger: 'health', triggerValue: 40, effect: 'heal', damage: -300 },
    ],
    lootTable: [
      { itemId: 23, dropChance: 0.20 }, // Anacondria's Nature Staff
      { itemId: 24, dropChance: 0.15 }, // Serpent Scale Shoulders
      { itemId: 36, dropChance: 0.18 }, // Serpentscale Hood (set piece)
    ],
  },
  {
    name: 'Pythonas the Dreamer',
    description: 'A druid who has delved too deep into the emerald nightmare. His dreams have become nightmares.',
    orderIndex: 3,
    isFinalBoss: false,
    health: 4000,
    damage: 52,
    armor: 220,
    mechanics: [
      { name: 'Sleep', trigger: 'timer', triggerValue: 25, effect: 'stun', damage: 0 },
      { name: 'Nightmare Bolt', trigger: 'timer', triggerValue: 12, effect: 'damage', damage: 70 },
    ],
    lootTable: [
      { itemId: 25, dropChance: 0.20 }, // Dreamweaver's Cord
      { itemId: 26, dropChance: 0.15 }, // Nightmare's Edge
      { itemId: 39, dropChance: 0.22 }, // Serpentscale Gloves (set piece)
    ],
  },
  {
    name: 'Verdan the Evergrowing',
    description: 'Once a noble druid, now a monstrous plant creature sustained by dark nature magic. He guards the heart of the caverns.',
    orderIndex: 4,
    isFinalBoss: true,
    health: 6000,
    damage: 75,
    armor: 400,
    enrageTimerSeconds: 360,
    mechanics: [
      { name: 'Thorns', trigger: 'combat_start', triggerValue: 0, effect: 'reflect', damage: 15 },
      { name: 'Entangling Roots', trigger: 'timer', triggerValue: 18, effect: 'stun', damage: 0 },
      { name: 'Nature\'s Wrath', trigger: 'health', triggerValue: 25, effect: 'damage', damage: 120 },
    ],
    lootTable: [
      { itemId: 27, dropChance: 0.30 }, // Verdant Keeper's Aim
      { itemId: 28, dropChance: 0.25 }, // Living Root Vest
      { itemId: 29, dropChance: 0.20 }, // Evergreen Mantle
      { itemId: 30, dropChance: 0.10 }, // Thorn-Studded Legguards
      { itemId: 38, dropChance: 0.15 }, // Serpentscale Tunic (set piece)
      { itemId: 40, dropChance: 0.18 }, // Serpentscale Leggings (set piece)
    ],
  },
];

// ============= ITEM TEMPLATES =============

const STARTING_ITEMS = [
  // Common weapons (levels 1-10)
  {
    name: 'Worn Shortsword',
    description: 'A simple blade, showing signs of use.',
    slot: 'mainHand' as const,
    rarity: 'common' as const,
    itemLevel: 5,
    requiredLevel: 1,
    isWeapon: true,
    weaponType: 'sword',
    minDamage: 3,
    maxDamage: 7,
    weaponSpeed: 2.0,
    strength: 1,
    sellPrice: 5,
  },
  {
    name: 'Cracked Wooden Staff',
    description: 'An old staff held together by faith alone.',
    slot: 'mainHand' as const,
    rarity: 'common' as const,
    itemLevel: 5,
    requiredLevel: 1,
    isWeapon: true,
    weaponType: 'staff',
    minDamage: 4,
    maxDamage: 8,
    weaponSpeed: 2.8,
    intellect: 1,
    spirit: 1,
    sellPrice: 5,
  },
  {
    name: 'Kobold Mining Mace',
    description: 'A crude mace fashioned from mining tools.',
    slot: 'mainHand' as const,
    rarity: 'uncommon' as const,
    itemLevel: 8,
    requiredLevel: 3,
    isWeapon: true,
    weaponType: 'mace',
    minDamage: 6,
    maxDamage: 12,
    weaponSpeed: 2.2,
    strength: 2,
    stamina: 1,
    sellPrice: 15,
  },

  // Uncommon gear (levels 5-15)
  {
    name: 'Militia Chestguard',
    description: 'Standard issue armor from the People\'s Militia.',
    slot: 'chest' as const,
    rarity: 'uncommon' as const,
    itemLevel: 12,
    requiredLevel: 8,
    armor: 85,
    stamina: 4,
    strength: 2,
    sellPrice: 35,
  },
  {
    name: 'Gnoll Hide Leggings',
    description: 'Rough leggings made from gnoll pelts.',
    slot: 'legs' as const,
    rarity: 'uncommon' as const,
    itemLevel: 14,
    requiredLevel: 10,
    armor: 70,
    agility: 4,
    stamina: 3,
    sellPrice: 40,
  },
  {
    name: 'Westfall Cloth Robe',
    description: 'A simple robe favored by apprentice mages.',
    slot: 'chest' as const,
    rarity: 'uncommon' as const,
    itemLevel: 15,
    requiredLevel: 10,
    armor: 30,
    intellect: 5,
    spirit: 3,
    spellPower: 5,
    sellPrice: 45,
  },

  // Dungeon drops (Deadmines)
  {
    name: 'Rhahk\'zor\'s Hammer',
    description: 'A massive hammer once wielded by the ogre overseer.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 19,
    requiredLevel: 15,
    isWeapon: true,
    weaponType: 'mace',
    minDamage: 18,
    maxDamage: 35,
    weaponSpeed: 2.8,
    strength: 6,
    stamina: 4,
    dropSource: 'Rhahk\'zor',
    sellPrice: 150,
  },
  {
    name: 'Miner\'s Cape',
    description: 'A sturdy cape worn by the mine\'s overseers.',
    slot: 'back' as const,
    rarity: 'uncommon' as const,
    itemLevel: 17,
    requiredLevel: 13,
    armor: 25,
    stamina: 4,
    agility: 2,
    dropSource: 'Rhahk\'zor',
    sellPrice: 65,
  },
  {
    name: 'Buzzer Blade',
    description: 'A jagged blade recovered from Sneed\'s Shredder.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 20,
    requiredLevel: 16,
    isWeapon: true,
    weaponType: 'sword',
    minDamage: 16,
    maxDamage: 30,
    weaponSpeed: 1.8,
    agility: 5,
    critRating: 8,
    dropSource: 'Sneed\'s Shredder',
    sellPrice: 175,
  },
  {
    name: 'Gnomish Mechanic\'s Goggles',
    description: 'Precision eyewear from the shredder\'s cockpit.',
    slot: 'head' as const,
    rarity: 'uncommon' as const,
    itemLevel: 18,
    requiredLevel: 14,
    armor: 35,
    intellect: 5,
    hitRating: 5,
    dropSource: 'Sneed\'s Shredder',
    sellPrice: 80,
  },
  {
    name: 'Cruel Barb',
    description: 'VanCleef\'s personal dagger, stained with countless betrayals.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 22,
    requiredLevel: 17,
    isWeapon: true,
    weaponType: 'dagger',
    minDamage: 12,
    maxDamage: 24,
    weaponSpeed: 1.4,
    agility: 6,
    critRating: 10,
    dropSource: 'Edwin VanCleef',
    sellPrice: 225,
  },
  {
    name: 'Cape of the Brotherhood',
    description: 'A flowing red cape bearing the Defias insignia.',
    slot: 'back' as const,
    rarity: 'rare' as const,
    itemLevel: 22,
    requiredLevel: 17,
    armor: 30,
    agility: 5,
    stamina: 4,
    critRating: 6,
    dropSource: 'Edwin VanCleef',
    sellPrice: 200,
  },
  {
    name: 'VanCleef\'s Battle Gear',
    description: 'The leather armor worn by the Defias kingpin himself.',
    slot: 'chest' as const,
    rarity: 'rare' as const,
    itemLevel: 23,
    requiredLevel: 18,
    armor: 120,
    agility: 8,
    stamina: 6,
    attackPower: 12,
    dropSource: 'Edwin VanCleef',
    sellPrice: 275,
  },

  // ============= CINDERMAW CAVERNS DROPS (levels 15-18) =============
  // Flamewarden Gorrak drops (items 14-15, mapped to boss loot IDs 101-102)
  {
    name: 'Flamewarden\'s Torch',
    description: 'A staff crackling with barely contained fire magic.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 17,
    requiredLevel: 13,
    isWeapon: true,
    weaponType: 'staff',
    minDamage: 14,
    maxDamage: 28,
    weaponSpeed: 2.6,
    intellect: 5,
    spellPower: 12,
    dropSource: 'Flamewarden Gorrak',
    sellPrice: 120,
  },
  {
    name: 'Cultist\'s Cindercloth Robe',
    description: 'Fireproof robes worn by the flame cultists.',
    slot: 'chest' as const,
    rarity: 'uncommon' as const,
    itemLevel: 16,
    requiredLevel: 12,
    armor: 35,
    intellect: 4,
    stamina: 3,
    spirit: 3,
    dropSource: 'Flamewarden Gorrak',
    sellPrice: 85,
  },

  // Molten Lurker drops (items 16-17, mapped to boss loot IDs 103-104)
  {
    name: 'Molten Core Fragment',
    description: 'A shard of pure elemental fire, warm to the touch.',
    slot: 'offHand' as const,
    rarity: 'rare' as const,
    itemLevel: 18,
    requiredLevel: 14,
    armor: 0,
    intellect: 6,
    spellPower: 10,
    hitRating: 4,
    dropSource: 'Molten Lurker',
    sellPrice: 135,
  },
  {
    name: 'Magma-Forged Bracers',
    description: 'Bracers tempered in volcanic heat.',
    slot: 'wrist' as const,
    rarity: 'uncommon' as const,
    itemLevel: 17,
    requiredLevel: 13,
    armor: 65,
    strength: 4,
    stamina: 3,
    dropSource: 'Molten Lurker',
    sellPrice: 75,
  },

  // Pyroclast the Burning drops (items 18-20, mapped to boss loot IDs 105-107)
  {
    name: 'Pyroclast\'s Infernal Blade',
    description: 'A sword wreathed in eternal flames.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 19,
    requiredLevel: 15,
    isWeapon: true,
    weaponType: 'sword',
    minDamage: 18,
    maxDamage: 34,
    weaponSpeed: 2.4,
    strength: 5,
    stamina: 4,
    attackPower: 8,
    dropSource: 'Pyroclast the Burning',
    sellPrice: 180,
  },
  {
    name: 'Crown of Cinders',
    description: 'A helm forged from the essence of the fire lord.',
    slot: 'head' as const,
    rarity: 'rare' as const,
    itemLevel: 19,
    requiredLevel: 15,
    armor: 80,
    intellect: 7,
    stamina: 5,
    spellPower: 15,
    dropSource: 'Pyroclast the Burning',
    sellPrice: 195,
  },
  {
    name: 'Lavawalker Boots',
    description: 'Boots enchanted to walk safely across molten rock.',
    slot: 'feet' as const,
    rarity: 'uncommon' as const,
    itemLevel: 18,
    requiredLevel: 14,
    armor: 55,
    agility: 4,
    stamina: 4,
    critRating: 5,
    dropSource: 'Pyroclast the Burning',
    sellPrice: 110,
  },

  // ============= SERPENT'S LAMENT DROPS (levels 18-25) =============
  // Viper Lord Sethrix drops (items 21-22, mapped to boss loot IDs 201-202)
  {
    name: 'Serpent Fang Dagger',
    description: 'A dagger crafted from the fang of a great serpent.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 20,
    requiredLevel: 16,
    isWeapon: true,
    weaponType: 'dagger',
    minDamage: 14,
    maxDamage: 26,
    weaponSpeed: 1.6,
    agility: 6,
    stamina: 3,
    attackPower: 6,
    dropSource: 'Viper Lord Sethrix',
    sellPrice: 165,
  },
  {
    name: 'Venom-Stained Bracers',
    description: 'Leather bracers stained with potent venom.',
    slot: 'wrist' as const,
    rarity: 'uncommon' as const,
    itemLevel: 19,
    requiredLevel: 15,
    armor: 45,
    agility: 4,
    stamina: 3,
    dropSource: 'Viper Lord Sethrix',
    sellPrice: 85,
  },

  // Lady Anacondria drops (items 23-24, mapped to boss loot IDs 203-204)
  {
    name: 'Anacondria\'s Nature Staff',
    description: 'A staff pulsing with corrupted nature magic.',
    slot: 'mainHand' as const,
    rarity: 'rare' as const,
    itemLevel: 22,
    requiredLevel: 17,
    isWeapon: true,
    weaponType: 'staff',
    minDamage: 22,
    maxDamage: 42,
    weaponSpeed: 2.8,
    intellect: 8,
    spirit: 5,
    spellPower: 18,
    dropSource: 'Lady Anacondria',
    sellPrice: 225,
  },
  {
    name: 'Serpent Scale Shoulders',
    description: 'Shoulder pads made from iridescent serpent scales.',
    slot: 'shoulders' as const,
    rarity: 'uncommon' as const,
    itemLevel: 21,
    requiredLevel: 16,
    armor: 75,
    intellect: 5,
    stamina: 4,
    spirit: 3,
    dropSource: 'Lady Anacondria',
    sellPrice: 95,
  },

  // Pythonas the Dreamer drops (items 25-26, mapped to boss loot IDs 205-206)
  {
    name: 'Dreamweaver\'s Cord',
    description: 'A belt woven from nightmare essence.',
    slot: 'waist' as const,
    rarity: 'rare' as const,
    itemLevel: 23,
    requiredLevel: 18,
    armor: 50,
    intellect: 6,
    spirit: 5,
    spellPower: 12,
    dropSource: 'Pythonas the Dreamer',
    sellPrice: 155,
  },
  {
    name: 'Nightmare\'s Edge',
    description: 'A blade forged in the realm of dreams.',
    slot: 'mainHand' as const,
    rarity: 'uncommon' as const,
    itemLevel: 22,
    requiredLevel: 17,
    isWeapon: true,
    weaponType: 'sword',
    minDamage: 18,
    maxDamage: 34,
    weaponSpeed: 2.2,
    strength: 5,
    agility: 3,
    stamina: 4,
    dropSource: 'Pythonas the Dreamer',
    sellPrice: 135,
  },

  // Verdan the Evergrowing drops (items 27-30, mapped to boss loot IDs 207-210)
  {
    name: 'Verdant Keeper\'s Aim',
    description: 'A bow grown from a living branch of the world tree.',
    slot: 'ranged' as const,
    rarity: 'rare' as const,
    itemLevel: 25,
    requiredLevel: 20,
    isWeapon: true,
    weaponType: 'bow',
    minDamage: 24,
    maxDamage: 45,
    weaponSpeed: 2.6,
    agility: 8,
    stamina: 5,
    critRating: 10,
    dropSource: 'Verdan the Evergrowing',
    sellPrice: 285,
  },
  {
    name: 'Living Root Vest',
    description: 'Armor formed from intertwined living roots.',
    slot: 'chest' as const,
    rarity: 'rare' as const,
    itemLevel: 25,
    requiredLevel: 20,
    armor: 140,
    stamina: 8,
    strength: 6,
    agility: 4,
    dropSource: 'Verdan the Evergrowing',
    sellPrice: 310,
  },
  {
    name: 'Evergreen Mantle',
    description: 'Shoulders blessed with the regenerative power of nature.',
    slot: 'shoulders' as const,
    rarity: 'rare' as const,
    itemLevel: 24,
    requiredLevel: 19,
    armor: 95,
    intellect: 7,
    spirit: 6,
    spellPower: 14,
    dropSource: 'Verdan the Evergrowing',
    sellPrice: 245,
  },
  {
    name: 'Thorn-Studded Legguards',
    description: 'Druidic legguards reinforced with razor-sharp thorns.',
    slot: 'legs' as const,
    rarity: 'uncommon' as const,
    itemLevel: 24,
    requiredLevel: 19,
    armor: 110,
    agility: 6,
    stamina: 5,
    attackPower: 10,
    dropSource: 'Verdan the Evergrowing',
    sellPrice: 195,
  },
];

// ============= FACTIONS =============

const STARTING_FACTIONS = [
  {
    name: 'Stormwind',
    description: 'The Kingdom of Stormwind, bastion of humanity in Azeroth.',
    rewards: [
      { standing: 'Friendly', discount: 5 },
      { standing: 'Honored', discount: 10 },
      { standing: 'Revered', discount: 15 },
      { standing: 'Exalted', discount: 20 },
    ],
  },
  {
    name: 'Stormwind Guard',
    description: 'The military force protecting Stormwind and its territories.',
    rewards: [
      { standing: 'Honored', items: [4] }, // Will be replaced with actual item IDs
      { standing: 'Revered', items: [5] },
    ],
  },
];

// ============= ITEM SETS =============

type SetBonus = {
  pieces: number;
  description: string;
  stats?: Record<string, number>;
  effect?: string;
};

const ITEM_SET_DEFINITIONS: Array<{
  name: string;
  classRestriction: 'warrior' | 'paladin' | 'hunter' | 'rogue' | 'priest' | 'mage' | 'druid' | null;
  bonuses: SetBonus[];
}> = [
  {
    name: 'Cindermaw Battlegear',
    classRestriction: null, // Warriors and Paladins can use plate
    bonuses: [
      { pieces: 2, description: '+15 Fire Resistance', stats: { fireResistance: 15 } },
      { pieces: 3, description: '+5% Block Value', stats: { blockValue: 5 } },
      { pieces: 5, description: 'Melee attacks have 8% chance to deal 75 Fire damage', effect: 'fire_proc' },
    ],
  },
  {
    name: 'Serpentscale Vestments',
    classRestriction: 'druid',
    bonuses: [
      { pieces: 2, description: '+8 MP5 (mana per 5 seconds)', stats: { mp5: 8 } },
      { pieces: 3, description: '+3% healing done', stats: { healingBonus: 3 } },
      { pieces: 5, description: 'Your heals have 10% chance to restore 50 mana', effect: 'mana_proc' },
    ],
  },
];

// Set items are added at the end of STARTING_ITEMS with setIndex references
// setIndex 1 = Cindermaw Battlegear, setIndex 2 = Serpentscale Vestments
const SET_ITEMS = [
  // ============= CINDERMAW BATTLEGEAR (Plate Tank Set, levels 20-25) =============
  // Set Index: 1
  {
    name: 'Cindermaw Greathelm',
    description: 'A helm forged in the heart of Cindermaw Caverns, radiating residual heat.',
    slot: 'head' as const,
    rarity: 'rare' as const,
    itemLevel: 22,
    requiredLevel: 20,
    armor: 420,
    stamina: 18,
    strength: 12,
    setIndex: 1,
    dropSource: 'Flamewarden Gorrak',
    sellPrice: 180,
  },
  {
    name: 'Cindermaw Pauldrons',
    description: 'Shoulder guards shaped from volcanic rock and tempered steel.',
    slot: 'shoulders' as const,
    rarity: 'rare' as const,
    itemLevel: 23,
    requiredLevel: 20,
    armor: 380,
    stamina: 15,
    strength: 10,
    setIndex: 1,
    dropSource: 'Molten Lurker',
    sellPrice: 165,
  },
  {
    name: 'Cindermaw Breastplate',
    description: 'A massive chestpiece adorned with smoldering runes of protection.',
    slot: 'chest' as const,
    rarity: 'rare' as const,
    itemLevel: 25,
    requiredLevel: 22,
    armor: 520,
    stamina: 22,
    strength: 15,
    setIndex: 1,
    dropSource: 'Pyroclast the Burning',
    sellPrice: 225,
  },
  {
    name: 'Cindermaw Gauntlets',
    description: 'Heavy gauntlets that glow faintly with inner fire.',
    slot: 'hands' as const,
    rarity: 'rare' as const,
    itemLevel: 21,
    requiredLevel: 19,
    armor: 340,
    stamina: 12,
    strength: 8,
    attackPower: 10,
    setIndex: 1,
    dropSource: 'Molten Lurker',
    sellPrice: 145,
  },
  {
    name: 'Cindermaw Greaves',
    description: 'Leg armor reinforced with molten-cooled iron plating.',
    slot: 'legs' as const,
    rarity: 'rare' as const,
    itemLevel: 24,
    requiredLevel: 21,
    armor: 460,
    stamina: 20,
    strength: 14,
    setIndex: 1,
    dropSource: 'Pyroclast the Burning',
    sellPrice: 195,
  },

  // ============= SERPENTSCALE VESTMENTS (Leather Healer Set, levels 20-25) =============
  // Set Index: 2
  {
    name: 'Serpentscale Hood',
    description: 'A hooded helm crafted from the scales of an ancient serpent.',
    slot: 'head' as const,
    rarity: 'rare' as const,
    itemLevel: 23,
    requiredLevel: 20,
    classRestriction: 'druid' as const,
    armor: 180,
    intellect: 16,
    spirit: 14,
    spellPower: 18,
    setIndex: 2,
    dropSource: 'Lady Anacondria',
    sellPrice: 175,
  },
  {
    name: 'Serpentscale Spaulders',
    description: 'Shoulder pads woven from iridescent serpent scales.',
    slot: 'shoulders' as const,
    rarity: 'rare' as const,
    itemLevel: 22,
    requiredLevel: 19,
    classRestriction: 'druid' as const,
    armor: 160,
    intellect: 12,
    spirit: 12,
    setIndex: 2,
    dropSource: 'Viper Lord Sethrix',
    sellPrice: 160,
  },
  {
    name: 'Serpentscale Tunic',
    description: 'A vest of interlocking scales imbued with nature magic.',
    slot: 'chest' as const,
    rarity: 'rare' as const,
    itemLevel: 25,
    requiredLevel: 22,
    classRestriction: 'druid' as const,
    armor: 220,
    intellect: 20,
    spirit: 18,
    spellPower: 25,
    setIndex: 2,
    dropSource: 'Verdan the Evergrowing',
    sellPrice: 220,
  },
  {
    name: 'Serpentscale Gloves',
    description: 'Delicate gloves that enhance the wearer\'s healing touch.',
    slot: 'hands' as const,
    rarity: 'rare' as const,
    itemLevel: 21,
    requiredLevel: 18,
    classRestriction: 'druid' as const,
    armor: 140,
    intellect: 10,
    spirit: 10,
    critRating: 8,
    setIndex: 2,
    dropSource: 'Pythonas the Dreamer',
    sellPrice: 140,
  },
  {
    name: 'Serpentscale Leggings',
    description: 'Leg armor alive with the essence of the serpent lords.',
    slot: 'legs' as const,
    rarity: 'rare' as const,
    itemLevel: 24,
    requiredLevel: 21,
    classRestriction: 'druid' as const,
    armor: 200,
    intellect: 18,
    spirit: 15,
    spellPower: 20,
    setIndex: 2,
    dropSource: 'Verdan the Evergrowing',
    sellPrice: 190,
  },
];

// Map dungeons to their bosses for seeding
const DUNGEON_BOSSES_MAP: Record<string, typeof CINDERMAW_BOSSES> = {
  'Cindermaw Caverns': CINDERMAW_BOSSES,
  'The Deadmines': DEADMINES_BOSSES,
  'Serpent\'s Lament': SERPENT_BOSSES,
};

// ============= SEED FUNCTION =============

export async function seedStartingContent(): Promise<void> {
  console.log('Seeding starting content...');

  // Check if already seeded
  const existingZones = await db.select().from(zones);
  if (existingZones.length > 0) {
    console.log('Content already seeded, skipping...');
    return;
  }

  // Seed zones
  console.log('Seeding zones...');
  const insertedZones = await db.insert(zones).values(STARTING_ZONES).returning();
  const zoneIdMap = new Map(insertedZones.map((z, i) => [i + 1, z.id]));

  // Seed quests with correct zone IDs
  console.log('Seeding quests...');
  const questsWithZoneIds = STARTING_QUESTS.map(q => ({
    ...q,
    zoneId: zoneIdMap.get(q.zoneId) ?? q.zoneId,
  }));
  await db.insert(quests).values(questsWithZoneIds);

  // Seed item sets
  console.log('Seeding item sets...');
  const insertedSets = await db.insert(itemSets).values(ITEM_SET_DEFINITIONS).returning();
  const setIdMap = new Map(insertedSets.map((set, i) => [i + 1, set.id]));

  // Prepare set items with actual set IDs
  const setItemsWithSetIds = SET_ITEMS.map(item => {
    const { setIndex, ...rest } = item;
    return {
      ...rest,
      setId: setIndex ? setIdMap.get(setIndex) : undefined,
    };
  });

  // Combine all items
  const allItems = [...STARTING_ITEMS, ...setItemsWithSetIds];

  // Seed items
  console.log('Seeding item templates...');
  const insertedItems = await db.insert(itemTemplates).values(allItems).returning();
  const itemIdMap = new Map(insertedItems.map((item, i) => [i + 1, item.id]));
  // Also map by name for set item lookups
  const itemByNameMap = new Map(insertedItems.map(item => [item.name, item.id]));

  // Seed dungeons
  console.log('Seeding dungeons...');
  const insertedDungeons = await db.insert(dungeons).values(STARTING_DUNGEONS).returning();

  // Seed dungeon bosses for each dungeon
  console.log('Seeding dungeon bosses...');
  let totalBosses = 0;
  for (const dungeon of insertedDungeons) {
    const bosses = DUNGEON_BOSSES_MAP[dungeon.name];
    if (bosses) {
      const bossesWithDungeonId = bosses.map(boss => ({
        ...boss,
        dungeonId: dungeon.id,
        // Transform loot table item IDs from array indices to actual database IDs
        lootTable: boss.lootTable.map(loot => ({
          ...loot,
          itemId: itemIdMap.get(loot.itemId) ?? loot.itemId,
        })),
      }));
      await db.insert(dungeonBosses).values(bossesWithDungeonId);
      totalBosses += bosses.length;
    }
  }

  // Seed factions
  console.log('Seeding factions...');
  await db.insert(factions).values(STARTING_FACTIONS);

  console.log('Seed complete! Created:');
  console.log(`  - ${STARTING_ZONES.length} zones`);
  console.log(`  - ${STARTING_QUESTS.length} quests`);
  console.log(`  - ${allItems.length} item templates (${STARTING_ITEMS.length} base + ${SET_ITEMS.length} set pieces)`);
  console.log(`  - ${ITEM_SET_DEFINITIONS.length} item sets`);
  console.log(`  - ${STARTING_DUNGEONS.length} dungeons with ${totalBosses} bosses total`);
  console.log(`  - ${STARTING_FACTIONS.length} factions`);
}

// Export for use in server startup or CLI
export default seedStartingContent;
