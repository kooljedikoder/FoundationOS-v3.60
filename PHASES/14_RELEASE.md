# Phase 14 — Hardening & Release

## Prompt

```
FoundationOS v3.60, Phase 14 — Hardening & Release.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md.

Goal: bring FoundationOS to the v3.60 Alpha 1 milestone. Walk the full Definition of Done in
FOUNDATIONOS_MASTER.md §21 item by item — do not mark anything done without verifying it live
(browser + API client + mobile test client where applicable).

Also:
- Full security pass (auth, permissions, mass-assignment, API scopes, media upload validation).
- Full test suite green.
- Backup/restore verified against the real database.
- Documentation pass: FOUNDATIONOS_MASTER.md, all SPECS/*, AI/ARCHITECTURE.md all reflect reality.
- Tag the release as FoundationOS v3.60 Alpha 1 in 13-RELEASES/.

Follow the Claude Loop. Update AI/CURRENT_STATE.md and AI/CHANGELOG.md with the release summary.

STOP. This is the last phase before ERP modules deepen (post-Alpha-1 roadmap) — do not
auto-continue into new feature work without a fresh planning pass.
```

## Definition of Done

All items in `FOUNDATIONOS_MASTER.md` §21 (FoundationOS v3.60 Alpha 1), plus:

- [ ] Security pass complete, findings logged/fixed
- [ ] Full test suite green
- [ ] Backup/restore verified
- [ ] All docs reflect reality (spot-check against code)
- [ ] Release tagged under `13-RELEASES/`
