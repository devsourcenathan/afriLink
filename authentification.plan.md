# Feature Plan: Authentification

## 1. Feature Overview
La feature Authentification couvre l'inscription, la connexion, la rotation des JWT, la deconnexion, la verification email et la reinitialisation de mot de passe pour les roles `ENTREPRISE`, `PRESTATAIRE` et `ADMIN`.

L'objectif produit est de fournir un socle d'acces fiable pour toutes les features suivantes, avec des contrats API clairs, des reponses fortement typees, une sanitization systematique des utilisateurs et une experience frontend coherente entre Nuxt 3, Pinia et la REST API NestJS.

## 2. User Stories
- En tant que visiteur, je veux creer un compte entreprise ou prestataire afin d'acceder a la plateforme.
- En tant qu'utilisateur, je veux me connecter avec mon email et mon mot de passe afin d'acceder a mon dashboard.
- En tant qu'utilisateur, je veux rester connecte via un refresh token afin d'eviter des reconnexions trop frequentes.
- En tant qu'utilisateur, je veux verifier mon email afin d'activer mon compte.
- En tant qu'utilisateur, je veux reinitialiser mon mot de passe si je l'oublie.
- En tant qu'administrateur, je veux que les acces futurs soient gouvernes par les roles afin de proteger les zones sensibles.

## 3. Architecture Impact
### Backend Modules
- `AuthModule`: orchestration des flux register, login, refresh, logout, verify-email, forgot-password, reset-password.
- `UsersModule`: creation, lecture et sanitization de l'utilisateur authentifie.
- `MailModule`: envoi des emails de verification et de reinitialisation via Resend.
- `PrismaModule`: persistence des utilisateurs et tokens applicatifs.

### Frontend Pages
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-email`

### Frontend Components / Logic
- `stores/auth.store.ts`: etat auth, cookies, session courante.
- `plugins/api.ts`: injection du bearer token et tentative de refresh sur `401`.
- `plugins/auth.ts`: rehydratation de session a froid.
- `middleware/auth.ts` et `middleware/guest.ts`: protection d'acces.

## 4. Database Design
### Tables impliquees
- `users`
- `tokens`

### Relations
- `users 1 -> n tokens`

### Contraintes et index
- `users.email` unique
- index sur `users.email`
- index sur `users.role`
- index sur `users.status`
- `tokens.token` unique
- index sur `tokens.userId`
- index sur `tokens.token`

### Types / enums utilises
- `UserRole`
- `UserStatus`
- `TokenType`

## 5. API Design
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription + emission des tokens + generation du token de verification |
| POST | `/api/auth/login` | Connexion + emission des tokens |
| POST | `/api/auth/refresh` | Regeneration access/refresh token |
| POST | `/api/auth/logout` | Invalidation du refresh token stocke |
| GET | `/api/auth/me` | Profil courant sanitize |
| POST | `/api/auth/forgot-password` | Demande d'email de reset |
| POST | `/api/auth/reset-password` | Mise a jour du mot de passe via token |
| POST | `/api/auth/verify-email` | Activation de l'email via token |

## 6. Security Considerations
- Hash des mots de passe avec `bcrypt`.
- JWT access et refresh separes, refresh token hash en base.
- Validation DTO stricte via `ValidationPipe` global, `class-validator` et `class-transformer`.
- Sanitization centralisee des champs sensibles utilisateur.
- `helmet` + CORS restreint + throttling global Nest.
- RBAC deja pret via guards/decorators pour les futures routes protegees.
- Protection CSRF basee sur l'usage d'un bearer token explicite dans l'en-tete `Authorization`.

## 7. Edge Cases
- Reinscription avec un email existant.
- Connexion d'un compte `SUSPENDED` ou `INACTIVE`.
- Token de verification ou de reset invalide / expire.
- Multiples demandes de reset ou verification: suppression des anciens tokens applicatifs du meme type avant emission d'un nouveau.
- Rehydratation frontend apres refresh de page avec access token encore valide ou via refresh token.

## 8. Performance Considerations
- Requetes Prisma simples et indexees sur les champs critiques.
- Suppression ciblee des anciens tokens par type pour eviter l'accumulation.
- Rehydratation frontend limitee a un appel utilisateur quand une session existe deja.
- Contrats API compacts pour limiter le sur-transfert des donnees sensibles.

## 9. Test Strategy
### Backend
- Tests unitaires du `AuthService`.
- Tests controller pour verifier le wiring de l'API Auth.
- Verification de build Nest pour valider la compatibilite TypeScript/Nest.

### Frontend
- Tests du store Auth et des constantes de routes.
- Verification de la configuration Vitest sans dependance implicite manquante.
- Build Nuxt a executer avec timeout plus large si l'environnement CI local reste lent.
