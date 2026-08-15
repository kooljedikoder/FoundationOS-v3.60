# Phase 13 — Applications (SERVA + VendorFlow)

## Prompt

```
FoundationOS v3.60, Phase 13 — Applications.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md.

Precondition: Phases 02–12 all passed their Definition of Done — Core, Module Engine, Master
Data, API Hub, Workspace, Themes, FormFlow, Tasks/Workflow, ERP Modules, Finance, Communications
all proven. Do not start this phase early "to save time" — SERVA/VendorFlow must be applications
built ON FoundationOS, not architecture experiments themselves (see AI/DECISIONS.md 2026-08-15
"Build sequence: Core before Applications").

Goal: build SERVA and VendorFlow as workspaces/themes (Phase 06/07 engines) + application-specific
modules (Phase 03 engine) on top of the now-proven core. Neither application introduces new
canonical entities without an AI/DECISIONS.md entry, and neither contains business logic that
belongs in core or a shared module instead.

Follow the Claude Loop, one application at a time. Update AI/ARCHITECTURE.md, AI/CURRENT_STATE.md.

STOP after each application's own Definition of Done passes; report before starting the next.
```

## Definition of Done (per application)

- [ ] Built as a workspace/theme + modules on FoundationOS core — no fork
- [ ] No new canonical entities without a decisions-log entry
- [ ] Shared functionality (tasks, forms, communications) reused, not reimplemented
- [ ] Tests pass
- [ ] Docs + memory updated
