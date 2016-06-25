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
var firstRoundLink = 'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7/6061/15105/0/1';
self.opts = {
  url: firstRoundLink,
  timeout: timeoutInMilliseconds
}

function StartCrawler(){
	console.log('ENTROU NO START CRAWLER');
var eachRoundGameLink = [];
	sequence = Sequence.create();
	sequence
		.then(function(next){
			console.log('ENTROU NO THEN');
			request(self.opts, function(err, res, body){
				if(err){throw err;}
				var $ = cheerio.load(body);
				$('.darker a').each(function() {
					eachRoundGameLink.push($(this).attr('href'));
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
						var elementoGolSofridosPorPeriodo = $('.stat-goals tbody tr td:nth-child(2)');
						var elementoGolMarcadoPorPeriodo = $('.stats-wd-goalstime3');
						var elementoUltimosJogosCasa = find($,'.stat-last10 tbody:eq(0) tr');
						var elementoUltimosJogosFora = find($,'.stat-last10 tbody:eq(1) tr');

						previsaoJogo.NomeTimeCasa = $('.stats-subtitle').first().text();
						previsaoJogo.NomeTimeFora = $(elementoNomeTimeFora).text();
						previsaoJogo.Resultado = $('.f-score').text().trim();
						previsaoJogo.Ano = $(elementoAnoRodada).text().trim();
						previsaoJogo.Rodada = $(elementoRodada).text().trim().replace(regexOnlyNumbers,'');
						previsaoJogo.Campeonato = $(elementoCampeonato).text().trim();
						previsaoJogo.CasaTop5Total = parseInt($(elementoCasaTop5Total).text().trim()) <= 5;
						previsaoJogo.CasaTop5Casa = parseInt($(elementoCasaTop5Casa).text().trim()) <= 5;
						previsaoJogo.CasaTop5Fora = parseInt($(elementoCasaTop5Fora).text().trim()) <= 5;
						previsaoJogo.ForaTop5Total = parseInt($(elementoForaTop5Total).text().trim()) <= 5;
						previsaoJogo.ForaTop5Fora = parseInt($(elementoForaTop5Fora).text().trim()) <= 5;
						previsaoJogo.ForaTop5Casa = parseInt($(elementoForaTop5Casa).text().trim()) <= 5;

						var propriedades = Propriedades.module.Propriedades;

						var indexPropriedade = 0;
						var cabecalhosDoMandante = [85, 89, 93, 97, 101, 105, 109, 113, 116, 119];
						var irParaProximoIndex = true;
						$(elementoTabelaPercursoEGols).each(function(index,val){
							if(index > 121) return false;
							if((index <= 75 && index % 4 === 0) || index === 76 || index === 79 || index === 82) return irParaProximoIndex;
							if(index >= 85 && (cabecalhosDoMandante.indexOf(index) > -1)) return irParaProximoIndex;

							previsaoJogo[propriedades[indexPropriedade]] = $(this).text().trim() === '-' ? 0 : $(this).text().trim();
							indexPropriedade++;
						});


						var propriedadesGolsSofridosPorPeriodo = Propriedades.module.PropriedadesGolsSofridosPorPeriodo;
						
						indexPropriedade = 0;

						$(elementoGolSofridosPorPeriodo).each(function(index){
							if(index % 2 === 0)return irParaProximoIndex;

							previsaoJogo[propriedadesGolsSofridosPorPeriodo[indexPropriedade]] = $(this).text().trim();
							indexPropriedade++;
						});

						var propriedadesGolsMarcadosPorPeriodo = Propriedades.module.PropriedadesGolsMarcadosPorPeriodo;

						indexPropriedade = 0;

						$(elementoGolMarcadoPorPeriodo).each(function(index){
							previsaoJogo[propriedadesGolsMarcadosPorPeriodo[indexPropriedade]] = $(this).text().trim();
							indexPropriedade++;
						});

						previsaoJogo.CasaVitoriasNoUltimosDezJogos = 0;
						previsaoJogo.CasaEmpatesNoUltimosDezJogos = 0;
						previsaoJogo.CasaDerrotasNoUltimosDezJogos = 0;


						$(elementoUltimosJogosCasa).each(function(index){
							if(index >= 10) return false;

							var resultadoJogo = $(this).children('td')[3];

							if($(resultadoJogo).hasClass('stat-win')){
								++previsaoJogo.CasaVitoriasNoUltimosDezJogos;
								return true;
							}

							if($(resultadoJogo).hasClass('stat-draw')){
								++previsaoJogo.CasaEmpatesNoUltimosDezJogos;
								return true;
							}
							
							if($(resultadoJogo).hasClass('stat-lose')){
								++previsaoJogo.CasaDerrotasNoUltimosDezJogos;
								return true;
							}

						});

						previsaoJogo.ForaVitoriasNoUltimosDezJogos = 0;
						previsaoJogo.ForaEmpatesNoUltimosDezJogos = 0;
						previsaoJogo.ForaDerrotasNoUltimosDezJogos = 0;
						
						$(elementoUltimosJogosFora).each(function(index){
							if(index >= 10) return false;
							var resultadoJogo = $(this).children('td')[3];

							if($(resultadoJogo).hasClass('stat-win')){
								++previsaoJogo.ForaVitoriasNoUltimosDezJogos;
								return true;
							}

							if($(resultadoJogo).hasClass('stat-lose')){
								++previsaoJogo.ForaDerrotasNoUltimosDezJogos;
								return true;
							}
							
							if($(resultadoJogo).hasClass('stat-draw')){
								++previsaoJogo.ForaEmpatesNoUltimosDezJogos;
								return true;
							}

						});

			    		page++;
		    			self.elementosParaSalvar.push(previsaoJogo);

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
			console.log('valor de jogos: ' + jogos);

			var total = jogos.length
			  , result = []
			;

			function saveAll(){
			  var doc = jogos.pop();
			  for (var i = 0; i < jogos.length; i++) {
			  	//console.log(jogos[i].NomeTimeCasa);
			  }
			  //console.log(doc.NomeTimeCasa);
			  //console.log('entrou no saveall');
			  doc.save(function(err, saved){
			    if (err) 
			    {console.log('deu ruim no save!');throw err;}//handle error

			    result.push(saved[0]);
			    if (--total) saveAll();
			    else {
			    	console.log(result + "SALVO COM SUCESSO!");
			    	next();
			    }
			  })
			}

			saveAll();
		})
		.then(function(next, err){
			console.log('entrou');
			var currentRoundUrl = self.opts.url;
			var splittedUrl = currentRoundUrl.split('/');
			var lastItem = splittedUrl[splittedUrl.length - 1];

			if(lastItem >= 38)
			{console.log('PRONTO FILHÃO!'); return false;}

			splittedUrl[splittedUrl.length - 1] =  parseInt(lastItem) + 1;
			
			self.opts.url = splittedUrl.join('/');

			console.log(self.opts.url);


			StartCrawler();
		});
}

StartCrawler();
