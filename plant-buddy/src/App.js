import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage/HomePage.js';
import PlantPage from './PlantPage/PlantPage.js';
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
            {/*<Route path="/edit_plant" component={EditPlantPage}/>
            <Route path="/delete_plant" component={DeletePlantPage}/>
            <Route path="/add_plant" component={AddPlantPage}/>*/}
          </div>
        </Router>  
      </div>
    );
  }
}

export default App;
