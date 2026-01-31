const db = require('../../models');
const ConversationMember = require('../../models/conversation-member');

/**
 * Memasukkan user ke semua room (conversation) yang ia ikuti
 */
async function joinUserRooms(socket) {
    try {
        const userOid = socket.userOid;
        if (!userOid) {
            console.error('joinUserRooms: userOid tidak tersedia di socket');
            return;
        }

        // Cari semua room/conversation yang user ini anggota
        const memberships = await ConversationMember.findAll({
            where: { userOid }
        });

        memberships.forEach((membership) => {
            // const roomId = membership.conversationOid;
            const roomId = membership.get('conversationOid');
            if (roomId) {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
            }
        });
    } catch (error) {
        console.error('joinUserRooms error:', error);
    }
}

/**
 * Handler semua logic chat user
 */
module.exports = (io, socket) => {
    // Masukkan user ke semua room conversation
    //   joinUserRooms(socket);

    //   // Saat user mengirim pesan
    //   socket.on('send_message', async (data) => {
    //     try {
    //       const { conversationOid, message } = data;

    //       // Validasi sederhana
    //       if (!conversationOid || !message) {
    //         return socket.emit('error', { message: 'conversationOid dan message wajib diisi.' });
    //       }

    //       // Simpan pesan ke DB
    //       const newMessage = await db.Message.create({
    //         conversationOid,
    //         senderOid: socket.userOid,
    //         message
    //       });

    //       // Broadcast ke semua user di room conversation
    //       io.to(conversationOid).emit('receive_message', {
    //         message: {
    //           oid: newMessage.oid,
    //           conversationOid: newMessage.conversationOid,
    //           senderOid: newMessage.senderOid,
    //           message: newMessage.message,
    //           createdAt: newMessage.createdAt
    //         }
    //       });

    //     } catch (err) {
    //       console.error('❌ Error in send_message:', err);
    //       socket.emit('error', { message: 'Terjadi kesalahan saat mengirim pesan.' });
    //     }
    //   });
};
