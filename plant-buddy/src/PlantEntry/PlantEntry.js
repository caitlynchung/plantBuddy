import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PlantEntry.css';

class PlantEntry extends Component {
    render() {
        return(
            <div className="PlantItem">
                <p>{this.props.entry.plantName}</p>
                <p>{this.props.entry.plantDescription}</p>
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