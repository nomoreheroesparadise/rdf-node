const { mongoose } = require('../setup');

const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   ToDoModel:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: "58a1a542cc4b0770b6c19dfe"
 *       topic:
 *         type: string
 *         example: "Some topic"
 *         required: true
 *       body:
 *         type: string
 *         default: ""
 *       updates:
 *         type: integer
 *         default: 0
 *         example: 69
 *       createdAt:
 *         type: string
 *         format: date-time
 *         example: "2017-01-31T15:00:16.750Z"
 */
const toDoSchema = new Schema({
  url: { type: String, required: true },
  body: { type: String, required: true },
  rdfObject: { type: Object, required: true },
});

module.exports = mongoose.model('ToDo', toDoSchema);
