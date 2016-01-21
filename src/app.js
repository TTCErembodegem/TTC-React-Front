import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import FastClick from 'fastclick';

import store from './core/store.js';

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body);

const __DEVTOOLS__= false;
if (__DEVTOOLS__) {
  const { DebugPanel, DevTools, LogMonitor } = require('redux-devtools/lib/react');

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
    </Provider>
    ,
    document.getElementById('app')
  );
}

// TODO: onSetTitle doesn't work. Fix when needed :)
const context = {
  onSetTitle: value => document.title = value || 'TTC Erembodegem'
};