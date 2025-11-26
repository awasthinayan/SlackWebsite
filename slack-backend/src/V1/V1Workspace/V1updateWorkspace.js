import express from "express";
import { updateWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.put("/", updateWorkspaceController);

export default router;
