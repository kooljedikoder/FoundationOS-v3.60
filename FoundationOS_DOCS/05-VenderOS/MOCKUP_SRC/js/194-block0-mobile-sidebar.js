/* ---------- Mobile sidebar ---------- */
document.getElementById('mobileToggle').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
});
document.getElementById('overlay').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
});

