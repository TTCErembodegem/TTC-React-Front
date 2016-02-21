import 'babel-core/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';

//import FastClick from 'fastclick';
// Make taps on links and buttons work fast on mobiles
//FastClick.attach(document.body);
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import moment from 'moment';
moment.locale('nl');

import store from './store.js';
import initialLoad from './actions/initialLoad.js';
store.dispatch(initialLoad());

store.dispatch({
  type: 'LOGIN',
  payload: {
    playerId: 20,
    teams: [25],
    security: ['CAN_MANAGETEAM']
  }
});

const enableDevTools = false;
if (enableDevTools) {
  const {DebugPanel, DevTools, LogMonitor} = require('redux-devtools/lib/react');

  render(
    <div>
      <Provider store={store}>
        <ReduxRouter />
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
      <ReduxRouter />
    </Provider>,
    document.getElementById('app')
  );
}

