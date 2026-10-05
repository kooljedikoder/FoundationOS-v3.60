/* ---------- AppSuite: package switches (mockup of the FOS module registry) ---------- */
const PKG_REQ = {"core":[],"ccc":["core"],"documents":["core","ccc"],"collaboration":["core","ccc"],"training":["core","ccc"],"insights":["core"],"commerce":["core","ccc","documents"],"risk":["core","ccc","documents"],"automation":["core"],"vendoros":["core","ccc","documents","collaboration"],"vendorportal":["vendoros","collaboration"],"erp":["core","ccc"],"filament":["core"]};
const PKG_NAME = {"core":"FOS Core","ccc":"Contact Control Center","documents":"Documents","collaboration":"Collaboration","training":"Training and Competency","insights":"Insights (KPIs, scorecards, reports)","commerce":"Commerce","risk":"Risk and Compliance","automation":"Automation and Platform","vendoros":"VendorOS Core","vendorportal":"Vendor Portal","erp":"ERP plugins (Webkul, 9 installed)","filament":"Filament (installer and test surface)"};
const PKG_OFF = {};
function pkgToggle(id, on){
  const msg = document.getElementById('pkgMsg');
  if(!on){
    const users = Object.keys(PKG_REQ).filter(k => !PKG_OFF[k] && PKG_REQ[k].includes(id));
    if(users.length){
      const cb = document.querySelector('[data-pkg-row="'+id+'"] input[type=checkbox]'); if(cb) cb.checked = true;
      showToast(PKG_NAME[id]+' is needed by '+users.map(u=>PKG_NAME[u]).join(', ')+'. Turn those off first.','alert-circle'); return;
    }
    PKG_OFF[id] = true; document.body.classList.add('pkg-off-'+id);
    if(msg) msg.textContent = PKG_NAME[id]+' is off: its menu entries are hidden and its data is kept.';
  } else {
    const miss = PKG_REQ[id].filter(r => PKG_OFF[r]);
    if(miss.length){
      const cb = document.querySelector('[data-pkg-row="'+id+'"] input[type=checkbox]'); if(cb) cb.checked = false;
      showToast(PKG_NAME[id]+' needs '+miss.map(u=>PKG_NAME[u]).join(', ')+'. Turn those on first.','alert-circle'); return;
    }
    delete PKG_OFF[id]; document.body.classList.remove('pkg-off-'+id);
    if(msg) msg.textContent = PKG_NAME[id]+' is on.';
  }
}
function pkgMode(id, mode){ showToast(PKG_NAME[id]+' will use '+({fos:'the FOS tables',own:'its own tables',hybrid:'a choice per need'}[mode])+' at install','database'); }
