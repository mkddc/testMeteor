import React, { Component, PropTypes } from 'react';
// import shouldPureComponentUpdate from 'react-pure-render/function';
 
import GoogleMap from 'google-map-react';
import Marker from './Marker.jsx';
import ButtonToCSV from './ButtonToCSV';

// Importation du fichier json :
var shopsJson = require('../api/json/jsonShops.json');
// Contient toutes les infos :
var infoShops = [];
// Contient toutes les infos sauf lat et lng:
var shopsCSV = [];

// @controllable(['center', 'zoom', 'markers'])
export default class MicroMap extends Component {
	constructor(props) {
		super(props);

		this.handleMarkerClick = this.handleMarkerClick.bind(this);
		this.handlePrintCSV = this.handlePrintCSV.bind(this);

		this.state = {
			shops2CSV: [],
		}
	}
	// shouldComponentUpdate(){
	// 	return shouldPureComponentUpdate();
	// }
	componentWillMount(){
		// Création des différents markers :
		// récupération des données des magasins :
		var magasinsArr = shopsJson['shopsList'];

		magasinsArr.forEach(function(element, index) {
			infoShops[index] = [element['lat'], element['lng'], element['nom'], element['addresse'], element['tel']];
		});
	}

	handleMarkerClick(key, isSelected){
		// On a sélectionné le marker
		if(isSelected){

			shopsCSV.push(infoShops[key]);
			// console.log('shopsCSV +');
			// console.log(shopsCSV);
		}
		// soit le marker n'a pas été activé, soit il a été activé puis désactivé :
		// On vérifie sa présence dans le tableau des shops à imprimer. S'il y est, on 
		// le retire.
		else{
			var indexToRemove = shopsCSV.indexOf(infoShops[key]);
			// console.log('indexToRemove');
			// console.log(indexToRemove);
			if (indexToRemove > -1) {
				// on l'a trouvé, donc on le retire :
				shopsCSV.splice(indexToRemove, 1);
			}
			// console.log('shopsCSV -');
			// console.log(shopsCSV);
		}
		// MAJ du tableau des magasins à imprimer :
		this.setState({
			shops2CSV: shopsCSV
		});
	}
	handlePrintCSV(array){
		// console.log(array);
		// Création du fichier CSV :
		var csv = 'Nom, Adresse, Tel\n';

		var arrayLength = array.length;

		if (arrayLength === 0) {
			alert('Veuillez sélectionner des magasins à exporter en CSV.');
		}
		else {
			// 
			array.forEach( function(element, index) {
				console.log(index);
				csv += element[2] + "," + element[3] + "," + element[4];
				csv += '\n';
			});

			// console.log(csv);

			// Simulation d'un élément lien afin de lancer le téléchargement
			// du fichier csv :
			var csvElement = document.createElement('a');
			csvElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
			csvElement.target = '_blank';
			csvElement.download = 'shops.csv';
			csvElement.click();			
		}


	}
	render(){
		var shopMarkers = infoShops.map(function(elem, index) {
			return <Marker 
						key={ index }
						id={ index } 
						lat={ elem[0] } 
						lng={ elem[1] }
						nom={ elem[2] }
						addresse={ elem[3] }
						tel={ elem[4] }
						onClick={ this.handleMarkerClick }
						onMouseEnter={ this.showInfoBox }
					>
					</Marker>
		// rajout de 'this' en 2e paramètre de map, sinon les fonctions 
		// onClick ne marchent pas (problème avec la fct map)
		}, this);

		return(
			<GoogleMap
				className='GMap'
				// bootstrapURLKeys={ { key: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo' } }
				bootstrapURLKeys={ { key: 'AIzaSyAGNXG4UdnErAn4jfJ2lgwZ0OEGbT-6lws' } }
				defaultCenter={this.props.center}
				defaultZoom={this.props.zoom} >
				{ shopMarkers }
				<ButtonToCSV toPrint={ this.state.shops2CSV } onClick={ this.handlePrintCSV }/>
			</GoogleMap>
		);
	}
}

MicroMap.propTypes = {
	center: PropTypes.object,
	zoom: PropTypes.number,
	onChildClik: PropTypes.func
};
// On prend comme centre de la carte, les coordonnées de Paris
MicroMap.defaultProps = {
	center: { lat: 48.8566, lng: 2.3522 },
	zoom: 11
};