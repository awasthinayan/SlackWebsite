import express from "express";
import { fetchAllWorkspaceByMemberIdController } from "../../controllers/WorkspaceController.js";

const router = express.Router();

router.get("/",fetchAllWorkspaceByMemberIdController)

export default router;