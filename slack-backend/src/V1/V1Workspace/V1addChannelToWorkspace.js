import express from "express";
import { addChannelToWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.put("/", addChannelToWorkspaceController);

export default router;
