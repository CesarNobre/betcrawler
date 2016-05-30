var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/teste');


var db = Mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  console.log('Conectado ao MongoDB.')
  // Vamos adicionar nossos Esquemas, Modelos e consultas aqui
});

var movieSchema = new Mongoose.Schema({
  title: { type: String },
  rating: String,
  releaseYear: Number,
  hasCreditCookie: Boolean
});


var Movie = Mongoose.model('Movie', movieSchema);

Movie.findOne({ title: 'Thor' }, function(err, thor) {
  if (err) return console.error(err);
  console.dir(thor);
});


