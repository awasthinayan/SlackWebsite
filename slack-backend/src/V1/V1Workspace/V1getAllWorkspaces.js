import express from "express";
import { getAllWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.get("/", getAllWorkspaceController);

export default router;
