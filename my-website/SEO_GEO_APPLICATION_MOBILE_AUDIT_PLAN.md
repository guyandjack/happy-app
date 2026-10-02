# Audit et plan d’action SEO / GEO — page « Applications mobiles »

> Statut : audit statique réalisé le 2 octobre 2026 ; les lots 1 à 7 ont été appliqués et vérifiés sur `public/fr/prestations/application-mobile.html`.
>
> Périmètre : `public/fr/prestations/application-mobile.html`, sa version anglaise, `sitemap.xml`, la chaîne Vite et les conventions déjà appliquées aux pages françaises de prestations.
>
> Limite : ce document ne remplace pas une vérification sur l’URL publiée, ni une analyse de la demande, de la concurrence, de l’indexation, des conversions ou des performances réelles.

## 1. Conclusion rapide

La page dispose d’une base utile : canonical, alternates `fr-CH` / `en-CH`, sitemap, H1 unique, données structurées, trois types d’applications clairement présentés et une FAQ riche. Elle répond déjà à l’intention principale « développement d’application mobile en Valais ».

La priorité est de transformer la page en une réponse plus fiable pour les PME : expliquer comment choisir entre natif, hybride et PWA ; rendre explicites la zone d’intervention, le processus et les limites techniques ; puis relier l’application mobile aux services complémentaires réellement pertinents. Les formulations qui promettent systématiquement les « meilleures performances », une expérience « optimale », l’absence de latence, une hausse de conversion ou une autonomie prolongée doivent être remplacées par des critères de décision et des engagements vérifiables.

## 2. Inventaire de la page analysée

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | `lang="fr"`, robots, canonical, alternates et entrée sitemap sont présents. | Base saine ; `lang="fr-CH"` doit être aligné sur les alternates et le marché suisse. |
| Métadonnées | Title, description, Open Graph, Twitter et signaux géographiques citent Crans-Montana / Valais. Les descriptions mentionnent des résultats et qualités absolues. | Intention locale claire, mais promesse à recentrer sur l’accompagnement sur mesure, les plateformes et les besoins métiers. |
| Données structurées | Trois scripts JSON-LD déclarent l’organisation, un service, un catalogue natif / hybride / PWA et un fil d’Ariane. | Les types d’offres sont bien représentés ; le graphe doit être harmonisé avec l’identité stable déjà utilisée ailleurs et le fil d’Ariane ne doit rester que s’il existe dans le HTML visible. |
| Hero | H1 « Applications mobiles » et sous-titre détaillant iOS, Android, natif, hybride et PWA. | Sujet net ; le H2 visuel ne constitue pas une section et l’absence d’introduction ne répond pas immédiatement aux besoins, à la zone et au déroulement du projet. |
| Offre | Trois cartes : applications natives, hybrides et PWA. | Bonne structure comparative, mais les critères de choix, dépendances techniques et limites de chaque approche sont insuffisamment expliqués. |
| Liens et conversion | Les trois cartes mènent vers `/fr/contact.html`. Aucun lien éditorial n’oriente vers site web, SaaS, SEO/GEO ou À propos. | Les liens actuels doivent être vérifiés : la convention des pages harmonisées est `/public/fr/contact.html`. Le maillage interne est à enrichir sans diluer le sujet mobile. |
| Éco-conception | Une section dédiée lie sobriété, performance, autonomie et expérience utilisateur. | Différenciation utile, mais plusieurs relations de cause à effet sont présentées comme automatiques. |
| UX et performance | Une section promet démarrage rapide, fluidité sans latence, tests rigoureux et hausse de conversion. | Les bonnes pratiques sont pertinentes ; elles doivent devenir des objectifs mesurés et adaptés au projet, pas des garanties. |
| FAQ | Onze questions couvrent prix, délais, plateformes, maintenance, backend, sécurité, stores et évolution. Les titres sont cliquables mais ne sont pas des boutons. | Contenu commercial utile ; interaction non accessible au clavier et réponses à nuancer sur les délais, la sécurité, la conformité, les stores et les outils annoncés. |
| Médias et rendu | Images des cartes chargées en lazy loading ; logo avec espace final dans l’URL ; textes alternatifs souvent redondants. Navbar, CTA et footer sont montés via React. | Corriger le chemin du logo, les alternatives et contrôler le rendu produit avec ou sans JavaScript. |

## 3. Décisions métier à confirmer avant implémentation

1. **Périmètre réel de l’offre.** Confirmer les technologies effectivement proposées : Swift, Kotlin / Java, React Native, Flutter, PWA, backend, paiements, notifications, réalité augmentée, reconnaissance d’image et maintenance.
2. **Accompagnement après livraison.** Confirmer les modalités de maintenance, publication sur l’App Store / Google Play, gestion des comptes développeur, rapports, analytics et mises à jour système.
3. **Sécurité et conformité.** Ne conserver que les mesures réellement appliquées et vérifiables. Le RGPD, les audits, le chiffrement, l’authentification et les tests doivent être décrits selon les responsabilités du projet ; aucune application ne peut être déclarée « sécurisée » sans contexte, analyse de risque ni maintenance.
4. **Tarifs et délais.** Les montants CHF 5’000 / CHF 20’000+ et les délais de 2 à 6+ mois doivent être confirmés avant maintien. À défaut, les présenter comme des ordres de grandeur explicitement conditionnés ou renvoyer vers un devis.
5. **Zone et mode d’intervention.** Confirmer : Valais en proximité et accompagnement à distance dans le reste de la Suisse, comme sur les autres pages françaises harmonisées.

## 4. Plan d’action priorisé

### Lot 1 — Langue, métadonnées et ciblage local

1. Passer le document en `lang="fr-CH"`.
2. Harmoniser title, meta description, Open Graph et Twitter autour de la même intention : développement d’applications mobiles iOS, Android et PWA pour les PME, en Valais et à distance en Suisse si ce périmètre est confirmé.
3. Éviter « performante », « éco-conçue », « UX soignée » ou « orientée résultats » lorsqu’aucune précision ne permet d’en vérifier le sens. Préférer la description du travail réalisé : cadrage, choix technique, interface, développement, tests et publication.
4. Aligner `og:locale:alternate` sur `en_CH`, cohérent avec la page anglaise et les balises `hreflang`.
5. Ne renseigner `og:image` et `twitter:image` qu’une fois un visuel de partage dédié, pérenne et réellement disponible.

Proposition de travail — à valider avant intégration :

```text
Title : Développement d’applications mobiles en Valais | Helveclick

Description : Applications mobiles iOS, Android et PWA sur mesure à Crans-Montana : cadrage, développement, tests et accompagnement pour les PME du Valais.
```

### Lot 2 — Données structurées cohérentes et maintenables

1. Regrouper les trois scripts JSON-LD dans un unique `@graph` : organisation, personne, `Service` et `WebPage`.
2. Réutiliser les identifiants stables : `https://helveclick.ch/#org`, `https://helveclick.ch/#guillaume-dupanloup`, `#service` et `#webpage`.
3. Nommer le service « Développement d’applications mobiles sur mesure » et conserver un catalogue correspondant aux trois offres visibles : native, hybride et PWA.
4. Aligner marque, URL, adresse, zones desservies, langues, `founder` et `sameAs` sur les pages françaises déjà harmonisées.
5. Retirer l’`Offer` incomplet (devise mais pas de prix affiché) si aucun prix maintenu n’est publié. Conserver le `OfferCatalog` suffit pour décrire les types d’applications.
6. Ajouter un fil d’Ariane HTML visible avant le hero puis conserver le `BreadcrumbList`, ou supprimer le balisage de fil d’Ariane si la navigation n’est pas réellement proposée.
7. Ne pas ajouter de balisage `FAQPage` dans le seul objectif d’obtenir un résultat enrichi.

### Lot 3 — Hero, introduction et maillage interne

1. Conserver un seul H1, avec « Applications mobiles sur mesure » ou une formulation comparable validée ; ne pas le surcharger de toutes les technologies.
2. Convertir le sous-titre visuel du hero en paragraphe stylé s’il n’introduit pas une vraie section.
3. Ajouter une introduction immédiatement après le hero, répondant explicitement à :
   - pour qui : PME et organisations avec un usage mobile réel ;
   - pour quoi : parcours client, outil métier, service connecté ou produit numérique ;
   - où : Valais et, si confirmé, Suisse à distance ;
   - comment : cadrage, choix de l’approche, réalisation, tests et mise en ligne.
4. Ajouter des liens contextuels vers la création de site web, le développement SaaS lorsque le besoin backend / outil métier le justifie, SEO/GEO uniquement pour la visibilité d’une PWA ou d’un site associé, À propos et contact.
5. Ne pas présenter le SEO comme un bénéfice automatique d’une application native ; une PWA ou les pages de présentation associées peuvent, elles, être concernées par une stratégie de visibilité web distincte.

### Lot 4 — Revoir les offres native, hybride et PWA

| Offre | Contenu à rendre explicite |
| --- | --- |
| Application native | Cas d’usage où les intégrations système, performances mesurées, expérience de plateforme ou contraintes hors ligne peuvent justifier un développement distinct iOS / Android. Éviter « meilleures performances » sans critère. |
| Application hybride | Bénéfice attendu d’un socle partagé, conditions de compatibilité, besoins natifs éventuels, coût global de maintenance et choix du framework réellement maîtrisé. Ne pas déclarer React Native / Flutter si le projet ne les propose pas. |
| PWA | Différence avec une application distribuée sur les stores, compatibilité selon navigateurs et appareils, installation, hors-ligne lorsque le cas le permet et contraintes de notifications ou de capacités système. |

Pour chaque carte : expliquer le besoin métier, les critères qui orientent le choix et le résultat livré. Les CTA doivent mener vers `/public/fr/contact.html` avec un libellé précis : « Étudier une application native », « Comparer hybride et PWA » ou « Cadrer votre projet mobile ».

### Lot 5 — Éco-conception, UX et performance sans promesses absolues

1. Présenter l’éco-conception comme une démarche de sobriété adaptée aux usages : fonctionnalités utiles, données limitées au nécessaire, médias optimisés, cache / hors-ligne lorsque pertinent, dépendances maîtrisées et durée de vie du produit.
2. Remplacer les promesses sur la batterie, les performances ou l’expérience utilisateur par des objectifs mesurables et des arbitrages de projet. Une optimisation ne garantit pas à elle seule l’autonomie, l’engagement ou la conversion.
3. Décrire la qualité mobile par des pratiques concrètes : définition des appareils / versions supportés, tests des parcours prioritaires, gestion des erreurs, accessibilité, temps de réponse mesurés et retours utilisateurs lorsque la mesure existe.
4. Retirer « sans latence ni saccades » et « améliore votre taux de conversion » ; une application peut viser une interface réactive et des parcours clairs, sans garantir le comportement commercial final.
5. Ne pas conserver d’outil d’analytics, de test ou de mesure dans le contenu s’il n’est pas proposé et configuré dans le respect des exigences de confidentialité applicables.

### Lot 6 — FAQ, confiance et accessibilité

1. Reprendre le modèle accessible utilisé par les pages harmonisées : un bouton natif par question, `aria-expanded`, `aria-controls`, réponse avec `role="region"` et `aria-labelledby`.
2. Conserver la lisibilité de toutes les réponses sans JavaScript ; le script partagé doit uniquement gérer le repli / dépli.
3. Remplacer les délais fixes par des facteurs de variation : fonctionnalités, plateformes, intégrations, comptes stores, backend, tests, exigences réglementaires et validations tierces.
4. Encadrer les réponses relatives à la sécurité : analyse de risque, protections adaptées aux données, mises à jour et responsabilités partagées. Ne pas promettre une absence de vulnérabilité ou une conformité automatique.
5. Distinguer clairement : compte développeur du client, publication et validation par Apple / Google, propriété des accès, maintenance, infrastructure backend et coûts récurrents potentiels.
6. Conserver les questions qui facilitent une décision : coûts, délais, plateformes, critères natif / hybride / PWA, backend, maintenance, stores, sécurité, mesure et évolutivité.

### Lot 7 — Images, URLs et validation technique

1. Ajouter le lien d’évitement vers `main`, puis `id="main-content" tabindex="-1"` sur le contenu principal.
2. Retirer l’espace final de l’URL du logo. Employer `alt="Helveclick"` pour le logo et `alt=""` pour les images décoratives qui dupliquent déjà le titre adjacent.
3. Ajouter `decoding="async"` aux images différées après validation du rendu ; ne pas inventer de dimensions. Définir ultérieurement des ratios stables si les mesures de CLS le justifient.
4. Corriger les liens de cartes `/fr/contact.html` vers l’URL publique réellement déployée après confirmation de la convention. La page doit employer une seule forme cohérente de liens internes.
5. Vérifier le DOM produit, avec et sans JavaScript : le contenu essentiel est statique, alors que navbar, CTA, retour haut de page et footer sont montés côté client.
6. Confirmer le chemin de sortie réellement publié après `npm run build`, puis contrôler canonical, hreflang, sitemap et absence de doublon accessible.

## 5. Ordre d’exécution proposé

| Ordre | Lot | Dépendance | Résultat attendu |
| --- | --- | --- | --- |
| 1 | Validation de l’offre | Décisions métier | Technologies, sécurité, maintenance, tarifs, délais et zone confirmés. |
| 2 | Métadonnées et JSON-LD | Lot 1 validé | Une intention locale claire et des entités cohérentes. |
| 3 | Hero, introduction et liens | Lot 1 validé | Une page qui explique public, besoin, méthode et zone dès le début. |
| 4 | Trois offres mobiles | Lot 1 validé | Un choix natif / hybride / PWA compréhensible et réaliste. |
| 5 | Éco-conception et UX | Offre confirmée | Des bénéfices formulés comme objectifs mesurés, non comme garanties. |
| 6 | FAQ et accessibilité | Structure HTML définie | Interaction clavier, contenu fiable et utile sans JavaScript. |
| 7 | Médias, URLs et build | Tous les contenus intégrés | Page produite, indexable et techniquement cohérente. |

## 6. Validation avant et après déploiement

### Avant publication

- Vérifier la validité JSON des données structurées et leur correspondance avec le contenu visible.
- Vérifier le H1 unique, la hiérarchie des sections, les liens internes et les URL de contact.
- Tester FAQ, lien d’évitement et navigation au clavier, avec JavaScript désactivé puis activé.
- Exécuter `npm run build` et vérifier le fichier HTML généré pour l’URL française.
- Contrôler que les assertions sur technologies, sécurité, stores, analytics et maintenance correspondent aux conditions réellement proposées.

### Après publication

- Inspecter l’URL dans Google Search Console : indexation, canonical choisie, couverture et alternates.
- Valider les données structurées avec Schema.org et le test des résultats enrichis Google ; l’absence de résultat enrichi ne constitue pas une erreur.
- Mesurer Lighthouse / PageSpeed : LCP, INP, CLS, poids des images, scripts et erreurs de chargement.
- Suivre impressions, clics, requêtes, pages d’entrée et demandes de contact sur une période comparable, sans attribuer une variation à une seule modification sans données.

## 7. État de ce périmètre

- [x] Page française, version anglaise, conventions des pages de prestations et chaîne de rendu examinées.
- [x] Audit et plan d’action rédigés.
- [x] Validation métier de l’offre, des tarifs, délais, technologies, maintenance et engagements de sécurité.
- [x] Implémentation des lots 1 à 7 sur `public/fr/prestations/application-mobile.html`.
- [ ] Synchronisation de la version anglaise après validation de la page française.
- [x] Build de production et contrôles statiques de la page générée réalisés le 2 octobre 2026.

### Décisions et vérifications appliquées

- Technologies présentées : Swift, Kotlin, React Native et PWA.
- Publication sur les stores et mises à jour présentées comme un accompagnement, la validation finale restant du ressort d’Apple et Google.
- Sécurité décrite avec des mesures adaptées au projet ; la LPD suisse et le RGPD sont distingués, sans promesse de conformité automatique.
- Tarifs et délais présentés comme des ordres de grandeur ; le devis signé définit le périmètre, les livrables, le calendrier et les coûts.
- Zone d’intervention : Valais et accompagnement à distance en Suisse.
- Vérifications réalisées : structure des données JSON-LD, relations de la FAQ accessible, contenus statiques de la page produite, canonical et alternate `en-CH`, ainsi que les médias différés.
