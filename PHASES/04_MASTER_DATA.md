# Phase 04 — Database & Master Data

## Prompt

```
FoundationOS v3.60, Phase 04 — Database & Master Data.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, and SPECS/DATABASE.md.

Goal: flesh out the master data behind the Phase 02 core entities — Users, Organisations,
Departments, Locations, Contacts, Products/Services — with realistic relationships, seeders, and
Filament resources so an operator can actually manage this data through the admin panel.

Do not introduce new canonical entities beyond FOUNDATIONOS_MASTER.md §06 without a
AI/DECISIONS.md entry first.

Follow the Claude Loop. Update SPECS/DATABASE.md with the final schema, AI/ARCHITECTURE.md, and
AI/CURRENT_STATE.md.

STOP after Definition of Done passes.
```

## Definition of Done

- [ ] Filament resources for all master-data entities
- [ ] Seeders produce a coherent demo dataset
- [ ] Relationships (org → department → location, contact → organisation, etc.) enforced
- [ ] `SPECS/DATABASE.md` reflects the real schema
- [ ] Docs + memory updated
