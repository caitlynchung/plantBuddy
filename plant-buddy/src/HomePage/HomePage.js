import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

class HomePage extends Component {
    render() {
        return (
            <div className="HomePage">
                <h1>Plant Buddy</h1>
                <p>A Plant Watering Schedule Tracker</p>
                <p>
                    <img className="BuddyIcon" src="/buddy_icon.PNG" alt="plant buddy icon"/>
                    <img className="BuddyIcon" src="/plant_fail.PNG" alt="plant fail icon"/>
                </p>
                <Link to="/plants">Let's go check on my plants!</Link>
            </div>
        );
    }
}

export default HomePage;