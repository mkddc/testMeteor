import React, { Component, PropTypes } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
  // On importe la collection mongo
// import { Shops } from '../api/shops.js';

import MicroMap from './MicroMap';

var AppWidth = 0;
var AppHeight = 0;

var style = { }

class App extends Component {
    componentWillMount(){
      // Récupération des dimensions de la fenêtre du navigateur
      var AppWidth = document.body.scrollWidth;
      var AppHeight = document.body.scrollHeight;

      style = {
        height: AppHeight*0.9,
        width: AppWidth*0.9
      }
    }
    render(){
      return (
        <div className="bigContainer">
          <h1>Liste des magasins Micromania</h1>
          <div className="mapContainer" style={ style }>
              <MicroMap />
          </div>
        </div>
      );
    }
}


// App.propTypes = {
// 	shops: PropTypes.array.isRequired,
// };
// // Afin de pouvoir disposer des collections au niveau des composants React
// export default createContainer(() => {
// 	return {
// 		shops: Shops.find({}).fetch(),
// 	};
// }, App);

export default App;








