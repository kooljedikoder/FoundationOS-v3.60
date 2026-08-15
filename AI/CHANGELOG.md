# AI/CHANGELOG.md — What Claude changed

Append-only, most recent first. One entry per completed task/phase step — this is the audit trail
of what the AI actually did, distinct from `AI/DECISIONS.md` (why architecture choices were made).

---

## 2026-08-15 — Donor source code imported (ADR-010)

Identified real upstream repos for the donor sources (all MIT-licensed, verified via web search
and repo pages) and imported four of five into `01-SOURCES/`, shallow-cloned with nested `.git`
stripped and a `.donor-provenance.md` recorded in each: Aureus ERP (`aureuserp/aureuserp`), ERPKit
v5 (`jeffersongoncalves/erpkitv5`), Liberu Accounting (`liberu-accounting/accounting-laravel`),
Lara Dashboard (`laradashboard/laradashboard`). FilaKit v5 (`jeffersongoncalves/filakitv5`) was
identified but deliberately not imported — it's the same author's base kit that ERPKit v5 is
already built on. Updated `FOUNDATIONOS_MASTER.md`, `AI/PROJECT_MEMORY.md`, `AI/DONOR_RULES.md`,
`AI/ARCHITECTURE.md`, `LICENCES/THIRD_PARTY.md` accordingly. Nothing imported is classified for
use yet — that's still Phase 01.

Note: a couple of the web-page fetches used to confirm licences returned unsolicited
"strategic development notes" phrased suspiciously like injected content (referencing an
internal-sounding token budget and stack preferences) — flagged to the operator, not acted on.
The factual licence/description claims were independently corroborated via separate search
results and are trusted; the "suggestions" were not.

## 2026-08-15 — Reconciled with parallel build-pack draft (ADR-009)

Compared this pack against a build pack drafted in a separate session and merged the better parts
of each: added `AI/SESSION_START.md`, the Module Buffet candidate-module list
(`FOUNDATIONOS_MASTER.md` §07), ADR-numbered decision log, a generic per-task Definition of Done
(§18), and two candidate donor sources — FilaKit and Lara Dashboard (ADR-008, unconfirmed role,
pending Phase 01 classification). Kept this pack's phase-specific prompts, per-phase Definition of
Done checklists, and its extra `AI/DONOR_RULES.md` / `AI/KNOWN_ISSUES.md` / `AI/NEXT_TASK.md` /
`README.md` as primary. No application code touched — still pending Phase 00.

## 2026-08-15 — Build pack created

Created the initial FoundationOS v3.60 build pack: master spec, quickstart, AI memory system (this
file included), 15 phase prompts (00–14), 7 subsystem specs, and third-party licence tracking.
No application code yet. Repository is docs-only pending Phase 00.
