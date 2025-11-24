import express from "express";
import { createWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.post("/",createWorkspaceController); 

export default router;