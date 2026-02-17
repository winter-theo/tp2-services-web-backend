const fs = require("fs/promises");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const outputArg = process.argv[2] || "db-export.json";
  const outputPath = path.resolve(process.cwd(), outputArg);

  const [users, fish, articles, messages, articleFish] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: "asc" } }),
    prisma.fish.findMany({ orderBy: { id: "asc" } }),
    prisma.article.findMany({ orderBy: { id: "asc" } }),
    prisma.message.findMany({ orderBy: { id: "asc" } }),
    prisma.articleFish.findMany({ orderBy: [{ articleId: "asc" }, { fishId: "asc" }] }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    format: "aquarium-db-export-v1",
    data: {
      users,
      fish,
      articles,
      messages,
      articleFish,
    },
  };

  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Export écrit dans: ${outputPath}`);
}

main()
  .catch((error) => {
    console.error("Erreur export DB:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
