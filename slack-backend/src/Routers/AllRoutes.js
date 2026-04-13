import express from "express";
import V1userSignUp from "../V1/V1Auth/V1userSignUp.js";
import V1userSignIn from "../V1/V1Auth/V1userSignIn.js";
import V1sendOTP from "../V1/V1Auth/V1sendOTP.js";
import V1verifyOTP from "../V1/V1Auth/V1verifyOTP.js";
import V1resetPassword from "../V1/V1Auth/V1resetPassword.js";
import V1verifyEmail from "../V1/V1Auth/V1verifyEmail.js";
import { SignInSchema } from "../ZodValidation/SignInSchema.js";
import { SignUpSchema } from "../ZodValidation/SignUpSchema.js";
import {
  ForgotPasswordEmailSchema,
  ResetPasswordSchema,
  VerifyOTPSchema,
} from "../ZodValidation/ForgotPasswordSchema.js";
import { validate } from "../ZodValidation/Validate.js";
import V1getAllUsers from "../V1/V1Auth/V1getAllUsers.js";
import V1updateUser from "../V1/V1Auth/V1updateUser.js";
import {
  workspaceSchemaVaildation,
  CheckMemberSchemaValidation,
  CheckChannelSchemaValidation,
} from "../ZodValidation/WorkspaceSchema.js";
import authMiddleware from "../Middleware/authMiddleware.js";

//ALl the channel imports

import V1CreateChannel from "../V1/V1Channel/V1CreateChannel.js";
import V1getAllChannel from "../V1/V1Channel/V1getAllChannel.js";
import V1getChannelById from "../V1/V1Channel/V1getChannelById.js";
import V1updateChannel from "../V1/V1Channel/V1UpdateChannel.js";
import V1deleteChannel from "../V1/V1Channel/V1DeleteChannel.js";

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
import V1getWorkspaceDetails from "../V1/V1Workspace/V1getWorkspaceDetails.js";
import V1resetJoinCode from "../V1/V1Workspace/V1resetJoinCode.js";
import V1joinWorkspaceBycode from "../V1/V1Workspace/V1joinWorkspaceBycode.js";

// All the member routes
import V1CheckMember from "../V1/V1Member/V1CheckMember.js";
import V1DeleteMember from "../V1/V1Member/V1DeleteMember.js";

const router = express.Router();

// All the user routes

router.use("/signup", validate(SignUpSchema), V1userSignUp);
router.use("/signin", validate(SignInSchema), V1userSignIn);

router.use("/allUsers", V1getAllUsers);

router.use("/update", V1updateUser);

router.use("/sendOTP", validate(ForgotPasswordEmailSchema), V1sendOTP);
router.use("/verifyOTP", validate(VerifyOTPSchema), V1verifyOTP);
router.use("/resetPassword", validate(ResetPasswordSchema), V1resetPassword);
router.use("/verifyEmail", V1verifyEmail);

// ALl the workspaces routes

router.use(
  "/workspaces/createWorkspace",
  authMiddleware,
  validate(workspaceSchemaVaildation),
  V1CreateWorkspace,
);
router.use(
  "/workspaces/updateWorkspace/:id",
  authMiddleware,
  validate(workspaceSchemaVaildation),
  V1updateWorkspace,
);
router.use("/workspaces/deleteWorkspace", authMiddleware, V1deletWorkspace);
router.use("/workspaces/getAllWorkspace", authMiddleware, V1getAllWorkspaces);

router.use("/workspaces/getWorkspaceByName", V1getWorkspaceByName);
router.use(
  "/workspaces/getWorkspaceByJoinCode/:joinCode",
  authMiddleware,
  V1getWorkspaceByJoinCode,
);
router.use(
  "/workspaces/addMemberToWorkspace",
  validate(CheckMemberSchemaValidation),
  V1addMemberToWorkspace,
);
router.use(
  "/workspaces/addChannelToWorkspace",
  validate(CheckChannelSchemaValidation),
  authMiddleware,
  V1addChannelToWorkspace,
);

router.use(
  "/workspaces/fetchAllWorkspaceByMemberId",
  authMiddleware,
  V1fetchAllWorkspaceByMemberId,
);
router.use("/workspaces/:workspaceId", authMiddleware, V1getWorkspaceDetails);

router.use(
  "/workspaces/:workspaceId/joinCode/reset",
  authMiddleware,
  V1resetJoinCode,
);

router.use(
  "/workspaces/:workspaceId/joinCode/:joinCode",
  authMiddleware,
  V1joinWorkspaceBycode,
);

// All the channel routes

router.use("/channel/createChannel", authMiddleware, V1CreateChannel);
router.use("/channel/getAllChannel", V1getAllChannel);
router.use(
  "/channel/deleteChannel/:channelId",
  authMiddleware,
  V1deleteChannel,
);
router.use(
  "/channel/:channelId/update/:workspaceId",
  authMiddleware,
  V1updateChannel,
);
router.use("/channel/:channelId", authMiddleware, V1getChannelById);

// All the member routes

router.use("/V1/member/isMemberPartOfWorkspace", authMiddleware, V1CheckMember);

router.use(
  "/V1/member/DeleteMemberFromWorkspace",
  authMiddleware,
  V1DeleteMember,
);

export default router;
