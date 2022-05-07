var express = require('express');
var router = express.Router();

router.use(express.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.json({users: 1});
});

module.exports = router;
