import { createMessageService } from '../services/messageService.js';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT
} from '../utils/Common/eventConstants.js';

export default function messageHandlers(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    try {
      console.log("Data received in controller:", data);
      
      const { channelId } = data;
      const messageResponse = await createMessageService(data);
      
      io.to(channelId).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
      
      if (cb) {
        cb({
          success: true,
          message: 'Successfully created the message',
          data: messageResponse
        });
      }
    } catch (error) {
      console.error("Error in createMessageHandler:", error);
      // Send error back to client instead of letting the process crash
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