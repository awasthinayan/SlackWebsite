import Message from "../DBLayer/MessageSchema.js";

export const getPaginatedMessages = async (messageParams, page, limit) => {
  try {
    const messages = await Message.find(messageParams)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("SenderId", "username email")
      .populate("RecipientId", "username email");

    return messages;
  } catch (error) {
    console.error("Error in getPaginatedMessages Repo:", error);
    throw error;
  }
};

export const getMessageDetails = async (messageId) => {
  try {
    const message = await Message.findById(messageId)
      .populate("SenderId", "username email")
      .populate("RecipientId", "username email");
    return message;
  } catch (error) {
    console.error("Error in getMessageDetails Repo:", error);
    throw error;
  }
};

export const createMessage = async (messageData) => {
  try {
    const newMessage = await Message.create(messageData);

    return await newMessage.populate([
      { path: "SenderId", select: "username email" },
      { path: "RecipientId", select: "username email" },
    ]);
  } catch (error) {
    console.error("Error in createMessage Repo:", error);
    throw error;
  }
};

export const updateMessage = async (messageId, messageData) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      messageData,
      {
        new: true,
      },
    )
      .populate("SenderId", "username email")
      .populate("RecipientId", "username email");

    return updatedMessage;
  } catch (error) {
    console.error("Error in updateMessage Repo:", error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    return deletedMessage;
  } catch (error) {
    console.error("Error in deleteMessage Repo:", error);
    throw error;
  }
};
