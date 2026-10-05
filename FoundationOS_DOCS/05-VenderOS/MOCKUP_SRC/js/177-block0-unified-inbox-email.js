/* ---------- Unified Inbox: Email ---------- */
const EMAILS = [
 {from:'procurement@kalaharilogistics.com.ng', subject:'RE: PO-8821 delivery confirmation', body:'Confirming delivery for Thursday morning — please advise which dock number to use and who will sign for the goods.'},
 {from:'accounts@northgate.com.ng', subject:'Invoice INV-55040 submitted', body:'Please find attached invoice for PO-8821, due in 30 days. Let us know if any supporting documents are needed.'},
 {from:'compliance@sableit.com.ng', subject:'Updated ISO certificate attached', body:'Please find our renewed ISO 9001 certificate for your records — valid through next year.'}
];
function openEmail(el, idx){
  document.querySelectorAll('#emailThreads .inbox-row').forEach(r=>r.classList.remove('active'));
  el.classList.add('active');
  const e = EMAILS[idx];
  document.getElementById('emailSubject').textContent = e.subject;
  document.getElementById('emailMeta').textContent = 'From '+e.from+' · To buyer@vendorflow.example';
  document.getElementById('emailBody').innerHTML = '<div class="inbox-msg"><div class="inbox-msg-av">'+e.from.slice(0,2).toUpperCase()+'</div><div><div style="font-size:12.5px;font-weight:700;margin-bottom:2px">'+e.from+'</div><div class="inbox-msg-text">'+e.body+'</div></div></div>';
}
function sendEmailReply(){
  const input = document.getElementById('emailReplyInput');
  const text = input.value.trim();
  if(!text) return;
  const bodyEl = document.getElementById('emailBody');
  const row = document.createElement('div');
  row.className = 'inbox-msg';
  row.innerHTML = '<div class="inbox-msg-av">ME</div><div><div style="font-size:12.5px;font-weight:700;margin-bottom:2px">You</div><div class="inbox-msg-text">'+text.replace(/</g,'&lt;')+'</div></div>';
  bodyEl.appendChild(row);
  bodyEl.scrollTop = bodyEl.scrollHeight;
  input.value = '';
  showToast('Email reply sent', 'send');
}
function openComposeEmail(){
  document.getElementById('composeTo').value = '';
  document.getElementById('composeSubject').value = '';
  document.getElementById('composeBody').value = '';
  openModal('composeEmailModal');
}
function sendComposedEmail(){
  const to = document.getElementById('composeTo').value.trim();
  if(!to){ showToast('Add a recipient email address first', 'alert-circle'); return; }
  closeModal('composeEmailModal');
  showToast('Email sent to '+to, 'send');
}

