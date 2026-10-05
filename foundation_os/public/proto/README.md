# VendorOS prototype backend (test data only)

`api.php` plus `proto.sqlite` make the CCC pages in `public/VendorFlow_Admin_Home.html` work for real.

- `build.php` (CLI only) copies the shared FOS tables (users, partners_*, fos_*, vendor_*, media, countries, states, currencies) from MySQL into `proto.sqlite`. It only reads MySQL. Passwords and 2FA secrets are blanked in the copy.
- `api.php` reads and writes `proto.sqlite` only. Localhost only. It never writes to MySQL. Every change is logged in `proto_audit`.
- Reset the copy at any time: `php public/proto/build.php` (this removes saved test data; delete `public/proto/uploads/` too).
- Table and column names match the real shared database, so the same shapes port to Laravel models later: swap PDO for Eloquent, the Laravel session for auth, and `media` uploads for the real disk.

Routes (all `api.php?r=...`): meta, states, contacts, contact, users, audit, doc_centre, document_file, contact_save, contact_status, user_active, document_upload, document_review, type_labels, list_add / list_update / list_delete (banks, titles, tags, departments, teams, picklist, custom_fields, required_documents).
