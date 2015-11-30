import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import store from './core/store';

const context = {
  onSetTitle: value => document.title = value || 'TTC Erembodegem'
};

// Make taps on links and buttons work fast on mobiles
//FastClick.attach(document.body);

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

// import 'babel-core/polyfill';
// import ReactDOM from 'react-dom';
// import FastClick from 'fastclick';
// import Router from './routes'; // replace this
// import Location from './core/Location';
// import { addEventListener, removeEventListener } from './utils/DOMUtils';

// //let cssContainer = document.getElementById('css');
// const appContainer = document.getElementById('app');
// const context = {
//   onSetTitle: value => document.title = value || 'TTC Erembodegem',
//   onSetMeta: (name, content) => {
//     // Remove and create a new <meta /> tag in order to make it work
//     // with bookmarks in Safari
//     const elements = document.getElementsByTagName('meta');
//     [].slice.call(elements).forEach((element) => {
//       if (element.getAttribute('name') === name) {
//         element.parentNode.removeChild(element);
//       }
//     });
//     const meta = document.createElement('meta');
//     meta.setAttribute('name', name);
//     meta.setAttribute('content', content);
//     document.getElementsByTagName('head')[0].appendChild(meta);
//   },
// };

// function render(state) {
//   Router.dispatch(state, (newState, component) => {
//     ReactDOM.render(component, appContainer, () => {
//       // Restore the scroll position if it was saved into the state
//       if (state.scrollY !== undefined) {
//         window.scrollTo(state.scrollX, state.scrollY);
//       } else {
//         window.scrollTo(0, 0);
//       }

//       // // Remove the pre-rendered CSS because it's no longer used
//       // // after the React app is launched
//       // if (cssContainer) {
//       //   cssContainer.parentNode.removeChild(cssContainer);
//       //   cssContainer = null;
//       // }
//     });
//   });
// }

// function run() {
//   let currentLocation = null;
//   let currentState = null;

//   // Re-render the app when window.location changes
//   const unlisten = Location.listen(location => {
//     currentLocation = location;
//     currentState = Object.assign({}, location.state, {
//       path: location.pathname,
//       query: location.query,
//       state: location.state,
//       context,
//     });
//     console.log('locationchange', location, currentState)
//     render(currentState);
//   });

//   // Save the page scroll position into the current location's state
//   const supportPageOffset = window.pageXOffset !== undefined;
//   const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
//   const setPageOffset = () => {
//     currentLocation.state = currentLocation.state || Object.create(null);
//     if (supportPageOffset) {
//       currentLocation.state.scrollX = window.pageXOffset;
//       currentLocation.state.scrollY = window.pageYOffset;
//     } else {
//       currentLocation.state.scrollX = isCSS1Compat ?
//         document.documentElement.scrollLeft : document.body.scrollLeft;
//       currentLocation.state.scrollY = isCSS1Compat ?
//         document.documentElement.scrollTop : document.body.scrollTop;
//     }
//   };

//   addEventListener(window, 'scroll', setPageOffset);
//   addEventListener(window, 'pagehide', () => {
//     removeEventListener(window, 'scroll', setPageOffset);
//     unlisten();
//   });
// }

// // Run the application when both DOM is ready
// // and page content is loaded
// if (window.addEventListener) {
//   window.addEventListener('DOMContentLoaded', run);
// } else {
//   window.attachEvent('onload', run);
// }
