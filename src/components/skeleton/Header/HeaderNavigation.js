import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import enhanceWithClickOutside from 'react-click-outside';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';

class Navigation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    toggleNav: PropTypes.func.isRequired,
    navOpen: PropTypes.bool.isRequired,
    isNavOpening: PropTypes.bool.isRequired,
  }

  handleClickOutside() {
    if (this.props.navOpen && !this.props.isNavOpening) {
      this.props.toggleNav(false);
    }
  }

  _goto(url) {
    this.props.toggleNav(false);
    browserHistory.push(url);
  }

  render() {
    return (
      <LeftNav open={this.props.navOpen} width={200}>
        <MenuItem onTouchTap={this._goto.bind(this, '/matchen')}>{this.context.t('nav.matches')}</MenuItem>
        <MenuItem onTouchTap={this._goto.bind(this, '/spelers')}>{this.context.t('nav.players')}</MenuItem>
      </LeftNav>
    );
  }
}

export default enhanceWithClickOutside(Navigation);