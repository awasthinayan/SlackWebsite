import { createMessageService } from '../services/messageService.js';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT,
  USER_STOPPED_TYPING_EVENT
} from '../utils/Common/eventConstants.js';

export default function messageHandlers(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    try {
      const { channelId } = data;
      const messageResponse = await createMessageService(data);
      const roomId = data?.isDirect ? data?.conversationId : channelId;
      
      io.to(roomId).emit(NEW_MESSAGE_RECEIVED_EVENT, {
        roomId,
        message: messageResponse,
        isDirect: Boolean(data?.isDirect),
      });
      socket.to(roomId).emit(USER_STOPPED_TYPING_EVENT, {
        channelId: roomId,
        userId: data?.SenderId,
      });
      
      if (cb) {
        cb({
          success: true,
          message: 'Successfully created the message',
          data: messageResponse
        });
      }
    } catch (error) {
      console.error("Error in createMessageHandler:", error);
      if (cb) {
        cb({
          success: false,
          message: 'Failed to create message',
          error: error.message
        });
      }
    }
  });
}
