import { Response } from "express";
import crypto from "crypto";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../models/request";
import { UpdateUserInput } from "../models/dtos";
import { getIdParam } from "./middleware";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const listUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(users);
};

export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = getIdParam(req.params.id);
  if (!userId) {
    res.status(400).json({ message: "invalid user id" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  res.status(200).json(user);
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = getIdParam(req.params.id);
  if (!userId) {
    res.status(400).json({ message: "invalid user id" });
    return;
  }

  const { email, password, role }: UpdateUserInput = req.body;
  const data: { email?: string; passwordHash?: string; role?: UpdateUserInput["role"] } = {};

  if (email) {
    data.email = email;
  }
  if (password) {
    data.passwordHash = hashPassword(password);
  }
  if (role) {
    data.role = role;
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, role: true, createdAt: true },
  });

  res.status(200).json(user);
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = getIdParam(req.params.id);
  if (!userId) {
    res.status(400).json({ message: "invalid user id" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  await prisma.user.delete({ where: { id: userId } });
  res.status(204).send();
};
