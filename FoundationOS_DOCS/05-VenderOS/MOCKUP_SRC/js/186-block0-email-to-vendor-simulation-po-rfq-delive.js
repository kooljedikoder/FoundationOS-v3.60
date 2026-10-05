/* ---------- Email-to-Vendor simulation (PO/RFQ delivery loop) ---------- */
function emailToVendor(ref, vendorName, vendorEmail){
  showToast(ref+' emailed to '+vendorEmail+' — loading into '+vendorName+'\u2019s Vendor Portal', 'mail');
  setTimeout(()=>{
    const tbody = document.getElementById('vendorPortalDeliveries');
    if(!tbody) return;
    const row = document.createElement('tr');
    row.innerHTML = '<td>'+ref+'</td><td>Emailed Document</td><td>—</td>'
      + '<td><span class="badge badge-blue">Awaiting acknowledgement</span></td>'
      + '<td class="actions-col"><button class="btn btn-secondary btn-sm" onclick="acknowledgeVendorDoc(this,\''+ref+'\')">Acknowledge</button></td>';
    tbody.prepend(row);
  }, 700);
}
function acknowledgeVendorDoc(btn, ref){
  const row = btn.closest('tr');
  row.children[3].innerHTML = '<span class="badge badge-green">Acknowledged</span>';
  row.children[4].innerHTML = '<span class="badge badge-grey">Archived</span>';
  showToast(ref+' acknowledged — archived to the vendor record', 'check');
}

