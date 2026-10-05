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

module.exports = { DATA, EXTRA, DS, R, APPROVE, kpis, note, panel, list, listRef, bars, cards, matrix, form, flow, timeline, kv, badge, two, tabPanel, esc, ic };
