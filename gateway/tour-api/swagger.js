const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Define the Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'A description of my API',
  },
  servers: [
    {
      url: `${process.env.BASE_PATH + ':' + process.env.PORT  || '/api/v1'}`, // Base path only
      description: 'Development server',
    },
  ],
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js'], // Adjust the paths as necessary
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  const basePath = process.env.BASE_PATH || '/api/v1';
  if (process.env.NODE_ENV !== 'production') {
    // app.use('${basePath}/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(`${basePath}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('✅ Swagger Docs available at /api-docs');
  } else {
    console.log('⚠️ Swagger is disabled in production mode');
  }
}
module.exports = setupSwagger;
