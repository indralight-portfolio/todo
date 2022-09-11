const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'TODO-API',
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    }, // ADD THIS LINE!!!
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['app.js', './routes/*.js'],
};

const spec = swaggerJsDoc(options);

module.exports = { swaggerUi, spec };
