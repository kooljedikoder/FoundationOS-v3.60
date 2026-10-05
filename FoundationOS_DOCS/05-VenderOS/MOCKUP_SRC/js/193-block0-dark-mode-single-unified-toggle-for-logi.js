/* ---------- Dark mode (single unified toggle for login + main app) ---------- */
const darkBtn = document.getElementById('darkBtn');
const darkIcon = document.getElementById('darkIcon');
function toggleGlobalTheme(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  darkIcon.setAttribute('data-lucide', next === 'dark' ? 'sun' : 'moon');
  const loginIcon = document.getElementById('loginThemeIcon');
  if(loginIcon) loginIcon.setAttribute('data-lucide', next === 'dark' ? 'sun' : 'moon');
  const ov = document.getElementById('loginOverlay');
  if(ov) ov.classList.toggle('login-dark', next === 'dark');
  paintIcons();
}
darkBtn.addEventListener('click', toggleGlobalTheme);

