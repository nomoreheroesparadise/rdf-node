const HTTPStatus = require('http-status');

function response(data, statusCode) {
  return {
    statusCode,
    success: true,
    data,
  };
}

/**
 * @swagger
 * definitions:
 *   GenericOK:
 *     type: object
 *     properties:
 *       statusCode:
 *         type: number
 *         default: 200
 *         example: 200
 *       success:
 *         type: boolean
 *         enum: [true]
 *   GenericCreated:
 *     type: object
 *     properties:
 *       statusCode:
 *         type: number
 *         default: 201
 *         example: 201
 *       success:
 *         type: boolean
 *         enum: [true]
 */
function jsonOk(data, statusCode = HTTPStatus.OK) {
  this.status(statusCode).json(response(data, statusCode));
}

function assignJsonOk(req, res, next) {
  Object.assign(res, { jsonOk });
  next();
}

module.exports = assignJsonOk;
