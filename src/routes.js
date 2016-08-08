import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/App';
import Players from './components/players/Players';
import Login, {ForgotPassword} from './components/users/Login.js';
import Profile from './components/users/Profile.js';
import Links from './components/other/Links.js';
import Matches from './components/matches/Matches.js';
import MatchesToday from './components/matches/MatchesToday.js';
import MatchesWeek from './components/matches/MatchesWeek.js';
import RoutedMatchCard from './components/matches/Match/RoutedMatchCard.js';
import Facts from './components/other/Facts.js';
import { TeamsSporta, TeamsVttl } from './components/teams/Teams.js';
import Admin from './components/admin/Admin.js';

import t from './locales.js';

const Routes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path={t.route('login')} component={Login} />
      <Route path={t.route('forgotPassword')} component={ForgotPassword} />
      <Route path={t.route('profile')} component={Profile} />

      <Route path={t.route('players')} component={Players} />

      <Route path={t.route('matches')} component={Matches} />
      <Route path={t.route('matchesToday')} component={MatchesToday} />
      <Route path={t.route('matchesWeek')} component={MatchesWeek} />
      <Route path={t.route('match')} component={RoutedMatchCard}/>

      <Route path={t.route('teamsVttl')} component={TeamsVttl}/>
      <Route path={t.route('teamsSporta')} component={TeamsSporta}/>

      <Route path={t.route('facts')} component={Facts} />
      <Route path={t.route('links')} component={Links} />

      <Route path={t.route('admin')} component={Admin}/>
      <Route path="*" component={Matches}/>
    </Route>
  </Router>
);

export default Routes;