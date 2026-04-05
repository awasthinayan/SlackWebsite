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
} from "../RepoLayer/WorkspaceRepo.js";
import { createChannel } from "../RepoLayer/ChannelRepo.js";
import user from "../DBLayer/userSchema.js";
import { workspacebyJoinMailObject } from "../common/mailObject.js";

// ------------------------------------------------------
// CREATE WORKSPACE
// ------------------------------------------------------

export const createWorkspaceService = async (
  workspaceName,
  description,
  memberId
) => {
  let workspace = null;
  try {
    // generate join code
    const JoinCode = uuidv4().slice(0, 8).toUpperCase();

    // check if workspace already exists
    const existing = await getWorkspaceByName(workspaceName);

    if (existing) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: "Workspace already exists. Please create a new one.",
      };
    }

    // STEP 1 → Create workspace
    workspace = await createWorkspace(
      workspaceName,
      description,
      JoinCode
    );

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create workspace",
      };
    }

    // STEP 2 → Add admin member
    const updatedWorkspace = await addMemberToWorkspaceRepo(
      workspace._id,
      memberId,
      "admin"
    );
    console.log("updatedWorkspace", updatedWorkspace);
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

    // STEP 3 → Create default channel "general"
    const channel = await createChannel("general", workspace._id);
    console.log("channel", channel);
    console.log("workspaceId", workspace._id);

    if (!channel) {
      await deleteWorkspaceById(workspace._id);
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create default channel",
      };
    }

    // STEP 4 → Add channel to workspace
    const updatedWorkspaceChannels = await addChannelToWorkspace(
      workspaceName,
      channel._id,
      channel.ChannelName
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

// ------------------------------------------------------
// UPDATE WORKSPACE
// ------------------------------------------------------
export const updateWorkspaceService = async (
  id,
  workspaceName,
  description
) => {
  try {
    const updatedWorkspace = await updateWorkpace(
      id,
      workspaceName,
      description
    );
    console.log("Workspace not found", updateWorkpace);

    const findworkspace = await getWorkspaceByName(workspaceName);
    console.log("findworkspace", findworkspace);

    // Update that workspace that is already exist
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

// ------------------------------------------------------
// DELETE WORKSPACE
// ------------------------------------------------------

export const deleteWorkspaceService = async (workspaceId, memberId) => {
  try {
    // For simplicity: require workspaceId (params) and treat it as ObjectId
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
    console.log("workspace in service:", workspaceId);
    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    // Check whether the provided memberId is part of this workspace
    // Note: m.memberId is a populated user object (has _id field), not a raw id
    const isMember = workspace.members.some((m) => {
      const storedId = m.memberId._id || m.memberId;
      return String(storedId) === String(memberId);
    });
    console.log("isMember check - searching for memberId:", memberId);
    console.log(
      "workspace members stored ids:",
      workspace.members.map((m) => String(m.memberId._id || m.memberId))
    );
    console.log("isMember result:", isMember);
    if (!isMember) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        data: { message: "Member not part of workspace", data: null },
      };
    }

    const deleted = await deleteWorkspaceById(workspaceId);
    console.log("deleted in service:", deleted);
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
// ------------------------------------------------------
// GET ALL WORKSPACE
// ------------------------------------------------------

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

// ------------------------------------------------------
// GET WORKSPACE DETAILS BY ID
// ------------------------------------------------------
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

// ------------------------------------------------------
// GET WORKSPACE BY NAME
// ------------------------------------------------------
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

// ------------------------------------------------------
// GET WORKSPACE BY JOIN CODE
// ------------------------------------------------------
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

// ------------------------------------------------------
// ADD MEMBER
// ------------------------------------------------------
export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role
) => {
  try {
    console.log("🟦 SERVICE START");
    console.log("📌 workspaceId:", workspaceId);
    console.log("📌 memberId:", memberId);
    console.log("📌 role:", role);

    // Fetch workspace
    const workspace = await getWorkspaceById(workspaceId);
    console.log("📂 Workspace fetched:", workspace?._id);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    // Validate user
    const isValidUser = await user.findById(memberId);
    console.log("👤 User fetched:", isValidUser?._id);

    if (!isValidUser) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "User not found", data: null },
      };
    }

    // Check if already a member
    const isMember = workspace.members.find(
      (m) => String(m.memberId) === String(memberId)
    );

    if (isMember) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        data: { message: "Member already exists", data: null },
      };
    }

    // Call Repo Layer
    console.log("🛠 Calling addMemberToWorkspaceRepo...");
    const response = await addMemberToWorkspaceRepo(workspaceId, memberId, role);
    console.log("🟩 Repo Response:", response);

    if(response?.error){
      return response;
    }

    if (!response) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: { message: "Server error", data: null },
      };
    }

    // Mail Queue Job
    console.log("📨 Adding Job To Mail Queue...");

    const mailData = workspacebyJoinMailObject(response);

    console.log('====================================');

    console.log("🧪 FULL RESPONSE OBJECT:", JSON.stringify(response, null, 2));

    console.log('====================================');
    

    const updateresponse = await addEmailtoMailQueue({
      ...mailData,
      to: isValidUser.email,
    });

    console.log("📮 Mail Queue Job Created:", updateresponse);

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


// ------------------------------------------------------
// ADD CHANNEL
// ------------------------------------------------------
export const addChannelToWorkspaceService = async (
  workspaceName,
  channelId
) => {
  try {
    const workspace = await getWorkspaceByName(workspaceName);

    // check if the workspace is already exist or not
    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    // check if the channelId is already exist or not
    const alreadyChannel = workspace.channels.some(
      (c) => String(c) === channelId
    );
    console.log("alreadyChannel", alreadyChannel);
    console.log("channelId", channelId);

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

// ------------------------------------------------------
export const fetchAllWorkspaceByMemberIdService = async (userId) => {
  try {
    const response = await fetchAllWorkspaceByMemberId(userId);
    console.log("id in service", userId);

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
