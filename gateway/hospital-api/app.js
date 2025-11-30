const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');
const setupSwagger = require('./swagger');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(cors({
  origin: [
    'http://192.168.1.6:4200', 'http://localhost:4200',
    'http://192.168.1.6:4300', 'http://localhost:4300'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

setupSwagger(app);

const uploadsDir = path.join(__dirname, 'public');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak request, coba lagi nanti"
});
app.use(limiter);

const basePath = process.env.BASE_PATH || '/api/v1';
console.log(`Server running on basePath ${basePath}`);

app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/bank`, bankRoutes);

module.exports = app;
