import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

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
        console.log(target);
        this.setState((prevState, props) => {
            const newEntryInput = prevState.entryInput;
            newEntryInput[name] = value;
            return {
                entryInput: newEntryInput
            }
          });
    }

    onAddToSummary = (e) => {
        e.preventDefault();
        database.ref(`users/${auth.currentUser.uid}`)
            .push(this.state.entryInput);
        this.setState(() => {
            return {
                entryInput: {}
            };
        })
    }

    render() {
        return (
            <div>
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