var request = require('request');
var cheerio = require('cheerio');
var timeoutInMilliseconds = 10*1000
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
var firstRoundLink = 'https://www.academiadasapostasbrasil.com/stats/competition/brasil-stats/26/11185/30889/0/6';
var opts = {
  url: firstRoundLink,
  timeout: timeoutInMilliseconds
}
var eachRoundGameLink = [];

sequence
	.then(function(next){
		request(opts, function(err, res, body){
			var $ = cheerio.load(body);
			$('.darker a').each(function() {
				eachRoundGameLink.push($(this).attr('href'));
			});
		next(err, eachRoundGameLink);
		});		
	})
	.then(function(next, err, eachRoundGameLink){
		var options = {
			url: eachRoundGameLink[0],
			timeout: timeoutInMilliseconds
		}
		request(options, function(err, res, body){
			var $ = cheerio.load(body);
			var home = $('.stats-subtitle').first().text();
			var away = $('.stats-subtitle')[1];
			
			var goalHomeTbody = $('.stat-half-padding tbody')[6];
			var valueGoalHome = $(goalHomeTbody).find('td')[1];
			console.log($(valueGoalHome).text().trim());
		});
	});