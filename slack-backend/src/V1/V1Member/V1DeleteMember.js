import express from "express"   
import { Router } from "express";
import { deleteMemberController } from "../../controllers/memberController.js";
import { authorizeWorkspaceOwner } from "../../Middleware/authorizeWorkspaceAdmin.js";

const router = Router();

router.delete("/:workspaceId", authorizeWorkspaceOwner, deleteMemberController);

export default router;