# FoundationOS handover, current (5 October 2026)

This is the single handover. It replaces `foundation_os/docs/handover_FOS_AppSuite_20261004_1138_V1.md` and the stale `AI/` memory files as the place to start. The evidence behind it is in `MILESTONE_INVENTORY_2026-10-05.md` (timeline, folder inventory, contradictions, clutter).

## 1. What we are building

**FOS (FoundationOS)** is the parent app, built on LaraDashboard (Laravel 13, Livewire, Tailwind, with Filament and the ported Webkul ERP kept). One installation uses one database. On top of FOS sit shared apps and products.

| Layer | What |
|---|---|
| Base (always on) | Access control (users, roles, permissions), settings, media, products and services, custom fields, activity audit log, core entities, module registry (`fos_modules`), Contact Control Center |
| Shared apps | Documents, Collaboration (hybrid comms), Training and Competency, Insights (KPIs, scorecards, reports), Commerce (quotations, RFQs, orders, invoices, expenses, payments, contracts), Risk and Compliance, Automation and Platform |
| Products | VendorOS Core and Vendor Portal. CRM is a separate product for another use of FOS (not part of VendorOS) |

Rules that hold (decided with the owner): apps are installable packages switched by `fos_modules`; an app asks for data through ports and, at install, uses the FOS tables or its own; KPIs are a service that every app feeds; **every page, tab and form is a JSON schema the builder can read and edit** (see `05-VenderOS/PRD/PAGE_SCHEMA_RULE.md`).

## 2. Where things are

| Need | Go to |
|---|---|
| The product design (menu, pages, tabs, fields) | `05-VenderOS/MOCKUP_SRC` (run `node build.js`, opens as `public/VendorFlow_Admin_Home.html`); status in `SITEMAP.md` and `SECTIONS.md` |
| Specification | `05-VenderOS/PRD/VENDORFLOW_PRD_BUILD_SPEC.md` (spec v2), `MOCKUP_BUILD_GUIDE.md`, `MOCKUP_FIELD_AUDIT.md`, `CCC_CHANGE_LIST.md` |
| App design | `05-VenderOS/PRD/APPSUITE_PACKAGES.md` (proposal), `foundation_os/docs/APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md` (install rules) |
| Page and form rule | `05-VenderOS/PRD/PAGE_SCHEMA_RULE.md`, `SPECS/FORMFLOW.md` |
| Contact and ERP ownership | `03-AUDITS/` (contact book audit, CCC and Webkul decoupling plan) |
| Working prototype backend | `foundation_os/public/proto` (SQLite copy of the shared tables, `api.php`, schemas) |
| What is old or stale | `MILESTONE_INVENTORY_2026-10-05.md`, section 2 and 8 |

## 3. Where we are

**Real app (branch main).** Phases 01 to 06 finished in August (core entities, module registry, API hub, workspaces). Webkul ERP plugins are ported in and canonical. CCC is built as native Livewire (directory, profile, wizard, document centre, assets, settings, field rules, required documents). VendorOS self-service exists on top of CCC. Ten manifests are registered in `fos-modules`. The main branch has a large uncommitted working tree and no commits from 25 Aug to 3 Oct.

**Design (branch vendor-portal-mockup-redesign, not pushed).** The VendorOS mockup now covers the PRD sitemap: Dashboard plus 9 workspaces, 42 pages and about 186 tabs, regrouped menu, 13-step registration, CCC module with six contact types, AppSuite page with working app switches, Reports and BI, and a page builder.

**Database connection in the mockup.**
- Live on the prototype database: the whole CCC (directory, profile, 13-step form for six types, documents, assets, users and access, settings lists, field rules), every standard list (over 100 collections: approve, reject and actions are saved and kept after reload), every generated form, the registration wizard (creates a pending vendor), the AppSuite switches, page schemas saved from the builder.
- Still hand-written and not in a schema: 31 tabs (for example the Passport tabs, comms inbox, vendor portal profile), kanban cards and flow diagrams on Warehouse and PLUS, KPI numbers (sample values, not computed), the Role and Menu Guide.
- The prototype writes only to `proto.sqlite`. It never touches the real MySQL database.

## 4. Where we are going

1. Make FOS own the partner tables and the shared reference tables (ADR-056), and prove that uninstalling the ERP plugins leaves FOS, CCC and VendorOS working.
2. Build the foundations in FOS Core: the page and form schema store and renderer, the app manifest with ports, the Insights KPI registry.
3. Fix the structural gaps before new features: vendor-user to partner membership, one document owner, test database migration order.
4. Port the pages in this order: contact form, document centre, vendor registration, then workspace by workspace (Vendor Management, Procurement and Commerce, Risk, Performance, Training, Communications, Vendor Portal, Reports).
5. CRM: harvest and port as its own product on the same base.

## 5. Decisions

**Decided by the owner on 5 Oct 2026** (ADR-055 to ADR-061 in `AI/DECISIONS.md`):

| # | Decision | Answer |
|---|---|---|
| 1 | Is FOS an ERP? | No. FOS is a base starter app with core apps, the foundation for any Laravel app (like LaraDashboard). ERP is an optional plugin family |
| 2 | Who owns the partner tables? | FOS. Webkul ERP and Filament apps are plugins that can be installed, switched off or uninstalled without breaking FOS |
| 3 | Filament | Only the installer, a test surface and a harvest source, shown in an iframe or harvested with the same UI. The product uses no Filament. Laravel first, always |
| 4 | AppSuite packages | Accepted. Installing an app formats it to use the FOS base and core, and asks where contacts and the core apps get their data (FOS tables or the app's own) |
| 5 | Distributions | A build can contain only the apps a job needs; AppSuite shows only those |
| 6 | Page schema | Accepted: every page, tab and form is a schema the builder can edit |
| 7 | Contracts | Part of Commerce. CRM is a separate product |

**Still open:**

| # | Decision | Suggested |
|---|---|---|
| 8 | CCC and VendorOS code lives in `app/`, but CLAUDE.md says core must not reference modules | Move them into packages, or write the exception down |
| 9 | Two module systems (`fos_modules` and the old nwidart `modules/Review`) | One: `fos_modules` |
| 10 | Menu groups in the real sidebar (still the older nine) | Regroup to Dashboard plus 9 workspaces |
| 11 | Finance and Payments, Document Management and Supplier Assessment have no PRD home | Keep where they are |
| 12 | Mockup branch merge and push | Commit main first, then merge |

**What the decisions change in the code:** the 12 `*_if_missing` migrations from ADR-054 become the real FOS migrations (no deferring to a plugin); plugin rollbacks must stop dropping FOS tables; Settings, departments, teams, banks, countries, states and currencies move to FOS ownership; a Laravel-only install profile must boot without Filament.

## 6. Housekeeping before the next big step

- Commit the uncommitted state on main in reviewable pieces.
- Refresh `AI/ACTIVE_PHASE.md`, `AI/CURRENT_STATE.md`, `AI/PROJECT_MEMORY.md` (they still say Phase 01, not started, and Aureus is only a donor).
- Move the other UI projects (`Fluid_UI_KIT`, `liquid-glass-os`) out of the repo, archive the 45 root screenshots and the debug files, and remove the duplicate handover.
- Fix dead links (QUICKSTART, the handover's reference to `CONTACT_BOOK_BUILD_PLAN.md`).

## 7. How to run the prototype

| Task | Command |
|---|---|
| Rebuild the mockup from its parts | `node FoundationOS_DOCS/05-VenderOS/MOCKUP_SRC/build.js` |
| Regenerate workspace pages after editing a spec | `node FoundationOS_DOCS/05-VenderOS/MOCKUP_SRC/tools/apply.js`, then build |
| Reset the prototype database | `php foundation_os/public/proto/build.php` |
| Open it | `http://localhost/FoundationOS/foundation_os/public/VendorFlow_Admin_Home.html` (superadmin login is prefilled) |
