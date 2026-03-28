import {getChannelwithWorkspaceDetails} from "../RepoLayer/ChannelRepo.js";

export const getMessagesService = async (messageParams, page, limit, user) => {
 const channelDetails = await getChannelwithWorkspaceDetails(messageParams.channelId);

  const workspace = channelDetails.workspaceId;

  const isMember = isUserisPartofWorkspace(user, workspace);

  if (!isMember) {
    throw new ClientError({
      explanation: 'User is not a member of the workspace',
      message: 'User is not a member of the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }

  const messages = await getPaginatedMessages(
    messageParams,
    page,
    limit
  );
  return messages;
};

