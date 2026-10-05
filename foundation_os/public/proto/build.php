<?php
// VendorOS prototype: builds proto.sqlite as a COPY of the shared FOS tables (read-only on MySQL).
// Run from the command line only:  php public/proto/build.php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

$env = [];
foreach (file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES) as $line) {
    if (preg_match('/^(DB_[A-Z_]+)=(.*)$/', $line, $m)) { $env[$m[1]] = trim($m[2], "\"' "); }
}
$my = new PDO(
    "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']};charset=utf8mb4",
    $env['DB_USERNAME'], $env['DB_PASSWORD'] ?? '',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);
$dbName = $env['DB_DATABASE']; // only this database is ever read

$file = __DIR__ . '/proto.sqlite';
if (file_exists($file)) { unlink($file); }
$lite = new PDO('sqlite:' . $file, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$lite->exec('PRAGMA journal_mode=WAL');

// tables to copy (identity, CCC, documents, lookups)
$tables = [
    'users', 'roles', 'model_has_roles', 'teams', 'user_team',
    'partners_partners', 'partners_titles', 'partners_industries', 'partners_tags', 'partners_partner_tag',
    'partners_bank_accounts', 'partners_partner_company_properties', 'banks',
    'fos_partner_profiles', 'fos_organisations', 'fos_departments', 'fos_teams', 'fos_affiliations', 'fos_affiliation_taxonomies',
    'fos_assets', 'fos_certifications', 'fos_contact_locations', 'fos_custom_fields', 'fos_custom_field_values',
    'fos_field_visibility_rules', 'fos_picklist_options', 'fos_required_documents',
    'fos_partner_family_members', 'fos_partner_important_dates',
    'fos_vendor_references', 'fos_vendor_insurance_policies', 'fos_vendor_recommendations', 'fos_vendor_stage_reviews',
    'vendor_directors', 'vendor_documents', 'documents', 'media', 'vendor_passports', 'vendor_passport_state_logs',
    'countries', 'states', 'currencies',
];
$strip = ['users' => ['password' => '', 'remember_token' => null, 'app_authentication_secret' => null, 'app_authentication_recovery_codes' => null]];

$map = function (string $t): string {
    $t = strtolower($t);
    if (preg_match('/int|bool|bit/', $t)) { return 'INTEGER'; }
    if (preg_match('/decimal|numeric|float|double|real/', $t)) { return 'REAL'; }
    return 'TEXT';
};

$summary = [];
foreach ($tables as $t) {
    $cols = $my->prepare('SELECT column_name AS n, data_type AS t FROM information_schema.columns WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position');
    $cols->execute([$dbName, $t]);
    $cols = $cols->fetchAll();
    if (!$cols) { $summary[$t] = 'missing'; continue; }
    $defs = [];
    foreach ($cols as $c) {
        $defs[] = '"' . $c['n'] . '" ' . ($c['n'] === 'id' ? 'INTEGER PRIMARY KEY' : $map($c['t']));
    }
    $lite->exec('CREATE TABLE "' . $t . '" (' . implode(',', $defs) . ')');
    $rows = $my->query('SELECT * FROM `' . $t . '`')->fetchAll();
    if ($rows) {
        $names = array_column($cols, 'n');
        $ins = $lite->prepare('INSERT INTO "' . $t . '" ("' . implode('","', $names) . '") VALUES (' . implode(',', array_fill(0, count($names), '?')) . ')');
        $lite->beginTransaction();
        foreach ($rows as $r) {
            foreach (($strip[$t] ?? []) as $col => $val) { if (array_key_exists($col, $r)) { $r[$col] = $val; } }
            $ins->execute(array_map(fn ($v) => is_string($v) && !mb_check_encoding($v, 'UTF-8') ? null : $v, array_values($r)));
        }
        $lite->commit();
    }
    $summary[$t] = count($rows);
}

// prototype-only tables
$lite->exec('CREATE TABLE IF NOT EXISTS proto_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, actor TEXT, action TEXT, target TEXT, detail TEXT)');
$lite->exec('CREATE TABLE IF NOT EXISTS proto_settings (k TEXT PRIMARY KEY, v TEXT)');
$lite->exec('CREATE TABLE IF NOT EXISTS proto_form_drafts (id INTEGER PRIMARY KEY AUTOINCREMENT, partner_id INTEGER, type TEXT, step INTEGER, payload TEXT, updated_at TEXT)');
$lite->exec("INSERT OR REPLACE INTO proto_settings (k, v) VALUES ('type_labels', '')");

foreach ($summary as $t => $n) { echo str_pad($t, 40) . $n . PHP_EOL; }
echo 'Built ' . $file . ' (' . round(filesize($file) / 1024) . ' KB)' . PHP_EOL;
