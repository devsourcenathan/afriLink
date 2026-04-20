# Feature Plan: Services

## 1. Feature Overview
La feature `Services` permet aux prestataires de publier des offres commerciales structurees avec titre, description, prix, delai, categorie, statut et tags.

Elle sert de couche marchande entre le profil prestataire et les futures features de demandes, commandes et paiements.

## 2. User Stories
- En tant que prestataire, je veux creer un service afin de rendre mon offre visible.
- En tant que prestataire, je veux modifier ou archiver un service afin de garder mon catalogue a jour.
- En tant qu'entreprise, je veux parcourir les services publies afin d'identifier une offre adaptee.
- En tant qu'entreprise, je veux filtrer les services par mot-cle, categorie et prix afin de comparer rapidement.
- En tant qu'administrateur ou equipe produit plus tard, je veux disposer d'un modele de service clair pour les futures fonctions de moderation.

## 3. Architecture Impact
### Backend
- nouveau module `backend/src/services`
- `ServicesController` expose CRUD + listing public + listing proprietaire
- `ServicesService` encapsule:
  - recherche publique
  - ownership checks
  - archivage logique via `status`
  - resolution du `ProviderProfile` du user courant
- DTOs:
  - `CreateServiceDto`
  - `UpdateServiceDto`
  - `SearchServicesDto`
  - `ServiceResponseDto`
  - `ServicesListResponseDto`

### Frontend
- composable `frontend/composables/useServices.ts`
- store `frontend/stores/services.store.ts`
- composants:
  - `frontend/components/services/ServiceCard.vue`
  - `frontend/components/services/ServiceForm.vue`
- pages publiques:
  - `frontend/pages/services/index.vue`
  - `frontend/pages/services/[id].vue`
- pages dashboard prestataire:
  - `frontend/pages/dashboard/services/index.vue`
  - `frontend/pages/dashboard/services/create.vue`
  - `frontend/pages/dashboard/services/[id]/edit.vue`

## 4. Database Design
### Tables / enums utilises
- `services`
- `provider_profiles`
- `users`
- enums:
  - `ServiceStatus`
  - `ServiceCategory`

### Relations
- `services.providerId -> provider_profiles.id`
- `provider_profiles.userId -> users.id`

### Contraintes de lecture publique
- seuls les services `PUBLISHED` sont visibles publiquement
- seul un prestataire `ACTIVE` peut voir ses services remonter dans le catalogue public

## 5. API Design
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/services` | Creer un service |
| GET | `/api/services` | Lister les services publies |
| GET | `/api/services/me` | Lister mes services |
| GET | `/api/services/:id` | Detail public d'un service publie |
| GET | `/api/services/:id/me` | Detail proprietaire d'un service |
| PATCH | `/api/services/:id` | Modifier mon service |
| DELETE | `/api/services/:id` | Archiver mon service |

### Query params listing public
- `q`
- `category`
- `minPrice`
- `maxPrice`
- `page`
- `limit`

## 6. Security Considerations
- endpoints mutation proteges par `JwtAuthGuard` + `RolesGuard(PRESTATAIRE)`
- verification de propriete sur update / archive / detail proprietaire
- archivage logique au lieu de suppression destructive
- les endpoints publics n'exposent que les informations utiles du prestataire
- validation DTO stricte pour creation, edition et recherche

## 7. Edge Cases
- utilisateur sans `ProviderProfile` qui tente de creer un service
- service introuvable
- service d'un autre prestataire modifie par un utilisateur non proprietaire
- service `DRAFT` ou `ARCHIVED` demande via endpoint public
- prestataire sans services sur `GET /services/me`

## 8. Performance Considerations
- pagination obligatoire sur le listing public
- `count` + `findMany` executes en parallele
- projection Prisma reduite sur le sous-objet `provider.user`
- filtrage Prisma compose sur statut, prix, categorie et recherche texte

## 9. Test Strategy
### Backend
- tests service sur create, findAll, findOne, update, archive, ownership
- tests controller sur tous les endpoints principaux
- build Nest pour compatibilite TypeScript
- regeneration Prisma client si le schema evolue

### Frontend
- tests de routes/constants pour le socle services
- validation manuelle future des formulaires et parcours UI
- build Nuxt a reexecuter dans un contexte avec plus de marge de temps
