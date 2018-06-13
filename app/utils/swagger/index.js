const Router = require('express').Router;
const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const fs = require('fs');

function createSwagger(swagger) {
  if (!swagger || !swagger.server || !swagger.server.enabled) {
    return new Router();
  }

  const swaggerSpec = swaggerJSDoc(swagger.options);
  const swaggerRouter = new Router();
  const swaggerUiDistPath = require.resolve('swagger-ui-dist').split('/').slice(0, -1).join('/');

  swaggerRouter.all('/doc/swagger', (req, res, next) => {
    if (req.path.slice(-1) !== '/') {
      res.redirect('/doc/swagger/');
      return;
    }

    next();
  });

  swaggerRouter.route('/doc/swagger/')
    .get((req, res) => {
      const index = fs.readFileSync(`${swaggerUiDistPath}/index.html`, 'utf8')
        .replace(
          '"http://petstore.swagger.io/v2/swagger.json"',
          '"/doc/swagger/api-doc.json"'
        )
      ;
      res.send(index);
    });

  swaggerRouter.route('/doc/swagger/api-doc.json')
    .get((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

  swaggerRouter.use('/doc/swagger/', express.static(swaggerUiDistPath));

  return swaggerRouter;
}

module.exports = { createSwagger };
