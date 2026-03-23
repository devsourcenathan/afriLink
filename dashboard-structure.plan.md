# Dashboard Structure Refactoring Plan

## 1. Feature Overview
Refonte de la structure visuelle globale du tableau de bord (`layout: 'dashboard'`). L'objectif est de fournir une interface utilisateur unifiée, avec une barre latérale (Sidebar) dynamique et conditionnelle selon le rôle (`ENTREPRISE`, `PRESTATAIRE`, `ADMIN`), et un en-tête (Topbar) contenant le contrôle de profil et la déconnexion.

## 2. User Stories
* En tant qu'utilisateur, je veux avoir une vue d'ensemble avec un menu de navigation clair (sidebar) lorsque j'entre dans la zone `/dashboard`.
* En tant qu'Entreprise, je veux voir dans mon menu : Dashboard, Trouver un prestataire, Mes Projets, Messagerie, Profil.
* En tant que Prestataire, je veux voir : Dashboard, Mes Services, Demandes reçues, Messagerie, Profil.
* En tant qu'utilisateur, je veux pouvoir me déconnecter facilement depuis la barre supérieure.

## 3. Architecture Impact
### Frontend (Nuxt 3)
* **Layouts** : 
  * Refonte de `layouts/dashboard.vue` pour y inclure un _Sidebar Component_ et un _Header Component_.
* **Components** :
  * Création de `components/dashboard/Sidebar.vue` (navigation dynamique selon `user.role`).
  * Création de `components/dashboard/Header.vue` (profil, bouton déconnexion géré via Pinia).
* **Pages** :
  * Refonte légère de `pages/dashboard/index.vue` pour vérifier l'intégration visuelle.
  * Suppression de code redondant de déconnexion dans `index.vue` (qui va migrer vers le Header).

## 4. API & Database
Aucun impact backend, c'est purement une restructuration de l'UI frontend existante en utilisant Nuxt UI et Tailwind.

## 5. Security & Edge Cases
* L'accès au layout de dashboard vérifiera toujours que l'utilisateur est connecté (middleware `auth` déjà en place).
* Si le rôle n'est pas reconnu ou non défini, le menu de fallback s'affichera (juste Profil et Déconnexion par sécurité).

## 6. Test Strategy
* Vérification visuelle en se connectant en tant que `PRESTATAIRE`. (Observation des menus spécifiques).
* Vérification visuelle en se connectant en tant qu'`ENTREPRISE`. (Observation des menus spécifiques).
* Test que la navigation sur mobiles s'adapte (menu hamburger ou sidebar rétractable si possible avec Nuxt UI, sinon layout fluide basique).
