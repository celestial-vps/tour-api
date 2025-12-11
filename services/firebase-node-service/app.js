require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet')

const notification = require('./routes/notification-route');
const auth = require('./routes/auth-route');


const setupSwagger = require('./swagger');
const path = require('path');
const fs = require('fs');
// const sequelize = require('./config/sequelize');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
require('./misc/datetime');
app.use(express.json());
// @ts-ignore
app.use(helmet())
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your Angular app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


setupSwagger(app);
// @ts-ignore
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const basePath = process.env.BASE_PATH || '/api/v1'; // Default to '/api/v1' if BASE_PATH is not set
console.log(`Server running on basePath ${basePath}`);
// @ts-ignore
// sequelize.logging = console.log; 

app.use(`${basePath}/notification`, notification);
app.use(`${basePath}/auth`, auth);

module.exports = app;
