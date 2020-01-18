/* eslint-disable import/first, import/order, import/newline-after-import */
import 'babel-core/polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Promise from 'bluebird';
import Routes from './routes.js';
import store from './store.js';

Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true,
  // monitoring: true
});


import {showSnackbar} from './actions/configActions.js';
import http from './utils/httpClient.js';
window.onerror = function(message, source, lineno, colno, error) { // eslint-disable-line
  // eslint-disable-next-line prefer-rest-params, no-console
  console.log('oh noes!', arguments);
  // eslint-disable-next-line prefer-rest-params
  http.post('/config/Log', {args: arguments});
  store.dispatch(showSnackbar(`Something went wrong: ${message}`));
};

import moment from 'moment';
moment.locale('nl');

import {validateToken} from './actions/userActions.js';
const token = localStorage.getItem('token');
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
    document.getElementById('app'),
  );
}



// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';

// import React from 'react';
// import ReactDOM from 'react-dom';


// // TODO: need to fetch this from the backend
// if (process.env.NODE_ENV !== 'production') {
//   document.title += ` - ${process.env.NODE_ENV || '???'}`;
// }



// import moment from 'moment';
// import 'moment/locale/nl-be';

// moment.locale('nl-be');


// // import {registerLocale, setDefaultLocale} from 'react-datepicker';
// // import nl from 'date-fns/locale/nl';

// // registerLocale('nl', nl);
// // setDefaultLocale('nl');

// // ATTN: See util.ts for numeral nl configuration


// // Load css
// import './index.scss';



// // Fetch data from the db
// import {Provider} from 'react-redux';
// import {store} from './store';
// import {initialLoad} from './actions/index';

// store.dispatch(initialLoad());




// // Create the AppRoot
// import Routes from './routes';

// ReactDOM.render(
//   <Provider store={store}>
//     <Routes />
//   </Provider>,
//   document.getElementById('root'),
// );
