require('dotenv').config();
// @ts-ignore
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet')
// const bankRoutes = require('./routes/bank.route');  
const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');

const countryRoutes = require('./routes/country.route');
const countryCacheRoutes = require('./routes/country-cache.route');

const provinceRoutes = require('./routes/province.route');
const provinceCacheRoutes = require('./routes/province-cache.route');

const cityRoutes = require('./routes/city.route');
const cityCacheRoutes = require('./routes/city-cache.route');

const districtRoutes = require('./routes/district.route');
const districtCacheRoutes = require('./routes/district-cache.route');

const subDistrictRoutes = require('./routes/sub-district.route');
const subDistrictCacheRoutes = require('./routes/sub-district-cache.route');

const vehicleTypeRoutes = require('./routes/vehicle-type.route');
const vehicleRoutes = require('./routes/vehicle.route');
const learningLevelRoutes = require('./routes/learning-level.route');

const hotelRoomRoutes = require('./routes/hotel-room.route');
const hotelRoutes = require('./routes/hotel.route');
const brandRoutes = require('./routes/brand.route');
const subjectCategoryRoutes = require('./routes/subject-category.route');
const subAreaRoutes = require('./routes/sub-area.route');
const travelRouteRoutes = require('./routes/travel-route.route');
const driverRoutes = require('./routes/driver.route');
const travelScheduleRoutes = require('./routes/travel-schedule.route');
const travelPromoRoutes = require('./routes/travel-promo.route');
const travelBookingRoutes = require('./routes/travel-booking.route.js');
const customerRoutes = require('./routes/customer.route');

// const bankBranchRoutes = require('./routes/bank-branch.route');
// const brandRoutes = require('./routes/brand.route');

// const customerRoutes = require('./routes/customer.route');

// const hotelRoomRoutes = require('./routes/hotel-room.route');
// const hotelRoutes = require('./routes/hotel.route');
// const imageFileRoutes = require('./routes/image-file.route');
//

// const tutorBookingRoutes = require('./routes/tutor-booking.route');
// const tutorScheduleRoutes = require('./routes/tutor-schedule.route');
// const tutorRoutes = require('./routes/tutor.route');
const userRoleRoutes = require('./routes/user-role.route');
const userRoutes = require('./routes/user.route');

const setupSwagger = require('./swagger'); // Adjust the path as needed
// @ts-ignore
// @ts-ignore
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/sequelize');
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
  origin:  ['http://localhost:4200', 'http://localhost:4300'], // Replace with your Angular app URL
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

const basePath = process.env.BASE_PATH || '/api/v1'; // Default to '/api/v1' if BASE_PATH is not set
console.log(`Server running on basePath ${basePath}`);

// @ts-ignore
sequelize.logging = console.log;

// @ts-ignore
app.use(`${basePath}/auth`, authRoutes);
// @ts-ignore
app.use(`${basePath}/bank`, bankRoutes);

// @ts-ignore
app.use(`${basePath}/country`, countryRoutes);
// @ts-ignore
app.use(`${basePath}/country-cache`, countryCacheRoutes);

// @ts-ignore
app.use(`${basePath}/province`, provinceRoutes);
// @ts-ignore
app.use(`${basePath}/province-cache`, provinceCacheRoutes);

// @ts-ignore
app.use(`${basePath}/city`, cityRoutes);
// @ts-ignore
app.use(`${basePath}/city-cache`, cityCacheRoutes);

// @ts-ignore
app.use(`${basePath}/district`, districtRoutes);
// @ts-ignore
app.use(`${basePath}/district-cache`, districtCacheRoutes);

// @ts-ignore
app.use(`${basePath}/sub-district`, subDistrictRoutes);
// @ts-ignore
app.use(`${basePath}/sub-district-cache`, subDistrictCacheRoutes);

// @ts-ignore
app.use(`${basePath}/vehicle-type`, vehicleTypeRoutes);
// @ts-ignore
app.use(`${basePath}/vehicle`, vehicleRoutes);
// @ts-ignore
app.use(`${basePath}/sub-area`, subAreaRoutes);
// @ts-ignore
app.use(`${basePath}/driver`, driverRoutes);
// @ts-ignore
app.use(`${basePath}/travel-route`, travelRouteRoutes);
// @ts-ignore
app.use(`${basePath}/travel-schedule`, travelScheduleRoutes);
// @ts-ignore
app.use(`${basePath}/travel-promo`, travelPromoRoutes);

// @ts-ignore
app.use(`${basePath}/travel-booking`, travelBookingRoutes);

// @ts-ignore
app.use(`${basePath}/hotel-room`, hotelRoomRoutes);
// @ts-ignore
app.use(`${basePath}/hotel`, hotelRoutes);
// @ts-ignore
app.use(`${basePath}/brand`, brandRoutes);
// @ts-ignore
app.use(`${basePath}/subject-category`, subjectCategoryRoutes);
// @ts-ignore
app.use(`${basePath}/learning-level`, learningLevelRoutes);

// @ts-ignore
app.use(`${basePath}/customer`, customerRoutes);

// app.use(`${basePath}/bank-branch`, bankBranchRoutes);
// app.use(`${basePath}/brand`, brandRoutes);
//
// app.use(`${basePath}/hotel-room`, hotelRoomRoutes);
// app.use(`${basePath}/hotel`, hotelRoutes);
// app.use(`${basePath}/image-file`, imageFileRoutes);
// 

// app.use(`${basePath}/tutor-booking`, tutorBookingRoutes);
// app.use(`${basePath}/tutor-schedule`, tutorScheduleRoutes);
// app.use(`${basePath}/tutor`, tutorRoutes);
// @ts-ignore
app.use(`${basePath}/user-role`, userRoleRoutes);
// @ts-ignore
app.use(`${basePath}/user`, userRoutes);



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


module.exports = app;
