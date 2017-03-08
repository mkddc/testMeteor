import React, { Component, PropTypes } from 'react';

// var micromaniaLogo = require('../img/micromaniaLogo.png');

export default class Marker extends Component {
	constructor(){
		super();
		this.handleClick = this.handleClick.bind(this);
		this.showInfoBox = this.showInfoBox.bind(this);
		this.closeInfoBox = this.closeInfoBox.bind(this);

		this.state = {
			isSelected: false,
			infoBoxStyle: { 'display': 'none' }
		}
	}
	handleClick(){
		console.log(this.props.myId);

		// Fonction servant à définir si le magasin a été selectionné
		var markerBool = false;
		markerBool = this.state.isSelected === false ? true : false;

		this.setState({
			isSelected: markerBool
		});

		this.props.onClick(this.props.id, markerBool);
	}
	showInfoBox(){
		this.setState({
			infoBoxStyle: { 'display': 'block' }
		})
	}
	closeInfoBox(){
		this.setState({
			infoBoxStyle: { 'display': ' none' }
		})
	}
	render(){
		return(
			<div key={ this.props.key } >
					<img
						className={ this.state.isSelected === true ? 'logoSelected' : 'logo' } 
						key={ this.props.key }
						onClick={ this.handleClick }
						// Gestion de l'infoBox : 
						onMouseEnter={ this.showInfoBox } 
						onMouseLeave={ this.closeInfoBox }
						key={ this.props.key } 
						src='img/Micromania.png' 
						alt='logo Micro' 
					/>
					<div 	
						className='infoBox'
						// Mise à jour du style en fonction du hover (mouseEnter et Leave)
						style={ this.state.infoBoxStyle }
						key={ this.props.key } >
						<p className='pNom'>{ this.props.nom }</p>
						<p>{ this.props.addresse }</p>
						<p>{ this.props.tel }</p>
				
					</div>
			</div>
		);
	}
}
