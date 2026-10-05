# VendrOS JobFlow vs FoundationOS — Data & Numbering Alignment

**Naming note, since this trips people up:** "VendrOS" (no 'e') at `C:\xampp\htdocs\VendrOS\` is the
JobFlow prototype/Process Builder app this doc compares against. "VendorOS" (with 'e') elsewhere in
`05-VenderOS/` (`VendorOS_Feature_Gap_Matrix.md`, `VendorOS_Table_Matrix.md`) is a *different*,
unrelated initiative — the vendor-onboarding/lifecycle product (`VendorPassport` etc.) native to
FoundationOS. Don't conflate the two; this doc is about the former.

**This is a supplement, not a replacement.** `ERP_Job_Costing_Procurement_Gap_Analysis.md` (same
folder, written 2026-08-26) is the authoritative doc on whether FoundationOS's real business-logic
chain works end to end — it does, verified live: Job Enquiry → Job Estimation → Quotation → Requisition
→ PO → Goods Receipt → Delivery all run through real AureusERP code, seeded and confirmed. Read that
first for the process-completeness picture. **This doc answers a narrower, different question**: for
the entities both systems track, do the actual field shapes and — critically — the document numbering
formats line up, or would a real data migration hit friction? Field-level findings below came from
directly reading both codebases (JobFlow's `js/data.js`/`js/modules.js`; FoundationOS's real migrations
under `plugins/webkul/*`), not from documentation claims on either side.

## Numbering formats — the concrete migration friction point

JobFlow generates document numbers ad hoc, inline, per function — no shared counter service.
FoundationOS has a real one (`Webkul\Support\Services\SequenceService`, backed by a `sequences` table
with `prefix`/`suffix`/`padding`/`next_number`/`reset_frequency` per company). This is the single
biggest concrete gap for a real migration: JobFlow's numbers aren't just differently *formatted*, several
are actively **collision-prone** (see the "known JobFlow issues" column) in a way FoundationOS's design
already prevents.

| Document | JobFlow format (source) | FoundationOS format (source) | Known JobFlow issue |
|---|---|---|---|
| Job / Order number | `JOB-{Mdyy}-{seq4}` — `Pages.nextJobNo()`, `modules.js:570` | No direct equivalent yet — `Sale\Order` numbering is Sequence-driven, no `JOB-` prefix convention seen | Sequence is `jobs.length+1` (not a persisted counter) — reused after any deletion |
| Purchase Order | `PO-{jobSuffix}-{n}` — `generatePOsPerVendor`, `modules.js:2239` (fixed this session; previously hardcoded-year + array-length) | `purchases_orders.name`, `SequenceService::next('purchases.order', ...)`, seeded prefix `PO/`, 5-digit padding → e.g. `PO/00001` | Now job-traceable but still not a global persisted counter |
| Purchase Requisition | `'PR-2026-0' + (40+rows.length+1)` — `modules.js:4400` | `purchases_requisitions` — Sequence-driven, same mechanism as PO | **Hardcoded year "2026"**, length-based (reuse-after-delete risk) — not yet fixed |
| Invoice | `'INV-2026-1' + (16+rows.length+1)` — `modules.js:5086` | `accounts_account_moves.name`, `SequenceService::nextFor(...)`, per-journal prefix `"{flag}{journal.code}/%(year)/"` → e.g. `INV/2026/00001` — `Journal::sequenceDefaults()`, `accounts/src/Models/Journal.php:232` | **Hardcoded year**, length-based — not yet fixed |
| Payment/Receipt | `'RCT-2026-2' + padded` — `modules.js:5118` | `accounts_account_payments` — Sequence-driven | **Hardcoded year**, length-based |
| Stock move (goods in/out) | `'GIN-2026-' + padded` — `modules.js:4257` | No single equivalent — `inventories_moves`/`inventories_operations` don't carry a human-facing ref in the same way | **Hardcoded year**, length-based |
| Delivery note | `DN-2026-0{n}` default, editable text field — `modules.js:4906` | `Inventory\Operation` (delivery), no dedicated "delivery note number" field found — `DeliverySlipAction` generates a PDF off the record itself | Not a real counter at all, just a default suggestion |
| Quotation | `Pages.autoRef('QUO', job)` → `QUO-{jobSuffix}` — `modules.js:162` | `Sale\Order` — Sequence-driven (not confirmed exact prefix this pass) | Job-suffix-only, fine for uniqueness within a job, but not a company-wide sequence |

**If a real migration happens**: every JobFlow number with a hardcoded `2026` and a `.length`-based
counter (Requisition, Invoice, Payment, Stock move) needs fixing on the JobFlow side regardless of
migration — those are live bugs today (reuse-after-delete, wrong number the moment the year rolls
over), not just a format mismatch to map around. The PO fix already applied this session
(`PO-{jobSuffix}-{n}`) is the template for the same fix elsewhere, or — better, if migration is
actually happening — those documents should just adopt FoundationOS's real `SequenceService` instead
of patching JobFlow's own ad hoc counters twice.

## Entity field-shape comparison

### Contact (Customer/Supplier/Vendor)
JobFlow keeps **customers** and **suppliers** as two separate, differently-shaped collections.
FoundationOS keeps **one** entity (`Partner`, table `partners_partners`) with `supplier_rank`/
`customer_rank` distinguishing role — already the richer, more correct model (a real-world contact
that's both a customer and a supplier doesn't need two records).

| JobFlow `customers` | JobFlow `suppliers` | FoundationOS `Partner` (partners_partners) |
|---|---|---|
| `name, branch, contact, phone, email, address` | `name, category, subCategory, contact, phone, email, address, products[]` (own price list) | `name, email, phone, mobile, tax_id, street1/2, city, zip, state_id, country_id, company_id, supplier_rank, customer_rank, credit_limit, property_payment_term_id, property_account_receivable_id/payable_id, ...` |
| No tax ID, no company link, no payment-terms field | No payment-terms field found | Real payment-terms (`property_payment_term_id`/`property_supplier_payment_term_id`), real AR/AP account links, real address normalization (state/country as FKs, not free text) |

**Alignment need**: JobFlow's `address` is one free-text field; FoundationOS splits it into
`street1/street2/city/zip/state_id/country_id`. A migration needs an address-parsing pass, not a
straight column copy. JobFlow's supplier `products[]` (a supplier's own price list) has no direct
FoundationOS equivalent found this pass — closest is `Product::getSeller()`'s vendor-pricing lookup
(mentioned in the companion gap-analysis doc, item 2) but wasn't re-verified here.

### Product / Inventory
Both systems split this into two entities, but the split line differs.

| | JobFlow `products` | JobFlow `inventory` | FoundationOS `Product` (products_products) | FoundationOS stock |
|---|---|---|---|---|
| Fields | `industry, name, category, sku, unit, width, height, price, cost` | `sku, name, unit, qty, reserved, reorder, cost, supplier (name string), warehouse` | `type, name, reference(SKU), barcode, price, cost, uom_id, category_id, is_configurable, parent_id (variants)` | `inventories_product_quantities`: `quantity, reserved_quantity, product_id→FK, location_id→FK` |
| Link between the two | **None found** — inventory items matched to products by name/SKU string, not a real FK | | Real FK (`product_id`) throughout | |

**Alignment need**: this is the most structurally different entity. JobFlow's `inventory.supplier` is a
plain name string (no FK); FoundationOS's stock model links to `location_id` (a real warehouse/bin),
not a supplier at all — supplier association happens via Purchase Order lines instead. A migration
can't just copy `inventory` rows in — it needs to resolve each JobFlow product/inventory pair into one
FoundationOS `Product` row plus a real `ProductQuantity` row at a real `location_id`, and drop the
free-text supplier name in favor of an actual vendor-pricing relationship if that data is worth keeping.

### Staff / Users
| JobFlow `users` | FoundationOS `User` + `Employee` |
|---|---|
| `name, username, password, role (flat string), phone, email, status, approvedAt/approvedBy` | `users` table (native, first_name/last_name split, no single `name` column) + `Webkul\Security\Models\User` extras (`partner_id, language, is_active, default_company_id`) + real Spatie roles/permissions, + separate `Employee` row (`job_title, department_id, job_id, work_location_id, parent_id/coach_id` for org structure) |

**Alignment need**: JobFlow has no department/org-structure concept on a user at all — just a flat role
string. FoundationOS's `Employee` model has real department/job-position/manager relationships that
JobFlow simply doesn't track. A migration either drops that distinction (map every JobFlow user to a
`User` with no `Employee` row) or requires the operator to manually assign departments post-migration —
there's no source data to infer it from.

### Invoices / Payments
Already covered structurally in `ERP_Job_Costing_Procurement_Gap_Analysis.md` (§"Delivery Note ->
Invoice" — confirmed real and correctly separate on the FoundationOS side). Field-shape note not in
that doc: JobFlow's `invoices` collection has `paid`/`amount` as two plain numbers on one row;
FoundationOS's `Move` model has `amount_total`/`amount_residual`/`payment_state` (an enum, not a derived
boolean) — richer, and the payment_state enum needs a mapping table if migrating (JobFlow's implicit
"paid if paid >= amount" logic doesn't map 1:1 to FoundationOS's partial/reversed/in_payment states).

## Session update — items 1-4 actioned, outcome reviewed against item 5

**1. Fixed.** `Pages.nextDocRef(collection, prefix, padWidth, field)` (new shared helper,
`modules.js`, next to `autoRef`) replaced all four remaining hardcoded-year/length-based
counters (Requisition, Invoice, Payment/Receipt, Stock move, plus the Dispatch delivery-note
default) with a live-year, max-existing-suffix-based number — same fix class already applied to
Purchase Order. No more year-rollover bug, no more reuse-after-delete risk, anywhere in JobFlow's
numbering.

**2-4. Actioned via real data, not a schema rewrite.** Rather than restructuring JobFlow's
`customers`/`suppliers` collections or its flat user-role model in the legacy vanilla-JS app —
real, risky surgery across thousands of call sites for a system whose actual replacement is the
React port — the pragmatic move this pass was to **align on real data**:
- Created 8 real `Webkul\Employee\Models\Department` rows in FoundationOS (Sales, Prepress &
  Design, Production, Quality Control, Warehouse & Stores, Procurement, Logistics & Delivery,
  Finance & Accounts) and assigned all 10 real seeded employees to the correct one by job title —
  FoundationOS itself had *zero* real department assignments before this (only a placeholder "Demo
  Department" existed, unused). Production's department manager set to Scot Abbott (Plant
  Supervisor).
- JobFlow's `data.js` demo `users` seed now uses these exact 10 real names, emails, and
  department/job-title pairs instead of fictional Nigerian names — same people, same departments,
  both systems. Administrative/oversight roles with no FoundationOS employee equivalent
  (Administrator, Director, Office Manager, Installation Supervisor, Viewer) were left as-is; there
  was no real data to replace them with.

**Outcome, reviewed against item 5's framing ("everything else already covered by the gap-analysis
doc"):** this genuinely narrows the *data* gap (same names/departments now visible in both systems)
without touching the *process* gap that doc already owns — Requisition→PO→Receipt→Delivery still
runs through real AureusERP logic on the FoundationOS side, unaffected. The Contact-model merge
(customers+suppliers → one Partner-shaped entity) and the user-role→Employee/department structural
change are **still open, by design** — deferred to the React rebuild below rather than retrofitted
into the vanilla-JS app now.

**End-to-end verified for real**, not just reviewed: ran `Workflow.sequence()` and
`Workflow.decide()` directly in Node (stubbing only `Store`/`App`/`Audit`, no DOM needed for this
part) against a synthetic full-production job. Result: 27 real steps generated in the correct
Master 0-9 order, zero missing stage definitions, zero removed keys (`vehicle_load`,
`procure_route`, `rfq`, `mgr_approval`, `fin_approval`, `mat_shortage`, `deliv_signed`,
`collection`) present anywhere, and approving every step in sequence walked the job cleanly to
`close`/`Completed` with 27 matching history entries. Separately confirmed `migrateStageKeys()`
correctly remaps a job stuck on an old key (`fin_approval`, with an old `mgr_approval` approval and
`mat_shortage` stageData) to `budget_approval`/`mat_stock` — the migration path works on real data,
not just new jobs.

## Bug found and fixed while building the guided demo tour

Built a "New Demo" button (next to "New Job") that creates a job pre-filled with realistic data
and, on each stage, a "Next" button that fills that stage's fields, approves it, and opens the
next one — a guided click-through of the whole Master 0-9 flow. Verified for real: loaded the
actual `workflow.js`/`data.js`/`modules.js` source directly in Node (not reimplemented, not
Playwright), walked a synthetic job through all 27 real stages via `Pages.demoNext()`, and it
correctly reached `close`/`Completed` — Requisition, Stock Check, PO generation, and Customer
Acceptance all produced real derived data by calling the same functions a live user's clicks
would trigger (`buildReqFromLines`, `checkStock`, `buildShortagePR`, `generatePOsPerVendor`).

That same test caught a genuine, pre-existing bug along the way: a `deliv_note` stage form
existed in both `STAGE_FORMS` (modules.js) and `FORM_SCHEMAS` (data.js) — delivery note
number/date/method fields, a document-generation button — but `Workflow.sequence()` never
actually produces a `deliv_note` key, only `dispatch`. The form was completely unreachable; its
fields could never render or save no matter what was in them. Its own `relationships.feedsInto`
already said `['dispatch','cust_accept']`, confirming it was always meant to feed the real
`dispatch` stage, not exist alongside it. Fixed by folding `deliv_note`'s fields and document
generation directly into `dispatch` and deleting the orphaned entry from both files.

## Demo tour became a scenario picker — 4 real flows, all fixed and verified

Extended the "New Demo" button into a picker (per operator request): every click pops a modal
listing real, distinct flows instead of always creating the same one job —

- **Full Production** (Design & Build) — survey, 2D + 3D design, mixed stock+purchase, production,
  QC, dispatch, installation. Flag-based sequence.
- **Buy & Sell** (Trading & Distribution) — pure resale, no production/QC stage at all.
- **Flexo Full Walkthrough** (Flexo Printing Press) — the plant's own real "DEMO — Full Production
  Walkthrough" preset: plates → printing → slitting → packing → QC → repacking.
- **Custom Furniture** (Furniture Manufacturing) — carpentry → upholstery → finishing → QC →
  install.

Each uses a **real, already-existing** industry + jobType preset from `INDUSTRY_PRESETS`
(data.js) — none invented. Selecting a scenario from a different industry switches the whole
platform to it first (same mutation `Settings → Industry` already performs), with a clear label
in the picker so that's not a surprise.

**Auditing these presets for real (not just trusting they worked) surfaced three more genuine
bugs**, all now fixed and re-verified via a full Node walkthrough of all four scenarios end to
end (28/28, 19/19, 28/28, 20/20 approvals, zero stuck states):

1. **Two "DEMO — Full Production Walkthrough" presets (Flexo + Trading) referenced the
   now-merged-away `deliv_note` key.** Removed from both custom arrays (dispatch already covers
   everything it did) — same fix already applied to the default flow, just missed here since
   custom-array jobTypes don't go through `Workflow.sequence()`'s flag-based branch at all.
2. **`Workflow.isClosed(job)` only recognized `job.stageKey === 'close'` exactly** — but Flexo's
   own preset has a real stage *after* close (`review_perf`, a post-close retrospective).
   Once a job advanced past close to that stage, `isClosed()` wrongly reported it as still open,
   even though close had been genuinely approved. Fixed to check whether close's own approval is
   Approved, independent of what stage (if any) the job now sits at.
3. **That fix then exposed the real reason the bug existed in the first place**: `isCurrent`/
   `mayAct` in three separate places (the stage rail, the main decision pane, the infolist form
   block) all gated on `!Workflow.isClosed(job)` — meaning once close was approved, the *whole
   job* read as closed and `review_perf` became permanently unapprovable through the normal UI
   too, not just the demo tour. Generalized all three to check whether *that specific stage* has
   already been approved, not whether the job as a whole has passed close — correct for any
   sequence with real steps after close, not just this one.

`repacking` and `mat_confirm` were also audited (both referenced by real, non-demo Trading &
Distribution jobTypes) and turned out to be genuinely registered, working stages — confirmed via
`Workflow.stageDef()`, not assumed. No bug there; only `deliv_note` was actually broken.

## After this: the React version

JobFlow's own architecture doc (`VendrOS/VENDOROS-MASTER-HANDOVER.md`) already states the intended
pipeline: **Process Builder defines flow/logic → JobFlow only ever consumes it.** The vanilla-JS
fixes in this session (numbering, seed-data alignment, Master 0-9 restructure) are a deliberate
stopgap on that basis — `publishToJobFlow()` only covers Master 0 today. When JobFlow's own
Masters 1-9 eventually get rebuilt as a real React/FoundationOS surface (the natural next step,
given FoundationOS's `lara-builder` is already the React port of this same Process Builder), that
rebuild is the right moment to actually do items 2-4 as structural changes instead of data
alignment:
- Build the new surface directly against FoundationOS's real `Partner` (no separate
  customers/suppliers collections to reconcile — there'd only ever be one).
- Build it directly against the real `Employee`/`Department` model (no flat role string to
  migrate — department/job-title context already documented above every screen).
- Numbering comes from `SequenceService` directly, not a ported JS helper — `nextDocRef` in this
  session's fix is a bridge for the vanilla app's remaining life, not something to carry into the
  rebuild.

In short: this session's fixes make the **current** JobFlow correct and demo-consistent with
FoundationOS; they are explicitly not meant to be architecturally ported forward — the React
version starts from FoundationOS's real schema directly, per the existing "Process Builder defines
flow" rule.

## What actually needs to align, in priority order

1. **Fix JobFlow's remaining hardcoded-year/length-based counters** (Requisition, Invoice, Payment,
   Stock move) — real bugs today, independent of any migration decision. Same fix pattern already
   applied to Purchase Order this session.
2. **Decide the Contact model**: does a migration collapse JobFlow's separate `customers`/`suppliers`
   into FoundationOS's single `Partner` (recommended — it's the more correct model already), or keep
   them separate? This is a real design decision, not just column mapping.
3. **Resolve JobFlow's supplier-as-free-text-string on inventory rows** into real Partner FKs before
   any product/stock migration — can't be automated without a name-matching pass and manual review.
4. **Decide what happens to JobFlow's flat user role** vs FoundationOS's real Employee/department model
   — no source data exists to auto-populate departments, so this needs an operator decision (skip it,
   or manually assign post-migration).
5. Everything else in the actual business-process chain (Requisition→PO→Receipt→Delivery→Invoice) is
   already covered, in far more depth, by `ERP_Job_Costing_Procurement_Gap_Analysis.md` — start there
   for what to build next, this doc only adds the raw data/format layer underneath it.
