const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
