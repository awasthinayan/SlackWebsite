import express from "express";
import { createChannelController } from "../../controllers/channelController.js";

const router = express.Router();

router.post("/", createChannelController);

export default router;