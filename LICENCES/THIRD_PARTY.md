# LICENCES/THIRD_PARTY.md — Licence and attribution records

Tracks the licence of every donor source and major package FoundationOS depends on or adapts
from. Update this whenever a new donor source or dependency is added — a licence/dependency risk
check is also part of the Phase 01 audit output.

## Donor sources

| Source | Repo | Role | Licence | Notes |
|---|---|---|---|---|
| Aureus ERP | [aureuserp/aureuserp](https://github.com/aureuserp/aureuserp) | Starting application | MIT (confirmed 2026-08-15) | Imported into `01-SOURCES/AUREUS` @ `c817e736`. Capability classification still pending Phase 01. |
| ERPKit v5 | [jeffersongoncalves/erpkitv5](https://github.com/jeffersongoncalves/erpkitv5) | ERP module donor | MIT (confirmed 2026-08-15) | Imported into `01-SOURCES/ERPKIT` @ `911be3b9`. Built on FilaKit v5 (same author) — see FilaKit row. |
| Liberu Accounting | [liberu-accounting/accounting-laravel](https://github.com/liberu-accounting/accounting-laravel) | Finance/accounting donor | MIT (confirmed 2026-08-15) | Imported into `01-SOURCES/LIBERU` @ `d9c9870c`. |
| FilaKit v5 | [jeffersongoncalves/filakitv5](https://github.com/jeffersongoncalves/filakitv5) | Not imported | MIT (confirmed 2026-08-15, unimported) | Deliberately not imported separately (ADR-010) — ERPKit v5 is built on it; Phase 01 checks whether ERPKit already carries what's needed before a separate import is considered. |
| Lara Dashboard | [laradashboard/laradashboard](https://github.com/laradashboard/laradashboard) | Candidate donor, role TBC | MIT (confirmed 2026-08-15) | Imported into `01-SOURCES/LARADASHBOARD` @ `9dc13358`. Role still unconfirmed — see ADR-008. |

## Key framework/package dependencies

| Package | Licence | Notes |
|---|---|---|
| Laravel 13 | MIT | |
| Filament 5 | MIT | |
| Livewire | MIT | |
| TallStackUI | _(confirm)_ | |
| Spatie Permission | MIT | |
| Spatie ActivityLog | MIT | |
| Spatie Media Library | MIT | |
| Laravel Sanctum | MIT | |
| Laravel Boost | _(confirm)_ | |

## Rule

No donor source is adapted (per `AI/DONOR_RULES.md` classification `ADAPT`/`PLUGIN`/`KEEP`) until
its licence is confirmed here as compatible with FoundationOS's intended use (private commercial
product). If unconfirmed, treat as `DO NOT USE` regardless of any other classification.
