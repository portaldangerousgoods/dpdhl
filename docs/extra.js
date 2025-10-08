(function () {
  /* ===== Helpers mínimos ===== */
  function basePath(){
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? /${parts[0]}/ : '/';
  }

  /* ===== Botão SAIR (sempre visível quando houver header) ===== */
  function injectLogout(){
    const header=document.querySelector('.md-header__inner');
    if(!header) return;
    let a=document.getElementById('dg-logout');
    if(!a){ a=document.createElement('a'); header.appendChild(a); }
    a.id='dg-logout'; a.textContent='⇨ Sair'; a.setAttribute('aria-label','Sair');
    Object.assign(a.style,{
      marginLeft:'16px', marginRight:'40px', padding:'10px 28px', border:'none',
      borderRadius:'6px', background:'#D40511', color:'#fff', fontWeight:'700',
      fontSize:'15px', lineHeight:'1.3', cursor:'pointer',
      boxShadow:'0 3px 6px rgba(0,0,0,.15)', transition:'all .2s ease-in-out'
    });
    a.onmouseenter=()=>{a.style.background='#a00015';a.style.boxShadow='0 5px 10px rgba(0,0,0,.25)';};
    a.onmouseleave=()=>{a.style.background='#D40511';a.style.boxShadow='0 3px 6px rgba(0,0,0,.15)';};
    a.onmousedown =()=>{a.style.transform='scale(0.98)';};
    a.onmouseup   =()=>{a.style.transform='scale(1)';};
    a.onclick     =()=>{ window.location.href = basePath()+'login.html'; };
  }

  /* ===== Esconde link GitHub nativo (se surgir) ===== */
  function hideGitHubLink(){ document.querySelectorAll('.md-header__source').forEach(e=>e.style.display='none'); }

  /* ===== Mega menu (faixa branca sob o amarelo) ===== */
  function injectTopNavMega(){
    const old=document.getElementById('dg-topnav'); if(old) old.remove();
    const header=document.querySelector('.md-header'); if(!header) return;
    const nav=document.createElement('div'); nav.id='dg-topnav';
    nav.innerHTML=`
      <div class="dg-wrap">
        <a class="dg-link" href="${basePath()}">Início</a>
        <a class="dg-link" href="${basePath()}faq/">FAQ Técnico</a>
        <div class="dg-drop">
          <a class="dg-link" href="javascript:void(0)" aria-haspopup="true" aria-expanded="false">Produtos ▾</a>
          <div class="dg-panel" role="menu">
            <div class="dg-grid">
              <a role="menuitem" href="${basePath()}baterias/">Baterias de Lítio</a>
              <a role="menuitem" href="${basePath()}bebidas/">Bebidas Alcoólicas</a>
              <a role="menuitem" href="${basePath()}gelo-seco/">Gelo Seco</a>
              <a role="menuitem" href="${basePath()}perfumes/">Perfumes</a>
              <a role="menuitem" href="${basePath()}biologicos/">Produtos Biológicos</a>
              <a role="menuitem" href="${basePath()}eq/">Quantidades Excetuadas (EQ)</a>
              <a role="menuitem" href="${basePath()}full-dg/">Full DG</a>
            </div>
          </div>
        </div>
        <a class="dg-link" href="${basePath()}aprovacao/">Aprovação de Conta</a>
        <a class="dg-link" href="${basePath()}documentos/">Documentos Exigidos</a>
      </div>`;
    header.insertAdjacentElement('afterend',nav);

    const drop=nav.querySelector('.dg-drop');
    const trigger=drop?.querySelector(':scope > .dg-link');
    const panel=drop?.querySelector(':scope > .dg-panel');
    if(drop && trigger && panel && drop.dataset.wired!=='1'){
      drop.dataset.wired='1';
      trigger.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();drop.classList.toggle('open');trigger.setAttribute('aria-expanded',drop.classList.contains('open')?'true':'false');});
      document.addEventListener('click',(e)=>{if(!drop.contains(e.target)){drop.classList.remove('open');trigger.setAttribute('aria-expanded','false');}});
      document.addEventListener('keydown',(e)=>{if(e.key==='Escape'){drop.classList.remove('open');trigger.setAttribute('aria-expanded','false');}});
      panel.addEventListener('click',(e)=>e.stopPropagation());
    }
  }

  /* ===== Busca: dropdown sempre embaixo, por cima do menu ===== */
  function wireSearchDropdown(){
    const root=document.querySelector('.md-header__inner [data-md-component="search"]');
    if(!root) return;

> Natália:
const input  = root.querySelector('input[data-md-component="search-query"]') || root.querySelector('input[type="text"]');
    const output = root.querySelector('[data-md-component="search-result"]') || root.querySelector('.md-search__output');
    const overlay= root.querySelector('.md-search__overlay');
    if(overlay) overlay.style.display='none';
    root.style.position='absolute';
    if(output){ output.style.position='absolute'; output.style.left='0'; output.style.top='calc(100% + 8px)'; }

    /* Abre quando digitar e fecha ao limpar */
    function openDD(){ if(output){ root.setAttribute('data-md-state','active'); output.removeAttribute('hidden'); } }
    function closeDD(){ if(output){ output.setAttribute('hidden',''); root.removeAttribute('data-md-state'); } }
    if(input){
      input.addEventListener('input',()=>{ const v=(input.value||'').trim(); (v.length>=2)?openDD():closeDD(); });
      input.addEventListener('focus',()=>{ if((input.value||'').trim().length>=2) openDD(); });
    }
    document.addEventListener('click',(e)=>{ if(!root.contains(e.target)) closeDD(); });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeDD(); });
  }

  /* ===== Run on load and on page change ===== */
  function run(){
    injectLogout();
    hideGitHubLink();
    injectTopNavMega();
    wireSearchDropdown();
  }
  document.addEventListener('DOMContentLoaded', run);
  if(window.document$){ document$.subscribe(run); }
})();
