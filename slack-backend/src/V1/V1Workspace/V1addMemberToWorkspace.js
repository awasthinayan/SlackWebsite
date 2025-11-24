import express from "express";
import { addMemberToWorkspaceController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.post("/",addMemberToWorkspaceController) 

export default router;