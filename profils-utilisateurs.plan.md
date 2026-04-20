# Feature Plan: Profils utilisateurs

## 1. Feature Overview
La feature `Profils utilisateurs` couvre la gestion du profil personnel et du profil metier selon le role de l'utilisateur authentifie.

Elle permet:
- la lecture du profil courant
- la mise a jour des informations de base
- l'upload d'avatar
- la mise a jour du profil prestataire
- la mise a jour du profil entreprise
- l'exposition d'un profil public nettoye

## 2. User Stories
- En tant qu'utilisateur connecte, je veux consulter mon profil complet afin de verifier mes informations.
- En tant qu'utilisateur, je veux modifier mes informations personnelles afin de garder mon compte a jour.
- En tant que prestataire, je veux renseigner ma bio, mes competences, ma disponibilite et mon tarif afin d'etre trouve plus facilement.
- En tant qu'entreprise, je veux renseigner les informations de mon organisation afin de credibiliser mes demandes futures.
- En tant que visiteur, je veux consulter un profil public sans voir d'informations sensibles.

## 3. Architecture Impact
### Backend
- `UsersModule` pilote les operations de lecture et mutation des profils.
- DTOs separes pour:
  - `UpdateProfileDto`
  - `UpdateProviderProfileDto`
  - `UpdateCompanyProfileDto`
- DTOs de reponse Swagger pour les profils prives/publics.
- RBAC sur les endpoints de sous-profils via `RolesGuard`.

### Frontend
- page `frontend/pages/dashboard/profile.vue`
- composants:
  - `frontend/components/profile/ProfileProviderForm.vue`
  - `frontend/components/profile/ProfileCompanyForm.vue`
- store Pinia `auth.store.ts` alimente la vue avec le profil courant enrichi
- types front centralises dans `frontend/types/auth.ts`

## 4. Database Design
### Tables concernees
- `users`
- `provider_profiles`
- `company_profiles`

### Relations
- `users 1 -> 0..1 provider_profiles`
- `users 1 -> 0..1 company_profiles`

### Contraintes / indexes
- `provider_profiles.userId` unique
- `company_profiles.userId` unique
- suppression en cascade depuis `users`

## 5. API Design
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | Retourne le profil courant enrichi |
| PATCH | `/api/users/me` | Met a jour les informations personnelles |
| POST | `/api/users/me/avatar` | Met a jour l'avatar |
| PATCH | `/api/users/me/provider-profile` | Cree ou met a jour le profil prestataire |
| PATCH | `/api/users/me/company-profile` | Cree ou met a jour le profil entreprise |
| GET | `/api/users/:id/profile` | Retourne un profil public nettoye |

## 6. Security Considerations
- Validation DTO stricte et normalisation des entrees (`trim`, numeric casting, URL validation).
- Protection par `JwtAuthGuard` sur les endpoints prives.
- Protection RBAC sur les endpoints de profils specialises.
- Sanitization centralisee pour ne jamais exposer `passwordHash` ni `refreshTokenHash`.
- Le profil public masque aussi les champs prives de compte.

## 7. Edge Cases
- utilisateur inexistant lors d'une mise a jour
- creation implicite d'un sous-profil via `upsert`
- tentative de creation de profil entreprise sans `companyName`
- upload d'avatar avec type ou taille de fichier invalide
- lecture publique d'un profil inexistant

## 8. Performance Considerations
- chargement du profil enrichi via un seul `include` Prisma
- `upsert` Prisma pour limiter les branches create/update cote service
- rehydratation front basee sur le store utilisateur existant plutot qu'une surcharge de requetes

## 9. Test Strategy
### Backend
- tests unitaires service sur sanitization, update profile, upsert provider, validation company profile
- tests controller sur `me` et `public profile`
- build Nest pour valider la compatibilite TypeScript stricte

### Frontend
- tests du store profile/auth et des types enrichis
- verification de la coherence des formulaires relies au store
- build Nuxt a reexecuter dans un contexte avec plus de marge de temps
