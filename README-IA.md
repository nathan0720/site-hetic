# IA gratuite dans le navigateur

Le site GitHub Pages utilise `coach-local.js` et un Web Worker (`coach-local-worker.js`). Le visiteur clique sur « Activer l’IA gratuite » avant tout téléchargement du modèle.

Le moteur Transformers.js 3.8.1 charge Qwen3-0.6B-ONNX en ONNX q8 depuis Hugging Face (environ 700 Mo moteur compris). Le calcul utilise WebAssembly, sur un seul thread, sans serveur, clé API, compte ou facturation à la requête. Une connexion initiale est nécessaire ; le cache dépend du navigateur. La vitesse et la compatibilité dépendent de la mémoire disponible et du navigateur. Ce petit modèle peut produire des erreurs ; ses réponses ne sont pas comparables à celles de ChatGPT.

Les messages et fichiers texte/code sont traités sur l’appareil. Les images et PDF ne sont pas analysés par ce modèle texte. Les pièces jointes et l’historique sont tronqués pour limiter la mémoire. Le bouton Arrêter termine le moteur. Le mode guidé reste accessible quand l’IA est désactivée ou indisponible.

L’option Wikipédia, désactivée par défaut, transmet uniquement la question à l’API publique de Wikipédia. Les extraits et liens des articles sont affichés et fournis au modèle. Ce n’est pas une recherche générale sur Internet.

Les anciens fichiers serveur et `coach-ia.js` restent des exemples facultatifs, mais ne sont pas chargés par les pages. `coach-config.js` ne contient aucune clé ni adresse serveur. Ne jamais mettre une clé API dans un site public.

Sources :
- https://huggingface.co/docs/transformers.js/v3.8.1/en/installation
- https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX
