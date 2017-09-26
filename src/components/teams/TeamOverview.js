import React, {Component} from 'react';
import moment from 'moment';
import {OwnClubId} from '../../models/ClubModel.js';
import cn from 'classnames';
import storeUtil from '../../storeUtil.js';
import Table from 'react-bootstrap/lib/Table';
import MatchesTable from '../matches/MatchesTable.js';
import {PlayerCompetition} from '../controls.js';

export const TeamOverview = ({team, user, small, t}) => {
  const today = moment().startOf('day');
  const nextMatches = team.getMatches().sort((a, b) => a.date - b.date).filter(m => m.date.isSame(today, 'day') || m.date.isAfter(today, 'day')).take(2);
  const prevMatches = team.getMatches().sort((a, b) => b.date - a.date).filter(m => m.date.isBefore(today, 'day')).take(2);
  return (
    <div style={{paddingLeft: 5, paddingRight: 5}}>
      <TeamOverviewRanking team={team} t={t} small={small} />
      <TeamOverviewMatches matches={nextMatches} team={team} title={t('match.nextMatches')} />
      <TeamOverviewMatches matches={prevMatches} team={team} title={t('match.playedMatches')} />
      <TeamOverviewPlayers team={team} t={t} user={user} />
    </div>
  );
}

class TeamOverviewRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {showAll: !props.small};
  }
  render() {
    const {team, small, t} = this.props;
    var ranking = team.ranking;

    if (ranking.length === 0) {
      return <div />;
    }

    if (small) {
      const ownTeamIndex = team.ranking.findIndex(r => r.clubId === OwnClubId);
      const lastTeamToShow = Math.min(ownTeamIndex + 3, team.ranking.length);
      ranking = team.ranking.slice(Math.max(ownTeamIndex - 2, 0), ownTeamIndex + 3);
    }
    return (
      <div>
        <h3>{t('teamCalendar.view.ranking')}</h3>
        {ranking.map(teamRanking => {
          const isOwnClub = teamRanking.clubId === OwnClubId;
          const points = isOwnClub ? teamRanking.points : `(${teamRanking.points})`;
          return (
            <div
              key={teamRanking.clubId + teamRanking.teamCode}
              style={{marginRight: 15, display: 'inline-block', fontSize: isOwnClub ? 14 : undefined, fontWeight: isOwnClub ? 'bold' : undefined}}
              className={cn({'label label-as-badge label-info': isOwnClub && !small})}
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
  }
}

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
}

const TeamOverviewPlayers = ({team, user, t}) => {
  const stats = team.getPlayerStats();
  if (stats.length === 0) {
    return <div />;
  }
  return (
    <div>
      <h3>{t('teamCalendar.individual')}</h3>
      <Table condensed>
        <thead>
          <tr>
            <th>{t('match.opponents.player')}</th>
            <th>{t('teamCalendar.matches')}</th>
            <th>{t('match.playersVictoryTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {stats.sort((a, b) => b.games - a.games).map(stat => {
            if (stat.isDoubles) {
              return (
                <tr key="doubles">
                  <td colSpan={2}><strong>{t('match.doubles')}</strong></td>
                  <td><TeamOverviewPlayerStats stat={stat} /></td>
                </tr>
              );
            }
            return (
              <tr key={stat.ply.id} className={stat.ply.id === user.playerId ? 'match-won' : ''}>
                <td><PlayerCompetition comp={team.competition} player={stat.ply} withName={true} t={t} /></td>
                <td>{Math.floor(stat.games / team.getTeamPlayerCount())}</td>
                <td><TeamOverviewPlayerStats stat={stat} /></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

const TeamOverviewPlayerStats = ({stat}) => (
  <span>
    {stat.victories} / {stat.games}
    &nbsp;
    ({Math.round(stat.victories / stat.games * 100)}%)
  </span>
);
