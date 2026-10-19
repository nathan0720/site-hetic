// On récupère le bouton défini dans le HTML.
const boutonTheme = document.querySelector('.bouton-theme');

// Cette fonction applique le thème et met à jour le texte du bouton.
function appliquerTheme(clair) {
    document.body.classList.toggle('theme-clair', clair);
    boutonTheme.textContent = clair ? '☾ Thème sombre' : '☀ Thème clair';
    boutonTheme.setAttribute('aria-pressed', String(clair));
}

// On mémorise le choix entre deux visites, si le navigateur le permet.
try {
    appliquerTheme(localStorage.getItem('nathan-simon-theme') === 'clair');
} catch {
    appliquerTheme(false);
}
boutonTheme.hidden = false;

// À chaque clic, on inverse le thème actuel.
boutonTheme.addEventListener('click', function () {
    const clair = !document.body.classList.contains('theme-clair');
    appliquerTheme(clair);
    try {
        localStorage.setItem('nathan-simon-theme', clair ? 'clair' : 'sombre');
    } catch {
        // Le bouton reste utilisable si le stockage est désactivé.
    }
});

// Exemple de la page JavaScript : réagir au clic sur un bouton.
const boutonDemo = document.querySelector('#bouton-demo');
const messageDemo = document.querySelector('#message-demo');
if (boutonDemo && messageDemo) {
    boutonDemo.addEventListener('click', function () {
        messageDemo.textContent = 'Bravo ! JavaScript a modifié le texte de la page.';
    });
}

// Indique le cours ouvert dans la navigation.
const pageActuelle = window.location.pathname.split('/').pop();
document.querySelectorAll('.langages a').forEach(function (lien) {
    if (lien.getAttribute('href') === pageActuelle) {
        lien.setAttribute('aria-current', 'page');
    }
});
