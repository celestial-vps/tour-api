module.exports = (io) => {
  io.use((socket, next) => {
    const userOid = socket.handshake.query.userOid;
    const conversationOid = socket.handshake.query.conversationOid;

    if (!userOid) {
      return next(new Error('userOid is required'));
    }

    socket.userOid = userOid;
    socket.conversationOid = conversationOid;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userOid}, joined conversation: ${socket.conversationOid}`);

    // User join ke room conversation
    socket.join(socket.conversationOid);


    // socket.on('send_message', (msg) => {
    //   console.log(`Message from ${socket.userOid}:`, msg);
    //   // broadcast ke semua kecuali sender
    //   socket.broadcast.emit('receive_message', { from: socket.userOid, text: msg });
    // });

    socket.on('send_message', async  (msg) => {
      console.log(`Message from ${socket.userOid} in ${socket.conversationOid}:`, msg);

      // TODO SAVE TO DB
      // await prisma.message.create({
      //   data: {
      //     conversationId: conversationOid,
      //     senderId: sender,
      //     text: text,
      //     timestamp: new Date()
      //   }
      // });


      // Kirim ke semua user dalam conversation room, termasuk sender kalau perlu
      io.to(socket.conversationOid).emit('receive_message', {
        from: socket.userOid,
        text: msg,
        conversationOid: socket.conversationOid
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userOid}`);
    });
  });

  // io.on('connection', (socket) => {
  //   console.log(`User connected: ${socket.userOid}`);

  //   // Join semua room yang user ini anggota
  //   // joinUserRooms(socket);

  //   // Handle pesan
  //   // messageHandler(io, socket);

  //   socket.on('disconnect', () => {
  //     console.log(`User disconnected: ${socket.userOid}`);
  //   });
  // });
};
