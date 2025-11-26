import express from "express";
import { addChannelToWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.post("/", addChannelToWorkspaceController);

export default router;
