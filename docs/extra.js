(function () {
  /* ===== Helpers ===== */
  function basePath() {
    const p = location.pathname.split('/').filter(Boolean);
    return p.length ? `/${p[0]}/` : '/';
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
  function setAuth() {
    const token = { ok: true, ts: Date.now(), exp: Date.now() + 12 * 60 * 60 * 1000 };
    localStorage.setItem('dg_auth', JSON.stringify(token));
  }
  function clearAuth() { localStorage.removeItem('dg_auth'); }

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

  /* ===== Botão Sair – alinhado à direita ===== */
  function injectLogout() {
    if (!hasAuth()) return;
    const header = document.querySelector('.md-header__inner');
    if (!header) return;

    const styleLogoutBtn = (btn) => {
      btn.id = 'dg-logout';
      btn.innerHTML = '⇨ Sair';
      btn.setAttribute('aria-label', 'Sair');
      btn.style.padding = '4px 10px';
      btn.style.borderRadius = '9999px';
      btn.style.backgroundColor = '#C4001A';
      btn.style.color = '#fff';
      btn.style.fontWeight = '600';
      btn.style.fontSize = '13px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'background-color 0.2s ease, transform 0.05s ease';
      btn.style.textDecoration = 'none';
      btn.style.display = 'inline-block';
      btn.style.userSelect = 'none';
      btn.style.lineHeight = '1.2';

      /* >>> empurra para a ponta direita, com folga <<< */
      btn.style.marginLeft = 'auto';
      btn.style.marginRight = '16px';

      btn.onmouseenter = null;
      btn.onmouseleave = null;
      btn.onmousedown  = null;
      btn.onmouseup    = null;
      btn.onclick      = null;

      btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = '#000'; });
      btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = '#C4001A'; });
      btn.addEventListener('mousedown',  () => { btn.style.transform = 'scale(0.98)'; });
      btn.addEventListener('mouseup',    () => { btn.style.transform = 'scale(1)'; });

      btn.onclick = () => {
        clearAuth();
        window.location.href = basePath() + 'login.html';
      };
    };

    let a = document.getElementById('dg-logout');
    if (!a) {
      a = document.createElement('a');
      styleLogoutBtn(a);
      header.appendChild(a);
    } else {
      styleLogoutBtn(a);
    }
  }

  /* ===== Oculta link do GitHub no header ===== */
  function hideGitHubLink() {
    const repo = document.querySelector('.md-header__source');
    if (repo) repo.style.display = 'none';
  }

  /* ===== Remove qualquer barra antiga (evita conflito) ===== */
  function removeLegacyTopbar() {
    document.querySelectorAll('.dg-topbar, .dg-topbar-wrap').forEach(n => n.remove());
  }

  /* ===== Mega-menu (faixa branca) ===== */
  function injectTopNavMega() {
    removeLegacyTopbar();
    const old = document.getElementById('dg-topnav');
    if (old) old.remove();

    const header = document.querySelector('.md-header');
    if (!header) return;

    const bp = basePath();
    const nav = document.createElement('div');
    nav.id = 'dg-topnav';
    nav.innerHTML = `
      <div class="dg-wrap">
        <a class="dg-link" href="${bp}">Início</a>
        <a class="dg-link" href="${bp}faq/">FAQ Técnico</a>

        <div class="dg-drop">
          <a class="dg-link" href="javascript:void(0)" aria-haspopup="true" aria-expanded="false">
            Produtos <span class="dg-caret">▾</span>
          </a>
          <div class="dg-panel" role="menu">
            <div class="dg-grid">
              <a role="menuitem" href="${bp}bateria/">Baterias de Lítio</a>
              <a role="menuitem" href="${bp}bebidas/">Bebidas Alcoólicas</a>
              <a role="menuitem" href="${bp}gelo-seco/">Gelo Seco</a>
              <a role="menuitem" href="${bp}perfumes/">Perfumes</a>
              <a role="menuitem" href="${bp}biologicos/">Produtos Biológicos</a>
              <a role="menuitem" href="${bp}eq/">Cargas em Quantidades Excetuadas (EQ)</a>
              <a role="menuitem" href="${bp}fulldg/">Cargas Perigosas Totais (Full DG)</a>
            </div>
          </div>
        </div>

        <a class="dg-link" href="${bp}aprovacao/">Aprovação de Conta</a>
        <a class="dg-link" href="${bp}documentos/">Documentos Exigidos</a>
      </div>
    `;
    header.insertAdjacentElement('afterend', nav);

    const drop    = nav.querySelector('.dg-drop');
    const trigger = drop.querySelector('.dg-link');

    function open()  { drop.classList.add('open');  trigger.setAttribute('aria-expanded','true'); }
    function close() { drop.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }

    drop.addEventListener('mouseenter', open);
    drop.addEventListener('mouseleave', close);
    trigger.addEventListener('click', (e) => { e.preventDefault(); drop.classList.toggle('open'); trigger.setAttribute('aria-expanded', drop.classList.contains('open') ? 'true' : 'false'); });
    document.addEventListener('click', (e) => { if (!drop.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    /* Marca ativo e garante tamanho do “Produtos” */
    const links = nav.querySelectorAll('.dg-link[href]');
    const here  = location.pathname.replace(/\/$/, '');
    links.forEach(a => {
      const href = a.getAttribute('href').replace(/\/$/, '');
      if (href && here === href) a.classList.add('is-active');
    });
    const isProdutosPage = /\/(bateria|bebidas|gelo-seco|perfumes?|biologicos|eq|fulldg)\/?$/.test(here);
    if (isProdutosPage) trigger.classList.add('is-active');

    /* Mesma tipografia nos “Produtos” */
    trigger.style.fontSize   = '16px';
    trigger.style.fontWeight = '400';
  }

  /* ===== Run ===== */
  if (!guard()) return;
  injectLogout();
  hideGitHubLink();
  injectTopNavMega();

  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      hideGitHubLink();
      injectTopNavMega();
    });
  }
})();

/* ===== Controle do Dropdown de Produtos ===== */
document.addEventListener("DOMContentLoaded", function () {
  const dropToggle = document.querySelector("#dg-topnav .dg-drop");
  const dropPanel = document.querySelector("#dg-topnav .dg-drop .dg-panel");

  if (dropToggle && dropPanel) {
    // abre/fecha ao clicar em Produtos
    dropToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropToggle.classList.toggle("open");
    });

    // fecha ao clicar fora
    document.addEventListener("click", function (e) {
      if (!dropToggle.contains(e.target)) {
        dropToggle.classList.remove("open");
      }
    });
  }
});
