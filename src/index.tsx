/* eslint-disable import/first, import/order, import/newline-after-import */
import React from 'react';
import {render} from 'react-dom';
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



// import React from 'react';
// import ReactDOM from 'react-dom';


import moment from 'moment';
import 'moment/locale/nl-be';
moment.locale('nl-be');


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
