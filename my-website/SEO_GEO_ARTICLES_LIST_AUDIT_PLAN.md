# Audit et plan d’action SEO / GEO — page « Liste des articles »

> Statut : audit statique réalisé le 3 octobre 2026 ; aucune modification n’a été appliquée à `public/fr/articles-list.html` dans ce périmètre.
>
> Périmètre : `public/fr/articles-list.html`, `public/en/articles-list.html`, `src/jsx/page-articles-list.jsx`, `AdminArticleList`, `ArticleCard`, sitemap et chaîne de build Vite.
>
> Limite : cet audit ne remplace pas un contrôle de l’API d’articles, des URL publiées, de l’indexation Search Console, des logs serveur, des performances de production ou des contenus réellement disponibles en base de données.

## 1. Conclusion rapide

La page dispose d’une base indexable : canonical, alternates, sitemap, H1 et métadonnées sont présents. Elle peut devenir un point d’entrée éditorial utile sur le développement web, le SaaS, le mobile, le SEO/GEO et la conception responsable.

Le risque majeur est technique : la liste, les catégories, la recherche, la pagination et les cartes d’articles sont rendues uniquement côté client après appel API. Le HTML généré contient seulement le conteneur `#RC-articles-list`, sans titre, extrait ni lien vers les articles. En l’état, les moteurs ou assistants qui n’exécutent pas pleinement JavaScript ne reçoivent pas le catalogue éditorial ni les liens internes vers les articles. La priorité est donc de fiabiliser le rendu et les URL avant d’optimiser le texte de la page.

## 2. Inventaire de la page analysée

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | `lang="fr"`, robots, canonical, alternates `fr-CH` / `en-CH` et entrées sitemap sont présents. | Base saine ; passer à `fr-CH` et contrôler la cohérence de toutes les URLs publiées. |
| Métadonnées | Title, description, OG et Twitter citent développement web, SEO, éco-conception et mobile. `og:url` pointe vers `articles.html`, pas `articles-list.html`. | Incohérence d’URL et intention trop large. Les métadonnées doivent décrire une bibliothèque éditoriale réelle et la page canonique exacte. |
| Données structurées | Un `Organization` répète l’identité, les offres et une personne imbriquée. | À harmoniser avec l’organisation/personne stable ; ajouter une `CollectionPage` seulement si la collection est visible et indexable. |
| Hero | H1 « Articles » et sous-titre sous forme de H2. | H1 trop générique ; le sous-titre doit devenir un paragraphe et l’introduction doit expliquer les thèmes et l’utilité des articles. |
| Liste des articles | `AdminArticleList` charge articles et catégories via API après hydratation React. | Contenu absent du HTML initial. Pas de liens crawlables sans JS ; indexation des cartes et du maillage interne incertaine. |
| Recherche et filtres | Requête API par mot-clé, filtre de catégorie et pagination uniquement client. | Utiles pour l’UX, mais pas des pages de catégorie ou de recherche indexables. Les filtres doivent disposer de libellés accessibles et d’une stratégie d’URL si l’indexation est souhaitée. |
| URLs d’articles | Les cartes construisent `article.html?article_title=<slug>` et enregistrent l’article dans `localStorage` avant navigation. | Une URL à paramètre peut être indexable si elle rend le contenu de façon autonome. La dépendance au stockage local est fragile pour le partage, le crawl, un nouvel appareil ou JavaScript désactivé. |
| Cartes et images | Cartes React avec image `loading="lazy"`, titre, extrait, date, catégorie et lien. | Les informations sont utiles une fois chargées, mais absentes du HTML initial ; ajouter `decoding="async"` et contrôler `alt`, dimensions et erreurs d’image. |
| CTA, navbar et footer | Montés via React. | Les informations essentielles de la liste doivent rester disponibles indépendamment de ces composants. |

## 3. Décisions métier à confirmer avant implémentation

1. **Rôle éditorial.** Confirmer les thèmes réellement publiés : web, SaaS, mobile, SEO/GEO, IA, éco-conception, sécurité, études de cas ou autres. Ne pas citer des thèmes absents de la collection.
2. **Langues et équivalences.** Confirmer si chaque article possède une traduction française/anglaise et un slug stable. Une alternate `hreflang` ne doit associer que des contenus réellement équivalents.
3. **Rendu et hébergement des contenus.** Confirmer si les articles peuvent être pré-rendus au build, rendus côté serveur ou exportés sous forme de fichiers statiques. Cette décision conditionne l’indexabilité réelle.
4. **URLs.** Confirmer la convention durable : URL par slug, paramètres de requête ou autre. Une même URL doit pouvoir afficher l’article sans dépendre de `localStorage`.
5. **Catégories et archives.** Confirmer les catégories éditoriales, leur utilité pour les utilisateurs et celles qui méritent une page indexable dédiée.
6. **Publication.** Confirmer auteur, date de publication/mise à jour, image principale, sources, relecture et politique de correction ; ces signaux ne doivent être affichés que lorsqu’ils sont exacts.

## 4. Plan d’action priorisé

### Lot 1 — Rendu statique, données et URLs d’articles

1. Faire en sorte que la liste initiale affiche des titres, extraits, dates, catégories et liens dans le HTML produit : pré-rendu Vite, génération statique, SSR ou fallback HTML alimenté par une source de données contrôlée.
2. Rendre chaque page article autonome : elle doit charger son contenu depuis son slug/identifiant d’URL, sans dépendre de `localStorage`.
3. Conserver une URL canonique unique par article. Si les paramètres sont conservés, définir leur forme exacte et empêcher les variantes de créer des doublons.
4. Mettre à jour le sitemap avec les URL canoniques des articles publiés et leur date de dernière modification réelle.
5. Gérer les états API : chargement, erreur, collection vide, erreur d’image et indisponibilité réseau, sans masquer les liens essentiels.

### Lot 2 — Langue, métadonnées et ciblage éditorial

1. Passer le document à `lang="fr-CH"`.
2. Corriger `og:url` vers `https://helveclick.ch/public/fr/articles-list.html` et aligner canonical, Twitter et Open Graph.
3. Décrire la collection sans termes promotionnels génériques ni thèmes non publiés.
4. Ajouter `og:locale:alternate="en_CH"`; ne pas ajouter de visuel de partage sans asset éditorial stable.

Proposition de travail, à ajuster selon les thèmes confirmés :

```text
Title : Articles web, SaaS, mobile et SEO/GEO | Helveclick
Description : Guides et retours d’expérience sur le développement web, les logiciels SaaS, les applications mobiles et la visibilité en ligne, depuis le Valais.
```

### Lot 3 — Données structurées et collection éditoriale

1. Regrouper les données dans un `@graph` avec l’organisation, la personne et une `CollectionPage`.
2. Déclarer `CollectionPage` uniquement si la page rend une liste réelle et accessible au crawl ; utiliser `mainEntity` / `ItemList` seulement pour les articles effectivement visibles dans le HTML.
3. Pour chaque article, employer `Article` ou `BlogPosting` uniquement avec les données visibles et exactes : titre, URL canonique, image, date de publication/modification, auteur et langue.
4. Ne pas inventer de date, d’auteur, de source, de note ou d’image.

### Lot 4 — Hero, introduction et maillage

1. Conserver un H1 unique, tel que « Articles et ressources numériques » ou une variante validée.
2. Convertir le sous-titre visuel en paragraphe s’il n’introduit pas une sous-section réelle.
3. Ajouter une introduction courte présentant les thèmes réellement couverts et le lien avec les prestations, sans transformer la collection en page commerciale.
4. Ajouter des liens contextuels vers site web, SaaS, application mobile et SEO/GEO seulement lorsque les sujets existent dans la collection.

### Lot 5 — Cartes, catégories, recherche et pagination

1. Conserver une hiérarchie claire : un titre de collection puis un H2 par catégorie/section réelle, H3 pour les titres d’articles.
2. Associer les champs de recherche et de catégorie à des labels accessibles ; ne pas se reposer uniquement sur les placeholders et les icônes.
3. Définir si les filtres et la pagination sont uniquement UX ou doivent créer des URL partageables/indexables. Dans le second cas, utiliser des URLs canoniques et des pages réellement rendues.
4. Ajouter des intitulés, états désactivés, `aria-current` et annonces adaptées pour la pagination et les résultats filtrés.
5. Préserver les liens HTML natifs vers les articles ; ne pas annuler la navigation par défaut si le lien est déjà suffisant.

### Lot 6 — Médias, accessibilité et robustesse

1. Ajouter le lien d’évitement et `id="main-content" tabindex="-1"`.
2. Corriger l’URL du logo, employer `alt="Helveclick"` pour le logo et `alt=""` pour les images décoratives du hero.
3. Ajouter `decoding="async"` aux images différées ; fournir dimensions ou ratio lorsque les mesures CLS le justifient.
4. Vérifier les liens au clavier, les titres de cartes, les messages de chargement/erreur, le contraste et les interactions sans JavaScript.
5. Vérifier que l’image d’une carte possède un texte alternatif utile ou est décorative lorsque le titre adjacent suffit.

### Lot 7 — Validation technique et suivi

1. Exécuter `npm run build` et contrôler le HTML produit : H1, contenu de collection, liens d’articles, canonical, alternates, JSON-LD et sitemap.
2. Tester une URL d’article dans une session sans `localStorage`, une nouvelle fenêtre et avec JavaScript désactivé si un fallback est annoncé.
3. Vérifier Search Console : découverte des articles, indexation, URL canonique choisie, erreurs d’exploration et performances des pages.
4. Mesurer Lighthouse/PageSpeed : LCP, INP, CLS, poids des images, appels API et erreurs de chargement.
5. Suivre impressions, clics, requêtes, pages d’entrée et progression vers les pages de services sans attribuer une variation à une seule modification sans données.

## 5. Ordre de mise en œuvre

| Ordre | Lot | Dépendance | Résultat attendu |
| --- | --- | --- | --- |
| 1 | Décisions éditoriales et URLs | Décisions ci-dessus | Corpus, langues, slugs, catégories et mode de rendu confirmés. |
| 2 | Rendu et URLs d’articles | Lot 1 validé | Articles accessibles depuis une URL autonome et crawlable. |
| 3 | Métadonnées et JSON-LD | Rendu défini | Collection et articles décrits sans incohérence. |
| 4 | Hero et maillage | Thèmes confirmés | Intention éditoriale utile, sans dilution commerciale. |
| 5 | Filtres et cartes | Source de données définie | Navigation accessible et URLs cohérentes. |
| 6 | Médias et accessibilité | Structure stabilisée | Page robuste avec ou sans JavaScript selon le mode retenu. |
| 7 | Build et production | Tous les lots intégrés | Indexabilité et suivi vérifiables. |

## 6. Validation avant et après déploiement

### Avant publication

- Vérifier le HTML de production avec JavaScript désactivé : contenu de la liste, liens et pagination attendus.
- Ouvrir directement plusieurs URLs d’article sans état préalable dans `localStorage`.
- Vérifier les alternates uniquement entre articles traduits équivalents.
- Valider les données structurées contre les éléments visibles.
- Exécuter `npm run build`, contrôler le sitemap et les liens internes.

### Après publication

- Inspecter la liste et plusieurs articles dans Search Console : indexation, canonical, couverture et URL choisie.
- Contrôler les réponses API, erreurs de chargement, temps de réponse et images en production.
- Suivre les requêtes et performances par article, catégorie et langue sur une période comparable.

## 7. État du périmètre

- [x] Pages française et anglaise, sitemap, rendu React et composants de liste/carte examinés.
- [x] Audit et plan d’action rédigés.
- [ ] Décisions éditoriales et techniques à confirmer.
- [ ] Implémentation sur `public/fr/articles-list.html` et le rendu des articles.
- [ ] Synchronisation anglaise après validation française.
- [ ] Build et validation sur l’environnement publié.
