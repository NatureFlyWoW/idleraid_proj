# Idle Raiders — Project Instructions

## Project Overview

Idle Raiders is a menu-based incremental RPG inspired by old-school MMORPGs (EverQuest, early World of Warcraft) and classic DnD artwork aesthetics. Players create characters, choose classes, and progress through idle/incremental combat and exploration mechanics.

The visual style targets advanced ASCII art and text-based UI rendered in the browser, drawing from the gritty, hand-painted aesthetic of 2000s fantasy art — not modern minimalist design.

## Tech Stack

- **Runtime:** Node.js on Replit
- **Language:** TypeScript (strict, shared across client and server)
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui components
- **Backend:** Express.js
- **Database:** PostgreSQL via Drizzle ORM
- **Schema/Validation:** Zod + Drizzle schema in `shared/schema.ts`
- **Build:** Vite (client) + custom `script/build.ts` (server)
- **Config:** `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `drizzle.config.ts`, `postcss.config.js`

## Project Structure & Ownership

This project uses a multi-agent workflow. Each agent operates in its own terminal with a designated scope. **Agents must never modify files outside their scope.** If a change is needed in another scope, describe it and the user will relay it.

### Directory Ownership Map

| Directory / Files | Owner | Purpose |
|---|---|---|
| `server/` (all contents) | 🔧 Backend Agent | API routes, DB, game engine, server logic |
| `server/game/engine/` | 🔧 Backend Agent | Combat simulator, core game loop |
| `server/game/systems/` | 🔧 Backend Agent | Stat calculator, future game systems |
| `server/game/data/` | 🔧 Backend Agent | Class definitions, game data |
| `server/routes.ts` | 🔧 Backend Agent | API endpoint definitions |
| `server/storage.ts` | 🔧 Backend Agent | Database access layer |
| `server/db.ts` | 🔧 Backend Agent | Database connection |
| `client/src/pages/` | 🎨 Frontend Agent | Full page components |
| `client/src/components/game/` | 🎨 Frontend Agent | Game-specific UI components |
| `client/src/components/Layout.tsx` | 🎨 Frontend Agent | App layout shell |
| `client/src/components/Navigation.tsx` | 🎨 Frontend Agent | Nav component |
| `client/src/hooks/` | 🎨 Frontend Agent | Custom React hooks |
| `client/src/index.css` | 🎨 Frontend Agent | Global styles |
| `client/src/App.tsx` | 🎨 Frontend Agent | App root and routing |
| `client/src/main.tsx` | 🎨 Frontend Agent | Entry point |
| `client/src/components/ui/` | 🎨 Frontend Agent | shadcn/ui primitives (edit sparingly) |
| `client/src/lib/` | 🎨 Frontend Agent | Utilities and query client |
| `tests/` | 🧪 Test Agent | All test files |
| `shared/` | 📋 Coordinator | Shared types, schemas, constants, routes |
| `migrations/` | 📋 Coordinator | Database migration files |
| Root config files | 📋 Coordinator | package.json, tsconfig, vite.config, etc. |
| `CLAUDE.md` | 📋 Coordinator | This file |
| `Idle-Raiders-GDD.md` | 📖 Game Design Agent | Game design document |
| `IdleRaiders_Concept.pdf` | 📖 Game Design Agent | Concept reference (read-only for all) |
| `client/index.html` | 📋 Coordinator | HTML shell |
| `.claude/status/backend.md` | 🔧 Backend Agent | Backend status updates |
| `.claude/status/frontend.md` | 🎨 Frontend Agent | Frontend status updates |
| `.claude/status/test.md` | 🧪 Test Agent | Test status updates |
| `.claude/status/gamedesign.md` | 📖 Game Design Agent | Game Design status updates |
| `.claude/status/itembalance.md` | 🎲 Item Balance Agent | Item Balance status updates |
| `.claude/status/itemart.md` | 🖼️ Item Art Agent | Item Art status updates |
| `shared/items/` | 📋 Coordinator | Shared item types, descriptors, generation rules |
| `client/src/components/game/items/` | 🖼️ Item Art Agent | Item sprite components and templates |
| `docs/item-catalog.md` | 🎲 Item Balance Agent | Master item catalog with stats |

### Agent Roles

**🔧 Backend Agent (Terminal 1)**
Implements APIs, database operations, and game calculations. Owns all of `server/`. Auto-edit or full-auto mode.

**🎨 Frontend Agent (Terminal 2)**
Builds all UI: pages, components, ASCII art, styling. Art direction: 2000s DnD, old-school EverQuest/WoW aesthetic. Reads `server/` and `shared/` for context but never edits them. Auto-edit mode.

**🧪 Test Agent (Terminal 3)**
Writes and runs all tests in `tests/` only. Reads everything for context. Full-auto mode.

**📖 Game Design Agent (Terminal 4)**
Research and design. Reads all source files. Can write to `Idle-Raiders-GDD.md` and `.claude/status/gamedesign.md`. Does NOT modify source code. Auto-edit mode for design docs only.

**📋 Coordinator (Terminal 5)**
Maintains `shared/`, `migrations/`, root configs. Resolves cross-cutting issues. Manages dependencies and builds. Auto-edit mode.

**🎲 Item Balance Agent (Terminal 6)**
Designs item stats, power curves, special effects, and set bonuses. Writes to `docs/item-catalog.md`. Works with Game Design for lore consistency. Reads `shared/constants/gameConfig.ts` for balance formulas. Does NOT modify source code. Auto-edit mode for design docs only.

**🖼️ Item Art Agent (Terminal 7)**
Creates procedural ASCII-hybrid item sprites. Owns `client/src/components/game/items/`. Defines visual descriptor vocabulary (material, color, glow, dimensions). Works with Frontend for style consistency. Auto-edit mode.

## Code Conventions

- TypeScript strict mode everywhere
- Shared types in `shared/types/`, constants in `shared/constants/`
- API route definitions in `shared/routes.ts`, implementations in `server/routes.ts`
- Database schema in `shared/schema.ts` using Drizzle
- Zod for all runtime validation
- Functional React with hooks, Tailwind for styling
- Game balance constants in `shared/constants/gameConfig.ts`
- Test files named `<feature>.test.ts` inside `tests/`
- Combat and stat logic stays in `server/game/` — never in client code

## Required Reading — All Agents

**Before starting any task, all agents MUST read:**

1. **`Idle-Raiders-GDD.md`** — The comprehensive Game Design Document. Contains:
   - Game mechanics and balance formulas
   - Class designs and ability definitions
   - Zone, dungeon, and raid specifications
   - Item and loot system design
   - Naming conventions and world lore
   - MMO→Incremental translation framework

2. **`shared/constants/gameConfig.ts`** — Balance constants and formulas
3. **`shared/types/game.ts`** — Core type definitions
4. **`shared/schema.ts`** — Database schema (source of truth for data structures)

The GDD is the **authoritative source** for game design decisions. When implementing features, follow the GDD specifications. If you find conflicts between code and GDD, flag them to the Coordinator.

## Single-Session Multi-Agent Workflow

This project uses a **single Claude session** with agent role-switching via git branches. This approach eliminates agent timeouts and coordination overhead while maintaining clear organization.

### How It Works

1. **One Claude session runs at a time** (no concurrent multi-terminal agents)
2. **Git branches represent agent workspaces** (agent/backend, agent/frontend, agent/coordinator, etc.)
3. **Status files track progress** (`.claude/status/*.md`)
4. **Clear handoff protocol** between agents via status file updates
5. **Parallel exploration** during planning, **sequential implementation** during coding

### Starting a Session

1. **Check status files** to see what each agent last did:
   ```bash
   cat .claude/status/*.md
   ```

2. **Determine your agent role** for this session

3. **Switch to agent branch**:
   ```bash
   git checkout agent/[role]
   ```

4. **Rebase on main** if needed to get latest shared/ changes:
   ```bash
   git rebase main
   ```

5. **Tell Claude your role and task**:
   ```
   "I'm the [Agent Name]. Here's what I'm working on: [task description]"
   ```

### During a Session

**Agent implements work in their owned directories:**
- Update code following ownership boundaries
- Run tests to verify changes
- Commit with clear message: `[AgentName] Description of change`

**If shared/ changes are needed:**
- Document the requirement in your status file under "Needs from Coordinator"
- User will switch to Coordinator role
- Coordinator updates shared/ and merges to main
- Original agent rebases and continues

### Ending a Session

1. **Commit your changes** with `[AgentName]` prefix:
   ```bash
   git add [files]
   git commit -m "[Backend] Add guild system endpoints"
   ```

2. **Update your status file** (`.claude/status/[agent].md`) with:
   - What you completed
   - What files changed
   - What other agents need (handoff requirements)
   - What's blocking you (if anything)
   - What you'll work on next

3. **Document handoffs** clearly in status file for next agent

### Switching Agent Roles

1. **Review previous agent's status file** to understand context
2. **Switch branches**: `git checkout agent/[newrole]`
3. **Rebase if needed**: `git rebase main`
4. **Continue work** based on status file handoff instructions

### Helper Script (Optional)

Use `script/agent-switch.sh` for quick agent switching:

```bash
./script/agent-switch.sh backend
# Automatically checks out branch, rebases, and shows status file
```

### Handling shared/ Changes

**Three strategies** (use based on situation):

1. **Pre-Approval** (best for planned features):
   - Identify all shared/ changes during planning
   - Coordinator makes changes FIRST and merges to main
   - All agents rebase before implementing

2. **Just-In-Time** (good for discoveries during implementation):
   - Agent documents needed change in status file
   - User switches to Coordinator
   - Coordinator makes change, merges to main
   - Original agent rebases and continues

3. **Batched Updates** (for multiple small changes):
   - Agents accumulate requests in status files
   - Coordinator reviews once per session/day
   - Coordinator makes all changes in one commit
   - All agents rebase on main

### Parallel Exploration During Planning

When starting new features, use Task tool to launch multiple **Explore agents in parallel** for fast context gathering:

```typescript
// Example: Launch 3 explore agents simultaneously
Task(subagent_type: Explore) - "Find existing guild system patterns"
Task(subagent_type: Explore) - "Find combat integration points"
Task(subagent_type: Explore) - "Find test patterns for similar features"

// All run concurrently, return results quickly
// Then proceed with sequential implementation
```

**Key**: Parallel agents for READ operations (exploration/research), sequential work for WRITE operations (implementation).

## Communication Protocol

1. If you need something from another agent's scope, describe the requirement — the user will relay it.
2. After making changes, summarize what changed and flag any new interfaces other agents should know about.
3. Changes to `shared/` must be flagged immediately so the user can notify other agents.
4. When in doubt about ownership, ask. Don't edit outside your scope.

## Status Update Protocol

**After completing any significant work, agents MUST update their status file:**

| Agent | Status File |
|-------|-------------|
| 🔧 Backend | `.claude/status/backend.md` |
| 🎨 Frontend | `.claude/status/frontend.md` |
| 🧪 Test | `.claude/status/test.md` |
| 📖 Game Design | `.claude/status/gamedesign.md` |
| 🎲 Item Balance | `.claude/status/itembalance.md` |
| 🖼️ Item Art | `.claude/status/itemart.md` |

**Update format** (prepend to "Latest Update" section):
```markdown
## [YYYY-MM-DD HH:MM]
- Completed: [what you finished]
- Changed: [files modified]
- Needs from Coordinator: [any schema/shared changes needed]
- Needs from other agents: [cross-agent dependencies]
- Blocked on: [nothing / description of blocker]
- Next: [what you plan to work on next]

**For Coordinator:** [OPTIONAL - Use this to flag important topics, issues, ideas, discoveries, or concerns that should be brought to attention. This is for anything noteworthy beyond routine status - design questions, potential bugs spotted, suggestions for other agents, architectural concerns, etc.]
```

The Coordinator reads these files to track project state. Update after each task completion.
