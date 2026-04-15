import { getChannelwithWorkspaceDetails } from "../RepoLayer/ChannelRepo.js";
import { createMessage, getMessageDetails, getPaginatedMessages } from "../RepoLayer/messageRepo.js";
import { isUserisPartofWorkspace } from "../RepoLayer/WorkspaceRepo.js";

export const getMessagesService = async (messageParams, page, limit, user) => {
  const channelDetails = await getChannelwithWorkspaceDetails(
    messageParams.channelId,
  );

  if (!channelDetails) {
    return {
      error: true,
      message: "Channel not found",
      status: 404,
    };
  }
  const workspace = channelDetails.workspaceId;

  const isMember = isUserisPartofWorkspace(user, workspace);

  if (!isMember) {
    throw new ClientError({
      explanation: "User is not a member of the workspace",
      message: "User is not a member of the workspace",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const messages = await getPaginatedMessages(messageParams, page, limit);
  return messages;
};

export const createMessageService = async (message) => {
  const newMessage = await createMessage(message);

  const messageDetails = await getMessageDetails(newMessage._id);

  return messageDetails;
};
