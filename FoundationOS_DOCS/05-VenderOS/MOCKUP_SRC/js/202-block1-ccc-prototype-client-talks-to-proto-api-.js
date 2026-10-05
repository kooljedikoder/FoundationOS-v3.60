/* ---------- CCC prototype client: talks to proto/api.php (SQLite copy of the shared tables) ---------- */
(function () {
  const PROTO = 'proto/api.php';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const snake = s => s.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
  const camel = t => t.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean).map((w, i) => i ? w[0].toUpperCase() + w.slice(1) : w[0].toLowerCase() + w.slice(1)).join('');
  async function api(r, body, qs) {
    const o = body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
    let res; try { res = await fetch(PROTO + '?r=' + r + (qs || ''), o); } catch (e) { throw new Error('Prototype API is not reachable. Open this page from http://localhost/.'); }
    const j = await res.json().catch(() => ({ error: 'Bad response from the prototype API' }));
    if (!res.ok) { throw Object.assign(new Error(j.error || 'Request failed'), { data: j }); }
    return j;
  }
  const toast = (m, ic) => { if (typeof showToast === 'function') showToast(m, ic || 'info'); };
  const fail = e => toast(e.message || 'Something went wrong', 'alert-triangle');
  const relabel = () => { try { if (typeof cccLabelRender === 'function') cccLabelRender(cccLabelRead()); } catch (e) { } };
  const badge = (c, t) => `<span class="badge badge-${c}">${esc(t)}</span>`;
  const stBadge = s => badge({ active: 'green', pending: 'orange', inactive: 'grey' }[String(s || '').toLowerCase()] || 'grey', (s || 'unknown').toString().replace(/^./, c => c.toUpperCase()));
  const typeBadge = t => badge({ vendor: 'orange', staff: 'blue', employee: 'blue', customer: 'green', partner: 'purple', individual: 'grey', other: 'grey' }[t] || 'grey', t === 'staff' ? 'Employee' : (t || 'Unspecified').replace(/^./, ch => ch.toUpperCase()));
  const initials = n => (n || '?').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const jarr = v => { try { const a = JSON.parse(v); return Array.isArray(a) ? a : [v]; } catch (e) { return v ? String(v).split(',') : []; } };
  let META = null; const meta = async () => META || (META = await api('meta'));
  window.cccApi = api;

  /* ================= contact form ================= */
  const CF = { id: 0, reps: {}, hydrated: false };
  const REPKEY = { 'Affiliations': 'affiliations', 'Assets': 'assets' };
  async function loadContactsOptions() { const r = await api('contacts', undefined, '&per=100'); return r.rows.map(x => ({ v: x.id, t: x.name })); }
  async function hydrate() {
    if (CF.hydrated) return; CF.hydrated = true;
    try {
      const m = await meta();
      const fill = (k, list, ph) => $$(`#cf13 select[data-k="${k}"]`).forEach(sel => { sel.innerHTML = `<option value="">${ph || 'Select...'}</option>` + list.map(o => `<option value="${esc(o.v)}">${esc(o.t)}</option>`).join(''); });
      fill('industryId', m.industries.map(x => ({ v: x.id, t: x.name })));
      fill('departmentId', m.departments.map(x => ({ v: x.id, t: x.name })));
      fill('titleId', m.titles.map(x => ({ v: x.id, t: x.name })));
      fill('currencyId', m.currencies.map(x => ({ v: x.id, t: x.name })));
      const ng = m.countries.find(c => c.name === 'Nigeria'); CF.countryId = ng ? ng.id : null;
      if (ng) { const st = await api('states', undefined, '&country_id=' + ng.id); fill('stateId', st.map(x => ({ v: x.id, t: x.name })), 'Select state'); }
      const cs = await loadContactsOptions(); ['parentCompanyId', 'reportsToId', 'managedById'].forEach(k => fill(k, cs, 'None'));
    } catch (e) { CF.hydrated = false; fail(e); }
  }
  function collect(scope) {
    const out = {};
    $$('[data-k]', scope).forEach(el => {
      if (el.closest('.cc-rep') || el.classList.contains('cc-type')) return;
      const ct = el.closest('.cf-t'); if (ct && !ct.classList.contains('cf-t-' + currentType())) return;
      if (el.closest('.cc-rule-off')) return;
      const k = el.dataset.k; let v;
      if (el.type === 'checkbox') v = el.checked ? 1 : 0;
      else if (el.tagName === 'SELECT' && el.multiple) v = [...el.selectedOptions].map(o => o.value);
      else if (el.tagName === 'SELECT') { v = el.value; if (el.selectedOptions[0] && el.selectedOptions[0].value === el.selectedOptions[0].text && /^(None|Select\.\.\.|Select|Select state|\+ Add new\.\.\.)$/.test(el.value)) v = ''; }
      else v = (el.value || '').trim();
      if (v === '' || (Array.isArray(v) && !v.length)) return;
      if (k.indexOf('social.') === 0) { (out.socialLinks = out.socialLinks || {})[k.slice(7)] = v; return; }
      out[k] = v;
    });
    if (out.status) out.status = String(out.status).toLowerCase();
    if (CF.countryId && !out.countryId) out.countryId = CF.countryId;
    Object.keys(CF.reps).forEach(n => { if (CF.reps[n].length) out[REPKEY[n] || camel(n)] = CF.reps[n]; });
    return out;
  }
  function currentType() { const b = $('#cf13 .cc-type.on'); return b ? b.dataset.ctype : 'vendor'; }
  function repRender(rep) {
    const n = rep.dataset.rep; const box = $('.cc-reps', rep); const rows = CF.reps[n] || [];
    box.innerHTML = rows.map((r, i) => `<div class="cc-repchip"><span>${esc(Object.values(r).filter(Boolean).slice(0, 3).join(' · '))}</span><button type="button" aria-label="Remove row" onclick="cccRepDel(this,${i})">&times;</button></div>`).join('');
  }
  window.cccRepAdd = function (btn) {
    const rep = btn.closest('.cc-rep'); const n = rep.dataset.rep; const row = {};
    $$('[data-k]', rep).forEach(el => { const v = el.type === 'checkbox' ? (el.checked ? 1 : 0) : (el.value || '').trim(); if (v !== '' && v !== 0 && v !== 'Select...') row[el.dataset.k] = v; });
    if (!Object.keys(row).length) { toast('Fill at least one field first', 'alert-triangle'); return; }
    (CF.reps[n] = CF.reps[n] || []).push(row); repRender(rep);
    $$('[data-k]', rep).forEach(el => { if (el.type === 'checkbox') el.checked = false; else if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = ''; });
  };
  window.cccRepDel = function (btn, i) { const rep = btn.closest('.cc-rep'); CF.reps[rep.dataset.rep].splice(i, 1); repRender(rep); };
  window.cccSave = async function (finish) {
    const data = collect($('#cf13')); const type = currentType();
    if (!CF.id && !data.companyName && !data.firstName) { toast('Enter the company name first (step 2)', 'alert-triangle'); cccStep(1); return false; }
    const steps = $$('#cf13 .cc-step'); const step = steps.findIndex(x => x.classList.contains('on'));
    try {
      const r = await api('contact_save', { id: CF.id, type, step, data });
      CF.id = r.id; $('#cfHead').textContent = (data.companyName || [data.firstName, data.surname].filter(Boolean).join(' ') || 'Contact') + ' (#' + r.id + ')';
      toast(finish ? 'Contact saved' : 'Saved. You can keep editing.', 'check-circle'); return true;
    } catch (e) { fail(e); if (e.data && e.data.field) cccStep(1); return false; }
  };

  /* ---- type switching: show the field set and the steps for the chosen type ---- */
  function applyType(t) {
    const root = $('#cf13'); root.dataset.type = t;
    $$('#cf13 .cc-type').forEach(b => b.classList.toggle('on', b.dataset.ctype === t));
    let n = 0;
    $$('#cf13 .cc-spill').forEach((p, i) => {
      const vis = (p.dataset.vis || '').split(',').includes(t) && !stepOff(i, t);
      p.classList.toggle('cc-hide', !vis);
      const st = $('#cf13-' + i); if (st) st.classList.toggle('cc-hide', !vis);
      if (vis) { n++; p.textContent = n + '. ' + (p.getAttribute('data-ti-' + t) || p.textContent.replace(/^d+.s*/, '')); }
    });
    const cur = $$('#cf13 .cc-step').findIndex(x => x.classList.contains('on'));
    const curStep = $('#cf13-' + cur);
    if (curStep && curStep.classList.contains('cc-hide')) cccStep(0);
  }

  /* ================= Field and Tab Rules drive the form ================= */
  let RULES = null;
  const rkey = t => (t === 'employee' ? 'staff' : t);
  const STEPRULE = { 1: ['basic'], 2: ['location'], 3: ['work'], 5: ['contact'], 7: ['affiliations'], 8: ['financials'], 9: ['certifications'], 10: ['assets'], 11: ['documents'], 12: ['review'] };
  function stepOff(i, t) {
    if (!RULES) return false;
    let keys = STEPRULE[i] || [];
    if (i === 5 && (t === 'employee' || t === 'individual')) keys = ['family'];
    return keys.some(k => RULES.step[k] && !RULES.step[k].includes(rkey(t)));
  }
  const camelKey = k => k.replace(/_([a-z])/g, (m, ch) => ch.toUpperCase());
  async function applyRules() {
    try {
      if (!RULES) {
        const rows = await api('rules'); RULES = { step: {}, field: {} };
        rows.forEach(r => {
          const types = JSON.parse(r.contact_types || '[]');
          if (r.group === 'step') { RULES.step[r.field_key] = types; return; }
          if (r.group === 'document_required') return;
          if (r.field_key === 'contract') { RULES.field.contractStart = types; RULES.field.contractEnd = types; return; }
          if (r.field_key === 'reviewConfirm') { RULES.field.__declaration = types; return; }
          if (r.field_key === 'customFieldValues') { RULES.field.__custom = types; return; }
          RULES.field[camelKey(r.field_key)] = types;
        });
      }
      const t = currentType(); const k = rkey(t);
      $$('#cf13 .cc-rule-off').forEach(x => x.classList.remove('cc-rule-off'));
      $$('#cf13 .cf-t-' + t + ' [data-k]').forEach(el => {
        const key = el.dataset.k; const allowed = RULES.field[key];
        if (allowed && !allowed.includes(k)) { const w = el.closest('.cc-ff'); if (w) w.classList.add('cc-rule-off'); }
      });
      const off = key => RULES.field[key] && !RULES.field[key].includes(k);
      $$('#cf13 .cf-t-' + t + ' .cc-box').forEach(b => { const h = b.querySelector('.cc-box-h'); const tx = h ? h.textContent : ''; if ((/Custom fields/.test(tx) && off('__custom')) || (/Declaration/.test(tx) && off('__declaration'))) b.classList.add('cc-rule-off'); });
      applyType(t);
    } catch (e) { /* rules are optional: show everything if they cannot be read */ }
  }
  window.cccApplyRules = applyRules;
  const _applyType = applyType;
  window.cccType = function (el) {
    applyType(el.dataset.ctype); applyRules();
    $('#cfTypeNote').textContent = 'Fields on the Work step and elsewhere adapt to the type selected here. Showing the ' + el.textContent.trim() + ' field set.';
  };
  window.cccStep = function (i, delta) {
    const steps = $$('#cf13 .cc-step'); const vis = steps.map((x, k) => k).filter(k => !steps[k].classList.contains('cc-hide'));
    const cur = steps.findIndex(x => x.classList.contains('on'));
    if (delta) { const pos = Math.max(0, vis.indexOf(cur)); i = vis[Math.max(0, Math.min(vis.length - 1, pos + delta))]; }
    steps.forEach((x, k) => x.classList.toggle('on', k === i));
    $$('#cf13 .cc-spill').forEach((x, k) => { x.classList.toggle('on', k === i); if (k === i && x.scrollIntoView) x.scrollIntoView({ block: 'nearest', inline: 'center' }); });
  };
  window.cccNext = async function () {
    const steps = $$('#cf13 .cc-step'); const vis = steps.map((x, k) => k).filter(k => !steps[k].classList.contains('cc-hide'));
    const cur = steps.findIndex(x => x.classList.contains('on'));
    if (cur === vis[vis.length - 1]) { if (await cccSave(true)) { cccDirLoad(); } return; }
    if (CF.id || collect($('#cf13')).companyName || collect($('#cf13')).firstName) { await cccSave(false); }
    cccStep(-1, 1);
  };
  window.cccNew = function () {
    CF.id = 0; CF.reps = {};
    $$('#cf13 [data-k]').forEach(el => { if (el.closest('.cc-type')) return; if (el.type === 'checkbox') el.checked = false; else if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = ''; });
    $$('#cf13 .cc-rep').forEach(repRender); $('#cfHead').textContent = 'New Contact'; cccStep(0);
    const t = $('#cf13 .cc-type[data-ctype="vendor"]'); if (t) cccType(t);
    subNav('ccc', { tab: 'cc-form' }); hydrate();
  };
  const REV = { companyName: 'name', idNumber: 'id_number', stateId: 'state_id', countryId: 'country_id', taxId: 'tax_id', email: 'email', phone: 'phone', website: 'website', street1: 'street1', street2: 'street2', zip: 'zip', city: 'city', jobTitle: 'job_title', comment: 'comment', industryId: 'industry_id', titleId: 'title_id' };
  window.cccEdit = async function (id) {
    subNav('ccc', { tab: 'cc-form' }); await hydrate();
    try {
      const c = await api('contact', undefined, '&id=' + id); const p = c.partner, f = c.profile || {};
      CF.id = id; CF.reps = {};
      $$('#cf13 [data-k]').forEach(el => {
        if (el.closest('.cc-type') || el.closest('.cc-rep')) return;
        const k = el.dataset.k; const col = REV[k] || snake(k); let v = f[col]; if (v == null || v === '') v = p[col];
        if (el.type === 'checkbox') el.checked = !!+v;
        else if (el.tagName === 'SELECT' && el.multiple) { const a = jarr(v); [...el.options].forEach(o => o.selected = a.includes(o.value)); }
        else if (el.tagName === 'SELECT') { const want = String(v == null ? '' : v); const o = [...el.options].find(x => x.value === want || x.text.toLowerCase() === want.toLowerCase()); el.value = o ? o.value : el.options[0].value; }
        else el.value = v == null ? '' : v;
      });
      const t = $('#cf13 .cc-type[data-ctype="' + (f.primary_type === 'staff' ? 'employee' : (f.primary_type || 'vendor')) + '"]'); if (t) cccType(t);
      c.affiliations.forEach(a => (CF.reps['Affiliations'] = CF.reps['Affiliations'] || []).push({ affiliationRelationshipType: a.relationship_type, affiliationRole: a.role }));
      c.assets.forEach(a => (CF.reps['Assets'] = CF.reps['Assets'] || []).push({ assetTag: a.asset_tag, assetType: a.asset_type }));
      $$('#cf13 .cc-rep').forEach(repRender);
      $('#cfHead').textContent = p.name + ' (#' + id + ')'; cccStep(1);
    } catch (e) { fail(e); }
  };
  document.addEventListener('click', e => { if (e.target.closest('#cf13 .cc-spill, #cf13 .cc-subtab')) hydrate(); }, true);

  /* ================= directory ================= */
  const DIR = { type: '', q: '', status: '', page: 1 };
  window.cccDirLoad = async function () {
    const box = $('#ccDirBody'); if (!box) return;
    box.innerHTML = '<p class="cc-p">Loading...</p>';
    try {
      const qs = '&page=' + DIR.page + (DIR.type ? '&type=' + DIR.type : '') + (DIR.status ? '&status=' + DIR.status : '') + (DIR.q ? '&q=' + encodeURIComponent(DIR.q) : '');
      const r = await api('contacts', undefined, qs);
      const cnt = r.counts || {}; const all = Object.values(cnt).reduce((a, b) => a + b, 0);
      $('#ccDirPills').innerHTML = [['', 'All', all], ['individual', 'Individuals', cnt.individual], ['employee', 'Employees', cnt.staff], ['customer', 'Customers', cnt.customer], ['partner', 'Partners', cnt.partner], ['vendor', 'Vendors', cnt.vendor], ['other', 'Other', cnt.other]]
        .map(([k, l, n]) => `<button type="button" class="cc-pill${DIR.type === k ? ' on' : ''}" data-t="${k}">${l} <b>${n || 0}</b></button>`).join('');
      $$('#ccDirPills .cc-pill').forEach(b => b.onclick = () => { DIR.type = b.dataset.t; DIR.page = 1; cccDirLoad(); });
      box.innerHTML = `<div id="ccBulk" class="cc-bulk" hidden></div><div class="table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all" onchange="cccBulkAll(this)"></th><th>Name</th><th>Type</th><th>Designation</th><th>Location</th><th>Contact</th><th>Status</th><th></th></tr></thead><tbody>${r.rows.map(x => `<tr>
        <td><input type="checkbox" class="ccsel" data-id="${x.id}" aria-label="Select ${esc(x.name)}" onchange="cccBulkUpdate()"></td>
        <td><a href="#" onclick="cccOpen(${x.id});return false" style="font-weight:700">${esc(x.name)}</a></td><td>${typeBadge(x.primary_type)}</td><td>${esc(x.designation || x.job_title || '-')}</td>
        <td>${esc([x.city, x.country].filter(Boolean).join(', ') || '-')}</td><td>${esc(x.phone || '-')}<div class="cc-key">${esc(x.email || '')}</div></td>
        <td>${stBadge(x.status)}</td>
        <td><details class="cc-menu"><summary aria-label="Row actions">&#8942;</summary><div><a href="#" onclick="cccOpen(${x.id});return false">View</a><a href="#" onclick="cccEdit(${x.id});return false">Edit</a><a href="#" class="cc-add" style="--cc-d:block" onclick="cccToggleContact(${x.id},'${x.status === 'inactive' ? 'active' : 'inactive'}');return false">${x.status === 'inactive' ? 'Activate' : 'Deactivate'} <span class="cc-tag add">ADD</span></a></div></details></td></tr>`).join('') || '<tr><td colspan="8">No contacts found.</td></tr>'}</tbody></table></div>
        <div class="cc-pager"><span>${r.total} contacts</span><span><button type="button" class="badge badge-grey" ${r.page <= 1 ? 'disabled' : ''} onclick="cccDirPage(-1)">Previous</button> Page ${r.page} <button type="button" class="badge badge-grey" ${r.page * r.per >= r.total ? 'disabled' : ''} onclick="cccDirPage(1)">Next</button></span></div>`;
      relabel();
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccDirPage = d => { DIR.page = Math.max(1, DIR.page + d); cccDirLoad(); };
  window.cccDirSearch = v => { DIR.q = v; DIR.page = 1; clearTimeout(window._ccq); window._ccq = setTimeout(cccDirLoad, 250); };
  window.cccDirStatus = v => { DIR.status = v; DIR.page = 1; cccDirLoad(); };
  window.cccToggleContact = async function (id, to) {
    if (to === 'inactive' && !confirm('Set this contact to Inactive and deactivate every linked login?')) return;
    try { const r = await api('contact_status', { id, status: to, cascade_users: true }); toast((to === 'inactive' ? 'Deactivated' : 'Activated') + (r.users_changed ? '. ' + r.users_changed + ' linked login(s) changed.' : '.'), 'check-circle'); cccDirLoad(); if (PROF.id === id) cccProfLoad(id); } catch (e) { fail(e); }
  };

  /* ================= profile ================= */
  const PROF = { id: 0 };
  window.cccOpen = function (id) { PROF.id = id; subNav('ccc', { tab: 'cc-prof' }); cccProfLoad(id); };
  const dl = rows => `<div class="cc-dl">${rows.map(([l, v]) => `<div class="cc-f"><div class="cc-fl">${esc(l)}</div><div class="cc-fv">${v == null || v === '' ? '-' : v}</div></div>`).join('')}</div>`;
  window.cccProfLoad = async function (id) {
    const box = $('#ccProfBody'); box.innerHTML = '<p class="cc-p">Loading...</p>';
    try {
      const c = await api('contact', undefined, '&id=' + id); const p = c.partner, f = c.profile || {}; PROF.id = id;
      const ex = c.extra || {};
      const tabs = [['overview', 'Overview'], ['work', 'Work'], ['aff', 'Affiliations'], ['family', 'Family'], ['assets', 'Assets'], ['docs', 'Documents'], ['access', 'Access'], ['custom', 'Custom Fields'], ['fin', 'Financial']];
      const addTabs = [['cap', 'Capabilities'], ['comp', 'Compliance'], ['dir', 'Directors and signatories']];
      const exRows = keys => keys.filter(k => ex[k]).map(k => `<div class="cc-box" style="margin-bottom:8px"><div class="cc-box-h">${esc(k)}</div>${(Array.isArray(ex[k]) ? ex[k] : [ex[k]]).map(r => `<div class="cc-p">${esc(typeof r === 'object' ? Object.values(r).join(' · ') : r)}</div>`).join('')}</div>`).join('') || '<p class="cc-p">Nothing saved yet. Fill the matching steps in the Contact form.</p>';
      const docsRows = c.documents.map(d => { const cp = JSON.parse(d.custom_properties || '{}'); const s = cp.review_status || 'pending'; return `<tr><td>${esc(cp.doc_type || d.name)}</td><td><a href="${PROTO}?r=document_file&id=${d.id}" target="_blank" rel="noopener">${esc(d.file_name)}</a></td><td>${badge({ approved: 'green', pending: 'orange', rejected: 'red', expired: 'grey' }[s] || 'grey', s)}</td><td>${esc((d.created_at || '').slice(0, 10))}</td><td><button type="button" class="badge badge-green" onclick="cccDocReview(${d.id},'approved')">Approve</button> <button type="button" class="badge badge-red" onclick="cccDocReview(${d.id},'rejected')">Reject</button></td></tr>`; }).join('');
      const m = await meta();
      const reqOpts = m.required_documents.filter(x => +x.is_active).map(x => `<option>${esc(x.label)}</option>`).join('');
      const panes = {
        overview: `<div class="cc-pills" style="margin-bottom:10px">${(c.tags || []).map(t => `<button type="button" class="cc-pill${+t.assigned ? ' on' : ''}" onclick="cccTag(${id},${t.id})">${esc(t.name)}</button>`).join('')}</div><div class="cc-two"><div class="cc-box" style="text-align:center"><div class="cc-av" style="width:72px;height:72px;margin:0 auto 8px;font-size:22px">${esc(initials(p.name))}</div><div style="font-weight:800">${esc(p.name)}</div><div style="margin:8px 0">${typeBadge(f.primary_type)}</div><div class="cc-key">${esc(p.email || '')} ${esc(p.phone || '')}</div></div>${dl([['Company', f.trading_name || p.name], ['Status', stBadge(f.status)], ['Phone', esc(p.phone)], ['Email', esc(p.email)], ['Location', esc([p.city, p.street1].filter(Boolean).join(', '))], ['Registration Source', esc(f.registration_source)]])}</div>`,
        work: dl([['Employee ID', esc(f.employee_id)], ['Employment Type', esc(f.employment_type)], ['Position', esc(f.designation)], ['Vendor Category', esc(jarr(f.vendor_category).join(', '))], ['Partner Category', esc(f.partner_category)], ['Payment Terms', esc(f.payment_terms)], ['Start Date', esc(f.start_date)], ['Contract Start', esc(f.contract_start)], ['Contract End', esc(f.contract_end)]]),
        aff: c.affiliations.length ? `<div class="table-wrap"><table><thead><tr><th>Type</th><th>Role</th><th>Status</th></tr></thead><tbody>${c.affiliations.map(a => `<tr><td>${esc(a.relationship_type)}</td><td>${esc(a.role)}</td><td>${esc(a.status)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="cc-p">No affiliations added yet.</p>',
        family: '<p class="cc-p">No family members added yet.</p>',
        assets: c.assets.length ? `<div class="table-wrap"><table><thead><tr><th>Tag</th><th>Type</th><th>Status</th></tr></thead><tbody>${c.assets.map(a => `<tr><td>${esc(a.asset_tag)}</td><td>${esc(a.asset_type)}</td><td>${esc(a.status)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="cc-p">No assets assigned yet.</p>',
        docs: `<div class="cc-toolbar"><select class="cc-in" id="ccUpType" style="max-width:320px">${reqOpts}</select><input type="file" id="ccUpFile" class="cc-in" style="max-width:280px"><button type="button" class="btn btn-primary btn-sm" onclick="cccDocUpload(${id})"><i data-lucide="upload"></i>Upload</button></div>` + (docsRows ? `<div class="table-wrap"><table><thead><tr><th>Document</th><th>File</th><th>Status</th><th>Uploaded</th><th></th></tr></thead><tbody>${docsRows}</tbody></table></div>` : '<p class="cc-p">No documents uploaded yet.</p>'),
        access: `<div class="cc-box" style="margin-bottom:12px"><div class="cc-box-h">Contact status</div>${stBadge(f.status)} <button type="button" class="btn btn-secondary btn-sm" onclick="cccToggleContact(${id},'${f.status === 'inactive' ? 'active' : 'inactive'}')">${f.status === 'inactive' ? 'Activate contact' : 'Deactivate contact'}</button> <span class="cc-tag add">ADD</span><p class="cc-p">Deactivating sets the contact to Inactive and turns off every linked login in the shared users table.</p></div>` + (c.users.length ? `<div class="table-wrap"><table><thead><tr><th>Login</th><th>Email</th><th>Status</th><th></th></tr></thead><tbody>${c.users.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${badge(+u.is_active ? 'green' : 'grey', +u.is_active ? 'Active' : 'Inactive')}</td><td><button type="button" class="badge badge-red" onclick="cccUserActive(${u.id},${+u.is_active ? 0 : 1})">${+u.is_active ? 'Revoke access' : 'Restore access'}</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="cc-p">No portal accounts linked to this contact.</p>'),
        custom: '<p class="cc-p">No custom field values set yet.</p>',
        fin: '<p class="cc-p">No bills recorded yet. Read from the ERP when present.</p>',
        cap: exRows(['productsAndServices', 'offering']), comp: exRows(['insurance', 'certifications']), dir: exRows(['directors', 'additionalContacts'])
      };
      const allT = tabs.concat(addTabs);
      box.innerHTML = `<div class="cc-prof-h"><div class="cc-av">${esc(initials(p.name))}</div><div style="flex:1"><div style="font-weight:800;font-size:16px">${esc(p.name)}</div><div>${typeBadge(f.primary_type)} ${stBadge(f.status)}</div></div><button type="button" class="btn btn-primary btn-sm" onclick="cccEdit(${id})">Edit</button></div>
        <div class="cc-subtabs">${allT.map(([k, l], i) => `<button type="button" class="cc-subtab${i === 0 ? ' on' : ''}${i >= tabs.length ? ' cc-add' : ''}"${i >= tabs.length ? ' style="--cc-d:inline-flex"' : ''} onclick="cccSub(this,'cp-${k}')">${l}${i >= tabs.length ? '<span class="cc-tag add">ADD</span>' : ''}</button>`).join('')}</div>
        <div class="panel" style="padding:16px">${allT.map(([k], i) => `<div class="cc-sp${i === 0 ? ' on' : ''}" id="cp-${k}">${panes[k]}</div>`).join('')}</div>`;
      if (typeof paintIcons === 'function') paintIcons(box); relabel();
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccDocUpload = async function (id) {
    const f = $('#ccUpFile').files[0]; if (!f) { toast('Choose a file first', 'alert-triangle'); return; }
    const fd = new FormData(); fd.append('partner_id', id); fd.append('doc_type', $('#ccUpType').value); fd.append('file', f);
    try { const res = await fetch(PROTO + '?r=document_upload', { method: 'POST', body: fd }); const j = await res.json(); if (!res.ok) throw new Error(j.error); toast('Document uploaded', 'check-circle'); cccProfLoad(id); setTimeout(() => cccSub($('#ccProfBody .cc-subtab:nth-child(6)'), 'cp-docs'), 50); } catch (e) { fail(e); }
  };
  window.cccDocReview = async function (mid, st) { try { await api('document_review', { id: mid, status: st }); toast('Document ' + st, 'check-circle'); cccProfLoad(PROF.id); setTimeout(() => cccSub($('#ccProfBody .cc-subtab:nth-child(6)'), 'cp-docs'), 50); } catch (e) { fail(e); } };
  window.cccUserActive = async function (uid, on) { try { await api('user_active', { user_id: uid, active: on }); toast(on ? 'Access restored' : 'Access revoked', 'check-circle'); if (PROF.id) { cccProfLoad(PROF.id); setTimeout(() => cccSub($('#ccProfBody .cc-subtab:nth-child(7)'), 'cp-access'), 50); } cccUsersLoad(); } catch (e) { fail(e); } };

  /* ================= users and access ================= */
  const USR = { q: '', active: '' };
  window.cccUsersLoad = async function () {
    const box = $('#ccUsersBody'); if (!box) return;
    try {
      const rows = await api('users', undefined, '&q=' + encodeURIComponent(USR.q) + '&active=' + USR.active);
      box.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Roles</th><th>Teams</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.roles || '-')}</td><td>${esc(u.teams || '-')}</td><td>${badge(+u.is_active ? 'green' : 'grey', +u.is_active ? 'Active' : 'Inactive')}</td><td><button type="button" class="badge badge-${+u.is_active ? 'red' : 'green'}" onclick="cccUserActive(${u.id},${+u.is_active ? 0 : 1})">${+u.is_active ? 'Deactivate' : 'Activate'}</button></td></tr>`).join('') || '<tr><td colspan="6">No users.</td></tr>'}</tbody></table></div>`;
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccUsersFilter = (q, a) => { if (q !== undefined) USR.q = q; if (a !== undefined) USR.active = a; clearTimeout(window._ccu); window._ccu = setTimeout(cccUsersLoad, 250); };

  /* ================= document centre ================= */
  const DC = { type: '', q: '', show: 'missing' };
  window.cccDocsLoad = async function () {
    const box = $('#ccDocsBody'); if (!box) return;
    try {
      const r = await api('doc_centre', undefined, '&type=' + DC.type + '&q=' + encodeURIComponent(DC.q) + '&show=' + DC.show);
      box.innerHTML = `<p class="cc-p">${r.total} contact(s). ${r.required} required document types are active in Settings.</p><div class="table-wrap"><table><thead><tr><th>Contact</th><th>Type</th><th>Documents</th><th>Missing required documents</th><th>Expired</th><th>Review</th><th></th></tr></thead><tbody>${r.rows.map(x => `<tr><td>${esc(x.name)}</td><td>${typeBadge(x.type)}</td><td>${x.documents}</td><td>${x.missing.length ? badge('orange', x.missing.length + ' missing') : badge('green', 'Complete')}</td><td>${x.expired || 0}</td><td>${x.pending ? badge('orange', x.pending + ' pending') : '-'} ${x.rejected ? badge('red', x.rejected + ' rejected') : ''}</td><td><button type="button" class="badge badge-purple" onclick="cccOpen(${x.id});setTimeout(()=>cccSub(document.querySelector('#ccProfBody .cc-subtab:nth-child(6)'),'cp-docs'),700)">Open</button></td></tr>`).join('') || '<tr><td colspan="7">No contacts match this filter.</td></tr>'}</tbody></table></div>`;
      relabel();
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccDocsFilter = (k, v) => { DC[k] = v; cccDocsLoad(); };

  /* ================= settings lists ================= */
  const SL = {
    banks: { list: 'banks', fields: [['name', 'Name', 'e.g. HSBC'], ['code', 'Code', 'optional']], show: r => `${r.name}${r.code ? ' <span class="cc-key">' + esc(r.code) + '</span>' : ''}`, add: 'Add bank', sel: 'SELECT id, name, code FROM banks' },
    titles: { list: 'titles', fields: [['name', 'Name', 'e.g. Doctor'], ['short_name', 'Short name', 'e.g. Dr']], show: r => `${r.name} <span class="cc-key">${esc(r.short_name || '')}</span>`, add: 'Add title' },
    tags: { list: 'tags', fields: [['name', 'Name', 'e.g. VIP Vendor'], ['color', 'Color', '#4f46e5']], show: r => `${r.name} <span class="cc-key">${esc(r.color || '')}</span>`, add: 'Add tag' },
    departments: { list: 'departments', fields: [['name', 'Name', 'e.g. Field Operations'], ['color', 'Color', '#4f46e5']], show: r => esc(r.name), add: 'Add department' },
    teams: { list: 'teams', fields: [['name', 'Name', 'e.g. Field Operations'], ['description', 'Description', 'optional']], show: r => esc(r.name), add: 'Add team' },
    custom_fields: { list: 'custom_fields', fields: [['code', 'Code', 'e.g. nin_number'], ['label', 'Label', 'e.g. NIN Number'], ['type', 'Type', 'text|textarea|number|email|url|date|checkbox|select'], ['options', 'Options', 'comma-separated, optional']], show: r => `${r.label} <span class="cc-key">${esc(r.code)} · ${esc(r.type)}</span>`, add: 'Add field' },
    required_documents: { list: 'required_documents', fields: [['section', 'Section', 'Company'], ['doc_type', 'Doc type key', 'e.g. insurance'], ['label', 'Label', 'e.g. Public Liability']], show: r => `${r.label} <span class="cc-key">${esc(r.section)} · ${esc(r.doc_type)}</span>`, add: 'Add rule' }
  };
  const SKEY = { banks: 'banks', titles: 'titles', tags: 'tags', departments: 'departments', teams: 'teams', custom_fields: 'custom_fields', required_documents: 'required_documents' };
  window.cccSetLoad = async function (name) {
    const box = $('#csl-' + name); if (!box) return; const def = SL[name];
    try {
      META = null; const m = await meta(); const rows = m[SKEY[name]] || [];
      box.innerHTML = `<div class="cc-toolbar" style="align-items:flex-end">${def.fields.map(([k, l, ph]) => `<div style="flex:1 1 140px"><label class="cc-fl2">${l}</label><input class="cc-in" data-sf="${k}" placeholder="${esc(ph)}"></div>`).join('')}<button type="button" class="btn btn-primary btn-sm" onclick="cccSetAdd('${name}')"><i data-lucide="plus"></i>${def.add}</button></div>
        <div class="cc-list">${rows.map(r => `<div class="cc-li"><span>${def.show(r)}</span><button type="button" aria-label="Delete" class="cc-x" onclick="cccSetDel('${name}',${r.id})">&times;</button></div>`).join('') || '<p class="cc-p">Nothing here yet.</p>'}</div>`;
      if (typeof paintIcons === 'function') paintIcons(box);
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccSetAdd = async function (name) {
    const def = SL[name]; const values = {};
    $$('#csl-' + name + ' [data-sf]').forEach(i => { if (i.value.trim()) values[i.dataset.sf] = i.value.trim(); });
    if (!values.name && !values.label) { toast('Enter a name first', 'alert-triangle'); return; }
    if (name === 'required_documents') { values.required = 1; values.is_active = 1; }
    if (name === 'custom_fields') { values.visible = 1; }
    try { await api('list_add', { list: def.list, values }); toast('Added', 'check-circle'); cccSetLoad(name); } catch (e) { fail(e); }
  };
  window.cccSetDel = async function (name, id) { if (!confirm('Delete this item?')) return; try { await api('list_delete', { list: SL[name].list, id }); toast('Deleted', 'check-circle'); cccSetLoad(name); } catch (e) { fail(e); } };
  window.cccSetPick = async function () {
    const box = $('#csl-picklist'); if (!box) return;
    try {
      META = null; const m = await meta(); const cats = Object.keys(m.picklists); const cur = box.dataset.cat || cats[0];
      box.dataset.cat = cur;
      box.innerHTML = `<div class="cc-toolbar"><label class="cc-fl2">List</label><select class="cc-in" style="max-width:320px" onchange="document.getElementById('csl-picklist').dataset.cat=this.value;cccSetPick()">${cats.map(c => `<option${c === cur ? ' selected' : ''}>${esc(c)}</option>`).join('')}</select><input class="cc-in" id="ccPickVal" placeholder="New value" style="max-width:260px"><button type="button" class="btn btn-primary btn-sm" onclick="cccPickAdd()">Add</button></div><div class="cc-list">${(m.picklists[cur] || []).map(v => `<div class="cc-li"><span>${esc(v)}</span></div>`).join('')}</div>`;
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccPickAdd = async function () { const v = $('#ccPickVal').value.trim(); if (!v) return; try { await api('list_add', { list: 'picklist', values: { category: $('#csl-picklist').dataset.cat, value: v, sort_order: 99, is_active: 1 } }); toast('Added', 'check-circle'); cccSetPick(); } catch (e) { fail(e); } };
  window.cccLabelsSave = async function () { try { await api('type_labels', { labels: cccLabelRead() }); } catch (e) { } };

  /* ================= dashboard ================= */
  window.cccDashLoad = async function () {
    const box = $('#ccDashBody'); if (!box) return;
    try {
      const d = await api('dashboard'); const c = d.counts || {}; const total = Object.values(c).reduce((a, b) => a + b, 0);
      const card = (l, n, ic) => `<div class="cc-kcard"><div class="cc-kl"><span>${l}</span><i data-lucide="${ic}"></i></div><div class="cc-kv">${n || 0}</div></div>`;
      box.innerHTML = `<div class="cc-hero"><div><div class="cc-eyebrow">CONTACT CONTROL CENTER</div><h2 class="cc-h2">Contacts at a glance</h2><p class="cc-p">One aligned contact source for customers, vendors, staff, partners, and operational relationships.</p></div><div class="cc-hero-a"><button type="button" class="btn btn-secondary btn-sm"><i data-lucide="settings-2"></i>Manage Sections</button><button type="button" class="btn btn-primary btn-sm" onclick="subNav('ccc',{tab:'cc-dir'})"><i data-lucide="users"></i>Open contacts</button></div></div>
        <div class="cc-kgrid">${card('All contacts', total, 'users')}${card('Individuals', c.individual, 'user')}${card('Employees', c.staff, 'check-circle')}${card('Customers', c.customer, 'building-2')}${card('Vendors', c.vendor, 'route')}${card('Partners', c.partner, 'puzzle')}${card('Other', c.other, 'list')}</div>
        <div class="cc-add cc-box" style="--cc-d:block;margin-top:14px"><div class="cc-box-h">Vendor onboarding <span class="cc-tag add">ADD</span></div><div class="cc-kgrid">${card('Vendors pending', d.vendor_pending, 'list-checks')}${card('Documents pending review', d.docs_pending, 'upload')}${card('Vendors inactive', d.vendor_inactive, 'shield-alert')}${card('Inactive logins', d.users_inactive, 'key')}</div></div>
        <div class="cc-two" style="margin-top:14px;grid-template-columns:2fr 1fr"><div class="panel"><h3>Latest contacts</h3><p class="cc-p">Recently added records from the aligned contact source.</p><div class="table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Contact</th><th>Added</th></tr></thead><tbody>${d.latest.map(x => `<tr><td><a href="#" onclick="cccOpen(${x.id});return false" style="font-weight:700">${esc(x.name)}</a></td><td>${typeBadge(x.primary_type)}</td><td>${esc(x.email || '-')}</td><td>${esc((x.created_at || '').slice(0, 10))}</td></tr>`).join('')}</tbody></table></div></div>
        <div class="panel"><h3><i data-lucide="plug"></i>CCC integrations</h3><p class="cc-p">Available contact capabilities</p>${['Customers and vendors', 'Employees and operational contacts', 'Addresses and organisations', 'ERP supplier and job links'].map(t => `<div class="cc-tick"><i data-lucide="check-circle"></i>${t}</div>`).join('')}<p class="cc-p" style="margin-top:12px">CCC uses the existing Contact Book as its aligned source. Extended registration, assets, affiliations, and data alignment screens are added without replacing host records.</p></div></div>`;
      if (typeof paintIcons === 'function') paintIcons(box); relabel();
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };

  /* ================= assets ================= */
  const AS = { q: '', edit: 0 };
  window.cccAssetsLoad = async function () {
    const box = $('#ccAssetsBody'); if (!box) return;
    try {
      const m = await meta(); const cs = await loadContactsOptions(); const rows = await api('assets', undefined, '&q=' + encodeURIComponent(AS.q));
      const op = (a, sel) => a.map(v => `<option${v === sel ? ' selected' : ''}>${esc(v)}</option>`).join('');
      const cur = rows.find(r => r.id === AS.edit) || {};
      box.innerHTML = `<div class="panel"><h3>${AS.edit ? 'Edit Asset' : 'New Asset'}</h3><div class="cc-grid">
        <div><label class="cc-fl2">Asset Tag</label><input class="cc-in" id="as_tag" placeholder="e.g. AST-001" value="${esc(cur.asset_tag || '')}"></div>
        <div><label class="cc-fl2">Type</label><select class="cc-in" id="as_type">${op(m.picklists.asset_type || [], cur.asset_type)}</select></div>
        <div><label class="cc-fl2">Brand / Model</label><input class="cc-in" id="as_brand" value="${esc(cur.brand_model || '')}"></div>
        <div><label class="cc-fl2">Serial Number</label><input class="cc-in" id="as_serial" value="${esc(cur.serial_number || '')}"></div>
        <div><label class="cc-fl2">Status</label><select class="cc-in" id="as_status">${op(m.picklists.asset_status || [], cur.status)}</select></div>
        <div><label class="cc-fl2">Location</label><input class="cc-in" id="as_loc" value="${esc(cur.location || '')}"></div>
        <div><label class="cc-fl2">Assigned To</label><select class="cc-in" id="as_to"><option value="">Unassigned</option>${cs.map(o => `<option value="${o.v}"${+cur.partner_id === o.v ? ' selected' : ''}>${esc(o.t)}</option>`).join('')}</select></div></div>
        <div class="cc-toolbar" style="margin-top:10px"><button type="button" class="btn btn-primary btn-sm" onclick="cccAssetSave()">${AS.edit ? 'Save asset' : 'Add Asset'}</button>${AS.edit ? '<button type="button" class="btn btn-secondary btn-sm" onclick="cccAssetEdit(0)">Cancel</button>' : ''}</div></div>
        <div class="cc-toolbar"><input class="cc-in cc-grow" placeholder="Search assets..." aria-label="Search assets" value="${esc(AS.q)}" oninput="cccAssetSearch(this.value)"></div>
        <div class="table-wrap"><table><thead><tr><th>Tag</th><th>Type</th><th>Status</th><th>Assigned To</th><th></th></tr></thead><tbody>${rows.map(a => `<tr><td><b>${esc(a.asset_tag)}</b><div class="cc-key">${esc(a.brand_model || '')}</div></td><td>${esc(a.asset_type)}</td><td>${badge({ 'In Use': 'green', 'In Storage': 'blue', 'Under Repair': 'orange', Retired: 'grey' }[a.status] || 'grey', a.status || '-')}</td><td>${esc(a.assigned_to || 'Unassigned')}</td><td><button type="button" class="badge badge-purple" onclick="cccAssetEdit(${a.id})">Edit</button> <button type="button" class="badge badge-red" onclick="cccAssetDel(${a.id})">Delete</button></td></tr>`).join('') || '<tr><td colspan="5">No assets found.</td></tr>'}</tbody></table></div>`;
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccAssetSearch = v => { AS.q = v; clearTimeout(window._cca); window._cca = setTimeout(cccAssetsLoad, 300); };
  window.cccAssetEdit = id => { AS.edit = id; cccAssetsLoad(); };
  window.cccAssetSave = async function () {
    const v = { asset_tag: $('#as_tag').value.trim(), asset_type: $('#as_type').value, brand_model: $('#as_brand').value.trim(), serial_number: $('#as_serial').value.trim(), status: $('#as_status').value, location: $('#as_loc').value.trim(), partner_id: $('#as_to').value || null };
    if (!v.asset_tag) { toast('Asset tag is required', 'alert-triangle'); $('#as_tag').focus(); return; }
    try { await api(AS.edit ? 'list_update' : 'list_add', { list: 'assets', id: AS.edit, values: v }); toast('Asset saved', 'check-circle'); AS.edit = 0; cccAssetsLoad(); } catch (e) { fail(e); }
  };
  window.cccAssetDel = async function (id) { if (!confirm('Delete this asset?')) return; try { await api('list_delete', { list: 'assets', id }); toast('Asset deleted', 'check-circle'); cccAssetsLoad(); } catch (e) { fail(e); } };

  /* ================= settings: organisation, location, affiliations, field rules ================= */
  window.cccOrgLoad = async function () {
    const box = $('#csl-organisations'); if (!box) return;
    try {
      const m = await meta(); const orgs = await api('organisations');
      const ng = m.countries.find(c => c.name === 'Nigeria'); const st = ng ? await api('states', undefined, '&country_id=' + ng.id) : [];
      const o = (a, ph) => `<option value="">${ph}</option>` + a.map(x => `<option value="${x.id}">${esc(x.name)}</option>`).join('');
      box.innerHTML = `<p class="cc-p">FOS-native: stays live-synced with the ERP's Company record (same id), which keeps its own automatic contact-record mirror too.</p><div class="cc-grid">
        <div><label class="cc-fl2">Name</label><input class="cc-in" data-of="name" placeholder="e.g. Acme Logistics Ltd"></div>
        <div><label class="cc-fl2">Parent organisation</label><select class="cc-in" data-of="parent_id">${o(orgs, 'None')}</select></div>
        <div><label class="cc-fl2">Founded</label><input class="cc-in" type="date" data-of="founded_date"></div>
        <div><label class="cc-fl2">Currency</label><select class="cc-in" data-of="currency_id">${o(m.currencies, 'Select...')}</select></div>
        <div><label class="cc-fl2">Color</label><input class="cc-in" data-of="color" placeholder="#4f46e5"></div>
        <div class="cc-span"><label class="cc-fl2">Description</label><textarea class="cc-in" rows="2" data-of="description" placeholder="What this organisation is / does..."></textarea></div>
        <div><label class="cc-fl2">Street 1</label><input class="cc-in" data-of="street1" placeholder="optional"></div><div><label class="cc-fl2">Street 2</label><input class="cc-in" data-of="street2" placeholder="optional"></div>
        <div><label class="cc-fl2">City</label><input class="cc-in" data-of="city"></div><div><label class="cc-fl2">ZIP / Postcode</label><input class="cc-in" data-of="zip"></div>
        <div><label class="cc-fl2">State / Region</label><select class="cc-in" data-of="state_id">${o(st, 'None')}</select></div>
        <div><label class="cc-fl2">Country</label><select class="cc-in" data-of="country_id">${o(m.countries, 'None')}</select></div></div>
        <div class="cc-toolbar" style="margin-top:10px"><button type="button" class="btn btn-primary btn-sm" onclick="cccOrgAdd()"><i data-lucide="plus"></i>Add organisation</button></div>
        <div class="cc-list">${orgs.map(x => `<div class="cc-li"><span>${esc(x.name)}<div class="cc-key">${esc([x.street1, x.city, x.country].filter(Boolean).join(', ') || 'No address on file')}</div></span><button type="button" class="cc-x" aria-label="Delete" onclick="cccOrgDel(${x.id})">&times;</button></div>`).join('')}</div>`;
      if (typeof paintIcons === 'function') paintIcons(box);
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccOrgAdd = async function () {
    const v = {}; $$('#csl-organisations [data-of]').forEach(i => { if (String(i.value).trim() !== '') v[i.dataset.of] = i.value.trim(); }); v.is_active = 1;
    if (!v.name) { toast('Organisation name is required', 'alert-triangle'); return; }
    try { await api('list_add', { list: 'organisations', values: v }); toast('Organisation added', 'check-circle'); META = null; cccOrgLoad(); } catch (e) { fail(e); }
  };
  window.cccOrgDel = async function (id) { if (!confirm('Delete this organisation?')) return; try { await api('list_delete', { list: 'organisations', id }); toast('Deleted', 'check-circle'); cccOrgLoad(); } catch (e) { fail(e); } };

  window.cccLocLoad = async function () {
    const box = $('#csl-location'); if (!box) return;
    try {
      const m = await meta(); const cur = (await api('setting_get', undefined, '&k=default_country')).value; const ng = m.countries.find(c => c.name === 'Nigeria');
      const val = cur === null ? String(ng ? ng.id : '') : cur;
      box.innerHTML = `<label class="cc-fl2" for="ccDefCountry">Default Country</label><select class="cc-in" id="ccDefCountry" style="max-width:320px" onchange="cccLocSave(this.value)"><option value="">None (Global)</option>${m.countries.map(c => `<option value="${c.id}"${String(c.id) === val ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select><p class="cc-p">"None" means Global: new contacts start with an empty, searchable country field.</p><p class="cc-p" id="ccLocMsg"></p>`;
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccLocSave = async function (v) { try { await api('setting_set', { k: 'default_country', v }); $('#ccLocMsg').textContent = 'Saved.'; } catch (e) { fail(e); } };

  const AFF = { cat: '' };
  window.cccAffLoad = async function () {
    const box = $('#csl-affiliations'); if (!box) return;
    try {
      const rows = await api('affiliation_taxonomies'); const cats = [...new Set(rows.map(r => r.category))]; AFF.cat = cats.includes(AFF.cat) ? AFF.cat : cats[0];
      const list = rows.filter(r => r.category === AFF.cat);
      box.innerHTML = `<div class="cc-pills">${cats.map(c => `<button type="button" class="cc-pill${c === AFF.cat ? ' on' : ''}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
        <div class="cc-toolbar" style="align-items:flex-end"><div style="flex:1 1 180px"><label class="cc-fl2">Name</label><input class="cc-in" id="af_name"></div><div style="flex:1 1 220px"><label class="cc-fl2">Description</label><input class="cc-in" id="af_desc"></div><button type="button" class="btn btn-primary btn-sm" onclick="cccAffAdd()">Add</button></div>
        <div class="cc-list">${list.map(r => `<div class="cc-li"><span>${esc(r.name)}<div class="cc-key">${esc(r.description || '')}</div></span><button type="button" class="cc-x" aria-label="Delete" onclick="cccAffDel(${r.id})">&times;</button></div>`).join('')}</div>`;
      $$('#csl-affiliations .cc-pill').forEach(b => b.onclick = () => { AFF.cat = b.dataset.c; cccAffLoad(); });
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccAffAdd = async function () { const n = $('#af_name').value.trim(); if (!n) { toast('Enter a name first', 'alert-triangle'); return; } try { await api('list_add', { list: 'affiliation_taxonomies', values: { category: AFF.cat, name: n, description: $('#af_desc').value.trim(), sort_order: 99, is_active: 1 } }); toast('Added', 'check-circle'); cccAffLoad(); } catch (e) { fail(e); } };
  window.cccAffDel = async function (id) { if (!confirm('Delete this item?')) return; try { await api('list_delete', { list: 'affiliation_taxonomies', id }); cccAffLoad(); } catch (e) { fail(e); } };

  const RT = ['individual', 'staff', 'customer', 'partner', 'vendor', 'driver', 'other'];
  const RTL = { individual: 'Individual', staff: 'Employee', customer: 'Customer', partner: 'Partner', vendor: 'Vendor', driver: 'Driver', other: 'Other' };
  window.cccRulesLoad = async function () {
    const box = $('#csl-rules'); if (!box) return;
    try {
      const rows = await api('rules'); const groups = {};
      rows.forEach(r => (groups[r.group] = groups[r.group] || []).push(r));
      const head = `<tr><th>${'Rule'}</th>${RT.map(t => `<th>${RTL[t]}</th>`).join('')}</tr>`;
      const tr = (r, mv) => { const on = JSON.parse(r.contact_types || '[]'); return `<tr><td>${mv ? `<span class="cc-mv"><button type="button" aria-label="Move up" onclick="cccRuleMove(${r.id},-1)">&uarr;</button><button type="button" aria-label="Move down" onclick="cccRuleMove(${r.id},1)">&darr;</button></span> ` : ''}${esc(r.label || r.field_key)}<div class="cc-key">${esc(r.field_key)}</div></td>${RT.map(t => `<td><input type="checkbox" aria-label="${esc(r.label)} for ${RTL[t]}" ${on.includes(t) ? 'checked' : ''} onchange="cccRuleSave(${r.id},this.closest('tr'))" data-t="${t}"></td>`).join('')}</tr>`; };
      const order = ['step'].concat(Object.keys(groups).filter(g => g !== 'step'));
      box.innerHTML = `<p class="cc-p">Which steps and fields show for each contact type, and the step order. These are the live Field and Tab rules; the contact form reads them. Note: the shared database stores Employee as <code>staff</code>.</p>` + order.map((g, i) => `<details class="cc-box" style="margin-bottom:8px"${i === 0 ? ' open' : ''}><summary class="cc-box-h" style="cursor:pointer">${g === 'step' ? 'Steps (order and visibility)' : esc(g)} <span class="cc-key">${groups[g].length}</span></summary><div class="table-wrap"><table><thead>${head}</thead><tbody>${groups[g].map(r => tr(r, g === 'step')).join('')}</tbody></table></div></details>`).join('')
        + `<div class="cc-add cc-box" style="--cc-d:block"><div class="cc-box-h">Vendor step list <span class="cc-tag add">ADD</span></div><p class="cc-p">Per-type step labels so Vendor shows 13 steps from these same steps.</p></div>`;
    } catch (e) { box.innerHTML = `<p class="cc-p">${esc(e.message)}</p>`; }
  };
  window.cccRuleSave = async function (id, tr) { const types = $$('input[data-t]', tr).filter(i => i.checked).map(i => i.dataset.t); try { await api('rule_save', { id, contact_types: types }); RULES = null; toast('Rule saved', 'check-circle'); } catch (e) { fail(e); } };
  window.cccRuleMove = async function (id, dir) { try { await api('rule_move', { id, dir }); cccRulesLoad(); } catch (e) { fail(e); } };

  /* ================= form validation ================= */
  function validate() {
    const t = currentType(); let first = null;
    $$('#cf13 .cf-err').forEach(x => x.remove());
    $$('#cf13 .cf-t-' + t + ' .cc-ff').forEach(ff => {
      if (ff.closest('.cc-rep') || (ff.classList.contains('cc-admin') && !$('#cf13').classList.contains('adm'))) return;
      const el = $('[data-k]', ff); if (!el) return; let msg = '';
      const v = (el.value || '').trim();
      if (ff.classList.contains('cc-rule-off')) return; if ($('.cc-req', ff) && el.dataset.k === 'companyName' && !v) msg = 'This field is required.';
      else if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = 'Enter a valid email address.';
      else if (el.type === 'url' && v && !/^https?:\/\/\S+\.\S+/.test(v)) msg = 'Enter a full web address starting with http.';
      else if (el.type === 'number' && v && isNaN(+v)) msg = 'Enter a number.';
      if (msg) { const d = document.createElement('div'); d.className = 'cf-err'; d.textContent = msg; ff.appendChild(d); el.classList.add('cc-bad'); if (!first) first = ff; } else el.classList.remove('cc-bad');
    });
    if (first) { const step = first.closest('.cc-step'); cccStep($$('#cf13 .cc-step').indexOf(step)); first.scrollIntoView({ block: 'center' }); toast('Fix the highlighted fields first', 'alert-triangle'); return false; }
    return true;
  }
  window.cccValidate = validate;
  const _save = window.cccSave;
  window.cccSave = async function (finish) {
    const data = collect($('#cf13'));
    if (!CF.id && !data.companyName && !data.firstName) { /* the original check below shows its own message */ }
    else if (!validate()) return false;
    return _save(finish);
  };
  document.addEventListener('input', e => { const ff = e.target.closest && e.target.closest('.cc-ff'); if (ff) { const x = $('.cf-err', ff); if (x) x.remove(); e.target.classList && e.target.classList.remove('cc-bad'); } });


  /* ================= export, import, bulk actions, tags ================= */
  window.cccExport = function () {
    const qs = '&type=' + (DIR.type || '') + '&status=' + (DIR.status || '') + '&q=' + encodeURIComponent(DIR.q || '');
    const a = document.createElement('a'); a.href = PROTO + '?r=export' + qs; a.download = 'contacts.csv'; document.body.appendChild(a); a.click(); a.remove(); toast('Export started', 'download');
  };
  function parseCsv(text) {
    const rows = []; let row = [], cur = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (ch !== '\r') cur += ch;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(r => r.some(x => x.trim() !== ''));
  }
  window.cccImport = async function (input) {
    const f = input.files[0]; if (!f) return; input.value = '';
    try {
      const rows = parseCsv(await f.text()); if (rows.length < 2) throw new Error('The file needs a header row and at least one contact.');
      const head = rows[0].map(h => h.trim().toLowerCase());
      if (!head.includes('name')) throw new Error('The header row must include a name column. Columns: name, type, email, phone, city.');
      const data = rows.slice(1).map(r => { const o = {}; head.forEach((h, i) => o[h] = (r[i] || '').trim()); return o; });
      const res = await api('contact_import', { rows: data });
      toast(res.created + ' contact(s) imported' + (res.errors.length ? '. ' + res.errors.length + ' row(s) skipped: ' + res.errors.slice(0, 2).join('; ') : '.'), res.errors.length ? 'alert-triangle' : 'check-circle');
      cccDirLoad();
    } catch (e) { fail(e); }
  };
  const selected = () => $$('#ccDirBody .ccsel:checked').map(i => +i.dataset.id);
  window.cccBulkAll = function (cb) { $$('#ccDirBody .ccsel').forEach(i => i.checked = cb.checked); cccBulkUpdate(); };
  window.cccBulkUpdate = async function () {
    const bar = $('#ccBulk'); if (!bar) return; const ids = selected();
    if (!ids.length) { bar.hidden = true; return; }
    const m = await meta();
    bar.hidden = false;
    bar.innerHTML = `<b>${ids.length} selected</b> <button type="button" class="btn btn-secondary btn-sm" onclick="cccBulk('inactive')">Deactivate</button> <button type="button" class="btn btn-secondary btn-sm" onclick="cccBulk('active')">Activate</button> <select class="cc-in" id="ccBulkTag" style="max-width:200px" aria-label="Tag"><option value="">Add tag...</option>${m.tags.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('')}</select> <button type="button" class="btn btn-primary btn-sm" onclick="cccBulk('tag')">Apply tag</button>`;
  };
  window.cccBulk = async function (act) {
    const ids = selected(); if (!ids.length) return;
    try {
      if (act === 'tag') {
        const tid = +$('#ccBulkTag').value; if (!tid) { toast('Choose a tag first', 'alert-triangle'); return; }
        for (const id of ids) { const c0 = await api('contact', undefined, '&id=' + id); const has = c0.tags.find(t => t.id === tid && +t.assigned); if (!has) await api('tag_toggle', { partner_id: id, tag_id: tid }); }
        toast('Tag added to ' + ids.length + ' contact(s)', 'check-circle');
      } else {
        if (act === 'inactive' && !confirm('Deactivate ' + ids.length + ' contact(s) and their linked logins?')) return;
        let users = 0; for (const id of ids) { const r = await api('contact_status', { id, status: act, cascade_users: true }); users += r.users_changed || 0; }
        toast(ids.length + ' contact(s) ' + (act === 'inactive' ? 'deactivated' : 'activated') + (users ? '. ' + users + ' login(s) changed.' : '.'), 'check-circle');
      }
      cccDirLoad();
    } catch (e) { fail(e); }
  };
  window.cccTag = async function (pid, tid) { try { await api('tag_toggle', { partner_id: pid, tag_id: tid }); cccProfLoad(pid); } catch (e) { fail(e); } };

  /* ================= wire up: load a panel when it becomes active ================= */
  const SEEN = {};
  const MAP = { titles: 'titles', banks: 'banks', departments: 'departments', teams: 'teams', custom: 'custom_fields', reqdocs: 'required_documents', categories: 'tags' };
  function route() {
    const act = id => { const el = document.getElementById(id); return !!(el && el.classList.contains('active') && el.closest('.page.active')); };
    const once = (key, on, fn) => { if (on && !SEEN[key]) { SEEN[key] = 1; fn(); } if (!on) SEEN[key] = 0; };
    once('dir', act('cc-dir'), cccDirLoad);
    once('docs', act('cc-docs'), cccDocsLoad);
    once('users', act('cc-users'), cccUsersLoad);
    once('dash', act('cc-dash'), cccDashLoad);
    once('assets', act('cc-assets'), cccAssetsLoad);
    once('form', act('cc-form'), () => { RULES = null; applyRules(); });
    once('prof', act('cc-prof'), () => { if (PROF.id) return; api('contacts', undefined, '&type=vendor&per=5').then(r => { if (r.rows[0]) cccProfLoad(r.rows[0].id); }).catch(fail); });
    if (act('cc-setf')) {
      const on = $('#cc-setf .cc-subtab.on'); const m = on && (on.getAttribute('onclick') || '').match(/cs-([a-z_]+)/); const k = m && m[1];
      once('set:' + k, !!k, () => { if (MAP[k]) cccSetLoad(MAP[k]); if (k === 'options') cccSetPick(); if (k === 'organisation') cccOrgLoad(); if (k === 'location') cccLocLoad(); if (k === 'affiliations') cccAffLoad(); if (k === 'rules') cccRulesLoad(); });
    } else { Object.keys(SEEN).filter(x => x.indexOf('set:') === 0).forEach(x => SEEN[x] = 0); }
  }
  let rt; const sched = () => { clearTimeout(rt); rt = setTimeout(route, 150); };
  const root = document.getElementById('page-ccc');
  if (root) new MutationObserver(sched).observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sched).observe(document.getElementById('workspace') || document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
})();
</script>