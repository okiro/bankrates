/*jslint node: true, asi:true */
'use strict';
module.exports = function ratesBankOfBaku(timestamp, callback) {
	var http = require('http');
	var options = {
		hostname: 'www.bankofbaku.com',
		path: '/az/valyuta-m-z-nn-l-ri/',
		method: 'GET'
	};

	var req = http.request(options, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			try {
				var date = '';

				var string = data;
				string = string.match(/<div class="cur_bottom">(.|\s)*?<\/table>/);
				string = string[0].match(/\d{1,2}\.\d{1,4}/g);
				var rates = {
					'bankofbaku': [{
						'date': date,
						'timestamp': timestamp
					}, {
						'buy_usd': string[1],
						'buy_eur': string[4],
						'buy_gbp': string[10],
						'buy_rub': string[7],
						'sell_usd': string[2],
						'sell_eur': string[5],
						'sell_gbp': string[11],
						'sell_rub': string[8],
					}]
				};

				var readFile = require(__dirname + '/ratesReadFile.js');
				readFile('bankofbaku', rates, timestamp, callback);
			}
			catch (err) {
				console.log(timestamp + '\tGetRates:\tBank of Baku rates ERROR ' + err);
				// require('fs').unlink(__dirname + '/../data/bankofbaku_rates.json', function(err) {
				// 	if (err)
				// 		if (err.code !== 'ENOENT') console.log(err);
				// });
			}
		});
	});

	req.on('error', function(e) {
		console.error(e);
	});

	req.end();
};