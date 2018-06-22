import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage/HomePage.js';
import PlantPage from './PlantPage/PlantPage.js';
import NavigationBar from './NavigationBar/NavigationBar.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <NavigationBar />
            <Route exact path="/" component={HomePage}/>
            <Route path="/plants" component={PlantPage}/>
          </div>
        </Router>  
      </div>
    );
  }
}

export default App;
