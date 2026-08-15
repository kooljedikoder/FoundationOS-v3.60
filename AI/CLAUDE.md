# AI/CLAUDE.md — Master coding instructions

Read this file at the start of every FoundationOS session, alongside the rest of `AI/`. This file
is the constitution for how Claude works on this codebase — not what it builds (that's
`FOUNDATIONOS_MASTER.md` and the active `PHASES/` file).

## The 10 rules

1. **Never rebuild existing functionality.** Search FoundationOS core and audited donor sources
   for an existing implementation before writing new code.
2. **Never duplicate core entities.** Product, User, Organisation, Location, Contact, Document,
   Task, and other canonical entities have exactly one authoritative model.
3. **Modules are plugins.** Business modules must be independently enableable and disableable.
4. **Themes don't own business logic.** Themes render business capabilities; they never contain
   domain logic.
5. **APIs are first-class.** Every appropriate module must be capable of API exposure.
6. **Mobile is not an afterthought.** Any mobile-intended feature uses the same domain layer as
   web.
7. **Donor code is not automatically trusted.** Inspect before adapting; classify per
   `AI/DONOR_RULES.md`.
8. **Don't rewrite working code for aesthetics.** Preserve working donor functionality unless
   there's a documented architectural reason to change it (log it in `AI/DECISIONS.md`).
9. **Test every phase.** No phase is complete without its acceptance tests passing.
10. **Update memory.** After every completed task, update `AI/CURRENT_STATE.md`,
    `AI/CHANGELOG.md`, and any architecture doc that changed.

## The Claude loop (every task, every phase)

1. Read memory (`AI/*`).
2. Read the current phase file (`AI/ACTIVE_PHASE.md` → matching `PHASES/NN_*.md`).
3. Inspect existing FoundationOS code relevant to the task.
4. Inspect relevant donor code (read-only) if the task touches an audited capability.
5. Explain the proposed change before making it.
6. Identify affected files.
7. Implement the smallest safe change.
8. Run tests.
9. Run Pint / static checks.
10. Check the database (schema/migrations) if touched.
11. Check for browser/runtime errors if UI-facing.
12. Update documentation (spec files, if the change affects one).
13. Update memory (`AI/CURRENT_STATE.md`, `AI/CHANGELOG.md`).
14. Report exactly what changed.
15. **STOP.** Do not automatically continue into the next phase or an unrelated feature.

## Boost

Laravel Boost must be installed as of Phase 00 and stays installed for the life of the project —
do not rely on remembering it exists; it is part of the repository, not the conversation.

```
composer require laravel/boost --dev
php artisan boost:install
```

Custom FoundationOS AI guidelines live under `.ai/guidelines/` in the application repo (added from
Phase 00 onward) and package-specific skills are supplied through Boost's skill system as the
project matures (`foundation-module`, `foundation-theme`, `foundation-api`, `foundation-formflow`,
`foundation-workflow`, `foundation-mobile`, `foundation-communications`, `foundation-plugin`,
`foundation-testing`).
