// One-time conversion: hand-written tables on the original pages become standard lists (data-vf collections) so they read and write the database.
const fs = require('fs'), path = require('path');
const E = require('./engine');
const PAGES = ['dashboard', 'reg', 'docs', 'warehouse', 'perf', 'selfservice', 'plusprocure', 'admin'];
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '-').replace(/&middot;/g, '·').replace(/\s+/g, ' ').trim();
const store = {}; const ds = {};
let converted = 0; const report = [];
PAGES.forEach(id => {
  const f = E.parts.find(p => /sections\/[^/]+\/page-/.test(p) && p.endsWith('/page-' + id + '.html')); if (!f) return;
  let t = E.read(f); let n = 0; let from = 0;
  for (;;) {
    const at = t.indexOf('<table', from); if (at < 0) break;
    // skip tables inside generated blocks
    const genAt = t.lastIndexOf('data-gen="1"', at); let inGen = false;
    if (genAt >= 0) { const gs = t.lastIndexOf('<div', genAt); const ge = E.blockEnd(t, gs); inGen = at < ge; }
    const end = t.indexOf('</table>', at) + 8;
    if (inGen) { from = end; continue; }
    const tbl = t.slice(at, end);
    const heads = [...tbl.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => strip(m[1]));
    const trs = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => m[1]).filter(r => /<td/.test(r));
    if (!trs.length) { from = end; continue; }
    const key = (id + '_t' + (++n)).replace(/-/g, '_');
    const rows = []; const used = {};
    trs.forEach((r, i) => {
      const cells = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);
      const texts = cells.map(strip); const badges = cells.map(c => { const b = c.match(/badge badge-([a-z]+)[^>]*>([\s\S]*?)<\/span>/); return b ? [b[1], strip(b[2])] : null; });
      let ref = texts[0] || ('ROW-' + (i + 1)); if (used[ref]) ref += '-' + (++used[ref]); else used[ref] = 1;
      const o = { ref, title: texts.length > 1 ? texts[1] : texts[0], type: '', owner: '', date: '', status: ['grey', 'Listed'], stage: '-', next: '' };
      const extra = [];
      texts.forEach((x, c) => {
        if (c <= (texts.length > 1 ? 1 : 0) || !x) return; const h = (heads[c] || '').toLowerCase();
        if (badges[c]) { o.status = [({ green: 'green', blue: 'blue', orange: 'orange', red: 'red', grey: 'grey', purple: 'blue' })[badges[c][0]] || 'grey', badges[c][1]]; return; }
        if (/action/.test(h)) return;
        if (/owner|reviewer|assigned|handler|by$|team/.test(h) && !o.owner) o.owner = x;
        else if (/date|due|when|updated|submitted|expires|closes|time|age|received/.test(h) && !o.date) o.date = x;
        else if (/amount|value|₦|price|spend/.test(h) && !o.amount) o.amount = x;
        else if (/type|category|role|priority|kind|trade/.test(h) && !o.type) o.type = x;
        else extra.push((heads[c] ? heads[c] + ' ' : '') + x);
      });
      if (extra.length) o.title += ' (' + extra.join(', ') + ')';
      rows.push(o);
    });
    store[key] = rows; ds[key] = ['new', 'NEW ' + key];
    // replace the table, and its table-wrap if it wraps only the table
    let a = at, b = end; const wrapOpen = t.lastIndexOf('<div class="table-wrap">', at);
    if (wrapOpen >= 0 && t.slice(wrapOpen + 24, at).trim() === '' && t.slice(end, end + 8).trim().startsWith('</div>')) { a = wrapOpen; b = end + (t.slice(end).indexOf('</div>') + 6); }
    const rep = '<div class="table-wrap" data-vf="' + key + '"></div>';
    t = t.slice(0, a) + rep + t.slice(b); from = a + rep.length; converted++; report.push(id + ' ' + key + ' ' + rows.length + ' rows');
  }
  E.write(f, t);
});
fs.writeFileSync(path.join(__dirname, 'converted_lists.json'), JSON.stringify({ store, ds }, null, 1));
const js = '/* ---------- Lists converted from hand-written tables (tools/convert_tables.js): now standard lists backed by the database ---------- */\nObject.assign(VF, ' + JSON.stringify(store) + ');\nObject.assign(DM_DS, ' + JSON.stringify(ds) + ');\n';
const rel = 'js/205-converted-lists.js'; E.write(rel, js);
if (!E.parts.includes(rel)) { const at = E.parts.indexOf('js/204-page-builder.js'); const arr = E.parts.slice(); arr.splice(at + 1, 0, rel); E.parts = arr; }
console.log('converted', converted, 'tables'); report.forEach(r => console.log(' ', r));
