import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomePage extends Component {
    render() {
        return (
            <div>
                <h1>Plant Buddy</h1>
                <p>Keep your plants happy</p>
                <Link to="/plants">Check my plants</Link>
            </div>
        );
    }
}

export default HomePage;