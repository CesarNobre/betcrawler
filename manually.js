var request = require('request');
var cheerio = require('cheerio');
var datetime = require('node-datetime');

var url = 'https://www.academiadasapostasbrasil.com/stats/match/espanha-stats/2088629/1/live'; // input your url here

var timeoutInMilliseconds = 10*1000
var opts = {
  url: url,
  timeout: timeoutInMilliseconds
}

setInterval(function(){

request(opts, function (err, res, body) {
  if (err) {console.dir(err);return;}
  var $ = cheerio.load(body);

var mandante ={};
var visitante ={};
  visitante.nomeClube = $('.stats-game-head-teamname a')[3].children[0].data.trim();
  visitante.formacao = $('.team_B_formation').text();

  mandante.formacao = $('.team_A_formation').text();
  mandante.NomeClube = $('.stats-game-head-teamname a')[1].children[0].data.trim();

  $('.stat_value_number_team_A').each(function(index,element){
  	var descricaoSemEspacos = toTitleCase(element.next.next.children[0].data.trim());
  	var descricaoSemAcentos = removerAcentos(descricaoSemEspacos);
  	mandante[descricaoSemAcentos] = element.children[0].data.trim();
  });

  $('.stat_value_number_team_B').each(function(index,element){
  	var descricaoSemEspacos = toTitleCase(element.prev.prev.children[0].data.trim());
  	var descricaoSemAcentos = removerAcentos(descricaoSemEspacos);
  	visitante[descricaoSemAcentos] = element.children[0].data.trim();
  });

  console.log("*******MANDANTE****");
  console.log(mandante);
  console.log("*******VISITANTE****");
  console.log(visitante);
  var horario = datetime.create();
  console.log("*****ATUALIZADO EM : " + horario.format('d/m/Y H:M:S'));

});

  
}, 7000);


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/ +/g, "");
}      


function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
	var mapaAcentosHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};

	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	return string;
}