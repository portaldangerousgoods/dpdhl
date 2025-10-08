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

    // ===== Estilo atualizado (retângulo com cantos arredondados) =====
    btn.style.marginLeft = '16px';            // distância da barra de busca
    btn.style.marginRight = '32px';           // distância do canto direito
    btn.style.padding = '10px 26px';          // corpo do botão
    btn.style.borderRadius = '6px';           // cantos arredondados (não mais pílula)
    btn.style.backgroundColor = '#D40511';    // vermelho DHL
    btn.style.color = '#fff';
    btn.style.fontWeight = '700';
    btn.style.fontSize = '15px';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background-color 0.2s ease, transform 0.05s ease, box-shadow 0.2s ease';
    btn.style.textDecoration = 'none';
    btn.style.display = 'inline-block';
    btn.style.userSelect = 'none';
    btn.style.lineHeight = '1.3';
    btn.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.15)';

    // ===== Eventos =====
    btn.onmouseenter = null; 
    btn.onmouseleave = null;
    btn.onmousedown = null; 
    btn.onmouseup = null; 
    btn.onclick = null;

    // Hover / active
    btn.addEventListener('mouseenter', () => { 
      btn.style.backgroundColor = '#a00015'; 
      btn.style.boxShadow = '0 5px 10px rgba(0,0,0,0.25)';
    });
    btn.addEventListener('mouseleave', () => { 
      btn.style.backgroundColor = '#D40511'; 
      btn.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
    });
    btn.addEventListener('mousedown', () => { 
      btn.style.transform = 'scale(0.98)'; 
    });
    btn.addEventListener('mouseup', () => { 
      btn.style.transform = 'scale(1)'; 
    });

    // Clique: ação de logout
    btn.onclick = () => { 
      clearAuth(); 
      window.location.href = basePath() + 'login.html'; 
    };
  };

  // Cria ou atualiza o botão
  let a = document.getElementById('dg-logout');
  if (!a) { 
    a = document.createElement('a'); 
    styleLogoutBtn(a); 
    header.appendChild(a); 
  } else { 
    styleLogoutBtn(a); 
  }
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
    if (p.includes('/bateria')) return 'bat.svg';
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

/* ===== Dropdown de sugestões sob a barra (força exibição) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector(".md-header__inner .md-search");
  if (!search) return;

  const input  = search.querySelector('input[data-md-component="search-query"]');
  const output = search.querySelector(".md-search__output");
  const overlay = search.querySelector(".md-search__overlay");

  // Não usa overlay em tela cheia
  if (overlay) overlay.style.display = "none";

  // Garante posicionamento relativo/absoluto
  search.style.position = "absolute";
  if (output) {
    output.style.position = "absolute";
    output.style.left = "0";
    output.style.top  = "calc(100% + 8px)";
  }

  // Exibe o dropdown quando digitar algo; esconde quando limpar
  function toggleDropdown() {
    if (!output) return;
    const q = (input.value || "").trim();
    if (q.length > 0) {
      output.removeAttribute("hidden");
    } else {
      output.setAttribute("hidden", "");
    }
  }

  if (input) {
    input.addEventListener("input", toggleDropdown);
    input.addEventListener("focus", toggleDropdown);
  }

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!search.contains(e.target) && output) {
      output.setAttribute("hidden", "");
    }
  });

  // Fecha com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && output) {
      output.setAttribute("hidden", "");
      input && input.blur();
    }
  });
});
