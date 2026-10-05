# Active phase (updated 5 Oct 2026)

Phases 01 to 06 are finished (donor audit, core entities, module registry, master data, API hub, workspaces). The old phase list in `PHASES/` is no longer the working plan.

Current work is the VendorOS product on the FOS base:
1. Decide and record the architecture rules (ADR-055 to ADR-061, all dated 5 Oct 2026).
2. Build the foundations in FOS Core: page and form schema store and renderer, app manifests with ports, Insights KPI registry.
3. Fix structural gaps: FOS owns the partner tables, vendor-user to partner membership, one document owner, test database migration order.
4. Port the mockup pages workspace by workspace.

Start every session with `FoundationOS_DOCS/HANDOVER_CURRENT.md`.
