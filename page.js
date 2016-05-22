var page = require('webpage').create();
page.open('https://www.academiadasapostasbrasil.com/stats/match/brasil-stats/2218297/1/prelive', function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
    var ua = page.evaluate(function() {
      return $('.stats-game-head-teamname a')[1].text.trim();
    });
    console.log(ua);
  }
});

