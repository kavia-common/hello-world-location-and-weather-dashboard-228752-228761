const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World Location & Temperature API',
      version: '1.0.0',
      description: 'Express API for Hello World, IP-based location (placeholder), and temperature (mock), with request logging to SQLite.',
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
