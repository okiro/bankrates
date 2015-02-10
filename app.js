// "use strict";
//Server create
var http = require('http');
var formatDate = require(__dirname + "/functions/formatDate");
var getContent = require(__dirname + "/functions/getContent");
var log = require(__dirname + "/functions/logging");


var server = http.createServer(function (request, response) {
  if (request.method === "GET"){
    getContent(request.url, response, __dirname);
  }
  request.on('end', function(){
    // console.log(formatDate(new Date()) + "\tReguest: " + request.method + " URL:" + request.url);

  });
}).listen(3000);
// console.log('Server running at http://127.0.0.1:8080/');
// ----------------------------------------------

// Rates query
var ratesIba = require(__dirname + "/functions/getRates/ratesIba");
var ratesBanktechnique = require(__dirname + "/functions/getRates/ratesBankTechnique");
var ratesKapitalBank = require(__dirname + "/functions/getRates/ratesKapitalBank");
var ratesBankStandard = require(__dirname + "/functions/getRates/ratesBankStandard");
var ratesBankOfBaku= require(__dirname + "/functions/getRates/ratesBankOfBaku");

var concatenateRates = require(__dirname + "/functions/concatenateRates");

function GetRates(){ 
  var timestamp = formatDate(new Date());
  var bob = ratesBankOfBaku(timestamp);
  ratesKapitalBank(timestamp);  
  ratesIba(timestamp);
  ratesBanktechnique(timestamp);
  ratesBankStandard(timestamp);
  if (bob === true) console.log("hello bob");
  concatenateRates();
}

setInterval(GetRates(), 1000 * 60 * 10);
