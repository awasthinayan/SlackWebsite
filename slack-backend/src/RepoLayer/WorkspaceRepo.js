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
    const updateWorskpace = await Workspace.findOneAndUpdate(
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
    // try to cast to ObjectId when possible to ensure matching against stored ObjectIds
    let queryId = memberId;
    try {
      queryId = mongoose.Types.ObjectId(memberId);
    } catch (e) {
      // if casting fails, fall back to the original value (could already be an ObjectId)
      queryId = memberId;
    }

    const workspaces = await Workspace.find({
      "members.memberId": queryId,
    })
      .populate("members.memberId")
      .populate("channels");

    console.log(
      "id in repo",
      memberId,
      " -> found workspaces:",
      workspaces.length
    );
    // debug: list member ids in returned workspaces
    workspaces.forEach((ws) => {
      console.log(
        "workspace",
        ws.workspaceName,
        "members:",
        ws.members.map((m) => String(m.memberId))
      );
    });

    return workspaces;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addMemberToWorkspace = async (workspaceId, memberId, role) => {
  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return {
        error: true,
        status: 404,
        message: "Workspace not found",
      };
    }

    // findById accepts the id value (string or ObjectId) directly
    const isValidUser = await user.findById(memberId);

    if (!isValidUser) {
      return {
        error: true,
        status: 404,
        message: "User not found",
      };
    }

    // normalize and compare as strings to handle ObjectId vs string
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

    // ensure we store an ObjectId when possible
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
    // cast channelId to ObjectId when possible
    let chId = channelId;
    try {
      chId = mongoose.Types.ObjectId(channelId);
    } catch (e) {
      chId = channelId;
    }

    return await Workspace.findOneAndUpdate(
      { workspaceName },
      { $push: { channels: chId } },
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
