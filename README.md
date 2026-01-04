# Backend – Services Web (TP2)

Projet réalisé dans le cadre du laboratoire 2 du cours 420-941 – Services Web.

Ce projet est une API REST développée avec Node.js, Express et TypeScript. Le backend est connecté à une base de données PostgreSQL hébergée sur Neon et respecte l’architecture MVC demandée dans l’énoncé du laboratoire.

## Technologies
Node.js, Express.js, TypeScript, PostgreSQL (Neon), Prisma, Postman.

## Structure du projet
src/controllers  
src/models  
src/routes  
src/prisma/migrations  
src/index.ts  

## Prérequis
Node.js (version 18 ou 20 LTS) et npm.

## Installation
```bash
npm install
```

## Base de données
La base de données PostgreSQL est déjà créée et hébergée sur Neon.  
La connexion est configurée via le fichier `.env` inclus dans le projet.

Avant de lancer le serveur, le client Prisma doit être généré localement :
```bash
npx prisma generate
```

## Lancement
```bash
npm run dev
```

## Tests
Les endpoints ont été testés avec Postman. Les requêtes de test sont disponibles dans le dossier `/postman`.
