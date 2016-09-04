var nodemailer = require('nodemailer');
var fs = require('fs');
var Mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');


var self = this;
var db = Mongoose.connection;

Mongoose.connect('mongodb://sa:arroz@ds013486.mlab.com:13486/betbot');

var PrevisaoJogo = require('./PrevisaoJogo');

var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;

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

self.opts = {
  url: 'https://www.academiadasapostasbrasil.com/stats/competition/espanha-stats/7',
  timeout: 50000
}

self.gamesToBet = [];
self.eachRoundGameLink = [];

sequence
	.then(function(next){
       	request(self.opts, function(err, res, body){
			if(err){throw err;}
			
			var $ = cheerio.load(body);

			$('.darker a').each(function() {
				if($(this).text().trim() != 'vs'){ 
					console.log('ops, já tem resultado'); 
					return true;
				}
				self.eachRoundGameLink.push($(this).attr('href'));
			});
		    next(err, self.eachRoundGameLink);
		});

	})
	.then(function(next, err, previsoes){
		for (var i = 0; i < previsoes.length; i++) {
			var jogoAtual = previsoes[i];

			if(jogoAtual.Rodada <= 6){ continue;}

			var currentYearAndChamp = previsoes.where(function(games){ return jogoAtual.Ano == games.Ano && jogoAtual.Campeonato == games.Campeonato; });
			
			var lastGamesTeamHome = currentYearAndChamp.where(function(games){
					var actualRound = jogoAtual.Rodada;
					var initialRange = parseInt(actualRound) - 6;
					var finalRange = parseInt(actualRound) - 1;

					return ((parseInt(games.Rodada) >= initialRange) && (parseInt(games.Rodada) <= finalRange)) 
					&& ((jogoAtual.NomeTimeCasa == games.NomeTimeCasa || jogoAtual.NomeTimeCasa == games.NomeTimeFora));
			});


			var lastGamesTeamAway = currentYearAndChamp.where(function(games){
					var actualRound = jogoAtual.Rodada;
					var initialRange = parseInt(actualRound) - 6;
					var finalRange = parseInt(actualRound) - 1;

					return ((parseInt(games.Rodada) >= initialRange) && (parseInt(games.Rodada) <= finalRange)) 
					&& ((jogoAtual.NomeTimeFora == games.NomeTimeCasa || jogoAtual.NomeTimeFora == games.NomeTimeFora));
			});

			var howManyGamesHasMoreThanOneHalfGoalHome = 0;
			for (var j = 0; j < lastGamesTeamHome.length; j++) {
				if(lastGamesTeamHome[j].GoalsTime.length >= 2){
					howManyGamesHasMoreThanOneHalfGoalHome = howManyGamesHasMoreThanOneHalfGoalHome + 1;
				}
			}

			var howManyGamesHasMoreThanOneHalfGoalAway = 0;
			for (var j = 0; j < lastGamesTeamAway.length; j++) {
				if(lastGamesTeamAway[j].GoalsTime.length >= 2){
					howManyGamesHasMoreThanOneHalfGoalAway = howManyGamesHasMoreThanOneHalfGoalAway + 1;
				}
			}

			var deuRealmenteCertoBezos = (howManyGamesHasMoreThanOneHalfGoalAway >= 4 && howManyGamesHasMoreThanOneHalfGoalHome >= 4);

			var MaiorQueOitoDeuCerto = (howManyGamesHasMoreThanOneHalfGoalAway + howManyGamesHasMoreThanOneHalfGoalHome) >= 8;

			if(deuRealmenteCertoBezos == true || MaiorQueOitoDeuCerto == true){
				self.gamesToBet.push({
					NomeTimeCasa: jogoAtual.NomeTimeCasa,
					NomeTimeFora: jogoAtual.NomeTimeFora,
					Campeonato: jogoAtual.Campeonato,
					bezos: deuRealmenteCertoBezos,
					maiorQueOito: MaiorQueOitoDeuCerto
				});
			}

			if(deuRealmenteCertoBezos){
				jogosMetodoDeuCerto = jogosMetodoDeuCerto + 1;
			}

			if(MaiorQueOitoDeuCerto){
				jogosMaiorQueOitoDeuCerto = jogosMaiorQueOitoDeuCerto + 1;
			}
		}
	    next(err);
	})
	.then(ReadEmailUserAndPassword)
	.then(SendEmail);

	function ReadEmailUserAndPassword(next, err){
		var emailAddress = '';
		var emailPassword = '';

		fs.readFile('./smtpmailaddress', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var emailData = data.split('\n');

			var emailUserAndPass = {
				address:emailData[0],
				password:emailData[1]
			};

			next(err, emailUserAndPass);
		});

	}

	function SendEmail(next, err, emailData){
		var transportDataUnformatted = 'smtps://{user}%40gmail.com:{password}@smtp.gmail.com';
		var formattedTransportData = transportDataUnformatted.replace('{user}', emailData.address).replace('{password}', emailData.password);
		var transporter = nodemailer.createTransport(formattedTransportData);
		var plaintextBody = '';

		self.gamesToBet.push({
					NomeTimeCasa: "Barcelona",
					NomeTimeFora: "Betis",
					Campeonato: "Primera Division",
					bezos: true,
					maiorQueOito: false	
		});

		for (var index = 0; index < self.gamesToBet.length; index++) {
			var currentGame = self.gamesToBet[index];
			var unformattedPlaintextBody = '<b>Campeonato: {Campeonato}</b> {nomeTimeCasa} x {nomeTimeFora} -> método bezos? <b>{bezos}</b> método maior que oito? {maiorQueOito} \n';
			plaintextBody += unformattedPlaintextBody
							.replace('{nomeTimeCasa}', currentGame.NomeTimeCasa)
							.replace('{nomeTimeFora}', currentGame.NomeTiraFora)
							.replace('{Campeonato}', currentGame.Campeonato)
							.replace('{maiorQueOito}', currentGame.maiorQueOito)
							.replace('{bezos}', currentGame.bezos);
		}

		var mailOptions = {
			from: 'cesarnobrefilho@gmail.com', // sender address
			to: 'cesarnobrefilho@gmail.com', // list of receivers
			subject: 'betbot agenda 💵', // Subject line
			text: plaintextBody, // plaintext body
			html: plaintextBody // html body
		};

		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			
			console.log('Message sent: ' + info.response);
			process.exit();
		});
	}