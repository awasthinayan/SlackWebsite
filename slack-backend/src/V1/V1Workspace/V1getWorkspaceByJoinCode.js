import express from "express";
import { getWorkspaceByJoinCodeController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.get("/",getWorkspaceByJoinCodeController)    
    
export default router;