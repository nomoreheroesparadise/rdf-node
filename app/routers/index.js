const IndexController = require('../controllers/Index');
const { Router } = require('express');
const toDo = require('./toDo');

const router = new Router();
router.use('/api', toDo);

router.route('/')
  .get((...args) => IndexController.index(...args))
;

module.exports = router;
