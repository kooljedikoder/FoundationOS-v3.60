# AI/DONOR_RULES.md — What can be adapted from each source

Populated by Phase 01 (Audit) and kept in sync with `03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md`
thereafter. Until Phase 01 runs, this file is a placeholder — **no donor code should be adapted
into FoundationOS before this file has real entries.**

Classification values: `KEEP` · `ADAPT` · `PLUGIN` · `REFERENCE` · `REMOVE` · `DO NOT USE`

Source code for the sources below is now physically present under `01-SOURCES/` (imported
2026-08-15, see each folder's `.donor-provenance.md`) — that only means it's available to inspect,
not that anything in it is approved for use. Everything stays `DO NOT USE` until Phase 01 gives it
a real row here.

## Aureus ERP (`01-SOURCES/AUREUS`)

| Capability | Classification | Notes |
|---|---|---|
| _(pending Phase 01 audit)_ | — | — |

## ERPKit v5 (`01-SOURCES/ERPKIT`)

| Capability | Classification | Notes |
|---|---|---|
| _(pending Phase 01 audit)_ | — | — |

## Liberu Accounting (`01-SOURCES/LIBERU`)

| Capability | Classification | Notes |
|---|---|---|
| _(pending Phase 01 audit)_ | — | — |

## FilaKit v5 — not imported

| Capability | Classification | Notes |
|---|---|---|
| N/A | `DO NOT USE` | Deliberately not imported (ADR-010). ERPKit v5 (same author) is built on it — Phase 01 checks whether ERPKit already carries what's needed via Composer before a separate import is reconsidered. |

## Lara Dashboard (`01-SOURCES/LARADASHBOARD`)

| Capability | Classification | Notes |
|---|---|---|
| _(pending Phase 01 audit — role unconfirmed, added post-planning)_ | — | — |

## Rule

Never adapt a donor capability into FoundationOS core, a module, or a theme without a row here
classifying it first. If it isn't classified, treat it as `DO NOT USE` until it is.
