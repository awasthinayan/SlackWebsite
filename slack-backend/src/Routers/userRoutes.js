import express from "express";
import V1userSignUp from "../V1/V1Auth/V1userSignUp.js";
import V1userSignIn from "../V1/V1Auth/V1userSignIn.js";
import V1sendOTP from "../V1/V1Auth/V1sendOTP.js";
import V1verifyOTP from "../V1/V1Auth/V1verifyOTP.js";
import V1resetPassword from "../V1/V1Auth/V1resetPassword.js";
import { SignInSchema } from "../ZodValidation/SignInSchema.js";
import { SignUpSchema } from "../ZodValidation/SignUpSchema.js";
import { validate } from "../ZodValidation/Validate.js";
import V1getAllUsers from "../V1/V1Auth/V1getAllUsers.js";
import V1updateUser from "../V1/V1Auth/V1updateUser.js";
import {workspaceSchemaVaildation, CheckMemberSchemaValidation, CheckChannelSchemaValidation} from "../ZodValidation/WorkspaceSchema.js";

// All the workspaces imports

import V1CreateWorkspace from "../V1/V1Workspace/V1CreateWorkspace.js";
import V1updateWorkspace from "../V1/V1Workspace/V1updateWorkspace.js";
import V1deletWorkspace from "../V1/V1Workspace/V1deleteWorkspace.js";
import V1getAllWorkspaces from "../V1/V1Workspace/V1getAllWorkspaces.js";
import V1getWorkspaceByName from "../V1/V1Workspace/V1getWorkspaceByName.js";
import V1getWorkspaceByJoinCode from "../V1/V1Workspace/V1getWorkspaceByJoinCode.js";
import V1addMemberToWorkspace from "../V1/V1Workspace/V1addMemberToWorkspace.js";
import V1addChannelToWorkspace from "../V1/V1Workspace/V1addChannelToWorkspace.js";
import V1fetchAllWorkspaceByMemberId from "../V1/V1Workspace/V1fetchAllWorkspaceByMemberId.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import { check } from "zod";

const router = express.Router();

router.use("/V1/signup", validate(SignUpSchema), V1userSignUp);
router.use("/V1/signin", validate(SignInSchema), V1userSignIn);

router.use("/V1/allUsers", V1getAllUsers);

router.use("/V1", V1updateUser);

router.use("/V1/sendOTP", V1sendOTP);
router.use("/V1/verifyOTP", V1verifyOTP);
router.use("/V1/resetPassword", V1resetPassword);

// ALl the workspaces routes

router.use(
  "/V1/workspaces/createWorkspace",
  authMiddleware,
  validate(workspaceSchemaVaildation),
  V1CreateWorkspace,
);
router.use(
  "/V1/workspaces/updateWorkspace/:id",
  authMiddleware,
  validate(workspaceSchemaVaildation),
  V1updateWorkspace,
);
router.use(
  "/V1/workspaces/deleteWorkspace",
  authMiddleware,
  V1deletWorkspace,
);
router.use("/V1/workspaces/getAllWorkspace",authMiddleware, V1getAllWorkspaces);

router.use("/V1/workspaces/getWorkspaceByName", V1getWorkspaceByName);
router.use("/V1/workspaces/getWorkspaceByJoinCode", authMiddleware,V1getWorkspaceByJoinCode);
router.use(
  "/V1/workspaces/addMemberToWorkspace",
  validate(CheckMemberSchemaValidation),
  V1addMemberToWorkspace,
);
router.use(
  "/V1/workspaces/addChannelToWorkspace",
  validate(CheckChannelSchemaValidation),
  authMiddleware,
  V1addChannelToWorkspace,
);
router.use(
  "/V1/workspaces/fetchAllWorkspaceByMemberId",
  V1fetchAllWorkspaceByMemberId,
);
export default router;
