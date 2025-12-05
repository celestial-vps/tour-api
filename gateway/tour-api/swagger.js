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
