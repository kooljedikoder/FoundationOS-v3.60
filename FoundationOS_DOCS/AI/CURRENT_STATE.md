> SUPERSEDED BY HANDOVER_CURRENT.md (5 Oct 2026). This file describes the state on 17 Aug 2026 and no longer overrides other documents.

# Current State

**Last updated:** 2026-08-17 (late evening). **Read this file, then `AI/DECISIONS.md` in full, before
touching anything** — this section is a fast on-ramp; the rest of this file and every ADR in
`DECISIONS.md` is the detailed record. If anything below conflicts with an older doc (including
`001-ALWAYS-READ-FIRST-001-FOUNDATIONOS_MASTER_APPENDIX_DYNAMIC.md`'s own "Current Project Status"
section, `FOUNDATIONOS_MASTER.md`, or any `PHASES/*.md` file not explicitly reconciled), **this
file and `AI/DECISIONS.md` win** — they're the actively-maintained day-to-day record; the appendix
is updated only at a high level when something material changes, per its own Section 17.

## Start here — the 60-second version

- **The app is real and running**, not a plan: `foundation_os/` at repo root, a clone of
  LaraDashboard (Laravel 13, MIT), reachable at `http://localhost/FoundationOS/foundation_os/public/`.
- **Three panel surfaces exist and work today:**
  - **User** (public, no login) — `/` and `/contact`
  - **Admin + Superadmin** (Filament, one panel, role-gated) — `/control-panel` — has 7 canonical
    Core-entity screens (Organisation/Department/Location/Contact/Product/Service/Document) plus
    Contact Submissions
  - **Native Admin** (LaraDashboard's own pre-existing backend, untouched) — `/admin` — CMS, media,
    users/roles, its own module marketplace, settings, action logs
- **Login:** `superadmin@example.com` / `12345678` or `admin@example.com` / `password` (seeded).
  `DEMO_MODE` is currently `false` — no credentials shown on-screen.
- **Phases done: 00 (Environment), 01 (Audit), 02 (Core), 03 (Module Registry), 04 (Master Data /
  Filament screens), 05 (API Hub), 06 (Workspace — wired for real).** The 7 canonical Core entities
  are now reachable over Sanctum-authenticated `/api/v1` (`organisations`/`departments`/`locations`/
  `contacts`/`products`/`services`/`documents`), reusing LaraDashboard's own existing API stack
  rather than building a new one — see ADR-033. A `FosWorkspace`/`WorkspaceRegistry` pair (ADR-034)
  now actually gates visibility: all 8 core Filament Resources' `canViewAny()` and the `/api/v1`
  core-entity routes consult `WorkspaceRegistry::moduleEnabledForCurrentWorkspace()` alongside the
  global `ModuleRegistry` gate (ADR-035). `php artisan workspace:activate {slug}` switches which
  single workspace is active. A `ghost-app-demo` workspace is seeded (not active by default) that
  enables only `contact-form`, as a runnable proof of "a product picks its own module set" — live
  app is currently left on the real `foundationos` default (all modules visible). **AppBuffet is now
  visibly real, not just planned:** `/admin/modules` was relabelled "AppBuffet" and gained a third
  "FOS Modules" tab listing the FOS registry alongside LaraDashboard's native installed-modules and
  marketplace tabs (ADR-036). `laravel/socialite` (already installed) was registered as the first
  FOS-registry entry for a genuine third-party package, distinct from FoundationOS's own
  `contact-form`/`core-entities`/`activity-audit-log` modules. All three AppBuffet sources are now
  represented and verified: LaraDashboard native modules, a plain Laravel package (Socialite), and a
  genuine third-party Filament plugin (`filament/spatie-laravel-media-library-plugin` — already
  installed, already wired into `DocumentForm`'s file-upload field, now also registered in the FOS
  registry — ADR-037).
- **A real Procurement module now exists** (`procurement` FOS module, `type: filament-plugin`,
  depends on `core-entities`): Supplier (wraps `Organisation`, doesn't duplicate it), ProductSupplier,
  PurchaseRequisition (RFQ stage), PurchaseOrder + line-item repeater with live price/total
  calculation, and a StockMove ledger for inventory tracking. Warehouse deliberately reuses the
  existing `Location` model (`type = 'warehouse'`) — no separate Warehouse model. A "Receive goods"
  Filament action creates real `StockMove` rows and advances PO status (draft→sent→confirmed→
  partially_received→received) via `App\Services\Procurement\PurchaseOrderService`. Adapted (not
  copied) from Aureus's audited purchases/inventories plugins — Aureus's own classes pull in
  multi-tenant/multi-currency/full-WMS-routing machinery this MVP deliberately doesn't need; only the
  field/relationship *shapes* were carried over by hand. AP invoicing (Liberu's domain, blocked on its
  licence) remains deferred. See ADR-038. `/control-panel/purchase-orders` has one seeded demo PO
  (`PO-000001`) so it isn't empty on first load.
- **Procurement extended with Lot tracking, Package tracking, staged (multi-step) receiving, and
  multi-warehouse transfers** (ADR-039, operator explicitly requested all four after ADR-038's MVP
  deferred them). `Lot`/`Package`/`PackageType` are new models with their own Filament Resources.
  `StockMove` gained `lot_id`, `package_id`, `stage` (`goods_in`/`quality_check`/`stock`), and
  `move_group_id` columns — `stockOnHand()` only counts `stage = 'stock'` moves, so goods pending QC
  aren't treated as available. `App\Services\Procurement\StockMovementService` handles stage
  advancement (a "Advance stage" row action on `StockMoveResource`) and warehouse-to-warehouse
  transfers (a "Transfer stock" header action on the Stock list — creates paired `transfer_out`/
  `transfer_in` rows, not Aureus's single dual-location row, to fit the existing ledger design).
  Deliberately still not built: Aureus's generic Route/Rule graph-traversal engine (the concrete
  goods-in→QC→stock pipeline works without it) and `ProcurementGroup`/push-pull procurement logic.
- **Product and Service split into their own independent FOS modules** (ADR-040): `core-entities`
  now covers only Organisation/Department/Location/Contact/Document; `products` and `services` are
  separate manifests/seeders, each independently enable/disable-able (`ProductResource`/
  `ServiceResource` regated accordingly). `procurement`'s manifest dependency list updated to
  `["core-entities", "products"]` to match reality. **A real native-`/admin` consumer of the Core
  entities now exists**, not just a claim: `App\Http\Controllers\Backend\CoreEntityDirectoryController`
  queries `Organisation` directly and renders a plain Blade view at `/admin/core-entities/organisations`
  (new "Organisations (Core)" nav item), proving the 7 canonical entities work from native
  LaraDashboard code, no Filament required. `core-entities`'s manifest now uses the `native_admin`
  surface key — already part of `ModuleRegistry`'s schema, previously unused.
- **The Filament login screen (`/control-panel/login`) is unified with the native `/login` screen**
  (ADR-041): same "Sign In" heading/subheading copy, a matching two-column branded layout (reused
  `strong-foundation.webp` image + logo/tagline via a new `filament.auth-side-panel` renderHook,
  CSS-driven flex layout in `filament.auth-card-style`), the literal same locale-switcher Blade
  partial, a dark-mode toggle wired into Filament's own `theme-changed`/`$store.theme` mechanism
  (not a second, un-synced one), and matching demo-credentials iconography. New
  `App\Filament\Auth\Pages\Login` overrides heading/subheading/submit-button copy via Filament's own
  supported extension points. Honest limitation: sub-component chrome (input/button border-radius,
  padding) still comes from Filament's own CSS, not literally pixel-identical — everything else
  (layout, copy, icons, behavior) is. New standalone Vite entry `filament-auth-extras.js` loads only
  `iconify-icon` (deliberately not the full `app.js`, which would double up Livewire/Alpine and
  conflict with Filament's own instances — confirmed by reading `app.js`'s imports first).
- **A unified "Add Catalog Item" page** (`App\Filament\Pages\CreateCatalogItem`, new nav item under
  Core) toggles between Product and Service when creating a new item — Product reveals `size`/
  `colour` fields (new real `Product` columns via a migration), Service reveals `billing_type`
  instead, matching the operator's description. Built as a standalone Filament Page (not a merged
  Resource/table — Product and Service remain two separate models per ADR-040) since a Filament
  Resource binds to exactly one Eloquent model; on submit it creates a real row in the correct table.
  Existing `ProductResource`/`ServiceResource` are unchanged and still handle listing/editing.
- **A generic, reusable "Custom Fields" capability exists** (ADR-042): `App\Concerns\HasCustomFields`
  (one `customFields()` MorphMany relation) + `App\Filament\Support\CustomFieldsRepeater` (one
  reusable Filament Repeater component) let an operator add their own key/type/value field to any
  model with no migration — adapted from LaraDashboard's own Post-only `post_meta` pattern,
  generalised via a polymorphic `custom_field_values` table. Applied to `Product` and `Service`
  (superseding the same-session `attributes` JSON/KeyValue field from ADR-041, which is now dropped).
  Registered as its own FOS module (`custom-fields`) purely for AppBuffet visibility — not gated at
  runtime, since this is core extensibility infrastructure any model can use unconditionally. A real
  bug (Filament Repeater state dehydration silently keeping only the last of several same-named
  sibling components) was caught by a test and fixed by simplifying the value field to one
  `TextInput`.
- **Fixed a real bug**: native `/admin`'s sidebar "Logout" button 405'd every time (ADR-043) —
  `admin.logout.submit` redirected to the POST-only `logout` route, which the browser's GET-follow
  of that redirect could never satisfy. Now calls `LoginController::logout()` directly instead of
  redirecting to it. **Phase 07 (Themes) is next, not started.**
- **Architecture settled, not still being debated:** Laravel is the foundation, Filament is an
  add-on (ADR-011) — kept deliberately, *because* all three audited donors (Aureus/ERPKit/Liberu)
  are themselves Filament-built, so Filament is what makes donor harvesting fast, not slow. A
  Module Registry (`FosModule`/`ModuleRegistry`, ADR-023) tracks which panels a capability exposes
  itself to (the "FOS Contract", ADR-019) — its manifest schema was extended (ADR-032) to carry
  package identity, Laravel/Filament compatibility, permissions, capabilities, and licence, and now
  has a real `laravel-only` module (`activity-audit-log`) alongside the two `laravel-filament`/
  `filament-plugin` ones, proving the schema isn't Filament-only.
- **AppBuffet's actual plan** (confirmed with the operator 2026-08-17): **rebrand LaraDashboard's
  own existing native module marketplace** (`/admin/modules` — a real, working install/enable/
  activate UI already) as AppBuffet's front-end, rather than building a marketplace UI from
  scratch. The FOS Module Registry supplies the one piece LaraDashboard's system can't express on
  its own: which of the three panels a module's capability should surface in.
- **Known real gotcha:** an intermittent DB "Access denied for user 'forge'" error tied to Apache
  worker staleness, most often right after an `artisan optimize:clear`/cache command runs while
  Apache is live. Usually self-clears within a couple of seconds on retry; if it doesn't, fully
  restart Apache (`taskkill /F /IM httpd.exe` then `apache_start.bat`) — see ADR-029/031.
- **Verification discipline that matters:** unauthenticated `curl` status checks do **not** catch
  bugs that only fire for a logged-in user (ADR-027), and confirming a `<style>`/`<script>` tag
  *rendered* is not the same as confirming it targets something real (ADR-028) — both were real
  mistakes made and caught in this session. Verify against an authenticated request and against the
  actual rendered DOM/class names, not just "did the response come back."

## Full chronological detail follows below (older entries first)

## Starting base: LaraDashboard (supersedes earlier Aureus-as-base decision)

- **`foundation_os/`** (repo root, sibling to `FoundationOS_DOCS/`) is a real clone of
  `laradashboard/laradashboard` @ commit `9dc1335835701651aef3adcb3e885acecb32402c`, MIT licensed.
  Not a bare Laravel scaffold, not Aureus — LaraDashboard is the actual running application base,
  per ADR-011/ADR-012 (see `AI/DECISIONS.md`) and the operator's confirmed direction.
- It already provides: Laravel 13, Livewire 4, Tailwind v4, Spatie permissions/media, a CMS
  (posts/taxonomies/menus), Laravel Boost pre-wired (`.mcp.json` present out of the box), Pulse,
  Telescope, Sanctum, Socialite, a strict **Core/Module boundary convention** (documented in its own
  `CLAUDE.md`: core code must never reference a module; modules may depend on core).
- **Filament 5** is layered in as an add-on/tool per the hybrid principle, not the foundation.
  (Not yet re-added to this specific LaraDashboard-based app as of this update — was installed on
  the now-discarded bare-Laravel scaffold; needs re-adding here.)
- Aureus, ERPKit, Liberu remain valid **capability donors to audit and harvest from later**, not
  installed into the app. Their source is preserved read-only under `01-SOURCES/` (currently as
  stub READMEs only — the actual cloned donor trees were lost in the 2026-08-16 folder reorg and
  would need re-cloning if/when a real audit needs the full source, same as LaraDashboard was
  just re-cloned).

## Database

- MariaDB `foundationos` — dropped and recreated clean, then migrated with LaraDashboard's own
  migration set (fixed one MariaDB-compatibility bug along the way, see ADR-013) and seeded with
  its default `UserSeeder`/`SettingsSeeder`/`ContentSeeder`/etc.
- Default seeded logins (LaraDashboard's own demo seeder — **rotate before anything public-facing**):
  - Superadmin: `superadmin@example.com` / `12345678`
  - Admin: `admin@example.com` / `password`
  - Subscriber: `subscriber@example.com` / `password`

## Local environment

- URL: `http://localhost/FoundationOS/foundation_os/public` — XAMPP serves `htdocs/` subfolders
  directly, no Apache alias needed (same pattern as the working `htdocs/24hrsIN` project).
- No RoadRunner/Octane — Phase 1 production target is Hostinger shared hosting, which can't run
  persistent processes (see ADR-009). Local dev matches: plain `php artisan serve` or Apache/mod_php.
- Laravel Boost MCP: `.mcp.json` present (shipped by LaraDashboard itself), points at
  `php ./artisan boost:mcp` — not yet verified reachable inside a live Claude Code session rooted
  at `foundation_os/`.

## Visual/UI stack (2026-08-16)

TailAdmin Laravel (primary template), Preline + Flowbite (component donors), Mosaic Lite Laravel
(secondary reference only — **licence prohibits redistribution**, inspiration only), LaraDashboard
(now also the architecture base, not just an architecture-research donor as originally scoped).
See `SPECS/VISUAL_STACK_SELECTION.md`, `AI/VISUAL_STACK_RULES.md`.

## Three-panel UI vision

User (Blade/Livewire) / Admin (hybrid FOS UI + Laravel + selected Filament) / Superadmin
(primarily Filament) — all sharing one FOS design-system/theme engine with a theme switcher, per
`001-ALWAYS-READ-FIRST-001-FOUNDATIONOS_MASTER_APPENDIX_DYNAMIC.md` §3-4. The theme-switcher-across-
Filament-panels mechanism is an acknowledged open technical problem, not yet solved — first real
UI/theme engineering task once UI work starts.

## AppBuffet / plugin manager

Pipeline and manifest field list are defined (`APPBUFFET-SPEC.md`, appendix §9) but there is no
schema, marketplace UI, or versioning/rollback mechanics yet — deliberately last in the build
order, after a working Module Registry. Design work on its schema can start early in parallel with
core, but the marketplace itself is not a near-term build target.

## Doc reconciliation (2026-08-17)

The stale references flagged above are now fixed: `PHASES/01_AUDIT.md`, `PHASES/03_MODULE_ENGINE.md`,
`PHASES/07_THEMES.md`, `PHASES/09_TASKS_CALENDAR_WORKFLOW.md`, `PHASES/13_APPLICATIONS.md`,
`FOUNDATIONOS_MASTER.md`, and `AI/PROJECT_MEMORY.md` all now reflect: LaraDashboard as the starting
base (Aureus/ERPKit/Liberu as donors to audit), the 4-product roster (SERVA/VendorOS/COMSHUB/
Report2HQ), and the corrected UI framing — TailAdmin Laravel primary, TallStackUI **kept** but
narrowed to Filament-side TALL-stack components specifically (not dropped, not a general frontend
template). See `AI/DECISIONS.md` ADR-003 (updated note) and ADR-009/ADR-011.

## Git

Local commits only (reorg into `FoundationOS_DOCS/` + clean baseline, then LaraDashboard-base swap
pending its own commit). **Not pushed to any remote** — confirm with operator before pushing.

## Update 2026-08-17: Filament re-added, three-panel URL map now real

- **Filament 5 installed** on the LaraDashboard base (`composer require filament/filament:^5.0`),
  no dependency conflicts with LaraDashboard's own packages.
- **Real routing collision found and resolved:** LaraDashboard already has its own native `/admin`
  backend (Livewire/Blade, own login/menus/media/action-log/AI-command routes via
  `app/Providers/AdminRoutingServiceProvider.php`) — not empty scaffolding, a real working system.
  Installing Filament at the default `->path('admin')` collided with it directly
  (`admin.login` vs `filament.admin.auth.login`). Resolved by moving Filament to `/superadmin`
  (renamed `AdminPanelProvider` → `SuperadminPanelProvider`, `id('superadmin')`,
  `path('superadmin')`, updated registration in `config/app.php`).
- **This resolution maps directly onto the three-panel vision** (`AI/DECISIONS.md` ADR-011):
  - **User** — LaraDashboard's public-facing frontend (Blade/Livewire), root `/`.
  - **Admin** — LaraDashboard's own native `/admin` backend (hybrid FOS UI + Laravel), already
    built and working, not something to build from scratch.
  - **Superadmin** — Filament, now at `/superadmin`.
  - `/admin/login` intentionally redirects to a unified `/login` (LaraDashboard's own existing
    design, not something we introduced) — confirmed correct, not a bug.
- **Verified all three surfaces boot:** `/` → 302, `/login` → 200, `/admin` → 302 (auth redirect,
  expected), `/superadmin/login` → 200.
- **Laravel Boost:** `boost:mcp` artisan command confirmed registered and runs; `.mcp.json` (shipped
  by LaraDashboard itself) correctly points at it. Full "reachable from a live Claude Code session"
  verification still requires opening an actual session rooted at `foundation_os/` — not fully
  testable from a tool-only session.

## Update 2026-08-17 (later): Admin+Superadmin collapsed into one Filament panel

Per operator direction (explicit "not coding 3 times" goal), ADR-014's two-panel split was
superseded by ADR-015: `/superadmin` renamed to `/control-panel`, now serving **both** Admin and
Superadmin roles (gated by `User::canAccessPanel()` — role check against Spatie roles
`Superadmin`/`Admin`). LaraDashboard's native `/admin` is fully retained and untouched — this is
additive, not a migration. Current panel map:

- **User** — `/` (LaraDashboard's public frontend, Blade/Livewire)
- **Admin + Superadmin** — `/control-panel` (Filament, one panel, role/permission-gated) — new
  modules target this going forward
- **LaraDashboard native admin** — `/admin` — still fully live, not being replaced, just no
  longer the mandatory build target for new shared modules

**Cross-panel reuse principle recorded for future module work (see ADR-015):** build a module's
Form/Table Schema as a standalone shared PHP class, consumed by both a Filament Resource and a
thin Livewire wrapper for User-facing use — write the field/validation/column logic once, only the
surrounding page chrome differs per panel. Not yet implemented on any real module.

## Update 2026-08-17 (later still): first real module built — contact form, cross-panel proof

Built per ADR-016/ADR-017: shared `ContactFormSchema` consumed by both `App\Livewire\ContactForm`
(User, `/contact`) and the generated `ContactSubmissionResource` (Admin+Superadmin,
`/control-panel/contact-submissions`) — one field definition, two thin panel wrappers, exactly as
designed. Also wired a real public homepage (`/`, `Frontend\HomeController`) — previously the User
panel had no reachable page at all.

**Found and fixed a real bug along the way:** LaraDashboard's `AppServiceProvider::boot()`
force-redirects `/` to `/admin` by default (a Service-Provider-level `exit`, invisible to
middleware debugging). Fixed via the hook system's own override point
(`Hook::addFilter(AdminFilterHook::ADMIN_SITE_ONLY, fn () => false)`), not a workaround — see
ADR-017 for the full trace. Also removed a redundant, double-rewriting `foundation_os/.htaccess`.

Current panel map, all verified working:
- **User** — `/` (homepage), `/contact` (shared-schema form) — Blade/Livewire
- **Admin + Superadmin** — `/control-panel` (Filament, role-gated) — includes
  `/control-panel/contact-submissions` viewing what User submitted
- **LaraDashboard native admin** — `/admin` — untouched

## Update 2026-08-17 (Theme Engine started): shared tokens now real, not aspirational

Discovered LaraDashboard's native admin already has a complete Tailwind v4 token system
(`resources/css/base.css`) that the User-facing pages were never actually using (they were built
on an unrelated, unused Bootstrap scaffold). Fixed: new `layouts/public.blade.php` loads the same
compiled `app.css` as native Admin; User pages + the contact form now use real token classes
(`btn-primary`, `text-primary`, `text-success-700`, etc.); Filament's `ControlPanelProvider`
primary color changed from placeholder Amber to the exact `--color-brand-*` hex scale. See
ADR-018. **Still open:** dark-mode parity and an actual theme-switcher UI (FOS Modern/Classic/
Compact/Dark) — this is the token *foundation*, not the switcher.

## Update 2026-08-17 (theme switcher): real dark-mode toggle on User pages, shared with native Admin

`layouts/public.blade.php` now has a working dark-mode toggle using the **exact same** Alpine +
localStorage mechanism as LaraDashboard's native Admin layout — same `darkMode` localStorage key,
same origin, so the preference genuinely carries across User and native Admin automatically, no
custom sync code needed. Filament's `->darkMode()`/`->themeSwitcher()` made explicit on
`ControlPanelProvider` (was implicit default). **Not yet synced:** Filament's own toggle uses a
different internal persistence mechanism than the shared `darkMode` key — three real working
toggles exist, but Filament's isn't yet wired to match the other two's shared state. See ADR-020.

Also confirmed via the FOS Contract discussion (ADR-019): LaraDashboard's native `/admin` is
**permanently preserved**, not a migration target — "hybrid" for the Admin surface means either/
both LaraDashboard-native or Filament, module by module, operator's explicit call.

## Update 2026-08-17 (Phase 01 — Audit — done)

Aureus, ERPKit v5, and Liberu Accounting re-cloned into `01-SOURCES/` (real source now present,
not stub READMEs), each with a real `.donor-provenance.md`. Full findings:
`FoundationOS_DOCS/03-AUDITS/FOUNDATIONOS_INITIAL_AUDIT.md`. See ADR-021 for the summary.

**Headline result:** Aureus (MIT, no red flags, matches stack exactly, best-tested) can serve as
the ERP spine — inventory/manufacturing/sales/purchases/HR/projects/support all present as
coherent, tested modules. Liberu supplies the deep accounting/finance layer Aureus lacks, but has
a **licence red flag** (claimed MIT, actual LICENSE file missing from the import — do not harvest
until resolved) and requires PHP `^8.5` (stricter than this project's 8.3+ floor). ERPKit
contributes shell-pattern ideas only — its real business logic is an external, unreviewed
dependency. **No strong CRM donor found among the three** — needs a dedicated search or fresh build.

Phase 01 is complete.

## Update 2026-08-17 (Phase 02 — Core — done)

Created the seven missing canonical entities (only `User` existed before): **Organisation,
Department, Location, Contact, Product, Service, Document**. Full detail in ADR-022. 10/10 tests
passing (`tests/Feature/Core/CanonicalEntitiesTest.php`). Fixed a real bug along the way in the
shared `App\Concerns\HasMedia` trait (wrong `Media` type-hint on `registerMediaConversions()` —
same fix `Post.php` already applied, now also on `Document`). All three panel surfaces verified
still booting after migration.

**Phase 02 is complete.**

## Update 2026-08-17 (Phase 03 — Module Registry — done)

Built the FOS Module Registry, formalizing ADR-019's FOS Contract into real code. Full detail in
`AI/DECISIONS.md` ADR-023. Summary:

- **`foundation_module.json` manifest schema** — `name`/`slug`/`version`/`provider`/`description`
  required, plus optional `dependencies`, `permissions`, `navigation`, `migrations`, `settings`,
  `translations`, `tests`, and a `surfaces` object keyed by the three FOS Contract surfaces
  (`user`, `filament`, `native_admin`), each declaring an `entry_point` class.
- **`App\Models\FosModule`** (new `fos_modules` table: `slug` unique, `name`, `version`,
  `provider`, `description`, `is_enabled`, `installed_at`, `dependencies` JSON, `manifest` JSON) —
  named `FosModule`, not `Module`, specifically to avoid colliding with LaraDashboard's own
  existing `App\Models\Module` (a non-Eloquent, filesystem-backed class for its `nwidart/laravel-
  modules` system). The two systems coexist untouched — `modules_statuses.json` and
  `Modules/*` package management are unaffected.
- **`App\Services\Modules\ModuleRegistry`** — `discover()`, `validate()`, `register()`/
  `registerAll()`, `enable()`/`disable()`, and the gate method `isEnabled(string $slug): bool`
  (fails closed for unknown slugs and before the `fos_modules` table exists — this guards a real
  bootstrap chicken-and-egg bug found while building it: route registration runs on every artisan
  bootstrap, including `migrate` itself).
- **Contact form retrofitted as the first real module**: `fos-modules/contact-form/
  foundation_module.json` declares its `user` (`App\Livewire\ContactForm`) and `filament`
  (`ContactSubmissionResource`) surfaces. `database/seeders/FosModuleSeeder.php` registers + enables
  it (added to `DatabaseSeeder`). **Two real gates prove this is load-bearing:**
  `routes/web.php`'s `/contact` route only registers `if (isEnabled('contact-form'))`, and
  `ContactSubmissionResource::canViewAny()` checks the same flag.
- **Tests:** `tests/Feature/Modules/ModuleRegistryTest.php` (9 tests — manifest validation in both
  directions, registration, enable/disable toggling) + `tests/Feature/Modules/
  ContactFormModuleGateTest.php` (2 tests — the registry gate and the Resource's `canViewAny()`
  both flip with the DB row). 11/11 passing.
- **Verified:** `/` → 200, `/contact` → 200, `/control-panel/login` → 200, `/admin` → 302 (expected
  auth redirect) — all four surfaces still respond correctly. Full non-browser test suite run
  alongside the new tests, no regressions (pre-existing `tests/Browser/*` suite requires Playwright,
  unrelated to this work, not run).
- **Deliberately left as follow-up** (see ADR-023 for full detail): no dependency-graph/cycle
  resolution beyond "does the slug exist," no enable/disable UI (console/service-call only), no
  Upgrade/Uninstall/Rollback lifecycle stages, and route-registration-time gating rebuilds only on
  a fresh route list (not yet paired with a `route:cache` clear on toggle).

**Phase 03 is complete.**

## Update 2026-08-17 (Phase 04 — Master Data — done)

Built real Filament Resources for all seven canonical Core entities (Organisation, Department,
Location, Contact, Product, Service, Document) under `/control-panel` — closing the actual gap
Phase 04 needed to close (the original "resolve duplicate entities" framing didn't apply yet, since
no donor harvesting has happened). Full detail in `AI/DECISIONS.md` ADR-024. Summary:

- **Seven real Resources**, each following the `Resource/Pages/Schemas/Tables` convention
  `ContactSubmissionResource` established (ADR-017) — real fields wired per entity (Organisation:
  name/code/email/phone/is_active + related-record counts; Department: name/code/organisation
  select/self-referential parent select/is_active; Location: name/type select/organisation
  select/full address/is_active; Contact: type-driven reactive person-vs-company fields/email/
  phone/organisation/is_active; Product: name/sku/description/money-formatted price/is_active;
  Service: name/code/description/price/billing_type select/is_active; Document: title/description/
  type select/uploaded_by select + a real `SpatieMediaLibraryFileUpload` field, polymorphic
  `documentable` owner shown read-only rather than an editable picker).
- **New dependency**: `filament/spatie-laravel-media-library-plugin:^5.0` — no existing Filament
  file-upload precedent existed in this app to copy (`Post` has media but no Filament resource).
- All seven grouped under one `navigationGroup = 'Core'`, sorted 1–7.
- **Authorization**: no new scheme — each Resource's `canViewAny()` checks
  `ModuleRegistry::isEnabled('core-entities')`, same gate pattern `ContactSubmissionResource` set
  in Phase 03, on top of the existing panel-level `canAccessPanel()` role check (ADR-015).
- **FOS module registration**: one combined manifest, `fos-modules/core-entities/
  foundation_module.json` (not seven) — these entities are one cohesive foundational data model
  (ADR-022), not independently-togglable features, so one registry row/switch matches how they're
  actually used. `database/seeders/CoreEntitiesModuleSeeder.php` registers + enables it, added to
  `DatabaseSeeder`.
- **Tests**: `tests/Feature/Filament/CoreEntityResourcesTest.php`, 9/9 passing (13 assertions) —
  all seven index pages load for an authenticated Admin, plus a full Organisation
  create-form-to-database round trip. `tests/Feature/Core` + `tests/Feature/Modules` re-run
  alongside (30/30 passing) — no regressions.
- **Verified**: `/` → 200, `/contact` → 200, `/control-panel/login` → 200, `/admin` → 302 (expected)
  — all four surfaces still respond correctly after the change.
- **Left as follow-up** (see ADR-024 for full list): Document's polymorphic owner is read-only
  display, not an editable picker; no per-Resource Spatie-permission policies (module gate + panel
  role check only); no relation managers (Organisation's children shown as counts, not inline
  tables); Department/Location have no dedicated View page (Organisation/Contact/Product/Service/
  Document do).

**Phase 04 is complete.**

## Next

1. **Phase 05 (API Hub)** is next per the existing roadmap order — the seven canonical entities now
   have both a data layer (Phase 02) and an Admin/Superadmin UI (Phase 04), which is a reasonable
   prerequisite for exposing them over an API (Sanctum is already a confirmed dependency, ADR-004).
   Alternative: a small AppBuffet enable/disable UI is also unblocked (Phase 03's Module Registry
   now has two real registered modules to manage) but is lower priority than API Hub per the
   existing phase ordering; flagged as a parallelizable side task, not the main recommendation.
2. Resolve the Liberu licence gap (fetch/verify the actual upstream LICENSE file) before any
   future phase touches its code.
3. Verify Boost MCP reachability the first time a live Claude Code session opens `foundation_os/`.
4. Document's polymorphic-owner picker, per-Resource authorization policies, and relation managers
   (ADR-024's follow-up list) — small, well-scoped tasks for whenever a real caller needs them.

## Update 2026-08-17 (later still): dark/light consistency, login-style unification, password strength

Three fixes/additions, all verified across all six surfaces (`/`, `/login`, `/register`, `/contact`,
`/control-panel/login`, `/admin`) — see ADR-026 for full detail:
- Fixed a real dark/light default mismatch (Filament followed OS `prefers-color-scheme`, User/native
  Admin always defaulted light) — Filament now matches the other two (light by default everywhere).
- Filament's login/register/reset pages now visually match `/login`'s card styling, via a scoped CSS
  render hook — Filament's own dashboard/Resource UI is untouched.
- Added a live password-strength checklist (8+ chars, upper/lower/number/symbol, 5-segment strength
  bar) as an opt-in prop on the shared password-input component, enabled on registration and both
  password-reset views.

Also: fixed two real bugs found via live testing (not just curl status checks):
- `Filament\FilamentManager::getUserName()` TypeError on every authenticated Filament page load
  (User model missing the `HasName` contract) — see ADR-027. Added a real authenticated smoke test
  that would have caught this from day one.
- ADR-026's Filament auth-card CSS restyle was silently targeting a class that doesn't exist in
  Filament 5's DOM (`.fi-simple-main-card` vs the real `.fi-simple-main`) — fixed in ADR-028.

**The "forge"/production DB error recurred** (previously logged as "self-resolved" — it wasn't,
different Apache worker threads were hitting it intermittently) and caused the operator's `/admin/
login` 500. Root cause: Apache's `httpd.exe` had been running continuously since 2026-08-15,
across this entire session's `.env`/base-path changes — some worker threads apparently retained
stale process-level state no `artisan config:clear` could reach. **Fixed by fully restarting
Apache** (`taskkill /F /IM httpd.exe` + `apache_start.bat`), not a code change. See ADR-029 for
full detail, including the caveat that the exact mechanism wasn't 100% pinned down. **If DB/env
errors recur, restart Apache fully before assuming it's a new bug.**

**Phase 04 is complete; ADR-025-029 are polish/bugfixes on top of it, not a new phase.** Phase 05
(API Hub) remains next per the roadmap.

## Update 2026-08-17 (later still): Module Registry manifest schema extended, first `laravel-only` module

Per an operator-reviewed refined architecture proposal (found to be mostly already true — schema
extension, not a rewrite), extended the FOS manifest schema and proved a module type with zero
Filament/User footprint. Full detail in `AI/DECISIONS.md` ADR-032. Summary:

- **Manifest schema** now also requires `package`, `type` (`laravel-only`/`laravel-filament`/
  `filament-plugin`/`fos-native`), `compatibility` (`laravel`/`filament` version-constraint
  strings — presence/shape checked, not real semver parsing), `permissions`, `capabilities`,
  `migrations`, `licence`. New fields live inside the existing `manifest` JSON column on
  `fos_modules` — no new DB columns/migration needed.
- **Retrofitted both existing manifests** (`contact-form` → `laravel-filament`, `core-entities` →
  `filament-plugin`, since it has no `user` surface) so they still validate under the stricter
  schema.
- **New module: `activity-audit-log`** (`type: laravel-only`, no `surfaces.filament`/`.user` at
  all). Writes a `ModuleActivityLog` row whenever any canonical Core entity is created, via an
  observer attached to all seven models in `AppServiceProvider::boot()` but gated at call time by
  `ModuleRegistry::isEnabled('activity-audit-log')` — proves the registry gates real background
  behavior, not just a UI's visibility. **Seeded into the real dev database directly** (not just
  the seeder existing — this is exactly the mistake ADR-031 fixed for `core-entities`), confirmed
  via a direct DB query.
- **Real bug caught mid-build:** the observer registration was first placed after
  `AppServiceProvider::boot()`'s pre-existing `runningUnitTests()` early-return, so it silently
  never ran under the test harness even though it worked correctly via `tinker` against the real
  DB — moved above the early-return, caught by a temporary debug probe, not by assumption.
- **NATIVE vs EXTERNAL future consideration documented** (not built) in
  `FoundationOS_DOCS/04-FOUNDATIONOS/APPBUFFET/APPBUFFET-SPEC.md` — a placeholder for a future
  iframe/API/SSO-embed module type for genuinely third-party apps, explicitly not implemented.
- **Tests:** `ModuleRegistryTest` extended to 16 tests (7 new — missing new required fields fail,
  empty-array fields still pass, invalid `type` fails, `laravel-only` with/without a `filament`
  surface pass/fail correctly). New `ActivityAuditLogModuleGateTest` (3 tests — disabled/enabled/
  re-disabled). **51/51 passing** across `tests/Feature/Core tests/Feature/Modules
  tests/Feature/Filament`.
- **Verified:** `/` → 200, `/contact` → 200, `/control-panel/login` → 200, `/admin` → 302
  (expected) — all four surfaces re-checked. `vendor/bin/pint --dirty` run clean.
- **Left as follow-up:** no real semver-constraint validation for `compatibility`; type/surfaces
  consistency check only covers `laravel-only`/`laravel-filament`, not `filament-plugin`/
  `fos-native`; `capabilities` is free-text with no search/discovery UI wired to it yet; the new
  audit-log module has no viewing UI anywhere (deliberate — that's a separate future module).

## Next (updated after ADR-032 — supersedes the "Next" list above)

1. **Phase 05 (API Hub)** remains next per the roadmap — unchanged by this update.
2. A small AppBuffet enable/disable UI is unblocked (three real registered modules to manage now:
   `contact-form`, `core-entities`, `activity-audit-log`) but still lower priority than API Hub.
3. Resolve the Liberu licence gap before any future phase touches its code.
4. Document's polymorphic-owner picker, per-Resource authorization policies, relation managers
   (ADR-024 follow-up), and full semver-constraint validation on `compatibility` (ADR-032
   follow-up) — all small, well-scoped, for whenever a real caller needs them.

**Note:** entries below this point were not appended chronologically for every change between
ADR-032 (2026-08-17) and ADR-044 (2026-08-19) — Phase 05/06, the Procurement module (ADR-038/039),
Product/Service split (ADR-040), login unification + Custom Fields (ADR-041/042), and the logout fix
(ADR-043) all happened in that gap and are fully documented in `AI/DECISIONS.md`, just not mirrored
here. Treat `AI/DECISIONS.md` as authoritative for that period; this file resumes below.

## Update 2026-08-19: AppBuffet "FOS Modules" tab is no longer read-only — self-service zip install (ADR-044)

- The gap flagged in ADR-036 (the FOS Modules tab lists registered modules but has no install/
  enable/disable/remove UI) is closed. A new **`App\Services\Modules\FosModuleInstallService`**
  lets an admin upload a zip on `/admin/modules?tab=fos` and have it install itself — "prep files
  locally, upload the zip, PHP does the rest" — mirroring the existing native-module installer
  (`ModuleService::uploadModule()`) rather than inventing a second pattern.
- Two zip shapes are supported: a **FOS-native module** (code under `app/`, no Composer step needed
  at all — `App\` is already autoloaded) and a **third-party package** (its own PSR-4 namespace,
  registered live via `addPsr4()` and persisted to `fos-modules/autoload-map.php`, which
  `AppServiceProvider` replays every request — durable without ever running a live
  `composer dump-autoload`, which isn't available on Hostinger shared hosting).
- New modules install **disabled by default**; enabling runs exactly the migrations the manifest
  recorded copying in (`migrate --path=...`), not a blanket `migrate`.
- `tests/Feature/Modules/FosModuleZipInstallTest.php` (3 tests, real zip fixtures, real HTTP routes)
  — **47/47 passing** across `tests/Feature/Modules`. `vendor/bin/pint` clean.
- VendorOS Core (the vendor lifecycle/compliance/document-verification layer discussed alongside
  this in the same planning pass) is documented in the plan but **not yet started**.
