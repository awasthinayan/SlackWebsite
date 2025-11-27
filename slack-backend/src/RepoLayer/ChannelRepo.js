import Channel from "../DBLayer/Channel.js";

export const createChannel = async (channelName) => {
  try {
    return await Channel.create({ ChannelName: channelName });
  } catch (error) {
    console.log(error);
    return null;
  }
};
