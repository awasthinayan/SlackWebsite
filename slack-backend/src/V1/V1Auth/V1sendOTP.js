import express from "express";
import { sendOTPController } from "../../controllers/userController.js";

const router = express.Router();

router.post("/",sendOTPController);

export default router;
