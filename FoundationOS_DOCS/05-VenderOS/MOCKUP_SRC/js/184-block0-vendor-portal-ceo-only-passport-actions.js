/* ---------- Vendor Portal: CEO-only passport actions ---------- */
function setVendorViewer(mode, el){
  document.querySelectorAll('#vendorViewerToggle .fm-view-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ceoActions').classList.toggle('hidden', mode !== 'ceo');
  showToast(mode==='ceo' ? 'Viewing as CEO / Primary Contact — full visibility unlocked' : 'Viewing as Staff Member — limited visibility', 'user-plus');
}
function requestNewPassport(){
  showToast('New Vendor Passport requested — routed to Procurement for review', 'mail');
}
function removePassport(){
  if(!confirm('Request removal of this Vendor Passport? This requires Procurement approval and suspends all RFQ/PO eligibility until a new passport is reissued.')) return;
  showToast('Passport removal requested — pending Procurement approval', 'alert-circle');
}

