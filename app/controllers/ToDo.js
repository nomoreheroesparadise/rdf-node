const Promise = require('bluebird');
const { visitPage, flushAllUrls } = require('../utils/Crawler');
const ToDoModel = require('../models/ToDo');


class ToDoController {
  static getToDos(req, res, next) {
    const { url } = req.query;
    const type = 'rdf';

    Promise.resolve(flushAllUrls())
      .then(visitPage(url, type))
      .then(res.jsonOk());

    next();
  }

  static find(req, res, next) {
    ToDoModel.find({})
      .then(data => res.jsonOk({ data }));
    next();
  }

  static getJsonLd(req, res, next) {
    const { url } = req.query;
    const type = 'jsonld';

    Promise.resolve(flushAllUrls())
      .then(visitPage(url, type))
      .then(res.jsonOk());

    next();
  }
}
module.exports = ToDoController;
