/* ---------- Vendor Portal Document Manager (file-manager style) ---------- */
const DOCS = [
 {id:'p1', n:1, name:"Letter of Introduction", icon:'file-text', status:'verified', category:'company', mandatory:true, slot:'d1', kinds:["pdf"], capture:false, note:""},
 {id:'p2', n:2, name:"Certificate of Registration", icon:'award', status:'verified', category:'company', mandatory:true, slot:'d2', kinds:["pdf","image"], capture:true, note:""},
 {id:'p3', n:3, name:"Company Profile", icon:'file-text', status:'verified', category:'company', mandatory:true, slot:'d3', kinds:["pdf"], capture:false, note:""},
 {id:'p4', n:4, name:"Memorandum &amp; Articles of Association", icon:'file-text', status:'replace', category:'company', mandatory:true, slot:'d4', kinds:["pdf"], capture:false, note:"Older version on file. Upload the current signed copy."},
 {id:'p5', n:5, name:"CAC Documents (CAC 2/2.5, CAC 2.1, CAC 7/2.3)", icon:'building-2', status:'verified', category:'company', mandatory:true, slot:'d5', kinds:["pdf"], capture:false, note:"Three forms; store as one document set or three typed files."},
 {id:'p6', n:6, name:"Tax Compliance Evidence", icon:'receipt', status:'replace', category:'taxbank', mandatory:true, slot:'d6', kinds:["pdf","image"], capture:true, note:"Older version on file. Upload the current tax compliance evidence."},
 {id:'p7', n:7, name:"VAT Registration Certificate", icon:'receipt', status:'missing', category:'taxbank', mandatory:true, slot:'d7', kinds:["pdf","image"], capture:true, note:"Obtain and upload."},
 {id:'p8', n:8, name:"Cancelled Cheque", icon:'banknote', status:'missing', category:'taxbank', mandatory:true, slot:'d8', kinds:["image","pdf"], capture:true, note:"Obtain and upload. Proof of the bank account entered in Banking."},
 {id:'p9', n:9, name:"Bank Reference Letter", icon:'banknote', status:'missing', category:'taxbank', mandatory:true, slot:'d9', kinds:["pdf"], capture:false, note:"Instruction letter must be checked and signed by the authorised signatory before upload."},
 {id:'p10', n:10, name:"Recommendation Letter from Client", icon:'file-text', status:'verified', category:'commercial', mandatory:true, slot:'d10', kinds:["pdf","image"], capture:true, note:""},
 {id:'p11', n:11, name:"Director's Passport Photograph", icon:'image', status:'missing', category:'identity', mandatory:true, slot:'d11', kinds:["image"], capture:true, note:"Photo needed."},
 {id:'p12', n:12, name:"Valid Identification Card", icon:'id-card', status:'review', category:'identity', mandatory:true, slot:'d12', kinds:["image","pdf"], capture:true, note:"Marked done in the source list, but the NIN photo still needs checking, so treat as Under Review until verified."},
 {id:'p13', n:13, name:"Price List", icon:'tag', status:'missing', category:'commercial', mandatory:true, slot:'d13', kinds:["pdf","sheet"], capture:false, note:"Popular products and prices with a valid-till date; can be customised on request. Expires."},
 {id:'p14', n:14, name:"Client LPO / Letter of Award of Contract", icon:'file-text', status:'verified', category:'commercial', mandatory:true, slot:'d14', kinds:["pdf","image"], capture:true, note:"Uploaded."},
 {id:'p15', n:15, name:"Duly Filled Registration Form", icon:'file-text', status:'missing', category:'identity', mandatory:true, slot:'d15', kinds:["pdf"], capture:false, note:"Source list conflicts: item 15 appears under both Completed and Pending. Treat as Missing until the signed form is uploaded and checked."},
 {id:'o1', name:'Public Liability Insurance', icon:'shield-check', status:'expiring', expiry:'6 days', category:'commercial', mandatory:false, slot:'o1', kinds:['pdf','image'], capture:true, note:'Expires in 6 days. Upload the renewed certificate.'},
 {id:'o2', name:'ISO 9001 Certificate', icon:'award', status:'verified', category:'commercial', mandatory:false, slot:'o2', kinds:['pdf'], capture:false, note:''},
 {id:'o3', name:'Product Catalogue', icon:'folder', status:'verified', category:'commercial', mandatory:false, slot:'o3', kinds:['pdf'], capture:false, note:''}
];
const DOC_CATEGORY_LABEL = {company:'Company', taxbank:'Tax & Banking', identity:'Identity & Forms', commercial:'Commercial & Certifications'};
let docsCurrentFilter = null;
function filterDocs(category){
  docsCurrentFilter = category;
  renderDocs();
}
const DOC_STATUS_LABEL = {
  verified:{cls:'badge-green', text:'Verified'},
  expiring:{cls:'badge-orange', text:'Expiring Soon'},
  requested:{cls:'badge-blue', text:'Change Requested'},
  missing:{cls:'badge-orange', text:'Pending Upload'},
  replace:{cls:'badge-red', text:'Replacement Required'},
  review:{cls:'badge-blue', text:'Under Review'},
  uploaded:{cls:'badge-blue', text:'Uploaded'}
};
function docAccept(kinds){ return kinds.map(k=>VW_KIND_EXT[k].map(e=>'.'+e).join(',')+(k==='image'?',image/*':'')).join(','); }
function docUpload(id, input){
  const doc = DOCS.find(d=>d.id===id); const f = input.files && input.files[0]; input.value=''; if(!doc || !f) return;
  const err = vwCheckFile(f, doc.kinds, null); if(err){ showToast(err,'alert-circle'); return; }
  doc.status = 'uploaded'; doc.file = f.name; renderDocs();
  showToast(doc.name+' uploaded — pending validation (stage 18)','upload');
}
function docActionButton(doc){
  if(doc.status === 'requested'){
    return '<button class="btn btn-secondary btn-sm" onclick="approveChangeRequest(\''+doc.id+'\')"><i data-lucide="check"></i>Simulate Staff Approval</button>';
  }
  if(doc.status === 'missing' || doc.status === 'replace'){
    const label = doc.status==='replace' ? 'Upload replacement' : 'Upload';
    return '<div class="vw-ctl"><label class="btn btn-primary btn-sm"><i data-lucide="upload"></i>'+label+'<input type="file" data-doc="'+doc.id+'" accept="'+docAccept(doc.kinds)+'" onchange="docUpload(\''+doc.id+'\',this)"/></label>'+(doc.capture?'<label class="btn btn-secondary btn-sm"><i data-lucide="camera"></i>Take photo<input type="file" accept="image/*" capture="environment" onchange="docUpload(\''+doc.id+'\',this)"/></label>':'')+'</div>';
  }
  if(doc.status === 'review' || doc.status === 'uploaded'){
    return '<span style="font-size:12px;color:var(--muted)">Awaiting review</span>';
  }
  return '<button class="btn '+(doc.status==='expiring'?'btn-primary':'btn-secondary')+' btn-sm" onclick="openChangeRequestModal(\''+doc.id+'\')"><i data-lucide="edit-2"></i>Change Request</button>';
}
function docRowHtml(d){
  const s = DOC_STATUS_LABEL[d.status];
  const info = d.note && (d.status==='missing' || d.status==='replace' || d.status==='review' || d.status==='expiring') ? '<div style="font-size:11px;color:var(--muted);font-weight:400;white-space:normal">'+d.note+'</div>' : '';
  return '<tr><td style="white-space:normal"><b>'+d.name+'</b>'+(d.mandatory?' <span class="vw-req">mandatory</span>':' <span class="vw-opt">optional</span>')+info+(d.file?'<div style="font-size:11px;color:var(--muted)">'+d.file+'</div>':'')+'</td><td><span class="badge '+s.cls+'">'+s.text+'</span></td><td>'+(d.expiry||'—')+'</td><td class="actions-col">'+docActionButton(d)+'</td></tr>';
}
function docsSummary(){
  const m = DOCS.filter(d=>d.mandatory); const ver = m.filter(d=>d.status==='verified').length;
  const act = m.filter(d=>d.status==='missing'||d.status==='replace').length; const rev = m.filter(d=>d.status==='review'||d.status==='uploaded').length;
  const set = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('dkTotal', m.length); set('dkVerified', ver); set('dkAction', act); set('dkReview', rev); set('vkDocs', ver+'/'+m.length+' Verified'); set('navDocsCount', act);
  const nc = document.getElementById('navDocsCount'); if(nc) nc.style.display = act ? '' : 'none';
}
function renderDocs(){
  const filtered = docsCurrentFilter ? DOCS.filter(d=>d.category===docsCurrentFilter) : DOCS;
  const label = document.getElementById('docCountLabel');
  label.innerHTML = filtered.length + ' document' + (filtered.length!==1?'s':'') + (docsCurrentFilter ? ' in ' + DOC_CATEGORY_LABEL[docsCurrentFilter] : ' on file')
    + (docsCurrentFilter ? ' <span style="color:var(--primary);font-weight:700;cursor:pointer;margin-left:6px" onclick="filterDocs(null)">&times; Clear filter</span>' : '');

  const list = document.getElementById('docsListView');
  list.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Document</th><th>Status</th><th>Expiry</th><th class="actions-col">Action</th></tr></thead><tbody>'
    + (filtered.length ? filtered.map(d => {
        const s = DOC_STATUS_LABEL[d.status];
        return docRowHtml(d);
      }).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:20px">No documents in this category</td></tr>')
    + '</tbody></table></div>';

  const cards = document.getElementById('docsCardsView');
  cards.innerHTML = filtered.map(d => {
    const s = DOC_STATUS_LABEL[d.status];
    return '<div class="fm-card"><div class="fm-card-thumb"><i data-lucide="'+d.icon+'"></i></div>'
      + '<div class="fm-card-name">'+d.name+'</div>'
      + '<div class="fm-card-meta"><span class="badge '+s.cls+'">'+s.text+'</span></div>'
      + docActionButton(d) + '</div>';
  }).join('');
  paintIcons(list); paintIcons(cards); docsSummary();
}
function setDocsView(mode, el){
  document.querySelectorAll('#ss-overview .fm-view-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('docsListView').classList.toggle('hidden', mode!=='list');
  document.getElementById('docsCardsView').classList.toggle('hidden', mode!=='cards');
}
let pendingChangeReqDoc = null;
function openChangeRequestModal(docId){
  pendingChangeReqDoc = docId;
  const doc = DOCS.find(d=>d.id===docId);
  document.getElementById('changeReqDocName').textContent = doc.name;
  document.getElementById('changeReqReason').value = '';
  openModal('changeReqModal');
}
function submitChangeRequest(){
  const doc = DOCS.find(d=>d.id===pendingChangeReqDoc);
  if(doc) doc.status = 'requested';
  closeModal('changeReqModal');
  renderDocs();
  showToast(doc.name+' change request submitted — routed to Procurement/Compliance for review','check');
}
function approveChangeRequest(docId){
  const doc = DOCS.find(d=>d.id===docId);
  if(doc) doc.status = 'verified';
  renderDocs();
  showToast(doc.name+' change approved — record updated (staff-side action)','check');
}

