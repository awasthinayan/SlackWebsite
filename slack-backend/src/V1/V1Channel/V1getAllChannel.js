import express from "express";
import { getAllChannelController } from "../../controllers/channelController.js";

const router = express.Router();

router.get("/", getAllChannelController);

export default router;