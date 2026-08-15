# Phase 02 — FoundationOS Core

## Prompt

```
FoundationOS v3.60, Phase 02 — Core.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, and 03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md.

Goal: implement the canonical core entities as single-source-of-truth models, per
FOUNDATIONOS_MASTER.md §06 — Users, Organisations, Departments, Locations, Contacts, Products,
Services, Documents, Tasks.

Rules for this phase:
- Check AI/DONOR_RULES.md for any Aureus/ERPKit/Liberu model already classified KEEP or ADAPT for
  each entity — adapt that instead of writing from scratch.
- Exactly one model per canonical entity — if a donor source has near-duplicates, resolve to one
  and record the decision in AI/DECISIONS.md.
- Wire in Spatie Permission, Spatie ActivityLog, and Spatie Media Library at the core-entity
  level now, not later.
- Follow the Claude Loop in AI/CLAUDE.md for every change (inspect, explain, smallest change,
  test, update memory).

Write acceptance tests for each core entity (CRUD + activity log entry + at least one permission
check). Update AI/ARCHITECTURE.md's "Core entities" section and AI/CURRENT_STATE.md.

STOP after this phase's Definition of Done passes — do not start Phase 03.
```

## Definition of Done

- [ ] One model per canonical entity, no duplicates
- [ ] Spatie Permission, ActivityLog, Media Library wired to core entities
- [ ] Acceptance tests passing for each entity
- [ ] `AI/ARCHITECTURE.md` and `AI/CURRENT_STATE.md` updated
