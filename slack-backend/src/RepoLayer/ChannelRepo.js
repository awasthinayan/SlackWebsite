import Channel from "../DBLayer/Channel.js";
import Workspace from "../DBLayer/Workspace.js";

export const createChannel = async (channelName, workspaceId) => {
  try {
    const result = await Channel.create({
      ChannelName: channelName,
      workspaceId,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getChannelByName = async (channelName) => {
  try {
    return await Channel.findOne({ ChannelName: channelName });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllChannel = async () => {
  try {
    const result = await Channel.find();
    console.log("result", result);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const updateWorkspaceAddChannel = async (workspaceId, channelId) => {
  try {
    return await Workspace.findByIdAndUpdate(
      workspaceId,
      { $push: { channels: channelId } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

