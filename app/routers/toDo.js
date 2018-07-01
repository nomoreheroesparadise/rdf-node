const { Router } = require('express');
const ToDoController = require('../controllers/ToDo');

const router = new Router();

router.route('/rdf')
  /**
   * @swagger
   * /rdf:
   *   get:
   *     summary: Crawl RDF
   *     operationId: getToDos
   *     tags:
   *       - RDF
   *     description: Crawl RDF and JSON-ld
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: url
   *         in: query
   *         description: Url that we start to RDF crawl at
   *         required: true
   *         type: string
   *         default: http://dbpedia.org/resource/Nanyue_Huisi
   *       - name: limit
   *         in: query
   *         description: Limit that we stop JSON-LD crawl at
   *         required: true
   *         type: integer
   *         default: 10
   *       - name: onlyDomain
   *         in: query
   *         description: Should we crawl only domain
   *         required: true
   *         type: boolean
   *         default: true
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


router.route('/jsonld')
   /**
   * @swagger
   * /jsonld:
   *   get:
   *     summary: Crawl JSON-LD
   *     operationId: getToDos
   *     tags:
   *       - RDF
   *     description: Crawl RDF and JSON-ld
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: url
   *         in: query
   *         description: Url that we start to JSON-LD crawl at
   *         required: true
   *         type: string
   *         default: https://jsonld-examples.com/schema.org/code/webpage-markup.php
   *       - name: limit
   *         in: query
   *         description: Limit that we stop JSON-LD crawl at
   *         required: true
   *         type: integer
   *         default: 10
   *       - name: onlyDomain
   *         in: query
   *         description: Should we crawl only domain
   *         required: true
   *         type: boolean
   *         default: true
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
  .get((...args) => ToDoController.getJsonLd(...args));

module.exports = router;
