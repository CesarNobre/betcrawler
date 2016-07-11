require('linqjs');
var Excel = require('exceljs');
var workbook = new Excel.Workbook();
var sheet = workbook.addWorksheet('My Sheet');
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/betcrawler');
var db = Mongoose.connection;
var PrevisaoJogo = require('./PrevisaoJogo');
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
var worksheet = workbook.getWorksheet('My Sheet');

db.once('open', function() {
  console.log('Conectado ao MongoDB.')
});

var previsaoJogoSchema = new Mongoose.Schema(PrevisaoJogo.module.PrevisaoJogo);
var previsaoModel = Mongoose.model('previsaoModel', previsaoJogoSchema);
var jogosValidosParaAplicarMetodo = 0;
var jogosMetodoDeuCerto = 0;
var jogosMaiorQueOitoDeuCerto = 0;

var jogosMaiorQueOitoDeuCertoAlemanha = 0;
var jogosMaiorQueOitoDeuCertoEspanha = 0;
var jogosMaiorQueOitoDeuCertoFranca = 0;
var jogosMaiorQueOitoDeuCertoItalia = 0;
var jogosMaiorQueOitoDeuCertoInglaterra = 0;

sequence
	.then(function(next){
		var data = previsaoModel.find({}, function(err, previsao){
			next(err, previsao);
		});
	})
	.then(function(next, err, previsoes){
		worksheet.columns = [
			{ header: "GanhamosBufunfaBezos", key: "ganhamosBufunfaBezos", width: 25},
			{ header: "GanhamosBufunfaMaiorQueOito", key: "ganhamosBufunfaMaiorQueOito", width: 25},
			{ header: "OitoDeDozeOverUmMeio", key: "oitoDeDozeOverUmMeio", width: 25},
			{ header: "QuatroDeSeisOverUmMeio", key: "quatroDeSeisOverUmMeio", width: 25},
		    { header: "GoalsTime", key: "goalsTime", width: 25 },
			{ header: "NomeTimeCasa", key: "nomeTimeCasa", width: 25 },
			{ header: "NomeTimeFora", key: "nomeTimeFora", width: 25 },
			{ header: "Resultado", key: "resultado", width: 25 },
			{ header: "Ano", key: "ano", width: 25 },
			{ header: "Rodada", key: "rodada", width: 25 },
			{ header: "Campeonato", key: "campeonato", width: 25 },
			{ header: "CasaTop5Total", key: "casaTop5Total", width: 25 },
			{ header: "CasaTop5Casa", key: "casaTop5Casa", width: 25 },
			{ header: "CasaTop5Fora", key: "casaTop5Fora", width: 25 },
			{ header: "ForaTop5Total", key: "foraTop5Total", width: 25 },
			{ header: "ForaTop5Fora", key: "foraTop5Fora", width: 25 },
			{ header: "ForaTop5Casa", key: "foraTop5Casa", width: 25 },
			{ header: "CasaSequenciaVitoriasCasa", key: "casaSequenciaVitoriasCasa", width: 25 },
			{ header: "CasaSequenciaVitoriasFora", key: "casaSequenciaVitoriasFora", width: 25 },
			{ header: "CasaSequenciaEmpatesCasa", key: "casaSequenciaEmpatesCasa", width: 25 },
			{ header: "CasaSequenciaEmpatesFora", key: "casaSequenciaEmpatesFora", width: 25 },
			{ header: "CasaSequenciaDerrotasCasa", key: "casaSequenciaDerrotasCasa", width: 25 },
			{ header: "CasaSequenciaDerrotasFora", key: "casaSequenciaDerrotasFora", width: 25 },
			{ header: "CasaJogosSemGanharCasa", key: "casaJogosSemGanharCasa", width: 25 },
			{ header: "CasaJogosSemGanharFora", key: "casaJogosSemGanharFora", width: 25 },
			{ header: "CasaJogosSemEmpatarCasa", key: "casaJogosSemEmpatarCasa", width: 25 },
			{ header: "CasaJogosSemEmpatarFora", key: "casaJogosSemEmpatarFora", width: 25 },
			{ header: "CasaJogosSemPerderCasa", key: "casaJogosSemPerderCasa", width: 25 },
			{ header: "CasaJogosSemPerderFora", key: "casaJogosSemPerderFora", width: 25 },
			{ header: "ForaSequenciaVitoriasCasa", key: "foraSequenciaVitoriasCasa", width: 25 },
			{ header: "ForaSequenciaVitoriasFora", key: "foraSequenciaVitoriasFora", width: 25 },
			{ header: "ForaSequenciaEmpatesCasa", key: "foraSequenciaEmpatesCasa", width: 25 },
			{ header: "ForaSequenciaEmpatesFora", key: "foraSequenciaEmpatesFora", width: 25 },
			{ header: "ForaSequenciaDerrotasCasa", key: "foraSequenciaDerrotasCasa", width: 25 },
			{ header: "ForaSequenciaDerrotasFora", key: "foraSequenciaDerrotasFora", width: 25 },
			{ header: "ForaJogosSemGanharCasa", key: "foraJogosSemGanharCasa", width: 25 },
			{ header: "ForaJogosSemGanharFora", key: "foraJogosSemGanharFora", width: 25 },
			{ header: "ForaJogosSemEmpatarCasa", key: "foraJogosSemEmpatarCasa", width: 25 },
			{ header: "ForaJogosSemEmpatarFora", key: "foraJogosSemEmpatarFora", width: 25 },
			{ header: "ForaJogosSemPerderCasa", key: "foraJogosSemPerderCasa", width: 25 },
			{ header: "ForaJogosSemPerderFora", key: "foraJogosSemPerderFora", width: 25 },
			{ header: "CasaMediaGolsMarcadosPorJogoCasa", key: "casaMediaGolsMarcadosPorJogoCasa", width: 25 },
			{ header: "CasaMediaGolsMarcadosPorJogoFora", key: "casaMediaGolsMarcadosPorJogoFora", width: 25 },
			{ header: "CasaMediaGolsSofridosPorJogoCasa", key: "casaMediaGolsSofridosPorJogoCasa", width: 25 },
			{ header: "CasaMediaGolsSofridosPorJogoFora", key: "casaMediaGolsSofridosPorJogoFora", width: 25 },
			{ header: "CasaJogosSemSofrerGolsCasa", key: "casaJogosSemSofrerGolsCasa", width: 25 },
			{ header: "CasaJogosSemSofrerGolsFora", key: "casaJogosSemSofrerGolsFora", width: 25 },
			{ header: "CasaJogosSemMarcarGolsCasa", key: "casaJogosSemMarcarGolsCasa", width: 25 },
			{ header: "CasaJogosSemMarcarGolsFora", key: "casaJogosSemMarcarGolsFora", width: 25 },
			{ header: "CasaJogosMaisDoisMeioGolsCasa", key: "casaJogosMaisDoisMeioGolsCasa", width: 25 },
			{ header: "CasaJogosMaisDoisMeioGolsFora", key: "casaJogosMaisDoisMeioGolsFora", width: 25 },
			{ header: "CasaJogosMenosDoisMeioGolsCasa", key: "casaJogosMenosDoisMeioGolsCasa", width: 25 },
			{ header: "CasaJogosMenosDoisMeioGolsFora", key: "casaJogosMenosDoisMeioGolsFora", width: 25 },
			{ header: "CasaAbreMarcadorCasa", key: "casaAbreMarcadorCasa", width: 25 },
			{ header: "CasaAbreMarcadorGlobal", key: "casaAbreMarcadorGlobal", width: 25 },
			{ header: "CasaEVencendoAoIntervaloCasa", key: "casaEVencendoAoIntervaloCasa", width: 25 },
			{ header: "CasaEVencendoAoIntervaloPorcentagem", key: "casaEVencendoAoIntervaloPorcentagem", width: 25 },
			{ header: "CasaEVenceuAoFimCasa", key: "casaEVenceuAoFimCasa", width: 25 },
			{ header: "CasaEVenceuAoFimPorcentagem", key: "casaEVenceuAoFimPorcentagem", width: 25 },
			{ header: "ForaMediaGolsMarcadosPorJogoCasa", key: "foraMediaGolsMarcadosPorJogoCasa", width: 25 },
			{ header: "ForaMediaGolsMarcadosPorJogoFora", key: "foraMediaGolsMarcadosPorJogoFora", width: 25 },
			{ header: "ForaMediaGolsSofridosPorJogoCasa", key: "foraMediaGolsSofridosPorJogoCasa", width: 25 },
			{ header: "ForaMediaGolsSofridosPorJogoFora", key: "foraMediaGolsSofridosPorJogoFora", width: 25 },
			{ header: "ForaJogosSemSofrerGolsCasa", key: "foraJogosSemSofrerGolsCasa", width: 25 },
			{ header: "ForaJogosSemSofrerGolsFora", key: "foraJogosSemSofrerGolsFora", width: 25 },
			{ header: "ForaJogosSemMarcarGolsCasa", key: "foraJogosSemMarcarGolsCasa", width: 25 },
			{ header: "ForaJogosSemMarcarGolsFora", key: "foraJogosSemMarcarGolsFora", width: 25 },
			{ header: "ForaJogosMaisDoisMeioGolsCasa", key: "foraJogosMaisDoisMeioGolsCasa", width: 25 },
			{ header: "ForaJogosMaisDoisMeioGolsFora", key: "foraJogosMaisDoisMeioGolsFora", width: 25 },
			{ header: "ForaJogosMenosDoisMeioGolsCasa", key: "foraJogosMenosDoisMeioGolsCasa", width: 25 },
			{ header: "ForaJogosMenosDoisMeioGolsFora", key: "foraJogosMenosDoisMeioGolsFora", width: 25 },
			{ header: "ForaAbreMarcadorFora", key: "foraAbreMarcadorFora", width: 25 },
			{ header: "ForaEVencendoAoIntervaloFora", key: "foraEVencendoAoIntervaloFora", width: 25 },
			{ header: "ForaEVencendoAoIntervaloPorcentagem", key: "foraEVencendoAoIntervaloPorcentagem", width: 25 },
			{ header: "ForaEVenceuAoFimFora", key: "foraEVenceuAoFimFora", width: 25 },
			{ header: "ForaEVenceuAoFimPorcentagem", key: "foraEVenceuAoFimPorcentagem", width: 25 },
			{ header: "CasaGolsMarcadosZeroQuinze", key: "casaGolsMarcadosZeroQuinze", width: 25 },
			{ header: "CasaGolsMarcadosDezeseisTrinta", key: "casaGolsMarcadosDezeseisTrinta", width: 25 },
			{ header: "CasaGolsMarcadosTrintaUmQuarentaCinco", key: "casaGolsMarcadosTrintaUmQuarentaCinco", width: 25 },
			{ header: "CasaGolsMarcadosQuarentaSeisSessenta", key: "casaGolsMarcadosQuarentaSeisSessenta", width: 25 },
			{ header: "CasaGolsMarcadosSessentaUmSetentaCinco", key: "casaGolsMarcadosSessentaUmSetentaCinco", width: 25 },
			{ header: "CasaGolsMarcadosSetentaSeisNoventa", key: "casaGolsMarcadosSetentaSeisNoventa", width: 25 },
			{ header: "ForaGolsMarcadosZeroQuinze", key: "foraGolsMarcadosZeroQuinze", width: 25 },
			{ header: "ForaGolsMarcadosDezeseisTrinta", key: "foraGolsMarcadosDezeseisTrinta", width: 25 },
			{ header: "ForaGolsMarcadosTrintaUmQuarentaCinco", key: "foraGolsMarcadosTrintaUmQuarentaCinco", width: 25 },
			{ header: "ForaGolsMarcadosQuarentaSeisSessenta", key: "foraGolsMarcadosQuarentaSeisSessenta", width: 25 },
			{ header: "ForaGolsMarcadosSessentaUmSetentaCinco", key: "foraGolsMarcadosSessentaUmSetentaCinco", width: 25 },
			{ header: "ForaGolsMarcadosSetentaSeisNoventa", key: "foraGolsMarcadosSetentaSeisNoventa", width: 25 },
			{ header: "CasaVitoriasNoUltimosDezJogos", key: "casaVitoriasNoUltimosDezJogos", width: 25 },
			{ header: "CasaEmpatesNoUltimosDezJogos", key: "casaEmpatesNoUltimosDezJogos", width: 25 },
			{ header: "CasaDerrotasNoUltimosDezJogos", key: "casaDerrotasNoUltimosDezJogos", width: 25 },
			{ header: "ForaVitoriasNoUltimosDezJogos", key: "foraVitoriasNoUltimosDezJogos", width: 25 },
			{ header: "ForaEmpatesNoUltimosDezJogos", key: "foraEmpatesNoUltimosDezJogos", width: 25 },
			{ header: "ForaDerrotasNoUltimosDezJogos", key: "foraDerrotasNoUltimosDezJogos", width: 25 },
		];	
		next(err, previsoes)
	})
	.then(function(next, err, previsoes){
		for (var i = 0; i < previsoes.length; i++) {
			var jogoAtual = previsoes[i];

			if(previsoes[i].Rodada <= 6){ continue;}
			if(previsoes[i].GoalsTime.length > 0){
				goalsOutRange = (previsoes[i].GoalsTime[0] <= 15 || previsoes[i].GoalsTime[0] >= 30)
				
				if(previsoes[i].GoalsTime[0] <= 15){
					continue;
				}

			}
			jogosValidosParaAplicarMetodo = jogosValidosParaAplicarMetodo + 1;
			var goalsOutRange = false;
			

			var currentYearAndChamp = previsoes.where(function(games){ return jogoAtual.Ano == games.Ano && jogoAtual.Campeonato == games.Campeonato; });
			
			var lastGamesHome = currentYearAndChamp.where(function(games){
					var actualRound = previsoes[i].Rodada;
					var initialRange = parseInt(actualRound) - 6;
					var finalRange = parseInt(actualRound) - 1;

					return ((parseInt(games.Rodada) >= initialRange) && (parseInt(games.Rodada) <= finalRange)) 
					&& 
					(
						(jogoAtual.NomeTimeCasa == games.NomeTimeCasa || jogoAtual.NomeTimeCasa == games.NomeTimeFora)
					);
			});


			var lastGamesAway = currentYearAndChamp.where(function(games){
					var actualRound = previsoes[i].Rodada;
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

			var deuRealmenteCertoBezos = (howManyGamesHasMoreThanOneHalfGoalAway >= 4 && howManyGamesHasMoreThanOneHalfGoalHome >= 4)
									 && previsoes[i].GoalsTime.length >= 2;

			var MaiorQueOitoDeuCerto = (howManyGamesHasMoreThanOneHalfGoalAway + howManyGamesHasMoreThanOneHalfGoalHome) >= 8
									 && previsoes[i].GoalsTime.length >= 2;

			if(deuRealmenteCertoBezos){
				jogosMetodoDeuCerto = jogosMetodoDeuCerto + 1;
			}

			if(MaiorQueOitoDeuCerto){
				jogosMaiorQueOitoDeuCerto = jogosMaiorQueOitoDeuCerto + 1;
				switch (jogoAtual.Campeonato){
					case "Bundesliga":
						jogosMaiorQueOitoDeuCertoAlemanha = jogosMaiorQueOitoDeuCertoAlemanha+1;
					case "Primera Division":
						jogosMaiorQueOitoDeuCertoEspanha = jogosMaiorQueOitoDeuCertoEspanha+1;
					case "Ligue 1":
						jogosMaiorQueOitoDeuCertoFranca = jogosMaiorQueOitoDeuCertoFranca+1;
					case "Barclays Premier League":
						jogosMaiorQueOitoDeuCertoInglaterra = jogosMaiorQueOitoDeuCertoInglaterra+1;
					case "Serie A TIM":
						jogosMaiorQueOitoDeuCertoItalia = jogosMaiorQueOitoDeuCertoItalia+1;
				}
			}

			  worksheet.addRow({
			  	ganhamosBufunfaBezos: (deuRealmenteCertoBezos).toString(),
			  	ganhamosBufunfaMaiorQueOito: (MaiorQueOitoDeuCerto).toString(),
			  	oitoDeDozeOverUmMeio: ((howManyGamesHasMoreThanOneHalfGoalAway + howManyGamesHasMoreThanOneHalfGoalHome ) >= 8).toString(),
			  	quatroDeSeisOverUmMeio: (howManyGamesHasMoreThanOneHalfGoalAway >= 4 && howManyGamesHasMoreThanOneHalfGoalHome >= 4).toString(),
			    goalsTime : previsoes[i].GoalsTime.join(','),
				nomeTimeCasa : previsoes[i].NomeTimeCasa,
				nomeTimeFora : previsoes[i].NomeTimeFora,
				resultado : previsoes[i].Resultado,
				ano : previsoes[i].Ano,
				rodada : previsoes[i].Rodada,
				campeonato : previsoes[i].Campeonato,
				casaTop5Total : previsoes[i].CasaTop5Total,
				casaTop5Casa : previsoes[i].CasaTop5Casa,
				casaTop5Fora : previsoes[i].CasaTop5Fora,
				foraTop5Total : previsoes[i].ForaTop5Total,
				foraTop5Fora : previsoes[i].ForaTop5Fora,
				foraTop5Casa : previsoes[i].ForaTop5Casa,
				casaSequenciaVitoriasCasa : previsoes[i].CasaSequenciaVitoriasCasa,
				casaSequenciaVitoriasFora : previsoes[i].CasaSequenciaVitoriasFora,
				casaSequenciaEmpatesCasa : previsoes[i].CasaSequenciaEmpatesCasa,
				casaSequenciaEmpatesFora : previsoes[i].CasaSequenciaEmpatesFora,
				casaSequenciaDerrotasCasa : previsoes[i].CasaSequenciaDerrotasCasa,
				casaSequenciaDerrotasFora : previsoes[i].CasaSequenciaDerrotasFora,
				casaJogosSemGanharCasa : previsoes[i].CasaJogosSemGanharCasa,
				casaJogosSemGanharFora : previsoes[i].CasaJogosSemGanharFora,
				casaJogosSemEmpatarCasa : previsoes[i].CasaJogosSemEmpatarCasa,
				casaJogosSemEmpatarFora : previsoes[i].CasaJogosSemEmpatarFora,
				casaJogosSemPerderCasa : previsoes[i].CasaJogosSemPerderCasa,
				casaJogosSemPerderFora : previsoes[i].CasaJogosSemPerderFora,
				foraSequenciaVitoriasCasa : previsoes[i].ForaSequenciaVitoriasCasa,
				foraSequenciaVitoriasFora : previsoes[i].ForaSequenciaVitoriasFora,
				foraSequenciaEmpatesCasa : previsoes[i].ForaSequenciaEmpatesCasa,
				foraSequenciaEmpatesFora : previsoes[i].ForaSequenciaEmpatesFora,
				foraSequenciaDerrotasCasa : previsoes[i].ForaSequenciaDerrotasCasa,
				foraSequenciaDerrotasFora : previsoes[i].ForaSequenciaDerrotasFora,
				foraJogosSemGanharCasa : previsoes[i].ForaJogosSemGanharCasa,
				foraJogosSemGanharFora : previsoes[i].ForaJogosSemGanharFora,
				foraJogosSemEmpatarCasa : previsoes[i].ForaJogosSemEmpatarCasa,
				foraJogosSemEmpatarFora : previsoes[i].ForaJogosSemEmpatarFora,
				foraJogosSemPerderCasa : previsoes[i].ForaJogosSemPerderCasa,
				foraJogosSemPerderFora : previsoes[i].ForaJogosSemPerderFora,
				casaMediaGolsMarcadosPorJogoCasa : previsoes[i].CasaMediaGolsMarcadosPorJogoCasa,
				casaMediaGolsMarcadosPorJogoFora : previsoes[i].CasaMediaGolsMarcadosPorJogoFora,
				casaMediaGolsSofridosPorJogoCasa : previsoes[i].CasaMediaGolsSofridosPorJogoCasa,
				casaMediaGolsSofridosPorJogoFora : previsoes[i].CasaMediaGolsSofridosPorJogoFora,
				casaJogosSemSofrerGolsCasa : previsoes[i].CasaJogosSemSofrerGolsCasa,
				casaJogosSemSofrerGolsFora : previsoes[i].CasaJogosSemSofrerGolsFora,
				casaJogosSemMarcarGolsCasa : previsoes[i].CasaJogosSemMarcarGolsCasa,
				casaJogosSemMarcarGolsFora : previsoes[i].CasaJogosSemMarcarGolsFora,
				casaJogosMaisDoisMeioGolsCasa : previsoes[i].CasaJogosMaisDoisMeioGolsCasa,
				casaJogosMaisDoisMeioGolsFora : previsoes[i].CasaJogosMaisDoisMeioGolsFora,
				casaJogosMenosDoisMeioGolsCasa : previsoes[i].CasaJogosMenosDoisMeioGolsCasa,
				casaJogosMenosDoisMeioGolsFora : previsoes[i].CasaJogosMenosDoisMeioGolsFora,
				casaAbreMarcadorCasa : previsoes[i].CasaAbreMarcadorCasa,
				casaAbreMarcadorGlobal : previsoes[i].CasaAbreMarcadorGlobal,
				casaEVencendoAoIntervaloCasa : previsoes[i].CasaEVencendoAoIntervaloCasa,
				casaEVencendoAoIntervaloPorcentagem : previsoes[i].CasaEVencendoAoIntervaloPorcentagem,
				casaEVenceuAoFimCasa : previsoes[i].CasaEVenceuAoFimCasa,
				casaEVenceuAoFimPorcentagem : previsoes[i].CasaEVenceuAoFimPorcentagem,
				foraMediaGolsMarcadosPorJogoCasa : previsoes[i].ForaMediaGolsMarcadosPorJogoCasa,
				foraMediaGolsMarcadosPorJogoFora : previsoes[i].ForaMediaGolsMarcadosPorJogoFora,
				foraMediaGolsSofridosPorJogoCasa : previsoes[i].ForaMediaGolsSofridosPorJogoCasa,
				foraMediaGolsSofridosPorJogoFora : previsoes[i].ForaMediaGolsSofridosPorJogoFora,
				foraJogosSemSofrerGolsCasa : previsoes[i].ForaJogosSemSofrerGolsCasa,
				foraJogosSemSofrerGolsFora : previsoes[i].ForaJogosSemSofrerGolsFora,
				foraJogosSemMarcarGolsCasa : previsoes[i].ForaJogosSemMarcarGolsCasa,
				foraJogosSemMarcarGolsFora : previsoes[i].ForaJogosSemMarcarGolsFora,
				foraJogosMaisDoisMeioGolsCasa : previsoes[i].ForaJogosMaisDoisMeioGolsCasa,
				foraJogosMaisDoisMeioGolsFora : previsoes[i].ForaJogosMaisDoisMeioGolsFora,
				foraJogosMenosDoisMeioGolsCasa : previsoes[i].ForaJogosMenosDoisMeioGolsCasa,
				foraJogosMenosDoisMeioGolsFora : previsoes[i].ForaJogosMenosDoisMeioGolsFora,
				foraAbreMarcadorFora : previsoes[i].ForaAbreMarcadorFora,
				foraEVencendoAoIntervaloFora : previsoes[i].ForaEVencendoAoIntervaloFora,
				foraEVencendoAoIntervaloPorcentagem : previsoes[i].ForaEVencendoAoIntervaloPorcentagem,
				foraEVenceuAoFimFora : previsoes[i].ForaEVenceuAoFimFora,
				foraEVenceuAoFimPorcentagem : previsoes[i].ForaEVenceuAoFimPorcentagem,
				casaGolsMarcadosZeroQuinze : previsoes[i].CasaGolsMarcadosZeroQuinze,
				casaGolsMarcadosDezeseisTrinta : previsoes[i].CasaGolsMarcadosDezeseisTrinta,
				casaGolsMarcadosTrintaUmQuarentaCinco : previsoes[i].CasaGolsMarcadosTrintaUmQuarentaCinco,
				casaGolsMarcadosQuarentaSeisSessenta : previsoes[i].CasaGolsMarcadosQuarentaSeisSessenta,
				casaGolsMarcadosSessentaUmSetentaCinco : previsoes[i].CasaGolsMarcadosSessentaUmSetentaCinco,
				casaGolsMarcadosSetentaSeisNoventa : previsoes[i].CasaGolsMarcadosSetentaSeisNoventa,
				foraGolsMarcadosZeroQuinze : previsoes[i].ForaGolsMarcadosZeroQuinze,
				foraGolsMarcadosDezeseisTrinta : previsoes[i].ForaGolsMarcadosDezeseisTrinta,
				foraGolsMarcadosTrintaUmQuarentaCinco : previsoes[i].ForaGolsMarcadosTrintaUmQuarentaCinco,
				foraGolsMarcadosQuarentaSeisSessenta : previsoes[i].ForaGolsMarcadosQuarentaSeisSessenta,
				foraGolsMarcadosSessentaUmSetentaCinco : previsoes[i].ForaGolsMarcadosSessentaUmSetentaCinco,
				foraGolsMarcadosSetentaSeisNoventa : previsoes[i].ForaGolsMarcadosSetentaSeisNoventa,
				casaVitoriasNoUltimosDezJogos : previsoes[i].CasaVitoriasNoUltimosDezJogos,
				casaEmpatesNoUltimosDezJogos : previsoes[i].CasaEmpatesNoUltimosDezJogos,
				casaDerrotasNoUltimosDezJogos : previsoes[i].CasaDerrotasNoUltimosDezJogos,
				foraVitoriasNoUltimosDezJogos : previsoes[i].ForaVitoriasNoUltimosDezJogos,
				foraEmpatesNoUltimosDezJogos : previsoes[i].ForaEmpatesNoUltimosDezJogos,
				foraDerrotasNoUltimosDezJogos : previsoes[i].ForaDerrotasNoUltimosDezJogos,
			  }).commit();
		}

		workbook.csv.writeFile('filename')
	    .then(function() {
	        console.log('foi'); 
	        console.log(jogosMetodoDeuCerto.toString() + " MetodoBezos");
	        console.log(jogosValidosParaAplicarMetodo);
	        console.log(jogosMaiorQueOitoDeuCerto.toString() + " MetodoMaiorQueOito");
	        console.log(jogosMaiorQueOitoDeuCertoAlemanha.toString() + " Alemao");
	        console.log(jogosMaiorQueOitoDeuCertoEspanha.toString() + " Espanhol");
	        console.log(jogosMaiorQueOitoDeuCertoFranca.toString() + " Fraces");
	        console.log(jogosMaiorQueOitoDeuCertoInglaterra.toString() + " Ingles");
	        console.log(jogosMaiorQueOitoDeuCertoItalia.toString() + " Italiano");
	    });
	});