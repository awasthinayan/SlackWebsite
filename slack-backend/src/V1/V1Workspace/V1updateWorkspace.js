import express from "express";
import { updateWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router({ mergeParams: true });

router.put("/", updateWorkspaceController);

export default router;
