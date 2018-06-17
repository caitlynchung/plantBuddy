import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import './AddPlantPage.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const auth = firebase.auth();
const database = firebase.database();

class AddPlantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantEntries: props.initialEntries,
            entryInput: props.initialInput
        };
        this.onInputChange = this.onInputChange.bind(this);
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
    }

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
    }

    onDateChange = (newDate) => {
        this.setState((prevState) => {
            const newEntryInput = prevState.entryInput;
            newEntryInput["lastWaterDate"] = newDate;
            newEntryInput["lastWaterDateAsString"] = newDate.format().slice(0,10);
            return {
                entryInput: newEntryInput
            }
          });
    }

    onAddToSummary = (e) => {
        e.preventDefault();
        // Do not store moment object
        const entryInputToStore = this.state.entryInput;
        delete entryInputToStore.lastWaterDate;
        
        database.ref(`users/${auth.currentUser.uid}`)
            .push(entryInputToStore);
        this.setState(() => {
            return {
                entryInput: {}
            };
        })
    }

    render() {
        return (
            <div className="AddPlantSubmission">
               <form onSubmit={this.onAddToSummary}>
                    <label>
                        Name of your plant:
                        <input
                            name="plantName"
                            type="string"
                            value={this.state.entryInput.name}
                            onChange={this.onInputChange}
                            />
                    </label>
                    <br />
                    <label>
                        Description of your plant:
                        <input
                            name="plantDescription"
                            type="string"
                            value={this.state.entryInput.description}
                            onChange={this.onInputChange}
                            />
                    </label>
                    <br />
                    <label>
                        Type Of Plant:
                        <select 
                            name="plantType" 
                            value={this.state.entryInput.type} 
                            onChange={this.onInputChange}>
                            <option value="none selected">Choose One:</option>
                            <option value="fern">Fern</option>
                            <option value="cactus">Cactus</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Number Days between watering:
                        <input
                            name="daysBetweenWatering"
                            type="number"
                            value={this.state.entryInput.daysBetweenWatering}
                            onChange={this.onInputChange}
                            />
                    </label>
                    <br />
                    <label>
                        Last Watered:
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
        )
    }
}

AddPlantPage.propTypes = {
    initialEntries : PropTypes.object,
    initialInput : PropTypes.object
}

AddPlantPage.defaultProps = {
    initialEntries : {},
    initialInput : {}
}

export default AddPlantPage;