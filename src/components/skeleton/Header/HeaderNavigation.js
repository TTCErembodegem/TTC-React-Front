import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import { util as storeUtil } from '../../../store.js';

import enhanceWithClickOutside from 'react-click-outside';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import Badge from 'material-ui/lib/badge';

//using @connect decorator breaks enhanceWithClickOutside
class Navigation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    toggleNav: PropTypes.func.isRequired,
    navOpen: PropTypes.bool.isRequired,
    isNavOpening: PropTypes.bool.isRequired,
  }

  handleClickOutside() {
    // TODO: this doesn't seem to be working on iPhone
    //       Probably need to listen to onTouchStart etc?
    //       But is this really necessary? it seems to work out of the box in the material-ui components docs
    if (this.props.navOpen && !this.props.isNavOpening) {
      this.props.toggleNav(false);
    }
  }

  handleClickHelpButton() {
    window.open('https://github.com/TTCErembodegem/onboarding/blob/master/README.md', '_blank');
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
        <MenuItem onTouchTap={this._goto.bind(this, t.route('teamsVttl'))}>{t('nav.teamsVttl')}</MenuItem>
        <MenuItem onTouchTap={this._goto.bind(this, t.route('teamsSporta'))}>{t('nav.teamsSporta')}</MenuItem>
        <MenuItem onTouchTap={this._goto.bind(this, t.route('players'))}>{t('nav.players')}</MenuItem>
        <Divider />
        <MenuItem onTouchTap={this._goto.bind(this, t.route('links'))}>{t('nav.links')}</MenuItem>
        <MenuItem onTouchTap={this._goto.bind(this, t.route('facts'))}>{t('nav.facts')}</MenuItem>
        <MenuItem onTouchTap={this.handleClickHelpButton}>{t('nav.help')}</MenuItem>
        <MenuItem onTouchTap={this.handleClickCloseMenuButton}>{t('nav.closeMenu')}</MenuItem>
      </LeftNav>
    );
  }
}

export default enhanceWithClickOutside(Navigation);