# Phase 01 — Audit & Freeze

This is the master audit phase. **No code is built, refactored, renamed, deleted, migrated, or
installed in this phase.** Its only output is understanding, written down.

## Prompt

```
You are the Lead Architect for FoundationOS v3.60.

You are working inside a Laravel 13 codebase.

IMPORTANT: Do not build, refactor, rename, delete, migrate, or install anything yet.

First read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, and AI/ACTIVE_PHASE.md.

Then inspect the entire application. Also inspect, but DO NOT modify:
01-SOURCES/AUREUS, 01-SOURCES/ERPKIT, 01-SOURCES/LIBERU, 01-SOURCES/FILAKIT,
01-SOURCES/LARADASHBOARD.

FilaKit and Lara Dashboard were added as candidate donors after initial planning and their role is
unconfirmed — your audit must establish what each one actually is (UI kit, dashboard scaffold, or
something else) and whether it's worth keeping at all, in addition to classifying their
capabilities.

FoundationOS is being created as a reusable Business Application OS. The intended stack is
Laravel 13, Filament 5, Filament Forms, Livewire, TallStackUI where appropriate, MySQL, Spatie
Permission, Spatie ActivityLog, Spatie Media Library, Laravel Sanctum, Laravel Boost. Aureus is
the starting application. ERPKit is a business-module donor. Liberu is primarily a
finance/accounting donor. FilaKit and Lara Dashboard are candidate donors whose role is not yet
established — that's part of what this audit determines.

Your first responsibility is to understand what already exists. Produce a report covering:

1. Current Laravel version
2. PHP version
3. Filament version
4. Livewire version
5. Installed Composer packages
6. Database structure
7. Existing models
8. Existing migrations
9. Existing plugins
10. Existing panels
11. Existing authentication
12. Existing permissions
13. Existing APIs
14. Existing module system
15. Existing theme system
16. Existing navigation
17. Existing business entities
18. Existing tests
19. Existing technical debt
20. Existing duplicated entities
21. Existing ERPKit opportunities
22. Existing Liberu opportunities
23. Architecture risks
24. Security risks
25. Licence/dependency risks

For each donor source, classify every notable capability as KEEP, ADAPT, PLUGIN, REFERENCE,
REMOVE, or DO NOT USE.

Do not change code. Write the results to 03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md. Mirror the
classification table into AI/DONOR_RULES.md. Update AI/CURRENT_STATE.md.

At the end, report: what you discovered, what you recommend, what must NOT be changed (propose
additions to AI/DO_NOT_CHANGE.md if warranted), and what should happen in Phase 02.

STOP. Do not continue into implementation.
```

## Definition of Done

- [ ] `03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md` written, covering all 25 items above
- [ ] `AI/DONOR_RULES.md` populated with real classifications (no longer placeholder)
- [ ] `AI/CURRENT_STATE.md` updated
- [ ] No code, schema, or dependency changes made this phase
- [ ] Recommendations for Phase 02 documented
