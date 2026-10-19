# Assistant local gratuit — GitHub Pages

Le navigateur exécute les modèles sur l’appareil du visiteur. Aucun compte, serveur d’inférence, clé API ou service facturé à la requête n’est nécessaire. Les bibliothèques et modèles sont téléchargés depuis des CDN, Hugging Face et les dépôts MLC officiels, seulement après activation explicite. Le cache dépend du navigateur.

## Quatre modèles

| Mode | Modèle | Moteur | Conditions |
| --- | --- | --- | --- |
| Basique | Qwen3-0.6B, q8 | Transformers.js 3.8.1 / WebAssembly | Environ 700 Mo moteur inclus, navigateur récent et mémoire disponible |
| Plus, expérimental | Qwen3-1.7B, q8 | Transformers.js / WebAssembly | Environ 1,8 Go de téléchargement, plusieurs Go de RAM, ordinateur conseillé |
| Pro, expérimental | Qwen3-4B, q4f16_1 | WebLLM 0.2.85 / WebGPU | Plusieurs Go à télécharger, shader-f16, environ 4 Go de mémoire graphique libre |
| Max, expérimental | Qwen3-8B, q4f16_1 | WebLLM / WebGPU | Plusieurs Go à télécharger, shader-f16, environ 6 Go de mémoire graphique libre |

Les modes correspondent à quatre modèles distincts, pas seulement à quatre consignes. Max est le plus gros modèle proposé ici, pas une limite absolue de GitHub Pages. La compatibilité et la mémoire de l’appareil limitent ce qui peut tourner. Aucun modèle n’est garanti sur tous les navigateurs ou téléphones. Aucun n’est présenté comme équivalent à ChatGPT.

Le bouton de vérification WebGPU importe le moteur, vérifie les deux modèles dans son registre et teste la présence d’un adaptateur avec shader-f16, sans télécharger les poids. Il ne peut pas garantir la quantité de mémoire libre. Arrêter ou changer de modèle termine le Worker. Le mode guidé demeure accessible quand l’IA est désactivée.

## Pertinence et données

Les nouvelles questions indépendantes ne reprennent pas les réponses précédentes. Les demandes de suite explicites peuvent conserver le dernier échange. Le contexte du site et les références HTML/CSS/JS ne sont joints que si la question les concerne. Les documents sont traités comme des données et non des consignes. Les pièces jointes sont limitées et tronquées pour limiter la mémoire. Ce sont des fichiers texte/code ; les images et PDF ne sont pas analysés par ces modèles texte.

L’option Wikipédia est désactivée par défaut. Si activée, seule la question est transmise à l’API publique Wikipédia ; les extraits et liens des articles sont fournis au modèle. Ce n’est pas une recherche générale sur Internet.

## Vérification et limites

Basique a généré une vraie réponse dans Safari sur le site public et la correction de contexte a été testée localement avec une question générale (capitale du Japon). Le moteur WebLLM, les identifiants Pro/Max et la disponibilité WebGPU ont été vérifiés via le navigateur, sans charger leurs poids. Le chargement de Plus n’a pas été mené à terme ; sa génération, comme celle de Pro/Max, reste non validée sur cet appareil. Ces trois modes restent expérimentaux. Toute réponse peut contenir des erreurs.

Les anciens fichiers serveur et coach-ia.js ne sont pas chargés par les pages. coach-config.js ne contient aucune clé ni adresse serveur. Ne jamais placer de clé API dans un site public.

Sources :
- https://huggingface.co/docs/transformers.js/v3.8.1/en/installation
- https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX
- https://huggingface.co/onnx-community/Qwen3-1.7B-ONNX
- https://webllm.mlc.ai/docs/user/basic_usage.html
- https://github.com/mlc-ai/web-llm/blob/v0.2.85/src/config.ts
