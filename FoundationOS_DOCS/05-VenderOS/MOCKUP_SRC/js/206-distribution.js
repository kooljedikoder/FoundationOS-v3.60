/* ---------- Distribution builder: ship only the apps a job needs (ADR-059) ---------- */
const DIST = { picked: {}, name: 'Contractor onboarding', filament: 'none' };
function distClosure(){
  const all = {}; const add = id => { if(all[id]) return; all[id] = true; (PKG_REQ[id]||[]).forEach(add); };
  Object.keys(DIST.picked).filter(k=>DIST.picked[k]).forEach(add); all.core = true; return all;
}
function distManifest(){
  const inc = distClosure(); const ids = Object.keys(PKG_NAME);
  const apps = ids.filter(i=>inc[i] && i!=='filament' && i!=='erp' || (i==='erp' && inc.erp));
  const plugins = ids.filter(i=>inc[i] && (i==='erp'));
  const hidden = ids.filter(i=>!inc[i]);
  const ports = {}; ['contacts','documents','conversations','approvals','audit'].forEach(p=>{ ports[p] = (DIST.ports && DIST.ports[p]) || 'fos'; });
  return { name: DIST.name, base: 'fos-base 1.x', apps: apps.filter(i=>i!=='erp'), plugins, added_for_needs: apps.filter(i=>!DIST.picked[i] && i!=='core' && i!=='erp'), hidden, ports, filament: DIST.filament };
}
function distRender(){
  const b = document.getElementById('fosDistBody'); if(!b) return;
  const inc = distClosure(); const m = distManifest();
  const rows = Object.keys(PKG_NAME).filter(i=>i!=='core'&&i!=='filament').map(i=>{
    const forced = inc[i] && !DIST.picked[i];
    return '<tr><td><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" '+(inc[i]?'checked ':'')+(forced?'disabled ':'')+'onchange="distPick(\''+i+'\',this.checked)"> <b>'+PKG_NAME[i]+'</b></label></td><td style="font-size:12px;color:var(--muted)">'+(forced?'Added: another app needs it':(inc[i]?'Chosen':'Hidden'))+'</td></tr>';
  }).join('');
  b.innerHTML = '<div class="form-grid"><div class="field"><label>Distribution name</label><input id="distName" value="'+DIST.name.replace(/"/g,'&quot;')+'" oninput="DIST.name=this.value;distJson()"></div><div class="field"><label>Filament</label><select onchange="DIST.filament=this.value;distJson()"><option value="none"'+(DIST.filament==='none'?' selected':'')+'>None (product build)</option><option value="installer"'+(DIST.filament==='installer'?' selected':'')+'>Installer and test surface only</option></select></div></div>'
   + '<div class="table-wrap"><table><thead><tr><th>App or plugin</th><th>In this build</th></tr></thead><tbody>'+rows+'</tbody></table></div>'
   + '<p style="font-size:12.5px;color:var(--muted);margin:10px 0">FOS Core is always included. Contacts, documents, conversations, approvals and audit use the FOS tables unless you change them in the Install tab.</p>'
   + '<h4 style="margin:12px 0 6px;font-size:13px">Distribution manifest</h4><pre id="distJson" style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px;font-size:12px;overflow:auto;max-height:260px"></pre>'
   + '<div class="page-actions" style="margin-top:12px"><button class="btn btn-secondary btn-sm" onclick="distPreview()">Preview the menu</button> <button class="btn btn-secondary btn-sm" onclick="distReset()">Show everything</button> <button class="btn btn-primary btn-sm" onclick="distSave()">Save distribution</button></div>';
  distJson();
}
function distJson(){ const e = document.getElementById('distJson'); if(e) e.textContent = JSON.stringify(distManifest(), null, 2); }
function distPick(id, on){ DIST.picked[id] = on; distRender(); }
function distPreview(){ const inc = distClosure(); Object.keys(PKG_NAME).forEach(i=>{ if(i==='core') return; const off = !inc[i]; PKG_OFF[i] = off; document.body.classList.toggle('pkg-off-'+i, off); }); showToast('Menu now shows only what this distribution includes','eye'); }
function distReset(){ Object.keys(PKG_NAME).forEach(i=>{ delete PKG_OFF[i]; document.body.classList.remove('pkg-off-'+i); }); showToast('Menu shows every package again','eye'); }
async function distSave(){
  const m = distManifest(); const ref = 'DIST-'+m.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  try{ await fosApi('record_save', {c:'distributions', row:Object.assign({ref, title:m.name, status:['green','Saved']}, {manifest:m})}); showToast('Distribution saved to the database ('+ref+')','check-circle'); }
  catch(e){ showToast('Distribution manifest ready (the prototype database is not reachable)','check-circle'); }
}
document.addEventListener('click', function(ev){ if(ev.target.closest && ev.target.closest('[data-tab="appsuite-tab-distribution"],[onclick*="appsuite-tab-distribution"]')) setTimeout(distRender, 0); });
setTimeout(distRender, 600);
