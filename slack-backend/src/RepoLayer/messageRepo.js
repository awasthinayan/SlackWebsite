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