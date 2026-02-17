import { Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../models/request";
import { getIdParam } from "./middleware";

export const listMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = getIdParam(req.params.id);
  if (!userId) {
    res.status(400).json({ message: "invalid user id" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json(messages);
};

export const createMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = getIdParam(req.params.id);
  if (!userId) {
    res.status(400).json({ message: "invalid user id" });
    return;
  }

  if (!req.currentUser) {
    res.status(401).json({ message: "authentication required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  const { content } = req.body as { content?: string };
  if (!content) {
    res.status(400).json({ message: "content is required" });
    return;
  }

  const message = await prisma.message.create({
    data: {
      content,
      senderRole: req.currentUser.role,
      userId,
    },
  });

  res.status(201).json(message);
};

export const listPendingMessages = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const latestMessages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    distinct: ["userId"],
    include: { user: true },
  });

  const pending = latestMessages.filter((message) => message.senderRole === "USER");

  res.status(200).json(pending);
};
