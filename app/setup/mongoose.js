const Promise = require('bluebird');
const mongoose = require('mongoose');
const { settings } = require('../configs');

mongoose.Promise = Promise;
mongoose.connect(settings.mongo.url, {
  useMongoClient: true, // http://mongoosejs.com/docs/connections.html#use-mongo-client
});
mongoose.set('debug', settings.mongo.debug);

module.exports = mongoose;
