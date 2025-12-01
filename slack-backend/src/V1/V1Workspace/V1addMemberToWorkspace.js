import express from "express";
import { addMemberToWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.put("/:workspaceId", addMemberToWorkspaceController);

export default router;
