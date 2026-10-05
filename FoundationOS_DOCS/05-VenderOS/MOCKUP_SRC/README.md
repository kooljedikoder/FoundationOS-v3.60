# VendorOS mockup source

The single-file mockup (`foundation_os/public/VendorFlow_Admin_Home.html`) is kept as small files here and rebuilt from them.

| Folder | Holds |
|---|---|
| `sections/00-dashboard` to `09-reports-bi` | The dashboard and the 9 PRD workspaces (pages and tabs) |
| `sections/10-administration`, `11-contact-control-center`, `12-spec-docs` | Platform pieces outside the PRD workspace list |
| `shell/` | Login, sidebar, top bar, modals, overlays |
| `css/`, `js/` | Styles and code |
| `tools/` | The workspace generator: `specs/` (content), `lib.js` (blocks), `engine.js`, `apply.js` |
| `parts.json` | The order the parts are joined in |
| `SECTIONS.md`, `SITEMAP.md` | Page style flow, each workspace's menu, and the built or pending status of every page and tab |

## Everyday use

1. Edit a part, or a spec in `tools/specs/` (the workspace tabs are generated from these).
2. If you changed a spec run `node tools/apply.js`. It is safe to run again.
3. Run `node build.js` (writes `foundation_os/public/VendorFlow_Admin_Home.html`).
4. Open it from `http://localhost/...` and test.

Do not edit the built file by hand. `apply.js` also regroups the sidebar by the PRD workspaces and gates menu entries by AppSuite package.

## Next stage (not done yet): load each section on demand

1. The shell keeps an empty `<div class="page" id="page-x" data-src="sections/...">` per page.
2. `showPage()` fetches the fragment on first open and runs the page set-up (icons, KPI cards, data overlay, labels).
3. CCC and the PRD go first (about half the file).
4. A build option still produces the single file for sharing.
