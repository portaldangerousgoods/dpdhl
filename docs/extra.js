(function () {
  // ====== Helpers de rota/base ======
  function basePath() {
    // Em GitHub Pages de projeto (portaldangerousgoods.github.io/dpdhl/),
    // o base é "/dpdhl/". Se publicar como user/org page, será "/".
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

  // ====== Botão "Sair" no header ======
  function injectLogout() {
    if (!hasAuth()) return;
    if (document.getElementById('dg-logout')) return;
    const header = document.querySelector('.md-header__inner');
    if (!header) return;
    const a = document.createElement('a');
    a.id = 'dg-logout';
    a.textContent = 'Sair';
    a.style.marginLeft = 'auto';
    a.style.cursor = 'pointer';
    a.style.fontWeight = '600';
    a.onclick = () => {
      clearAuth();
      window.location.href = basePath() + 'login.html';
    };
    header.appendChild(a);
  }

  // ====== GIF no índice (TOC) ======
  function injectGif() {
    if (isLoginPage()) return; // não mostra GIF no login
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

  // ====== Execução inicial ======
  if (!guard()) return;
  injectLogout();
  injectGif();

  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      injectGif();
    });
  }
})();

/* ====== BLOCO DE LOGIN (login.html) ====== */
(function () {
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }
  function setAuthOk() {
    const exp = Date.now() + 8 * 60 * 60 * 1000; // 8h
    localStorage.setItem('dg_auth', JSON.stringify({ ok: true, exp }));
  }

  if (!isLoginPage()) return;

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dg-login-form');
    if (!form) return;

    const accountInput = document.getElementById('dg-account');
    const passInput = document.getElementById('dg-pass');
    const errorBox = document.getElementById('dg-login-error');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const account = (accountInput.value || '').trim();
      const pass = (passInput.value || '').trim();

      const isNineDigits = /^[0-9]{9}$/.test(account);
      const okPass = pass === 'dhl1234!';

      if (!isNineDigits) {
        errorBox.textContent = 'A conta deve ter exatamente 9 dígitos numéricos.';
        errorBox.style.display = 'block';
        return;
      }
      if (!okPass) {
        errorBox.textContent = 'Senha inválida.';
        errorBox.style.display = 'block';
        return;
      }

      // Autenticação OK
      setAuthOk();
      window.location.replace(basePath());
    });
  });
})();
