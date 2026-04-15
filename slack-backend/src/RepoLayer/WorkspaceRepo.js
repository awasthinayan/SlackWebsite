import mongoose from "mongoose";
import Workspace from "../DBLayer/Workspace.js";
import user from "../DBLayer/userSchema.js";

export const createWorkspace = async (workspaceName, description, JoinCode) => {
  try {
    return await Workspace.create({ workspaceName, description, JoinCode });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateWorkpace = async (id, workspaceName, description) => {
  try {
    const updateWorskpace = await Workspace.findByIdAndUpdate(
      id,
      { $set: { workspaceName, description } },
      { new: true }
    );
    return updateWorskpace;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating workspace");
  }
};

export const deleteWorkspace = async (workspaceName) => {
  try {
    return await Workspace.deleteOne({ workspaceName });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteWorkspaceById = async (workspaceId) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(workspaceId);
    return workspace;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllWorkspace = async () => {
  try {
    return await Workspace.find();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getWorkspaceByName = async (workspaceName) => {
  try {
    return await Workspace.findOne({ workspaceName });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getWorkspaceByJoinCode = async (JoinCode) => {
  try {
    return await Workspace.findOne({ JoinCode });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchAllWorkspaceByMemberId = async (memberId) => {
  try {
    let queryId = memberId;
    try {
      queryId = mongoose.Types.ObjectId(memberId);
    } catch (e) {
      queryId = memberId;
    }

    const workspaces = await Workspace.find({
      "members.memberId": queryId,
    })
      .populate("members.memberId")
      .populate("channels");


    return workspaces;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addMemberToWorkspaceRepo = async (workspaceId, memberId, role) => {
  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: 404,
        message: "Workspace not found",
      };
    }

    const isValidUser = await user.findById(memberId);
   
    if (!isValidUser) {
      return {
        error: true,
        status: 404,
        message: "User not found",
      };
    }

    let memberObjectId = memberId;
    try {
      memberObjectId = mongoose.Types.ObjectId(memberId);
    } catch (e) {
      memberObjectId = memberId;
    }

    const isUserpartofWorkspace = workspace.members.find(
      (m) => String(m.memberId) === String(memberObjectId)
    );

    if (isUserpartofWorkspace) {
      return {
        error: true,
        status: 400,
        message: "User already part of workspace",
      };
    }

    const toPushMemberId = (() => {
      try {
        return mongoose.Types.ObjectId(memberId);
      } catch (e) {
        return memberId;
      }
    })();

    workspace.members.push({ memberId: toPushMemberId, role });

    await workspace.save();

    return workspace;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const addChannelToWorkspace = async (workspaceName, channelId) => {
  try {

    let chId = channelId;
    try {
      chId = mongoose.Types.ObjectId(channelId);
    } catch (e) {
      chId = channelId;
    }
  return await Workspace.findOneAndUpdate(
      { workspaceName },
      { $addToSet: { channels: chId } }, 
      { new: true }
    ).populate("channels");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getWorkspaceById = async (workspaceId) => {
  try {
    const workspace = await Workspace.findById(workspaceId)
      .populate("members.memberId")
      .populate("channels");
    return workspace;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const isUserisPartofWorkspace = async (workspaceId, memberId) => {
  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return { error: true, status: 404, message: "Workspace not found" };
    }

    const isMember = workspace.members.some(
      (m) => String(m.memberId) === String(memberId)
    );

    return {
      error: false,
      status: 200,
      isMember,
    };
  } catch (error) {
    console.log(error);
    return { error: true, status: 500, message: "Server error" };
  }
};

export const resetJoinCode = async (id, JoinCode) => {
  try {
    return await Workspace.findByIdAndUpdate(
      id,
      { $set: { JoinCode } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};