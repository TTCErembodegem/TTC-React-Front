import 'babel-core/polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Promise from 'bluebird';
import moment from 'moment';
import Routes from './routes.js';
import store from './store.js';


import {showSnackbar} from './actions/configActions.js';
import http from './utils/httpClient.js';


import {validateToken} from './actions/userActions.js';

import initialLoad from './actions/initialLoad.js';

Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true,
  // monitoring: true
});
window.onerror = function(message, source, lineno, colno, error) { // eslint-disable-line
  console.log('oh noes!', arguments); // eslint-disable-line
  http.post('/config/Log', {args: arguments});
  store.dispatch(showSnackbar(`Something went wrong: ${message}`));
};
moment.locale('nl');
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(validateToken(token));
}
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
    document.getElementById('app'),
  );
}
