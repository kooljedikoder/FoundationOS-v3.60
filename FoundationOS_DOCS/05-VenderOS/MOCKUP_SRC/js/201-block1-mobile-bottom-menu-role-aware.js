/* ===== Mobile bottom menu (role-aware) ===== */
const BN = {
  vendorportal:[['Home','layout-dashboard','myhome'],['Documents','folder','mydocuments'],['Orders','shopping-cart','myrfqpo'],['Invoices','banknote','myinvoices'],['More','menu',null]],
  vendor:[['Home','layout-dashboard','dashboard'],['Register','user-plus','reg'],['Documents','folder','docs'],['Inbox','message-square','comms'],['More','menu',null]],
  procurement:[['Home','layout-dashboard','dashboard'],['Procure','shopping-cart','procurement'],['Vendors','user-plus','reg'],['Finance','banknote','finance'],['More','menu',null]],
  finance:[['Home','layout-dashboard','dashboard'],['Finance','banknote','finance'],['Perf','gauge','perf'],['Vendors','user-plus','reg'],['More','menu',null]],
  audit:[['Home','layout-dashboard','dashboard'],['Audit','scale','audit'],['Risk','alert-triangle','erm'],['Docs','folder','docs'],['More','menu',null]],
  warehouse:[['Home','layout-dashboard','dashboard'],['Receiving','warehouse','warehouse'],['Procure','shopping-cart','procurement'],['More','menu',null]],
  useradmin:[['Home','layout-dashboard','dashboard'],['Admin','settings','admin'],['Help','help-circle','support'],['More','menu',null]],
  executive:[['Home','layout-dashboard','dashboard'],['Vendors','user-plus','reg'],['Procure','shopping-cart','procurement'],['Perf','gauge','perf'],['More','menu',null]],
  superadmin:[['Home','layout-dashboard','dashboard'],['Vendors','user-plus','reg'],['Procure','shopping-cart','procurement'],['Inbox','message-square','comms'],['More','menu',null]]
};
window.currentRole = window.currentRole || 'vendor';
function buildBottomNav(role){
  const nav = document.getElementById('bottomNav'); const items = BN[role] || BN.vendor; window.currentRole = role;
  nav.innerHTML = items.map(it=>'<button type="button" data-bn="'+(it[2]||'more')+'" aria-label="'+it[0]+'" onclick="bnGo(\''+(it[2]||'')+'\')"><i data-lucide="'+it[1]+'"></i><span>'+it[0]+'</span></button>').join('');
  paintIcons(nav); updateBottomBadges(); bnActive();
}
function bnGo(page){
  if(!page){ const sb = document.getElementById('sidebar'); const open = sb.classList.toggle('open'); document.getElementById('overlay').classList.toggle('show', open); return; }
  document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); showPage(page);
}
function bnActive(){
  const pg = document.querySelector('.page.active'); const id = pg ? pg.id.replace('page-','') : ''; let hit = false;
  document.querySelectorAll('#bottomNav button').forEach(b=>{ const on = b.dataset.bn === id; b.classList.toggle('active', on); if(on) hit = true; });
  const more = document.querySelector('#bottomNav button[data-bn=more]'); if(more && !hit) more.classList.add('active');
}
function updateBottomBadges(){
  document.querySelectorAll('#bottomNav .bn-badge').forEach(b=>b.remove());
  const n = document.getElementById('navDocsCount'); const btn = document.querySelector('#bottomNav button[data-bn=mydocuments]');
  if(n && btn && window.currentRole==='vendorportal' && n.style.display!=='none' && n.textContent.trim()){ const b = document.createElement('span'); b.className = 'bn-badge'; b.textContent = n.textContent.trim(); btn.appendChild(b); }
}
document.addEventListener('DOMContentLoaded', ()=>{
  const _sw = switchRole; switchRole = function(role, el){ _sw(role, el); buildBottomNav(role); applyDataMap(); };
  const _sp = showPage; showPage = function(id){ _sp(id); setTimeout(()=>{ bnActive(); applyDataMap(); }, 280); };
  buildBottomNav('vendor');
});

function cccMode(on){
  const p = document.getElementById('page-ccc');
  p.classList.toggle('prop', !!on);
  document.getElementById('cccBtnToday').classList.toggle('on', !on);
  document.getElementById('cccBtnProp').classList.toggle('on', !!on);
}
function cccSub(el, id){
  const w = el.closest('.cf-t') || el.closest('.tab-panel') || el.closest('.page');
  w.querySelectorAll('.cc-subtab').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  w.querySelectorAll('.cc-sp').forEach(p=>p.classList.toggle('on', p.id===id));
}

const CC_PRESETS = {
  business:{individual:['Individual','Individuals'],employee:['Employee','Employees'],customer:['Customer','Customers'],partner:['Partner','Partners'],vendor:['Vendor','Vendors'],other:['Other','Other']},
  federal:{individual:['Citizen','Citizens'],employee:['Public Officer','Public Officers'],customer:['Agency','Agencies'],partner:['Partner Organisation','Partner Organisations'],vendor:['Contractor','Contractors'],other:['Other','Other']}
};
const CC_BASE = CC_PRESETS.business;
const _ccOrig = new WeakMap();
function cccLabelRead(){ const o={}; document.querySelectorAll('#cs-labels .cc-lab').forEach(i=>{ (o[i.dataset.k] = o[i.dataset.k] || ['','']) [i.dataset.f==='s'?0:1] = i.value.trim()||CC_BASE[i.dataset.k][i.dataset.f==='s'?0:1]; }); return o; }
function cccLabelRender(map){
  const page = document.getElementById('page-ccc'); if(!page) return;
  const pairs = []; Object.keys(CC_BASE).forEach(k=>{ const b=CC_BASE[k], n=map[k]||b; if(b[1]!==b[0]) pairs.push([b[1], n[1]]); pairs.push([b[0], n[0]]); });
  const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
  let node; while((node = walker.nextNode())){
    if(!_ccOrig.has(node)) _ccOrig.set(node, node.data);
    const orig = _ccOrig.get(node); let t = orig;
    if(node.parentElement && node.parentElement.closest('#cs-labels, script, style')) continue;
    const slots = [];
    pairs.forEach(([from,to])=>{ if(from==='Other'){ if(t.trim()==='Other'){ slots.push(to); t = t.replace('Other', '\u0001'+(slots.length-1)+'\u0002'); } return; } t = t.replace(new RegExp('\\b'+from+'\\b','g'), ()=>{ slots.push(to); return '\u0001'+(slots.length-1)+'\u0002'; }); });
    t = t.replace(/\u0001(\d+)\u0002/g, (m,i)=>slots[+i]);
    if(node.data!==t) node.data = t;
  }
}
function cccLabelApply(){
  const map = cccLabelRead(); cccLabelRender(map);
  try{ localStorage.setItem('ccLabels', JSON.stringify(map)); }catch(e){}
  document.getElementById('ccLabMsg').textContent = 'Labels applied across the Contact Control Center pages in this mockup.';
}
function cccLabelPreset(p){
  if(p==='custom') return;
  document.querySelectorAll('#cs-labels .cc-lab').forEach(i=>{ i.value = CC_PRESETS[p][i.dataset.k][i.dataset.f==='s'?0:1]; });
  cccLabelApply();
}
(function(){ try{ const m = JSON.parse(localStorage.getItem('ccLabels')||'null'); if(m){ document.querySelectorAll('#cs-labels .cc-lab').forEach(i=>{ if(m[i.dataset.k]) i.value = m[i.dataset.k][i.dataset.f==='s'?0:1]; }); cccLabelRender(m); document.getElementById('ccLabPreset').value='custom'; } }catch(e){} })();

function cccStep(i, delta){
  const steps = document.querySelectorAll('#cf13 .cc-step'); let cur = [...steps].findIndex(x=>x.classList.contains('on'));
  if(delta) i = Math.max(0, Math.min(steps.length-1, cur+delta));
  steps.forEach((x,k)=>x.classList.toggle('on', k===i));
  document.querySelectorAll('#cf13 .cc-spill').forEach((x,k)=>{ x.classList.toggle('on', k===i); if(k===i) x.scrollIntoView({block:'nearest',inline:'center'}); });
}
function cccAud(adm){
  document.getElementById('cf13').classList.toggle('adm', !!adm);
  document.getElementById('cfUser').classList.toggle('on', !adm);
  document.getElementById('cfAdm').classList.toggle('on', !!adm);
}
function cccType(el){
  document.querySelectorAll('#cf13 .cc-type').forEach(x=>x.classList.toggle('on', x===el));
  document.getElementById('cfTypeNote').textContent = el.dataset.ctype==='vendor' ? 'Fields on the Work step and elsewhere adapt to the type selected here.' : 'Field sets for this type follow in the next pass. The Vendor form is shown.';
}
