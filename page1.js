// Uniquement le thème de la page de départ indépendante.
(() => {
 const button=document.querySelector('.bouton-theme'),en=document.documentElement.lang==='en';
 const apply=light=>{document.body.classList.toggle('theme-clair',light);button.setAttribute('aria-pressed',String(light));button.textContent=light?(en?'☾ Dark theme':'☾ Thème sombre'):(en?'☀ Light theme':'☀ Thème clair')};
 let light=false;try{light=localStorage.getItem('nathan-simon-theme')==='clair'}catch{}
 apply(light);button.hidden=false;
 button.addEventListener('click',()=>{light=!document.body.classList.contains('theme-clair');apply(light);try{localStorage.setItem('nathan-simon-theme',light?'clair':'sombre')}catch{}});
})();
