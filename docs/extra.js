(function () {
  /* =========================
     Helpers de rota/base
     ========================= */
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }

  /* =========================
     Autenticação simples
     ========================= */
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

  /* =========================
     Guarda de rotas
     ========================= */
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

  /* =========================
     Botão "Sair" (estilo aprovado)
     ========================= */
  function injectLogout() {
    if (!hasAuth()) return;

    const header = document.querySelector('.md-header__inner');
    if (!header) return;

    const styleBtn = (btn) => {
      btn.id = 'dg-logout';
      btn.innerHTML = '⇨ Sair';
      btn.setAttribute('aria-label', 'Sair');

      // estilo (menor, arredondado, vermelho; hover preto)
      btn.style.marginLeft   = '24px';
      btn.style.marginRight  = '12px';
      btn.style.padding      = '4px 10px';
      btn.style.borderRadius = '9999px';
      btn.style.backgroundColor = '#C4001A';
      btn.style.color        = '#fff';
      btn.style.fontWeight   = '600';
      btn.style.fontSize     = '13px';
      btn.style.cursor       = 'pointer';
      btn.style.transition   = 'background-color 0.2s ease, transform 0.05s ease';
      btn.style.textDecoration = 'none';
      btn.style.display      = 'inline-block';
      btn.style.userSelect   = 'none';
      btn.style.lineHeight   = '1.2';

      btn.onmouseenter = () => { btn.style.backgroundColor = '#000'; };
      btn.onmouseleave = () => { btn.style.backgroundColor = '#C4001A'; };
      btn.onmousedown  = () => { btn.style.transform = 'scale(0.98)'; };
      btn.onmouseup    = () => { btn.style.transform = 'scale(1)'; };
      btn.onclick      = () => { clearAuth(); window.location.href = basePath() + 'login.html'; };
    };

    let a = document.getElementById('dg-logout');
    if (!a) {
      a = document.createElement('a');
      styleBtn(a);
      header.appendChild(a);
    } else {
      styleBtn(a);
    }
  }

  /* =========================
     Oculta link "GitHub" do header
     ========================= */
  function hideGitHubLink() {
    const repo = document.querySelector('.md-header__source');
    if (repo) repo.style.display = 'none';
  }

  /* =========================
     Ícone por página (TOC direito)
     ========================= */
  function getIconForPath(pathname) {
    const p = (pathname || '').toLowerCase();
    if (p.includes('/faq') || p.endsWith('/faq/') || p.endsWith('/faq')) return 'faq.svg';
    if (p === '/' || p === basePath() || p.endsWith('/index.html')) return 'inicio.svg';
    if (p.includes('/bebidas'))       return 'beb.svg';
    if (p.includes('/eq'))            return 'eq.svg';
    if (p.includes('/bateria'))       return 'bat.svg';
    if (p.includes('/gelo-seco'))     return 'dry.svg';
    if (p.includes('/perfume'))       return 'per.svg';
    if (p.includes('/full-dg') || p.includes('/fulldg') || p.includes('/full')) return 'atomo.svg';
    if (p.includes('/biologico') || p.includes('/biológicos') || p.includes('/biologicos')) return 'wmx.svg';
    if (p.includes('/documentos'))    return 'doc.svg';
    return 'inicio.svg';
  }

  function injectSectionIcon() {
    if (isLoginPage()) return;
    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;

    const old = document.getElementById('dg-page-icon');
    if (old) old.remove();

    const img = document.createElement('img');
    img.id = 'dg-page-icon';
    img.alt = 'Ícone DG';
    img.style.width = '100px';
    img.style.display = 'block';
    img.style.margin = '16px auto';
    img.src = basePath() + getIconForPath(location.pathname);

    toc.parentElement.appendChild(img);
  }

  /* =========================
     Mega-menu (faixa branca, 1 única)
     ========================= */
  function dgBasePath() { return basePath(); }

  function injectTopNavMega() {
    // Remove qualquer instância anterior (evita duplicação)
    document.querySelectorAll('#dg-topnav').forEach(el => el.remove());

    const header = document.querySelector('.md-header');
    if (!header) return;

    const nav = document.createElement('div');
    nav.id = 'dg-topnav';
    nav.style.width = '100%';
    nav.style.background = '#fff';
    nav.style.borderBottom = '1px solid #e9ecef';
    nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.03)';
    nav.style.zIndex = '7';

    nav.innerHTML = `
      <div class="dg-topnav-inner" style="
        max-width: 1100px;
        margin: 0 auto;
        padding: 10px 16px;
        display: flex;
        gap: 28px;
        align-items: center;
      ">
        <a class="dg-link" href="${dgBasePath()}" style="font-weight:700;">Início</a>
        <a class="dg-link" href="${dgBasePath()}faq/">FAQ Técnico</a>

        <div class="dg-mega">
          <button class="dg-mega-btn">
            Produtos <span class="dg-caret">▾</span>
          </button>
          <div class="dg-mega-panel">
            <div class="dg-grid">
              <a href="${dgBasePath()}bateria/">Baterias de Lítio</a>
              <a href="${dgBasePath()}bebidas/">Bebidas Alcoólicas</a>
              <a href="${dgBasePath()}gelo-seco/">Gelo Seco</a>
              <a href="${dgBasePath()}perfumes/">Perfumes</a>
              <a href="${dgBasePath()}biologicos/">Produtos Biológicos</a>
              <a href="${dgBasePath()}eq/">Cargas em Quantidades Excetuadas (EQ)</a>
              <a href="${dgBasePath()}fulldg/">Cargas Perigosas Totais (Full DG)</a>
            </div>
          </div>
        </div>

        <a class="dg-link" href="${dgBasePath()}aprovacao/">Aprovação de Conta</a>
        <a class="dg-link" href="${dgBasePath()}documentos/">Documentos Exigidos</a>
      </div>
    `;

    // Insere DEPOIS da faixa amarela (fora do header)
    header.insertAdjacentElement('afterend', nav);

    // estilos do mega
    const style = document.createElement('style');
    style.textContent = `
      #dg-topnav .dg-link { color:#5f6368; text-decoration:none; font-weight:600; }
      #dg-topnav .dg-link:hover { color:#D40511; }

      #dg-topnav .dg-mega { position:relative; }
      #dg-topnav .dg-mega-btn {
        background:transparent; border:0; font-weight:700; color:#5f6368;
        cursor:pointer; padding:0; display:flex; align-items:center; gap:6px;
      }
      #dg-topnav .dg-mega-btn:hover { color:#D40511; }
      #dg-topnav .dg-caret { font-size:12px; }

      #dg-topnav .dg-mega-panel {
        position:absolute; left:0; top:36px; background:#fff; border:1px solid #e9ecef;
        box-shadow:0 8px 24px rgba(0,0,0,0.08); border-radius:10px; padding:18px;
        display:none; min-width:560px;
      }
      #dg-topnav .dg-grid {
        display:grid; grid-template-columns:1fr 1fr; gap:12px 28px;
      }
      #dg-topnav .dg-grid a { color:#5f6368; text-decoration:none; }
      #dg-topnav .dg-grid a:hover { color:#D40511; text-decoration:underline; }
    `;
    document.head.appendChild(style);

    // interações (abrir/fechar)
    const btn   = nav.querySelector('.dg-mega-btn');
    const panel = nav.querySelector('.dg-mega-panel');

    function closeAll() { panel.style.display = 'none'; }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    });
    document.addEventListener('click', closeAll);
    nav.addEventListener('click', (e) => e.stopPropagation());
  }

  /* =========================
     Execução inicial + SPA
     ========================= */
  if (!guard()) return;
  injectLogout();
  hideGitHubLink();
  injectSectionIcon();
  injectTopNavMega();

  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      hideGitHubLink();
      injectSectionIcon();
      injectTopNavMega(); // recria limpando duplicatas
    });
  }

  /* =========================
     Login.html – validação local
     (mantém fora do fluxo das outras páginas)
     ========================= */
  if (isLoginPage()) {
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('dg-login-form');
      if (!form) return;
      const accountInput = document.getElementById('dg-account');
      const passInput    = document.getElementById('dg-pass');
      const errorBox     = document.getElementById('dg-login-error');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const account = (accountInput.value || '').trim();
        const pass    = (passInput.value || '').trim();
        const okAcc   = /^[0-9]{9}$/.test(account);
        const okPass  = pass === 'dhl1234!'; // senha definida por vocês

        if (!okAcc) {
          errorBox.textContent = 'A conta deve ter exatamente 9 dígitos numéricos.';
          errorBox.style.display = 'block';
          return;
        }
        if (!okPass) {
          errorBox.textContent = 'Senha inválida.';
          errorBox.style.display = 'block';
          return;
        }
        setAuth();
        window.location.replace(basePath());
      });
    });
  }
})();
