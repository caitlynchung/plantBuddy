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
        const newValue = e.target.value;
        this.setState(() => {
            return {
                entryInput: newValue
            };
        })
    }

    onAddToSummary = (e) => {
        e.preventDefault();
        database.ref(`users/${auth.currentUser.uid}`)
            .push(this.state.entryInput);
        this.setState(() => {
            return {
                entryInput: ''
            };
        })
    }

    render() {
        return (
            <div>
               <form onSubmit={this.onAddToSummary}>
                    <textarea onChange={this.onInputChange} value={this.state.entryInput} />
                    <button type="submit">Add A Plant</button>
                </form> 
            </div>
        )
    }
}

AddPlantPage.propTypes = {
    initialEntries : PropTypes.object,
    initialInput : PropTypes.string
}

AddPlantPage.defaultProps = {
    initialEntries : {},
    initialInput : ''
}

export default AddPlantPage;