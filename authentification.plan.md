# Feature Plan: Authentification

## 1. Feature Overview
Mise en place d'un système d'authentification complet, sécurisé et robuste pour la plateforme SaaS. Cela inclut l'inscription, la connexion, la gestion des sessions via JWT (Access + Refresh tokens), la récupération de mot de passe, la vérification par email, et la protection des routes par rôles (RBAC).

## 2. User Stories
* En tant que visiteur (Entreprise ou Prestataire), je veux m'inscrire pour créer un compte.
* En tant qu'utilisateur, je veux recevoir un email de confirmation pour valider mon compte.
* En tant qu'utilisateur, je veux me connecter avec mon email et mot de passe.
* En tant qu'utilisateur, je veux pouvoir réinitialiser mon mot de passe si je l'oublie (via un lien reçu par email).
* En tant qu'utilisateur, je veux que ma session reste active sans avoir à me reconnecter en permanence (via refresh token).
* En tant qu'utilisateur, je veux pouvoir me déconnecter en toute sécurité (invalidation des sessions).
* En tant qu'administrateur, je veux que l'accès aux interfaces administrateur soit restreint à mon rôle.

## 3. Architecture Impact
### Backend (NestJS)
* **AuthModule** : Logique de connexion, JWT, hachage.
* **UsersModule** : Création et récupération des utilisateurs (appelé par AuthModule).
* **MailModule** : Envoi des emails transactionnels (Resend).
* **Guards/Strategies** : `JwtAuthGuard`, `LocalAuthGuard`, `JwtRefreshGuard`, `RolesGuard`.

### Frontend (Nuxt 3)
* **Pages** : `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.
* **Store (Pinia)** : `useAuthStore` pour persister le token JWT en mémoire et le user context.
* **Middleware** : `auth.global.ts` pour rediriger entre les espaces publics et privés.
* **Plugin (ofetch)** : Intercepteur global pour gérer le Refresh Token automatique sur 401.

## 4. Database Design (Prisma)
### Table `User`
```prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  passwordHash     String
  role             Role      @default(PRESTATAIRE)
  isEmailVerified  Boolean   @default(false)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  // Relations futures
  tokens           Token[]
}

enum Role {
  ENTREPRISE
  PRESTATAIRE
  ADMIN
}
```

### Table `Token` (Refresh Tokens & Reset Tokens)
```prisma
model Token {
  id        String   @id @default(uuid())
  token     String   @unique
  type      TokenType
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

enum TokenType {
  REFRESH
  RESET_PASSWORD
  VERIFY_EMAIL
}
```

## 5. API Design
| Méthode | Endpoint | Description | Auth Requise |
|---|---|---|---|
| POST | `/auth/register` | Création de compte + Envoi d'email | Non |
| POST | `/auth/login` | Connexion (retourne Access + Refresh Token) | Non |
| POST | `/auth/refresh` | Renouvellement de l'Access Token via Refresh Token | RefreshToken |
| POST | `/auth/logout` | Invalidation du Refresh Token | Oui |
| POST | `/auth/verify-email` | Validation du compte via token | Non |
| POST | `/auth/forgot-password`| Demande de réinitialisation de mot de passe | Non |
| POST | `/auth/reset-password` | Réinitialisation effective du mot de passe | Non |
| GET | `/auth/me` | Récupération du profil courant | AccessToken |

## 6. Security Considerations
* **Mots de passe** : Hachage avec `bcrypt` (salt rounds: 10).
* **JWT** : 
  * Access Token : Courte durée de vie (ex: 15 minutes).
  * Refresh Token : Stocké en base ("rotation" recommandée) ou cookie sécurisé (`HttpOnly`, `Secure`, `SameSite=Strict`), durée de vie plus longue (ex: 7 jours).
* **Protection Routes** : Stratégie stricte via `RBAC` (Role-Based Access Control). L'accès aux endpoints est vérouillé par défaut (`@UseGuards(JwtAuthGuard)`).
* **Rate Limiting** : Strict sur `/auth/login` et `/auth/forgot-password` pour prévenir les attaques par force brute (ex: Max 5 tentatives par IP par minute).
* **Validation (XSS/SQLi)** : Utilisation de `class-validator` et `class-transformer` sur tous les DTOs backend. Prisma protège naturellement de base contre les injections SQL.

## 7. Edge Cases
* L'utilisateur demande plusieurs fois un email de vérification (gestion du spam -> cooldown rate limit).
* L'utilisateur clique sur un lien de Reset Password expiré -> Message d'erreur clair "Lien expiré, veuillez refaire une demande".
* Un utilisateur essaie de s'inscrire avec un email déjà existant -> Renvoie un message générique ou une erreur "Email déjà pris" selon la politique produit.
* La révocation manuelle des accès : si l'admin bloque un compte, ses Refresh Tokens doivent être supprimés en base (le forçant à être déconnecté).

## 8. Performance Considerations
* Indexation en base de données sur `email` (déjà géré par `@unique`) et sur la table `Token(token)`.
* Côté frontend, le chargement initial ne doit pas être bloqué par la requête `/auth/me` si ce n'est pas nécessaire, mais plutôt hydrater le state côté SSR si possible (via useCookie pour le token).

## 9. Test Strategy
### Backend (Unit & Integration)
* **Unit** : Test du `AuthService` (validation de mot de passe, génération de token).
* **Integration (e2e)** : Flow complet inscription -> login -> refresh -> accès route protégée.

### Frontend
* **Composants critiques** : `LoginForm.vue` et `RegisterForm.vue` (validation des inputs).
* Mock global d'API (ex: via MSW) pour tester le comportement du store Pinia sans taper le vrai backend.
