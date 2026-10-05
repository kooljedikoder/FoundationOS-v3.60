# Job Wizard — Handover (updated 2026-09-19, second pass)

**Location:** `foundation_os/plugins/webkul/sales/src/Filament/Clusters/Orders/Pages/JobWizard.php` (~5,300+ lines), view at `foundation_os/plugins/webkul/sales/resources/views/filament/clusters/orders/pages/job-wizard.blade.php`.
**Access:** `/erp/sale/orders/job-wizard` (Filament `Orders` cluster).
**Sync rule (critical):** every edit under `plugins/webkul/*` must be copied byte-for-byte to the matching `vendor/webkul/*` path and diff-verified. Filament resolves classes/views from `vendor/`, not `plugins/`. `composer update` does **not** reliably do this — see `feedback_plugin_vendor_sync_gotcha` in project memory.

## What this is

A real, 28-stage wizard walking one job from Customer Enquiry through Review Performance, using real Eloquent models at every stage (no mock data in the working flow — "Load Demo Data" persists a full real chain, it doesn't fake it). Each stage has a `stages()` entry (JobWizard.php:299) and its own Livewire property/form/save method group.

## Status: all 28 stages wired

**Originally wired (earlier session work):** Customer & Enquiry, Job Estimation, Quotation, Confirm Order, Deposit, Production Authorisation, Required Materials, Available Stock+Shortage, Confirm Material Plan, Inventory Reservation, Purchase Request+RFQ, Budget Approval, Purchase Order, Supplier Status, Goods Received, Goods Issued, Production Tracking, Quality Inspection, Repacking, Finished Goods, Delivery Note, Dispatch, Installation, Customer Acceptance, Invoice, Payment, Close Job, Review Performance.

**Stage-level Decision Cards added this session (2026-09-19):** 14 of the 28 stages had no Approve/Reject/Hold sign-off at all until today — Confirm Order, Deposit, Required Materials, Available Stock+Shortage, Inventory Reservation, Purchase Request+RFQ, Purchase Order, Supplier Status, Goods Received, Goods Issued, Production Tracking, Delivery Note, Invoice, Payment. Each now has its own small dedicated "gate" table (`sales_job_<stage>_gates`), model, and Draft/Approved/Rejected/Hold enum, following the exact pattern already used by the pre-existing `JobBudgetApproval`. Advancing past any of these 14 stages now requires that stage's Decision Card to be Approved, same as the other 14 already did.

## Production log detail (step: Production Tracking)

`sales_job_production_logs` extended with `machine_used`, `job_name`, `job_specification`, `reel_size`, `cartons_produced` (the qty field is labelled "Qty of Rolls Produced"), matching a real production-floor paper log sheet the operator supplied. Multiple repeater rows per shift is the real stop/start mechanism — not a separate state machine.

A **global, cross-job Production Tracking resource** also exists now: `Webkul\Sale\Filament\Clusters\Orders\Resources\ProductionLogResource` (`/erp/sale/orders/production-logs`) — same `JobProductionLog` rows, a second entry point so a floor supervisor can see/log against every job's production at once, not just from inside one job's wizard.

## Standalone-resource gating

`JobEstimationResource` and `ProductionLogResource` now block create/edit unless the job's required prior stage is Approved (`JobEstimationResource` needs its linked `JobEnquiry` Approved; `ProductionLogResource` needs that job's Production Authorisation Approved). Shared logic lives in `Webkul\Sale\Filament\Concerns\GatesOnPriorJobStage` — a Filament notification explains what's pending and links back into the wizard. **Not gated:** Purchase Order/Requisition — their models have no FK back to a Sales Job (most real POs are unrelated to any job), so gating them would incorrectly block ordinary purchasing. This is a real, flagged architecture gap, not an oversight.

## Row-level decision pattern — the canonical standard (final shape)

This went through several iterations this session before settling. The pattern below is the one to copy for any future table needing per-row view/edit/decide — do not resurrect the earlier kebab-pane or 2×2-grid attempts described further down as "superseded."

**Trigger:** one round icon button per row, `heroicon-o-ellipsis-vertical` (plain vertical dots, not the outline-circle/badge-swap variant tried earlier), with a persistent **tinted round background** — light blue at rest (Draft/no status), green/red/amber when Approved/Rejected/Hold. Shared via `Webkul\Sale\Filament\Concerns\HasRowIconTint::rowIconTintStyle()`. Pinned at **both the start and end** of every row (shared vendor template renders it twice, same action, so it's reachable regardless of horizontal scroll position) — see "Sticky action columns" below.

**Modal:** heading is title (left) + a colored status pill (right), via the shared partial `sales::filament.components.row-details-modal-heading` — same 4-color palette as the Decision Card. **Pass the `View` object directly to `->modalHeading()`, never `->render()`'d into a string** — a plain string gets HTML-escaped by Blade's `{{ }}`, a `View` (implements `Htmlable`) does not. This was a real, three-times-reported bug this session; verified fixed at every layer (source file, the actual autoloaded `vendor/` copy, `e()` behavior, and Filament's own modal template) — if it's ever reported again, suspect browser/session cache before touching the code again.

Body is `Tabs::make(...)->tabs([Tab::make('Details'), Tab::make('Edit')])` — **both tabs render the exact same field array**, built once as `xFields(bool $editable)`, with every genuinely-editable field `->disabled(! $editable)`. Details is NOT a separate set of read-only `Placeholder`s — that was the first draft and got replaced because it didn't look/feel like a real form. Purely computed/derived values (Qty Outstanding, Subtotal, stock-shortage math) stay `Placeholder`s in both tabs since they're never editable either way.

**Footer — 6 buttons, 2 clean rows, forced via CSS not luck:**
- Row 1: **Approve** (`#16a34a` solid, white icon+label) / **Reject** (`#dc2626`) / **Hold** (`#d97706`).
- Row 2: **Save** (`var(--color-primary)`) / **Delete row…** (`#dc2626`) / **Cancel** (left unstyled/neutral — deliberately the one button that doesn't compete for attention).
- Shared via `Webkul\Sale\Filament\Concerns\HasDecisionButtonStyle::decisionButtonStyle($color, $order)` — sets solid bg + `color:#fff !important` (so the icon, which inherits via `currentColor`, goes white too) + CSS `order` + `flex:0 0 31%`. The `order`/`flex-basis` combo is what forces an exact 3-per-row wrap inside Filament's own `.fi-modal-footer-actions` (a real `flex-wrap` container) regardless of viewport width — without it, Filament's natural DOM order (Save first, then extra actions, then Cancel) wraps unevenly (4-then-2).
- **Approve and Reject both require confirmation** (`->requiresConfirmation()`) — a real decision, not a casual click, matching the discipline Delete already had. Row-level Decision Card's own Approve/Reject (see below) got the equivalent treatment via a themed Alpine overlay since those are plain `wire:click` buttons, not Filament Actions.
- "Delete row" semantics differ **by table**, and this is intentional: for Required Materials / Available Stock / Purchase Order, it resets that line's review status back to Draft — it does **not** touch the real `JobEstimationLine`/PO line. For Job Enquiry Lines (no status concept at all), it genuinely removes the line from the repeater. For Supplier Status, it acts on that row's own real record.

Built on **5 tables**, all sharing the pattern above:
- **Supplier Status → "Supplier Shipments"** (`JobSupplierStatus`, table `sales_job_supplier_statuses`): columns Supplier / PO Ref / Received Via / ETA-Delivered / Waybill-Invoice No / Qty Ordered / Qty Supplied. New `received_via`, `eta_date`, `delivered_date`, `waybill_or_invoice_no`, `qty_supplied` columns, plus a **separate** `review_status` (Draft/Approved/Rejected/Hold, enum `JobSupplierStatusReviewState`) — kept separate from the pre-existing `status` column (awaiting_confirmation/confirmed/delayed/…) because the two mean different things (vendor-facing delivery state vs. our internal sign-off). Approve here means "this supplier's fulfilment is approved overall," not tied one-to-one to Goods Received.
- **Required Materials** — `sales_job_required_material_line_reviews` / `JobRequiredMaterialLineReview` / `JobRequiredMaterialLineReviewState`, keyed to the real `JobEstimationLine`.
- **Available Stock + Shortage** — same shape, `sales_job_available_stock_line_reviews` / `JobAvailableStockLineReview`.
- **Purchase Order** — `sales_job_purchase_order_line_reviews` / `JobPurchaseOrderLineReview`, keyed to the real `purchases_order_lines` row.
- **Job Estimation** (`JobEstimationResource::estimationLineRowDetailsAction()`) — retrofitted from an older, different pattern (5 separate icon buttons: manage/approve/reject/hold/delete) onto this same canonical one. One real behavioral difference kept on purpose: Approve/Reject/Hold here are **toggles** (click again to revert to Pending), not one-way Draft→Approved like the other 4 tables — that was this table's own pre-existing rule from earlier in the project, not something the new pattern should have silently changed.
- **Job Enquiry Lines** (`JobEnquiryResource::enquiryLineRowDetailsAction()`) — no status concept, so no Approve/Reject/Hold row and no status pill in the heading; footer is just Delete row / Save / Cancel.

Shared helper `JobWizard::lineReviewFooterActions()` builds the Approve/Reject/Hold/Delete-row set for the 4 JobWizard tables; `JobEstimationResource`/`JobEnquiryResource` build their own inline (different class, can't share a protected instance method across a Page and two Resources — duplication here is intentional, not an oversight).

### Sticky action columns (fixed globally, not per-page)

The pinned start/end action columns need `position: sticky` + a genuinely opaque background, or the row content underneath bleeds through by a sliver while the table scrolls horizontally (reported: a stray letter from the next column peeking through the edge). This is now ONE rule in the shared vendor template (`plugins/webkul/support/.../repeater/table.blade.php`, classes `.fos-row-actions-cell--start` / `--end`), not a per-page `<style>` block — a duplicate, narrower version of this used to live in `job-wizard.blade.php` scoped only to the Job Estimation table; it was removed in favor of the global rule to stop the two fighting over `left`/`right` on the same element. Background matches Filament's own `.fi-fo-table-repeater>table` background exactly (`var(--color-white)` / `var(--gray-900)` in dark mode) plus `background-clip: padding-box` and a matching-color `box-shadow` to close the sub-pixel bleed gap.

### Superseded attempts (do not repeat)

1. **Kebab + slide-out pane** (tried first on Job Enquiry Lines): a ⋯ toggle revealing an inline blue floating pane. Replaced because inline reveal content, even `position: absolute`, was fighting the pinned-first column's own layout, and a floating pane is harder to keep visually consistent across 5+ tables than a real modal. Job Enquiry Lines was migrated to the canonical modal pattern along with everything else.
2. **2×2 footer grid with pale Decision-Card tint colors**: the very first version of the row-details footer used the Decision Card's own pale/tinted card look. Direct feedback ("make sure icons are white but right colour for each button") replaced it with the solid-fill/white-icon style described above — a white icon doesn't read against a pale background, so this was a real style change, not a tweak.

## Job Wizard header bar

Added a read-only context bar (Job No., Date, Customer) at the top of every wizard step, pulling from `JobEnquiry`'s own already-existing auto-generated `name` and `enquiry_date` — no new data.

## Tour Mode now defaults ON

`public bool $tourMode = true;` (was `false`). Normal (non-tour) navigation only allows going *backward* from a job's current step — with 28 stages and a lot of new review UI, defaulting Tour Mode on makes the whole rail clickable both ways so new work is actually reachable without rebuilding a job from scratch each time.

## Step rail redesigned (copied from Contact Control Center)

The step rail now matches CCC's own round-pill scrollable tab bar exactly (`admin/contact-control-center/contacts/create` — its shared partial `livewire/admin/contact-control-center/partials/scrollable-tab-bar.blade.php` is the reference): rounded-full pill container, `px-4 py-2 text-sm font-medium` pills, round scroll-arrow end buttons, same rail height. **One real deviation, and it's deliberate:** CCC's active/hover colors use `bg-primary`/`hover:bg-primary` Tailwind utility classes, which do **not exist** in this Filament panel's own compiled CSS (verified: zero `.bg-primary-*` matches in every compiled bundle) — FoundationOS's primary color is runtime/database-configurable, not a static Tailwind config value, so Tailwind never generated that utility. Brand-colored bits here stay on inline `style="background: var(--color-primary, #6366f1)"`, the same real Filament CSS variable already used elsewhere in this file. **Lesson for future Filament-panel UI work in this codebase:** don't assume a Tailwind utility class works here just because it works on a native-admin (Blade/Livewire, non-Filament) page — check the actual compiled CSS bundle first (`public/build/assets/*.css` for generic utilities via `resources/css/app.css`'s Vite output; `public/css/filament/filament/app.css` for Filament's own `fi-*` classes, which contains **no generic Tailwind utilities at all**, confirmed by grep).

## FOS branding fix (was showing AureusERP's own branding)

`Webkul\Support\Traits\HasFilamentDefaults::registerHooks()` is AureusERP upstream code that injects a version+logo row into **every** Filament panel's user-menu dropdown via a `USER_MENU_PROFILE_BEFORE` render hook — it had AureusERP's own hardcoded version (`'1.5.0'`) and logo (`cache/logo.png`) baked in, not FoundationOS's. Fixed: icon now reads `config('settings.site_favicon') ?? asset('favicon.ico')` (same source as the site's own `<link rel="icon">` and the native-admin footer badge), version now reads `version.json`.

## Clear Cache — now in 3 places, all wired to the same real mechanism

Added a genuine, working "Clear Cache" control in: the native `/admin` footer, the Filament panel topbar, and the Filament user-menu dropdown. All three POST to a new `admin.clear-cache` route (`SettingController::clearCache()`, gated by the `manage`/`Setting` policy) which calls the existing `App\Services\CacheService::clearCache()` — previously only used internally by `ModuleUpdateService`, never exposed as a button anywhere. Each button swaps its icon to a spin animation and disables itself on click so it's visually obvious the clear is happening during the brief POST+reload (these are plain HTML form submits, not Livewire, so there's no `wire:loading` to hook into — a tiny inline `onclick`/`onsubmit` handles it instead).

## Two real bugs found and fixed via direct reproduction (not guessed)

1. **"Demo: could not build the Invoice/Payment steps" / "Attempt to read property 'type' on null"** — `JobWizard::loadDemoData()`'s Invoice/Payment block called `PaymentRegister::computePaymentMethodLineId()` even when no real accounting journal was resolvable for that company/payment-type combination, which silently proceeded to **insert a broken `PaymentRegister`/`Payment` row with `journal_id = null`** instead of failing loudly or skipping — a real data-corruption risk in a "just try the demo" path. Fixed: guard added right after computing `journal_id`, throwing a clean, already-caught exception before any write happens. Reproduced the original bug and the fix live via tinker; cleaned up the garbage rows the reproduction created.
2. **"Could not reserve stock" / "Nothing to check the availability for."** — `JobWizard::reserveOperation()` treated `TransferWorkflow::reserve()`'s "no reservable moves" exception (a benign case — e.g. every line on the order is a non-stock-tracked Service) as a hard failure, showing a scary red notification with the raw exception text. Fixed: the same reservable-move check now runs first, and a genuinely empty result shows a calm "Nothing to reserve" info notification instead of falling into the danger/catch path.

## Known gaps vs. the VendorOS ProcessBuilder reference

Compared against `C:\xampp\htdocs\VendrOS\server_new\plugins\process-builder\ProcessBuilder-VendorOS-v24.html`'s own Master 1–9 step list (35 steps total):

1. **4 stages don't exist in our wizard at all**, sitting between Customer Enquiry and Job Estimation: Site Survey & Schedule, 2D Design, 3D Design, Design & Specification. Relevant only if the product line needs a site visit / custom design step before estimation — not yet built, not yet scoped.
2. Their flow splits Production Tracking into 3 steps (Start / Daily / Finish); ours is one step but functionally equivalent (repeater rows + `started_at`/`finished_at`). Not a real gap, just a structural difference — low priority to change.
3. **A real, already-designed 15-role Approval Matrix exists in that same reference file** (`ADMIN_MATRIX_ROLES` / `ADMIN_MATRIX_DATA`, ~line 12430): Administrator, Director, Sales, Project Manager, Creative, Finance, Procurement, Store Manager, Production Manager, Production Supervisor, Quality Control, Logistics, Installation Supervisor, Office Manager, Viewer — with an explicit View/Approve mark per role per step across all 35 reference steps. **This has not yet been wired into FoundationOS's own permissions** — every Decision Card and row-level modal Approve/Reject/Hold button is currently open to any user who can reach the wizard. This matrix is the intended source of truth for that work, not a permission scheme to invent from scratch.

## Pending / next work (in rough priority order)

1. **Wire real permissions onto every Approve/Reject/Hold control** — both the 28 stage-level Decision Cards and the 5 tables' row-level modals — using the 15-role Approval Matrix above (one Shield permission per role×stage combination, or an equivalent scheme derived from that matrix; not yet designed in code). This is the single biggest real gap left: every one of these controls is currently open to any user who can reach the page.
2. Confirm whether the 4 missing pre-estimation design/survey stages are actually needed for this product line before building them.
3. If more line tables ever need per-row decisions, use the **canonical row-details modal pattern** described above — not the kebab-pane or pale-tint-grid attempts, both explicitly superseded.
4. Purchase Order/Requisition remain ungated by `GatesOnPriorJobStage` (no FK back to a Sales Job) — revisit only if that ever becomes a real requirement; forcing a gate today would incorrectly block ordinary, job-unrelated purchasing.

## Verification discipline used throughout

Every new migration was run for real (`php artisan migrate --path=vendor/webkul/sales/database/migrations/<file> --force`); every new model/enum got a tinker round-trip (create Draft → transition to Approved → confirm persisted → delete test row) before being reported done; every touched file was diff-verified identical between `plugins/` and `vendor/`.
