import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlantEntry extends Component {
    render() {
        return(
            <div className="PlantItem">
                <p>Name: {this.props.plant.name}</p>
                <p>Last Watered: {this.props.plant.last_watered}</p>
                <button 
                    className="DeleteButton" 
                    onClick={
                        this.props.onRemoveFromSummary
                    }>
                    Remove Plant
                </button>
            </div>
        );
    }
}


export default PlantEntry;