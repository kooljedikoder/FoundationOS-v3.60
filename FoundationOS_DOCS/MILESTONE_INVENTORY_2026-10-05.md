# Milestone inventory, 5 October 2026

Read-only research. Nothing was moved or edited except this file and INVENTORY_PROGRESS.md.
Items I could not verify are marked "UNVERIFIED".
Sizes and dates come from the file system. Git facts come from `git log main` (89 commits).

## 1 Timeline

Strategy in one line at each stage is in the right column.

| Date | Milestone | Strategy at that point |
|---|---|---|
| 15 Aug | Initial commit, v3.60 build pack (master spec, AI memory, 15 phase prompts, specs, licences). Donor import (Aureus, ERPKit v5, Liberu, LaraDashboard), ADR-010. | Plan: Aureus-style ERP donors, Filament as primary admin. 14 phases, one at a time. |
| 16 Aug | Docs reorganised into FoundationOS_DOCS. Clean Laravel 13 baseline. Then app base swapped to LaraDashboard. ADR-011 (Laravel foundation, Filament add-on), ADR-012 (LaraDashboard replaces ADR-001), ADR-008 (no RoadRunner, Hostinger shared hosting). | Hybrid doctrine. "Laravel-first, not an ERP." Three experiences: User, Admin, Superadmin. |
| 17 Aug | Docs reconciled. Filament re-added, then collapsed to one permission-gated panel (ADR-015). Theme engine (ADR-018). Phases 01 to 04 finished: donor audit, 7 Core entities, Module Registry (`fos_modules`), Filament resources. Many login and 500 fixes. | One install, permission-gated (ADR-016, ADR-019 "FOS Contract"). |
| 18 Aug | Phase 05 API Hub (`/api/v1`), Phase 06 Workspace, Procurement module, Product/Service split, Custom Fields, login unification. | Modules as installable units. |
| 19 to 20 Aug | AppBuffet self-service zip install (ADR-044), renamed AppSuite (ADR-046). ADR-048: Filament is a harvest tool only, native `/admin` is the end-user surface. `fos:port` generator (ADR-049 to 052). | Filament becomes a source to harvest from, not the product UI. |
| 21 to 24 Aug | Reversal in practice: AureusERP (Webkul) ERP-core plugins ported into FOS code and DB, `/erp` panel working, Maintenance, Employees. FOS-native Department, Product, Procurement, Organisation, Contact, Location retired in favour of ERP equivalents. AppSuite sidebar, Menu Manager, App Sandbox, AI Data Copilot (local Ollama), Support Chat plugin. | "Aureus-based ERP approach." ERP tables are canonical. |
| 25 Aug to 3 Oct | No commits on main for 41 days. Work continued uncommitted (see git status): Job Wizard (28 stages), LaraBuilder layout engine, CCC build (Sep 13), Contact Book audit (27 Aug), VendorOS research, Fluid UI Kit, liquid-glass-os. UNVERIFIED in detail; evidence is file dates only. | FOS owns the DB, ERP reads from it (memory notes, 03-AUDITS decoupling plan 17 Sep). |
| 4 Oct | VendorOS self-service on top of CCC (registration wizard, portal pages, vendor menu, required documents, Access tab, field rules, status checklist). Handover V1 written. | VendorOS depends on CCC. Laravel-first rule for modules restated (APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md, 3 Oct). |
| 5 Oct | Handover updated. Mockup branch `vendor-portal-mockup-redesign` (15 commits ahead of main, not pushed per owner): 16-step then 13-step registration wizard, CCC prototype with SQLite, MOCKUP_SRC split into 13 section folders, PRD build spec v2, field audit, AppSuite packages proposal. | Parent app FOS plus plug-in apps with data ports (APPSUITE_PACKAGES.md, proposal only). |

Branches: `main`, `vendor-portal-mockup-redesign` (also on origin/main remote ref list, so it exists as `remotes/origin/vendor-portal-mockup-redesign`; whether it is really pushed is UNVERIFIED, owner says not), and two leftover agent worktree branches `worktree-agent-a6b792a08151033fd` and `worktree-agent-aa0136f6147be81ab`.
The git status on main shows a large amount of uncommitted change (deleted brand assets and playwright logs, modified DECISIONS.md, CLAUDE.md, README.md, many app files). Main is far ahead of what is committed.
The PRD and MOCKUP_SRC files exist on disk but `git ls-files` returns nothing for the PRD folder on main. They are committed only on the mockup branch.

## 2 Folder and document inventory

Verdicts: CURRENT, PARTLY STALE, OLD, SUPERSEDED.

### Root of FoundationOS_DOCS

| Item | Purpose | Modified | Size | Verdict |
|---|---|---|---|---|
| 001-ALWAYS-READ-FIRST-001-FOUNDATIONOS_MASTER_APPENDIX_DYNAMIC.md | Final working direction, hybrid principle, visual stack | 2026-08-17 | 11.6 KB | PARTLY STALE. Core doctrine still valid. Says "read first" but has no VendorOS, CCC, ERP-in-FOS, or AppSuite package content. Its own status section is old. |
| FOUNDATIONOS_MASTER.md | v3.60 master spec | 2026-08-17 | 4 KB | PARTLY STALE. Reconciled to LaraDashboard on 17 Aug. Nothing after. Still says "not an ERP" while the app now ships a full ERP. |
| README.md | Title "v3.62" | 2026-08-16 | 0.9 KB | OLD. Version label disagrees with master (v3.60) and the zip (v3.64). |
| QUICKSTART.md | Reading order | 2026-08-16 | 0.5 KB | OLD. Points at `TODAY-ADDITIONS.md` and `MERGE-NOTES.md`, which are now only in SPECS/PROJECT-CONTROL. Says start at Phase 01. |
| QUICKSTART-NOW.md | "Single current baseline" | 2026-08-16 | 2.4 KB | OLD. Refers to zips v3.60 to v3.64. |
| BACKLOG.md | Scoped-not-built list | 2026-08-30 | 4.4 KB | PARTLY STALE. Last touched 30 Aug. Not updated for CCC, VendorOS, mockup. |
| SYNC-SUMMARY-2026-08-17.md | Paste-into-ChatGPT sync | 2026-08-17 | 8.8 KB | OLD (point in time snapshot). |
| DONOR_HARVEST_LIBRARY.md, PACKAGE_HARVEST_STRATEGY.md | 176 and 157 byte pointer stubs | 2026-08-16 | tiny | CURRENT as pointers. Real text is in SPECS/ (18 KB and 12 KB, 16 Aug). |
| FoundationOS_v3.64_MASTER_RECONCILED.zip | Original pack | 2026-08-16 | 67 KB | OLD (archive). |
| FoundationOS_AppSuite_Strategy_MD.zip | Zip of 0A1 folder | 2026-08-24 | 4 KB | OLD duplicate of 0A1 and of 01-SOURCES copy. |

### Folders

| Folder | Purpose | Last modified | Verdict |
|---|---|---|---|
| 01-SOURCES | Read-only donor code (ERPKIT, LIBERU, LARADASHBOARD, LARAVEL CRM, LARAVEL-PACKAGES, FILAMENT-PACKAGES, LocalLLM lovable, UI-INSPIRE, procurment-vendorOS). Contains a duplicate strategy zip. Aureus dump removed 19 Aug. | 2026-10-05 | CURRENT as library. Some files inside are modified (git status), which breaks the "read-only" rule. |
| 02-UI-INSPIRED | UI pattern references (T2D dashboard), README and UI_TASKS | 2026-08-19 | OLD but harmless. |
| 03-AUDITS | Five audits: FOUNDATIONOS_INITIAL_AUDIT (17 Aug), CONTACT_BOOK_ENTITY_AUDIT (27 Aug), CCC_ERP_TERMINOLOGY_AND_RELATIONSHIP_PLAN (15 Sep), CCC_WEBKUL_DEPENDENCY_AUDIT_AND_DECOUPLING_PLAN (17 Sep), MENU_BUILDER_PROCESS_AND_EXPAND_PLAN (17 Sep) | 2026-09-17 | CURRENT for contact and ERP ownership. Initial audit is OLD. The handover cites `CONTACT_BOOK_BUILD_PLAN.md`, which does not exist here (dead link). |
| 04-FOUNDATIONOS | Per-topic stubs (API, APPBUFFET, ARCHITECTURE, COMMUNICATIONS, CORE, FORMS, MODULES, OFFLINE, PRODUCTS/COMSHUB/REPORT2HQ/SERVA/VENDOROS, TESTING, WORKSPACE) | 2026-08-16 (VENDOROS-PLAN 2026-10-04) | OLD except VENDOROS-PLAN.md (CURRENT). The rest are short v3.60 stubs. VENDOROS/_recovery-archive holds PLAN2 and PLAN3 save-as copies. |
| 05-VenderOS | VendorOS research, mockup source, PRD. Folder name is misspelled ("Vender"). | 2026-10-05 | CURRENT, the most active area. Details below. |
| 0A1-FoundationOS_AppSuite_Strategy_MD | AppSuite strategy: end-to-end, operating process, change strategy, current state vs strategy (22 Aug), duplicate concepts plan (22 Aug), unified login and menu plan (22 Aug) | 2026-08-22 | PARTLY STALE. Doctrine docs fine. "Current state" and "duplicate concepts" were true on 22 Aug, before the Aug 23 retirements and the 3 Oct Laravel-first rule. |
| AI | Memory files for Claude sessions | 2026-09-17 | See below. Mostly STALE. |
| PHASES | 00 to 14 phase prompts plus ERP_PLUGIN_DEPENDENCIES.md | 2026-08-22 | OLD. Phases 01 to 06 done (ADR-021 to 035). Phases 07 to 14 never executed as written. |
| SPECS | Short specs (API, COMMUNICATIONS, DATABASE, FORMFLOW, MODULES, THEMES, WORKSPACES), FORMFLOW_CHAT (17 KB), PRODUCT_GOODS_SERVICES_JOB_COSTING_AI_GUIDE (13 Sep), PROJECT-CONTROL | 2026-09-13 | Mostly OLD (v3.60 text). Only the job-costing guide is newer. FORMFLOW is a design never built as specified. |
| LICENCES | THIRD_PARTY.md (17 Aug), HARVESTING/HARVEST-PROCESS and HARVEST-REGISTER | 2026-08-17 | PARTLY STALE. Third-party list is from 17 Aug. Many packages added since (Webkul, Ollama copilot, support chat, venturedrake read-only). |
| Ai search | AI data intelligence strategy and reuse strategy plus three zips | 2026-08-24 | CURRENT as strategy for the AI Data Copilot, which exists. Zips are duplicates. |

### AI folder

| File | Modified | Size | Verdict |
|---|---|---|---|
| ACTIVE_PHASE.md | 2026-08-16 | 162 B | WRONG. Says "Phase 01 Audit, NOT STARTED". Phases 01 to 06 finished on 17 and 18 Aug. |
| CURRENT_STATE.md | 2026-08-19 | 40 KB | STALE. Header says last updated 2026-08-17. It claims it wins over every other doc. It does not know ERP-in-FOS, CCC, VendorOS. |
| DECISIONS.md | 2026-09-17 on disk (and modified, uncommitted) | 185 KB | PARTLY STALE. 54 ADRs. Last ADR-054 on 17 Sep. No ADR for: ERP ports as canonical (21 Aug), shared DB rule, FOS owns DB, VendorOS, Laravel-first AppSuite rule, mockup rebuild, CRM harvest decision. |
| PROJECT_MEMORY.md | 2026-08-17 | 1.5 KB | OLD. Aureus is "capability donor, not the base". Wrong today. |
| DO_NOT_CHANGE.md | 2026-08-16 | 441 B | PARTLY STALE. Principles still fine. |
| ARCHITECTURE.md | 2026-08-16 | 1.3 KB | OLD (11-layer v3.60 model). |
| CHANGELOG.md | 2026-08-16 | 441 B | OLD. Two entries from 15 Aug. |
| ADMIN_SITEMAP.md | 2026-08-20 | 2 KB | OLD. |
| CLAUDE.md, SESSION_START.md, MASTER-PROMPT.md | 2026-08-16 | small | OLD but they tell the AI to read the stale files above. |
| HARVEST_PRESENTATION_STANDARDS.md, VISUAL_STACK_RULES.md | 2026-08-20 | 6 KB, 0.8 KB | CURRENT (presentation standard, ADR-053). |

ADRs in DECISIONS.md: 001 starting point, 002 ERP donors, 003 UI, 004 API, 005 AI, 006 core entities, 007 themes, 008 no RoadRunner, 009 visual stack, 010 root file drop rule, 011 hybrid principle, 012 clean baseline LaraDashboard, 013 MariaDB migration fix, 014 Filament at /superadmin, 015 one panel, 016 one install ground rule, 017 contact form PoC, 018 theme tokens, 019 FOS Contract, 020 theme switcher, 021 Phase 01 done, 022 Phase 02, 023 Phase 03, 024 Phase 04, 025 demo credentials, 026 dark/light and auth restyle, 027 login crash, 028 auth card fix, 029 Apache stale worker 500, 030 remove LaraDashboard branding, 031 Core nav fix, 032 manifest schema, 033 API Hub, 034 workspace stub, 035 workspace wired, 036 AppBuffet visible, 037 first Filament plugin, 038 Procurement, 039 Procurement extended, 040 Product/Service split, 041 unified login screen, 042 Custom Fields, 043 logout 405, 044 self-service install, 045 AppBuffet card UI, 046 rename to AppSuite, 047 Playwright and Boost MCP, 048 Filament harvest tool only, 049 fos:port, 050 Organisation harvest, 051 Supplier harvest, 052 Repeater support, 053 AppSuite tabs and Presentation Standard (053b to 053e follow-ups), 054 CCC decoupled from Aureus classes.
Several early ADRs are superseded: 001 by 012, 003 by 011, 014 by 015, 038 to 051 (native Procurement, Organisation, Supplier) by the 23 Aug retirement in favour of ERP.

### PHASES

| Phase | State |
|---|---|
| 00 Environment | Done (clean baseline) |
| 01 Audit, 02 Core, 03 Module engine, 04 Master data, 05 API hub, 06 Workspace | Done (ADR-021 to 035) |
| 07 Themes | Partly done (ADR-018, 020) |
| 08 FormFlow | Not done as specified |
| 09 Tasks/Calendar/Workflow, 10 ERP modules, 11 Finance | Replaced by ported Webkul ERP plugins |
| 12 Communications | Replaced by Service Desk plugin, support chat, and draft `fos-modules/communications` |
| 13 Applications | Now VendorOS and CCC, not as written |
| 14 Release | Not started |

### SPECS list

API, COMMUNICATIONS, DATABASE, DONOR_HARVEST_LIBRARY, FORMFLOW, FORMFLOW_CHAT, MODULES, PACKAGE_HARVEST_STRATEGY, PRODUCT_GOODS_SERVICES_JOB_COSTING_AI_GUIDE, THEMES, VISUAL_STACK_SELECTION, WORKSPACES, PROJECT-CONTROL (12 files: MASTER-STATUS.json, MERGE-NOTES, TODAY-ADDITIONS, VERIFIED-BASELINE, RECONCILIATION-REPORT and others, all v3.6x pack era).

### 05-VenderOS

| Item | Modified | Size | Verdict |
|---|---|---|---|
| PRD/VENDORFLOW_PRD_BUILD_SPEC.md (spec v2) | 2026-10-05 | 160 KB | CURRENT |
| PRD/MOCKUP_BUILD_GUIDE.md | 2026-10-05 | 63 KB | CURRENT |
| PRD/MOCKUP_FIELD_AUDIT.md | 2026-10-05 | 48 KB | CURRENT |
| PRD/CCC_CHANGE_LIST.md | 2026-10-05 | 12 KB | CURRENT |
| PRD/APPSUITE_PACKAGES.md | 2026-10-05 | 6 KB | CURRENT but proposal only, awaiting owner decision. |
| PRD/data (4 JSON files: field_dictionary, j01_crosswalk, mandatory_documents, mockup_data_map) | 2026-10-05 | | CURRENT |
| MOCKUP_SRC (README, SECTIONS.md 27 KB, SITEMAP.md 7 KB, build.js, parts.json, sections/00 to 12, css, js, shell, tools) | 2026-10-05 | | CURRENT. 13 section folders verified (dashboard, 9 workspaces, administration, CCC, spec-docs). The "185 tabs" figure: UNVERIFIED (not found in the docs). |
| JOB_WIZARD_HANDOVER.md | 2026-09-19 | 19 KB | CURRENT for the Filament Job Wizard (28 stages). Different product slice from VendorOS. |
| VeriphyVendor_Product_Family.md | 2026-08-25 | 12 KB | CURRENT (FLEX/CORE/PLUS) |
| VendorOS_Feature_Gap_Matrix.md, VendorOS_Table_Matrix.md | 25 Aug, 2 Oct | 3 KB, 4 KB | CURRENT |
| ERP_Job_Costing_Procurement_Gap_Analysis.md, JobFlow_vs_FoundationOS_Data_Alignment (md and html) | 28 and 29 Aug | 25, 20, 21 KB | PARTLY STALE (JobFlow era) |
| VendrOS_Admin_Home.html (148 KB, 10 Aug), VeriphyVendorFlow.pdf (32 MB, 19 Jul), infographic (1.8 MB) | | | SUPERSEDED by the rebuilt mockup. Keep the PDF as source. |

## 3 Handover documents and what is wrong in them

| File | Date | What it says | What is wrong or missing |
|---|---|---|---|
| foundation_os/docs/handover_FOS_AppSuite_20261004_1138_V1.md (64 KB) | 4 Oct, updated 5 Oct | Rule: Laravel-first, DB is truth, FOS registry controls modules. Edition rules. 5 Oct update: required docs editor, field rules, ERP/CRM ownership. | (1) It is a near duplicate of APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md (same title, same headings). Two copies will drift. (2) Heading "Project Status: Past and Present" is empty. (3) Contradiction inside: 4 Oct section says "No CCC Settings editor yet", 5 Oct update says the editor exists. (4) Names `public/VendorFlow_Admin_Home.html` as the source of truth for VendorOS menus. The mockup was rebuilt on 5 Oct (13 workspaces) under 05-VenderOS/MOCKUP_SRC. (5) No mention of the mockup branch, CCC SQLite prototype `public/proto`, 13-step contact form, APPSUITE_PACKAGES.md ports/apps proposal, PRD v2. (6) Cites missing `CONTACT_BOOK_BUILD_PLAN.md`. (7) Says "no strategy for the original timeline": nothing on the Aug 21 ERP pivot reason. (8) Test DB migration is broken (`fos_requirement_templates` to `products_products`), so tests cannot be trusted. (9) Mentions a separate `C:\xampp\htdocs\FoundationOS_LaravelFirst` reference that is not in this repo (UNVERIFIED). |
| foundation_os/docs/APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md | 3 Oct (file 4 Oct) | Canonical rule. | Older than the handover copy. Same defects. Pick one canonical file. |
| CCC_FOUNDATIONOS_MASTER_HANDOVER.md and CCC_CLAUDE_TEAM_HANDOVER_2026-09-13.md (under foundation_os/CCC/ccc-foundationos-fos-ai-build/docs) | 13 Sep | CCC phase 1 native slice, data ownership. | Before CCC got standalone profile page, Access tab, 13-step wizard, field rules DB, the prototype. Treats Webkul Partner as permanent (the 17 Sep audit questions that). |
| FoundationOS_DOCS/05-VenderOS/JOB_WIZARD_HANDOVER.md | 19 Sep | Job Wizard 28 stages wired. | Valid for Filament ERP work. Not linked from any master doc. |
| foundation_os/resources/js/lara-builder/docs/HANDOVER.md | 29 Aug, file 1 Sep | LaraBuilder layout engine. | Not updated after Sep. Not linked from FOS docs. |
| FoundationOS_DOCS/04-FOUNDATIONOS/PRODUCTS/VENDOROS/VENDOROS-PLAN.md | 4 Oct | VendorOS self-service plan. | Predates mockup rebuild. PLAN2 and PLAN3 are save-as copies. |
| liquid-glass-os/liquid-glass/HANDOVER.md (58 KB) and Fluid_UI_KIT/os-library/mirror/docs/HANDOVER.md (27 KB) | 2 to 5 Oct | Liquid Glass OS (a separate UI project). | Different project. Not FOS. Two copies of the same handover title, different sizes. History backups under liquid-glass-os/liquid-glass/history/2026-10-02/backups (7 HANDOVER.pre-NNN.md). |
| AI/CURRENT_STATE.md, AI/ACTIVE_PHASE.md | Aug | Meant to be the on-ramp. | Stale, see section 2. |

The mockup docs (MOCKUP_BUILD_GUIDE.md, SECTIONS.md, SITEMAP.md, APPSUITE_PACKAGES.md) act as the real current handover for the VendorOS design, but there is no single document that ties code state, mockup state and strategy together.

## 4 Strategy rules in force and contradictions

| Rule | Stated in | Contradiction or caveat |
|---|---|---|
| Laravel-first. Filament is optional adapter. | 001 appendix (16 Aug), ADR-011, APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md (3 Oct) | ADR-048 (20 Aug) says Filament is harvest tool only. 21 Aug onward the app ships Filament `/control-panel` and `/erp` as real surfaces. Handover says keep Filament in the current install and do not change composer. Root composer.json still hard requires Filament and Webkul. No Laravel-only install exists. |
| FOS is "not an ERP" | 001 appendix, FOUNDATIONOS_MASTER.md, README | ERP plugins (accounts, inventories, invoices, manufacturing, purchases, sales and more, 17 plugins) are ported in. Memory notes say ERP is being absorbed into FOS. Docs not updated. |
| Aureus is a donor, not the base | PROJECT_MEMORY.md, ADR-002, ADR-012 | 21 Aug ADR-less decision to "port AureusERP's real ERP-core plugins" made them canonical. No ADR records it. |
| One database. ERP, CCC, VendorOS share one identity graph (`partners_partners`) | Handover (3 Oct), CONTACT_BOOK_ENTITY_AUDIT (27 Aug), VendorOS_Table_Matrix | Handover 5 Oct says FOS owns the schema (own migration for partners_partners). CCC_ERP_TERMINOLOGY plan (15 Sep) treats Webkul Partner as permanent. CCC_WEBKUL_DEPENDENCY audit (17 Sep) opens the question of removal. Handover also notes Webkul Partner still implements Filament classes, so partners cannot load without Filament. |
| `fos_modules` table is the runtime switch. Manifest `foundation_module.json` is only metadata. Install disabled by default. | ADR-023, ADR-032, ADR-044, handover | `modules_statuses.json` and `modules/Review` (nwidart) are a second, separate module system. foundation_os/docs/module-development.md documents only the nwidart system and does not mention fos_modules (handover admits this). |
| Core must never reference modules | foundation_os/CLAUDE.md "Core / Module Boundary (STRICT)" | Broken in practice. CCC code is in core: app/Livewire/Admin/ContactControlCenter (8 classes, ContactWizard 4435 lines), app/Livewire/VendorOnboarding, app/Livewire/Admin/VendorPassports, 12 or more Fos* and Vendor* models, app/Services/Communications and Workspaces. The `fos-modules/*` folders hold only manifests. This is a different boundary (LaraDashboard modules) from the AppSuite package rule, and the two are never reconciled. |
| AppSuite package rule: every feature ships as an installable package | memory note, APPSUITE_PACKAGES.md (proposal) | Not true in code: only manifests exist for CCC, VendorOS, Communications. Packages doc is a proposal awaiting decision. |
| Editions FLEX (full 45-stage), CORE (adds governance), PLUS (adds source-to-pay) | handover, VeriphyVendor_Product_Family.md | Consistent. Edition marks are entitlement, not build status. Older mockup docs used 2 tiers (UNVERIFIED which files). |
| One FOS look across User, Admin, Superadmin | 001 appendix, ADR-018 | Partly true (theme bridge plugin). Fluid UI Kit and Liquid Glass OS are separate looks, and the kit rule "match the app" is only in memory notes. |
| VendorOS menu order comes from the mockup | handover, VENDOROS-PLAN | Source named is the old `public/VendorFlow_Admin_Home.html`. Newer one is MOCKUP_SRC. |
| Do one phase at a time, read AI memory first | AI/CLAUDE.md, ACTIVE_PHASE.md | Memory files are stale, so following them sends a session to Phase 01. |
| Vendor documents: one canonical owner | handover checklist | OPEN. CCC uses Media, Passport uses VendorDocument and Document. |

## 5 Code strategy

Layout on disk (verified by listing):
- `foundation_os/` is a LaraDashboard clone (Laravel 13, Livewire 4, Tailwind 4). 209 migrations, 89 models in app/Models.
- Core: `app/` (Services is large, about 60 entries), `resources/`, `routes/` (web, api, auth, channels, console, install). Native `/admin` is Blade plus Livewire plus Tailwind with data tables as Livewire classes (app/Livewire/Datatable).
- Filament: app/Filament holds the `/control-panel` resources (Documents, Departments, Locations, Organisations, Products, Services), the `/erp` panel (app/Filament/Erp), a theme bridge plugin, and utility pages (App Sandbox, Composer installer).
- ERP: `plugins/webkul/*` has 17 plugins (accounts, chatter, employees, fields, full-calendar, inventories, invoices, maintenance, manufacturing, partners, plugin-manager, products, purchases, sales, security, support, table-views) mirrored to `vendor/webkul/*`. Edits to plugins need a manual copy to vendor (memory note).
- Other plugins in `plugins/`: filament-service-desk, filament-data-copilot, filament-multifactor-whatsapp, filament-table-layout-toggle, mks-support-chat, WA_EM_QR_PHverification-hub.
- AppSuite registry: `fos-modules/` has 10 manifests: activity-audit-log, ai-data-copilot, communications (draft, README), contact-control-center, core-entities, custom-fields, services, socialite, spatie-media-library-plugin, vendor-os. The code for CCC and VendorOS sits in app/, not in these folders.
- LaraDashboard module system: `modules/Review` only (nwidart, enabled in modules_statuses.json).
- CCC: native Livewire (ContactList, ContactWizard, ContactProfilePage, Dashboard, DocumentCentre, AssetList, Settings). VendorOS: vendor-onboarding views, VendorMenuService, VendorActionController, Communications context service. Menus: Menu Manager (Menu, MenuItem) drives admin, ERP and vendor sidebars.
- CCC build pack: `foundation_os/CCC/ccc-foundationos-fos-ai-build/` (forms JSON, schemas, builder definitions, handovers, prototype).
- CCC and VendorOS prototype: `foundation_os/public/proto` (api.php, build.php, proto.sqlite, uploads) plus `public/lara-builder-prototype-v23`.
- Tests: `foundationos_testing` (762 KB file at foundation_os root, purpose UNVERIFIED), test DB migration order is broken.
- App is the full hybrid: native Laravel first, Filament and ERP kept intact (handover decision).

## 6 UI strategy

- Native `/admin` Blade/Livewire/Tailwind is the end-user surface (ADR-048). Filament panels (`/control-panel`, `/erp`) are kept and styled to match through the theme bridge plugin using the saved theme colour.
- FOS shell look: LaraDashboard Tailwind tokens (ADR-018), dark/light toggle shared, unified login, Menu Manager for hide and reorder, AppSuite page with category cards and "Presentation Standard" (ADR-053).
- foundation_os/docs/ui-guidelines.md is LaraDashboard's own guide ("LaraBoard project"), not FOS-specific.
- LaraBuilder (React) builds pages, email templates and process flows. Details in section 7.
- VendorOS mockup design system (05-VenderOS/MOCKUP_SRC): layer 1 operational workspaces (breadcrumb, header, KPI strip, tabs, one standard list, right drawer, full form when needed), layer 2 workflow engine (45-stage journey), 13 section SPAs, responsive rules (drawer under 900px, 375px mobile), status colours. One list renderer rule (R12).
- Separate UI projects, not FOS: Fluid_UI_KIT (design system kit with RULES.md, os-library) and liquid-glass-os (WebGL glass OS). Memory notes say kit cards default to the OS look, so they feed back to FOS visually, but they are not part of the app.

## 7 Form and page definition today (code vs schema)

| Thing | How defined today | JSON schema? |
|---|---|---|
| CCC registration wizard (10 steps in app, 13 in mockup) | PHP Livewire class ContactWizard (4435 lines) plus Blade partials with hard `wire:model` keys. Field visibility is stored in DB (`FosFieldVisibilityRule`), required documents in DB (`fos_required_documents`), custom fields in DB (`FosCustomField`). | No. Rules are DB rows, structure is code. |
| Vendor registration | Subclass of ContactWizard (RegisterCompanyWizard). | No. |
| CCC build pack forms (customer, vendor, partner, staff, other) | JSON files plus form.schema.json under foundation_os/CCC/.../forms and schemas. | Yes, but not wired to the live app (UNVERIFIED that any code loads them). |
| CMS pages, email templates | LaraBuilder `design_json` (block tree, 77 block types). | Yes. `public/schemas/design-json.schema.json` is auto-generated from block.json files by `php artisan lara-builder:generate-schema`. |
| Process Builder / job flow | LaraBuilder docs (JOB-PROCESS-ARCHITECTURE-PLAN, LARABUILDER-JOBFLOW-GUIDE, layout engine rules) and the VendorOS prototype island (resources/js/lara-builder/prototype). | Partial. Ported from VendorOS Process Builder v23. |
| FormFlow (single JSON schema for web, mobile, chat) | Specs only (SPECS/FORMFLOW.md, FORMFLOW_CHAT.md, PHASES/08_FORMFLOW.md, 04-FOUNDATIONOS/FORMS). | No FormFlow schema or renderer in app code (grep of app, routes, config found no FormFlow). |
| Job Wizard (28 stages) | A 5,300 line Filament page in plugins/webkul/sales. | No. |
| Mockup | Static HTML built from sections by build.js; data map and field dictionary in PRD/data/*.json. | Documentation JSON, not runtime. |

Answer: there is no general JSON schema for pages or forms in the running app. The only runtime schema is LaraBuilder design_json for content blocks. The planned FormFlow and the PRD data files (field_dictionary.json, mockup_data_map.json) are the best seeds for one. The memory rule to avoid hardcoding fields in Blade is currently violated by the wizard views.

## 8 Clutter and archive candidates

Nothing was moved. Candidates only.

| Where | What | Note |
|---|---|---|
| Repo root | 45 screenshot PNGs (canvas_*, liveview_*, jobflow_*, fos_*, row_menu_*, strip.png, etc., 1 Aug to 5 Oct) | Screenshots from testing. Archive or delete. |
| Repo root | Brand guidelines.png, Brand guidelines2.png, FOUNDATIONOS_BRAND_ASSETS_v1.zip plus the unpacked folder (git shows its files as deleted) | Move into one brand folder. |
| Repo root | `_cm.ps1`, `.playwright-mcp/` (deleted in git status), `.codex/`, `plugins/htdocs.lnk` | Tooling leftovers. |
| Repo root | `backups/` (4 SQL dumps, 12 MB, 22 to 23 Aug) | Keep but move out of repo, are they git ignored (UNVERIFIED). |
| Repo root | `_recovery-archive/` and `foundation_os/_recovery-archive/` (save-as copies, 12 KB) | Gitignored per handover. |
| Repo root | `liquid-glass-os/` and `Fluid_UI_KIT/` | Other UI projects. Each has its own HANDOVER and history backups. Should live outside FoundationOS. |
| foundation_os root | `__pw_explore.js`, `__repro.php`, `_fields.txt`, `_final.txt`, `_mobiletoggle.txt`, `_sidebarcss.txt`, `_sidebarscan.txt`, `debug-nav.cjs`, `debug-editor.png`, `nul`, `api.json` (157 KB), `foundationos_testing` (762 KB), `demo-screenshots/` | Debug scratch. Archive. |
| foundation_os root | Inherited LaraDashboard docs: CHANGELOG.md (21 KB), README.md (38 KB, modified), CONTRIBUTING, Coding-Standard, COMMIT_CONVENTION, SECURITY, `.junie`, `.idea`, `.husky` | Describe LaraDashboard, not FOS. |
| foundation_os/docs | agentic-cms, datatable, email-providers, hooks, lara-builder, notification-types, INBOUND_EMAIL_IMPLEMENTATION, module-development, ui-guidelines (all 16 Aug, inherited) | Keep as reference, label as inherited. |
| foundation_os/FoundationOS_DOCS | Contains only 03-AUDITS (30 Aug) | Likely a stray duplicate of the real folder. |
| FoundationOS_DOCS | Three zips (v3.64, strategy zip, plus 3 zips in Ai search), duplicate harvest stubs, 04-FOUNDATIONOS stubs, QUICKSTART files, SYNC-SUMMARY | Archive to a dated folder. |
| FoundationOS_DOCS/05-VenderOS | VeriphyVendorFlow.pdf 32 MB, old VendrOS_Admin_Home.html | Keep one copy. |
| Git | Two agent worktree branches, 20+ modified and many deleted files uncommitted on main | Commit or discard deliberately. |

## 9 Gaps and what to do next

1. Commit the uncommitted state on main (split into reviewable commits) and decide when the mockup branch merges. Confirm whether the mockup branch is really on origin (remote ref exists).
2. Write one new canonical handover (for example `FoundationOS_DOCS/HANDOVER_CURRENT.md`) and make `foundation_os/docs/handover_...V1.md` and APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md point to it. Remove the duplicate copy. Fix the empty "Project Status" heading and the "no CCC Settings editor yet" line.
3. Refresh AI memory: ACTIVE_PHASE.md, CURRENT_STATE.md, PROJECT_MEMORY.md, CHANGELOG.md. Today they send a new session to Phase 01 with Aureus as a mere donor.
4. Add the missing ADRs (ADR-055 onward): ERP plugins ported as canonical (21 Aug), shared DB and FOS owns schema, CCC as universal contact hub, VendorOS depends on CCC, Laravel-first AppSuite rule, mockup rebuild and 13-step wizard, CRM harvest not install, AppSuite packages (when decided).
5. Settle the contradictions in section 4: "not an ERP" wording, Filament role (harvest tool vs shipped panels), Webkul Partner permanence vs FOS owns DB, two module systems (nwidart vs fos_modules).
6. Decide the AppSuite package proposal (APPSUITE_PACKAGES.md). Then move CCC and VendorOS code from app/ into packages or document the exception to the core/module boundary in CLAUDE.md.
7. Decide the page and form definition strategy: one JSON schema (seed from FormFlow spec, PRD field_dictionary.json and CCC form.schema.json), and decide whether the wizard becomes schema-driven. Record it as an ADR.
8. Repair the test database migration order so feature tests can run again.
9. Resolve vendor document ownership (Media vs VendorDocument).
10. Archive the clutter in section 8 and move the two foreign UI projects out of the repo.
11. Fix dead links (QUICKSTART to TODAY-ADDITIONS and MERGE-NOTES, handover to CONTACT_BOOK_BUILD_PLAN.md) and rename 05-VenderOS only if links are updated at the same time.
12. Update LICENCES/THIRD_PARTY.md for packages added since 17 Aug.
