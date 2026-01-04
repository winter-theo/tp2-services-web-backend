import crypto from "crypto";
import { Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../models/request";
import { LoginInput, RegisterInput } from "../models/dtos";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { email, password, role }: RegisterInput = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email and password are required" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "email already registered" });
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashPassword(password),
      role: role ?? "USER",
    },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { email, password }: LoginInput = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ message: "invalid credentials" });
    return;
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
};
