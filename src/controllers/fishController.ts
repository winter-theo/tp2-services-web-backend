import { Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../models/request";
import { FishInput } from "../models/dtos";
import { getIdParam } from "./middleware";

export const listFish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const q = req.query.q?.toString();

  const fishes = await prisma.fish.findMany({
    where: q
      ? {
          name: { contains: q, mode: "insensitive" },
        }
      : undefined,
    orderBy: { name: "asc" },
  });

  res.status(200).json(fishes);
};

export const getFish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const fishId = getIdParam(req.params.id);
  if (!fishId) {
    res.status(400).json({ message: "invalid fish id" });
    return;
  }

  const fish = await prisma.fish.findUnique({ where: { id: fishId } });
  if (!fish) {
    res.status(404).json({ message: "fish not found" });
    return;
  }

  res.status(200).json(fish);
};

export const createFish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, description }: FishInput = req.body;
  if (!name || !description) {
    res.status(400).json({ message: "name and description are required" });
    return;
  }

  const fish = await prisma.fish.create({
    data: {
      name,
      description,
    },
  });

  res.status(201).json(fish);
};

export const updateFish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const fishId = getIdParam(req.params.id);
  if (!fishId) {
    res.status(400).json({ message: "invalid fish id" });
    return;
  }

  const { name, description }: Partial<FishInput> = req.body;

  const existing = await prisma.fish.findUnique({ where: { id: fishId } });
  if (!existing) {
    res.status(404).json({ message: "fish not found" });
    return;
  }

  const fish = await prisma.fish.update({
    where: { id: fishId },
    data: {
      name: name ?? undefined,
      description: description ?? undefined,
    },
  });

  res.status(200).json(fish);
};

export const deleteFish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const fishId = getIdParam(req.params.id);
  if (!fishId) {
    res.status(400).json({ message: "invalid fish id" });
    return;
  }

  const existing = await prisma.fish.findUnique({ where: { id: fishId } });
  if (!existing) {
    res.status(404).json({ message: "fish not found" });
    return;
  }

  await prisma.fish.delete({ where: { id: fishId } });
  res.status(204).send();
};
