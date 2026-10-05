/* ===== Admin page standards: breadcrumb on every page, KPI strip where missing ===== */
const ADMIN_KPIS = {
  assessment:[['Pending reviews','7','orange'],['Avg. score','82%','green'],['Overdue','1','red'],['Approved this month','9','purple']],
  hse:[['Courses','12','purple'],['Certified vendors','38','green'],['Expiring (30d)','5','orange'],['Test pass rate','91%','blue']],
  clm:[['Active contracts','64','purple'],['Expiring (30d)','12','orange'],['Obligations due','9','red'],['Renewals this quarter','7','blue']],
  perf:[['Avg. score','86%','green'],['SLA breaches','3','red'],['Vendors at risk','4','orange'],['Improving','11','blue']],
  comms:[['Open threads','14','blue'],['Unassigned','3','orange'],['Avg. first response','2.1 h','green'],['SLA breaches','1','red']],
  integration:[['Active connectors','6','purple'],['Failed syncs (24h)','1','red'],['API calls (24h)','12.4k','blue'],['Active keys','5','green']],
  ai:[['Suggestions','9','purple'],['Accepted','71%','green'],['Documents read (OCR)','120','blue'],['Open alerts','3','orange']],
  workflow:[['Active rules','14','purple'],['Runs (7d)','238','blue'],['Failures','2','red'],['Hours saved (est.)','31','green']],
  builder:[['Forms','11','purple'],['Published','8','green'],['Drafts','3','orange'],['Submissions (30d)','420','blue']],
  admin:[['Users','56','purple'],['Roles','10','blue'],['Departments','8','green'],['Business units','3','orange']],
  support:[['Open tickets','3','orange'],['Avg. response','3.2 h','green'],['Satisfaction','94%','purple'],['Knowledge articles','42','blue']],
  docs:[['In queue','14','orange'],['Expiring (30d)','4','red'],['Verified this month','37','green'],['Avg. review time','1.8 d','blue']],
  reg:[['In progress','4','orange'],['Submitted this month','11','blue'],['Approved this month','9','green'],['Avg. days to approve','6.5','purple']],
  finance:[['Invoices pending','42','orange'],['Matched','128','green'],['Disputed','3','red'],['Paid (30d)','₦38.2m','purple']]
};
function ensureCrumb(id){
  const pg = document.getElementById('page-'+id); if(!pg || pg.querySelector('.page-breadcrumb')) return;
  const nav = document.querySelector('.nav-item[data-page="'+id+'"]'); const sec = nav && nav.closest('.nav-section'); const st = sec && sec.querySelector('.nav-section-title');
  const title = pg.querySelector('.page-title'); const t = title ? title.textContent.trim() : id;
  const mid = st ? st.childNodes[0].textContent.trim() : '';
  const el = document.createElement('div'); el.className = 'page-breadcrumb';
  el.innerHTML = '<i data-lucide="home"></i><span>Home</span>'+(mid&&mid!==t?'<i data-lucide="chevron-right"></i><span>'+mid+'</span>':'')+'<i data-lucide="chevron-right"></i><span>'+t.replace(/&/g,'&amp;')+'</span>';
  pg.insertBefore(el, pg.firstChild); paintIcons(el);
}
function ensureKpis(id){
  const pg = document.getElementById('page-'+id); const data = ADMIN_KPIS[id]; if(!pg || !data || pg.querySelector('.kpis')) return;
  const hdr = pg.querySelector(':scope > .page-header'); if(!hdr) return;
  const el = document.createElement('div'); el.className = 'kpis kpis-4';
  el.innerHTML = data.map(k=>'<div class="kpi accent-'+k[2]+'"><div class="kpi-label">'+k[0]+'</div><div class="kpi-val">'+k[1]+'</div></div>').join('');
  hdr.after(el);
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.page').forEach(p=>{ const id = p.id.replace('page-',''); ensureKpis(id); });
  const _show = showPage;
  showPage = function(id){ _show(id); setTimeout(()=>ensureCrumb(id), 260); };
  ensureCrumb('dashboard');
});
document.addEventListener('DOMContentLoaded', ()=>{
  const sel = document.getElementById('rqType');
  sel.innerHTML = Object.keys(VF_REQ_TYPES).map(t=>'<option>'+t+'</option>').join('');
  vfRqRoute();
  vfRender();
});

