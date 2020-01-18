import React, {Component} from 'react';
import PropTypes, {connect, withViewport, withContext, withStyles} from '../PropTypes.js';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';
import Grid from 'react-bootstrap/lib/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import * as configActions from '../../actions/configActions.js';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

import './App.css';

class App extends Component {
  static propTypes = {
    config: PropTypes.map.isRequired,
    user: PropTypes.UserModel,
    children: PropTypes.element,
    clearSnackbar: PropTypes.func.isRequired,
    viewport: PropTypes.viewport,
  };

  render() {
    var containerStyle = {};

    const isBigTodayMatches = this.props.config.get('container100PerWidth');
    if (isBigTodayMatches) {
      containerStyle.width = '100%';
    }

    return (
      <div id="react">
        <MuiThemeProvider theme={createMuiTheme()}>
          <div style={{height: '100%'}}>
            <div className="wrapper">
              <Header user={this.props.user} />
              <Grid style={containerStyle}>
                {this.props.children}
              </Grid>
              <div className="push" />
            </div>
            {!isBigTodayMatches ? <Footer /> : null}
            <Snackbar
              open={!!this.props.config.get('snackbar')}
              message={this.props.config.get('snackbar') || ''}
              autoHideDuration={4000}
              onClose={() => this._onCloseSnackbar()} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
  _onCloseSnackbar() {
    this.props.clearSnackbar();
  }
}

export default withViewport(withContext(connect(state => {
  return {
    config: state.config,
    user: state.user,
  };
}, configActions)(App)));
