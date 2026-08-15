# Phase 10 — ERP Module Integration

## Prompt

```
FoundationOS v3.60, Phase 10 — ERP Module Integration.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, and AI/DONOR_RULES.md.

Precondition: Phase 02–09 Definitions of Done all passed (Core, Module Engine, Master Data, API
Hub, Workspace, Themes, FormFlow, Tasks/Calendar/Workflow all proven).

Goal: integrate ERPKit-derived modules as plugins (Phase 03 engine), one module at a time, using
only capabilities classified ADAPT or PLUGIN in AI/DONOR_RULES.md. Do not adapt anything marked
REMOVE or DO NOT USE. Do not introduce duplicate canonical entities — reuse Phase 02/04 models.

Follow the Claude Loop for each module. Update AI/ARCHITECTURE.md and AI/CURRENT_STATE.md after
each module, and AI/DONOR_RULES.md if a classification needs correcting (log the correction in
AI/DECISIONS.md).

STOP after each module's Definition of Done passes — report before starting the next module.
```

## Definition of Done (per module)

- [ ] Only ADAPT/PLUGIN-classified capabilities used
- [ ] No duplicate canonical entities introduced
- [ ] Module installs/enables/disables cleanly (Phase 03 contract)
- [ ] Tests pass
- [ ] Docs + memory updated
