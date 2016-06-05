"use strict"
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/betcrawler');
var db = Mongoose.connection;
var request = require('request');
var cheerio = require('cheerio');
var PrevisaoJogo = require('./PrevisaoJogo');
var find = require('cheerio-eq');
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

			var propriedades =
			[
				'CasaSequenciaVitoriasCasa',
				'CasaSequenciaVitoriasFora',
				'CasaSequenciaVitoriasGlobal',
				'CasaSequenciaEmpatesCasa',
				'CasaSequenciaEmpatesFora',
				'CasaSequenciaEmpatesGlobal',
				'CasaSequenciaDerrotasCasa',
				'CasaSequenciaDerrotasFora',
				'CasaSequenciaDerrotasGlobal',
				'CasaJogosSemGanharCasa',
				'CasaJogosSemGanharFora',
				'CasaJogosSemGanharGlobal',
				'CasaJogosSemEmpatarCasa',
				'CasaJogosSemEmpatarFora',
				'CasaJogosSemEmpatarGlobal',
				'CasaJogosSemPerderCasa',
				'CasaJogosSemPerderFora',
				'CasaJogosSemPerderGlobal',
				'ForaSequenciaVitoriasCasa',
				'ForaSequenciaVitoriasFora',
				'ForaSequenciaVitoriasGlobal',
				'ForaSequenciaEmpatesCasa',
				'ForaSequenciaEmpatesFora',
				'ForaSequenciaEmpatesGlobal',
				'ForaSequenciaDerrotasCasa',
				'ForaSequenciaDerrotasFora',
				'ForaSequenciaDerrotasGlobal',
				'ForaJogosSemGanharCasa',
				'ForaJogosSemGanharFora',
				'ForaJogosSemGanharGlobal',
				'ForaJogosSemEmpatarCasa',
				'ForaJogosSemEmpatarFora',
				'ForaJogosSemEmpatarGlobal',
				'ForaJogosSemPerderCasa',
				'ForaJogosSemPerderFora',
				'ForaJogosSemPerderGlobal',
				'CasaMediaGolsMarcadosPorJogoCasa',
				'CasaMediaGolsMarcadosPorJogoFora',
				'CasaMediaGolsMarcadosPorJogoGlobal',
				'CasaMediaGolsSofridosPorJogoCasa',
				'CasaMediaGolsSofridosPorJogoFora',
				'CasaMediaGolsSofridosPorJogoGlobal',
				'CasaMediaGolsMarcadosSofridosPorJogoCasa',
				'CasaMediaGolsMarcadosSofridosPorJogoFora',
				'CasaMediaGolsMarcadosSofridosPorJogoGlobal',
				'CasaJogosSemSofrerGolsCasa',
				'CasaJogosSemSofrerGolsFora',
				'CasaJogosSemSofrerGolsGlobal',
				'CasaJogosSemMarcarGolsCasa',
				'CasaJogosSemMarcarGolsFora',
				'CasaJogosSemMarcarGolsGlobal',
				'CasaJogosMaisDoisMeioGolsCasa',
				'CasaJogosMaisDoisMeioGolsFora',
				'CasaJogosMaisDoisMeioGolsGlobal',
				'CasaJogosMenosDoisMeioGolsCasa',
				'CasaJogosMenosDoisMeioGolsFora',
				'CasaJogosMenosDoisMeioGolsGlobal',
				'CasaAbreMarcadorCasa',
				'CasaAbreMarcadorGlobal',
				'CasaEVencendoAoIntervaloCasa',
				'CasaEVencendoAoIntervaloPorcentagem',
				'CasaEVenceuAoFimCasa',
				'CasaEVenceuAoFimPorcentagem',
				
				'ForaMediaGolsMarcadosPorJogoCasa',
				'ForaMediaGolsMarcadosPorJogoFora',
				'ForaMediaGolsMarcadosPorJogoGlobal',
				'ForaMediaGolsSofridosPorJogoCasa',
				'ForaMediaGolsSofridosPorJogoFora',
				'ForaMediaGolsSofridosPorJogoGlobal',
				'ForaMediaGolsMarcadosSofridosPorJogoCasa',
				'ForaMediaGolsMarcadosSofridosPorJogoFora',
				'ForaMediaGolsMarcadosSofridosPorJogoGlobal',
				'ForaJogosSemSofrerGolsCasa',
				'ForaJogosSemSofrerGolsFora',
				'ForaJogosSemSofrerGolsGlobal',
				'ForaJogosSemMarcarGolsCasa',
				'ForaJogosSemMarcarGolsFora',
				'ForaJogosSemMarcarGolsGlobal',
				'ForaJogosMaisDoisMeioGolsCasa',
				'ForaJogosMaisDoisMeioGolsFora',
				'ForaJogosMaisDoisMeioGolsGlobal',
				'ForaJogosMenosDoisMeioGolsCasa',
				'ForaJogosMenosDoisMeioGolsFora',
				'ForaJogosMenosDoisMeioGolsGlobal',
				'ForaAbreMarcadorFora',
				'ForaAbreMarcadorPorcentagem',
				'ForaEVencendoAoIntervaloFora',
				'ForaEVencendoAoIntervaloPorcentagem',
				'ForaEVenceuAoFimFora',
				'ForaEVenceuAoFimPorcentagem',

			];
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


			var propriedadesGolsSofridosPorPeriodo = [
				'CasaGolsSofridosZeroQuinze',
				'CasaGolsSofridosDezeseisTrinta',
				'CasaGolsSofridosTrintaUmQuarentaCinco',
				'CasaGolsSofridosQuarentaSeisSessenta',
				'CasaGolsSofridosSessentaUmSetentaCinco',
				'CasaGolsSofridosSetentaSeisNoventa',
				'ForaGolsSofridosZeroQuinze',
				'ForaGolsSofridosDezeseisTrinta',
				'ForaGolsSofridosTrintaUmQuarentaCinco',
				'ForaGolsSofridosQuarentaSeisSessenta',
				'ForaGolsSofridosSessentaUmSetentaCinco',
				'ForaGolsSofridosSetentaSeisNoventa'
			];
			
			indexPropriedade = 0;

			$(elementoGolSofridosPorPeriodo).each(function(index){
				if(index % 2 === 0)return irParaProximoIndex;

				previsaoJogo[propriedadesGolsSofridosPorPeriodo[indexPropriedade]] = $(this).text().trim();
				indexPropriedade++;
			});

			var propriedadesGolsMarcadosPorPeriodo = [
				'CasaGolsMarcadosZeroQuinze',
				'CasaGolsMarcadosDezeseisTrinta',
				'CasaGolsMarcadosTrintaUmQuarentaCinco',
				'CasaGolsMarcadosQuarentaSeisSessenta',
				'CasaGolsMarcadosSessentaUmSetentaCinco',
				'CasaGolsMarcadosSetentaSeisNoventa',
				'ForaGolsMarcadosZeroQuinze',
				'ForaGolsMarcadosDezeseisTrinta',
				'ForaGolsMarcadosTrintaUmQuarentaCinco',
				'ForaGolsMarcadosQuarentaSeisSessenta',
				'ForaGolsMarcadosSessentaUmSetentaCinco',
				'ForaGolsMarcadosSetentaSeisNoventa'
			];

			indexPropriedade = 0;

			$(elementoGolMarcadoPorPeriodo).each(function(index){
				previsaoJogo[propriedadesGolsMarcadosPorPeriodo[indexPropriedade]] = $(this).text().trim();
				indexPropriedade++;
			});

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

			console.log(previsaoJogo);
		});
	});