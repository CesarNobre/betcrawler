"use strict"
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/betcrawler');
var db = Mongoose.connection;
var request = require('request');
var cheerio = require('cheerio');
var PrevisaoJogo = require('./PrevisaoJogo');
var Propriedades = require('./propriedades');

var find = require('cheerio-eq');
var async = require('async');

var regexOnlyNumbers = /[^0-9\.]/g;
var timeoutInMilliseconds = 10*1000
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;


db.on('error', console.error);
db.once('open', function() {
  console.log('Conectado ao MongoDB.')
});

var previsaoJogoSchema = new Mongoose.Schema(PrevisaoJogo.module.PrevisaoJogo);
var previsaoModel = Mongoose.model('previsaoModel', previsaoJogoSchema);
var self = this;

self.elementosParaSalvar = [];

self.links = 
[
	'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7/6061/15105/0/1',
	'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7/7281/18383/0/1',
	'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7/8491/21879/0/1',
	'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7/9773/25985/0/1',
	'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7/11646/31781/0/1'


	
];

self.opts = {
  url: '',
  timeout: timeoutInMilliseconds
}
function StartCrawler(){
	console.log('ENTROU NO START CRAWLER');
var eachRoundGameLink = [];
	sequence = Sequence.create();
	sequence
		.then(function(next){
			if(self.links.length == 0 && self.opts.url == ''){ return; }
			if(self.opts.url == ''){
				self.opts.url = self.links.pop();
			}

			request(self.opts, function(err, res, body){
				if(err){throw err;}
	        	var $ = cheerio.load(body);

				$('.competition-half-padding tbody tr td a').each(function() {
					var currentLink = $(this).attr('href');
					var isValidLink = currentLink.substr(currentLink.length - 5) == '/live';
					
					if(isValidLink){
						eachRoundGameLink.push($(this).attr('href'));
					}
				});

			next(err, eachRoundGameLink);
			});		
		})
		.then(function(next, err, eachRoundGameLink){
			var page = 0;
			console.log(eachRoundGameLink.length);
			async.whilst(
				function(){
					return page < eachRoundGameLink.length;
				},

				function (nextAsync, teste) {
				    request(eachRoundGameLink[page], function(err, res, body) {
					    if (err) {return console.log(err); return false}
					    if (res.statusCode != 200) {return console.log(res.statusCode); return false}

						var previsaoJogo = new previsaoModel();
			        	var $ = cheerio.load(body);
			        	var goalsTime = [];
						var elementoRodada = $('.gamehead a')[2];
						var elementoAnoRodada = $('.gamehead a')[1];
						var elementoCampeonato = $('.gamehead a')[0];
						var elementoNomeTimeFora = $('.stats-subtitle')[1];

						var Campeonato = $(elementoCampeonato).text().trim();
						var Ano = $(elementoAnoRodada).text().trim();
						var Rodada = $(elementoRodada).text().trim().replace(regexOnlyNumbers,'');
			        	

						var nomeTimeCasa = $('.stats-game-head-teamname a')[1].children[0].data.trim();
						var nomeTimeFora = $('.stats-game-head-teamname a')[3].children[0].data.trim();
						

			        	$('#first-half-summary tbody tr').each(function(index){

			        		if($(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().index() == 1){
				        		var goal = $(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().prev().text().trim().replace('\'', '').replace('\'', '');
			        			goalsTime.push(goal);
			        		}

			        		if($(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().index() == 4){
				        		var goal = $(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().next().text().trim().replace('\'', '').replace('\'', '');
			        			goalsTime.push(goal);
			        		}
			        	});
			        	
			        	$('#second-half-summary tbody tr').each(function(index){
			        		if($(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().index() == 1){
				        		var goal = $(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().prev().text().trim().replace('\'', '').replace('\'', '');
			        			goalsTime.push(goal);
			        		}

			        		if($(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().index() == 4){
				        		var goal = $(this).find('.match-sum-wd-symbol img[title$="oal"]').parent().next().text().trim().replace('\'', '').replace('\'', '');
			        			goalsTime.push(goal);
			        		}
			        	});

						var jogo = {
							Ano:Ano,
							Rodada:Rodada,
							NomeTimeCasa:nomeTimeCasa,
							NomeTimeFora:nomeTimeFora,
							Campeonato:Campeonato,
							goalsTime: goalsTime
						};

			    		page++;
						self.elementosParaSalvar.push(jogo);
			        	
			        	if(page >= eachRoundGameLink.length){
							console.log('entrou no PROXIMO!!')
							next(err, self.elementosParaSalvar);
							return false;
						}

						nextAsync(err, self.elementosParaSalvar);
					});//request
				}, 
			5);
		})
		.then(function(next, err, jogos){
			if(jogos.length == 0 ){console.log('deu ruim'); return;}

			var total = jogos.length
			  , result = []
			;

			function saveAll(){
			  var jogo = jogos.pop();

		      var query = {
					NomeTimeCasa:jogo.NomeTimeCasa, 
					NomeTimeFora:jogo.NomeTimeFora,
					Ano:jogo.Ano,
					Rodada:jogo.Rodada
			   };

			   previsaoModel.findOne(query, function(err, doc){

					doc.GoalsTime = ['0'];

			   		if(jogo.goalsTime){
						doc.GoalsTime = jogo.goalsTime;
			   		}

					doc.save();

					if (--total) saveAll();
			    	else {
			    		console.log(result + "SALVO COM SUCESSO!");
			    		next();
			    	} 
			    });

			}

			console.log(jogos);
			saveAll();
		})
		.then(function(next, err, jogos){
			var currentRoundUrl = self.opts.url;
			var splittedUrl = currentRoundUrl.split('/');
			var lastItem = splittedUrl[splittedUrl.length - 1];

			if(lastItem >= 38){
				self.opts.url = '';
				console.log('FIM DE UMA TEMPORADA!'); 
				return StartCrawler();
			}

			splittedUrl[splittedUrl.length - 1] =  parseInt(lastItem) + 1;
			
			self.opts.url = splittedUrl.join('/');

			console.log(self.opts.url);


			StartCrawler();
		});
}

StartCrawler();
