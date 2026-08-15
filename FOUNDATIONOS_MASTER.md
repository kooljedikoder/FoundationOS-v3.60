# FoundationOS v3.60 — Master Specification

Status: **Living document — this is the permanent constitution.** Phase prompts are disposable;
this is not. Any change to this file is an architecture decision and must be logged in
`AI/DECISIONS.md`.

---

## 01. Vision

FoundationOS is a reusable **Business Application OS**, not a single app. It provides one
authoritative core (identity, organisations, master data, permissions, media, audit, tasks,
forms, API) that any number of business applications (SERVA, VendorFlow, future apps) sit on top
of as themes/workspaces — never as forks.

A feature built once in FoundationOS should work on web, mobile/API, and eventually chat/WhatsApp
without being rebuilt per surface.

## 02. Non-negotiable architecture

- **Business logic must never depend on a theme.** Themes render; they do not decide.
- **One authoritative model per canonical entity.** No parallel `Product`/`Item`/`SKU` tables
  invented by different donors.
- **Modules are plugins.** Every business module must be independently enableable/disableable.
- **API-first.** Any module intended for reuse must be reachable via `/api/v1`.
- **Mobile uses the same domain layer as web.** No separate "mobile business logic."
- **Donor code is inspected before it is trusted**, never merged wholesale.

## 03. Technology stack

| Layer | Choice |
|---|---|
| Framework | Laravel 13 |
| Admin engine | Filament 5 |
| Forms | Filament Forms/Schemas |
| Frontend interactivity | Livewire |
| UI components | TallStackUI |
| Permissions | Spatie Permission |
| Audit | Spatie ActivityLog |
| Media | Spatie Media Library |
| API / mobile auth | Laravel Sanctum |
| AI bridge | Laravel Boost (MCP tools + on-demand skills for Claude Code) |
| Database | MySQL |
| IDE | VS Code |
| AI | Claude Code |

## 04. Starting codebase & donor sources

| Role | Source |
|---|---|
| Starting application | Aureus ERP ([aureuserp/aureuserp](https://github.com/aureuserp/aureuserp)) — ✅ imported to `01-SOURCES/AUREUS` |
| ERP module donor | ERPKit v5 ([jeffersongoncalves/erpkitv5](https://github.com/jeffersongoncalves/erpkitv5)) — ✅ imported to `01-SOURCES/ERPKIT` |
| Finance/accounting donor | Liberu Accounting ([liberu-accounting/accounting-laravel](https://github.com/liberu-accounting/accounting-laravel)) — ✅ imported to `01-SOURCES/LIBERU` |
| Candidate donor (role TBC — Phase 01 audit) | Lara Dashboard ([laradashboard/laradashboard](https://github.com/laradashboard/laradashboard)) — ✅ imported to `01-SOURCES/LARADASHBOARD` |
| Candidate donor, not imported (ADR-010) | FilaKit v5 ([jeffersongoncalves/filakitv5](https://github.com/jeffersongoncalves/filakitv5)) — ❌ not imported |

Lara Dashboard was added as a candidate donor after the initial planning pass (see
`AI/DECISIONS.md` ADR-008); its exact contribution is unconfirmed and must be established during
Phase 01, same as the other donors. FilaKit v5 was identified as ERPKit v5's own base starter kit
(same author) and deliberately not imported separately — see ADR-010.

Donor code lives under `01-SOURCES/` (see §Folder System) and is **read-only**. Nothing under
`01-SOURCES/` is modified in place — functionality is classified and then adapted into
FoundationOS proper. All licences confirmed MIT on 2026-08-15 — see `LICENCES/THIRD_PARTY.md`.

## 05. Donor-source rules

For every donor capability, Claude classifies it as one of:

`KEEP` · `ADAPT` · `PLUGIN` · `REFERENCE` · `REMOVE` · `DO NOT USE`

This classification is produced in Phase 01 (Audit) and recorded in
`03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md`, then mirrored into `AI/DONOR_RULES.md`. No donor code
is adapted into FoundationOS core without first appearing in that classification.

## 06. Core entities (single source of truth)

Users, Organisations, Departments, Locations, Contacts, Products, Services, Documents, Tasks.
These are canonical — one model each, owned by FoundationOS core, never duplicated by a module or
donor adaptation.

## 07. Module system

Business modules (including adapted ERPKit modules) are plugins: independently installable,
enableable, and disableable, with their own migrations/config, but depending only on FoundationOS
core contracts — never on a theme. See `SPECS/MODULES.md`.

### Module Buffet — candidate modules

Not a build order, and not a commitment to build all of these — a menu of candidate modules any
FoundationOS-based product can pick from once the Module Engine (Phase 03) exists:

Inventory, Procurement, Projects, CRM, Assets, Manufacturing, Accounting, Support, Knowledge,
Tasks, Calendar, Workflow, Approvals, Communications, Reporting.

Tasks/Calendar/Workflow and Communications are built as core-adjacent engines regardless (Phases
09 and 12); the rest are only built when a specific application (SERVA, VendorFlow, or a future
one) needs them, and then via the ERPKit donor path where applicable (Phase 10).

## 08. API Hub

Every appropriate module exposes `/api/v1` endpoints authenticated via Sanctum. See
`SPECS/API.md`.

## 09. Mobile architecture

Mobile clients authenticate via Sanctum tokens/abilities and consume the same API Hub and domain
layer as web — no mobile-only business logic.

## 10. Workspace engine

Admin vs. application workspace architecture — how a user moves between the FoundationOS admin
panel and a business application (SERVA, VendorFlow) without duplicating auth/session state. See
`SPECS/WORKSPACES.md`.

## 11. Theme engine

Foundation / Bootstrap / SERVA / VendorFlow themes are swappable render layers only. See
`SPECS/THEMES.md`.

## 12. FormFlow

One JSON form definition renders as a web form, mobile form, or chat form:

```
FORM JSON → FORM ENGINE → WEB FORM / MOBILE FORM / CHAT FORM / WHATSAPP FLOW
```

See `SPECS/FORMFLOW.md` for the schema and worked example.

## 13. Communications

WhatsApp is a **channel**, not the architecture. Core owns conversations, participants, messages,
attachments, internal chat, and notifications; channels (WhatsApp, email, SMS, web chat) are
plugins on top. FormFlow supplies chat-form rendering. See `SPECS/COMMUNICATIONS.md`.

## 14. Tasks / Calendar / Workflow

Cross-application work engine shared by every module and application — not owned by any one app.

## 15. ERP modules

ERPKit-derived modules are integrated as plugins per §07, after audit classification.

## 16. Applications

First applications: **SERVA** and **VendorFlow**. Built *after* Core, Module Engine, Theme Engine,
and API Hub are proven — never before. See Phase roadmap §20 and `PHASES/13_APPLICATIONS.md`.

## 17. Security

Spatie Permission for RBAC, Spatie ActivityLog for audit trail, Sanctum for API/mobile auth.
Security risks are assessed per-phase and per-donor-source during audit.

## 18. Testing

No phase is complete without acceptance tests for that phase's Definition of Done (§21).

### Definition of Done — per task (generic)

Applies to every individual task inside a phase, not just the phase as a whole. A task is not
done until:

- the implementation works;
- authorization/permissions work;
- validation works;
- tests exist and pass;
- migrations are safe (reversible, no destructive default on existing data);
- API behaviour is verified where applicable;
- UI is responsive where applicable;
- documentation is updated;
- AI memory (`AI/CURRENT_STATE.md`, `AI/CHANGELOG.md`) is updated;
- no protected architecture (`AI/DO_NOT_CHANGE.md`) was violated.

This is a floor, not a substitute for the phase-specific Definition of Done in each
`PHASES/NN_*.md` file or the Alpha 1 milestone checklist below (§21).

## 19. AI / Claude development rules

See `AI/CLAUDE.md` for the full rule set. Summary:

1. Never rebuild functionality that already exists in FoundationOS or an audited donor source.
2. Never duplicate a canonical core entity (§06).
3. Modules are plugins (§07).
4. Themes never own business logic (§02).
5. APIs are first-class (§08).
6. Mobile is not an afterthought (§09).
7. Donor code is not automatically trusted (§05).
8. Don't rewrite working code for aesthetics alone.
9. Test every phase (§18).
10. Update memory (`AI/CURRENT_STATE.md`, `AI/CHANGELOG.md`) after every completed task.

## 20. Phase roadmap

| Phase | Name | Main result |
|---|---|---|
| 00 | Environment | Working local development environment |
| 01 | Audit & Freeze | Understand Aureus + donors, no code changes |
| 02 | FoundationOS Core | Core identity/business entities |
| 03 | Module Engine | Install/enable/disable plugins |
| 04 | Database & Master Data | Users, orgs, departments, locations, contacts, products/services |
| 05 | API Hub | `/api/v1`, permissions, mobile authentication |
| 06 | Workspace Engine | Admin/application workspace architecture |
| 07 | Theme Engine | Foundation / Bootstrap / SERVA / VendorFlow themes |
| 08 | Forms Engine | Universal JSON form schema architecture |
| 09 | Tasks + Calendar + Workflow | Cross-application work engine |
| 10 | ERP Module Integration | ERPKit modules integrated as plugins |
| 11 | Finance | Liberu-derived/adapted accounting |
| 12 | Communications + FormFlow | Inbox, chat, WhatsApp-style forms |
| 13 | Applications | SERVA + VendorFlow |
| 14 | Hardening & Release | Security, tests, docs, FoundationOS v3.60 |

## 21. Definition of Done — FoundationOS v3.60 Alpha 1 (milestone, not per-task — see §18)

| Capability | Must work |
|---|---|
| Login | ✅ |
| Users / Roles | ✅ |
| Organisations / Departments / Locations / Contacts | ✅ |
| Products / Documents / Tasks | ✅ |
| Module enable/disable | ✅ |
| Filament admin | ✅ |
| Alternate workspace | ✅ |
| API authentication + `/api/v1` | ✅ |
| Mobile test client | ✅ |
| Audit trail | ✅ |
| Media upload | ✅ |
| Claude/Boost inspection | ✅ |
| Automated tests | ✅ |
| Backup/restore | ✅ |

Only after this milestone passes do ERP modules (Phase 10) begin.

## 22. Change-control rules

- Changes to §02 (non-negotiable architecture) require an explicit decision entry in
  `AI/DECISIONS.md` before implementation — never a silent refactor.
- `AI/DO_NOT_CHANGE.md` lists anything currently frozen; Claude must not touch it without a
  decision entry overriding the freeze.
- Every phase ends with an update to `AI/CURRENT_STATE.md` and `AI/CHANGELOG.md`, then **STOP**
  (see `PHASES/*` step 15). Do not auto-continue into the next phase.
