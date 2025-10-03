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

 // ====== Botão "Sair" no header (cria ou reestiliza) ======
function injectLogout() {
  if (!hasAuth()) return;

  const header = document.querySelector('.md-header__inner');
  if (!header) return;

  // Função para aplicar estilo e eventos (serve para criar ou atualizar)
  const styleLogoutBtn = (btn) => {
    btn.id = 'dg-logout';
    btn.innerHTML = '⇨ Sair';
    btn.setAttribute('aria-label', 'Sair');
    btn.style.marginLeft = '24px';          // espaço da barra de busca
    btn.style.marginRight = '12px';
    btn.style.padding = '4px 10px';         // menor
    btn.style.borderRadius = '9999px';      // bem arredondado
    btn.style.backgroundColor = '#C4001A';  // vermelho DHL
    btn.style.color = '#fff';
    btn.style.fontWeight = '600';
    btn.style.fontSize = '13px';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background-color 0.2s ease, transform 0.05s ease';
    btn.style.textDecoration = 'none';
    btn.style.display = 'inline-block';
    btn.style.userSelect = 'none';
    btn.style.lineHeight = '1.2';

    // limpa handlers antigos para evitar empilhamento
    btn.onmouseenter = null;
    btn.onmouseleave = null;
    btn.onmousedown  = null;
    btn.onmouseup    = null;
    btn.onclick      = null;

    // Hover / active
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = '#000';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = '#C4001A';
    });
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.98)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'scale(1)';
    });

    // Ação
    btn.onclick = () => {
      clearAuth();
      window.location.href = basePath() + 'login.html';
    };
  };

  // Se já existe, apenas reestiliza. Senão, cria novo.
  let a = document.getElementById('dg-logout');
  if (!a) {
    a = document.createElement('a');
    styleLogoutBtn(a);
    header.appendChild(a);
  } else {
    styleLogoutBtn(a);
  }
}

  // ====== Oculta o link do GitHub no header ======
  function hideGitHubLink() {
    const repo = document.querySelector('.md-header__source');
    if (repo) repo.style.display = 'none';
  }

  // ====== Seleciona ícone por página ======
  function getIconForPath(pathname) {
    // normaliza para minúsculas
    const p = (pathname || '').toLowerCase();

    // Mapa solicitado:
    // faq.svg → FAQ
    if (p.includes('/faq') || p.endsWith('/faq/') || p.endsWith('/faq')) return 'faq.svg';
    // inicio.svg → INDEX (home)
    if (p === '/' || p === basePath() || p.endsWith('/index.html')) return 'inicio.svg';
    // beb.svg → bebidas
    if (p.includes('/bebidas')) return 'beb.svg';
    // eq.svg → eq (Excepted Quantities)
    if (p.includes('/eq')) return 'eq.svg';
    // bat.svg → bateria
    if (p.includes('/bateria')) return 'bat.svg';
    // dry.svg → gelo-seco
    if (p.includes('/gelo-seco')) return 'dry.svg';
    // per.svg → perfumes
    if (p.includes('/perfume') || p.includes('/perfumes')) return 'per.svg';
    // atomo.svg → fulldg (aceita variantes)
    if (p.includes('/full-dg') || p.includes('/fulldg') || p.includes('/fulldg') || p.includes('/full')) return 'atomo.svg';
    // wmx.svg → biológico
    if (p.includes('/biologico') || p.includes('/biológicos') || p.includes('/biologicos')) return 'wmx.svg';
    // doc.svg → documentos exigidos
    if (p.includes('/documentos')) return 'doc.svg';

    // fallback para a home
    return 'inicio.svg';
  }

  // ====== Injeta o SVG no índice (TOC) ======
  function injectIcon() {
    if (isLoginPage()) return;
    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;

    // evita duplicação
    const old = document.getElementById('dg-page-icon');
    if (old) old.remove();

    const img = document.createElement('img');
    img.id = 'dg-page-icon';
    img.alt = 'Ícone DG';
    img.style.width = '100px';
    img.style.display = 'block';
    img.style.margin = '16px auto';

    const iconFile = getIconForPath(location.pathname);
    img.src = basePath() + iconFile;

    toc.parentElement.appendChild(img);
  }

  // ====== Execução inicial ======
  if (!guard()) return;
  injectLogout();
  hideGitHubLink();
  injectIcon();

  // Reexecuta em navegações internas do MkDocs Material (SPA)
  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      hideGitHubLink();
      injectIcon();
    });
  }
})();
/* ===================== TOP NAV – Barra branca + drop-down Produtos ===================== */
(function () {
  // Usa a mesma basePath do seu arquivo (se você já a declarou, reutiliza)
  function basePath() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? `/${parts[0]}/` : '/';
  }

  // Evita duplicar quando navegar via SPA do MkDocs
  function hasTopbar() {
    return document.querySelector('.dg-topbar-wrap');
  }

  // Links úteis com basePath para funcionar em GitHub Pages de projeto
  const links = {
    home:           basePath(),
    faq:            basePath() + 'faq/',
    aprovacao:      basePath() + 'aprovacao/',
    documentos:     basePath() + 'documentos/',
    bateria:        basePath() + 'bateria/',
    bebidas:        basePath() + 'bebidas/',
    gelo:           basePath() + 'gelo-seco/',
    perfume:        basePath() + 'perfume/',
    biologicos:     basePath() + 'biologicos/',
    eq:             basePath() + 'eq/',
    fulldg:         basePath() + 'fulldg/'
  };

  function injectTopbar() {
    if (hasTopbar()) return;

    // Envolve para ficar sticky logo abaixo do header amarelo
    const wrap = document.createElement('div');
    wrap.className = 'dg-topbar-wrap';

    // Barra em si
    const bar = document.createElement('nav');
    bar.className = 'dg-topbar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Navegação principal');

    // Itens: Início, FAQ, Produtos (dropdown), Aprovação de Conta, Documentos Exigidos
    bar.innerHTML = `
      <a href="${links.home}">Início</a>
      <a href="${links.faq}">FAQ Técnico</a>

      <div class="dg-dropdown">
        <button type="button" class="dg-dropbtn" aria-haspopup="true" aria-expanded="false">
          Produtos <span class="dg-caret">▾</span>
        </button>
        <div class="dg-menu" role="menu">
          <a role="menuitem" href="${links.bateria}">Baterias de Lítio</a>
          <a role="menuitem" href="${links.bebidas}">Bebidas Alcoólicas</a>
          <a role="menuitem" href="${links.gelo}">Gelo Seco</a>
          <a role="menuitem" href="${links.perfume}">Perfumes</a>
          <a role="menuitem" href="${links.biologicos}">Produtos Biológicos</a>
          <a role="menuitem" href="${links.eq}">Cargas em Quantidades Excetuadas (EQ)</a>
          <a role="menuitem" href="${links.fulldg}">Cargas Perigosas Totais (Full DG)</a>
        </div>
      </div>

      <a href="${links.aprovacao}">Aprovação de Conta</a>
      <a href="${links.documentos}">Documentos Exigidos</a>
    `;

    wrap.appendChild(bar);

    // Insere logo DEPOIS do header amarelo do Material
    const header = document.querySelector('.md-header');
    if (header && header.parentElement) {
      header.parentElement.insertBefore(wrap, header.nextSibling);
    } else {
      // fallback: cola no começo do body
      document.body.insertBefore(wrap, document.body.firstChild);
    }

    // Acessibilidade: abre/fecha no clique/toque (mobile) sem depender de :hover
    const dropdown = bar.querySelector('.dg-dropdown');
    const btn = bar.querySelector('.dg-dropbtn');

    function closeOnOutsideClick(ev) {
      if (!dropdown.contains(ev.target)) {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeOnOutsideClick);
      }
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        document.addEventListener('click', closeOnOutsideClick);
      } else {
        document.removeEventListener('click', closeOnOutsideClick);
      }
    });
  }

  // Injeta agora…
  document.addEventListener('DOMContentLoaded', injectTopbar);

  // …e após trocas internas de página (SPA do MkDocs Material)
  if (window.document$) {
    document$.subscribe(() => {
      injectTopbar();
    });
  }
})();
/* =========================
   MEGA-MENU – faixa branca
   ========================= */
function dgBasePath() {
  const parts = location.pathname.split('/').filter(Boolean);
  return parts.length ? `/${parts[0]}/` : '/';
}

function injectTopNavMega() {
  // evita duplicar
  const old = document.getElementById('dg-topnav');
  if (old) old.remove();

  const header = document.querySelector('.md-header');
  if (!header) return;

  const nav = document.createElement('div');
  nav.id = 'dg-topnav';
  nav.innerHTML = `
    <div class="dg-wrap">
      <a class="dg-link" href="${dgBasePath()}">Início</a>

      <a class="dg-link" href="${dgBasePath()}faq/">FAQ Técnico</a>

      <div class="dg-drop">
        <a class="dg-link" href="javascript:void(0)" aria-haspopup="true" aria-expanded="false">
          Produtos <span class="dg-caret">▾</span>
        </a>
        <div class="dg-panel" role="menu">
          <div class="dg-grid">
            <a role="menuitem" href="${dgBasePath()}bateria/">Baterias de Lítio</a>
            <a role="menuitem" href="${dgBasePath()}bebidas/">Bebidas Alcoólicas</a>
            <a role="menuitem" href="${dgBasePath()}gelo-seco/">Gelo Seco</a>
            <a role="menuitem" href="${dgBasePath()}perfumes/">Perfumes</a>
            <a role="menuitem" href="${dgBasePath()}biologicos/">Produtos Biológicos</a>
            <a role="menuitem" href="${dgBasePath()}eq/">Cargas em Quantidades Excetuadas (EQ)</a>
            <a role="menuitem" href="${dgBasePath()}fulldg/">Cargas Perigosas Totais (Full DG)</a>
          </div>
        </div>
      </div>

      <a class="dg-link" href="${dgBasePath()}aprovacao/">Aprovação de Conta</a>
      <a class="dg-link" href="${dgBasePath()}documentos/">Documentos Exigidos</a>
    </div>
  `;
  header.insertAdjacentElement('afterend', nav);

  // Comportamento do dropdown (hover + teclado + clique fora)
  const drop = nav.querySelector('.dg-drop');
  const trigger = drop.querySelector('.dg-link');
  const panel = drop.querySelector('.dg-panel');

  function open()  { drop.classList.add('open');  trigger.setAttribute('aria-expanded','true'); }
  function close() { drop.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }

  // abre no hover
  drop.addEventListener('mouseenter', open);
  drop.addEventListener('mouseleave', close);

  // toggle no click (mobile/touch)
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    drop.classList.toggle('open');
    trigger.setAttribute('aria-expanded', drop.classList.contains('open') ? 'true' : 'false');
  });

  // fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!drop.contains(e.target)) close();
  });

  // tecla ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // marca link ativo pela URL (só visual)
  const links = nav.querySelectorAll('.dg-link[href]');
  const here = location.pathname.replace(/\/$/, '');
  links.forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (href && here === href) a.classList.add('is-active');
  });
}

/* ==========
   CHAMADA
   ==========
   Garanta que você chama injectTopNavMega() junto com
   as outras rotinas que já executa após carregar a página.
*/

// Exemplo de chamada imediata (caso seu extra.js já use guard/document$):
document.addEventListener('DOMContentLoaded', () => {
  injectTopNavMega();
});

// Se você usa o SPA do MkDocs Material:
if (window.document$) {
  document$.subscribe(() => {
    injectTopNavMega();
  });
}

