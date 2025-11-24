import express from "express";
import { getWorkspaceByNameController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.get("/",getWorkspaceByNameController)

export default router;