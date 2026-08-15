# Phase 05 — API Hub

## Prompt

```
FoundationOS v3.60, Phase 05 — API Hub.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, and SPECS/API.md.

Goal: expose core entities and the module engine via /api/v1, authenticated with Laravel Sanctum
(token abilities/scopes), reusing the exact same domain layer as the web/Filament side — no
parallel API-only business logic.

Produce an OpenAPI contract under 09-API/ (create this folder) for the endpoints built this phase.
Build a minimal mobile test client (even a simple script/Postman-equivalent) that authenticates
and calls at least one endpoint per core entity.

Follow the Claude Loop. Update SPECS/API.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md.

STOP after Definition of Done passes.
```

## Definition of Done

- [ ] `/api/v1` endpoints for all Phase 02/04 core entities
- [ ] Sanctum auth with token abilities enforced
- [ ] OpenAPI contract committed under `09-API/`
- [ ] Mobile test client successfully authenticates and calls the API
- [ ] Docs + memory updated
