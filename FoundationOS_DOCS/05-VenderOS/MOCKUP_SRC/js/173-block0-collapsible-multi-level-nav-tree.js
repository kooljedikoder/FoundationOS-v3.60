/* ---------- Collapsible multi-level nav tree ---------- */
function toggleSection(el){
  el.classList.toggle('open');
  const body = el.nextElementSibling;
  if(body) body.classList.toggle('collapsed');
}
function toggleGroup(el, groupId){
  const wrap = document.getElementById(groupId);
  const chev = document.getElementById('chev-'+groupId) || el.querySelector('.nav-chevron');
  if(!wrap) return;
  const open = wrap.classList.toggle('open');
  if(chev) chev.classList.toggle('open', open);
}
function navGroupClick(el, groupId){
  navClick(el);
  toggleGroup(el, groupId);
}
function subNav(pageId, opts){
  opts = opts || {};
  if(opts.tier && TIER_RANK[opts.tier] > TIER_RANK[currentEdition]){
    showUpgradePrompt(opts.tier, opts.label || pageId);
    return;
  }
  showPage(pageId);
  setTimeout(()=>{
    if(opts.tab) activateTabPanel(opts.tab);
    if(opts.target){
      const t = document.getElementById(opts.target);
      if(t){ t.scrollIntoView({behavior:'smooth', block:'center'}); t.classList.remove('flash-hl'); void t.offsetWidth; t.classList.add('flash-hl'); }
    }
    if(opts.toast) showToast(opts.toast, 'info');
  }, 240);
}
function toggleAcc(head){
  head.closest('.prd-acc').classList.toggle('open');
}
function selectPrd(el, paneId){
  document.querySelectorAll('.prd-nav-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.prd-pane').forEach(p=>p.classList.remove('active'));
  const pane = document.getElementById(paneId);
  if(pane){ pane.classList.add('active'); document.querySelector('.prd-content').scrollTop = 0; }
}
function activateTabPanel(panelId){
  const panel = document.getElementById(panelId);
  if(!panel) return;
  const page = panel.closest('.page');
  const tabsRow = page.querySelector('.tabs');
  if(tabsRow){
    tabsRow.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    const tab = Array.from(tabsRow.querySelectorAll('.tab')).find(t=>(t.getAttribute('onclick')||'').includes("'"+panelId+"'"));
    if(tab) tab.classList.add('active');
  }
  page.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  panel.classList.add('active');
}

function setStaffView(mode, el){
  document.querySelectorAll('#page-passport .fm-view-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('staffListView').classList.toggle('hidden', mode!=='list');
  document.getElementById('staffCardsView').classList.toggle('hidden', mode!=='cards');
}
function revokeStaffAccess(btn, name){
  if(!confirm('Revoke '+name+'\u2019s access to this vendor account?')) return;
  const cell = btn.closest('td, .fm-card').querySelector('.badge') || btn.parentElement.previousElementSibling;
  btn.outerHTML = '<span class="badge badge-red">Revoked</span>';
  showToast(name+'\u2019s access has been revoked', 'alert-circle');
}
function approveStaffAccess(btn, name){
  btn.outerHTML = '<span class="badge badge-green">Active</span>';
  showToast(name+'\u2019s access approved', 'check');
}

