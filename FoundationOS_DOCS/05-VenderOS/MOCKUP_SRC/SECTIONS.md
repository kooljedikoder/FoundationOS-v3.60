# VendorOS mockup: one SPA per section

Generated from the mockup source (126 parts, rebuilt byte for byte). Menu data comes from the sidebar of `VendorFlow_Admin_Home.html`.

## The rule

Each main section is its own small SPA: one folder in `MOCKUP_SRC/sections/<section>/` holding its pages, with its own submenu and tabs. Sections share only the shell (sidebar, top bar, edition and role switch, toast, modals, design tokens). A section never reaches into another section's markup; it links to it by page id. This follows the Window Rule in `Fluid_UI_KIT/RULES.md`: each section is a window with a rail (its submenu), a title bar with the section label, a body and a footer pill.

## The 11 sections

| # | SPA | Folder | Pages | Size |
|---|---|---|---|---|
| 1 | Supplier Portal | `sections/supplier-portal/` | 7 files | 20 KB |
| 2 | Home dashboard | `sections/home/` | 1 files | 12 KB |
| 3 | Vendor Management | `sections/vendor-management/` | 5 files | 23 KB |
| 4 | HSE and Risk | `sections/hse-risk/` | 3 files | 9 KB |
| 5 | Procurement and Contracts | `sections/procurement-contracts/` | 4 files | 23 KB |
| 6 | Finance and Performance | `sections/finance-performance/` | 2 files | 4 KB |
| 7 | Collaboration | `sections/collaboration/` | 2 files | 16 KB |
| 8 | Automation and Platform | `sections/automation-platform/` | 4 files | 11 KB |
| 9 | Administration | `sections/administration/` | 3 files | 23 KB |
| 10 | Contact Control Center | `sections/ccc/` | 13 files | 334 KB |
| 11 | Specification and Support | `sections/spec-docs/` | 38 files | 412 KB |

---

## 1. Supplier Portal

What an external vendor sees after sign-in: their own company, documents, orders, invoices, training and messages. Always scoped to the vendor organisation linked to the login.

- **Source:** `MOCKUP_SRC/sections/supplier-portal/`
- **Who sees it (mockup roles):** Vendor (Portal) role only
- **Data:** Real vendor data through the vendor-user to partner link (to build)
- **Menu section:** Supplier Portal
- **Pages:** myprofile, mydocuments, mycomms, myinvoices, myrfqpo, myhse, requests

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Company & Passport | `myprofile` |  | - |
| Documents | `mydocuments` |  | - |
| Orders & RFQs | `myrfqpo` |  | - |
| Invoices & Payments | `myinvoices` |  | - |
| Training & HSE | `myhse` |  | - |
| Communications | `mycomms` |  | - |
| Requests | `requests` |  | - |
| Help & Support | `support` |  | - |

---

## 2. Home dashboard

Role dashboards (Super Admin, User Admin, Executive, Procurement, Finance, Audit, Warehouse) and the module grid.

- **Source:** `MOCKUP_SRC/sections/home/`
- **Who sees it (mockup roles):** All internal roles
- **Data:** Reads from every other section; no tables of its own
- **Menu section:** dashboard
- **Pages:** dashboard

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|

---

## 3. Vendor Management

The vendor lifecycle: register, approve, issue a passport, keep documents, assess.

- **Source:** `MOCKUP_SRC/sections/vendor-management/`
- **Who sees it (mockup roles):** Executive, Vendor Admin, Procurement, Finance, Audit, Super Admin
- **Data:** CCC contacts, vendor_passports, fos_vendor_* tables
- **Menu section:** Vendor Management
- **Pages:** reg, approval, passport, docs, assessment

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Registration & Onboarding | `reg` | FLEX | Company Profile, Contacts & Directors, Document Upload, Assessment Scoring, Approval, Vendor Passport Issued |
| Vendor Passport 360 | `passport` | FLEX | Overview, Documents, Certificate of Incorporation, Insurance, Tax Clearance, Performance, Contracts, Staff Access (List/Card), Communications, Timeline & Activity Log |
| Document Management | `docs` | FLEX | Document Queue (FLEX), Upload Document (FLEX), Expiring Documents (FLEX) |
| Supplier Assessment | `assessment` | FLEX | Procurement (FLEX), Technical (FLEX), Finance (FLEX), Legal (FLEX), Compliance (FLEX), HSE (FLEX), ESG (CORE), Information Security (FLEX) |

---

## 4. HSE and Risk

Safety induction and certification, audit and governance, enterprise risk.

- **Source:** `MOCKUP_SRC/sections/hse-risk/`
- **Who sees it (mockup roles):** Executive, Audit, Super Admin
- **Data:** New fos_ tables (see audit)
- **Menu section:** HSE & Risk
- **Pages:** hse, audit, erm

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Induction & Certification | `hse` | FLEX | Site Safety Induction (CORE), Working at Heights (CORE), Hot Work Permit (CORE), Take Certification Test (CORE), Certification Register, Kalahari Logistics (CORE), Delta Civils & Plant Hire (CORE) |
| Audit & Governance | `audit` | CORE | - |
| Enterprise Risk Mgmt | `erm` | CORE | - |

---

## 5. Procurement and Contracts

RFQs, purchase orders, contracts, warehouse receiving and the PLUS procurement hub.

- **Source:** `MOCKUP_SRC/sections/procurement-contracts/`
- **Who sees it (mockup roles):** Procurement, Warehouse, Executive, Super Admin
- **Data:** ERP purchases_*, inventories_*; contracts are new
- **Menu section:** Procurement & Contracts
- **Pages:** procurement, clm, warehouse, plusprocure

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Procurement Workspace | `procurement` | FLEX | RFQs, Purchase Orders |
| Contract Lifecycle Mgmt | `clm` | CORE | - |
| Warehouse & Receiving | `warehouse` | FLEX | - |
| PLUS Procurement Hub | `plusprocure` | PLUS | Demand Planning (PLUS), Sourcing Events (PLUS), Supplier Collaboration (PLUS), Analytics (PLUS) |

---

## 6. Finance and Performance

Payments, invoices, vendor performance and SLA.

- **Source:** `MOCKUP_SRC/sections/finance-performance/`
- **Who sees it (mockup roles):** Finance, Procurement, Executive, Super Admin
- **Data:** ERP accounts_*; performance reviews are new
- **Menu section:** Finance & Performance
- **Pages:** finance, perf

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Finance & Payments | `finance` | FLEX | - |
| Performance & SLA | `perf` | FLEX | - |

---

## 7. Collaboration

Unified inbox (internal and vendor) and the vendor portal preview.

- **Source:** `MOCKUP_SRC/sections/collaboration/`
- **Who sees it (mockup roles):** Executive, Vendor Admin, Super Admin
- **Data:** Communications module
- **Menu section:** Collaboration
- **Pages:** comms, selfservice

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Inbox & Communications | `comms` | FLEX | - |
| Vendor Portal (map & preview) | `selfservice` | FLEX | - |

---

## 8. Automation and Platform

Workflow rules, integrations and API, AI copilot, dynamic form builder.

- **Source:** `MOCKUP_SRC/sections/automation-platform/`
- **Who sees it (mockup roles):** Super Admin
- **Data:** New fos_ tables; form builder reads the field dictionary
- **Menu section:** Automation & Platform
- **Pages:** workflow, integration, ai, builder

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| Workflow Automation | `workflow` | FLEX | Automation Rules (FLEX), Vendor Lifecycle Kanban (FLEX) |
| Integration Hub & API | `integration` | CORE | - |
| AI Copilot | `ai` | PLATFORM | - |
| Dynamic Form Builder | `builder` | PLATFORM | - |

---

## 9. Administration

System configuration (users, roles, business units), editions and licensing, role and menu guide.

- **Source:** `MOCKUP_SRC/sections/administration/`
- **Who sees it (mockup roles):** User Admin, Super Admin
- **Data:** Shared users, roles, fos_modules
- **Menu section:** Administration
- **Pages:** role-guide, admin, editions

| Menu item | Page | Edition | Submenu and tabs |
|---|---|---|---|
| System Configuration | `admin` | FLEX | Users, Roles & Permissions, Business Units (CORE) |
| Editions & Licensing | `editions` | FLEX | - |
| Role & Menu Guide | `role-guide` | FLEX | - |

---

## 10. Contact Control Center

The shared contact book for staff, customers, vendors, partners and individuals: directory, profile, 13-step contact form, assets, document centre, users and access, settings. Its own SPA because it is a FOS module used by every product, not only VendorOS.

- **Source:** `MOCKUP_SRC/sections/ccc/`
- **Who sees it (mockup roles):** User Admin, Super Admin (through the Administration menu in this mockup)
- **Data:** Prototype SQLite copy of the shared tables (public/proto)
- **Submenu and tabs:** Dashboard, Directory, Vendor profile, Registration wizard (10 to 13 step comparison), Contact form (13 steps, six types), Assets, Document Centre, Settings (comparison), Settings forms (Organisation, Departments, Teams, Titles, Categories and Tags, Banks, Location, Affiliations, Field Options, Field and Tab Rules, Custom Fields, Required Documents, Type Labels), Users and access, Compare
- **Files:** one file per tab (`tab-cc-*.html`) plus `page-ccc.html`
- **How it runs:** loaded with the shell today; it calls `public/proto/api.php`. In the port it becomes the FOS module Contact Control Center with real routes

---

## 11. Specification and Support

PRD (modules, rules, field dictionary, audit, CCC change list) and support. Reference only; no business data.

- **Source:** `MOCKUP_SRC/sections/spec-docs/`
- **Who sees it (mockup roles):** Everyone with access to the mockup
- **Data:** None (generated from FoundationOS_DOCS/05-VenderOS/PRD)
- **Submenu and tabs:** PRD (modules M1 to M22, Build Spec v2 panes, Mockup Data Audit, CCC Change List) and Support
- **Files:** one file per PRD pane (`pane-*.html`), generated by `inject.js` from the PRD pack

---

## Not in a section yet

- Shared shell: `shell/` (login, sidebar, top bar, modals, overlays)
- Shared styles: `css/`; shared code: `js/`
- Role to section map used by the sidebar: `ROLE_SECTIONS` in `js/`

## Role access (from `ROLE_SECTIONS`)

| Role | Menu sections shown |
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
