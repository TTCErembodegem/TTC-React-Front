import React from 'react';
import PropTypes from '../../PropTypes.js';
import Table from 'react-bootstrap/lib/Table';
import {PlayerCompetition} from '../../controls.js';
import {TeamOverviewPlayerStats} from './TeamOverviewPlayerStats.js';

export const TeamOverviewPlayers = ({team, user, t}) => {
  const stats = team.getPlayerStats();
  if (stats.length === 0) {
    return <div />;
  }
  return (
    <div>
      <h3>{t('teamCalendar.individual')}</h3>
      <Table condensed striped>
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
};

TeamOverviewPlayers.propTypes = {
  t: PropTypes.func.isRequired,
  user: PropTypes.UserModel.isRequired,
  team: PropTypes.TeamModel.isRequired,
};
