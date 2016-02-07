import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Header.css';
import withStyles from '../../../utils/decorators/withStyles.js';

import Navigation from '../Navigation';

@withStyles(styles)
export default class Header extends Component {
  render() {
    return (
      <div className="Header">
        <div className="Header-container">
          <Link className="Header-brand" to="/">
            <img className="Header-brandImg" src={require('./logo-small.png')} width="38" height="38" alt={'TTC Erembodegem'} />
            <span className="Header-brandTxt">TTC Erembodegem</span>
          </Link>
          <Navigation className="Header-nav" />
        </div>
      </div>
    );
  }
}