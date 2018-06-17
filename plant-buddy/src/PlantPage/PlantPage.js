import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PlantEntry from '../PlantEntry/PlantEntry.js';
import AddPlantPage from '../AddPlantPage/AddPlantPage.js';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import './PlantPage.css';

const auth = firebase.auth();
const database = firebase.database();

class PlantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantEntries: props.initialvalue
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

    onRemoveFromSummary = (idx) => {
        return () => {
            this.setState((prevState, props) => {
              database.ref(`users/${auth.currentUser.uid}`).child(idx).remove();
            });
        }
    }

    onClickWateredTodayButton = (idx) => {
        return () => {
           this.setState((prevState, props) => {
            database.ref(`users/${auth.currentUser.uid}`).child(idx).update(
                {lastWaterDateAsString : new Date().toISOString().slice(0,10)}
            );
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
                <div className="SummaryDisplayHeader">
                    <p>Picture</p>
                    <p>Name</p>
                    <p>Description</p>
                    <p>Delete?</p>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="PlantSummary">
                {/*<this.SummaryDisplayHeader/>*/}
                <this.SummaryDisplay/>
                <Link to="/add_plant">Add A Plant</Link>
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