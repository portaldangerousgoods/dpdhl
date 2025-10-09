(function () {
  /* ===== Helpers ===== */
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }

  /* ===== Auth ===== */
  function hasAuth() {
    try {
      const t = JSON.parse(localStorage.getItem('dg_auth') || '{}');
      return t.ok && Date.now() < t.exp;
    } catch { return false; }
  }
  function clearAuth() { localStorage.removeItem('dg_auth'); }
  function guard() {
    const base = basePath();
    if (!hasAuth() && !isLoginPage()) { window.location.replace(base + 'login.html'); return false; }
    if (hasAuth() && isLoginPage()) { window.location.replace(base); return false; }
    return true;
  }

  /* ===== Botão SAIR ===== */
  function injectLogout() {
    if (!hasAuth()) return;
    const header = document.querySelector('.md-header__inner');
    if (!header) return;
    let a = document.getElementById('dg-logout');
    if (!a) {
      a = document.createElement('a');
      a.id = 'dg-logout';
      a.textContent = '⇨ Sair';
      a.setAttribute('aria-label', 'Sair');
      header.appendChild(a);
    }
    a.onclick = () => { clearAuth(); window.location.href = basePath() + 'login.html'; };
  }

  /* ===== Oculta bloco GitHub no header ===== */
  function hideGitHubLink() {
    const repo = document.querySelector('.md-header__source');
    if (repo) repo.style.display = 'none';
  }

  /* ===== Run ===== */
  if (!guard()) return;
  hideGitHubLink();
  injectLogout();

  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      hideGitHubLink();
      injectLogout();
    });
  }
  console.log('DG extra.js — baseline restaurado');
})();
