/* ---------- Toast ---------- */
function showToast(msg, icon){
  const t = document.getElementById('toast');
  t.innerHTML = `<i data-lucide="${icon||'check-circle'}"></i><span>${msg}</span>`;
  paintIcons(t);
  t.classList.add('show'); t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=>{ t.classList.remove('show'); t.style.transform = 'translateX(-50%) translateY(90px)'; }, 3000);
}

