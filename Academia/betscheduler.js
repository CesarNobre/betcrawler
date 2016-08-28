"use strict"
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://sa:arroz@ds013486.mlab.com:13486/betbot');
var db = Mongoose.connection;
var request = require('request');
var cheerio = require('cheerio');
var PrevisaoJogo = require('./PrevisaoJogo');
var RemoverAcentos = require('./removeracentos');
var self = this;
var find = require('cheerio-eq');
var async = require('async');
var timeoutInMilliseconds = 10*1000
var FullNameFinder = require('./fullnamefinder');
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


self.championships = 
[
	'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7'
];
self.opts = {
  url: '',
  timeout: timeoutInMilliseconds
}

function StartBetScheduler(){
	sequence = Sequence.create();
	sequence
	.then(function(next){
		if(self.championships.length == 0){ return; }
		if(self.opts.url == ''){
			self.opts.url = self.championships.pop();
		};
		request(self.opts, function(err, res, body){
			if(err){throw err;}
	        var $ = cheerio.load(body);
	        var allGames = [];

	        var gamesLines = $('.competition-rounds tr');
	        $(gamesLines).each(function(index,element){
	        	var nomeTimeCasa = $(element).find('td')[2];
	        	var nomeTimeFora = $(element).find('td')[4];
	        	nomeTimeCasa = FullNameFinder.module.buscar($(nomeTimeCasa).text().trim());
	        	nomeTimeFora = FullNameFinder.module.buscar($(nomeTimeFora).text().trim());

	        	var confronto = {
	        		NomeTimeCasa :  nomeTimeCasa,
	        		NomeTimeFora :  nomeTimeFora,
	        	};

	        	allGames.push(confronto);
	        });

			next(err, allGames);

		});
	})
	.then(function(next,err, jogosDaRodada){
		var data = previsaoModel.find({}, function(err, jogoDeTodoOCampeonato){
			next(err, jogoDeTodoOCampeonato, jogosDaRodada);
		});
	})
	.then(function(next,err, jogoDeTodoOCampeonato, jogosDaRodada){
		var allGamesWithBezosStrategy = [];
		for (var i = 0; i < jogosDaRodada.length; i++) {
			var jogoAtual = jogosDaRodada[i];

			if(jogoAtual.Rodada <= 6){ continue;}
			
			var currentYearAndChamp = jogoDeTodoOCampeonato.where(function(games){ 
				return jogoAtual.Ano == games.Ano && jogoAtual.Campeonato == games.Campeonato; 
			});
			var lastGamesHome = currentYearAndChamp.where(function(games){
					var actualRound = jogoAtual.Rodada;
					var initialRange = parseInt(actualRound) - 6;
					var finalRange = parseInt(actualRound) - 1;

					return ((parseInt(games.Rodada) >= initialRange) && (parseInt(games.Rodada) <= finalRange)) 
					&& 
					(
						(jogoAtual.NomeTimeCasa == games.NomeTimeCasa || jogoAtual.NomeTimeCasa == games.NomeTimeFora)
					);
			});

			var lastGamesAway = currentYearAndChamp.where(function(games){
					var actualRound = jogoAtual.Rodada;
					var initialRange = parseInt(actualRound) - 6;
					var finalRange = parseInt(actualRound) - 1;

					return ((parseInt(games.Rodada) >= initialRange) && (parseInt(games.Rodada) <= finalRange)) 
					&& 
					(
						(jogoAtual.NomeTimeFora == games.NomeTimeCasa || jogoAtual.NomeTimeFora == games.NomeTimeFora)
					);
			});


			var howManyGamesHasMoreThanOneHalfGoalHome = 0;
			for (var j = 0; j < lastGamesHome.length; j++) {
				if(lastGamesHome[j].GoalsTime.length >= 2){
					howManyGamesHasMoreThanOneHalfGoalHome = howManyGamesHasMoreThanOneHalfGoalHome + 1;
				}
			}

			var howManyGamesHasMoreThanOneHalfGoalAway = 0;
			for (var j = 0; j < lastGamesAway.length; j++) {
				if(lastGamesAway[j].GoalsTime.length >= 2){
					howManyGamesHasMoreThanOneHalfGoalAway = howManyGamesHasMoreThanOneHalfGoalAway + 1;
				}
			}

			var bezosStrategy = (howManyGamesHasMoreThanOneHalfGoalAway >= 4 && howManyGamesHasMoreThanOneHalfGoalHome >= 4);
									 //&& jogoAtual.GoalsTime.length >= 2;

			if(bezosStrategy){
				allGamesWithBezosStrategy.push(jogoAtual);
			}

		}
		next(err, allGamesWithBezosStrategy);
	})
	.then(function(next, err, allGamesWithBezosStrategy){
		
		function saveAll(){
			var game = allGamesWithBezosStrategy.pop();

			var nomeCasa = FullNameFinder.module.buscar(game.NomeTimeCasa);
			var nomeFora = FullNameFinder.module.buscar(game.NomeTimeFora);
			
			var query = {
				NomeTimeCasa: nomeCasa, 
				NomeTimeFora: nomeFora,
				Ano:game.Ano,
				Rodada:game.Rodada,
				Campeonato:game.Campeonato
			};

			previsaoModel.findOne({query}, function(err, jogoDeTodoOCampeonato){
			   	if(err){console.log(err);}
				if(!doc){
			   		console.log('DOC NULO');
			   		return;	
			   	}

			   	doc.bezos = true;
			   	
			   	doc.save(function(e){
					if(e){console.log(e);}
					else{console.log('salvou');}
				});

				
			   	setTimeout(function() {
					if (--allGamesWithBezosStrategy) 
						saveAll();
				   	else {
				   		console.log("JOGOS COM BEZOS = " allGamesWithBezosStrategy.length);
				   		next(err, allGamesWithBezosStrategy);
				   	}
				}, millisecondsToWait);

				next(err, jogoDeTodoOCampeonato, jogosDaRodada);
			});
		};
		

		saveAll();
	}).then(function(next, err, allGamesWithBezosStrategy){
		//TODO send mail
	});
}

StartBetScheduler();