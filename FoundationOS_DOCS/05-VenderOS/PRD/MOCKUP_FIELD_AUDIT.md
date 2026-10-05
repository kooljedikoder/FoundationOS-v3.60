# VendorFlow mockup: field-by-field data audit

**Generated 2026-10-04.** Every KPI, table column, form field and panel on each mockup page is mapped to where its data comes from today. References were validated against the live `foundationos` database schema (70 tables inspected, read-only); an invalid table or column fails the build. Machine-readable copy: `data/mockup_data_map.json` (also drives the **Data map** toggle in the mockup).

## 1. Legend and summary

| Source | Meaning | Items |
|---|---|--:|
| CCC | Contact Control Center / Contact Book tables (partners, profiles, certifications, affiliations, assets, documents, media) | 58 |
| VendorOS | VendorOS tables (vendor_passports, fos_vendor_*) | 39 |
| ERP | AureusERP tables (purchases_*, accounts_*, inventories_*, products_*, companies, employees_*) | 53 |
| FOS system | FoundationOS system tables (users, roles, fos_modules, menus, notifications, service_desk_*, chatter, tokens, posts) | 31 |
| Derived | Computed from the above (count, sum, average, date difference) | 11 |
| NEW (not in DB) | No table or column exists. Needs a new model; listed in section 4 | 59 |
| Static UI | Static content, no data | 7 |

**59 of 258 items have no data source yet.** Everything else can be read from existing tables, which is why most pages can be built on the current database. The new data model needed is consolidated in section 4.

## 2. FOS admin menu mapping

The mockup is the menu contract for VendorOS (see the architecture rule). This table places each mockup menu item in the real FOS admin sidebar and says what exists. FOS admin groups today: **Main** (Dashboard, Media Library), **AppSuite**, **ERP** (categories: Finance, Operations, Product Management, Human Resources, Contacts & Relationships, Administration, Configuration, Support), **VendorOS**, **Contact Control Center**, **FoundationOS** (Theme, Inbox, Monitoring, Access Control, Settings), **AI**.

| Mockup menu | FOS admin location | Route | Status |
|---|---|---|---|
| Dashboard | Main > Dashboard | admin.dashboard | Exists (generic); VendorOS KPIs are NEW queries |
| Registration & Onboarding | VendorOS > Registration & Onboarding (`vendor-registration-workspace`) | admin.vendor-registration.create | Exists: CCC wizard, 10 tabs |
|   Company Profile / Contacts & Directors / Document Upload | same wizard, `step=basic\|contact\|documents` | admin.vendor-registration.create | Exists |
|   Assessment Scoring | VendorOS > Registration & Onboarding | admin.vendor-reviews.index | Exists |
|   Approval | VendorOS > Registration & Onboarding | admin.vendor-reviews.index (same page as Assessment) | Partial: needs its own queue, chain and history page |
|   Vendor Passport Issued | VendorOS > Registration & Onboarding | admin.vendor-passports.index | Exists |
| Vendor Passport 360 | VendorOS > Vendor Passport 360 (`vendor-passport-360`) | admin.vendor-passports.show | Exists; its 7 sublinks all point to the index page (placeholders) |
| Document Management | Contact Control Center > Document Centre | admin.contact-control-center.document-centre | Exists; queue, expiring and verification actions partial |
| Supplier Assessment | VendorOS (review workspace) | admin.vendor-reviews.show | Exists |
| Induction & Certification | none | - | NEW: HSE courses, tests, certificates |
| Audit & Governance (CORE) | none | - | NEW |
| Enterprise Risk (CORE) | none | - | NEW |
| Procurement Workspace | ERP > Operations > Purchases | filament erp/purchase/orders/purchase-orders | Exists in ERP; invitations, evaluation, award are NEW |
| Contract Lifecycle (CORE) | none | - | NEW |
| Warehouse & Receiving | ERP > Operations > Inventory | filament erp/inventory/overview | Exists in ERP; inspection result is NEW |
| PLUS Procurement Hub | none | - | NEW (PLUS) |
| Finance & Payments | ERP > Finance > Accounting / Invoicing | filament erp/accounts | Exists in ERP; dispute and match result are NEW |
| Performance & SLA | VendorOS > Vendor Passport 360 > Performance | admin.vendor-passports.show | Partial: review rows exist, no scoring UI or analytics |
| Inbox & Communications | FoundationOS > Inbox + Communications module | admin.service-requests.index, admin.communications.index | Partial: tickets exist; Communications is a placeholder shell |
| Vendor Portal (map & preview) | VendorOS > Vendor Self-Service Hub (`vendor-self-service-hub`) | vendor-onboarding.dashboard | Exists (read-mostly) |
| Workflow Automation | none | - | NEW |
| Integration Hub & API (CORE) | FoundationOS > Settings > Email connections | admin.email-connections.index | Partial: tokens and email connections only |
| AI Copilot | AI > AI Data Copilot | admin.naturalquery | Exists (table-scoped querying) |
| Dynamic Form Builder | LaraBuilder + CCC Settings (field and tab rules) | admin.lara-builder.*, admin.contact-control-center.settings | Exists |
| System Configuration > Users | FoundationOS > Access Control > Users | admin.users.index | Exists |
| System Configuration > Roles & Permissions | FoundationOS > Access Control > Roles / Permissions | admin.roles.index, admin.permissions.index | Exists; PRD matrix not seeded |
| System Configuration > Business Units | ERP > Administration > Companies | filament erp companies | Exists; business-unit semantics partial (CORE) |
| Editions & Licensing | AppSuite (modules) | admin.modules.index | Partial: enable/disable only, no entitlement |
| Help & Support | FoundationOS > Inbox / ERP > Support > Help | admin.service-requests.index | Exists |
| Vendor Hub: Home, Company & Passport, Documents, Orders & RFQs, Invoices & Payments, Training & HSE, Communications, Requests, Help | Vendor Self-Service Hub (own layout, `VendorMenuService`, Menu location `vendor-sidebar`) | vendor-onboarding.dashboard, vendor-onboarding.page, vendor-onboarding.register-company, vendor-onboarding.actions.store | Exists as page shells; real data only on profile, passport, document metadata; Documents pages 500 until migration 2026_10_04_000300 runs |

**Placement rule:** workspaces backed by ERP data (Procurement, Warehouse, Finance) stay in the ERP group and are linked from VendorOS pages (read or launch, never copy). Platform items (Users, Roles, Settings, Menus) stay in FoundationOS. Everything vendor-lifecycle specific lives in the VendorOS group using the mockup's labels and order.

## 3. Page-by-page, field-by-field audit

### dashboard: Dashboard (internal + vendor home)

- **FOS location:** Main > Dashboard
- **Route:** `admin.dashboard` (generic)
- **Items:** VendorOS 5, ERP 3, NEW (not in DB) 2, CCC 2, Derived 5, FOS system 3

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Active Vendors | kpi | VendorOS | vendor_passports.status | count where status = 'active' |
| Pending Approvals | kpi | VendorOS | fos_vendor_approval_steps.status | count of pending steps |
| Avg. Compliance Score | kpi | VendorOS | vendor_passports.compliance_score | AVG |
| Open Purchase Orders | kpi | ERP | purchases_orders.state | state in (purchase, sent) and receipt_status != full |
| Contracts Expiring (30d) | kpi | NEW (not in DB) | - | needs contracts table (fos_contracts) with end_date |
| AI Suggestions | kpi | NEW (not in DB) | - | needs suggestion log from AI Data Copilot (NaturalQuery has queries only) |
| Vendor | col | CCC | partners_partners.name |  |
| Issue | col | Derived | fos_vendor_compliance_actions.description, fos_vendor_insurance_policies.expiry_date, vendor_documents.expiry_date | first open compliance action or nearest expiry |
| Score | col | VendorOS | vendor_passports.compliance_score |  |
| Status | col | Derived | vendor_passports.compliance_status |  |
| Recent Activity | panel | FOS system | module_activity_logs.action, vendor_passport_state_logs.to_status, vendor_passport_state_logs.from_status, vendor_passport_state_logs.comment, chatter_messages.body | merge of module activity, passport state logs and chatter |
| Modules - grouped by edition | panel | FOS system | fos_modules.is_enabled | enabled state from registry; edition entitlement is NEW (no entitlement column) |
| My Documents | kpi | CCC | vendor_documents.verification_status, fos_required_documents.required | verified / required for the signed-in vendor's partner |
| Outstanding Invoices | kpi | ERP | accounts_account_moves.amount_residual | SUM where move_type = in_invoice and partner_id = vendor |
| Open RFQs | kpi | ERP | purchases_orders.state | draft/sent orders for the vendor partner (invitation tracking is NEW) |
| HSE Compliance | kpi | Derived | fos_certifications.expiry_date, fos_certifications.status | % of required certificates valid |
| Certificate Expiring | kpi | Derived | fos_certifications.expiry_date, fos_vendor_insurance_policies.expiry_date | nearest expiry |
| Unread Messages | kpi | FOS system | service_desk_tickets.last_replied_at, fos_communication_contexts.partner_id | tickets with unseen staff replies (read state is NEW) |
| My Action Items | panel | Derived | fos_vendor_compliance_actions.status, vendor_documents.verification_status, fos_certifications.expiry_date | union of open actions, rejected/expiring documents, due RFQs |
| Your onboarding journey | panel | VendorOS | vendor_passports.status, fos_vendor_invitations.status, fos_vendor_stage_reviews.stage | phase derived from passport status and review stages |

### reg: Registration & Onboarding

- **FOS location:** VendorOS > Registration & Onboarding (vendor-registration-workspace)
- **Route:** `admin.vendor-registration.create` (exists)
- **Items:** CCC 3, Derived 1, VendorOS 4

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Company | col | CCC | partners_partners.name |  |
| Stage | col | Derived | vendor_passports.status, fos_vendor_stage_reviews.stage | current J01 stage |
| Category | col | CCC | fos_partner_profiles.vendor_category |  |
| Submitted | col | VendorOS | vendor_passports.submitted_at |  |
| Status | col | VendorOS | vendor_passports.status |  |
| Onboarding Journey | panel | VendorOS | vendor_passports.status | six-stage strip derived from status |
| In-Progress Registrations | panel | VendorOS | vendor_passports.status | status in (draft, submitted, in_review) |
| New Vendor wizard (13 steps) | field | CCC | fos_partner_profiles.registration_number | all fields in data/field_dictionary.json; Declaration step is NEW (G-08) |

### approval: Approval

- **FOS location:** VendorOS > Registration & Onboarding > Approval
- **Route:** `admin.vendor-reviews.index` (partial (same page as Assessment Scoring))
- **Items:** VendorOS 11, Derived 1, CCC 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Awaiting my decision | kpi | VendorOS | fos_vendor_approval_steps.status, fos_vendor_approval_steps.reviewer_id | pending steps for the current reviewer |
| Overdue | kpi | VendorOS | fos_vendor_approval_steps.due_at | due_at < now and status pending |
| Approved this month | kpi | VendorOS | fos_vendor_approval_steps.decided_at, fos_vendor_approval_steps.decision |  |
| Avg. days to approve | kpi | Derived | vendor_passports.submitted_at, vendor_passports.approved_at | AVG(approved_at - submitted_at) |
| Reference | col | VendorOS | fos_vendor_approval_steps.id |  |
| Title | col | CCC | partners_partners.name | vendor name plus stage label |
| Owner | col | VendorOS | fos_vendor_approval_steps.reviewer_role |  |
| Date | col | VendorOS | fos_vendor_approval_steps.due_at |  |
| Status | col | VendorOS | fos_vendor_approval_steps.status |  |
| Reason / findings | field | VendorOS | fos_vendor_approval_steps.comments | required to reject or request information |
| Approval chain | panel | VendorOS | fos_vendor_approval_steps.step_order, fos_vendor_approval_steps.parallel_group, fos_vendor_approval_steps.is_required | per-vendor steps exist; the reusable chain TEMPLATE (stages, SLA, owner role) is NEW |
| History & audit | panel | VendorOS | fos_vendor_approval_steps.decided_at, vendor_passport_state_logs.to_status, vendor_passport_state_logs.from_status, vendor_passport_state_logs.comment |  |
| Escalation | field | VendorOS | fos_vendor_approval_steps.escalated_to, fos_vendor_approval_steps.escalation_note, fos_vendor_approval_steps.escalated_at | columns exist; no UI in mockup yet (add Escalate action) |

### passport: Vendor Passport 360 (admin)

- **FOS location:** VendorOS > Vendor Passport 360
- **Route:** `admin.vendor-passports.show` (exists)
- **Items:** VendorOS 4, NEW (not in DB) 7, CCC 6, FOS system 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Performance Score | kpi | VendorOS | vendor_passports.performance_score |  |
| Compliance Score | kpi | VendorOS | vendor_passports.compliance_score |  |
| Risk Score | kpi | NEW (not in DB) | - | needs risk register (fos_risks) or a stored vendor risk rating |
| Active Contracts | kpi | NEW (not in DB) | - | needs contracts table |
| Company Snapshot | panel | CCC | partners_partners.name, fos_partner_profiles.vendor_category, partners_partners.street1, partners_partners.city |  |
| Digital Vendor Card | panel | VendorOS | vendor_passports.vendor_number, vendor_passports.status, vendor_passports.approved_at | QR token for public verification is NEW (no token column) |
| Document | col | CCC | vendor_documents.document_type |  |
| Type | col | CCC | documents.type |  |
| Expiry | col | CCC | vendor_documents.expiry_date |  |
| Status | col | CCC | vendor_documents.verification_status |  |
| Contract | col | NEW (not in DB) | - | needs fos_contracts |
| Value | col | NEW (not in DB) | - | needs fos_contracts.value |
| Renewal | col | NEW (not in DB) | - | needs fos_contracts.renewal_date |
| Name | col | FOS system | users.name | vendor staff via users.partner_id |
| Title | col | CCC | fos_partner_profiles.designation |  |
| Access Level | col | NEW (not in DB) | - | needs vendor membership relation with role/permission set (D-01) |
| Passport Usage History | panel | NEW (not in DB) | - | needs vendor_passport_scans (time, location, scanned_by, result) |
| Timeline & Activity Log | panel | VendorOS | vendor_passport_state_logs.to_status, vendor_passport_state_logs.from_status, vendor_passport_state_logs.comment, module_activity_logs.action, chatter_messages.body |  |
| Communications | panel | FOS system | service_desk_tickets.title, fos_communication_contexts.partner_id | threads linked to the partner |

### docs: Document Management & Verification (admin)

- **FOS location:** Contact Control Center > Document Centre (+ VendorOS Document Upload)
- **Route:** `admin.contact-control-center.document-centre` (exists)
- **Items:** CCC 10, Static UI 1, NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Documents on File | kpi | CCC | documents.id, vendor_documents.id | count |
| Expiring (30d) | kpi | CCC | vendor_documents.expiry_date |  |
| Verified | kpi | CCC | vendor_documents.verification_status |  |
| Rejected | kpi | CCC | vendor_documents.verification_status |  |
| Vendor | col | CCC | partners_partners.name |  |
| Document | col | CCC | vendor_documents.document_type |  |
| Submitted | col | CCC | documents.created_at |  |
| Status | col | CCC | vendor_documents.verification_status | PRD lifecycle has 16 states; column holds free status text. documents has no status/expiry/version (D-02) |
| Expired | col | CCC | vendor_documents.expiry_date |  |
| Actions | col | Static UI | - | Approve / Reject / Request replacement; verified_by and verified_at exist |
| Expiring documents (next 30 days) | panel | CCC | vendor_documents.expiry_date |  |
| Document versions | field | NEW (not in DB) | - | needs version number + previous version link (documents has none) |

### assessment: Supplier Assessment & Due Diligence

- **FOS location:** VendorOS > Registration & Onboarding > Assessment Scoring
- **Route:** `admin.vendor-reviews.show` (exists)
- **Items:** VendorOS 5

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Assessment Breakdown (per discipline score) | panel | VendorOS | fos_vendor_scorecards.dimension_scores, fos_vendor_scorecards.overall_score, fos_vendor_scorecards.formula | disciplines are JSON keys; weights table in PRD M3 |
| Stage review (stages 23-30) | field | VendorOS | fos_vendor_stage_reviews.stage, fos_vendor_stage_reviews.score, fos_vendor_stage_reviews.decision, fos_vendor_stage_reviews.findings, fos_vendor_stage_reviews.evidence_reference |  |
| Recommendation | field | VendorOS | fos_vendor_recommendations.recommendation, fos_vendor_recommendations.rationale, fos_vendor_recommendations.conditions |  |
| Verification checks (S19-S20) | field | VendorOS | fos_vendor_verification_checks.check_name, fos_vendor_verification_checks.result |  |
| Compliance actions (S22) | field | VendorOS | fos_vendor_compliance_actions.description, fos_vendor_compliance_actions.vendor_response |  |

### hse: Induction & Certification

- **FOS location:** VendorOS > (HSE) - no admin menu entry yet
- **Route:** (none)
- **Items:** CCC 4, NEW (not in DB) 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Vendor | col | CCC | partners_partners.name |  |
| Certificate | col | CCC | fos_certifications.name |  |
| Score | col | NEW (not in DB) | - | needs hse_attempts (score, passed, attempted_at) |
| Expiry | col | CCC | fos_certifications.expiry_date |  |
| Take the Site Safety Induction Test | panel | NEW (not in DB) | - | needs hse_courses, hse_questions, hse_attempts |
| Certification Register | panel | CCC | fos_certifications.certificate_number, fos_certifications.issuing_body, fos_certifications.status |  |

### audit: Audit & Governance (CORE)

- **FOS location:** none yet
- **Route:** (none)
- **Items:** Derived 1, NEW (not in DB) 6, CCC 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Overall Compliance | kpi | Derived | vendor_passports.compliance_score | AVG |
| Open Findings | kpi | NEW (not in DB) | - | needs fos_audit_findings |
| Overdue Corrective Actions | kpi | NEW (not in DB) | - | needs fos_capa |
| Audits This Quarter | kpi | NEW (not in DB) | - | needs fos_audits |
| Vendor | col | CCC | partners_partners.name |  |
| Finding | col | NEW (not in DB) | - | fos_audit_findings.description |
| Severity | col | NEW (not in DB) | - | fos_audit_findings.severity |
| Status | col | NEW (not in DB) | - | fos_audit_findings.status |

### erm: Enterprise Risk Management (CORE)

- **FOS location:** none yet
- **Route:** (none)
- **Items:** NEW (not in DB) 7, CCC 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Low Risk Vendors | kpi | NEW (not in DB) | - | needs fos_risks with rating |
| Medium Risk | kpi | NEW (not in DB) | - |  |
| High Risk | kpi | NEW (not in DB) | - |  |
| Governance Score | kpi | NEW (not in DB) | - | definition needed |
| Vendor | col | CCC | partners_partners.name |  |
| Risk Category | col | NEW (not in DB) | - | fos_risks.category |
| Score | col | NEW (not in DB) | - | likelihood x impact |
| Trend | col | NEW (not in DB) | - | needs risk history |

### procurement: Procurement Workspace

- **FOS location:** ERP > Operations > Purchases
- **Route:** `filament erp/purchase/orders/purchase-orders` (exists (ERP))
- **Items:** ERP 13, NEW (not in DB) 3, CCC 1, Static UI 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Open RFQs | kpi | ERP | purchases_orders.state | state in (draft, sent) |
| Awaiting Evaluation | kpi | NEW (not in DB) | - | needs bid/quotation records per RFQ |
| POs Issued (30d) | kpi | ERP | purchases_orders.ordered_at |  |
| Spend Under Management | kpi | ERP | purchases_orders.total_amount | SUM |
| Delivery SLA | kpi | ERP | inventories_operations.deadline, inventories_operations.closed_at | % closed on or before deadline |
| Deliveries Due Today | kpi | ERP | inventories_operations.scheduled_at, inventories_operations.state |  |
| Open Defects | kpi | NEW (not in DB) | - | needs receipt inspection / QC records |
| Payments Due (30d) | kpi | ERP | accounts_account_moves.invoice_date_due, accounts_account_moves.amount_residual |  |
| RFQ | col | ERP | purchases_orders.name |  |
| Description | col | ERP | purchases_orders.description |  |
| Vendors Invited | col | NEW (not in DB) | - | needs fos_rfq_invitations (rfq_id, partner_id, sent_at, response) |
| Closes | col | ERP | purchases_requisitions.ends_at | for tender-type requisitions; plain RFQs use purchases_orders.planned_at |
| Status | col | ERP | purchases_orders.state |  |
| PO | col | ERP | purchases_orders.name |  |
| Vendor | col | CCC | purchases_orders.partner_id, partners_partners.name |  |
| Value | col | ERP | purchases_orders.total_amount, purchases_orders.currency_id |  |
| Actions | col | Static UI | - | View, Email to Vendor (ERP email); award action NEW (stage 41) |
| Delivery & Inspection Workflow | panel | ERP | inventories_operations.state | receive step exists; inspect/approve steps NEW |

### clm: Contract Lifecycle Management (CORE)

- **FOS location:** none yet
- **Route:** (none)
- **Items:** NEW (not in DB) 5, CCC 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Contract | col | NEW (not in DB) | - | fos_contracts.reference |
| Vendor | col | CCC | partners_partners.name |  |
| Value | col | NEW (not in DB) | - | fos_contracts.value + currency |
| Renewal | col | NEW (not in DB) | - | fos_contracts.renewal_date |
| Status | col | NEW (not in DB) | - | fos_contracts.status |
| Contract Register | panel | NEW (not in DB) | - | also needs fos_contract_obligations, templates; map ERP purchases_requisitions (blanket orders) first |

### warehouse: Warehouse & Receiving

- **FOS location:** ERP > Operations > Inventory
- **Route:** `filament erp/inventory/overview` (exists (ERP))
- **Items:** ERP 9, CCC 2, NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Delivery SLA | kpi | ERP | inventories_operations.deadline, inventories_operations.closed_at |  |
| Deliveries Due Today | kpi | ERP | inventories_operations.scheduled_at |  |
| Late Deliveries | kpi | ERP | inventories_operations.has_deadline_issue |  |
| Awaiting Finance Payment | kpi | ERP | accounts_account_moves.payment_state |  |
| Reference | col | ERP | inventories_operations.name |  |
| Vendor | col | CCC | inventories_operations.partner_id, partners_partners.name |  |
| PO | col | ERP | inventories_operations.origin | origin holds the PO name |
| Received | col | ERP | inventories_operations.closed_at |  |
| Condition | col | NEW (not in DB) | - | needs fos_receipt_inspections (result, notes, photos, inspected_by) |
| Expected | col | ERP | inventories_operations.scheduled_at |  |
| Status | col | ERP | inventories_operations.state |  |
| Delivery notes archive (photos) | panel | CCC | media.file_name, media.custom_properties | photo capture of delivery note via media library |

### finance: Finance & Payments

- **FOS location:** ERP > Finance > Accounting / Invoicing
- **Route:** `filament erp/accounts` (exists (ERP))
- **Items:** ERP 6, NEW (not in DB) 2, CCC 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Invoices This Month | kpi | ERP | accounts_account_moves.invoice_date, accounts_account_moves.move_type |  |
| Pending Approval | kpi | ERP | accounts_account_moves.state | state = draft |
| Paid On Time | kpi | ERP | accounts_account_payments.date, accounts_account_moves.invoice_date_due | paid on or before due |
| Disputed | kpi | NEW (not in DB) | - | needs dispute flag/reason on vendor invoices |
| Invoice | col | ERP | accounts_account_moves.name |  |
| Vendor | col | CCC | accounts_account_moves.partner_id, partners_partners.name |  |
| Amount | col | ERP | accounts_account_moves.amount_total |  |
| Status | col | ERP | accounts_account_moves.payment_state, accounts_account_moves.state |  |
| PO/GRN three-way match | field | NEW (not in DB) | - | needs match result (purchases_orders + inventories_operations + invoice) stored or computed |

### perf: Vendor Performance & SLA

- **FOS location:** VendorOS > Vendor Passport 360 > Performance
- **Route:** `admin.vendor-passports.show` (partial)
- **Items:** CCC 1, VendorOS 6

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Vendor | col | CCC | partners_partners.name |  |
| Overall Score | col | VendorOS | fos_vendor_performance_reviews.overall_score |  |
| Delivery | col | VendorOS | fos_vendor_performance_reviews.delivery_score |  |
| Quality | col | VendorOS | fos_vendor_performance_reviews.quality_score |  |
| SLA / Responsiveness / Cost / HSE scores | field | VendorOS | fos_vendor_performance_reviews.sla_score, fos_vendor_performance_reviews.responsiveness_score, fos_vendor_performance_reviews.cost_score, fos_vendor_performance_reviews.hse_score | columns exist but the mockup shows only three scores: add the other four |
| Review period | field | VendorOS | fos_vendor_performance_reviews.period_start, fos_vendor_performance_reviews.period_end | mockup shows no period |
| Vendor Scorecards | panel | VendorOS | fos_vendor_scorecards.overall_score |  |

### comms: Inbox & Communications

- **FOS location:** FoundationOS > Inbox (service-requests) + Communications module
- **Route:** `admin.communications.index` (partial (placeholder shell))
- **Items:** FOS system 4, NEW (not in DB) 4

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Unified Inbox | panel | FOS system | service_desk_tickets.title, service_desk_tickets.status, service_desk_tickets.priority, service_desk_tickets.assigned_to_id | per-context scoping through fos_communication_contexts |
| Direct Messages | panel | NEW (not in DB) | - | needs chat adapter (WireChat candidate); not installed |
| Email | panel | FOS system | service_desk_tickets.email_message_id, service_desk_tickets.source | inbound email threading via ticket source |
| WhatsApp | panel | NEW (not in DB) | - | needs provider adapter and operating cost decision; not in FLEX |
| Announcements | panel | NEW (not in DB) | - | needs announcements table (audience, body, publish_at) |
| Alerts | panel | FOS system | notifications.name, notifications.notification_type |  |
| AI Summary | panel | NEW (not in DB) | - | AI Data Copilot summary of unread threads; not built |
| SLA timers | field | FOS system | service_desk_tickets.first_response_due_at, service_desk_tickets.resolution_due_at, service_desk_tickets.first_response_breached | columns exist; sla_policies table empty |

### myprofile: Company & Passport (vendor)

- **FOS location:** Vendor Hub > Company & Passport (vendor-onboarding.page company-profile / passport)
- **Route:** `vendor-onboarding.page` (exists (read-only))
- **Items:** VendorOS 3, CCC 13, Derived 1, NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Compliance Score | kpi | VendorOS | vendor_passports.compliance_score |  |
| Onboarded | kpi | VendorOS | vendor_passports.activated_at | months since activation |
| Active Contacts | kpi | CCC | partners_partners.parent_id | child contacts of the vendor partner |
| Profile Completeness | kpi | Derived | fos_partner_profiles.registration_number, partners_partners.tax_id, partners_bank_accounts.account_number | % of required fields present |
| Company | field | CCC | partners_partners.name |  |
| Category | field | CCC | fos_partner_profiles.vendor_category |  |
| Registered | field | CCC | partners_partners.city, partners_partners.country_id |  |
| Registration no. | field | CCC | fos_partner_profiles.registration_number, partners_partners.company_registry |  |
| Primary email | field | CCC | partners_partners.email |  |
| Phone | field | CCC | partners_partners.phone |  |
| Address | field | CCC | partners_partners.street1, partners_partners.street2, partners_partners.city, partners_partners.zip |  |
| Bank | field | CCC | partners_bank_accounts.bank_id, banks.name |  |
| Account | field | CCC | partners_bank_accounts.account_number | masked |
| Tax ID | field | CCC | partners_partners.tax_id, fos_partner_profiles.withholding_tax_number |  |
| Tax clearance | field | CCC | fos_partner_profiles.tax_clearance_expiry |  |
| Contacts list (reference, title, type, owner, date) | col | CCC | partners_partners.name, fos_partner_profiles.designation, partners_partners.email, fos_partner_profiles.status |  |
| Passport | field | VendorOS | vendor_passports.vendor_number, vendor_passports.status, vendor_passports.approved_at |  |
| Staff Access list | col | NEW (not in DB) | - | users.partner_id exists; per-staff access level needs membership relation (D-01) |

### mydocuments: Documents (vendor)

- **FOS location:** Vendor Hub > Documents
- **Route:** `vendor-onboarding.page documents` (exists but 500 until migration 000300 runs)
- **Items:** CCC 9, Static UI 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Mandatory documents | kpi | CCC | fos_required_documents.required, fos_required_documents.is_active | active required rules for the section |
| Verified | kpi | CCC | vendor_documents.verification_status |  |
| Needs action | kpi | CCC | vendor_documents.verification_status | missing or replacement required |
| Under review | kpi | CCC | vendor_documents.verification_status |  |
| Document | col | CCC | fos_required_documents.label, vendor_documents.document_type |  |
| Status | col | CCC | vendor_documents.verification_status | needs the 16-state lifecycle (documents has none) |
| Expiry | col | CCC | vendor_documents.expiry_date |  |
| Action | col | Static UI | - | Upload / Replace / Change request |
| File (upload, camera) | field | CCC | media.file_name, media.mime_type, media.size, media.custom_properties | CCC stores files as media with doc_type in custom_properties; documents is the other path (D-02) |
| Country pack (Nigeria 15) | field | CCC | fos_required_documents.section, fos_required_documents.doc_type, fos_required_documents.label | seeded pack is South African; add Nigeria pack (G-03) |

### mycomms: Communications (vendor)

- **FOS location:** Vendor Hub > Communications
- **Route:** `vendor-onboarding.page communications` (exists (tickets list))
- **Items:** FOS system 4, NEW (not in DB) 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Unread | kpi | FOS system | service_desk_tickets.last_replied_at | read state NEW |
| Active Threads | kpi | FOS system | service_desk_tickets.status, fos_communication_contexts.partner_id |  |
| Announcements | kpi | NEW (not in DB) | - | announcements table |
| Alerts | kpi | FOS system | notifications.id | per-user notifications (receiver rows) |
| Direct Messages | panel | FOS system | service_desk_tickets.title, service_desk_ticket_comments.body, service_desk_ticket_comments.is_internal | replies in ticket comments; is_internal marks private notes that must never reach the vendor |
| AI Summary | panel | NEW (not in DB) | - |  |

### myinvoices: Invoices & Payments (vendor)

- **FOS location:** Vendor Hub > Invoices & Payments
- **Route:** `vendor-onboarding.page invoices-payments` (exists (read-only))
- **Items:** ERP 10, Derived 1, NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Outstanding | kpi | ERP | accounts_account_moves.amount_residual |  |
| Paid (30d) | kpi | ERP | accounts_account_payments.amount, accounts_account_payments.date |  |
| Due This Week | kpi | ERP | accounts_account_moves.invoice_date_due |  |
| Avg. Payment Days | kpi | Derived | accounts_account_payments.date, accounts_account_moves.invoice_date |  |
| Reference | col | ERP | accounts_account_moves.name |  |
| Title | col | ERP | accounts_account_moves.invoice_origin, accounts_account_moves.payment_reference |  |
| Owner | col | ERP | accounts_account_moves.invoice_user_id |  |
| Date | col | ERP | accounts_account_moves.invoice_date_due |  |
| Amount | col | ERP | accounts_account_moves.amount_total, accounts_account_moves.currency_id |  |
| Status | col | ERP | accounts_account_moves.payment_state, accounts_account_moves.state |  |
| Submit Invoice | field | NEW (not in DB) | - | vendor creates a draft bill (move_type in_invoice) for their own PO; PO-value cap and flagging are NEW rules |
| Payment date and reference | field | ERP | accounts_account_payments.date, accounts_account_payments.payment_reference |  |

### myrfqpo: Orders & RFQs (vendor)

- **FOS location:** Vendor Hub > Orders & RFQs
- **Route:** `vendor-onboarding.page rfqs-pos-deliveries` (exists (read-only))
- **Items:** ERP 9, NEW (not in DB) 3

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Open RFQs | kpi | ERP | purchases_orders.state |  |
| Active POs | kpi | ERP | purchases_orders.state, purchases_orders.receipt_status |  |
| Delivered (30d) | kpi | ERP | inventories_operations.closed_at |  |
| Awaiting Acknowledgement | kpi | NEW (not in DB) | - | needs PO acknowledgement (acknowledged_at, acknowledged_by) on purchase orders |
| Reference | col | ERP | purchases_orders.name |  |
| Title | col | ERP | purchases_orders.description |  |
| Owner | col | ERP | purchases_orders.user_id |  |
| Date | col | ERP | purchases_orders.planned_at, purchases_requisitions.ends_at |  |
| Amount | col | ERP | purchases_orders.total_amount |  |
| Status | col | ERP | purchases_orders.state, purchases_orders.receipt_status, inventories_operations.state |  |
| Submit Quotation / accept / decline / questions | field | NEW (not in DB) | - | needs fos_rfq_invitations and fos_rfq_quotations (price lines, validity, attachments) |
| Delivery acknowledge | field | NEW (not in DB) | - | needs delivery acknowledgement on inventories_operations or a VendorOS table |

### myhse: Training & HSE (vendor)

- **FOS location:** Vendor Hub > Training & HSE
- **Route:** `vendor-onboarding.page hse-training` (exists (read-only))
- **Items:** NEW (not in DB) 4, CCC 2, Derived 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Courses Completed | kpi | NEW (not in DB) | - | needs hse_enrolments |
| Pending | kpi | NEW (not in DB) | - |  |
| Expiring Soon | kpi | CCC | fos_certifications.expiry_date |  |
| Compliance | kpi | Derived | fos_certifications.status, fos_certifications.expiry_date |  |
| Certificates list | col | CCC | fos_certifications.name, fos_certifications.certificate_number, fos_certifications.expiry_date, fos_certifications.status |  |
| Courses list | col | NEW (not in DB) | - | hse_courses |
| Induction list | col | NEW (not in DB) | - | hse_attempts per staff member (needs staff identity, D-01) |

### requests: Requests (vendor)

- **FOS location:** Vendor Hub > Requests
- **Route:** `vendor-onboarding.actions.store` (exists (creates ticket))
- **Items:** FOS system 5

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Request type | field | FOS system | service_desk_tickets.category_id, service_desk_tickets.department_id | six types map to ticket category/department |
| Routed to | field | FOS system | service_desk_tickets.department_id |  |
| Priority | field | FOS system | service_desk_tickets.priority |  |
| Details | field | FOS system | service_desk_tickets.description |  |
| My requests list | col | FOS system | service_desk_tickets.reference_number, service_desk_tickets.title, service_desk_tickets.status, service_desk_tickets.created_at, fos_communication_contexts.partner_id |  |

### workflow: Workflow & Business Process Automation

- **FOS location:** none yet (ERP Activity Plans partly)
- **Route:** (none)
- **Items:** NEW (not in DB) 1, VendorOS 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Automation Rules | panel | NEW (not in DB) | - | needs fos_workflow_rules (trigger, condition, action, active, version); ERP activity_plans/activity_types give task templates only |
| Vendor Lifecycle Kanban | panel | VendorOS | vendor_passports.status | group by status; transitions logged in vendor_passport_state_logs |

### integration: Integration Hub & API (CORE)

- **FOS location:** FoundationOS > Settings (email connections exist)
- **Route:** `admin.email-connections.index` (partial)
- **Items:** FOS system 2, NEW (not in DB) 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| API keys | panel | FOS system | personal_access_tokens.name, personal_access_tokens.abilities, personal_access_tokens.last_used_at, personal_access_tokens.expires_at | Sanctum tokens; scoped abilities |
| Connectors (ERP, banking, tax, BI) | panel | NEW (not in DB) | - | needs fos_integrations (type, config, last_sync, status) |
| Webhooks | panel | NEW (not in DB) | - | needs fos_webhooks and delivery log |
| Email connection | panel | FOS system | admin.email-connections | exists |

### ai: AI Copilot

- **FOS location:** AI > AI Data Copilot
- **Route:** `admin.naturalquery` (exists)
- **Items:** FOS system 1, NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Table-scoped query | panel | FOS system | fos_modules.slug | NaturalQuery module (ai-data-copilot) |
| OCR, predictive risk, generative reports | panel | NEW (not in DB) | - | not built; keep as roadmap only |

### plusprocure: PLUS Procurement Hub

- **FOS location:** none yet
- **Route:** (none)
- **Items:** NEW (not in DB) 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Category / Forecast Demand / Current Coverage | col | NEW (not in DB) | - | needs fos_demand_plans; products_products supplies categories |
| Event / Type / Suppliers / Est. Value | col | NEW (not in DB) | - | needs fos_sourcing_events (RFI, RFP, auction); ERP purchases_requisitions covers call-for-tender only |

### builder: Dynamic Form Builder

- **FOS location:** LaraBuilder (Pages / Forms) + CCC Settings (field and tab rules)
- **Route:** `admin.lara-builder` (exists)
- **Items:** FOS system 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Form / Linked Module / Fields / Status | col | FOS system | posts.title, fos_field_visibility_rules.id, form_submissions.post_id | forms are LaraBuilder posts; submissions in form_submissions; CCC field rules in fos_field_visibility_rules; shared_process_form_json contract |
| Custom fields | field | FOS system | fos_custom_fields.id | 2 defined |

### admin: System Configuration

- **FOS location:** FoundationOS > Access Control (Users, Roles, Permissions) / Settings / Menus
- **Route:** `admin.users.index admin.roles.index admin.permissions.index admin.settings.index admin.menus.index` (exists)
- **Items:** FOS system 4, ERP 3

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| User | col | FOS system | users.name, users.email |  |
| Role | col | FOS system | users.id | spatie model_has_roles |
| Business Unit | col | ERP | companies.name, companies.parent_id | business unit = child company (CORE); employees_employees.company_id |
| Status | col | FOS system | users.is_active |  |
| Roles & permissions | panel | FOS system | users.id | spatie roles / permissions; matrix per PRD section 3.2 must be seeded |
| Business units | panel | ERP | companies.parent_id, companies.name, companies.partner_id | multi-company (F-E5) |
| Departments / Teams | field | ERP | employees_departments.name, fos_departments.name, fos_teams.id | two department tables exist (FOS and ERP): confirm canonical (ERP per data-ownership decision) |

### support: Support

- **FOS location:** FoundationOS > Inbox
- **Route:** `admin.service-requests.index` (exists)
- **Items:** FOS system 4, NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Open tickets | kpi | FOS system | service_desk_tickets.status |  |
| Avg. response | kpi | FOS system | service_desk_tickets.first_responded_at, service_desk_tickets.created_at |  |
| Satisfaction | kpi | NEW (not in DB) | - | needs ticket rating |
| Knowledge articles | kpi | FOS system | service_desk_kb_article_ticket.ticket_id | KB tables exist; content table check needed |
| Your Recent Tickets | col | FOS system | service_desk_tickets.reference_number, service_desk_tickets.title, service_desk_tickets.status |  |

### selfservice: Vendor Portal sitemap and journey map

- **FOS location:** documentation page
- **Route:** (n/a)
- **Items:** Static UI 2

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Vendor sitemap | panel | Static UI | - | static reference |
| Global standard fields | panel | Static UI | - | static reference |

### role-guide: Role Dashboards & Menu Guide

- **FOS location:** documentation page
- **Route:** (n/a)
- **Items:** Static UI 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Role dashboards and menu scope | panel | Static UI | - | static reference; roles must match Spatie roles (D-08) |

### editions: Editions & Licensing

- **FOS location:** AppSuite (modules)
- **Route:** `admin.modules.index` (partial)
- **Items:** NEW (not in DB) 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| Edition comparison | panel | NEW (not in DB) | - | needs entitlement settings (edition -> module -> feature); fos_modules only has is_enabled |

### prd: PRD

- **FOS location:** documentation page
- **Route:** (n/a)
- **Items:** Static UI 1

| Item | Kind | Source | Database reference | Note |
|---|---|---|---|---|
| PRD content | panel | Static UI | - | static reference |

## 4. New data model needed (from the 59 NEW items)

| Proposed table / change | Serves | Suggested columns |
|---|---|---|
| fos_contracts (+ fos_contract_obligations, templates) | Contract register, obligations, renewals (M-11) | id, partner_id, reference, title, value, currency_id, starts_at, ends_at, renewal_date, status, source (award \| blanket order), purchases_requisition_id |
| fos_audits, fos_audit_findings, fos_capa | Audit plans, findings, CAPA (M-09) | audit: id, partner_id, scope, auditor_id, planned_at, status; finding: audit_id, severity, description, evidence, status; capa: finding_id, owner_id, due_at, status |
| fos_risks (+ history) | Risk register and scores (M-12); vendor Risk Score on the Passport | id, partner_id, category, likelihood, impact, rating, mitigation_owner_id, status, reviewed_at; history for the trend column |
| hse_courses, hse_questions, hse_attempts, hse_enrolments | Induction content, test, attempts, certificate issuing (M-04) | course: id, title, pass_mark, validity_months; attempt: partner_id, user_id, course_id, score, passed, attempted_at, certificate_id (link to fos_certifications) |
| fos_rfq_invitations, fos_rfq_quotations (+ lines) | Invite vendors, accept/decline, quotation response, evaluation (stages 39-41) | invitation: purchases_order_id \| purchases_requisition_id, partner_id, sent_at, opened_at, response, responded_at; quotation: invitation_id, valid_until, total, lines, attachments, score |
| PO acknowledgement fields | Awaiting Acknowledgement KPI and vendor acknowledge action | purchases_orders.acknowledged_at, acknowledged_by (or a VendorOS table keyed by order id) |
| fos_receipt_inspections | Delivery condition, QC, damage claims (stage 42) | inventories_operation_id, result, notes, photos (media), inspected_by, inspected_at, claim_status |
| Invoice dispute and three-way match result | Disputed KPI, PO/GRN match (stage 43) | accounts_account_moves: dispute_status, dispute_reason, match_result (or a VendorOS table keyed by move id) |
| vendor_passport_scans (+ public QR token) | Passport usage history and QR verification | vendor_passports.qr_token; scans: vendor_passport_id, scanned_at, location, scanned_by, result |
| Vendor membership | Staff Access list with access level, multi-staff vendors (D-01) | vendor_partner_user: partner_id, user_id, access_level (primary \| staff \| custom permissions), status, invited_by |
| Document lifecycle columns | PRD 16-state lifecycle, versions, expiry on every document (D-02) | documents: status, expires_at, version, replaces_document_id, doc_type; or move to vendor_documents as the canonical record |
| fos_announcements | Announcements to vendors (M-13) | id, title, body, audience (all \| tier \| list), publish_at, expires_at, created_by |
| Read state for conversations | Unread counts for vendor and staff | per-user last_read_at per ticket |
| Ticket rating | Satisfaction KPI | service_desk_tickets.rating, rated_at |
| fos_workflow_rules (+ runs) | Automation rules, versions, run log (M-16) | id, name, trigger, condition json, action json, is_active, version, last_run_at; runs: rule_id, status, error |
| fos_integrations, fos_webhooks (+ deliveries) | Connectors, signed webhooks, delivery log (M-17) | integration: type, config (encrypted), status, last_sync_at; webhook: url, secret, events, active; delivery: webhook_id, status, response, attempted_at |
| fos_demand_plans, fos_sourcing_events (PLUS) | Demand planning, RFI/RFP/eTender/auction (M-19) | plan: category_id, period, forecast_qty, coverage; event: type, status, estimated_value, closes_at, committee |
| Approval chain template | Reusable chain of stages with owner role and SLA (F-A7) | fos_approval_chain_templates / _stages: stage_no, parallel_group, role, sla_days, required, tier (flex \| core) |
| Entitlement settings | Editions & Licensing, feature gating (M-22) | fos_entitlements: edition, module_slug, feature_key, level (std \| adv) |
| Suggestion log for the AI Copilot | AI Suggestions KPI | fos_ai_suggestions: context, suggestion, accepted_at |
| Declaration (supplier declarations) | Registration step 14 (G-08) | fos_partner_declarations: partner_id, version, accepted_at, accepted_by, signatory_name |

Rule R1/R2/R4 still applies: extend the existing canonical row (partner, purchase order, invoice, delivery) with a related table keyed back to it; never copy ERP transactions.

## 5. Findings that change the build

1. **Two department tables** exist (`fos_departments`, `employees_departments`). ERP is canonical per the data-ownership decision; retire or alias the FOS one.
2. **Directors are keyed by passport**, not partner: `vendor_directors.vendor_passport_id`. CCC stores directors as contact relations; pick one (the registration wizard writes directors through CCC).
3. **`vendor_documents` and `documents` both exist** and CCC uses media. Three paths for one file (D-02).
4. **Performance reviews already hold six scores** (delivery, quality, SLA, responsiveness, cost, HSE); the mockup showed three.
5. **Approval steps already support parallel groups, due dates and escalation** (`parallel_group`, `due_at`, `escalated_to`, `escalation_note`); the mockup had no escalation control.
6. **Ticket comments have `is_internal`**, which implements the private-note boundary; vendor queries must filter on it.
7. **Service Desk SLA policy table is empty** though ticket SLA columns exist, so SLA timers show nothing until a policy is seeded.
8. **Many tables are empty** in the dev database (vendor reviews, approvals, scorecards, performance, insurance, references, directors, documents: 0 rows), so demo data must be seeded before any of these pages can show real rows (G-19).
9. **`users.partner_id`** is the only vendor-user link; no membership table (D-01).
10. **Invitations exist** (`fos_vendor_invitations`: status, expires_at, accepted_at, user_id, partner_id) and cover the S01-S04 states.
