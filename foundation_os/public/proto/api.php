<?php
// VendorOS prototype API. Reads and writes proto.sqlite only (a COPY of the shared FOS tables).
// Never touches the real MySQL database. Localhost only. Test data only.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($ip, ['127.0.0.1', '::1'], true)) { http_response_code(403); echo json_encode(['error' => 'localhost only']); exit; }

$dbFile = __DIR__ . '/proto.sqlite';
if (!file_exists($dbFile)) { http_response_code(500); echo json_encode(['error' => 'proto.sqlite missing: run php public/proto/build.php']); exit; }
$db = new PDO('sqlite:' . $dbFile, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$db->exec('PRAGMA busy_timeout=4000');

$r = $_GET['r'] ?? '';
if (isset($_GET['type']) && $_GET['type'] === 'employee') { $_GET['type'] = 'staff'; } // the shared tables store Employee as staff
$body = json_decode(file_get_contents('php://input') ?: '[]', true) ?: [];
$actor = 'superadmin@example.com';

function out($v, int $code = 200): void { http_response_code($code); echo json_encode($v, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE); exit; }
function q(PDO $db, string $sql, array $p = []): array { $s = $db->prepare($sql); $s->execute($p); return $s->fetchAll(); }
function one(PDO $db, string $sql, array $p = []): ?array { $x = q($db, $sql, $p); return $x[0] ?? null; }
function audit(PDO $db, string $actor, string $action, string $target, $detail = null): void {
    q($db, 'INSERT INTO proto_audit (at, actor, action, target, detail) VALUES (?,?,?,?,?)', [date('c'), $actor, $action, $target, $detail === null ? null : json_encode($detail)]);
}
function cols(PDO $db, string $t): array { return array_column(q($db, "PRAGMA table_info($t)"), 'name'); }
function snake(string $s): string { return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $s)); }

// ---------------------------------------------------------------- reads
if ($r === 'meta') {
    $pick = [];
    foreach (q($db, 'SELECT category, value FROM fos_picklist_options WHERE is_active = 1 ORDER BY category, sort_order, value') as $x) { $pick[$x['category']][] = $x['value']; }
    out([
        'picklists' => $pick,
        'titles' => q($db, 'SELECT id, name, short_name FROM partners_titles ORDER BY name'),
        'industries' => q($db, 'SELECT id, name FROM partners_industries ORDER BY name'),
        'banks' => q($db, 'SELECT id, name, code FROM banks ORDER BY name'),
        'departments' => q($db, 'SELECT id, name FROM fos_departments ORDER BY name'),
        'teams' => q($db, 'SELECT id, name FROM fos_teams ORDER BY name'),
        'countries' => q($db, 'SELECT id, name FROM countries ORDER BY name'),
        'currencies' => q($db, 'SELECT id, name, symbol FROM currencies ORDER BY name LIMIT 400'),
        'tags' => q($db, 'SELECT id, name, color FROM partners_tags ORDER BY name'),
        'required_documents' => q($db, 'SELECT * FROM fos_required_documents ORDER BY section, sort_order'),
        'rules' => q($db, 'SELECT * FROM fos_field_visibility_rules ORDER BY "group", "order"'),
        'custom_fields' => q($db, 'SELECT * FROM fos_custom_fields'),
        'type_labels' => json_decode((string) (one($db, "SELECT v FROM proto_settings WHERE k='type_labels'")['v'] ?? ''), true),
    ]);
}
if ($r === 'states') { out(q($db, 'SELECT id, name FROM states WHERE country_id = ? ORDER BY name', [(int) ($_GET['country_id'] ?? 0)])); }

if ($r === 'contacts') {
    $page = max(1, (int) ($_GET['page'] ?? 1)); $per = min(100, max(5, (int) ($_GET['per'] ?? 20)));
    $w = ['p.deleted_at IS NULL']; $par = [];
    if (!empty($_GET['type'])) { $w[] = 'f.primary_type = ?'; $par[] = $_GET['type']; }
    if (!empty($_GET['status'])) { $w[] = 'f.status = ?'; $par[] = $_GET['status']; }
    if (!empty($_GET['q'])) { $w[] = '(p.name LIKE ? OR p.email LIKE ? OR p.phone LIKE ?)'; $like = '%' . $_GET['q'] . '%'; array_push($par, $like, $like, $like); }
    $where = implode(' AND ', $w);
    $total = (int) one($db, "SELECT COUNT(*) c FROM partners_partners p LEFT JOIN fos_partner_profiles f ON f.partner_id = p.id WHERE $where", $par)['c'];
    $rows = q($db, "SELECT p.id, p.name, p.email, p.phone, p.city, p.job_title, f.primary_type, f.status, f.designation, f.vendor_category, f.team_ids, c.name AS country,
        (SELECT COUNT(*) FROM users u WHERE u.partner_id = p.id) AS users, (SELECT COUNT(*) FROM users u WHERE u.partner_id = p.id AND u.is_active = 1) AS users_active
        FROM partners_partners p LEFT JOIN fos_partner_profiles f ON f.partner_id = p.id LEFT JOIN countries c ON c.id = p.country_id
        WHERE $where ORDER BY p.name LIMIT $per OFFSET " . (($page - 1) * $per), $par);
    $counts = q($db, 'SELECT f.primary_type t, COUNT(*) c FROM partners_partners p LEFT JOIN fos_partner_profiles f ON f.partner_id = p.id WHERE p.deleted_at IS NULL GROUP BY 1');
    out(['total' => $total, 'page' => $page, 'per' => $per, 'rows' => $rows, 'counts' => array_column($counts, 'c', 't')]);
}
if ($r === 'contact') {
    $id = (int) ($_GET['id'] ?? 0);
    $p = one($db, 'SELECT * FROM partners_partners WHERE id = ?', [$id]);
    if (!$p) { out(['error' => 'not found'], 404); }
    $draft = one($db, 'SELECT payload FROM proto_form_drafts WHERE partner_id = ? ORDER BY id DESC LIMIT 1', [$id]);
    out([
        'partner' => $p,
        'profile' => one($db, 'SELECT * FROM fos_partner_profiles WHERE partner_id = ?', [$id]),
        'users' => q($db, 'SELECT id, name, email, username, is_active FROM users WHERE partner_id = ? OR id = ?', [$id, (int) $p['user_id']]),
        'affiliations' => q($db, 'SELECT * FROM fos_affiliations WHERE partner_id = ?', [$id]),
        'assets' => q($db, 'SELECT * FROM fos_assets WHERE partner_id = ?', [$id]),
        'documents' => q($db, "SELECT id, name, file_name, mime_type, size, custom_properties, created_at FROM media WHERE model_type = 'partner' AND model_id = ? ORDER BY id", [$id]),
        'extra' => $draft ? json_decode($draft['payload'], true) : null,
    ]);
}
if ($r === 'users') {
    $w = ['u.deleted_at IS NULL']; $par = [];
    if (isset($_GET['active']) && $_GET['active'] !== '') { $w[] = 'u.is_active = ?'; $par[] = (int) $_GET['active']; }
    if (!empty($_GET['q'])) { $w[] = '(u.name LIKE ? OR u.email LIKE ?)'; $like = '%' . $_GET['q'] . '%'; array_push($par, $like, $like); }
    out(q($db, 'SELECT u.id, u.name, u.email, u.is_active, u.partner_id, (SELECT GROUP_CONCAT(t.name, ", ") FROM user_team ut JOIN teams t ON t.id = ut.team_id WHERE ut.user_id = u.id) AS teams, (SELECT GROUP_CONCAT(r.name, ", ") FROM model_has_roles m JOIN roles r ON r.id = m.role_id WHERE m.model_id = u.id) AS roles FROM users u WHERE ' . implode(' AND ', $w) . ' ORDER BY u.name LIMIT 200', $par));
}
if ($r === 'dashboard') {
    $counts = q($db, 'SELECT f.primary_type t, COUNT(*) c FROM partners_partners p LEFT JOIN fos_partner_profiles f ON f.partner_id = p.id WHERE p.deleted_at IS NULL GROUP BY 1');
    $latest = q($db, 'SELECT p.id, p.name, p.email, p.created_at, f.primary_type FROM partners_partners p LEFT JOIN fos_partner_profiles f ON f.partner_id = p.id WHERE p.deleted_at IS NULL ORDER BY p.id DESC LIMIT 6');
    $onb = one($db, "SELECT SUM(status='pending') pending, SUM(status='inactive') inactive FROM fos_partner_profiles WHERE primary_type = 'vendor'");
    out(['counts' => array_column($counts, 'c', 't'), 'latest' => $latest, 'vendor_pending' => (int) ($onb['pending'] ?? 0), 'vendor_inactive' => (int) ($onb['inactive'] ?? 0), 'docs_pending' => (int) one($db, "SELECT COUNT(*) c FROM media WHERE model_type = 'partner' AND custom_properties LIKE '%\"pending\"%'")['c'], 'users_inactive' => (int) one($db, 'SELECT COUNT(*) c FROM users WHERE is_active = 0 AND deleted_at IS NULL')['c']]);
}
if ($r === 'assets') {
    $w = ['1=1']; $par = [];
    if (!empty($_GET['q'])) { $w[] = '(a.asset_tag LIKE ? OR a.brand_model LIKE ? OR a.serial_number LIKE ?)'; $like = '%' . $_GET['q'] . '%'; array_push($par, $like, $like, $like); }
    out(q($db, 'SELECT a.*, p.name AS assigned_to FROM fos_assets a LEFT JOIN partners_partners p ON p.id = a.partner_id WHERE ' . implode(' AND ', $w) . ' ORDER BY a.asset_tag LIMIT 200', $par));
}
if ($r === 'organisations') { out(q($db, 'SELECT o.*, c.name AS country FROM fos_organisations o LEFT JOIN countries c ON c.id = o.country_id ORDER BY o.name')); }
if ($r === 'affiliation_taxonomies') { out(q($db, 'SELECT * FROM fos_affiliation_taxonomies ORDER BY category, sort_order, name')); }
if ($r === 'rules') { out(q($db, 'SELECT * FROM fos_field_visibility_rules ORDER BY "group", COALESCE("order", 999), id')); }
if ($r === 'setting_get') { $row = one($db, 'SELECT v FROM proto_settings WHERE k = ?', [$_GET['k'] ?? '']); out(['value' => $row['v'] ?? null]); }
if ($r === 'audit') { out(q($db, 'SELECT * FROM proto_audit ORDER BY id DESC LIMIT 100')); }
if ($r === 'document_file') {
    $row = one($db, 'SELECT file_name, mime_type, custom_properties FROM media WHERE id = ?', [(int) ($_GET['id'] ?? 0)]);
    $cp = json_decode((string) ($row['custom_properties'] ?? '{}'), true) ?: [];
    $path = isset($cp['stored']) ? realpath(__DIR__ . '/uploads/' . $cp['stored']) : false;
    if (!$row || !$path || strpos($path, realpath(__DIR__ . '/uploads')) !== 0) { http_response_code(404); echo json_encode(['error' => 'no file']); exit; }
    header('Content-Type: ' . ($row['mime_type'] ?: 'application/octet-stream'));
    header('Content-Disposition: inline; filename="' . str_replace('"', '', (string) $row['file_name']) . '"');
    readfile($path); exit;
}
if ($r === 'doc_centre') {
    $req = q($db, 'SELECT section, doc_type, label FROM fos_required_documents WHERE is_active = 1 AND required = 1');
    $w = ['p.deleted_at IS NULL']; $par = [];
    if (!empty($_GET['type'])) { $w[] = 'f.primary_type = ?'; $par[] = $_GET['type']; }
    if (!empty($_GET['q'])) { $w[] = '(p.name LIKE ? OR p.email LIKE ?)'; $like = '%' . $_GET['q'] . '%'; array_push($par, $like, $like); }
    $partners = q($db, 'SELECT p.id, p.name, f.primary_type FROM partners_partners p LEFT JOIN fos_partner_profiles f ON f.partner_id = p.id WHERE ' . implode(' AND ', $w) . ' ORDER BY p.name LIMIT 300', $par);
    $rows = [];
    foreach ($partners as $p) {
        $docs = q($db, "SELECT custom_properties FROM media WHERE model_type = 'partner' AND model_id = ?", [$p['id']]);
        $have = []; $st = ['pending' => 0, 'approved' => 0, 'rejected' => 0, 'expired' => 0];
        foreach ($docs as $d) { $cp = json_decode((string) $d['custom_properties'], true) ?: []; $have[strtolower((string) ($cp['doc_type'] ?? ''))] = true; $s2 = $cp['review_status'] ?? 'pending'; if (isset($st[$s2])) { $st[$s2]++; } }
        $needs = in_array($p['primary_type'], ['vendor', 'partner'], true);
        $missing = $needs ? array_values(array_map(fn ($x) => $x['label'], array_filter($req, fn ($x) => empty($have[strtolower($x['label'])]) && empty($have[strtolower($x['doc_type'])])))) : [];
        $rows[] = ['id' => $p['id'], 'name' => $p['name'], 'type' => $p['primary_type'], 'documents' => count($docs), 'missing' => $missing, 'expired' => $st['expired'], 'pending' => $st['pending'], 'rejected' => $st['rejected'], 'approved' => $st['approved']];
    }
    $show = $_GET['show'] ?? 'missing';
    $rows = array_values(array_filter($rows, fn ($x) => match ($show) { 'missing' => count($x['missing']) > 0, 'expired' => $x['expired'] > 0, 'pending' => $x['pending'] > 0, 'rejected' => $x['rejected'] > 0, default => true }));
    out(['total' => count($rows), 'required' => count($req), 'rows' => array_slice($rows, 0, 100)]);
}

// ---------------------------------------------------------------- writes
$alias = [
    'companyName' => 'name', 'stateId' => 'state_id', 'countryId' => 'country_id', 'taxId' => 'tax_id', 'zip' => 'zip', 'jobTitle' => 'job_title',
    'industryId' => 'industry_id', 'titleId' => 'title_id', 'comment' => 'comment', 'registrationNumber' => 'registration_number',
    'firstName' => 'name', 'phoneDialCode' => null,
];
if ($r === 'contact_save') {
    $type = (string) ($body['type'] ?? 'vendor'); if ($type === 'employee') { $type = 'staff'; }
    $data = (array) ($body['data'] ?? []);
    $id = (int) ($body['id'] ?? 0);
    $pc = cols($db, 'partners_partners'); $fc = cols($db, 'fos_partner_profiles');
    $p = []; $f = []; $extra = [];
    foreach ($data as $k => $v) {
        if (is_array($v) && !in_array($k, ['socialLinks'], true)) { $extra[$k] = $v; if (in_array($k, ['vendorCategory', 'partnerCategory', 'teamIds'], true)) { $f[snake($k)] = json_encode($v); } continue; }
        if (is_array($v)) { $v = json_encode($v); }
        $col = array_key_exists($k, $alias) ? $alias[$k] : snake($k);
        if ($col === null) { $extra[$k] = $v; continue; }
        if ($k === 'registrationNumber') { $p['company_registry'] = $v; }
        if (in_array($col, $pc, true) && $col !== 'id') { $p[$col] = $v; }
        if (in_array($col, $fc, true) && $col !== 'partner_id') { $f[$col] = $v; }
        if (!in_array($col, $pc, true) && !in_array($col, $fc, true)) { $extra[$k] = $v; }
    }
    if (isset($data['firstName']) || isset($data['surname'])) { $p['name'] = trim(($data['firstName'] ?? '') . ' ' . ($data['surname'] ?? '')) ?: ($p['name'] ?? ''); }
    if (empty($p['name']) && !$id) { out(['error' => 'Name is required', 'field' => 'companyName'], 422); }
    $isCo = in_array($type, ['vendor', 'partner', 'customer'], true) || !empty($data['companyName']);
    $now = date('Y-m-d H:i:s');
    $db->beginTransaction();
    if ($id) {
        $sets = []; $vals = [];
        foreach ($p as $c => $v) { $sets[] = "\"$c\" = ?"; $vals[] = $v; }
        $sets[] = 'updated_at = ?'; $vals[] = $now; $vals[] = $id;
        q($db, 'UPDATE partners_partners SET ' . implode(', ', $sets) . ' WHERE id = ?', $vals);
    } else {
        $p['account_type'] = $isCo ? 'company' : 'individual'; $p['created_at'] = $now; $p['updated_at'] = $now;
        if ($type === 'vendor') { $p['supplier_rank'] = 1; } if ($type === 'customer') { $p['customer_rank'] = 1; }
        q($db, 'INSERT INTO partners_partners ("' . implode('","', array_keys($p)) . '") VALUES (' . implode(',', array_fill(0, count($p), '?')) . ')', array_values($p));
        $id = (int) $db->lastInsertId();
    }
    $f['primary_type'] = $f['primary_type'] ?? $type; $f['updated_at'] = $now; if (isset($f['status'])) { $f['status'] = strtolower((string) $f['status']); }
    if (one($db, 'SELECT partner_id FROM fos_partner_profiles WHERE partner_id = ?', [$id])) {
        $sets = []; $vals = [];
        foreach ($f as $c => $v) { $sets[] = "\"$c\" = ?"; $vals[] = $v; }
        $vals[] = $id;
        q($db, 'UPDATE fos_partner_profiles SET ' . implode(', ', $sets) . ' WHERE partner_id = ?', $vals);
    } else {
        $f['partner_id'] = $id; $f['status'] = strtolower((string) ($f['status'] ?? 'pending')); $f['created_at'] = $now;
        q($db, 'INSERT INTO fos_partner_profiles ("' . implode('","', array_keys($f)) . '") VALUES (' . implode(',', array_fill(0, count($f), '?')) . ')', array_values($f));
    }
    // repeaters that have a real table
    foreach (['affiliations' => 'fos_affiliations', 'assets' => 'fos_assets'] as $key => $tbl) {
        if (!isset($extra[$key])) { continue; }
        $tc = cols($db, $tbl); q($db, "DELETE FROM $tbl WHERE partner_id = ?", [$id]);
        foreach ((array) $extra[$key] as $row) {
            $rr = ['partner_id' => $id, 'created_at' => $now, 'updated_at' => $now];
            foreach ((array) $row as $k => $v) { $c = snake((string) $k); if (!in_array($c, $tc, true)) { $c = preg_replace('/^(affiliation|asset)_/', '', $c); } if (in_array($c, $tc, true) && $c !== 'id') { $rr[$c] = is_array($v) ? json_encode($v) : $v; } }
            if ($key === 'assets' && empty($rr['asset_tag'])) { $rr['asset_tag'] = 'AST-' . $id . '-' . substr((string) microtime(true), -5); }
            q($db, "INSERT INTO $tbl (\"" . implode('","', array_keys($rr)) . '") VALUES (' . implode(',', array_fill(0, count($rr), '?')) . ')', array_values($rr));
        }
        unset($extra[$key]);
    }
    if ($extra) { q($db, 'INSERT INTO proto_form_drafts (partner_id, type, step, payload, updated_at) VALUES (?,?,?,?,?)', [$id, $type, (int) ($body['step'] ?? 0), json_encode($extra), $now]); }
    $db->commit();
    audit($db, $actor, empty($body['id']) ? 'contact.create' : 'contact.update', 'partner:' . $id, ['type' => $type, 'step' => $body['step'] ?? null]);
    out(['ok' => true, 'id' => $id]);
}
if ($r === 'contact_status') {
    $id = (int) ($body['id'] ?? 0); $status = (string) ($body['status'] ?? '');
    if (!in_array($status, ['active', 'pending', 'inactive'], true)) { out(['error' => 'bad status'], 422); }
    $db->beginTransaction();
    q($db, 'UPDATE fos_partner_profiles SET status = ?, updated_at = ? WHERE partner_id = ?', [$status, date('Y-m-d H:i:s'), $id]);
    $affected = 0;
    if (!empty($body['cascade_users'])) {
        $s = $db->prepare('UPDATE users SET is_active = ? WHERE partner_id = ? OR id = (SELECT user_id FROM partners_partners WHERE id = ?)');
        $s->execute([$status === 'inactive' ? 0 : 1, $id, $id]); $affected = $s->rowCount();
    }
    $db->commit();
    audit($db, $actor, 'contact.status', 'partner:' . $id, ['status' => $status, 'users_changed' => $affected]);
    out(['ok' => true, 'status' => $status, 'users_changed' => $affected]);
}
if ($r === 'user_active') {
    $uid = (int) ($body['user_id'] ?? 0); $on = !empty($body['active']) ? 1 : 0;
    q($db, 'UPDATE users SET is_active = ? WHERE id = ?', [$on, $uid]);
    audit($db, $actor, $on ? 'user.activate' : 'user.deactivate', 'user:' . $uid);
    out(['ok' => true, 'active' => $on]);
}
if ($r === 'document_upload') {
    $pid = (int) ($_POST['partner_id'] ?? 0); $type = (string) ($_POST['doc_type'] ?? 'document');
    if (!$pid || empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) { out(['error' => 'partner_id and file are required'], 422); }
    $f = $_FILES['file']; $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'], true) || $f['size'] > 10 * 1024 * 1024) { out(['error' => 'pdf, image, doc or xls up to 10 MB'], 422); }
    $dir = __DIR__ . '/uploads/' . $pid; if (!is_dir($dir)) { mkdir($dir, 0777, true); }
    $stored = bin2hex(random_bytes(8)) . '.' . $ext; move_uploaded_file($f['tmp_name'], $dir . '/' . $stored);
    q($db, "INSERT INTO media (model_type, model_id, uuid, collection_name, name, file_name, mime_type, disk, size, custom_properties, created_at, updated_at) VALUES ('partner', ?, ?, 'documents', ?, ?, ?, 'proto', ?, ?, ?, ?)",
        [$pid, bin2hex(random_bytes(8)), $type, $f['name'], $f['type'], $f['size'], json_encode(['doc_type' => $type, 'review_status' => 'pending', 'stored' => $pid . '/' . $stored]), date('Y-m-d H:i:s'), date('Y-m-d H:i:s')]);
    audit($db, $actor, 'document.upload', 'partner:' . $pid, ['doc_type' => $type, 'file' => $f['name']]);
    out(['ok' => true, 'id' => (int) $db->lastInsertId()]);
}
if ($r === 'document_review') {
    $mid = (int) ($body['id'] ?? 0); $st = (string) ($body['status'] ?? '');
    if (!in_array($st, ['pending', 'approved', 'rejected', 'expired'], true)) { out(['error' => 'bad status'], 422); }
    $row = one($db, 'SELECT custom_properties FROM media WHERE id = ?', [$mid]); $cp = json_decode((string) ($row['custom_properties'] ?? '{}'), true) ?: [];
    $cp['review_status'] = $st; q($db, 'UPDATE media SET custom_properties = ? WHERE id = ?', [json_encode($cp), $mid]);
    audit($db, $actor, 'document.review', 'media:' . $mid, ['status' => $st]);
    out(['ok' => true]);
}
if ($r === 'type_labels') {
    q($db, "INSERT OR REPLACE INTO proto_settings (k, v) VALUES ('type_labels', ?)", [json_encode($body['labels'] ?? null)]);
    audit($db, $actor, 'settings.type_labels', 'settings'); out(['ok' => true]);
}
if ($r === 'rule_save') {
    $types = array_values(array_intersect((array) ($body['contact_types'] ?? []), ['staff', 'individual', 'vendor', 'customer', 'partner', 'driver', 'other']));
    q($db, 'UPDATE fos_field_visibility_rules SET contact_types = ?, updated_at = ? WHERE id = ?', [json_encode($types), date('Y-m-d H:i:s'), (int) ($body['id'] ?? 0)]);
    audit($db, $actor, 'settings.rule', 'rule:' . (int) ($body['id'] ?? 0), $types); out(['ok' => true]);
}
if ($r === 'rule_move') {
    $row = one($db, 'SELECT id, "order" o FROM fos_field_visibility_rules WHERE id = ?', [(int) ($body['id'] ?? 0)]);
    if ($row) { $n = max(1, (int) ($row['o'] ?? 1) + ((int) ($body['dir'] ?? 0))); q($db, 'UPDATE fos_field_visibility_rules SET "order" = ? WHERE id = ?', [$n, $row['id']]); audit($db, $actor, 'settings.rule_order', 'rule:' . $row['id'], ['order' => $n]); }
    out(['ok' => true]);
}
if ($r === 'setting_set') {
    $k = (string) ($body['k'] ?? ''); if (!in_array($k, ['default_country'], true)) { out(['error' => 'unknown setting'], 422); }
    q($db, 'INSERT OR REPLACE INTO proto_settings (k, v) VALUES (?, ?)', [$k, (string) ($body['v'] ?? '')]); audit($db, $actor, 'settings.' . $k, 'settings', $body['v'] ?? null); out(['ok' => true]);
}
// generic settings lists (whitelisted)
$lists = [
    'banks' => ['banks', ['name', 'code']], 'titles' => ['partners_titles', ['name', 'short_name']], 'tags' => ['partners_tags', ['name', 'color']],
    'departments' => ['fos_departments', ['name', 'parent_id', 'color']], 'teams' => ['fos_teams', ['name', 'description', 'team_lead_user_id']],
    'picklist' => ['fos_picklist_options', ['category', 'value', 'sort_order', 'is_active']], 'custom_fields' => ['fos_custom_fields', ['code', 'label', 'type', 'options', 'default_value', 'required', 'visible']],
    'organisations' => ['fos_organisations', ['name', 'description', 'email', 'phone', 'website', 'color', 'founded_date', 'currency_id', 'parent_id', 'street1', 'street2', 'city', 'zip', 'state_id', 'country_id', 'is_active']],
    'affiliation_taxonomies' => ['fos_affiliation_taxonomies', ['category', 'name', 'description', 'sort_order', 'is_active']],
    'assets' => ['fos_assets', ['asset_tag', 'asset_type', 'brand_model', 'serial_number', 'status', 'location', 'partner_id', 'notes']],
    'required_documents' => ['fos_required_documents', ['section', 'doc_type', 'label', 'required', 'is_active', 'sort_order']],
];
if (preg_match('/^list_(add|update|delete)$/', $r, $m) && isset($lists[$body['list'] ?? ''])) {
    [$tbl, $allowed] = $lists[$body['list']]; $have = cols($db, $tbl); $now = date('Y-m-d H:i:s');
    $vals = array_filter((array) ($body['values'] ?? []), fn ($k) => in_array($k, $allowed, true) && in_array($k, $have, true), ARRAY_FILTER_USE_KEY);
    if ($m[1] === 'add') {
        if (in_array('created_at', $have, true)) { $vals['created_at'] = $now; } if (in_array('updated_at', $have, true)) { $vals['updated_at'] = $now; }
        q($db, "INSERT INTO $tbl (\"" . implode('","', array_keys($vals)) . '") VALUES (' . implode(',', array_fill(0, count($vals), '?')) . ')', array_values($vals));
        audit($db, $actor, 'settings.add', $body['list'], $vals); out(['ok' => true, 'id' => (int) $db->lastInsertId()]);
    }
    $rid = (int) ($body['id'] ?? 0);
    if ($m[1] === 'delete') { q($db, "DELETE FROM $tbl WHERE id = ?", [$rid]); audit($db, $actor, 'settings.delete', $body['list'] . ':' . $rid); out(['ok' => true]); }
    $sets = []; $pv = []; foreach ($vals as $c => $v) { $sets[] = "\"$c\" = ?"; $pv[] = $v; } $pv[] = $rid;
    if ($sets) { q($db, "UPDATE $tbl SET " . implode(', ', $sets) . ' WHERE id = ?', $pv); }
    audit($db, $actor, 'settings.update', $body['list'] . ':' . $rid, $vals); out(['ok' => true]);
}
out(['error' => 'unknown route'], 404);
