require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet')
const errorHandler = require('./middleware/error-handler');

const imageFileRoutes = require('./routes/image-file.route');
 
const setupSwagger = require('./swagger'); // Adjust the path as needed
// @ts-ignore
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/sequelize');
const app = express();
// app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from /public under /public path
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
// @ts-ignore
app.use(helmet())
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your Angular app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


setupSwagger(app);
// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'public');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// @ts-ignore
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Terlalu banyak request, coba lagi nanti"
});
app.use(limiter);

const basePath = process.env.BASE_PATH || '/api/v1'; // Default to '/api/v1' if BASE_PATH is not set
console.log(`Server running on basePath ${basePath}`);

// @ts-ignore
sequelize.logging = console.log;
 
app.use(`${basePath}/image-file`, imageFileRoutes);
 
app.use(errorHandler);


module.exports = app;
