import { Router } from "express";
import { joinWorkspaceBycodeController } from "../../controllers/WorkspaceController.js";

const router = Router({ mergeParams: true });

router.put("/", joinWorkspaceBycodeController);

export default router;
