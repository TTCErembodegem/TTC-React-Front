import React from 'react';
import PropTypes from '../PropTypes.js';
import moment from 'moment';
import MatchesTable from '../matches/MatchesTable.js';
import {TeamPlayerAvatars} from './controls/TeamPlayerAvatars.js';
import {TeamOverviewPlayers} from './controls/TeamOverviewPlayers.js';
import {TeamOverviewRanking} from './controls/TeamOverviewRanking.js';
import {OpponentsTeamFormation} from '../matches/Match/OpponentsTeamFormation.js';


export const TeamOverview = ({team, small, t}) => {
  const today = moment().startOf('day');
  const nextMatches = team.getMatches().sort((a, b) => a.date - b.date).filter(m => m.date.isSame(today, 'day') || m.date.isAfter(today, 'day')).take(2); // eslint-disable-line
  const prevMatches = team.getMatches().sort((a, b) => b.date - a.date).filter(m => m.date.isBefore(today, 'day')).take(2);
  return (
    <div style={{paddingLeft: 5, paddingRight: 5}}>
      <TeamPlayerAvatars team={team} />
      <div className="col-md-8">
        <TeamOverviewRanking team={team} t={t} small={small} />
      </div>

      <div className="col-md-4">
        <h3>{t('common.teamFormations')}</h3>
        <OpponentsTeamFormation matches={team.getMatches()} hideHeader />
      </div>

      <TeamOverviewMatches matches={prevMatches} team={team} title={t('match.playedMatches')} />
      <TeamOverviewMatches matches={nextMatches} team={team} title={t('match.nextMatches')} />

      <TeamOverviewPlayers team={team} />
    </div>
  );
};

TeamOverview.propTypes = {
  team: PropTypes.TeamModel.isRequired,
  small: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};




const ucFirst = input => input[0].toUpperCase() + input.substr(1);

const TeamOverviewMatches = ({matches, team, title}) => {
  if (matches.size === 0) {
    return <div />;
  }
  return (
    <div>
      <h3>{ucFirst(title)}</h3>
      <MatchesTable matches={matches} allowOpponentOnly team={team} />
    </div>
  );
};

TeamOverviewMatches.propTypes = {
  matches: PropTypes.MatchModelList.isRequired,
  team: PropTypes.TeamModel.isRequired,
  title: PropTypes.string.isRequired,
};
