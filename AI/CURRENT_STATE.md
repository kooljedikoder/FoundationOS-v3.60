# AI/CURRENT_STATE.md — Where development currently is

Update this at the end of every task/phase. This is the single most important file for a new
session to read — it should let Claude pick up cold.

## Snapshot

- **Date:** 2026-08-15
- **Active phase:** 00 — Environment (not yet started)
- **Repository state:** Build pack + imported donor source code, no application code yet.
  Reconciled with a parallel build-pack draft from another session on 2026-08-15 (ADR-009); donor
  sources imported same day (ADR-010).
- **Donor sources:** Aureus, ERPKit, Liberu, Lara Dashboard imported to `01-SOURCES/` (MIT
  confirmed; Lara Dashboard's role still unconfirmed, see ADR-008). FilaKit v5 identified but
  deliberately not imported (ADR-010). **None of this is classified for use yet** — that's Phase
  01's job; everything under `01-SOURCES/` is `DO NOT USE` until `AI/DONOR_RULES.md` says
  otherwise.
- **Local dev environment:** Not yet confirmed working.
- **Database:** Not yet created.
- **Last completed phase:** None.
- **Blocking issues:** None.

## What exists right now

- `FOUNDATIONOS_MASTER.md`, `QUICKSTART.md`
- `AI/*` memory files (this system)
- `PHASES/00`–`14` prompt files
- `SPECS/*` subsystem specs
- `LICENCES/THIRD_PARTY.md`
- `01-SOURCES/AUREUS`, `01-SOURCES/ERPKIT`, `01-SOURCES/LIBERU`, `01-SOURCES/LARADASHBOARD` —
  read-only, each with a `.donor-provenance.md`

## What does NOT exist yet

- No Laravel application (Aureus/ERPKit/Liberu/Lara Dashboard exist as read-only source under
  `01-SOURCES/`, not as a running FoundationOS app)
- No database
- No Boost installation
- No audit (`03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md`) — this is what will actually determine
  Lara Dashboard's real role (or rule it out), and whether FilaKit needs importing after all

## Next action

Run **Phase 00 — Environment** (`PHASES/00_ENVIRONMENT.md`) once the human operator has installed
PHP/Composer/MySQL locally. Do not skip to Phase 01 or beyond until Phase 00's Definition of Done
passes.
