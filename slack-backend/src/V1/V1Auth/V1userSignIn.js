import express from "express";
import { loginUserController } from "../../controllers/userController.js";

const router = express.Router();

router.post("/", loginUserController);

export default router;
