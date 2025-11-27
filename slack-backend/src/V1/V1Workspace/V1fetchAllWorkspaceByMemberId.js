import express from "express";
import { fetchAllWorkspaceByMemberIdController } from "../../controllers/WorkspaceController.js";
import authMiddleware from "../../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware,fetchAllWorkspaceByMemberIdController);

export default router;
