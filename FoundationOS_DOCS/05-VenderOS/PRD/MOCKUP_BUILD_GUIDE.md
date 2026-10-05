# VendorFlow mockup build guide (combined)

**Date:** 2026-10-05. **Status:** working guide for finishing the mockup page by page, tab by tab, field by field.
**Marries:** (1) the FoundationOS session (this repo: CCC, VendorOS, ERP, live database, PRD pack, audit) and (2) the zip session (`vendorflow-project.zip`: Gold Build specs M1-M23, Journey 01 v24-v45 field files, E01-E10 workspaces, the zip mockup, Process Builder, 45 logged requests).
**Scope:** mockup and documents only. Nothing here changes the Laravel app, the database or migrations.

Companion files in `FoundationOS_DOCS/05-VenderOS/PRD/`: `VENDORFLOW_PRD_BUILD_SPEC.md` (rules, matrix, roles, states, stages, CCC fields, documents, modules), `MOCKUP_FIELD_AUDIT.md` (258 items mapped to real tables), `data/*.json` (field dictionary, document pack, data map, J01 crosswalk).

## 0. How to read this guide

1. **Section 1-2** say what each session built and how the two are merged.
2. **Section 3** is the registration field guide: every J01 field matched to the CCC dictionary, the live database, and both mockups.
3. **Section 4** maps the J01 review workspaces (v32-v45) to what the database already holds.
4. **Section 5** is the page-by-page, tab-by-tab guide. Work down it in order.
5. **Section 6** is the plan for merging the two HTML mockups. **Section 7** lists decisions the owner must make. **Section 8** is the definition of done for each page.

### Source of truth, in priority order
| # | Source | Gives us | Does not give |
|---|---|---|---|
| 1 | **Live CCC + database** (audited) | What data exists and where (201 wizard fields, 70 tables checked) | Page layout |
| 2 | **J01 v24-v45** (zip) | Field-level registration and review screens (96 fields, 10 review workspaces) | Pages for other modules |
| 3 | **Gold Build specs M1-M23 + sitemap** (zip) | Pages, tabs, lifecycles, rules | Field lists |
| 4 | **E01-E10 + READ_GUIDE** (zip) | The 10 enterprise workspaces and their tabs | Fields |
| 5 | **Both mockups** | Layout and behaviour already agreed with the owner | Real data |
| 6 | **PRD pack** (this session) | Rules, roles, states, acceptance criteria | |

Where two sources disagree the higher row wins, and the disagreement is listed in section 7.

## 1. What each session produced

| | This session (A) | Zip session (B) |
|---|---|---|
| Mockup file | `foundation_os/public/VendorFlow_Admin_Home.html` (about 860 KB) | `app/VendorFlow_Admin_Home.html` (about 545 KB) |
| Strongest at | Registration (13 steps, 201 CCC fields plus all J01 fields, uploads), documents pack, approvals, shared list and drawer, data map, mobile menu, schema-validated audit, PRD pack | Process Builder, Reports & BI (M10), passport ID card and QR, vendor unified inbox, vendor dashboard charts, J01 and module specs, request log |
| Weakest at | Builder internals, M10, passport ID card, working inbox | Registration (7 of about 121 fields), no real forms, no CCC knowledge, CRUD buttons are toasts |
| Locale | Nigeria, naira | Botswana, pula (its own J01 files are Nigerian: NGN, LGA, CAC) |
| Tooling | Node patch scripts, schema checks, data-map overlay | `scripts/validate.py` (div balance, JS parse, onclick handlers, icons, duplicate IDs) |
| Notes the other side lacks | CCC module, live DB, ERP tables, FOS admin menu structure | Gold Build specs, J01 fields, owner's request history, Process Builder vocabulary |

The zip session's own project memory says: *"Unknown: CCC / FOS contact center module. Not in any file here."* That gap is what this session fills.

## 2. Merge ledger

| # | Feature | A | B | Decision |
|--:|---|---|---|---|
| 1 | Admin menu | + Approval, Role Guide, Vendor Portal map | + Reports & BI, My Passport & ID Card, Staff Passports | **Union** of both |
| 2 | Vendor menu | 9 single-level entries | 8 sections with tabs also shown as expanded menu links (owner requests #25, #32, #33) | **A's 9 entries, plus expanded sub-links** that deep-link to each tab |
| 3 | Row actions | One View opening a drawer; no delete | View, Edit, Delete icons and a big Create button (request #33) | **Keep the shared list and drawer; show View/Edit/Delete icons by role and status; Delete only on drafts; big Create button on every page** |
| 4 | Passport | Merged into Company & Passport (5 tabs) | Separate pages with QR ID card, staff passports, usage history, CEO-only request/remove | **Keep A's tab; port B's ID card, QR, staff passports and usage history into it** |
| 5 | Registration | 13 steps, 201 CCC fields plus the J01-only fields | 4 steps, 7 fields | **A** (section 3 and spec section 6) |
| 6 | Documents | 15-document pack, lifecycle, uploads, camera | 18 sample documents, file-manager list and cards, change-request flow | **A's pack and statuses with B's file-manager views and change-request flow** |
| 7 | Communications | Tabs, AI summary, vendor tickets | Working vendor inbox: read, reply, filters, AI summary | **Port B's vendor inbox** |
| 8 | Reports & BI (M10) | none | 5 tabs, report builder, schedules, export centre | **Port B** |
| 9 | Builder | basic form list | Process Builder prototype (palette, properties, blocks, presets, preview, decision card) | **Port B**; keep zip vocabulary |
| 10 | Vendor dashboard | journey stepper, action items | payments chart, compliance by category, on-time donut, RFQ pipeline | **Both** |
| 11 | Data map, mobile bottom menu, touch styles | present | none | **Keep A** |
| 12 | Product matrix, implementation map | present | none | **Keep A**; refresh from the audit |
| 13 | PRD page | + Build Spec v2, data audit | M1-M23 with M10, M20, M23 and status dots | **Merge**: add B's M10, M20, M23 panes |
| 14 | Locale | Nigeria, naira | Botswana, pula | **Nigeria, naira** (J01 is Nigerian) |
| 15 | Naming | "Dynamic Form Builder" | "Dynamic Forms & Builder", "Process Builder by VendorOS" | **Decide** (D-16) |
| 16 | Validation tooling | Node checks | validate.py | **Adopt both**: add duplicate-ID and icon checks to the Node script |

## 3. Registration field guide: J01 to CCC to database to mockups

96 J01 fields (zip: v24-v31 and v44). Status: **have** = exists in CCC and the database; **partial** = something close exists; **calc** = derive, do not store; **new** = no field yet. "A" and "B" show whether each mockup has the field today.

| Status | Count | Share |
|---|--:|--:|
| have | 58 | 60% |
| partial | 20 | 21% |
| calc | 3 | 3% |
| new | 15 | 16% |

Mockup coverage: **A has 60 of 96**; **B has 4**.

### Step 1: Company profile (v24)  (maps to our steps 2, 3)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Company Name * | `companyName` | `partners_partners.name` | have | yes | yes |  |
| Registration No. | `registrationNumber` | `fos_partner_profiles.registration_number` | have | yes | no | also partners_partners.company_registry |
| Registration Date | `incorporationDate` | `fos_partner_profiles.incorporation_date` | have | yes | no |  |
| Company Type (Limited Liability, ...) | `companyType` | `fos_partner_profiles.company_type` | partial | yes | no | J01 lists legal forms; PRD lists 14 trade types; CCC has one select. Decide the option list (D-12) |
| Ownership (Private, ...) | `companyType` | `fos_partner_profiles.company_type` | calc | yes | n/a | derive from company type: Private Limited, Public Limited, Government Agency, NGO, Cooperative ...; no new field |
| Years in Business | - | `fos_partner_profiles.incorporation_date` | calc | n/a | n/a | derive from registration date; do not store |
| Registered Address | `street1` | `partners_partners.street1` | have | yes | no | plus street2 |
| Country | `countryId` | `partners_partners.country_id` | have | no | yes |  |
| State | `stateId` | `partners_partners.state_id` | have | yes | no |  |
| LGA | `town` | `fos_partner_profiles.town` | partial | yes | no | town/area is the nearest field; add an LGA picklist if it must be separate |
| Postal Code | `zip` | `partners_partners.zip` | have | yes | no |  |
| Telephone | `phone` | `partners_partners.phone` | have | yes | no |  |
| Mobile | `mobile` | `partners_partners.mobile` | have | yes | no |  |
| Email | `email` | `partners_partners.email` | have | yes | no |  |
| Website | `website` | `partners_partners.website` | have | yes | no |  |
| Accept Purchase Orders by Email? | `preferredMethod` | `fos_partner_profiles.preferred_method` | partial | yes | no | preferred method (Phone, Email, WhatsApp, SMS, Mail) plus the procurement email below already answer this; a single Yes/No is derived |
| Procurement Email | `email2` | `fos_partner_profiles.email2` | partial | yes | no | secondary email; relabel for vendors |
| Employees | `employeeCount` | `fos_partner_profiles.employee_count` | have | yes | no |  |
| Annual Turnover | `annualTurnover` | `fos_partner_profiles.annual_turnover` | have | yes | no |  |
| Branches | - | `fos_contact_locations.id` | partial | no | no | count of additional locations (locations repeater) |
| Upload Company Logo | slot `logo` | `partners_partners.avatar` | have | yes | no | CCC avatar / profile photo |
| Upload Company Profile | slot `d3` | `documents.id` | have | yes | no | document #3 |

### Step 2: Products and services (v25)  (maps to our step 5)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Product / Service Name | `newOfferingProductName` | - | partial | no | no | offering repeater also links an ERP product (newOfferingProductId, price, minimum quantity, lead time) |
| Category | - | `products_products.category_id` | partial | no | no | ERP product category; vendor picks an existing category or proposes a product |
| Sub Category | - | `products_products.category_id` | partial | no | no | ERP category tree (child of the category); no new field |
| Description | - | `products_products.description` | partial | no | no | ERP product description; for a proposed product |
| Brand | - | - | new | no | no |  |
| Manufacturer | - | - | new | no | no |  |
| Country of Origin | - | - | new | no | no |  |
| Price List (upload) | slot `d13` | `documents.id` | have | yes | no | document #13 with valid-till date |
| Product Catalogue (upload) | slot `catalogue` | `documents.id` | partial | yes | no | optional document |
| Technical Specifications (upload) | - | - | new | no | no | no slot yet |

### Step 3: Business types and trade capabilities (v26)  (maps to our step 4)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Business Type (Manufacturer, Importer, Distributor, Dealer, Trader, Service Provider) | `vendorCategory` | `fos_partner_profiles.vendor_category` | have | yes | no | CCC field is already labelled "Vendor Type / Category" and is a multi-select with admin-editable options: add the 6 business types (and the PRD vendor types) as picklist values; no schema change |
| Trade Capabilities (18 options: Electrical ... Consulting) | - | `fos_picklist_options.value` | partial | no | no | one new picklist (trade_capability, 18 values) on the same multi-select component, plus one column on the profile; no link table needed |
| Years Experience | - | - | new | no | no |  |
| Maximum Contract Value | - | - | new | no | no |  |
| Operational Regions | - | - | new | no | no |  |
| Capability Statement | - | `partners_partners.comment` | partial | no | no | free text; comment is the nearest column |

### Step 4: Contacts (v27)  (maps to our step 6)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Primary contact: Full Name | `firstName` | `partners_partners.name` | have | yes | yes | firstName, middleName, surname |
| Primary contact: Job Title | `jobTitle` | `fos_partner_profiles.designation` | have | no | no |  |
| Primary contact: Email | `email` | `partners_partners.email` | have | yes | yes |  |
| Primary contact: Mobile | `mobile` | `partners_partners.mobile` | have | yes | no |  |
| Primary contact: Office Phone | `phone` | `partners_partners.phone` | have | yes | no |  |
| Department contacts: Department | - | `fos_partner_profiles.organisation_unit` | partial | no | no | organisation unit exists on the person; no department on additional-contact rows |
| Department contacts: Contact Name | `newAdditionalContactFirstName` | `partners_partners.name` | have | yes | no |  |
| Department contacts: Position | `newAdditionalContactJobTitle` | `fos_partner_profiles.designation` | have | no | no |  |
| Department contacts: Email | `newAdditionalContactEmail` | `partners_partners.email` | have | yes | no |  |
| Department contacts: Phone | `newAdditionalContactPhone` | `partners_partners.phone` | have | yes | no |  |
| Executive Contact | `newAdditionalContactRole` | `fos_partner_profiles.role` | have | yes | no | role picklist |
| Notification Preferences (Email, SMS, PO alerts, Compliance reminders) | `preferredMethod` | `fos_partner_profiles.preferred_method` | partial | yes | no | one preferred method exists; alert toggles are new |

### Step 5: Customer references and project history (v28)  (maps to our step 7)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Customer | `newReferenceCustomerName` | `fos_vendor_references.customer_name` | have | yes | no |  |
| Contact Person | `newReferenceContactName` | `fos_vendor_references.contact_name` | have | yes | no |  |
| Telephone | `newReferencePhone` | `fos_vendor_references.contact_phone` | have | yes | no |  |
| Email | `newReferenceEmail` | `fos_vendor_references.contact_email` | have | yes | no |  |
| Contract Value | - | - | new | no | no | no column on fos_vendor_references |
| Years | - | - | new | no | no |  |
| Major Project History (Project, Client, Year, Value, Description) | - | - | new | no | no | needs a project-history table keyed by partner |
| Letters of Award (upload) | slot `d14` | `documents.id` | have | yes | no | document #14 |
| Purchase Orders / LPOs (upload) | slot `d14` | `documents.id` | have | yes | no | document #14 |
| Completion Certificates (upload) | - | - | new | no | no | no slot yet |

### Step 6: Directors, ownership, signatories (v29)  (maps to our step 8)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Director Name | `newDirectorName` | `vendor_directors.name` | have | yes | no |  |
| Position | `newDirectorDesignation` | `vendor_directors.position` | have | yes | no |  |
| Nationality | `nationalityId` | `fos_partner_profiles.nationality_id` | partial | no | no | person fields already exist for contacts; add to director rows |
| Director Email | `newAdditionalContactEmail` | `partners_partners.email` | partial | yes | no | person email exists; add to director rows (or link the director to a contact person) |
| Director Phone | `newAdditionalContactPhone` | `partners_partners.phone` | partial | yes | no | person phone exists; add to director rows |
| Ownership % | `newDirectorShareholding` | `vendor_directors.shareholding_percent` | have | yes | no |  |
| Authorized Signatory (name, position, email, phone) | `newDirectorAuthorizedSignatory` | `vendor_directors.is_signatory` | partial | yes | no | flag only |
| Signing Limit | - | - | new | no | no |  |
| Director ID (upload) | slot `d12` | `documents.id` | have | yes | no | document #12 |
| Passport Photograph (upload) | slot `d11` | `documents.id` | have | yes | no | document #11 |
| Signature Specimen (upload) | - | - | new | no | no | no slot yet |
| Board Resolution (upload) | - | - | new | no | no | no slot yet |

### Step 7: Banking, tax, VAT, payment terms (v30)  (maps to our step 9)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Bank Name | `newBankId` | `partners_bank_accounts.bank_id` | have | yes | no |  |
| Account Name | `newBankAccountHolderName` | `partners_bank_accounts.account_holder_name` | have | yes | no |  |
| Account Number | `newBankAccountNumber` | `partners_bank_accounts.account_number` | have | yes | no |  |
| SWIFT/BIC | `newBankSwiftCode` | `partners_bank_accounts.swift_code` | have | yes | no |  |
| IBAN | `newBankIban` | `partners_bank_accounts.iban` | have | yes | no |  |
| Currency | `newBankCurrencyId` | `partners_bank_accounts.currency_id` | have | yes | no |  |
| Tax Identification Number (TIN) | `taxId` | `partners_partners.tax_id` | have | yes | no |  |
| VAT Registration Number | `vatNumber` | `fos_partner_profiles.vat_number` | have | yes | no |  |
| Tax Office | `taxAuthority` | `fos_partner_profiles.tax_authority` | have | yes | no |  |
| Preferred Payment Method | - | `partners_partners.property_outbound_payment_method_line_id` | partial | no | no | ERP property exists; no vendor-facing field in CCC |
| Credit Terms (Days) | `paymentTerms` | `partners_partners.property_supplier_payment_term_id` | have | yes | no | picklist Immediate / 7 / 30 / 60 days |
| Finance Contact | `organisationUnit` | `fos_partner_profiles.organisation_unit` | partial | yes | no | a department contact whose department is Finance (org unit picklist already has Finance); no separate field |
| Cancelled Cheque (upload) | slot `d8` | `documents.id` | have | yes | no | document #8 |
| Bank Reference Letter (upload) | slot `d9` | `documents.id` | have | yes | no | document #9 |
| Tax Clearance Certificate (upload) | slot `d6` | `documents.id` | have | yes | no | document #6 |
| VAT Certificate (upload) | slot `d7` | `documents.id` | have | yes | no | document #7 |

### Step 8: Enterprise document and compliance centre (v31)  (maps to our step 11)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Document (15 required) | - | `vendor_documents.document_type` | have | no | no | the same 15 documents as the mandatory pack |
| Expiry Date | `newDocumentExpiryDate` | `vendor_documents.expiry_date` | have | no | no |  |
| Status | - | `vendor_documents.verification_status` | have | no | no | needs the 16-state lifecycle |
| Reviewer Comments | - | `vendor_documents.verification_notes` | have | no | no |  |
| Compliance dashboard (approved, pending, expired, reviewer assigned) | - | `vendor_documents.verified_by` | calc | n/a | n/a |  |

### Step 10: Final review and declaration (v44)  (maps to our steps 12, 13)

| J01 field | CCC key | Database | Status | A | B | Note |
|---|---|---|---|:-:|:-:|---|
| Final Reviewer | - | `fos_vendor_recommendations.recommended_by` | have | no | no |  |
| Executive Notes | - | `fos_vendor_recommendations.rationale` | have | no | no |  |
| Declaration: "I confirm all onboarding requirements are satisfied" | - | - | new | no | no | no declaration fields in CCC (G-08) |

### 3.1 J01 fields with no CCC field yet (15): the build list

- **Brand** (v25) 
- **Manufacturer** (v25) 
- **Country of Origin** (v25) 
- **Technical Specifications (upload)** (v25) - no slot yet
- **Years Experience** (v26) 
- **Maximum Contract Value** (v26) 
- **Operational Regions** (v26) 
- **Contract Value** (v28) - no column on fos_vendor_references
- **Years** (v28) 
- **Major Project History (Project, Client, Year, Value, Description)** (v28) - needs a project-history table keyed by partner
- **Completion Certificates (upload)** (v28) - no slot yet
- **Signing Limit** (v29) 
- **Signature Specimen (upload)** (v29) - no slot yet
- **Board Resolution (upload)** (v29) - no slot yet
- **Declaration: "I confirm all onboarding requirements are satisfied"** (v44) - no declaration fields in CCC (G-08)

Decision D-19: add these to CCC as vendor fields (recommended: a picklist or custom field where possible, a repeater column where the row exists), or drop them. The mockup already contains them, marked **NEW** until decided. A closer look reclassified 10 of the original 25 as covered by existing CCC or ERP fields (ownership, accept-POs, product category, sub category, description, business types, nationality, director email and phone, finance contact), and one as a data-only change (business types become picklist values); see spec section 6.3.

### 3.2 Things CCC has that J01 does not ask for

CCC holds fields J01 never lists and the registration still benefits from: trading name, parent company, incorporation date, social links, location presets (building, floor, office, desk), latitude and longitude, NIN, BVN, withholding tax number, tax clearance expiry, credit limit, insurance policies (type, provider, policy number, coverage, effective and expiry dates, broker), certifications (issuing body, number, issued and expiry dates, status), affiliations, assets, family members and important dates. These stay in the 16-step wizard (steps 3, 10, 11, 13).

### 3.3 Wizard structure: four descriptions reconciled

| J01 wizard (10 steps) | PRD M1 (16 steps) | CCC tabs (10) | Our mockup (13 steps) |
|---|---|---|---|
| 1 Company profile | 2 Company, 3 Address, 4 Registration details | Basic + Financials & Identity | 2 Company & registration, 3 Address & contact channels |
| 3 Business types | 5 Business information | Basic / Work | 4 Business type & capabilities |
| 2 Products | 6 Products and services | Work | 5 Products & services |
| 4 Contacts | 7 Contact persons | Contact | 6 Contacts |
| 5 References | 8 Customer references | Affiliations | 7 References & projects |
| 6 Directors | 9 Directors | Basic (directors) | 8 Directors, owners & signatories |
| 7 Banking, tax, payment | 10 Banking, 11 Tax | Financials & Identity | 9 Banking, tax & payment |
| (none) | 13 Compliance | Insurance + Certifications | 10 Insurance & certifications |
| 8 Documents | 12 Required documents | Documents | 11 Required documents |
| (none) | 14 Declaration | none (gap G-08) | 12 Declaration |
| 9-10 Review, final | 15 Review, 16 Submit | Review | 13 Review & submit |

**The 13-step navigation is the vendor-facing structure; the 10 CCC tabs are the data model.** Spec section 6.3 lists which similar fields were merged and which kept apart.

## 4. Review workspaces (J01 v32-v45) against the database

These are the buyer-side screens after a vendor submits. The database already holds most of what they need; the new parts are checklist definitions, tiers, and a few registers.

| Workspace (J01) | Stage | Checklist / fields in J01 | Decisions and outputs | Already in the database | New |
|---|---|---|---|---|---|
| Procurement review (v32) | S23 | Company registration verified; required documents complete; business experience; customer references; commercial capability (pass/fail, score, comments) | Approve, Approve with Conditions, Further Review Required, Reject; assign officer; target date; notes | `fos_vendor_stage_reviews` (stage, score, decision, findings, reviewer_id, completed_at); `fos_vendor_verification_checks`; `fos_vendor_recommendations` (recommended, recommended_with_conditions, more_information_required, not_recommended) | Reusable checklist definitions per stage (`fos_requirement_templates` is a product component table, not usable) |
| Technical evaluation (v33) | S24 | Engineering capability; production capacity; equipment and facilities; quality management; HSE compliance | Site visit required yes/no; reviewer; date; findings | stage review 24 | site-visit flag |
| Finance review (v34) | S25 | Bank reference verified; tax compliance valid; VAT registration; financial stability; credit terms acceptable | Credit rating; bank verification number; recommendation (Approve, Approve with Conditions, Reject) | stage review 25; `partners_bank_accounts`; verification checks | credit rating, bank verification reference |
| Compliance review (v35) | S26 | CAC registration; tax clearance; VAT certificate; insurance; sanctions and watchlist screening | Approve, Conditional Approval, Reject | stage review 26; `vendor_documents.expiry_date`; `fos_vendor_compliance_actions` | sanctions screening provider |
| Site inspection and audit (v36) | S28 | Office location verified; warehouse/factory; equipment; safety standards; staff competency; photos; corrective actions | Audit score, findings, critical issues | stage review 28; media for photos | audit and CAPA tables |
| Risk assessment (v37) | S30 | Financial, Operational, Legal, Cyber Security, ESG/HSE: level, impact, mitigation | Approve, Approve with Conditions, Escalate, Reject; risk owner | stage review 30 | risk register |
| Vendor scoring (v38) | S31-S32 | Weights: Procurement 20, Technical 25, Finance 20, Compliance 15, Inspection 10, Risk 10 | Approve, Approve with Conditions, Hold, Reject; tier Strategic / Preferred / Approved / Conditional; grade; executive comments | `fos_vendor_scorecards` (overall_score, dimension_scores, formula); `fos_vendor_recommendations` | vendor tier, grade, Hold |
| Multi-level approval (v39) | S33-S34 | Procurement Manager (sequential), Finance Manager (sequential), Compliance Head (parallel), Executive (final); SLA remaining | Approve, Reject, Request Info; escalate to Director or Executive Committee; digital signature | `fos_vendor_approval_steps` (step_order, parallel_group, reviewer_role, due_at, decision, comments, escalated_to, escalation_note) | digital signature, chain template |
| Vendor number and activation (v40) | S35-S38 | Vendor ID `VND-2026-000123`; category; activation date; default payment terms 30/45/60; sync to ERP; welcome email; portal access | Activate vendor | `vendor_passports.vendor_number`, `activated_at`; `fos_partner_profiles.vendor_number`, `vendor_number_assigned_at`; `fos_vendor_operational_readiness` | number-format rule; ERP sync; 45-day term (CCC offers Immediate, 7, 30, 60) |
| Contract management (v41) | S41 | Title; template (Standard Supply, Service Agreement, NDA, Framework); dates; value; upload; e-signature; renewal reminders; milestones | Publish | none | contracts and obligations tables |
| Final review (v44) | S33 | Eight-point validation checklist; final reviewer; executive notes; confirmation | Export PDF summary, Archive, Send to Executive | `fos_vendor_recommendations.recommended_by`, `rationale` | declaration, PDF export, archive state |
| Executive 360 (v45) | S44-S45 | Vendor 360 summary; OTIF, quality, annual spend; actions | Approve, Request Reassessment, Suspend, Blacklist | `vendor_passports` (status, suspended_at, terminated_at); ERP spend from `accounts_account_moves` | blacklist state, OTIF calculation |

Vendor identifiers differ across files: J01 v40 `VND-2026-000123`, E02 `VND-2026-00123`, mockup passport `VP-00842`. Treat **vendor number** (assigned at activation) and **passport number** as two identifiers (D-21).

## 5. Page-by-page, tab-by-tab guide

### Buyer side (Vendor Admin and internal roles)

#### Dashboard  `dashboard`

| | |
|---|---|
| Module / spec | M10 / M15 / E01 Executive Dashboard; role dashboards in PRD roles |
| Tabs (merged target) | Overview \| Approvals \| Analytics \| Alerts |
| Actions and roles | Executive Report, Quick Approval; every role sees its own dashboard (Procurement, Finance, Audit, Warehouse, User Admin) |
| Mock A now | KPI strip, vendors-needing-attention table, recent activity, module grid by edition; per-role KPI sets; Data map chips. (12 KPIs, 2 tables, 0 tabs) |
| Mock B now | Same base; no role-specific dashboards beyond the Vendor Portal one. (12 KPIs, 2 tables, 0 tabs) |
| Data sources (audit) | VendorOS 5, ERP 3, NEW 2, CCC 2, Derived 5, FOS 3 |
| No data source yet | Contracts Expiring (30d); AI Suggestions |

**Do next**

- Add the four E01 tabs (Overview, Approvals, Analytics, Alerts); Approvals tab reuses the Approval queue.
- Give Procurement, Finance, Audit, Warehouse and User Admin their own KPI sets and "welcome back, name, title, department" line (zip request #18).
- Wire each KPI to its source from the data audit (CCC / VendorOS / ERP / derived).

#### Registration & Onboarding  `reg`

| | |
|---|---|
| Module / spec | M1 / J01 v24-v31, v44; PRD M1 (16 steps, folded into 13; 7 entry paths) |
| Tabs (merged target) | In progress \| Invitations \| Drafts \| Bulk import (entry paths: new, update, annual revalidation, invitation, self, bulk, ERP sync) |
| Actions and roles | New Vendor (wizard), Invite vendor, Import template, Resume draft; roles: Vendor Admin W, Procurement/Finance/Audit V |
| Mock A now | 13-step wizard from the CCC dictionary (201 fields) plus all J01 fields, per-section uploads, declaration step, required-field gating; In-progress table. (0 KPIs, 1 tables, 0 tabs) |
| Mock B now | 4-step modal, 7 inputs (about 3% of J01). (0 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | CCC 3, Derived 1, VendorOS 4 |

**Do next**

- Keep A as the base. The J01-only fields are in the wizard already, marked NEW where no CCC field exists (section 3.1 of this guide).
- Add Invitations tab (fos_vendor_invitations: status, expires, resend, revoke).
- Add step status icons (Completed, Current, Pending, Error, Review, Locked) and the Help panel the M1 spec asks for.

**Owner decision:** D-12 company-type options; D-19 accept the 25 J01-only fields into CCC

#### Approval  `approval`

| | |
|---|---|
| Module / spec | M3 / J01 v39 Multi-Level Approval; PRD section 3.3 |
| Tabs (merged target) | Queue \| Approval chain \| History & audit |
| Actions and roles | Approve, Reject, Request information, Escalate (findings required); roles: Executive final, reviewers per stage |
| Mock A now | Queue, chain, history; findings-required rule; escalation. (4 KPIs, 0 tables, 3 tabs) |
| Mock B now | Nav item only (toast). (page not present) |
| Data sources (audit) | VendorOS 11, Derived 1, CCC 1 |

**Do next**

- Show SLA remaining, stage type (sequential or parallel), digital-signature record on each decision (J01 v39).
- Add escalation targets: Director, Executive Committee (J01 v39).

#### Vendor Passport 360  `passport`

| | |
|---|---|
| Module / spec | M5 / E02 Vendor Passport 360; J01 v45; READ_GUIDE workspace 2 |
| Tabs (merged target) | Overview \| Main Passport & ID Card \| Company \| Contacts \| Directors \| Banking \| Tax \| Documents \| Certificates \| Insurance \| Products & Services \| Performance \| Contracts \| Staff Access \| Communications \| Timeline & Activity Log \| Notes |
| Actions and roles | Edit profile, Suspend, Request reassessment, Blacklist (executive); view only for most roles |
| Mock A now | Tabs: Overview, Documents, Performance, Contracts, Staff Access, Communications, Timeline. (4 KPIs, 4 tables, 8 tabs) |
| Mock B now | Tabs: Overview, Main Passport (ID card, QR, password request, usage history), Staff Access, Documents, Performance, Contracts; staff passports. (7 KPIs, 4 tables, 7 tabs) |
| Data sources (audit) | VendorOS 4, NEW 7, CCC 6, FOS 2 |
| No data source yet | Risk Score; Active Contracts; Contract; Value; Renewal; Access Level; Passport Usage History |

**Do next**

- Port B: Main Passport tab with digital ID card, QR code, usage history and scan KPIs.
- Add Company, Contacts, Directors, Banking, Tax, Certificates, Insurance, Products & Services tabs as read views over CCC data (fos_vendor_insurance_policies, fos_certifications, vendor_directors, partners_bank_accounts).
- Add executive actions from J01 v45: Approve, Request Reassessment, Suspend, Blacklist (blacklist is a new state).

**Owner decision:** Where the digital vendor card shows: Passport page and company profile only (zip request #26-27)

#### Document Management & Verification  `docs`

| | |
|---|---|
| Module / spec | M2 / J01 v31; PRD M2 |
| Tabs (merged target) | Document Queue \| Upload Document \| Expiring \| Expired \| Versions & history |
| Actions and roles | Approve, Reject (reason), Request replacement, Assign reviewer, Download; roles: Vendor Admin W, reviewers V |
| Mock A now | Queue, expired, expiring-next-30-days; KPI strip. (4 KPIs, 2 tables, 0 tabs) |
| Mock B now | Queue and expired. (4 KPIs, 2 tables, 0 tabs) |
| Data sources (audit) | CCC 10, Static 1, NEW 1 |
| No data source yet | Document versions |

**Do next**

- Show the 16-state lifecycle and reviewer comments (vendor_documents.verification_status / verification_notes).
- Add Versions tab (needs version columns, D-02).
- Reuse the standard list + drawer.

#### Supplier Assessment & Due Diligence  `assessment`

| | |
|---|---|
| Module / spec | M3 / J01 v32-v38 |
| Tabs (merged target) | Procurement \| Technical \| Finance \| Compliance/Legal \| HSE \| ESG \| Information Security \| Site Inspection \| Risk \| Scoring & Recommendation |
| Actions and roles | Save review, Forward to next review, Decide (approve, approve with conditions, further review, reject) |
| Mock A now | Assessment breakdown panel only. (0 KPIs, 0 tables, 0 tabs) |
| Mock B now | Assessment breakdown panel only. (0 KPIs, 0 tables, 0 tabs) |
| Data sources (audit) | VendorOS 5 |

**Do next**

- Build the review workspaces from the review map (section 4 of this guide): each has a checklist table (item, pass/fail, score, comments), a recommendation block, owner, date and notes.
- Scoring tab: weights Procurement 20, Technical 25, Finance 20, Compliance 15, Inspection 10, Risk 10; grade and vendor tier.

#### Induction & Certification  `hse`

| | |
|---|---|
| Module / spec | M4 / E06 Training & Competency; PRD M4 |
| Tabs (merged target) | Courses \| Mandatory \| Assessments \| Certificates \| Competency \| Expiry \| Reports |
| Actions and roles | Assign training, Issue certificate, Allow retake, Publish course |
| Mock A now | Certification register, test, courses list, attempts list. (0 KPIs, 1 tables, 0 tabs) |
| Mock B now | Certification register, test. (0 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | CCC 4, NEW 2 |
| No data source yet | Score; Take the Site Safety Induction Test |

**Do next**

- Add Mandatory, Competency matrix and Expiry tabs (E06).
- New data: hse_courses, hse_attempts (audit section 4).

#### Audit & Governance (CORE)  `audit`

| | |
|---|---|
| Module / spec | M9 / E03 Performance, Risk, Compliance; J01 v36 |
| Tabs (merged target) | Audits \| Findings \| CAPA \| Site inspections \| ESG \| Renewals \| History |
| Actions and roles | Plan audit, Record finding, Raise CAPA |
| Mock A now | Findings, CAPA and audit plan lists (new-model UI). (4 KPIs, 1 tables, 0 tabs) |
| Mock B now | Recent findings table only. (4 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | Derived 1, NEW 6, CCC 1 |
| No data source yet | Open Findings; Overdue Corrective Actions; Audits This Quarter; Finding; Severity; Status |

**Do next**

- Add Site Inspection checklist form (J01 v36: office, warehouse/factory, equipment, safety, staff competency; photos; corrective actions).

#### Enterprise Risk Management (CORE)  `erm`

| | |
|---|---|
| Module / spec | M12 / J01 v37 Risk Assessment |
| Tabs (merged target) | Risk register \| Risk matrix \| Assessments \| Trends |
| Actions and roles | Add risk, Assess, Add mitigation |
| Mock A now | Risk register list. (4 KPIs, 1 tables, 0 tabs) |
| Mock B now | Risk table only. (4 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | NEW 7, CCC 1 |
| No data source yet | Low Risk Vendors; Medium Risk; High Risk; Governance Score; Risk Category; Score; Trend |

**Do next**

- Add the J01 v37 risk matrix form: categories Financial, Operational, Legal, Cyber Security, ESG/HSE; level, impact, mitigation; overall recommendation (approve, approve with conditions, escalate, reject); risk owner.

#### Procurement Workspace  `procurement`

| | |
|---|---|
| Module / spec | M6 / E05 Procurement Workspace |
| Tabs (merged target) | Overview \| RFQs \| Bids \| Evaluations \| Purchase Orders \| Suppliers \| Categories \| Approvals \| Analytics |
| Actions and roles | Create RFQ, New Purchase Order, Invite vendors, Evaluate, Award; ERP rows are read or linked, never copied |
| Mock A now | RFQs, POs, Deliveries & Inspection tabs. (8 KPIs, 2 tables, 3 tabs) |
| Mock B now | Same. (8 KPIs, 2 tables, 3 tabs) |
| Data sources (audit) | ERP 13, NEW 3, CCC 1, Static 1 |
| No data source yet | Awaiting Evaluation; Open Defects; Vendors Invited |

**Do next**

- Add Bids, Evaluations, Suppliers, Categories, Approvals, Analytics tabs (E05).
- RFQ create form: vendors invited, closing date, lines, attachments (new rfq tables).

#### Contract Lifecycle Management (CORE)  `clm`

| | |
|---|---|
| Module / spec | M11 / E04; J01 v41 |
| Tabs (merged target) | Overview \| Contracts \| Pricing \| SLAs \| Spend \| Invoices \| Renewals \| E-signatures \| History |
| Actions and roles | New Contract, Publish, Renew; templates Standard Supply, Service Agreement, NDA, Framework Agreement |
| Mock A now | Contracts and obligations lists. (0 KPIs, 1 tables, 0 tabs) |
| Mock B now | Contract register only. (0 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | NEW 5, CCC 1 |
| No data source yet | Contract; Value; Renewal; Status; Contract Register |

**Do next**

- Add contract form (J01 v41: title, template, start, end, value, upload, e-signature status, auto-renewal reminders, milestones).

#### Warehouse & Receiving  `warehouse`

| | |
|---|---|
| Module / spec | M6 workflow / zip requests #18, #24: Receive, Approve, Procurement, Finance |
| Tabs (merged target) | Receiving workflow \| Delivery notes archive \| Expected deliveries \| Defects \| Reports |
| Actions and roles | Capture delivery note (photo), Capture defect, Approve, Send to Procurement; roles: Warehouse W |
| Mock A now | Workflow, archive (list/cards), expected deliveries; drawer with accept/reject. (4 KPIs, 2 tables, 3 tabs) |
| Mock B now | Workflow, archive, expected. (4 KPIs, 2 tables, 3 tabs) |
| Data sources (audit) | ERP 9, CCC 2, NEW 1 |
| No data source yet | Condition |

**Do next**

- Add Defects and Reports tabs; defect capture form with photos (needs fos_receipt_inspections).

#### Finance & Payments  `finance`

| | |
|---|---|
| Module / spec | M7 / J01 v34; PRD M7 |
| Tabs (merged target) | Invoices \| Payments \| Matching \| Payment terms \| Reports |
| Actions and roles | Approve invoice, Dispute, Pay; roles: Finance W |
| Mock A now | Invoice list and KPIs. (6 KPIs, 1 tables, 0 tabs) |
| Mock B now | Same. (6 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | ERP 6, NEW 2, CCC 1 |
| No data source yet | Disputed; PO/GRN three-way match |

**Do next**

- Add Matching tab (PO, goods receipt, invoice) and Payments tab; dispute reason (new).

#### Vendor Performance & SLA  `perf`

| | |
|---|---|
| Module / spec | M8 / E03 |
| Tabs (merged target) | Scorecards \| KPIs \| SLA \| Improvement plans \| Benchmarking \| Trends |
| Actions and roles | Run assessment, Generate scorecard |
| Mock A now | Six scores and review period (matches fos_vendor_performance_reviews). (0 KPIs, 2 tables, 0 tabs) |
| Mock B now | Three scores. (0 KPIs, 2 tables, 0 tabs) |
| Data sources (audit) | CCC 1, VendorOS 6 |

**Do next**

- Add SLA breach analytics and trend tabs (CORE).

#### Inbox & Communications  `comms`

| | |
|---|---|
| Module / spec | M13 / E07; J01 v43 |
| Tabs (merged target) | Unified Inbox \| Direct Messages \| Email \| WhatsApp \| Announcements \| Alerts \| Tasks \| Support tickets \| Surveys |
| Actions and roles | Compose, Reply, Assign, Broadcast, Create ticket (General, Technical, Finance, Compliance) |
| Mock A now | Tabs and AI summary; vendor ticket tab on Passport. (0 KPIs, 0 tables, 8 tabs) |
| Mock B now | Tabs, AI summary, compose and send working. (0 KPIs, 0 tables, 8 tabs) |
| Data sources (audit) | FOS 4, NEW 4 |
| No data source yet | Direct Messages; WhatsApp; Announcements; AI Summary |

**Do next**

- Port B working compose / read / reply behaviour; scope every thread by vendor context (fos_communication_contexts).
- WhatsApp stays a provider-adapter tab marked not connected.

#### Executive Dashboard & Reporting (M10)  `reports`

| | |
|---|---|
| Module / spec | M10 / E10 Reports & BI; PRD M10 (drafted, no spec file) |
| Tabs (merged target) | Executive Overview \| Report Library \| Report Builder \| Scheduled Reports \| Export Centre |
| Actions and roles | Run, Save, Schedule, Export |
| Mock A now | Not present. (page not present) |
| Mock B now | Present: 5 tabs, 14 inputs, 21 table columns, report builder and schedules. (11 KPIs, 5 tables, 9 tabs) |

**Do next**

- Port B page and its rpt* functions into A.
- Confirm M10 scope with the owner (zip asked).

**Owner decision:** D-17 confirm M10 scope

#### Workflow & Business Process Automation  `workflow`

| | |
|---|---|
| Module / spec | M16 / PRD M16 |
| Tabs (merged target) | Automation rules \| Vendor lifecycle kanban |
| Actions and roles | Create rule, Edit (new version), Publish |
| Mock A now | Rules list plus existing kanban. (0 KPIs, 0 tables, 3 tabs) |
| Mock B now | Rules and kanban. (0 KPIs, 0 tables, 3 tabs) |
| Data sources (audit) | NEW 1, VendorOS 1 |
| No data source yet | Automation Rules |

**Do next**

- Rule form: trigger, condition, action; version history.

#### Integration Hub & API (CORE)  `integration`

| | |
|---|---|
| Module / spec | M17 / PRD M17 |
| Tabs (merged target) | Connectors \| API keys \| Webhooks \| Logs |
| Actions and roles | Connect, Revoke key, Retry delivery |
| Mock A now | Connectors, keys, webhooks lists. (0 KPIs, 0 tables, 0 tabs) |
| Mock B now | Empty page. (0 KPIs, 0 tables, 0 tabs) |
| Data sources (audit) | FOS 2, NEW 2 |
| No data source yet | Connectors (ERP, banking, tax, BI); Webhooks |

**Do next**

- Connector setup forms; encrypted credentials.

#### AI Copilot  `ai`

| | |
|---|---|
| Module / spec | M18 / PRD M18 |
| Tabs (merged target) | Copilot \| Suggestions \| Settings |
| Actions and roles | Ask, Accept suggestion |
| Mock A now | Suggestions list. (0 KPIs, 0 tables, 0 tabs) |
| Mock B now | Copilot panel and page. (0 KPIs, 0 tables, 0 tabs) |
| Data sources (audit) | FOS 1, NEW 1 |
| No data source yet | OCR, predictive risk, generative reports |

**Do next**

- Port B copilot panel behaviour; suggestions never change data without a user action.

#### PLUS Procurement Hub  `plusprocure`

| | |
|---|---|
| Module / spec | M19 / E05 (PLUS parts), PRD M19 |
| Tabs (merged target) | Demand planning \| Sourcing events \| Supplier collaboration \| Analytics |
| Actions and roles | Raise RFQ, Create sourcing event |
| Mock A now | Present. (4 KPIs, 2 tables, 4 tabs) |
| Mock B now | Present. (4 KPIs, 2 tables, 4 tabs) |
| Data sources (audit) | NEW 2 |
| No data source yet | Category / Forecast Demand / Current Coverage; Event / Type / Suppliers / Est. Value |

**Do next**

- Replace sample amounts; add RFI/RFP/eTender/auction forms.

#### Dynamic Form Builder (Process Builder)  `builder`

| | |
|---|---|
| Module / spec | M20 / M21 / zip docs/process-builder-source-of-truth.md |
| Tabs (merged target) | New Form \| Existing Forms \| Templates \| Blocks \| Preview \| Schema |
| Actions and roles | Add field, Add block (repeater), Load Preset, Load from Previous Form, Save (decision card) |
| Mock A now | Basic form list and new-form tab. (0 KPIs, 1 tables, 3 tabs) |
| Mock B now | Prototype with palette, properties panel, repeater Block, Presets, Templates, custom Block/Template, Preview (device frames, zoom), decision card with one Save. (4 KPIs, 3 tables, 7 tabs) |
| Data sources (audit) | FOS 2 |

**Do next**

- Port B builder (35 functions: palette, properties, blocks, presets, preview, saveBuilderPage).
- Keep the zip vocabulary: Field type, Block, Template, Preset ("Load Preset"), Load from Previous Form.
- Back it with the CCC contract (shared_process_form_json) and LaraBuilder.

**Owner decision:** D-16 builder name and scope

#### System Configuration  `admin`

| | |
|---|---|
| Module / spec | M15 / E09 Administration |
| Tabs (merged target) | Users \| Roles & Permissions \| Departments \| Workflows \| Approval Matrix \| Categories \| Templates \| Integrations \| Notifications \| Settings \| Audit Log |
| Actions and roles | Create user, Invite, Assign role, Edit permissions |
| Mock A now | Users, roles matrix, business units. (0 KPIs, 4 tables, 0 tabs) |
| Mock B now | Users, roles, business units. (0 KPIs, 2 tables, 0 tabs) |
| Data sources (audit) | FOS 4, ERP 3 |

**Do next**

- Add Approval Matrix and Audit Log tabs; seed the PRD role matrix.

#### Editions & Licensing  `editions`

| | |
|---|---|
| Module / spec | M22 / M23 / PRD M22, M23 |
| Tabs (merged target) | Compare \| Entitlements |
| Actions and roles | Preview edition |
| Mock A now | Present; tier tags corrected. (0 KPIs, 0 tables, 0 tabs) |
| Mock B now | Present. (0 KPIs, 0 tables, 0 tabs) |
| Data sources (audit) | NEW 1 |
| No data source yet | Edition comparison |

**Do next**

- Entitlements tab driven by the feature matrix (F-IDs).

#### Role & Menu Guide  `role-guide`

| | |
|---|---|
| Module / spec | M15 / PRD roles |
| Tabs (merged target) | One tab per role |
| Actions and roles | View only |
| Mock A now | Present. (36 KPIs, 0 tables, 9 tabs) |
| Mock B now | Not present. (page not present) |
| Data sources (audit) | Static 1 |

**Do next**

- Update the vendor menu scope to match the merged menu.

#### PRD  `prd`

| | |
|---|---|
| Module / spec | all / PRD |
| Tabs (merged target) | Overview \| Module panes \| Build Spec v2 \| Mockup Data Audit |
| Actions and roles | View only |
| Mock A now | Extended with Build Spec v2 and the data audit. (0 KPIs, 40 tables, 0 tabs) |
| Mock B now | M1-M23 panes with status dots. (0 KPIs, 11 tables, 0 tabs) |
| Data sources (audit) | Static 1 |

**Do next**

- Add M10, M20 and M23 panes from B; keep green/red status dots.

#### Support  `support`

| | |
|---|---|
| Module / spec | M13 / PRD |
| Tabs (merged target) | Chat \| Email \| Knowledge base \| My tickets |
| Actions and roles | Create ticket |
| Mock A now | Present. (0 KPIs, 1 tables, 0 tabs) |
| Mock B now | Present. (0 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | FOS 4, NEW 1 |
| No data source yet | Satisfaction |

**Do next**



#### Vendor Portal map  `selfservice`

| | |
|---|---|
| Module / spec | M14 / PRD M14 |
| Tabs (merged target) | Sitemap \| Standard fields |
| Actions and roles | View only |
| Mock A now | Present (sitemap and field standard). (0 KPIs, 2 tables, 0 tabs) |
| Mock B now | Hub cards page. (0 KPIs, 0 tables, 0 tabs) |
| Data sources (audit) | Static 2 |

**Do next**

- Update to the merged menu.

### Vendor-facing (Vendor Hub)

#### Vendor Home (dashboard)  `vendor-home`

| | |
|---|---|
| Module / spec | M14 / E08 Vendor Portal; J01 v42 |
| Tabs (merged target) | Journey \| Action items \| Activity \| Charts |
| Actions and roles | Quick actions: Update profile, Upload documents, Respond to RFQs, View POs, Submit invoice, Raise ticket |
| Mock A now | Onboarding journey stepper, KPIs, action items, activity. (12 KPIs, 2 tables, 0 tabs) |
| Mock B now | Vendor-only dashboard: payments received chart, compliance by category, on-time delivery donut, RFQ pipeline. (12 KPIs, 2 tables, 0 tabs) |
| Data sources (audit) | VendorOS 5, ERP 3, NEW 2, CCC 2, Derived 5, FOS 3 |
| No data source yet | Contracts Expiring (30d); AI Suggestions |

**Do next**

- Merge: keep A journey and action items; port B charts.
- No digital card or passport banner on Home (zip request #27).

#### Company & Passport  `myprofile`

| | |
|---|---|
| Module / spec | M5 / M14 / J01 v24, v42; zip requests #21, #25-#27, #34 |
| Tabs (merged target) | Overview \| Contacts \| Banking & Tax \| Passport & ID Card \| Staff Access |
| Actions and roles | Edit profile (until stage 18, then change request); CEO only: Request or Remove Passport; staff passports with QR |
| Mock A now | Five tabs; passport tab with summary and link. (4 KPIs, 0 tables, 7 tabs) |
| Mock B now | Separate "My Company Profile" (3 tabs), "My Passport & ID Card" and "Staff Passports" with QR ID card, view, edit, create, password request. (4 KPIs, 1 tables, 3 tabs) |
| Data sources (audit) | VendorOS 3, CCC 13, Derived 1, NEW 1 |
| No data source yet | Staff Access list |

**Do next**

- Port B ID card, QR, staff passports and usage history into the Passport tab.
- CEO versus staff gating: staff see only what they are assigned to (zip request #25).

**Owner decision:** D-13 menu shows tabs as links

#### Documents  `mydocuments`

| | |
|---|---|
| Module / spec | M2 / M14 / J01 v31; zip requests #20, #33 |
| Tabs (merged target) | All (List/Cards) \| Company \| Tax & Banking \| Identity & Forms \| Commercial & Certifications |
| Actions and roles | Upload, Replace, Change request, View; big Upload button |
| Mock A now | 15 mandatory documents with live counts and direct upload. (4 KPIs, 0 tables, 6 tabs) |
| Mock B now | 18 sample documents, list/cards toggle, change-request flow, simulated staff approval. (4 KPIs, 0 tables, 5 tabs) |
| Data sources (audit) | CCC 9, Static 1 |

**Do next**

- Keep A pack and statuses; keep B file-manager list/cards and change-request flow; add preview thumbnails for images.

#### Communications  `mycomms`

| | |
|---|---|
| Module / spec | M13 / M14 / J01 v43; zip requests #28, #30, #32, #34 |
| Tabs (merged target) | Unified Inbox \| Messages \| Announcements \| Alerts |
| Actions and roles | Compose, Send as email, Reply, Open ticket |
| Mock A now | Chat pane, announcements, alerts. (4 KPIs, 0 tables, 0 tabs) |
| Mock B now | Vendor unified inbox: read and reply to email, filters, AI summary, message sources. (4 KPIs, 0 tables, 2 tabs) |
| Data sources (audit) | FOS 4, NEW 2 |
| No data source yet | Announcements; AI Summary |

**Do next**

- Port B vendor inbox (renderVendorInbox, openVendorMail, vmFilter, vmSendReply, mcTab).

#### Invoices & Payments  `myinvoices`

| | |
|---|---|
| Module / spec | M7 / M14 / J01 v42 |
| Tabs (merged target) | All \| Outstanding \| Paid |
| Actions and roles | Submit invoice (own PO), View; big Submit button |
| Mock A now | Standard list and drawer; extras from ERP columns. (4 KPIs, 0 tables, 3 tabs) |
| Mock B now | Tabbed lists with view/edit/delete icons. (4 KPIs, 3 tables, 3 tabs) |
| Data sources (audit) | ERP 10, Derived 1, NEW 1 |
| No data source yet | Submit Invoice |

**Do next**

- Add create-invoice form (PO, lines, attachment); PO-value check.

#### Orders & RFQs  `myrfqpo`

| | |
|---|---|
| Module / spec | M6 / M14 / E05, E08 |
| Tabs (merged target) | RFQs \| Purchase Orders \| Deliveries |
| Actions and roles | Submit quotation, Accept/Decline, Acknowledge PO/delivery |
| Mock A now | Standard lists. (4 KPIs, 0 tables, 3 tabs) |
| Mock B now | Tabbed lists with Acknowledge. (4 KPIs, 3 tables, 3 tabs) |
| Data sources (audit) | ERP 9, NEW 3 |
| No data source yet | Awaiting Acknowledgement; Submit Quotation / accept / decline / questions; Delivery acknowledge |

**Do next**

- Add quotation form (lines, validity, attachments).

#### Training & HSE  `myhse`

| | |
|---|---|
| Module / spec | M4 / M14 / E06 |
| Tabs (merged target) | Courses \| Certificates \| Induction |
| Actions and roles | Book slot, Take test |
| Mock A now | Standard lists. (4 KPIs, 0 tables, 3 tabs) |
| Mock B now | Tabbed lists. (4 KPIs, 3 tables, 3 tabs) |
| Data sources (audit) | NEW 4, CCC 2, Derived 1 |
| No data source yet | Courses Completed; Pending; Courses list; Induction list |

**Do next**

- Link the test to the HSE page; show certificate expiry.

#### Requests  `requests`

| | |
|---|---|
| Module / spec | M14 / zip requests #31-#32 |
| Tabs (merged target) | New request \| My requests |
| Actions and roles | Submit; six request types (service, passport, HSE, training slot, certificate re-issue, permit) |
| Mock A now | One form with type selector plus list. (0 KPIs, 0 tables, 3 tabs) |
| Mock B now | Six separate links and cards. (0 KPIs, 1 tables, 0 tabs) |
| Data sources (audit) | FOS 5 |

**Do next**

- Keep one form; add the six types as menu sub-links (deep links) so both preferences are met.

**Owner decision:** D-13

## 6. Merging the two HTML mockups

**Base:** mockup A (this repo). Port the B-only features into it. Do not replace A with B (A is ahead on registration, documents, approvals, audit, mobile and data map; B is ahead on builder, reports, passport ID card, inbox and charts).

| Order | Port from B | B functions / page | Lands in A as | Watch out |
|--:|---|---|---|---|
| 1 | Reports & BI (M10) | `page-reports`, `rptTab`, `rptRun`, `rptSave`, `rptNewSchedule`, `rptSaveSchedule` | new page and nav item "Reports & BI" | New page id, no collisions; use the shared list and drawer for the report library |
| 2 | Passport ID card, QR, staff passports, usage history | `initQr`, `requestPassword`, `viewStaffCard`, `requestStaffPassport` | "Main Passport & ID Card" tab on admin Passport 360 and "Passport & ID Card" tab on Company & Passport | CEO versus staff gating; digital card only on Passport and company profile |
| 3 | Vendor unified inbox | `renderVendorInbox`, `openVendorMail`, `vmFilter`, `vmSendReply`, `mcTab` | vendor Communications page | Scope by vendor; private notes never shown |
| 4 | Vendor dashboard charts | payments received, compliance by category, on-time delivery donut, RFQ pipeline (markup in `page-dashboard`) | vendor Home | Use naira and real KPI sources |
| 5 | Process Builder | `renderPalette`, `addCustomBlock`, `openCustomModal`, `createCustomEntry`, `saveBuilderPage`, `setPreviewDevice`, `setPreviewZoom`, `togglePreviewFull`, `renderPreview`, `duplicateBuilderField`, `openFieldProperties`, `updateFieldAttr`, `renderPropertiesPanel`, `setPropsSubtab`, `renderBlockCard`, `addRepeaterRow`, `setBlockView`, `loadBlockPreset`, `loadFromPreviousForm`, `addBuilderTemplate`, `customModal` | Dynamic Form Builder page | **Do not port B's `wizardRender`** (old 4-step wizard): A replaced it with the 16-step wizard. Namespace builder code (`fb-`) |
| 6 | PRD panes M10, M20, M23 and status dots | PRD section of B | PRD page | Keep A's Build Spec v2 group |
| 7 | Vocabulary and menu labels | B menu labels | both | Decide D-16 |

**Method (same as before, one change per script):** back up the file; patch with an idempotent Node script; check `<div>` open and close counts; parse every `<script>`; run the page and sweep every page at 1280 and 375 px for sideways scroll and console errors. Add B's checks to the script: duplicate IDs, every `onclick` handler defined, every icon present in `ICONS`.

## 7. Decisions needed from the owner

| ID | Decision | Options | Recommendation |
|---|---|---|---|
| D-11 | Which mockup is the base | A or B | **A**, port B's features (section 6) |
| D-12 | Company type options | J01 legal forms / PRD 14 trade types / CCC single select | Keep CCC `companyType` for legal form; add vendor business types as a multi-select (section 3) |
| D-13 | Vendor menu | 9 entries only / entries plus expanded tab links | **Entries plus expanded tab links** (meets owner requests #25, #32, #33) |
| D-14 | Row icons on vendor lists | view only / view, edit, delete | View, Edit, Delete by role and status; Delete only on drafts |
| D-15 | Locale | Botswana pula / Nigeria naira | **Nigeria naira** |
| D-16 | Builder name and scope | "Dynamic Form Builder" / "Dynamic Forms & Builder" / standalone "Process Builder by VendorOS" | Standalone Process Builder (zip decision) shown in VendorFlow as Dynamic Form Builder; keep Block, Template, Preset vocabulary |
| D-17 | M10 scope | as drafted by B / adjust | Confirm (B asked; no spec file) |
| D-18 | Registration structure | PRD 16 steps / J01 10 steps / 13-step flow | **13 steps** (merges registration details, banking and tax, review and submit; gives business type its own step), J01 folded in (section 3.3) |
| D-19 | The 15 J01-only fields | add to CCC / drop | Add (picklists and custom fields first) |
| D-20 | Review workspaces | build per J01 v32-v38 / one generic review form | Per J01: the checklists differ per stage |
| D-21 | Vendor number versus passport number | one / two identifiers | Two: vendor number at activation, passport number for the card |

## 8. Definition of done for a mockup page

A page is finished when every box is true:

- [ ] Menu label matches the contract; page has a breadcrumb and a header with one prominent **Create** button where the user can create something.
- [ ] KPI strip unique to the page (not generic), each KPI tied to a source in the audit.
- [ ] Tabs match section 5; each tab is also a menu link (deep link) for vendor pages.
- [ ] Lists use the shared list and drawer; row icons follow D-14; empty, loading and error states exist.
- [ ] Every form field has a key from the field dictionary or is marked **NEW**; required, validation and sensitive flags are set; uploads sit in the section that needs them.
- [ ] Statuses use the shared badge vocabulary and the document and vendor lifecycles in the PRD pack.
- [ ] Roles and edition tag are correct (FLEX green F, CORE purple C, PLUS orange P; platform extensions marked S).
- [ ] Phone: bottom menu entry, 44 px targets, bottom-sheet modals, no sideways scroll at 375 px.
- [ ] Data map chips show the right source on every KPI, column and field.
- [ ] Acceptance criteria for the module (PRD pack) can be demonstrated on the page.
- [ ] No console errors; passes the validation script.

## 9. Owner requirement register (from both sessions)

Collected from the zip session's 45 logged requests and this session. Wording is condensed; IDs refer to the zip log (`docs/chat-user-requests.md`) where noted.

| # | Requirement | Source |
|--:|---|---|
| R-01 | Vendor Registration, Passport 360 and Supplier Assessment are fully featured on every edition; FLEX is partial only elsewhere | zip #4-#5 |
| R-02 | Collapsible menu groups with sub-modules and sub-sub links; compact, slim menu; short labels | zip #4, #15, #17, #19 |
| R-03 | Edition badges: FLEX F green, CORE C purple, PLUS P orange; FLEX/CORE/PLUS toggle shows which modules hide | zip #2, #15 |
| R-04 | Profile menu switches role (vendor admin, finance, audit, warehouse, user admin) with name, title and company line | zip #5, #18 |
| R-05 | Each department has its own dashboard; no generic pages: every section has its own KPIs, tabs, CRUD and a prominent Create button | zip #11, #33, CLAUDE.md |
| R-06 | Login: card per role fills the fields; large image panel; dark/light toggle; login choice disappears after sign-in | zip #22-#25 |
| R-07 | Vendor menu sections fully expanded on load; every tab also a menu link; My Documents is its own main link | zip #23, #25, #32 |
| R-08 | Digital vendor card only on the Passport page and company profile; CEO/primary contact sees everything and can request or remove a Passport; staff see assigned items only | zip #21, #25-#27 |
| R-09 | Document manager in file-manager style, list and cards, change-request and approval flow, preview thumbnails | zip #20, #22 |
| R-10 | Warehouse workflow: receive, inspect, approve, to Procurement, to Finance for payment; capture delivery notes, defects, reports | zip #18, #24 |
| R-11 | Communications like a real inbox: unified inbox, email read and send, direct messages, announcements, alerts, WhatsApp as a source, AI summary | zip #28, #30, #32, #34 |
| R-12 | Vendor dashboards specific to the vendor hub, not general | zip #34 |
| R-13 | PRD in the app: every module has the same structured sections, lifecycles with colour per step, tables and diagrams; Support and PRD are separate sub-links under Help | zip #8, #11-#14 |
| R-14 | Builder vocabulary: Field type, Block (repeater drives Masters 0-9), Template (empty form), Preset ("Load Preset"), Load from Previous Form; one page-level Save in the decision card; standalone Process Builder by VendorOS | zip #42-#44, process-builder doc |
| R-15 | Pages and tabs must work (Requests, Documents sub-links, Communications tabs, side panels) | zip #30-#33 |
| R-16 | One shared database; ERP and CCC data reused, not copied | this session |
| R-17 | Registration is the same CCC engine; VendorOS offers Vendor and Partner only | this session |
| R-18 | Mandatory 15-document pack with tidy statuses; uploads and photos in the section where needed | this session |
| R-19 | Mockup only: do not change the Laravel app, database or migrations while finishing the mockup | this session |
| R-20 | Mobile: bottom menu on phones, touch-friendly buttons | this session |
| R-21 | Page by page, tab by tab, field by field audit against CCC and the ERP | this session |

## 10. Conventions and tooling (combined)

- **Stack for the real build:** Laravel + Blade/Livewire/Tailwind (Bootstrap vocabulary is design language only); vanilla JS in the mockup; no Vue or React. SQLite for tests, MySQL for production.
- **Mockup style:** single file, zero CDN, inline SVG icons (`ICONS`, `paintIcons()`), no external scripts.
- **Pitfalls already hit (zip):** missing `.hidden{display:none!important}`; duplicate IDs break `getElementById`; icons must exist in `ICONS`; escaped quotes inside inline `onclick` strings.
- **Pitfalls already hit (this session):** `String.replace` with `$'` in the replacement text corrupts scripts (use a function replacement); extending a `const` before its declaration throws at load; mobile grids need `minmax(0,1fr)` and inline grid styles override responsive CSS; the field dictionary must cross-check every public property, not only blade inputs.
- **Work in copies;** keep the original uploads untouched; document the plan in a markdown file first; suggest at least three enhancements per task (owner rule from the zip session).

## 11. Source file index

| Where | What | Used for |
|---|---|---|
| zip `CLAUDE.md` | project memory of the zip session | sections 1, 9, 10 |
| zip `docs/field-accuracy-matrix.md` | module and field status (4 of about 121 matched) | section 3 |
| zip `docs/chat-user-requests.md`, `chat-transcript.jsonl` | 45 owner requests, raw session | section 9 |
| zip `docs/process-builder-source-of-truth.md`, `legacy-formforge-handover.md` | builder vocabulary and lineage | pages `builder` |
| zip `specs/journey01/` v24-v45 | field-level registration and review screens | sections 3-4 |
| zip `specs/e01-e10/` and `reference-uploads/READ_GUIDE_.html` | ten enterprise workspaces | section 5 |
| zip `specs/modules/` M1-M23 + sitemap | pages, tabs, lifecycles, rules | section 5 and the PRD pack |
| zip `app/VendorFlow_Admin_Home.html` | mockup B | section 6 |
| zip `scripts/validate.py` | mockup validation | section 6, 10 |
| `foundation_os/public/VendorFlow_Admin_Home.html` | mockup A | everything |
| `PRD/VENDORFLOW_PRD_BUILD_SPEC.md`, `MOCKUP_FIELD_AUDIT.md`, `data/*.json` | this session's spec, audit, dictionary | everything |
