import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import withContext from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';
import Spinner from '../controls/Spinner.js';
import CircularProgress from 'material-ui/lib/circular-progress';
import Matches from '../matches/Matches.js';

import Snackbar from 'material-ui/lib/snackbar';
import * as configActions from '../../actions/configActions.js';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    // players: state.players,
    // clubs: state.clubs,
    // matches: state.matches,
    // teams: state.teams
  };
}, configActions)
@withContext
@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    config: ImmutablePropTypes.map.isRequired,
    user: PropTypes.object,
    children: PropTypes.element,
    clearSnackbar: PropTypes.func.isRequired,
  };

  render() {
    //TODO: CircularProgress: position in middle on mobile and desktop...
    return (
      <div id="react">
        <div className="wrapper">
          <Header user={this.props.user} />
          <div className="container" style={{paddingTop: 5}}>
            {!this.props.config.get('initialLoadCompleted') ?
              <div style={{width: 300, marginLeft: 'auto', marginRight: 'auto', paddingTop: 75}}><CircularProgress size={3} /></div> :
              this.props.children || <Matches />
            }
          </div>
          <div className="push"></div>
        </div>
        <Footer />
        <Snackbar
          open={!!this.props.config.get('snackbar')}
          message={this.props.config.get('snackbar') || ''}
          autoHideDuration={4000}
          onRequestClose={::this._onCloseSnackbar} />
      </div>
    );
  }
  _onCloseSnackbar() {
    this.props.clearSnackbar();
  }
}