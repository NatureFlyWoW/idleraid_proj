# Agent Restoration Guide

This guide explains how to restore all 7 agents after an SSH disconnect.

## Quick Reference: All Agent Prompts

### Terminal 1: 🔧 Backend Agent
```
You are the Backend Agent for Idle Raiders. Read .claude/status/backend.md to see your latest work. Your last update was at 19:30 where you fixed the StatCalculator NaN bug and added 17 new item templates. All 506 tests are passing. Your next task is P2: Implement talent effect application to combat stats. You own all files in server/. Read CLAUDE.md for full scope and instructions.
```

### Terminal 2: 🎨 Frontend Agent
```
You are the Frontend Agent for Idle Raiders. Read .claude/status/frontend.md to see your latest work. Your last update was at 17:15 where you completed Talent UI, Class Portraits, Error States, Loading States, Game Toast, Combat UI, Dungeon UI, Quest Log, Character Sheet, Inventory, and Zone Selection. You started API wiring for Inventory and ZoneSelection.

CRITICAL NEW PRIORITY: Convert all pages from generic shadcn components to ASCII+Color themed components. The UI currently looks like a generic webapp but needs to match the 2000s DnD MMO aesthetic. Reference ArtStyleDemo.tsx for the ASCII+Color patterns. Create client/src/components/game/themed/ directory with ASCIIPanel, ASCIIButton, ASCIITabs, ASCIIProgressBar components, then convert CharacterSelect, Game, Inventory, CharacterSheet pages to use them.

You own all files in client/src/. Read CLAUDE.md for full scope and instructions.
```

### Terminal 3: 🧪 Test Agent
```
You are the Test Agent for Idle Raiders. Read .claude/status/test.md to see your latest work. Your last update was at 19:25. Current status: 485 passed, 49 skipped (534 total). Only 1 file fails: characters.test.ts (needs storage.users.updateUser). You recently created talents.test.ts and updated seed.test.ts. Your next task is P3: Create item-generation.test.ts once Item Balance Agent provides specs. You own all files in tests/. Read CLAUDE.md for full scope and instructions.
```

### Terminal 4: 📖 Game Design Agent
```
You are the Game Design Agent for Idle Raiders. Read .claude/status/gamedesign.md to see your latest work. Your last update was at 21:00 where you completed the massive GDD expansion (Battle Pass, Guild System, Profession System, Mount System, Raid Bosses, Talent Trees, Achievement System, PvP Arena). The GDD is now ~7,000+ lines.

CRITICAL FOCUS SHIFT: Stop adding new systems. Your priority is now DEPTH over BREADTH. Run simulations, analyze engagement loops, calculate progression pacing, and provide tuning recommendations. Your next tasks:
1. Combat Engagement Loop Analysis - Simulate 100 combats at levels 10, 30, 60 and analyze fun-factor
2. Progression Pacing Simulation - Calculate hours to level 60, identify dead zones
3. Talent Tree Fun-Factor Analysis - Identify trap talents, recommend buffs/nerfs
4. Loot Satisfaction Analysis - Calculate item replacement frequency
5. Offline Progress Balancing - Simulate 8-hour sessions at different levels

You can write to Idle-Raiders-GDD.md. Read CLAUDE.md for full scope and instructions.
```

### Terminal 5: 📋 Coordinator (Current Terminal)
You're here now. This terminal manages shared files, migrations, root configs. Read CLAUDE.md for full scope.

### Terminal 6: 🎲 Item Balance Agent (NEW)
```
You are the Item Balance Agent for Idle Raiders. This is a NEW agent role. Read docs/AGENT_PROMPT_ITEM_BALANCE.md for your complete instructions.

Your role: Design the logic and statistics of procedural item generation. You work in design documents, NOT code. Backend Agent implements your designs.

Your first task:
1. Read shared/items/types.ts and shared/items/descriptors.ts
2. Read Idle-Raiders-GDD.md Section 6 (Progression)
3. Read shared/constants/gameConfig.ts for balance formulas
4. Create docs/item-catalog.md
5. Design the core stat budget system:
   - Formula for total stat budget per iLevel/rarity
   - How stats distribute across primary vs secondary
   - Affix pool structure (how many prefixes/suffixes per rarity)

You write to docs/item-catalog.md and .claude/status/itembalance.md. You do NOT edit source code. Read CLAUDE.md for full scope.
```

### Terminal 7: 🖼️ Item Art Agent (NEW)
```
You are the Item Art Agent for Idle Raiders. This is a NEW agent role. Read docs/AGENT_PROMPT_ITEM_ART.md for your complete instructions.

Your role: Create procedural ASCII-hybrid item sprites. You build visual systems that generate infinite variations from descriptors.

Your first task:
1. Study client/src/components/game/CharacterPortrait.tsx for color mapping techniques
2. Study client/src/components/game/ArtStyleDemo.tsx for ASCII+Color aesthetic
3. Read shared/items/descriptors.ts to understand visual vocabulary
4. Create client/src/components/game/items/ directory
5. Build first sprite template: SwordSprite.tsx (one-handed sword)
6. Create demo gallery showing variations

You own client/src/components/game/items/ and .claude/status/itemart.md. Read CLAUDE.md for full scope.
```

---

## Current Project State

### Completed Work (As of SSH Disconnect)

**Backend Agent:**
- All 7 classes implemented with stat calculations
- Combat simulator working with all damage formulas
- Offline progress calculator with rested XP
- Talent system API (GET/POST/reset)
- 30 item templates for dungeons
- All 506 tests passing

**Frontend Agent:**
- Massive UI buildout: Talent UI, Class Portraits, Error/Loading States, Game Toast
- Combat UI (Log, Preview, Results)
- Dungeon UI (Selection, Progress)
- Quest Log, Character Sheet, Inventory, Zone Selection
- Started API wiring for Inventory and ZoneSelection

**Test Agent:**
- 485 tests passing, 49 skipped (534 total)
- Created talents.test.ts, updated seed.test.ts
- Only 1 file failing (characters.test.ts - needs storage.users.updateUser)

**Game Design Agent:**
- GDD expanded to ~7,000+ lines
- Added Battle Pass, Guild, Profession, Mount systems
- All 42 raid bosses documented
- Complete talent trees for 21 specs
- Achievement system, PvP Arena

**Item Balance & Item Art Agents:**
- Just initialized, awaiting first tasks

### Critical Next Steps (Prototype Goal)

**Priority 1: UI Theming (Frontend Agent)**
The UI currently looks like a generic webapp. Convert to ASCII+Color aesthetic:
- Create themed component library (ASCIIPanel, ASCIIButton, ASCIITabs, etc.)
- Convert CharacterSelect, Game, Inventory, CharacterSheet pages
- Update Navigation with ASCII styling

**Priority 2: Item System (Item Balance + Item Art)**
- Item Balance: Design stat budget formulas and affix pools
- Item Art: Build procedural sprite templates
- Backend: Implement generation system based on Balance specs

**Priority 3: Game Design Depth (Game Design Agent)**
- Stop adding features, start analyzing existing systems
- Run combat simulations, progression pacing analysis
- Provide tuning recommendations to Backend

---

## File Locations

**Agent Prompts:**
- `docs/AGENT_PROMPT_ITEM_BALANCE.md` - Full Item Balance Agent instructions
- `docs/AGENT_PROMPT_ITEM_ART.md` - Full Item Art Agent instructions

**Status Files:**
- `.claude/status/backend.md`
- `.claude/status/frontend.md`
- `.claude/status/test.md`
- `.claude/status/gamedesign.md`
- `.claude/status/itembalance.md`
- `.claude/status/itemart.md`

**Project Instructions:**
- `CLAUDE.md` - Main project instructions (all agents should read this)
- `Idle-Raiders-GDD.md` - Game design document (~7,000 lines)

**Implementation Plan:**
- `/home/runner/.claude/plans/cheeky-dreaming-stream.md` - Full implementation plan

---

## Quick Start Checklist

For each agent you restore:

1. ✅ Open new terminal
2. ✅ Paste the agent prompt from this guide
3. ✅ Agent reads their status file to see latest work
4. ✅ Agent reads CLAUDE.md for full context
5. ✅ Agent continues from where they left off

**Important:** Each agent operates independently but coordinates through:
- Status file updates (after completing work)
- Flagging cross-agent dependencies
- User relaying messages between agents

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Idle Raiders Project                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Terminal 1: Backend      → server/                          │
│  Terminal 2: Frontend     → client/src/                      │
│  Terminal 3: Test         → tests/                           │
│  Terminal 4: Game Design  → Idle-Raiders-GDD.md              │
│  Terminal 5: Coordinator  → shared/, migrations/, configs    │
│  Terminal 6: Item Balance → docs/item-catalog.md            │
│  Terminal 7: Item Art     → client/src/components/game/items/│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Issues

**Q: Agent says "I don't have context about the project"**
A: Make sure the agent prompt tells them to read `.claude/status/[their-agent].md` and `CLAUDE.md` first.

**Q: Agent tries to edit files outside their scope**
A: Remind them to read `CLAUDE.md` Section "Project Structure & Ownership" to see their scope boundaries.

**Q: Agent asks about latest changes**
A: Point them to their status file (`.claude/status/[agent].md`) which has the full history.

**Q: Multiple agents need to coordinate**
A: Agents can't communicate directly. They flag dependencies in status files, user relays messages.

---

## Success Metrics

You'll know the restoration is successful when:
- ✅ All 7 agents are running in separate terminals
- ✅ Each agent can read their status file and understand current state
- ✅ Agents continue work from where they left off
- ✅ No agent tries to edit files outside their scope
- ✅ Status files are being updated after task completion
