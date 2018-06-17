import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PlantEntry.css';

class PlantEntry extends Component {
    render() {
        let plantIcon = "";
        switch(this.props.entry.plantType) {
            case "cactus":
            plantIcon="/plant_cactus.PNG";
            break;
            case "fern" :
            plantIcon="/plant_fern.PNG";
            break;
            default:
            plantIcon="";
        };
        return(
            <div className="PlantItem">
                <p><img className="IndividualPlantIcon" src={plantIcon} alt="plant buddy icon"/></p>
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