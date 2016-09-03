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

		if(teamName == "Leipzig"){
		  	teamName = "RB Leipzig";
		}

		if(teamName == "Alaves"){
		  	teamName = "Deportivo Alaves";
		}

		if(teamName == "Hertha BSC"){
		  	teamName = "Hertha Berlin";
		}

		if(teamName == "Leverkusen"){
		  	teamName = "Bayer Leverkusen";
		}

		if(teamName == "M'gladbach"){
		  	teamName = "Borussia Monchengladbach";
		}


		if(teamName == "Frankfurt"){
		  	teamName = "Eintracht Frankfurt";
		}


		if(teamName == "Hamburg"){
		  	teamName = "Hamburgo";
		}
		
		if(teamName == "Koln"){
		  	teamName = "Colonia";
		}

		if(teamName == "Dortmund"){
			teamName = "Borussia Dortmund";
		}

		if(teamName == "Mainz 05"){
			teamName = "Mainz";
		}

		if(teamName == "Bremen"){
			teamName = "Werder Bremen"
		}
		
		if(teamName == "Bayern Munchen"){
			teamName = "Bayern Munique"
		}
		

		return teamName;
	}
}