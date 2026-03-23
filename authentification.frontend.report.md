# Feature Report: Authentification (Frontend)

## Summary
L'intégration Frontend de l'authentification (Nuxt 3) a été implémentée avec succès. Elle s'interface directement avec l'API NestJS existante et fournit une expérience utilisateur complète, sécurisée et réactive en utilisant Nuxt UI, Pinia et Zod.

## Frontend Implementation
* **Store Global Pinia (`stores/auth.ts`)** : Gestion de l'état `user`, `accessToken`, `refreshToken`, persistés dans des cookies (`useCookie`).
* **Interceptor API (`plugins/api.ts`)** : Plugin `$api` (ofetch) pour injecter automatiquement l'en-tête `Authorization` et gérer silencieusement le rafraîchissement du token en cas d'erreur `401 Unauthorized`.
* **Protection des Routes (`middleware/auth.global.ts`)** : Middleware global restreignant l'accès aux pages selon le statut d'authentification (ex: redirection vers `/auth/login` si non connecté, ou redirection d'un connecté loin de la page login).
* **Pages & Composants (`pages/auth/*.vue`)** :
  * `login.vue` : Connexion
  * `register.vue` : Inscription avec sélection de rôle (Entreprise ou Prestataire)
  * `forgot-password.vue` : Demande de lien de réinitialisation
  * `reset-password.vue` : Validation du nouveau mot de passe
  * `verify-email.vue` : Vérification du compte via token intercepté dans l'URL.

## Tests & Validation
* Formulaires validés via **Zod** (email valide, mot de passe > 6 char, correspondance des mots de passe, etc.).
* Gestion des états de chargement (`loading`) sur chaque action bloquante.
* Les messages de retour API (Succès/Erreur) sont remontés visuellement via le système de notifications intégré Nuxt UI (`useToast`).

## Technical Debt / Next Steps
* Assurer que le `dashboard` redirige intelligemment l'utilisateur selon son champ `role` une fois authentifié.
* Vérifier le comportement visuel complet côté client avec de véritables appels aux emails transactionnels.
