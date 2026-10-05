/* ---------- Vendor Portal chat-style Communications ---------- */
function setCommsChannel(channel, el){
  document.querySelectorAll('.chat-subtab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('commsChannelDm').classList.toggle('hidden', channel!=='dm');
  document.getElementById('commsChannelNews').classList.toggle('hidden', channel!=='news');
  document.getElementById('commsChannelAlerts').classList.toggle('hidden', channel!=='alerts');
}
function fillChatInput(text){
  document.getElementById('chatInput').value = text;
  document.getElementById('chatInput').focus();
}
function sendChatMessage(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  const body = document.getElementById('chatBody');
  const row = document.createElement('div');
  row.className = 'chat-bubble-row me';
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  row.innerHTML = '<div class="chat-av">DK</div><div><div class="chat-bubble">'+text.replace(/</g,'&lt;')+'</div><div class="chat-meta">You · '+time+'</div></div>';
  body.appendChild(row);
  body.scrollTop = body.scrollHeight;
  input.value = '';
  setTimeout(()=>{
    const reply = document.createElement('div');
    reply.className = 'chat-bubble-row';
    reply.innerHTML = '<div class="chat-av">LK</div><div><div class="chat-bubble">Got it, thanks David — I\u2019ll follow up shortly.</div><div class="chat-meta">Lesego K. · Compliance · '+time+'</div></div>';
    body.appendChild(reply);
    body.scrollTop = body.scrollHeight;
  }, 900);
}

