const envConfig = require('../utils/envConfig');
const settingsConf = require('./settings');
const swaggerConf = require('./swagger');
const servicesConf = require('./services');
const loggerConf = require('./logger');

const settings = envConfig('SEMANTICWEB', settingsConf);
const swagger = envConfig('SWAGGER', swaggerConf);
const services = envConfig('SERVICES', servicesConf);
const logger = envConfig('LOGGER', loggerConf);


module.exports = {
  settings,
  swagger,
  services,
  logger,
};
