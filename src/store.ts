import {createStore, applyMiddleware, compose} from 'redux';
// import {devTools} from 'redux-devtools';
// import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

let finalCreateStore;
if (false) { // eslint-disable-line
  // console.error('finalCreateStore DEBUG');
  finalCreateStore = compose(
    // applyMiddleware(createLogger({collapsed: true})),
    applyMiddleware(thunk),
    // devTools(),
  )(createStore);
} else {
  // console.error('finalCreateStore NODEBUG');
  finalCreateStore = compose(
    applyMiddleware(thunk),
  )(createStore);
}

// let store = createStore(reducer, initialState, compose(
//   applyMiddleware(...middleware),
//   window.devToolsExtension ? window.devToolsExtension() : f => f
// ));

const store = finalCreateStore(rootReducer);

if (module.hot) {
  // console.error('finalCreateStore is HOT');
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = rootReducer;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
