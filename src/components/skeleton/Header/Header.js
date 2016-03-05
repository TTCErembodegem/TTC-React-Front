import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

import styles from './Header.css';
import withStyles from '../../../utils/decorators/withStyles.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import Navigation from './HeaderNavigation.js';
import AppBar from 'material-ui/lib/app-bar';
import Icon from '../../controls/Icon.js';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';

@withStyles(styles)
export default class Header extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    var userProfile = !this.props.user.playerId ?
      <FlatButton label={this.context.t('nav.login')} onClick={() => browserHistory.push('/login')} /> :
      <Link className="Header-link Header-icon-right" to="/profiel"><Icon fa="fa fa-2x fa-user" /></Link>;

    return (
      <AppBar
        title={<Link className="Header-link" to="/">{this.context.t('fullClubName')}</Link>}
        iconElementRight={userProfile}
        onLeftIconButtonTouchTap={() => console.log('wheeee')} />
    );
  }
}