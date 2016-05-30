var request = require('request');
var cheerio = require('cheerio');
var datetime = require('node-datetime');
var Mongoose = require('mongoose');
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
var soccerStatsBaseUrl = 'http://www.soccerstats.com/';
var validLinks = [];

sequence
	.then(function(next){
		request(opts, function(err, res, body){
			var $ = cheerio.load(body);
			for (var i = 0; i < 300; i++) {
				var jogosDaRodada = $('#StatsBarContainer' + i + ' a')[0];
				if(jogosDaRodada === undefined){continue;}
				validLinks.push(jogosDaRodada.attribs.href);
			}
		next(err, validLinks);
		});		
	})
	.then(function(next, err, validLinks,b){
		for (var i = 0; i < validLinks.length; i++) {
			var options = {
				url : soccerStatsBaseUrl + validLinks[i],
				timeout:timeoutInMilliseconds
			}
			request(options, function(err, res, body){
				var $ = cheerio.load(body);

				var homeTeam = $('.six table tr td font b a');

				console.log(homeTeam[0].children[0].data);
			});
		}
	});

