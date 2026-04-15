import express from "express";
import { getMessagesController } from "../../controllers/messageController.js";

const router = express.Router();

router.get("/:channelId", getMessagesController);

export default router;