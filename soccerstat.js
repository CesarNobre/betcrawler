var request = require('request');
var cheerio = require('cheerio');
var datetime = require('node-datetime');
var timeoutInMilliseconds = 10*1000
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
var urlStats = 'http://www.soccerstats.com/latest.asp?league=brazil';
var opts = {
  url: urlStats,
  timeout: timeoutInMilliseconds
}

var validIds = [];

sequence
	.then(function(next){
		request(opts, function(err, res, body){
			var $ = cheerio.load(body);
			for (var i = 0; i < 300; i++) {
				if($('#StatsBarContainer' + i)[0] === undefined){continue;}
				validIds.push(i);
			}
		console.log(validIds);
		next(err, validIds)
		});		
	})
	.then(function(next, err, ids,b){
		console.log(ids);
	});





function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/ +/g, "");
}      


function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
	var mapaAcentosHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};

	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	return string;
}