import express from "express";
import { resetJoinCodeController } from "../../controllers/WorkspaceController.js";

const router = express.Router({ mergeParams: true });

router.put("/", resetJoinCodeController);

export default router;
