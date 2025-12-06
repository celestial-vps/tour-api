require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.dialect);

// @ts-ignore
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet')
// const bankRoutes = require('./routes/bank.route');  
const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');  
const itemRoutes = require('./routes/item.route');
const auctionRoutes = require('./routes/auction.route');
const itemCategoryRoutes = require('./routes/item-category.route');
const userRoleRoutes = require('./routes/user-role.route');
const userRoutes = require('./routes/user.route');
const imageFileRoutes = require('./routes/image-file.route');

const fs = require('fs');
const setupSwagger = require('./swagger'); // Adjust the path as needed
// @ts-ignore
// @ts-ignore
const multer = require('multer');
const path = require('path');
// const fs = require('fs');
// const sequelize = require('./config/sequelize');
const app = express();
// @ts-ignore
app.use(express.static(path.join(__dirname, 'public')));

// @ts-ignore
app.use(express.json());
// @ts-ignore
app.use(helmet())
// @ts-ignore
app.use(bodyParser.json());
// @ts-ignore
app.use(cors({
  origin:  ['http://192.168.1.6:4200', 'http://localhost:4200','http://192.168.1.6:4300', 'http://localhost:4300'], // Replace with your Angular app URL
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
// @ts-ignore
app.use(limiter);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URL + "/" + process.env.DATABASE;
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const basePath = process.env.BASE_PATH || '/api/v1'; // Default to '/api/v1' if BASE_PATH is not set
console.log(`Server running on basePath ${basePath}`);



// @ts-ignore
// sequelize.logging = console.log;
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/item-category`, itemCategoryRoutes);  
app.use(`${basePath}/auction`, auctionRoutes);  
app.use(`${basePath}/item`, itemRoutes);  
app.use(`${basePath}/bank`, bankRoutes);
app.use(`${basePath}/user-role`, userRoleRoutes);
app.use(`${basePath}/user`, userRoutes);
 
app.use(`${basePath}/image-file`, imageFileRoutes);
module.exports = app;
