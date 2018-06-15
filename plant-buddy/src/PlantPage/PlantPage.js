import React, { Component } from 'react';
import PlantEntry from '../PlantEntry/PlantEntry.js';
import PropTypes from 'prop-types';
//import firebase from 'firebase';
//const auth = firebase.auth();
//const database = firebase.database();

class PlantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantEntries: props.initialvalue
        };
    }

/*     componentDidMount() {
        if (!auth.currentUser) {
            alert('Must be logged in to view plants');
            return this.props.history.push('/');
        }

        auth.onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.push('/');
            }
        });
    } */

    onRemoveFromSummary = (idx) => {
        return () => {
            this.setState((prevState, props) => {
              const newPlantEntries = prevState.plantEntries;
              newPlantEntries.splice(idx, 1);
              return {
                  plantEntries: ''
                //plantEntries: newplantEntries
              };
            });
        }
    }

    SummaryDisplay = () => {
        const noPlantsInSummary = (this.state.plantEntries.length===0);
        const noPlantsMessage = "There are no plants, let's add one!"
        if (noPlantsInSummary) {
            return noPlantsMessage;
        }
        const plantsInSummary = this.state.plantEntries.map((item, idx) => {
            return (
                <div key={idx}>
                    <PlantEntry
                        plant={item}
                        onRemoveFromSummary={this.onRemoveFromSummary(idx)}
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
                {/*Add link here to add a plant*/}
            </div>
        )
    }
}

PlantPage.propTypes = {
    initialValue : PropTypes.array
}

PlantPage.defaultProps = {
    initialvalue : [
        {name: "plant 1",
         last_watered: "2018-01-01"},
         {name: "plant 2",
         last_watered: "2018-02-01"}
    ]
}

export default PlantPage;