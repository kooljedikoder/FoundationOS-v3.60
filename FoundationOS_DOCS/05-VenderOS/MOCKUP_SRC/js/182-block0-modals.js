/* ---------- Modals ---------- */
function openModal(id){ document.getElementById(id).classList.add('open'); paintIcons(document.getElementById(id)); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click', e=>{ if(e.target===m) closeModal(m.id); }));
function setDnView(mode, el){
  document.querySelectorAll('#wh-notes .fm-view-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('dnListView').classList.toggle('hidden', mode!=='list');
  document.getElementById('dnCardsView').classList.toggle('hidden', mode!=='cards');
}
function rescheduleDelivery(){
  document.getElementById('poLateDate').textContent = 'Rescheduled — due in 3 days';
  const badge = document.getElementById('poLateRow').querySelector('.badge');
  badge.className = 'badge badge-blue';
  badge.textContent = 'Rescheduled';
  showToast('PO-8799 rescheduled with Phoenix Scaffolding — new delivery date set', 'check');
}

let pendingRequestType = null, pendingRequestRoute = null;
function openRequestModal(type, route){
  pendingRequestType = type; pendingRequestRoute = route;
  document.getElementById('reqModalTitle').textContent = type;
  document.getElementById('reqModalRoute').textContent = route;
  document.getElementById('reqModalDetails').value = '';
  openModal('requestTypeModal');
}
let requestSeq = 9001;
function submitRequestType(){
  closeModal('requestTypeModal');
  requestSeq++;
  const ref = 'REQ-'+requestSeq;
  const body = document.getElementById('myRequestsBody');
  const row = document.createElement('tr');
  row.innerHTML = '<td>'+ref+'</td><td>'+pendingRequestType+'</td><td>'+pendingRequestRoute+'</td><td>Just now</td><td><span class="badge badge-blue">Submitted</span></td>';
  body.prepend(row);
  showToast(ref+' submitted to '+pendingRequestRoute, 'check');
}

