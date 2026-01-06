import crypto from "crypto";
import prisma from "./client";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const main = async (): Promise<void> => {
  await prisma.articleFish.deleteMany();
  await prisma.message.deleteMany();
  await prisma.article.deleteMany();
  await prisma.fish.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      id: 1,
      email: "admin@aquarium.local",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      id: 2,
      email: "user@aquarium.local",
      passwordHash: hashPassword("user123"),
      role: "USER",
    },
  });

  const neonTetra = await prisma.fish.create({
    data: {
      id: 1,
      name: "Neon tetra",
      description: "Petit poisson grégaire demandant une eau douce acide.",
    },
  });

  const corydoras = await prisma.fish.create({
    data: {
      id: 2,
      name: "Corydoras panda",
      description: "Poisson de fond pacifique qui aime vivre en groupe.",
    },
  });

  await prisma.fish.create({
    data: {
      id: 3,
      name: "Betta splendens",
      description: "Poisson territorial à maintenir seul dans un bac adapté.",
    },
  });

  const article = await prisma.article.create({
    data: {
      id: 1,
      title: "Démarrer un aquarium planté",
      content: "Choisir un sol nutritif, un éclairage adapté et un cycle de l'azote complet.",
      status: "PUBLISHED",
      authorId: admin.id,
    },
  });

  await prisma.articleFish.createMany({
    data: [
      { articleId: article.id, fishId: neonTetra.id },
      { articleId: article.id, fishId: corydoras.id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        id: 1,
        content: "Bonjour, quels paramètres pour un betta ?",
        senderRole: "USER",
        userId: user.id,
      },
      {
        id: 2,
        content: "Bonjour, voici les paramètres recommandés pour un betta...",
        senderRole: "ADMIN",
        userId: user.id,
      },
    ],
  });
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
