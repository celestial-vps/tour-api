 

const admin = require('./firebase'); // gunakan admin yang sudah diinisialisasi

/**
 * Kirim notifikasi ke 1 client
 * @param {string} token - FCM Token dari frontend web
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi pesan notifikasi
 * @param {object} data - (Opsional) Data tambahan
 */
const fcm = async (token, title, body, data = {}) => {
  const message = {
    token,
    notification: { title, body },
    data,
    webpush: {
      notification: {
        icon: 'https://yourdomain.com/icon.png',
        click_action: 'https://yourdomain.com',
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notifikasi berhasil dikirim:', response);
    return response;
  } catch (error) {
    console.error('❌ Gagal kirim notifikasi:', error);
    throw error;
  }
};

module.exports = { fcm };
