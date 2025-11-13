import express from "express";

import { registerUserController } from "../controllers/userController.js";

const router = express.Router();


router.post("/",registerUserController);

export default router;

