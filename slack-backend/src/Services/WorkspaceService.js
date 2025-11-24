import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import {
  createWorkspace,
  updateWorkpace,
  deleteWorkspace,
  getAllWorkspace,
  getWorkspaceByName,
  getWorkspaceByJoinCode,
  addMemberToWorkspace,
  addChannelToWorkspace,
  fetchAllWorkspaceByMemberId,
} from "../Repo Layer/WorkspaceRepo.js";


// ------------------------------------------------------
// CREATE WORKSPACE
// ------------------------------------------------------

// Create a Workspace with a name and a join code
export const createWorkspaceService = async (workspaceName) => {
  try {
    // created the join code
   const JoinCode = uuidv4().slice(0, 8);

   // check the workspace name is unique and is present or not
   const workspace = await getWorkspaceByName(workspaceName);

   if (workspace) {
     return {
       error: true,
       status: StatusCodes.BAD_REQUEST,
       data: { message: "Workspace already exists", data: null },
     };
   }
   return await createWorkspace(workspaceName, JoinCode);

  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

// ------------------------------------------------------
// UPDATE WORKSPACE
// ------------------------------------------------------
export const updateWorkspaceService = async (workspaceName, description) => { 
  try {
    const updatedWorkspace = await updateWorkpace(workspaceName, description);

    // Update that workspace that is already exist
    if (!updatedWorkspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
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

export const deleteWorkspaceService = async (workspaceName) => {
  try {

    const deletedWorkspace = await deleteWorkspace(workspaceName);

    // Delete that workspace that is already exist
    if (!deletedWorkspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }
    return {
      error: false,
      status: StatusCodes.OK,
      data: deletedWorkspace,
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
export const addMemberToWorkspaceService = async (workspaceName, memberId, role) => {
  try {
    const addmemeber = await addMemberToWorkspace(workspaceName, memberId, role);

    const checkworkspace = await getWorkspaceByName(workspaceName);

    // Update that workspace that is already exist
    if (!checkworkspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    // chekc if the member is already exist or not
    const alreadyMember = addmemeber.members.find(
      (m) => m.memberId === memberId
      );

      if (alreadyMember) {
        return {
          error: true,
          status: StatusCodes.BAD_REQUEST,
          data: { message: "Member already exists", data: null },
        };
      }
    return {
      error: false,
      status: StatusCodes.OK,
      data: addmemeber,
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
// ADD CHANNEL
// ------------------------------------------------------
export const addChannelToWorkspaceService = async (workspaceName, channelName) => {
  try {

    const addChannel = await addChannelToWorkspace(workspaceName, channelName);

    const workspace = await getWorkspaceByName(workspaceName);

    // check if the workspace is already exist or not
    if (!workspace) {
      return {
        error: true,
        status: StatusCodes.NOT_FOUND,
        data: { message: "Workspace not found", data: null },
      };
    }

    // chekc if the channel is already exist or not
    const alreadyChannel = addChannel.channels.find(
      (c) => c === channelName
      );

      if (alreadyChannel) {
        return {
          error: true,
          status: StatusCodes.BAD_REQUEST,
          data: { message: "Channel already exists", data: null },
        };
      }
      return {
        error: false,
        status: StatusCodes.OK, 
        data: addChannel,
      }
  } catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};

// ------------------------------------------------------
export const fetchAllWorkspaceByMemberIdService = async (memberId) => { 
  try {
    const workspaces = await fetchAllWorkspaceByMemberId(memberId);

    // if no workspace is found
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
  }
  catch (error) {
    return {
      error: true,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: { message: "Server error", data: null },
    };
  }
};  

