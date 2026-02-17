const fs = require("fs/promises");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetSequences() {
  const tables = ["User", "Fish", "Article", "Message"];

  for (const table of tables) {
    const query = `
      SELECT setval(
        pg_get_serial_sequence('"${table}"', 'id'),
        COALESCE((SELECT MAX(id) FROM "${table}"), 1),
        COALESCE((SELECT MAX(id) FROM "${table}"), 0) > 0
      );
    `;
    await prisma.$executeRawUnsafe(query);
  }
}

async function main() {
  const inputArg = process.argv[2] || "db-export.json";
  const inputPath = path.resolve(process.cwd(), inputArg);
  const raw = await fs.readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw);

  if (!parsed || parsed.format !== "aquarium-db-export-v1" || !parsed.data) {
    throw new Error("Format de fichier d'export invalide.");
  }

  const { users, fish, articles, messages, articleFish } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.articleFish.deleteMany();
    await tx.message.deleteMany();
    await tx.article.deleteMany();
    await tx.fish.deleteMany();
    await tx.user.deleteMany();

    if (Array.isArray(users) && users.length > 0) {
      await tx.user.createMany({
        data: users.map((item) => ({
          id: item.id,
          email: item.email,
          passwordHash: item.passwordHash,
          role: item.role,
          createdAt: new Date(item.createdAt),
        })),
      });
    }

    if (Array.isArray(fish) && fish.length > 0) {
      await tx.fish.createMany({
        data: fish.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        })),
      });
    }

    if (Array.isArray(articles) && articles.length > 0) {
      await tx.article.createMany({
        data: articles.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          status: item.status,
          createdAt: new Date(item.createdAt),
          authorId: item.authorId,
        })),
      });
    }

    if (Array.isArray(messages) && messages.length > 0) {
      await tx.message.createMany({
        data: messages.map((item) => ({
          id: item.id,
          content: item.content,
          senderRole: item.senderRole,
          createdAt: new Date(item.createdAt),
          userId: item.userId,
        })),
      });
    }

    if (Array.isArray(articleFish) && articleFish.length > 0) {
      await tx.articleFish.createMany({
        data: articleFish.map((item) => ({
          articleId: item.articleId,
          fishId: item.fishId,
        })),
        skipDuplicates: true,
      });
    }
  });

  await resetSequences();
  console.log(`Import terminé depuis: ${inputPath}`);
}

main()
  .catch((error) => {
    console.error("Erreur import DB:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
