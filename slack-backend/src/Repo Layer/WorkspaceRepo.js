// Repo Layer (Data Access Layer)
import Workspace from "../DB Layer/Workspace.js";

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
      { new: true },
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
    return await Workspace.find({
      members: { $elemMatch: { memberId } },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addMemberToWorkspace = async (workspaceName, memberId, role) => {
  try {
    return await Workspace.findOneAndUpdate(
      { workspaceName },
      { $push: { members: { memberId, role } } },
      { new: true },
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addChannelToWorkspace = async (workspaceName, channelName) => {
  try {
    return await Workspace.findOneAndUpdate(
      { workspaceName },
      { $push: { channels: channelName } },
      { new: true },
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
