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
  function setAuth() {
    const token = { ok: true, ts: Date.now(), exp: Date.now() + 12 * 60 * 60 * 1000 }; // 12h
    localStorage.setItem('dg_auth', JSON.stringify(token));
  }
  function clearAuth() { localStorage.removeItem('dg_auth'); }

  function guard() {
    const base = basePath();
    if (!hasAuth() && !isLoginPage()) {
      window.location.replace(base + 'login.html'); return false;
    }
    if (hasAuth() && isLoginPage()) {
      window.location.replace(base); return false;
    }
    return true;
  }

  /* ===== Botão SAIR ===== */
  function injectLogout() {
    if (!hasAuth()) return;
    const header = document.querySelector('.md-header__inner');
    if (!header) return;

    const styleLogoutBtn = (btn) => {
      btn.id = 'dg-logout';
      btn.innerHTML = '⇨ Sair';
      btn.setAttribute('aria-label', 'Sair');
      btn.style.marginLeft = '24px';
      btn.style.marginRight = '12px';
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
      btn.onmouseenter = null; btn.onmouseleave = null;
      btn.onmousedown = null; btn.onmouseup = null; btn.onclick = null;
      btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = '#000'; });
      btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = '#C4001A'; });
      btn.addEventListener('mousedown',  () => { btn.style.transform = 'scale(0.98)'; });
      btn.addEventListener('mouseup',    () => { btn.style.transform = 'scale(1)'; });
      btn.onclick = () => { clearAuth(); window.location.href = basePath() + 'login.html'; };
    };

    let a = document.getElementById('dg-logout');
    if (!a) { a = document.createElement('a'); styleLogoutBtn(a); header.appendChild(a); }
    else { styleLogoutBtn(a); }
  }

  /* ===== Esconde link GitHub no header ===== */
  function hideGitHubLink() {
    const repo = document.querySelector('.md-header__source');
    if (repo) repo.style.display = 'none';
  }

  /* ===== Ícone por página (TOC direito — quando visível) ===== */
  function getIconForPath(pathname) {
    const p = (pathname || '').toLowerCase();
    if (p.includes('/faq') || p.endsWith('/faq/') || p.endsWith('/faq')) return 'faq.svg';
    if (p === '/' || p === basePath() || p.endsWith('/index.html')) return 'inicio.svg';
    if (p.includes('/bebidas')) return 'beb.svg';
    if (p.includes('/eq')) return 'eq.svg';
    if (p.includes('/baterias')) return 'bat.svg';
    if (p.includes('/gelo-seco')) return 'dry.svg';
    if (p.includes('/perfume') || p.includes('/perfumes')) return 'per.svg';
    if (p.includes('/full-dg') || p.includes('/fulldg') || p.includes('/full')) return 'atomo.svg';
    if (p.includes('/biologico') || p.includes('/biológicos') || p.includes('/biologicos')) return 'wmx.svg';
    if (p.includes('/documentos')) return 'doc.svg';
    return 'inicio.svg';
  }
  function injectIcon() {
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

  /* ===== Mega-menu (faixa branca abaixo do amarelo) ===== */
  function injectTopNavMega() {
    // remove anterior (evita duplicar)
    const old = document.getElementById('dg-topnav');
    if (old) old.remove();

    const header = document.querySelector('.md-header');
    if (!header) return;

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
              <a role="menuitem" href="${basePath()}bateria/">Baterias de Lítio</a>
              <a role="menuitem" href="${basePath()}bebidas/">Bebidas Alcoólicas</a>
              <a role="menuitem" href="${basePath()}gelo-seco/">Gelo Seco</a>
              <a role="menuitem" href="${basePath()}perfumes/">Perfumes</a>
              <a role="menuitem" href="${basePath()}biologicos/">Produtos Biológicos</a>
              <a role="menuitem" href="${basePath()}eq/">Cargas em Quantidades Excetuadas (EQ)</a>
              <a role="menuitem" href="${basePath()}fulldg/">Cargas Perigosas Totais (Full DG)</a>
            </div>
          </div>
        </div>

        <a class="dg-link" href="${basePath()}aprovacao/">Aprovação de Conta</a>
        <a class="dg-link" href="${basePath()}documentos/">Documentos Exigidos</a>
      </div>
    `;
    header.insertAdjacentElement('afterend', nav);

    // ===== Wire do dropdown (CLIQUE para abrir/fechar; fecha fora/ESC) =====
    const drop   = nav.querySelector('.dg-drop');
    const trigger= drop ? drop.querySelector(':scope > .dg-link') : null;
    const panel  = drop ? drop.querySelector(':scope > .dg-panel') : null;

    if (drop && trigger && panel) {
      // evita dupla inscrição
      if (drop.dataset.wired !== '1') {
        drop.dataset.wired = '1';

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          drop.classList.toggle('open');
          trigger.setAttribute('aria-expanded', drop.classList.contains('open') ? 'true' : 'false');
        });

        // fecha ao clicar fora
        document.addEventListener('click', (e) => {
          if (!drop.contains(e.target)) {
            drop.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });

        // fecha com ESC
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            drop.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });

        // interações dentro do painel não fecham
        panel.addEventListener('click', (e) => e.stopPropagation());
      }
    }

    // marca ativo visualmente
    const here = location.pathname.replace(/\/$/, '');
    nav.querySelectorAll('.dg-link[href]').forEach(a => {
      const href = a.getAttribute('href').replace(/\/$/, '');
      if (href && here === href) a.classList.add('is-active');
    });
  }

  /* ===== Run ===== */
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
      injectTopNavMega();  // recria e re-liga o dropdown após navegação
      injectIcon();
    });
  }
})();
