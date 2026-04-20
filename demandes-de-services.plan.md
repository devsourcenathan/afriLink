# Feature Plan: Demandes de services

## 1. Feature Overview
La feature `Demandes de services` permet aux entreprises de publier des besoins structures afin d'attirer des propositions de prestataires.

Elle joue le role de marketplace inverse: l'entreprise exprime un besoin, les prestataires decouvrent les demandes ouvertes et la suite du funnel sera prise en charge par la feature `Propositions`.

## 2. User Stories
- En tant qu'entreprise, je veux creer une demande afin de decrire mon besoin a des prestataires.
- En tant qu'entreprise, je veux modifier, publier ou annuler ma demande afin de garder mon besoin a jour.
- En tant que prestataire, je veux parcourir les demandes ouvertes afin d'identifier des opportunites.
- En tant que visiteur ou utilisateur, je veux consulter le detail d'une demande publique ouverte sans voir de donnees sensibles inutiles.

## 3. Architecture Impact
### Backend
- nouveau module `backend/src/requests`
- `RequestsController` expose:
  - creation
  - listing public
  - listing proprietaire
  - detail public
  - detail proprietaire
  - update
  - cancel
- `RequestsService` encapsule:
  - ownership checks
  - validation metier budget
  - filtrage public des demandes `OPEN`

### Frontend
- types:
  - `frontend/types/requests.ts`
  - `frontend/types/requests-enums.ts`
- composable:
  - `frontend/composables/useRequests.ts`
- store:
  - `frontend/stores/requests.store.ts`
- composants:
  - `frontend/components/requests/RequestCard.vue`
  - `frontend/components/requests/RequestForm.vue`
- pages publiques:
  - `frontend/pages/requests/index.vue`
  - `frontend/pages/requests/[id].vue`
- pages dashboard entreprise:
  - `frontend/pages/dashboard/requests/index.vue`
  - `frontend/pages/dashboard/requests/create.vue`
  - `frontend/pages/dashboard/requests/[id]/edit.vue`

## 4. Database Design
### Nouveau modele Prisma
- `ServiceRequest`

### Enums
- `RequestStatus`
- `RequestUrgency`

### Relations
- `service_requests.companyId -> users.id`
- `users.serviceRequests[]`

### Contraintes de lecture publique
- seules les demandes `OPEN` remontent dans le listing public
- seules les entreprises `ACTIVE` sont prises en compte

## 5. API Design
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requests` | Creer une demande |
| GET | `/api/requests` | Lister les demandes ouvertes |
| GET | `/api/requests/me` | Lister mes demandes |
| GET | `/api/requests/:id` | Detail public d'une demande ouverte |
| GET | `/api/requests/:id/me` | Detail proprietaire d'une demande |
| PATCH | `/api/requests/:id` | Modifier ma demande |
| DELETE | `/api/requests/:id` | Annuler ma demande |

### Query params listing public
- `q`
- `category`
- `urgency`
- `status`
- `minBudget`
- `maxBudget`
- `page`
- `limit`

## 6. Security Considerations
- creation / update / cancel reserves aux entreprises authentifiees
- verification de propriete avant mutation
- validation de coherence budget (`budgetMin <= budgetMax`)
- les endpoints publics n'exposent pas d'email ni de telephone entreprise
- annulation logique via `status = CANCELLED`

## 7. Edge Cases
- utilisateur non entreprise tentant de creer une demande
- demande introuvable
- demande d'un autre utilisateur modifiee par un non proprietaire
- demande `DRAFT`, `CANCELLED` ou `CLOSED` appelee via endpoint public
- budget min superieur au budget max

## 8. Performance Considerations
- pagination obligatoire sur le listing public
- `findMany` + `count` executes en parallele
- include Prisma reduit au strict necessaire pour l'entreprise emettrice
- tri par `createdAt desc` pour garder les demandes recentes visibles

## 9. Test Strategy
### Backend
- tests service sur create, findAll, findOne, update, cancel, ownership
- tests controller sur les endpoints principaux
- build Nest pour validation TypeScript
- regeneration Prisma client apres ajout du nouveau modele

### Frontend
- tests de routes/constants requests
- verification manuelle future des formulaires et parcours UI
- build Nuxt a reexecuter dans un contexte avec plus de marge de temps
