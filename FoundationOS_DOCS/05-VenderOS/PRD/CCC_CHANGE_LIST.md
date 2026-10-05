# CCC change list: bringing the Contact Control Center in line with the VendorOS mockup

Status: **proposal, nothing in the real app has been changed.** Built from the real CCC code (routes, menu service, profile tabs, wizard `steps()`, settings tabs) and the 96-row J01 crosswalk (`data/j01_crosswalk.json`). The mockup page **Contact Control Center** (Administration section) shows the same pages "as built today" next to "proposed", with a toggle.

## 1. Verdict legend

| Verdict | Meaning |
|---|---|
| KEEP | Already right for vendors and partners. No change. |
| TIDY | Exists, but needs a label, option list, grouping or layout change. No new table. |
| ADD | Does not exist. Needs a new field, tab, column or table. |
| HIDE | Shown today, not relevant to vendors or partners. Hide by field rule, do not delete. |
| FIX | Structural defect that blocks the rest. Do first. |

## 2. Where CCC is today

| Area | What is there now |
|---|---|
| Menu | Dashboard, All Contacts, Individuals, Employees, Customers, Partners, Vendors, Other Contacts, Assets, Document Centre, Settings |
| Contact types | individual, employee, customer, partner, vendor, other. Vendor and partner are always companies (`ALWAYS_COMPANY_TYPES`) |
| Profile tabs (9) | Overview, Work, Affiliations, Family, Assets, Documents, Access, Custom Fields, Financial |
| Wizard steps (10) | Basic, Work, Contact, Financials and Identity, Affiliations, Certifications, Assets, Documents, Custom Fields, Review. Order and per-type visibility are admin-editable (`FosFieldVisibilityRule`) |
| Settings tabs (12) | Organisation, Departments, Teams, Titles, Categories, Banks, Location, Affiliations, Field Options, Field Rules, Custom Fields, Required Documents |
| Repeaters already built for vendors | vendor-offering, vendor-reference, vendor-insurance, bank-account, certification, additional-contact, location, directors |

## 3. Change list by page

### 3.1 Menu and navigation

| Item | Verdict | Change |
|---|---|---|
| Vendors / Partners entries | KEEP | They are filters of one directory. VendorOS must link here and must not own a second vendor list |
| Assets | HIDE for vendor and partner | Hide by field rule. Keep for employees |
| Vendor onboarding queue | ADD | A saved filter (status draft or pending review) on the Vendors entry, contributed by the VendorOS module |

### 3.2 Dashboard

| Item | Verdict | Change |
|---|---|---|
| Contacts at a glance, Latest contacts, Capabilities, Integrations, ERP supplier and job links | KEEP | |
| Vendor onboarding strip (draft registrations, documents pending review, expired documents) | ADD | Registered by VendorOS through a dashboard-widget extension point, so core CCC never references the module |

### 3.3 Directory

| Item | Verdict | Change |
|---|---|---|
| Columns Contact, Type, Category, Location, Status, Added | KEEP | |
| Filter "Partner Category" and vendor "Category" | TIDY | One "Category" filter that follows the selected type |
| Documents column (complete / pending / expired) | ADD | Reuse the Document Centre status logic |
| Onboarding stage column | ADD | Only when VendorOS is enabled |

### 3.4 Contact profile (9 tabs)

| Tab | Verdict for vendor | Change |
|---|---|---|
| Overview | TIDY | Show company type, registration number, years in business (calculated), vendor category |
| Work | TIDY | Rename to **Business** for vendors. Add business types and trade capabilities |
| Affiliations | TIDY | Holds vendor references today. Rename **References and projects** and add contract value, years and project history |
| Family | HIDE | Not relevant to companies |
| Assets | HIDE | |
| Documents | TIDY | Show the Done / Requires Update / Pending checklist from the required-documents rules |
| Access | KEEP | Linked portal accounts and revoke already built |
| Custom Fields | KEEP | |
| Financial | KEEP | Bills (vendor) already read from the ERP |
| Capabilities | ADD | Products and services, trade capabilities, years of experience, maximum contract value, operational regions |
| Compliance | ADD | Certifications and insurance in one tab. Today they exist only as wizard steps |
| Directors and signatories | ADD | Nationality, email, phone, signing limit, signature specimen, board resolution |

### 3.5 Contact form: one unified 13-step flow

CCC has one generic wizard of 10 steps. The proposal is a single 13-step flow for every contact type, used for self-registration (user view) and for staff (admin view). Do **not** fork the wizard. Steps and fields switch on or off by contact type with the field rules CCC already has, and each field is marked user-visible or admin-only. The mockup tab **Contact form** shows it with a User view and Admin view toggle (Vendor first; the other five types follow).

| # | Step | Comes from today | Notes |
|---|---|---|---|
| 1 | Welcome and type | Type buttons, also register as, photo | Self-registration arrives with the type selected |
| 2 | Company and registration (people: identity) | Basic | Status and registration source are admin-only |
| 3 | Address and contact channels | Basic | Includes additional locations |
| 4 | Classification and work | Work | Department, reports-to, managed-by, contract dates, discount tier, notes and tags are admin-only |
| 5 | Products and services | Work (vendor offerings) | Vendors, partners and customers |
| 6 | Contacts | Contact | Primary and additional contacts |
| 7 | Directors, owners and governance | Basic (directors), Work (governance) | **Governance and board moves here** for organisations |
| 8 | Affiliations and references | Affiliations, vendor references | **Governance for people is an affiliation type** here |
| 9 | Banking, tax and identity | Financials and Identity | Banks, then identity and tax |
| 10 | Insurance and certifications | Financials (insurance), Certifications | |
| 11 | Assets | Assets | Hidden when the type does not need it |
| 12 | Required documents | Documents | Per-section rules from Settings |
| 13 | Declaration and review | Review | User sees the declaration (new). Admin sees the vendor review and recommendation, and the Custom Fields panel |

**Governance:** a company's own governing structure (board, directors, signatories) lives in step 7. A person's seat on a governing body (governance body, position or office, board role) lives in step 8 as the affiliation type Governance. The data and picklists stay as they are; only the screen placement moves out of Work.

**User view and admin view:** the same form. Admin-only fields are hidden from the person registering and marked ADMIN for staff. A custom field with Visible switched on is also shown to the person registering.

| CCC step today | Becomes |
|---|---|
| Basic | Steps 2, 3, part of 7 |
| Work | Steps 4, 5 |
| Contact | Step 6 |
| Affiliations | Step 8 |
| Financials and Identity | Steps 9, 10 |
| Certifications | Step 10 |
| Assets | Step 11 |
| Documents | Step 12 |
| Custom Fields | Step 13, admin only |
| Review | Step 13, admin only; declaration for users |

### 3.6 Document Centre

| Item | Verdict | Change |
|---|---|---|
| Filters and status chips | KEEP | |
| Per-document checklist with Done / Requires Update / Pending | TIDY | Same status vocabulary as the vendor view |
| Four upload slots | ADD | Technical specifications, completion certificate per project, signature specimen, board resolution |

### 3.7 Settings (12 tabs)

| Item | Verdict | Change |
|---|---|---|
| 12 flat tabs | TIDY | Group into Organisation (organisation, departments, teams, titles), Lists (categories, banks, location, affiliations, field options), Rules (field rules, custom fields, required documents) |
| Picklists: trade capability (18), business types, operational regions, ownership | ADD | Seeded options on the existing multi-select component |
| Required Documents | KEEP | Already per-section with hide / show |
| Type Labels | ADD | New settings tab. The six contact types stay fixed in the data; only the words shown change per install (Business default, Federal government preset: Citizen, Public Officer, Agency, Partner Organisation, Contractor, Other, or custom). Shown in the menu, directory, profile, forms and settings. Reports, permissions and the shared database are unaffected |

## 4. Fields that are genuinely new (15)

From the J01 crosswalk. None has a table or column today.

| Field | Where it lives |
|---|---|
| Brand, Manufacturer, Country of origin | Proposed product row, on the offering repeater |
| Technical specifications (upload) | New upload slot |
| Years of experience, Maximum contract value, Operational regions | Capabilities, on the vendor profile |
| Contract value, Years (per reference) | Columns on `fos_vendor_references` |
| Major project history | New table keyed by `partner_id` |
| Completion certificate (upload) | New upload slot, one per project |
| Signing limit | Director row |
| Signature specimen, Board resolution (uploads) | New upload slots |
| Declaration | New declaration fields (G-08) |

Another 20 fields are partial (the field exists, the picklist or label does not) and 3 are calculated. See `MOCKUP_BUILD_GUIDE.md`.

## 5. Structural fixes (do first)

| Fix | Why |
|---|---|
| FIX-1 Vendor-user to partner membership model | A vendor login cannot be tied to its company today |
| FIX-2 One owner for documents (media, `documents` and `vendor_documents` disagree) | Checklists and the Document Centre read different tables |
| FIX-3 Run migration 000300 | The Documents pages return an error until it runs |
| FIX-4 Seed ERP product categories and the new picklists | The dev database has none, so the category fields are empty |
| FIX-5 Extension points (tab, widget, step, filter) | Core CCC must not reference the VendorOS module (core / module boundary) |

## 6. Order of work

| Phase | Content | Gate |
|---|---|---|
| 0 | Owner decisions D-11 to D-21, mockup sign-off | Owner |
| 1 | FIX-1 to FIX-5 | None |
| 2 | Picklists and TIDY items (labels, grouping, hide rules) | Phase 1 |
| 3 | New fields and tables (section 4) | Phase 2 |
| 4 | Data-driven vendor step list (13 steps) | Phase 3 |
| 5 | Dashboard widget, directory columns, vendor tabs | Phase 4 |

Each phase ships as an installable AppSuite package. Real admin UI is edited only after confirmation.

## 7. Prototype status (5 Oct 2026)

| Area | Status |
|---|---|
| Contact form, all six types | Done in the mockup. Fields, labels, placeholders and options are copied from the live CCC for Individual, Employee, Customer, Partner, Vendor and Other. Steps a type does not use are hidden (people have no directors or products, Other has no assets, only Vendor has products and references) |
| User view and Admin view | Done. Admin-only fields are marked ADMIN |
| Live prototype backend | `foundation_os/public/proto/` (SQLite copy of the shared tables, localhost only). Directory, profile, contact form save and edit, deactivate contact and linked logins, document upload and review, Document Centre, Users and access, and the settings lists all read and write it |
| Also live now | Dashboard (counts, latest contacts, vendor onboarding strip), Assets, Organisation, Location (default country), Affiliations lists and Field and Tab Rules (the real rules, with step order and per-type checkboxes). Form validation shows inline messages (company name, email, web address, numbers) |
| Not yet | Applying the Field and Tab Rules to hide or show fields in the form (they are editable and saved, the form still uses the field sets captured from the live CCC), import and export CSV, tag assignment, bulk actions |
