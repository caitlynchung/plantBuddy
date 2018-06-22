import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PlantEntry from '../PlantEntry/PlantEntry.js';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import './PlantPage.css';
import '../PlantEntry/PlantEntry.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const auth = firebase.auth();
const database = firebase.database();

class PlantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantEntries: props.initialvalue,
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
        // stating this explictly is the only way to clear the form
        const emptyInput = {
            name: '',
            plantType: 'none selected',
            description: '',
            daysBetweenWatering: '',
            lastWaterDateAsString: ''
        };

        database.ref(`users/${auth.currentUser.uid}`)
            .push(entryInputToStore);

        this.setState({
            entryInput: emptyInput
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
    }

    SummaryDisplayHeader = () => {
        const noPlantsInSummary = (this.state.plantEntries.length===0);
        if (!noPlantsInSummary) {
            return (
                <div className="PlantItem">
                    <p className="ItemElementMedium">Picture</p>
                    <p className="ItemElementSmall">Name</p>
                    <p className="ItemElementSmall">Type</p>
                    <p className="ItemElementMedium">Watered On</p>
                    <p className="ItemElementMedium">Should Water</p>
                    <p>[ Remove ]</p>
                    <p>[ Watered? ] </p>
                </div>
            );
        }
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
                <div className="AddPlantSubmission">
                    <form onSubmit={this.onAddToSummary}>
                        <label>Name of your plant:
                            <input
                                name="plantName"
                                type="string"
                                value={this.state.entryInput.name}
                                onChange={this.onInputChange}
                            />
                        </label>
                        <br />
                        <label>Description of your plant:
                            <input
                                name="plantDescription"
                                type="string"
                                value={this.state.entryInput.description}
                                onChange={this.onInputChange}
                            />
                        </label>
                        <br />
                        <label>Type Of Plant:
                            <select
                                name="plantType" 
                                value={this.state.entryInput.type} 
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
                        <button type="submit">Add A Plant</button>
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
    initialvalue : {},
    initialInput : {}
}

export default PlantPage;