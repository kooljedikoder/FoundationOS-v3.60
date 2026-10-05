/* ---------- Unified Inbox: Direct Messages reply ---------- */
function sendDmReply(){
  const input = document.getElementById('dmReplyInput');
  const text = input.value.trim();
  if(!text) return;
  const bodyEl = document.getElementById('threadBody');
  const row = document.createElement('div');
  row.className = 'inbox-msg';
  row.innerHTML = '<div class="inbox-msg-av">'+document.getElementById('profileAvatar').textContent+'</div><div><div style="font-size:12.5px;font-weight:700;margin-bottom:2px">'+document.getElementById('profileName').textContent+' (You)</div><div class="inbox-msg-text">'+text.replace(/</g,'&lt;')+'</div></div>';
  bodyEl.appendChild(row);
  bodyEl.scrollTop = bodyEl.scrollHeight;
  input.value = '';
  showToast('Reply sent', 'check');
}

