# SPECS/THEMES.md — Theme engine spec

Status: placeholder — finalized during Phase 07 (Theme Engine).

## Principle

Themes render business capabilities. They never contain domain logic (`FOUNDATIONOS_MASTER.md`
§02, frozen in `AI/DO_NOT_CHANGE.md`). A theme is a swappable view/asset layer over the same
data and the same Livewire/Filament component contracts.

## Planned themes

- **Foundation** — default admin theme
- **Bootstrap** — plain Bootstrap-based render layer (per org UI preference for
  Bootstrap/Laravel/JS-only stacks where applicable)
- **SERVA** — first application theme (Phase 13)
- **VendorFlow** — second application theme (Phase 13)

## Switching mechanism

To be decided in Phase 07: per-workspace config vs. per-user preference vs. per-tenant. Whichever
is chosen must not require different backend logic per theme — only different view/asset
resolution.

## Test for "no domain logic in a theme"

Phase 07's Definition of Done requires spot-checking that swapping themes changes rendering only —
same data, same validation, same permissions, same results.

## To be filled in during Phase 07

- Directory/namespace convention for themes
- Asset build pipeline
- How a workspace selects its active theme
