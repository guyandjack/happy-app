# Audit CRUD articles et chemins de publication

## Flux vérifiés

| Opération | Route | État |
| --- | --- | --- |
| Lecture publique | `GET /api/articles`, `GET /api/articles/:id` | Disponible |
| Création | `POST /api/articles/create` | Disponible, protégée et pré-validée avant toute écriture |
| Suppression | `DELETE /api/articles/:id` | Disponible et protégée |
| Modification | — | Non implémentée : aucune route `PATCH`/`PUT` ni contrôleur n’est exposé |

Le bouton « Modifier » du dashboard ne doit pas être considéré comme fonctionnel :
il référence `UpdateArticle`, qui n’existe pas. Une modification sûre devra
recréer les deux pages SEO, mettre à jour les cartes statiques et gérer les
fichiers média remplacés de manière transactionnelle.

## Publication des pages

Les URL publiques sont indépendantes du chemin de fichiers :

- URL : `/fr/articles/<slug>.html`, `/en/articles/<slug>.html`
- Médias : `/assets/articles/...`
- Fichiers : sous le répertoire défini par `SITE_PUBLIC_ROOT`

En production, `SITE_PUBLIC_ROOT` doit désigner le répertoire `dist` réellement
servi par `https://helveclick.ch`. Il doit être persistant, inscriptible par
l’API et contenir `fr/articles-list.html` ainsi que `en/articles-list.html`.
Sans volume partagé ou étape de publication entre l’API et le frontend, il est
impossible pour le backend de rendre immédiatement disponibles des fichiers
sur un hébergement frontend séparé.

## Corrections appliquées

- Suppression des préfixes HTTP `/public` : ils ne sont jamais valides dans les
  URL du site.
- Pré-contrôle du document root avant la création, afin d’éviter les insertions
  en base suivies d’échecs de publication.
- Pages d’articles de production reliées au bundle Vite compilé par le manifeste.
- Cartes des listes FR/EN réellement statiques et visibles ; la liste React
  dynamique a été retirée de ces deux pages.
- Suppression : mise à jour des listes avant suppression des pages, avec
  restauration des listes si une suppression de fichier échoue.
