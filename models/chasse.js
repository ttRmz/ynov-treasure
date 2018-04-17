var mongoose = require('mongoose');

module.exports = mongoose.model('Chasse',{
	name: String,
	countplayer: Number,
	startdate: String,
	playersin: [{playername: String}],
	theme: String,
	type: String,
	winning: String,
	enigme: [{
		step: Number,
		titre: String,
		indice: String,
		marker: String,
		playercleared: [{playername : String}]
	}]
});


