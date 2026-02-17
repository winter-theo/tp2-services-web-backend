import { Router } from "express";
import {
  addFishToArticle,
  createArticle,
  deleteArticle,
  getArticle,
  listArticles,
  publishArticle,
  removeFishFromArticle,
  updateArticle,
} from "../controllers/articlesController";
import { requireAdmin } from "../controllers/middleware";

const router = Router();

router.get("/", listArticles);
router.get("/:id", getArticle);
router.post("/", requireAdmin, createArticle);
router.put("/:id", requireAdmin, updateArticle);
router.delete("/:id", requireAdmin, deleteArticle);
router.put("/:id/publish", requireAdmin, publishArticle);
router.post("/:id/fish/:fishId", requireAdmin, addFishToArticle);
router.delete("/:id/fish/:fishId", requireAdmin, removeFishFromArticle);

export default router;
