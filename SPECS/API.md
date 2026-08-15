# SPECS/API.md — API Hub spec

Status: placeholder — finalized during Phase 05 (API Hub).

## Principles

- `/api/v1` is the only supported API surface for v3.60.
- Authentication: Laravel Sanctum, token-based, with abilities/scopes per client (mobile app,
  future integrations).
- API controllers call the same domain/service layer as Filament resources — no API-only business
  logic, no web-only business logic.
- Every module that's meant to be reusable outside the admin panel must expose its capability here.

## Versioning

- Breaking changes require a new version prefix (`/api/v2`) — never break `/api/v1` in place once
  a mobile client depends on it.

## Contract format

OpenAPI (YAML/JSON) committed under `09-API/` in the application repo, one file per module/domain
area, generated or hand-written during the phase that builds the endpoints.

## To be filled in during Phase 05

- Endpoint list for Phase 02/04 core entities
- Sanctum ability names and what they gate
- Error response shape / pagination convention
