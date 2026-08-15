# SPECS/WORKSPACES.md — Workspace engine spec

Status: placeholder — finalized during Phase 06 (Workspace Engine).

## Principle

A single authenticated user session moves between the FoundationOS admin workspace and any
number of application workspaces (SERVA, VendorFlow, a demo app) without re-authenticating and
without workspace-specific session/auth logic.

## Shape (subject to Phase 06 revision)

- One `User` (core entity), one session.
- A `Workspace` concept scopes: active theme (see `SPECS/THEMES.md`), active navigation set,
  which modules are visible — not which modules are *enabled* (that's global, per
  `SPECS/MODULES.md`) but which are surfaced in this workspace's nav.
- Switching workspace is a UI action (e.g. a switcher in the top nav), not a route to a different
  login flow.

## To be filled in during Phase 06

- Workspace model/config shape
- How workspace-scoped nav differs from module enable/disable
- Permission interaction: can a role be restricted to a subset of workspaces?
