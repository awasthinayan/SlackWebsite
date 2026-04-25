import { getChannelwithWorkspaceDetails } from "../RepoLayer/ChannelRepo.js";
import { createMessage, getMessageDetails, getPaginatedMessages } from "../RepoLayer/messageRepo.js";
import { isUserisPartofWorkspace } from "../RepoLayer/WorkspaceRepo.js";
import { getuserbyId } from "../RepoLayer/userRepo.js";

const buildDirectConversationId = (workspaceId, userA, userB) => {
  return [
    String(workspaceId),
    String(userA),
    String(userB),
  ].sort().join(":");
};

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

export const getDirectMessagesService = async (
  { workspaceId, memberId },
  page,
  limit,
  user,
) => {
  const currentMemberCheck = await isUserisPartofWorkspace(
    workspaceId,
    user._id,
  );
  if (!currentMemberCheck?.isMember) {
    return {
      error: true,
      message: "User is not a member of the workspace",
      status: 403,
    };
  }

  const otherMemberCheck = await isUserisPartofWorkspace(workspaceId, memberId);
  if (!otherMemberCheck?.isMember) {
    return {
      error: true,
      message: "Member is not part of the workspace",
      status: 404,
    };
  }

  const otherMember = await getuserbyId(memberId);
  if (!otherMember) {
    return {
      error: true,
      message: "Member not found",
      status: 404,
    };
  }

  const conversationId = buildDirectConversationId(
    workspaceId,
    user._id,
    memberId,
  );

  const messages = await getPaginatedMessages(
    {
      WorkspaceId: workspaceId,
      conversationId,
      isDirect: true,
    },
    page,
    limit,
  );

  return {
    conversationId,
    member: otherMember,
    messages,
  };
};
