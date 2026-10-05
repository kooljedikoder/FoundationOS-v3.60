const fs = require('fs');
let s = fs.readFileSync('tools/apply.js', 'utf8');
if (s.indexOf("'10-builder'") < 0) s = s.replace("'09-reports-10-appsuite'].map(", "'09-reports-10-appsuite', '10-builder'].map(");
if (s.indexOf("require('./pagebuilder')") < 0) s = s.replace("require('./dbconnect');", "require('./dbconnect');\nrequire('./pagebuilder');");
fs.writeFileSync('tools/apply.js', s); console.log('builder hooked');
let a = fs.readFileSync('../../foundation_os/public/proto/api.php', 'utf8');
if (a.indexOf("$r === 'record_delete'") < 0) {
  a = a.replace("if ($r === 'record_decide') {", "if ($r === 'record_delete') {\n    $c = (string) ($body['c'] ?? ''); if (!rec_ok($c)) { out(['error' => 'bad collection'], 422); }\n    q($db, 'DELETE FROM proto_records WHERE collection = ? AND ref = ?', [$c, (string) ($body['ref'] ?? '')]); audit($db, $actor, 'record.delete', $c . ':' . ($body['ref'] ?? '')); out(['ok' => true]);\n}\nif ($r === 'record_decide') {");
  fs.writeFileSync('../../foundation_os/public/proto/api.php', a); console.log('api record_delete added');
}
