import { StatusCodes } from "http-status-codes";
import {
  createChannel,
  getAllChannel,
  getChannelByName,
  updateWorkspaceAddChannel,
} from "../RepoLayer/ChannelRepo.js";

import { getWorkspaceById } from "../RepoLayer/WorkspaceRepo.js";

export const createChannelService = async (
  channelName,
  workspaceId,
  memberId
) => {
  try {
    const existingChannel = await getChannelByName(channelName);

    if (existingChannel) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: "Channel already exists",
        data: null,
      };
    }

    // check if workspace exists
    const workspace = await getWorkspaceById(workspaceId);
    console.log(workspace);

    // check if workspace exists first
    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.BAD_REQUEST,
        message: "Workspace not found in which channel is to be created",
        data: null,
      };
    }

    // check if user is part of workspace
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
    console.log("result in service", result);

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
