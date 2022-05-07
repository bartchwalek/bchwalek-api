var express = require('express');
var vars = require('../vars');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: vars.get('title') });
});

module.exports = router;
