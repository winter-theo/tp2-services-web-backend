import { Router } from "express";
import { listPendingMessages } from "../controllers/messagesController";
import { requireAdmin } from "../controllers/middleware";

const router = Router();

router.get("/messages/pending", requireAdmin, listPendingMessages);

export default router;
