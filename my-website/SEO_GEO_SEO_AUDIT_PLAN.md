# Audit et plan d'action SEO / GEO — page « Optimisation SEO et GEO »

> Statut : audit statique réalisé le 2 octobre 2026 ; aucune modification de `public/fr/prestations/seo.html` n'a été appliquée dans ce périmètre.
>
> Périmètre : `public/fr/prestations/seo.html`, sa version anglaise, `sitemap.xml`, `vite.config.js`, `src/jsx/page-prestations.jsx`, `src/scripts/page-services.js` et les conventions déjà appliquées à `public/fr/prestations/site-web.html`.
>
> Limite : cet audit ne remplace pas les contrôles sur l'URL publique (indexabilité effective, Search Console, données structurées rendues et Web Vitals). Aucune donnée de positionnement, de trafic, de concurrence ou de conversion n'a été consultée.

## 1. Conclusion rapide

La page possède une bonne base technique : contenu principal disponible dans le HTML initial, un H1 unique, canonical, alternates `fr-CH` / `en-CH`, URL présente dans le sitemap et données structurées pour l'organisation, le service et la page. Elle présente aussi déjà les six composantes utiles de l'offre : audit, technique, contenu, off-page, local et GEO.

La priorité est désormais de faire de cette page la réponse claire à l'intention **« accompagnement SEO et GEO pour PME en Valais »**, et non une liste générique de leviers SEO. Cela passe par l'alignement avec les pages françaises récemment harmonisées, une introduction orientée besoin métier, des promesses mesurées, une FAQ accessible et des données structurées cohérentes avec l'entité HelveClick déclarée ailleurs sur le site.

## 2. Inventaire observé

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | `lang="fr"`, robots `index, follow`, canonical et alternates sont présents. Les URL sont aussi déclarées dans `sitemap.xml`. | Base saine. `lang="fr-CH"` est à aligner sur les alternates et le marché suisse. |
| Métadonnées | Title, descriptions, Open Graph, Twitter et signaux géographiques ciblent Crans-Montana / Valais. Aucune image sociale active n'est déclarée. | L'intention locale est identifiable ; le message doit devenir homogène autour de « SEO et GEO », des PME et de la zone réellement servie. |
| Données structurées | Trois blocs JSON-LD : organisation, `Service`, `WebPage` avec fil d'Ariane. | Les entités existent, mais leur forme et leurs libellés diffèrent de la page `site-web.html` et de l'accueil. Le catalogue n'inclut pas GEO alors que le contenu le propose. |
| Hero | H1 unique « Optimisation SEO » et sous-titre local. | Sujet clair, mais le mot GEO n'apparaît pas immédiatement et aucune introduction ne précise le public, le périmètre, la méthode ou la Suisse à distance. |
| Offre | Six cartes couvrent les principaux leviers. Chaque carte mène vers le contact. | La couverture est bonne ; les textes doivent décrire des livrables, critères de priorité et limites réelles plutôt que des formules générales. |
| Liens internes | Les liens éditoriaux de la page pointent uniquement vers le contact. | Occasion manquée de relier le SEO au site web, à l'expertise et aux contenus réellement pertinents, sans dupliquer les autres pages de services. |
| GEO | Une carte GEO existe déjà et ne promet pas de citation automatique par une IA. | Très bonne direction. Elle doit être intégrée au positionnement, aux données structurées et à la FAQ, sans prétendre contrôler les réponses génératives. |
| FAQ | Onze questions et réponses utiles sont présentes en HTML. Sur cette page, les questions sont des `h3` cliquables, contrairement aux boutons accessibles de `site-web.html`. | L'information reste disponible sans JavaScript, mais l'interaction n'est pas utilisable au clavier de manière native et ne communique aucun état ARIA. |
| Médias et partage | Les images de cartes sont différées ; le logo du hero contient un espace final dans son URL. Les images sociales sont commentées. | Corriger le chemin du logo et les alternatives. Prévoir un asset social réel avant d'activer `og:image` et `twitter:image`. |
| Génération | Vite génère les pages statiques et copie sitemap / robots. Le dossier `dist` contient actuellement des sorties aux chemins `dist/fr/...` et `dist/public/fr/...`. | Les URL canoniques et le sitemap sont cohérents dans les sources, mais le chemin réellement déployé doit être confirmé pour écarter une duplication accessible. |

## 3. Points à traiter avant toute optimisation éditoriale

1. **Valider l'offre réellement vendue.** Confirmer que l'audit, le SEO technique, le contenu, le local, l'off-page, le GEO et le suivi sont bien inclus ou proposés selon les mêmes modalités que celles décrites. Les affirmations sur l'outreach, la gestion de réputation, les rapports mensuels ou les outils employés ne doivent rester que si elles correspondent à la prestation effective.
2. **Valider le ciblage commercial.** Le site indique Crans-Montana, le Valais et un accompagnement à distance en Suisse sur les pages harmonisées. Cette page doit utiliser exactement ce périmètre et ne pas multiplier les villes ou cantons sans offre locale distincte.
3. **Vérifier la demande avant de figer les requêtes.** L'audit de code ne permet pas de conclure sur le volume ou la concurrence de « consultant SEO Valais », « agence SEO Crans-Montana », « SEO local Valais » ou « GEO ». Les expressions seront choisies avec Search Console, données clients et recherche de marché, pas ajoutées mécaniquement.

## 4. Plan d'action priorisé

### Lot 1 — Unifier l'intention, la langue et les métadonnées

1. Passer le document en `lang="fr-CH"`.
2. Employer partout le nom de service validé **« Optimisation SEO et GEO »**. Il est déjà utilisé par l'accueil, la page À propos et la page site web pour l'identifiant de ce service.
3. Harmoniser title, meta description, Open Graph, Twitter et `WebPage.name` autour d'une seule promesse vérifiable : audit, priorisation, optimisation technique et éditoriale, référencement local et préparation des contenus pour les moteurs et assistants IA.
4. Conserver Crans-Montana et le Valais comme information de proximité ; préciser l'accompagnement à distance en Suisse seulement si celui-ci est réellement proposé.
5. Aligner `og:locale:alternate` sur `en_CH`, cohérent avec `hreflang="en-CH"`.
6. Conserver les meta géographiques uniquement comme signaux secondaires : elles ne remplacent ni une fiche d'établissement correcte, ni des données d'adresse cohérentes, ni des preuves de présence locale.

Proposition de travail — à valider avant intégration :

```text
Title : Optimisation SEO et GEO en Valais | Helveclick

Description : Accompagnement SEO et GEO à Crans-Montana : audit, optimisation technique et éditoriale, référencement local et contenus fiables pour les PME du Valais.
```

Le title et la description définitifs devront être ajustés si le ciblage commercial validé est plus large que le Valais.

### Lot 2 — Normaliser les données structurées

1. Remplacer les trois scripts JSON-LD par un unique `@graph`, sur le modèle de `public/fr/prestations/site-web.html`.
2. Réutiliser les identifiants stables du site : `https://helveclick.ch/#org`, `https://helveclick.ch/#guillaume-dupanloup`, `#service` et `#webpage`.
3. Aligner les attributs de l'organisation sur l'accueil et les pages françaises harmonisées : nom de marque (`HelveClick` dans les données structurées existantes), URL avec slash final, adresse, langues, `founder` et `sameAs`.
4. Décrire un `Service` nommé « Optimisation SEO et GEO » dont le catalogue reflète les six prestations effectivement décrites : audit, technique, contenu, off-page, local et GEO.
5. Ne déclarer ni prix, ni disponibilité, ni promesse de résultat si ces informations ne sont pas rendues et maintenues de façon fiable. Le `Offer` actuel n'a pas de prix ; un catalogue de services est plus fidèle à la page.
6. Conserver le fil d'Ariane seulement si la navigation réelle le rend compréhensible. La solution la plus robuste est d'ajouter un fil d'Ariane HTML visible avant le hero, puis de conserver son équivalent JSON-LD. Sinon, retirer le `BreadcrumbList` plutôt que de baliser une navigation inexistante.
7. Ne pas ajouter de balisage `FAQPage` dans l'objectif d'obtenir un résultat enrichi : les questions doivent servir l'utilisateur avant tout et les résultats enrichis FAQ ne sont pas une promesse de visibilité pour une offre commerciale.

### Lot 3 — Rendre le début de page utile et distinctif

1. Garder le H1 unique. Transformer le sous-titre visuel du hero en paragraphe stylé s'il ne constitue pas une vraie sous-section ; les H2 doivent introduire des sections de contenu.
2. Ajouter après le hero une introduction courte, avec un H2, répondant explicitement à :
   - pour qui : PME et organisations dont les prospects cherchent une offre, une zone ou une expertise ;
   - ce qui est fait : diagnostic, priorisation, corrections, contenu et mesure ;
   - où : Valais en proximité, Suisse à distance si confirmé ;
   - ce qui n'est pas garanti : aucune position, trafic, conversion ou citation par une IA.
3. Présenter une méthode lisible — par exemple « comprendre → prioriser → mettre en œuvre → mesurer » — seulement si elle correspond à la manière de travailler réelle. Cette section est plus utile qu'une répétition supplémentaire des mots SEO et Google.
4. Ajouter des liens contextuels utiles vers la création de site web, À propos et contact. Lier vers les articles uniquement lorsqu'ils expliquent réellement un sujet évoqué et qu'ils sont maintenus.

### Lot 4 — Renforcer les six prestations sans surpromettre

| Section | Évolution recommandée |
| --- | --- |
| Audit SEO | Indiquer les éléments examinés et le livrable : constats, priorités, risques et plan d'action. Ne pas qualifier un audit de « complet » sans définir son périmètre. |
| SEO technique | Distinguer ce qui est vérifié de ce qui est corrigé : indexabilité, architecture, redirections, performance, mobile, données structurées et logs si disponibles. Remplacer « compatibilité irréprochable » par une formulation mesurable et non absolue. |
| Contenu | Partir des questions, besoins et preuves du client ; définir intention, structure, maillage et mises à jour. Éviter de présenter la richesse lexicale comme une fin en soi. |
| Off-page | Conserver une approche éditoriale et relationnelle. Retirer ou conditionner l'outreach, les réseaux sociaux et la réputation si ces actions ne sont pas réellement proposées. Ne jamais laisser entendre qu'un lien peut être obtenu ou qu'il produira un effet déterminé. |
| SEO local | Expliquer les prérequis : zone réellement servie, cohérence NAP, fiche Google Business Profile lorsque éligible, pages locales utiles et gestion loyale des avis. Éviter les formulations qui suggèrent une visibilité locale garantie. |
| GEO | Expliquer que GEO améliore la compréhension des contenus : réponses directes, faits vérifiables, sources, attribution, entités cohérentes, HTML sémantique et données structurées pertinentes. Rappeler qu'aucun moteur ni assistant IA ne peut être contraint à citer un site. |

Chaque carte doit idéalement répondre à trois questions : quel problème elle traite, ce qui est livré ou mis en œuvre, et dans quel cas elle devient prioritaire. Les CTA peuvent rester vers le contact, avec des libellés explicites tels que « Demander un audit SEO » ou « Échanger sur votre visibilité locale ».

### Lot 5 — Réviser éco-conception, performance et suivi

1. Remplacer les causalités simplifiées par des formulations exactes. La vitesse, l'ergonomie mobile et la sobriété peuvent améliorer l'expérience et réduire des freins techniques, mais elles ne garantissent pas une hausse de position ou une baisse du taux de rebond.
2. Présenter l'éco-conception comme une démarche de réduction des ressources inutiles et de qualité de l'expérience, adaptée au contexte du projet. Toute revendication sur un hébergement ou un gain environnemental devra disposer d'une preuve à jour.
3. Définir les indicateurs suivis en fonction de l'objectif : indexation et erreurs, impressions et clics Search Console, pages stratégiques, demandes de contact et conversions consenties. Éviter les listes d'outils ou rapports mensuels si ces livrables ne sont pas systématiques.
4. Corriger au passage les détails de qualité éditoriale, notamment « optimiation » dans la FAQ, les espaces manquants après certaines balises `strong` et les formulations trop affirmatives.

### Lot 6 — Refaire la FAQ pour la confiance et l'accessibilité

1. Reprendre le composant HTML utilisé par `site-web.html` : un bouton natif par question, `aria-expanded`, `aria-controls`, une région de réponse avec `aria-labelledby` et des identifiants uniques.
2. Ajouter le lien d'évitement vers `main` et `id="main-content" tabindex="-1"`, déjà présents sur les pages françaises harmonisées.
3. Préserver la lisibilité de toutes les réponses sans JavaScript ; JavaScript ne doit servir qu'à replier / déplier.
4. Ramener les réponses à des formulations vérifiables. En particulier, supprimer les délais « 2 à 4 semaines », « top 3 en 1 à 2 mois » et « 6 à 12 mois » : ils peuvent être interprétés comme une prévision commerciale sans tenir compte du site, du marché et des moyens engagés.
5. Conserver des questions à forte valeur de décision, par exemple : périmètre d'un audit, ordre des priorités, délai de mise en œuvre, référencement local, GEO, indicateurs suivis, propriété des accès et absence de garantie de positionnement.

### Lot 7 — Médias, robustesse de rendu et déploiement

1. Retirer l'espace final du chemin du logo du hero. Employer `alt="Helveclick"` pour le logo de marque et `alt=""` pour les images purement décoratives ; conserver un texte descriptif seulement lorsqu'une image apporte une information absente du texte.
2. Ajouter `decoding="async"` aux images non critiques si le rendu est validé. Définir des dimensions ou un ratio CSS stable afin de limiter les décalages visuels ; mesurer avant de modifier la stratégie de chargement du hero.
3. Créer un visuel social pérenne avant d'activer `og:image` et `twitter:image` ; ne pas réutiliser une image de contenu simplement pour remplir cette balise.
4. Vérifier le DOM produit avec et sans JavaScript. Le contenu de la page est déjà statique ; navbar, CTA, lien de retour et footer sont toutefois montés côté client. Les informations indispensables de contact et navigation doivent rester accessibles dans le scénario réellement supporté.
5. Après `npm run build`, confirmer quelle arborescence est publiée. Les sources déclarent les URL `/public/fr/...`, mais le dossier de sortie actuellement présent contient aussi une version sans `/public`. Ne corriger canonical, sitemap ou redirections qu'après avoir identifié l'URL publique finale et les éventuels doublons accessibles.

## 5. Ordre d'exécution proposé

| Ordre | Lot | Dépendance | Résultat attendu |
| --- | --- | --- | --- |
| 1 | Validation de l'offre et du ciblage | Décision métier | Promesses et zone d'intervention confirmées. |
| 2 | Métadonnées, langue et JSON-LD | Lot 1 validé | Une seule intention et un graphe d'entités cohérent. |
| 3 | Hero, introduction, offre et maillage | Lot 1 validé | Une page lisible, utile et distincte des autres services. |
| 4 | FAQ et accessibilité | Structure HTML définie | Interactions clavier et contenu fiable sans JavaScript. |
| 5 | Médias et détails techniques | Asset social disponible si souhaité | Partage, alternatives et stabilité visuelle améliorés. |
| 6 | Build et validation de production | Tous les changements intégrés | Indexabilité, rendu et URLs réellement vérifiés. |

## 6. Validation avant et après déploiement

### Avant publication

- Vérifier la validité JSON des données structurées et leur cohérence avec le HTML visible.
- Vérifier un H1 unique, une hiérarchie de sections compréhensible, les liens internes et les URL de contact.
- Tester la FAQ au clavier, avec JavaScript désactivé et avec un lecteur d'écran si disponible.
- Exécuter `npm run build`, contrôler les fichiers HTML générés, puis lancer un audit Lighthouse sur la page de préproduction.
- Contrôler les canonical, hreflang, robots et sitemap sur l'artefact effectivement publié.

### Après publication

- Inspecter l'URL dans Google Search Console : URL canonique choisie, indexation, couverture et pages alternatives.
- Valider les données structurées rendues avec le validateur Schema.org et le test des résultats enrichis de Google ; l'absence de résultat enrichi n'est pas une erreur en soi.
- Mesurer LCP, INP, CLS, poids des images et erreurs de chargement sur l'URL de production.
- Suivre les impressions, clics, requêtes, pages d'entrée et demandes de contact sur une période comparable. Les variations ne doivent pas être attribuées à un seul changement sans données.

## 7. État de ce périmètre

- [x] Structure du projet et chaîne de génération examinées.
- [x] Page française, version anglaise, sitemap et conventions de `site-web.html` comparés.
- [x] Audit et plan d'action rédigés.
- [ ] Validation métier de l'offre, des promesses, des tarifs et du périmètre géographique.
- [ ] Implémentation des lots sur `public/fr/prestations/seo.html` et les fichiers partagés nécessaires.
- [ ] Tests de build et validation sur l'environnement publié.
