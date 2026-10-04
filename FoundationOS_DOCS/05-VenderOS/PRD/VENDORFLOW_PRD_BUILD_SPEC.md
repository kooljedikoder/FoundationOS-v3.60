# VendorFlow / VendorOS — PRD & Build Specification (v2, AI-ready)

**Status:** working build spec, 2026-10-04. Supersedes the narrative PRD page inside `foundation_os/public/VendorFlow_Admin_Home.html` for build purposes (that page stays as the readable overview).
**Machine-readable companions:** `data/field_dictionary.json` (registration fields), `data/mandatory_documents.json` (mandatory document pack).
**Owner:** FoundationOS. **Scope:** VendorOS FLEX and CORE (PLUS listed for completeness). Focus: **Vendor Hub (vendor-facing)** and **Vendor Admin (buyer-side)**.

## 0. How to use this document (humans and AI agents)

1. Read §1 (rules) before writing any code. They are non-negotiable.
2. Find the module in §8, then follow its links to the stage map (§5), fields (§6), documents (§7), roles (§3) and states (§4).
3. Anything marked **GAP (G-nn)** is known missing; never present it as built. See §10.
4. Anything marked **DECISION (D-nn)** needs an owner decision before it is built. See §11.
5. IDs are stable: `F-xx` feature, `M-nn` module, `S-nn` J01 stage, `G-nn` gap, `D-nn` decision, `AC-nn.n` acceptance criterion.
6. Edition marks (FLEX / CORE / PLUS) describe **entitlement**, not build status. Build status is tracked separately (§10).
7. The mockup (`VendorFlow_Admin_Home.html`) is the **menu, label and layout contract**. Its numbers are demo values. It is not evidence a feature exists.

## 1. Non-negotiable rules

| # | Rule |
|---|---|
| R1 | **One database per installation.** No second vendor, contact, user, order, payment or document store. |
| R2 | **CCC owns identity.** A vendor is a `partners_partners` row classified through Contact Control Center (CCC). VendorOS adds lifecycle tables keyed by `partner_id`; it never creates a vendor master. |
| R3 | **VendorOS registration offers Vendor and Partner only.** Staff, Individual, Customer, Other are CCC-only. |
| R4 | **ERP owns transactions** (RFQ/quotation, PO, receipt, invoice, payment). VendorOS reads and links them; it only adds missing stage 39-43 workflow around them. |
| R5 | **Laravel-first.** Native Laravel/Blade/Livewire/Tailwind. Filament only where ERP/admin already needs it. |
| R6 | **Modules are switched by `fos_modules`** (installed disabled; enabling runs migrations; disabling keeps data). Menu hiding is not authorization. |
| R7 | **Server-side scope on every query and write.** Vendor users see only their authorised partner. Internal users see only assigned queues. |
| R8 | **Honest states.** Unbuilt rows show "not connected", never demo data presented as real. |
| R9 | **J01 (45 stages) is the process; menus are workspaces.** Do not make 45 top-level menu items. |
| R10 | **No hard-coded form fields.** Registration fields come from the field dictionary / CCC definitions so the planned JSON page/form builder can drive them. |
| R11 | **Sensitive data** (NIN, BVN, bank numbers, ID photos, tax IDs) is masked in lists, role-gated, audit-logged, and encrypted at rest in production. |
| R12 | **Standard list + drawer** for every vendor list (§9.2). No per-page table styles. |

## 2. Editions and feature matrix (target entitlement)

FLEX is a **complete vendor lifecycle**, not a reduced tier. CORE inherits FLEX. PLUS inherits both. `Std/Adv` marks the same capability delivered at two depths.

| ID | Capability | FLEX | CORE | PLUS |
|---|---|:-:|:-:|:-:|
| F-A1 | Vendor discovery, secure invitation and expiry | Yes | Yes | Yes |
| F-A2 | Account creation, email verification, onboarding dashboard | Yes | Yes | Yes |
| F-A3 | CCC company profile, locations, contacts, ownership | Yes | Yes | Yes |
| F-A4 | Banking, tax, products, references, declarations | Yes | Yes | Yes |
| F-A5 | Identity verification, duplicate checks, verification timeline | Yes | Yes | Yes |
| F-A6 | Multi-discipline assessment, scoring, recommendation | Yes | Yes | Yes |
| F-A7 | Sequential/parallel approvals, audit history, escalation | Yes | Yes | Yes |
| F-A8 | Vendor number, Passport 360, activation, revalidation | Yes | Yes | Yes |
| F-B1 | Mandatory document centre, upload, version, expiry tracking | Yes | Yes | Yes |
| F-B2 | Document validation, reviewer status, replacement requests | Yes | Yes | Yes |
| F-B3 | Insurance, tax clearance, certification renewal monitoring | Yes | Yes | Yes |
| F-B4 | Compliance centre, customer rules, corrective actions | Std | Adv | Adv |
| F-B5 | HSE induction, safety training, certification | Yes | Yes | Yes |
| F-B6 | Audit plans, findings, evidence, governance controls | - | Yes | Yes |
| F-B7 | Enterprise risk register and risk analytics | - | Yes | Yes |
| F-B8 | ESG management, multi-company governance, enterprise CAPA | - | Yes | Yes |
| F-C1 | Purchase requests, RFQs, quotations | Yes | Yes | Yes |
| F-C2 | Purchase orders, acceptance, delivery tracking | Yes | Yes | Yes |
| F-C3 | Warehouse receiving, inspection, goods receipt | Yes | Yes | Yes |
| F-C4 | Vendor invoices, PO/GRN matching, payment status | Yes | Yes | Yes |
| F-C5 | Payment terms, tax handling, finance controls | Std | Enterprise | Enterprise |
| F-C6 | Stage 41 award and supplier commercial relationship | Core lifecycle | Yes | Yes |
| F-C7 | Contract lifecycle workspace, obligation management | - | Yes | Yes |
| F-D1 | Vendor performance scorecards, periodic reviews | Std | Adv analytics | Adv |
| F-D2 | SLA tracking, renewal, continuous revalidation | Std | Adv SLA | Adv |
| F-D3 | Vendor self-service profile, documents, requests | Yes | Yes | Yes |
| F-D4 | Vendor collaboration and supplier communications | Std | Enterprise | Enterprise |
| F-D5 | Workflow automation, lifecycle task routing | Basic | Advanced | Advanced |
| F-D6 | Users, roles, administration, standard reporting | Yes | Adv admin/reporting | Adv |
| F-D7 | Advanced security, integrations, executive analytics | - | Yes | Yes |
| F-E1 | Enterprise risk management and risk register | - | Yes | Yes |
| F-E2 | Audit management, compliance centre, governance | - | Yes | Yes |
| F-E3 | ESG, sustainability, human-rights oversight | - | Yes | Yes |
| F-E4 | Corrective and preventive action (CAPA) | - | Yes | Yes |
| F-E5 | Multi-company, business-unit, enterprise governance | - | Yes | Yes |
| F-E6 | Advanced security, integrations, workflow, reporting | - | Yes | Yes |
| F-P1..P9 | Strategic sourcing workspace, category management, spend analytics, RFI/RFP/eTender, reverse auctions, evaluation committees, award management, strategic contract workspace, supplier collaboration/forecasts | - | - | Yes |

Notes: F-E1..E6 restate F-B6..B8, F-D7 and F-C7 as CORE governance groups; build each once. Platform extensions (VendorFlow Studio, AI Copilot, Dynamic Form Builder) operate across editions and are **not** edition tiers.

**Mockup tier corrections required (G-05):** Induction & Certification must be FLEX (F-B5, currently tagged CORE). ESG is CORE (F-B8/E3), not FLEX Supplier Assessment. Editions & Licensing is an admin page, not PLUS-gated. AI Copilot and Dynamic Form Builder are platform extensions.

## 3. Roles and permissions

### 3.1 Roles

| Role | Side | Purpose |
|---|---|---|
| Super Admin | Buyer | Everything, including modules and permissions |
| User Admin | Buyer | Users, roles, departments, system configuration |
| Executive | Buyer | Read-only oversight, final management approval |
| Vendor Admin | Buyer | Runs registration, onboarding, passports, document review |
| Procurement | Buyer | Procurement review, RFQs, POs, awards |
| Finance | Buyer | Finance review, invoices, payments |
| Audit | Buyer | Compliance and governance review, audits, risk |
| Warehouse | Buyer | Receiving, inspection, goods receipt |
| Vendor Primary Contact | Vendor | Full self-service for own company, manages staff access |
| Vendor Staff | Vendor | Limited self-service as granted by the primary contact |

### 3.2 Access by workspace (V = view, W = create/edit, A = approve/decide, - = none)

| Workspace | SuperAdm | UserAdm | Exec | VendorAdm | Procure | Finance | Audit | Warehouse | Vendor Primary | Vendor Staff |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Dashboard | V | V | V | V | V | V | V | V | V (own) | V (own) |
| Registration & Onboarding | W | - | V | W | V | V* | V* | - | W until S18 | W if granted |
| Vendor Passport 360 | W | - | V | W | V | V | V | - | V (own) | V (own) |
| Document Management | W | - | V | W | V | V | V | - | W (own) | W if granted |
| Supplier Assessment | A | - | V | W | A (procurement, technical) | A (finance) | A (legal, compliance) | - | - | - |
| HSE Induction & Certification | W | - | V | W | - | - | V | - | W (own) | W (own) |
| Audit & Governance (CORE) | W | - | V | V | - | - | W | - | - | - |
| Enterprise Risk (CORE) | W | - | V | V | - | - | W | - | - | - |
| Procurement Workspace | W | - | V | - | W | V | - | V | RFQ/PO (own) | RFQ/PO if granted |
| Contract Lifecycle (CORE) | W | - | V | - | W | V | V | - | V (own) | - |
| Warehouse & Receiving | W | - | V | - | V | - | - | W | V (own deliveries) | - |
| Finance & Payments | W | - | V | - | V | W | - | - | Invoices (own) | Invoices if granted |
| Performance & SLA | W | - | V | W | W | V | V | V | V (own score) | - |
| Communications | W | - | V | W | W | W | W | W | W (own threads) | W if granted |
| Workflow / Integration / AI / Builder | W | W | - | - | - | - | - | - | - | - |
| System Configuration | W | W | - | - | - | - | - | - | - | - |

`*` Finance and Audit must see the vendor review queue and evidence for J01 stages 25-26. In the mockup they cannot (G-06).

### 3.3 Approval chain (J01 stages 23-34)

| Stage | Review | Decides | Outcome values |
|---|---|---|---|
| S23 | Procurement review | Procurement | approve, reject, request_information, return |
| S24 | Technical review | Procurement / technical lead | same |
| S25 | Finance review | Finance | same |
| S26 | Legal / governance review | Audit | same |
| S27 | HSE review and induction | HSE (Vendor Admin) | same |
| S28 | Site inspection | Audit / HSE | same |
| S29 | ESG review (CORE) | Audit | same |
| S30 | Risk assessment (CORE) | Audit | same |
| S31 | Vendor scoring | system from S23-S30 | score 0-100 |
| S32 | Recommendation | Vendor Admin | recommended, recommended_with_conditions, more_information_required, not_recommended |
| S33 | Multi-level approval | Executive (final) | approve, reject |
| S34 | Approval history and audit | system | append-only log |

Reviews may run sequentially or in parallel (F-A7). `reject` requires findings text (min 5 chars). `request_information` creates a compliance action the vendor must answer (S22).

### 3.4 Permissions implementation rules

- Use existing Spatie roles/permissions on the `web` guard. Current admin gates: VendorOS module gate plus `settings.edit`; CCC uses `contact.view`. Do not invent a permission per menu item or per app settings page.
- Each approve/reject/hold control needs a real permission; the 15-role approval matrix in the ProcessBuilder reference is the intended source (DECISION D-08).
- Vendor portal requires: authenticated, verified email, accepted invitation linked to the signed-in user, VendorOS enabled, and partner scope on every query.

## 4. State machines

Every state change writes an append-only audit row (who, when, from, to, reason). Illegal transitions are rejected server-side.

### 4.1 Vendor lifecycle (J01 section 5 = PRD M1)

`Prospect → Invited → Registration Started → Draft → Submitted → Pending Validation → Pending Procurement Review → Pending Technical Review → Pending Finance Review → Pending Compliance Review → Pending HSE Review → Pending Management Approval → Approved → Vendor Number Assigned → Vendor Passport Created → Active Vendor → Eligible for Opportunities → Transactional → Performance Monitoring → Renewal / Revalidation → Active | Suspended | Expired | Archived`

| From | To | Who / what triggers | Guard |
|---|---|---|---|
| Prospect | Invited | Vendor Admin sends invitation | Email valid; no duplicate partner (S19 check) |
| Invited | Registration Started | Vendor accepts invitation and verifies email | Invitation not expired, not revoked |
| Registration Started | Draft | First save | - |
| Draft | Submitted | Vendor submits | All required fields and all mandatory documents present (§7); declarations accepted |
| Submitted | Pending Validation | System | Document validation queue opened (S18) |
| Pending Validation | Pending Procurement Review | Validation passes | No Missing/Rejected/Expired mandatory document |
| Pending * Review | next Pending state | Reviewer decides `approve` | Reviewer holds the stage permission (§3.3); parallel reviews join before management approval |
| Pending * Review | Draft (returned) | `return` or `request_information` | Findings text required; creates a vendor action (S22) |
| Pending Management Approval | Approved | Executive `approve` | All prior reviews approved; score and recommendation present |
| Pending * | Rejected (terminal for this attempt) | `reject` | Findings text required; vendor may re-apply as a new registration |
| Approved | Vendor Number Assigned | System | Number unique per installation |
| Vendor Number Assigned | Vendor Passport Created | System | `vendor_passports` row keyed by `partner_id` |
| Vendor Passport Created | Active Vendor | System / Vendor Admin | Operational readiness checks pass (S38) |
| Active Vendor | Eligible for Opportunities | System | Insurance and certifications valid |
| Any active state | Suspended | Vendor Admin / Audit | Reason required; blocks new RFQ/PO eligibility |
| Active / Suspended | Renewal / Revalidation | Scheduler or admin | Periodic or expiry trigger |
| Any | Archived | Vendor Admin | No open transactions |

### 4.2 Document lifecycle (PRD M2 + J01 stage 18, reconciled)

PRD M2 defines 14 lifecycle states; J01 stage 18 defines 7 validation outcomes. They are two views of one record. **Store the lifecycle state; derive the outcome.** The PRD list lacks a rejection state although M2's action bar has Reject and its success criteria say "replace rejected documents", so two states are added (marked +).

`Not Required → Required → Pending Upload → Uploaded → Pending Validation → Pending Verification → Pending Approval → Approved → Active → Expiring Soon → Expired → Renewal Required → Replaced → Archived`  plus `Rejected (+)` and `Replacement Required (+)`.

| J01 outcome | Stored lifecycle state(s) |
|---|---|
| Missing | Required, Pending Upload |
| Uploaded | Uploaded, Pending Validation |
| Under Review | Pending Verification, Pending Approval |
| Verified | Approved, Active, Expiring Soon |
| Rejected | Rejected (+) |
| Expired | Expired, Renewal Required |
| Replacement Required | Replacement Required (+), Replaced (the old version) |

Rules: a new upload of the same `doc_type` creates a new version and marks the previous `Replaced`. Expiry warnings fire at 30, 7 and 1 day before `expires_at`. A mandatory document in Missing/Rejected/Expired blocks submission (and, after activation, flags the vendor for revalidation).

### 4.3 Invitation

`Created → Sent → Opened → Accepted → Account Created → Email Verified` | `Expired` | `Revoked` | `Bounced`. Retry and revoke are admin actions. Acceptance links to a user and a partner; authorisation never rests on email match alone (D-01).

### 4.4 Review decision (per J01 stages 23-30)

`Not Started → In Progress → Decided(approve | reject | request_information | return)`. `Decided` rows are immutable; a new review round is a new row.

### 4.5 Vendor Passport

`Draft → Issued → Active → Suspended → Expired → Revoked`. Revalidation moves Active → Pending Revalidation → Active.

### 4.6 Transactions (ERP-owned, shown read-through; target vocabularies)

| Object | States |
|---|---|
| RFQ | Invitation received → Awaiting quotation → Quotation submitted → Under evaluation → Awarded / Not awarded / Closed |
| Purchase order | Issued → Acknowledged → Awaiting delivery → Delivered → Closed / Cancelled |
| Delivery | Scheduled → In transit → Received → Inspected → Accepted / Rejected |
| Invoice | Not yet submitted → Submitted → Matched (PO/GRN) → Awaiting payment → Paid / Disputed |
| Request (vendor) | Submitted → Assigned → In progress → Completed / Declined |

## 5. J01 stage map (45 stages)

Legend: **Vendor** = what the vendor can do (E edit, R respond, V view, A act). **Build** = status in the current tree (Built / Partial / Needed) as of 2026-10-04; see §10.

| S | Stage | Module | Tier | CCC tab / data | Vendor | Build |
|--:|---|---|---|---|---|---|
| 01 | Vendor discovery / invitation | M-01 | FLEX | invitations | - | Partial |
| 02 | Create account | M-14 | FLEX | users | E | Partial |
| 03 | Email / OTP verification | M-14 | FLEX | users | E | Partial |
| 04 | Welcome / onboarding dashboard | M-14 | FLEX | dashboard | V | Partial |
| 05 | Company information | M-01 | FLEX | Basic | E | Built |
| 06 | Company address and locations | M-01 | FLEX | Basic (locations) | E | Built |
| 07 | Registration and regulatory numbers | M-01 | FLEX | Financials & Identity | E | Built |
| 08 | Business type and capabilities | M-01 | FLEX | Basic / Work | E | Built |
| 09 | Products and services | M-01 | FLEX | Work (offerings) | E | Built |
| 10 | Contact persons | M-01 | FLEX | Contact | E | Built |
| 11 | Customer references | M-01 | FLEX | Affiliations (references) | E | Built |
| 12 | Directors, ownership, signatories | M-01 | FLEX | Basic (directors) | E | Built |
| 13 | Banking details | M-01 | FLEX | Financials & Identity (bank) | E | Built |
| 14 | Tax and financial profile | M-01 | FLEX | Financials & Identity | E | Built |
| 15 | Insurance | M-01 | FLEX | Financials & Identity (insurance) | E | Built |
| 16 | Certifications | M-01 | FLEX | Certifications | E | Built |
| 17 | Mandatory document centre | M-02 | FLEX | Documents | E | Partial |
| 18 | Document validation | M-02 | FLEX | Documents | V | Partial |
| 19 | Vendor identity verification | M-03 | FLEX | verification checks | V | Built |
| 20 | Verification timeline | M-03 | FLEX | timeline | V | Built |
| 21 | Compliance centre | M-09 | FLEX std / CORE adv | compliance | V | Built |
| 22 | Compliance actions / gap resolution | M-09 | FLEX | compliance actions | R | Built |
| 23 | Procurement review | M-03 | FLEX | Review | V | Built |
| 24 | Technical review | M-03 | FLEX | Review | V | Built |
| 25 | Finance review | M-03 | FLEX | Review | V | Built |
| 26 | Legal / governance review | M-03 | FLEX | Review | V | Built |
| 27 | HSE review and induction | M-04 | FLEX | Review / HSE | A | Built / Needed (LMS) |
| 28 | Site inspection / physical assessment | M-03 | FLEX | Review | V | Built |
| 29 | ESG / sustainability review | M-03 / M-09 | CORE | Review | V | Built |
| 30 | Risk assessment | M-12 | CORE | Review | V | Built |
| 31 | Vendor scoring | M-03 | FLEX | Review | V | Built |
| 32 | Recommendation | M-03 | FLEX | Review | - | Built |
| 33 | Multi-level approval | M-03 | FLEX | approvals | V | Built |
| 34 | Approval history and audit | M-03 | FLEX | audit | - | Built |
| 35 | Vendor number assignment | M-05 | FLEX | passport | V | Built |
| 36 | Vendor Passport 360 creation | M-05 | FLEX | passport | V | Built |
| 37 | Activation and portal access | M-05 / M-14 | FLEX | passport / users | V | Built |
| 38 | Operational readiness | M-05 | FLEX | passport | V | Built |
| 39 | Opportunity / RFQ invitation | M-06 | FLEX | ERP read-through | A | Needed |
| 40 | Bid / quotation / evaluation | M-06 | FLEX | ERP read-through | A | Needed |
| 41 | Award and contract | M-06 / M-11 | FLEX (award) / CORE (CLM) | ERP | V | Needed |
| 42 | PO / delivery / QC / GRN | M-06 | FLEX | ERP | A | Needed |
| 43 | Invoice / payment | M-07 | FLEX | ERP | A | Needed |
| 44 | Performance / renewal | M-08 | FLEX std / CORE adv | scorecards | V/R | Partial |
| 45 | Revalidation / continuous lifecycle | M-08 | FLEX | scheduler | R | Partial |

## 6. Registration: PRD wizard, CCC tabs and J01 crosswalk

Three descriptions of "registration" exist and must be reconciled (DECISION D-04). **Canonical build target: the 10 CCC tabs are the data model and renderer; the 16 PRD steps are the vendor-facing progress navigation grouped over them.** The mockup wizard now follows the 16 steps (it replaced an earlier 4-step version).

| PRD M1 step (16) | CCC tab | J01 | Fields / repeater | Status |
|---|---|---|---|---|
| 1 Welcome | (shell) | S04 | none: progress, outstanding actions, help | Partial |
| 2 Company information | Basic | S05 | companyName, tradingName, companyType, employeeCount, annualTurnover, parentCompanyId, website(s), email(s), socialLinks | Built |
| 3 Company address | Basic | S06 | address fields + locations repeater (label, street, country, state, zip, phone), building/floor/office/desk, latitude/longitude, directions | Built |
| 4 Registration details | Financials & Identity | S07 | registrationNumber, referenceNumber, taxAuthority; incorporationDate validated in code | Partial (G-09) |
| 5 Business information | Basic / Work | S08 | companyType, industryId, vendor categories | Partial (G-10) |
| 6 Products and services | Work | S09 | vendor-offering repeater (product, price, minimum quantity, lead time) | Built |
| 7 Contact persons | Contact | S10 | primary contact + additional-contact repeater | Built |
| 8 Customer references | Affiliations | S11 | vendor-reference repeater | Built |
| 9 Directors | Basic | S12 | directors (name, designation, shareholding, ID type/number, authorised signatory) | Built |
| 10 Banking details | Financials & Identity | S13 | bank-account repeater | Built |
| 11 Tax information | Financials & Identity | S14 | taxId, withholdingTaxNumber, vatNumber, nin, bvn, currencyId, creditLimit | Built |
| 12 Required documents | Documents | S17 | mandatory pack (§7) | Partial |
| 13 Compliance | Financials & Identity (insurance) + Certifications | S15, S16, S21-S22 | vendor-insurance repeater (type, provider, policy number, coverage, expiry, broker) and certification repeater (name, issuing body, number, status, expiry), each row with its certificate file; compliance responses answer reviewer actions | Built (insurance and certification rows); compliance responses on a separate screen |
| 14 Declaration | none | - | supplier declarations (conflict of interest, anti-bribery, accuracy, consent) | **GAP G-08** |
| 15 Review | Review | S23+ | summary; reviewer fields are process values | Built |
| 16 Submit | Review | S33 | submit action and status | Built |

Also in CCC but absent from the PRD wizard: Work (classification, department, tags), Affiliations (organisations), Assets, Custom Fields. For vendors these are optional and hidden by default through field-visibility rules.

### 6.1 Registration entry paths (PRD M1: 7)

New registration, Existing vendor update, Annual revalidation, Invitation registration, Self registration (Vendor Portal), Bulk import, ERP synchronised. VendorOS exposes Vendor and Partner types only (R3). **FLEX build order: Invitation → New → Update → Revalidation.** Self-registration, bulk import and ERP sync follow.

### 6.2 Registration field dictionary

Machine-readable copy: `data/field_dictionary.json`. Keys are the Livewire property names in `ContactWizard`. "Persists to" follows the CCC builder contract (`contact`, `contact_relation`, `custom_value`, `process_value`). Labels are humanised from keys and must be confirmed against the UI. Visibility per contact type is configurable in CCC Settings (field and tab rules); do not hard-code (R10).


#### Basic

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `companyName` | Company Name | text | Y | required\|string\|max:255 (stored as name) |  | contact | S05, S06, S08 |
| `status` | Status | select |  | optional |  | contact | S05, S06, S08 |
| `tradingName` | Trading Name | text |  | optional |  | contact | S05, S06, S08 |
| `companyType` | Company Type | select |  | optional |  | contact | S05, S06, S08 |
| `employeeCount` | Employee Count | select |  | optional |  | contact | S05, S06, S08 |
| `annualTurnover` | Annual Turnover | number |  | nullable\|numeric\|min:0 |  | contact | S05, S06, S08 |
| `parentCompanyId` | Parent Company ID | select |  | nullable\|integer\|exists:partners_partners,id, not self |  | contact | S05, S06, S08 |
| `website` | Website | url |  | nullable\|url\|max:255 |  | contact | S05, S06, S08 |
| `website2` | Website2 | url |  | nullable\|url\|max:255 |  | contact | S05, S06, S08 |
| `email` | Email | email |  | nullable\|email\|max:255 |  | contact | S05, S06, S08 |
| `email2` | Email2 | email |  | nullable\|email\|max:255 |  | contact | S05, S06, S08 |
| `socialLinks.*` | Social links (one per platform) | text |  | nullable\|url\|max:255 |  | contact | S05, S06, S08 |
| `street1` | Street1 | text |  | optional |  | contact | S05, S06, S08 |
| `street2` | Street2 | text |  | optional |  | contact | S05, S06, S08 |
| `stateId` | State ID | select |  | optional |  | contact | S05, S06, S08 |
| `zip` | Zip | text |  | nullable\|string\|max:20 |  | contact | S05, S06, S08 |
| `building` | Building | text |  | optional |  | contact | S05, S06, S08 |
| `floor` | Floor | text |  | optional |  | contact | S05, S06, S08 |
| `office` | Office | text |  | optional |  | contact | S05, S06, S08 |
| `desk` | Desk | text |  | optional |  | contact | S05, S06, S08 |
| `latitude` | Latitude | number |  | optional |  | contact | S05, S06, S08 |
| `longitude` | Longitude | number |  | optional |  | contact | S05, S06, S08 |
| `locationDirections` | Location Directions | textarea |  | optional |  | contact | S05, S06, S08 |
| `newDirectorName` | Director Name | text | Y | required |  | contact | S05, S06, S08 |
| `newDirectorDesignation` | Director Designation | select | Y | required |  | contact | S05, S06, S08 |
| `newDirectorShareholding` | Director Shareholding | number |  | optional |  | contact | S05, S06, S08 |
| `newDirectorIdType` | Director ID Type | select |  | optional |  | contact | S05, S06, S08 |
| `newDirectorIdNumber` | Director ID Number | text |  | optional | Y | contact | S05, S06, S08 |
| `newDirectorAuthorizedSignatory` | Director Authorized Signatory | checkbox |  | optional |  | contact | S05, S06, S08 |

#### Work

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `industryId` | Industry ID | select |  | optional |  | contact | S08 |
| `employeeId` | Employee ID | text |  | optional |  | contact | S08 |
| `commission` | Commission | number |  | optional |  | contact | S08 |
| `departmentId` | Department ID | select |  | optional |  | contact | S08 |
| `reportsToId` | Reports To ID | select |  | optional |  | contact | S08 |
| `managedById` | Managed By ID | select |  | optional |  | contact | S08 |
| `contractStart` | Contract Start | text |  | nullable\|date |  | contact | S08 |
| `isContactPerson` | Is Contact Person | checkbox |  | optional |  | contact | S08 |
| `contactPersonForId` | Contact Person For ID | select |  | optional |  | contact | S08 |
| `comment` | Comment | textarea |  | optional |  | contact | S08 |
| `externalNotes` | External Notes | textarea |  | optional |  | contact | S08 |
| `tagIds` | Tag Ids | checkbox |  | optional |  | contact | S08 |
| `newTagName` | Tag Name | text |  | optional |  | contact | S08 |

#### Contact

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `titleId` | Title ID | select |  | optional |  | contact | S10, S12 |
| `firstName` | First Name | text |  | optional |  | contact | S10, S12 |
| `middleName` | Middle Name | text |  | optional |  | contact | S10, S12 |
| `surname` | Surname | text |  | optional |  | contact | S10, S12 |
| `phone` | Phone | tel |  | optional |  | contact | S10, S12 |
| `phone2` | Phone2 | tel |  | optional |  | contact | S10, S12 |
| `whatsapp` | Whatsapp | tel |  | optional |  | contact | S10, S12 |
| `mobile` | Mobile | tel |  | optional |  | contact | S10, S12 |
| `gender` | Gender | select |  | optional |  | contact | S10, S12 |
| `primaryIdNumber` | Primary ID Number | text |  | optional | Y | contact | S10, S12 |
| `primaryIdPhoto` | Primary ID Photo | file |  | optional | Y | contact | S10, S12 |
| `primaryHeadshotPhoto` | Primary Headshot Photo | file |  | optional | Y | contact | S10, S12 |
| `preferredName` | Preferred Name | text |  | optional |  | contact | S10, S12 |
| `companyId` | Company ID | select |  | optional |  | contact | S10, S12 |

#### Financials & Identity

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `nin` | Nin | text |  | optional | Y | contact | S07, S13, S14 |
| `bvn` | Bvn | text |  | optional | Y | contact | S07, S13, S14 |
| `taxId` | Tax ID | text |  | optional | Y | contact | S07, S13, S14 |
| `withholdingTaxNumber` | Withholding Tax Number | text |  | optional | Y | contact | S07, S13, S14 |
| `taxAuthority` | Tax Authority | text |  | optional |  | contact | S07, S13, S14 |
| `vatNumber` | Vat Number | text |  | optional | Y | contact | S07, S13, S14 |
| `registrationNumber` | Registration Number | text |  | optional |  | contact | S07, S13, S14 |
| `referenceNumber` | Reference Number | text |  | optional |  | contact | S07, S13, S14 |
| `currencyId` | Currency ID | select |  | optional |  | contact | S07, S13, S14 |
| `creditLimit` | Credit Limit | number |  | nullable\|numeric\|min:0 | Y | contact | S07, S13, S14 |

#### Custom Fields

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `customFieldValues.*` | Custom field values (admin-defined) | textarea |  | optional |  | custom_value | - |

#### Review

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newVendorReviewStage` | Vendor Review Stage | select | Y | required\|integer\|in:23..30 |  | process_value | S23-S34 |
| `newVendorReviewScore` | Vendor Review Score | number |  | nullable\|integer\|0..100 |  | process_value | S23-S34 |
| `newVendorReviewDecision` | Vendor Review Decision | select | Y | required on submit\|in:approve,reject,request_information,return |  | process_value | S23-S34 |
| `newVendorReviewFindings` | Vendor Review Findings | textarea | Y | required on submit\|string\|min:5\|max:5000 |  | process_value | S23-S34 |
| `newVendorReviewEvidenceReference` | Vendor Review Evidence Reference | text |  | optional |  | process_value | S23-S34 |
| `newVendorRecommendation` | Vendor Recommendation | select | Y | required\|in:recommended,recommended_with_conditions,more_information_required,not_recommended |  | process_value | S23-S34 |
| `newVendorRecommendationRationale` | Vendor Recommendation Rationale | textarea | Y | required\|string\|min:5\|max:5000 |  | process_value | S23-S34 |
| `newVendorRecommendationConditions` | Vendor Recommendation Conditions | textarea | Y | required |  | process_value | S23-S34 |

#### Contact (repeater: additional-contact)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newAdditionalContactTitleId` | Additional Contact Title ID | select |  | optional |  | contact_relation | S10 |
| `newAdditionalContactFirstName` | Additional Contact First Name | text | Y | required\|string\|max:255 |  | contact_relation | S10 |
| `newAdditionalContactMiddleName` | Additional Contact Middle Name | text | Y | required |  | contact_relation | S10 |
| `newAdditionalContactSurname` | Additional Contact Surname | text | Y | required |  | contact_relation | S10 |
| `newAdditionalContactPhone` | Additional Contact Phone | tel |  | optional |  | contact_relation | S10 |
| `newAdditionalContactPhone2` | Additional Contact Phone2 | tel |  | optional |  | contact_relation | S10 |
| `newAdditionalContactWhatsapp` | Additional Contact Whatsapp | tel |  | optional |  | contact_relation | S10 |
| `newAdditionalContactMobile` | Additional Contact Mobile | tel |  | optional |  | contact_relation | S10 |
| `newAdditionalContactEmail` | Additional Contact Email | email |  | nullable\|email\|max:255 |  | contact_relation | S10 |
| `newAdditionalContactEmail2` | Additional Contact Email2 | email |  | optional |  | contact_relation | S10 |
| `newAdditionalContactWebsite` | Additional Contact Website | url |  | nullable\|url\|max:255 |  | contact_relation | S10 |
| `newAdditionalContactRole` | Additional Contact Role | select |  | optional |  | contact_relation | S10 |
| `newAdditionalContactGender` | Additional Contact Gender | select |  | optional |  | contact_relation | S10 |
| `newAdditionalContactIdNumber` | Additional Contact ID Number | text |  | optional | Y | contact_relation | S10 |
| `newAdditionalContactIdPhoto` | Additional Contact ID Photo | file |  | optional | Y | contact_relation | S10 |
| `newAdditionalContactHeadshotPhoto` | Additional Contact Headshot Photo | file |  | optional |  | contact_relation | S10 |

#### Affiliations (repeater: affiliation)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newAffiliationOrganisationId` | Affiliation Organisation ID | select | Y | required\|exists:fos_organisations,id |  | contact_relation | S11 |
| `newAffiliationCategory` | Affiliation Category | select |  | optional |  | contact_relation | S11 |
| `newAffiliationType` | Affiliation Type | select |  | optional |  | contact_relation | S11 |
| `newAffiliationRole` | Affiliation Role | select |  | optional |  | contact_relation | S11 |
| `newAffiliationStatus` | Affiliation Status | select |  | optional |  | contact_relation | S11 |
| `newAffiliationAppointmentMethod` | Affiliation Appointment Method | select |  | optional |  | contact_relation | S11 |
| `newAffiliationCapacity` | Affiliation Capacity | select |  | optional |  | contact_relation | S11 |
| `newAffiliationLevel` | Affiliation Level | text |  | optional |  | contact_relation | S11 |
| `newAffiliationProgramDivision` | Affiliation Program Division | text |  | optional |  | contact_relation | S11 |
| `newAffiliationMembershipType` | Affiliation Membership Type | text |  | optional |  | contact_relation | S11 |
| `newAffiliationMembershipNumber` | Affiliation Membership Number | text |  | optional |  | contact_relation | S11 |
| `newAffiliationVotingRights` | Affiliation Voting Rights | checkbox |  | optional |  | contact_relation | S11 |
| `newAffiliationExOfficio` | Affiliation Ex Officio | checkbox |  | optional |  | contact_relation | S11 |
| `newAffiliationIsPrimary` | Affiliation Is Primary | checkbox |  | optional |  | contact_relation | S11 |

#### Assets (repeater: asset)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newAssetTag` | Asset Tag | text |  | optional |  | contact_relation | - |
| `newAssetType` | Asset Type | select |  | optional |  | contact_relation | - |

#### Financials & Identity (repeater: bank-account)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newBankId` | Bank ID | select | Y | required\|exists:banks,id |  | contact_relation | S13 |
| `newBankAccountNumber` | Bank Account Number | text | Y | required\|string\|max:255 | Y | contact_relation | S13 |
| `newBankSortCode` | Bank Sort Code | text | Y | required | Y | contact_relation | S13 |
| `newBankSwiftCode` | Bank SWIFT Code | text | Y | required | Y | contact_relation | S13 |
| `newBankIban` | Bank IBAN | text |  | optional | Y | contact_relation | S13 |
| `newBankCurrencyId` | Bank Currency ID | select |  | optional |  | contact_relation | S13 |
| `newBankAccountHolderName` | Bank Account Holder Name | text |  | optional |  | contact_relation | S13 |

#### Certifications (repeater: certification)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newCertificationName` | Certification Name | text | Y | required\|string\|max:255 |  | contact_relation | S16 |
| `newCertificationIssuingBody` | Certification Issuing Body | text | Y | required |  | contact_relation | S16 |
| `newCertificationNumber` | Certification Number | text | Y | required |  | contact_relation | S16 |
| `newCertificationStatus` | Certification Status | select |  | optional |  | contact_relation | S16 |

#### Contact (repeater: family-member)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newFamilyRelationship` | Family Relationship | select |  | optional |  | contact_relation | - |
| `newFamilyName` | Family Name | text |  | optional |  | contact_relation | - |

#### Contact (repeater: important-date)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newDateType` | Date Type | select |  | optional |  | contact_relation | - |
| `newDateLabel` | Date Label | text |  | optional |  | contact_relation | - |

#### Basic (repeater: location)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newLocationLabel` | Location Label | text |  | optional |  | contact_relation | S06 |
| `newLocationStreet1` | Location Street1 | text |  | optional |  | contact_relation | S06 |
| `newLocationStreet2` | Location Street2 | text |  | optional |  | contact_relation | S06 |
| `newLocationCountryId` | Location Country ID | select |  | optional |  | contact_relation | S06 |
| `newLocationStateId` | Location State ID | select |  | optional |  | contact_relation | S06 |
| `newLocationZip` | Location Zip | text |  | optional |  | contact_relation | S06 |
| `newLocationPhone` | Location Phone | tel |  | optional |  | contact_relation | S06 |

#### Financials & Identity (repeater: vendor-insurance)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newInsuranceType` | Insurance Type | select | Y | required\|string\|max:255 |  | contact_relation | S15 |
| `newInsuranceProvider` | Insurance Provider | text |  | optional |  | contact_relation | S15 |
| `newInsurancePolicyNumber` | Insurance Policy Number | text |  | optional |  | contact_relation | S15 |
| `newInsuranceCoverageAmount` | Insurance Coverage Amount | number |  | nullable\|numeric\|min:0 |  | contact_relation | S15 |
| `newInsuranceBroker` | Insurance Broker | text |  | optional |  | contact_relation | S15 |

#### Work (repeater: vendor-offering)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newOfferingProductId` | Offering Product ID | select | Y | required\|integer\|exists:products_products,id |  | contact_relation | S09 |
| `newOfferingPrice` | Offering Price | number |  | nullable\|numeric\|min:0 |  | contact_relation | S09 |
| `newOfferingMinimumQuantity` | Offering Minimum Quantity | number |  | nullable\|numeric\|min:0 |  | contact_relation | S09 |
| `newOfferingLeadTime` | Offering Lead Time | number |  | nullable\|integer\|min:0 |  | contact_relation | S09 |

#### Affiliations (repeater: vendor-reference)

| Key | Label | Input | Req | Validation | Sensitive | Persists to | J01 |
|---|---|---|:-:|---|:-:|---|---|
| `newReferenceCustomerName` | Reference Customer Name | text | Y | required\|string\|max:255 |  | contact_relation | S11 |
| `newReferenceContactName` | Reference Contact Name | text | Y | required |  | contact_relation | S11 |
| `newReferenceEmail` | Reference Email | email | Y | nullable\|email\|max:255 |  | contact_relation | S11 |
| `newReferencePhone` | Reference Phone | tel |  | optional |  | contact_relation | S11 |
| `newReferenceRelationship` | Reference Relationship | text |  | optional |  | contact_relation | S11 |
| `newReferenceProductsSupplied` | Reference Products Supplied | text |  | optional |  | contact_relation | S11 |

## 7. Mandatory documents (vendor registration pack)

The pack below was supplied by the project owner as the documents needed for vendor registration (Nigeria baseline: CAC forms, NIN, VAT, LPO). **All 15 are mandatory.** Machine-readable copy: `data/mandatory_documents.json`. Rules are stored in `fos_required_documents`; the app currently seeds a South African-style pack (tax clearance, BBBEE, shareholder register), so this pack must be added as a selectable country/customer pack (G-03, D-03).

Tidied from the source list:

- Status wording normalised to the J01/PRD vocabularies (§4.2): Done → Verified, "older version" → Replacement Required, Pending → Missing.
- Two items in the source conflicted and were resolved conservatively: **#15** appeared under both Completed and Pending (treated as Missing until the signed form is uploaded); **#12** was marked Done but still needs its NIN photo checked (treated as Under Review).
- "Submitted to G-Drive" is a storage location, not a state; the system stores the file itself.
- "Action: Idowu" is an internal assignee; it becomes `assigned_to` on the vendor's document task.

| # | Document | Category | Mandatory | Outcome (J01) | Stored state (PRD) | Next action | Stage | Maps to |
|--:|---|---|:-:|---|---|---|---|---|
| 1 | Letter of Introduction | Company | Yes | Verified | Approved | - | S17 | Documents |
| 2 | Certificate of Registration | Company | Yes | Verified | Approved | - | S07, S17 | Documents + Financials (registrationNumber) |
| 3 | Company Profile | Company | Yes | Verified | Approved | - | S05, S17 | Documents |
| 4 | Memorandum & Articles of Association | Company | Yes | Replacement Required | Replacement Required | Older version on file. Upload the current signed copy. (owner: Idowu) | S12, S17 | Documents |
| 5 | CAC Documents (CAC 2/2.5, CAC 2.1, CAC 7/2.3) | Company | Yes | Verified | Approved | Three forms; store as one document set or three typed files. | S07, S12, S17 | Documents + Contact (directors) |
| 6 | Tax Compliance Evidence | Tax | Yes | Replacement Required | Replacement Required | Older version on file. Upload the current tax compliance evidence. (owner: Idowu) | S14, S17 | Documents + Financials (taxId) |
| 7 | VAT Registration Certificate | Tax | Yes | Missing | Pending Upload | Obtain and upload. (owner: Idowu) | S07, S14, S17 | Documents + Financials (vatNumber) |
| 8 | Cancelled Cheque | Banking | Yes | Missing | Pending Upload | Obtain and upload. Proof of the bank account entered in Banking. (owner: Idowu) | S13, S17 | Documents + bank-account repeater |
| 9 | Bank Reference Letter | Banking | Yes | Missing | Pending Upload | Instruction letter must be checked and signed by the authorised signatory before upload. (owner: Idowu) | S13, S17 | Documents + bank-account repeater |
| 10 | Recommendation Letter from Client | Commercial | Yes | Verified | Approved | - | S11, S17 | Documents + vendor-reference repeater |
| 11 | Director's Passport Photograph | Identity | Yes | Missing | Pending Upload | Photo needed. (owner: Idowu) | S12, S17 | Documents + director (primaryHeadshotPhoto) |
| 12 | Valid Identification Card | Identity | Yes | Under Review | Pending Verification | Marked done in the source list, but the NIN photo still needs checking, so treat as Under Review until verified. (owner: Idowu) | S12, S17 | Documents + Financials (nin, primaryIdPhoto) |
| 13 | Price List | Commercial | Yes | Missing | Pending Upload | Popular products and prices with a valid-till date; can be customised on request. Expires. (owner: Idowu) | S09, S17 | Documents + vendor-offering repeater |
| 14 | Client LPO / Letter of Award of Contract | Commercial | Yes | Verified | Approved | Uploaded. | S11, S17 | Documents + vendor-reference repeater |
| 15 | Duly Filled Registration Form | Forms | Yes | Missing | Pending Upload | Source list conflicts: item 15 appears under both Completed and Pending. Treat as Missing until the signed form is uploaded and checked. (owner: Idowu) | S17 | Documents (generated from the wizard) |

Summary: Verified 6, Replacement Required 2, Missing 6, Under Review 1 (total 15).

Rules for the pack:

1. Submission is blocked until every mandatory document is at least Uploaded; it cannot be Approved without reviewer verification (§4.2).
2. Documents with validity (Price List: valid-till date; tax and insurance evidence; ID) carry `expires_at`; reminders fire at 30/7/1 days.
3. Signed items (Bank Reference Letter instruction, Registration Form) need an authorised-signatory upload, not a typed name.
4. Items that duplicate wizard data (registration number, tax ID, VAT number, NIN, bank account, director photo) are cross-checked against the typed values at S18; mismatches raise a validation issue.
5. The pack is configurable: an administrator can add, hide (`is_active`) or make optional per country and per customer without a code change.
6. The vendor sees the same list with the same statuses in **Documents**, and the same counts on **Home** and in the admin **Document Queue**.

### 7.1 Upload slots per registration section (photos and documents where they are needed)

Documents are uploaded **in the section where the information is entered**, not only in the Required Documents step. Every slot with a document number is the same record as that row of the pack above: uploading in the section marks the document Uploaded in step 12, on the vendor **Documents** page and in the admin Document Queue. Optional slots (logo, premises photos, catalogue, contact photo) are not part of the mandatory pack.

| Step | Section | Slot | Upload | Doc # | Accepts | Camera | Required | Note |
|--:|---|---|---|--:|---|:-:|:-:|---|
| 2 | Company information | `d1` | Letter of Introduction | 1 | pdf |  | Yes | Signed letter on company letterhead |
| 2 | Company information | `d3` | Company Profile | 3 | pdf |  | Yes | Brochure or profile document |
| 2 | Company information | `logo` | Company logo | - | image |  | No | Shown on the vendor card and Passport |
| 3 | Company address | `premises` | Premises photos (front, office, warehouse) | - | image | Yes | No | Supports the site inspection (S28); camera capture on mobile |
| 4 | Registration details | `d2` | Certificate of Registration | 2 | pdf, image | Yes | Yes | Scan or photo of the CAC certificate |
| 4 | Registration details | `d4` | Memorandum & Articles of Association | 4 | pdf |  | Yes | Current signed copy |
| 4 | Registration details | `d5` | CAC Documents (CAC 2/2.5, CAC 2.1, CAC 7/2.3) | 5 | pdf |  | Yes | One file per form or one combined set |
| 6 | Products and services | `d13` | Price List | 13 | pdf, sheet |  | Yes | Popular products and prices with a valid-till date; can be customised on request |
| 6 | Products and services | `catalogue` | Product catalogue / specifications | - | pdf |  | No | Optional; supports S09 and procurement search |
| 7 | Contact persons | `headshot` | Primary contact photo | - | image | Yes | No | CCC field primaryHeadshotPhoto |
| 8 | Customer references | `d10` | Recommendation Letter from Client | 10 | pdf, image | Yes | Yes | Signed letter from a current or past client |
| 8 | Customer references | `d14` | Client LPO / Letter of Award of Contract | 14 | pdf, image | Yes | Yes | Evidence of a real order or award |
| 9 | Directors | `d11` | Director's Passport Photograph | 11 | image | Yes | Yes | Recent passport-style photo; camera capture on mobile |
| 9 | Directors | `d12` | Valid Identification Card | 12 | image, pdf | Yes | Yes | National ID / NIN slip, passport or licence; front and back; NIN photo is checked |
| 10 | Banking details | `d8` | Cancelled Cheque | 8 | image, pdf | Yes | Yes | Proof of the account entered above |
| 10 | Banking details | `d9` | Bank Reference Letter | 9 | pdf |  | Yes | Instruction letter checked and signed by the authorised signatory |
| 11 | Tax information | `d6` | Tax Compliance Evidence | 6 | pdf, image | Yes | Yes | Current tax compliance evidence |
| 11 | Tax information | `d7` | VAT Registration Certificate | 7 | pdf, image | Yes | Yes | Current VAT certificate |
| 12 | Required documents | `d15` | Duly Filled Registration Form | 15 | pdf |  | Yes | Download the form generated from this wizard, sign it, upload it |
| 13 | Compliance (insurance and certifications) | `row-insurance` | Insurance certificate (one per insurance row) | - | pdf, image | Yes | No | Attached to each insurance row; expiry date drives reminders |
| 13 | Compliance (insurance and certifications) | `row-certification` | Certificate file (one per certification row) | - | pdf, image | Yes | No | Attached to each certification row; expiry date drives reminders |

Slot behaviour (PRD M2 upload rules applied per slot):

- **Accepts:** image = jpg, jpeg, png, webp, heic; pdf = pdf; sheet = xls, xlsx, csv. Maximum 10 MB per file.
- **Camera capture:** slots marked Camera open the device camera on phones and tablets (photos, ID cards, cheques, certificates); desktop uses the file picker or drag and drop.
- **Before the file is accepted:** type, size, duplicate, corrupt, password-protected and virus checks; mandatory metadata (document type and, where relevant, expiry or valid-till date) is captured with the file.
- **Preview and replace:** images show a thumbnail; PDFs show the file name and size; a vendor can remove or replace a file until submission (from stage 18 onward, replacement goes through a request).
- **Repeater rows** (insurance, certifications, and later bank accounts or directors) carry their own file; a row cannot be marked Verified without it.
- **Cross-check (S18):** the typed value is compared with the uploaded document where possible (registration number, tax ID, VAT number, NIN, account number); a mismatch raises a validation issue the vendor must resolve.
- **Sensitive files** (ID cards, passport photos, cheques) are stored privately, never public, shown only to roles with permission, and every view is audit-logged (R11).
- **Lifecycle:** each upload starts at Uploaded, then follows the document lifecycle in section 4.2.

## 8. Module specifications (M-01 to M-22)

Each module has a build block (tier, pages, stages, data owner, build status, roles, acceptance criteria) followed by the **source detail** from the existing PRD page (scope, dependencies, success criteria, layout, upload rules, status lifecycles, design principles). The source detail is kept verbatim in meaning; where it conflicts with §1-§7 and §9, those sections win and the conflict is logged in §10. **M-10 and M-20 are unused numbers (G-17).**

### M-01 — Vendor Registration & Onboarding Centre

| | |
|---|---|
| Tier | FLEX |
| Mockup page(s) | reg (admin), Company & Passport (vendor) |
| J01 stages | S01-S16 |
| Data owner | partners_partners, fos_partner_profiles, FosVendorInvitation, vendor_passports |
| Build status | Partial: CCC wizard (10 tabs) and vendor RegisterCompanyWizard built; invitation form and token routes exist; Declaration step, 16-step navigation, multi-staff membership missing (G-02, G-08, G-01) |
| Roles | Vendor Admin W; Vendor W until S18; Procurement/Finance/Audit V |

**Acceptance criteria**

- **AC-01.1** Given a Vendor Admin sends an invitation to a valid email, then an invitation row with expiry exists, the vendor receives an email and the status is Sent.
- **AC-01.2** Given an expired or revoked invitation, when it is opened, then registration is refused with a clear message and no account is created.
- **AC-01.3** Given a Draft with any required field empty, when the vendor presses Submit, then submission is blocked, each error shows beside its field and the step is marked Error.
- **AC-01.4** Given all required fields and all mandatory documents (§7), when the vendor submits, then status becomes Submitted, a validation task is created and the data becomes read-only.
- **AC-01.5** Given a vendor saves midway, when they return on another device, then the server draft is restored.
- **AC-01.6** Given a contact type other than Vendor or Partner is requested through VendorOS, then the request is rejected (R3).
- **AC-01.7** Given the same registration number, tax ID or email already exists, then S19 flags a possible duplicate and approval is blocked until an admin resolves it.

<details><summary>Source detail from the PRD page (M-01)</summary>

The Vendor Registration & Onboarding Centre is the entry point into the VendorFlow ecosystem. Its purpose is to collect, validate, assess and approve all information required before a company becomes an approved supplier. The module replaces paper forms, email submissions and manual vendor onboarding with a guided digital workflow. This module is the foundation of every other VendorFlow module. No Purchase Order, RFQ, Contract or Payment can exist unless a vendor has successfully completed this process.

#### Scope

- Vendor registration
- Company profiling
- Contact management
- Business information
- Products & services
- Banking information
- Tax information
- Compliance documentation
- Supplier declarations
- Approval workflow
- Vendor activation
- Vendor passport creation

#### Module Dependencies

- Vendor Passport
- Document Management
- Supplier Assessment
- HSE Induction
- Procurement
- Contracts
- Compliance
- Risk Management
- Notifications
- Reporting

#### Success Criteria

- Register online
- Save progress at any time
- Upload all required documents
- Complete mandatory validations
- Submit for approval
- Receive a Vendor Number
- Receive a Vendor Passport
- Become an Active Vendor

#### Primary Objectives

- Register new suppliers
- Maintain supplier master data
- Capture company information, contacts, directors
- Capture banking & tax information
- Capture product catalogue & service capabilities
- Upload required compliance documents
- Validate information & trigger supplier assessment
- Route approvals
- Generate Vendor Number & create Vendor Passport
- Activate supplier

#### Supported Vendor Types

Manufacturer · Distributor · Importer · Exporter · Retailer · Wholesaler · Contractor · Consultant · Service Provider · OEM · Agent · Government Supplier · International Supplier · Local Supplier

Multiple selections allowed. Administrators can configure additional vendor categories without modifying the application.

#### Registration Types — 7 entry paths

- **New Registration** — First time supplier
- **Existing Vendor Update** — Existing supplier updating records
- **Annual Revalidation** — Supplier updating expired info
- **Invitation Registration** — Registers from invitation email
- **Self Registration** — Registers via Vendor Portal
- **Bulk Import** — Procurement imports via template
- **ERP Synchronised** — Auto-created via ERP integration

#### Vendor Status Lifecycle

Every status is fully traceable through the Audit Trail and displayed on the Vendor Dashboard.

`Draft → Submitted → Pending Validation → Pending Procurement Review → Pending Technical Review → Pending Finance Review → Pending Compliance Review → Pending HSE Review → Pending Management Approval → Approved → Vendor Number Assigned → Vendor Passport Created → Active Vendor → Eligible for RFQ → Purchase Orders → Contract → Performance Monitoring → Renewal → Archive`

#### Registration Sources

- Vendor Portal
- Procurement Officer
- Administrator
- Import Spreadsheet
- API Integration
- ERP Integration
- Mobile Application
- Invitation Link

#### Registration Dashboard

Cards shown to the supplier the moment registration opens.

- **Registration Progress** — 58%
- **Documents** — 8 of 12
- **Validation** — 3 Issues
- **Current Status** — Draft
- **Estimated Time** — 15 min
- **Support Contact** — Email · Phone · Helpdesk · Live Chat
- **Outstanding Actions** — Mandatory tasks remaining
- **Messages** — From Procurement & Compliance

#### Application Layout

Four-panel enterprise workspace, consistent throughout registration.

_Layout mock_ — header: Header — Logo · Company · Reg. Reference · Search · Notifications · Save Status · Profile; body: Wizard Steps (16-step nav) Main Workspace Current Form Help Panel (context-sensitive); action bar: Previous · Save Draft · Next · Cancel · Submit

#### Layout Principles

- Responsive Bootstrap 5 layout
- Two-column forms
- Sticky navigation & action buttons
- Context-sensitive help panel
- Mobile responsive
- Tablet optimized

#### Header & Save Status

#### Header contains

- VendorFlow Logo
- Current Company
- Registration Reference
- Global Search
- Notifications
- Help
- Language Selector
- Save Status
- Current User / Profile / Logout

#### Save Status indicator (always visible)

Saving... → Saved → Offline → Sync Pending → Last Saved: 10:42 AM

#### Left Navigation Wizard — 16 steps

- **Step 1** — Welcome
- **Step 2** — Company Information
- **Step 3** — Company Address
- **Step 4** — Registration Details
- **Step 5** — Business Information
- **Step 6** — Products & Services
- **Step 7** — Contact Persons
- **Step 8** — Customer References
- **Step 9** — Directors
- **Step 10** — Banking Details
- **Step 11** — Tax Information
- **Step 12** — Required Documents
- **Step 13** — Compliance
- **Step 14** — Declaration
- **Step 15** — Review
- **Step 16** — Submit

_Legend:_ &#10004; Completed &#128994; Current &#9898; Pending &#128308; Validation Error &#128993; Review Required &#128274; Locked

</details>

### M-02 — Document Management & Verification Centre

| | |
|---|---|
| Tier | FLEX |
| Mockup page(s) | docs (admin), Documents (vendor) |
| J01 stages | S17-S18, S22 |
| Data owner | documents (polymorphic), fos_required_documents, Spatie media (to consolidate) |
| Build status | Partial: document centre, required-document checklist and inline rule editing exist; two file paths and a seed-pack mismatch remain (G-03) |
| Roles | Vendor Admin W; Vendor W (own); reviewers V |

**Acceptance criteria**

- **AC-02.1** Given the active required-document pack, when a vendor opens Documents, then each mandatory document shows a status and the count of missing items.
- **AC-02.2** Given an upload with a disallowed type, excess size, corrupt content or password protection, then it is rejected with the reason; a valid file is virus-scanned before it becomes visible.
- **AC-02.3** Given an upload of the same document type, then a new version is created, the old one is marked Replaced and history shows both.
- **AC-02.4** Given a reviewer rejects a document with a reason, then it is Rejected, the vendor is notified and submission/readiness stay blocked until it is replaced.
- **AC-02.5** Given an expiry date 30, 7 and 1 days away, then one notification fires at each point; on expiry the status becomes Expired and the vendor is flagged for revalidation.
- **AC-02.6** Given a user from another partner requests a document URL, then access is denied (R7).
- **AC-02.7** Given a Price List whose valid-till date is in the past, then its status becomes Expired.

<details><summary>Source detail from the PRD page (M-02)</summary>

Provides a secure, centralized repository for all vendor documents required throughout the vendor lifecycle. Its purpose is to capture, organize, validate, verify, approve, renew, and archive supplier documentation while ensuring compliance with organisational policies and regulatory requirements — replacing paper filing, email attachments, and manual document tracking.

#### Scope

- Document upload
- Document validation
- Document verification
- Document approval
- Version control
- Expiry monitoring
- Document renewal
- Document rejection
- Document replacement
- Document history
- Document archive
- Document search
- Document preview
- Document download

#### Module Dependencies

- Vendor Registration & Onboarding
- Vendor Passport
- Supplier Assessment
- HSE Induction
- Procurement
- Contracts
- Compliance
- Risk Management
- Audit Trail
- Notifications
- Reporting

#### Success Criteria

- Upload all required documents
- View document status in real time
- Replace rejected documents
- Renew expired documents
- Receive document approval notifications
- Maintain a complete compliance record
- Support audits with a complete document history

#### Primary Objectives

Capture, organize, validate, verify, approve, renew and archive every vendor document across its full lifecycle, replacing paper filing and email attachments with a fully digital process.

#### Supported Document Categories

Company Registration · Tax Documents · Banking Documents · Insurance · Certifications · Licences · Financial Documents · Customer References · Contracts · Health & Safety · Environmental · Quality Assurance · Legal Documents · Product Catalogues · Company Profile · Images · Videos · Other Supporting Documents

Additional categories are configurable by the Administrator.

#### Document Types — 7 categories

- **Mandatory** — Required before submission
- **Optional** — Supporting information
- **Expiring** — Require renewal before expiry
- **Renewable** — Updated periodically
- **Internal** — Visible only to authorised staff
- **Vendor Submitted** — Uploaded by suppliers
- **System Generated** — Generated automatically

#### Document Status Lifecycle

Displayed within the Vendor Passport and Vendor Dashboard at every stage.

`Not Required → Required → Pending Upload → Uploaded → Pending Validation → Pending Verification → Pending Approval → Approved → Active → Expiring Soon → Expired → Renewal Required → Replaced → Archived`

#### Document Sources

- Vendor Portal
- Registration Wizard
- Procurement Officer
- Mobile Application
- API Integration
- ERP Integration
- Email Import
- Bulk Upload

#### Document Dashboard

- **Required** — 12
- **Uploaded** — 10
- **Approved** — 8
- **Pending Review** — 2
- **Expiring Soon** — 3
- **Expired** — 1
- **Compliance Score** — 92%
- **Storage Used** — 245 MB

#### Application Layout

_Layout mock_ — header: Header — Logo · Company · Global Search · Notifications · Save Status · Profile; body: Categories (16-item nav) Document Workspace Upload / List View Preview Panel; action bar: Upload · Replace · Download · Approve · Reject · Archive

#### Layout Principles

- Responsive Bootstrap 5 layout
- Drag-and-drop upload
- Multi-file upload
- Document preview panel
- Sticky action bar
- Mobile responsive
- Tablet optimized

#### Upload Behaviour & File Validation

#### Upload behaviour

- Drag and Drop
- Browse Files
- Mobile Camera Capture
- Scan to PDF
- Replace Existing Document
- Preview Before Upload
- Rename Document
- Add Comments

#### File validation checks

- File Type
- File Size
- Duplicate Files
- Corrupt Files
- Password Protected Files
- Virus Scan
- Mandatory Metadata

#### Version Control & Audit Trail

#### Version control tracks

- Version Number
- Upload Date
- Uploaded By
- Approval Status
- Previous Versions
- Change History

#### Every document action records

- Date & Time
- User
- Action
- File Name
- Version
- IP Address
- Browser

#### Notifications & Security

#### Notifications sent for

- Upload Successful
- Validation Failed
- Document Approved / Rejected
- Expiry Reminder
- Renewal Required
- Replacement Uploaded
- Verification Complete

#### Security model

Suppliers only see their own documents. Procurement reviews commercial documents, Finance reviews banking documents, Compliance reviews regulatory documents, HSE reviews safety documents. Administrators have full access.

#### Document Categories — mapped to Registration

Side-by-side view of which Registration section produces which document category:

| Registration Section | Document Category |
|---|---|
| Company Information | Certificate of Incorporation |
| Registration Details | Registration Certificates |
| Banking Details | Bank Letter, Cancelled Cheque |
| Tax Information | VAT, Tax Clearance |
| Customer References | Reference Letters, LPOs |
| Directors | ID Documents, Passport Photos |
| Products & Services | Brochures, Catalogues |
| Compliance | Policies, Certifications |
| HSE | HSE Certificates |
| Commercial Terms | Supporting Agreements |

#### Design Principles

- Maximum two-column layout for forms and metadata
- Large drag-and-drop upload areas
- Instant document preview
- Inline validation messages
- Timeline showing every document action
- Consistent action bar: Upload, Replace, Approve, Reject, Download
- Mobile-responsive with camera upload support
- Every document keeps a full approval and version history

</details>

### M-03 — Supplier Assessment & Due Diligence Centre

| | |
|---|---|
| Tier | FLEX (ESG/Risk CORE) |
| Mockup page(s) | assessment |
| J01 stages | S19-S34 |
| Data owner | fos_vendor_* (reviews, verification checks, scores, recommendations), vendor_passports |
| Build status | Partial: verification checks, discipline reviews, scoring, recommendation and approvals built; 0 live reviews seeded (G-19) |
| Roles | Per §3.3 |

**Acceptance criteria**

- **AC-03.1** Given a Submitted vendor that passed validation, then review tasks are created for the stages enabled by the installation edition (ESG and Risk only in CORE).
- **AC-03.2** Given a reviewer without the stage permission tries to decide, then the action is refused (403).
- **AC-03.3** Given decision reject without findings, then a validation error shows; with findings the decision is saved, immutable and audited.
- **AC-03.4** Given all required reviews approved, when scoring runs, then a 0-100 score with per-discipline breakdown is stored and a recommendation is required before management approval.
- **AC-03.5** Given request_information, then a vendor action is created and the vendor notified; the vendor response returns the vendor to the same stage.
- **AC-03.6** Given parallel reviews, then management approval stays unavailable until all are decided.

<details><summary>Source detail from the PRD page (M-03)</summary>

Responsible for evaluating every supplier before approval, providing structured assessments across Procurement, Technical, Finance, Legal, Compliance, HSE, ESG, Quality, and Information Security so only qualified suppliers become approved vendors. No supplier can become Approved until all mandatory assessments have been completed or formally waived.

#### Scope

- Procurement assessment
- Technical assessment
- Commercial assessment
- Financial assessment
- Legal assessment
- Compliance assessment
- HSE assessment
- ESG assessment
- Information security assessment
- Quality assessment
- Risk assessment
- Consolidated supplier score
- Recommendation workflow
- Approval workflow
- Audit trail

#### Module Dependencies

- Vendor Registration & Onboarding
- Document Management
- Vendor Passport
- HSE Induction
- Risk Management
- Procurement
- Compliance
- Contracts
- Executive Dashboard
- Notifications
- Reporting

#### Success Criteria

- All required assessments are completed
- Mandatory documents have been verified
- Overall score meets the approval threshold
- Required approvals have been granted
- Supplier status changes to Approved
- Vendor Passport is activated

#### Assessment Status Lifecycle

Every status appears in the Vendor Passport and Assessment Dashboard.

`Not Started → Assigned → In Progress → Awaiting Information → Completed → Pending Review → Approved → Rejected → Requires Reassessment → Closed`

#### Assessment Dashboard

- **Total Assessments**
- **Assigned to Me**
- **Awaiting Review**
- **Completed Today**
- **High Risk Vendors**
- **Average Score**
- **Approval Rate**
- **Overdue Assessments**

#### The 10 Assessment Disciplines

- **Procurement** — Product suitability · Pricing · Delivery capability · Lead times · Reference checks
- **Technical** — Equipment · Production capacity · Skilled personnel · Technology maturity
- **Financial** — Financial stability · Credit rating · Banking verification · Tax compliance
- **Legal** — Company registration · Licences · Litigation history · Sanctions screening
- **Compliance** — Mandatory documents · Certificate validity · Anti-bribery declaration
- **HSE** — HSE policy · Incident history · Safety certifications · PPE compliance
- **ESG** — Environmental practices · Labour practices · Human rights · Governance
- **Information Security** — Cybersecurity policy · Data protection · Access controls · Incident response
- **Quality** — ISO certifications · Quality policy · Non-conformance mgmt
- **Risk** — Financial Risk · Operational Risk · Compliance Risk · Reputational Risk

#### Scoring Engine

Supports weighted scoring, Yes/No, multiple choice, numeric scoring, pass/fail, mandatory questions, reviewer comments and evidence attachments. Example weighting:

| Discipline | Weight |
|---|---|
| Technical Capability | 25% |
| Financial Stability | 20% |
| Compliance | 20% |
| HSE | 15% |
| Quality | 10% |
| Commercial | 10% |
| Overall Score | 88% — Recommendation: APPROVE |

#### Recommendation Options

- Approve
- Approve with Conditions
- Request More Information
- Reject
- Escalate
- Site Visit Required

#### Notifications & Security

#### Notifications sent for

- Assessment assigned / completed
- Additional information requested
- Assessment approved / rejected
- Vendor approved / rejected
- Assessment overdue

#### Security model

Procurement reviewers access commercial assessments, Finance reviews financial, Legal reviews legal, Compliance reviews compliance, HSE reviews safety. Administrators have full access. Suppliers only see outcomes and requests for more information.

#### Deliverables

- Consolidated Assessment Report
- Supplier Risk Profile
- Approval Recommendation
- Assessment Scorecard
- Audit Report
- Vendor Readiness Status
- Executive Summary

</details>

### M-04 — HSE Induction, Training & Certification Centre

| | |
|---|---|
| Tier | FLEX |
| Mockup page(s) | hse (admin), Training & HSE (vendor) |
| J01 stages | S27-S28 |
| Data owner | CCC certification records, HSE profile fields, documents |
| Build status | Partial: certification records and review exist; no course enrolment, tests, certificate issuing workflow (G-13). Mockup tags this CORE in error (G-05) |
| Roles | Vendor Admin W; Audit V; Vendor W (own) |

**Acceptance criteria**

- **AC-04.1** Given a vendor completes induction content and passes the test at the pass mark, then a certificate is issued with an expiry and appears in Training & HSE and in the Passport.
- **AC-04.2** Given a failed test, then a retake is allowed after the configured wait and every attempt is recorded.
- **AC-04.3** Given a certificate expires within 30 days, then the vendor is notified and it appears in Home action items.
- **AC-04.4** Given a mandatory HSE certificate is expired and the customer rule requires it, then the vendor cannot be Eligible for Opportunities.

<details><summary>Source detail from the PRD page (M-04)</summary>

Ensures every supplier, contractor, consultant, visitor and vendor representative understands the organization s Health, Safety, Security and Environmental (HSSE) requirements before entering company premises or commencing work — replacing paper induction forms and manual safety briefings with a digital learning, assessment and certification platform. No vendor employee shall access facilities until mandatory HSE induction is complete.

#### Scope

- Digital HSE induction
- Training videos
- Safety presentations
- Company policies
- Interactive learning
- Online examinations
- Randomized quizzes

#### Module Dependencies

- Vendor Registration
- Vendor Passport
- Supplier Assessment
- Document Management
- Risk Management
- Compliance
- Notifications
- Reporting
- Security Gate System

#### Success Criteria

- Complete induction training
- Watch mandatory videos
- Pass HSE examinations
- Receive digital certification
- Obtain site access eligibility
- Maintain valid HSE certification

#### HSE Status Lifecycle

`Not Started → Assigned → Training Started → Video Completed → Quiz Started → Quiz Passed → Certificate Generated → Active → Expiring Soon → Expired → Retraining Required`

#### HSE Dashboard

- **Assigned Courses**
- **Completed Courses**
- **Pending Courses**
- **Certificates**
- **Expiring Certificates**
- **Average Test Score**
- **Total Training Hours**
- **Compliance %**

#### Course Content & Safety Topics

#### Every lesson includes

- Video
- Slides
- Images
- Interactive content
- Downloadable handbook
- FAQs
- Knowledge checks

#### Core safety topics covered

- Company Safety Policy
- Personal Protective Equipment
- Hazard Identification
- Emergency Response
- Permit to Work
- Lock Out Tag Out (LOTO)
- Fire Safety
- Environmental Protection
- Security Awareness

#### Assessment Engine & Quiz Rules

#### Question types supported

- Multiple choice
- True / False
- Image-based questions
- Scenario questions
- Randomized questions
- Timed examinations
- Question banks

#### Example quiz configuration

- **Questions** — 20
- **Pass Mark** — 80%
- **Time Limit** — 30 min
- **Attempts** — 3

#### Results & Certificate

#### Results screen displays

- Total Questions
- Correct / Incorrect Answers
- Score
- Pass / Fail
- Review Answers
- Download Certificate

#### Certificate contains

- **Certificate Number**
- **Vendor Name**
- **Participant Name**
- **Course Name**
- **Completion Date**
- **Expiry Date**
- **QR Code**
- **Digital Signature**
- **Training Provider**
- **Certificate Status**

Security personnel can scan the QR code to verify certificate validity, expiry, vendor and participant in real time.

#### Refresher Training & Business Rules

#### Retraining is automatically scheduled

- Before expiry
- After policy updates
- Following serious incidents
- Following audit findings

#### Business Rules

- Training is mandatory before site access
- Videos must be completed before assessments
- Minimum pass mark is configurable
- Failed users may retake according to policy
- Certificates automatically expire
- Expired certificates suspend site access
- Every training activity is recorded in the audit trail

#### Reports Generated

- Training Completion Report
- Outstanding Training
- Certificate Register
- Expired Certificates
- Quiz Performance
- Department Compliance
- Vendor Compliance
- Incident vs Training Analysis

</details>

### M-05 — Vendor Passport & Vendor Workspace

| | |
|---|---|
| Tier | FLEX |
| Mockup page(s) | passport (admin), Company & Passport (vendor) |
| J01 stages | S35-S38 |
| Data owner | vendor_passports, vendor_passport_state_logs |
| Build status | Built: Passport list and 360 exist; QR/verification page, staff access and revalidation scheduling incomplete |
| Roles | Vendor Admin W; Vendor Primary V + staff access; others V |

**Acceptance criteria**

- **AC-05.1** Given final approval, then a unique vendor number is assigned and exactly one Passport is created keyed by partner_id.
- **AC-05.2** Given a Passport, then Passport 360 shows Overview, Documents, Performance, Contracts, Staff Access, Communications and Timeline; the QR verification page shows public-safe fields only.
- **AC-05.3** Given a suspension, then a reason is required, new RFQ/PO eligibility is blocked immediately and the change is logged.
- **AC-05.4** Given the primary contact opens Staff Access, then they can manage staff for their own vendor only.
- **AC-05.5** Given revalidation is due, then the status becomes Pending Revalidation and the vendor is notified.

<details><summary>Source detail from the PRD page (M-05)</summary>

The Vendor Passport is the permanent digital identity of every approved supplier. Once registration, document verification, assessment, approvals and HSE induction are complete, the system automatically creates a Vendor Passport — the single source of truth for every future RFQ, PO, Contract, Delivery, Invoice, Payment, Performance Review and Compliance check. The Vendor Workspace is the operational dashboard where Procurement and Vendors manage the whole relationship from one place.

#### Scope

- Digital Vendor Passport
- Vendor Workspace Dashboard
- Vendor Profile
- Compliance Status
- Performance Score
- Risk Score
- Document Centre
- Certification Centre
- Contract Overview
- Financial Summary
- Communication Centre

#### Module Dependencies

- Vendor Registration
- Document Management
- Supplier Assessment
- HSE Induction
- Procurement
- Finance
- Performance
- Contracts
- Risk Management
- AI Copilot

#### Success Criteria

- Vendor Passport is generated automatically on approval
- Vendor Workspace shows real-time compliance and performance
- All linked modules feed data into one profile
- QR code verification works instantly

#### Vendor Passport Lifecycle

`Registration → Verification → Assessment → Approval → Vendor Number Assigned → Vendor Passport Created → Vendor Activated → RFQs → Purchase Orders → Deliveries → Invoices → Payments → Performance Reviews → Annual Revalidation → Archive`

#### Vendor Workspace Dashboard

- **Vendor Number**
- **Vendor Status**
- **Overall Compliance**
- **Risk Rating**
- **Performance Score**
- **Active Contracts**
- **Open RFQs**
- **Active Purchase Orders**
- **Outstanding Invoices**
- **Payments Pending**
- **Expiring Documents**
- **HSE Certificate Status**

#### Digital Vendor Card

A scannable identity card containing Vendor ID, Company Name, QR Code, Approval Status, Valid Until and Compliance %. Procurement and security teams can verify a vendor instantly by scanning the QR code.

#### Compliance Centre

Shows Overall Compliance %, Missing Documents, Expiring Documents, Pending Approvals, Open Audit Findings, Policy Acknowledgements.

_Legend:_ &#128994; Compliant &#128993; Attention Required &#128308; Non-Compliant

#### Certification Centre

Tracks ISO Certificates, Industry Certifications, OEM Certifications, Professional Memberships and HSE Certificates — each with Certificate Number, Issuing Authority, Effective Date, Expiry Date and Verification Status.

#### Performance & Risk Dashboards

#### Performance KPIs

- Delivery Performance
- Quality Rating
- SLA Achievement
- Invoice Accuracy
- Responsiveness
- Customer Satisfaction
- Audit Results
- Corrective Actions

Example overall score: 92% — Excellent

#### Risk Categories

- Financial Risk
- Compliance Risk
- Operational Risk
- HSE Risk
- ESG Risk
- Cyber Risk
- Reputation Risk

Example overall rating: Medium Risk

#### Reports & Deliverables

#### Reports

- Vendor Profile Report
- Compliance Summary
- Performance Summary
- Risk Summary
- Document Expiry Report

#### Deliverables

- Digital Vendor Passport
- Vendor Workspace Dashboard
- QR-verifiable Vendor Card
- Consolidated 360 Vendor Profile

</details>

### M-06 — Procurement Workspace (RFQ, Tender, PO & Contracts)

| | |
|---|---|
| Tier | FLEX |
| Mockup page(s) | procurement (admin), Orders & RFQs (vendor) |
| J01 stages | S39-S42 |
| Data owner | purchases_* (ERP); VendorOS adds only missing stage workflow |
| Build status | Needed: ERP read-through only (G-04) |
| Roles | Procurement W; Finance, Warehouse V; Vendor A (own) |

**Acceptance criteria**

- **AC-06.1** Given Procurement creates an RFQ, then only vendors in Eligible for Opportunities can be invited.
- **AC-06.2** Given an invited vendor, then they see only their RFQs, can accept, decline, ask questions and submit a quotation before the closing date; after closing the quotation is read-only.
- **AC-06.3** Given bids, then evaluation compares them by weighted criteria and award links or creates the ERP purchase order without a duplicate.
- **AC-06.4** Given a PO, then the vendor can acknowledge it and see the delivery schedule; Warehouse receipt updates the vendor-visible status.

<details><summary>Source detail from the PRD page (M-06)</summary>

Manages the complete sourcing and purchasing lifecycle after a vendor has been approved — RFQs, quotation evaluation, awarding business, issuing Purchase Orders, managing contracts, monitoring deliveries. No RFQ, Tender, PO or Contract may be issued to a vendor without an Active Vendor Passport and Approved compliance status.

#### Scope

- Procurement Dashboard
- Vendor Discovery
- RFQ Management
- Tender Management
- Bid Submission & Evaluation
- Award Recommendations
- Purchase Orders
- Contract linkage
- Delivery & GRN management
- Procurement Analytics

#### Module Dependencies

- Vendor Passport
- Supplier Assessment
- Document Management
- Contract Lifecycle Management
- Finance
- Performance
- Risk Management
- Notifications

#### Success Criteria

- RFQs can only go to Active, compliant vendors
- Bids are evaluated with consistent weighted scoring
- Award recommendations are traceable to a workflow
- Purchase Orders are generated automatically on award

#### Procurement Lifecycle

`Purchase Request → Approval → Vendor Selection → RFQ / Tender → Quotation Submission → Technical Evaluation → Commercial Evaluation → Award Recommendation → Approval → Purchase Order → Contract → Delivery → Goods Receipt (GRN) → Invoice → Payment → Performance Review`

#### Procurement Dashboard

- **Open RFQs**
- **Active Tenders**
- **Pending Evaluations**
- **Approved Vendors**
- **Purchase Orders**
- **Contracts**
- **Deliveries**
- **Goods Received**
- **Pending Invoices**
- **Procurement Spend**
- **Supplier Performance**
- **Procurement Savings**

#### RFQ Management

#### RFQ information captured

- RFQ Number
- Issue Date
- Closing Date
- Procurement Officer
- Currency
- Delivery Location
- Payment Terms
- Attachments
- Instructions

#### Vendor actions

- Accept Invitation
- Decline
- Ask Question
- Submit Quotation
- Save Draft

#### Bid Evaluation & Weighted Scoring

Evaluation types: Technical, Commercial, Financial, Compliance, HSE, Risk. Example weighting:

| Item | Weight |
|---|---|
| Technical | 40% |
| Commercial | 25% |
| Financial | 15% |
| Compliance | 10% |
| HSE | 5% |
| Risk | 5% |

#### Award Recommendation

Displays Winning Vendor, Total Score, Justification, Estimated Savings, Evaluation Summary and Committee Comments. Approval workflow:

`Evaluator → Procurement Manager → Finance → Executive Approval → Award`

#### Business Rules

- Only Active Vendors may participate in procurement
- Vendors with expired compliance or HSE certification cannot receive new RFQs
- Every procurement action is recorded in the Audit Trail
- Purchase Orders require approval before issue
- Contracts must be linked to an approved vendor
- GRN must be completed before invoice approval unless overridden by authorized personnel

#### Reports & Deliverables

#### Reports

- RFQ Summary
- Award History
- Spend Analysis
- Supplier Performance Report

#### Deliverables

- Procurement Workspace
- RFQ & Tender Engine
- Bid Evaluation Toolkit
- Award & PO Automation

</details>

### M-07 — Finance, Invoicing & Payment Management Centre

| | |
|---|---|
| Tier | FLEX (std) / CORE (enterprise controls) |
| Mockup page(s) | finance (admin), Invoices & Payments (vendor) |
| J01 stages | S43 |
| Data owner | accounts_* (ERP) |
| Build status | Needed: read-through only |
| Roles | Finance W; Procurement V; Vendor A (own) |

**Acceptance criteria**

- **AC-07.1** Given a vendor submits an invoice, then it must reference one of their own POs and cannot exceed the PO value without being flagged.
- **AC-07.2** Given an invoice, then the system matches it to PO and goods receipt; a mismatch sets Disputed with a reason.
- **AC-07.3** Given a payment in ERP accounting, then the vendor sees Paid with date and reference without any copied record.
- **AC-07.4** Given a change to payment terms, then it needs the Finance permission and is audit-logged.

<details><summary>Source detail from the PRD page (M-07)</summary>

Manages the complete financial relationship between the organisation and its vendors — a secure, transparent, auditable process for invoice submission, verification, payment approvals, processing, tax management, credit control and financial reporting. Eliminates paper invoices and disconnected finance processes with a fully digital procure-to-pay (P2P) workflow.

#### Scope

- Finance Dashboard
- Invoice Management
- Credit Notes
- Debit Notes
- Payment Requests
- Payment Approvals
- Payment Processing
- Tax Management
- Supplier Statements
- Account Reconciliation

#### Module Dependencies

- Procurement
- Vendor Passport
- Contract Lifecycle Management
- Document Management
- Audit & Compliance
- Reporting
- Integration Hub (banking, ERP)

#### Success Criteria

- Invoices are matched to POs and GRNs automatically
- Payment approvals follow a configurable multi-level workflow
- Vendor statements always reconcile
- On-time payment rate is measurable and improving

#### Finance Lifecycle

`Purchase Order → Goods Receipt (GRN) → Invoice Submitted → Invoice Validation → Finance Review → Approval → Payment Scheduled → Payment Released → Payment Confirmed → Vendor Statement Updated → Transaction Archived`

#### Finance Dashboard

- **Outstanding Invoices**
- **Approved Invoices**
- **Overdue Invoices**
- **Pending Payments**
- **Payments This Month**
- **Total Spend**
- **VAT Payable**
- **WHT Deducted**
- **Credit Notes**
- **Debit Notes**
- **Average Payment Days**
- **Supplier Balance**

#### Invoice Management

Suppliers submit invoices against approved Purchase Orders.

#### Invoice fields

- Invoice Number
- Purchase Order
- Vendor
- Invoice Date
- Due Date
- Currency
- Invoice Amount
- VAT Amount
- WHT Amount
- Payment Terms
- Supporting Documents

#### Payment Approval Workflow

`Accounts Officer → Finance Manager → Financial Controller → Chief Finance Officer → Payment Released`

Approval levels are configurable based on payment value.

#### Financial KPIs

- Total Procurement Spend
- Outstanding Liabilities
- Average Payment Time
- On-Time Payment Rate
- Invoice Processing Time
- Tax Liability
- Cash Flow Forecast
- Vendor Payment Performance

#### Reports & Deliverables

#### Reports

- Payment Register
- Aged Payables
- Tax Summary
- Vendor Statement Report

#### Deliverables

- Finance Dashboard
- Invoice-to-Pay Engine
- Multi-level Payment Approval
- Bank Integration

</details>

### M-08 — Vendor Performance, SLA & Continuous Improvement Centre

| | |
|---|---|
| Tier | FLEX (std) / CORE (advanced) |
| Mockup page(s) | perf |
| J01 stages | S44-S45 |
| Data owner | fos_vendor_performance_* , ERP transactions as sources |
| Build status | Partial: reviewer-entered periodic scoring and lifecycle transitions; no live analytics |
| Roles | Vendor Admin, Procurement W; Finance, Audit, Warehouse V; Vendor V (own score) |

**Acceptance criteria**

- **AC-08.1** Given a review period, then a weighted scorecard (delivery, quality, finance, HSE, compliance) can be entered in FLEX and is computed from ERP outcomes in CORE.
- **AC-08.2** Given a score below the configured threshold, then a corrective action is created and the vendor is notified.
- **AC-08.3** Given expiries and review periods, then renewal and revalidation tasks are scheduled automatically.

<details><summary>Source detail from the PRD page (M-08)</summary>

Enables continuous measurement and improvement of supplier performance throughout the vendor lifecycle using KPIs, SLAs, delivery/quality metrics, audit findings, corrective actions, customer feedback and vendor scorecards — developing strategic partnerships while catching poor performers early.

#### Scope

- Performance Dashboard
- Vendor Scorecard
- KPI Management
- SLA Management
- Delivery/Quality/Commercial/Compliance Performance
- Audit Findings
- Corrective Actions (CAPA)
- Customer Feedback
- Vendor Ranking
- Improvement Plans

#### Module Dependencies

- Vendor Passport
- Procurement
- Finance
- Audit & Compliance
- Contracts
- Risk Management
- Reporting

#### Success Criteria

- Every vendor has an up-to-date scorecard
- KPIs are tracked against target with variance and trend
- Poor performers are automatically flagged for review
- Improvement plans are tracked to closure

#### Performance Lifecycle

`Vendor Activated → Purchase Orders → Deliveries → Performance Data Captured → KPI Calculated → Scorecard Generated → SLA Evaluation → Performance Review → Corrective Actions → Continuous Improvement → Annual Vendor Review`

#### Performance Dashboard

- **Overall Vendor Score**
- **Active Vendors**
- **Preferred Vendors**
- **Vendors on Watch List**
- **Critical Vendors**
- **SLA Compliance**
- **Delivery Performance**
- **Quality Rating**
- **Audit Findings**
- **Open CAPAs**
- **Customer Satisfaction**
- **Vendor Ranking**

#### Vendor Scorecard

Each vendor receives an automated scorecard showing Vendor Name, Vendor Number, Performance Score, Risk Rating, Compliance Score, Preferred Vendor Status and Last Review Date. Example: Overall Performance 94% — Preferred Vendor.

#### Key Performance Indicators (KPIs)

Configurable KPIs, each with Target, Actual, Variance, Trend and Weighting:

- On-Time Delivery
- Delivery Accuracy
- Product Quality
- Service Quality
- Response Time
- Invoice Accuracy
- Cost Competitiveness
- Innovation
- Sustainability
- Safety Performance
- Compliance
- Customer Satisfaction

#### Vendor Ranking

`Preferred Vendor → Strategic Vendor → Approved Vendor → Conditional Vendor → Watch List → Suspended Vendor`

#### Reports & Deliverables

#### Reports

- Vendor Scorecard Report
- SLA Compliance Report
- CAPA Status Report
- Vendor Ranking Report

#### Deliverables

- Performance Dashboard
- Automated Vendor Scorecards
- SLA Engine
- Continuous Improvement Tracker

</details>

### M-09 — Audit, Compliance & Governance Centre

| | |
|---|---|
| Tier | CORE (compliance centre std in FLEX) |
| Mockup page(s) | audit |
| J01 stages | S21-S22, S26, S28 |
| Data owner | compliance checks/actions, audit tables |
| Build status | Needed (audit workspace); compliance checks exist |
| Roles | Audit W; others V |

**Acceptance criteria**

- **AC-09.1** Given an audit plan, then it has scope, auditor, date; findings carry severity and evidence and link to CAPA.
- **AC-09.2** Given the compliance centre, then it shows rule coverage per vendor and each gap creates an assigned action with a due date.
- **AC-09.3** Given the audit log, then it is append-only and exportable.

<details><summary>Source detail from the PRD page (M-09)</summary>

Provides enterprise-wide oversight of vendor compliance, governance, regulatory obligations, internal controls and audit activities — continuous monitoring, scheduled/ad-hoc audits, non-conformity management, corrective actions and full audit trails, establishing VendorFlow as a Governance, Risk and Compliance (GRC) platform.

#### Scope

- Compliance Dashboard
- Audit Planning
- Internal Audits
- External Audits
- Vendor Audits
- Audit Checklists
- Findings Management
- Evidence Library
- CAPA
- Regulatory Compliance
- Policy Management
- Risk Register
- Governance Reviews

#### Module Dependencies

- Vendor Passport
- Supplier Assessment
- HSE Induction
- Enterprise Risk Management
- Document Management
- Contracts
- Reporting

#### Success Criteria

- Audits are planned, executed and closed on schedule
- Findings are tracked to root cause and corrective action
- Regulatory obligations are monitored continuously
- Governance reviews happen on a defined cadence

#### Compliance Lifecycle

`Compliance Requirement → Monitoring → Scheduled Audit → Audit Execution → Findings Identified → Risk Assessment → Corrective Actions → Verification → Compliance Achieved → Continuous Monitoring`

#### Compliance Dashboard

- **Overall Compliance Score**
- **Active Audits**
- **Planned Audits**
- **Completed Audits**
- **Open Findings**
- **Critical Findings**
- **CAPAs Due**
- **Regulatory Obligations**
- **Expiring Certifications**
- **Vendor Compliance Rate**
- **Governance Reviews**
- **Compliance Trend**

#### Audit Checklists

Supports Configurable Questions, Yes/No Responses, Multiple Choice, Weighted Scoring, Mandatory Questions, Evidence Attachments, Comments, Photographs and GPS Verification.

#### Findings Management

Each finding records Finding Number, Audit Reference, Description, Category, Severity, Root Cause, Recommendation, Responsible Person, Due Date and Status.

_Legend:_ &#128994; Low &#128993; Medium &#128992; High &#128308; Critical

#### Governance KPIs

- Compliance Percentage
- Audit Completion Rate
- CAPA Closure Rate
- Average Time to Close Findings
- Critical Findings
- Repeat Findings
- Regulatory Compliance Rate
- Vendor Audit Pass Rate
- Policy Acknowledgement Rate
- Governance Effectiveness Score

#### Reports & Deliverables

#### Reports

- Audit Summary Report
- Findings Register
- CAPA Status Report
- Regulatory Compliance Report

#### Deliverables

- Compliance Dashboard
- Audit Management Engine
- Findings & CAPA Tracker
- Governance Reporting Suite

</details>

### M-11 — Contract Lifecycle Management (CLM) Centre

| | |
|---|---|
| Tier | CORE |
| Mockup page(s) | clm |
| J01 stages | S41 |
| Data owner | ERP agreement tables to map first |
| Build status | Needed (G: no CLM workspace) |
| Roles | Procurement W; Finance, Audit V; Vendor V (own) |

**Acceptance criteria**

- **AC-11.1** Given an award, then a contract is created linked to the award and the partner from a template.
- **AC-11.2** Given obligations with due dates, then reminders fire and overdue obligations are flagged.
- **AC-11.3** Given a renewal date, then alerts fire at the configured intervals.

<details><summary>Source detail from the PRD page (M-11)</summary>

Manages every stage of a supplier contract — request, drafting, negotiation, legal review, approval, execution, renewals, amendments, obligations, performance monitoring and closure — in a centralized digital repository with full visibility into every contractual relationship.

#### Scope

- Contract Dashboard
- Contract Repository
- Contract Requests
- Contract Authoring
- Templates & Clause Library
- Legal Review
- Negotiation
- Approval Workflow
- Electronic Signature
- Obligations & SLA Management
- Renewals & Amendments

#### Module Dependencies

- Vendor Passport
- Procurement
- Finance
- Enterprise Risk Management
- Document Management
- Notifications
- Reporting

#### Success Criteria

- Every contract links to an approved vendor
- Legal and commercial review happen before signature
- Obligations and SLAs are tracked to completion
- Renewals are flagged well before expiry

#### Contract Lifecycle

`Contract Request → Draft → Legal Review → Commercial Review → Negotiation → Approval → Electronic Signature → Active Contract → Performance Monitoring → Renewal / Amendment → Contract Closure → Archive`

#### Contract Dashboard

- **Active Contracts**
- **Awaiting Approval**
- **Awaiting Signature**
- **Expiring Soon**
- **Expired**
- **Renewals Due**
- **Amendments**
- **SLA Compliance**
- **Contract Value**
- **Vendor Obligations**
- **Customer Obligations**
- **High Risk Contracts**

#### Contract Categories

Supply Agreement · Service Agreement · Framework Agreement · Maintenance Agreement · Consultancy Agreement · Outsourcing Agreement · Software Licence · Subscription Agreement · Construction Contract · Equipment Lease · MoU · NDA

#### Approval Workflow

`Contract Owner → Procurement Manager → Legal Counsel → Finance → Executive Approval → Electronic Signature`

Approval routing is configurable by contract type and value.

#### Business Rules

- Every contract must be linked to an approved Vendor Passport
- Expired contracts cannot be referenced by new Purchase Orders
- Every contract version is permanently retained
- Legal approval is mandatory for configurable contract types
- Electronic signatures are immutable once completed
- SLA breaches automatically create performance events

#### Reports & Deliverables

#### Reports

- Contract Register
- Expiry Report
- Obligation Tracker
- Renewal Pipeline

#### Deliverables

- Contract Repository
- Clause & Template Library
- E-Signature Engine
- SLA & Obligation Tracker

</details>

### M-12 — Enterprise Risk Management (ERM) Centre

| | |
|---|---|
| Tier | CORE |
| Mockup page(s) | erm |
| J01 stages | S30 |
| Data owner | risk register tables (new) |
| Build status | Needed |
| Roles | Audit W; others V |

**Acceptance criteria**

- **AC-12.1** Given a risk, then likelihood x impact produce a rating and the risk links to a vendor or category with a mitigation owner.
- **AC-12.2** Given the register, then analytics show risks by rating, owner and status.

<details><summary>Source detail from the PRD page (M-12)</summary>

Identifies, assesses, monitors and mitigates risk across vendors, procurement, contracts, financial exposure, cybersecurity, compliance, ESG and operational resilience — becoming the organization s central risk intelligence platform, automatically collecting indicators from every module into a live Enterprise Supplier Risk Profile.

#### Scope

- Enterprise Risk Dashboard
- Risk Register
- Risk Categories
- Risk Assessment
- Risk Matrix
- Vendor Risk Profile
- Third-Party Risk Management
- Supply Chain Risk
- Business Continuity Planning
- Incident Management
- Risk Treatment Plans
- Risk Heat Maps

#### Module Dependencies

- Vendor Passport
- Supplier Assessment
- Audit & Compliance
- Finance
- Procurement
- Integration Hub
- Reporting

#### Success Criteria

- Every material risk has an identified owner
- Risk scores update automatically as inputs change
- Treatment plans are tracked to closure
- Executives can see enterprise risk at a glance

#### Enterprise Risk Lifecycle

`Risk Identified → Risk Assessment → Likelihood & Impact Analysis → Risk Score Generated → Risk Owner Assigned → Treatment Plan → Monitoring → Review → Closed / Accepted`

#### Enterprise Risk Dashboard

- **Enterprise Risk Score**
- **High Risk Vendors**
- **Critical Risks**
- **Open Risks**
- **Risks Under Review**
- **Mitigated Risks**
- **Overdue Treatments**
- **Financial Exposure**
- **Compliance Risks**
- **Cyber Risks**
- **ESG Risks**
- **Supply Chain Risks**

#### Risk Categories

Strategic · Financial · Operational · Compliance · Cyber · ESG · HSE risks are all tracked with their own dedicated registers feeding the enterprise view.

#### Risk Matrix

Configurable 5 5 Likelihood Impact matrix:

| Likelihood | Impact Rating |
|---|---|
| Rare | Low |
| Possible | Medium |
| Likely | High |
| Almost Certain | Critical |

#### Business Rules & Reports

#### Reports

- Enterprise Risk Register
- Vendor Risk Profile Report
- Treatment Plan Status
- Risk Trend Analysis

#### Deliverables

- Enterprise Risk Dashboard
- Risk Heat Maps
- Third-Party Risk Engine
- Business Continuity Tracker

</details>

### M-13 — Communication & Collaboration Centre

| | |
|---|---|
| Tier | FLEX (std) / CORE (enterprise) |
| Mockup page(s) | comms (admin), Communications (vendor) |
| J01 stages | all |
| Data owner | service_desk_tickets + fos_communication_contexts |
| Build status | Partial: placeholder module; vendor actions create tickets (G-18) |
| Roles | All internal W (assigned); Vendor W (own) |

**Acceptance criteria**

- **AC-13.1** Given a vendor action, then a ticket is created and linked to the vendor partner through a context row.
- **AC-13.2** Given a vendor user, then they see only threads linked to their partner and never private notes.
- **AC-13.3** Given an email reply, then it threads onto the same conversation without duplicating the message.
- **AC-13.4** Given an assigned thread, then assignment and standard SLA timers are shown and breaches notify the assignee.

<details><summary>Source detail from the PRD page (M-13)</summary>

The central communication hub — secure real-time collaboration between procurement, finance, compliance, HSE, contract managers, executives and vendors. Every conversation, task, document, approval and notification is captured and linked to its vendor, RFQ, contract, invoice or audit, replacing scattered emails and messages.

#### Scope

- Communication Dashboard
- Enterprise Inbox
- Team Chat
- Vendor Messaging
- Discussion Boards
- Announcements
- Email/SMS/WhatsApp/Teams/Slack Integration
- Video Meetings
- Task Management
- Shared Calendar
- Document Collaboration
- Activity Stream

#### Module Dependencies

- Vendor Passport
- Procurement
- Finance
- Audit & Compliance
- Notifications
- Integration Hub

#### Success Criteria

- Every conversation is linked to the right vendor/RFQ/contract
- No message goes unanswered past its SLA
- Vendors and staff can communicate on every channel they use

#### Communication Lifecycle

`Message Created → Recipients Selected → Delivered → Read → Reply → Task Created (Optional) → Resolved → Archived`

#### Communication Dashboard

- **New Messages**
- **Unread Messages**
- **Open Conversations**
- **Vendor Conversations**
- **Internal Discussions**
- **Pending Approvals**
- **Tasks Due Today**
- **Upcoming Meetings**
- **Announcements**
- **System Alerts**
- **Escalations**
- **Broadcast Messages**

#### Channel Integrations

#### Email

- Microsoft 365
- Gmail
- SMTP Servers
- Exchange

#### SMS

- OTP
- Approval Notifications
- Payment Notifications
- Contract Alerts

#### WhatsApp

- Vendor Notifications
- RFQ Invitations
- PO Alerts
- Invoice Notifications
- Secure Links to Vendor Portal

Business Rule: sensitive documents are never sent directly via WhatsApp — only secure authenticated links.

#### Reports & Deliverables

#### Reports

- Message Volume Report
- Response Time Analysis
- Escalation Report

#### Deliverables

- Enterprise Inbox
- Multi-Channel Messaging Engine
- Task & Meeting Management

</details>

### M-14 — Vendor Self-Service Portal

| | |
|---|---|
| Tier | FLEX |
| Mockup page(s) | Vendor Hub (9 entries) |
| J01 stages | S02-S04, S37 |
| Data owner | users, vendor_passports, invitations |
| Build status | Partial: shell, profile/passport/document metadata views; membership, writes, protected downloads missing (G-02) |
| Roles | Vendor Primary / Staff |

**Acceptance criteria**

- **AC-14.1** Given a verified vendor user with an accepted invitation, then login lands on the Vendor Hub, not /admin.
- **AC-14.2** Given the hub, then it shows nine menu entries and only the vendor's own partner data on every page.
- **AC-14.3** Given a phone viewport of 375 px, then every page works without horizontal scroll and the menu is a drawer.
- **AC-14.4** Given a vendor staff member, then they see only the areas the primary contact granted.

<details><summary>Source detail from the PRD page (M-14)</summary>

The primary digital gateway through which suppliers interact with VendorFlow — secure, role-based access to manage company profile, submit documents, respond to RFQs, monitor contracts, track invoices/payments, complete HSE training and communicate with procurement, fully responsive across desktop, tablet and mobile.

#### Scope

- Vendor Dashboard
- Company Profile
- Contact Management
- Vendor Passport
- Document Upload Centre
- Compliance Centre
- HSE Training
- RFQ Centre
- Quotation Management
- Purchase Orders
- Contract Centre
- Delivery Centre
- Invoice Centre
- Payment Centre
- Support Centre

#### Module Dependencies

- Vendor Registration
- Vendor Passport
- Document Management
- Supplier Assessment
- HSE Induction
- Procurement
- Finance
- Communication Centre

#### Success Criteria

- Vendors can self-serve their own profile and documents
- RFQ response time improves through direct portal access
- Compliance status is always visible to the vendor

#### Vendor Portal Lifecycle

`Invitation → Account Activation → Profile Completion → Document Upload → Compliance Verification → Vendor Passport Activated → RFQs → Contracts → Deliveries → Invoices → Payments → Performance Reviews → Annual Revalidation`

#### Vendor Dashboard

- **Vendor Status**
- **Compliance %**
- **Vendor Score**
- **Open RFQs**
- **Submitted Quotations**
- **Active Purchase Orders**
- **Active Contracts**
- **Outstanding Invoices**
- **Payments Due**
- **Expiring Documents**
- **HSE Status**
- **Messages**

#### RFQ Centre

#### Displays

- Invitations
- Closing Dates
- Procurement Officer
- Documents
- Questions
- Submission Status

#### Vendor actions

- Accept
- Decline
- Submit Questions
- Download Documents
- Submit Bid

#### Document Upload Centre

#### Uploads

- Company Registration
- Tax Certificates
- Insurance
- Financial Statements
- ISO Certificates
- HSE Certificates
- Product Catalogues
- Policies

#### Features

- Drag & Drop
- Multiple Upload
- Version History
- Expiry Monitoring
- OCR Preview

#### Reports & Deliverables

#### Reports

- Vendor Activity Report
- Document Compliance Report

#### Deliverables

- Vendor Self-Service Hub
- Document Upload Centre
- RFQ & Quotation Engine

</details>

### M-15 — Administration & System Configuration Centre

| | |
|---|---|
| Tier | FLEX (basic) / CORE (advanced) |
| Mockup page(s) | admin |
| J01 stages | - |
| Data owner | users, roles, permissions, fos_modules |
| Build status | Partial: native admin exists; mockup stubs for Roles & Permissions and Business Units (G-07) |
| Roles | Super Admin, User Admin |

**Acceptance criteria**

- **AC-15.1** Given a role change, then it is audit-logged with actor and before/after.
- **AC-15.2** Given a module toggle, then navigation and routes follow the fos_modules state and data is retained when disabled.
- **AC-15.3** Given Business Units, then they appear only when CORE is enabled.

<details><summary>Source detail from the PRD page (M-15)</summary>

The operational control room of VendorFlow Enterprise. It allows system administrators to configure, manage, secure, monitor, and maintain every aspect of the platform without modifying source code — a highly configurable, multi-company, multi-country, multi-business-unit platform adaptable to any organization s policies, governance model, workflows, branding, security requirements, and operational processes.

#### Scope

- Administration Dashboard
- Organization Management
- Company & Business Unit Management
- User Management
- Role-Based Access Control (RBAC)
- Department Management
- Location Management
- Vendor/Procurement/Finance/Compliance/Risk/Workflow Configuration
- Notification Configuration
- Branding & White Labelling
- Security Settings
- Audit Logs
- System Monitoring
- Backup & Restore
- License Management

#### Module Dependencies

- Vendor Registration
- Document Management
- Supplier Assessment
- HSE
- Procurement
- Finance
- Performance
- Audit
- Contracts
- Risk
- Communication
- Vendor Portal
- AI Copilot
- Integration Hub

#### Success Criteria

The module is successful when administrators can fully configure VendorFlow without developer intervention.

#### Configuration Flow

> This module s source has no transactional status-lifecycle diagram like the others — it s a configuration centre. This flow is the module s own real section order, read as a setup sequence.

`Organization Setup → Business Unit & Department → Location Management → User & RBAC Setup → Module Configuration → Notification & Branding Setup → Security Centre → Audit Logs & Monitoring → Backup, License & Environment`

#### Business Rules

- Every configuration change is audited
- Only Super Administrators may modify global settings
- Organization administrators may only configure their own organization
- Deleted users are soft-deleted and retained for audit purposes
- Password policies are enforced globally unless overridden
- System backups are encrypted before storage
- License restrictions are enforced in real time

#### Reports & Deliverables

#### Reports

- User Activity Report
- Login History
- Permission Report
- Configuration Audit
- Security Report
- System Health Report
- License Report
- Backup Report
- API Usage Report

#### Deliverables

- Enterprise Administration Console
- Multi-Company & Multi-Tenant Configuration
- Advanced User & Role Management
- Enterprise Security Centre
- White-Label Branding Engine
- Backup & Disaster Recovery

</details>

### M-16 — Workflow & Business Process Automation Centre

| | |
|---|---|
| Tier | FLEX (basic) / CORE (advanced) |
| Mockup page(s) | workflow |
| J01 stages | all |
| Data owner | workflow definitions (new) |
| Build status | Needed (mockup only) |
| Roles | Super Admin, User Admin |

**Acceptance criteria**

- **AC-16.1** Given a rule (trigger, condition, action), then it runs once per event and logs its result.
- **AC-16.2** Given a rule edit, then the previous version is kept and the change is audited.

<details><summary>Source detail from the PRD page (M-16)</summary>

The orchestration engine (BPMS) automating every business process in VendorFlow. Business analysts and administrators design, configure, execute, monitor and optimize workflows using a visual low-code/no-code designer — every approval, notification, escalation, SLA, reminder and integration runs through this engine.

#### Scope

- Workflow Dashboard
- Visual Workflow Designer
- Business Process Designer
- Workflow Templates
- Business Rules Engine
- Approval Engine
- Task Engine
- Assignment Engine
- SLA Engine
- Escalation Engine
- Notification Engine
- Scheduler
- Event Manager
- Decision Engine

#### Module Dependencies

- Every VendorFlow module — this is the engine underneath approvals, notifications and escalations platform-wide

#### Success Criteria

- Any business process can be modeled without code
- Approvals route dynamically based on configurable rules
- SLA breaches trigger automatic escalation

#### Workflow Lifecycle

`Workflow Trigger → Business Rules → Task Assignment → Approval → Decision → Notification → Integration → Completion → Audit Log`

#### Workflow Dashboard

- **Active Workflows**
- **Running Processes**
- **Completed Today**
- **Failed Processes**
- **SLA Breaches**
- **Escalations**
- **Pending Approvals**
- **Waiting Tasks**
- **Scheduled Jobs**
- **Automation Success Rate**
- **Avg Completion Time**
- **Workflow Health**

#### Approval Engine

Supports Sequential, Parallel, Majority, Consensus, Conditional, Emergency and Delegated approval. Unlimited approval levels with dynamic routing based on:

- Department
- Vendor Category
- Contract Value
- Invoice Value
- Risk Score
- Country
- Business Unit

#### SLA Engine

Supports Working Hours, Business Calendars, Public Holidays, Time Zones, Pause/Resume Conditions.

_Legend:_ &#128994; Within SLA &#128993; Warning &#128308; Breached

#### Reports & Deliverables

#### Reports

- Workflow Performance Report
- SLA Breach Report
- Automation ROI Report

#### Deliverables

- Visual Workflow Designer
- Approval & SLA Engine
- Automation Marketplace

</details>

### M-17 — Integration Hub & API Management Centre

| | |
|---|---|
| Tier | CORE |
| Mockup page(s) | integration |
| J01 stages | - |
| Data owner | api keys, webhooks, ERP connector |
| Build status | Needed |
| Roles | Super Admin |

**Acceptance criteria**

- **AC-17.1** Given an API key, then it is scoped, revocable and rate-limited.
- **AC-17.2** Given a webhook, then payloads are signed and delivery attempts are logged.

<details><summary>Source detail from the PRD page (M-17)</summary>

The enterprise integration layer — secure, scalable, real-time integration with ERP, Finance, HR, Identity, Banking, Tax Authorities, Procurement Networks, DMS and BI platforms via a centralized API management, event streaming, webhook, ETL and monitoring platform.

#### Scope

- Integration Dashboard
- API Gateway
- REST API Management
- GraphQL API
- Webhooks
- Event Bus
- Data Synchronization
- ETL Engine
- File Import & Export
- ERP/Finance/HR Connectors
- Banking Integrations
- Developer Portal
- API Security

#### Module Dependencies

- Every VendorFlow module — this is the connective layer to external systems

#### Success Criteria

- New system integrations can be configured without custom code for standard connectors
- API consumers have self-service access via the Developer Portal
- Every integration event is logged and monitorable

#### Integration Lifecycle

`External Event → API Gateway → Authentication → Validation → Transformation → Workflow → Business Processing → Response → Audit & Monitoring`

#### Integration Dashboard

- **Active Integrations**
- **API Requests Today**
- **Successful Transactions**
- **Failed Transactions**
- **Avg Response Time**
- **Webhook Events**
- **Sync Jobs**
- **Scheduled Imports**
- **Scheduled Exports**
- **Connected Systems**
- **API Consumers**
- **Integration Health**

#### ERP Connectors

Certified connectors for:

- SAP S/4HANA
- Oracle ERP
- Microsoft Dynamics 365
- Sage
- Odoo
- NetSuite
- Infor
- IFS

Supporting Master Data, Purchase Orders, Vendors, Invoices and Payments.

#### API Security

- OAuth2
- JWT
- API Keys
- Mutual TLS (mTLS)
- IP Whitelisting
- Rate Limiting
- Request Signing
- Payload Encryption

#### Reports & Deliverables

#### Reports

- Integration Health Report
- API Usage Report
- Failed Transaction Log

#### Deliverables

- API Gateway
- ERP/Finance/Banking Connectors
- Developer Portal

</details>

### M-18 — AI Copilot & Intelligent Automation Centre

| | |
|---|---|
| Tier | Platform extension |
| Mockup page(s) | ai |
| J01 stages | - |
| Data owner | NaturalQuery (table-scoped) |
| Build status | Partial: AI Data Copilot exists as table-scoped querying |
| Roles | Permitted internal users |

**Acceptance criteria**

- **AC-18.1** Given a question, then results never exceed the asking user's data permissions.
- **AC-18.2** Given an AI suggestion, then it is labelled as a suggestion and never changes data without a user action.

<details><summary>Source detail from the PRD page (M-18)</summary>

The intelligence layer — AI, ML, NLP, OCR, predictive analytics and generative AI embedded throughout the platform to assist users, automate repetitive work, improve decisions and reduce risk. Acts as an intelligent assistant for procurement, compliance, finance, executives, HSE, auditors and vendors — available across every module.

#### Scope

- AI Dashboard
- Enterprise AI Copilot
- Conversational AI
- Intelligent Enterprise Search
- AI Document Intelligence
- OCR Engine
- Supplier Intelligence
- Predictive Risk Engine
- Smart Procurement/Contract/Finance Assistants
- AI Workflow Assistant
- Smart Report Generator
- AI Governance & Guardrails

#### Module Dependencies

- Every VendorFlow module — the AI layer sits across the whole platform

#### Success Criteria

- AI recommendations always show confidence level and evidence
- High-impact recommendations require human approval
- AI interactions are fully auditable

#### AI Lifecycle

`User Request → AI Understanding → Context Retrieval → Business Rules → AI Analysis → Recommendation → User Approval → Workflow Execution → Learning & Feedback`

#### AI Dashboard

- **Conversations Today**
- **Documents Analysed**
- **OCR Accuracy**
- **AI Recommendations**
- **Risks Predicted**
- **Contracts Analysed**
- **AI Generated Reports**
- **Automation Hours Saved**
- **AI Confidence Score**
- **AI Adoption Rate**
- **Knowledge Searches**
- **AI Model Health**

#### Predictive Risk Engine

Predicts:

- Vendor Failure
- Contract Breach
- Delivery Delays
- Financial Distress
- Compliance Failures
- Fraud Indicators
- Supply Chain Disruptions
- Vendor Churn

Each prediction displays Probability, Confidence Level, Suggested Mitigations and Related Evidence.

#### AI Guardrails

- PII protection
- Prompt filtering
- Output validation
- Hallucination warnings
- Human approval for high-impact recommendations
- Confidence thresholds
- Role-based AI access
- Audit logging of every AI interaction

#### Reports & Deliverables

#### Reports

- AI Usage Report
- Prediction Accuracy Report
- Automation Impact Report

#### Deliverables

- Enterprise AI Copilot
- Predictive Risk Engine
- AI Governance Framework

> Module 18 marks the completion of the core 20-module VendorFlow Gold Build Specification.

</details>

### M-19 — VendorFlow PLUS — Enterprise Procurement Hub

| | |
|---|---|
| Tier | PLUS |
| Mockup page(s) | plusprocure |
| J01 stages | S39-S43 (strategic) |
| Data owner | ERP + new sourcing tables |
| Build status | Needed |
| Roles | Procurement W |

**Acceptance criteria**

- **AC-19.1** Given a sourcing event, then it supports RFI, RFP and eTender with evaluation committees and a bid comparison.
- **AC-19.2** Given an award, then it links to the contract workspace without duplicating the ERP order.

<details><summary>Source detail from the PRD page (M-19)</summary>

A complete enterprise procurement platform digitizing the entire procurement lifecycle — demand planning, sourcing, supplier collaboration, purchasing, contract execution, inventory integration, invoice processing, payment tracking, performance and analytics. Unlike Module 6 (Procurement Workspace within VendorFlow), PLUS is a complete standalone Source-to-Pay (S2P) solution.

#### Scope

- Strategic Procurement
- Source-to-Contract
- Procure-to-Pay
- Supplier Collaboration
- Analytics
- Category Management
- Demand Planning
- Reverse Auctions
- Multi-Level Evaluations
- Procurement Committee
- Budget Management
- Warehouse Integration

#### Module Dependencies

- Vendor Passport
- Contract Lifecycle Management
- Finance
- Enterprise Risk Management
- Integration Hub
- AI Copilot

#### Success Criteria

- Full Source-to-Pay cycle runs without leaving the platform
- Budget is checked before every commitment
- Reverse auctions and multi-level evaluations are fully supported

#### Procurement Lifecycle (Full S2P)

`Demand Planning → Purchase Requisition → Budget Approval → Category Selection → Supplier Selection → RFI → RFP → RFQ → Tender → Reverse Auction → Evaluation → Negotiation → Award → Contract → Purchase Order → Delivery → Goods Receipt → Invoice → Payment → Supplier Performance → Contract Renewal`

#### Enterprise Procurement Dashboard

- **Procurement Spend**
- **Budget Available**
- **Procurement Savings**
- **RFQs**
- **Active Tenders**
- **Reverse Auctions**
- **Contracts**
- **Purchase Orders**
- **Goods Received**
- **Outstanding Invoices**
- **Preferred Suppliers**
- **Procurement Risk**
- **Supplier Performance**
- **Category Spend**
- **Maverick Spend**
- **Budget Utilization**

#### Major Workspaces

- Procurement Command Centre
- Spend Intelligence Centre
- Strategic Sourcing Centre
- eTender Centre
- Reverse Auction Centre
- Evaluation Centre
- Procurement Committee Workspace
- Contract Centre
- Purchase Order Centre
- Receiving & Warehouse Centre
- Invoice Matching Centre
- Budget Control Centre
- Supplier Collaboration Hub

#### Budget Control Centre

Monitors Budget Allocation, Commitments, Actual Spend, Remaining Budget and Budget Transfers in real time — no PO can be issued that breaches an unapproved budget line.

#### Reports & Deliverables

#### Reports

- Spend Analysis Report
- Savings Realization Report
- Supplier Scorecard
- Budget Utilization Report

#### Deliverables

- Full Source-to-Pay Platform
- Reverse Auction Engine
- Budget Control Centre
- Supplier Collaboration Hub

</details>

### M-21 — Dynamic Workspace, Page Builder & Designer

| | |
|---|---|
| Tier | Platform extension (Studio) |
| Mockup page(s) | builder |
| J01 stages | - |
| Data owner | LaraBuilder shared form JSON |
| Build status | Partial: LaraBuilder exists |
| Roles | Super Admin |

**Acceptance criteria**

- **AC-21.1** Given a form definition, then the same versioned definition drives admin and vendor forms, with draft and publish states.
- **AC-21.2** Given a published definition change, then server validation matches the JSON rules.

<details><summary>Source detail from the PRD page (M-21)</summary>

Transforms VendorFlow into a true Low-Code Enterprise Application Platform (LCAP). Instead of developers building new screens, modules, menus, dashboards or business objects, administrators visually create, modify and deploy them with drag-and-drop tools — extending VendorFlow far beyond supplier management while remaining fully upgradeable.

#### Scope — 9 Design Studios

| Studio | Purpose |
|---|---|
| Workspace Designer | Create application workspaces |
| Page Builder | Build pages visually |
| Business Object Designer | Create new entities |
| Dashboard Builder | Create dashboards |
| Navigation Builder | Configure menus |
| Layout Designer | Design record layouts |
| Component Library | Reusable widgets |
| Theme Studio | Branding & themes |
| Deployment Manager | Publish changes |

</details>

### M-22 — VendorFlow Suite Product Architecture, Editions & Commercial Framework

| | |
|---|---|
| Tier | Platform |
| Mockup page(s) | editions |
| J01 stages | - |
| Data owner | edition entitlement settings |
| Build status | Documentation only |
| Roles | Super Admin |

**Acceptance criteria**

- **AC-22.1** Given the entitlement matrix (§2), then navigation gating reads it rather than hard-coded tags.

<details><summary>Source detail from the PRD page (M-22)</summary>

Defines how the complete VendorFlow ecosystem is packaged, licensed, deployed, upgraded and expanded. Rather than one product, VendorFlow is a modular platform where customers start small and grow without replacing software or migrating data — every edition shares the same platform, database, security model, reporting engine, APIs and mobile app; customers simply unlock modules as they grow.

#### Scope — Functional Module Marketplace

The commercial catalogue every module is sold from, grouped into 8 categories:

- Foundation
- Procurement
- Finance
- Compliance
- Contracts
- Performance
- Collaboration
- Intelligence

See the Editions Summary and Editions & Licensing page for the full FLEX/CORE/PLUS breakdown.

</details>

## 9. Navigation and UI standards

### 9.1 Sitemaps (the mockup is the contract)

**Vendor Admin (buyer) menu order** (from the architecture rule): **Registration & Onboarding**, then **Vendor Passport 360**, then the other workspaces.

- Registration & Onboarding: Company Profile, Contacts & Directors, Document Upload, Assessment Scoring, Approval, Vendor Passport Issued.
- Vendor Passport 360: Overview, Documents, Performance, Contracts, Staff Access, Communications, Timeline & Activity Log. (The mockup also lists Certificate of Incorporation, Insurance and Tax Clearance as shortcuts into Documents; treat them as document filters, not pages.)
- Then: Document Management, Supplier Assessment, Induction & Certification, Audit & Governance (CORE), Enterprise Risk (CORE), Procurement Workspace, Contract Lifecycle (CORE), Warehouse & Receiving, PLUS Procurement Hub (PLUS), Finance & Payments, Performance & SLA, Inbox & Communications, Workflow Automation, Integration Hub (CORE), AI Copilot, Dynamic Form Builder, System Configuration, Help & Support.

**Vendor Hub (vendor-facing) menu, one level, nine entries:** Home, Company & Passport, Documents, Orders & RFQs, Invoices & Payments, Training & HSE, Communications, Requests, Help & Support.

| Vendor menu | Tabs | Replaces | J01 | Data owner |
|---|---|---|---|---|
| Home | Journey, Action items, Activity | Dashboard + hub cards | 1-4 | VendorOS |
| Company & Passport | Overview, Contacts, Banking & Tax, Passport, Staff Access | Company Profile + Vendor Passport | 5-18, 35-37 | CCC partner + vendor_passports |
| Documents | All, Company, Insurance & Financials, Certifications | Documents + 3 sub-links | 15-18, 22 | CCC documents |
| Orders & RFQs | RFQs, Purchase Orders, Deliveries | RFQs, POs & Deliveries | 39-42 | ERP purchasing |
| Invoices & Payments | All, Outstanding, Paid | same | 43 | ERP accounting |
| Training & HSE | Courses, Certificates, Induction | HSE Training | 27 | CCC certifications |
| Communications | Messages, Announcements, Alerts | same | all | Communications (Service Desk) |
| Requests | New request, My requests | Requests + 6 links | 22, 44-45 | Communications (Service Desk) |
| Help & Support | Chat, Email, Knowledge base | Support | - | Communications |

PRD M14 lists 16 portal areas (Compliance, Contract, Delivery, Invoice, Payment, Support centres, etc.). They are **tabs or filters inside the nine entries above**, not additional menu items (DECISION D-09 to confirm: Contracts and Compliance may need their own entries in CORE).

The vendor sees no Admin menu. The Vendor Self-Service Hub is vendor-facing only.

### 9.2 Standard list and detail drawer (rule R12)

Every vendor list uses one renderer and one drawer.

| Field | Meaning | Hidden when empty |
|---|---|:-:|
| reference | Unique id from the owning module (RFQ-1042, INV-55040, REQ-9001) | no |
| title | Human description | no |
| type | Record kind inside the module | yes |
| owner | Buyer-side handler (Procurement, Finance, Compliance) | yes |
| date | The one date that matters (due, closes, expires) | yes |
| amount | Value when money is involved | yes |
| status | Shared badge vocabulary | no |
| next action | The single thing the vendor can do now (drawer primary button) | yes |
| stage | J01 stage chip (S39-40) | drawer only |

Status colours: grey draft/invited, blue in progress/awaiting, orange action needed, red blocked/expired, green done/verified.

Row click or the chevron opens the right-hand drawer: fields, primary next-action button, "Ask a question" (opens the thread). Vendors cannot delete records; destructive actions are admin-only.

### 9.3 Page anatomy (matches the existing PRD layout)

Header (logo, company, search, notifications, save status, profile) · left navigation (workspace menu or wizard steps) · main workspace · context-sensitive help panel · sticky action bar (Previous, Save Draft, Next, Cancel, Submit). KPI strip, then tabs, then list. Breadcrumb on every page. Responsive (desktop, tablet, phone): the sidebar becomes a drawer under 900px and no page may scroll sideways at 375px. The PRD's "Bootstrap 5" wording is a design vocabulary; implementation uses Blade/Livewire/Tailwind (R5).

### 9.4 Save and progress behaviour (registration)

Save status always visible: Saving... → Saved → Offline → Sync Pending → Last saved hh:mm. Drafts autosave; validation is server-side and mirrors the field dictionary. Steps show Completed, Current, Pending Validation, Error, Review Required, Locked. From S19 the vendor's data is read-only; changes go through **Requests** (S22/S44).

## 10. Gap register (known missing; never present as built)

| ID | Area | Gap | Sev | Fix / status |
|---|---|---|:-:|---|
| G-01 | Registration | Mockup wizard has 4 steps / about 8 fields vs PRD 16 steps vs CCC 10 tabs | High | **Mockup fixed 2026-10-04**: 16-step wizard with per-section uploads. The real CCC wizard still has 10 tabs; add the vendor-facing 16-step navigation |
| G-02 | Vendor identity | No vendor-user → partner membership model; `users.partner_id` semantics unverified; multi-staff unsupported | High | Decide D-01, add explicit membership relation if needed |
| G-03 | Documents | Two file paths (CCC Media vs `documents`/`VendorDocument`); seed pack is South African, not the Nigeria pack | High | D-02, D-03 |
| G-04 | Stages 39-43 | ERP read-through only: no opportunity invitation, bid evaluation, award, QC/GRN match flow | High | Build around ERP rows (§8 M-06/M-07) |
| G-05 | Tiers | Mockup tags Induction as CORE (should be FLEX), ESG as FLEX (CORE), Editions page as PLUS; platform extensions tagged FLEX | Med | **Mockup fixed 2026-10-04** (HSE FLEX, ESG CORE, Editions FLEX, AI Copilot and Form Builder marked platform) |
| G-06 | Roles | Mockup role scope blocks Finance and Audit from the vendor review queue; Warehouse sees CLM/PLUS | Med | **Mockup fixed 2026-10-04** (Finance and Audit see the vendor queue; Executive loses automation/admin; Warehouse loses CLM/PLUS). Real permissions still need D-08 |
| G-07 | Dead ends | Approval, Timeline & Activity Log, Expiring Documents, Roles & Permissions, Business Units, vendor Communications link are toast-only | Med | **Mockup fixed 2026-10-04**: Approval page (queue, chain, history, findings required), Passport Communications and Timeline tabs, Expiring Documents, Roles & Permissions, Business Units (CORE). Real app pages still to build |
| G-08 | Registration | No Declaration step or fields (conflict of interest, anti-bribery, accuracy, consent) | High | Add fields to field dictionary and CCC |
| G-09 | Registration | Registration details step: `incorporationDate` is validated in code but not in the extracted field list; verify the UI has it | Low | Verify, add |
| G-10 | Registration | PRD lists 14 supported vendor types (multi-select, admin-configurable); CCC `companyType` is a single select; confirm categories | Med | Verify and align |
| G-11 | Data | Mockup demo data is Botswana/pula; CCC is Nigeria-first; seeded vendor mixes ZA phone/tax ID with a Lagos city | Low | **Mockup fixed 2026-10-04** (Lagos, Nigeria, naira). App seed still mixes ZA phone and tax ID with a Lagos city |
| G-12 | Documents | PRD M2 lifecycle has no Rejected / Replacement Required state although it has a Reject action | Med | **PRD page and spec fixed 2026-10-04**; add the two states to the document model |
| G-13 | HSE | Certification records exist; no course enrolment, tests, certificate issuing/expiry workflow | Med | Build LMS slice (M-04) |
| G-14 | Testing | DB-backed Pest tests blocked by migration-order failure | Med | Fix migration order |
| G-15 | Approvals | No permission gates on Approve/Reject/Hold (job wizard and vendor reviews) beyond module gate | High | D-08 permission design |
| G-16 | Admin UX | Admin mockup tables have no row actions, no breadcrumbs on 29/32 pages, no KPI strip on 12 pages | Low | **Partly fixed in mockup 2026-10-04**: breadcrumbs and KPI strips added to every admin page; row actions and the standard list + drawer on admin tables still to do |
| G-17 | Modules | M-10 and M-20 are unused numbers; M-21 and M-22 are stubs | Low | Reserve or remove |
| G-18 | Communications | Module is a disabled placeholder; vendor actions create tickets but no inbox, scoping tests or email ingestion | Med | Follow communications README rollout |
| G-19 | Demo data | Only 30 basic contacts and one demo vendor; no multi-staff vendors, reviews or ERP transactions | Med | Idempotent seeder after D-01 |
| G-21 | Uploads | Per-section upload slots (§7.1) are not in the CCC wizard; it has only the Documents tab plus ID and headshot photo fields | High | Add slots to CCC sections, backed by the same `documents` record and the required-document rules |
| G-22 | Registration | Certification and insurance expiry dates: certification expiry is not in the extracted CCC fields | Med | Verify and add `newCertificationExpiryDate` |
| G-23 | Documents | Mockup and PRD describe image/PDF validation, camera capture, virus scan, duplicate and corrupt checks; none is implemented in the app | Med | Build per §7.1 |
| G-20 | Platform | CCC/VendorOS cannot boot without Filament (Partner model implements `FilamentUser`) | Low | Defer; only if Laravel-only distribution is prioritised |


## 11. Data ownership, events and non-functional requirements

### 11.1 Data ownership (one database, rule R1/R2/R4)

| Concept | Canonical table(s) | Owner | Rule |
|---|---|---|---|
| Vendor / customer / contact identity | `partners_partners` (+ `fos_partner_profiles`) | CCC | Vendor is a role/category, never a second table |
| Our companies | `companies` | ERP support | Linked to a partner row |
| Users | `users` | FOS | `users.partner_id` meaning must be verified before use for membership (D-01) |
| Roles / permissions | `roles`, `permissions` | FOS (web guard) | ERP Shield reuses the same tables |
| Vendor lifecycle | `vendor_passports`, `vendor_passport_state_logs` | VendorOS | Keyed by `partner_id` |
| Reviews, verification, readiness, performance | `fos_vendor_*` | VendorOS | Keyed by `partner_id` |
| Invitations | `FosVendorInvitation` | VendorOS | Own `partner_id`; acceptance links a user |
| Directors / ownership | `vendor_directors` or CCC relations | CCC/VendorOS | No duplicate company/contact |
| Required-document rules | `fos_required_documents` | CCC | section, doc_type, label, required, is_active, sort_order |
| Files | `documents` (polymorphic `documentable`, ADR-022) and Spatie media | FOS | **Two paths today; pick one (D-02)** |
| Bank accounts | `partners_bank_accounts`, `banks` | ERP partners | Reuse |
| Purchasing | `purchases_orders`, `purchases_order_lines`, `purchases_requisitions` | ERP | Read/link only |
| Accounting | `accounts_*` (moves, payments, taxes) | ERP | Read/link only |
| Conversations | `service_desk_tickets` + `fos_communication_contexts` (company, app_slug, partner_id, context link) | Communications | Context row scopes every read |
| Module switches | `fos_modules` | FOS registry | Database state controls runtime |

### 11.2 Events and notifications

Channel defaults: in-app + email; SMS/WhatsApp only when a provider adapter is configured. Every event is written to the audit trail.

| Event | Recipient | Trigger |
|---|---|---|
| Vendor invited / reminder / expiring / revoked | Vendor | S01 |
| Registration submitted | Vendor Admin | Draft → Submitted |
| Validation issues found | Vendor | S18 |
| Document approved / rejected / replacement required | Vendor | reviewer action |
| Document expiring (30, 7, 1 days) / expired | Vendor + Vendor Admin | scheduler |
| Information requested / returned | Vendor | review decision |
| Review assigned / overdue | Reviewer | S23-S30 |
| Approval required / approved / rejected | Approver, Vendor Admin | S33 |
| Vendor number and Passport issued | Vendor | S35-S36 |
| Account suspended / reinstated | Vendor | status change |
| RFQ invitation / closing in 3 days / awarded | Vendor | S39-S41 |
| PO issued / delivery due / delivery received | Vendor, Warehouse | S42 |
| Invoice matched / dispute / paid | Vendor, Finance | S43 |
| Certificate expiring / training due | Vendor | S27 |
| Score published / revalidation due | Vendor | S44-S45 |
| New message / request update | Participants | Communications |

### 11.3 Non-functional requirements

- **Security:** Sensitive fields (NIN, BVN, account numbers, IBAN, tax IDs, ID photos, credit limit) masked in lists, revealed only with a permission, audit-logged on reveal, encrypted at rest. Secure signed download URLs for documents; no direct public file paths.
- **Files:** 10 MB default limit, type allow-list, duplicate and corrupt detection, password-protected file rejection, virus scan before availability, preview before upload, mobile camera capture.
- **Audit:** append-only, covers views of sensitive data, status changes, decisions, uploads, downloads and permission changes.
- **Performance:** list pages paginate server-side; dashboards use cached aggregates; Livewire actions validate and authorise on every request.
- **Accessibility (WCAG 2.1 AA):** labelled navs, `aria-expanded` on toggles, keyboard-reachable drawer with focus trap and Escape to close, visible focus ring, never colour alone for status.
- **Responsive:** tested at 1440, 1024, 768 and 375 px; no horizontal page scroll.
- **Internationalisation:** default locale and currency must be configurable per installation (the Nigeria baseline uses NGN, Nigerian states, CAC/NIN/BVN/VAT identifiers; the mockup now uses Lagos and naira demo data).
- **Testability:** every acceptance criterion in §8 maps to a Pest feature test. The DB-backed test suite is currently blocked by a migration-order failure (`fos_requirement_templates` → `products_products`); fix before relying on feature tests (G-14).

## 12. Decisions needed

| ID | Decision | Options | Recommendation |
|---|---|---|---|
| D-01 | How vendor staff map to a partner | Reuse `users.partner_id` / add `vendor_partner_user` membership relation | Add explicit membership if ERP's `users.partner_id` means "the user's own partner mirror" (verify first) |
| D-02 | Canonical document owner | `documents` (polymorphic) / Spatie media | `documents` with Spatie as storage driver; migrate CCC media |
| D-03 | Required-document packs | One global pack / pack per country and per customer | Packs keyed by country + customer; Nigeria baseline in §7 |
| D-04 | Registration UI | 16 PRD steps / 10 CCC tabs | CCC tabs as data model; 16 steps as vendor navigation (§6) |
| D-05 | Declaration content | Fixed text / configurable per customer | Configurable text, versioned, accepted with timestamp and user |
| D-06 | HSE tier | FLEX (matrix) / CORE (mockup) | FLEX |
| D-07 | Default locale and currency | NGN / ZAR / BWP per install | Setting per installation; demo follows it |
| D-08 | Approval permissions | One permission per role x stage / role-scoped decision with stage allow-list | Use the 15-role approval matrix as the source |
| D-09 | Contracts and Compliance in the vendor hub | Tabs only / own menu entries in CORE | Tabs in FLEX; entries appear when CORE is enabled |
| D-10 | Document expiry reminder intervals | 30/7/1 days / configurable | Configurable with 30/7/1 default |

## Appendix A. PRD overview sections (source)

### VendorFlow Enterprise v2 Sitemap

The full navigation tree behind this prototype — 10 main workspaces, each exposing its functionality through tabs, drawers and forms rather than hundreds of disconnected pages.

- **Main Workspaces** — 10
- **Workspace Pages** — ~95
- **Reusable Forms** — 35
- **Total Logical Screens** — ~250

#### The 10 workspaces

- Dashboard
- Vendor Management
- Procurement
- Risk & Compliance
- Contracts & Commercial
- Performance
- Training & Competency
- Communications
- Vendor Portal
- Reports & BI

#### Full tree

```text
VendorFlow
├── Dashboard (Executive Overview, KPIs, Vendor Health, Spend, Compliance, Risk, Activity, Tasks, Watch List)
├── Vendor Management
│   ├── Vendor Directory · Vendor Passport 360 (Overview, Company, Contacts, Directors, Banking, Tax,
│   │   Documents, Certifications, Insurance, Products & Services, Branches, Performance, Contracts,
│   │   Communications, Timeline, Activity Log, Notes)
│   ├── New Vendor Wizard (Company→Contacts→Directors→Banking→Tax→Documents→Certifications→
│   │   Insurance→Products→Review→Submit)
│   └── Vendor Categories · Preferred · Blacklisted · Archived
├── Procurement (Dashboard, RFQs, Quotations, Bid/Technical/Commercial Evaluation, Finance Review,
│   Procurement Review, Recommendation, Approval, Awards, POs, Contracts, Reports)
├── Risk & Compliance (Dashboard, Compliance Reviews, Risk Assessments, Site Inspections, Audits,
│   CAPA, ESG, Vendor Scoring, Health Score, Renewals, Expiring Documents, Reports)
├── Contracts & Commercial (Dashboard, Contracts, Templates, Pricing, Terms, SLAs, Renewals,
│   Digital Signatures, Spend Analysis, Reports)
├── Performance (Dashboard, KPI Scorecards, Ratings, Delivery/Quality/Financial Performance,
│   Corrective Actions, Improvement Plans, Benchmarking, Trends)
├── Training & Competency (Dashboard, Courses, Learning Centre, Induction, Assessments,
│   Competency Matrix, Certificates, Expiry Tracking, Reports)
├── Communications (Dashboard, Messages, Announcements, Meetings, Tasks, Support Tickets,
│   Surveys, Improvement Plans, Document Sharing, Activity Feed)
├── Vendor Portal (Home, Profile, Documents, Contracts, Orders, Invoices, Payments, RFQs,
│   Training, Support, Notifications)
├── Reports & BI (Executive, Vendor, Spend, Procurement, Compliance, Risk, Performance,
│   Contract Reports, Scheduled Reports, Export Centre, BI Analytics)
├── Administration (Dashboard, Users, Roles, Departments, Teams, Workflow Designer,
│   Approval Matrix, Categories, Templates, Integrations, API Keys, Audit Logs, System/Theme Settings)
├── Global Search · Notification Centre · Task Centre · Calendar · Help Centre
└── User Profile (My Account, Preferences, Security, Activity, Logout)
```

#### Common patterns reused across every workspace

- Shared tabs: Overview, Details, Documents, Timeline, Activity, Comments, Attachments, History, Audit Log
- Shared drawers: View Vendor, Quick Edit, Approve, Reject, Assign Reviewer, Upload Documents, Add Note, Send Message, View History
- Shared forms: Vendor Registration, Company/Contact/Director Details, Bank Details, Tax Info, Insurance, Certification Upload, Site Inspection Checklist, Risk Assessment, Technical/Financial Evaluation, Contract Creation, Performance Review, CAPA, Training Record, Support Ticket, User Administration

### Two-Level Workspace Architecture

Rather than ~250 disconnected screens, VendorFlow is built as 10 enterprise workspaces (daily-use, tabbed, dashboard-first) sitting on top of a detailed workflow engine — the step-by-step process screens (like the 45-step Registration & Onboarding journey) that a workspace drills down into.

- **Layer 1** — Operational Workspaces
- **Layer 2** — Detailed Workflow Engine

```text
VendorFlow
├── Executive Dashboard
├── Vendor Passport ──────────► View Registration Journey (detailed workflow)
├── Performance & Compliance ──► Risk, Audit, CAPA, Scoring detail screens
├── Contracts & Commercial ────► Contract Management detail screens
├── Procurement
├── Training & Competency
├── Communications ────────────► Vendor Portal + Communications Centre detail
├── Vendor Portal
├── Administration
└── Reports & BI

Detailed Workflow Engine (drill-down layer)
└── Registration & Onboarding Journey — v1 through v45
```

This gives two audiences what they need from the same platform: operational workspaces for daily use, and detailed process screens for processing and audit. It's the same pattern ServiceNow, SAP and Oracle use. In this prototype, the sidebar tree you're using now is the operational layer — sub-links that scroll to a table row or open a modal are the beginning of that drill-down layer.

### Editions Summary

FLEX — 8 simplified workspaces for SMEs and single-site orgs. Gets a partial version of Finance, Performance, Procurement and Administration.

CORE — Modules 1–18, the full Enterprise Supplier Lifecycle Management platform.

PLUS — adds Module 19, the standalone Enterprise Procurement Hub (Source-to-Pay).

Vendor Registration, Vendor Passport 360 and Supplier Assessment are always full on every edition — never simplified. See Editions & Licensing for the complete feature matrix.

Every module's own spec file lists a Dashboard as its first Scope item (e.g. "Procurement Dashboard", "Contract Dashboard", "AI Dashboard") — each workspace is meant to open on its own KPI view, not just a table.

### User Roles & Lifecycles

Every persona in VendorFlow has its own workflow, not just a filtered menu. Switch roles from the profile menu (top right) to preview each one — the sidebar, dashboard welcome banner, and available modules all change to match.

#### Executive

Company-wide oversight — no transactional work, pure visibility and escalation.

`KPIs Reviewed → Risk/Spend Flagged → Escalation Raised → Board Reporting → Strategic Decision → Policy Update`

#### Sees on their menu

- Dashboard (full)
- Vendor Management
- HSE & Risk
- Procurement & Contracts
- Finance & Performance
- Collaboration
- Automation & Platform
- Administration

#### Vendor Admin

Owns the vendor relationship end-to-end, from first contact to active supplier.

`New Vendor Identified → Registration Initiated → Document Collection → Assessment Routing → Approval → Passport Issued → Ongoing Relationship Mgmt`

#### Sees on their menu

- Dashboard
- Registration & Onboarding
- Vendor Passport 360
- Document Management
- Supplier Assessment
- Induction & Certification
- Inbox & Communications

#### Procurement User

Runs the sourcing cycle — from purchase request through to a signed Purchase Order.

`Purchase Request → Vendor Selection → RFQ Issued → Quotation Received → Evaluation → Award → Purchase Order Issued → Delivery Monitoring`

#### Sees on their menu

- Dashboard
- Procurement Workspace
- Finance & Payments

#### Finance

Owns the invoice-to-pay cycle and every payment approval in between.

`Invoice Received → Validation → Approval Routing → Payment Scheduled → Payment Released → Reconciled`

#### Sees on their menu

- Dashboard
- Finance & Payments

#### Audit

Independent oversight of compliance, findings and corrective action.

`Audit Planned → Fieldwork Executed → Findings Logged → CAPA Assigned → Verification → Closed`

#### Sees on their menu

- Dashboard
- Induction & Certification
- Audit & Governance

#### Warehouse

Owns physical receipt, inspection and defect capture before Finance ever sees an invoice.

`Delivery Scheduled → Received → Inspected → Defect Capture (if any) → GRN Approved → Sent to Finance`

#### Sees on their menu

- Dashboard
- Procurement Workspace → Deliveries & Inspection tab

#### User Admin

Manages who can log in and what they can touch — not business transactions.

`Access Requested → Role Assigned → Account Provisioned → Periodic Access Review → Deprovisioned on Exit`

#### Sees on their menu

- Dashboard
- System Configuration

#### Super Admin

Full unrestricted access — platform configuration, licensing and every module at once.

`Tenant Setup → Module Licensing → Security Policy Set → Continuous Monitoring → Incident Response → Platform Upgrade`

#### Sees on their menu

- Every section — Dashboard through Administration

#### Vendor (Portal)

The external, supplier-side experience — read-only on most things, self-service on a few.

`Invited / Registered → Onboarded → Passport Active → RFQ Received & Quoted → Delivery Made → Invoice Submitted → Payment Received → Performance Reviewed`

#### Sees on their menu

- Dashboard
- Vendor Self-Service Hub only (Communication & Collaboration internal tool hidden)

## Appendix B. Traceability: mockup page → module → stages

| Mockup page id | Menu label | Module | Stages |
|---|---|---|---|
| dashboard | Dashboard | M-01 / M-14 | S04 |
| reg | Registration & Onboarding | M-01 | S01-S18 |
| passport | Vendor Passport 360 | M-05 | S35-S38 |
| docs | Document Management | M-02 | S17-S18 |
| assessment | Supplier Assessment | M-03 | S19-S34 |
| hse | Induction & Certification | M-04 | S27-S28 |
| audit | Audit & Governance | M-09 | S21-S28 |
| erm | Enterprise Risk Mgmt | M-12 | S30 |
| procurement | Procurement Workspace | M-06 | S39-S42 |
| clm | Contract Lifecycle Mgmt | M-11 | S41 |
| warehouse | Warehouse & Receiving | M-06 | S42 |
| plusprocure | PLUS Procurement Hub | M-19 | S39-S43 |
| finance | Finance & Payments | M-07 | S43 |
| perf | Performance & SLA | M-08 | S44-S45 |
| comms | Inbox & Communications | M-13 | all |
| selfservice | Vendor Portal (map & preview) | M-14 | S01-S04, S37 |
| myprofile | Company & Passport (vendor) | M-05 / M-14 | S05-S18, S35-S37 |
| mydocuments | Documents (vendor) | M-02 | S15-S18 |
| myrfqpo | Orders & RFQs (vendor) | M-06 | S39-S42 |
| myinvoices | Invoices & Payments (vendor) | M-07 | S43 |
| myhse | Training & HSE (vendor) | M-04 | S27 |
| mycomms | Communications (vendor) | M-13 | all |
| requests | Requests (vendor) | M-13 / M-14 | S22, S44-S45 |
| workflow | Workflow Automation | M-16 | - |
| integration | Integration Hub & API | M-17 | - |
| ai | AI Copilot | M-18 | - |
| builder | Dynamic Form Builder | M-21 | - |
| admin | System Configuration | M-15 | - |
| editions | Editions & Licensing | M-22 | - |
| role-guide | Role & Menu Guide | M-15 | - |
| prd | PRD | - | - |
| support | Support | M-13 | - |
