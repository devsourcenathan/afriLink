# Feature Plan: Profils utilisateurs

## 1. Feature Overview
Mise en place de la gestion complète des profils utilisateurs selon le rôle : `PRESTATAIRE` ou `ENTREPRISE`. 
Cela inclut l'ajout du modèle `CompanyProfile` pour les entreprises, la mise à jour des informations de base (nom, prénom, téléphone), et la gestion détaillée des profils spécifiques (bio, taux horaire, compétences pour les prestataires ; nom de l'entreprise, industrie, site web pour les entreprises).


## 2. User Stories
* En tant qu'utilisateur connecté, je veux voir mon profil public.
* En tant qu'utilisateur, je veux pouvoir modifier mes informations de base (nom, prénom, avatar, téléphone).
* En tant que Prestataire, je veux pouvoir modifier mon profil professionnel (bio, compétences, taux horaire, localisation, disponibilité).
* En tant qu'Entreprise, je veux pouvoir renseigner les détails de mon entreprise (nom de l'entreprise, description, site web, industrie, taille).
* En tant que visiteur ou utilisateur, je veux pouvoir consulter le profil complet d'un Prestataire ou d'une Entreprise.

## 3. Architecture Impact
### Backend (NestJS)
* **Prisma Schema** : Ajout du modèle `CompanyProfile` relié à `User`.
* **UsersModule** : 
  * Création/Mise à jour des profils spécifiques (`ProviderProfile` et `CompanyProfile`).
  * Endpoint pour récupérer le profil complet (incluant le profil spécifique selon le rôle).
  * Endpoint public `/users/:id/profile` pour récupérer un profil public.
* **DTOs** : `UpdateProviderProfileDto`, `UpdateCompanyProfileDto`.

### Frontend (Nuxt 3)
* **Pages** : 
  * `/dashboard/profile` : Affichage et modification du profil de l'utilisateur connecté (informations de base + formulaire spécifique au rôle).
  * `/providers/:id` ou `/users/:id` : Page publique pour voir le profil d'un prestataire/entreprise.
* **Composants** : `ProfileFormBasic`, `ProfileFormProvider`, `ProfileFormCompany`.
* **Store (Pinia)** : Mise à jour de `auth.ts` pour parser correctement le profil spécifique intégré au endpoint `/auth/me` ou `/users/me`.

## 4. Database Design (Prisma)
### Table `CompanyProfile` (Nouvelle)
```prisma
model CompanyProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName String
  description String?  @db.Text
  website     String?
  industry    String?
  size        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("company_profiles")
}
```
**Modification sur `User`** :
```prisma
model User {
  // ...
  companyProfile  CompanyProfile?
}
```

## 5. API Design
| Méthode | Endpoint | Description | Auth Requise |
|---|---|---|---|
| GET | `/users/me` | Récupère le profil basique + profil spécifique | AccessToken |
| PATCH | `/users/me` | Met à jour les infos de base (firstName, lastName, etc.) | AccessToken |
| POST | `/users/me/avatar` | Upload de l'avatar | AccessToken |
| PUT | `/users/me/provider-profile`| Met à jour/crée le `ProviderProfile` | AccessToken (PRESTATAIRE) |
| PUT | `/users/me/company-profile`| Met à jour/crée le `CompanyProfile` | AccessToken (ENTREPRISE) |
| GET | `/users/:id/profile` | Récupère le profil public complet (basique + spécifique) pour l'affichage | Non |

## 6. Security Considerations
* **Validation DTO** : `class-validator` strict sur les champs des profils (ex: regex url pour `website`, min/max pour `hourlyRate`).
* **Autorisations** : Vérifier que seul un `PRESTATAIRE` peut modifier un `ProviderProfile` et une `ENTREPRISE` un `CompanyProfile`.
* Les profils publics (via `/users/:id/profile`) ne doivent pas exposer d'informations sensibles (`passwordHash`, `refreshTokenHash`, `email` si non désiré).

## 7. Edge Cases
* L'utilisateur essaie de mettre à jour le profil d'un autre rôle. (=> `403 Forbidden`).
* Le profil spécifique n'existe pas encore lors d'un `PUT` => Création automatique par le service (Upsert).

## 8. Performance Considerations
* Utilisation de `.include()` dans Prisma pour récupérer le `User` et son sous-profil en une seule requête DB pour `/users/me`.

## 9. Test Strategy
### Backend
* **Unit** : 
  * Mock du PrismaService pour tester `upsertCompanyProfile` et `upsertProviderProfile`.
  * Vérification de sécurité des rôles.
* **Integration** : Test du flow Modification profil basique -> Modification profil spécifique via Supertest.

### Frontend
* Validation du formulaire avec Zod.
* Vérification conditionnelle de l'affichage du bon formulaire selon le `user.role` dans le store.
