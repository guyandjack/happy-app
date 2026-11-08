# Audit de sécurité — flux de connexion et accès au dashboard

**Périmètre :** page `fr/connexion.html`, composants React associés, API d'authentification Express, gestion de session, puis routes d'administration utilisées depuis le dashboard.

**Méthode :** revue statique du code et de la configuration présente dans le dépôt le 8 novembre 2026. Aucun test d'intrusion ni vérification de l'infrastructure de production (TLS, proxy, WAF, permissions des fichiers de clés, en-têtes servis par l'hébergeur) n'a été effectué. Les éléments non vérifiables ne sont donc pas considérés comme protégés.

> **Mise à jour — correctifs appliqués le 8 novembre 2026 :** le code a depuis été renforcé avec des cookies `HttpOnly` pour les deux jetons, la rotation/révocation des refresh tokens, RBAC `admin`/`redacteur`, contrôles d'origine, rate limits dédiés, redaction des secrets dans les logs, Helmet/CSP et assainissement de la prévisualisation. La section « Risques » décrit l'état observé avant ces corrections et reste utile comme historique. La migration SQL et la configuration de production restent obligatoires avant déploiement.

## Synthèse

Le flux contient de bonnes bases : mots de passe hachés avec bcrypt, jetons signés en RS256, vérification des jetons sur les routes sensibles, cookie de refresh `HttpOnly`, validation serveur et CORS restrictif. Ces mesures ne suffisent toutefois pas pour un dashboard d'administration exposé sur Internet.

Les priorités sont les suivantes :

1. Ne plus consigner les corps de requête d'authentification dans les logs ; un mot de passe peut aujourd'hui y être écrit lors d'une erreur serveur.
2. Mettre un rate limit dédié sur `/api/auth/login` et corriger la déconnexion pour appeler réellement l'API.
3. Retirer le jeton d'accès de `localStorage`, ou réduire immédiatement la surface XSS tant qu'une migration vers des cookies sécurisés n'est pas menée.
4. Appliquer un contrôle de rôle côté API aux actions d'administration, et protéger la route `/api/articles/dashboard`.
5. Corriger les incohérences de changement de mot de passe et de refresh token avant toute évolution fonctionnelle.

## Flux actuellement observé

```text
Navigateur : /fr/connexion.html
        |
        | React Hook Form : email + mot de passe
        v
POST {API}/auth/login (JSON, withCredentials: true)
        |
        | validation Express (email, longueur et politique de mot de passe)
        v
User.findOne(email) -> bcrypt.compare(mot de passe, hash MySQL)
        |
        +-- échec : 401 générique « Incorrect email or password »
        |
        +-- succès :
              - access token JWT RS256 dans la réponse JSON
              - refresh token JWT RS256 dans le cookie `tokenRefresh`
                (`HttpOnly`, `SameSite=Lax`, `Secure` hors environnement development)
        |
        v
Frontend : `storeToken()`
        - access token, nom utilisateur et expiration dans localStorage
        - décodage local de l'expiration
        - redirection vers /fr/dashboard.html
        |
        v
Dashboard : GET /auth/me avec `Authorization: Bearer <access token>`
        |
        v
Middleware : vérifie la signature RS256, l'existence de l'utilisateur et
`passwordChangedAt`, puis autorise la réponse
```

Lorsque le jeton d'accès approche de son expiration, le composant `TimerSession` appelle `POST /auth/refresh-token` avec le cookie de refresh. L'API renvoie alors un nouveau jeton d'accès, à nouveau écrit dans `localStorage`.

La page HTML du dashboard est statique et accessible sans authentification serveur. Elle ne contient pas les données administratives par elle-même ; son garde côté client et le contrôle de l'API sont donc la véritable frontière de sécurité. Cette séparation est acceptable uniquement si **toutes** les API sensibles sont effectivement protégées côté serveur.

## Protections présentes et confirmées

| Zone | Mesure constatée | Appréciation |
| --- | --- | --- |
| Formulaire | `type="password"`, validation de format/présence côté React Hook Form, désactivation pendant l'envoi et délai Axios de 10 s. | Utile pour l'expérience et les erreurs triviales ; ce n'est pas une frontière de sécurité. |
| Transport applicatif | Envoi JSON et `withCredentials: true` pour le cookie de refresh. | Correct pour le mécanisme choisi. HTTPS reste à vérifier au déploiement. |
| Identifiants | Comparaison avec `bcrypt.compare`; création avec un coût bcrypt de 12. | Bonne pratique, sous réserve du contrôle de charge par rate limit. |
| Jetons | Signature RS256 ; middleware d'accès configuré avec l'algorithme RS256 explicitement. | Base saine. Il manque cependant des contraintes `issuer`/`audience` et une politique de révocation. |
| Accès aux données | `/auth/me`, changement de mot de passe, création et suppression d'article passent par `protect`. Le middleware revalide le compte et invalide les jetons antérieurs à un changement de mot de passe. | Protection serveur réelle pour ces routes, mais incomplète sans RBAC. |
| Refresh token | Cookie `HttpOnly`, `SameSite=Lax`, `Secure` lorsque `NODE_ENV` n'est pas `development`, cookie host-only. | `HttpOnly` réduit fortement le vol du refresh token par XSS ; le flag `Secure` doit être garanti en production. |
| Entrées | Validation serveur du login : e-mail normalisé, types et tailles contrôlés. Requêtes SQL paramétrées par `mysql2`. | Bon socle contre les entrées malformées et l'injection SQL. |
| Origines navigateur | CORS avec une liste explicite d'origines et `credentials: true`. | Adapté au frontend connu. CORS ne remplace ni l'authentification ni la protection XSS. |
| Dépendances | `npm audit --omit=dev --json` exécuté dans le frontend et le backend : 0 vulnérabilité connue rapportée au moment du contrôle. | Signal positif, mais ce contrôle doit être automatisé et complété par des mises à jour régulières. |

## Risques et améliorations recommandées

La criticité reflète le risque du code inspecté ; elle ne présume pas des protections externes éventuellement actives chez l'hébergeur.

| Priorité | Constat et impact | Recommandation | Pourquoi |
| --- | --- | --- | --- |
| **P0** | Le gestionnaire d'erreur global écrit `req.body` dans les logs. Si la connexion échoue après une exception (lecture de clé, signature JWT, base indisponible…), le mot de passe envoyé peut être conservé dans les logs applicatifs. | Ne jamais journaliser le corps brut des requêtes ; appliquer une fonction de redaction récursive (`password`, `currentPassword`, `newPassword`, cookies, `Authorization`) avant tout log. Restituer au client un message générique. Purger et faire tourner les logs existants selon la politique de rétention. | Les journaux sont souvent accessibles plus largement et conservés plus longtemps que la base d'identités. Un mot de passe en clair dans les logs est un incident de sécurité. |
| **P0** | Le backend importe `helmet` mais ne l'active jamais. Les réponses ne reçoivent donc pas, par ce code, les protections d'en-têtes attendues (CSP, anti-clickjacking, etc.). | Ajouter `app.use(helmet(...))` avant les routes et définir une CSP testée, restrictive, avec des sources explicites. Ajouter HSTS seulement une fois HTTPS confirmé partout. | Une CSP est une défense importante, surtout tant que le bearer token est accessible au JavaScript. |
| **P1** | L'access token est écrit dans `localStorage` puis joint manuellement en `Authorization`. Toute XSS sur l'origine peut l'exfiltrer et appeler l'API jusqu'à son expiration. Le dashboard charge en plus du HTML de fichier dans `dangerouslySetInnerHTML` sans assainissement visible. | Cible recommandée : session opaque ou JWT dans un cookie `HttpOnly; Secure; SameSite=Lax/Strict`, avec protection CSRF adaptée. En attendant la migration, assainir strictement tout HTML non fiable avec DOMPurify, supprimer `dangerouslySetInnerHTML` quand il n'est pas nécessaire, activer une CSP et conserver un access token très court, uniquement en mémoire si possible. | `HttpOnly` empêche la lecture du cookie par un script injecté ; un token dans `localStorage` ne bénéficie pas de cette protection. La prévisualisation d'article augmente ici le risque concret. |
| **P1** | Aucun rate limit actif ne couvre `/api/auth/login` : le limiteur global est commenté. Une attaque par force brute/credential stuffing peut aussi faire consommer du CPU via bcrypt. | Installer un limiteur spécifique au login et au refresh, par IP **et** par identifiant normalisé (stocké/clé de compteur hachée). Exemple de politique de départ : 5 à 10 échecs par 15 min, réponses uniformes, temporisation progressive, alertes et mécanisme anti-bot après seuil. Configurer `trust proxy` uniquement avec la liste exacte des proxies de confiance. | Le mot de passe robuste ne protège pas de la réutilisation d'identifiants divulgués. L'IP seule est insuffisante et doit être complétée. |
| **P1** | Le bouton de déconnexion local retire seulement `localStorage`. Il n'appelle jamais `POST /api/auth/logout`, alors que cette route existe : le cookie de refresh subsiste dans le navigateur jusqu'à son expiration. | Appeler `/auth/logout` avec `withCredentials: true`, puis nettoyer l'état local dans un `finally`. Côté serveur, conserver des refresh tokens rotatifs et révocables (hash + `jti` en base) ; révoquer la famille au logout, au changement de mot de passe et en cas de détection de réutilisation. | La déconnexion doit mettre fin à la session côté navigateur **et** côté serveur. Un refresh JWT stateless volé reste sinon exploitable jusqu'à expiration. |
| **P1** | Les routes de création et suppression d'articles exigent un jeton valide, mais n'appellent jamais `restrictTo`. La route `/api/articles/dashboard` est même publique. Ainsi, tout compte authentifié, quel que soit son rôle, peut administrer les articles ; des données destinées au dashboard sont également exposées sans authentification. | Déclarer clairement les rôles (`admin`, éventuellement `editor`) et poser `protect` puis `restrictTo("admin")` ou `restrictTo("admin", "editor")` sur chaque route d'administration, y compris `/articles/dashboard`. Tester systématiquement 401/403. | Les boutons masqués par le frontend ne sont pas une autorisation. L'API doit décider seule de chaque permission. |
| **P1** | Le changement de mot de passe est défaillant : `createSendToken(...)` est appelé mais n'est pas défini dans le contrôleur. La mise à jour SQL peut déjà avoir été commise avant l'erreur, laissant le client avec une réponse 500. | Corriger le flux de changement de mot de passe : valider le nouveau mot de passe côté serveur, mettre à jour le hash et `passwordChangedAt`, invalider les refresh tokens, puis émettre une session cohérente ou forcer une reconnexion. Couvrir le scénario par test d'intégration. | Un changement de mot de passe doit être atomique du point de vue métier et ne jamais laisser l'utilisateur dans un état ambigu. |
| **P1** | La politique de mot de passe est incohérente. Le formulaire de changement autorise `%` et `&`, le backend de changement ne les refuse pas, mais la validation de **login** les interdit. Un mot de passe accepté à la modification peut donc empêcher toute reconnexion. | Appliquer une politique unique, côté serveur, seulement à la création/changement/réinitialisation. Lors d'un login, vérifier le mot de passe tel quel, avec seulement une limite de taille raisonnable et un type valide. Centraliser la règle et ajouter les tests de compatibilité. | La validation du login ne doit pas modifier ni limiter arbitrairement un secret déjà choisi ; sinon elle crée des verrouillages de compte. |
| **P1** | `refreshToken` ne gère pas ses exceptions. Un refresh invalide/expiré peut passer au gestionnaire d'erreur global avec un statut 500 et exposer un message interne. Le refresh ne tourne pas non plus le refresh token. | Entourer le refresh d'un `try/catch`, répondre 401 avec un message uniforme, effacer le cookie invalide et vérifier explicitement `algorithms: ["RS256"]`, `issuer` et `audience`. Mettre en place une rotation à chaque refresh. | Les chemins d'échec d'authentification font partie du périmètre de sécurité ; des erreurs 500 compliquent la supervision et renseignent l'attaquant. |
| **P2** | Aucun `issuer`, `audience` ou identifiant de jeton (`jti`) n'est défini dans les JWT. Le délai du cookie est aussi fixé à 1 h indépendamment de `JWT_REFRESH_EXPIRES_IN`. | Émettre et vérifier `iss`, `aud`, `sub`, `jti`, `iat`/`exp`; définir les expirations dans une source unique et faire correspondre cookie/session aux règles métier. | Ces contraintes réduisent les risques de confusion de jetons et rendent l'exploitation, la révocation et le diagnostic plus fiables. |
| **P2** | La configuration locale inspectée est explicitement en `development`; le code rend alors le cookie de refresh non `Secure`. Il n'est pas possible de déduire la configuration réellement déployée depuis ce dépôt. | En CI/CD, refuser un déploiement public si `NODE_ENV !== "production"`, si les URLs ne sont pas HTTPS ou si les clés JWT sont absentes. Tester les attributs `Set-Cookie` en préproduction et vérifier TLS/HSTS au niveau du proxy. | Le flag `Secure` est indispensable : sans lui, un cookie de session peut transiter sur HTTP si une route ou un sous-domaine non sécurisé existe. |
| **P2** | Le `LoginForm` appelle `clearLocalStorageInfoSession(...)` sans l'importer dans la branche où le stockage du token échoue. | Importer la fonction et ajouter un test de l'échec de stockage/décodage du token. | C'est surtout un défaut de fiabilité, mais les échecs de session doivent conduire à un nettoyage déterministe. |

## Plan de correction recommandé

### 1. Correctifs immédiats (avant la prochaine mise en production)

- Redacter les secrets dans tous les logs et inspecter/purger les journaux ayant potentiellement reçu des requêtes de connexion.
- Activer Helmet et une CSP en mode rapport, puis la passer en blocage après correction des violations légitimes.
- Ajouter des limiteurs dédiés à `/login` et `/refresh-token`, avec messages d'erreur constants et métriques d'échec.
- Faire appeler l'endpoint de logout par le frontend.
- Poser les middlewares `protect` + `restrictTo` sur chaque route d'administration, dont `/articles/dashboard`.
- Corriger `createSendToken` inexistant et la politique de mot de passe contradictoire ; ajouter les tests associés.

### 2. Durcissement de session (itération suivante)

- Migrer le jeton d'accès hors de `localStorage` vers une session cookie sécurisée ou un access token très court uniquement en mémoire.
- Si des cookies portent l'authentification, ajouter une stratégie CSRF : `SameSite` adapté, contrôle strict d'`Origin`/`Referer` pour les écritures et token CSRF synchronisé ou double-submit selon l'architecture retenue.
- Remplacer les refresh tokens JWT stateless par des refresh tokens rotatifs, stockés hachés côté serveur, avec détection de réutilisation et révocation par session/appareil.
- Assainir le HTML avant prévisualisation et avant publication ; ne pas considérer le type de fichier ou une validation frontend comme une barrière de sécurité.

### 3. Qualité continue

- Écrire des tests d'intégration pour : succès/échec générique de login, rate limit, token expiré, refresh révoqué, logout effectif, changement de mot de passe, accès admin 401/403/200.
- Ajouter l'audit des dépendances à la CI, avec `npm ci` et `npm audit --omit=dev` ou un outil de surveillance continu ; la commande n'a relevé aucun avis au moment de cet audit.
- Mettre en place des alertes sur pics de 401/429, échecs de refresh, échecs de signature et tentatives d'accès administrateur refusées, sans jamais inclure de secrets dans les événements.

## Points à vérifier hors dépôt

- TLS est terminé avant l'API, tous les domaines redirigent HTTP vers HTTPS, et HSTS est activé une fois les sous-domaines compatibles.
- Les clés privée/publique JWT sont hors dépôt, lisibles uniquement par le processus API, renouvelables et sauvegardées de façon sûre.
- Le proxy transmet correctement l'adresse IP client, et `trust proxy` est limité à ce proxy.
- Les sauvegardes, logs et la base de données ont un chiffrement, des accès minimaux, une durée de rétention et une procédure de purge.
- Les comptes d'administration sont peu nombreux, protégés par mots de passe uniques ; pour ce type de dashboard, une MFA (TOTP/WebAuthn) est fortement recommandée.

## Références de code inspectées

- Frontend : `src/components/LoginForm/LoginForm.jsx`, `src/utils/fonction/storeToken.js`, `src/components/Dashboard/Dashboard.jsx`, `src/components/TimerSession/timerSession.jsx`, `src/components/Admin/PasswordChange.jsx`, `src/components/Articles/ArticleForm.jsx`.
- Backend : `backend/app.js`, `backend/routes/auth.routes.js`, `backend/controllers/auth.controller.js`, `backend/middleware/auth.middleware.js`, `backend/middleware/validation.middleware.js`, `backend/models/user.model.js`, `backend/routes/article.routes.js`, `backend/utils/function/setCookieOptionsObject.js`.

## Conclusion

L'authentification actuelle vérifie correctement un hash de mot de passe et la signature des jetons, mais la gestion de session et l'autorisation doivent être renforcées avant de considérer le dashboard comme suffisamment protégé pour un contexte de production exigeant. Le meilleur ordre de travail est : éliminer les fuites de secrets et les accès excessifs, freiner les attaques de connexion, fiabiliser logout/changement de mot de passe, puis migrer vers des sessions révocables et résistantes au XSS.
