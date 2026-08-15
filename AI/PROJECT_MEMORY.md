# AI/PROJECT_MEMORY.md — Permanent project facts

Facts that don't change phase to phase. Update only when a fact itself changes (rare) — this is
not a log (see `AI/CHANGELOG.md` for that).

## Identity

- **Project:** FoundationOS v3.60
- **Nature:** Reusable Business Application OS (not a single app)
- **Owner:** kola@mooreadvice.co.uk
- **Repo:** kooljedikoder/foundationos (private)

## Stack (see `FOUNDATIONOS_MASTER.md` §03 for the authoritative table)

Laravel 13, Filament 5, Filament Forms, Livewire, TallStackUI, Spatie Permission/ActivityLog/Media
Library, Laravel Sanctum, Laravel Boost, MySQL, VS Code, Claude Code.

## Donor sources

- Aureus ERP — starting application
- ERPKit v5 — ERP module donor
- Liberu — finance/accounting donor
- FilaKit — candidate donor, role unconfirmed (added post-planning, see `AI/DECISIONS.md` ADR-008)
- Lara Dashboard — candidate donor, role unconfirmed (added post-planning, see ADR-008)

All donor code is read-only under `01-SOURCES/` and classified per `AI/DONOR_RULES.md` before any
adaptation. FilaKit and Lara Dashboard's actual contribution (UI kit vs. dashboard scaffold vs.
something else) is established during Phase 01 — until classified there, treat as `DO NOT USE`
per the standing rule in `AI/DONOR_RULES.md`.

## First applications (built after Core is proven — see §16 of the master spec)

- SERVA
- VendorFlow

## Future modules

- FoundationOS Communications (core: conversations, messages, attachments, notifications)
- FormFlow (channel-agnostic form engine: web / mobile / chat / WhatsApp)

## Database setup ownership

The human operator installs PHP, Composer, MySQL, creates the database/user, and configures
`.env`. Claude runs migrations, seeds data, and inspects schema (via Boost) — Claude does not
provision the production database blindly.

## Environment operator

- Local dev stack (PHP/Composer/MySQL) is installed and configured by the human, not Claude.
