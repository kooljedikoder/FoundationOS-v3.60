const fs = require('fs');
const SRC = 'C:/xampp/htdocs/FoundationOS/FoundationOS_DOCS/05-VenderOS/MOCKUP_SRC';
const s = fs.readFileSync('C:/xampp/htdocs/FoundationOS/foundation_os/public/VendorFlow_Admin_Home.html', 'utf8');
const parts = JSON.parse(fs.readFileSync(SRC + '/parts.json', 'utf8'));
const sizeOf = rel => Math.round(fs.statSync(SRC + '/' + rel).size / 1024);
// menu items by page
const nav = s.slice(s.indexOf('<aside id="sidebar">'), s.indexOf('</aside>', s.indexOf('<aside id="sidebar">')));
const items = {}; let last = null; let curSec = '';
nav.split('<div class="nav-section" data-section="').slice(1).forEach(p => {
  curSec = p.slice(0, p.indexOf('"'));
  [...p.matchAll(/<div class="nav-item"([^>]*)>([\s\S]*?)<\/div>/g)].forEach(it => {
    const label = ((it[2].match(/nav-label">([^<]*)/) || [])[1] || '').replace(/&amp;/g, '&'); if (!label) return;
    const pg = (it[1].match(/data-page="([^"]+)"/) || [])[1]; const tier = (it[1].match(/data-tier="([^"]+)"/) || [])[1];
    if (pg) { if (!items[pg]) items[pg] = { label, tier, subs: [], menu: curSec }; last = items[pg]; }
    else if (last) { const sub = /subNav\('([^']+)',\{([^}]*)\}/.exec(it[1]); last.subs.push(label + (sub && /tier:'(\w+)'/.test(sub[2]) ? ' (' + sub[2].match(/tier:'(\w+)'/)[1].toUpperCase() + ')' : '')); }
  });
});
const roleSections = eval('(' + s.match(/const ROLE_SECTIONS = (\{[\s\S]*?\});/)[1] + ')');
const W = [
  ['00-dashboard', 'Dashboard', 'Executive overview, KPIs, vendor health, spend, compliance, risk, activity, tasks, watch list.', 'Dashboard-first landing for every role; each role has its own banner and cards.', 'Has role dashboards and the module grid. Not built: vendor health, spend and watch list panels, task centre.', 'All internal roles', 'Reads from the other workspaces; owns no tables'],
  ['01-vendor-management', 'Vendor Management', 'Vendor directory, Passport 360 (overview, company, contacts, directors, banking, tax, documents, certifications, insurance, products and services, branches, performance, contracts, communications, timeline, activity log, notes), New Vendor wizard, categories, preferred, blacklisted, archived.', 'Passport is the workspace; registration is the Layer 2 workflow behind it.', 'Has registration (13 steps), approval, passport with tabs, document management, assessment. Not built: directory page (the CCC directory is the list), preferred, blacklisted and archived views.', 'Vendor Admin, Procurement, Finance, Audit, Executive', 'CCC contacts, vendor_passports, fos_vendor_*'],
  ['02-procurement', 'Procurement', 'Dashboard, RFQs, quotations, bid, technical and commercial evaluation, finance review, procurement review, recommendation, approval, awards, POs, contracts, reports.', 'Tabbed workspace; evaluation and award are drill-down screens.', 'Has RFQs, POs, warehouse and receiving, PLUS hub (demand, sourcing, collaboration, analytics) and Finance and Payments. Not built: quotation and evaluation screens as tabs. Finance and Payments has no workspace of its own in the PRD tree; it sits here until decided.', 'Procurement, Warehouse, Finance, Executive', 'ERP purchases_*, inventories_*, accounts_*'],
  ['03-risk-compliance', 'Risk and Compliance', 'Dashboard, compliance reviews, risk assessments, site inspections, audits, CAPA, ESG, vendor scoring, health score, renewals, expiring documents, reports.', 'Dashboard, then register tabs (findings, CAPA, risks).', 'Has audit (findings, CAPA, plan) and risk register. Not built: compliance reviews, site inspections, health score and renewals as their own tabs.', 'Audit, Executive', 'New fos_ tables for findings, CAPA, risks'],
  ['04-contracts-commercial', 'Contracts and Commercial', 'Dashboard, contracts, templates, pricing, terms, SLAs, renewals, digital signatures, spend analysis, reports.', 'Register plus obligation tracking.', 'Has contracts and obligations. Not built: templates, pricing, SLAs, signatures, spend analysis.', 'Procurement, Executive', 'New fos_contracts tables'],
  ['05-performance', 'Performance', 'Dashboard, KPI scorecards, ratings, delivery, quality and financial performance, corrective actions, improvement plans, benchmarking, trends.', 'Scorecard tabs.', 'Has performance and SLA overview. Not built: scorecards, benchmarking, improvement plans as tabs.', 'Procurement, Finance, Executive', 'New fos_vendor_performance tables'],
  ['06-training-competency', 'Training and Competency', 'Dashboard, courses, learning centre, induction, assessments, competency matrix, certificates, expiry tracking, reports.', 'Course catalogue, test, certificate register.', 'Has induction and certification (three courses, the test, the register). Not built: learning centre, competency matrix.', 'Vendor Admin, Audit, Executive', 'New hse_courses and attempts tables; CCC certifications'],
  ['07-communications', 'Communications', 'Dashboard, messages, announcements, meetings, tasks, support tickets, surveys, improvement plans, document sharing, activity feed.', 'Unified inbox with channel tabs.', 'Has the unified inbox (messages, email, WhatsApp) and the vendor portal preview. Not built: announcements, meetings, tasks, surveys.', 'Executive, Vendor Admin', 'Communications module'],
  ['08-vendor-portal', 'Vendor Portal', 'Home, profile, documents, contracts, orders, invoices, payments, RFQs, training, support, notifications.', 'One-level menu of nine entries; each entry is tabs over the standard list and drawer.', 'Has the nine entries (Company and Passport, Documents, Orders and RFQs, Invoices and Payments, Training and HSE, Communications, Requests, Help). Contracts, payments and notifications are tabs, not menu items (D-09).', 'Vendor (Portal) only', 'Real vendor data through the vendor-user to partner link (to build)'],
  ['09-reports-bi', 'Reports and BI', 'Executive, vendor, spend, procurement, compliance, risk, performance and contract reports, scheduled reports, export centre, BI analytics.', 'Report library plus export centre.', 'Not in the mockup. The other session built Reports and BI (M10); port it here.', 'Executive, Finance, Audit', 'Reads every other workspace'],
  ['10-administration', 'Administration', 'Dashboard, users, roles, departments, teams, workflow designer, approval matrix, categories, templates, integrations, API keys, audit logs, system and theme settings.', 'Settings tabs; configuration drawers.', 'Has users, roles and permissions, business units, editions and licensing, role and menu guide, workflow automation, integration hub, AI copilot and the dynamic form builder. Not built: departments and teams pages, approval matrix, audit log viewer, theme settings.', 'User Admin, Super Admin', 'Shared users, roles, fos_modules'],
  ['11-contact-control-center', 'Contact Control Center (FOS module)', 'Not in the VendorOS sitemap. The shared contact book used by every FOS product.', 'Directory, profile, 13-step form, document centre, assets, settings.', 'Directory, profile, contact form for six types, assets, document centre, users and access, settings forms, rules; all live on the prototype database.', 'User Admin, Super Admin', 'Shared users, partners_*, fos_*; prototype copy in public/proto'],
  ['12-spec-docs', 'Specification and Support', 'Not part of the product. Reference.', 'PRD panes and support.', 'PRD (modules, Build Spec v2, audit, CCC Change List) and Support.', 'Everyone with the mockup', 'Generated from PRD/']
];
const files = sec => parts.filter(p => p.indexOf('sections/' + sec + '/') === 0);
let md = `# VendorOS mockup: workspaces, page styles and where each lives

Sources: the PRD sitemap ("10 main workspaces"), PRD Two-Level Workspace Architecture, Build Spec v2 section 9 (UI standards, rule R12), and the mockup menu.

## The page style flow

Every workspace is a small SPA. They all follow the same flow, so nothing is invented per page.

**Layer 1: the operational workspace** (daily use, tabbed, dashboard-first)

1. Breadcrumb on every page
2. Page header: title and the one primary action
3. KPI strip (the workspace opens on its own numbers, not a table)
4. Tabs (shared tabs: Overview, Details, Documents, Timeline, Activity, Comments, Attachments, History, Audit Log)
5. Standard list: one renderer, columns reference, title, type, owner, date, amount, status, next action (rule R12, no per-page table styles)
6. Right-hand drawer on row click (shared drawers: View, Quick Edit, Approve, Reject, Assign Reviewer, Upload Documents, Add Note, Send Message, View History)
7. A full form when the task is bigger than a drawer (shared forms: Vendor Registration, Company, Contact and Director Details, Bank Details, Tax Info, Insurance, Certification Upload, Site Inspection Checklist, Risk Assessment, Evaluations, Contract Creation, Performance Review, CAPA, Training Record, Support Ticket, User Administration)

**Layer 2: the workflow engine** (drill-down, step by step)

The 45-stage Registration and Onboarding journey and similar processes. Four-panel layout: header with save status (Saving, Saved, Offline, Sync Pending, Last saved), wizard steps on the left (Completed, Current, Pending, Validation Error, Review Required, Locked), main form with the context help panel, and a sticky action bar (Previous, Save Draft, Next, Cancel, Submit).

**Always:** responsive (sidebar becomes a drawer under 900px, no sideways scroll at 375px), status colours (grey draft, blue in progress, orange action needed, red blocked or expired, green done), vendors cannot delete records.

## Dashboard, the 9 workspaces, Administration, the CCC and the spec

| # | Workspace | Folder | Parts | Size |
|---|---|---|---|---|
`;
const NUM = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, '-', '-', '-'];
W.forEach(([sec, name], i) => { const f = files(sec); md += `| ${NUM[i]} | ${name} | \`sections/${sec}/\` | ${f.length || 'none yet'} | ${f.length ? f.reduce((a, p) => a + sizeOf(p), 0) + ' KB' : '-'} |\n`; });
W.forEach(([sec, name, prd, style, has, who, data], i) => {
  const pg = files(sec).map(p => (p.match(/page-([a-z0-9-]+)\.html/) || [])[1]).filter(Boolean);
  const SECP = { '00-dashboard': ['dashboard'], '01-vendor-management': ['reg', 'approval', 'passport', 'docs', 'assessment'], '02-procurement': ['procurement', 'warehouse', 'plusprocure', 'finance'], '03-risk-compliance': ['audit', 'erm'], '04-contracts-commercial': ['clm'], '05-performance': ['perf'], '06-training-competency': ['hse'], '07-communications': ['comms', 'selfservice'], '08-vendor-portal': ['myprofile', 'mydocuments', 'myrfqpo', 'myinvoices', 'myhse', 'mycomms', 'requests', 'support'], '10-administration': ['admin', 'editions', 'role-guide', 'workflow', 'integration', 'ai', 'builder'], '11-contact-control-center': ['ccc'], '12-spec-docs': ['prd', 'support'] };
  md += `\n---\n\n## ${NUM[i] === '-' ? name : NUM[i] + '. ' + name}\n\n- **PRD says:** ${prd}\n- **Page style:** ${style}\n- **Mockup status:** ${has}\n- **Who (mockup roles):** ${who}\n- **Data:** ${data}\n- **Source:** \`MOCKUP_SRC/sections/${sec}/\`\n`;
  if (sec === '11-contact-control-center') { md += `- **Tabs:** Dashboard, Directory, Vendor profile, Registration wizard (comparison), Contact form (13 steps, six types), Assets, Document Centre, Settings (comparison), Settings forms (Organisation, Departments, Teams, Titles, Categories and Tags, Banks, Location, Affiliations, Field Options, Field and Tab Rules, Custom Fields, Required Documents, Type Labels), Users and access, Compare\n`; return; }
  if (sec === '12-spec-docs') { md += `- **Panes:** one file per PRD pane (\`pane-*.html\`), generated by the PRD injector\n`; return; }
  const list = (SECP[sec] || []).map(p => ({ p, it: items[p] }));
  if (!list.length) { md += `- **Menu entries:** none yet\n`; return; }
  md += `\n| Menu entry | Page | Edition | Submenu and tabs |\n|---|---|---|---|\n`;
  list.forEach(({ p, it }) => { md += `| ${it ? it.label : p} | \`${p}\` | ${it && it.tier ? it.tier.toUpperCase() : '-'} | ${it && it.subs.length ? it.subs.join(', ') : '-'} |\n`; });
});

const PEND = JSON.parse(fs.readFileSync(__dirname + '/pending.json', 'utf8'));
const cnt = (arr, st) => arr.filter(x => x[1] === st).length;
md += '\n---\n\n## What is pending: sublinks and pages, and tabs\n\nPRD sitemap compared with the mockup. Built = in the mockup. Partial = exists but as a panel, under another page, or without the PRD shape. Pending = not in the mockup.\n\n| Workspace | Pages built | Pages partial | Pages pending | Tabs built | Tabs partial | Tabs pending |\n|---|---|---|---|---|---|---|\n';
PEND.forEach(w => { md += '| ' + (w.num === '-' ? '' : w.num + '. ') + w.name + ' | ' + cnt(w.pages, 'Built') + ' | ' + cnt(w.pages, 'Partial') + ' | ' + cnt(w.pages, 'Pending') + ' | ' + cnt(w.tabs, 'Built') + ' | ' + cnt(w.tabs, 'Partial') + ' | ' + cnt(w.tabs, 'Pending') + ' |\n'; });
PEND.forEach(w => {
  md += '\n### ' + (w.num === '-' ? '' : w.num + '. ') + w.name + '\n\n**Sublinks and pages**\n\n| Item | Status | Note |\n|---|---|---|\n' + w.pages.map(r => '| ' + r[0] + ' | ' + r[1] + ' | ' + r[2] + ' |').join('\n') + '\n\n**Tabs**\n\n| Item | Status | Note |\n|---|---|---|\n' + w.tabs.map(r => '| ' + r[0] + ' | ' + r[1] + ' | ' + r[2] + ' |').join('\n') + '\n';
});
md += '\n### Global pieces from the PRD tree (not in any workspace)\n\n| Item | Status |\n|---|---|\n| Global search | Built (client-side stub over the module list) |\n| Notification centre | Partial (bell panel for staff; the vendor portal has a Notifications page) |\n| Task centre | Built |\n| Calendar | Built |\n| Help centre | Built (Support page with Chat, Email, Knowledge base) |\n| User profile (My account, Preferences, Security, Activity) | Built |\n';
md += `\n---\n\n## Shared by every workspace\n\n- \`shell/\`: login, sidebar, top bar, modals, overlays\n- \`css/\`: design tokens and shared styles; \`js/\`: shared code (navigation, roles, editions, toast, icons)\n\n## Role access today (from \`ROLE_SECTIONS\`, by current menu group)\n\n| Role | Menu groups shown |\n|---|---|\n${Object.entries(roleSections).map(([r, a]) => `| ${r} | ${a.join(', ')} |`).join('\n')}\n\n## What changes in the mockup menu\n\nThe sidebar still uses the older nine groups. To match the PRD it should group by the ten workspaces above: Vendor Management, Procurement, Risk and Compliance, Contracts and Commercial, Performance, Training and Competency, Communications, Vendor Portal, Reports and BI, then Administration. Decisions needed before changing the menu: where Finance and Payments lives, and whether HSE Induction moves to Training and Competency (the PRD says yes).\n`;
fs.writeFileSync(SRC + '/SECTIONS.md', md); console.log('written', md.length);
