import express from "express";
import { getWorkspaceDetailsController } from "../../controllers/WorkspaceController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getWorkspaceDetailsController);

export default router;
