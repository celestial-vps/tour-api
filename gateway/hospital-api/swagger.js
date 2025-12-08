const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const PORT = process.env.PORT || 5103;
const BASE_PATH = process.env.BASE_PATH || '/api/v1';

// Define the Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: process.env.Title || 'My API',
    version: process.env.Version || '1.0.0',
    description: process.env.Description || 'API Documentation',
  },

  components: {
    schemas: global.swaggerComponents || {}
  },
  servers: [
    {
      url: `http://localhost:${PORT}${BASE_PATH}`,   // ← FIXED
      description: 'Development server',
    },
  ],
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  // Hanya route aktif yang ingin didokumentasikan
  apis: [
    './routes/image-file.route.js',
    './routes/bank.route.js',
    './routes/bed.route.js',
    './routes/billing.route.js',
    './routes/departement.route.js',
    './routes/diseases.route.js',
    './routes/doctor.route.js',
    './routes/lab-test.route.js',
    './routes/medication-category.route.js',
    './routes/medication.route.js',
    './routes/medicine.route.js',
    './routes/patient-lab-test.route.js',
    './routes/patient-medical-record.route.js',
    './routes/patient.route.js',
    './routes/prescription.route.js',
    './routes/queue.route.js',
    './routes/room.route.js',
    './routes/specialization.route.js',
    './routes/treatment.route.js',
    './routes/user.route.js',
    './routes/user-role.route.js',
    './routes/auth.route.js',
    './controllers/*.js', // jika ingin dokumentasi tambahan di controller
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  if (process.env.NODE_ENV !== 'production') {
    app.use(`${BASE_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log(`✅ Swagger Docs available at http://localhost:${PORT}${BASE_PATH}/api-docs`);
  } else {
    console.log('⚠️ Swagger is disabled in production mode');
  }
}

module.exports = setupSwagger;
