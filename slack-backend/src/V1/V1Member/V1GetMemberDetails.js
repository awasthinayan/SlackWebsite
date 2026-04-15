import express from "express";
import { GetDetailsofMemberController } from "../../controllers/userController.js";
const router = express.Router();

router.get("/:memberId", GetDetailsofMemberController);

export default router;