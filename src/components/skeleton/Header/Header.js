import React, {Component} from 'react';
import PropTypes, {withStyles, withViewport} from '../../PropTypes.js';
import {Link} from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {Icon} from '../../controls/Icon.js';
import Navigation from './HeaderNavigation.js';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {withStyles as withMaterialStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const HeaderButton = ({label, href}) => (
  <Link to={href}>
    <Button style={{color: 'white'}}>
      {label}
    </Button>
  </Link>
);

@withViewport
@withStyles(require('./Header.css'))
export default withMaterialStyles(styles)(class Header extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    user: PropTypes.UserModel.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {navOpen: false, isNavOpening: false};
  }

  render() {
    const t = this.context.t;
    const showExtraNavigationButtons = this.props.viewport.width > 700;
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={() => this.setState({navOpen: !this.state.navOpen})}>
              <MenuIcon />
            </IconButton>

            <Typography variant="title" color="inherit" className={classes.grow}>
              <Link className="Header-link" to="/">{this.state.navOpen ? null : t('clubName')}</Link>
            </Typography>

            <div>
              {showExtraNavigationButtons ? (
                <div style={{display: 'inline-block', textAlign: 'center', width: 300}}>
                  <HeaderButton label={t('common.vttl')} href={t.route('teams', {competition: 'Vttl'})} />
                  <HeaderButton label={t('common.sporta')} href={t.route('teams', {competition: 'Sporta'})} />
                  <HeaderButton label={t('nav.players')} href={t.route('players')} />
                </div>
              ) : null}

              {!this.props.user.playerId ? (
                <HeaderButton label={t('nav.login')} href={t.route('login')} />
              ) : (
                <Link className="Header-link Header-icon-right" to={t.route('profile')}>
                  <Icon fa="fa fa-2x fa-user" translate tooltip="profile.tooltip" tooltipPlacement="left" />
                </Link>
              )}
            </div>
          </Toolbar>
        </AppBar>

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
});
