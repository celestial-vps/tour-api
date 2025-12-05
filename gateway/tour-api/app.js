require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet')
// const bankRoutes = require('./routes/bank.route');  
const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');

// const countryRoutes = require('./routes/country.route');
// const countryCacheRoutes = require('./routes/country-cache.route');

// const provinceRoutes = require('./routes/province.route');
// const provinceCacheRoutes = require('./routes/province-cache.route');

// const cityRoutes = require('./routes/city.route');
// const cityCacheRoutes = require('./routes/city-cache.route');

// const districtRoutes = require('./routes/district.route');
// const districtCacheRoutes = require('./routes/district-cache.route');

// const subDistrictRoutes = require('./routes/sub-district.route');
// const subDistrictCacheRoutes = require('./routes/sub-district-cache.route');

// const vehicleTypeRoutes = require('./routes/vehicle-type.route');
// const vehicleRoutes = require('./routes/vehicle.route');
// const learningLevelRoutes = require('./routes/learning-level.route');

// const hotelRoomRoutes = require('./routes/hotel-room.route');
// const hotelRoutes = require('./routes/hotel.route');
// const brandRoutes = require('./routes/brand.route');
// const subjectCategoryRoutes = require('./routes/subject-category.route');
// const subAreaRoutes = require('./routes/sub-area.route');
// const travelRouteRoutes = require('./routes/travel-route.route');
// const driverRoutes = require('./routes/driver.route');
// const travelScheduleRoutes = require('./routes/travel-schedule.route');
// const travelPromoRoutes = require('./routes/travel-promo.route');
// const travelBookingRoutes = require('./routes/travel-booking.route.js');
// const customerRoutes = require('./routes/customer.route');
 const userRoleRoutes = require('./routes/user-role.route');
const userRoutes = require('./routes/user.route');

const setupSwagger = require('./swagger'); // Adjust the path as needed


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/sequelize');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

// @ts-ignore
app.use(helmet())

app.use(bodyParser.json());

app.use(cors({
  origin: ['http://192.168.1.6:4200', 'http://localhost:4200','http://192.168.1.6:4300', 'http://localhost:4300'], // Replace with your Angular app URL
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


app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/user-role`, userRoleRoutes);
app.use(`${basePath}/user`, userRoutes);
app.use(`${basePath}/bank`, bankRoutes);

// app.use(`${basePath}/country`, countryRoutes);
// app.use(`${basePath}/country-cache`, countryCacheRoutes);
// app.use(`${basePath}/province`, provinceRoutes);
// app.use(`${basePath}/province-cache`, provinceCacheRoutes);
// app.use(`${basePath}/city`, cityRoutes);
// app.use(`${basePath}/city-cache`, cityCacheRoutes);
// app.use(`${basePath}/district`, districtRoutes);
// app.use(`${basePath}/district-cache`, districtCacheRoutes);
// app.use(`${basePath}/sub-district`, subDistrictRoutes);
// app.use(`${basePath}/sub-district-cache`, subDistrictCacheRoutes);
// app.use(`${basePath}/vehicle-type`, vehicleTypeRoutes);
// app.use(`${basePath}/vehicle`, vehicleRoutes);
// app.use(`${basePath}/sub-area`, subAreaRoutes);
// app.use(`${basePath}/driver`, driverRoutes);
// app.use(`${basePath}/travel-route`, travelRouteRoutes);
// app.use(`${basePath}/travel-schedule`, travelScheduleRoutes);
// app.use(`${basePath}/travel-promo`, travelPromoRoutes);
// app.use(`${basePath}/travel-booking`, travelBookingRoutes);
// app.use(`${basePath}/hotel-room`, hotelRoomRoutes);
// app.use(`${basePath}/hotel`, hotelRoutes);
// app.use(`${basePath}/brand`, brandRoutes);
// app.use(`${basePath}/subject-category`, subjectCategoryRoutes);
// app.use(`${basePath}/learning-level`, learningLevelRoutes);
// app.use(`${basePath}/customer`, customerRoutes);
// 



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


module.exports = app;
