# AI/DECISIONS.md — Decisions already made

Append-only log of architecture decisions. Never delete an entry — if a decision is reversed, add
a new entry that supersedes it and say so explicitly. Every change to a non-negotiable rule in
`FOUNDATIONOS_MASTER.md` §02 must have an entry here *before* implementation.

Format: `## ADR-NNN — Title (YYYY-MM-DD)` then a short "what / why / alternatives considered."
Numbers are permanent and sequential — never renumber or delete an entry; a reversed decision gets
a new ADR that supersedes it and says so explicitly.

---

## ADR-001 — Adopt the FoundationOS v3.60 build pack structure (2026-08-15)

**What:** Established this repo as the permanent build pack: `FOUNDATIONOS_MASTER.md` as
constitution, `AI/` as persistent memory, `PHASES/` as disposable execution prompts, `SPECS/` as
detailed subsystem references.

**Why:** Prevent the AI from re-deciding architecture every session and from building ahead of an
audited understanding of the donor codebases.

**Alternatives considered:** A single giant build prompt ("build FoundationOS") — rejected because
it front-loads implementation before an audit exists and gives the AI no durable memory across
sessions.

## ADR-002 — Stack selection (2026-08-15)

**What:** Laravel 13 + Filament 5 + Filament Forms + Livewire + TallStackUI + Spatie
(Permission/ActivityLog/Media Library) + Sanctum + Laravel Boost + MySQL.

**Why:** Matches the donor codebases (Aureus/ERPKit/Liberu are Laravel-ecosystem), and Boost gives
Claude Code first-class MCP access to app/db/schema/routes/logs plus versioned docs.

**Alternatives considered:** None recorded at time of writing — donor sources dictated the stack.

## ADR-003 — Donor sources and roles (2026-08-15)

**What:** Aureus ERP as the starting application; ERPKit v5 as ERP module donor; Liberu as
finance/accounting donor. All treated as read-only under `01-SOURCES/` until classified.

**Why:** Avoid rebuilding common business-app functionality from scratch; avoid trusting donor
code without inspection.

## ADR-004 — Build sequence: Core before Applications (2026-08-15)

**What:** SERVA and VendorFlow (first applications) are built only after Core, Module Engine,
Theme Engine, and API Hub are proven via a FoundationOS demo application (Phase 02–08), tested
across Filament admin, API, mobile client, and an alternate theme.

**Why:** Prevents architecture experiments from happening inside a named product, which would
couple FoundationOS's design to SERVA's specific needs prematurely.

## ADR-005 — UI kit discipline (2026-08-15)

**What:** Filament is the primary admin/application engine; TallStackUI is used selectively for
custom TALL-stack components. No additional competing UI kit is added without a documented gap
that Filament + TallStackUI cannot cover.

**Why:** Prevents accidental UI-kit sprawl across a project meant to stay lean and reusable.

## ADR-006 — Canonical entities are shared, not per-module (2026-08-15)

**What:** Product, User, Organisation, Location, Contact, Document, Task, and other canonical
entities have exactly one authoritative model, referenced by every module rather than
reimplemented per module.

**Why:** A module/plugin architecture only stays coherent if modules share state instead of
forking it — otherwise "disable a module" silently corrupts or orphans data owned by another.

## ADR-007 — Theme changes must never require domain-logic changes (2026-08-15)

**What:** Swapping a theme (Foundation/Bootstrap/SERVA/VendorFlow) changes rendering only. If a
theme swap requires touching a controller, service, or model, that logic was misplaced and must
move to core or a module.

**Why:** Keeps `FOUNDATIONOS_MASTER.md` §02's "themes never own business logic" rule enforceable
in practice, not just on paper.

## ADR-008 — Add FilaKit and Lara Dashboard as candidate donor sources (2026-08-15)

**What:** Added FilaKit and Lara Dashboard to the donor-source list (`AI/PROJECT_MEMORY.md`,
`FOUNDATIONOS_MASTER.md` §04, `AI/DONOR_RULES.md`, `LICENCES/THIRD_PARTY.md`) as candidates
alongside Aureus/ERPKit/Liberu, following a build pack drafted in a separate session.

**Why:** The other session's draft proposed them; the operator confirmed adding them, on the
understanding that their actual role and licence are unconfirmed.

**Status:** Unconfirmed. Both must be classified in `AI/DONOR_RULES.md` during Phase 01 like any
other donor — until then they are `DO NOT USE` per the standing rule in that file. This decision
records that they were *added to the candidate list*, not that any capability from them has been
approved for use.

## ADR-009 — Merge the parallel build-pack draft into this canonical pack (2026-08-15)

**What:** A separate FoundationOS v3.60 build pack was drafted in another session/tool and
uploaded for comparison. Reconciled by keeping this repo's phase-specific prompts and
Definition-of-Done checklists (kept as primary — more actionable than a single repeated generic
template) and this repo's extra `AI/DONOR_RULES.md`, `AI/KNOWN_ISSUES.md`, `AI/NEXT_TASK.md`,
`README.md` (kept as primary), while adopting from the other draft: `AI/SESSION_START.md`, the
Module Buffet candidate-module list (`FOUNDATIONOS_MASTER.md` §07), ADR-numbered decisions (this
renumbering), and a generic per-task Definition of Done (`FOUNDATIONOS_MASTER.md` §18) as a
supplement to the phase/milestone-level ones.

**Why:** Both packs shared identical architecture (same 15-phase roadmap, same core rules), so
this is reconciliation of two drafts of the same plan, not a redesign.

## ADR-010 — Import donor source code; skip FilaKit as a separate import (2026-08-15)

**What:** Identified and imported real, MIT-licensed upstream repos for four of the five donor
sources into `01-SOURCES/` (shallow clone, nested `.git` stripped, provenance recorded in each
folder's `.donor-provenance.md`):

- Aureus ERP → `aureuserp/aureuserp` @ `c817e736`
- ERPKit v5 → `jeffersongoncalves/erpkitv5` @ `911be3b9`
- Liberu Accounting → `liberu-accounting/accounting-laravel` @ `d9c9870c`
- Lara Dashboard → `laradashboard/laradashboard` @ `9dc13358`

FilaKit v5 (`jeffersongoncalves/filakitv5`) was identified but **not imported** as a separate
source, at the operator's direction.

**Why:** FilaKit v5 is the same author's own base multi-panel starter kit that ERPKit v5 is built
on top of — importing it separately risked duplicating what ERPKit already carries as a Composer
dependency. Phase 01's audit should check whether ERPKit's own `composer.json`/vendor tree already
covers what FilaKit would offer before this decision is revisited.

**Note:** Importing the source code makes it *available to inspect* under `01-SOURCES/` — it does
not classify or approve any of it for use. `AI/DONOR_RULES.md` still gates every capability behind
Phase 01 classification; everything imported here remains `DO NOT USE` until then.

**Alternatives considered:** Importing all 5 including FilaKit — rejected per operator instruction,
on the reasoning above.
