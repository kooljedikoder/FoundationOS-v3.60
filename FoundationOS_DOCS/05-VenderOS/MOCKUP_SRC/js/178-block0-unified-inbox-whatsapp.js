/* ---------- Unified Inbox: WhatsApp ---------- */
function sendWaMessage(){
  const input = document.getElementById('waInput');
  const text = input.value.trim();
  if(!text) return;
  const body = document.getElementById('waChatBody');
  const row = document.createElement('div');
  row.className = 'chat-bubble-row me';
  row.innerHTML = '<div class="chat-av">'+document.getElementById('profileAvatar').textContent+'</div><div><div class="chat-bubble">'+text.replace(/</g,'&lt;')+'</div><div class="chat-meta">You</div></div>';
  body.appendChild(row);
  body.scrollTop = body.scrollHeight;
  input.value = '';
  setTimeout(()=>{
    const reply = document.createElement('div');
    reply.className = 'chat-bubble-row';
    reply.innerHTML = '<div class="chat-av">KL</div><div><div class="chat-bubble">👍 Noted, thank you!</div><div class="chat-meta">Kalahari Logistics</div></div>';
    body.appendChild(reply);
    body.scrollTop = body.scrollHeight;
  }, 900);
}

const DOC_CAT_TARGET = {'md-company':['company','docsCatCompany'], 'md-taxbank':['taxbank','docsCatTaxbank'], 'md-identity':['identity','docsCatIdentity'], 'md-commercial':['commercial','docsCatCommercial']};
function switchDocTab(el, panelId){
  switchTab(el, panelId);
  const cfg = DOC_CAT_TARGET[panelId];
  if(!cfg) return;
  const [cat, targetId] = cfg;
  const filtered = DOCS.filter(d=>d.category===cat);
  const target = document.getElementById(targetId);
  target.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Document</th><th>Status</th><th>Expiry</th><th class="actions-col">Actions</th></tr></thead><tbody>'
    + filtered.map(d=>{
        const s = DOC_STATUS_LABEL[d.status];
        return docRowHtml(d);
      }).join('')
    + '</tbody></table></div>';
  paintIcons(target);
}

function crudAction(action, ref){
  if(action==='delete'){
    if(!confirm('Delete '+ref+'? This cannot be undone.')) return;
    showToast(ref+' deleted', 'alert-circle');
    return;
  }
  showToast((action==='edit'?'Editing ':'Viewing ')+ref, action==='edit'?'edit-2':'eye');
}
function rowActions(ref){
  return '<div class="row-actions">'
    + '<button class="action-btn" data-tip="View" onclick="crudAction(\'view\',\''+ref+'\')"><i data-lucide="eye"></i></button>'
    + '<button class="action-btn" data-tip="Edit" onclick="crudAction(\'edit\',\''+ref+'\')"><i data-lucide="edit-2"></i></button>'
    + '<button class="action-btn danger" data-tip="Delete" onclick="crudAction(\'delete\',\''+ref+'\')"><i data-lucide="trash-2"></i></button>'
    + '</div>';
}

