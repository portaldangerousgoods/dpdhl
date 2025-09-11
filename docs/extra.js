(function () {
  // =========================
  // Helpers de rota/base
  // =========================
  function basePath() {
    // Ex.: /dpdhl/ em GitHub Pages de projeto; "/" em user/org page
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }

  // =========================
  // Autenticação simples (localStorage)
  // =========================
  function hasAuth() {
    try {
      const t = JSON.parse(localStorage.getItem('dg_auth') || '{}');
      return t.ok && Date.now() < t.exp;
    } catch {
      return false;
    }
  }
  function setAuthOk(hours = 12) {
    const exp = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem('dg_auth', JSON.stringify({ ok: true, exp }));
  }
  function clearAuth() {
    localStorage.removeItem('dg_auth');
  }

  // =========================
  // Guarda de rotas
  // =========================
  function guard() {
    const base = basePath();
    // Se não autenticado e não está na página de login -> redireciona para login
    if (!hasAuth() && !isLoginPage()) {
      window.location.replace(base + 'login.html');
      return false;
    }
    // Se autenticado e abriu a página de login -> manda para home
    if (hasAuth() && isLoginPage()) {
      window.location.replace(base);
      return false;
    }
    return true;
  }

  // =========================
  // Ocultar link do GitHub no header (quando existir)
  // =========================
  function hideGitHubHeaderLink() {
    // MkDocs Material coloca o link do repositório dentro desse container
    const source = document.querySelector('.md-header__source');
    if (source) {
      source.style.display = 'none';
    }
  }

  // =========================
  // Botão "Sair" no header
  // =========================
  function injectLogout() {
    if (!hasAuth() || isLoginPage()) return;
    if (document.getElementById('dg-logout')) return;

    const header = document.querySelector('.md-header__inner');
    if (!header) return;

    const a = document.createElement('a');
    a.id = 'dg-logout';
    a.textContent = '➡️ Sair';
    a.style.marginLeft = 'auto';
    a.style.cursor = 'pointer';
    a.style.fontWeight = '700';
    a.style.fontSize = '16px';
    a.style.color = '#C4001A';          // DHL Red
    a.style.padding = '8px 14px';
    a.style.border = '2px solid #C4001A';
    a.style.borderRadius = '6px';
    a.style.background = '#FFCC00';     // Postyellow

    a.onmouseover = () => { a.style.background = '#ffd633'; };
    a.onmouseout  = () => { a.style.background = '#FFCC00'; };

    a.onclick = () => {
      clearAuth();
      window.location.href = basePath() + 'login.html';
    };

    header.appendChild(a);
  }

  // =========================
  // Ícone lateral (substitui o antigo GIF) por página
  // =========================
  function injectIcon() {
    if (isLoginPage()) return;
    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;

    // Remove ícone anterior (ou GIF legado)
    const old1 = document.getElementById('dg-icon-page');
    if (old1) old1.remove();
    const old2 = document.getElementById('gif-aviao-dhl');
    if (old2) old2.remove();

    const img = document.createElement('img');
    img.id = 'dg-icon-page';
    img.style.width = '100px';
    img.style.display = 'block';
    img.style.margin = '16px auto';

    const path = location.pathname;
    const base = basePath();

    // Mapeamento por página (substrings do caminho)
    // index -> inicio.svg
    if (path.endsWith('/') || path.endsWith('/index.html')) {
      img.src = base + 'inicio.svg';
    }
    // FAQ -> faq.svg
    else if (path.includes('faq')) {
      img.src = base + 'faq.svg';
    }
    // Produtos Biológicos -> wmx.svg
    else if (path.includes('biologico') || path.includes('biologicos')) {
      img.src = base + 'wmx.svg';
    }
    // Gelo seco -> dry.svg
    else if (path.includes('gelo-seco')) {
      img.src = base + 'dry.svg';
    }
    // Bebidas alcoólicas -> beb.svg
    else if (path.includes('bebidas')) {
      img.src = base + 'beb.svg';
    }
    // Perfumes -> per.svg
    else if (path.includes('perfume')) {
      img.src = base + 'per.svg';
    }
    // Excepted Quantities -> eq.svg (ícone novo específico)
    else if (path.includes('eq')) {
      img.src = base + 'eq.svg';
    }
    // Full DG -> atomo.svg
    else if (path.includes('full-dg')) {
      img.src = base + 'atomo.svg';
    }
    // Baterias -> bat.svg
    else if (path.includes('bateria')) {
      img.src = base + 'bat.svg';
    }
    // Documentos -> doc.svg
    else if (path.includes('documentos')) {
      img.src = base + 'doc.svg';
    }
    // Aprovacao (se quiser outro ícone, ajuste aqui)
    else if (path.includes('aprovacao')) {
      img.src = base + 'doc.svg';
    }
    // Fallback -> inicio.svg
    else {
      img.src = base + 'inicio.svg';
    }

    toc.parentElement.appendChild(img);
  }

  // =========================
  // Execução inicial (ao carregar)
  // =========================
  if (!guard()) return;
  hideGitHubHeaderLink();
  injectLogout();
  injectIcon();

  // Reexecuta após navegações internas (SPA do MkDocs Material)
  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      hideGitHubHeaderLink();
      injectLogout();
      injectIcon();
    });
  }
})();

// ======================================================
// BLOCO ESPECÍFICO PARA A PÁGINA login.html
// - Valida a conta (9 dígitos) e senha (campo de senha sem dica).
// - Define sessão no localStorage e redireciona para a home.
// ======================================================
(function () {
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }
  function setAuthOk(hours = 12) {
    const exp = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem('dg_auth', JSON.stringify({ ok: true, exp }));
  }

  if (!isLoginPage()) return;

  document.addEventListener('DOMContentLoaded', () => {
    const form       = document.getElementById('dg-login-form');
    const accountInp = document.getElementById('dg-account');
    const passInp    = document.getElementById('dg-pass');
    const errorBox   = document.getElementById('dg-login-error');

    if (!form || !accountInp || !passInp || !errorBox) return;

    // Não exibir dica de senha em lugar nenhum.
    // Somente validação silenciosa no submit.
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const account = (accountInp.value || '').trim();
      const pass    = (passInp.value || '').trim();

      // Regras: conta = 9 dígitos; senha = definida pela equipe (ex.: dhl1234!)
      const isNineDigits = /^[0-9]{9}$/.test(account);
      const okPass       = (pass === 'dhl1234!'); // valor mantido apenas para verificação

      if (!isNineDigits) {
        errorBox.textContent = 'A conta deve ter exatamente 9 dígitos numéricos.';
        errorBox.style.display = 'block';
        return;
      }
      if (!okPass) {
        errorBox.textContent = 'Usuário ou senha inválidos.';
        errorBox.style.display = 'block';
        return;
      }

      // Sucesso
      setAuthOk(12); // 12h de sessão
      window.location.replace(basePath());
    });
  });
})();
