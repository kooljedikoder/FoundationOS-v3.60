# SPECS/DATABASE.md — Database spec

Status: placeholder — populated for real during Phase 04 (Database & Master Data). This file
holds the *target* shape; `AI/ARCHITECTURE.md` tracks what's actually implemented.

## Canonical entities (one table/model each — `FOUNDATIONOS_MASTER.md` §06)

- `users`
- `organisations`
- `departments` (belongs to organisation)
- `locations` (belongs to organisation)
- `contacts` (belongs to organisation)
- `products` / `services`
- `documents` (polymorphic attach, backed by Spatie Media Library)
- `tasks` (polymorphic attach — see `SPECS/COMMUNICATIONS.md` / Phase 09)

## Cross-cutting tables (Spatie packages)

- Permission tables (roles, permissions, model_has_*) — Spatie Permission
- `activity_log` — Spatie ActivityLog
- `media` — Spatie Media Library

## Rules

1. No module or donor adaptation creates a second table for a canonical entity above — it extends
   via relationship/pivot instead.
2. Every migration that touches a canonical entity is reviewed against `AI/DO_NOT_CHANGE.md`
   before merging.
3. Schema changes affecting canonical entities are logged in `AI/DECISIONS.md`.

## To be filled in during Phase 04

- Full column list per entity
- Relationship diagram
- Seeder strategy for the demo dataset
