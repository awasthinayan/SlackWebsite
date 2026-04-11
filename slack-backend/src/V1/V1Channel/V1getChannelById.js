import express from "express";
import { getChannelByIdController } from "../../controllers/channelController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getChannelByIdController);

export default router;
