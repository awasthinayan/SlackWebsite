import express from "express";
import { getDirectMessagesController } from "../../controllers/messageController.js";

const router = express.Router();

router.get("/:workspaceId/:memberId", getDirectMessagesController);

export default router;
