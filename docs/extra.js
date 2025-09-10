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

  // ====== Seu GIF do avião no índice (TOC) ======
  function injectGif() {
    // Não mostra GIF na página de login
    if (isLoginPage()) return;

    const toc = document.querySelector('.md-sidebar--secondary nav');
    if (!toc) return;

    // evita duplicação
    if (document.getElementById('gif-aviao-dhl')) return;

    const img = document.createElement('img');
    img.id = 'gif-aviao-dhl';
    img.src = basePath() + 'avião-dhl.gif'; // caminho relativo ao base do site
    img.alt = 'Avião DHL';
    img.style.width = '100px';
    img.style.display = 'block';
    img.style.margin = '16px auto';

    toc.parentElement.appendChild(img);
  }

  // ====== Tela de login embutida (opcional) ======
  // Se você estiver usando login.html dedicado, não precisa deste overlay inline.
  // Mantive um "modo overlay" opcional caso queira forçar login numa única página.
  // Por padrão, deixei DESATIVADO.
  const USE_INLINE_OVERLAY = false;
  function maybeShowInlineOverlay() {
    if (!USE_INLINE_OVERLAY || isLoginPage() || hasAuth()) return;

    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                  background:white;z-index:9999;display:flex;flex-direction:column;
                  justify-content:center;align-items:center;font-family:sans-serif;">
        <h2>🔒 Acesso Restrito</h2>
        <input id="usuario-inline" type="text" maxlength="9" placeholder="Digite o código de 9 dígitos"
               style="margin:8px;padding:8px;width:220px;text-align:center;font-size:16px"/>
        <input id="senha-inline" type="password" placeholder="Senha"
               style="margin:8px;padding:8px;width:220px;text-align:center;font-size:16px"/>
        <button id="entrar-inline"
                style="padding:10px 20px;background:#FFCC00;color:#000;border:none;font-weight:bold;cursor:pointer;">
          Entrar
        </button>
        <p id="erro-inline" style="color:red;margin-top:10px;display:none;">Usuário ou senha incorretos</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const senhaCorreta = 'dhl2025!';
    document.getElementById('entrar-inline').addEventListener('click', () => {
      const u = document.getElementById('usuario-inline').value;
      const s = document.getElementById('senha-inline').value;
      if (/^\d{9}$/.test(u) && s === senhaCorreta) {
        setAuth();
        overlay.remove();
        // Reaplica elementos pós-login
        injectLogout();
        injectGif();
      } else {
        document.getElementById('erro-inline').style.display = 'block';
      }
    });
  }

  // ====== Execução inicial ======
  if (!guard()) return;        // bloqueia/ajusta rota se necessário
  injectLogout();              // mostra "Sair" se logado
  injectGif();                 // mantém seu GIF no ToC
  maybeShowInlineOverlay();    // geralmente desativado

  // ====== Reexecuta após navegações internas (SPA do MkDocs Material) ======
  if (window.document$) {
    document$.subscribe(() => {
      if (!guard()) return;
      injectLogout();
      injectGif();
      // overlay inline só se ativado
      maybeShowInlineOverlay();
    });
  }
})();
