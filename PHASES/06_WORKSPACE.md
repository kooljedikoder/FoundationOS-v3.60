# Phase 06 — Workspace Engine

## Prompt

```
FoundationOS v3.60, Phase 06 — Workspace Engine.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, and SPECS/WORKSPACES.md.

Goal: let a single authenticated user move between the FoundationOS admin workspace and a business
application workspace (a placeholder "Demo App" workspace is fine for now — SERVA doesn't exist
yet) without duplicating auth/session state or re-authenticating.

Follow the Claude Loop. Update SPECS/WORKSPACES.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md.

STOP after Definition of Done passes.
```

## Definition of Done

- [ ] Single sign-on session shared across admin + demo app workspace
- [ ] Workspace switch is a UI action, not a re-login
- [ ] No workspace-specific business logic duplicated
- [ ] Docs + memory updated
