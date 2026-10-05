/* ---------- QR code pattern (CSS mockup, deterministic so it looks consistent) ---------- */
function renderQrPattern(el){
  if(!el) return;
  const seed = [1,1,1,0,1,1,1, 1,0,0,0,0,0,1, 1,0,1,1,1,0,1, 1,0,1,1,1,0,1, 1,0,1,0,1,0,1, 1,0,0,0,0,0,1, 1,1,1,0,1,1,1];
  el.innerHTML = seed.map(v=>'<div class="'+(v?'':'off')+'"></div>').join('');
}
function openIdCardModal(){
  openModal('idCardModal');
  renderQrPattern(document.getElementById('qrPatternBig'));
}

