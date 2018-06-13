const bodyParser = require('body-parser');
const consoleRequestLogger = require('morgan');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const appRouter = require('./app/routers');
const { jsonOk, swagger } = require('./app/utils');

const {
  settings,
  swagger: swaggerSettings,
} = require('./app/configs');

const app = express();

const swaggerRouter = swagger.createSwagger(swaggerSettings);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(consoleRequestLogger('combined'));
app.use(jsonOk);
app.use(appRouter);

app.use(swaggerRouter);

app.listen(settings.server.port, () => {
  console.log(`Service started on port ${settings.server.port}`);
});

module.exports = app;
