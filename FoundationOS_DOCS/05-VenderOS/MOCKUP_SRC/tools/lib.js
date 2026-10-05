// Block renderers used by the workspace specs. Every block returns an HTML string that uses only classes the mockup already has.
const DATA = {};        // VF datasets registered by list()
const EXTRA = {};       // VF_EXTRA drawer rows
const DS = {};          // data map chips
const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ic = n => `<i data-lucide="${n}"></i>`;

// R(ref, title, type, owner, date, amount, [colour, text], stage, next, actions)
const R = (ref, title, type, owner, date, amount, status, stage, next, actions) => {
  const o = { ref, title, type, owner, date, status: status || ['grey', 'Draft'], stage: stage || '-', next: next || '' };
  if (amount) o.amount = amount;
  if (actions) o.actions = actions;
  return o;
};
const APPROVE = [['Approve', 'btn-primary'], ['Request information', 'btn-secondary'], ['Reject', 'btn-danger']];

const kpis = items => `<div class="kpis kpis-4" data-gen-block="kpis">${items.map(([l, v, a]) => `<div class="kpi accent-${a || 'purple'}"><div class="kpi-label">${esc(l)}</div><div class="kpi-val">${esc(v)}</div></div>`).join('')}</div>`;
const note = t => `<div class="edition-note"><div>${t}</div></div>`;
const panel = (title, icon, body, sub) => `<div class="panel"><h3>${icon ? ic(icon) : ''}${esc(title)}</h3>${sub ? `<p style="font-size:12.5px;color:var(--muted);margin-bottom:10px">${sub}</p>` : ''}${body}</div>`;

// list: registers rows under `key` and renders the standard list container (rule R12)
function list(key, title, rows, o) {
  o = o || {}; DATA[key] = rows; if (o.extra) EXTRA[key] = o.extra; DS[key] = o.ds || ['new', 'NEW ' + key];
  const head = o.toolbar ? `<div class="cc-toolbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${o.toolbar}</div>` : '';
  return panel(title, o.icon, head + `<div class="table-wrap" data-vf="${key}"></div>`, o.sub);
}
// bars: horizontal progress rows
const bars = (title, rows, o) => panel(title, (o || {}).icon || 'bar-chart-2', rows.map(([l, p, tone, v]) => `<div class="score-row"><span class="score-label">${esc(l)}</span><div class="prog-bar"><div class="prog-fill ${tone || ''}" style="width:${p}%"></div></div><span class="score-val">${esc(v == null ? p + '%' : v)}</span></div>`).join(''), (o || {}).sub);
// cards: small summary tiles
const cards = (title, items, o) => panel(title, (o || {}).icon, `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px">${items.map(([t, v, s, c, b]) => `<div class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div style="font-weight:700;font-size:13px">${esc(t)}</div>${b ? `<span class="badge badge-${c || 'grey'}">${esc(b)}</span>` : ''}</div>${v ? `<div style="font-size:22px;font-weight:800;margin:6px 0">${esc(v)}</div>` : ''}<div style="font-size:12px;color:var(--muted)">${esc(s || '')}</div></div>`).join('')}</div>`, (o || {}).sub);
// matrix: heat table, cells are numbers 0-100 or text
const matrix = (title, cols, rows, o) => panel(title, (o || {}).icon || 'grid', `<div class="table-wrap"><table><thead><tr><th></th>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(([n, vals]) => `<tr><td><b>${esc(n)}</b></td>${vals.map(v => { const num = typeof v === 'number'; const cl = !num ? 'grey' : v >= 85 ? 'green' : v >= 70 ? 'blue' : v >= 55 ? 'orange' : 'red'; return `<td><span class="badge badge-${cl}">${esc(num ? v + '%' : v)}</span></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`, (o || {}).sub);
// form: fields [label, type, options|placeholder, full]
const form = (title, fields, buttons, o) => panel(title, (o || {}).icon, `<div class="form-grid">${fields.map(([l, t, v, full]) => `<div class="field${full ? ' full' : ''}"><label>${esc(l)}</label>${t === 'select' ? `<select>${(v || []).map(x => `<option>${esc(x)}</option>`).join('')}</select>` : t === 'textarea' ? `<textarea rows="3" placeholder="${esc(v || '')}"></textarea>` : t === 'check' ? `<label style="text-transform:none;display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox"> ${esc(v || '')}</label>` : `<input type="${t || 'text'}" placeholder="${esc(v || '')}">`}</div>`).join('')}</div><div class="page-actions" style="margin-top:12px">${(buttons || [['Save', 'btn-primary']]).map(([b, c, js]) => `<button type="button" class="btn ${c || 'btn-secondary'} btn-sm" onclick="${js || "showToast('" + esc(b).replace(/'/g, '') + " recorded in the prototype','check-circle')"}">${esc(b)}</button>`).join('')}</div>`, (o || {}).sub);
// flow: coloured step chain
const flow = (title, steps, o) => panel(title, (o || {}).icon || 'workflow', `<div class="life-chain">${steps.map(([l, c]) => `<span class="life-step" style="background:${c || '#4f46e5'}">${esc(l)}</span>`).join('<span class="life-arrow">&rarr;</span>')}</div>`, (o || {}).sub);
// timeline: [time, text, meta, icon]
const timeline = (title, items, o) => panel(title, (o || {}).icon || 'activity', `<div class="timeline">${items.map(([t, x, m, i]) => `<div class="tl-item"><div class="tl-dot">${ic(i || 'circle')}</div><div class="tl-line"></div><div class="tl-body"><div class="tl-time">${esc(t)}</div><div class="tl-text">${esc(x)}</div>${m ? `<div class="tl-meta">${esc(m)}</div>` : ''}</div></div>`).join('')}</div>`, (o || {}).sub);
// kv: label / value grid (read-only profile blocks)
const kv = (title, rows, o) => panel(title, (o || {}).icon, `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:10px">${rows.map(([l, v]) => `<div style="padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface)"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)">${esc(l)}</div><div style="font-weight:600;margin-top:3px">${v}</div></div>`).join('')}</div>`, (o || {}).sub);
const badge = (c, t) => `<span class="badge badge-${c}">${esc(t)}</span>`;
const two = (a, b) => `<div class="dash-grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))">${a}${b}</div>`;
const tabPanel = (id, html, active) => `<div class="tab-panel${active ? ' active' : ''}" id="${id}" data-gen="1">${html}</div>`;

module.exports = { DATA, EXTRA, DS, R, APPROVE, kpis, note, panel, list, bars, cards, matrix, form, flow, timeline, kv, badge, two, tabPanel, esc, ic };
