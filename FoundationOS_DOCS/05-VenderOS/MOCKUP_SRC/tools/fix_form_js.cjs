const fs = require('fs');
let s = fs.readFileSync('tools/lib.js', 'utf8');
const a = "onclick=\"${js || \"showToast('\" + esc(b).replace(/'/g, '') + \" recorded in the prototype','check-circle')\"}\">${esc(b)}</button>`).join('')}</div>`, (o || {}).sub);\n// flow";
if (!s.includes(a)) throw new Error('form button line not found');
s = s.replace(a, "onclick=\"${js || \"fosFormSave(this,'\" + esc(title).replace(/'/g, '') + \"')\"}\">${esc(b)}</button>`).join('')}</div>`, (o || {}).sub);\n// flow");
fs.writeFileSync('tools/lib.js', s); console.log('form buttons now save to the database');
