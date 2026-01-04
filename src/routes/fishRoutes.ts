import { Router } from "express";
import { createFish, deleteFish, getFish, listFish, updateFish } from "../controllers/fishController";
import { requireAdmin } from "../controllers/middleware";

const router = Router();

router.get("/", listFish);
router.get("/:id", getFish);
router.post("/", requireAdmin, createFish);
router.put("/:id", requireAdmin, updateFish);
router.delete("/:id", requireAdmin, deleteFish);

export default router;
