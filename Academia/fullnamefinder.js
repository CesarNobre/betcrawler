var RemoverAcentos = require('./removeracentos');

exports.module = {
	buscar: function (teamName) {
		teamName = RemoverAcentos.module.remover(teamName);
		
		if(teamName == "Atletico"){
		  	teamName = "Atletico de Madrid";
		}
		
		if(teamName == "Gijon"){
		  	teamName = "Sporting Gijon";
		}
		
		if(teamName == "Athletic Club"){
		  	teamName = "Athletic Bilbao";
		}

		if(teamName == "La Coruna"){
		  	teamName = "Deportivo La Coruna";
		}

		return teamName;
	}
}