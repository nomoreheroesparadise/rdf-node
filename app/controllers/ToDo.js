const HTTPStatus = require('http-status');
const Promise = require('bluebird');
const { visitPage } = require('../utils/Crawler');
const ToDoModel = require('../models/ToDo');


class ToDoController {
  static getToDos(req, res, next) {
    const { url } = req.query;

    Promise.resolve(visitPage(url))
      .then(res.jsonOk());

    next();
  }

  static find(req, res, next) {
    ToDoModel.find({})
      .then(data => res.jsonOk({ data }));
    next();
  }
}
module.exports = ToDoController;
