# Phase 03 — Module Engine

## Prompt

```
FoundationOS v3.60, Phase 03 — Module Engine.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, and SPECS/MODULES.md.

Goal: build the plugin/module engine — a module can be installed, enabled, and disabled
independently, with its own migrations/config/Filament resources, depending only on FoundationOS
core contracts (never a theme).

Build one trivial reference module (e.g. "Notes") end-to-end to prove: install, enable, appears in
Filament nav, disable, nav entry disappears, its migrations don't run when disabled.

Do not port any real ERPKit module yet — that's Phase 10. This phase only proves the engine.

Follow the Claude Loop (AI/CLAUDE.md). Update SPECS/MODULES.md with the final design, and
AI/ARCHITECTURE.md + AI/CURRENT_STATE.md.

STOP after Definition of Done passes.
```

## Definition of Done

- [ ] Module contract/interface defined
- [ ] Enable/disable toggles nav + migrations correctly
- [ ] Reference module ("Notes") works end-to-end
- [ ] No module depends on a theme
- [ ] Docs + memory updated
