# Audit, plan et suivi SEO / GEO — page « Création de sites web »

> Statut : lots 1 à 7 appliqués et validés le 2 octobre 2026.
>
> Périmètre : `public/fr/prestations/site-web.html`, `src/scripts/page-services.js`, les styles associés et le contenu statique. Le contrôle ne remplace pas une vérification après déploiement dans Search Console, PageSpeed Insights et Analytics.

## 1. Conclusion rapide

La page repose sur une base déjà solide : canonical, alternates `fr-CH` / `en-CH`, cible géographique claire (Crans-Montana et Valais), un H1 unique et des données structurées pour l’organisation, le service et la page.

La priorité est de renforcer la page comme réponse utile à l’intention « création de site web en Valais », sans la transformer en page SEO générique. Le contenu doit expliquer concrètement les trois types de sites proposés, la méthode d’éco-conception et le périmètre d’intervention. Le SEO doit être présenté comme un socle technique, puis renvoyer vers la prestation SEO/GEO dédiée.

## 2. Inventaire de la page analysée

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | `lang="fr"`, robots, canonical et alternates sont présents. | Bonne base, mais `fr-CH` serait plus cohérent avec les alternates et le marché suisse. |
| Métadonnées | Title, description, Open Graph, Twitter et données géographiques citent Crans-Montana / Valais. | L’intention locale est claire ; les textes doivent être harmonisés autour des PME, du sur-mesure et de la zone réellement couverte. |
| Données structurées | Trois blocs JSON-LD distincts : organisation locale, `Service`, `WebPage` et fil d’Ariane. | Le service est identifiable, mais le graphe est à normaliser avec l’identité déjà utilisée sur l’accueil et À propos. |
| Hero | H1 « Création de site internet » et sous-titre sur les entreprises valaisannes. | Le sujet est net ; il manque une explication éditoriale immédiate sur les bénéfices, les PME et l’accompagnement hors Valais à distance. |
| Types de sites | Trois cartes : vitrine, marchand, sur mesure. | Structure H1 → H2 saine. Le contenu mérite des critères de choix et des liens plus homogènes. |
| Éco-conception | Une section dédiée avec sept promesses, dont l’hébergement vert. | Très pertinente pour la différenciation. Certaines formulations absolues ou techniques doivent être vérifiées avant publication. |
| SEO | Une section SEO détaillée est commentée ; une FAQ parle déjà de référencement. | Le SEO est à évoquer brièvement comme fondation, avec un lien interne, sans dupliquer la page `seo.html`. |
| FAQ et conversion | Dix questions en HTML ; CTA, navigation et footer sont montés via React. | Contenu utile au crawl, mais l’accessibilité de l’accordéon et la disponibilité du CTA sans JavaScript doivent être vérifiées. |
| Images | Images de cartes en `loading="lazy"`. Logo avec espace final dans l’URL ; images hero avec `alt` promotionnels. | Bonne intention de chargement différé. Les alternatives doivent décrire l’image ou être vides lorsqu’elle est décorative. |

## 3. Plan exécuté, par lots

### Lot 1 — Langue, métadonnées et signaux locaux

1. Passer la langue du document à `fr-CH`.
2. Harmoniser title, meta description, Open Graph et Twitter autour d’une promesse unique : création de sites vitrines, e-commerce et sur mesure pour les PME, en Valais en présentiel et à distance dans les autres cantons suisses.
3. Conserver Crans-Montana et Valais lorsque cela apporte une information réelle ; ne pas multiplier les villes ou cantons sans service local distinct.
4. Prévoir une image sociale de marque réelle seulement si un visuel dédié est disponible. Ne pas employer une image saisonnière ou un visuel instable.

Formulation de travail proposée :

> Création de sites web à Crans-Montana : vitrines, e-commerce et solutions sur mesure, conçus pour les PME du Valais et à distance en Suisse.

### Lot 2 — Données structurées cohérentes et maintenables

1. Regrouper les trois scripts dans un seul `@graph`, comme sur la page À propos, sans répéter inutilement l’organisation.
2. Réutiliser les identifiants stables : `https://helveclick.ch/#org`, `https://helveclick.ch/#guillaume-dupanloup`, `#service` et `#webpage`.
3. Décrire le `Service` « Création de sites web sur mesure » avec les trois offres effectivement présentées : site vitrine, e-commerce, site sur mesure.
4. Aligner adresse, zone d’intervention, contact et langues disponibles sur les autres pages françaises : Crans-Montana, Valais et Suisse ; Valais en présentiel, autres cantons à distance dans le texte visible.
5. Conserver le fil d’Ariane uniquement s’il reflète la navigation réelle. Ne pas ajouter de balisage `FAQPage` pour obtenir un résultat enrichi.

### Lot 3 — Hero et introduction éditoriale

1. Conserver le H1 unique et éviter de surcharger le titre avec une liste de mots-clés.
2. Ajouter sous le hero une introduction courte qui répond explicitement à : pour qui, quels types de sites, dans quelle zone et avec quel objectif commercial.
3. Ajouter des liens contextuels vers la page contact et, si les termes sont cités, vers SaaS, application mobile et SEO/GEO.
4. Préserver l’équilibre : la page vend la création de sites ; les services annexes restent des compléments, non son sujet principal.

### Lot 4 — Cartes « vitrine », « e-commerce », « sur mesure »

1. Conserver les H2 actuels, qui constituent de vraies sous-sections de l’offre.
2. Préciser pour chaque carte le besoin métier auquel elle répond et un exemple de résultat attendu, sans chiffrer ou promettre un résultat non vérifiable.
3. Uniformiser les URL de contact : deux cartes utilisent un chemin relatif (`../contact.html`), la troisième une URL absolue interne. Le choix recommandé est une URL interne absolue cohérente : `/public/fr/contact.html`.
4. Vérifier que les boutons décrivent leur destination de façon suffisamment précise pour les lecteurs d’écran.

### Lot 5 — Section « Éco-conception » : dix pratiques essentielles

La page doit contenir une liste courte, lisible et factuelle de dix pratiques au maximum. Elle ne doit pas déclarer que chaque mesure est appliquée systématiquement si cela dépend du projet, de l’hébergement ou du budget. Formulation recommandée : « Les principes intégrés au cadrage et mis en œuvre lorsque le contexte du projet le permet sont : ».

| # | Pratique à présenter dans le contenu | Référence GreenIT |
| --- | --- | --- |
| 1 | Cadrer le besoin et écarter les fonctionnalités non essentielles. | [RWEB 0001](https://rweb.greenit.fr/fr/fiches/RWEB_0001-eliminer-les-fonctionnalites-non-essentielles) |
| 2 | Concevoir d’abord pour les usages mobiles et les écrans contraints. | [Référentiel RWEB 5.0 — RWEB 0004](https://rweb.greenit.fr/fr/fiches) |
| 3 | Simplifier les parcours les plus fréquents et limiter les étapes inutiles. | [RWEB 0005](https://rweb.greenit.fr/fr/fiches/RWEB_0005-optimiser-le-parcours-utilisateur) |
| 4 | Privilégier un design simple, accessible et utile. | [RWEB 0012](https://rweb.greenit.fr/fr/fiches/RWEB_0012-favoriser-un-design-simple-epure-adapte-au-web) |
| 5 | Limiter les animations aux cas où elles améliorent réellement la compréhension. | [RWEB 0009](https://rweb.greenit.fr/fr/fiches/RWEB_0009-eviter-les-animations-javascript-css) |
| 6 | Choisir une architecture et des technologies proportionnées au besoin. | [Référentiel RWEB 5.0 — RWEB 0067](https://rweb.greenit.fr/fr/fiches) |
| 7 | Réduire les bibliothèques, scripts et ressources externes au nécessaire. | [Référentiel RWEB 5.0 — RWEB 0015](https://rweb.greenit.fr/fr/fiches) |
| 8 | Optimiser les images : bon format, dimensions adaptées et compression. | [RWEB 0049](https://rweb.greenit.fr/fr/fiches/RWEB_0049-optimiser-les-images) |
| 9 | Différer le chargement des ressources non visibles immédiatement. | [Référentiel RWEB 5.0 — RWEB 0051](https://rweb.greenit.fr/fr/fiches) |
| 10 | Configurer le cache HTTP pour éviter des transferts inutiles lors des visites suivantes. | [RWEB 0074](https://rweb.greenit.fr/fr/fiches/RWEB_0074-utiliser-un-cache-http) |

Les fiches RWEB distinguent les priorités et les cycles de vie. Elles doivent guider une démarche de conception et de vérification ; elles ne constituent pas une certification automatique du site ni une promesse de performance ou de réduction d’impact.

Point à contrôler avant publication : l’affirmation actuelle « Hébergement vert » doit être conservée uniquement si le fournisseur, son offre et les éléments de preuve sont connus. Sinon, elle sera remplacée par un critère de sélection d’hébergement plutôt qu’une affirmation.

### Lot 6 — Faut-il parler de SEO sur cette page ?

**Oui, de façon limitée et reliée à la prestation dédiée.** Un site web doit intégrer des fondations techniques utiles à son indexation : HTML sémantique, performance, compatibilité mobile, métadonnées et liens internes. Les citer dans un court paragraphe répond à une attente légitime des prospects.

En revanche, la stratégie de contenu, l’optimisation locale, le GEO, le suivi Search Console et l’accompagnement de référencement doivent rester sur la [page SEO/GEO](/public/fr/prestations/seo.html). La page site web doit inclure un lien explicite vers celle-ci, par exemple : « Pour un accompagnement de référencement et de visibilité dans les moteurs et assistants IA, découvrez le service SEO et GEO. »

Cette séparation évite la cannibalisation thématique et ne promet ni position, ni trafic, ni citation par une IA.

### Lot 7 — FAQ, accessibilité et technique

1. Vérifier que les questions de FAQ sont des boutons utilisables au clavier avec `aria-expanded` et `aria-controls`, ou employer `details/summary`.
2. Corriger les erreurs de balisage : le dernier paragraphe de la section éco-conception ouvre un `<strong>` sans fermeture avant `</p>`.
3. Ajouter un lien d’évitement vers `main` et un `id="main-content"`, comme sur les pages déjà harmonisées.
4. Retirer l’espace final de l’URL du logo et donner aux images décoratives un `alt=""` ; conserver un texte alternatif descriptif seulement pour les images qui portent une information.
5. Vérifier le DOM de production et sans JavaScript : navbar, CTA, footer et FAQ ne doivent pas dépendre d’un montage tardif pour transmettre les informations essentielles.
6. Mesurer PageSpeed Insights / Lighthouse puis Search Console avant et après publication : LCP, INP, CLS, poids des images, indexation, impressions, clics et conversions contact/devis.

## 4. Ordre de mise en œuvre et état

| Ordre | Lot | Objectif | État |
| --- | --- | --- | --- |
| 1 | Métadonnées et langue | Alignement de l’intention locale et des snippets. | Appliqué et validé |
| 2 | JSON-LD | Entités stables, service clair, fil d’Ariane cohérent. | Appliqué et validé |
| 3 | Hero et introduction | Expliciter cible PME, zone et offre principale. | Appliqué et validé |
| 4 | Cartes de sites | Renforcer le choix du prospect et les liens de conversion. | Appliqué et validé |
| 5 | Éco-conception | Ajouter les dix pratiques validées, sans promesse non vérifiable. | Appliqué et validé |
| 6 | SEO contextuel | Ajouter le socle technique et le lien vers la page SEO/GEO. | Appliqué et validé |
| 7 | Accessibilité et validation | Corriger le balisage, tester les interactions et mesurer. | Appliqué et validé |

## 5. Modifications réalisées

### Métadonnées, langue et ciblage local

- La langue du document est désormais `fr-CH`.
- Le title, la meta description, les métadonnées Open Graph et Twitter ciblent la création de sites vitrines, e-commerce et sur mesure pour les PME du Valais, avec accompagnement à distance dans le reste de la Suisse.
- Le H1 est devenu « Création de sites web » et le hero est suivi d’une introduction qui précise la cible, les offres, la zone d’intervention et les liens vers les services complémentaires.

### Données structurées

- Les données structurées sont regroupées dans un seul `@graph` JSON-LD : organisation locale, personne, service et page web avec fil d’Ariane.
- Elles réutilisent les identifiants stables de HelveClick et présentent les trois offres réellement détaillées sur la page : site vitrine, e-commerce et site sur mesure.

### Offre, conversion et contenu utile

- Les trois cartes ont été réécrites pour expliquer le besoin métier servi, avec des CTA de devis aux destinations homogènes et des libellés explicites pour les lecteurs d’écran.
- La section d’éco-conception présente exactement dix pratiques RWEB, formulées comme des principes à adapter au contexte du projet plutôt que comme des promesses systématiques.
- L’hébergement est attribué à PlanetHoster : la page indique les données publiées par l’hébergeur pour son infrastructure suisse (100 % d’énergie renouvelable, PUE 1,37, WUE 1,22) et précise que ces indicateurs ne suffisent pas à mesurer l’empreinte complète d’un site.
- Une section courte expose les fondations techniques favorables à l’indexation et renvoie vers le service SEO/GEO dédié, sans promesse de positionnement, de trafic ou de conversion.

### Accessibilité et robustesse

- Les dix questions de la FAQ sont désormais des boutons natifs avec `aria-expanded`, `aria-controls`, une région de réponse associée et une interaction clavier native.
- Les réponses restent lisibles lorsque JavaScript est indisponible.
- Un lien d’évitement mène au contenu principal ; le `main` possède l’identifiant `main-content`.
- Le chemin du logo a été corrigé et les images décoratives du hero utilisent un texte alternatif vide.
- La compilation de production (`npm run build`) est réussie. Les avertissements Sass de dépréciation et les quatre références SVG signalées lors du build restent à traiter séparément : ils ne bloquent pas la génération actuelle.

### Éléments à contrôler après déploiement

- Vérifier le rendu réel, les données structurées et l’accessibilité de la FAQ dans l’environnement de production.
- Relever PageSpeed Insights / Lighthouse (LCP, INP, CLS, poids des images) avant et après mise en ligne.
- Suivre dans Search Console et Analytics l’indexation, les impressions, les clics et les conversions de prise de rendez-vous ou de demande de devis.
- Un visuel social dédié n’a pas été créé dans ce périmètre : il pourra être ajouté lorsqu’un asset stable, destiné au partage, sera disponible.

## 6. Sources consultées

- [Référentiel de bonnes pratiques d’écoconception web RWEB 5.0](https://rweb.greenit.fr/fr/fiches) — inventaire et priorisation des pratiques.
- [RWEB 0001 — Éliminer les fonctionnalités non essentielles](https://rweb.greenit.fr/fr/fiches/RWEB_0001-eliminer-les-fonctionnalites-non-essentielles).
- [RWEB 0005 — Optimiser le parcours utilisateur](https://rweb.greenit.fr/fr/fiches/RWEB_0005-optimiser-le-parcours-utilisateur).
- [RWEB 0009 — Éviter les animations JavaScript / CSS](https://rweb.greenit.fr/fr/fiches/RWEB_0009-eviter-les-animations-javascript-css).
- [RWEB 0012 — Favoriser un design simple, épuré et adapté au Web](https://rweb.greenit.fr/fr/fiches/RWEB_0012-favoriser-un-design-simple-epure-adapte-au-web).
- [RWEB 0049 — Optimiser les images](https://rweb.greenit.fr/fr/fiches/RWEB_0049-optimiser-les-images).
- [RWEB 0074 — Utiliser un cache HTTP](https://rweb.greenit.fr/fr/fiches/RWEB_0074-utiliser-un-cache-http).
- [PlanetHoster — Hébergement vert](https://www.planethoster.ch/fr/Hebergement-Vert) — données publiées par l’hébergeur sur ses infrastructures.
