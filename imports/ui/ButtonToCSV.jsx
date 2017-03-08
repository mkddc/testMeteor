import React, { Component, PropTypes } from 'react';

export default class ButtonToCSV extends Component {
	constructor(){
		super();
		this.handleCSV = this.handleCSV.bind(this);
	}
	handleCSV(){
		this.props.onClick(this.props.toPrint);
	}
	render(){
		return(
			<button className='btn'
					onClick={ this.handleCSV }>
				Print to CSV !
			</button>
		);
	}
}
