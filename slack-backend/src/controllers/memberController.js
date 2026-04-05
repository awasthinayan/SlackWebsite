import { StatusCodes } from "http-status-codes";
import { deleteMemberService, isMemberPartOfWorkspaceService } from "../Services/memberService.js";

export const isMemberPartOfWorkspaceController = async (req, res) => {
  try {
    const user = await isMemberPartOfWorkspaceService(
      req.params.workspaceId,
      req.body.memberId
    );

    // ✅ SUCCESS CASE
    return res.status(StatusCodes.OK).json({
      error: false,
      status: StatusCodes.OK,
      data: {
        message: "User is part of workspace",
        user,
      },
    });

  } catch (error) {
    console.log(error);

    // ✅ Controlled errors from service
    if (error.message === "Workspace not found") {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: error.message },
      });
    }

    if (error.message === "User not found") {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: error.message },
      });
    }

    if (error.message === "User is not part of workspace") {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: true,
        status: StatusCodes.FORBIDDEN,
        data: { message: error.message },
      });
    }

    // ❌ Unexpected error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error" },
    });
  }
};


export const deleteMemberController = async (req, res) => {
  try {
    const user = await deleteMemberService(
      req.params.workspaceId,
      req.body.memberId,
      req.user._id
    );

    return res.status(200).json({
      error: false,
      message: "Member removed successfully",
      user,
    });
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: error.message,
    });
  }
};
