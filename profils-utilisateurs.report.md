# Feature Report: Profils utilisateurs

## Summary
La fonctionnalité de profils utilisateurs a été complétée avec succès. Elle gère la modification des informations de base (nom, prénom, téléphone, avatar) et ajoute le support des profils étendus selon le rôle de l'utilisateur : `PRESTATAIRE` (ProviderProfile) et `ENTREPRISE` (CompanyProfile).

## Backend Implementation
* **Schema Prisma** : Ajout du modèle `CompanyProfile` rattaché à `User`. Le modèle `ProviderProfile` existait déjà mais est désormais activement géré. Une migration a été générée.
* **UsersModule** :
  * Mise à jour de `users.service.ts` pour implémenter les méthodes `upsertProviderProfile` et `upsertCompanyProfile`, tout en s'assurant que `findById` charge ces relations (eager loading avec `include`).
  * Nouveaux DTOs : `UpdateProviderProfileDto` et `UpdateCompanyProfileDto`.
  * Modification de `users.controller.ts` pour exposer `/users/me/provider-profile`, `/users/me/company-profile`, et un endpoint de lecture publique `/users/:id/profile`.

## Frontend Implementation
* **Routes API (`api.routes.ts`)** : Ajout de `USERS.PROVIDER_PROFILE` et `USERS.COMPANY_PROFILE`.
* **Page (`/dashboard/profile.vue`)** : Chargement conditionnel de sous-formulaires supplémentaires basés sur `authStore.currentUser.role`.
* **Composants** :
  * `ProfileProviderForm.vue` (pour les prestataires : bio, compétences, taux horaire, etc.)
  * `ProfileCompanyForm.vue` (pour les entreprises : nom, description, site web, industrie, etc.)
  * Utilisation de *Zod* pour valider les données et de *Nuxt UI* pour les composants visuels.

## Database Changes
* Index sur `userId` de la table `CompanyProfile` pour accélérer les requêtes.
* Relation onDelete Cascade depuis `User`.

## API Documentation
| Endpoint | Method | Description |
|---|---|---|
| `/api/users/me` | PATCH | MAJ des infos de base |
| `/api/users/me/avatar` | POST | MAJ de l'avatar |
| `/api/users/me/provider-profile`| PATCH | MAJ/Création du profil Prestataire |
| `/api/users/me/company-profile`| PATCH | MAJ/Création du profil Entreprise |
| `/api/users/:id/profile` | GET | Obtenir le profil public |

## Security Review
* Le `UsersController` est globalement protégé par `JwtAuthGuard`. 
* L'upsert force le `userId` à être le `user.id` identifié par le JWT, évitant toute falsification.
* Les données non désirables (`passwordHash`, `refreshTokenHash`) sont omises des réponses API.
* Validation forte des payloads par les DTOs (max size, isUrl, etc.).

## Performance Review
* Prisma `upsert` est efficace et effectue l'opération en une étape optimisée.
* Les relations de profils sont gérées par eager loading de manière groupée sur la requête utilisateur, évitant le problème du N+1 lors du fetch de profil initial.

## Technical Debt / Next Steps
* Utiliser un `RolesGuard` strict sur les endpoints `PATCH me/provider-profile` et `PATCH me/company-profile` pour bloquer les appels ne provenant pas du bon rôle au niveau de l'orchestrateur.
* Étape suivante : "3 Prestataires" où ces profils seront affichés sur la plateforme public (listing et recherche).
