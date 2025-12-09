// // ../lib/fcm/fcm.js
// const admin = require('firebase-admin');
// const serviceAccount = require('../../path/to/serviceAccountKey.json'); // ganti dengan path service account-mu

// // Inisialisasi Firebase Admin
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// /**
//  * Mengirim notifikasi ke token tertentu
//  * @param {string} token - FCM device token
//  * @param {string} title - Judul notifikasi
//  * @param {string} body - Isi notifikasi
//  * @param {object} data - Data tambahan opsional
//  */
// async function sendNotification(token, title, body, data = {}) {
//   const message = {
//     token,
//     notification: {
//       title,
//       body,
//     },
//     data: data, // opsional
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     return response; // mengembalikan messageId
//   } catch (error) {
//     throw error;
//   }
// }

// module.exports = { sendNotification };
