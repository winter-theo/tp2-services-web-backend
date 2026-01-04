import { NextFunction, Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../models/request";

const parseId = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const attachCurrentUser = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const headerValue = req.header("x-user-id") ?? req.query.userId?.toString();
  const userId = parseId(headerValue);

  if (!userId) {
    next();
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    req.currentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  next();
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.currentUser) {
    res.status(401).json({ message: "authentication required" });
    return;
  }
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.currentUser) {
    res.status(401).json({ message: "authentication required" });
    return;
  }
  if (req.currentUser.role !== "ADMIN") {
    res.status(403).json({ message: "admin access required" });
    return;
  }
  next();
};

export const requireSelfOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    res.status(401).json({ message: "authentication required" });
    return;
  }

  const userId = parseId(req.params.id);
  if (!userId) {
    res.status(400).json({ message: "invalid user id" });
    return;
  }

  if (req.currentUser.role !== "ADMIN" && req.currentUser.id !== userId) {
    res.status(403).json({ message: "forbidden" });
    return;
  }

  next();
};

export const getIdParam = (value: string): number | null => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};
