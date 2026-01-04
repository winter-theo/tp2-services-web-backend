import { Router } from "express";
import { deleteUser, getUser, listUsers, updateUser } from "../controllers/usersController";
import { requireAdmin } from "../controllers/middleware";

const router = Router();

router.get("/", requireAdmin, listUsers);
router.get("/:id", requireAdmin, getUser);
router.put("/:id", requireAdmin, updateUser);
router.delete("/:id", requireAdmin, deleteUser);

export default router;
