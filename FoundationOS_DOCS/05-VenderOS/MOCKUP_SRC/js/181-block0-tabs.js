/* ---------- Tabs ---------- */
function switchTab(el, panelId){
  const tabRow = el.closest('.tabs');
  tabRow.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const scope = el.closest('.page');
  scope.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  const panel = document.getElementById(panelId);
  if(panel) panel.classList.add('active');
}

