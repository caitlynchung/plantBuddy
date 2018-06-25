import React, { Component } from 'react';
import './PlantEntry.css';
import ReactTooltip from 'react-tooltip';

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
            case "succulent" :
            plantIcon="/succulent.PNG";
            break;
            case "lavender" :
            plantIcon="/lavender.PNG";
            break;
            case "herb" :
            plantIcon="/herb.PNG";
            break;
            case "flowering_plant" :
            plantIcon="/flowering_plant.PNG";
            break;
            case "orchid" :
            plantIcon="/orchid.PNG";
            break;
            default:
            plantIcon="/buddy_icon.PNG";
        };
        
        const plantLastWateredDate = new Date(
            this.props.entry.lastWaterDateAsString.split("-")[0], //year
            this.props.entry.lastWaterDateAsString.split("-")[1]-1, //month
            this.props.entry.lastWaterDateAsString.split("-")[2] //day
        )

        const plantNextWaterDate = this.addDaysToDate(
            plantLastWateredDate,
            Number(this.props.entry.daysBetweenWatering));

        const needsWateringIcon = (
            plantNextWaterDate <= new Date() ? "/plant_fail.PNG" : "/buddy_icon.PNG" );

        return(
            <div className="PlantItem" data-tip data-for={this.props.id}>
                <ReactTooltip id={this.props.id} type='error'>
                    <span>{this.props.entry.plantDescription}</span>
                </ReactTooltip>
                <p className="ItemElementMedium"><img className="IndividualPlantIcon" src={plantIcon} alt="plant buddy icon"/></p>
                <p className="ItemElementSmall">{this.props.entry.plantName}</p>
                <p className="ItemElementSmall"> </p>
                <p className="ItemElementMedium">{this.props.entry.plantType}</p>
                <p className="ItemElementSmall"> </p>
                <p><img className="WateringPlantIcon" src={needsWateringIcon} alt="plant watering icon"/></p>
                <p className="ItemElementMedium">{this.props.entry.lastWaterDateAsString}</p>
                <p className="ItemElementMedium">{plantNextWaterDate.toISOString().slice(0,10)}</p>
                <button 
                    className="DeleteButton" 
                    onClick={
                        this.props.onRemoveFromSummary
                    }>
                    Remove Plant
                </button>
                <button 
                    className="WateredButton" 
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