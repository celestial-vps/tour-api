// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const BASE_PATH = process.env.BASE_PATH || '/api/v1';
const PORT = process.env.PORT || 5101;

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'A description of my API',
  },
  servers: [
    {
      url: `http://localhost:${PORT}${BASE_PATH}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  // Hanya route aktif yang ingin didokumentasikan
  apis: [
    './routes/auth.route.js',
    './routes/bank.route.js',
    './routes/country.route.js',
    './routes/country-cache.route.js',
    './routes/province.route.js',
    './routes/province-cache.route.js',
    './routes/city.route.js',
    './routes/city-cache.route.js',
    './routes/district.route.js',
    './routes/district-cache.route.js',
    './routes/sub-district.route.js',
    './routes/sub-district-cache.route.js',
    './routes/vehicle-type.route.js',
    './routes/vehicle.route.js',
    './routes/learning-level.route.js',
    './routes/hotel-room.route.js',
    './routes/hotel.route.js',
    './routes/brand.route.js',
    './routes/subject-category.route.js',
    './routes/sub-area.route.js',
    './routes/travel.route.js',
    './routes/driver.route.js',
    './routes/travel-schedule.route.js',
    './routes/travel-promo.route.js',
    './routes/travel-booking.route.js',
    './routes/customer.route.js',
    './routes/user.route.js',
    './routes/user-role.route.js',
    './controllers/*.js', // jika ingin dokumentasi tambahan di controller
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Function to setup Swagger
function setupSwagger(app) {
  if (process.env.NODE_ENV !== 'production') {
    app.use(`${BASE_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`✅ Swagger Docs available at ${BASE_PATH}/api-docs`);
  } else {
    console.log('⚠️ Swagger is disabled in production mode');
  }
}

module.exports = setupSwagger;
