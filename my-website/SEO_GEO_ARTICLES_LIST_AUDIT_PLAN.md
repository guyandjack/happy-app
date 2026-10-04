# Audit SEO / GEO — listes d’articles

> État vérifié le 4 octobre 2026, à partir des fichiers source. Les contrôles d’indexation et de rendu sur le site déployé restent à réaliser après publication.
>
> Périmètre : `public/fr/articles-list.html`, `public/en/articles-list.html`, `src/jsx/page-articles-list.jsx`, `backend/utils/function/articlePagePublisher.js`, `sitemap.xml` et la chaîne de build Vite.

## Résumé

Les deux pages de liste disposent désormais d’un fallback HTML statique pour le crawl et d’une liste de cartes rendue par React pour les visiteurs. Chaque lien statique pointe vers une page d’article autonome sous la forme `/{lang}/articles/{slug}.html`.

La liste statique porte volontairement la classe `hide` : elle ne crée pas de doublon visuel avec la liste React, mais reste présente dans le document HTML initial. Elle est mise à jour par le backend lors de la publication ou de la suppression d’un article. Les pages article et le sitemap sont également synchronisés au runtime depuis les fichiers réellement publiés.

## Éléments SEO implémentés

| Point | État | Vérification effectuée |
| --- | --- | --- |
| URL canonique des listes | Fait | Canonical sur `/fr/articles-list.html` et `/en/articles-list.html`. |
| Hreflang des listes | Fait | Alternates `fr-CH`, `en-CH` et `x-default` réciproques. |
| Langue du document | Fait | `lang="fr-CH"` et `lang="en-CH"`. |
| Open Graph | Fait | `og:url` aligné sur chaque canonical ; locale primaire et alternate renseignées. |
| Métadonnées éditoriales | Fait | Titres courts ; descriptions cohérentes avec les thèmes annoncés : développement web, SEO, IA, éco-conception, CMS et technologies. |
| Hiérarchie du hero | Fait | H1 descriptif ; ancien sous-titre H2 converti en paragraphe. |
| Liens HTML vers les articles | Fait | Cartes statiques avec ancres natives vers `/{lang}/articles/{slug}.html`. |
| Pages article autonomes | Fait dans le flux backend | Chaque publication génère un document complet avec canonical, hreflang, Open Graph et `BlogPosting`. |
| Données structurées de collection | Fait | `CollectionPage` décrivant chaque liste, sans `ItemList` statique susceptible de devenir obsolète. |
| Sitemap des listes | Fait | Les deux URLs y figurent avec leurs alternates ; date de modification mise à jour lors de cette évolution. |
| Sitemap des articles | Fait dans le flux backend | Régénéré depuis les fichiers réellement présents dans `fr/articles` et `en/articles` lors du CRUD. |

## Architecture de rendu constatée

```text
Création / suppression dans le dashboard
  └─ backend articlePagePublisher
       ├─ génère ou retire les pages /fr|en/articles/{slug}.html
       ├─ met à jour les cartes HTML entre les marqueurs statiques
       └─ reconstruit les entrées article du sitemap

articles-list.html
  ├─ cartes HTML statiques masquées (`.static-article-links.hide`) : crawl et maillage interne
  └─ #RC-articles-list : liste visible rendue par React
       ├─ Navbar
       ├─ Footer
       └─ cartes, filtres et pagination de l’interface
```

## Points de vigilance restants

1. **Rendu de production.** Tester une liste et une page article directement sur le domaine publié : les bundles, styles et composants React doivent se charger sans erreur de console.
2. **Déploiement et contenu runtime.** La configuration de build exclut les brouillons locaux d’articles. Après un déploiement frontend, le répertoire publié doit donc recevoir les articles via le flux de publication prévu, avec `SITE_PUBLIC_ROOT` configuré sur le répertoire réellement servi.
3. **Hreflang des articles.** Les alternates article ne doivent relier que deux traductions réellement équivalentes. Le contrôle doit porter sur plusieurs paires publiées.
4. **Données éditoriales.** Les dates, auteur, images, extrait et contenu utilisés dans le `BlogPosting` doivent rester exacts dans le dashboard ; ils ne doivent pas être complétés artificiellement pour le SEO.
5. **Indexation effective.** Contrôler dans Search Console, après déploiement, l’URL canonique choisie, les erreurs d’exploration, les pages découvertes par le sitemap et les éventuels problèmes de données structurées.

## Validation recommandée avant déploiement

1. Exécuter `npm run build`.
2. Vérifier dans `dist/fr/articles-list.html` et `dist/en/articles-list.html` les canonical, Open Graph, hreflang, H1 et le bloc `CollectionPage`.
3. Vérifier que les cartes entre `STATIC_ARTICLE_LINKS_START` et `STATIC_ARTICLE_LINKS_END` comportent les liens d’articles attendus dans le répertoire qui sera réellement servi en production.
4. Ouvrir une URL d’article dans une session vierge, sans état `localStorage`, puis vérifier ses balises SEO, la Navbar, le Footer et les styles.
5. Vérifier `sitemap.xml` après une création puis une suppression d’article ; confirmer l’écriture correspondante dans `backend/logs/app.log`.

## Limites de cet audit

Cet audit confirme la structure des fichiers source. Il ne confirme pas, à lui seul, le statut HTTP, l’exécution JavaScript, la configuration de `SITE_PUBLIC_ROOT`, l’exploration par les moteurs ou l’indexation de la version en production.
