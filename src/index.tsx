/* eslint-disable import/first, import/order, import/newline-after-import */
import React from 'react';
import ReactDOM from "react-dom/client";
import {Provider} from 'react-redux';
import Routes from './routes';
import store from './store';

import {showSnackbar} from './actions/configActions';
import http from './utils/httpClient';
window.onerror = function(message, source, lineno, colno, error) { // eslint-disable-line
  // eslint-disable-next-line prefer-rest-params, no-console
  console.log('oh noes!', arguments);
  // eslint-disable-next-line prefer-rest-params
  http.post('/config/Log', {args: arguments});
  store.dispatch(showSnackbar(`Something went wrong: ${message}`));
};

import {validateToken} from './actions/userActions';
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(validateToken(token));
}

import initialLoad from './actions/initialLoad';
store.dispatch(initialLoad());


// Let's start here...
// --> we need to make the store strongly typed...
// --> and then get rid of the connect() ?

// and the decorators 😀
// useContext?


const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <Provider store={store}>
    <Routes />
  </Provider>
);

import moment from 'moment';
import 'moment/locale/nl-be';
moment.locale('nl-be');

import './index.scss';
