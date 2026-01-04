# Aquarium Backend API

URL de base : `http://localhost:3000`

## Authentification

### POST /auth/register
Objectif : Créer un compte utilisateur avec un rôle.
Entrée :
```json
{
  "email": "user@aquarium.local",
  "password": "user123",
  "role": "USER"
}
```
Sortie (201) :
```json
{
  "id": 3,
  "email": "user@aquarium.local",
  "role": "USER",
  "createdAt": "2025-02-01T12:00:00.000Z"
}
```
Codes :
- 201 : compte créé.
- 400 : email ou mot de passe manquant.
- 409 : email déjà utilisé.

### POST /auth/login
Objectif : Valider les identifiants et retourner le profil utilisateur.
Entrée :
```json
{
  "email": "admin@aquarium.local",
  "password": "admin123"
}
```
Sortie (200) :
```json
{
  "id": 1,
  "email": "admin@aquarium.local",
  "role": "ADMIN",
  "createdAt": "2025-02-01T12:00:00.000Z"
}
```
Codes :
- 200 : authentification réussie.
- 400 : email ou mot de passe manquant.
- 401 : identifiants invalides.

## Utilisateurs (admin)

Toutes les routes exigent le header `x-user-id` d'un admin.

### GET /users
Objectif : Lister tous les utilisateurs.
Entrée : aucune.
Sortie (200) :
```json
[
  {
    "id": 1,
    "email": "admin@aquarium.local",
    "role": "ADMIN",
    "createdAt": "2025-02-01T12:00:00.000Z"
  }
]
```
Codes :
- 200 : liste retournée.
- 401 : authentification requise.
- 403 : accès admin requis.

### GET /users/:id
Objectif : Récupérer un utilisateur par id.
Entrée : paramètre de chemin `:id`.
Sortie (200) :
```json
{
  "id": 2,
  "email": "user@aquarium.local",
  "role": "USER",
  "createdAt": "2025-02-01T12:00:00.000Z"
}
```
Codes :
- 200 : utilisateur retourné.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : utilisateur introuvable.

### PUT /users/:id
Objectif : Mettre à jour un utilisateur (profil ou rôle).
Entrée :
```json
{
  "email": "updated@aquarium.local",
  "password": "newpass",
  "role": "USER"
}
```
Sortie (200) :
```json
{
  "id": 2,
  "email": "updated@aquarium.local",
  "role": "USER",
  "createdAt": "2025-02-01T12:00:00.000Z"
}
```
Codes :
- 200 : utilisateur mis à jour.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : utilisateur introuvable.

### DELETE /users/:id
Objectif : Supprimer un utilisateur (les messages sont supprimés en cascade).
Entrée : paramètre de chemin `:id`.
Sortie (204) : corps vide.
Codes :
- 204 : utilisateur supprimé.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : utilisateur introuvable.

## Poissons

### GET /fish
Objectif : Lister les poissons, avec filtre optionnel par nom.
Entrée (query) : `?q=neon`.
Sortie (200) :
```json
[
  {
    "id": 1,
    "name": "Neon tetra",
    "description": "Petit poisson grégaire demandant une eau douce acide."
  }
]
```
Codes :
- 200 : liste retournée.

### GET /fish/:id
Objectif : Récupérer un poisson par id.
Entrée : paramètre de chemin `:id`.
Sortie (200) :
```json
{
  "id": 1,
  "name": "Neon tetra",
  "description": "Petit poisson grégaire demandant une eau douce acide."
}
```
Codes :
- 200 : poisson retourné.
- 400 : id invalide.
- 404 : poisson introuvable.

### POST /fish (admin)
Objectif : Créer une fiche poisson.
Entrée :
```json
{
  "name": "Guppy",
  "description": "Poisson vif et facile pour débuter."
}
```
Sortie (201) :
```json
{
  "id": 4,
  "name": "Guppy",
  "description": "Poisson vif et facile pour débuter."
}
```
Codes :
- 201 : poisson créé.
- 400 : données manquantes.
- 401 : authentification requise.
- 403 : accès admin requis.

### PUT /fish/:id (admin)
Objectif : Mettre à jour une fiche poisson.
Entrée :
```json
{
  "name": "Guppy",
  "description": "Description mise à jour."
}
```
Sortie (200) :
```json
{
  "id": 4,
  "name": "Guppy",
  "description": "Description mise à jour."
}
```
Codes :
- 200 : poisson mis à jour.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : poisson introuvable.

### DELETE /fish/:id (admin)
Objectif : Supprimer une fiche poisson.
Entrée : paramètre de chemin `:id`.
Sortie (204) : corps vide.
Codes :
- 204 : poisson supprimé.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : poisson introuvable.

## Articles

### GET /articles
Objectif : Lister les articles avec filtres optionnels.
Entrée (query) : `?q=cycle&status=PUBLISHED&fishId=1`.
Sortie (200) :
```json
[
  {
    "id": 1,
    "title": "Démarrer un aquarium planté",
    "content": "Choisir un sol nutritif...",
    "status": "PUBLISHED",
    "createdAt": "2025-02-01T12:00:00.000Z",
    "authorId": 1,
    "fishes": [
      {
        "articleId": 1,
        "fishId": 1,
        "fish": {
          "id": 1,
          "name": "Neon tetra",
          "description": "Petit poisson grégaire..."
        }
      }
    ]
  }
]
```
Codes :
- 200 : liste retournée.

### GET /articles/:id
Objectif : Récupérer un article et ses associations poisson.
Entrée : paramètre de chemin `:id`.
Sortie (200) : même format que dans la liste.
Codes :
- 200 : article retourné.
- 400 : id invalide.
- 404 : article introuvable.

### POST /articles (admin)
Objectif : Créer un article et associer des poissons.
Entrée :
```json
{
  "title": "Guide de cyclage",
  "content": "Lancer le cycle de l'azote...",
  "status": "DRAFT",
  "fishIds": [1, 2]
}
```
Sortie (201) : article avec relations `fishes`.
Codes :
- 201 : article créé.
- 400 : données manquantes.
- 401 : authentification requise.
- 403 : accès admin requis.

### PUT /articles/:id (admin)
Objectif : Mettre à jour un article et, si fourni, remplacer les associations.
Entrée :
```json
{
  "title": "Guide de cyclage",
  "status": "PUBLISHED",
  "fishIds": [1]
}
```
Sortie (200) : article mis à jour avec `fishes`.
Codes :
- 200 : article mis à jour.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : article introuvable.

### PUT /articles/:id/publish (admin)
Objectif : Publier un article.
Entrée : aucune.
Sortie (200) : article mis à jour avec `status: PUBLISHED`.
Codes :
- 200 : article publié.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : article introuvable.

### DELETE /articles/:id (admin)
Objectif : Supprimer un article.
Entrée : paramètre de chemin `:id`.
Sortie (204) : corps vide.
Codes :
- 204 : article supprimé.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : article introuvable.

## Associations Article ↔ Poisson

### POST /articles/:id/fish/:fishId (admin)
Objectif : Associer un poisson à un article.
Entrée : paramètres de chemin `:id` et `:fishId`.
Sortie (200) : article avec `fishes` mis à jour.
Codes :
- 200 : association créée.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : article ou poisson introuvable.
- 409 : association déjà existante.

### DELETE /articles/:id/fish/:fishId (admin)
Objectif : Retirer un poisson d'un article.
Entrée : paramètres de chemin `:id` et `:fishId`.
Sortie (200) : article avec `fishes` mis à jour.
Codes :
- 200 : association supprimée.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès admin requis.
- 404 : association introuvable.

## Messages

Toutes les routes exigent le header `x-user-id` de l'utilisateur cible ou d'un admin.

### GET /users/:id/messages
Objectif : Récupérer l'historique du tchat d'un utilisateur.
Entrée : paramètre de chemin `:id`.
Sortie (200) :
```json
[
  {
    "id": 1,
    "content": "Bonjour...",
    "senderRole": "USER",
    "createdAt": "2025-02-01T12:00:00.000Z",
    "userId": 2
  }
]
```
Codes :
- 200 : messages retournés.
- 400 : id invalide.
- 401 : authentification requise.
- 403 : accès interdit.
- 404 : utilisateur introuvable.

### POST /users/:id/messages
Objectif : Ajouter un message en tant qu'utilisateur ou admin.
Entrée :
```json
{
  "content": "Bonjour, j'ai une question..."
}
```
Sortie (201) :
```json
{
  "id": 3,
  "content": "Bonjour, j'ai une question...",
  "senderRole": "USER",
  "createdAt": "2025-02-01T12:00:00.000Z",
  "userId": 2
}
```
Codes :
- 201 : message créé.
- 400 : contenu manquant ou id invalide.
- 401 : authentification requise.
- 403 : accès interdit.
- 404 : utilisateur introuvable.

## Inbox admin

### GET /admin/messages/pending (admin)
Objectif : Lister le dernier message par utilisateur lorsque le dernier message vient d'un utilisateur.
Entrée : aucune.
Sortie (200) :
```json
[
  {
    "id": 5,
    "content": "Besoin d'aide...",
    "senderRole": "USER",
    "createdAt": "2025-02-01T12:00:00.000Z",
    "userId": 2,
    "user": {
      "id": 2,
      "email": "user@aquarium.local",
      "role": "USER",
      "createdAt": "2025-02-01T12:00:00.000Z"
    }
  }
]
```
Codes :
- 200 : liste retournée.
- 401 : authentification requise.
- 403 : accès admin requis.
