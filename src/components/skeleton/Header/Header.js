import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import styles from './Header.css';
import withStyles from '../../../utils/decorators/withStyles.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import Navigation from './HeaderNavigation.js';

@withStyles(styles)
export default class Header extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    return (
      <div className="Header">
        <div className="Header-container">
          <Link className="Header-brand" to="/">
            <img src={require('./logo-small.png')} width="38" height="38" alt={this.context.t('fullClubName')} />
            <span className="Header-brandTxt">{this.context.t('clubName')}</span>
          </Link>
          <Navigation user={this.props.user} />
        </div>
      </div>
    );
  }
}