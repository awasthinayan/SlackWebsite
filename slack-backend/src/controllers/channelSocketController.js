import {
  JOIN_CHANNEL,
  USER_STOPPED_TYPING_EVENT,
  USER_TYPING_EVENT,
} from '../utils/Common/eventConstants.js';

export default function messageHandlers(io, socket) {
  socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
    const roomId = data.channelId;
    socket.join(roomId);
    // console.log(`User ${socket.id} joined the channel: ${roomId}`);
    cb?.({
      success: true,
      message: 'Successfully joined the channel',
      data: roomId
    });
  });

  socket.on(USER_TYPING_EVENT, (data) => {
    if (!data?.channelId) return;

    socket.data.userId = data.userId;
    socket.data.userName = data.userName;
    socket.to(data.channelId).emit(USER_TYPING_EVENT, data);
  });

  socket.on(USER_STOPPED_TYPING_EVENT, (data) => {
    if (!data?.channelId) return;

    socket.data.userId = data.userId;
    socket.data.userName = data.userName;
    socket.to(data.channelId).emit(USER_STOPPED_TYPING_EVENT, data);
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue;

      socket.to(roomId).emit(USER_STOPPED_TYPING_EVENT, {
        channelId: roomId,
        userId: socket.data?.userId,
        userName: socket.data?.userName,
      });
    }
  });
}
