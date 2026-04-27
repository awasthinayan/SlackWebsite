import express from "express";
import { getCloudinarySignatureController } from "../../controllers/messageController.js";

const router = express.Router();

router.get("/", getCloudinarySignatureController);

export default router;