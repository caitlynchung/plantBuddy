import React, { Component } from 'react';
import PlantEntry from '../PlantEntry/PlantEntry.js';
import PropTypes from 'prop-types';
import firebase from 'firebase';

const auth = firebase.auth();
const database = firebase.database();

class PlantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantEntries: props.initialvalue,
            //plantEntries: props.initialvalue
            entryInput: ''
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
    }

    onInputChange = (e) => {
        e.preventDefault();
        const newValue = e.target.value;
        this.setState(() => {
            return {
                entryInput: newValue
            };
        })
    }

    addEntry = (e) => {
        e.preventDefault();
        database.ref(`users/${auth.currentUser.uid}`)
            .push(this.state.entryInput);
        this.setState(() => {
            return {
                entryInput: ''
            };
        })
    }

    onRemoveFromSummary = (idx) => {
        return () => {
            this.setState((prevState, props) => {
              database.ref(`users/${auth.currentUser.uid}`).child(idx).remove();
            });
        }
    }

    SummaryDisplay = () => {
        const noPlantsInSummary = (this.state.plantEntries.length===0);
        const noPlantsMessage = "There are no plants, let's add one!"
        if (noPlantsInSummary) {
            return noPlantsMessage;
        }

        const plantsInSummary = Object.keys(this.state.plantEntries).map((key) => {
            return (
                <div>
                <PlantEntry 
                    key={key}
                    entry={this.state.plantEntries[key]}
                    onRemoveFromSummary={this.onRemoveFromSummary(key)}
                />
                </div>
            );
        });
        return plantsInSummary;
    }

    render() {
        return (
            <div className="PlantSummary">
                <this.SummaryDisplay/>
                <form className="journal-form" onSubmit={this.addEntry}>
                    <textarea onChange={this.onInputChange} value={this.state.entryInput} />
                    <button type="submit">Add Plant</button>
                </form>
            </div>
        )
    }
}

PlantPage.propTypes = {
    initialValue : PropTypes.object
}

PlantPage.defaultProps = {
    initialvalue : {}
}

export default PlantPage;