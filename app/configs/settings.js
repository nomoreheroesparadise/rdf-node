const settings = {
  environment: 'dev',
  server: {
    port: 8001,
  },
  mongo: {
    url: 'mongodb://172.19.0.5:27017/semanticWeb',
    debug: false,
  },
  logDirectory: './log',
};

module.exports = settings;
