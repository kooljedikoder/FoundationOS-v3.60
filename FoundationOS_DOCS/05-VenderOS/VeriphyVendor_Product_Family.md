# VeriphyVendor Product Family

## Product Architecture

**VeriphyVendor** is the customer-facing product brand.

**VendorFlow** is the underlying platform and suite powering VeriphyVendor.

---

## 1. VeriphyVendor FLEX

### Complete Vendor Lifecycle

FLEX is the entry product, but it is **not a cut-down vendor management product**. It provides a complete supplier lifecycle for organizations that need a practical end-to-end vendor platform.

### Includes

- Full vendor registration and onboarding
- Complete 45-stage onboarding, verification & approval engine (J01 — see `01-SOURCES/procurment-vendorOS/VerifyVendorOS_45_Stage_Full_Vendor_Workflow_and_Customer_Journey.md` for the full stage list, and the "Stage Groups & Tier Overlap" section below for how it's organized)
- HSE induction and certification
- Vendor Passport
- Document management
- Vendor verification
- Supplier assessments
- Approval workflows
- Vendor Portal
- Purchase Requests
- RFQ
- Purchase Orders
- Deliveries and Goods Receipt
- Invoices
- Payments
- Vendor performance
- Standard reporting
- Basic administration

### Positioning

> **Complete Vendor Lifecycle Management for Growing Organizations**

---

## 2. VeriphyVendor CORE

### Enterprise Supplier Lifecycle

CORE inherits everything in FLEX and adds enterprise governance and management capabilities.

### CORE = FLEX + Enterprise Features

### Adds

- Risk Management
- Compliance Centre
- Audit Management
- ESG Management
- CAPA
- Multi-company support
- Advanced workflow
- SLA management
- Executive analytics
- Advanced security
- Advanced reporting
- Enterprise integrations
- Enterprise governance

Nothing from FLEX is removed when moving to CORE.

### Positioning

> **Enterprise Supplier Lifecycle Management**

---

## 3. VeriphyVendor PLUS

### Enterprise Source-to-Pay

PLUS inherits everything from CORE and adds strategic procurement and source-to-pay capabilities.

### PLUS = CORE + Enterprise Procurement

### Adds

- Strategic Sourcing
- Category Management
- Spend Analytics
- RFI
- RFP
- eTender
- Reverse Auctions
- Negotiation
- Evaluation Committees
- Award Management
- Contract Workspace
- Supplier Collaboration
- Procurement Intelligence

### Positioning

> **Enterprise Source-to-Pay and Strategic Procurement**

---

# Platform Extensions

The following are platform extensions that operate across the VeriphyVendor product family rather than replacing FLEX, CORE, or PLUS.

---

## 4. VendorFlow Studio

### Low-Code Application Platform

VendorFlow Studio provides the configuration and extension environment for building additional business applications and processes without modifying the core platform.

### Includes

- Dynamic Forms Builder
- Questionnaire Builder
- Inspection Builder
- Survey Builder
- Process Designer
- Workspace Builder
- Business Object Designer
- Page Builder
- Dashboard Builder
- Navigation Builder
- Layout Designer
- Theme Studio
- Component Library
- Deployment Manager

### Capabilities

Organizations can:

- Create custom forms
- Create custom pages
- Create custom dashboards
- Create custom business objects
- Configure workflows
- Build industry-specific workspaces
- Create custom navigation
- Add reusable components
- Extend VendorFlow without modifying core code

### Positioning

> **Build and extend your business applications without changing the core platform.**

---

## 5. VendorFlow AI

### AI and Intelligence Layer

VendorFlow AI provides intelligence capabilities across the platform.

### Includes

- AI Copilot
- OCR
- Document Intelligence
- Smart Search
- AI Recommendations
- Predictive Risk
- Supplier Insights
- AI Chat
- AI Report Builder
- AI-assisted form creation
- AI-assisted page creation
- AI-assisted dashboard creation

### Positioning

> **Intelligence across the entire vendor and procurement lifecycle.**

---

## 6. VendorFlow Connect

### Integration Hub

VendorFlow Connect provides the integration layer between VendorFlow and external enterprise systems.

### Includes

- REST APIs
- API Gateway
- ERP integrations
- SAP
- Oracle
- Microsoft Dynamics
- Microsoft 365
- LDAP / Active Directory
- SSO
- Webhooks
- Email
- SMS
- WhatsApp
- EDI / FTP integrations

### Positioning

> **Connect VendorFlow to the systems your organization already uses.**

---

## 7. VendorFlow Mobile

### Mobile Workforce Experience

VendorFlow Mobile provides mobile experiences for users working away from the desktop.

### Mobile Experiences

- Vendor App
- Buyer App
- Inspector App
- HSE App
- Executive Dashboard

### Mobile Capabilities

- Offline operation
- Offline synchronization
- QR scanning
- Barcode scanning
- Camera uploads
- Digital signatures
- Push notifications
- Mobile dashboards
- Field data capture

### Positioning

> **VendorFlow wherever work happens.**

---

# Overall Product Architecture

```text
                         VERIPHYVENDOR
                               |
                        VendorFlow Platform
                               |
          +--------------------+--------------------+
          |                    |                    |
         FLEX                 CORE                 PLUS
          |                    |                    |
          +--------------------+--------------------+
                               |
                    Platform Extensions
                               |
             +-----------------+-----------------+
             |                 |                 |
          STUDIO              AI              CONNECT
             |                 |                 |
             +-----------------+-----------------+
                               |
                             MOBILE
```

---

# Edition Inheritance

The product family follows a simple inheritance model.

```text
FLEX
  |
  +-- Complete Vendor Lifecycle
  |
  v
CORE
  |
  +-- FLEX
  +-- Enterprise Governance
  |
  v
PLUS
  |
  +-- CORE
  +-- Strategic Procurement
```

### Principle

**FLEX is feature-complete for vendor lifecycle management.**

**CORE never removes FLEX functionality; it expands it.**

**PLUS never removes CORE functionality; it expands it with strategic procurement.**

---

# VeriphyVendorOS Trust Layer

The VeriphyVendorOS trust layer operates across the product family.

It provides the foundation for:

- Vendor Identity
- Vendor Verification
- Vendor Passport
- Compliance
- Documentation
- Risk
- HSE
- Supplier Performance
- Revalidation
- Trust Status

The trust layer supports the complete supplier lifecycle from initial registration through ongoing monitoring and revalidation.

---

# J01 45-Stage Engine — Stage Groups & Tier Overlap

The 45-stage J01 workflow (full detail in `01-SOURCES/procurment-vendorOS/VerifyVendorOS_45_Stage_Full_Vendor_Workflow_and_Customer_Journey.md`) stays canonical -- it is not being replaced by a shorter "wizard" count. What follows groups its 45 stages into five logical clusters and shows where each cluster's *depth* changes as a customer moves FLEX -> CORE -> PLUS, since most of the 45 stages exist at every tier -- what changes is how much capability sits behind them, not whether the stage exists at all.

## Group A — Registration Wizard (vendor-facing capture), stages 1-17

| Sub-group | Stages |
|---|---|
| Account & Access | 1 Discovery/Invite, 2 Create Account, 3 Email/OTP Verification, 4 Welcome Dashboard |
| Company Profile | 5 Company Information, 6 Address & Locations, 7 Registration & Regulatory Numbers, 8 Business Type & Capabilities |
| Capability & People | 9 Products & Services, 10 Contact Persons, 11 Customer References, 12 Directors/Ownership/Signatories |
| Financial & Risk Docs | 13 Banking Details, 14 Tax & Financial Profile, 15 Insurance, 16 Certifications |
| Documents | 17 Mandatory Document Centre |

**Tier**: FLEX-complete. Every stage in this group is the same at CORE and PLUS -- upgrading a tier never adds new *capture* screens here.

## Group B — Verification & Trust Engine, stages 18-22

18 Document Validation, 19 Vendor Identity Verification, 20 Verification Timeline, 21 Compliance Centre, 22 Compliance Actions/Gap Resolution.

**Tier overlap**: FLEX ships this group at baseline depth ("Document management", "Vendor verification"). **CORE's Compliance Centre and Audit Management line items are this same group, deepened** -- not new stages, richer rule sets/audit trails behind stages 21-22.

## Group C — Multi-Disciplinary Review, stages 23-30

23 Procurement Review, 24 Technical Review, 25 Finance Review, 26 Legal/Governance Review, 27 HSE Review & Induction, 28 Site Inspection, 29 ESG/Sustainability Review, 30 Risk Assessment.

**Tier overlap**: FLEX covers 23-28 via "Supplier assessments" + "Approval workflows" + its own HSE line item. **CORE's Risk Management and ESG Management map directly onto stages 29-30** -- FLEX runs a lighter version of these two (or skips them); CORE is where they become first-class.

## Group D — Decision & Activation, stages 31-38

31 Vendor Scoring, 32 Recommendation, 33 Multi-Level Approval, 34 Approval History & Audit, 35 Vendor Number Assignment, 36 Vendor Passport 360 Creation, 37 Vendor Activation & Portal Access, 38 Operational Readiness.

**Tier overlap**: FLEX's "Approval workflows" is this whole group at single-path depth. **CORE's Advanced workflow/SLA management extends stage 33** (routing rules, SLA timers). **PLUS's Evaluation Committees and Award Management extend stages 32-33** further for procurement-specific, committee-based decisions.

## Group E — Transactional Lifecycle (post-onboarding, ongoing), stages 39-45

39 Opportunity/RFQ Invitation, 40 Bid/Quotation/Evaluation, 41 Award & Contract, 42 PO/Delivery/QC/GRN, 43 Invoice/Payment, 44 Performance/Renewal, 45 Revalidation/Continuous Lifecycle.

**Tier overlap**: this is NOT part of "onboarding" -- it maps directly onto FLEX's own separate bullets (Purchase Requests, RFQ, POs, Deliveries, Invoices, Payments, Vendor performance). **PLUS's entire Strategic Sourcing suite (Strategic Sourcing, Category Management, RFI/RFP/eTender, Reverse Auctions, Negotiation) is a direct upgrade of stages 39-40** -- same job (get a vendor a piece of work), far more sophisticated sourcing process. Stage 45 (Revalidation) is where CORE's Audit Management/Compliance Centre and PLUS's Supplier Collaboration/Procurement Intelligence feed back into the same continuous-monitoring loop.

---

# Product Family Summary

| Product | Primary Role |
|---|---|
| **VeriphyVendor FLEX** | Complete Vendor Lifecycle |
| **VeriphyVendor CORE** | Enterprise Supplier Lifecycle |
| **VeriphyVendor PLUS** | Enterprise Source-to-Pay |
| **VendorFlow Studio** | Low-Code Application Platform |
| **VendorFlow AI** | AI & Intelligence |
| **VendorFlow Connect** | Integration Hub |
| **VendorFlow Mobile** | Mobile Workforce Experience |

---

# Commercial Architecture

The commercial model should allow customers to start with FLEX and expand without replacing the platform.

```text
                    VERIPHYVENDOR FLEX
                           |
                     Customer Growth
                           |
                           v
                    VERIPHYVENDOR CORE
                           |
                     Procurement Growth
                           |
                           v
                    VERIPHYVENDOR PLUS
                           |
                +----------+----------+
                |          |          |
                v          v          v
              STUDIO       AI       CONNECT
                           |
                           v
                         MOBILE
```

The customer remains on the same platform, database, identity model, security model, APIs, reporting framework, and upgrade path as additional capabilities are enabled.

---

# One-Line Positioning

## VeriphyVendor

**The trusted supplier lifecycle and procurement platform powered by VendorFlow.**

## FLEX

**Complete Vendor Lifecycle.**

## CORE

**Enterprise Supplier Lifecycle.**

## PLUS

**Enterprise Source-to-Pay.**

## Studio

**Build and extend your business applications.**

## AI

**Intelligence across your supplier ecosystem.**

## Connect

**Connect every enterprise system.**

## Mobile

**Work anywhere, anytime.**
