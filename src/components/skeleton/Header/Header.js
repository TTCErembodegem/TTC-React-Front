import React, {Component} from 'react';
import PropTypes, {withStyles} from '../../PropTypes.js';
import {Link, browserHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {Icon} from '../../controls/Icon.js';
import Navigation from './HeaderNavigation.js';

@withStyles(require('./Header.css'))
export default class Header extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    user: PropTypes.UserModel.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {navOpen: false, isNavOpening: false};
  }

  render() {
    const t = this.context.t;
    const loginOrProfile = !this.props.user.playerId ? (
      <FlatButton label={t('nav.login')} onClick={() => browserHistory.push(t.route('login'))} />
    ) : (
      <Link className="Header-link Header-icon-right" to={t.route('profile')}>
        <Icon fa="fa fa-2x fa-user" translate tooltip="profile.tooltip" tooltipPlacement="left" />
      </Link>
    );

    return (
      <div>
        <AppBar
          title={<Link className="Header-link" to="/">{this.state.navOpen ? null : t('clubName')}</Link>}
          iconElementRight={loginOrProfile}
          onLeftIconButtonTouchTap={::this._openNav}
          style={{zIndex: 0}} // zIndex: otherwise hides tooltips
        />

        <Navigation
          navOpen={this.state.navOpen}
          isNavOpening={this.state.isNavOpening}
          toggleNav={newState => this.setState({navOpen: newState})}
        />
      </div>
    );
  }

  _openNav() {
    this.setState({navOpen: true, isNavOpening: true});

    // onTouchStart vs onClick:
    // Scenario: Use clicks on the bars to open the Nav
    // First onTouchStart which opened the Navigation
    // Immediately followed by onOutsideClick which closed the Nav

    // TODO: creates bug on mobile that has visual 'selection' of first item in the navigation...
    // (solution: put some sort of icon at the top of the navigation so its non-clickabel?:)
    setTimeout(() => this.setState({isNavOpening: false}), 1000);
  }
}
