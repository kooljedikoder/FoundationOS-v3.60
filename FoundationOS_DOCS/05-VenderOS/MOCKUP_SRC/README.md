# VendorOS mockup source

The single-file mockup (`foundation_os/public/VendorFlow_Admin_Home.html`, 1.3 MB) is kept as 126 small files here and rebuilt from them. The rebuilt file is identical to the file it was split from (checked with a SHA-256 hash).

| Folder | Holds |
|---|---|
| `sections/00-dashboard` to `09-reports-bi` | The dashboard and the 9 PRD workspaces |
| `sections/10-administration`, `11-contact-control-center`, `12-spec-docs` | Platform pieces outside the PRD workspace list |
| `shell/` | Login, sidebar, top bar, modals, overlays |
| `css/`, `js/` | Styles and code, split by their section comments |
| `parts.json` | The order the parts are joined in |
| `SECTIONS.md` | Page style flow, each workspace's menu, and what is pending (sublinks, pages, tabs) |

## Everyday use

1. Edit the part you need, for example `sections/11-contact-control-center/tab-cc-dir.html`.
2. Run `node build.js` (writes `foundation_os/public/VendorFlow_Admin_Home.html`).
3. Open it from `http://localhost/...` and test.

Do not edit the built file by hand.

## Next stage (not done yet): load each section on demand

1. The shell keeps an empty `<div class="page" id="page-x" data-src="sections/...">` for each page.
2. `showPage()` fetches the fragment the first time, inserts it, then runs the set-up the page needs (icons, KPI cards, data overlay, type labels).
3. CCC and the PRD go first: they are 745 KB of the 1.3 MB.
4. A build option keeps producing the single file for sharing, because `fetch` does not work from disk.
