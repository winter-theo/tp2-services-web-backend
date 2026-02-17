import { Router } from "express";
import { createMessage, listMessages } from "../controllers/messagesController";
import { requireSelfOrAdmin } from "../controllers/middleware";

const router = Router();

router.get("/users/:id/messages", requireSelfOrAdmin, listMessages);
router.post("/users/:id/messages", requireSelfOrAdmin, createMessage);

export default router;
