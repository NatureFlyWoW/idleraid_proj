---
name: project-architecture
description: Use when creating new files, adding features, modifying existing code, or deciding where code should live. Covers the client/shared/server directory structure, agent ownership boundaries, import patterns, and data flow from UI to database.
---

# Idle Raiders Project Architecture

## Directory Ownership — These Are STRICT Rules
- server/ → Backend Agent ONLY (API routes, database ops, game engine)
- server/game/engine/ → Backend Agent (combat simulator, game loop)
- server/game/systems/ → Backend Agent (stat calculator)
- server/game/data/ → Backend Agent (class definitions, game data)
- client/src/pages/ → Frontend Agent ONLY
- client/src/components/game/ → Frontend Agent ONLY
- client/src/components/game/items/ → Item Art Agent ONLY (ASCII sprites)
- client/src/hooks/ → Frontend Agent ONLY
- tests/ → Test Agent ONLY
- shared/ → Coordinator Agent ONLY (types, schemas, constants, routes)
- docs/item-catalog.md → Item Balance Agent ONLY

## Data Flow (follow this pattern for every new feature)
User clicks button in React component (client/src/components/)
  → React Hook calls API endpoint (client/src/hooks/)
  → HTTP request matches route defined in shared/routes.ts
  → Express handler in server/routes.ts processes the request
  → Game logic runs in server/game/engine/ or server/game/systems/
  → Database read/write via Drizzle ORM (server/storage.ts using shared/schema.ts)
  → JSON response flows back → React Query cache updates → UI re-renders

## Rules That Must Never Be Broken
- Combat logic and stat calculations ONLY in server/game/ — never in client code
- Shared types in shared/types/, constants in shared/constants/
- API routes: defined in shared/routes.ts, implemented in server/routes.ts
- Database schema source of truth: shared/schema.ts (Drizzle ORM)
- All runtime validation uses Zod
- Any change to shared/ must be flagged to the Coordinator immediately
- After completing work, update .claude/status/<agent-name>.md
