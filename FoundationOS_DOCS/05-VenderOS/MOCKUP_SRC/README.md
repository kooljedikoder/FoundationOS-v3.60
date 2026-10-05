# VendorOS mockup source

The single-file mockup (`foundation_os/public/VendorFlow_Admin_Home.html`, 1.3 MB) is now kept as 126 small files here and rebuilt from them. The rebuilt file is identical to the file it was split from (checked with a SHA-256 hash).

| Folder | Holds |
|---|---|
| `sections/<section>/` | One folder per section SPA: its pages (`page-*.html`), CCC tabs (`tab-*.html`), PRD panes (`pane-*.html`) |
| `shell/` | Login, sidebar, top bar, modals, overlays |
| `css/` | Styles, split by their section comments |
| `js/` | Code, split by its section comments |
| `parts.json` | The order the parts are joined in |
| `SECTIONS.md` | The 11 sections with their submenus, pages, roles and data |

## Everyday use

1. Edit the part you need, for example `sections/ccc/tab-cc-dir.html`.
2. Run `node build.js` (writes `foundation_os/public/VendorFlow_Admin_Home.html`).
3. Open it from `http://localhost/...` and test.

Do not edit the built file by hand. Do not run the one-time split script again once you have edited parts, because it would overwrite them from the built file.

## Next stage (not done yet): load each section on demand

Today the shell and every section are still joined into one file. To make each section a real SPA that loads when first opened:

1. The shell keeps an empty `<div class="page" id="page-x" data-src="sections/...">` for each page.
2. `showPage()` fetches the fragment the first time, inserts it, then runs the same set-up the page needs (icons, KPI cards, data map overlay, type labels).
3. CCC and the PRD go first. They are 745 KB of the 1.3 MB.
4. A build option keeps producing the single file for sharing, because `fetch` does not work when the file is opened from disk.
