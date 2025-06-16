require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet')
// const bankRoutes = require('./routes/bank.route');  
const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');

const countryRoutes = require('./routes/country.route');
const provinceRoutes = require('./routes/province.route');
const cityRoutes = require('./routes/city.route');
const districtRoutes = require('./routes/district.route');
const subDistrictRoutes = require('./routes/sub-district.route');

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
// const userRoleRoutes = require('./routes/user-role.route');
// const userRoutes = require('./routes/user.route');
// const vehicleTypeRoutes = require('./routes/vehicle-type.route');
// const vehicleRoutes = require('./routes/vehicle.route');

const setupSwagger = require('./swagger'); // Adjust the path as needed
// @ts-ignore
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

app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/bank`, bankRoutes);

app.use(`${basePath}/country`, countryRoutes);
app.use(`${basePath}/province`, provinceRoutes);
app.use(`${basePath}/city`, cityRoutes);
app.use(`${basePath}/district`, districtRoutes);
app.use(`${basePath}/sub-district`, subDistrictRoutes);

// app.use(`${basePath}/bank-branch`, bankBranchRoutes);
// app.use(`${basePath}/brand`, brandRoutes);
// app.use(`${basePath}/customer`, customerRoutes);
// app.use(`${basePath}/hotel-room`, hotelRoomRoutes);
// app.use(`${basePath}/hotel`, hotelRoutes);
// app.use(`${basePath}/image-file`, imageFileRoutes);
// 

// app.use(`${basePath}/tutor-booking`, tutorBookingRoutes);
// app.use(`${basePath}/tutor-schedule`, tutorScheduleRoutes);
// app.use(`${basePath}/tutor`, tutorRoutes);
// app.use(`${basePath}/user-role`, userRoleRoutes);
// app.use(`${basePath}/user`, userRoutes);
// app.use(`${basePath}/vehicle-type`, vehicleTypeRoutes);
// app.use(`${basePath}/vehicle`, vehicleRoutes);


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


module.exports = app;
