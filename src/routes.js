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

const Routes = () => (
  <Router history={browserHistory }>
    <Route path="/" component={App}>
      <Route path="/spelers" component={Players} />
      <Route path="/login" component={Login} />
      <Route path="/profiel" component={Profile} />
      <Route path="/links" component={Links} />
      <Route path="/matchen" component={Matches} />
      <Route path="/weetjes" component={Facts} />
      <Route path="/match/:matchId" component={RoutedMatch}/>
      <Route path="*" component={Matches}/>
    </Route>
  </Router>
);

export default Routes;