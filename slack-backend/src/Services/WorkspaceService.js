import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { addEmailtoMailQueue } from "../Producer/mailQueueProducer.js";

import {
  createWorkspace,
  updateWorkpace,
  deleteWorkspaceById,
  getAllWorkspace,
  getWorkspaceByName,
  getWorkspaceByJoinCode,
  addChannelToWorkspace,
  fetchAllWorkspaceByMemberId,
  getWorkspaceById,
  addMemberToWorkspaceRepo,
  resetJoinCode,
} from "../RepoLayer/WorkspaceRepo.js";
import { createChannel } from "../RepoLayer/ChannelRepo.js";
import user from "../DBLayer/userSchema.js";
import { workspacebyJoinMailObject } from "../common/mailObject.js";

export const createWorkspaceService = async (
  workspaceName,
  description,
  memberId,
) => {
  let workspace = null;
  try {
    
    const JoinCode = uuidv4().slice(0, 8).toUpperCase();

    const existing = await getWorkspaceByName(workspaceName);

    if (existing) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: "Workspace already exists. Please create a new one.",
      };
    }

    
    workspace = await createWorkspace(workspaceName, description, JoinCode);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create workspace",
      };
    }

    const updatedWorkspace = await addMemberToWorkspaceRepo(
      workspace._id,
      memberId,
      "admin",
    );

    if (updatedWorkspace?.error) {
      await deleteWorkspaceById(workspace._id);
      return updatedWorkspace;
    }

    if (!updatedWorkspace) {
      await deleteWorkspaceById(workspace._id);
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to add member to workspace",
      };
    }

    const channel = await createChannel("general", workspace._id);

    if (!channel) {
      await deleteWorkspaceById(workspace._id);
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create default channel",
      };
    }

    const updatedWorkspaceChannels = await addChannelToWorkspace(
      workspaceName,
      channel._id,
      channel.ChannelName,
    );

    if (!updatedWorkspaceChannels) {
      await deleteWorkspaceById(workspace._id);
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to add channel to workspace",
      };
    }

    return {
      error: false,
      status: StatusCodes.CREATED,
      data: updatedWorkspaceChannels,
    };
  } catch (error) {
    console.log(error);
    if (workspace?._id) {
      await deleteWorkspaceById(workspace._id);
    }
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error",
    };
  }
};

export const updateWorkspaceService = async (
  id,
  workspaceName,
  description,
) => {
  try {
    const updatedWorkspace = await updateWorkpace(
      id,
      workspaceName,
      description,
    );
    
    const findworkspace = await getWorkspaceByName(workspaceName);

    if (!updatedWorkspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        message: { message: "Workspace not found", data: null },
      };
    }
    return {
      error: false,
      status: StatusCodes.OK,
      data: updatedWorkspace,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const deleteWorkspaceService = async (workspaceId, memberId) => {
  try {
    if (
      !workspaceId ||
      typeof workspaceId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(workspaceId)
    ) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        data: { message: "Invalid workspace id", data: null },
      };
    }

    const workspace = await getWorkspaceById(workspaceId);
    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    const isMember = workspace.members.some((m) => {
      const storedId = m.memberId._id || m.memberId;
      return String(storedId) === String(memberId);
    });
    if (!isMember) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        data: { message: "Member not part of workspace", data: null },
      };
    }

    const deleted = await deleteWorkspaceById(workspaceId);
    return {
      error: false,
      status: StatusCodes.OK,
      data: deleted,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const getAllWorkspaceService = async () => {
  try {
    const workspaces = await getAllWorkspace();

    if (!workspaces) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: workspaces,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const getWorkspaceDetailsService = async (workspaceId) => {
  try {
    if (
      !workspaceId ||
      typeof workspaceId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(workspaceId)
    ) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        data: { message: "Invalid workspace id", data: null },
      };
    }

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: workspace,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const getWorkspaceByNameService = async (workspaceName) => {
  try {
    const workspace = await getWorkspaceByName(workspaceName);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: workspace,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const getWorkspaceByJoinCodeService = async (JoinCode) => {
  try {
    const workspace = await getWorkspaceByJoinCode(JoinCode);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Invalid join code", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: workspace,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  requesterId,
) => {
  try {
    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    const isRequesterAdmin = workspace.members.some((member) => {
      const currentMemberId = member?.memberId?._id || member?.memberId;
      return (
        String(currentMemberId) === String(requesterId) &&
        member?.role === "admin"
      );
    });

    if (!isRequesterAdmin) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        data: { message: "Only admins can add members", data: null },
      };
    }

    const isValidUser = await user.findById(memberId);

    if (!isValidUser) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "User not found", data: null },
      };
    }

    const isMember = workspace.members.find(
      (m) => String(m.memberId) === String(memberId),
    );

    if (isMember) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        data: { message: "Member already exists", data: null },
      };
    }

    const response = await addMemberToWorkspaceRepo(
      workspaceId,
      memberId,
      role,
    );

    if (response?.error) {
      return response;
    }

    if (!response) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: { message: "Server error", data: null },
      };
    }

    const mailData = workspacebyJoinMailObject(response);

    const updateresponse = await addEmailtoMailQueue({
      ...mailData,
      to: isValidUser.email,
    });

    return response;
  } catch (error) {
    console.error("❌ ERROR in addMemberToWorkspaceService:", error);

    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const addChannelToWorkspaceService = async (
  workspaceName,
  channelId,
) => {
  try {
    const workspace = await getWorkspaceByName(workspaceName);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    const alreadyChannel = workspace.channels.some(
      (c) => String(c) === channelId,
    );

    if (alreadyChannel) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        data: { message: "Channel already exists", data: null },
      };
    }
    const addChannel = await addChannelToWorkspace(workspaceName, channelId);
    return {
      error: false,
      status: StatusCodes.OK,
      data: addChannel,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const resetWorkspaceJoinCodeService = async (workspaceId, user) => {
  try {
    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    const userId = user?._id || user?.id;
    const isAdmin = workspace.members.some((member) => {
    const memberId = member.memberId?._id || member.memberId;
    return (
      String(memberId) === String(userId) &&
      member.role === "admin"
    );
  });

    if (!isAdmin) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        data: { message: "Only workspace admins can reset join code", data: null },
      };
    }

    const newJoinCode = uuidv4().slice(0, 8).toUpperCase();
    const updatedWorkspace = await resetJoinCode(workspaceId, newJoinCode);

    if (!updatedWorkspace) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: { message: "Error while regenerating join code", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: updatedWorkspace,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Error while regenerating join code", data: null },
    };
  }
};

export const fetchAllWorkspaceByMemberIdService = async (userId) => {
  try {
    const response = await fetchAllWorkspaceByMemberId(userId);

    if (!response) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: { message: "Failed to fetch workspaces", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: response,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

export const joinWorkspaceBycodeService = async (workspaceId, joinCode, user) => {
  try {
    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    const userId = user?._id || user?.id;

    if(!userId) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        data: { message: "User not found", data: null },
      };
    }

    const joinCodeMatch =
      (workspace?.JoinCode ?? workspace?.joinCode) === joinCode;

    if (!joinCodeMatch) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        data: { message: "Invalid join code", data: null },
      };
    }

    const updatedWorkspace = await addMemberToWorkspaceRepo(
      workspaceId,
      userId,
      "member",
    );

    if (!updatedWorkspace) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: { message: "Failed to add member to workspace", data: null },
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      data: updatedWorkspace,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
}
