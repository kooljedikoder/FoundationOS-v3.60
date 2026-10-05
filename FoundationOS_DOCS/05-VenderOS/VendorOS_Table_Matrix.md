# VendorOS Table Matrix -- Shared Database Records & AppSuite Extensions

Real table names from the live FoundationOS database (checked directly, not guessed). FoundationOS, CCC, ERP, VendorOS, and other AppSuite surfaces use **one configured database per installation**. The database and its canonical relationships are the source of truth; ERP is one module/UI over that database, not a separate database that owns every concept. Different applications may present the same rows through different Laravel or Filament screens.

## Existing shared database records (currently exposed through ERP)

These records already exist in the shared installation database and should be reused by CCC/VendorOS. “ERP-exposed” identifies the current model/plugin surface, not a separate data silo or competing source of truth.

| Concept | Table(s) | Plugin |
|---|---|---|
| Universal contact identity (organizations, people, vendor/customer roles) | `partners_partners`; CCC/ContactBook classifies records through existing profile/type/rank/tag relationships | `partners` model/schema, also read and edited by native CCC |
| Our companies | `companies` linked to a Partner row | `support` |
| Internal employees/departments | `employees_employees`, `employees_departments` linked to shared users/Partners | `employees` |
| Bank accounts | `partners_bank_accounts`, `banks` | `partners`/`support` |
| Company | `companies` | `support` |
| Roles/Permissions | `roles`, `permissions` | native FOS (`web` guard) + ERP Shield reuses same tables |
| Users | `users` | native FOS, shared physical table with `Webkul\Security\Models\User` |
| General ledger, journals, moves, reconciliation | `accounts_accounts`, `accounts_journals`, `accounts_account_moves`, `accounts_account_move_lines`, `accounts_reconciles`, `accounts_full_reconciles`, `accounts_partial_reconciles` | `accounts` |
| Payments | `accounts_account_payments`, `accounts_payment_methods`, `accounts_payment_method_lines`, `accounts_payment_registers`, `accounts_payment_terms`, `accounts_payment_due_terms` | `accounts` |
| Tax | `accounts_taxes`, `accounts_tax_groups`, `accounts_tax_partition_lines`, `accounts_account_taxes` | `accounts` |
| Bank statements | `accounts_bank_statements`, `accounts_bank_statement_lines` | `accounts` |
| Purchase Orders / Requisitions | `purchases_orders`, `purchases_order_lines`, `purchases_requisitions`, `purchases_requisition_lines` | `purchases` |
| Sales Orders / Quotations | `sales_orders`, `sales_order_lines`, `sales_teams` | `sales` |
| Generic file attachments | `documents` (canonical, ADR-022, polymorphic `documentable`) | native FOS |

## AppSuite extension tables (additional concepts/metadata in the same database)

| Concept | Table | Why it's native, not ERP |
|---|---|---|
| Vendor lifecycle status + state machine | `vendor_passports` keyed by canonical `partner_id` | Adds onboarding/approval state to an existing contact identity; it is not another vendor identity. |
| Status-change audit trail | `vendor_passport_state_logs` | Append-only lifecycle history. |
| Vendor verification/reviews/approvals/readiness/performance | `fos_vendor_*` tables keyed by canonical `partner_id` | Add workflow evidence and decision metadata not represented by the base contact record. |
| Directors / Ownership / Signatories | `vendor_directors` and/or CCC linked contact/profile relationships | Relate people/ownership to the organization; do not duplicate the company/contact identity. |
| Vendor document verification metadata | `vendor_documents` if selected as the canonical verification relation | Must reference the canonical file/document record. CCC Media uploads and Passport `VendorDocument`/Document loading are currently inconsistent and need reconciliation before seeding. |

## The rule in one sentence

There is **one shared database source of truth**. If a canonical table already models the concept (a contact, bank account, payment, order, company, employee), every UI must read/write that same row through the real relationships. If a concept needs an extension (lifecycle status, review history, ownership detail), add a related table with a key back to the canonical row. Never create a parallel vendor/contact/order table or keep copied state synchronized across modules. ERP may consume or extend the shared schema where needed; CCC and Laravel surfaces must see the same updates.
