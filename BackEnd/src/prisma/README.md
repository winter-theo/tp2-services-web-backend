# Organisation du repertoire Prisma

Ce dossier regroupe la configuration Prisma, le client d acces a la base et les migrations associees.

## Fichiers

- `client.ts` : initialise et exporte une instance unique de `PrismaClient` pour etre reutilisee dans l application.
- `schema.prisma` : schema Prisma (datasource, generator, enums et models) qui definit la structure de la base.
- `seed.ts` : script de peuplement des donnees de base (utilisateurs, poissons, articles, messages) et nettoyage prealable.

## Dossier `migrations/`

Ici, "migration" designe une evolution controlee du schema de la base de donnees.
Chaque migration capture une etape (creation de tables, ajout de colonnes, relations, indexes, etc.)
et permet de reproduire le schema de facon fiable entre environnements.
Elles sont generees par Prisma en dev (par exemple avec `prisma migrate dev`).

Les migrations sont organisees par dossiers horodates. Chaque dossier contient un `migration.sql`
qui applique les changements de schema.

- `migrations/20251223204206_init/migration.sql` : migration initiale.
- `migrations/20251223214610_init_e/migration.sql` : migration suivante ajoutee apres l init.
- `migrations/migration_lock.toml` : verrou Prisma indiquant le provider et l etat des migrations.

## Synthese (questions frequentes)

- Les migrations construisent le schema de la base (structure) a partir de `schema.prisma`, pas les donnees.
- `seed.ts` remplit la base en donnees initiales, sans modifier la structure.
- En dev "jetable", on peut recreer la base via `prisma db push` sans utiliser les migrations.
- En production, les migrations restent importantes pour garder l historique et appliquer les changements sans perte.
- Les outils Prisma sont lances via npm (scripts `package.json`), pas par Express directement.
- npm fait partie de l ecosysteme Node.js et sert a lancer ces scripts.

## npm (contexte)

npm est le gestionnaire de paquets de Node.js. Il installe les dependances et
permet d executer des commandes definies dans `package.json` (par exemple celles
qui appellent Prisma).
Il sert aussi a lancer des commandes via `npm run ...`, en se basant sur les scripts definis dans package.json.
Les scripts à lancer doivent se trouver dans `node_modules/.bin`

