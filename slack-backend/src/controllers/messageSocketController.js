export default function messageHandlers(io,socket) {
    socket.on('messageFromClient', (data) => {
  console.log('message from client', data);

  io.emit('new message', data.toUpperCase());
});
}