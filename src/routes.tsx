import React from 'react';
import {BrowserRouter, Route, Routes as Switch} from 'react-router-dom';
import {ComponentWithLayout} from './components/App/ComponentWithLayout';
// import Players from './components/players/Players';
// import {Player} from './components/players/Player';
// import Login from './components/users/Login';
// import ForgotPassword, {ForgotPasswordReset} from './components/users/ForgotPassword';
// import Profile from './components/users/Profile';
// import Links from './components/other/Links';
// import Administration from './components/other/Administration';
// import GeneralInfo from './components/other/GeneralInfo';
// import Matches from './components/matches/Matches';
// import MatchesToday from './components/matches/MatchesToday';
// import MatchesWeek from './components/matches/MatchesWeek';
// import RoutedMatchCard from './components/matches/Match/RoutedMatchCard';
// import Facts from './components/other/Facts';
// import Teams from './components/teams/Teams';
// import Admin from './components/admin/Admin';
// import {OpponentOverview} from './components/teams/OpponentOverview';
import Intro from './components/App/Intro';

import t from './locales';
import { Competition, ITeam, ITeamOpponent } from './models/model-interfaces';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      {/* <Route path={`${t.route('forgotPassword')}/:guid`} element={<ComponentWithLayout Component={ForgotPasswordReset} />} />
      <Route path={t.route('forgotPassword')} element={<ComponentWithLayout Component={ForgotPassword} />} />
      <Route path={t.route('login')} element={<ComponentWithLayout Component={Login} />} />
      <Route path={`${t.route('profile')}/:tabKey?`} element={<ComponentWithLayout Component={Profile} />} />

      <Route path={`${t.route('players')}/:tabKey?`} element={<ComponentWithLayout Component={Players} />} />
      <Route path={t.route('player')} element={<ComponentWithLayout Component={Player} />} />

      <Route path={t.route('matches')} element={<ComponentWithLayout Component={Matches} />} />
      <Route path={`${t.route('matchesWeek')}/:tabKey?/:comp?`} element={<ComponentWithLayout Component={MatchesWeek} />} />
      <Route path={t.route('matchesToday')} element={<ComponentWithLayout Component={MatchesToday} />} />
      <Route path={`${t.route('match')}/:tabKey?`} element={<ComponentWithLayout Component={RoutedMatchCard} />} />

      <Route path={`${t.route('teams')}/:tabKey?/:view?`} element={<ComponentWithLayout Component={Teams} />} />
      <Route path={t.route('opponent')} element={<ComponentWithLayout Component={OpponentOverview} />} />

      <Route path={`${t.route('admin')}/:tabKey?`} element={<ComponentWithLayout Component={Admin} />} />

      <Route path={t.route('facts')} element={<ComponentWithLayout Component={Facts} />} />
      <Route path={t.route('links')} element={<ComponentWithLayout Component={Links} />} />
      <Route path={t.route('administration')} element={<ComponentWithLayout Component={Administration} />} />
      <Route path={t.route('generalInfo')} element={<ComponentWithLayout Component={GeneralInfo} />} /> */}

      <Route path="/" element={<ComponentWithLayout Component={Intro} />} />
    </Switch>
  </BrowserRouter>
);


export const browseTo = {
  getTeam({competition, teamCode = 'A'}: ITeam, view = 'main') {
    return `${t.route('teams').replace(':competition', competition)}/${teamCode}/${view}`;
  },
  getOpponent(competition: Competition, {clubId, teamCode}: ITeamOpponent) {
    return t.route('opponent')
      .replace(':competition', competition)
      .replace(':clubId', clubId?.toString())
      .replace(':teamCode', teamCode);
  },
};

export default Routes;
