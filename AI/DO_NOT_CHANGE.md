# AI/DO_NOT_CHANGE.md — Protected architecture

Anything listed here is frozen. Claude must not modify, refactor, rename, or "improve" these
without a corresponding entry in `AI/DECISIONS.md` made *first* and explicitly overriding the
freeze.

## Frozen right now

1. **`FOUNDATIONOS_MASTER.md` §02 (Non-negotiable architecture).** Business logic never depends on
   a theme; one authoritative model per canonical entity; modules are plugins; API-first; mobile
   shares the domain layer with web; donor code is inspected before trust.
2. **The canonical core entity list** (§06): Users, Organisations, Departments, Locations,
   Contacts, Products, Services, Documents, Tasks. No parallel/duplicate models for these.
3. **The phase sequence** (§20): Applications (Phase 13) do not start before Core/Module
   Engine/Theme Engine/API Hub (Phases 02–08) are proven.
4. **`01-SOURCES/` is read-only.** Donor projects (Aureus, ERPKit, Liberu) are never edited in
   place — only read for audit/adaptation.
5. **Communications architecture**: WhatsApp (and any other transport) is a channel plugin, never
   baked into core. Core owns conversations/messages/participants/attachments/notifications only.

## Nothing else is frozen yet

Everything else (module internals, theme details, specific migrations) is open until it's built,
at which point it moves from `AI/ARCHITECTURE.md` (current state) into consideration for this
list only if the phase explicitly says so.
