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

  // ====== Botão "Sair" no header ======
function injectLogout() {
  if (!hasAuth()) return;
  if (document.getElementById('dg-logout')) return;

  const header = document.querySelector('.md-header__inner');
  if (!header) return;

  const a = document.createElement('a');
  a.id = 'dg-logout';
  a.innerHTML = '⇨ Sair';   // <-- texto com a seta

  // estilo do botão (menor, mas visível)
  a.style.marginLeft = 'auto';
  a.style.cursor = 'pointer';
  a.style.fontWeight = '600';
  a.style.fontSize = '14px';        // tamanho reduzido
  a.style.padding = '4px 10px';     // menos espaçamento
  a.style.backgroundColor = '#FFCC00'; // amarelo DHL
  a.style.color = '#000';           // preto
  a.style.borderRadius = '4px';     // cantos arredondados
  a.style.textDecoration = 'none';
  a.style.transition = 'all 0.2s ease-in-out';

  // efeito hover
  a.onmouseenter = () => {
    a.style.backgroundColor = '#D40511'; // vermelho DHL
    a.style.color = '#fff';
  };
  a.onmouseleave = () => {
    a.style.backgroundColor = '#FFCC00';
    a.style.color = '#000';
  };

  a.onclick = () => {
    clearAuth();
    window.location.href = basePath() + 'login.html';
  };

  header.appendChild(a);
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
