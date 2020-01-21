import React, {Component} from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {connect, withViewport, withContext} from '../PropTypes';
import Header from '../skeleton/Header/Header';
import Footer from '../skeleton/Footer/Footer';
import * as configActions from '../../actions/configActions';
import {IConfig, Viewport} from '../../models/model-interfaces';
import {IUser} from '../../models/UserModel';


import './App.css';


type AppProps = {
  config: IConfig;
  user: IUser;
  children: any;
  clearSnackbar: Function;
  viewport: Viewport;
}

class App extends Component<AppProps> {
  render() {
    const containerStyle: React.CSSProperties = {width: undefined};

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
              onClose={() => this._onCloseSnackbar()}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }

  _onCloseSnackbar() {
    this.props.clearSnackbar();
  }
}

export default withViewport(withContext(connect(state => ({
  config: state.config,
  user: state.user,
}), configActions)(App)));
