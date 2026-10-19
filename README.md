# Premier site web — Nathan & Simon

Site réalisé en HTML, CSS et JavaScript : présentation, liens vers nos réseaux préférés et explications du code utilisé.

## Fonctions

- Français et anglais, avec changement de langue sur chaque page.
- Copie des extraits de code dans le presse-papiers.
- Cours HTML, CSS et JavaScript avec explications de leur intégration.
- Palette HETIC, effet de verre et thèmes clair/sombre.
- Labo : blocs à assembler pour débuter, quiz, six mini-exercices, éditeur HTML/CSS/JS et aperçu en direct.
- Accompagnateur flottant sur toutes les pages : fenêtre déplaçable, discussion conservée pendant la navigation, dictée et lecture vocale facultatives.
- Vraie IA locale gratuite, activable dans le navigateur, sans serveur ni clé API ; consultation facultative de Wikipédia. Voir README-IA.md.
- Sauvegarde des essais dans le navigateur et téléchargement des projets en ZIP ou par fichier.
- Chat minimaliste : Entrée pour envoyer, Maj + Entrée pour sauter une ligne.
- Pièces jointes pour l’IA locale : code et texte (3 fichiers, 2 Mo chacun, 4 Mo au total).
- Téléchargements des fichiers de code/texte contenus dans les réponses, individuellement ou en ZIP.
- Guide GitHub Pages décrivant notre publication dans Safari.
- Maquette Figma : https://www.figma.com/design/VvBDxtK290dcxWSIiXkkG3

## Ouvrir le site

Utiliser GitHub Pages ou un serveur HTTP local pour permettre le chargement du Web Worker IA. Tous les styles, scripts et logos sont inclus dans le dépôt.

Par défaut, le coach utilise des réponses guidées liées aux cours et exercices. Le bouton « Activer l’IA gratuite » télécharge le petit modèle (environ 700 Mo) puis lance le calcul sur l’appareil. Le microphone ne démarre que sur un clic ; la dictée dépend du navigateur et peut utiliser son service vocal.

## Publication sur GitHub Pages

Dans **Settings → Pages**, choisir **Deploy from a branch**, puis la branche **main** et le dossier **/ (root)**, et enregistrer. GitHub affiche ensuite le lien public du site sur cette même page.

Le fichier `.nojekyll` permet de publier directement les fichiers statiques.

## Fichiers

- `index.html` : accueil et réseaux sociaux.
- `html.html`, `css.html`, `javascript.html` : explications et extraits du code du site.
- `index-en.html`, `html-en.html`, `css-en.html`, `javascript-en.html` : versions anglaises.
- `entrainement.html`, `entrainement-en.html`, `entrainement.js` : quiz, éditeur, aperçu, coach et exports.
- `github-pages.html`, `github-pages-en.html` : guide de publication.
- `projet-hetic.zip` : copie téléchargeable du site complet (sans archive imbriquée).
- `style.css` : mise en page et thèmes.
- `script.js` : changement de thème et démonstration interactive.

Les marques et logos appartiennent à leurs propriétaires respectifs. Les icônes des réseaux sociaux sont au format SVG. Twitch et Discord proviennent de Simple Icons ; YouTube et TikTok de la collection SVG Logos (gilbarbara/logos). Les pictogrammes Instagram et Snapchat de Simple Icons sont présentés sur leurs fonds de couleur ; le logo HETIC provient du site de l’école.
