import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

// Chargemet de la collection :
import { Shops } from '../imports/api/shops.js';

// Utilisation de jquery côté serveur, afin de traiter le retour en HTML :
import jsdom from 'jsdom';
var fs = require('fs');


var magasins = [];

function getShops (magasins, callback) {
	// Récupération des infos de tous les magasins Micromania :
	
	var options = {
		headers: {
			"x-requested-with": "XMLHttpRequest",
		},
	}

	var url = 'http://www.micromania.fr/shops/index/getStoreLocator/';

	callback('POST', url, options, httpCallBack);

}

function httpCall (mode, url, options, callback) {
	HTTP.call('POST', url, options, callback);
}

function httpCallBack(err, resp){
	if(err) {
		console.log('error');
		console.log(err);
	} else {
		var data = JSON.parse(resp.content);
		// Manipulation des données :
		domManip(data, insertInCollectionCB);
	}	
}

function domManip(data, callback){
	// var magasins = [];
	jsdom.env(
	{
		html: '',
		scripts: [],
		done: function(error, window) {
			var dataShops = data.shops;
			var dataMap = data.map;

			const $ = require('jquery')(window);
			// console.log($.param({ someKey: 'Some Value!' }));

			var parsedShops = $('<html></html>').append(dataShops);
			var parsedMap = $('<html></html>').append(dataMap);

			var mapDataSplit = parsedMap.find('script').text().split("\n");

			var i = 0;
			parsedShops.find('.pickup-address').each(function(index, el) {
				var nomMagasin = $(el).find('strong').text();

				var addresseMagasin = 
				$(el).find('.address').html().trim().replace('<br>',', ') 
				+ " " + $(el).find('.area').text().split("Téléphone :")[0].trim();

				var telMagasin = $(el).find('.area').text().split("Téléphone :")[1].trim();

				// Récupération de la latitude et de la longitude :
				var lat = mapDataSplit[5 + i*3].trim().split(",")[0];
				var lng = mapDataSplit[6 + i*3].trim().split(",")[0];

				// Création de ce qui servira pour l'objet Record :
				var shopRecord = {
					'nom': nomMagasin,
					'addresse': addresseMagasin,
					'tel': telMagasin,
					'lat': lat,
					'lng': lng,
					'isChecked': false
				};

				// Remplissage du tableau d'objets de magasins : 
				magasins[i] = shopRecord;
				// console.log('shoprecord');
				// console.log(shopRecord);
				i++;
			});

			callback();

		}
	});
}

function insertInCollectionCB(){
	// console.log('magasins mag mag 1');
	// console.log(magasins);

	var obj = {
		'shopsList': magasins
	};

	var jsonStr = JSON.stringify(obj);

	// Ecriture dans un fichier json :
	fs.writeFile('../../../../../imports/api/json/jsonShops.json', jsonStr, 'utf-8', function (err, res) {
		if(err){
			console.log('json err');
			console.log(err);
		}
		else{
			console.log('tout est ok');
		}
	});

	// MAJ de la collection : Problème de Fiber...?!?
	// magasins.forEach( function(element, index) {
	// 	Shops.insert(element);
	// });
}

Meteor.startup(() => {
	// code to run on server at startup
	getShops(magasins, httpCall);

});