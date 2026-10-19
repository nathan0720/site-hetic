// Les libellés suivent la langue de la page ouverte.
const anglais = document.documentElement.lang === 'en';
const textes = anglais ? {
    themeSombre: '☾ Dark theme',
    themeClair: '☀ Light theme',
    demo: 'Well done! JavaScript changed the text on the page.',
    copier: 'Copy code',
    copie: 'Copied!',
    echec: 'Copy unavailable. Select the code and copy it manually.'
} : {
    themeSombre: '☾ Thème sombre',
    themeClair: '☀ Thème clair',
    demo: 'Bravo ! JavaScript a modifié le texte de la page.',
    copier: 'Copier le code',
    copie: 'Copié !',
    echec: 'Copie indisponible. Sélectionne le code et copie-le manuellement.'
};

// On récupère le bouton défini dans le HTML.
const boutonTheme = document.querySelector('.bouton-theme');

function appliquerTheme(clair) {
    document.body.classList.toggle('theme-clair', clair);
    boutonTheme.textContent = clair ? textes.themeSombre : textes.themeClair;
    boutonTheme.setAttribute('aria-pressed', String(clair));
}

try {
    appliquerTheme(localStorage.getItem('nathan-simon-theme') === 'clair');
} catch {
    appliquerTheme(false);
}
boutonTheme.hidden = false;

boutonTheme.addEventListener('click', function () {
    const clair = !document.body.classList.contains('theme-clair');
    appliquerTheme(clair);
    try {
        localStorage.setItem('nathan-simon-theme', clair ? 'clair' : 'sombre');
    } catch {
        // Le bouton reste utilisable si le stockage est désactivé.
    }
});

// Cette démonstration existe uniquement sur les pages JavaScript.
const boutonDemo = document.querySelector('#bouton-demo');
const messageDemo = document.querySelector('#message-demo');
if (boutonDemo && messageDemo) {
    boutonDemo.addEventListener('click', function () {
        messageDemo.textContent = textes.demo;
    });
}

// Les versions anglaises ont des noms comme html-en.html.
const pageActuelle = window.location.pathname.split('/').pop();
document.querySelectorAll('.langages a').forEach(function (lien) {
    if (lien.getAttribute('href') === pageActuelle) {
        lien.setAttribute('aria-current', 'page');
    }
});

// Copie moderne sur HTTPS, avec une solution de repli pour les fichiers locaux.
async function copierTexte(texte) {
    try {
        await navigator.clipboard.writeText(texte);
        return;
    } catch {
        const champ = document.createElement('textarea');
        champ.value = texte;
        champ.setAttribute('readonly', '');
        champ.style.position = 'fixed';
        champ.style.opacity = '0';
        document.body.append(champ);
        const elementActif = document.activeElement;
        try {
            champ.focus({ preventScroll: true });
            champ.select();
            if (!document.execCommand('copy')) {
                throw new Error('Copie refusée');
            }
        } finally {
            champ.remove();
            elementActif?.focus({ preventScroll: true });
        }
    }
}

// Ajoute un bouton à chaque exemple sans inclure le bouton dans le texte copié.
document.querySelectorAll('pre > code').forEach(function (code, index) {
    const bloc = code.parentElement;
    const barre = document.createElement('div');
    barre.className = 'barre-code';
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'bouton-copier';
    bouton.textContent = textes.copier;
    bouton.setAttribute('aria-label', textes.copier + ' — ' + (index + 1));
    const statut = document.createElement('span');
    statut.className = 'statut-copie';
    statut.setAttribute('role', 'status');
    statut.setAttribute('aria-live', 'polite');
    barre.append(statut, bouton);
    bloc.before(barre);
    let minuterie;
    bouton.addEventListener('click', async function () {
        clearTimeout(minuterie);
        bouton.disabled = true;
        statut.textContent = '';
        try {
            await copierTexte(code.textContent);
            statut.textContent = textes.copie;
        } catch {
            statut.textContent = textes.echec;
        } finally {
            bouton.disabled = false;
            minuterie = setTimeout(function () {
                statut.textContent = '';
            }, 5000);
        }
    });
});
