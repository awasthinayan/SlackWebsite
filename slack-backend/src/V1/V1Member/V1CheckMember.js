import express from "express";

import { isMemberPartOfWorkspaceController } from "../../controllers/memberController.js";

const router = express.Router();

router.put("/:workspaceId", isMemberPartOfWorkspaceController);

export default router;