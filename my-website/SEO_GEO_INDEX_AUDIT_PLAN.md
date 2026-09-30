# Audit et plan SEO / GEO — page d’accueil française

> Statut : plan appliqué et mis à jour le 29 septembre 2026. Les modifications ci-dessous ont été vérifiées dans un build local de production ; leur déploiement, leur indexation et leurs effets dans les outils de mesure restent à confirmer.
>
> Périmètre : `index.html` et les composants rendus dans cette page au 29 septembre 2026. La performance réelle, l’indexation et les données Search Console ne sont pas vérifiables depuis le code source seul.

## 1. Conclusion rapide

La page possède déjà une base saine : langue déclarée, balise canonical, alternates FR/EN, un H1 unique, données structurées, navigation interne, FAQ et liens vers les prestations.

Les principaux leviers ne sont pas des « hacks GEO ». Ils concernent la cohérence entre la promesse commerciale, le contenu réellement rendu, les métadonnées, les données structurées et les signaux locaux. Google indique que les pratiques SEO fondamentales restent la base de la visibilité dans ses expériences génératives ; il n’existe ni balisage Schema spécifique GEO, ni garantie de citation par une IA.

La priorité est donc de rendre la page plus explicite et plus fiable pour une PME qui cherche un prestataire web en Valais, tout en aidant les moteurs et agents à identifier clairement les services proposés, le périmètre géographique et les preuves d’expertise.

## 2. Inventaire de la page analysée

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Document | `lang="fr"`, viewport, canonical et alternates présents. | Bonne base d’indexation et de ciblage linguistique. |
| Métadonnées | Le title cible l’agence web et Crans-Montana. La meta description cite SEO, GEO et SaaS, mais contient une erreur typographique : `SaaS.Solutions`. Les métadonnées Open Graph et Twitter ne sont pas encore alignées sur GEO/SaaS. | Snippet, partage social et cohérence d’entité perfectibles. |
| Données structurées | Un bloc `ProfessionalService` est présent. Il décrit l’entreprise, l’adresse, le fondateur et trois offres historiques. SaaS et GEO n’y figurent pas. | L’entité locale est identifiable, mais l’offre actuelle est incomplète. |
| Navigation | Navbar, footer et liens de hero couvrent les services. La navigation est montée par React. | Bon maillage interne ; important de vérifier le rendu HTML final et l’accessibilité. |
| Hero | Un H1 unique : agence web, Crans-Montana, solutions digitales et PME du Valais. Quatre liens de services sont placés chacun dans un H2. | La proposition locale est claire, mais les H2 sont employés comme habillage de liens et non comme vrais titres de section. |
| Services | La section possède un H2 puis quatre cartes (`site web`, `SEO & GEO`, `mobile`, `SaaS`) injectées par React. | Les sujets sont bons, mais une partie importante du contenu et des liens ne figure pas dans le HTML initial. |
| Différenciation | Quatre cartes expliquent performance/éco-conception, sur-mesure, accompagnement et qualité. | Bon contenu de réassurance ; il manque des preuves vérifiables et des liens contextuels plus complets vers toutes les offres. |
| CTA et réalisations | Les composants CTA et réalisations sont injectés côté client. | Utile pour la conversion, mais à auditer dans le DOM rendu pour s’assurer que leur contenu est accessible sans délai de rendu. |
| FAQ | Sept questions pertinentes, dont une sur SEO/GEO. Les questions sont des H3 dans des `div`, avec ouverture gérée en JavaScript. | Le contenu existe dans le source, ce qui est favorable ; la sémantique et l’accessibilité peuvent être renforcées. |
| Images | Hero préchargé avec `srcset`, `fetchpriority="high"` et texte alternatif. Les images des cartes React n’ont pas de `loading="lazy"`. | Le hero est traité comme une ressource LCP. Le reste doit être mesuré dans Lighthouse/PageSpeed. |

## 3. Analyse section par section

### 3.1 `<head>` : indexation, snippet et partage

#### Éléments satisfaisants

- `charset`, `viewport`, robots `index, follow`, canonical et `hreflang` sont présents.
- La cible géographique est annoncée par le title, le H1 et les métadonnées.
- Le site relie correctement la page française à `public/en/home.html`.
- L’image hero est préconnectée et préchargée.

#### Écarts à corriger lors de l’étape dédiée

1. **Corriger la meta description** : l’absence d’espace dans `SaaS.Solutions` nuit à sa qualité rédactionnelle.
2. **Aligner le title, la meta description, Open Graph et Twitter** : les descriptions sociales actuelles ne mentionnent ni GEO ni SaaS, alors que la page et l’offre les présentent.
3. **Prévoir une image sociale dédiée** : `og:image` et `twitter:image` sont commentées. Elle doit être une image de marque réelle, stable et correctement dimensionnée, pas l’image saisonnière de hero.
4. **Conserver une intention principale** : la page d’accueil ne doit pas chercher à se positionner sur toutes les requêtes. Le fil directeur recommandé est : agence web à Crans-Montana / Valais pour PME, avec les services comme preuves de couverture.

### 3.2 Header et navigation

#### Éléments satisfaisants

- La navbar utilise un élément `<nav>` et des attributs ARIA.
- Les pages essentielles sont liées : site web, SEO/GEO, applications mobiles et SaaS.
- Le footer répète des liens de services utiles au crawl et aux visiteurs.

#### Améliorations à prévoir

1. Vérifier dans le HTML rendu de production que les liens de menu sont bien disponibles, navigables au clavier et ne dépendent pas d’une erreur JavaScript.
2. Utiliser des libellés précis et homogènes entre hero, cartes, navbar et footer. Exemple : décider si l’offre s’appelle partout « Optimisation SEO & GEO » ou « Référencement SEO & GEO ».
3. Vérifier les URL et ancres internes de chaque lien après chaque ajout de prestation.

### 3.3 Hero : H1, promesse et liens de services

#### Éléments satisfaisants

- Un seul H1 est présent.
- Il exprime une activité, un lieu et une audience : agence web, Crans-Montana, PME du Valais.
- Les liens vers les quatre offres majeures sont immédiatement visibles.

#### Problèmes de hiérarchie

Les quatre liens du hero sont placés chacun dans un H2. Ces H2 ne décrivent pas des sections distinctes de la page : ils servent de conteneurs visuels. Cela perturbe la lecture hiérarchique par les lecteurs d’écran et dilue le rôle des H2 réels de la page.

#### Plan de correction

1. Conserver le H1 unique.
2. Remplacer les H2 conteneurs par une liste de liens classique, avec un libellé de groupe accessible si nécessaire (par exemple un `<p>` ou un `nav` avec un `aria-label`).
3. Évaluer le H1 contre les requêtes réellement visées avant de le réécrire. Il doit rester naturel, sans accumulation de mots-clés.
4. Vérifier que l’image de hero décrit réellement le visuel dans son `alt`. Ne pas transformer l’attribut `alt` en liste de mots-clés SEO.

### 3.4 Section « Mes services »

#### Éléments satisfaisants

- Le H2 « Mes services » introduit logiquement des cartes H3.
- Les quatre offres sont bien couvertes : web, SEO/GEO, mobile et SaaS.
- Chaque carte mène à une page de service, ce qui favorise un maillage interne utile.

#### Risque technique / contenu

Les cartes sont injectées dans `#RC-card-services` par React. Google peut rendre du JavaScript, mais le contenu essentiel d’une page d’accueil est plus robuste s’il est présent dans le HTML initial ou pré-rendu à la construction. Cela améliore aussi le rendu pour d’autres moteurs, agents et visiteurs lorsque le JavaScript est lent ou indisponible.

#### Plan de correction

1. Inspecter le HTML final de production et l’URL Inspection/Search Console avant de décider d’une évolution d’architecture.
2. Si le contenu n’est pas présent assez tôt dans le rendu, pré-rendre les cartes ou conserver un équivalent HTML statique dans la page.
3. Revoir chaque carte avec une structure uniforme : bénéfice concret, audience concernée, périmètre réel, lien descriptif.
4. Garder les descriptions courtes sur l’index ; déplacer les explications détaillées sur les pages de services.

### 3.5 Section « Faire le choix Helveclick »

#### Éléments satisfaisants

- La hiérarchie H2 puis H3 est pertinente.
- Les thèmes performance, éco-conception, sur-mesure, accompagnement et qualité sont cohérents avec le positionnement.
- Des liens contextuels existent vers la page site web et l’ancre éco-conception.

#### Plan de contenu

1. Ajouter uniquement des preuves que vous pouvez confirmer : exemples de livrables, méthode de travail, technologies réellement utilisées, indicateurs mesurables ou retours clients autorisés.
2. Ajouter, si pertinent, un lien interne vers la page SaaS dans la carte « solutions sur mesure » et vers la page application mobile dans le texte où ce service est cité.
3. Remplacer les promesses absolues (« qualité garantie », résultats implicites) par des engagements précis et vérifiables : tests, critères d’acceptation, maintenance, suivi ou transparence du devis.
4. Ajouter `rel="noopener noreferrer"` au lien externe ouvert dans un nouvel onglet.

### 3.6 CTA et réalisations

#### État observé

Le CTA et la liste des réalisations sont montés par React dans des conteneurs vides du HTML initial.

#### Plan de correction

1. Vérifier le contenu final, les titres, les liens et les images dans le DOM de production.
2. Donner aux réalisations une valeur de preuve : contexte, rôle exact, problème résolu, résultat seulement s’il est vérifiable et autorisé par le client.
3. Ajouter un H2/H3 dans le composant de réalisations si son rendu actuel n’en fournit pas un cohérent.
4. Veiller à ce que le CTA ait un objectif unique et mesurable (contact, appel découverte ou demande de devis).

### 3.7 FAQ

#### Éléments satisfaisants

- Les questions répondent à des objections utiles : prix, démarche, types de projets, SEO/GEO.
- Les réponses sont présentes dans le HTML initial, même si elles sont repliées visuellement.
- La question GEO précise qu’il ne s’agit pas d’une promesse de visibilité automatique : cette prudence doit être conservée lors des révisions.

#### Améliorations recommandées

1. Utiliser une structure interactive native (`<details><summary>`) ou des boutons avec `aria-expanded` et `aria-controls`. Les H3 seuls ne sont pas des contrôles accessibles au clavier.
2. Corriger les fautes et espacements visibles, par exemple « un de programme » et l’absence d’espace après certaines virgules.
3. Réduire ou reformuler la réponse sur le programme de parrainage : elle est longue, polémique et éloignée de l’intention principale de la page d’accueil. Elle peut être remplacée par une question d’achat plus utile (délais, maintenance, accompagnement) ou déplacée.
4. Ne pas ajouter `FAQPage` dans l’unique objectif d’obtenir un rich result. Google limite ce type d’affichage ; le balisage doit refléter un contenu réel et une politique de résultat valide.

### 3.8 Technique, performance et accessibilité

#### Éléments satisfaisants

- L’image LCP est préchargée de façon responsive et chargée avec une priorité élevée.
- La page utilise `<main>`, des sections et des titres structurés.
- Des alternatives textuelles sont prévues pour les images importantes.

#### Vérifications à réaliser, sans supposer le résultat

1. Mesurer mobile et desktop avec PageSpeed Insights/Lighthouse : LCP, INP, CLS, TTFB, poids des scripts et images non critiques.
2. Vérifier avec Google Search Console : indexation, canonicals choisis, pages exclues, Core Web Vitals et rapport « Performances dans les fonctionnalités IA » lorsqu’il est disponible sur la propriété.
3. Tester le rendu sans JavaScript et le DOM rendu avec un navigateur automatisé : navigation, cartes, CTA, footer et réalisations.
4. Vérifier `robots.txt`, les sitemaps réellement déployés, les codes HTTP, les redirections, les erreurs 404 et les en-têtes cache. Aucun `robots.txt` n’a été trouvé dans le répertoire `public` lors de cet audit ; cela doit être confirmé sur le serveur de production avant toute conclusion.
5. Auditer les textes alternatifs, le contraste, la navigation clavier et le comportement des accordéons.

### 3.9 SEO local

#### Éléments satisfaisants

- Crans-Montana et le Valais sont déjà présents dans le title, H1, description, schema et contenu.
- L’adresse, le téléphone, l’e-mail et un profil LinkedIn sont présents dans les données structurées.

#### Plan local

1. Confirmer le nom commercial officiel, l’adresse, le téléphone, l’e-mail, les zones réellement desservies et les horaires. Ces données doivent être identiques sur le site, Google Business Profile, Bing Places et les annuaires légitimes.
2. Employer les lieux uniquement lorsqu’ils sont pertinents : Crans-Montana, Valais et Suisse. Ne pas créer de pages quasi identiques pour chaque commune sans valeur propre.
3. Ajouter des preuves locales réelles si disponibles : projets autorisés, partenariats, témoignages identifiables avec consentement, événements ou expertise sectorielle locale.
4. Vérifier et maintenir les profils d’établissement, les avis et leurs réponses. Ces actions sont hors code, mais importantes pour la visibilité locale.

### 3.10 Données structurées

#### État observé

Le JSON-LD `ProfessionalService` est un bon point de départ, mais son inventaire d’offres est en retard par rapport à la page : il ne mentionne ni SaaS ni SEO/GEO.

#### Plan de correction

1. Valider les données existantes avec le Schema Markup Validator et le Rich Results Test après chaque modification.
2. Donner un `@id` stable à l’organisation et le réutiliser partout dans le site.
3. Ajouter uniquement les services réellement vendus et décrits : site web, application mobile, optimisation SEO/GEO et SaaS.
4. Compléter les propriétés d’organisation uniquement avec des faits vérifiés : `sameAs`, `areaServed`, `contactPoint`, horaires si publics, etc.
5. Ajouter `WebSite` ou `WebPage` seulement si le graphe reste cohérent et maintenable. Le Schema aide à comprendre le contenu et à l’éligibilité à certains résultats enrichis ; il ne garantit pas un classement ou une réponse IA.

## 4. Plan de mise en œuvre proposé, dans l’ordre

| Priorité | Lot | Décision ou action | Dépendances |
| --- | --- | --- | --- |
| P0 | Baseline | Relever Search Console, Analytics, Lighthouse, indexation et requêtes actuelles de la page. | Accès aux outils et à la production. |
| P0 | Cadrage éditorial | Valider audience principale, zones servies, services prioritaires, différenciants et faits prouvables. | Informations métier fournies par vous. |
| P1 | Métadonnées | Corriger la description ; aligner title, meta, OG/Twitter et données structurées sur l’offre confirmée. | Cadrage éditorial. |
| P1 | Hiérarchie | Corriger les H2 utilisés comme liens dans le hero, sans changer le design. | Validation de la formulation du H1. |
| P1 | Services critiques | Garantir que services, CTA et réalisations sont rendus de manière indexable, puis renforcer leurs liens et libellés. | Audit du DOM rendu. |
| P1 | Schema local | Mettre à jour le graphe `ProfessionalService` avec les services confirmés et le valider. | Données d’entreprise exactes. |
| P2 | Contenu | Réécrire progressivement les sections avec preuves, cas concrets et liens contextuels pertinents. | Validation métier et légale des affirmations. |
| P2 | FAQ | Corriger le contenu, l’accessibilité et les questions à faible valeur commerciale. | Choix éditoriaux. |
| P2 | Local | Harmoniser NAP, profils d’établissement et preuves locales. | Accès aux profils externes. |
| P3 | Mesure | Comparer impressions, clics, requêtes, conversions et Core Web Vitals après publication. | Baseline P0 et délai d’observation. |

## 5. Suivi des modifications réalisées

### Corrections appliquées dans le code

- Métadonnées : title, meta description, Open Graph et Twitter harmonisés autour de l’offre réellement proposée (sites web, applications mobiles, SaaS, SEO/GEO et éco-conception) ; langue de la page définie en `fr-CH`.
- Hiérarchie du hero : les faux H2 utilisés comme liens ont été remplacés par une liste de liens ; le libellé « Optimisation SEO & GEO » est cohérent avec la prestation dédiée.
- Contenu critique : les quatre cartes de services, le CTA et les deux réalisations publiées (Wiz Pix et Mon Projet Locatif) sont présents dans le HTML initial de l’accueil français. Les composants React ne les dupliquent plus.
- Signaux locaux et données structurées : le graphe `ProfessionalService` décrit désormais les zones servies, le contact commercial et les quatre offres ; une entité `WebPage` est reliée à l’organisation.
- FAQ : accordéon accessible avec boutons natifs et attributs ARIA ; contenu SEO/GEO, éco-conception, accompagnement et demande de devis reformulé sans promesse de classement, trafic, citation IA ou conversion garantie.
- Contenu éditorial : ajout de la zone d’intervention (Valais en présentiel, autres cantons à distance), de liens internes contextuels et de références aux deux projets en production. Les formulations absolues ont été remplacées par des explications concrètes et conditionnelles.
- Conversion : le CTA principal propose clairement une demande de devis ou de rendez-vous via le formulaire et le téléphone déjà publiés.
- Images et accessibilité : l’image hero saisonnière est décorative pour les lecteurs d’écran ; le logo porte le nom de marque ; un lien d’évitement permet d’atteindre directement le contenu principal ; l’animation hero dispose d’un texte de repli et respecte la préférence de réduction des animations.
- Performance : images non critiques des cartes chargées en différé, et polices configurées avec `font-display: swap` ; le préchargement, le `srcset`, la priorité et la préconnexion de l’image LCP étaient déjà présents et ont été conservés.
- Exploration : le build publie le sitemap maintenu dans le dépôt et un `robots.txt` qui référence `https://helveclick.ch/sitemap.xml`, sans hôte `www` ni routes d’administration, de test ou 404.

### Vérifications effectuées

- Le build de production (`npm run build`) a réussi après chaque lot.
- Le HTML de production généré contient les contenus statiques, les liens critiques, le texte de repli et les attributs d’accessibilité ajoutés.
- Le sitemap distribué est identique au fichier source ; `robots.txt` pointe vers l’URL canonique sans `www`.

### Éléments restant hors du code ou à traiter plus tard

- Créer et valider une image sociale de marque avant d’ajouter `og:image` et `twitter:image`. L’image saisonnière du hero ne doit pas être réutilisée à cette fin.
- Après déploiement, contrôler Search Console, Analytics, l’URL Inspection, les Core Web Vitals et les conversions « devis » / « rendez-vous ».
- Mettre en place Bing Places et maintenir la cohérence des coordonnées, zones servies et avis avec le site et Google Business Profile.
- La navigation et le pied de page restent rendus par React : ils fonctionnent dans le build actuel, mais leur pré-rendu global relève d’un chantier d’architecture distinct, à évaluer page par page.

## 6. Ligne éditoriale recommandée pour l’index

### Intention principale

Répondre à une PME qui cherche un partenaire pour concevoir ou améliorer une solution numérique à Crans-Montana / en Valais.

### Sous-intentions à couvrir sans surcharger la page

- Création ou refonte de site web professionnel.
- Développement d’application mobile ou de plateforme SaaS sur mesure.
- Référencement SEO et visibilité dans les expériences de recherche assistées par IA.
- Performance, accessibilité, éco-conception et accompagnement local.

### Principes de rédaction

- Écrire d’abord pour la décision du visiteur : problème, solution, méthode, preuve, prochaine étape.
- Employer les termes qu’un prospect utiliserait, dans le title, H1, H2, liens et paragraphes, sans répétition mécanique.
- Préférer des explications concrètes à des adjectifs génériques comme « innovant », « expert » ou « performant » sans preuve.
- Conserver le conditionnel lorsque le résultat dépend de facteurs externes : aucun SEO/GEO ne peut garantir un classement, un trafic ou une citation par une IA.
- Ne pas créer de texte en masse, de pages locales quasi dupliquées, de fausses mentions externes, ni de fichier `llms.txt` présenté comme un levier de classement Google.

## 7. Informations confirmées avant les modifications

1. Cible prioritaire : PME de tous secteurs.
2. Zone d’intervention : canton du Valais en présentiel ; autres cantons suisses à distance.
3. Services prioritaires : création ou refonte de sites web, puis solutions SaaS.
4. Preuves publiables confirmées : Wiz Pix et Mon Projet Locatif sont en production.
5. Profils locaux : Google Business Profile est en place ; Bing Places reste à créer.
6. Conversions prioritaires : demande de devis et prise de rendez-vous.
7. Mesure : accès disponible à Search Console et Analytics.

## 8. Références officielles utilisées

- Google Search Central — [Créer du contenu utile, fiable et centré sur l’utilisateur](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- Google Search Central — [Optimisation pour les fonctionnalités de recherche générative](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- Google Search Central — [Search Essentials](https://developers.google.com/search/docs/essentials)
- Google Search Central — [Données structurées compatibles avec Google Search](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)

## 9. Prochaine étape

Déployer les modifications, puis établir une baseline dans Search Console et Analytics. La page suivante pourra ensuite être traitée avec le même cycle : analyse, proposition, validation, implémentation et vérification.
