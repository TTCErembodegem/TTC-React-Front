import React from 'react';
import moment from 'moment';
import { OwnClubId } from '../../models/ClubModel.js';
import cn from 'classnames';
import { util as storeUtil } from '../../store.js';
import MatchesTable from '../matches/MatchesTable.js';

const TeamOverview = ({team, user, t}) => {
  const today = moment().startOf('day');
  const nextMatches = team.getMatches().sort((a, b) => a.date - b.date).filter(m => m.date.isSame(today, 'day') || m.date.isAfter(today, 'day')).take(2);
  const prevMatches = team.getMatches().sort((a, b) => b.date - a.date).filter(m => m.date.isBefore(today, 'day')).take(2);
  return (
    <div style={{paddingLeft: 5, paddingRight: 5}}>
      <TeamOverviewRanking team={team} t={t} />
      <TeamOverviewMatches matches={nextMatches} user={user} team={team} title={t('match.nextMatches')} />
      <TeamOverviewMatches matches={prevMatches} user={user} team={team} title={t('match.playedMatches')} />
      <TeamOverviewPlayers team={team} t={t} />
    </div>
  );
}

const TeamOverviewRanking = ({team, t}) => (
  <div>
    <h4>{t('teamCalendar.viewRanking')}</h4>
    {team.ranking.map(teamRanking => {
      const isOwnClub = teamRanking.clubId === OwnClubId;
      const points = isOwnClub ? teamRanking.points : `(${teamRanking.points})`;
      return (
        <div
          key={teamRanking.clubId + teamRanking.teamCode}
          style={{marginRight: 15, display: 'inline-block', fontSize: isOwnClub ? 14 : undefined}}
          className={cn({'label label-as-badge label-info': isOwnClub})}
        >
          {teamRanking.position}.&nbsp;
          {storeUtil.getClub(teamRanking.clubId).name} {teamRanking.teamCode}
          &nbsp;
          <span style={{marginLeft: 7}}>{points}</span>
        </div>
      );
    })}
  </div>
);

const ucFirst = input => input[0].toUpperCase() + input.substr(1);

const TeamOverviewMatches = ({matches, user, team, title}) => {
  if (matches.size === 0) {
    return <div />;
  }
  return (
    <div>
      <h4>{ucFirst(title)}</h4>
      <MatchesTable matches={matches} allowOpponentOnly user={user} team={team} />
    </div>
  );
}

const TeamOverviewPlayers = ({team, t}) => {
  //console.log("t", t);
  //<h4>{t('teamCalendar.individual')}</h4>
  return (
    <div>

    </div>
  );
}

export default TeamOverview;