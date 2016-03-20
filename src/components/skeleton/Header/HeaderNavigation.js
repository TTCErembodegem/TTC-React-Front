import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import { connect } from 'react-redux';
import { util as storeUtil } from '../../../store.js';
import moment from 'moment';

import enhanceWithClickOutside from 'react-click-outside';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import Badge from 'material-ui/lib/badge';

//using @connect decorator breaks enhanceWithClickOutside
class Navigation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    matches: PropTypes.object.isRequired,
    toggleNav: PropTypes.func.isRequired,
    navOpen: PropTypes.bool.isRequired,
    isNavOpening: PropTypes.bool.isRequired,
  }

  handleClickOutside() {
    if (this.props.navOpen && !this.props.isNavOpening) {
      this.props.toggleNav(false);
    }
  }

  handleClickCloseMenuButton = () => this.props.toggleNav(false);

  _goto(url) {
    this.props.toggleNav(false);
    browserHistory.push(url);
  }

  render() {
    const t = this.context.t;
    const matchesToday = storeUtil.matches.getTodayMatches();

    return (
      <LeftNav open={this.props.navOpen} width={200}>
        <MenuItem onTouchTap={this._goto.bind(this, t.route('matches'))}>{t('nav.matches')}</MenuItem>
        {matchesToday.size ? (
          <MenuItem onTouchTap={this._goto.bind(this, t.route('matchesToday'))} style={{}}>
            {t('nav.matchesToday')}
            <Badge badgeContent={matchesToday.size} secondary={true} badgeStyle={{padding: 0, top: 5, left: 5}} />
          </MenuItem>
        ) : null}
        <MenuItem onTouchTap={this._goto.bind(this, t.route('players'))}>{t('nav.players')}</MenuItem>
        <Divider />
        <MenuItem onTouchTap={this._goto.bind(this, t.route('links'))}>{t('nav.links')}</MenuItem>
        <MenuItem onTouchTap={this._goto.bind(this, t.route('facts'))}>{t('nav.facts')}</MenuItem>
        <MenuItem onTouchTap={this.handleClickCloseMenuButton}>{t('nav.closeMenu')}</MenuItem>
      </LeftNav>
    );
  }
}

export default enhanceWithClickOutside(Navigation);