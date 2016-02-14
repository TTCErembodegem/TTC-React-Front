import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Header.css';
import withStyles from '../../../utils/decorators/withStyles.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import Navigation from './HeaderNavigation.js';

@withStyles(styles)
export default class Header extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
      <div className="Header">
        <div className="Header-container">
          <Link className="Header-brand" to="/">
            <img src={require('./logo-small.png')} width="38" height="38" alt={this.context.t('fullClubName')} />
            <span className="Header-brandTxt">{this.context.t('clubName')}</span>
          </Link>
          <Navigation />
        </div>
      </div>
    );
  }
}