import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

import styles from './Header.css';
import withStyles from '../../../utils/decorators/withStyles.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import AppBar from 'material-ui/lib/app-bar';
import Icon from '../../controls/Icon.js';
import FlatButton from 'material-ui/lib/flat-button';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Navigation from './HeaderNavigation.js';

@withStyles(styles)
export default class Header extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {navOpen: false, isNavOpening: false};
  }

  render() {
    const t = this.context.t;
    const loginOrProfile = !this.props.user.playerId ?
      <FlatButton label={t('nav.login')} onClick={() => browserHistory.push(t.route('login'))} /> :
      <Link className="Header-link Header-icon-right" to={t.route('profile')}><Icon fa="fa fa-2x fa-user" /></Link>;

    return (
      <div>
        <AppBar
          title={<Link className="Header-link" to="/">{t('clubName')}</Link>}
          iconElementRight={loginOrProfile}
          onLeftIconButtonTouchTap={::this._openNav} />

        <Navigation
          navOpen={this.state.navOpen}
          isNavOpening={this.state.isNavOpening}
          toggleNav={newState => this.setState({navOpen: newState})} />
      </div>
    );
  }

  _openNav() {
    this.setState({navOpen: true, isNavOpening: true});

    // onTouchStart vs onClick:
    // Scenario: Use clicks on the bars to open the Nav
    // First onTouchStart which opened the Navigation
    // Immediately followed by onOutsideClick which closed the Nav
    setTimeout(() => this.setState({isNavOpening: false}), 1000);
  }
}