import { StatusCodes } from "http-status-codes";
import {
  createChannel,
  deleteChannelById,
  getAllChannel,
  getChannelByName,
  getChannelwithWorkspaceDetails,
  updateChannelById,
  updateWorkspaceAddChannel,
} from "../RepoLayer/ChannelRepo.js";

import { getWorkspaceById } from "../RepoLayer/WorkspaceRepo.js";

export const createChannelService = async (
  channelName,
  workspaceId,
  memberId
) => {
  try {
    const existingChannel = await getChannelByName(channelName, workspaceId);

    if (existingChannel) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: "Channel already exists",
        data: null,
      };
    }

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: "Workspace not found in which channel is to be created",
        data: null,
      };
    }

    const isMember = workspace.members.find((m) => {
      const storedId = m.memberId._id || m.memberId;
      return String(storedId) === String(memberId);
    });

    if (!isMember) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        message: "User is not part of workspace",
        data: null,
      };
    }

    if (isMember.role !== "admin") {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        message: "Only admins can create channels",
        data: null,
      };
    }

    const newChannel = await createChannel(channelName, workspaceId,memberId);

    if (!newChannel) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create channel",
        data: null,
      };
    }

     await updateWorkspaceAddChannel(workspaceId, newChannel._id);

    return {
      error: false,
      status: StatusCodes.CREATED,
      message: "Channel created successfully",
      data: newChannel,
    };

  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error",
    };
  }
};

export const getAllChannelService = async () => {
  try {
    const result = await getAllChannel();

    if (!result) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        message: "Channel not found",
        data: null,
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      message: "All channel fetched successfully",
      data: result,
    };
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error",
      data: null,
    };
  }
};

export const getChannelByIdService = async (channelId) => {
  try {
    const channel = await getChannelwithWorkspaceDetails(channelId);

    if (!channel) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        message: "Channel not found",
        data: null,
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      message: "Channel details fetched successfully",
      data: channel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error",
      data: null,
    };
  }
};

export const updateChannelService = async (channelId, workspaceId, channelName, memberId) => {
  try {
    const channel = await getChannelwithWorkspaceDetails(channelId);
    if (!channel) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        message: 'Channel not found',
        data: null,
      };
    }

    if(!workspaceId) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: 'Workspace id is required',
        data: null,
      };
    }

    const isMember = channel.workspaceId.members.find((m) => {
      const storedId = m.memberId._id || m.memberId;
      return String(storedId) === String(memberId); 
    });

    if (!isMember) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        message: 'User is not part of workspace',
        data: null,
      };
    }

    if (isMember.role !== 'admin') {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        message: 'Only admins can update channels',
        data: null,
      };
    }

    const updatedChannel = await updateChannelById(channelId, channelName); 

    if (!updatedChannel) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to update channel',
        data: null,
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      message: 'Channel updated successfully',
      data: updatedChannel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Server error',
      data: null,
    };
  }
};

export const deleteChannelService = async (channelId,memberId) => {
  try {
    const channel = await getChannelwithWorkspaceDetails(channelId);
    if (!channel) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        message: "Channel not found",
        data: null,
      };
    }

    const isMember = channel.workspaceId.members.find((m) => {
      const storedId = m.memberId._id || m.memberId;
      return String(storedId) === String(memberId);
    });

    if (!isMember) {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        message: "User is not part of workspace",
        data: null,
      };
    }

    if (isMember.role !== "admin") {
      return {
        error: true,
        status: StatusCodes.FORBIDDEN,
        message: "Only admins can delete channels",
        data: null,
      };
    }

    const deletedChannel = await deleteChannelById(channelId);

    if (!deletedChannel) {
      return {
        error: true,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to delete channel",
        data: null,
      };
    }

    return {
      error: false,
      status: StatusCodes.OK,
      message: "Channel deleted successfully",
      data: deletedChannel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error",
      data: null,
    };
  }
};