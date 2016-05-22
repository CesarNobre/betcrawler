var Crawler = require("simplecrawler");
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var crawler = Crawler.crawl("https://www.academiadasapostasbrasil.com/stats/match/brasil-stats/2218297/1/prelive");
crawler.interval = 500;

crawler.decodeResponses = true;


crawler.on("fetchcomplete", function(queueItem,b) {
	var textChunk = decoder.write(b);
      
	console.log(textChunk);
});