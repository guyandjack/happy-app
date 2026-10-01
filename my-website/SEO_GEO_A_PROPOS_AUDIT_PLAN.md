# Audit et plan SEO / GEO — page « À propos » française

> Statut : propositions à valider — aucune correction de cette page n'a été appliquée dans le cadre de cet audit.
>
> Périmètre : `public/fr/a-propos.html`, son point d'entrée `src/jsx/page-a-propos.jsx` et ses styles de page, analysés le 1er octobre 2026. Les données réelles de Search Console, Analytics, Google Business Profile et du serveur de production restent à contrôler après publication.

## 1. Conclusion rapide

La page dispose d'une base technique correcte : canonical, alternates FR/EN, une balise `title`, une meta description, un H1 unique et un JSON-LD local sont déjà présents. Le contenu principal est aussi livré directement dans le HTML, ce qui est plus robuste pour les moteurs et agents que du contenu uniquement injecté côté client.

Son principal point faible est éditorial : elle répond peu à l'intention « qui est Helveclick / qui réalisera mon projet web ? ». Elle présente une charte et un processus, mais identifie peu la personne, l'activité, la zone d'intervention, les clients visés, les services prioritaires et les preuves de réalisation. Le balisage Schema reflète également une ancienne version de l'offre : SaaS et GEO n'y figurent pas.

Pour le SEO comme pour les systèmes de recherche assistés par IA, l'objectif est de rendre la page facile à résumer avec des faits vérifiables : qui est le prestataire, pour qui il travaille, où, quels projets il réalise, comment il travaille et quelles preuves sont publiables. Il n'existe pas de balisage « GEO » qui garantisse une citation ou un positionnement.

## 2. Inventaire factuel de la page actuelle

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | `lang="fr"`, robots `index, follow`, canonical et `hreflang` FR/EN présents. | Bonne base ; `lang` devrait préciser `fr-CH` pour correspondre aux alternates et à la cible suisse. |
| Title et description | Le title cible Helveclick, Crans-Montana et l'agence web. La description cite sites, mobile et SEO. | Intention locale présente, mais SaaS, GEO et l'identité de la personne ne sont pas alignés avec l'offre actuelle. |
| Open Graph / Twitter | Titre et descriptions présents, mais image sociale commentée. | Les aperçus de partage ne sont pas maîtrisés. |
| H1 et titres | Un seul H1 : « A propos ». Les sections suivent avec des H2 et le processus avec des H3. | Hiérarchie saine, mais H1 trop générique et titre sans accent ; le sujet de la page reste imprécis. |
| Contenu introductif | Une phrase sur la qualité du code, la performance et le design, puis un lien LinkedIn. | Peu d'informations distinctives sur le prestataire, la zone, l'audience PME ou les services. |
| Charte et processus | Éco-conception, vie privée, accessibilité, durabilité et cinq étapes sont décrites. | Contenu utile de méthode ; certaines affirmations doivent rester rattachées à des pratiques réellement appliquées. |
| Maillage interne | Aucun lien interne visible vers les pages Site web, SaaS, SEO/GEO, application mobile, réalisations ou contact. | Manque d'orientation pour le visiteur et de contexte pour le crawl. |
| Conversion | Le conteneur CTA est commenté. | La page ne propose pas explicitement la conversion prioritaire : demande de devis ou rendez-vous. |
| Images | Logo et deux visuels de hero ont des textes alternatifs ; deux URL ont un espace final. | Les visuels décoratifs devraient avoir `alt=""` ; les chemins doivent être nettoyés. |
| Données structurées | `LocalBusiness` + `ProfessionalService`, adresse, téléphone, LinkedIn, fondateur et trois offres (site, mobile, SEO). | Bon départ, mais absence d'`@id`, de `AboutPage`, de lien entre Personne/organisation/page, de SaaS et de GEO. |
| Rendu client | Navbar, footer et lien de retour en haut sont montés par React ; le contenu principal reste statique. | Le contenu métier est accessible sans attendre React ; navigation et footer restent à contrôler dans le HTML rendu de production. |

## 3. Analyse et plan d'amélioration

### 3.1 Balises de document et partage — priorité P1

1. Passer la langue de document de `fr` à `fr-CH` afin d'être cohérent avec le marché suisse et les balises `hreflang`.
2. Conserver une intention centrée sur la présentation du prestataire, par exemple : « À propos de Helveclick, développeur web et SaaS à Crans-Montana ». La formulation définitive doit être validée selon le nom commercial et le statut professionnel réellement utilisés.
3. Réécrire la meta description pour présenter une personne/activité, les PME visées, le Valais et les services réels (site web et SaaS en priorité, puis SEO/GEO et mobile si confirmés).
4. Aligner title, description, Open Graph et Twitter. Ne pas réutiliser l'image saisonnière de hero : prévoir une image sociale stable, de marque et réellement disponible avant d'activer `og:image` et `twitter:image`.
5. Vérifier le chemin du manifeste et les URL avec espaces finaux dans les attributs `src` ; ce sont des détails techniques à corriger, sans leur attribuer un effet SEO direct.

### 3.2 H1, intro et identité du prestataire — priorité P1

Le H1 « A propos » est correct comme libellé de navigation mais faible comme titre de page. La page doit répondre, dès les premiers paragraphes, aux questions factuelles suivantes :

- Qui intervient : Guillaume Dupanloup / Helveclick, seulement si cette association est exacte et souhaitée publiquement.
- Pour qui : PME de tous secteurs.
- Où : en présentiel dans le canton du Valais ; à distance dans les autres cantons suisses.
- Sur quels besoins : création ou refonte de site web, solutions SaaS, puis les autres prestations effectivement proposées.
- Comment : accompagnement direct, méthode, performance, accessibilité, éco-conception lorsque ces pratiques sont réellement appliquées au projet.

Proposition de structure, à adapter avec des faits validés :

```text
H1 : À propos de Helveclick, développeur web et SaaS à Crans-Montana
Introduction : identité, rôle, audience PME, zone d'intervention et types de projets.
H2 : Une approche web sur mesure pour les PME
H2 : Ma charte éthique et éco-responsable
H2 : Mon processus de travail
H2 : Parlons de votre projet
```

Ne pas transformer l'introduction en biographie longue ni empiler les mots-clés locaux. Quelques informations précises, lisibles et prouvables ont davantage de valeur qu'une répétition de « agence web Valais ».

### 3.3 Contenu de confiance et GEO — priorité P1/P2

1. Ajouter un court bloc « expertise et rôle » : responsabilités assurées (cadrage, conception, développement, tests, suivi) uniquement si elles sont réellement prises en charge.
2. Ajouter des liens contextualisés vers les pages de prestation pertinentes : Site web, SaaS, SEO/GEO et application mobile. Les libellés doivent décrire la destination, pas seulement « en savoir plus ».
3. Ajouter une preuve de travail autorisée : liens vers Wiz Pix et Mon Projet Locatif, avec rôle exact et description factuelle. Ne publier ni résultat chiffré non vérifiable, ni nom de client sans accord.
4. Conserver le texte sur la charte, mais éviter les formulations qui ressemblent à une conformité absolue. Par exemple, présenter les recommandations Green IT comme un cadre qui oriente les choix de conception, plutôt qu'une garantie globale.
5. Enrichir le processus avec les livrables ou décisions attendus à chaque étape (cadrage, maquette, validations, tests, maintenance) seulement s'ils font partie de la pratique habituelle.

Ces éléments aident les moteurs et agents à extraire des réponses fiables parce qu'ils lient clairement l'entité, les services, le contexte local et les preuves. Ils ne garantissent pas l'apparition dans une réponse d'IA.

### 3.4 Données structurées — priorité P1

Le JSON-LD actuel peut évoluer vers un graphe cohérent, sans inventer de données :

1. Donner un `@id` stable à l'organisation, par exemple `https://helveclick.ch/#organization`, puis le réutiliser sur les pages du site.
2. Décrire la personne dans une entité `Person` distincte, reliée à l'organisation avec `founder` ou `worksFor` selon la réalité professionnelle.
3. Ajouter une entité `AboutPage` avec son URL canonique, sa langue et une relation explicite vers l'organisation et/ou la personne comme `mainEntity`.
4. Mettre à jour `makesOffer` avec les quatre offres réellement proposées : création de site web, application mobile, optimisation SEO & GEO, solution SaaS sur mesure. Chaque offre doit rester reliée à une page de service existante lorsque possible.
5. Reprendre les coordonnées, zone desservie, profil LinkedIn et tout `contactPoint` uniquement après vérification avec les données publiques de l'entreprise, Google Business Profile et le futur profil Bing Places.
6. Ne pas ajouter `Review`, `AggregateRating`, des récompenses, des clients ou des résultats sans source publique et autorisation. Ne pas ajouter `FAQPage` puisque cette page ne contient pas une FAQ.
7. Valider le JSON-LD après modification dans Schema Markup Validator et vérifier que les données correspondent strictement au contenu visible.

### 3.5 Accessibilité, images et structure — priorité P2

1. Ajouter un lien d'évitement et un `id` au contenu principal, de manière cohérente avec l'accueil, si cela n'est pas déjà fourni par un composant global.
2. Changer les `alt` des images purement décoratives du hero en `alt=""`. Garder pour le logo un texte simple, par exemple « Helveclick ».
3. Donner au lien LinkedIn un libellé accessible précis (« Profil LinkedIn de Guillaume Dupanloup » si le nom est validé), plutôt que « Liens linkedin ».
4. Retirer les espaces finaux des URL d'images et contrôler les dimensions, le chargement différé des images non critiques et le contraste.
5. Vérifier que l'animation de conclusion dispose d'un texte de repli lisible et respecte `prefers-reduced-motion`, comme l'accueil.

### 3.6 Conversion et parcours utilisateur — priorité P2

La page doit déboucher naturellement sur l'action prioritaire confirmée : demande de devis ou rendez-vous.

1. Décider si un CTA statique doit être restauré après le processus, avec un lien vers le formulaire de contact et le téléphone publiés.
2. Employer un appel à l'action précis : « Demander un devis » ou « Prendre rendez-vous », sans promettre de résultat commercial.
3. Mesurer les clics sur le CTA et sur les liens de prestations dans Analytics après publication, en respectant la politique de consentement applicable.

## 4. Plan de mise en œuvre proposé

| Ordre | Lot | Action | Validation nécessaire |
| --- | --- | --- | --- |
| P0 | Cadrage | Valider l'identité publique, le rôle, les services, zones, preuves et CTA. | Vos informations métier. |
| P1 | Métadonnées | Langue `fr-CH`, title, description, OG/Twitter et image sociale si disponible. | Formulations et image validées. |
| P1 | Entités | Graphe Organization / Person / AboutPage et offres à jour. | Coordonnées et données publiques exactes. |
| P1 | Intro et H1 | Réécriture factuelle de l'identité, de l'audience, de la zone et des services. | Ton éditorial et éléments publiables. |
| P2 | Maillage et preuves | Liens vers les offres et réalisations autorisées. | Rôle réel et autorisations clients. |
| P2 | Accessibilité / technique | `alt`, lien d'évitement, URLs d'images, animation et DOM rendu. | Revue visuelle et tests. |
| P2 | Conversion | CTA et mesure des clics. | Choix du parcours de conversion. |
| P3 | Mesure | Contrôler indexation, requêtes, conversions et couverture après déploiement. | Search Console, Analytics et délai d'observation. |

## 5. Informations déjà confirmées, réutilisables sous réserve de validation éditoriale

- Cible : PME de tous secteurs.
- Zone : canton du Valais en présentiel ; autres cantons suisses à distance.
- Services à pousser en premier : site web, puis SaaS.
- Réalisations publiables : Wiz Pix et Mon Projet Locatif sont en production.
- Conversion prioritaire : demande de devis et prise de rendez-vous.
- Google Business Profile est actif ; Bing Places reste à mettre en place.

## 6. Vérifications après implémentation

1. Lancer un build de production et vérifier le HTML généré de la page française et anglaise.
2. Valider le JSON-LD avec Schema Markup Validator ; vérifier que le graphe ne contient ni donnée fictive ni doublon d'entité.
3. Contrôler canonical, alternates, `lang`, titre, description, images sociales et codes HTTP en environnement déployé.
4. Inspecter l'URL dans Search Console après publication, puis comparer impressions, requêtes, clics et conversions à une baseline.
5. Vérifier la cohérence des coordonnées avec Google Business Profile et Bing Places lorsqu'il sera créé.

## 7. Références de méthode

- [Google Search Central — Créer du contenu utile, fiable et centré sur l'utilisateur](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search Central — Optimisation pour les fonctionnalités de recherche générative](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search Central — Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google Search Central — Données structurées compatibles avec Google Search](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)

## 8. Prochaine étape

Valider le cadrage éditorial et les données factuelles de la section 2. Ensuite, appliquer les lots un par un, avec validation après chaque modification.
