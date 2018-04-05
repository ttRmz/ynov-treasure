var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
/* GET sign in page. */
router.get('/login', function(req, res, next) {
  res.render('signin');
});
/* GET sign up page. */
router.get('/register', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
