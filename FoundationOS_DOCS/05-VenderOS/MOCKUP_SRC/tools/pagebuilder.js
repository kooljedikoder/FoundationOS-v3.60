// Builds the page builder client: the block library (same code the generator uses) + the builder UI, as one JS part.
const fs = require('fs'), path = require('path');
const E = require('./engine');
let lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8');
lib = lib.replace(/module\.exports = \{[\s\S]*?\};\s*$/, '');
const client = fs.readFileSync(path.join(__dirname, 'client_pagebuilder.txt'), 'utf8');
const js = '/* ---------- Block library shared with the generator (tools/lib.js) so builder pages look identical ---------- */\nconst FL = (function(){\n' + lib + '\nreturn { kpis, note, panel, list, listRef, bars, cards, matrix, form, flow, timeline, kv, two, tabPanel };\n})();\n' + client;
const rel = 'js/204-page-builder.js';
E.write(rel, js);
if (!E.parts.includes(rel)) { const at = E.parts.indexOf('js/203-db-connect.js'); const arr = E.parts.slice(); arr.splice(at + 1, 0, rel); E.parts = arr; }
console.log('page builder client written');
