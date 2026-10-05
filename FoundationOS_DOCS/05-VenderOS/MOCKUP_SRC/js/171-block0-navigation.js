/* ---------- Navigation ---------- */
function showPage(id){
  const ws = document.getElementById('workspace');
  const sk = document.getElementById('skeleton');
  sk.classList.add('show');
  setTimeout(()=>{
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const pg = document.getElementById('page-'+id);
    if(pg) pg.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.querySelectorAll(`.nav-item[data-page="${id}"]`).forEach(n=>n.classList.add('active'));
    ws.scrollTop = 0;
    sk.classList.remove('show');
    if(window.innerWidth<=900){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.remove('show');}
  }, 220);
}
function navClick(el){
  const tier = el.dataset.tier;
  if(TIER_RANK[tier] > TIER_RANK[currentEdition]){
    showUpgradePrompt(tier, el.querySelector('.nav-label').textContent.trim());
    return;
  }
  showPage(el.dataset.page);
}

