import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

class HomePage extends Component {
    render() {
        return (
            <div className="HomePage">
                <h1>Plant Buddy</h1>
                <p>Keep your plants happy</p>
                <p><img className="BuddyIcon" src="/buddy_icon.PNG" alt="plant buddy icon"/></p>
                <Link to="/plants">Check my plants</Link>
            </div>
        );
    }
}

export default HomePage;