import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

import styles from './Header.css';
import withStyles from '../../../utils/decorators/withStyles.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import { util as storeUtil } from '../../../store.js';

import AppBar from 'material-ui/lib/app-bar';
import Icon from '../../controls/Icon.js';
import FlatButton from 'material-ui/lib/flat-button';
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
      <Link className="Header-link Header-icon-right" to={t.route('profile')}>
          <Icon fa="fa fa-2x fa-user" title={this._reverseName(storeUtil.getPlayer(this.props.user.playerId).name)} />
      </Link>;

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

    // TODO: creates bug on mobile that has visual 'selection' of first item in the navigation...
    // (solution: put some sort of icon at the top of the navigation so its non-clickabel?:)
    setTimeout(() => this.setState({isNavOpening: false}), 1000);
  }

  _reverseName(name) {
    var nameInParts = name.split(' ');
    if(nameInParts.length === 2)
    {
       return nameInParts[1] + ' ' + nameInParts[0];
    }
    if (nameInParts.length === 3)
    {
       return nameInParts[nameInParts.length - 1] + ' ' + nameInParts[nameInParts.length - 3]
       + ' ' + nameInParts[nameInParts.length - 2] ;
    }
    if (nameInParts.length === 4)
    {
       return nameInParts[nameInParts.length - 1] + ' ' + nameInParts[nameInParts.length - 4]
       + ' ' + nameInParts[nameInParts.length - 3] + ' ' + nameInParts[nameInParts.length - 2];
    }
  }
}