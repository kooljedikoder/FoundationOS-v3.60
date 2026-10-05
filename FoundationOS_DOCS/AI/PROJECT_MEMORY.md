# Project memory (updated 5 Oct 2026)

- FOS is a base starter app on LaraDashboard, with core apps. It is not an ERP (ADR-055).
- FOS owns the partner tables and the shared identity data. Webkul ERP and Filament apps are plugins that can be removed without breaking FOS (ADR-056).
- Laravel first. Filament is only the installer, a test surface and a harvest source (ADR-057).
- Apps (CCC, Documents, Collaboration, Training, Insights, Commerce, Risk, Automation) and products (VendorOS Core, Vendor Portal, CRM) plug into the base through ports. At install the app chooses FOS tables or its own (ADR-058).
- A distribution can ship only the apps a job needs (ADR-059).
- Every page and form is a schema the builder can read and edit (ADR-060).
- One database per installation. `fos_modules` is the runtime switch.
- Current handover: `FoundationOS_DOCS/HANDOVER_CURRENT.md`.
