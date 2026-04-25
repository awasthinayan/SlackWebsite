import express from "express";
import { deleteChannelController } from "../../controllers/channelController.js";

const router = express.Router({ mergeParams: true });

router.delete("/:channelId", deleteChannelController);

export default router;