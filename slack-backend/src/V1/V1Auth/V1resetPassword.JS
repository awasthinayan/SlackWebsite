import express from "express";
import { resetPasswordController } from "../../controllers/userController.js";

const router = express.Router();

router.post("/", resetPasswordController);

export default router;
