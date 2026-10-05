// node tools/apply.js : applies every workspace spec, regroups the sidebar to the PRD workspaces, adds AppSuite gating. Idempotent.
const fs = require('fs'), path = require('path');
const E = require('./engine');
const lib = require('./lib');
const specs = ['00-dashboard-01-vendors', '02-procurement', '03-04-05-risk-contracts-performance', '06-07-08-training-comms-portal', '09-reports-10-appsuite', '10-builder'].map(n => require('./specs/' + n));
const PKG = require('./specs/09-reports-10-appsuite').PKG;
const { blockEnd, children, read, write } = E;

// ---------- 1. pages and new pages
const pages = [].concat(...specs.map(s => s.pages));
const newPages = [].concat(...specs.map(s => s.newPages));
E.applyPages(pages);
E.applyNewPages(newPages);

// ---------- 2. dashboard: workspace health cards on the executive and super admin panels
{
  const f = E.parts.find(p => p.endsWith('/page-dashboard.html')); let t = read(f);
  let g = 0; for (;;) { const m = t.indexOf('data-gen-health="1"'); if (m < 0 || g++ > 5) break; const from = t.lastIndexOf('<div', m); t = t.slice(0, from) + t.slice(blockEnd(t, from)); }
  const health = specs[0].health;
  { // workspace health cards sit above the internal KPI strip, for internal roles only
    const at = t.indexOf('id="internalKpis"');
    if (at < 0) throw new Error('internalKpis not found');
    const from = t.lastIndexOf('<div', at);
    t = t.slice(0, from) + `<div data-gen-health="1" id="workspaceHealth">${health}</div>\n          ` + t.slice(from);
  }
  write(f, t);
}
const dataPart = E.writeDataJs();

// ---------- 3. sidebar regroup
const NAVFILE = E.parts.find(p => p.startsWith('shell/') && read(p).indexOf('data-section="vendorhub"') >= 0);
let nav = read(NAVFILE);
const secStart = nav.lastIndexOf('<div class="nav-section"', nav.indexOf('data-section="vendorhub"'));
// end of the last nav-section
let secEnd = secStart; { let i = secStart; for (;;) { const m = nav.indexOf('<div class="nav-section"', i); if (m < 0) break; secEnd = blockEnd(nav, m); i = secEnd; } }
const region = nav.slice(secStart, secEnd);
// collect top-level items by data-page
const ITEMS = {};
{
  let i = 0;
  for (;;) {
    const m = region.indexOf('<div class="nav-section"', i); if (m < 0) break;
    const e = blockEnd(region, m); const secHtml = region.slice(m, e); i = e;
    const kids = children(secHtml, 0);
    // items sit directly in the section (dashboard) or in .nav-section-body
    let pool = kids.kids.filter(k => k.cls.indexOf('nav-section-body') >= 0);
    let base = secHtml, list = [];
    if (pool.length) { const b = pool[0]; const inner = children(secHtml, b.from); list = inner.kids.map(k => ({ ...k, src: secHtml })); } else list = kids.kids.map(k => ({ ...k, src: secHtml }));
    for (let n = 0; n < list.length; n++) {
      const k = list[n]; if (k.cls.indexOf('nav-item') < 0 || !/data-page="/.test(k.tag)) continue;
      const page = k.tag.match(/data-page="([^"]+)"/)[1];
      const sec = (secHtml.match(/data-section="([^"]+)"/) || [])[1];
      let html = k.src.slice(k.from, k.to); let wrap = '';
      if (list[n + 1] && list[n + 1].cls.indexOf('nav-sub-wrap') >= 0) { wrap = list[n + 1].src.slice(list[n + 1].from, list[n + 1].to); }
      if (!(sec === 'vendorhub' && page === 'dashboard') && !ITEMS[page]) ITEMS[page] = { html, wrap, sec };
      if (sec === 'vendorhub') ITEMS['hub:' + page] = { html, wrap, sec };
    }
  }
}
const PAGE_PKG = {}; PKG.forEach(([id, , , , pg]) => pg.split(',').forEach(p => { PAGE_PKG[p] = id; }));
const chip = t => ({ flex: 'F', core: 'C', plus: 'P', platform: 'S' }[t] || 'F');
const _newItem = (page, label, icon, tier, subs) => `<div class="nav-item" data-page="${page}" data-tier="${tier}" onclick="${subs && subs.length ? `navGroupClick(this,'g-${page}')` : 'navClick(this)'}"><i data-lucide="${icon}"></i><span class="nav-label">${label}</span><span class="tier-chip ${tier}" ${tier === 'platform' ? 'title="Platform extension (all editions)"' : ''}>${chip(tier)}</span><i data-lucide="lock" class="lock-ic"></i>${subs && subs.length ? `<i data-lucide="chevron-right" class="nav-chevron" id="chev-g-${page}"></i>` : ''}</div>` + (subs && subs.length ? subsWrap(page, subs) : '');
const subsHtml = (page, subs) => subs.map(([l, tab, tier]) => `<div data-gen-sub="1" class="nav-item" onclick="subNav('${page}',{tab:'${tab}'${tier ? `,tier:'${tier}'` : ''}})"><i data-lucide="chevron-right"></i><span class="nav-label">${l}</span></div>`).join('\n        ');
const subsWrap = (page, subs) => `\n      <div class="nav-sub-wrap" id="g-${page}"><div class="nav-sub">\n        ${subsHtml(page, subs)}\n      </div></div>`;
// extra sublinks: one per generated tab
const EXTRA = {};
pages.concat(newPages).forEach(sp => { EXTRA[sp.id] = sp.tabs.filter(t => !t.existing && t.id !== 'wrap').map(t => [t.label, sp.id + '-tab-' + t.id]); });
const stripPkg = h => h.replace(/ data-pkg="[^"]*"/, '');
const withPkg = (html, page) => PAGE_PKG[page] ? stripPkg(html).replace('<div class="nav-item', `<div data-pkg="${PAGE_PKG[page]}" class="nav-item`) : stripPkg(html);
const newItem = (...a) => withPkg(_newItem(...a), a[0]);
const _unused = (html, page) => PAGE_PKG[page] ? html.replace('<div class="nav-item', `<div data-pkg="${PAGE_PKG[page]}" class="nav-item`) : html;
const stripGen = w => { let g = 0; for (;;) { const m = w.indexOf('data-gen-sub="1"'); if (m < 0 || g++ > 400) break; const from = w.lastIndexOf('<div', m); w = w.slice(0, from) + w.slice(blockEnd(w, from)); } return w; };
const take = (page, o) => {
  o = o || {}; const it = ITEMS[page]; if (!it) throw new Error('no nav item for ' + page);
  let html = it.html, wrap = stripGen(it.wrap); const extra = (EXTRA[page] || []).filter(x => !o.skipExtra);
  if (o.drop && wrap) { /* keep as is */ }
  if (extra.length) {
    if (wrap) { const at = wrap.lastIndexOf('</div></div>'); wrap = wrap.slice(0, at) + '  ' + subsHtml(page, extra) + '\n      ' + wrap.slice(at); }
    else {
      const gid = 'g-' + page; html = html.replace(/onclick="navClick\(this\)"/, `onclick="navGroupClick(this,'${gid}')"`).replace('</div>', `<i data-lucide="chevron-right" class="nav-chevron" id="chev-${gid}"></i></div>`);
      wrap = subsWrap(page, extra);
    }
  }
  html = withPkg(html, page);
  return '      ' + html + (wrap ? '\n      ' + wrap : '') + '\n';
};
const section = (key, title, body) => `    <div class="nav-section" data-section="${key}"><div class="nav-section-title" onclick="toggleSection(this)">${title}<i data-lucide="chevron-right" class="sec-chev"></i></div><div class="nav-section-body" id="secbody-${key}">\n\n${body}    </div></div>\n\n`;
// vendor hub (external): Home goes to the new Home page, add Notifications
let hub = region.slice(0, blockEnd(region, 0));
if (hub.indexOf('data-pkg="vendorportal"') < 0) hub = hub.replace('data-section="vendorhub"', 'data-section="vendorhub" data-pkg="vendorportal"');
hub = hub.replace('<div class="nav-item active" data-page="dashboard" onclick="showPage(\'dashboard\')">', '<div class="nav-item active" data-page="myhome" onclick="showPage(\'myhome\')">');
if (hub.indexOf('data-page="mynotifications"') < 0) hub = hub.replace('<div class="nav-item" data-page="requests"', '<div class="nav-item" data-page="mynotifications" onclick="showPage(\'mynotifications\')"><i data-lucide="bell"></i><span class="nav-label">Notifications</span></div>\n      <div class="nav-item" data-page="requests"');
const dashSection = `    <div class="nav-section" data-section="dashboard">\n${take('dashboard', { skipExtra: true })}      ${newItem('tasks', 'Task Centre', 'check-square', 'flex')}\n      ${newItem('calendar', 'Calendar', 'calendar', 'flex')}
      ${newItem('profile', 'My Account', 'user', 'flex')}\n    </div>\n\n`;
const out = hub + '\n' + dashSection
  + section('vendor', 'Vendor Management', '      ' + newItem('vendors', 'Vendor Directory', 'building-2', 'flex', EXTRA.vendors) + '\n' + take('reg') + take('passport') + take('docs') + take('assessment'))
  + section('procurement', 'Procurement', take('procurement') + take('warehouse') + take('finance') + take('plusprocure'))
  + section('risk', 'Risk &amp; Compliance', take('audit') + take('erm'))
  + section('contracts', 'Contracts &amp; Commercial', take('clm'))
  + section('performance', 'Performance', take('perf'))
  + section('training', 'Training &amp; Competency', take('hse'))
  + section('comms', 'Communications', take('comms') + take('selfservice'))
  + section('reports', 'Reports &amp; BI', '      ' + newItem('reports', 'Reports &amp; BI', 'bar-chart-2', 'core', EXTRA.reports) + '\n')
  + section('admin', 'Administration &amp; Platform', take('ccc') + take('admin') + '      ' + newItem('appsuite', 'AppSuite', 'layers', 'flex', EXTRA.appsuite) + '\n' + take('editions') + take('role-guide') + take('workflow') + take('integration') + take('ai') + take('builder') + take('prd'));
nav = nav.slice(0, secStart) + out + nav.slice(secEnd);
write(NAVFILE, nav);

// ---------- 4. roles, landing page and phone menu
{
  const jsRoles = E.parts.find(p => p.startsWith('js/') && read(p).indexOf('const ROLE_SECTIONS') >= 0); let t = read(jsRoles);
  const a = t.indexOf('const ROLE_SECTIONS = {'); const b = t.indexOf('};', a) + 2;
  t = t.slice(0, a) + `const ROLE_SECTIONS = {
  executive:   ['dashboard','vendor','procurement','risk','contracts','performance','training','comms','reports'],
  vendor:      ['dashboard','vendor','training','comms'],
  procurement: ['dashboard','vendor','procurement','contracts','performance','reports'],
  finance:     ['dashboard','vendor','procurement','performance','reports'],
  audit:       ['dashboard','vendor','risk','training','reports'],
  warehouse:   ['dashboard','procurement'],
  useradmin:   ['dashboard','admin'],
  superadmin:  ['dashboard','vendor','procurement','risk','contracts','performance','training','comms','reports','admin'],
  vendorportal:['vendorhub']
};` + t.slice(b);
  t = t.split("landing:'dashboard'").join("landing:'dashboard'");
  write(jsRoles, t);
  const bn = E.parts.find(p => p.startsWith('js/') && read(p).indexOf('const BN = {') >= 0); let u = read(bn);
  u = u.replace("vendorportal:[['Home','layout-dashboard','dashboard']", "vendorportal:[['Home','layout-dashboard','myhome']");
  write(bn, u);
}
{ // vendor role lands on the new Home page
  const f = E.parts.find(p => p.startsWith('js/') && /vendorportal\s*:\s*\{[^}]*landing/.test(read(p)));
  if (f) { let t = read(f); t = t.replace(/(vendorportal\s*:\s*\{[^}]*landing\s*:\s*')dashboard(')/, '$1myhome$2'); write(f, t); }
}

// ---------- 5. AppSuite behaviour and styles
{
  const css = `/* ---------- AppSuite packages and workspace blocks ---------- */
.pkg-sw{position:relative;display:inline-block;width:44px;height:24px}
.pkg-sw input{opacity:0;width:0;height:0;position:absolute}
.pkg-sw span{position:absolute;inset:0;background:var(--border);border-radius:99px;transition:background .2s;cursor:pointer}
.pkg-sw span:before{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.pkg-sw input:checked+span{background:var(--success)}
.pkg-sw input:checked+span:before{transform:translateX(20px)}
.pkg-sw input:disabled+span{opacity:.6;cursor:not-allowed}
.pkg-sw input:focus-visible+span{outline:2px solid var(--primary);outline-offset:2px}
body.vendor-mode #workspaceHealth{display:none}
${PKG.map(([id]) => `body.pkg-off-${id} [data-pkg="${id}"]{display:none!important}`).join('\n')}
`;
  const cssRel = 'css/007-appsuite-and-workspaces.css'; write(cssRel, css);
  { // the CSS must sit before the part that closes the <style> element
    const arr = E.parts.filter(p => p !== cssRel);
    const at = arr.findIndex(p => p.startsWith('css/') && read(p).indexOf('</style>') >= 0);
    if (at < 0) throw new Error('style close part not found');
    arr.splice(at, 0, cssRel); E.parts = arr;
  }
  const REQ = {}; PKG.forEach(([id, , , req]) => { REQ[id] = req === '-' ? [] : req.split(',').map(s => s.trim()); });
  const js = `/* ---------- AppSuite: package switches (mockup of the FOS module registry) ---------- */
const PKG_REQ = ${JSON.stringify(REQ)};
const PKG_NAME = ${JSON.stringify(Object.fromEntries(PKG.map(p => [p[0], p[1]])))};
const PKG_OFF = {};
function pkgToggle(id, on){
  const msg = document.getElementById('pkgMsg');
  if(!on){
    const users = Object.keys(PKG_REQ).filter(k => !PKG_OFF[k] && PKG_REQ[k].includes(id));
    if(users.length){
      const cb = document.querySelector('[data-pkg-row="'+id+'"] input[type=checkbox]'); if(cb) cb.checked = true;
      showToast(PKG_NAME[id]+' is needed by '+users.map(u=>PKG_NAME[u]).join(', ')+'. Turn those off first.','alert-circle'); return;
    }
    PKG_OFF[id] = true; document.body.classList.add('pkg-off-'+id);
    if(msg) msg.textContent = PKG_NAME[id]+' is off: its menu entries are hidden and its data is kept.';
  } else {
    const miss = PKG_REQ[id].filter(r => PKG_OFF[r]);
    if(miss.length){
      const cb = document.querySelector('[data-pkg-row="'+id+'"] input[type=checkbox]'); if(cb) cb.checked = false;
      showToast(PKG_NAME[id]+' needs '+miss.map(u=>PKG_NAME[u]).join(', ')+'. Turn those on first.','alert-circle'); return;
    }
    delete PKG_OFF[id]; document.body.classList.remove('pkg-off-'+id);
    if(msg) msg.textContent = PKG_NAME[id]+' is on.';
  }
}
function pkgMode(id, mode){ showToast(PKG_NAME[id]+' will use '+({fos:'the FOS tables',own:'its own tables',hybrid:'a choice per need'}[mode])+' at install','database'); }
`;
  const jsRel = 'js/202-appsuite.js'; write(jsRel, js);
  if (!E.parts.includes(jsRel)) { const at = E.parts.indexOf(dataPart); const arr = E.parts.slice(); arr.splice(at + 1, 0, jsRel); E.parts = arr; }
}
console.log('applied: pages', pages.length, 'new pages', newPages.length, 'parts', E.parts.length);
require('./dbconnect');
require('./pagebuilder');
require('./distribution');
require('./schema_export')(pages, newPages, PAGE_PKG);
