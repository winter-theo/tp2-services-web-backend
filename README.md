# TP - Aquarium App (BackEnd + FrontEnd)

Application full-stack avec:
- **BackEnd**: Node.js, Express, Prisma, PostgreSQL
- **FrontEnd**: React + Vite
- **Auth**: JWT

Ce guide permet à un autre développeur d'installer le projet et de lancer une version fonctionnelle en local.

## 1. Prérequis

- Node.js 18+ (recommandé: Node 20 LTS)
- npm 9+
- Accès à une base PostgreSQL

## 2. Cloner le dépôt

```bash
git clone <URL_DU_REPO>
cd TP3
```

## 3. Configuration BackEnd

### 3.1 Installer les dépendances

```bash
cd BackEnd
npm install
```

### 3.2 Créer le fichier d'environnement

Créer `BackEnd/.env` avec:

```env
DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require'
JWT_SECRET='change-this-secret-in-production'
```

Optionnel:

```env
JWT_EXPIRES_IN='1h'
```

### 3.3 Appliquer le schéma Prisma

```bash
npx prisma migrate deploy
```

### 3.4 Importer les données de référence

Le fichier `BackEnd/db-export.json` est versionné pour permettre le bootstrap.

```bash
npm run db:import -- db-export.json
```

## 4. Configuration FrontEnd

### 4.1 Installer les dépendances

Dans un autre terminal:

```bash
cd FrontEnd
npm install
```

Le FrontEnd utilise un proxy Vite vers le BackEnd (`/api -> http://localhost:3000`).

## 5. Lancer l'application

### Terminal 1 - BackEnd

```bash
cd BackEnd
npm run dev
```

Attendu: `API listening on port 3000`

### Terminal 2 - FrontEnd

```bash
cd FrontEnd
npm run dev
```

Attendu: URL locale Vite, en général `http://localhost:5173`

## 6. URLs utiles

- Public:
  - `http://localhost:5173/articles`
  - `http://localhost:5173/fish`
  - `http://localhost:5173/about`
- Auth:
  - `http://localhost:5173/login`
  - `http://localhost:5173/register`
- Backoffice (après login):
  - `http://localhost:5173/dashboard`
  - `http://localhost:5173/admin`
  - `http://localhost:5173/admin/articles`
  - `http://localhost:5173/admin/fish`

## 7. Scripts utiles

Dans `BackEnd`:

- `npm run dev` : lancer l'API en dev
- `npm run build` : build TypeScript
- `npm run db:export -- <fichier.json>` : exporter la DB
- `npm run db:import -- <fichier.json>` : importer la DB (remplace les données)

Dans `FrontEnd`:

- `npm run dev` : lancer l'app React
- `npm run build` : build production
- `npm run preview` : prévisualiser le build

## 8. Dépannage rapide

- Erreur DB au démarrage BackEnd:
  - vérifier `BackEnd/.env` et `DATABASE_URL`
  - vérifier l'accès réseau à PostgreSQL
- Pas de données en local:
  - exécuter `npm run db:import -- db-export.json` dans `BackEnd`
- Erreur dépendances FrontEnd:
  - relancer `npm install` dans `FrontEnd`
- Auth ne fonctionne pas:
  - vérifier `JWT_SECRET` dans `BackEnd/.env`

## 9. Note équipe

Le fichier `BackEnd/db-export.json` est conservé dans le dépôt pour simplifier le bootstrap d'une nouvelle installation.
