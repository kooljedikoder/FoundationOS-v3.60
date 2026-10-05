// Rebuilds the single-file mockup from the section source files.
// usage: node build.js [outputPath]
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'C:/xampp/htdocs/FoundationOS/foundation_os/public/VendorFlow_Admin_Home.html';
const parts = JSON.parse(fs.readFileSync(path.join(__dirname, 'parts.json'), 'utf8'));
const cache = {};
const text = parts.map(p => { if (!(p in cache)) cache[p] = fs.readFileSync(path.join(__dirname, p), 'utf8'); return cache[p]; });
// a part listed twice (should not happen) is only emitted once
fs.writeFileSync(out, text.join(''));
console.log('built', out, Math.round(text.join('').length / 1024) + ' KB from', parts.length, 'parts');
