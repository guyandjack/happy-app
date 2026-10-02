# Audit et plan d’action SEO / GEO — page « Logiciel SaaS »

> Statut : audit statique réalisé le 2 octobre 2026 ; les lots 1 à 7 ont été appliqués et vérifiés sur `public/fr/prestations/saas.html`.
>
> Périmètre : page française `public/fr/prestations/saas.html`, version anglaise, `sitemap.xml`, chaîne de build Vite et conventions déjà appliquées aux pages de prestations.
>
> Limite : cet audit ne remplace pas l’analyse des requêtes, de l’indexation, des performances et des conversions sur l’URL publiée.

## 1. Conclusion rapide

La page répond déjà à l’intention principale « développement de logiciel SaaS en Valais » : elle décrit le SaaS, ses composants, des cas d’usage, une démarche MVP et des questions fréquentes utiles. Canonical, alternates, sitemap et H1 unique sont présents.

La priorité est de rendre l’offre plus vérifiable et plus utile à un décideur : préciser les besoins auxquels répond un SaaS, les limites et dépendances d’un projet (utilisateurs, données, intégrations, hébergement, maintenance), le déroulement du cadrage et la zone d’intervention. Les promesses de sécurité, de disponibilité, de conformité ou d’évolutivité doivent être formulées comme des mesures adaptées au projet, non comme des garanties générales.

## 2. Inventaire de la page analysée

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | La page déclare `lang="fr"`; robots, canonical, alternates `fr-CH` / `en-CH` et sitemap sont présents. | Base saine ; `fr-CH` est à aligner sur le marché et les alternates suisses. |
| Métadonnées | Title, descriptions et signaux sociaux ciblent SaaS, Crans-Montana et Valais. | Intention locale claire ; les formulations doivent être homogènes et centrées sur le cadrage, développement, tests et accompagnement. |
| Données structurées | Deux scripts JSON-LD : `Service` et `WebPage`, avec une offre sans prix affiché et un fil d’Ariane non visible dans le HTML. | Entités utiles, mais à regrouper avec l’organisation/personne stables. Retirer l’`Offer` incomplet et le fil d’Ariane non visible. |
| Hero | H1 « Solutions SaaS sur mesure » et sous-titre commercial. | Sujet net ; une introduction doit répondre rapidement à qui, quel problème, quelle zone et quelle méthode. |
| Offre | Quatre cartes : définition SaaS, fonctionnement, cas d’usage et MVP. | Structure utile ; les décisions techniques et les limites doivent être explicitées sans promesse absolue. |
| Confiance | Sécurité, sauvegardes, suivi des erreurs et évolution sont évoqués. | À encadrer selon les données traitées, le niveau de risque, l’hébergement, la maintenance et les responsabilités. |
| Liens et conversion | CTA vers `/public/fr/contact.html`; aucun maillage éditorial vers site web, application mobile ou SEO/GEO. | Les CTA sont cohérents ; ajouter des liens contextuels sans diluer le sujet SaaS. |
| FAQ | Trois questions utiles, en simples `h3` cliquables. | Sujet trop peu couvert pour les intentions de coût, délai, MVP, sécurité, hébergement, intégrations et maintenance ; interaction non accessible. |
| Médias et rendu | Images différées ; logo sans espace final. Navbar, CTA et footer sont montés via React. | Ajouter `decoding="async"` aux images différées après validation ; vérifier le contenu critique avec et sans JavaScript. |

## 3. Décisions métier à confirmer avant implémentation

1. **Périmètre technique réel.** Confirmer les technologies et services effectivement proposés : architecture SaaS, API, base de données, authentification, gestion des rôles, paiements, notifications, intégrations et hébergement.
2. **Sécurité et conformité.** Confirmer les mesures réellement appliquées : analyse de risque, droits d’accès, chiffrement lorsque pertinent, sauvegardes, journalisation, tests, maintenance, LPD suisse et RGPD selon le contexte. Une conformité complète ne doit pas être promise sans analyse juridique et organisationnelle.
3. **Exploitation et support.** Confirmer qui opère l’hébergement, gère les accès, assure les mises à jour, surveille les erreurs et traite les incidents après lancement.
4. **Tarifs et délais.** Indiquer si la page doit présenter des ordres de grandeur. À défaut, le devis doit rester la seule référence pour le périmètre, le calendrier, les coûts récurrents et le prix.
5. **Zone d’intervention.** Confirmer : proximité en Valais et accompagnement à distance dans le reste de la Suisse, conformément aux autres pages harmonisées.

## 4. Plan d’action priorisé

### Lot 1 — Langue, métadonnées et ciblage local

1. Passer le document à `lang="fr-CH"`.
2. Harmoniser title, meta description, Open Graph et Twitter autour de la même intention : logiciel SaaS sur mesure pour PME et organisations, en Valais et à distance en Suisse si ce périmètre est confirmé.
3. Décrire le travail réalisé : cadrage, conception, développement, tests, mise en ligne et évolution ; éviter les promesses non mesurables sur la performance ou les résultats commerciaux.
4. Ajouter `og:locale:alternate="en_CH"`; n’ajouter une image sociale que si un visuel de partage stable existe réellement.

Proposition de travail :

```text
Title : Développement de logiciel SaaS en Valais | Helveclick
Description : Logiciels SaaS sur mesure à Crans-Montana : cadrage, conception, développement, tests et évolution pour les PME du Valais.
```

### Lot 2 — Données structurées cohérentes

1. Réunir les données structurées dans un unique `@graph` : organisation, personne, `Service` et `WebPage`.
2. Réutiliser les identifiants stables `https://helveclick.ch/#org`, `#guillaume-dupanloup`, `#service` et `#webpage`.
3. Décrire le service comme « Développement de logiciel SaaS sur mesure » et n’énumérer que des prestations visibles et réellement proposées.
4. Retirer l’`Offer` sans prix public et le `BreadcrumbList` tant qu’un fil d’Ariane HTML visible n’est pas ajouté.
5. Ne pas ajouter de balisage `FAQPage` uniquement pour viser un résultat enrichi.

### Lot 3 — Hero, introduction et maillage interne

1. Conserver un seul H1, sans surcharge de mots-clés.
2. Convertir le sous-titre du hero en paragraphe s’il ne constitue pas une section.
3. Ajouter une introduction répondant à : pour qui, quels problèmes, où, et comment se déroule le projet.
4. Lier de façon contextuelle la création de site web, l’application mobile et le SEO/GEO lorsque le besoin le justifie ; garder le SaaS au centre de la page.

### Lot 4 — Offre SaaS et démarche MVP

1. Conserver les quatre cartes, en précisant les besoins métier, critères de décision et livrables attendus.
2. Présenter le MVP comme une première version priorisée, pas comme une garantie de validation commerciale.
3. Distinguer clairement interface, API/backend, base de données, rôles, intégrations et infrastructure lorsque ces éléments sont pertinents.
4. Encadrer les capacités de paiements, notifications ou connexions API par la faisabilité technique, les règles des tiers et les exigences de sécurité.
5. Uniformiser les CTA vers `/public/fr/contact.html` avec des libellés explicites.

### Lot 5 — Confiance, sécurité et exploitation

1. Expliquer que sécurité, sauvegardes, contrôle d’accès, journalisation, tests et maintenance sont définis selon les données, le risque et le périmètre retenu.
2. Distinguer la LPD suisse du RGPD, qui peut s’appliquer selon les traitements et marchés concernés.
3. Clarifier les responsabilités : comptes et accès client, hébergement, sauvegardes, mises à jour, surveillance, support et coûts récurrents.
4. Ne pas promettre une absence de vulnérabilité, une disponibilité permanente, une conformité automatique ou une croissance sans limite.

### Lot 6 — FAQ, intentions de recherche et accessibilité

1. Reprendre le modèle accessible des pages harmonisées : bouton natif, `aria-expanded`, `aria-controls`, réponse avec `role="region"` et `aria-labelledby`.
2. Conserver les réponses lisibles sans JavaScript ; le script partagé ne doit gérer que le repli/dépli.
3. Compléter les intentions importantes : différence SaaS/site web, coût, délais, MVP, intégrations, données et sécurité, hébergement, maintenance, évolution et zone d’intervention.
4. Présenter tarifs et délais comme indicatifs si confirmés ; le devis validé fait foi.

### Lot 7 — Médias, URLs et validation technique

1. Ajouter le lien d’évitement et `id="main-content" tabindex="-1"` sur le contenu principal.
2. Employer `alt="Helveclick"` pour le logo et `alt=""` pour les images décoratives qui répètent un titre voisin.
3. Ajouter `decoding="async"` aux images `loading="lazy"`; ne pas inventer de dimensions.
4. Vérifier le DOM produit, les liens, canonical, alternates, sitemap, JSON-LD et le contenu essentiel avec et sans JavaScript.
5. Exécuter `npm run build`; contrôler les avertissements et l’HTML produit, puis mesurer Lighthouse/PageSpeed et Search Console après publication.

## 5. Ordre de mise en œuvre

| Ordre | Lot | Dépendance | Résultat attendu |
| --- | --- | --- | --- |
| 1 | Validation métier | Décisions ci-dessus | Offre, technologies, exploitation et engagements confirmés. |
| 2 | Métadonnées et JSON-LD | Lot 1 validé | Intention locale et entités cohérentes. |
| 3 | Hero et introduction | Lot 1 validé | Besoin, cible, zone et méthode explicites. |
| 4 | Offre et MVP | Offre confirmée | Parcours de décision crédible pour un prospect. |
| 5 | Confiance et sécurité | Exploitation confirmée | Responsabilités et limites clairement formulées. |
| 6 | FAQ et accessibilité | Structure définie | Réponses utiles et interaction clavier. |
| 7 | Médias et build | Tous les contenus intégrés | Page produite, indexable et techniquement cohérente. |

## 6. Validation avant et après déploiement

### Avant publication

- Vérifier la validité JSON et la correspondance des données structurées avec le contenu visible.
- Vérifier H1, hiérarchie, URLs internes, CTA et FAQ avec JavaScript activé puis désactivé.
- Exécuter `npm run build` et contrôler la page produite.
- Vérifier que les affirmations sur la sécurité, l’hébergement, les sauvegardes, les intégrations et le support correspondent à l’offre réelle.

### Après publication

- Contrôler l’URL dans Search Console : indexation, canonical sélectionnée et alternates.
- Mesurer Lighthouse/PageSpeed : LCP, INP, CLS, images, scripts et erreurs de chargement.
- Suivre impressions, requêtes, clics et demandes de contact sur une période comparable.

## 7. État du périmètre

- [x] Page française, version anglaise, sitemap et chaîne de build examinés.
- [x] Audit et plan d’action rédigés.
- [x] Implémentation prudente réalisée sans prix public, promesse de conformité, disponibilité ou résultat.
- [x] Lots 1 à 7 appliqués sur `public/fr/prestations/saas.html`.
- [ ] Synchronisation anglaise après validation de la page française.
- [x] Build de production et contrôles statiques de la page générée réalisés le 2 octobre 2026.
