"use strict"

var request = require('request');
var cheerio = require('cheerio');
var PrevisaoJogo = require('./PrevisaoJogo');
var regexOnlyNumbers = /[^0-9\.]/g;
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
			var previsaoJogo = new PrevisaoJogo.module.PrevisaoJogo();
			var elementoNomeTimeFora = $('.stats-subtitle')[1];
			var elementoAnoRodada = $('.gamehead a')[1];
			var elementoRodada = $('.gamehead a')[2];
			var elementoCampeonato = $('.gamehead a')[0];
			var elementoCasaTop5Total = $('.competition-half-padding tbody tr[style*="background-color: #4682B4"] td')[0];
			var elementoCasaTop5Casa = $('.competition-half-padding tbody tr[style*="background-color: #4682B4"] td')[8];
			var elementoCasaTop5Fora = $('.competition-half-padding tbody tr[style*="background-color: #CDDFF0"] td')[0];
			var elementoForaTop5Total = $('.competition-half-padding tbody tr[style*="background-color: #FFA500"] td')[0];
			var elementoForaTop5Fora = $('.competition-half-padding tbody tr[style*="background-color: #FFA500"] td')[8];
			var elementoForaTop5Casa = $('.competition-half-padding tbody tr[style*="background-color: #FFE0A6"] td')[0];
			var elementoTabelaPercursoEGols = $('.stat-seqs tbody tr td');

			previsaoJogo.NomeTimeCasa = $('.stats-subtitle').first().text();
			previsaoJogo.NomeTimeFora = $(elementoNomeTimeFora).text();
			previsaoJogo.Resultado = $('.f-score').text().trim();
			previsaoJogo.Ano = $(elementoAnoRodada).text().trim();
			previsaoJogo.Rodada = $(elementoRodada).text().trim().replace(regexOnlyNumbers,'');
			previsaoJogo.Campeonato = $(elementoCampeonato).text().trim().replace(regexOnlyNumbers,'');
			previsaoJogo.CasaTop5Total = parseInt($(elementoCasaTop5Total).text().trim()) <= 5;
			previsaoJogo.CasaTop5Casa = parseInt($(elementoCasaTop5Casa).text().trim()) <= 5;
			previsaoJogo.CasaTop5Fora = parseInt($(elementoCasaTop5Fora).text().trim()) <= 5;
			previsaoJogo.ForaTop5Total = parseInt($(elementoForaTop5Total).text().trim()) <= 5;
			previsaoJogo.ForaTop5Fora = parseInt($(elementoForaTop5Fora).text().trim()) <= 5;
			previsaoJogo.ForaTop5Casa = parseInt($(elementoForaTop5Casa).text().trim()) <= 5;

			$(elementoTabelaPercursoEGols).each(function(index,val){
				if(index > 23){return false;}
				if(index === 0 || index === 4 || index === 8 || index === 12 || index === 16 || index === 20){return true;}

				if(index === 1){
					previsaoJogo.CasaSequenciaVitoriasCasa = $(this).text.trim() === '-' ? 0 : $(this).text.trim() 
				}
				if(index === 2){
					previsaoJogo.CasaSequenciaVitoriasFora = $(this).text.trim() === '-' ? 0 : $(this).text.trim() 
				}
				if(index === 3){
					previsaoJogo.CasaSequenciaVitoriasGlobal = $(this).text.trim() === '-' ? 0 : $(this).text.trim() 
				}

				console.log($(this).text().trim());
			});

			//var goalHomeTbody = $('.stat-half-padding tbody')[6];
			//var valueGoalHome = $(goalHomeTbody).find('td')[1];
			//console.log($(valueGoalHome).text().trim());

			//console.log(previsaoJogo);
		});
	});