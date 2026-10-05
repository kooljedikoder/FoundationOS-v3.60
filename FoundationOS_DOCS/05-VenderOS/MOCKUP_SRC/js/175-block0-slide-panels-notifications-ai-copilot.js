/* ---------- Slide panels (Notifications, AI Copilot) ---------- */
function openSlidePanel(id){
  document.querySelectorAll('.slide-panel.open').forEach(p=>{ if(p.id!==id) p.classList.remove('open'); });
  document.getElementById(id).classList.add('open');
  document.getElementById('panelOverlay').classList.add('show');
}
function closeSlidePanel(id){
  document.getElementById(id).classList.remove('open');
  if(!document.querySelector('.slide-panel.open')) document.getElementById('panelOverlay').classList.remove('show');
}
function closeAllSlidePanels(){
  document.querySelectorAll('.slide-panel.open').forEach(p=>p.classList.remove('open'));
  document.getElementById('panelOverlay').classList.remove('show');
}
const COPILOT_REPLIES = {
  'summarise open risks': 'You have <b>3 open risks</b> right now: Phoenix Scaffolding (HSE, 55% — high), Delta Civils (financial, medium), and one insurance expiry on Kalahari Logistics (6 days). Want me to draft reminder messages?',
  'which vendors are expiring soon?': '<b>2 documents</b> expire within 30 days: Kalahari Logistics — Public Liability Insurance (6 days), Northgate Office Supplies — Tax Clearance (3 days). I can send renewal reminders now if you'+"'"+'d like.'
};
function copilotAsk(text){
  document.getElementById('copilotInput').value = text;
  sendCopilotMessage();
}
function sendCopilotMessage(){
  const input = document.getElementById('copilotInput');
  const text = input.value.trim();
  if(!text) return;
  const body = document.getElementById('copilotChatBody');
  const row = document.createElement('div');
  row.className = 'chat-bubble-row me';
  row.innerHTML = '<div class="chat-av">'+ (document.getElementById('profileAvatar').textContent || 'ME') +'</div><div><div class="chat-bubble">'+text.replace(/</g,'&lt;')+'</div><div class="chat-meta">You</div></div>';
  body.appendChild(row);
  body.scrollTop = body.scrollHeight;
  input.value = '';
  setTimeout(()=>{
    const reply = COPILOT_REPLIES[text.toLowerCase()] || 'I\u2019m looking into that across VendorOS now — one moment while I pull the latest data from the relevant modules.';
    const rrow = document.createElement('div');
    rrow.className = 'chat-bubble-row';
    rrow.innerHTML = '<div class="chat-av">AI</div><div><div class="chat-bubble">'+reply+'</div><div class="chat-meta">Copilot</div></div>';
    body.appendChild(rrow);
    body.scrollTop = body.scrollHeight;
  }, 800);
}

