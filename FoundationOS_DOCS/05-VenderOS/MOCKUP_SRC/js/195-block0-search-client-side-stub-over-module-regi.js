/* ---------- Search (client-side stub over module registry) ---------- */
document.getElementById('searchInput').addEventListener('input', function(){
  const q = this.value.trim().toLowerCase();
  if(q.length<2) return;
  const hit = MODULES.find(m=>m.name.toLowerCase().includes(q));
  if(hit){
    if(TIER_RANK[hit.tier] > TIER_RANK[currentEdition]){ showUpgradePrompt(hit.tier, hit.name); }
    else { showPage(hit.page); }
    this.value='';
  }
});
document.getElementById('searchInput').addEventListener('keydown', e=>{
  if(e.key==='Enter') e.target.dispatchEvent(new Event('input'));
});

