/* ---------- Block library shared with the generator (tools/lib.js) so builder pages look identical ---------- */
const FL = (function(){
// Block renderers used by the workspace specs. Every block returns its HTML and carries a JSON descriptor (.desc)
// so the same page can be exported as a schema that the dynamic form and page builder can read, create and edit.
const DATA = {};        // VF datasets registered by list()
const EXTRA = {};       // VF_EXTRA drawer rows
const DS = {};          // data map chips
const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ic = n => `<i data-lucide="${n}"></i>`;
const D = (html, desc) => Object.assign(new String(html), { desc });

// R(ref, title, type, owner, date, amount, [colour, text], stage, next, actions)
const R = (ref, title, type, owner, date, amount, status, stage, next, actions) => {
  const o = { ref, title, type, owner, date, status: status || ['grey', 'Draft'], stage: stage || '-', next: next || '' };
  if (amount) o.amount = amount;
  if (actions) o.actions = actions;
  return o;
};
const APPROVE = [['Approve', 'btn-primary'], ['Request information', 'btn-secondary'], ['Reject', 'btn-danger']];

const kpis = items => D(`<div class="kpis kpis-4" data-gen-block="kpis">${items.map(([l, v, a]) => `<div class="kpi accent-${a || 'purple'}"><div class="kpi-label">${esc(l)}</div><div class="kpi-val">${esc(v)}</div></div>`).join('')}</div>`, { type: 'kpis', items: items.map(([label, value, accent]) => ({ label, value, accent: accent || 'purple' })) });
const note = t => D(`<div class="edition-note"><div>${t}</div></div>`, { type: 'note', html: t });
const panelHtml = (title, icon, body, sub) => `<div class="panel"><h3>${icon ? ic(icon) : ''}${esc(title)}</h3>${sub ? `<p style="font-size:12.5px;color:var(--muted);margin-bottom:10px">${sub}</p>` : ''}${body}</div>`;
// panel: free HTML inside a titled panel (opaque to the builder: type html)
const panel = (title, icon, body, sub) => D(panelHtml(title, icon, body, sub), { type: 'html', title, icon: icon || null, sub: sub || null, html: body });

// list: registers rows under `key` and renders the standard list container (rule R12)
function list(key, title, rows, o) {
  o = o || {}; DATA[key] = rows; if (o.extra) EXTRA[key] = o.extra; DS[key] = o.ds || ['new', 'NEW ' + key];
  const head = o.toolbar ? `<div class="cc-toolbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${o.toolbar}</div>` : '';
  return D(panelHtml(title, o.icon, head + `<div class="table-wrap" data-vf="${key}"></div>`, o.sub), { type: 'list', collection: key, title, icon: o.icon || null, sub: o.sub || null, toolbarHtml: o.toolbar || null });
}
// listRef: shows an existing collection somewhere else (same rows, same drawer)
const listRef = (key, title, sub, icon) => D(panelHtml(title, icon, `<div class="table-wrap" data-vf="${key}"></div>`, sub), { type: 'list', collection: key, title, icon: icon || null, sub: sub || null, reuse: true });
const bars = (title, rows, o) => D(panelHtml(title, (o || {}).icon || 'bar-chart-2', rows.map(([l, p, tone, v]) => `<div class="score-row"><span class="score-label">${esc(l)}</span><div class="prog-bar"><div class="prog-fill ${tone || ''}" style="width:${p}%"></div></div><span class="score-val">${esc(v == null ? p + '%' : v)}</span></div>`).join(''), (o || {}).sub), { type: 'bars', title, icon: (o || {}).icon || 'bar-chart-2', sub: (o || {}).sub || null, rows: rows.map(([label, percent, tone, value]) => ({ label, percent, tone: tone || '', value: value == null ? null : value })) });
const cards = (title, items, o) => D(panelHtml(title, (o || {}).icon, `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px">${items.map(([t, v, s, c, b]) => `<div class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div style="font-weight:700;font-size:13px">${esc(t)}</div>${b ? `<span class="badge badge-${c || 'grey'}">${esc(b)}</span>` : ''}</div>${v ? `<div style="font-size:22px;font-weight:800;margin:6px 0">${esc(v)}</div>` : ''}<div style="font-size:12px;color:var(--muted)">${esc(s || '')}</div></div>`).join('')}</div>`, (o || {}).sub), { type: 'cards', title, icon: (o || {}).icon || null, sub: (o || {}).sub || null, items: items.map(([title2, value, text, colour, badgeText]) => ({ title: title2, value: value || '', text: text || '', colour: colour || 'grey', badge: badgeText || '' })) });
const matrix = (title, cols, rows, o) => D(panelHtml(title, (o || {}).icon || 'grid', `<div class="table-wrap"><table><thead><tr><th></th>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(([n, vals]) => `<tr><td><b>${esc(n)}</b></td>${vals.map(v => { const num = typeof v === 'number'; const cl = !num ? 'grey' : v >= 85 ? 'green' : v >= 70 ? 'blue' : v >= 55 ? 'orange' : 'red'; return `<td><span class="badge badge-${cl}">${esc(num ? v + '%' : v)}</span></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`, (o || {}).sub), { type: 'matrix', title, icon: (o || {}).icon || 'grid', sub: (o || {}).sub || null, columns: cols, rows: rows.map(([name, values]) => ({ name, values })) });
// form: fields [label, type, options|placeholder, full]. The descriptor follows the FormFlow field vocabulary.
const FF = { text: 'text', number: 'number', date: 'date', email: 'text', tel: 'text', password: 'text', 'datetime-local': 'date', select: 'select', textarea: 'textarea', check: 'toggle' };
const form = (title, fields, buttons, o) => D(panelHtml(title, (o || {}).icon, `<div class="form-grid">${fields.map(([l, t, v, full]) => `<div class="field${full ? ' full' : ''}"><label>${esc(l)}</label>${t === 'select' ? `<select>${(v || []).map(x => `<option>${esc(x)}</option>`).join('')}</select>` : t === 'textarea' ? `<textarea rows="3" placeholder="${esc(v || '')}"></textarea>` : t === 'check' ? `<label style="text-transform:none;display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox"> ${esc(v || '')}</label>` : `<input type="${t || 'text'}" placeholder="${esc(v || '')}">`}</div>`).join('')}</div><div class="page-actions" style="margin-top:12px">${(buttons || [['Save', 'btn-primary']]).map(([b, c, js]) => `<button type="button" class="btn ${c || 'btn-secondary'} btn-sm" onclick="${js || "fosFormSave(this,'" + esc(title).replace(/'/g, '') + "')"}">${esc(b)}</button>`).join('')}</div>`, (o || {}).sub), {
  type: 'form', formflow: { id: 'form_' + title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), version: 1, title, fields: fields.map(([label, t, v, full]) => ({ key: label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), label, type: FF[t || 'text'] || 'text', inputType: t || 'text', options: t === 'select' ? (v || []) : undefined, placeholder: t !== 'select' && t !== 'check' ? (v || '') : undefined, text: t === 'check' ? v : undefined, full: !!full })), submit: { action: 'form_submit', collection: 'proto_form_submissions' } },
  icon: (o || {}).icon || null, sub: (o || {}).sub || null, buttons: (buttons || [['Save', 'btn-primary']]).map(([label, style, onclick]) => ({ label, style: style || 'btn-secondary', onclick: onclick || null }))
});
const flow = (title, steps, o) => D(panelHtml(title, (o || {}).icon || 'workflow', `<div class="life-chain">${steps.map(([l, c]) => `<span class="life-step" style="background:${c || '#4f46e5'}">${esc(l)}</span>`).join('<span class="life-arrow">&rarr;</span>')}</div>`, (o || {}).sub), { type: 'flow', title, icon: (o || {}).icon || 'workflow', sub: (o || {}).sub || null, steps: steps.map(([label, colour]) => ({ label, colour: colour || '#4f46e5' })) });
const timeline = (title, items, o) => D(panelHtml(title, (o || {}).icon || 'activity', `<div class="timeline">${items.map(([t, x, m, i]) => `<div class="tl-item"><div class="tl-dot">${ic(i || 'circle')}</div><div class="tl-line"></div><div class="tl-body"><div class="tl-time">${esc(t)}</div><div class="tl-text">${esc(x)}</div>${m ? `<div class="tl-meta">${esc(m)}</div>` : ''}</div></div>`).join('')}</div>`, (o || {}).sub), { type: 'timeline', title, icon: (o || {}).icon || 'activity', sub: (o || {}).sub || null, items: items.map(([time, text, meta, icon]) => ({ time, text, meta: meta || '', icon: icon || 'circle' })) });
const kv = (title, rows, o) => D(panelHtml(title, (o || {}).icon, `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:10px">${rows.map(([l, v]) => `<div style="padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface)"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)">${esc(l)}</div><div style="font-weight:600;margin-top:3px">${v}</div></div>`).join('')}</div>`, (o || {}).sub), { type: 'kv', title, icon: (o || {}).icon || null, sub: (o || {}).sub || null, rows: rows.map(([label, value]) => ({ label, value })) });
const badge = (c, t) => `<span class="badge badge-${c}">${esc(t)}</span>`;
// two: two blocks side by side
const two = (a, b) => D(`<div class="dash-grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))">${a}${b}</div>`, { type: 'columns', blocks: [a.desc || { type: 'html' }, b.desc || { type: 'html' }] });
const tabPanel = (id, html, active) => `<div class="tab-panel${active ? ' active' : ''}" id="${id}" data-gen="1">${html}</div>`;


return { kpis, note, panel, list, listRef, bars, cards, matrix, form, flow, timeline, kv, two, tabPanel };
})();
/* ---------- Page builder: pages are JSON schemas (public/proto/schema). The builder reads, creates and edits them. ---------- */
const FOSPB = { index: null, collections: null, saved: {}, editing: null };
const FOS_BLOCKS = ['kpis', 'list', 'bars', 'cards', 'matrix', 'form', 'flow', 'timeline', 'kv', 'note', 'html', 'columns'];
const FOS_FIELD_TYPES = ['text', 'textarea', 'number', 'currency', 'date', 'time', 'select', 'radio', 'checkbox', 'toggle', 'relationship', 'repeater', 'file', 'image', 'audio', 'signature', 'location'];
const fosEsc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function fosBlockHtml(b) {
  b = b || {};
  switch (b.type) {
    case 'kpis': return FL.kpis((b.items || []).map(i => [i.label, i.value, i.accent]));
    case 'note': return FL.note(b.html || '');
    case 'list': return FL.listRef(b.collection, b.title || '', b.sub, b.icon);
    case 'bars': return FL.bars(b.title || '', (b.rows || []).map(r => [r.label, r.percent, r.tone, r.value]), { sub: b.sub, icon: b.icon });
    case 'cards': return FL.cards(b.title || '', (b.items || []).map(i => [i.title, i.value, i.text, i.colour, i.badge]), { sub: b.sub, icon: b.icon });
    case 'matrix': return FL.matrix(b.title || '', b.columns || [], (b.rows || []).map(r => [r.name, r.values || []]), { sub: b.sub, icon: b.icon });
    case 'form': {
      const f = b.formflow || { title: 'Form', fields: [] };
      const map = { toggle: 'check', checkbox: 'check', textarea: 'textarea', select: 'select', date: 'date', number: 'number', currency: 'number' };
      return FL.form(f.title || 'Form', (f.fields || []).map(x => [x.label, x.inputType || map[x.type] || 'text', x.type === 'select' ? (x.options || []) : (x.type === 'toggle' || x.type === 'checkbox' ? x.text : x.placeholder), x.full]), (b.buttons || []).map(x => [x.label, x.style, x.onclick]), { sub: b.sub, icon: b.icon });
    }
    case 'flow': return FL.flow(b.title || '', (b.steps || []).map(s => [s.label, s.colour]), { sub: b.sub, icon: b.icon });
    case 'timeline': return FL.timeline(b.title || '', (b.items || []).map(i => [i.time, i.text, i.meta, i.icon]), { sub: b.sub, icon: b.icon });
    case 'kv': return FL.kv(b.title || '', (b.rows || []).map(r => [r.label, r.value]), { sub: b.sub, icon: b.icon });
    case 'columns': return FL.two(fosBlockHtml((b.blocks || [])[0] || { type: 'note', html: '' }), fosBlockHtml((b.blocks || [])[1] || { type: 'note', html: '' }));
    case 'html': return FL.panel(b.title || '', b.icon, b.html || '', b.sub);
    default: return '<div class="edition-note"><div>Unknown block type: ' + fosEsc(b.type) + '</div></div>';
  }
}
function fosPageHtml(s) {
  const tabs = s.tabs || [];
  const acts = (s.actions || []).map(a => '<button type="button" class="btn ' + fosEsc(a.style || 'btn-secondary') + ' btn-sm" onclick="' + fosEsc(a.onclick || ("showToast('" + String(a.label).replace(/'/g, '') + " recorded in the prototype','check-circle')")) + '">' + (a.icon ? '<i data-lucide="' + fosEsc(a.icon) + '"></i>' : '') + fosEsc(a.label) + '</button>').join('');
  const bar = '<div class="tabs" data-gen-tabs="1">' + tabs.map((t, i) => '<div class="tab' + (i === 0 ? ' active' : '') + '" onclick="switchTab(this,\'' + fosEsc(t.id) + '\')">' + fosEsc(t.label) + '</div>').join('') + '</div>';
  const panels = tabs.map((t, i) => t.source === 'legacy'
    ? '<div class="tab-panel' + (i === 0 ? ' active' : '') + '" id="' + fosEsc(t.id) + '" data-legacy-slot="1" data-first="' + (i === 0 ? 1 : 0) + '"></div>'
    : '<div class="tab-panel' + (i === 0 ? ' active' : '') + '" id="' + fosEsc(t.id) + '" data-gen="1">' + (t.blocks || []).map(fosBlockHtml).join('\n') + '</div>').join('\n');
  return '<div class="page" id="page-' + fosEsc(s.id) + '"><div class="page-header"><div><div class="page-title">' + fosEsc(s.title) + '</div><div class="page-sub">' + fosEsc(s.subtitle || '') + '</div></div><div class="page-actions">' + acts + '</div></div>' + (s.kpis ? fosBlockHtml(s.kpis) : '') + bar + panels + '</div>';
}
function fosEnsureNav(s) {
  if (document.querySelector('.nav-item[data-page="' + s.id + '"]')) return;
  const body = document.getElementById('secbody-admin'); if (!body) return;
  const d = document.createElement('div'); d.className = 'nav-item'; d.setAttribute('data-page', s.id); d.setAttribute('data-gen-builder', '1'); d.setAttribute('onclick', "showPage('" + s.id + "')");
  d.innerHTML = '<i data-lucide="file-text"></i><span class="nav-label">' + fosEsc(s.title) + '</span>'; body.appendChild(d); paintIcons(d);
}
function fosMountPage(s) {
  const old = document.getElementById('page-' + s.id); const legacy = {};
  if (old) old.querySelectorAll('.tab-panel').forEach(p => { legacy[p.id] = p; });
  const wrap = document.createElement('div'); wrap.innerHTML = fosPageHtml(s); const n = wrap.firstElementChild;
  n.querySelectorAll('[data-legacy-slot]').forEach(slot => { const o = legacy[slot.id]; if (o) { o.classList.toggle('active', slot.dataset.first === '1'); slot.replaceWith(o); } else { slot.innerHTML = '<div class="edition-note"><div>Hand-written panel that is not in this page yet.</div></div>'; } });
  if (old) { n.classList.toggle('active', old.classList.contains('active')); old.replaceWith(n); } else document.getElementById('page-dashboard').parentElement.appendChild(n);
  paintIcons(n); vfRender(); fosEnsureNav(s); if (typeof ensureCrumb === 'function') ensureCrumb(s.id);
  return n;
}
async function fosLoadSavedPages() {
  try {
    const got = await fosApi('records', null, '&c=page_schemas'); const rows = got.page_schemas || [];
    rows.forEach(r => { FOSPB.saved[r.ref] = r.schema; if (r.schema) { try { fosMountPage(r.schema); } catch (e) { } } });
  } catch (e) { }
}
function fosValidatePage(s) {
  const errs = [], warns = []; const cols = ((FOSPB.collections || {}).collections || []).map(c => c.id);
  if (!s || typeof s !== 'object') return { errs: ['The page must be a JSON object.'], warns };
  if (!/^[a-z0-9-]+$/.test(s.id || '')) errs.push('id must be lower case letters, numbers and dashes.');
  if (!s.title) errs.push('title is required.');
  if (!Array.isArray(s.tabs) || !s.tabs.length) errs.push('tabs must be a list with at least one tab.');
  const seen = {};
  (s.tabs || []).forEach((t, i) => {
    const w = 'Tab ' + (i + 1) + (t && t.label ? ' (' + t.label + ')' : '');
    if (!t || !t.id || !t.label) { errs.push(w + ': id and label are required.'); return; }
    if (seen[t.id]) errs.push(w + ': duplicate tab id ' + t.id + '.'); seen[t.id] = 1;
    if (t.source === 'legacy') return;
    if (!Array.isArray(t.blocks)) { errs.push(w + ': blocks must be a list.'); return; }
    const chk = (b, p) => {
      if (!b || FOS_BLOCKS.indexOf(b.type) < 0) { errs.push(p + ': block type must be one of ' + FOS_BLOCKS.join(', ') + '.'); return; }
      if (b.type === 'list') { if (!b.collection) errs.push(p + ': list needs a collection.'); else if (cols.length && cols.indexOf(b.collection) < 0) warns.push(p + ': collection ' + b.collection + ' is new; it needs a collection schema.'); }
      if (b.type === 'form') { const f = b.formflow; if (!f || !Array.isArray(f.fields) || !f.fields.length) errs.push(p + ': form needs formflow.fields.'); else f.fields.forEach(x => { if (!x.key || !x.label) errs.push(p + ': every field needs key and label.'); else if (FOS_FIELD_TYPES.indexOf(x.type) < 0) errs.push(p + ': field ' + x.key + ' has unknown type ' + x.type + '.'); }); }
      if (b.type === 'matrix' && !(b.columns || []).length) warns.push(p + ': matrix has no columns.');
      if (b.type === 'columns') (b.blocks || []).forEach((c, j) => chk(c, p + ' column ' + (j + 1)));
    };
    t.blocks.forEach((b, j) => chk(b, w + ', block ' + (j + 1)));
  });
  return { errs, warns };
}
const FOSPB_TEMPLATE = { schemaVersion: 1, id: 'my-new-page', title: 'My new page', subtitle: 'Built in the page builder.', workspace: null, package: null, origin: 'builder', actions: [{ label: 'New record', style: 'btn-primary', icon: 'plus' }], kpis: { type: 'kpis', items: [{ label: 'Open', value: '3', accent: 'orange' }, { label: 'Done', value: '12', accent: 'green' }] }, tabs: [{ id: 'my-new-page-tab-main', label: 'Main', source: 'schema', blocks: [{ type: 'list', collection: 'my_new_page_items', title: 'Records' }, { type: 'form', formflow: { id: 'form_new_record', version: 1, title: 'New record', fields: [{ key: 'name', label: 'Name', type: 'text', placeholder: 'Record name' }, { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] }, { key: 'notes', label: 'Notes', type: 'textarea', full: true }], submit: { action: 'form_submit' } }, buttons: [{ label: 'Save', style: 'btn-primary' }] }] }] };
async function fosPagesRender() {
  const box = document.getElementById('fosPagesBody'); if (!box) return;
  try {
    if (!FOSPB.index) { FOSPB.index = await (await fetch('proto/schema/index.json')).json(); FOSPB.collections = await (await fetch('proto/schema/collections.json')).json(); }
    await fosLoadSavedPages();
  } catch (e) { box.innerHTML = '<p style="font-size:13px">The page schemas could not be loaded. Open this file from http://localhost/.</p>'; return; }
  const rows = FOSPB.index.pages.slice(); Object.keys(FOSPB.saved).forEach(id => { if (!rows.some(r => r.id === id)) rows.push({ id, title: (FOSPB.saved[id] || {}).title, workspace: null, package: null, origin: 'builder', tabs: ((FOSPB.saved[id] || {}).tabs || []).length, schemaTabs: ((FOSPB.saved[id] || {}).tabs || []).length, legacyTabs: 0 }); });
  const cols = FOSPB.collections.collections;
  box.innerHTML = '<div class="page-actions" style="margin-bottom:10px"><button type="button" class="btn btn-primary btn-sm" onclick="fosPbEdit(null)"><i data-lucide="plus"></i>New page</button></div>'
    + '<div class="table-wrap"><table><thead><tr><th>Page</th><th>Workspace</th><th>App</th><th>Origin</th><th>Tabs</th><th></th></tr></thead><tbody>' + rows.map(r => '<tr><td><b>' + fosEsc(r.title) + '</b><div style="font-size:11px;color:var(--muted)">' + fosEsc(r.id) + (FOSPB.saved[r.id] ? ' (edited in the builder)' : '') + '</div></td><td>' + fosEsc(r.workspace || '-') + '</td><td>' + fosEsc(r.package || '-') + '</td><td>' + fosEsc(r.origin) + '</td><td>' + r.schemaTabs + ' schema, ' + r.legacyTabs + ' hand-written</td><td style="white-space:nowrap"><button type="button" class="badge badge-purple" onclick="showPage(\'' + fosEsc(r.id) + '\')">Open</button> <button type="button" class="badge badge-blue" onclick="fosPbEdit(\'' + fosEsc(r.id) + '\')">Edit</button></td></tr>').join('') + '</tbody></table></div>'
    + '<div id="fosPbEditor" style="margin-top:16px"></div>'
    + '<h4 style="margin:18px 0 6px;font-size:13px">Collections the lists can use (' + cols.length + ')</h4><div class="table-wrap"><table><thead><tr><th>Collection</th><th>Data source in the port</th><th>Rows</th><th>Used by</th></tr></thead><tbody>' + cols.map(c => '<tr><td><code>' + fosEsc(c.id) + '</code></td><td>' + fosEsc(c.dataSource || '-') + '</td><td>' + c.rows + '</td><td>' + fosEsc((c.usedBy || []).join(', ') || '-') + '</td></tr>').join('') + '</tbody></table></div>';
  paintIcons(box);
}
async function fosPbEdit(id) {
  let s;
  if (id === null) s = JSON.parse(JSON.stringify(FOSPB_TEMPLATE));
  else if (FOSPB.saved[id]) s = FOSPB.saved[id];
  else { try { s = await (await fetch('proto/schema/pages/' + id + '.json')).json(); } catch (e) { showToast('That page has no schema yet', 'alert-triangle'); return; } }
  FOSPB.editing = id;
  const ed = document.getElementById('fosPbEditor');
  ed.innerHTML = '<div class="panel" style="margin:0"><h3>' + (id === null ? 'New page' : 'Edit ' + fosEsc(s.title)) + '</h3><p style="font-size:12.5px;color:var(--muted);margin-bottom:8px">This is the page as data. Change blocks, tabs and fields, then validate, preview and save. Hand-written tabs (source "legacy") are kept as they are.</p>'
    + '<textarea id="fosPbJson" spellcheck="false" style="width:100%;min-height:340px;font-family:ui-monospace,Consolas,monospace;font-size:12px;padding:10px;border:1.5px solid var(--border);border-radius:8px;background:var(--surface-2);color:var(--text)"></textarea>'
    + '<div class="page-actions" style="margin-top:10px"><button type="button" class="btn btn-secondary btn-sm" onclick="fosPbCheck()">Validate</button><button type="button" class="btn btn-secondary btn-sm" onclick="fosPbPreview()">Preview</button><button type="button" class="btn btn-primary btn-sm" onclick="fosPbSave()">Save to database</button>' + (FOSPB.saved[id] ? '<button type="button" class="btn btn-secondary btn-sm" onclick="fosPbReset()">Reset to original</button>' : '') + '</div>'
    + '<div id="fosPbMsg" style="margin-top:10px;font-size:12.5px"></div><div id="fosPbPreview" style="margin-top:12px"></div></div>';
  document.getElementById('fosPbJson').value = JSON.stringify(s, null, 2);
  ed.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function fosPbRead() {
  const msg = document.getElementById('fosPbMsg');
  try { return JSON.parse(document.getElementById('fosPbJson').value); } catch (e) { msg.innerHTML = '<span style="color:var(--danger)">Not valid JSON: ' + fosEsc(e.message) + '</span>'; return null; }
}
function fosPbCheck() {
  const s = fosPbRead(); if (!s) return null; const r = fosValidatePage(s); const msg = document.getElementById('fosPbMsg');
  msg.innerHTML = (r.errs.length ? '<div style="color:var(--danger);font-weight:700">' + r.errs.length + ' problem(s)</div><ul>' + r.errs.map(x => '<li>' + fosEsc(x) + '</li>').join('') + '</ul>' : '<div style="color:var(--success);font-weight:700">The page is valid.</div>') + (r.warns.length ? '<ul style="color:var(--muted)">' + r.warns.map(x => '<li>' + fosEsc(x) + '</li>').join('') + '</ul>' : '');
  return r.errs.length ? null : s;
}
function fosPbPreview() {
  const s = fosPbCheck(); if (!s) return; const pv = JSON.parse(JSON.stringify(s)); pv.id = 'pv-' + s.id; (pv.tabs || []).forEach(t => { t.id = 'pv-' + t.id; if (t.source === 'legacy') { t.source = 'schema'; t.blocks = [{ type: 'note', html: 'Hand-written panel kept from the live page.' }]; } });
  const box = document.getElementById('fosPbPreview'); box.innerHTML = '<div class="page active" style="display:block;border:1px dashed var(--border);border-radius:12px;padding:14px"><div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:8px">PREVIEW</div></div>';
  const wrap = document.createElement('div'); wrap.innerHTML = fosPageHtml(pv); const n = wrap.firstElementChild; n.classList.add('active'); n.style.display = 'block'; box.firstElementChild.appendChild(n); paintIcons(box); vfRender();
}
async function fosPbSave() {
  const s = fosPbCheck(); if (!s) return;
  try {
    await fosApi('record_save', { c: 'page_schemas', row: { ref: s.id, title: s.title, schema: s } });
    FOSPB.saved[s.id] = s; fosMountPage(s); showToast('Page ' + s.title + ' saved. It is live in the menu and in the database.', 'check-circle'); fosPagesRender();
  } catch (e) { showToast(e.message || 'Could not save', 'alert-triangle'); }
}
async function fosPbReset() {
  const s = fosPbRead(); const id = s ? s.id : FOSPB.editing; if (!id) return;
  try { await fosApi('record_delete', { c: 'page_schemas', ref: id }); delete FOSPB.saved[id]; showToast('Original restored after the next reload', 'check-circle'); fosPagesRender(); } catch (e) { showToast(e.message || 'Could not reset', 'alert-triangle'); }
}
setTimeout(fosLoadSavedPages, 600);
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#page-builder > .tabs')) setTimeout(() => { const p = document.getElementById('builder-tab-pages'); if (p && p.classList.contains('active')) fosPagesRender(); }, 80); });
