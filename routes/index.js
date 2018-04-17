var express = require('express');
var chasseSchema = require('../models/chasse.js');
var chasseController = require('../controllers/chasse.js');
var router = express.Router();


router.get('/', ensureAuthenticated, function(req, res){
	var isAuthenticated = req.isAuthenticated();
	let p = {playername: req.user.username}
	chasseSchema.find({}, (err, c) => {
		chasseSchema.find({playersin: {$elemMatch: p}}).exec( (err, found) => {
			if(found.length != 0){
				chasseController.checkStep(c[0].name, req.user.username).then( alpha => {
					if(alpha.length == 0){
						res.render('index', {authenticated: isAuthenticated, chasse: c[0], joined: true, complete: true});
					}else{
						res.render('index', {authenticated: isAuthenticated, chasse: c[0], joined: true, complete: false});
					}
				})
				
			}else{
				res.render('index', {authenticated: isAuthenticated, chasse: c[0], joined: false});
			}
			
		})
	});
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
	let p = {playername: req.user.username}
	var chasse;
	chasseController.findChasseByUsername(p).then( data => {
		chasseController.checkStep(data[0].name, req.user.username).then( alpha => {	
			if(alpha.length == 0){
				res.render('game', {authenticated: isAuthenticated, finished: true,chasse: alpha[0]});
				//console.log("if : "+ alpha)
			}else{
				res.render('game', {authenticated: isAuthenticated, finished: false,chasse: alpha[0]});
				//console.log(alpha)
			}
		})
	})
	
	//
});

// Get About page
router.get('/about', function(req, res){
	var isAuthenticated = req.isAuthenticated();
	res.render('team', {authenticated: isAuthenticated});
});

router.get('/scan', function(req, res){
	var isAuthenticated = req.isAuthenticated();
	let p = {playername: req.user.username}
	
	chasseController.findChasseByUsername(p).then( chasse => {
		chasseController.checkStep(chasse[0].name, req.user.username).then( enigme => {
			res.render('scan', {authenticated: isAuthenticated, marker: enigme[0].marker, step: enigme[0].step, pseudo: req.user.username, cn: chasse[0].name});
		})
	})
});


router.get('/create', (req, res) => {
	var newChasse = new chasseSchema({
		name : "La chasse silver",
		countplayer: 0,
		startdate: "17/04/2018-14:30",
		theme: "L'une des meilleurs chasse de découverte",
		type: "solo",
		winning: "icon",
		enigme: [{step: 1, titre: "Le debut",indice: "La ou tout a commencer, le chef posséde la clef du success.", marker: "marker1"},{step: 2, titre: "Lancez-vous !",indice: "Le plus grand en age a la suite !" , marker: "marker2"}, {step: 3, titre : "La fin !",indice: "Celui qui a les cheveux couleur Thor et la taille d'un humain plus basse que les 2 premiers a la fin !" , marker: "marker3"}]
	})

	newChasse.save().then(() => res.redirect("/"));
})
router.get('/cc', (req, res) => {
	chasseSchema.findOneAndUpdate({name : "La chasse silver"}, {$push: {"enigme.2.playercleared" : {playername : "bx"}}}, (err, up) => {
		if(err){
			console.log("error : " + err);
		}else{
			console.log(up.enigme[0].playercleared);
		}
	})

})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		var isAuthenticated = req.isAuthenticated();
		res.render('home', {authenticated: isAuthenticated});
	}
}

module.exports = router;
