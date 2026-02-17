# Export / Import de base (JSON)

Ce projet inclut maintenant 2 scripts:

- `npm run db:export -- <fichier.json>`
- `npm run db:import -- <fichier.json>`

Ils utilisent la variable `DATABASE_URL` du fichier `.env`.

## 1) Exporter la base source

Depuis `BackEnd`:

```bash
npm run db:export -- db-export.json
```

Fichier produit: `BackEnd/db-export.json`

## 2) Importer sur une autre installation

Sur la machine cible:

1. configure `BackEnd/.env` avec la nouvelle `DATABASE_URL`
2. applique le schéma:

```bash
npx prisma migrate deploy
```

3. importe les données:

```bash
npm run db:import -- db-export.json
```

## Important

- L'import **remplace** les données existantes (delete + recreate).
- Les IDs sont conservés.
- Les séquences auto-increment sont recalées après import.
