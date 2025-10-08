(function () {
  /* -------------- Helpers -------------- */
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? /${parts[0]}/ : '/';
  }
  function isLoginPage() {
    const p = location.pathname;
    return p.endsWith('/login.html') || p.endsWith('/login');
  }

  /* -------------- Auth (igual) -------------- */
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

  function guard() {
    const base = basePath();
    if (!hasAuth() && !isLoginPage()) { window.location.replace(base + 'login.html'); return false; }
    if (hasAuth() && isLoginPage())   { window.location.replace(base);               return false; }
    return true;
  }

  /* -------------- Botão SAIR (sempre renderiza) -------------- */
  function injectLogout() {
    const header = document.querySelector('.md-header__inner');
    if (!header) return;

    const styleLogoutBtn = (btn) => {
      btn.id = 'dg-logout';
      btn.innerHTML = '⇨ Sair';
      btn.setAttribute('aria-label', 'Sair');
      btn.style.marginLeft  = '16px';
      btn.style.marginRight = '40px';
      btn.style.padding     = '10px 28px';
      btn.style.borderRadius= '6px';
      btn.style.background  = '#D40511';
      btn.style.color       = '#fff';
      btn.style.fontWeight  = '700';
      btn.style.fontSize    = '15px';
      btn.style.cursor      = 'pointer';
      btn.style.lineHeight  = '1.3';
      btn.style.boxShadow   = '0 3px 6px rgba(0,0,0,.15)';
      btn.style.transition  = 'all .2s ease-in-out';
      btn.onmouseenter = () => { btn.style.background = '#a00015'; btn.style.boxShadow='0 5px 10px rgba(0,0,0,.25)'; };
      btn.onmouseleave = () => { btn.style.background = '#D40511'; btn.style.boxShadow='0 3px 6px rgba(0,0,0,.15)'; };
      btn.onmousedown  = () => { btn.style.transform = 'scale(0.98)'; };
      btn.onmouseup    = () => { btn.style.transform = 'scale(1)'; };
      btn.onclick      = () => { clearAuth(); window.location.href = basePath() + 'login.html'; };
    };

    let a = document.getElementById('dg-logout');
    if (!a) { a = document.createElement('a'); styleLogoutBtn(a); header.appendChild(a); }
    else     { styleLogoutBtn(a); }
  }

  /* -------------- Some com o GitHub do header -------------- */
  function hideGitHubLink() {
    document.querySelectorAll('.md-header__source').forEach(el => el.style.display='none');
  }

  /* -------------- Ícone lateral (quando índice aparece) -------------- */
  function getIconForPath(pathname) {
    const p = (pathname || '').toLowerCase();
    if (p.includes('/faq')) return 'faq.svg';
    if (p === '/'⠺⠟⠟⠞⠟⠞⠟⠞⠺⠺⠟⠵⠵⠞⠞⠞⠟⠞⠞⠺p.endsWith('/index.html')) return 'inicio.svg';
    if (p.includes('/bebidas')) return 'beb.svg';
    if (p.includes('/eq')) return 'eq.svg';
    if (p.includes('/bateria')) return 'bat.svg';
    if (p.includes('/gelo-seco')) return 'dry.svg';
    if (p.includes('/perfume')) return 'per.svg';
    if (p.includes('/full-dg')) return 'atomo.svg';
    if (p.includes('/biologico') || p.includes('/biologicos')) return 'wmx.svg';
    if (p.includes('/documentos')) return 'doc.svg';
    return 'inicio.svg';
  }
  function injectIcon() {
    if (isLoginPage()) return;
    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;
    const old = document.getElementById('dg-page-icon'); if (old) old.remove();
    const img = document.createElement('img');
    img.id = 'dg-page-icon'; img.alt = 'Ícone DG'; img.style.width='100px';
    img.style.display='block'; img.style.margin='16px auto';
    img.src = basePath() + getIconForPath(location.pathname);
    toc.parentElement.appendChild(img);
  }

> Natália:
/* -------------- Mega menu (já usado) -------------- */
  function injectTopNavMega() {
    const old = document.getElementById('dg-topnav'); if (old) old.remove();
    const header = document.querySelector('.md-header'); if (!header) return;

    const nav = document.createElement('div');
    nav.id = 'dg-topnav';
    nav.innerHTML = `
      <div class="dg-wrap">
        <a class="dg-link" href="${basePath()}">Início</a>
        <a class="dg-link" href="${basePath()}faq/">FAQ Técnico</a>
        <div class="dg-drop">
          <a class="dg-link" href="javascript:void(0)" aria-haspopup="true" aria-expanded="false">
            Produtos <span class="dg-caret">▾</span>
          </a>
          <div class="dg-panel" role="menu">
            <div class="dg-grid">
              <a role="menuitem" href="${basePath()}baterias/">Baterias de Lítio</a>
              <a role="menuitem" href="${basePath()}bebidas/">Bebidas Alcoólicas</a>
              <a role="menuitem" href="${basePath()}gelo-seco/">Gelo Seco</a>
              <a role="menuitem" href="${basePath()}perfumes/">Perfumes</a>
              <a role="menuitem" href="${basePath()}biologicos/">Produtos Biológicos</a>
              <a role="menuitem" href="${basePath()}eq/">Cargas em Quantidades Excetuadas (EQ)</a>
              <a role="menuitem" href="${basePath()}full-dg/">Cargas Perigosas Totais (Full DG)</a>
            </div>
          </div>
        </div>
        <a class="dg-link" href="${basePath()}aprovacao/">Aprovação de Conta</a>
        <a class="dg-link" href="${basePath()}documentos/">Documentos Exigidos</a>
      </div>
    `;
    header.insertAdjacentElement('afterend', nav);

    const drop = nav.querySelector('.dg-drop');
    const trigger = drop?.querySelector(':scope > .dg-link');
    const panel = drop?.querySelector(':scope > .dg-panel');

    if (drop && trigger && panel && drop.dataset.wired !== '1') {
      drop.dataset.wired = '1';
      trigger.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        drop.classList.toggle('open');
        trigger.setAttribute('aria-expanded', drop.classList.contains('open') ? 'true' : 'false');
      });
      document.addEventListener('click', (e) => {
        if (!drop.contains(e.target)) { drop.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { drop.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }
      });
      panel.addEventListener('click', (e) => e.stopPropagation());
    }

    const here = location.pathname.replace(/\/$/, '');
    nav.querySelectorAll('.dg-link[href]').forEach(a => {
      const href = a.getAttribute('href').replace(/\/$/, '');
      if (href && here === href) a.classList.add('is-active');
    });
  }

  /* -------------- Executa -------------- */
  if (!guard()) return;
  injectLogout();
  hideGitHubLink();
  injectTopNavMega();
  injectIcon();

  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      hideGitHubLink();
      injectTopNavMega();
      injectIcon();
    });
  }
})();

/* ===========================================================
   Força a lista de resultados do Material aparecer como dropdown
   logo abaixo do campo e SOBREPOR o menu.
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.md-header__inner [data-md-component="search"]');
  if (!root) return;

  const input  = root.querySelector('input[data-md-component="search-query"]');
  const result = root.querySelector('[data-md-component="search-result"]') ||
                 root.querySelector('.md-search__output');
  const overlay = root.querySelector('.md-search__overlay');

  if (overlay) overlay.style.display = 'none';
  root.style.position = 'absolute';
  if (result) {
    result.style.position = 'absolute';
    result.style.left = '0';
    result.style.

> Natália:
top  = 'calc(100% + 8px)';
  }

  function openDD(){
    if (!result) return;
    root.setAttribute('data-md-state','active');
    result.removeAttribute('hidden');
  }
  function closeDD(){
    if (!result) return;
    result.setAttribute('hidden','');
    root.removeAttribute('data-md-state');
  }

  if (input){
    input.addEventListener('input', () => {
      const v = (input.value || '').trim();
      if (v.length >= 2) openDD(); else closeDD();
    });
    input.addEventListener('focus', () => {
      if ((input.value || '').trim().length >= 2) openDD();
    });
  }
  document.addEventListener('click', (e) => { if (!root.contains(e.target)) closeDD(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDD(); });
});
