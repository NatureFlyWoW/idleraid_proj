import { useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// ART STYLE DEMO - Exploring 4 Different Visual Directions
// ============================================================================
// Reference: IdleRaiders_Concept.pdf, Melvor Idle, 2000s DnD aesthetic
// ============================================================================

type StyleVariant = "pure-ascii" | "ascii-color" | "stylized-text" | "hybrid";

// Item rarity colors from shared/types/game.ts
const RARITY_COLORS = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

// Class colors (WoW-style)
const CLASS_COLORS = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// ============================================================================
// VARIANT 1: PURE ASCII (No color, terminal-style)
// ============================================================================

function PureASCIIStatPanel() {
  return (
    <div className="font-mono text-xs text-stone-300 bg-black p-4 border border-stone-700">
      <pre className="leading-tight">{`
+========================================+
|         THROGNAR THE MIGHTY            |
|         Level 45 Warrior               |
+========================================+
|                                        |
|  Health: [####################....] 82%|
|  Rage:   [########................]  32|
|                                        |
+----------------------------------------+
|  ATTRIBUTES           |  COMBAT STATS  |
|  -----------------    |  ------------- |
|  Strength:    245     |  Attack:   612 |
|  Agility:     108     |  Crit:   18.4% |
|  Stamina:     198     |  Hit:     6.2% |
|  Intellect:    42     |  Armor:  5,420 |
|  Spirit:       35     |  DPS:    287.5 |
+----------------------------------------+
|  [E]quipment  [T]alents  [I]nventory   |
+========================================+
      `.trim()}</pre>
    </div>
  );
}

function PureASCIICombatLog() {
  return (
    <div className="font-mono text-xs text-stone-300 bg-black p-4 border border-stone-700">
      <pre className="leading-tight">{`
+=== COMBAT LOG ===========================+
| 00:32 You hit Defias Pillager for 287    |
| 00:33 Defias Pillager hits you for 156   |
| 00:34 *CRITICAL* Mortal Strike for 574   |
| 00:35 You gain 25 Rage                   |
| 00:36 Defias Pillager casts Shadow Bolt  |
| 00:38 Shadow Bolt hits you for 412       |
| 00:39 You hit for 298                    |
| 00:40 You use Health Potion (+1,000 HP)  |
| 00:41 You hit for 312                    |
| 00:42 *KILLING BLOW* Execute for 891     |
+------------------------------------------+
| Victory! +245 XP, +12 Gold               |
| Loot: [Worn Leather Belt]                |
+==========================================+
      `.trim()}</pre>
    </div>
  );
}

function PureASCIIItemTooltip() {
  return (
    <div className="font-mono text-xs text-stone-300 bg-black p-4 border border-stone-700">
      <pre className="leading-tight">{`
+----------------------------------+
| Blade of Eternal Darkness        |
| Item Level 68                    |
| [RARE]                           |
+----------------------------------+
| Main Hand        Sword           |
| 95 - 142 Damage     Speed 2.6    |
| (45.6 damage per second)         |
+----------------------------------+
| +18 Strength                     |
| +12 Stamina                      |
| +24 Attack Power                 |
| +1.2% Critical Strike            |
+----------------------------------+
| Equip: 2% chance on hit to       |
|        drain 50 life from target |
+----------------------------------+
| Requires Level 58                |
| Sell Price: 12g 54s 32c          |
+----------------------------------+
      `.trim()}</pre>
    </div>
  );
}

function PureASCIIActivitySelector() {
  return (
    <div className="font-mono text-xs text-stone-300 bg-black p-4 border border-stone-700">
      <pre className="leading-tight">{`
+============ SELECT ACTIVITY ============+
|                                         |
|  [1] QUESTING                           |
|      > Westfall (Lvl 10-20)             |
|        Progress: [########......] 62%   |
|        Est. Time: 15:30                 |
|                                         |
|  [2] DUNGEONS                           |
|      > Deadmines (Lvl 18-22)            |
|        Success Rate: 94%                |
|        Est. Time: 28:00                 |
|                                         |
|  [3] RAIDS (Locked - Lvl 60 Required)   |
|      > Molten Core                      |
|        [==========] LOCKED              |
|                                         |
+-----------------------------------------+
| Current Activity: IDLE                  |
| Press [ENTER] to start selected         |
+=========================================+
      `.trim()}</pre>
    </div>
  );
}

// ============================================================================
// VARIANT 2: ASCII + COLOR (Terminal-style with strategic colors)
// ============================================================================

function ASCIIColorStatPanel() {
  return (
    <div className="font-mono text-xs bg-[#0a0a0a] p-4 border-2 border-amber-900/50">
      {/* Header */}
      <div className="text-amber-500 border-b border-amber-900/50 pb-2 mb-2">
        <span className="text-amber-400">╔══════════════════════════════════════╗</span>
      </div>
      <div className="text-center mb-2">
        <span className="text-amber-400 text-sm font-bold">THROGNAR</span>
        <span className="text-stone-500"> the Mighty</span>
        <div className="text-stone-400">Level 45 <span style={{ color: CLASS_COLORS.warrior }}>Warrior</span></div>
      </div>
      <div className="text-amber-400 border-b border-amber-900/50 pb-2 mb-3">
        <span>╠══════════════════════════════════════╣</span>
      </div>

      {/* Health Bar */}
      <div className="mb-2">
        <span className="text-stone-500">Health </span>
        <span className="text-red-600">[</span>
        <span className="text-red-500">████████████████████</span>
        <span className="text-red-900">░░░░</span>
        <span className="text-red-600">]</span>
        <span className="text-red-400 ml-2">2,829/3,450</span>
      </div>

      {/* Rage Bar */}
      <div className="mb-3">
        <span className="text-stone-500">Rage   </span>
        <span className="text-orange-600">[</span>
        <span className="text-orange-500">████████</span>
        <span className="text-orange-900">░░░░░░░░░░░░░░░░</span>
        <span className="text-orange-600">]</span>
        <span className="text-orange-400 ml-2">32/100</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-4 text-stone-400">
        <div>
          <div className="text-amber-600 mb-1">─── ATTRIBUTES ───</div>
          <div><span className="text-stone-500">STR:</span> <span className="text-amber-300">245</span></div>
          <div><span className="text-stone-500">AGI:</span> <span className="text-green-300">108</span></div>
          <div><span className="text-stone-500">STA:</span> <span className="text-red-300">198</span></div>
          <div><span className="text-stone-500">INT:</span> <span className="text-blue-300">42</span></div>
          <div><span className="text-stone-500">SPI:</span> <span className="text-cyan-300">35</span></div>
        </div>
        <div>
          <div className="text-amber-600 mb-1">─── COMBAT ───</div>
          <div><span className="text-stone-500">ATK:</span> <span className="text-white">612</span></div>
          <div><span className="text-stone-500">Crit:</span> <span className="text-yellow-400">18.4%</span></div>
          <div><span className="text-stone-500">Hit:</span> <span className="text-white">6.2%</span></div>
          <div><span className="text-stone-500">Armor:</span> <span className="text-stone-300">5,420</span></div>
          <div><span className="text-stone-500">DPS:</span> <span className="text-green-400">287.5</span></div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-amber-400 border-t border-amber-900/50 pt-2 mt-3">
        <span>╚══════════════════════════════════════╝</span>
      </div>
    </div>
  );
}

function ASCIIColorCombatLog() {
  return (
    <div className="font-mono text-xs bg-[#0a0a0a] p-4 border-2 border-amber-900/50">
      <div className="text-amber-500 mb-2">╔═══ COMBAT LOG ═══════════════════════╗</div>

      <div className="space-y-1 text-stone-400 mb-2">
        <div><span className="text-stone-600">00:32</span> You hit Defias Pillager for <span className="text-white">287</span></div>
        <div><span className="text-stone-600">00:33</span> <span className="text-red-400">Defias Pillager</span> hits you for <span className="text-red-500">156</span></div>
        <div><span className="text-stone-600">00:34</span> <span className="text-yellow-400">★CRITICAL★</span> Mortal Strike for <span className="text-yellow-300">574</span></div>
        <div><span className="text-stone-600">00:35</span> You gain <span className="text-orange-400">+25 Rage</span></div>
        <div><span className="text-stone-600">00:36</span> <span className="text-red-400">Defias Pillager</span> casts <span className="text-purple-400">Shadow Bolt</span></div>
        <div><span className="text-stone-600">00:38</span> <span className="text-purple-400">Shadow Bolt</span> hits you for <span className="text-red-500">412</span></div>
        <div><span className="text-stone-600">00:39</span> You hit for <span className="text-white">298</span></div>
        <div><span className="text-stone-600">00:40</span> You use <span className="text-green-400">Health Potion</span> <span className="text-green-300">(+1,000 HP)</span></div>
        <div><span className="text-stone-600">00:42</span> <span className="text-red-500">☠ KILLING BLOW ☠</span> Execute for <span className="text-red-400">891</span></div>
      </div>

      <div className="border-t border-amber-900/50 pt-2">
        <div className="text-green-400">✓ Victory!</div>
        <div><span className="text-purple-400">+245 XP</span> <span className="text-yellow-500">+12 Gold</span></div>
        <div>Loot: <span style={{ color: RARITY_COLORS.uncommon }}>[Worn Leather Belt]</span></div>
      </div>

      <div className="text-amber-500 mt-2">╚══════════════════════════════════════╝</div>
    </div>
  );
}

function ASCIIColorItemTooltip() {
  return (
    <div className="font-mono text-xs bg-[#0a0a0a] p-4 border-2" style={{ borderColor: RARITY_COLORS.rare }}>
      {/* Item Name - Rare (Blue) */}
      <div className="mb-2">
        <div style={{ color: RARITY_COLORS.rare }} className="font-bold">Blade of Eternal Darkness</div>
        <div className="text-stone-500">Item Level 68</div>
      </div>

      <div className="border-t border-stone-800 pt-2 mb-2">
        <div className="text-stone-400">Main Hand <span className="float-right">Sword</span></div>
        <div className="text-white">95 - 142 Damage <span className="float-right text-stone-500">Speed 2.6</span></div>
        <div className="text-stone-500">(45.6 damage per second)</div>
      </div>

      <div className="border-t border-stone-800 pt-2 mb-2 text-stone-300">
        <div><span className="text-green-400">+18 Strength</span></div>
        <div><span className="text-green-400">+12 Stamina</span></div>
        <div><span className="text-green-400">+24 Attack Power</span></div>
        <div><span className="text-green-400">+1.2% Critical Strike</span></div>
      </div>

      <div className="border-t border-stone-800 pt-2 mb-2">
        <div className="text-green-500">Equip: 2% chance on hit to drain</div>
        <div className="text-green-500">       50 life from target</div>
      </div>

      <div className="border-t border-stone-800 pt-2 text-stone-500">
        <div>Requires Level 58</div>
        <div>Sell Price: <span className="text-yellow-500">12g 54s 32c</span></div>
      </div>
    </div>
  );
}

function ASCIIColorActivitySelector() {
  return (
    <div className="font-mono text-xs bg-[#0a0a0a] p-4 border-2 border-amber-900/50">
      <div className="text-amber-500 text-center mb-3">
        ═══════════ SELECT ACTIVITY ═══════════
      </div>

      {/* Questing */}
      <div className="mb-4 p-2 border border-stone-800 hover:border-amber-700 cursor-pointer">
        <div className="text-amber-400 font-bold">[1] QUESTING</div>
        <div className="text-stone-400 ml-4">
          <div>► <span className="text-white">Westfall</span> <span className="text-stone-500">(Lvl 10-20)</span></div>
          <div className="mt-1">
            Progress: <span className="text-green-600">[</span>
            <span className="text-green-500">████████</span>
            <span className="text-green-900">░░░░░░</span>
            <span className="text-green-600">]</span>
            <span className="text-green-400 ml-1">62%</span>
          </div>
          <div className="text-stone-500">Est. Time: 15:30</div>
        </div>
      </div>

      {/* Dungeons */}
      <div className="mb-4 p-2 border border-stone-800 hover:border-amber-700 cursor-pointer">
        <div className="text-blue-400 font-bold">[2] DUNGEONS</div>
        <div className="text-stone-400 ml-4">
          <div>► <span className="text-white">Deadmines</span> <span className="text-stone-500">(Lvl 18-22)</span></div>
          <div>Success Rate: <span className="text-green-400">94%</span></div>
          <div className="text-stone-500">Est. Time: 28:00</div>
        </div>
      </div>

      {/* Raids - Locked */}
      <div className="mb-4 p-2 border border-stone-800 opacity-50">
        <div className="text-purple-400 font-bold">[3] RAIDS <span className="text-red-500">(LOCKED)</span></div>
        <div className="text-stone-500 ml-4">
          <div>► Molten Core</div>
          <div className="text-red-400">Requires Level 60</div>
        </div>
      </div>

      <div className="border-t border-amber-900/50 pt-2 text-center">
        <span className="text-stone-500">Current: </span>
        <span className="text-amber-400 animate-pulse">● IDLE</span>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT 3: STYLIZED TEXT UI (Medieval fonts, parchment textures)
// ============================================================================

function StylizedStatPanel() {
  return (
    <div
      className="p-6 rounded-lg relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2a2318 0%, #1a1610 50%, #2a2318 100%)",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(139,90,43,0.3)",
        border: "3px solid #8b5a2b",
      }}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-700/50"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-700/50"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-700/50"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-700/50"></div>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-amber-200 tracking-wide" style={{ fontFamily: "serif", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
          Thrognar
        </h2>
        <p className="text-amber-600/80 italic text-sm">the Mighty</p>
        <p className="text-amber-500 text-sm mt-1">Level 45 Warrior</p>
      </div>

      {/* Health/Rage */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs text-amber-200/80 mb-1">
            <span>Health</span>
            <span>2,829 / 3,450</span>
          </div>
          <div className="h-4 rounded bg-stone-900 border border-stone-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-900 to-red-600" style={{ width: "82%" }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-amber-200/80 mb-1">
            <span>Rage</span>
            <span>32 / 100</span>
          </div>
          <div className="h-4 rounded bg-stone-900 border border-stone-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-900 to-orange-500" style={{ width: "32%" }}></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-amber-600 font-bold border-b border-amber-900/50 pb-1">Attributes</div>
          <div className="text-amber-200/90">Strength: <span className="text-amber-400 font-bold">245</span></div>
          <div className="text-amber-200/90">Agility: <span className="text-green-400 font-bold">108</span></div>
          <div className="text-amber-200/90">Stamina: <span className="text-red-400 font-bold">198</span></div>
          <div className="text-amber-200/90">Intellect: <span className="text-blue-400 font-bold">42</span></div>
        </div>
        <div className="space-y-1">
          <div className="text-amber-600 font-bold border-b border-amber-900/50 pb-1">Combat</div>
          <div className="text-amber-200/90">Attack: <span className="text-white font-bold">612</span></div>
          <div className="text-amber-200/90">Crit: <span className="text-yellow-400 font-bold">18.4%</span></div>
          <div className="text-amber-200/90">DPS: <span className="text-green-400 font-bold">287.5</span></div>
        </div>
      </div>
    </div>
  );
}

function StylizedCombatLog() {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        background: "linear-gradient(135deg, #1a1610 0%, #0d0b08 100%)",
        border: "2px solid #3d2a1a",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
      }}
    >
      <div className="text-center text-amber-500 font-bold mb-3 text-sm tracking-widest" style={{ fontFamily: "serif" }}>
        ~ BATTLE RECORD ~
      </div>

      <div className="space-y-2 text-xs" style={{ fontFamily: "serif" }}>
        <div className="text-stone-400">
          <span className="text-stone-600">00:34</span>
          <span className="text-yellow-400 ml-2">★ Critical Strike!</span>
          <span className="text-amber-200 ml-1">Mortal Strike deals</span>
          <span className="text-yellow-300 font-bold ml-1">574</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">00:38</span>
          <span className="text-red-400 ml-2">Defias Pillager</span>
          <span className="text-purple-400 ml-1">Shadow Bolt</span>
          <span className="text-red-300 ml-1">-412 HP</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">00:40</span>
          <span className="text-green-400 ml-2">Health Potion consumed</span>
          <span className="text-green-300 ml-1">+1,000 HP</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">00:42</span>
          <span className="text-red-500 ml-2">☠ Killing Blow!</span>
          <span className="text-amber-200 ml-1">Execute deals</span>
          <span className="text-red-400 font-bold ml-1">891</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-amber-900/30 text-center">
        <span className="text-green-400 font-bold">Victory!</span>
        <span className="text-purple-400 ml-3">+245 XP</span>
        <span className="text-yellow-500 ml-3">+12 Gold</span>
      </div>
    </div>
  );
}

function StylizedItemTooltip() {
  return (
    <div
      className="p-4 rounded-lg max-w-xs"
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
        border: `2px solid ${RARITY_COLORS.epic}`,
        boxShadow: `0 0 20px ${RARITY_COLORS.epic}40, inset 0 0 30px rgba(0,0,0,0.8)`,
      }}
    >
      <div className="mb-2">
        <div className="font-bold text-lg" style={{ color: RARITY_COLORS.epic, fontFamily: "serif", textShadow: `0 0 10px ${RARITY_COLORS.epic}60` }}>
          Shadowfang
        </div>
        <div className="text-stone-500 text-xs">Item Level 78 - Epic</div>
      </div>

      <div className="text-stone-300 text-sm border-t border-stone-700 pt-2 mb-2">
        <div className="flex justify-between">
          <span>Main Hand</span>
          <span className="text-stone-500">Sword</span>
        </div>
        <div className="text-white font-bold">142 - 218 Damage</div>
        <div className="text-stone-500 text-xs">(52.3 damage per second)</div>
      </div>

      <div className="text-green-400 text-sm space-y-1 border-t border-stone-700 pt-2 mb-2">
        <div>+32 Strength</div>
        <div>+24 Stamina</div>
        <div>+45 Attack Power</div>
        <div>+2.1% Critical Strike</div>
      </div>

      <div className="text-sm border-t border-stone-700 pt-2" style={{ color: RARITY_COLORS.epic }}>
        <p className="italic">Equip: Your attacks have a chance to summon a shadow wolf that deals 150 damage.</p>
      </div>

      <div className="text-stone-500 text-xs mt-2 pt-2 border-t border-stone-700">
        Requires Level 60
      </div>
    </div>
  );
}

function StylizedActivitySelector() {
  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: "linear-gradient(135deg, #2a2318 0%, #1a1610 100%)",
        border: "3px solid #5a3d1a",
        boxShadow: "0 0 30px rgba(90,61,26,0.3)",
      }}
    >
      <h3 className="text-center text-xl text-amber-400 mb-4 font-bold tracking-wide" style={{ fontFamily: "serif" }}>
        Choose Your Path
      </h3>

      <div className="space-y-3">
        {/* Questing */}
        <div className="p-3 rounded bg-stone-900/50 border border-stone-700 hover:border-amber-600 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚔</span>
            <div className="flex-1">
              <div className="text-amber-300 font-bold">Questing</div>
              <div className="text-stone-400 text-sm">Westfall · Level 10-20</div>
            </div>
            <div className="text-right">
              <div className="text-green-400 text-sm">62%</div>
              <div className="text-stone-500 text-xs">15:30</div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-stone-800 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-700 to-amber-500" style={{ width: "62%" }}></div>
          </div>
        </div>

        {/* Dungeons */}
        <div className="p-3 rounded bg-stone-900/50 border border-stone-700 hover:border-blue-600 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏰</span>
            <div className="flex-1">
              <div className="text-blue-300 font-bold">Dungeons</div>
              <div className="text-stone-400 text-sm">Deadmines · Level 18-22</div>
            </div>
            <div className="text-right">
              <div className="text-green-400 text-sm">94%</div>
              <div className="text-stone-500 text-xs">28:00</div>
            </div>
          </div>
        </div>

        {/* Raids - Locked */}
        <div className="p-3 rounded bg-stone-900/30 border border-stone-800 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div className="flex-1">
              <div className="text-purple-400 font-bold">Raids</div>
              <div className="text-stone-500 text-sm">Molten Core</div>
            </div>
            <div className="text-red-500 text-xs">
              Level 60
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT 4: HYBRID (ASCII frames + small icons/accents)
// ============================================================================

function HybridStatPanel() {
  return (
    <div className="font-mono text-xs bg-[#0d0b08] p-4" style={{ border: "2px solid #5a3d1a" }}>
      {/* ASCII Frame with Unicode decoration */}
      <div className="text-amber-700">
        ╔══════════════════════════════════════════╗
      </div>
      <div className="text-amber-700">
        ║<span className="text-amber-500"> ⚔ </span>
        <span className="text-amber-200 font-bold">THROGNAR</span>
        <span className="text-stone-500"> the Mighty </span>
        <span className="text-amber-500">⚔ </span>
        <span className="text-amber-700 ml-4">║</span>
      </div>
      <div className="text-amber-700">
        ║<span className="text-stone-500 ml-2">Level 45 </span>
        <span style={{ color: CLASS_COLORS.warrior }}>Warrior</span>
        <span className="ml-16 text-amber-700">║</span>
      </div>
      <div className="text-amber-700">
        ╠══════════════════════════════════════════╣
      </div>

      {/* Health with heart icon */}
      <div className="flex items-center gap-2 my-2 ml-1">
        <span className="text-red-500 text-lg">♥</span>
        <span className="text-stone-500">HP:</span>
        <span className="text-red-600">[</span>
        <span className="text-red-500">████████████████████</span>
        <span className="text-red-900">░░░░</span>
        <span className="text-red-600">]</span>
        <span className="text-red-400">2,829/3,450</span>
      </div>

      {/* Rage with flame icon */}
      <div className="flex items-center gap-2 my-2 ml-1">
        <span className="text-orange-500 text-lg">🔥</span>
        <span className="text-stone-500">RG:</span>
        <span className="text-orange-600">[</span>
        <span className="text-orange-500">████████</span>
        <span className="text-orange-900">░░░░░░░░░░░░░░░░</span>
        <span className="text-orange-600">]</span>
        <span className="text-orange-400">32/100</span>
      </div>

      <div className="text-amber-700">
        ╠══════════════════════════════════════════╣
      </div>

      {/* Stats with icons */}
      <div className="grid grid-cols-2 gap-2 my-2 ml-1">
        <div>
          <div className="text-amber-600 text-sm mb-1">◆ Attributes</div>
          <div className="text-stone-400"><span className="text-amber-500">💪</span> STR: <span className="text-amber-300">245</span></div>
          <div className="text-stone-400"><span className="text-green-500">🏃</span> AGI: <span className="text-green-300">108</span></div>
          <div className="text-stone-400"><span className="text-red-500">❤</span> STA: <span className="text-red-300">198</span></div>
          <div className="text-stone-400"><span className="text-blue-500">✨</span> INT: <span className="text-blue-300">42</span></div>
        </div>
        <div>
          <div className="text-amber-600 text-sm mb-1">◆ Combat</div>
          <div className="text-stone-400"><span className="text-white">⚔</span> ATK: <span className="text-white">612</span></div>
          <div className="text-stone-400"><span className="text-yellow-500">★</span> Crit: <span className="text-yellow-400">18.4%</span></div>
          <div className="text-stone-400"><span className="text-stone-400">🛡</span> Armor: <span className="text-stone-300">5,420</span></div>
          <div className="text-stone-400"><span className="text-green-500">⚡</span> DPS: <span className="text-green-400">287.5</span></div>
        </div>
      </div>

      <div className="text-amber-700">
        ╚══════════════════════════════════════════╝
      </div>
    </div>
  );
}

function HybridCombatLog() {
  return (
    <div className="font-mono text-xs bg-[#0d0b08] p-4" style={{ border: "2px solid #3d2a1a" }}>
      <div className="text-amber-600 mb-2">
        ╔═══════════ ⚔ COMBAT LOG ⚔ ═══════════╗
      </div>

      <div className="space-y-1">
        <div className="text-stone-400">
          <span className="text-stone-600">[00:34]</span>
          <span className="text-yellow-400 ml-1">★</span>
          <span className="text-amber-200"> CRIT! Mortal Strike → </span>
          <span className="text-yellow-300 font-bold">574</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">[00:36]</span>
          <span className="text-purple-400 ml-1">🔮</span>
          <span className="text-red-400"> Enemy casts Shadow Bolt</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">[00:38]</span>
          <span className="text-red-500 ml-1">💔</span>
          <span className="text-red-300"> Shadow Bolt hits you → </span>
          <span className="text-red-400">-412</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">[00:40]</span>
          <span className="text-green-400 ml-1">💚</span>
          <span className="text-green-300"> Health Potion → </span>
          <span className="text-green-400">+1,000</span>
        </div>
        <div className="text-stone-400">
          <span className="text-stone-600">[00:42]</span>
          <span className="text-red-500 ml-1">☠</span>
          <span className="text-red-400 font-bold"> KILLING BLOW! Execute → </span>
          <span className="text-red-300">891</span>
        </div>
      </div>

      <div className="border-t border-amber-900/50 mt-2 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-green-400">✓ Victory!</span>
          <div>
            <span className="text-purple-400">📈 +245 XP</span>
            <span className="text-yellow-500 ml-2">💰 +12g</span>
          </div>
        </div>
        <div className="mt-1">
          <span className="text-stone-500">Loot:</span>
          <span className="ml-2" style={{ color: RARITY_COLORS.uncommon }}>📦 [Worn Leather Belt]</span>
        </div>
      </div>

      <div className="text-amber-600 mt-2">
        ╚════════════════════════════════════════╝
      </div>
    </div>
  );
}

function HybridItemTooltip() {
  return (
    <div className="font-mono text-xs bg-[#0d0b08] p-3" style={{ border: `2px solid ${RARITY_COLORS.legendary}`, boxShadow: `0 0 15px ${RARITY_COLORS.legendary}40` }}>
      {/* Legendary glow effect header */}
      <div className="text-center mb-2">
        <span style={{ color: RARITY_COLORS.legendary }} className="text-sm font-bold">
          ═══ ✦ LEGENDARY ✦ ═══
        </span>
      </div>

      <div style={{ color: RARITY_COLORS.legendary }} className="font-bold text-lg text-center">
        ⚔ Sulfuras, Hand of Ragnaros ⚔
      </div>
      <div className="text-stone-500 text-center mb-2">Item Level 80</div>

      <div className="border-t border-stone-700 pt-2 mb-2">
        <div className="text-stone-400 flex justify-between">
          <span>🗡 Two-Hand</span>
          <span>Mace</span>
        </div>
        <div className="text-white font-bold">223 - 372 Damage</div>
        <div className="text-stone-500">(71.5 DPS) · Speed 4.0</div>
      </div>

      <div className="border-t border-stone-700 pt-2 mb-2 text-green-400">
        <div>💪 +12 Strength</div>
        <div>🔥 +30 Fire Resistance</div>
        <div>⚡ +12% Attack Speed</div>
      </div>

      <div className="border-t border-stone-700 pt-2" style={{ color: RARITY_COLORS.legendary }}>
        <p className="italic text-xs">
          🔥 Chance on hit: Hurls a fiery ball that causes 273-333 Fire damage and an additional 75 damage over 10 sec.
        </p>
      </div>

      <div className="text-center mt-2 pt-2 border-t border-stone-700">
        <span className="text-stone-600">"</span>
        <span className="text-amber-400/80 italic text-xs">Too hot to handle.</span>
        <span className="text-stone-600">"</span>
      </div>
    </div>
  );
}

function HybridActivitySelector() {
  return (
    <div className="font-mono text-xs bg-[#0d0b08] p-4" style={{ border: "2px solid #5a3d1a" }}>
      <div className="text-amber-500 text-center mb-3">
        ╔═════════════════════════════════╗
        <div>║  🗺  SELECT YOUR ADVENTURE  🗺  ║</div>
        ╚═════════════════════════════════╝
      </div>

      <div className="space-y-2">
        {/* Questing */}
        <div className="p-2 border border-stone-700 hover:border-amber-600 cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔</span>
            <span className="text-amber-300 font-bold">[1] QUESTING</span>
          </div>
          <div className="ml-6 text-stone-400">
            <div>► 🌲 Westfall <span className="text-stone-600">(Lvl 10-20)</span></div>
            <div className="flex items-center gap-2 mt-1">
              <span>Progress:</span>
              <span className="text-green-600">[</span>
              <span className="text-green-500">████████</span>
              <span className="text-green-900">░░░░░░</span>
              <span className="text-green-600">]</span>
              <span className="text-green-400">62%</span>
            </div>
            <div className="text-stone-500">⏱ Est: 15:30</div>
          </div>
        </div>

        {/* Dungeons */}
        <div className="p-2 border border-stone-700 hover:border-blue-600 cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏰</span>
            <span className="text-blue-300 font-bold">[2] DUNGEONS</span>
          </div>
          <div className="ml-6 text-stone-400">
            <div>► ⛏ Deadmines <span className="text-stone-600">(Lvl 18-22)</span></div>
            <div>Success: <span className="text-green-400">94%</span> · ⏱ 28:00</div>
          </div>
        </div>

        {/* Raids */}
        <div className="p-2 border border-stone-800 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="text-purple-400 font-bold">[3] RAIDS</span>
            <span className="text-red-500 text-xs">🔒 LOCKED</span>
          </div>
          <div className="ml-6 text-stone-500">
            <div>► 🔥 Molten Core</div>
            <div className="text-red-400">Requires Level 60</div>
          </div>
        </div>
      </div>

      <div className="text-center mt-3 pt-2 border-t border-amber-900/50">
        <span className="text-stone-500">Status:</span>
        <span className="text-amber-400 ml-2 animate-pulse">● IDLE</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export function ArtStyleDemo() {
  const [activeStyle, setActiveStyle] = useState<StyleVariant>("ascii-color");
  const [activeComponent, setActiveComponent] = useState<"stats" | "combat" | "item" | "activity">("stats");

  const styles: { id: StyleVariant; name: string; description: string }[] = [
    {
      id: "pure-ascii",
      name: "Pure ASCII",
      description: "Terminal-style with box-drawing characters, monospace fonts, no color",
    },
    {
      id: "ascii-color",
      name: "ASCII + Color",
      description: "Terminal aesthetic with strategic WoW-style colors for rarity, health, classes",
    },
    {
      id: "stylized-text",
      name: "Stylized Text",
      description: "Non-ASCII but text-heavy, medieval fonts, parchment textures via CSS",
    },
    {
      id: "hybrid",
      name: "Hybrid",
      description: "ASCII frames combined with Unicode emoji/icons as visual accents",
    },
  ];

  const components = [
    { id: "stats" as const, name: "Stat Panel", icon: "📊" },
    { id: "combat" as const, name: "Combat Log", icon: "⚔" },
    { id: "item" as const, name: "Item Tooltip", icon: "💎" },
    { id: "activity" as const, name: "Activity Select", icon: "🗺" },
  ];

  const renderComponent = () => {
    switch (activeStyle) {
      case "pure-ascii":
        switch (activeComponent) {
          case "stats": return <PureASCIIStatPanel />;
          case "combat": return <PureASCIICombatLog />;
          case "item": return <PureASCIIItemTooltip />;
          case "activity": return <PureASCIIActivitySelector />;
        }
        break;
      case "ascii-color":
        switch (activeComponent) {
          case "stats": return <ASCIIColorStatPanel />;
          case "combat": return <ASCIIColorCombatLog />;
          case "item": return <ASCIIColorItemTooltip />;
          case "activity": return <ASCIIColorActivitySelector />;
        }
        break;
      case "stylized-text":
        switch (activeComponent) {
          case "stats": return <StylizedStatPanel />;
          case "combat": return <StylizedCombatLog />;
          case "item": return <StylizedItemTooltip />;
          case "activity": return <StylizedActivitySelector />;
        }
        break;
      case "hybrid":
        switch (activeComponent) {
          case "stats": return <HybridStatPanel />;
          case "combat": return <HybridCombatLog />;
          case "item": return <HybridItemTooltip />;
          case "activity": return <HybridActivitySelector />;
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-300 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-2 font-mono">
          ═══ IDLE RAIDERS ART STYLE EXPLORATION ═══
        </h1>
        <p className="text-stone-500 font-mono text-sm">
          Exploring 4 visual directions for the game UI. Reference: IdleRaiders_Concept.pdf, Melvor Idle
        </p>
      </div>

      {/* Style Selector */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={cn(
                "p-3 text-left font-mono text-xs border-2 transition-all",
                activeStyle === style.id
                  ? "border-amber-500 bg-amber-900/20 text-amber-200"
                  : "border-stone-700 bg-stone-900/50 text-stone-400 hover:border-stone-600"
              )}
            >
              <div className="font-bold text-sm mb-1">{style.name}</div>
              <div className="text-stone-500">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Component Selector */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 flex-wrap">
          {components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setActiveComponent(comp.id)}
              className={cn(
                "px-4 py-2 font-mono text-sm border transition-all",
                activeComponent === comp.id
                  ? "border-amber-500 bg-amber-900/30 text-amber-300"
                  : "border-stone-700 bg-stone-900/50 text-stone-500 hover:text-stone-300"
              )}
            >
              <span className="mr-2">{comp.icon}</span>
              {comp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-stone-900/30 border border-stone-800 p-6 rounded-lg">
          <div className="text-stone-600 font-mono text-xs mb-4">
            Preview: {styles.find(s => s.id === activeStyle)?.name} → {components.find(c => c.id === activeComponent)?.name}
          </div>
          <div className="flex justify-center">
            <div className="max-w-lg w-full">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-amber-400 mb-4 font-mono">
          ═══ ITEM TOOLTIP COMPARISON (All Rarities) ═══
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Common */}
          <div className="font-mono text-xs bg-[#0a0a0a] p-3 border-2" style={{ borderColor: RARITY_COLORS.common }}>
            <div style={{ color: RARITY_COLORS.common }} className="font-bold">Worn Dagger</div>
            <div className="text-stone-500 text-[10px]">Item Level 12 · Common</div>
            <div className="text-stone-400 mt-2">12-18 Damage</div>
            <div className="text-stone-500 text-[10px]">(6.5 DPS)</div>
          </div>

          {/* Uncommon */}
          <div className="font-mono text-xs bg-[#0a0a0a] p-3 border-2" style={{ borderColor: RARITY_COLORS.uncommon }}>
            <div style={{ color: RARITY_COLORS.uncommon }} className="font-bold">Blade of Cunning</div>
            <div className="text-stone-500 text-[10px]">Item Level 28 · Uncommon</div>
            <div className="text-stone-400 mt-2">28-42 Damage</div>
            <div className="text-green-400 text-[10px] mt-1">+8 Agility</div>
          </div>

          {/* Rare */}
          <div className="font-mono text-xs bg-[#0a0a0a] p-3 border-2" style={{ borderColor: RARITY_COLORS.rare }}>
            <div style={{ color: RARITY_COLORS.rare }} className="font-bold">Sword of Omen</div>
            <div className="text-stone-500 text-[10px]">Item Level 52 · Rare</div>
            <div className="text-stone-400 mt-2">65-98 Damage</div>
            <div className="text-green-400 text-[10px] mt-1">+15 Strength · +12 Stamina</div>
          </div>

          {/* Epic */}
          <div className="font-mono text-xs bg-[#0a0a0a] p-3 border-2" style={{ borderColor: RARITY_COLORS.epic }}>
            <div style={{ color: RARITY_COLORS.epic }} className="font-bold">Deathbringer</div>
            <div className="text-stone-500 text-[10px]">Item Level 71 · Epic</div>
            <div className="text-stone-400 mt-2">114-172 Damage</div>
            <div className="text-green-400 text-[10px] mt-1">+28 STR · +18 STA · +1.5% Crit</div>
          </div>
        </div>
      </div>

      {/* Character Class Colors Reference */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-amber-400 mb-4 font-mono">
          ═══ CLASS COLOR REFERENCE ═══
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CLASS_COLORS).map(([className, color]) => (
            <div
              key={className}
              className="px-4 py-2 bg-stone-900/50 border border-stone-700 font-mono text-sm"
            >
              <span style={{ color }} className="capitalize font-bold">{className}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ASCII Art Character Preview */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-amber-400 mb-4 font-mono">
          ═══ ASCII CHARACTER PORTRAIT CONCEPTS ═══
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Warrior */}
          <div className="bg-[#0a0a0a] p-4 border border-stone-700 font-mono text-xs">
            <div className="text-center mb-2" style={{ color: CLASS_COLORS.warrior }}>WARRIOR</div>
            <pre className="text-stone-400 leading-tight text-center">{`
      ,/|
     / ' \\
    |░░░░░|
   /|     |\\
  | |═════| |
  | |     | |
  ╔═╧═════╧═╗
  ║  ◈   ◈  ║
  ║    ▽    ║
  ║  \\___/  ║
  ╚════╦════╝
    ╔══╩══╗
   ╔╣▓▓▓▓▓╠╗
   ║║═════║║
   ║╠═════╣║
   ╚╝     ╚╝
            `.trim()}</pre>
          </div>

          {/* Mage */}
          <div className="bg-[#0a0a0a] p-4 border border-stone-700 font-mono text-xs">
            <div className="text-center mb-2" style={{ color: CLASS_COLORS.mage }}>MAGE</div>
            <pre className="text-cyan-400 leading-tight text-center">{`
      ╱*╲
     ╱ ★ ╲
    ╱  ◇  ╲
   ╱───────╲
      │
   ╭──┴──╮
   │ ◉ ◉ │
   │  ▽  │
   │ ╰─╯ │
   ╰──┬──╯
   ╭──┴──╮
   │~~~~~│
   │~~~~~│
   │~~~~~│
   ╰─┬─┬─╯
     │ │
            `.trim()}</pre>
          </div>

          {/* Priest */}
          <div className="bg-[#0a0a0a] p-4 border border-stone-700 font-mono text-xs">
            <div className="text-center mb-2" style={{ color: CLASS_COLORS.priest }}>PRIEST</div>
            <pre className="text-stone-300 leading-tight text-center">{`
      ✝
    ╭─┴─╮
   ╭┤   ├╮
   ││ ☩ ││
   ╰┤   ├╯
   ╭┴───┴╮
   │ ◡ ◡ │
   │  △  │
   │ ╰─╯ │
   ╰──┬──╯
   ╭──┴──╮
   │╔═══╗│
   │║ ☩ ║│
   │╚═══╝│
   ╰─┬─┬─╯
     │ │
            `.trim()}</pre>
          </div>
        </div>
      </div>

      {/* Design Notes */}
      <div className="max-w-6xl mx-auto mt-12 mb-8">
        <h2 className="text-xl font-bold text-amber-400 mb-4 font-mono">
          ═══ DESIGN NOTES ═══
        </h2>
        <div className="bg-stone-900/30 border border-stone-700 p-4 font-mono text-xs text-stone-400 space-y-2">
          <p><span className="text-amber-400">1. Pure ASCII:</span> Most authentic to terminal/BBS aesthetic. Works perfectly at any font size. Least visually engaging but cleanest.</p>
          <p><span className="text-amber-400">2. ASCII + Color:</span> Recommended for Idle Raiders. Maintains ASCII feel while using WoW rarity colors for item recognition. Health bars pop visually.</p>
          <p><span className="text-amber-400">3. Stylized Text:</span> Most polished look but loses some old-school charm. Better for mobile where touch targets need to be larger.</p>
          <p><span className="text-amber-400">4. Hybrid:</span> Good middle ground. Emoji icons aid recognition but may feel inconsistent. Unicode symbols work better than actual emoji.</p>
          <p className="border-t border-stone-700 pt-2 mt-2 text-amber-300">
            Recommendation: Start with "ASCII + Color" as the primary style, with "Pure ASCII" as an accessibility/preference option.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArtStyleDemo;
