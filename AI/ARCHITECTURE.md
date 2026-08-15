# AI/ARCHITECTURE.md — Current architecture

This tracks the architecture **as it actually exists in code right now**, not the aspirational
target (that's `FOUNDATIONOS_MASTER.md`). Update this file whenever a phase changes what's
actually implemented. Empty sections below mean "not yet built."

## Folder system

| Folder | Purpose | Status |
|---|---|---|
| `00-DOCS` | Master specification, decisions, architecture | ✅ this repo |
| `01-SOURCES` | Downloaded Aureus / ERPKit / Liberu / FilaKit / Lara Dashboard (read-only) | not yet added |
| `02-LICENCES` | Licence and attribution records | ✅ `LICENCES/` |
| `03-AUDITS` | AI-generated audits of donor projects | not yet added |
| `04-FOUNDATIONOS` | The actual FoundationOS application | not yet added |
| `05-MODULES` | FoundationOS plugins/modules | not yet added |
| `06-THEMES` | FoundationOS themes/workspaces | not yet added |
| `07-APPS` | SERVA, VendorFlow, future applications | not yet added |
| `08-DATABASE` | Schema snapshots, seed plans, DB documentation | not yet added |
| `09-API` | OpenAPI/API contracts | not yet added |
| `10-AI` | Claude instructions, memory, skills, phase prompts | ✅ `AI/`, `PHASES/` |
| `11-TESTS` | Acceptance/regression documentation | not yet added |
| `12-BACKUPS` | Frozen checkpoints | not yet added |
| `13-RELEASES` | Versioned FoundationOS releases | not yet added |

**Critical rule:** `01-SOURCES` is read-only. Never casually modify donor projects in place.

## Implemented so far

Nothing yet — this repository is currently the docs/AI build pack only (Phase 00 not started).

## Core entities

Not yet implemented. Canonical list per `FOUNDATIONOS_MASTER.md` §06: Users, Organisations,
Departments, Locations, Contacts, Products, Services, Documents, Tasks.

## Module engine

Not yet implemented. See `SPECS/MODULES.md` for target design.

## API Hub

Not yet implemented. See `SPECS/API.md`.

## Workspace / Theme engines

Not yet implemented. See `SPECS/WORKSPACES.md`, `SPECS/THEMES.md`.

## FormFlow / Communications

Not yet implemented. See `SPECS/FORMFLOW.md`, `SPECS/COMMUNICATIONS.md`.
