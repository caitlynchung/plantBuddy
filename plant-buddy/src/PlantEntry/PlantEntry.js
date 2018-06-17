import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PlantEntry.css';

class PlantEntry extends Component {

    addDaysToDate = (startDate, daysToadd) => {
        startDate.setDate(startDate.getDate() + daysToadd);
        return startDate;
    }

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
        
        const plantLastWateredDate = new Date(
            this.props.entry.lastWaterDateAsString.split("-")[0], //year
            this.props.entry.lastWaterDateAsString.split("-")[1]-1, //month
            this.props.entry.lastWaterDateAsString.split("-")[2] //day
        )

        const plantNextWaterDate = this.addDaysToDate(
            plantLastWateredDate,
            Number(this.props.entry.daysBetweenWatering));

        return(
            <div className="PlantItem">
                <p><img className="IndividualPlantIcon" src={plantIcon} alt="plant buddy icon"/></p>
                <p>{this.props.entry.plantName}</p>
                <p>{this.props.entry.plantDescription}</p>
                <p>{this.props.entry.lastWaterDateAsString}</p>
                <p>{plantNextWaterDate.toISOString().slice(0,10)}</p>
                <button 
                    className="DeleteButton" 
                    onClick={
                        this.props.onRemoveFromSummary
                    }>
                    Remove Plant
                </button>
                <button 
                    className="WateredTodayButton" 
                    onClick={
                        this.props.onClickWateredTodayButton
                    }>
                    Watered Today
                </button>
            </div>
        );
    }
}


export default PlantEntry;