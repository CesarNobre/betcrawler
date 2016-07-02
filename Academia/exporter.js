var mongoXlsx = require('mongo-xlsx');
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/betcrawler');
var db = Mongoose.connection;
var PrevisaoJogo = require('./PrevisaoJogo');

db.once('open', function() {
  console.log('Conectado ao MongoDB.')
});

var previsaoJogoSchema = new Mongoose.Schema(PrevisaoJogo.module.PrevisaoJogo);
var previsaoModel = Mongoose.model('previsaoModel', previsaoJogoSchema);

var data = previsaoModel.find({});

console.log("CADE?");
console.log(data);