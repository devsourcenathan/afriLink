# Feature Plan: Prestataires

## 1. Feature Overview
La fonctionnalité "Prestataires" correspond à l'annuaire (Directory) public ou semi-public permettant aux entreprises (et autres visiteurs selon les droits) de rechercher, filtrer et consulter les fiches détaillées des prestataires de services inscrits sur la plateforme.

## 2. User Stories
* En tant qu'Entreprise, je veux pouvoir parcourir la liste de tous les prestataires disponibles.
* En tant qu'Entreprise, je veux pouvoir filtrer les prestataires par mots-clés (compétences), localisation, taux horaire ou disponibilité.
* En tant qu'Entreprise, je veux pouvoir cliquer sur un prestataire pour voir son profil complet (bio, détails, portfolio potentiel futur).
* En tant que Prestataire, je veux que mon profil public soit visible et bien formaté pour attirer des clients.

## 3. Architecture Impact
### Backend (NestJS)
* **UsersController / ProvidersController** : Création d'un endpoint spécialisé `GET /providers` (ou `GET /users?role=PRESTATAIRE`) qui gère la pagination, le tri et la recherche multi-critères (via Prisma).
* **UsersService** : Implémentation de la fonction de recherche avancée avec `Prisma.UserFindManyArgs` :
  * Filtrage sur `users.status === 'ACTIVE'`
  * Filtrage sur les champs de la relation `providerProfile` (skills, location, etc.).

### Frontend (Nuxt 3)
* **Pages** :
  * `/dashboard/search` (ou `/prestataires`) : Page listant les cartes des prestataires avec filtres latéraux/supérieurs.
  * `/prestataires/[id]` : Page affichant le détail du profil public d'un prestataire.
* **Composants** :
  * `ProviderCard` : Un composant UI pour afficher le résumé d'un prestataire.
  * `ProviderFilters` : Formulaire de filtres (recherche texte, select de localisation, range de prix).
* **API Route** : Ajout à `constants/api.routes.ts`.

## 4. Database Design (Prisma)
Aucun changement majeur du schéma Prisma nécessaire car la structure `User` -> `ProviderProfile` a été mise en place dans l'Étape 2.

## 5. API Design
| Méthode | Endpoint | Description | Auth Requise |
|---|---|---|---|
| GET | `/api/providers` | Retourne la liste paginée et filtrée des prestataires (rôle PRESTATAIRE, statut ACTIVE). Queries : `q` (search), `location`, `minRate`, `maxRate`, `skills`, `page`, `limit`. | Oui (ou Non selon réglage public) |
| GET | `/api/providers/:id` | Retourne les infos publiques d'un prestataire spécifique (similaire à `/users/:id/profile`). | Non |

## 6. Security & Performance
* L'endpoint de listing doit implémenter la **pagination obligatoirement** (limit/offset) pour ne pas crasher la BDD en cas de fort trafic ou grand nombre d'inscrits.
* Ne pas exposer l'email, le téléphone directement sur la liste (seulement sur le profil si autorisé, ou via le système de messagerie/demande).
* Indexation BDD : s'assurer des alias sur `ProviderProfile.location` et potentiellement `skills` (PostgreSQL supporte des GIN index sur array, mais prisma gère la recherche array par `has`).

## 7. Edge Cases
* Aucun prestataire trouvé -> Afficher un empty state "Aucun prestataire ne correspond à vos critères."
* Prestataire `SUSPENDED` ou `INACTIVE` -> Il ne doit pas apparaitre dans l'annuaire.

## 8. Test Strategy
* Backend : Test e2e de l'endpoint de recherche avec divers query params pour vérifier la composition Prisma.
* Frontend : S'assurer que le rechargement des datas ne clique pas ou gère l'état de "loading" avec des skeletons.
