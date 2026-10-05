/* ---------- Edition gating ---------- */
function setEdition(tier){
  currentEdition = tier;
  document.getElementById('app').setAttribute('data-edition', tier);
  document.querySelectorAll('.edition-btn').forEach(b=>b.classList.toggle('active', b.dataset.edition===tier));
  const idx = {flex:0,core:1,plus:2}[tier];
  document.getElementById('editionPill').style.transform = `translateX(${idx*100}%)`;
  document.getElementById('sidebarEditionTag').textContent = TIER_NAMES[tier];

  document.querySelectorAll('.nav-item[data-tier]').forEach(item=>{
    const locked = TIER_RANK[item.dataset.tier] > TIER_RANK[tier];
    item.classList.toggle('locked', locked);
  });

  const total = MODULES.length;
  const unlocked = MODULES.filter(m=>TIER_RANK[m.tier] <= TIER_RANK[tier]).length;
  document.getElementById('editionStripName').textContent = TIER_NAMES[tier];
  document.getElementById('editionStripCount').textContent = unlocked+' of '+total;
  document.getElementById('editionBarFill').style.width = Math.round(unlocked/total*100)+'%';
  const subs = {
    flex: 'Upgrade to CORE to unlock document verification, HSE, risk, automation and 10 more modules.',
    core: 'Upgrade to PLUS to unlock the Enterprise Procurement Hub and edition licensing controls.',
    plus: 'Every VendorOS module is unlocked on this plan.'
  };
  document.getElementById('editionStripSub').textContent = subs[tier];
  document.getElementById('editionStripBtn').style.display = tier==='plus' ? 'none' : 'inline-flex';

  buildModuleGrid();
  ['flex','core','plus'].forEach(t=>{
    const h = document.getElementById('edhead-'+t);
    if(h){ h.classList.toggle('current', t===tier); h.textContent = t.toUpperCase() + (t===tier ? ' (current)' : ''); }
  });

  // If the active page just became locked, bounce back to dashboard
  const activePage = document.querySelector('.page.active');
  if(activePage){
    const pid = activePage.id.replace('page-','');
    const nav = document.querySelector(`.nav-item[data-page="${pid}"]`);
    if(nav && nav.classList.contains('locked')) showPage('dashboard');
  }
  showToast('Now previewing '+TIER_NAMES[tier]+' — '+unlocked+' of '+total+' modules unlocked','layers');
}

function showUpgradePrompt(tier, name){
  pendingEditionForUpgrade = tier;
  document.getElementById('upgradeModalText').textContent =
    `"${name}" is part of the ${TIER_NAMES[tier]} edition. Preview it now to see exactly what unlocks, no commitment.`;
  document.getElementById('upgradeModalBtn').innerHTML = '<i data-lucide="arrow-up-circle"></i>Preview '+TIER_NAMES[tier];
  openModal('upgradeModal');
  paintIcons(document.getElementById('upgradeModal'));
}
function confirmUpgrade(){
  closeModal('upgradeModal');
  if(pendingEditionForUpgrade) setEdition(pendingEditionForUpgrade);
}

