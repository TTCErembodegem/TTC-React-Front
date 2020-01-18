import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ComponentWithLayout} from './components/App/ComponentWithLayout';
import Players from './components/players/Players';
import {Player} from './components/players/Player';
import Login from './components/users/Login';
import ForgotPassword, {ForgotPasswordReset} from './components/users/ForgotPassword';
import Profile from './components/users/Profile';
import Links from './components/other/Links';
import Administration from './components/other/Administration';
import GeneralInfo from './components/other/GeneralInfo';
import Matches from './components/matches/Matches';
import MatchesToday from './components/matches/MatchesToday';
import MatchesWeek from './components/matches/MatchesWeek';
import RoutedMatchCard from './components/matches/Match/RoutedMatchCard';
import Facts from './components/other/Facts';
import Teams from './components/teams/Teams';
import Admin from './components/admin/Admin';
import {OpponentOverview} from './components/teams/OpponentOverview';
import Intro from './components/App/Intro';

import t from './locales';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path={`${t.route('forgotPassword')}/:guid`} render={props => <ComponentWithLayout Component={ForgotPasswordReset} {...props} />} />
      <Route path={t.route('forgotPassword')} render={props => <ComponentWithLayout Component={ForgotPassword} {...props} />} />
      <Route path={t.route('login')} render={props => <ComponentWithLayout Component={Login} {...props} />} />
      <Route path={`${t.route('profile')}/:tabKey?`} render={props => <ComponentWithLayout Component={Profile} {...props} />} />

      <Route path={`${t.route('players')}/:tabKey?`} render={props => <ComponentWithLayout Component={Players} {...props} />} />
      <Route path={t.route('player')} render={props => <ComponentWithLayout Component={Player} {...props} />} />

      <Route path={t.route('matches')} render={props => <ComponentWithLayout Component={Matches} {...props} />} />
      <Route path={`${t.route('matchesWeek')}/:tabKey?/:comp?`} render={props => <ComponentWithLayout Component={MatchesWeek} {...props} />} />
      <Route path={t.route('matchesToday')} render={props => <ComponentWithLayout Component={MatchesToday} {...props} />} />
      <Route path={`${t.route('match')}/:tabKey?`} render={props => <ComponentWithLayout Component={RoutedMatchCard} {...props} />} />

      <Route path={`${t.route('teams')}/:tabKey?/:view?`} render={props => <ComponentWithLayout Component={Teams} {...props} />} />
      <Route path={t.route('opponent')} render={props => <ComponentWithLayout Component={OpponentOverview} {...props} />} />

      <Route path={`${t.route('admin')}/:tabKey?`} render={props => <ComponentWithLayout Component={Admin} {...props} />} />

      <Route path={t.route('facts')} render={props => <ComponentWithLayout Component={Facts} {...props} />} />
      <Route path={t.route('links')} render={props => <ComponentWithLayout Component={Links} {...props} />} />
      <Route path={t.route('administration')} render={props => <ComponentWithLayout Component={Administration} {...props} />} />
      <Route path={t.route('generalInfo')} render={props => <ComponentWithLayout Component={GeneralInfo} {...props} />} />

      <Route path="/" render={props => <ComponentWithLayout Component={Intro} {...props} />} />
    </Switch>
  </BrowserRouter>
);


export const browseTo = {
  getTeam({competition, teamCode = 'A'}, view = 'main') {
    return `${t.route('teams').replace(':competition', competition)}/${teamCode}/${view}`;
  },
  getOpponent(competition, {clubId, teamCode}) {
    return t.route('opponent')
      .replace(':competition', competition)
      .replace(':clubId', clubId)
      .replace(':teamCode', teamCode);
  },
};

export default Routes;
