/* ---------- Login overlay ---------- */
let pendingLoginRole = null;
function selectLoginCard(el, role){
  document.querySelectorAll('.login-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  pendingLoginRole = role;
  const r = ROLES[role];
  document.getElementById('loginNameField').value = r.name;
  document.getElementById('loginRoleField').value = r.label;
  document.getElementById('loginSubmitBtn').classList.add('ready');
}
function performLogin(){
  if(!pendingLoginRole) return;
  document.getElementById('loginOverlay').classList.add('hidden');
  const el = document.querySelector('.role-item[data-role="'+pendingLoginRole+'"]');
  if(el) switchRole(pendingLoginRole, el);
}
function showProductMatrix(){
  const matrix = document.getElementById('productMatrixPage');
  document.getElementById('loginOverlay').classList.add('hidden');
  matrix.classList.remove('hidden');
  matrix.setAttribute('aria-hidden','false');
  matrix.scrollTop = 0;
  paintIcons(matrix);
}
let implementationMapFromLogin = false;
function showImplementationMap(){
  const login = document.getElementById('loginOverlay');
  const map = document.getElementById('implementationMapPage');
  implementationMapFromLogin = !login.classList.contains('hidden');
  if(implementationMapFromLogin) login.classList.add('hidden');
  map.classList.remove('hidden');
  map.setAttribute('aria-hidden','false');
  map.scrollTop = 0;
  filterImplementationMapRows();
  paintIcons(map);
}
function closeImplementationMap(){
  const map = document.getElementById('implementationMapPage');
  map.classList.add('hidden');
  map.setAttribute('aria-hidden','true');
  if(implementationMapFromLogin) document.getElementById('loginOverlay').classList.remove('hidden');
}
function filterImplementationMapRows(){
  const table = document.getElementById('implementationMapTable');
  if(!table) return;
  const query = (document.getElementById('implementationMapSearch').value || '').trim().toLowerCase();
  const scope = document.getElementById('implementationMapScope').value;
  const status = document.getElementById('implementationMapStatus').value;
  const rows = [...table.querySelectorAll('tbody tr')];
  let visible = 0;
  const counts = {existing:0, partial:0, needed:0};
  rows.forEach(row=>{
    const matches = (scope === 'all' || row.dataset.mapScope === scope)
      && (status === 'all' || row.dataset.mapStatus === status)
      && (!query || row.textContent.toLowerCase().includes(query));
    row.hidden = !matches;
    if(matches){visible++;counts[row.dataset.mapStatus]++;}
  });
  document.getElementById('mapVisibleCount').textContent = visible;
  document.getElementById('mapTotalCount').textContent = rows.length;
  document.getElementById('mapExistingCount').textContent = counts.existing;
  document.getElementById('mapPartialCount').textContent = counts.partial;
  document.getElementById('mapNeededCount').textContent = counts.needed;
}
function returnToLogin(){
  document.getElementById('productMatrixPage').classList.add('hidden');
  document.getElementById('productMatrixPage').setAttribute('aria-hidden','true');
  logout();
}
function toggleLoginTheme(){
  toggleGlobalTheme();
}
function logout(){
  document.getElementById('roleMenu').classList.remove('open');
  document.querySelectorAll('.login-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('loginNameField').value = '';
  document.getElementById('loginRoleField').value = '';
  document.getElementById('loginSubmitBtn').classList.remove('ready');
  pendingLoginRole = null;
  document.getElementById('loginOverlay').classList.remove('hidden');
}

