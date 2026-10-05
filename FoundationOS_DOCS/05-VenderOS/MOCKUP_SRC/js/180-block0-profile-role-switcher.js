/* ---------- Profile role switcher ---------- */
const ROLES = {
  executive:  {name:'Karabo E.',   avatar:'KE', landing:'dashboard', label:'Executive',        title:'Chief Executive Officer',      dept:'Executive Office',        company:'VendorOS Enterprise', desc:'Executive — company-wide KPIs, risk and spend overview'},
  vendor:     {name:'Thabo M.',    avatar:'TM', landing:'dashboard', label:'Vendor Admin',     title:'Vendor Onboarding Coordinator', dept:'Procurement',             company:'VendorOS Enterprise', reportsTo:'the CEO', desc:'Vendor Admin — registration, passports, onboarding'},
  procurement:{name:'Boitumelo P.',avatar:'BP', landing:'dashboard', label:'Procurement User', title:'Procurement Officer',           dept:'Procurement',             company:'VendorOS Enterprise', reportsTo:'the Procurement Manager', desc:'Procurement User — RFQs, POs and supplier sourcing'},
  finance:    {name:'Naledi F.',   avatar:'NF', landing:'dashboard', label:'Finance',          title:'Finance Officer',               dept:'Finance',                 company:'VendorOS Enterprise', reportsTo:'the CFO', desc:'Finance — invoices, payments, credit control'},
  audit:      {name:'Onalenna A.', avatar:'OA', landing:'dashboard', label:'Audit',            title:'Compliance Auditor',            dept:'Audit &amp; Compliance',  company:'VendorOS Enterprise', reportsTo:'the Head of Compliance', desc:'Audit — compliance findings and governance'},
  warehouse:  {name:'Warona W.',   avatar:'WW', landing:'dashboard', label:'Warehouse',        title:'Warehouse Supervisor',          dept:'Warehouse &amp; Logistics',company:'VendorOS Enterprise', reportsTo:'the Operations Manager', desc:'Warehouse — deliveries, receiving and quality'},
  useradmin:  {name:'Kagiso U.',   avatar:'KU', landing:'dashboard', label:'User Admin',       title:'System Administrator',          dept:'IT Administration',       company:'VendorOS Enterprise', reportsTo:'the CTO', desc:'User Admin — users, roles, system configuration'},
  superadmin: {name:'Refilwe S.',  avatar:'RS', landing:'dashboard', label:'Super Admin',      title:'Super Administrator',           dept:'Platform Operations',     company:'VendorOS Enterprise', reportsTo:'the CEO', desc:'Super Admin — full unrestricted access to every module'},
  vendorportal:{name:'David K.',   avatar:'DK', landing:'dashboard', label:'Vendor (Portal)',  title:'Company Representative',        dept:'Supplier Account',        company:'Kalahari Logistics (Pty) Ltd', desc:'Vendor Portal — your own company profile, RFQs, invoices and training'}
};
const ROLE_SECTIONS = {
  executive:   ['dashboard','vendor','hse','procurement','financeperf','collab'],
  vendor:      ['dashboard','vendor','hse','collab'],
  procurement: ['dashboard','vendor','procurement','financeperf'],
  finance:     ['dashboard','vendor','financeperf'],
  audit:       ['dashboard','vendor','hse'],
  warehouse:   ['dashboard','procurement'],
  useradmin:   ['dashboard','admin'],
  superadmin:  ['dashboard','vendor','hse','procurement','financeperf','collab','automation','admin'],
  vendorportal:['vendorhub']
};
function applyRoleSections(role){
  const allowed = ROLE_SECTIONS[role] || [];
  document.querySelectorAll('.nav-section[data-section]').forEach(s=>{
    s.style.display = allowed.includes(s.dataset.section) ? '' : 'none';
  });
  // Vendor Portal role: within Collaboration, hide the internal Communication tool —
  // an external vendor only sees their own Self-Service Portal, not staff messaging.
  document.querySelectorAll('[data-hide-roles]').forEach(n=>{ n.style.display = n.dataset.hideRoles.split(',').includes(role) ? 'none' : ''; });
  const commsItem = document.querySelector('.nav-item[data-page="comms"]');
  if(commsItem) commsItem.style.display = (role === 'vendorportal') ? 'none' : '';
}
function updateHeroWelcome(role){
  const r = ROLES[role];
  const h1 = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSub');
  if(h1) h1.innerHTML = 'Welcome back, ' + r.name.split(' ')[0] + ' <span>&middot; ' + r.label + '</span>';
  if(sub){
    let line = r.title + ', ' + r.dept + ' &mdash; ' + r.company;
    if(r.reportsTo) line += ' (reports to ' + r.reportsTo + ')';
    sub.innerHTML = line + '. Your sidebar and dashboard below are filtered to this role.';
  }
}
function toggleRoleMenu(){ document.getElementById('roleMenu').classList.toggle('open'); }
function switchRole(role, el){
  const r = ROLES[role];
  document.getElementById('profileAvatar').textContent = r.avatar;
  document.getElementById('profileName').textContent = r.name;
  document.querySelectorAll('.role-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('roleMenu').classList.remove('open');
  applyRoleSections(role);
  updateHeroWelcome(role);
  const isVendor = role === 'vendorportal';
  document.getElementById('internalKpis').classList.toggle('hidden', isVendor);
  document.getElementById('vendorKpis').classList.toggle('hidden', !isVendor);
  document.getElementById('moduleGridSection').classList.toggle('hidden', isVendor);
  document.getElementById('internalDashGrid').classList.toggle('hidden', isVendor);
  document.getElementById('vendorDashGrid').classList.toggle('hidden', !isVendor);
  document.getElementById('editionStripSection').classList.toggle('hidden', isVendor);
  document.getElementById('heroActionsInternal').classList.toggle('hidden', isVendor);
  document.getElementById('heroActionsVendor').classList.toggle('hidden', !isVendor);
  document.getElementById('vendorJourney').classList.toggle('hidden', !isVendor);
  document.body.classList.toggle('vendor-mode', isVendor);
  document.getElementById('searchInput').placeholder = isVendor ? 'Search your documents, orders, invoices…' : 'Search vendors, RFQs, contracts, documents…';
  closeAllSlidePanels();
  showToast('Now viewing as '+r.desc+' — sidebar filtered to this role', 'user-plus');
  showPage(r.landing);
}
function showAllSections(){
  document.querySelectorAll('.nav-section[data-section]').forEach(s=>{ s.style.display=''; });
}
document.addEventListener('click', e=>{
  if(!e.target.closest('.role-menu') && !e.target.closest('.profile-btn')){
    const m = document.getElementById('roleMenu');
    if(m) m.classList.remove('open');
  }
});

