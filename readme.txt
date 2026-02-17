IMPORT / EXPORT DE LA BASE (BackEnd)
====================================

Prerequis
---------
1) Aller dans le dossier BackEnd:
   cd /Users/michelwinter/Theo/service-web-s3/TP3-v1/BackEnd

2) Verifier que le fichier .env contient une DATABASE_URL valide.

3) Installer les dependances si besoin:
   npm install


EXPORT (base source)
--------------------
Commande:
   npm run db:export -- db-export.json

Resultat:
- Un fichier BackEnd/db-export.json est cree.
- Il contient les utilisateurs, poissons, articles, messages et liens article-poisson.


IMPORT (base cible)
-------------------
1) Sur la machine/projet cible, configurer BackEnd/.env avec la DATABASE_URL cible.

2) Appliquer le schema Prisma:
   npx prisma migrate deploy

3) Copier le fichier d'export (db-export.json) dans le dossier BackEnd de la cible.

4) Lancer l'import:
   npm run db:import -- db-export.json


IMPORTANT
---------
- L'import remplace les donnees existantes (suppression puis recreation).
- Les IDs sont conserves.
- Les sequences auto-increment sont recalees apres import.


Commandes rapides (resume)
--------------------------
Source:
   npm run db:export -- db-export.json

Cible:
   npx prisma migrate deploy
   npm run db:import -- db-export.json
