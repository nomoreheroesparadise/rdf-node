const { Router } = require('express');
const ToDoController = require('../controllers/ToDo');

const router = new Router();

router.route('/todo')
  /**
   * @swagger
   * /todo:
   *   get:
   *     summary: Crawl RDF
   *     operationId: getToDos
   *     tags:
   *       - TODO
   *     description: Get ToDo's
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: url
   *         in: query
   *         description: How many items may be skip
   *         required: true
   *         type: string
   *         format: int32
   *     responses:
   *       200:
   *         description: Expected response to a valid request
   *         schema:
   *           $ref: '#/definitions/GetToDosResponse'
   *
   * definitions:
   *   GetToDosResponse:
   *     type: object
   *     properties:
   *       statusCode:
   *         type: number
   *         enum: [200]
   *       success:
   *         type: boolean
   *         enum: [true]
   *       data:
   *         type: array
   *         items:
   *           $ref: '#/definitions/ToDoModel'
   */
  .get((...args) => ToDoController.getToDos(...args));
router.route('/all')
  /**
   * @swagger
   * /all:
   *   get:
   *     summary: Get All Crawled RDF
   *     operationId: getToDos
   *     tags:
   *       - TODO
   *     description: Get ToDo's
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: url
   *         in: query
   *         description: How many items may be skip
   *         required: false
   *         type: string
   *         format: int32
   *     responses:
   *       200:
   *         description: Expected response to a valid request
   *         schema:
   *           $ref: '#/definitions/GetToDosResponse'
   *
   * definitions:
   *   GetToDosResponse:
   *     type: object
   *     properties:
   *       statusCode:
   *         type: number
   *         enum: [200]
   *       success:
   *         type: boolean
   *         enum: [true]
   *       data:
   *         type: array
   *         items:
   *           $ref: '#/definitions/ToDoModel'
   */
  .get((...args) => ToDoController.find(...args));
router.route('/jsonld')
   /**
   * @swagger
   * /todo:
   *   get:
   *     summary: Crawl JSON-LD
   *     operationId: getToDos
   *     tags:
   *       - TODO
   *     description: Get ToDo's
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: url
   *         in: query
   *         description: How many items may be skip
   *         required: true
   *         type: string
   *         format: int32
   *     responses:
   *       200:
   *         description: Expected response to a valid request
   *         schema:
   *           $ref: '#/definitions/GetToDosResponse'
   *
   * definitions:
   *   GetToDosResponse:
   *     type: object
   *     properties:
   *       statusCode:
   *         type: number
   *         enum: [200]
   *       success:
   *         type: boolean
   *         enum: [true]
   *       data:
   *         type: array
   *         items:
   *           $ref: '#/definitions/ToDoModel'
   */
  .get((...args) => ToDoController.getToDos(...args));

module.exports = router;
