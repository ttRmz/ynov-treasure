var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		var isAuthenticated = req.isAuthenticated();
		res.render('home', {authenticated: isAuthenticated});
	}
}

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('index', {authenticated: isAuthenticated});
});
router.get('/home', ensureAuthenticated, function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('home', {authenticated: isAuthenticated});
});

// Get Account page
router.get('/account', ensureAuthenticated, function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('account', {authenticated: isAuthenticated});
});

// Get Stats page
router.get('/stats', ensureAuthenticated, function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('stats', {authenticated: isAuthenticated});
});

// Get Game page
router.get('/game', ensureAuthenticated, function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('game', {authenticated: isAuthenticated});
});

// Get About page
router.get('/about', function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('team', {authenticated: isAuthenticated});
});

module.exports = router;
