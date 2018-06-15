import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage/HomePage.js';
import PlantPage from './PlantPage/PlantPage.js';
import AddPlantPage from './AddPlantPage/AddPlantPage.js';
import NavigationBar from './NavigationBar/NavigationBar.js';
//import EditPlantPage from './PlantPage/EditPlantPage.js';
//import DeletePlantPage from './PlantPage/DeletePlantPage.js';
//import AddPlantPage from './PlantPage/AddPlantPage.js';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <NavigationBar />
            <Route exact path="/" component={HomePage}/>
            <Route path="/plants" component={PlantPage}/>
            <Route path="/add_plant" component={AddPlantPage}/>
            {/*<Route path="/edit_plant" component={EditPlantPage}/>*/}
          </div>
        </Router>  
      </div>
    );
  }
}

export default App;
