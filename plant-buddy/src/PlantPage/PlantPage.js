import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PlantEntry from '../PlantEntry/PlantEntry.js';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import './PlantPage.css';
import '../PlantEntry/PlantEntry.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormErrors } from '../FormErrors/FormErrors.js';

const auth = firebase.auth();
const database = firebase.database();

class PlantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantEntries: props.initialValue,
            entryInput: props.initialInput
        };
    }

    componentDidMount() {
        if (!auth.currentUser) {
            alert('Must be logged in to view plants');
            return this.props.history.push('/');
        };

        auth.onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.push('/');
            }
        });

        // ref(path) returns a Reference representing the location in the Database
        // corresponding to path (default is root)
        database.ref(`users/${auth.currentUser.uid}`)
            .on('value', (snapshot) => {
                this.setState(() => {
                    return {
                        plantEntries: snapshot.val() || {}
                    };
                });
            })
    };

    onInputChange = (e) => {
        e.preventDefault();
        const target = e.target;
        const value = target.value;
        const name = target.name;
        
        this.setState((prevState, props) => {
            this.validateField(name, value);
            const newEntryInput = prevState.entryInput;
            newEntryInput[name] = value;
            return {
                entryInput: newEntryInput
            }
        });
    };

    onDateChange = (newDate) => {
        this.setState((prevState) => {
            const newEntryInput = prevState.entryInput;
            newEntryInput["lastWaterDate"] = newDate;
            newEntryInput["lastWaterDateAsString"] = newDate.format().slice(0,10);
            this.validateField('lastWaterDateAsString', newEntryInput["lastWaterDateAsString"]);
            return {
                entryInput: newEntryInput
            }
          });
    };

    onRemoveFromSummary = (idx) => {
        return () => {
            this.setState((prevState, props) => {
              database.ref(`users/${auth.currentUser.uid}`).child(idx).remove();
            });
        }
    };

    onAddToSummary = (e) => {
        e.preventDefault();
        // Do not store moment object
        const entryInputToStore = this.state.entryInput;
        delete entryInputToStore.lastWaterDate;
        // Get rid of validation data
        delete entryInputToStore.plantNameIsValid;
        delete entryInputToStore.plantDescriptionIsValid;
        delete entryInputToStore.plantTypeIsValid;
        delete entryInputToStore.daysBetweenWateringIsValid;
        delete entryInputToStore.lastWaterDateAsStringIsValid;
        delete entryInputToStore.formIsValid;
        delete entryInputToStore.formErrors;

        database.ref(`users/${auth.currentUser.uid}`)
            .push(entryInputToStore);

        // stating this explictly is the only way to clear the form (can't just do entryInput: {})
        this.setState({
            entryInput: {
                plantName: '',
                plantDescription: '',
                plantType: 'none selected',
                daysBetweenWatering: 1,
                lastWaterDateAsString: '',
                plantNameIsValid: false,
                plantDescriptionIsValid: false,
                plantTypeIsValid: false,
                daysBetweenWateringIsValid: true,  //default is valid value
                lastWaterDateAsStringIsValid: false,
                formIsValid: false,
                formErrors: {}
            }
        });
    };

    onClickWateredTodayButton = (idx) => {
        return () => {
           this.setState((prevState, props) => {
                database.ref(`users/${auth.currentUser.uid}`).child(idx).update(
                    {lastWaterDateAsString : new Date().toISOString().slice(0,10)}
                );
            });
        }
    };

    onClickClearInputForm = (e) => {
        e.preventDefault();
        this.setState({
            entryInput: {
                plantName: '',
                plantDescription: '',
                plantType: 'none selected',
                daysBetweenWatering: 1,
                lastWaterDateAsString: '',
                plantNameIsValid: false,
                plantDescriptionIsValid: false,
                plantTypeIsValid: false,
                daysBetweenWateringIsValid: true,  //default is valid value
                lastWaterDateAsStringIsValid: false,
                formIsValid: false,
                formErrors: {}
            }
        });
    };

    SummaryDisplay = () => {
        const noPlantsInSummary = (this.state.plantEntries.length===0);
        const noPlantsMessage = "There are no plants, let's add one!"
        if (noPlantsInSummary) {
            return noPlantsMessage;
        }

        const plantsInSummary = Object.keys(this.state.plantEntries).map((key) => {
            return (
                <div className="PlantEntryRow">
                <PlantEntry 
                    key={key}
                    entry={this.state.plantEntries[key]}
                    onRemoveFromSummary={this.onRemoveFromSummary(key)}
                    onClickWateredTodayButton={this.onClickWateredTodayButton(key)}
                />
                </div>
            );
        });
        return plantsInSummary;
    };

    SummaryDisplayHeader = () => {
        const noPlantsInSummary = (this.state.plantEntries.length===0);
        if (!noPlantsInSummary) {
            return (
                <div className="PlantItem">
                    <p className="ItemElementMedium">Picture</p>
                    <p className="ItemElementSmall">Name</p>
                    <p className="ItemElementSmall"> </p>
                    <p className="ItemElementMedium">Type</p>
                    <p className="ItemElementSmall"> </p>
                    <p className="ItemElementMedium">Status</p>
                    <p className="ItemElementMedium">Watered On</p>
                    <p className="ItemElementMedium">Should Water</p>
                    <p>[ Remove ]</p>
                    <p>[ Watered? ] </p>
                </div>
            );
        }
    };
    //Prevent premature form submission with Enter key
    onKeyPress(e) {
        if (e.which === 13 /* Enter */) {
          e.preventDefault();
        }
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.entryInput.formErrors;
        let plantNameIsValid = this.state.entryInput.plantNameIsValid;
        let plantDescriptionIsValid = this.state.entryInput.plantDescriptionIsValid;
        let plantTypeIsValid = this.state.entryInput.plantTypeIsValid;
        let daysBetweenWateringIsValid = this.state.entryInput.daysBetweenWateringIsValid;
        let lastWaterDateAsStringIsValid = this.state.entryInput.lastWaterDateAsStringIsValid;

        switch(fieldName) {
            case 'plantName':
                plantNameIsValid = value.length > 0;
                fieldValidationErrors.plantName = plantNameIsValid ? '' : ' is required';
                break;
            case 'plantDescription':
                plantDescriptionIsValid = value.length > 0;
                fieldValidationErrors.plantDescription = plantDescriptionIsValid ? '': ' is required';
                break;
            case 'plantType':
                plantTypeIsValid = value !== 'none selected';
                fieldValidationErrors.plantType = plantTypeIsValid ? '': ' is required';
                break;
            case 'daysBetweenWatering':
                daysBetweenWateringIsValid = value >= 1;
                fieldValidationErrors.daysBetweenWatering = daysBetweenWateringIsValid ? '': ' should be a number greater than or equal to 1';
                break;
            case 'lastWaterDateAsString':
                lastWaterDateAsStringIsValid = value.length > 0;
                fieldValidationErrors.lastWaterDateAsString = lastWaterDateAsStringIsValid ? '': ' is required';
                break;
            default:
                break;
        };

        this.setState((prevState) => {
            const newEntryInput = prevState.entryInput;
            newEntryInput["formErrors"] = fieldValidationErrors;
            newEntryInput["plantNameIsValid"] = plantNameIsValid;
            newEntryInput["plantDescriptionIsValid"] = plantDescriptionIsValid;
            newEntryInput["plantTypeIsValid"] = plantTypeIsValid;
            newEntryInput["daysBetweenWateringIsValid"] = daysBetweenWateringIsValid;
            newEntryInput["lastWaterDateAsStringIsValid"] = lastWaterDateAsStringIsValid;

            newEntryInput["formIsValid"] = (
                newEntryInput.plantNameIsValid &&
                newEntryInput.plantDescriptionIsValid &&
                newEntryInput.plantTypeIsValid &&
                newEntryInput.daysBetweenWateringIsValid &&
                newEntryInput.lastWaterDateAsStringIsValid
            );

            return {
                entryInput: newEntryInput
            }
        });
    }

    render() {
        return (
            <div>
                <h2 className="headers">My Current Buddies</h2>
                <div className="PlantSummary">
                    <this.SummaryDisplayHeader/>
                    <this.SummaryDisplay/>
                </div>
                <h2 className="headers">Add A Buddy</h2>
                <div>
                    <FormErrors formErrors={this.state.entryInput.formErrors} />
                </div>
                <div className="AddPlantSubmission">
                    <form onSubmit={this.onAddToSummary} onKeyPress={this.onKeyPress}>
                        <label>Name of your plant:
                            <input
                                name="plantName"
                                type="string"
                                value={this.state.entryInput.plantName}
                                onChange={this.onInputChange}
                            />
                        </label>
                        <br />
                        <label>Description of your plant:
                            <input
                                name="plantDescription"
                                type="string"
                                value={this.state.entryInput.plantDescription}
                                onChange={this.onInputChange}
                            />
                        </label>
                        <br />
                        <label>Type Of Plant:
                            <select
                                name="plantType" 
                                value={this.state.entryInput.plantType}
                                onChange={this.onInputChange}>
                                <option value="none selected">Choose One:</option>
                                <option value="fern">Fern</option>
                                <option value="cactus">Cactus</option>
                                <option value="herb">Herb</option>
                                <option value="flowering_plant">Flowering Plant</option>
                                <option value="lavender">Lavender</option>
                                <option value="succulent">Succulent</option>
                                <option value="orchid">Orchid</option>
                            </select>
                        </label>
                        <br />
                        <label> Number Days between watering:
                            <input
                                name="daysBetweenWatering"
                                type="number"
                                value={this.state.entryInput.daysBetweenWatering}
                                onChange={this.onInputChange}
                            />
                        </label>
                        <br />
                        <label>Last Watered:
                            <DatePicker 
                                name="lastWaterDate" 
                                selected={this.state.entryInput.lastWaterDate} 
                                onChange={this.onDateChange}
                            />
                        </label>
                        <br />
                        <button type="submit" disabled={!this.state.entryInput.formIsValid}>Add A Plant</button>
                        <button onClick={this.onClickClearInputForm}> Clear Form</button>
                    </form> 
                </div>
            </div>
        )
    }
}

PlantPage.propTypes = {
    initialValue : PropTypes.object,
    initialInput : PropTypes.object
}

PlantPage.defaultProps = {
    initialValue : {},
    initialInput : {
        plantName: '',
        plantDescription: '',
        plantType: 'none selected',
        daysBetweenWatering: 1,
        lastWaterDateAsString: '',
        plantNameIsValid: false,
        plantDescriptionIsValid: false,
        plantTypeIsValid: false,
        daysBetweenWateringIsValid: true, //default is valid value
        lastWaterDateAsStringIsValid: false,
        formIsValid: false,
        formErrors: {}
    }
}

export default PlantPage;