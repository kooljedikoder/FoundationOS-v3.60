# LICENCES/THIRD_PARTY.md — Licence and attribution records

Tracks the licence of every donor source and major package FoundationOS depends on or adapts
from. Update this whenever a new donor source or dependency is added — a licence/dependency risk
check is also part of the Phase 01 audit output.

## Donor sources

| Source | Role | Licence | Notes |
|---|---|---|---|
| Aureus ERP | Starting application | _(confirm during Phase 01 audit)_ | Verify licence permits commercial derivative use before Phase 02 adapts anything. |
| ERPKit v5 | ERP module donor | _(confirm during Phase 01 audit)_ | Same. |
| Liberu | Finance/accounting donor | _(confirm during Phase 01 audit)_ | Same. |
| FilaKit | Candidate donor, role TBC | _(confirm during Phase 01 audit)_ | Added post-planning; confirm both licence and actual role before any use. |
| Lara Dashboard | Candidate donor, role TBC | _(confirm during Phase 01 audit)_ | Added post-planning; confirm both licence and actual role before any use. |

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
