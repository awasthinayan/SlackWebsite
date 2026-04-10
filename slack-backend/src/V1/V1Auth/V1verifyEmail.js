import { Router } from "express";

import { verifyEmailController } from "../../controllers/userController.js";

const router = Router();

router.post("/", verifyEmailController);

export default router;
