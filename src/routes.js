import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Players from './components/players/Players';
import Login from './components/users/Login.js';

export default (
  <div>
    <Route path="/" component={App}>
      <Route path="/spelers" component={Players} />
      <Route path="/login" component={Login} />
    </Route>
  </div>
);