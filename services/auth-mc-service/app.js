require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.dialect);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet') 
const authRoutes = require('./routes/auth.route'); 

const fs = require('fs');
const setupSwagger = require('./swagger'); // Adjust the path as needed
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(helmet())
app.use(bodyParser.json());
app.use(cors({
  origin:  ['http://192.168.1.6:4200', 'http://localhost:4200','http://192.168.1.6:4300', 'http://localhost:4300'], // Replace with your Angular app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


setupSwagger(app); 
const uploadsDir = path.join(__dirname, 'public');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Terlalu banyak request, coba lagi nanti"
});
app.use(limiter);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URL + "/" + process.env.DATABASE;
 mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const basePath = process.env.BASE_PATH || '/api/v1'; // Default to '/api/v1' if BASE_PATH is not set
console.log(`Server running on basePath ${basePath}`);

// sequelize.logging = console.log;
app.use(`${basePath}/auth`, authRoutes);  
module.exports = app;
