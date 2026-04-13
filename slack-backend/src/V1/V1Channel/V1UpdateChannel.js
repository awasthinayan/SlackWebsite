import express from "express";
import { updateChannelController } from "../../controllers/channelController.js";

const router = express.Router({ mergeParams: true });

router.put("/", updateChannelController);

export default router;