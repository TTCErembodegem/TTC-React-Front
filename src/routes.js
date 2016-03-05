import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/App';
import Players from './components/players/Players';
import Login from './components/users/Login.js';
import Profile from './components/users/Profile.js';
import Matches from './components/matches/Matches';

const Routes = () => (
  <Router history={browserHistory }>
    <Route path="/" component={App}>
      <Route path="/spelers" component={Players} />
      <Route path="/login" component={Login} />
      <Route path="/profiel" component={Profile} />
      <Route path="/matchen" component={Matches} />
    </Route>
  </Router>
);

export default Routes;