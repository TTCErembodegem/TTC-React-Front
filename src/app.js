import 'babel-core/polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Routes from './routes.js';
import store from './store.js';
import Promise from 'bluebird';

Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true,
  //monitoring: true
});


import {showSnackbar} from './actions/configActions.js';
import http from './utils/httpClient.js';
window.onerror = function(message, source, lineno, colno, error) { // eslint-disable-line
  console.log('oh noes!', arguments); // eslint-disable-line
  http.post('/config/Log', {args: arguments});
  store.dispatch(showSnackbar('Something went wrong: ' + message));
};

import moment from 'moment';
moment.locale('nl');

import {validateToken} from './actions/userActions.js';
var token = localStorage.getItem('token');
if (token) {
  store.dispatch(validateToken(token));
}

import initialLoad from './actions/initialLoad.js';
store.dispatch(initialLoad());

const enableDevTools = false;
if (enableDevTools) {
  // Reinstate? Check: https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md
  // const {DebugPanel, DevTools, LogMonitor} = require('redux-devtools/lib/react');

  // render(
  //   <div>
  //     <Provider store={store}>
  //       <Routes />
  //     </Provider>
  //     <DebugPanel top right bottom>
  //       <DevTools store={store} monitor={LogMonitor} />
  //     </DebugPanel>
  //   </div>,
  //   document.getElementById('app')
  // );
} else {
  render(
    <Provider store={store}>
      <Routes />
    </Provider>,
    document.getElementById('app')
  );
}
