// Exports every generated page as a JSON page schema, the list collections as collection schemas, and the JSON Schema that describes both.
const fs = require('fs'), path = require('path');
const E = require('./engine');
const lib = require('./lib');

module.exports = function exportSchemas(pages, newPages, PAGE_PKG) {
  const OUT = path.join(E.SRC, 'schema'); const PUB = path.join(E.SRC, '..', '..', '..', 'foundation_os', 'public', 'proto', 'schema');
  [OUT, path.join(OUT, 'pages'), PUB, path.join(PUB, 'pages')].forEach(d => fs.mkdirSync(d, { recursive: true }));
  fs.readdirSync(path.join(OUT, 'pages')).forEach(f => fs.unlinkSync(path.join(OUT, 'pages', f)));
  const wsOf = id => { const f = E.parts.find(p => /sections\/[^/]+\/page-/.test(p) && p.endsWith('/page-' + id + '.html')); return f ? f.split('/')[1] : null; };
  const titleOf = id => { const f = E.parts.find(p => /sections\/[^/]+\/page-/.test(p) && p.endsWith('/page-' + id + '.html')); if (!f) return id; const m = E.read(f).match(/page-title">([^<]+)</); return m ? m[1].replace(/&amp;/g, '&') : id; };
  const collUse = {};
  const out = [];
  pages.concat(newPages).forEach(sp => {
    const isNew = newPages.indexOf(sp) >= 0;
    const tabs = sp.tabs.map(t => {
      const base = { id: t.existing ? t.existing : (t.id === 'wrap' ? ((sp.wrap && sp.wrap.panel) || sp.id + '-main') : sp.id + '-tab-' + t.id), label: t.label };
      if (t.existing || t.id === 'wrap') return Object.assign(base, { source: 'legacy', note: 'Hand-written panel. The builder keeps it as is until it is converted to blocks.' });
      const blocks = (t.blocks || []).map(b => (b && b.desc) || { type: 'html' });
      blocks.forEach(b => { const c = b.type === 'columns' ? b.blocks : [b]; c.forEach(x => { if (x && x.type === 'list') (collUse[x.collection] = collUse[x.collection] || new Set()).add(sp.id); }); });
      return Object.assign(base, { source: 'schema', blocks });
    });
    const page = {
      $schema: 'fos-page.schema.json', schemaVersion: 1, id: sp.id, title: sp.title || titleOf(sp.id), subtitle: sp.sub || null, workspace: wsOf(sp.id),
      package: PAGE_PKG[sp.id] || null, origin: isNew ? 'generated' : 'restructured', actions: (sp.actions || []).map(([label, style, onclick, icon]) => ({ label, style: style || 'btn-secondary', onclick: onclick || null, icon: icon || null })),
      kpis: sp.kpis && sp.kpis.desc ? sp.kpis.desc : null, tabs
    };
    out.push(page);
    const j = JSON.stringify(page, null, 1);
    fs.writeFileSync(path.join(OUT, 'pages', sp.id + '.json'), j); fs.writeFileSync(path.join(PUB, 'pages', sp.id + '.json'), j);
  });
  // stale public files
  fs.readdirSync(path.join(PUB, 'pages')).forEach(f => { if (!fs.existsSync(path.join(OUT, 'pages', f))) fs.unlinkSync(path.join(PUB, 'pages', f)); });
  // collections
  const cols = Object.keys(lib.DATA).sort().map(k => ({ id: k, store: 'proto_records', dataSource: (lib.DS[k] || [])[1] || null, rows: lib.DATA[k].length, usedBy: [...(collUse[k] || [])], fields: [{ key: 'ref', type: 'text', required: true, unique: true }, { key: 'title', type: 'text', required: true }, { key: 'type', type: 'text' }, { key: 'owner', type: 'text' }, { key: 'date', type: 'text' }, { key: 'amount', type: 'text' }, { key: 'status', type: 'badge', shape: '[colour, text]', colours: ['grey', 'blue', 'orange', 'red', 'green'] }, { key: 'stage', type: 'text', note: 'journey stage chip, for example S41' }, { key: 'next', type: 'text', note: 'the single next action shown in the drawer' }, { key: 'actions', type: 'actions', note: 'optional decision buttons, for example Approve, Reject' }] }));
  const collections = { schemaVersion: 1, note: 'Each collection is a standard list (rule R12). In the prototype they live in proto_records; in the port each maps to its real table through dataSource.', collections: cols };
  const cj = JSON.stringify(collections, null, 1); fs.writeFileSync(path.join(OUT, 'collections.json'), cj); fs.writeFileSync(path.join(PUB, 'collections.json'), cj);
  // the JSON Schema that describes a page schema
  const blockTypes = ['kpis', 'list', 'bars', 'cards', 'matrix', 'form', 'flow', 'timeline', 'kv', 'note', 'html', 'columns'];
  const js = {
    $schema: 'https://json-schema.org/draft/2020-12/schema', $id: 'fos-page.schema.json', title: 'FOS page schema', description: 'A page is a workspace page: header, optional KPI strip, tabs, and blocks inside each tab. Forms use the FormFlow field vocabulary (SPECS/FORMFLOW.md). Every app and module ships its pages in this shape so the builder can read, create and edit them.', type: 'object', required: ['schemaVersion', 'id', 'title', 'tabs'],
    properties: { schemaVersion: { const: 1 }, id: { type: 'string', pattern: '^[a-z0-9-]+$' }, title: { type: 'string' }, subtitle: { type: ['string', 'null'] }, workspace: { type: ['string', 'null'] }, package: { type: ['string', 'null'], description: 'AppSuite package that owns the page' }, origin: { enum: ['generated', 'restructured', 'builder'] }, actions: { type: 'array', items: { $ref: '#/$defs/action' } }, kpis: { oneOf: [{ type: 'null' }, { $ref: '#/$defs/block' }] }, tabs: { type: 'array', items: { $ref: '#/$defs/tab' } } },
    $defs: {
      action: { type: 'object', required: ['label'], properties: { label: { type: 'string' }, style: { type: 'string' }, onclick: { type: ['string', 'null'] }, icon: { type: ['string', 'null'] } } },
      tab: { type: 'object', required: ['id', 'label', 'source'], properties: { id: { type: 'string' }, label: { type: 'string' }, source: { enum: ['schema', 'legacy'] }, note: { type: 'string' }, blocks: { type: 'array', items: { $ref: '#/$defs/block' } } } },
      block: { type: 'object', required: ['type'], properties: { type: { enum: blockTypes }, title: { type: 'string' }, sub: { type: ['string', 'null'] }, icon: { type: ['string', 'null'] }, collection: { type: 'string', description: 'list blocks: a collection id from collections.json' }, items: { type: 'array' }, rows: { type: 'array' }, columns: { type: 'array' }, steps: { type: 'array' }, formflow: { $ref: '#/$defs/formflow' }, buttons: { type: 'array' }, html: { type: 'string' }, blocks: { type: 'array', items: { $ref: '#/$defs/block' } } } },
      formflow: { type: 'object', required: ['id', 'version', 'fields'], properties: { id: { type: 'string' }, version: { type: 'integer' }, title: { type: 'string' }, fields: { type: 'array', items: { type: 'object', required: ['key', 'label', 'type'], properties: { key: { type: 'string' }, label: { type: 'string' }, type: { enum: ['text', 'textarea', 'number', 'currency', 'date', 'time', 'select', 'radio', 'checkbox', 'toggle', 'relationship', 'repeater', 'file', 'image', 'audio', 'signature', 'location'] }, options: { type: 'array' }, required: { type: 'boolean' }, table: { type: 'string', description: 'real table when the field maps to a column' }, column: { type: 'string' } } } }, submit: { type: 'object' } } }
    }
  };
  const sj = JSON.stringify(js, null, 1); fs.writeFileSync(path.join(OUT, 'fos-page.schema.json'), sj); fs.writeFileSync(path.join(PUB, 'fos-page.schema.json'), sj);
  const idx = out.map(p => ({ id: p.id, title: p.title, workspace: p.workspace, package: p.package, origin: p.origin, tabs: p.tabs.length, schemaTabs: p.tabs.filter(t => t.source === 'schema').length, legacyTabs: p.tabs.filter(t => t.source === 'legacy').length }));
  const ij = JSON.stringify({ schemaVersion: 1, pages: idx }, null, 1); fs.writeFileSync(path.join(OUT, 'index.json'), ij); fs.writeFileSync(path.join(PUB, 'index.json'), ij);
  console.log('schemas exported: pages', out.length, 'collections', cols.length);
};
