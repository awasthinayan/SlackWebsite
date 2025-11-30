import express from "express";
import { deleteWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

// DELETE /:workspaceId - delete by workspace id (params)
router.delete("/:workspaceId", deleteWorkspaceController);

export default router;
