/* ---------- DB connect: standard lists and forms read and write the prototype database (public/proto/api.php) ---------- */
const FOSDB = { ok: null, base: 'proto/api.php' };
async function fosApi(r, body, qs){
  const o = body ? { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) } : {};
  const res = await fetch(FOSDB.base + '?r=' + r + (qs||''), o);
  const j = await res.json().catch(()=>({error:'Bad response'}));
  if(!res.ok) throw Object.assign(new Error(j.error||'Request failed'), {data:j, status:res.status});
  return j;
}
async function vfSyncAll(){
  if(FOSDB.ok === false) return false;
  const keys = [...new Set([...document.querySelectorAll('[data-vf]')].map(e=>e.dataset.vf))].filter(k=>VF[k] && /^[a-z0-9_]{1,40}$/.test(k));
  if(!keys.length) return false;
  try{
    const got = await fosApi('records', null, '&c='+keys.join(','));
    let changed = false;
    for(const k of keys){
      const rows = got[k] || [];
      if(!rows.length && VF[k].length){ await fosApi('records_seed', {c:k, rows:VF[k]}); }
      else if(rows.length){ VF[k].length = 0; rows.forEach(r=>VF[k].push(r)); changed = true; }
    }
    FOSDB.ok = true; return changed;
  }catch(e){ FOSDB.ok = false; return false; }
}
const _vfRender0 = vfRender;
vfRender = function(){ _vfRender0(); vfSyncAll().then(ch=>{ if(ch) _vfRender0(); }); };
const _vfDecide0 = vfDecide;
vfDecide = async function(key, ref, action){
  if(FOSDB.ok === false) return _vfDecide0(key, ref, action);
  const reason = (document.getElementById('vfReason')||{value:''}).value.trim();
  if(action!=='Approve' && action!=='Accept' && reason.length < 5){ showToast('Findings are required (at least 5 characters) to '+action.toLowerCase(),'alert-circle'); return; }
  const r = (VF[key]||[]).find(x=>x.ref===ref); if(!r) return;
  try{
    const res = await fosApi('record_decide', {c:key, ref, action, reason});
    r.status = res.row.status; r.next = ''; delete r.actions;
    closeSlidePanel('vfDrawer'); vfRender();
    showToast(ref+': '+action+' saved to the database, added to the approval history and audit log','check');
  }catch(e){ if(e.status) showToast(e.message,'alert-circle'); else _vfDecide0(key, ref, action); }
};
const _vfAct0 = vfAct;
vfAct = async function(ref, label){
  if(FOSDB.ok === false || label==='Open in Communications') return _vfAct0(ref, label);
  const key = Object.keys(VF).find(k=>(VF[k]||[]).some(x=>x.ref===ref));
  if(!key) return _vfAct0(ref, label);
  try{
    const res = await fosApi('record_act', {c:key, ref, label});
    const r = VF[key].find(x=>x.ref===ref); r.status = res.row.status; r.next = '';
    closeSlidePanel('vfDrawer'); vfRender(); showToast(label+' recorded for '+ref+' (saved to the database)','check');
  }catch(e){ _vfAct0(ref, label); }
};
const _wizardNext0 = wizardNext;
wizardNext = function(){
  const last = VW.step === VW_STEPS.length;
  _wizardNext0();
  if(!last || document.getElementById('vendorModal').classList.contains('open') || FOSDB.ok === false) return;
  const d = {}; Object.keys(VW.data).forEach(k=>{ const v = VW.data[k]; d[k] = (typeof v === 'string' && v.indexOf('|') >= 0) ? v.split('|') : v; });
  d.status = 'pending'; d.registrationSource = 'Vendor registration wizard'; d.wizardRepeaters = VW.rep;
  fosApi('contact_save', {type:'vendor', step:13, data:d}).then(r=>{ showToast('Registration saved to the Contact Control Center database (contact #'+r.id+')','check-circle'); if(typeof cccDirLoad==='function') cccDirLoad(); return fosApi('record_save', {c:'reg_t1', row:{ref:'REG-'+r.id, title:(d.companyName||'New vendor')+' (submitted, pending validation)', type:'Vendor', owner:'Vendor Admin', date:'Just now', status:['blue','Pending Validation'], stage:'S19', next:''}}); }).then(()=>{ if(typeof vfRender==='function') vfRender(); }).catch(()=>{});
};
async function fosFormSave(btn, title){
  const p = btn.closest('.panel'); const data = {}; let n = 0;
  p.querySelectorAll('.field').forEach(f=>{ const l = (f.querySelector('label')||{}).textContent; const i = f.querySelector('input,select,textarea'); if(!i||!l) return; const v = i.type==='checkbox' ? (i.checked?'yes':'no') : i.value; if(String(v).trim()!==''){ data[l.trim()] = v; n++; } });
  if(!n){ showToast('Fill at least one field first','alert-triangle'); return; }
  try{
    const pg = btn.closest('.page'); const res = await fosApi('form_submit', {form:title, page: pg?pg.id.replace('page-',''):'', data});
    showToast(title+' saved to the database (submission #'+res.id+')','check-circle');
  }catch(e){ showToast(title+' recorded (the prototype database is not reachable from here)','check-circle'); }
}
