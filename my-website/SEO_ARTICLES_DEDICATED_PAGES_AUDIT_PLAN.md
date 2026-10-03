# Audit SEO — pages d’articles dédiées

## Constat vérifié

- Le dashboard envoie un fichier HTML/TXT, une image principale et des images secondaires à `POST /api/articles/create`.
- Le backend extrait le titre, le slug et le résumé, traduit le contenu en anglais, puis conserve le contenu et les médias dans `backend/public/articles`. Il ne produit aucune page HTML indexable.
- Les cartes d’articles pointent toutes vers un gabarit unique (`article.html`) et transmettent l’article via `localStorage`. Le contenu et les métadonnées ne sont donc disponibles qu’après JavaScript : ce n’est pas un rendu SEO exploitable.
- La suppression ne connaît pas les pages dédiées puisqu’elles n’existent pas encore. Le bouton « Modifier » du dashboard n’a pas de parcours complet : aucun endpoint `PUT/PATCH` ni composant `UpdateArticle` n’est présent.
- Deux défauts annexes ont été confirmés : la route `/score/:id` est déclarée après `/:id`, et le formulaire compare `response.status` à la chaîne `"success"` au lieu de lire `response.data.status`.

## Décisions d’implémentation

1. Conserver le dashboard et son API de création. À chaque création réussie, le backend produit les documents complets `public/fr/articles/<slug>.html` et `public/en/articles/<slug-en>.html`.
2. Conserver les médias et contenus source sous `public/assets/articles/` afin qu’ils soient publiés avec le site et référencés par des URL stables dans le HTML.
3. Générer côté serveur un document complet : `title`, description, canonical, hreflang, Open Graph, Twitter Card et données structurées `BlogPosting`. Le corps contient déjà l’article et les URL d’images, sans dépendre de JavaScript.
4. Garder les points de montage React de la barre de navigation, du pied de page, du lien de remontée et du pied d’article. Le point d’entrée d’article est rendu compatible avec une page statique et la configuration Vite remplace son script de développement par les assets compilés lors du build. Le build ajoute également les paires FR/EN au sitemap final.
5. Rendre la création atomique au mieux : les fichiers écrits sont nettoyés si la base de données ou la génération échoue. Une traduction anglaise valide devient requise, car l’objectif impose les deux URL indexables.
6. À la suppression, retirer les deux pages générées ainsi que les médias/contenus associés, sans supprimer une ressource partagée hors du répertoire d’articles.
7. Inscrire chaque article publié dans une liste HTML statique des pages `fr/articles-list.html` et `en/articles-list.html`. Ces liens sont écrits par le backend lors de la publication, retirés lors de la suppression et ne dépendent ni de React ni d’une API au chargement.
8. Remplacer au build les points d’entrée de développement par les bundles Vite dans les listes et les pages d’articles. Le serveur backend privilégie ensuite `dist` lorsqu’il est présent, afin que `Navbar` et `Footer` puissent être montés sur les URLs réellement servies.

## Point de déploiement à vérifier

Le backend et Vite doivent partager le même répertoire public. Par défaut, le code cible `my-website/public`; `SITE_PUBLIC_ROOT` permet d’indiquer le répertoire publié réel en production. Après une création, exécuter le build/deploy du front : Vite copie les pages vers `dist/fr/articles` et `dist/en/articles` et remplace le runtime React par les fichiers versionnés du build.

## Hors périmètre immédiat

La modification d’un article n’est pas implémentée dans le projet existant. Avant de réactiver ce parcours, il devra remplacer les médias/contenus de façon transactionnelle puis régénérer les deux pages ; l’audit le documente pour éviter qu’une édition laisse des pages obsolètes.
