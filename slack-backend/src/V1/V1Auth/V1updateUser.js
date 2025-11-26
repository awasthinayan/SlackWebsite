import express from "express";

import { updateUserController } from "../../controllers/userController.js";
import authMiddleware from "../../Middleware/authMiddleware.js";

const router = express.Router();

router.put("/updateUser/:id", authMiddleware, updateUserController);

export default router;
