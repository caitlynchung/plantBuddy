import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

import firebase from 'firebase';

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            this.setState(() => {
                return {
                    isLoggedIn: user ? true : false
                };
            });
        })
    }

    signIn = () => {
        auth.signInWithPopup(provider)
            .catch((error) => {
                alert(error.message);
            });
    }

    signOut = () => {
        auth.signOut();
    }

    render() {
        return (
            <div className="NavigationBar">
                <div><Link to="/">Home</Link></div>
                <div><Link to="/plants">Check My Plants</Link></div>
                {!this.state.isLoggedIn && <div><a href="#signin" onClick={this.signIn}>Sign In</a></div>}
                {this.state.isLoggedIn && <div><a href="#signout" onClick={this.signOut}>Sign Out</a></div>}
            </div>
        );
    }
}

export default NavigationBar;