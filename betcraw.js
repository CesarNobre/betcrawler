var request = require('request');
var cheerio = require('cheerio');
var datetime = require('node-datetime');

var url = 'https://wab-visualisation.performgroup.com/csb/index.html?wbuserId=0&token=98034c4ec06283a91d3d99e441038e32bf559a1ac9398e92789f2eafc0ec0a85857803eddcee9e815fbd5114177a1c254aea6a4bad2b853612d866426a57082d341b849eb4f36289d55de91b1df0af5afe55cb83cdfcea9deebe61731ac278c7206ff99dd28b595f6904d6f65f1184b9a287c14b0c7e69f0a26a0db436a69205&width=334&height=190&cssdiff=https%3a%2f%2fassets.cdnbf.net%2fstatic%2fdatavis%2fbf-css%2fbetfair1.css&flash=y&streamonly=true&partnerId=7&statsswitch=false&lang=en&defaultview=stats&version=1.23'; // input your url here

var timeoutInMilliseconds = 10*1000
var opts = {
  url: url,
  timeout: timeoutInMilliseconds
}

setInterval(function(){

request(opts, function (err, res, body) {
  if (err) {console.dir(err);return;}
  var $ = cheerio.load(body);
console.log(body);

var mandante ={};
var visitante ={};



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