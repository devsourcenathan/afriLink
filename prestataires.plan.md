# Feature Plan: Prestataires

## 1. Feature Overview
La feature `Prestataires` fournit l'annuaire public des prestataires actifs de la plateforme avec recherche, filtrage, pagination et consultation d'une fiche detaillee.

Elle doit servir de socle de decouverte pour les entreprises avant les features `Services`, `Demandes` et `Commandes`.

## 2. User Stories
- En tant qu'entreprise, je veux parcourir les prestataires disponibles afin de trouver un profil adapte a mon besoin.
- En tant qu'entreprise, je veux filtrer par mots-cles, competences, localisation et tarif afin de gagner du temps.
- En tant que visiteur, je veux consulter la fiche publique d'un prestataire sans voir d'informations sensibles.
- En tant que prestataire, je veux que ma fiche publique presente clairement mon profil professionnel.

## 3. Architecture Impact
### Backend
- `ProvidersController` expose:
  - le listing public pagine
  - la fiche publique detaillee
  - les endpoints `me/profile` pour le prestataire connecte
- `ProvidersService` encapsule:
  - la composition Prisma des filtres
  - la pagination
  - la lecture d'un profil detaille sans champs prives
- DTOs dedies:
  - `SearchProvidersDto`
  - `ProviderSummaryDto`
  - `ProviderDetailDto`
  - `ProvidersListResponseDto`

### Frontend
- page catalogue publique: `frontend/pages/providers/index.vue`
- page detail: `frontend/pages/providers/[id].vue`
- compatibilite legacy: redirection de `frontend/pages/prestataires/[id].vue`
- composant reusable: `frontend/components/providers/ProviderCard.vue`
- types centralises: `frontend/types/providers.ts`

## 4. Database Design
### Tables concernees
- `provider_profiles`
- `users`

### Relations exploitees
- `provider_profiles.userId -> users.id`

### Contraintes de selection
- n'afficher que les prestataires:
  - `users.role = PRESTATAIRE`
  - `users.status = ACTIVE`
  - `provider_profiles.availability != UNAVAILABLE`

## 5. API Design
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/providers` | Liste paginee et filtree des prestataires publics |
| GET | `/api/providers/:id` | Detail public d'un prestataire |
| GET | `/api/providers/me/profile` | Profil prestataire du user connecte |
| POST | `/api/providers/me/profile` | Creation / mise a jour du profil prestataire |

### Query params listing
- `q`
- `skills[]`
- `location`
- `minRate`
- `maxRate`
- `page`
- `limit`

## 6. Security Considerations
- Les endpoints publics ne retournent pas `email` ni `phone`.
- Les endpoints `me/profile` restent proteges par JWT + RBAC.
- Validation DTO stricte sur les filtres et updates provider.
- Pagination obligatoire avec borne max sur `limit`.
- Correction de l'ordre des routes Nest pour eviter que `:id` intercepte `me/profile`.

## 7. Edge Cases
- aucun prestataire trouve
- prestataire inexistant
- prestataire inactif ou suspendu non visible dans l'annuaire
- `skills` transmis sous forme string unique ou array
- `minRate` / `maxRate` absents ou partiellement renseignes

## 8. Performance Considerations
- pagination Prisma avec `skip/take`
- `count` et `findMany` executes en parallele
- projection limitee du sous-objet `user`
- tri stable par `hourlyRate`

## 9. Test Strategy
### Backend
- tests service sur:
  - filtrage avancé
  - metadonnees de pagination
  - absence de donnees privees
  - create/update provider profile
- tests controller sur:
  - passage des DTOs de recherche
  - fiche detaillee
  - endpoints `me/profile`
- build Nest pour validation TypeScript

### Frontend
- verification des routes providers dans les tests existants
- validation du typage du contrat front `providers.ts`
- build Nuxt a reexecuter dans un contexte avec plus de marge de temps
