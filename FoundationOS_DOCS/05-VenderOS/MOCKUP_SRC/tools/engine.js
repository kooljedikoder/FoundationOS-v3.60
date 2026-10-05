// Applies workspace specs to the mockup source parts. Safe to run again: generated markup is marked data-gen and rebuilt each time.
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..');
const lib = require('./lib');
const { tabPanel, esc } = lib;
const partsFile = path.join(SRC, 'parts.json');
let parts = JSON.parse(fs.readFileSync(partsFile, 'utf8'));
const read = rel => fs.readFileSync(path.join(SRC, rel), 'utf8');
const write = (rel, t) => { fs.mkdirSync(path.dirname(path.join(SRC, rel)), { recursive: true }); fs.writeFileSync(path.join(SRC, rel), t); };
const OPEN = '<div', CLOSE = '</div>';

// end index (exclusive) of the div that opens at `start`
function blockEnd(t, start) {
  let d = 0, i = start;
  while (i < t.length) {
    const o = t.indexOf(OPEN, i), c = t.indexOf(CLOSE, i);
    if (c < 0) throw new Error('unbalanced');
    if (o >= 0 && o < c && /[\s>]/.test(t[o + 4])) { d++; i = o + 4; }
    else { d--; i = c + 6; if (d === 0) return i; }
  }
  throw new Error('unbalanced');
}
// top-level child blocks of the div opening at `start`: [{from,to,cls}]
function children(t, start) {
  const rootEnd = blockEnd(t, start); const innerFrom = t.indexOf('>', start) + 1; const innerTo = rootEnd - 6;
  const out = []; let i = innerFrom;
  while (i < innerTo) {
    const o = t.indexOf(OPEN, i); if (o < 0 || o >= innerTo) break;
    // skip comments that contain a div
    const cm = t.lastIndexOf('<!--', o), ce = t.indexOf('-->', cm);
    if (cm >= i && ce > o) { i = ce + 3; continue; }
    const e = blockEnd(t, o); const tag = t.slice(o, t.indexOf('>', o) + 1);
    out.push({ from: o, to: e, cls: (tag.match(/class="([^"]*)"/) || [])[1] || '', id: (tag.match(/id="([^"]*)"/) || [])[1] || '', tag });
    i = e;
  }
  return { kids: out, innerFrom, innerTo, rootEnd };
}
const toks = k => k.cls.split(' ').filter(Boolean);
const hasCls = (k, c) => toks(k).includes(c);
const isLead = k => toks(k).some(t => t === 'page-header' || t === 'page-breadcrumb' || t === 'edition-note' || t === 'kpis' || t.indexOf('kpis-') === 0);

function tabsBar(tabs, pageId) {
  return `<div class="tabs" data-gen-tabs="1">${tabs.map((t, i) => `<div class="tab${i === 0 ? ' active' : ''}" onclick="switchTab(this,'${t.panel}')">${esc(t.label)}</div>`).join('')}</div>`;
}
const setPanelActive = (t, id, on) => {
  const at = t.indexOf(`id="${id}"`); if (at < 0) return t;
  const from = t.lastIndexOf('<div', at); const to = t.indexOf('>', at);
  let tag = t.slice(from, to + 1);
  tag = tag.replace(/class="tab-panel( active)?"/, on ? 'class="tab-panel active"' : 'class="tab-panel"');
  return t.slice(0, from) + tag + t.slice(to + 1);
};

// ---------- restructure an existing page part
function restructure(text, spec) {
  const rootStart = text.indexOf('<div class="page"');
  if (rootStart < 0) throw new Error('page root not found for ' + spec.id);
  // 1. drop previous generated output
  let guard = 0;
  for (;;) {
    const m = text.indexOf('data-gen="1"'); if (m < 0 || guard++ > 200) break;
    const from = text.lastIndexOf('<div', m); text = text.slice(0, from) + text.slice(blockEnd(text, from));
  }
  let g2 = 0; for (;;) { const m = text.indexOf('data-gen-tabs="1"'); if (m < 0 || g2++ > 5) break; const from = text.lastIndexOf('<div', m); text = text.slice(0, from) + text.slice(blockEnd(text, from)); }
  // unwrap a previous wrapper so it can be rebuilt consistently
  let wrapAt = text.indexOf('data-gen-wrap="1"');
  if (wrapAt >= 0 && spec.wrap) { // keep the wrapper id in step with the spec
    const w0 = text.lastIndexOf('<div', wrapAt); const w1 = text.indexOf('>', wrapAt); const oldTag = text.slice(w0, w1 + 1);
    const newTag = oldTag.replace(/id="[^"]+"/, 'id="' + spec.wrap.panel + '"');
    text = text.slice(0, w0) + newTag + text.slice(w1 + 1); wrapAt = text.indexOf('data-gen-wrap="1"');
  }
  let wrapId = null;
  // 2. find leading blocks
  let { kids, innerTo } = children(text, rootStart);
  let lead = 0;
  while (lead < kids.length && isLead(kids[lead])) lead++;
  const afterLead = lead ? kids[lead - 1].to : text.indexOf('>', rootStart) + 1;
  // an optional kpis strip from the spec when the page has none
  let insertKpis = '';
  if (spec.kpis && !kids.slice(0, lead).some(k => toks(k).includes('kpis') || toks(k).some(t => t.indexOf('kpis-') === 0))) insertKpis = spec.kpis;
  // existing native tabs bar?
  const nativeTabs = kids.slice(lead).findIndex(k => hasCls(k, 'tabs'));
  let bodyStart = afterLead, bodyEnd = innerTo;
  let head = text.slice(0, afterLead), body = text.slice(afterLead, innerTo), tail = text.slice(innerTo);
  if (nativeTabs >= 0) {
    // drop the old bar, keep the panels
    const k = kids[lead + nativeTabs]; body = body.slice(0, k.from - afterLead) + body.slice(k.to - afterLead);
  } else if (wrapAt >= 0) {
    const at0 = text.lastIndexOf('<div', wrapAt); const tg = text.slice(at0, text.indexOf('>', at0) + 1); wrapId = (tg.match(/id="([^"]+)"/) || [])[1];
  } else if (spec.wrap) {
    wrapId = spec.wrap.panel; body = `<div class="tab-panel active" id="${wrapId}" data-gen-wrap="1">${body}</div>`;
  }
  // 3. build tabs, panels
  const tabs = spec.tabs.map(t => ({ label: t.label, panel: t.existing || (t.id === 'wrap' ? wrapId : spec.id + '-tab-' + t.id), spec: t }));
  const gen = spec.tabs.filter(t => !t.existing && t.id !== 'wrap').map((t, i) => tabPanel(spec.id + '-tab-' + t.id, t.blocks.join('\n'), false)).join('\n');
  let page = head + insertKpis + tabsBar(tabs, spec.id) + body + gen + tail;
  // normalise which panel is active
  tabs.forEach((t, i) => { page = setPanelActive(page, t.panel, i === 0); });
  return page;
}

// ---------- new page
function newPage(spec) {
  const acts = (spec.actions || []).map(([l, c, js, i]) => `<button type="button" class="btn ${c || 'btn-secondary'} btn-sm" onclick="${js || "showToast('" + esc(l).replace(/'/g, '') + " recorded in the prototype','check-circle')"}">${i ? lib.ic(i) : ''}${esc(l)}</button>`).join('');
  const tabs = spec.tabs.map(t => ({ label: t.label, panel: spec.id + '-tab-' + t.id }));
  return `<div class="page" id="page-${spec.id}">
        <div class="page-header"><div><div class="page-title">${esc(spec.title)}</div><div class="page-sub">${esc(spec.sub)}</div></div><div class="page-actions">${acts}</div></div>
        ${spec.kpis || ''}
        ${tabsBar(tabs, spec.id)}
        ${spec.tabs.map((t, i) => tabPanel(spec.id + '-tab-' + t.id, t.blocks.join('\n'), i === 0)).join('\n')}
      </div>
      `;
}

// ---------- apply
function pageFile(id) { return parts.find(p => /sections\/[^/]+\/page-/.test(p) && p.endsWith('/page-' + id + '.html')); }
function applyPages(pages) {
  pages.forEach(spec => {
    const f = pageFile(spec.id); if (!f) throw new Error('no part for page ' + spec.id);
    write(f, restructure(read(f), spec));
  });
}
function applyNewPages(list) {
  list.forEach(spec => {
    const rel = `sections/${spec.ws}/page-${spec.id}.html`;
    write(rel, newPage(spec));
    if (!parts.includes(rel)) {
      // insert after the last part in the same workspace folder, else after the last page-level part
      let at = -1; parts.forEach((p, i) => { if (p.indexOf('sections/') === 0 && p.indexOf('/' + spec.ws + '/') > 0) at = i; });
      if (at < 0) parts.forEach((p, i) => { if (/sections\/[^/]+\/page-/.test(p)) at = i; });
      parts.splice(at + 1, 0, rel);
    }
  });
  fs.writeFileSync(partsFile, JSON.stringify(parts, null, 1));
}
function writeDataJs() {
  const rel = 'js/201-workspace-data.js';
  const js = `/* ---------- Workspace data: standard-list rows for the PRD workspaces (generated by tools/apply.js) ---------- */
Object.assign(VF, ${JSON.stringify(lib.DATA)});
Object.assign(VF_EXTRA, ${JSON.stringify(lib.EXTRA)});
Object.assign(DM_DS, ${JSON.stringify(lib.DS)});
`;
  write(rel, js);
  if (!parts.includes(rel)) { const at = parts.findIndex(p => read(p).indexOf('const DM_DS = {') >= 0); if (at < 0) throw new Error('DM_DS part not found'); parts.splice(at + 1, 0, rel); fs.writeFileSync(partsFile, JSON.stringify(parts, null, 1)); }
  return rel;
}
module.exports = { SRC, read, write, restructure, newPage, applyPages, applyNewPages, writeDataJs, blockEnd, children, get parts() { return parts; }, set parts(v) { parts = v; fs.writeFileSync(partsFile, JSON.stringify(parts, null, 1)); } };
