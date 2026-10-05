# VendorOS mockup: workspaces, page styles and where each lives

Sources: the PRD sitemap ("10 main workspaces"), PRD Two-Level Workspace Architecture, Build Spec v2 section 9 (UI standards, rule R12), and the mockup menu.

## The page style flow

Every workspace is a small SPA. They all follow the same flow, so nothing is invented per page.

**Layer 1: the operational workspace** (daily use, tabbed, dashboard-first)

1. Breadcrumb on every page
2. Page header: title and the one primary action
3. KPI strip (the workspace opens on its own numbers, not a table)
4. Tabs (shared tabs: Overview, Details, Documents, Timeline, Activity, Comments, Attachments, History, Audit Log)
5. Standard list: one renderer, columns reference, title, type, owner, date, amount, status, next action (rule R12, no per-page table styles)
6. Right-hand drawer on row click (shared drawers: View, Quick Edit, Approve, Reject, Assign Reviewer, Upload Documents, Add Note, Send Message, View History)
7. A full form when the task is bigger than a drawer (shared forms: Vendor Registration, Company, Contact and Director Details, Bank Details, Tax Info, Insurance, Certification Upload, Site Inspection Checklist, Risk Assessment, Evaluations, Contract Creation, Performance Review, CAPA, Training Record, Support Ticket, User Administration)

**Layer 2: the workflow engine** (drill-down, step by step)

The 45-stage Registration and Onboarding journey and similar processes. Four-panel layout: header with save status (Saving, Saved, Offline, Sync Pending, Last saved), wizard steps on the left (Completed, Current, Pending, Validation Error, Review Required, Locked), main form with the context help panel, and a sticky action bar (Previous, Save Draft, Next, Cancel, Submit).

**Always:** responsive (sidebar becomes a drawer under 900px, no sideways scroll at 375px), status colours (grey draft, blue in progress, orange action needed, red blocked or expired, green done), vendors cannot delete records.

## Dashboard, the 9 workspaces, Administration, the CCC and the spec

| # | Workspace | Folder | Parts | Size |
|---|---|---|---|---|
| - | Dashboard | `sections/00-dashboard/` | 4 | 24 KB |
| 1 | Vendor Management | `sections/01-vendor-management/` | 6 | 35 KB |
| 2 | Procurement | `sections/02-procurement/` | 4 | 38 KB |
| 3 | Risk and Compliance | `sections/03-risk-compliance/` | 2 | 16 KB |
| 4 | Contracts and Commercial | `sections/04-contracts-commercial/` | 1 | 11 KB |
| 5 | Performance | `sections/05-performance/` | 1 | 12 KB |
| 6 | Training and Competency | `sections/06-training-competency/` | 1 | 15 KB |
| 7 | Communications | `sections/07-communications/` | 2 | 23 KB |
| 8 | Vendor Portal | `sections/08-vendor-portal/` | 9 | 27 KB |
| 9 | Reports and BI | `sections/09-reports-bi/` | 1 | 22 KB |
| - | Administration | `sections/10-administration/` | 8 | 52 KB |
| - | Contact Control Center (FOS module) | `sections/11-contact-control-center/` | 13 | 334 KB |
| - | Specification and Support | `sections/12-spec-docs/` | 38 | 414 KB |

---

## Dashboard

- **PRD says:** Executive overview, KPIs, vendor health, spend, compliance, risk, activity, tasks, watch list.
- **Page style:** Dashboard-first landing for every role; each role has its own banner and cards.
- **Mockup status:** Has role dashboards and the module grid. Not built: vendor health, spend and watch list panels, task centre.
- **Who (mockup roles):** All internal roles
- **Data:** Reads from the other workspaces; owns no tables
- **Source:** `MOCKUP_SRC/sections/00-dashboard/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| dashboard | `dashboard` | - | - |

---

## 1. Vendor Management

- **PRD says:** Vendor directory, Passport 360 (overview, company, contacts, directors, banking, tax, documents, certifications, insurance, products and services, branches, performance, contracts, communications, timeline, activity log, notes), New Vendor wizard, categories, preferred, blacklisted, archived.
- **Page style:** Passport is the workspace; registration is the Layer 2 workflow behind it.
- **Mockup status:** Has registration (13 steps), approval, passport with tabs, document management, assessment. Not built: directory page (the CCC directory is the list), preferred, blacklisted and archived views.
- **Who (mockup roles):** Vendor Admin, Procurement, Finance, Audit, Executive
- **Data:** CCC contacts, vendor_passports, fos_vendor_*
- **Source:** `MOCKUP_SRC/sections/01-vendor-management/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| reg | `reg` | - | - |
| approval | `approval` | - | - |
| passport | `passport` | - | - |
| docs | `docs` | - | - |
| assessment | `assessment` | - | - |

---

## 2. Procurement

- **PRD says:** Dashboard, RFQs, quotations, bid, technical and commercial evaluation, finance review, procurement review, recommendation, approval, awards, POs, contracts, reports.
- **Page style:** Tabbed workspace; evaluation and award are drill-down screens.
- **Mockup status:** Has RFQs, POs, warehouse and receiving, PLUS hub (demand, sourcing, collaboration, analytics) and Finance and Payments. Not built: quotation and evaluation screens as tabs. Finance and Payments has no workspace of its own in the PRD tree; it sits here until decided.
- **Who (mockup roles):** Procurement, Warehouse, Finance, Executive
- **Data:** ERP purchases_*, inventories_*, accounts_*
- **Source:** `MOCKUP_SRC/sections/02-procurement/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| procurement | `procurement` | - | - |
| warehouse | `warehouse` | - | - |
| plusprocure | `plusprocure` | - | - |
| finance | `finance` | - | - |

---

## 3. Risk and Compliance

- **PRD says:** Dashboard, compliance reviews, risk assessments, site inspections, audits, CAPA, ESG, vendor scoring, health score, renewals, expiring documents, reports.
- **Page style:** Dashboard, then register tabs (findings, CAPA, risks).
- **Mockup status:** Has audit (findings, CAPA, plan) and risk register. Not built: compliance reviews, site inspections, health score and renewals as their own tabs.
- **Who (mockup roles):** Audit, Executive
- **Data:** New fos_ tables for findings, CAPA, risks
- **Source:** `MOCKUP_SRC/sections/03-risk-compliance/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| audit | `audit` | - | - |
| erm | `erm` | - | - |

---

## 4. Contracts and Commercial

- **PRD says:** Dashboard, contracts, templates, pricing, terms, SLAs, renewals, digital signatures, spend analysis, reports.
- **Page style:** Register plus obligation tracking.
- **Mockup status:** Has contracts and obligations. Not built: templates, pricing, SLAs, signatures, spend analysis.
- **Who (mockup roles):** Procurement, Executive
- **Data:** New fos_contracts tables
- **Source:** `MOCKUP_SRC/sections/04-contracts-commercial/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| clm | `clm` | - | - |

---

## 5. Performance

- **PRD says:** Dashboard, KPI scorecards, ratings, delivery, quality and financial performance, corrective actions, improvement plans, benchmarking, trends.
- **Page style:** Scorecard tabs.
- **Mockup status:** Has performance and SLA overview. Not built: scorecards, benchmarking, improvement plans as tabs.
- **Who (mockup roles):** Procurement, Finance, Executive
- **Data:** New fos_vendor_performance tables
- **Source:** `MOCKUP_SRC/sections/05-performance/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| perf | `perf` | - | - |

---

## 6. Training and Competency

- **PRD says:** Dashboard, courses, learning centre, induction, assessments, competency matrix, certificates, expiry tracking, reports.
- **Page style:** Course catalogue, test, certificate register.
- **Mockup status:** Has induction and certification (three courses, the test, the register). Not built: learning centre, competency matrix.
- **Who (mockup roles):** Vendor Admin, Audit, Executive
- **Data:** New hse_courses and attempts tables; CCC certifications
- **Source:** `MOCKUP_SRC/sections/06-training-competency/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| hse | `hse` | - | - |

---

## 7. Communications

- **PRD says:** Dashboard, messages, announcements, meetings, tasks, support tickets, surveys, improvement plans, document sharing, activity feed.
- **Page style:** Unified inbox with channel tabs.
- **Mockup status:** Has the unified inbox (messages, email, WhatsApp) and the vendor portal preview. Not built: announcements, meetings, tasks, surveys.
- **Who (mockup roles):** Executive, Vendor Admin
- **Data:** Communications module
- **Source:** `MOCKUP_SRC/sections/07-communications/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| comms | `comms` | - | - |
| selfservice | `selfservice` | - | - |

---

## 8. Vendor Portal

- **PRD says:** Home, profile, documents, contracts, orders, invoices, payments, RFQs, training, support, notifications.
- **Page style:** One-level menu of nine entries; each entry is tabs over the standard list and drawer.
- **Mockup status:** Has the nine entries (Company and Passport, Documents, Orders and RFQs, Invoices and Payments, Training and HSE, Communications, Requests, Help). Contracts, payments and notifications are tabs, not menu items (D-09).
- **Who (mockup roles):** Vendor (Portal) only
- **Data:** Real vendor data through the vendor-user to partner link (to build)
- **Source:** `MOCKUP_SRC/sections/08-vendor-portal/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Company & Passport | `myprofile` | - | - |
| Documents | `mydocuments` | - | - |
| Orders & RFQs | `myrfqpo` | - | - |
| Invoices & Payments | `myinvoices` | - | - |
| Training & HSE | `myhse` | - | - |
| Communications | `mycomms` | - | - |
| Requests | `requests` | - | - |
| Help & Support | `support` | - | - |

---

## 9. Reports and BI

- **PRD says:** Executive, vendor, spend, procurement, compliance, risk, performance and contract reports, scheduled reports, export centre, BI analytics.
- **Page style:** Report library plus export centre.
- **Mockup status:** Not in the mockup. The other session built Reports and BI (M10); port it here.
- **Who (mockup roles):** Executive, Finance, Audit
- **Data:** Reads every other workspace
- **Source:** `MOCKUP_SRC/sections/09-reports-bi/`
- **Menu entries:** none yet

---

## Administration

- **PRD says:** Dashboard, users, roles, departments, teams, workflow designer, approval matrix, categories, templates, integrations, API keys, audit logs, system and theme settings.
- **Page style:** Settings tabs; configuration drawers.
- **Mockup status:** Has users, roles and permissions, business units, editions and licensing, role and menu guide, workflow automation, integration hub, AI copilot and the dynamic form builder. Not built: departments and teams pages, approval matrix, audit log viewer, theme settings.
- **Who (mockup roles):** User Admin, Super Admin
- **Data:** Shared users, roles, fos_modules
- **Source:** `MOCKUP_SRC/sections/10-administration/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| admin | `admin` | - | - |
| editions | `editions` | - | - |
| role-guide | `role-guide` | - | - |
| workflow | `workflow` | - | - |
| integration | `integration` | - | - |
| ai | `ai` | - | - |
| builder | `builder` | - | - |

---

## Contact Control Center (FOS module)

- **PRD says:** Not in the VendorOS sitemap. The shared contact book used by every FOS product.
- **Page style:** Directory, profile, 13-step form, document centre, assets, settings.
- **Mockup status:** Directory, profile, contact form for six types, assets, document centre, users and access, settings forms, rules; all live on the prototype database.
- **Who (mockup roles):** User Admin, Super Admin
- **Data:** Shared users, partners_*, fos_*; prototype copy in public/proto
- **Source:** `MOCKUP_SRC/sections/11-contact-control-center/`
- **Tabs:** Dashboard, Directory, Vendor profile, Registration wizard (comparison), Contact form (13 steps, six types), Assets, Document Centre, Settings (comparison), Settings forms (Organisation, Departments, Teams, Titles, Categories and Tags, Banks, Location, Affiliations, Field Options, Field and Tab Rules, Custom Fields, Required Documents, Type Labels), Users and access, Compare

---

## Specification and Support

- **PRD says:** Not part of the product. Reference.
- **Page style:** PRD panes and support.
- **Mockup status:** PRD (modules, Build Spec v2, audit, CCC Change List) and Support.
- **Who (mockup roles):** Everyone with the mockup
- **Data:** Generated from PRD/
- **Source:** `MOCKUP_SRC/sections/12-spec-docs/`
- **Panes:** one file per PRD pane (`pane-*.html`), generated by the PRD injector

---

## What is pending: sublinks and pages, and tabs

PRD sitemap compared with the mockup. Built = in the mockup. Partial = exists but as a panel, under another page, or without the PRD shape. Pending = not in the mockup.

| Workspace | Pages built | Pages partial | Pages pending | Tabs built | Tabs partial | Tabs pending |
|---|---|---|---|---|---|---|
| Dashboard | 8 | 0 | 0 | 1 | 0 | 0 |
| 1. Vendor Management | 9 | 2 | 0 | 17 | 0 | 0 |
| 2. Procurement | 15 | 0 | 0 | 3 | 0 | 0 |
| 3. Risk and Compliance | 12 | 0 | 0 | 2 | 0 | 0 |
| 4. Contracts and Commercial | 10 | 0 | 0 | 1 | 0 | 0 |
| 5. Performance | 10 | 0 | 0 | 1 | 0 | 0 |
| 6. Training and Competency | 9 | 0 | 0 | 1 | 0 | 0 |
| 7. Communications | 11 | 0 | 0 | 2 | 0 | 0 |
| 8. Vendor Portal | 11 | 0 | 0 | 10 | 0 | 0 |
| 9. Reports and BI | 11 | 0 | 0 | 1 | 0 | 0 |

### Dashboard

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Executive overview and KPIs | Built | role dashboards with KPI cards |
| Vendor health | Built | built as a tab or page (generated from tools/specs) |
| Spend | Built | built as a tab or page (generated from tools/specs) |
| Compliance | Built | built as a tab or page (generated from tools/specs) |
| Risk | Built | built as a tab or page (generated from tools/specs) |
| Activity | Built | Recent Activity |
| Tasks | Built | built as a tab or page (generated from tools/specs) |
| Watch list | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Dashboard has no tabs in the PRD; role switch is the only selector | Built |  |

### 1. Vendor Management

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Vendor Directory | Built | built as a tab or page (generated from tools/specs) |
| Vendor Passport 360 | Built |  |
| New Vendor wizard | Built | 13 steps, opens from New Vendor |
| Registration and onboarding | Built |  |
| Approval | Built | queue, chain, history |
| Vendor categories view | Built | built as a tab or page (generated from tools/specs) |
| Preferred vendors view | Built | built as a tab or page (generated from tools/specs) |
| Blacklisted vendors view | Built | built as a tab or page (generated from tools/specs) |
| Archived vendors view | Built | built as a tab or page (generated from tools/specs) |
| Document Management | Partial | built, but the PRD tree has no page for it; kept under Vendor Management until decided |
| Supplier Assessment | Partial | built, but the PRD tree has no page for it; kept under Vendor Management until decided |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Passport: Overview | Built |  |
| Passport: Documents | Built |  |
| Passport: Performance | Built |  |
| Passport: Contracts | Built |  |
| Passport: Communications | Built |  |
| Passport: Timeline and Activity Log | Built |  |
| Passport: Staff Access | Built | not in the PRD tab list, keep |
| Passport: Company | Built | built |
| Passport: Contacts | Built | built |
| Passport: Directors | Built | built |
| Passport: Banking | Built | built |
| Passport: Tax | Built | built |
| Passport: Certifications | Built | built |
| Passport: Insurance | Built | built |
| Passport: Products and Services | Built | built |
| Passport: Branches | Built | built |
| Passport: Notes | Built | built |

### 2. Procurement

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Procurement dashboard | Built | built as a tab or page (generated from tools/specs) |
| RFQs | Built | tab |
| Purchase Orders | Built | tab |
| Deliveries and inspection | Built | tab, plus Warehouse and Receiving page |
| Quotations | Built | built as a tab or page (generated from tools/specs) |
| Bid, technical and commercial evaluation | Built | built as a tab or page (generated from tools/specs) |
| Finance review | Built | built as a tab or page (generated from tools/specs) |
| Procurement review | Built | built as a tab or page (generated from tools/specs) |
| Recommendation | Built | built as a tab or page (generated from tools/specs) |
| Approval | Built | built as a tab or page (generated from tools/specs) |
| Awards | Built | built as a tab or page (generated from tools/specs) |
| Contracts (from awards) | Built | built as a tab or page (generated from tools/specs) |
| Reports | Built | built as a tab or page (generated from tools/specs) |
| Finance and Payments | Built | built as a tab or page (generated from tools/specs) |
| PLUS Procurement Hub | Built | PLUS edition |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Hub: Demand Planning, Sourcing Events, Supplier Collaboration, Analytics | Built |  |
| Warehouse: Receiving Workflow, Delivery Notes Archive, Expected Deliveries | Built |  |
| Finance and Payments: Invoices, Payments, Approval routing | Built | built |

### 3. Risk and Compliance

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Risk and Compliance dashboard | Built | built as a tab or page (generated from tools/specs) |
| Compliance reviews | Built | built as a tab or page (generated from tools/specs) |
| Risk assessments (risk register) | Built | page Enterprise Risk Management |
| Site inspections | Built | built as a tab or page (generated from tools/specs) |
| Audits | Built | page Audit and Governance, audit plan |
| CAPA | Built | panel on the Audit page |
| ESG | Built | built as a tab or page (generated from tools/specs) |
| Vendor scoring | Built | built as a tab or page (generated from tools/specs) |
| Health score | Built | built as a tab or page (generated from tools/specs) |
| Renewals | Built | built as a tab or page (generated from tools/specs) |
| Expiring documents | Built | built as a tab or page (generated from tools/specs) |
| Reports | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Audit page: Findings, CAPA, Audit plan | Built | built |
| Risk page: Register, Mitigations, History | Built | built |

### 4. Contracts and Commercial

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Contracts dashboard | Built | built as a tab or page (generated from tools/specs) |
| Contracts register | Built |  |
| Obligations and renewals | Built | panel |
| Templates | Built | built as a tab or page (generated from tools/specs) |
| Pricing | Built | built as a tab or page (generated from tools/specs) |
| Terms | Built | built as a tab or page (generated from tools/specs) |
| SLAs | Built | built as a tab or page (generated from tools/specs) |
| Digital signatures | Built | built as a tab or page (generated from tools/specs) |
| Spend analysis | Built | built as a tab or page (generated from tools/specs) |
| Reports | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Contracts: Register, Obligations, Renewals, Documents | Built | built |

### 5. Performance

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Performance dashboard | Built | built as a tab or page (generated from tools/specs) |
| KPI scorecards | Built | built as a tab or page (generated from tools/specs) |
| Ratings | Built | built as a tab or page (generated from tools/specs) |
| Delivery performance | Built | built as a tab or page (generated from tools/specs) |
| Quality performance | Built | built as a tab or page (generated from tools/specs) |
| Financial performance | Built | built as a tab or page (generated from tools/specs) |
| Corrective actions | Built | built as a tab or page (generated from tools/specs) |
| Improvement plans | Built | built as a tab or page (generated from tools/specs) |
| Benchmarking | Built | built as a tab or page (generated from tools/specs) |
| Trends | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Performance: Dashboard, Scorecards, Ratings, Delivery, Quality, Financial, Actions, Plans, Benchmarking, Trends | Built | built |

### 6. Training and Competency

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Training dashboard | Built | built as a tab or page (generated from tools/specs) |
| Courses | Built | panel on the Induction page |
| Learning centre | Built | built as a tab or page (generated from tools/specs) |
| Induction | Built | three courses and the test |
| Assessments | Built | built as a tab or page (generated from tools/specs) |
| Competency matrix | Built | built as a tab or page (generated from tools/specs) |
| Certificates | Built | Certification Register |
| Expiry tracking | Built | built as a tab or page (generated from tools/specs) |
| Reports | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Training: Dashboard, Courses, Learning Centre, Induction, Assessments, Matrix, Certificates, Expiry | Built | built |

### 7. Communications

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Communications dashboard | Built | built as a tab or page (generated from tools/specs) |
| Messages | Built | Unified Inbox, Direct Messages |
| Announcements | Built | tab |
| Meetings | Built | built as a tab or page (generated from tools/specs) |
| Tasks | Built | built as a tab or page (generated from tools/specs) |
| Support tickets | Built | built as a tab or page (generated from tools/specs) |
| Surveys | Built | built as a tab or page (generated from tools/specs) |
| Improvement plans | Built | built as a tab or page (generated from tools/specs) |
| Document sharing | Built | built as a tab or page (generated from tools/specs) |
| Activity feed | Built | built as a tab or page (generated from tools/specs) |
| Vendor portal preview (map and journey) | Built | page selfservice |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Inbox: Unified, Direct, Email, WhatsApp, Announcements, Alerts | Built |  |
| Inbox: Meetings, Tasks, Surveys, Documents, Feed | Built | built |

### 8. Vendor Portal

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Home | Built | built as a tab or page (generated from tools/specs) |
| Company and Passport (profile) | Built |  |
| Documents | Built |  |
| Contracts | Built | built as a tab or page (generated from tools/specs) |
| Orders and RFQs | Built |  |
| Invoices and Payments | Built |  |
| Training and HSE | Built |  |
| Requests | Built |  |
| Communications | Built | no tabs yet |
| Help and Support | Built | built as a tab or page (generated from tools/specs) |
| Notifications | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Company and Passport: Overview, Contacts, Banking and Tax, Passport, Staff Access | Built |  |
| Documents: All, Company, Tax and Banking, Identity and Forms, Commercial and Certifications | Built |  |
| Orders: RFQs, Purchase Orders, Deliveries | Built |  |
| Invoices: All, Outstanding, Paid | Built |  |
| Training: Courses, Certificates, Induction | Built |  |
| Requests: New request, My requests | Built |  |
| Home: Journey, Action items, Activity | Built | built |
| Communications: Messages, Announcements, Alerts | Built | built |
| Help and Support: Chat, Email, Knowledge base | Built | built |
| Contracts tab inside Company and Passport | Built | built |

### 9. Reports and BI

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Executive report | Built | built as a tab or page (generated from tools/specs) |
| Vendor report | Built | built as a tab or page (generated from tools/specs) |
| Spend report | Built | built as a tab or page (generated from tools/specs) |
| Procurement report | Built | built as a tab or page (generated from tools/specs) |
| Compliance report | Built | built as a tab or page (generated from tools/specs) |
| Risk report | Built | built as a tab or page (generated from tools/specs) |
| Performance report | Built | built as a tab or page (generated from tools/specs) |
| Contract reports | Built | built as a tab or page (generated from tools/specs) |
| Scheduled reports | Built | built as a tab or page (generated from tools/specs) |
| Export centre | Built | built as a tab or page (generated from tools/specs) |
| BI analytics | Built | built as a tab or page (generated from tools/specs) |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Whole workspace | Built | built |

### Global pieces from the PRD tree (not in any workspace)

| Item | Status |
|---|---|
| Global search | Built (client-side stub over the module list) |
| Notification centre | Partial (bell panel for staff; the vendor portal has a Notifications page) |
| Task centre | Built |
| Calendar | Built |
| Help centre | Built (Support page with Chat, Email, Knowledge base) |
| User profile (My account, Preferences, Security, Activity) | Built |

---

## Shared by every workspace

- `shell/`: login, sidebar, top bar, modals, overlays
- `css/`: design tokens and shared styles; `js/`: shared code (navigation, roles, editions, toast, icons)

## Role access today (from `ROLE_SECTIONS`, by current menu group)

| Role | Menu groups shown |
|---|---|
| executive | dashboard, vendor, procurement, risk, contracts, performance, training, comms, reports |
| vendor | dashboard, vendor, training, comms |
| procurement | dashboard, vendor, procurement, contracts, performance, reports |
| finance | dashboard, vendor, procurement, performance, reports |
| audit | dashboard, vendor, risk, training, reports |
| warehouse | dashboard, procurement |
| useradmin | dashboard, admin |
| superadmin | dashboard, vendor, procurement, risk, contracts, performance, training, comms, reports, admin |
| vendorportal | vendorhub |

## What changes in the mockup menu

The sidebar still uses the older nine groups. To match the PRD it should group by the ten workspaces above: Vendor Management, Procurement, Risk and Compliance, Contracts and Commercial, Performance, Training and Competency, Communications, Vendor Portal, Reports and BI, then Administration. Decisions needed before changing the menu: where Finance and Payments lives, and whether HSE Induction moves to Training and Competency (the PRD says yes).
