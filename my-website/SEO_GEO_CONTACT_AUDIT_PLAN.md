# Audit et plan d’action SEO / GEO — page « Contact »

> Statut : audit statique réalisé le 2 octobre 2026 ; les lots éditoriaux, structurels et d’accessibilité ont été appliqués sur `public/fr/contact.html`. Le formulaire React et les pages légales nécessitent une mise en conformité dédiée avant toute validation complète de leur traitement.
>
> Périmètre : `public/fr/contact.html`, `public/en/contact.html`, `src/jsx/page-contact.jsx`, `src/components/ContactForm/ContactForm.jsx`, sitemap et conventions déjà appliquées aux pages de prestations.
>
> Limite : cet audit ne remplace pas un contrôle du formulaire et des APIs en production, une analyse de l’indexation, des requêtes, des conversions ou des données de consentement effectivement collectées.

## 1. Conclusion rapide

La page donne les coordonnées essentielles, les alternates linguistiques et des données structurées d’entreprise locale. Les éléments décisifs pour une prise de contact — téléphone, e-mail, adresse, horaires et lien vers la politique de confidentialité — sont présents dans le HTML statique.

La priorité est de faire de la page une réponse locale claire à l’intention « contacter un développeur web / une agence web en Valais », sans promesse non vérifiable sur le délai de réponse ni sur la gratuité d’un devis. La page doit aussi expliciter la zone d’intervention, faciliter les demandes qualifiées et rendre l’usage du formulaire aussi robuste et transparent que possible. Le formulaire, la navigation et le footer étant montés via React, la disponibilité et l’accessibilité réelle avec ou sans JavaScript constituent un point de contrôle majeur.

## 2. Inventaire de la page analysée

| Zone | État observé | Impact SEO / GEO |
| --- | --- | --- |
| Langue et indexation | `lang="fr"`, robots, canonical, alternates `fr-CH` / `en-CH` et sitemap sont présents. | Bonne base ; `fr-CH` doit être aligné sur les alternates et le marché suisse. |
| Métadonnées | Title, descriptions, Open Graph, Twitter et signaux géographiques citent Crans-Montana et le Valais. | Intention locale pertinente, mais « devis gratuit » et « réponse rapide » doivent être confirmés ou remplacés par une formulation neutre. |
| Données structurées | Un `@graph` contient l’organisation et un point de contact ; l’identité n’utilise pas les identifiants stables des autres pages. | À harmoniser avec `#org` et la personne référente ; zone servie et langues à rendre cohérentes. |
| Hero | H1 « Contact » et sous-titre générique. | H1 correct mais faible pour expliquer les services, la zone et le type de demande attendu. |
| Contenu de conversion | Introduction, formulaire React, coordonnées et horaires. | Les éléments essentiels sont statiques sauf le formulaire. Le texte peut mieux préparer une demande : besoin, contexte, échéance, budget indicatif facultatif. |
| Formulaire | `ContactForm` est monté côté client, utilise reCAPTCHA et envoie une requête vers une API. | À tester en production : erreurs, clavier, messages de statut, protection anti-spam, indisponibilité JavaScript, disponibilité de l’API et information des personnes. |
| Confidentialité | Un court texte et un lien vers la politique sont présents. | À vérifier contre le fonctionnement réel : reCAPTCHA, API, destinataires, durées de conservation, sous-traitants et transferts éventuels. |
| Accessibilité | Le hero contient deux images décoratives avec un texte alternatif identique ; le logo a un espace final dans son URL. Pas de lien d’évitement ni de cible `main`. | Corriger les alternatives, ajouter le lien d’évitement et vérifier labels, erreurs et focus du formulaire React. |
| Version anglaise | Les contenus sont proches, mais l’adresse affichée diffère de la page française. | Synchroniser les données factuelles et les attributs structurels après validation française. |

## 3. Décisions métier à confirmer avant implémentation

1. **Délai de réponse et devis.** Confirmer si « réponse rapide » et « devis gratuit » sont des engagements réels. À défaut, employer « réponse selon la demande » et « demande de devis ».
2. **Zone d’intervention.** Confirmer : Valais en proximité et accompagnement à distance dans le reste de la Suisse, comme les autres pages harmonisées.
3. **Canaux et horaires.** Confirmer l’adresse, le téléphone, l’e-mail, les horaires, les canaux réellement suivis et les périodes d’indisponibilité.
4. **Formulaire.** Confirmer les champs réellement nécessaires, l’API destinataire, la gestion des erreurs, le reCAPTCHA, le stockage, les destinataires et les durées de conservation.
5. **Protection des données.** Valider la politique de confidentialité et les mentions du formulaire avec le fonctionnement réel, notamment vis-à-vis de la LPD suisse, du RGPD lorsque pertinent et des services tiers.

## 4. Plan d’action priorisé

### Lot 1 — Langue, métadonnées et intention locale

1. Passer le document à `lang="fr-CH"`.
2. Harmoniser title, meta description, Open Graph et Twitter autour de la prise de contact pour les projets web, SaaS, mobile et SEO/GEO en Valais, avec accompagnement à distance en Suisse si confirmé.
3. Remplacer les promesses de gratuité ou de rapidité non confirmées par une formulation factuelle.
4. Corriger `og:locale:alternate` vers `en_CH`; ne pas ajouter de visuel social sans asset dédié et stable.

Proposition de travail :

```text
Title : Contact développeur web en Valais | Helveclick
Description : Parlez de votre projet web, SaaS, application mobile ou SEO/GEO avec Helveclick à Crans-Montana, en Valais et à distance en Suisse.
```

### Lot 2 — Données structurées et identité locale

1. Réutiliser dans un unique `@graph` les identifiants `https://helveclick.ch/#org`, `#guillaume-dupanloup`, `#contact` et `#webpage`.
2. Aligner nom, adresse, téléphone, e-mail, langues et zones servies sur les pages françaises déjà harmonisées.
3. Décrire le `ContactPoint` sans inventer de délai de réponse, disponibilité permanente ou canal de support.
4. Ajouter une `WebPage` liée à l’organisation ; ne pas ajouter un balisage de formulaire ou d’avis non visible dans la page.

### Lot 3 — Hero et contenu d’orientation

1. Conserver un H1 unique, par exemple « Contactez Helveclick » ou « Parlez de votre projet digital ».
2. Convertir le sous-titre visuel en paragraphe s’il ne constitue pas une section.
3. Ajouter une introduction concise : type de projets pris en charge, Valais / Suisse, informations utiles à transmettre et lien vers les prestations concernées.
4. Conserver la page comme point de conversion ; ne pas la surcharger de contenu concurrent des pages de services.

### Lot 4 — Formulaire, confiance et protection des données

1. Vérifier que chaque champ possède un libellé, une erreur compréhensible, un statut de soumission annoncé et un focus géré après erreur ou succès.
2. Ne demander que les informations nécessaires à la réponse ; distinguer clairement les champs obligatoires et optionnels.
3. Vérifier le fonctionnement sans JavaScript : si aucune solution de repli n’est prévue, publier e-mail et téléphone comme voies de contact explicites, sans prétendre que le formulaire est disponible.
4. Contrôler reCAPTCHA, l’API `/contact`, le traitement des erreurs réseau, le contrôle côté serveur, l’anti-spam et la limitation de débit dans le code et l’environnement de production.
5. Aligner le texte de confidentialité sur les données réellement collectées, les destinataires, la conservation et les services tiers ; le lien de confidentialité doit rester dans la même fenêtre sauf besoin explicite contraire.

### Lot 5 — Coordonnées, zone et maillage interne

1. Harmoniser les coordonnées entre versions française et anglaise ; la raison sociale / personne, l’adresse et les horaires doivent être identiques lorsqu’ils désignent la même entité.
2. Exprimer la zone d’intervention visible : Valais en proximité, Suisse à distance si confirmé.
3. Ajouter des liens courts vers site web, SaaS, application mobile et SEO/GEO, avec des libellés décrivant leur destination.
4. Conserver les liens `tel:` et `mailto:` ; ne pas introduire de carte ou de service externe sans vérification des conséquences de confidentialité et de performance.

### Lot 6 — Accessibilité, médias et validation technique

1. Ajouter un lien d’évitement et `id="main-content" tabindex="-1"` sur le contenu principal.
2. Retirer l’espace final de l’URL du logo ; employer `alt="Helveclick"` pour le logo et `alt=""` pour les images décoratives du hero et de contact.
3. Ajouter `decoding="async"` aux images `loading="lazy"`; ne pas inventer de dimensions.
4. Vérifier le DOM produit, avec et sans JavaScript : contenu essentiel, liens de contact, formulaire, navigation, CTA et footer.
5. Exécuter `npm run build`, vérifier canonical, alternates, sitemap, JSON-LD, erreurs console et formulaire sur l’environnement de production.

## 5. Ordre de mise en œuvre

| Ordre | Lot | Dépendance | Résultat attendu |
| --- | --- | --- | --- |
| 1 | Validation métier | Décisions ci-dessus | Engagements, zone, coordonnées et traitement des demandes confirmés. |
| 2 | Métadonnées et JSON-LD | Lot 1 validé | Intention locale et identité cohérentes. |
| 3 | Hero et orientation | Lot 1 validé | Prospect guidé vers une demande qualifiée. |
| 4 | Formulaire et confidentialité | Fonctionnement confirmé | Conversion accessible, contrôlée et transparente. |
| 5 | Coordonnées et liens | Lot 1 validé | Données factuelles alignées et maillage utile. |
| 6 | Accessibilité et build | Tous les contenus intégrés | Page produite et techniquement vérifiée. |

## 6. Validation avant et après déploiement

### Avant publication

- Vérifier la validité JSON-LD et sa correspondance avec les coordonnées visibles.
- Tester clavier, lecteur d’écran, messages d’erreur, soumission réussie et erreur réseau du formulaire.
- Vérifier les informations et mentions de confidentialité selon le comportement réel de l’API et de reCAPTCHA.
- Tester la page avec JavaScript activé et désactivé ; vérifier e-mail, téléphone et politique de confidentialité.
- Exécuter `npm run build` et contrôler le HTML produit.

### Après publication

- Vérifier l’URL dans Search Console : indexation, canonical et alternates.
- Mesurer Lighthouse/PageSpeed : LCP, INP, CLS, scripts tiers et erreurs de chargement.
- Vérifier les journaux applicatifs : erreurs API, reCAPTCHA, spam, délais de traitement et taux de soumission.
- Suivre les demandes reçues et leur origine sans collecter de données non nécessaires.

## 7. État du périmètre

- [x] Pages française et anglaise, sitemap, script de page et formulaire React examinés.
- [x] Audit et plan d’action rédigés.
- [x] Décisions métier confirmées : réponse rapide, devis gratuit, Valais et accompagnement dans toute la Suisse, canaux et horaires.
- [x] Métadonnées, données structurées, hero, contenu local, maillage, accessibilité statique et médias appliqués sur `public/fr/contact.html`.
- [ ] Vérification et éventuelle mise à jour du formulaire React, de reCAPTCHA, de l’API et des pages légales selon le traitement réel.
- [ ] Synchronisation anglaise après validation de la page française.
- [x] Build de production et contrôles statiques de la page générée réalisés le 3 octobre 2026.
