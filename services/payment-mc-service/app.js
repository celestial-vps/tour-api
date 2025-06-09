const express = require('express');
const app = express();
const paymentRoutes = require('./routes/payment.routes');
require('dotenv').config();

app.use(express.json());
app.use('/api/payments', paymentRoutes);

// Error handler global (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
