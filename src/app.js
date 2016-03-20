import 'babel-core/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Routes from './routes.js';

// TODO: change webpack config to add sourcemaps

//import FastClick from 'fastclick';
// Make taps on links and buttons work fast on mobiles
//FastClick.attach(document.body);
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import moment from 'moment';
moment.locale('nl');

import store from './store.js';

import { validateToken } from './actions/userActions.js';
var token = localStorage.getItem('token');
if (token) {
  store.dispatch(validateToken(token));
}

import initialLoad from './actions/initialLoad.js';
store.dispatch(initialLoad());

require('./hub.js');

const enableDevTools = false;
if (enableDevTools) {
  const {DebugPanel, DevTools, LogMonitor} = require('redux-devtools/lib/react');

  render(
    <div>
      <Provider store={store}>
        <Routes />
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    </div>,
    document.getElementById('app')
  );
} else {
  render(
    <Provider store={store}>
      <Routes />
    </Provider>,
    document.getElementById('app')
  );
}