import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import withViewport from '../../utils/decorators/withViewport.js';
import withContext from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';
import Intro from './Intro.js';
import Grid from 'react-bootstrap/lib/Grid';
import { FullScreenSpinner } from '../controls/Spinner.js';

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
@withViewport
@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    config: ImmutablePropTypes.map.isRequired,
    user: PropTypes.object,
    children: PropTypes.element,
    clearSnackbar: PropTypes.func.isRequired,
    viewport: PropTypes.object.isRequired,
  };

  render() {
    var containerStyle = {
      // TODO: idea was to show more of the match cards when <600 but the padding:5 creates a horizontal scrollbar?
      //paddingLeft: this.props.viewport.width < 600 ? 5 : undefined,
      //paddingRight: this.props.viewport.width < 600 ? 5 : undefined,
    };
    if (this.props.config.get('container100PerWidth')) {
      containerStyle.width = '100%';
    }

    return (
      <div id="react">
        <div className="wrapper">
          <Header user={this.props.user} />
          <Grid style={containerStyle}>
            {this.props.children ?
              (!this.props.config.get('initialLoadCompleted') ? <FullScreenSpinner /> : this.props.children) :
              <Intro />
            }
          </Grid>
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