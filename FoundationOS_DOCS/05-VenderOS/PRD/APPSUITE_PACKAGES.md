# AppSuite packages: apps, ports and the choice of data

Status: accepted by the owner on 5 Oct 2026 (ADR-058 and ADR-059); the build is still to do. Nothing in the real app changed. The mockup page **AppSuite** (Administration and Platform menu) shows it working: turn an app on or off and its menu entries disappear, and an app that others need cannot be turned off.

Builds on `foundation_os/docs/APPSUITE_LARAVEL_FIRST_ARCHITECTURE.md`: `fos_modules` is the runtime switch, a manifest (`foundation_module.json`) describes the package, installing registers it disabled, enabling runs its migrations, disabling never deletes data.

## 1. The idea

FOS is the parent app. It owns the shared base. Everything else is an app that plugs into it. An app is built once and used by many other apps, at different levels (company, vendor, project, contract).

## 2. The apps

| App | What it provides | Needs | Works with (optional) | Reused by |
|---|---|---|---|---|
| FOS Core | Access control (users, roles, permissions), settings, products and services, custom fields, media, module registry, audit log, search | none | | everything |
| Contact Control Center | Contacts, directory, profiles, assets, settings lists | Core | | everything |
| Documents | Uploads, review, expiry, per-section slots, document centre | Core, CCC | | VendorOS, Contracts, Risk, Training, Collaboration |
| Collaboration | Inbox, direct messages, email, WhatsApp, announcements, meetings, tasks, surveys, tickets | Core, CCC | Documents | VendorOS, Vendor Portal, Contracts |
| Training and Competency | Courses, tests, certificates, matrix, expiry | Core, CCC | Documents, Collaboration | VendorOS, staff HR, site access |
| Insights | KPI definitions and targets, scorecards, dashboards, reports, schedules, exports, BI | Core | | every app |
| Commerce | Quotations, RFQs, purchase orders, receiving, invoices, expenses, payments, contracts, templates, SLAs, signatures | Core, CCC, Documents | Insights | VendorOS, CRM, projects |
| Risk and Compliance | Audits, findings, CAPA, risk register, inspections, ESG | Core, CCC, Documents | Insights, Training | VendorOS, HR, operations |
| Automation and Platform | Workflow rules, approval chains, integrations, AI copilot, form builder | Core | | everything |
| **VendorOS Core** | Vendor directory, registration, approval, passport, assessment | Core, CCC, Documents, Collaboration | Commerce, Training, Risk, Insights | Vendor Portal |
| Vendor Portal | Vendor-facing home, company, documents, orders, invoices, training, messages, notifications | VendorOS Core, Collaboration | Commerce, Training | |

Why these groupings:

- **Commerce is one app, and contracts are inside it.** Quotation, purchase order, invoice, expense and contract share the same documents, tax, partner and currency rules, and the ERP already owns them as one family (`products_*`, `purchases_*`, `accounts_*`). Inside the app they are feature switches (Catalog, Quotes, Purchasing, Billing, Expenses), so a site can run quotes and invoices without purchasing.
- **Training, Collaboration, Documents and CCC are apps of their own** because other products need them with no vendor in sight (staff training, project chat, a file store, a contact book).
- **KPI is a service, not a menu app.** See section 5.
- **VendorOS Core is deliberately small.** It is the vendor lifecycle glue: it decides what a vendor is, what documents they owe and how they are approved. Everything it uses comes from another app.

## 3. Ports: how an app asks for data

An app never names a table. It asks for a port, and the install binds the port.

| Port | Interface | FOS binding (default) | Own-tables binding |
|---|---|---|---|
| Contacts | `ContactStore` | `partners_partners` + `fos_partner_profiles` | the app's contacts tables |
| Documents | `DocumentStore` | `documents` + media | the app's documents tables |
| Conversations | `ConversationStore` | communications engine + `fos_communication_contexts` | the app's messages tables |
| Approvals | `ApprovalStore` | approval steps and logs | the app's approval tables |
| KPIs | `KpiProvider` | Insights registry | the app's own KPI tables |
| Audit | `AuditLog` | `module_activity_logs` | the app's own log |

## 4. The install question

When an app is installed it asks, per port: **use the FOS parent tables, or use this app's own tables?**

| Mode | When | Result |
|---|---|---|
| Inside FOS (default) | The app runs in a FOS installation | Ports bind to FOS tables. One database, no copies. This is the VendorOS rule today. |
| Standalone | The app runs on its own | Ports bind to the app's own tables. The same code runs. |
| Mixed | Some ports shared, some not | For example the app's own invoices but FOS contacts. |

Rules: installs register the app disabled; enabling runs its migrations against the chosen binding; disabling hides its menu, routes and tabs and keeps the data; removing code is a separate, explicit act.

## 5. KPIs

Each app registers its KPIs with Insights: a name, a query, a target, an owner. Dashboards, scorecards and the strip at the top of every workspace read from there. If an app is off its KPIs leave the dashboards and their history stays. The KPI strip in every workspace therefore needs no code per app.

## 6. Levels

Apps are mounted in a context: tenant, vendor, project, contract. A conversation or a document belongs to a context value, not to a copy of the app. `fos_communication_contexts` already works this way (app slug, context type, context id).

## 7. Decisions

| ID | Decision | Recommendation |
|---|---|---|
| AS-1 | Contracts | Merged into Commerce (decided) |
| AS-2 | Do approval chains live in Automation or in each app? | One engine in Automation; apps register their chains |
| AS-3 | Is the Vendor Portal a separate app? | Yes, so an internal-only site can leave it off |
| AS-4 | Which ports ship first? | Contacts, Documents, Conversations (they exist today) |
| AS-5 | Mixed mode in the first build? | Defer; ship Inside FOS and Standalone |

## 8. Rules added by the owner (5 Oct 2026)

1. **FOS base first.** An installed app is formatted to use the FOS base and core. For contacts and the core apps the install asks: use the FOS tables, or the app's own tables.
2. **FOS owns the partner tables.** ERP (Webkul) is a plugin that can be removed, switched off or uninstalled without breaking anything. An uninstall never drops a FOS table (ADR-056).
3. **Laravel first.** The product uses no Filament. Filament is the installer, a test surface and a harvest source, shown in an iframe or harvested with the same UI (ADR-057).
4. **Distributions.** Before shipping or uploading, a build can contain only the apps a job needs, and AppSuite shows only those (ADR-059). The mockup page AppSuite, tab Distribution, shows how: choose the apps, needs are added automatically, and the result is a distribution manifest.
5. **Plugins are packages too, and they are in use today.** The 9 Webkul ERP plugins (accounts, employees, inventories, invoices, maintenance, manufacturing, products, purchases, sales) run in the ERP panel (`/erp`) with their own menu pages and menu manager. FOS shows them through an iframe (`admin/erp-view?path=/erp/...`) with the FOS menu, top bar and footer around it; the ERP panel hides its own chrome when framed (`embedded=1`) and is styled to look like FOS. Every framed page has an "Open full ERP panel" link. Filament supplies the panels, the Composer installer and the Spatie Media Library plugin. These stay in use until a ported VendorOS page replaces each one; only then is that plugin switched off or uninstalled. maintenance and manufacturing have no PRD page yet and need a keep or drop decision. The mockup shows this in AppSuite, tab Installed now, and the page ERP (embedded).

### Distribution manifest (what the build produces)

| Field | Meaning |
|---|---|
|  | Name of the distribution |
|  | The FOS base version |
|  | Apps included, with the ones added only because another app needs them |
|  | Apps left out (not shown in AppSuite, no routes, no migrations) |
|  | For each shared need: FOS tables or the app's own |
|  |  for a product build;  for a build that includes the installer and test surface |
|  | The menu entries that remain |
