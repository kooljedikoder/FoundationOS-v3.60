# VendorOS Feature Gap Matrix

What the blueprint (`VendrOS_Admin_Home.html`) wants vs. what's actually built in `foundation_os` today, and which table backs each row. "One for all, all for one" -- ERP-backed rows read real AureusERP tables, never a duplicate.

| Module | Tier | Have | Backing table(s) |
|---|---|---|---|
| Registration & Onboarding | FLEX | Partial -- `VendorPassport` draft state exists, no wizard UI | `vendor_passports` (native) |
| Vendor Passport 360 | FLEX | Built -- status, documents, audit trail | `vendor_passports`, `vendor_passport_state_logs`, `vendor_documents` |
| Document Management | CORE | Partial -- checklist exists on Passport, no dedicated queue/expiry view | `vendor_documents` + `documents` (canonical, ADR-022) |
| Supplier Assessment | CORE | Not built | none yet -- would need a scoring table per discipline (Procurement/Technical/Finance/Legal/Compliance/HSE/ESG/InfoSec) |
| HSE Induction & Certification | CORE | Not built | none yet |
| Audit, Compliance & Governance | CORE | Partial -- state-log audit trail exists, no compliance rules/results | `vendor_passport_state_logs`; needs `compliance_rules`/`compliance_results` |
| Enterprise Risk Mgmt | CORE | Not built | none yet |
| Procurement Workspace (RFQs, POs) | FLEX | **Already real** -- ERP `purchases`/`sales` | `purchases_*`, `sales_*` (ERP) |
| Contract Lifecycle Mgmt | CORE | Not built (no ERP contract module ported yet) | none yet |
| PLUS Procurement Hub | PLUS | Not built | none yet |
| Finance, Invoicing & Payments | FLEX | **Already real** -- ERP `accounts`/`invoices` | `accounts_*`, `invoices` tables (ERP) -- needs a VendorOS-side read view, not a new table |
| Performance & SLA | FLEX | Not built (plain `performance_score` field only) | `vendor_passports.performance_score`; needs `performance_metrics`/`performance_scores` |
| Communication & Collaboration | CORE | Not built (ERP Chatter exists per-record on some resources, not VendorOS-wide) | `Webkul\Chatter` (ERP, partial reuse candidate) |
| Vendor Self-Service Portal | CORE | Not built -- **no external vendor login exists yet** | needs a new auth surface (Partner-as-user) |
| Workflow Automation | CORE | Not built | none yet |
| Integration Hub & API | CORE | Not built | none yet |
| AI Copilot | CORE | Adjacent -- FoundationOS already has its own "AI Data Copilot" (jayanta/laravel-natural-query) elsewhere in the app | reuse candidate, not VendorOS-specific yet |
| Dynamic Page & Form Builder | CORE | Not built -- planned Phase 2, see `feedback_phase2_form_builder_decoupling` memory | none yet |
| System Configuration (Users, Roles, Business Units) | FLEX | **Already real** -- ERP Users/Roles + native FoundationOS Access Control | `users`, ERP `shield` roles (ERP + native) |
| Editions & Licensing | PLUS | Not built | none yet |

## Immediate next: Registration & Onboarding wizard

Building the vendor-facing capture wizard next (stages 2-17 from the 45-stage doc, grouped as Account & Access / Company Profile / Capability & People / Financial & Risk Docs / Documents -- see `VeriphyVendor_Product_Family.md`'s stage-group section). This creates the `VendorPassport` row at `draft` and walks it to `submitted`, reusing the state machine already built. No new backing table beyond what already exists -- the wizard is UI over the existing `vendor_passports`/`vendor_documents` schema.
