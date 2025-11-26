import express from "express";
import { deleteWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.delete("/", deleteWorkspaceController);

export default router;
