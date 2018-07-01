const Promise = require('bluebird');
const { visitPage, flushAllUrls } = require('../utils/Crawler');
const ToDoModel = require('../models/ToDo');


class ToDoController {
  static getToDos(req, res, next) {
    const { url, onlyDomain, limit } = req.query;
    const type = 'rdf';
    console.log('Started crawling: ', Date.now())
    Promise.resolve(flushAllUrls())
      .then(visitPage(url, type, onlyDomain, limit))
      .then(res.jsonOk());

    next();
  }

  static find(req, res, next) {
    ToDoModel.find({})
      .then(data => res.jsonOk({ data }));
    next();
  }

  static getJsonLd(req, res, next) {
    const { url, onlyDomain, limit } = req.query;
    const type = 'jsonld';
    console.log('Started crawling: ', Date.now())
    Promise.resolve(flushAllUrls())
      .then(visitPage(url, type, onlyDomain, limit))
      .then(res.jsonOk());

    next();
  }
}
module.exports = ToDoController;
