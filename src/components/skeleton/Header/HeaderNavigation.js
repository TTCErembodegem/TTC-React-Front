import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {contextTypes} from '../../../utils/decorators/withContext.js';
import {Link, withRouter} from 'react-router-dom';
import storeUtil from '../../../storeUtil.js';

import enhanceWithClickOutside from 'react-click-outside';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

//using @connect decorator breaks enhanceWithClickOutside
class Navigation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    toggleNav: PropTypes.func.isRequired,
    navOpen: PropTypes.bool.isRequired,
    isNavOpening: PropTypes.bool.isRequired,
    history: PropTypes.any.isRequired,
    classes: PropTypes.any.isRequired,
  }

  todayTimeout = undefined;
  constructor() {
    super();
    this.state = {swap: true};
  }

  componentDidMount() {
    this.todayTimeout = setInterval(() => this.setState({swap: !this.state.swap}), 1000 * 60 * 60 * 6);
  }
  componentWillUnmount() {
    if (this.todayTimeout) {
      clearInterval(this.todayTimeout);
    }
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
    window.open('http://ttcerembodegem.github.io/onboarding/', '_blank');
  }

  handleClickCloseMenuButton = () => this.props.toggleNav(false);

  _goto(url) {
    this.props.toggleNav(false);
    this.props.history.push(url);
  }

  render() {
    const t = this.context.t;
    const matchesToday = storeUtil.matches.getTodayMatches();

    return (
      <Drawer open={this.props.navOpen}>
        <AppBar>
          <Toolbar variant="dense">
            <Typography variant="title" color="inherit">
              <Link className="Header-link" to="/">{this.state.navOpen ? null : t('clubName')}</Link>
            </Typography>
          </Toolbar>
        </AppBar>

        <div style={{marginTop: 60, width: 250}}>
          <MenuItem onClick={this._goto.bind(this, t.route('matches'))}>{t('nav.matches')}</MenuItem>
          {matchesToday.size ? (
            <MenuItem onClick={this._goto.bind(this, t.route('matchesToday'))}>
              <Badge badgeContent={matchesToday.size} color="secondary" classes={this.props.classes}>
                {t('nav.matchesToday')}
              </Badge>
            </MenuItem>
          ) : null}
          <MenuItem onClick={this._goto.bind(this, t.route('matchesWeek'))}>{t('nav.matchesWeek')}</MenuItem>
          <MenuItem onClick={this._goto.bind(this, t.route('teams', {competition: 'Vttl'}))}>{t('nav.teamsVttl')}</MenuItem>
          <MenuItem onClick={this._goto.bind(this, t.route('teams', {competition: 'Sporta'}))}>{t('nav.teamsSporta')}</MenuItem>
          <MenuItem onClick={this._goto.bind(this, t.route('players'))}>{t('nav.players')}</MenuItem>
          {storeUtil.getUser().isAdmin() ? <MenuItem onClick={this._goto.bind(this, t.route('admin'))}>{t('nav.admin')}</MenuItem> : null}
          <Divider />
          <MenuItem onClick={this._goto.bind(this, t.route('generalInfo'))}>{t('nav.generalInfo')}</MenuItem>
          <MenuItem onClick={this._goto.bind(this, t.route('administration'))}>{t('nav.administration')}</MenuItem>
          <MenuItem onClick={this._goto.bind(this, t.route('links'))}>{t('nav.links')}</MenuItem>
          <MenuItem onClick={this._goto.bind(this, t.route('facts'))}>{t('nav.facts')}</MenuItem>
          <MenuItem onClick={this.handleClickHelpButton}>{t('nav.help')}</MenuItem>
          <MenuItem onClick={this.handleClickCloseMenuButton}>{t('nav.closeMenu')}</MenuItem>
          <Divider />
        </div>
      </Drawer>
    );
  }
}

const styles = {
  badge: {top: 0, right: 0},
};
export default withStyles(styles)(withRouter(enhanceWithClickOutside(Navigation)));
