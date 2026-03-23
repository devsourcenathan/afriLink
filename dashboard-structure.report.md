# Feature Report: Dashboard Structure

## Summary
La structure générale du tableau de bord (Dashboard) a été refactorisée pour fournir une navigation unifiée et intuitive, avec une barre latérale conditionnelle (selon le rôle) et un en-tête global.

## Frontend Implementation
* **Layouts** (`layouts/dashboard.vue`) : Remplacé le simple `<slot />` par un squelette d'interface administrateur moderne, constitué d'une Sidebar gauche et d'une section principale sur la droite (Header + Contenu).
* **Sidebar** (`components/dashboard/Sidebar.vue`) : 
  * Affiche des liens de navigation dynamiques grâce au `authStore`.
  * Rendu conditionnel des liens `PRESTATAIRE` (Mes Services, Demandes reçues) et `ENTREPRISE` (Rechercher, Mes Projets).
* **Header** (`components/dashboard/Header.vue`) : 
  * Ajout d'un menu déroulant de profil utilisateur.
  * Centralise le système de déconnexion (`handleLogout`) pour tout le dashboard.
* **Pages** :
  * `pages/dashboard/index.vue` : Simplifiée pour utiliser le nouveau composant Header gérant la déconnexion, tout en conservant son contenu natif (Profile Overview et Recent Activity).

## Next Steps
* Vérifier le comportement responsive et ajouter un bouton de bascule (hamburger menu) de la Sidebar sur mobile si l'application est consultée sur petit format.
* Passer à la **Feature 3 : Prestataires** !
