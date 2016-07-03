var Excel = require('exceljs');
var Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/betcrawler');
var db = Mongoose.connection;
var PrevisaoJogo = require('./PrevisaoJogo');
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
var options = {
    useStyles: true,
    useSharedStrings: true
  };

var workbook = new Excel.Workbook();

  //workbook.zip.pipe(res);

  var worksheet = workbook.addWorksheet("My Sheet");

  worksheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Name", key: "name", width: 32 },
    { header: "D.O.B.", key: "DOB", width: 10 }
  ];

  worksheet.addRow({
     id: 100,
     name: "name",
     DOB: "DOB"
  }).commit();


  workbook.csv.writeFile("filename")
    .then(function() {
        console.log('foi');
    });