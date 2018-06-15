import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import './NavigationBar.css';

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
            <ul className="navigation-bar">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/plants">Check My Plants</Link></li>
                {!this.state.isLoggedIn && <li><a href="#signin" onClick={this.signIn}>Sign In</a></li>}
                {this.state.isLoggedIn && <li><a href="#signout" onClick={this.signOut}>Sign Out</a></li>}
            </ul>
        );
    }
}

export default NavigationBar;