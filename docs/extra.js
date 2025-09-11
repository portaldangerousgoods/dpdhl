(function () {
  // ====== Helpers de rota/base ======
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }

  // ====== Autenticação simples (localStorage) ======
  function hasAuth() {
    try {
      const t = JSON.parse(localStorage.getItem('dg_auth') || '{}');
      return t.ok && Date.now() < t.exp;
    } catch { return false; }
  }
  function setAuth() {
    const token = { ok: true, ts: Date.now(), exp: Date.now() + 12 * 60 * 60 * 1000 }; // 12h
    localStorage.setItem('dg_auth', JSON.stringify(token));
  }
  function clearAuth() { localStorage.removeItem('dg_auth'); }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }

  // ====== Guarda de rotas ======
  function guard() {
    const base = basePath();
    if (!hasAuth() && !isLoginPage()) {
      window.location.replace(base + 'login.html');
      return false;
    }
    if (hasAuth() && isLoginPage()) {
      window.location.replace(base);
      return false;
    }
    return true;
  }

  // ====== Botão "Sair" mais chamativo ======
  function injectLogout() {
    if (!hasAuth()) return;
    if (document.getElementById('dg-logout')) return;
    const header = document.querySelector('.md-header__inner');
    if (!header) return;

    const a = document.createElement('a');
    a.id = 'dg-logout';
    a.textContent = '🚪 Sair';
    a.style.marginLeft = '20px';
    a.style.cursor = 'pointer';
    a.style.fontWeight = 'bold';
    a.style.padding = '6px 14px';
    a.style.borderRadius = '6px';
    a.style.backgroundColor = '#D40511'; // vermelho DHL
    a.style.color = 'white';
    a.style.textDecoration = 'none';
    a.onmouseenter = () => { a.style.backgroundColor = '#a00015'; };
    a.onmouseleave = () => { a.style.backgroundColor = '#D40511'; };
    a.onclick = () => {
      clearAuth();
      window.location.href = basePath() + 'login.html';
    };
    header.appendChild(a);
  }

  // ====== GIF do avião ======
  function injectGif() {
    if (isLoginPage()) return;
    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;
    if (document.getElementById('gif-aviao-dhl')) return;

    const img = document.createElement('img');
    img.id = 'gif-aviao-dhl';
    img.src = basePath() + 'avião-dhl.gif';
    img.alt = 'Avião DHL';
    img.style.width = '100px';
    img.style.display = 'block';
    img.style.margin = '16px auto';

    toc.parentElement.appendChild(img);
  }

  // ====== Ocultar info GitHub no header ======
  function hideGitHub() {
    const gh = document.querySelector('.md-header__source');
    if (gh) gh.style.display = 'none';
  }

  // ====== Execução inicial ======
  if (!guard()) return;
  injectLogout();
  injectGif();
  hideGitHub();

  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      injectGif();
      hideGitHub();
    });
  }
})();
