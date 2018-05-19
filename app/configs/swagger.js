const swagger = {
  server: {
    enabled: true,
  },
  options: {
    swaggerDefinition: {
      info: {
        title: 'TODO',
        version: '1.0.0',
      },
      basePath: '/api',
      host: 'localhost:8001',
      tags: [
        {
          name: 'TODO',
          description: 'Operations on TODO\'s',
        },
      ],
      securityDefinitions: {
        bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    apis: [
      './app/models/ToDo.js',
      './app/routers/toDo.js',
    ],
  },
};

module.exports = swagger;
