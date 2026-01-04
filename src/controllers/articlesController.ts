import { Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../models/request";
import { ArticleInput, ArticleUpdateInput } from "../models/dtos";
import { getIdParam } from "./middleware";

const articleInclude = {
  fishes: {
    include: {
      fish: true,
    },
  },
} as const;

export const listArticles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const q = req.query.q?.toString();
  const status = req.query.status?.toString();
  const fishIdParam = req.query.fishId?.toString();
  const fishId = fishIdParam ? getIdParam(fishIdParam) : null;

  const articles = await prisma.article.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(status ? { status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT" } : {}),
      ...(fishId
        ? {
            fishes: {
              some: { fishId },
            },
          }
        : {}),
    },
    include: articleInclude,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(articles);
};

export const getArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const articleId = getIdParam(req.params.id);
  if (!articleId) {
    res.status(400).json({ message: "invalid article id" });
    return;
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: articleInclude,
  });

  if (!article) {
    res.status(404).json({ message: "article not found" });
    return;
  }

  res.status(200).json(article);
};

export const createArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, content, status, fishIds, authorId }: ArticleInput = req.body;

  if (!title || !content) {
    res.status(400).json({ message: "title and content are required" });
    return;
  }

  const article = await prisma.article.create({
    data: {
      title,
      content,
      status: status ?? "DRAFT",
      authorId: authorId ?? req.currentUser?.id,
      fishes: fishIds?.length
        ? {
            create: fishIds.map((fishId) => ({ fishId })),
          }
        : undefined,
    },
    include: articleInclude,
  });

  res.status(201).json(article);
};

export const updateArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const articleId = getIdParam(req.params.id);
  if (!articleId) {
    res.status(400).json({ message: "invalid article id" });
    return;
  }

  const { title, content, status, fishIds }: ArticleUpdateInput = req.body;

  const existing = await prisma.article.findUnique({ where: { id: articleId } });
  if (!existing) {
    res.status(404).json({ message: "article not found" });
    return;
  }

  const article = await prisma.$transaction(async (tx) => {
    await tx.article.update({
      where: { id: articleId },
      data: {
        title: title ?? undefined,
        content: content ?? undefined,
        status: status ?? undefined,
      },
      include: articleInclude,
    });

    if (fishIds) {
      await tx.articleFish.deleteMany({ where: { articleId } });
      if (fishIds.length) {
        await tx.articleFish.createMany({
          data: fishIds.map((fishId) => ({ articleId, fishId })),
          skipDuplicates: true,
        });
      }
    }

    return tx.article.findUnique({ where: { id: articleId }, include: articleInclude });
  });

  if (!article) {
    res.status(404).json({ message: "article not found" });
    return;
  }

  res.status(200).json(article);
};

export const deleteArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const articleId = getIdParam(req.params.id);
  if (!articleId) {
    res.status(400).json({ message: "invalid article id" });
    return;
  }

  const existing = await prisma.article.findUnique({ where: { id: articleId } });
  if (!existing) {
    res.status(404).json({ message: "article not found" });
    return;
  }

  await prisma.article.delete({ where: { id: articleId } });
  res.status(204).send();
};

export const publishArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const articleId = getIdParam(req.params.id);
  if (!articleId) {
    res.status(400).json({ message: "invalid article id" });
    return;
  }

  const existing = await prisma.article.findUnique({ where: { id: articleId } });
  if (!existing) {
    res.status(404).json({ message: "article not found" });
    return;
  }

  const article = await prisma.article.update({
    where: { id: articleId },
    data: { status: "PUBLISHED" },
    include: articleInclude,
  });

  res.status(200).json(article);
};

export const addFishToArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const articleId = getIdParam(req.params.id);
  const fishId = getIdParam(req.params.fishId);

  if (!articleId || !fishId) {
    res.status(400).json({ message: "invalid article or fish id" });
    return;
  }

  const [articleExists, fishExists] = await Promise.all([
    prisma.article.findUnique({ where: { id: articleId } }),
    prisma.fish.findUnique({ where: { id: fishId } }),
  ]);

  if (!articleExists || !fishExists) {
    res.status(404).json({ message: "article or fish not found" });
    return;
  }

  const existingLink = await prisma.articleFish.findUnique({
    where: { articleId_fishId: { articleId, fishId } },
  });

  if (existingLink) {
    res.status(409).json({ message: "association already exists" });
    return;
  }

  await prisma.articleFish.create({
    data: { articleId, fishId },
  });

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: articleInclude,
  });

  res.status(200).json(article);
};

export const removeFishFromArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const articleId = getIdParam(req.params.id);
  const fishId = getIdParam(req.params.fishId);

  if (!articleId || !fishId) {
    res.status(400).json({ message: "invalid article or fish id" });
    return;
  }

  const existing = await prisma.articleFish.findUnique({
    where: { articleId_fishId: { articleId, fishId } },
  });

  if (!existing) {
    res.status(404).json({ message: "association not found" });
    return;
  }

  await prisma.articleFish.delete({
    where: { articleId_fishId: { articleId, fishId } },
  });

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: articleInclude,
  });

  res.status(200).json(article);
};
