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

**Always:** responsive (sidebar becomes a drawer under 900px, no sideways scroll at 375px), status colours (grey draft, blue in progress, orange action needed, red blocked or expired, green done), vendors cannot delete records, and the FOS shell follows the Window Rule in `Fluid_UI_KIT/RULES.md` (rail, title bar with section label, body, footer pill).

## The 10 workspaces, plus Administration, the CCC and the spec

| # | Workspace | Folder | Parts | Size |
|---|---|---|---|---|
| 1 | Dashboard | `sections/01-dashboard/` | 1 | 12 KB |
| 2 | Vendor Management | `sections/02-vendor-management/` | 5 | 23 KB |
| 3 | Procurement | `sections/03-procurement/` | 4 | 23 KB |
| 4 | Risk and Compliance | `sections/04-risk-compliance/` | 2 | 4 KB |
| 5 | Contracts and Commercial | `sections/05-contracts-commercial/` | 1 | 2 KB |
| 6 | Performance | `sections/06-performance/` | 1 | 2 KB |
| 7 | Training and Competency | `sections/07-training-competency/` | 1 | 5 KB |
| 8 | Communications | `sections/08-communications/` | 2 | 16 KB |
| 9 | Vendor Portal | `sections/09-vendor-portal/` | 7 | 20 KB |
| 10 | Reports and BI | `sections/10-reports-bi/` | none yet | - |
| 11 | Administration | `sections/11-administration/` | 7 | 34 KB |
| 12 | Contact Control Center (FOS module) | `sections/12-contact-control-center/` | 13 | 334 KB |
| 13 | Specification and Support | `sections/13-spec-docs/` | 38 | 412 KB |

---

## 1. Dashboard

- **PRD says:** Executive overview, KPIs, vendor health, spend, compliance, risk, activity, tasks, watch list.
- **Page style:** Dashboard-first landing for every role; each role has its own banner and cards.
- **Mockup status:** Has role dashboards and the module grid. Not built: vendor health, spend and watch list panels, task centre.
- **Who (mockup roles):** All internal roles
- **Data:** Reads from the other workspaces; owns no tables
- **Source:** `MOCKUP_SRC/sections/01-dashboard/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| dashboard | `dashboard` | - | - |

---

## 2. Vendor Management

- **PRD says:** Vendor directory, Passport 360 (overview, company, contacts, directors, banking, tax, documents, certifications, insurance, products and services, branches, performance, contracts, communications, timeline, activity log, notes), New Vendor wizard, categories, preferred, blacklisted, archived.
- **Page style:** Passport is the workspace; registration is the Layer 2 workflow behind it.
- **Mockup status:** Has registration (13 steps), approval, passport with tabs, document management, assessment. Not built: directory page (the CCC directory is the list), preferred, blacklisted and archived views.
- **Who (mockup roles):** Vendor Admin, Procurement, Finance, Audit, Executive
- **Data:** CCC contacts, vendor_passports, fos_vendor_*
- **Source:** `MOCKUP_SRC/sections/02-vendor-management/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Registration & Onboarding | `reg` | FLEX | Company Profile, Contacts & Directors, Document Upload, Assessment Scoring, Approval, Vendor Passport Issued |
| approval | `approval` | - | - |
| Vendor Passport 360 | `passport` | FLEX | Overview, Documents, Certificate of Incorporation, Insurance, Tax Clearance, Performance, Contracts, Staff Access (List/Card), Communications, Timeline & Activity Log |
| Document Management | `docs` | FLEX | Document Queue (FLEX), Upload Document (FLEX), Expiring Documents (FLEX) |
| Supplier Assessment | `assessment` | FLEX | Procurement (FLEX), Technical (FLEX), Finance (FLEX), Legal (FLEX), Compliance (FLEX), HSE (FLEX), ESG (CORE), Information Security (FLEX) |

---

## 3. Procurement

- **PRD says:** Dashboard, RFQs, quotations, bid, technical and commercial evaluation, finance review, procurement review, recommendation, approval, awards, POs, contracts, reports.
- **Page style:** Tabbed workspace; evaluation and award are drill-down screens.
- **Mockup status:** Has RFQs, POs, warehouse and receiving, PLUS hub (demand, sourcing, collaboration, analytics) and Finance and Payments. Not built: quotation and evaluation screens as tabs. Finance and Payments has no workspace of its own in the PRD tree; it sits here until decided.
- **Who (mockup roles):** Procurement, Warehouse, Finance, Executive
- **Data:** ERP purchases_*, inventories_*, accounts_*
- **Source:** `MOCKUP_SRC/sections/03-procurement/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Procurement Workspace | `procurement` | FLEX | RFQs, Purchase Orders |
| Warehouse & Receiving | `warehouse` | FLEX | - |
| PLUS Procurement Hub | `plusprocure` | PLUS | Demand Planning (PLUS), Sourcing Events (PLUS), Supplier Collaboration (PLUS), Analytics (PLUS) |
| Finance & Payments | `finance` | FLEX | - |

---

## 4. Risk and Compliance

- **PRD says:** Dashboard, compliance reviews, risk assessments, site inspections, audits, CAPA, ESG, vendor scoring, health score, renewals, expiring documents, reports.
- **Page style:** Dashboard, then register tabs (findings, CAPA, risks).
- **Mockup status:** Has audit (findings, CAPA, plan) and risk register. Not built: compliance reviews, site inspections, health score and renewals as their own tabs.
- **Who (mockup roles):** Audit, Executive
- **Data:** New fos_ tables for findings, CAPA, risks
- **Source:** `MOCKUP_SRC/sections/04-risk-compliance/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Audit & Governance | `audit` | CORE | - |
| Enterprise Risk Mgmt | `erm` | CORE | - |

---

## 5. Contracts and Commercial

- **PRD says:** Dashboard, contracts, templates, pricing, terms, SLAs, renewals, digital signatures, spend analysis, reports.
- **Page style:** Register plus obligation tracking.
- **Mockup status:** Has contracts and obligations. Not built: templates, pricing, SLAs, signatures, spend analysis.
- **Who (mockup roles):** Procurement, Executive
- **Data:** New fos_contracts tables
- **Source:** `MOCKUP_SRC/sections/05-contracts-commercial/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Contract Lifecycle Mgmt | `clm` | CORE | - |

---

## 6. Performance

- **PRD says:** Dashboard, KPI scorecards, ratings, delivery, quality and financial performance, corrective actions, improvement plans, benchmarking, trends.
- **Page style:** Scorecard tabs.
- **Mockup status:** Has performance and SLA overview. Not built: scorecards, benchmarking, improvement plans as tabs.
- **Who (mockup roles):** Procurement, Finance, Executive
- **Data:** New fos_vendor_performance tables
- **Source:** `MOCKUP_SRC/sections/06-performance/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Performance & SLA | `perf` | FLEX | - |

---

## 7. Training and Competency

- **PRD says:** Dashboard, courses, learning centre, induction, assessments, competency matrix, certificates, expiry tracking, reports.
- **Page style:** Course catalogue, test, certificate register.
- **Mockup status:** Has induction and certification (three courses, the test, the register). Not built: learning centre, competency matrix.
- **Who (mockup roles):** Vendor Admin, Audit, Executive
- **Data:** New hse_courses and attempts tables; CCC certifications
- **Source:** `MOCKUP_SRC/sections/07-training-competency/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Induction & Certification | `hse` | FLEX | Site Safety Induction (CORE), Working at Heights (CORE), Hot Work Permit (CORE), Take Certification Test (CORE), Certification Register, Kalahari Logistics (CORE), Delta Civils & Plant Hire (CORE) |

---

## 8. Communications

- **PRD says:** Dashboard, messages, announcements, meetings, tasks, support tickets, surveys, improvement plans, document sharing, activity feed.
- **Page style:** Unified inbox with channel tabs.
- **Mockup status:** Has the unified inbox (messages, email, WhatsApp) and the vendor portal preview. Not built: announcements, meetings, tasks, surveys.
- **Who (mockup roles):** Executive, Vendor Admin
- **Data:** Communications module
- **Source:** `MOCKUP_SRC/sections/08-communications/`

| Menu entry | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Inbox & Communications | `comms` | FLEX | - |
| Vendor Portal (map & preview) | `selfservice` | FLEX | - |

---

## 9. Vendor Portal

- **PRD says:** Home, profile, documents, contracts, orders, invoices, payments, RFQs, training, support, notifications.
- **Page style:** One-level menu of nine entries; each entry is tabs over the standard list and drawer.
- **Mockup status:** Has the nine entries (Company and Passport, Documents, Orders and RFQs, Invoices and Payments, Training and HSE, Communications, Requests, Help). Contracts, payments and notifications are tabs, not menu items (D-09).
- **Who (mockup roles):** Vendor (Portal) only
- **Data:** Real vendor data through the vendor-user to partner link (to build)
- **Source:** `MOCKUP_SRC/sections/09-vendor-portal/`

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

## 10. Reports and BI

- **PRD says:** Executive, vendor, spend, procurement, compliance, risk, performance and contract reports, scheduled reports, export centre, BI analytics.
- **Page style:** Report library plus export centre.
- **Mockup status:** Not in the mockup. The other session built Reports and BI (M10); port it here.
- **Who (mockup roles):** Executive, Finance, Audit
- **Data:** Reads every other workspace
- **Source:** `MOCKUP_SRC/sections/10-reports-bi/`
- **Menu entries:** none yet

---

## 11. Administration

- **PRD says:** Dashboard, users, roles, departments, teams, workflow designer, approval matrix, categories, templates, integrations, API keys, audit logs, system and theme settings.
- **Page style:** Settings tabs; configuration drawers.
- **Mockup status:** Has users, roles and permissions, business units, editions and licensing, role and menu guide, workflow automation, integration hub, AI copilot and the dynamic form builder. Not built: departments and teams pages, approval matrix, audit log viewer, theme settings.
- **Who (mockup roles):** User Admin, Super Admin
- **Data:** Shared users, roles, fos_modules
- **Source:** `MOCKUP_SRC/sections/11-administration/`

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

## 12. Contact Control Center (FOS module)

- **PRD says:** Not in the VendorOS sitemap. The shared contact book used by every FOS product.
- **Page style:** Directory, profile, 13-step form, document centre, assets, settings.
- **Mockup status:** Directory, profile, contact form for six types, assets, document centre, users and access, settings forms, rules; all live on the prototype database.
- **Who (mockup roles):** User Admin, Super Admin
- **Data:** Shared users, partners_*, fos_*; prototype copy in public/proto
- **Source:** `MOCKUP_SRC/sections/12-contact-control-center/`
- **Tabs:** Dashboard, Directory, Vendor profile, Registration wizard (comparison), Contact form (13 steps, six types), Assets, Document Centre, Settings (comparison), Settings forms (Organisation, Departments, Teams, Titles, Categories and Tags, Banks, Location, Affiliations, Field Options, Field and Tab Rules, Custom Fields, Required Documents, Type Labels), Users and access, Compare

---

## 13. Specification and Support

- **PRD says:** Not part of the product. Reference.
- **Page style:** PRD panes and support.
- **Mockup status:** PRD (modules, Build Spec v2, audit, CCC Change List) and Support.
- **Who (mockup roles):** Everyone with the mockup
- **Data:** Generated from PRD/
- **Source:** `MOCKUP_SRC/sections/13-spec-docs/`
- **Panes:** one file per PRD pane (`pane-*.html`), generated by the PRD injector

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
