import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import withContext from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';
import Spinner from '../controls/Spinner.js';
import Matches from '../matches/Matches';

import Snackbar from 'material-ui/lib/snackbar';
import * as configActions from '../../actions/configActions.js';

@connect(state => {
  return {
    config: state.config,
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
    children: PropTypes.element,
    clearSnackbar: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container" style={{paddingTop: 5}}>
          {!this.props.config.get('initialLoadCompleted') ?
            <Spinner size={5} /> :
            this.props.children || <Matches />
          }
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