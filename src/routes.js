import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/App';
import Players from './components/players/Players';
import Login from './components/users/Login.js';
import Profile from './components/users/Profile.js';
import Links from './components/other/Links.js';
import Matches from './components/matches/Matches.js';
import { RoutedMatch } from './components/matches/Match/MatchCard.js';
import Facts from './components/other/Facts.js';

import t from './locales.js';

const Routes = () => (
  <Router history={browserHistory }>
    <Route path="/" component={App}>
      <Route path={t.route('players')} component={Players} />
      <Route path={t.route('login')} component={Login} />
      <Route path={t.route('profile')} component={Profile} />
      <Route path={t.route('links')} component={Links} />
      <Route path={t.route('matches')} component={Matches} />
      <Route path={t.route('facts')} component={Facts} />
      <Route path={t.route('match')} component={RoutedMatch}/>
      <Route path="*" component={Matches}/>
    </Route>
  </Router>
);

export default Routes;