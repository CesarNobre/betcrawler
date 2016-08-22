require('linqjs');
var Excel = require('exceljs');
var workbook = new Excel.Workbook();
var sheet = workbook.addWorksheet('My Sheet');
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/betcrawler');
var db = Mongoose.connection;

var PrevisaoJogo = require('./PrevisaoJogo');
var excelColumns = require('./methodBezos/columns');
var excelRow = require('./methodBezos/row');

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
		worksheet.columns = excelColumns.module.columns;	
		console.log('foi');
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
				
				if(jogoAtual.Campeonato == "Bundesliga"){
					jogosMaiorQueOitoDeuCertoAlemanha = jogosMaiorQueOitoDeuCertoAlemanha+1;
				}
				if(jogoAtual.Campeonato == "Primera Division"){
					jogosMaiorQueOitoDeuCertoEspanha = jogosMaiorQueOitoDeuCertoEspanha+1;
				}
				if(jogoAtual.Campeonato == "Ligue 1"){
					jogosMaiorQueOitoDeuCertoFranca = jogosMaiorQueOitoDeuCertoFranca+1;
				}
				if(jogoAtual.Campeonato == "Barclays Premier League"){
					jogosMaiorQueOitoDeuCertoInglaterra = jogosMaiorQueOitoDeuCertoInglaterra+1;
				}
				if(jogoAtual.Campeonato == "Serie A TIM"){
					jogosMaiorQueOitoDeuCertoItalia = jogosMaiorQueOitoDeuCertoItalia+1;
					console.log(jogoAtual.Campeonato);
				}
			}

			var newColumns = {
				ganhamosBufunfaBezos: (deuRealmenteCertoBezos).toString(),
				ganhamosBufunfaMaiorQueOito: (MaiorQueOitoDeuCerto).toString(),
				oitoDeDozeOverUmMeio: ((howManyGamesHasMoreThanOneHalfGoalAway + howManyGamesHasMoreThanOneHalfGoalHome ) >= 8).toString(),
				quatroDeSeisOverUmMeio: (howManyGamesHasMoreThanOneHalfGoalAway >= 4 && howManyGamesHasMoreThanOneHalfGoalHome >= 4).toString(),
				jogo: previsoes[i]
			}
			  worksheet.addRow(new excelRow.module.Row(newColumns, previsoes[i])).commit();
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