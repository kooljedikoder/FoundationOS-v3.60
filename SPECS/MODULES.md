# SPECS/MODULES.md — Module engine spec

Status: placeholder — the real design is finalized during Phase 03 (Module Engine). This file
captures intent so Phase 03 has a starting shape to implement or revise.

## Requirements

- A module is independently installable, enableable, and disableable at runtime.
- A disabled module: no nav entries, no routes registered, no migrations run.
- A module depends only on FoundationOS core contracts (canonical entity models, permission
  gates, the API Hub base classes) — **never** on a specific theme.
- A module can register: Filament resources/pages, API routes (`/api/v1/...`), migrations, config,
  permissions, and (from Phase 09 onward) workflow states/triggers.

## Shape (subject to Phase 03 revision)

```
modules/
  <ModuleName>/
    Module.php          — manifest: name, version, dependencies, enabled-by-default
    Providers/
    Resources/           — Filament resources
    Http/Controllers/Api — /api/v1 endpoints
    Migrations/
    config.php
```

## Reference module

Phase 03 builds a trivial "Notes" module end-to-end to prove the engine before any real ERPKit
module is ported (that's Phase 10).

## To be filled in during/after Phase 03

- Final manifest format
- Enable/disable mechanism (config flag vs. DB-backed toggle)
- How module permissions integrate with Spatie Permission
