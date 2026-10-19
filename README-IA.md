# Serveur IA du compagnon HETIC

Ce serveur Node 22+ appelle OpenAI Responses avec l’outil `web_search`, transmet le contexte et renvoie les réponses avec citations. Il ne peut pas s’exécuter sur GitHub Pages.

## Connexion

1. Héberger ce dossier sur un service qui exécute Node 22+. Commande de démarrage : `npm start` ; le port est fourni par `PORT` (8787 en local).
2. Dans les secrets du service, définir `OPENAI_API_KEY`. Ne jamais placer cette clé dans le dépôt, le navigateur ou `coach-config.js`.
3. Définir `ALLOWED_ORIGINS=https://nathan0720.github.io`. Pour les essais locaux, ajouter explicitement `http://localhost:8768` à cette liste, séparé par une virgule.
4. Optionnel : `OPENAI_MODEL=gpt-5.4-mini` et `DAILY_REQUEST_LIMIT=100` (maximum 500).
5. Vérifier `https://TON-SERVEUR/health` : `configured` doit être `true`.
6. Dans le site, modifier uniquement `coach-config.js` : `window.HETIC_COACH_API = 'https://TON-SERVEUR/api/coach';`, puis republier ce fichier.
7. Ouvrir une discussion et poser une question. L’interface doit montrer le mode IA et des sources cliquables. Vérifier aussi la réponse aux erreurs, au quota et à une panne réseau.

Aucune connexion réelle n’est active sans serveur et secret configurés. Le site affiche honnêtement le mode guidé tant que l’URL est vide. Les tests inclus simulent l’API ; ils ne prouvent pas un appel réel.

Le bouton + joint du texte/code, des images PNG/JPEG/WebP ou des PDF. Limites : 3 fichiers, 2 Mo par fichier, 4 Mo au total ; texte limité à 50 000 caractères par fichier. Ils restent dans l’onglet, puis sont transmis avec chaque message explicitement envoyé tant qu’ils restent sélectionnés. Retirer une pièce jointe l’exclut des prochains messages. Aucun fichier n’est envoyé tant que le mode IA n’est pas connecté.

Pour produire des téléchargements, le modèle reçoit la consigne de fournir des fichiers texte/code complets dans des blocs de code portant leur nom. Le navigateur prépare les fichiers et le ZIP sans exécuter leur contenu. Les téléchargements binaires générés (PDF/images) ne sont pas implémentés.

## Données et limites

Le navigateur transmet les derniers messages, le titre de la page, la langue et, uniquement si la case est cochée, le code de l’éditeur. Le serveur utilise `store: false`. La dictée relève du service vocal du navigateur ; seule sa transcription entre dans la discussion.

Ce serveur limite la taille des requêtes, le nombre de messages, le temps d’attente, les requêtes par adresse réseau et le nombre journalier sur une instance. Ces compteurs sont en mémoire et se réinitialisent au redémarrage. CORS n’est pas une authentification et ne bloque pas les clients qui imitent un navigateur. Avant une ouverture à grande échelle, ajouter un contrôle anti-abus persistant chez l’hébergeur et définir un budget/quota dans le projet API. Les appels et les recherches web peuvent être facturés ; aucun abonnement ni paiement n’est créé par ces fichiers.

## Vérifier le code

`npm test`

Documentation : https://developers.openai.com/api/docs/guides/tools-web-search
