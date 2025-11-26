import express from "express";
import { verifyOTPController } from "../../controllers/userController.js";

const router = express.Router();

router.post("/", verifyOTPController);

export default router;
