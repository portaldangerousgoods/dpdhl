(function () {
  // =============================
  // Helpers de rota/base
  // =============================
  function basePath() {
    // Em GitHub Pages de projeto (portaldangerousgoods.github.io/dpdhl/),
    // o base é "/dpdhl/". Se publicar como user/org page, será "/".
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }

  // =============================
  // Autenticação simples (localStorage)
  // =============================
  function hasAuth() {
    try {
      const t = JSON.parse(localStorage.getItem('dg_auth') || '{}');
      return t.ok && Date.now() < t.exp;
    } catch {
      return false;
    }
  }
  function setAuthOk(hours = 8) {
    const exp = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem('dg_auth', JSON.stringify({ ok: true, exp }));
  }
  function clearAuth() {
    localStorage.removeItem('dg_auth');
  }

  // =============================
  // Guarda de rotas
  // =============================
  function guard() {
    const base = basePath();
    // Sem login -> manda para login (exceto se já está no login)
    if (!hasAuth() && !isLoginPage()) {
      window.location.replace(base + 'login.html');
      return false;
    }
    // Já logado e abriu login -> manda para home
    if (hasAuth() && isLoginPage()) {
      window.location.replace(base);
      return false;
    }
    return true;
  }

  // =============================
  // Botão "Sair" no header (chamativo)
  // =============================
  function injectLogout() {
    if (!hasAuth()) return;

    // Evita duplicação
    if (document.getElementById('dg-logout')) return;

    const headerInner = document.querySelector('.md-header__inner');
    if (!headerInner) return;

    const btn = document.createElement('button');
    btn.id = 'dg-logout';
    btn.type = 'button';
    btn.title = 'Sair';
    // Ícone ⇨ conforme sua escolha
    btn.textContent = '⇨  Sair';
    // Estilo chamativo, mantendo identidade DHL
    btn.style.marginLeft = '12px';
    btn.style.padding = '8px 14px';
    btn.style.border = 'none';
    btn.style.borderRadius = '20px';
    btn.style.background = '#C4001A';      // DHL Red
    btn.style.color = '#fff';
    btn.style.fontWeight = '700';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    btn.style.transition = 'transform .08s ease, filter .12s ease';
    btn.onmouseenter = () => (btn.style.filter = 'brightness(1.05)');
    btn.onmouseleave = () => (btn.style.filter = 'none');
    btn.onmousedown = () => (btn.style.transform = 'scale(0.98)');
    btn.onmouseup = () => (btn.style.transform = 'scale(1)');

    btn.onclick = () => {
      clearAuth();
      window.location.href = basePath() + 'login.html';
    };

    // Container à direita do header
    const rightSlot =
      document.querySelector('.md-header__options') || headerInner;
    rightSlot.appendChild(btn);
  }

  // =============================
  // Ocultar UI do GitHub no topo
  // =============================
  function hideGitHubUi() {
    // Botão de “Edit on GitHub” / “View source”
    const selectors = [
      '.md-header__source',          // bloco fonte no header
      '.md-source__facts',           // detalhes do repo
      '.md-source',                  // wrapper de fonte
      'a.md-source__button',         // botão
      'a[href*="github.com"][class*="md-header"]',
      'a[href*="github.com"][class*="md-source"]',
    ];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.display = 'none';
      });
    });
  }

  // =============================
  // Ícone lateral dinâmico por página
  // =============================
  function injectPageIcon() {
    if (isLoginPage()) return;

    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;

    // Evita duplicar
    if (document.getElementById('dg-page-icon')) return;

    const img = document.createElement('img');
    img.id = 'dg-page-icon';
    img.alt = 'Ícone da página';
    img.style.width = '100px';
    img.style.display = 'block';
    img.style.margin = '16px auto';

    const path = location.pathname;

    // ===== Mapeamento solicitado =====
    // Produtos Biológicos → wmx.svg
    if (path.includes('biologicos')) {
      img.src = basePath() + 'wmx.svg';

    // Excepted Quantities → atomo.svg
    } else if (path.includes('excepted')) {
      img.src = basePath() + 'atomo.svg';

    // Full DG → atomo.svg
    } else if (path.includes('full-dg')) {
      img.src = basePath() + 'atomo.svg';

    // Baterias → bat.svg
    } else if (path.includes('bateria')) {
      img.src = basePath() + 'bat.svg';

    // Gelo seco → dry.svg
    } else if (path.includes('gelo-seco')) {
      img.src = basePath() + 'dry.svg';

    // Perfumes → per.svg
    } else if (path.includes('perfumes')) {
      img.src = basePath() + 'per.svg';

    // Bebidas / Documentos → doc.svg
    } else if (path.includes('bebidas')) {
      img.src = basePath() + 'doc.svg';
    } else if (path.includes('documentos')) {
      img.src = basePath() + 'doc.svg';

    // Fallback (home, outras) → mantém avião antigo se quiser
    } else {
      img.src = basePath() + 'avião-dhl.gif';
    }

    toc.parentElement.appendChild(img);
  }

  // =============================
  // Overlay inline (opcional/desligado)
  // =============================
  const USE_INLINE_OVERLAY = false;
  function maybeShowInlineOverlay() {
    if (!USE_INLINE_OVERLAY || isLoginPage() || hasAuth()) return;

    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                  background:#fff;z-index:9999;display:flex;flex-direction:column;
                  justify-content:center;align-items:center;font-family:sans-serif;">
        <h2 style="margin-bottom:12px;">🔒 Acesso Restrito</h2>
        <input id="usuario-inline" type="text" inputmode="numeric" maxlength="9"
               placeholder="Conta (9 dígitos)"
               style="margin:8px;padding:10px;width:240px;text-align:center;font-size:16px;border:1px solid #ddd;border-radius:8px"/>
        <input id="senha-inline" type="password"
               placeholder="Senha"
               style="margin:8px;padding:10px;width:240px;text-align:center;font-size:16px;border:1px solid #ddd;border-radius:8px"/>
        <button id="entrar-inline"
                style="padding:10px 20px;background:#FFCC00;color:#000;border:none;border-radius:20px;font-weight:bold;cursor:pointer;margin-top:8px;">
          Entrar
        </button>
        <p id="erro-inline" style="color:#C4001A;margin-top:10px;display:none;">Conta ou senha inválidos.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const senhaCorreta = 'dhl1234!';
    document.getElementById('entrar-inline').addEventListener('click', () => {
      const u = (document.getElementById('usuario-inline').value || '').trim();
      const s = (document.getElementById('senha-inline').value || '').trim();
      if (/^\d{9}$/.test(u) && s === senhaCorreta) {
        setAuthOk(12);
        overlay.remove();
        injectLogout();
        hideGitHubUi();
        injectPageIcon();
      } else {
        document.getElementById('erro-inline').style.display = 'block';
      }
    });
  }

  // =============================
  // Execução inicial
  // =============================
  if (!guard()) return;
  injectLogout();
  hideGitHubUi();
  injectPageIcon();
  maybeShowInlineOverlay();

  // Reexecuta após navegação interna no MkDocs Material (SPA)
  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      hideGitHubUi();
      // Remove ícone antigo para evitar acumular ao trocar de página
      const old = document.getElementById('dg-page-icon');
      if (old) old.remove();
      injectPageIcon();
    });
  }
})();

/* ======================================================
   Bloco específico para validar o login.html
   (sem interferir nas demais páginas)
   ====================================================== */
(function () {
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }
  function setAuthOk(hours = 8) {
    const exp = Date.now() + hours * 60 * 60 * 1000;
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
        errorBox.textContent = 'Conta ou senha inválidos.';
        errorBox.style.display = 'block';
        return;
      }

      // Autenticação ok
      setAuthOk(12);
      window.location.replace(basePath());
    });
  });
})();
