import Message from "../DBLayer/MessageSchema";

export const getPaginatedMessages = async (messageParams, page, limit) => {
    try {
        const messages = await Message.find(messageParams)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId','username email')

      return messages;
    } catch (error) {
        res.status(500).json({ error: 'Error getting messages' });
    }
};

export const getMessageDetails = async (messageId) =>{
    try {
        const message = await Message.findById(messageId).populate(
        'senderId',
        'username email'
    );
    return message;
    }
    catch(error){
        res.status(500).json({ error: 'Error getting message details' });
    }
}

export const createMessage = async (message) => {
    try {
        const newMessage = await Message.create(message);
        return newMessage;
    } catch (error) {
        res.status(500).json({ error: 'Error creating message' });
    }
};

export const updateMessage = async (messageId, message) => {
    try {
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            message,
            { new: true }
        );
        return updatedMessage;
    } catch (error) {
        res.status(500).json({ error: 'Error updating message' });
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(messageId);
        return deletedMessage;
    } catch (error) {
        res.status(500).json({ error: 'Error deleting message' });
    }
};