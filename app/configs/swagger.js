const swagger = {
  server: {
    enabled: true,
  },
  options: {
    swaggerDefinition: {
      info: {
        title: 'RDF and JSONld',
        version: '1.0.0',
      },
      basePath: '/api',
      host: 'localhost:8001',
      tags: [
        {
          name: 'RDF',
          description: 'Crawl RDF and JSON-ld ',
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
