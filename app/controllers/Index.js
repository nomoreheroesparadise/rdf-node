const Skeleton = require('../utils/Skeleton');

class IndexController {
  static index(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send(Skeleton.sayHello());
  }
}

module.exports = IndexController;
