const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/pdamdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Router sementara
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
