const express = require('express');
const { sendNotification } = require('../lib/fcm/fcm');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { token, title, body, data } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ message: 'Token, title, dan body wajib diisi' });
  }

  try {
    const response = await sendNotification(token, title, body, data);
    res.status(200).json({ message: 'Notifikasi dikirim', response });
  } catch (err) {
    res.status(500).json({ message: 'Gagal kirim notifikasi', error: err.toString() });
  }
});

module.exports = router;
