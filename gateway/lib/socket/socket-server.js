const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  io.use((socket, next) => {
    const userOid = socket.handshake.query.userOid;
    const conversationOid = socket.handshake.query.conversationOid;

    if (!userOid) {
      
      console.error('userOid is required');
      return next(new Error('userOid is required'));
    }

    socket.userOid = userOid;
    socket.conversationOid = conversationOid;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userOid}, joined conversation: ${socket.conversationOid}`);

    // Join user ke room conversation
    socket.join(socket.conversationOid);
console.log(`✅ ${socket.userOid} joined room ${socket.conversationOid}`);
    // Terima pesan dari client
    socket.on('send_message', (msg) => {
      console.log(`✅ Message received from ${socket.userOid}:`, msg);
      const messageId = uuidv4();

      // broadcast ke room conversationOid dari objek msg
      io.to(msg.conversationOid).emit('receive_message', {
        id: messageId, // ⬅️ ID dikirim ke FE
        from: msg.sender,
        text: msg.text,
        timestamp: Date.now()
      });
    });

    // Event untuk menandai pesan sudah dibaca
    socket.on('message_read', (data) => {
      console.log(`📩 Message read by ${data.from} for ${data.to}: ${data.messageText}`);

      // Broadcast ack read ke semua user dalam room
      io.to(socket.conversationOid).emit('message_read_ack', {
        from: data.from,
        to: data.to,
        messageText: data.messageText
      });
    });

    socket.on('message_like_toggle', (data) => {
      console.log('📩 Like toggled by client:', data);

      // Broadcast ke user lain dalam conversation
      io.to(data.conversationOid).emit('message_like_update', {
        messageId: data.messageId,
        liked: data.liked
      });
    });

    // Event disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userOid}`);
    });
  });
};
