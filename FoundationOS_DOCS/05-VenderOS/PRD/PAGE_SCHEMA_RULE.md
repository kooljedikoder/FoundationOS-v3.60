# Rule: every page is a schema the builder can read and edit

Status: rule adopted 5 Oct 2026 for every app and module. Proven in the VendorOS mockup (page builder tab in Dynamic Form Builder).

## The rule

1. Every page, tab, block, form, list and field in every app and module is described as data (a JSON schema). Markup is generated from it.
2. The dynamic Form and Process Builder reads those schemas, creates new pages and edits existing ones. A page that is not in a schema cannot be seen by the builder.
3. Forms use the FormFlow field vocabulary (`FoundationOS_DOCS/SPECS/FORMFLOW.md`). Pages wrap forms, lists and other blocks.
4. Every app manifest (`foundation_module.json`) lists its page schemas and the collections they use, so the builder finds them when the app is on.
5. Field types, block types and lookups are a closed, documented list shared by all apps.

## What a page schema holds

| Part | Meaning |
|---|---|
| `id`, `title`, `subtitle` | Page identity |
| `workspace`, `package` | Where it sits in the menu and which app owns it |
| `actions` | Buttons in the page header |
| `kpis` | The KPI strip (rule: workspaces open on numbers) |
| `tabs` | Each tab has an id, a label and blocks, or is marked `legacy` while it is still hand-written |
| Block types | `kpis`, `list`, `bars`, `cards`, `matrix`, `form`, `flow`, `timeline`, `kv`, `note`, `html`, `columns` |
| `list` block | Points at a collection (a standard list, rule R12: one renderer, one drawer) |
| `form` block | A FormFlow form: id, version, fields (key, label, type, options, required, table, column), submit action |

The JSON Schema that checks it is `MOCKUP_SRC/schema/fos-page.schema.json`. Exported pages are in `MOCKUP_SRC/schema/pages/`. Collection schemas (fields, data source in the port) are in `schema/collections.json`.

## What works in the mockup today

- 21 pages export as schemas (107 schema tabs; 31 tabs are still hand-written and shown as `legacy`).
- Dynamic Form Builder, tab Pages: lists every page, opens its JSON, validates it, previews it, saves it to the database and shows it in the menu. A new page can be started from a template. Saved pages come back after a reload. Reset restores the original.
- Every standard list reads and writes the database (`proto_records`). Every generated form saves to the database.

## What it means for the real app

| Today | Target |
|---|---|
| CCC wizard is a 4,400 line Livewire class with hard-coded `wire:model` keys. Only field visibility, required documents and custom fields are rows in the database. | The contact form is a FormFlow schema. The 201-field dictionary (`PRD/data/field_dictionary.json`) and the 13-step layout are the seed. |
| LaraBuilder has `design_json` for content blocks only. | LaraBuilder keeps content blocks. Pages, tabs and forms use the page schema. One renderer in Blade and Livewire. |
| FormFlow exists only as a spec. | FormFlow becomes the form part of the page schema. |
| Pages live in Blade views. | Schemas live in a table (for example `fos_page_schemas`) with a version, the package that owns them and a published state. Edits create a new version. |

## Order of work

1. Decide the schema (this document plus FormFlow) and record it as an ADR.
2. Build the renderer and the schema store in FOS Core.
3. Convert one real page end to end (the CCC Document Centre is small and self-contained), then the contact form.
4. Add the builder UI to the real admin, reusing the mockup's validate, preview and save flow.
5. Each app ships its page schemas in its manifest from then on.
