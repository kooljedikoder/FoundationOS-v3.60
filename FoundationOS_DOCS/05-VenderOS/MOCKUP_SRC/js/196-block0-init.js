/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  paintIcons();
  buildModuleGrid();
  renderDocs();
  renderQrPattern(document.getElementById('qrPatternMini'));
  setEdition('core');
  const wm = document.getElementById('loginWatermark');
  if(wm){ wm.innerHTML = '<i data-lucide="shield-v"></i>'; paintIcons(wm); }
  paintIcons();
});
</script>