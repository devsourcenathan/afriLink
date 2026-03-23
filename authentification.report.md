# Feature Report: Authentification (Backend)

## Summary
La partie Backend de l'authentification a été implémentée avec succès. Elle gère l'inscription, la connexion, l'accès basé sur les rôles (RBAC), la génération de tokens JWT (Access et Refresh Tokens), la demande de réinitialisation de mot de passe, ainsi que la vérification des e-mails.

## Backend Implementation
* **AuthModule** complété avec les nouvelles méthodes (`forgotPassword`, `resetPassword`, `verifyEmail`).
* **UsersModule** existant revu pour supporter ces opérations.
* **MailModule** créé : Intégration de `resend` pour l'envoi d'emails transactionnels (vérification & reset).

## Database Changes
* Ajout du modèle `Token` (pour stocker temporairement les tokens de réinitialisation et de vérification d'email).
* Exécution de la migration Prisma correspondante (`token_model`).

## API Documentation
L'API est documentée via Swagger (`/api/docs`).

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Créer un compte & envoie l'email de confirmation |
| `/api/auth/login` | POST | Se connecter & obtenir les JWTS |
| `/api/auth/refresh` | POST | Renouveler le token d'accès |
| `/api/auth/me` | GET | Obtenir le profil |
| `/api/auth/logout` | POST | Invalider la session |
| `/api/auth/forgot-password` | POST | Demande un lien de reset |
| `/api/auth/reset-password` | POST | Validation du nouveau mot de passe |
| `/api/auth/verify-email` | POST | Validation de l'email de l'utilisateur |

## Security Review
* Mots de passe hashés avec `bcrypt`.
* JWT Access (15m) + Refresh Token (7j) vérifiés.
* Endpoints de session sécurisés par `JwtAuthGuard`.
* Utilisation globale de `Helmet`, `ValidationPipe` (class-validator stricte) et de `Throttler` (Rate Limiting).

## Technical Debt / Next Steps
* Les URLs de l'app frontend pour les emails sont définies dans les variables d'environnement (`FRONTEND_URL`). Il faudra s'assurer qu'elles sont correctes en prod.
* **Étape suivante** : Implémenter le Frontend (Pages Nuxt, Store Pinia, etc.) pour interagir avec ces nouvelles APIs.
