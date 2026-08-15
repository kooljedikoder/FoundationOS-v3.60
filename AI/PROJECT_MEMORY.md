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

- Aureus ERP — starting application — [aureuserp/aureuserp](https://github.com/aureuserp/aureuserp), MIT, imported to `01-SOURCES/AUREUS`
- ERPKit v5 — ERP module donor — [jeffersongoncalves/erpkitv5](https://github.com/jeffersongoncalves/erpkitv5), MIT, imported to `01-SOURCES/ERPKIT`
- Liberu Accounting — finance/accounting donor — [liberu-accounting/accounting-laravel](https://github.com/liberu-accounting/accounting-laravel), MIT, imported to `01-SOURCES/LIBERU`
- Lara Dashboard — candidate donor, role unconfirmed (added post-planning, see ADR-008) — [laradashboard/laradashboard](https://github.com/laradashboard/laradashboard), MIT, imported to `01-SOURCES/LARADASHBOARD`
- FilaKit v5 — candidate donor, **not imported** (ADR-010) — [jeffersongoncalves/filakitv5](https://github.com/jeffersongoncalves/filakitv5), MIT. ERPKit v5 is built on it; Phase 01 decides whether it's needed separately.

All imported donor code is read-only under `01-SOURCES/` and classified per `AI/DONOR_RULES.md`
before any adaptation — physically present is not the same as approved for use; everything stays
`DO NOT USE` until Phase 01 classifies it.

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
