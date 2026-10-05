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
| - | Dashboard | `sections/00-dashboard/` | 1 | 12 KB |
| 1 | Vendor Management | `sections/01-vendor-management/` | 5 | 23 KB |
| 2 | Procurement | `sections/02-procurement/` | 4 | 23 KB |
| 3 | Risk and Compliance | `sections/03-risk-compliance/` | 2 | 4 KB |
| 4 | Contracts and Commercial | `sections/04-contracts-commercial/` | 1 | 2 KB |
| 5 | Performance | `sections/05-performance/` | 1 | 2 KB |
| 6 | Training and Competency | `sections/06-training-competency/` | 1 | 5 KB |
| 7 | Communications | `sections/07-communications/` | 2 | 16 KB |
| 8 | Vendor Portal | `sections/08-vendor-portal/` | 7 | 20 KB |
| 9 | Reports and BI | `sections/09-reports-bi/` | none yet | - |
| - | Administration | `sections/10-administration/` | 7 | 34 KB |
| - | Contact Control Center (FOS module) | `sections/11-contact-control-center/` | 13 | 334 KB |
| - | Specification and Support | `sections/12-spec-docs/` | 38 | 412 KB |

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
| Registration & Onboarding | `reg` | FLEX | Company Profile, Contacts & Directors, Document Upload, Assessment Scoring, Approval, Vendor Passport Issued |
| approval | `approval` | - | - |
| Vendor Passport 360 | `passport` | FLEX | Overview, Documents, Certificate of Incorporation, Insurance, Tax Clearance, Performance, Contracts, Staff Access (List/Card), Communications, Timeline & Activity Log |
| Document Management | `docs` | FLEX | Document Queue (FLEX), Upload Document (FLEX), Expiring Documents (FLEX) |
| Supplier Assessment | `assessment` | FLEX | Procurement (FLEX), Technical (FLEX), Finance (FLEX), Legal (FLEX), Compliance (FLEX), HSE (FLEX), ESG (CORE), Information Security (FLEX) |

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
| Procurement Workspace | `procurement` | FLEX | RFQs, Purchase Orders |
| Warehouse & Receiving | `warehouse` | FLEX | - |
| PLUS Procurement Hub | `plusprocure` | PLUS | Demand Planning (PLUS), Sourcing Events (PLUS), Supplier Collaboration (PLUS), Analytics (PLUS) |
| Finance & Payments | `finance` | FLEX | - |

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
| Audit & Governance | `audit` | CORE | - |
| Enterprise Risk Mgmt | `erm` | CORE | - |

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
| Contract Lifecycle Mgmt | `clm` | CORE | - |

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
| Performance & SLA | `perf` | FLEX | - |

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
| Induction & Certification | `hse` | FLEX | Site Safety Induction (CORE), Working at Heights (CORE), Hot Work Permit (CORE), Take Certification Test (CORE), Certification Register, Kalahari Logistics (CORE), Delta Civils & Plant Hire (CORE) |

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
| Inbox & Communications | `comms` | FLEX | - |
| Vendor Portal (map & preview) | `selfservice` | FLEX | - |

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
| System Configuration | `admin` | FLEX | Users, Roles & Permissions, Business Units (CORE) |
| Editions & Licensing | `editions` | FLEX | - |
| Role & Menu Guide | `role-guide` | FLEX | - |
| Workflow Automation | `workflow` | FLEX | Automation Rules (FLEX), Vendor Lifecycle Kanban (FLEX) |
| Integration Hub & API | `integration` | CORE | - |
| AI Copilot | `ai` | PLATFORM | - |
| Dynamic Form Builder | `builder` | PLATFORM | - |

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
| Dashboard | 2 | 2 | 4 | 1 | 0 | 0 |
| 1. Vendor Management | 4 | 2 | 5 | 7 | 0 | 10 |
| 2. Procurement | 4 | 1 | 10 | 2 | 0 | 1 |
| 3. Risk and Compliance | 3 | 3 | 6 | 0 | 1 | 1 |
| 4. Contracts and Commercial | 2 | 0 | 8 | 0 | 1 | 0 |
| 5. Performance | 0 | 2 | 8 | 0 | 0 | 1 |
| 6. Training and Competency | 3 | 1 | 5 | 0 | 0 | 1 |
| 7. Communications | 3 | 1 | 7 | 1 | 0 | 1 |
| 8. Vendor Portal | 7 | 2 | 2 | 6 | 0 | 4 |
| 9. Reports and BI | 0 | 0 | 11 | 0 | 0 | 1 |

### Dashboard

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Executive overview and KPIs | Built | role dashboards with KPI cards |
| Vendor health | Pending | panel and KPI tile |
| Spend | Pending | panel; needs ERP spend aggregate |
| Compliance | Pending | panel |
| Risk | Pending | panel |
| Activity | Built | Recent Activity |
| Tasks | Partial | My Action Items on the dashboard; no Task Centre page |
| Watch list | Partial | Vendors Needing Attention; not named or filterable as a watch list |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Dashboard has no tabs in the PRD; role switch is the only selector | Built |  |

### 1. Vendor Management

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Vendor Directory | Pending | the CCC directory is the data; add a VendorOS directory page that opens it filtered to vendors |
| Vendor Passport 360 | Built |  |
| New Vendor wizard | Built | 13 steps, opens from New Vendor |
| Registration and onboarding | Built |  |
| Approval | Built | queue, chain, history |
| Vendor categories view | Pending | list filter |
| Preferred vendors view | Pending | list filter |
| Blacklisted vendors view | Pending | list filter |
| Archived vendors view | Pending | list filter |
| Document Management | Partial | built, but the PRD tree has no page for it; keep here until decided |
| Supplier Assessment | Partial | built, but the PRD tree has no page for it; belongs with Risk and Compliance scoring or Procurement evaluation |

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
| Passport: Company | Pending |  |
| Passport: Contacts | Pending |  |
| Passport: Directors | Pending |  |
| Passport: Banking | Pending |  |
| Passport: Tax | Pending |  |
| Passport: Certifications | Pending | only a shortcut into Documents today |
| Passport: Insurance | Pending | only a shortcut into Documents today |
| Passport: Products and Services | Pending |  |
| Passport: Branches | Pending |  |
| Passport: Notes | Pending |  |

### 2. Procurement

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Procurement dashboard | Pending | KPI strip exists; no dashboard tab |
| RFQs | Built | tab |
| Purchase Orders | Built | tab |
| Deliveries and inspection | Built | tab, plus Warehouse and Receiving page |
| Quotations | Pending |  |
| Bid, technical and commercial evaluation | Pending |  |
| Finance review | Pending |  |
| Procurement review | Pending |  |
| Recommendation | Pending |  |
| Approval | Pending | approval for awards; the vendor Approval page is a different flow |
| Awards | Pending |  |
| Contracts (from awards) | Pending | link to the Contracts workspace |
| Reports | Pending | link to Reports and BI |
| Finance and Payments | Partial | invoices list only; the PRD tree has no page for it |
| PLUS Procurement Hub | Built | PLUS edition |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Hub: Demand Planning, Sourcing Events, Supplier Collaboration, Analytics | Built |  |
| Warehouse: Receiving Workflow, Delivery Notes Archive, Expected Deliveries | Built |  |
| Finance and Payments: Invoices, Payments, Approval routing | Pending | page has one panel |

### 3. Risk and Compliance

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Risk and Compliance dashboard | Pending |  |
| Compliance reviews | Pending |  |
| Risk assessments (risk register) | Built | page Enterprise Risk Management |
| Site inspections | Pending |  |
| Audits | Built | page Audit and Governance, audit plan |
| CAPA | Built | panel on the Audit page |
| ESG | Partial | an assessment review type; no page |
| Vendor scoring | Partial | Supplier Assessment page |
| Health score | Pending |  |
| Renewals | Pending | obligations and renewals sit in Contracts |
| Expiring documents | Partial | panel on Document Management |
| Reports | Pending | link to Reports and BI |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Audit page: Findings, CAPA, Audit plan | Partial | built as stacked panels, not tabs |
| Risk page: Register, Mitigations, History | Pending | one panel today |

### 4. Contracts and Commercial

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Contracts dashboard | Pending |  |
| Contracts register | Built |  |
| Obligations and renewals | Built | panel |
| Templates | Pending |  |
| Pricing | Pending |  |
| Terms | Pending |  |
| SLAs | Pending | SLA overview sits in Performance |
| Digital signatures | Pending |  |
| Spend analysis | Pending |  |
| Reports | Pending | link to Reports and BI |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Contracts: Register, Obligations, Renewals, Documents | Partial | two stacked panels, no tabs |

### 5. Performance

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Performance dashboard | Partial | Top and bottom performers |
| KPI scorecards | Partial | Vendor Scorecards panel |
| Ratings | Pending |  |
| Delivery performance | Pending |  |
| Quality performance | Pending |  |
| Financial performance | Pending |  |
| Corrective actions | Pending | CAPA lives in Risk and Compliance |
| Improvement plans | Pending |  |
| Benchmarking | Pending |  |
| Trends | Pending |  |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Performance: Dashboard, Scorecards, Ratings, Delivery, Quality, Financial, Actions, Plans, Benchmarking, Trends | Pending | page has two panels and no tabs |

### 6. Training and Competency

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Training dashboard | Pending |  |
| Courses | Built | panel on the Induction page |
| Learning centre | Pending |  |
| Induction | Built | three courses and the test |
| Assessments | Partial | test attempts panel |
| Competency matrix | Pending |  |
| Certificates | Built | Certification Register |
| Expiry tracking | Pending |  |
| Reports | Pending | link to Reports and BI |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Training: Dashboard, Courses, Learning Centre, Induction, Assessments, Matrix, Certificates, Expiry | Pending | page is one long page with panels, no tabs |

### 7. Communications

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Communications dashboard | Pending |  |
| Messages | Built | Unified Inbox, Direct Messages |
| Announcements | Built | tab |
| Meetings | Pending |  |
| Tasks | Pending |  |
| Support tickets | Partial | Help and Support page |
| Surveys | Pending |  |
| Improvement plans | Pending |  |
| Document sharing | Pending |  |
| Activity feed | Pending |  |
| Vendor portal preview (map and journey) | Built | page selfservice |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Inbox: Unified, Direct, Email, WhatsApp, Announcements, Alerts | Built |  |
| Inbox: Meetings, Tasks, Surveys, Documents, Feed | Pending |  |

### 8. Vendor Portal

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Home | Partial | the dashboard shows the journey; the PRD wants a Home page with tabs Journey, Action items, Activity |
| Company and Passport (profile) | Built |  |
| Documents | Built |  |
| Contracts | Pending | a tab, not a menu entry (D-09) |
| Orders and RFQs | Built |  |
| Invoices and Payments | Built |  |
| Training and HSE | Built |  |
| Requests | Built |  |
| Communications | Built | no tabs yet |
| Help and Support | Partial | page exists without Chat, Email, Knowledge base tabs |
| Notifications | Pending |  |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Company and Passport: Overview, Contacts, Banking and Tax, Passport, Staff Access | Built |  |
| Documents: All, Company, Tax and Banking, Identity and Forms, Commercial and Certifications | Built |  |
| Orders: RFQs, Purchase Orders, Deliveries | Built |  |
| Invoices: All, Outstanding, Paid | Built |  |
| Training: Courses, Certificates, Induction | Built |  |
| Requests: New request, My requests | Built |  |
| Home: Journey, Action items, Activity | Pending |  |
| Communications: Messages, Announcements, Alerts | Pending |  |
| Help and Support: Chat, Email, Knowledge base | Pending |  |
| Contracts tab inside Company and Passport | Pending |  |

### 9. Reports and BI

**Sublinks and pages**

| Item | Status | Note |
|---|---|---|
| Executive report | Pending |  |
| Vendor report | Pending |  |
| Spend report | Pending |  |
| Procurement report | Pending |  |
| Compliance report | Pending |  |
| Risk report | Pending |  |
| Performance report | Pending |  |
| Contract reports | Pending |  |
| Scheduled reports | Pending |  |
| Export centre | Pending |  |
| BI analytics | Pending |  |

**Tabs**

| Item | Status | Note |
|---|---|---|
| Whole workspace | Pending | port Reports and BI (M10) from the other session: report library, builder, schedules, charts |

### Global pieces from the PRD tree (not in any workspace)

| Item | Status |
|---|---|
| Global search | Built (client-side stub over the module list) |
| Notification centre | Partial (bell panel; no page) |
| Task centre | Pending |
| Calendar | Pending |
| Help centre | Partial (Support page) |
| User profile (My account, Preferences, Security, Activity) | Pending (only the role switch and logout exist) |

---

## Shared by every workspace

- `shell/`: login, sidebar, top bar, modals, overlays
- `css/`: design tokens and shared styles; `js/`: shared code (navigation, roles, editions, toast, icons)

## Role access today (from `ROLE_SECTIONS`, by current menu group)

| Role | Menu groups shown |
|---|---|
| executive | dashboard, vendor, hse, procurement, financeperf, collab |
| vendor | dashboard, vendor, hse, collab |
| procurement | dashboard, vendor, procurement, financeperf |
| finance | dashboard, vendor, financeperf |
| audit | dashboard, vendor, hse |
| warehouse | dashboard, procurement |
| useradmin | dashboard, admin |
| superadmin | dashboard, vendor, hse, procurement, financeperf, collab, automation, admin |
| vendorportal | vendorhub |

## What changes in the mockup menu

The sidebar still uses the older nine groups. To match the PRD it should group by the ten workspaces above: Vendor Management, Procurement, Risk and Compliance, Contracts and Commercial, Performance, Training and Competency, Communications, Vendor Portal, Reports and BI, then Administration. Decisions needed before changing the menu: where Finance and Payments lives, and whether HSE Induction moves to Training and Competency (the PRD says yes).
