import React, {Component} from 'react';
import Table from 'react-bootstrap/lib/Table';
import PropTypes, {connect, withViewport} from '../../PropTypes.js';
import {PlayerCompetitionLabel} from '../../controls.js';
import {TeamOverviewPlayerStats} from './TeamOverviewPlayerStats.js';

class TeamOverviewPlayersComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    viewport: PropTypes.viewport,
    user: PropTypes.UserModel.isRequired,
    team: PropTypes.TeamModel.isRequired,
  };

  render() {
    const {t} = this.context;
    const {team, user} = this.props;
    const stats = team.getPlayerStats();
    if (stats.length === 0) {
      return null;
    }

    const showPlayerAlias = this.props.viewport.width < 500;
    const showMatchesPlayed = this.props.viewport.width > 400;

    return (
      <div>
        <h3>{t('teamCalendar.individual')}</h3>
        <Table condensed striped style={{maxWidth: 550}}>
          <thead>
            <tr>
              <th>{t('match.opponents.player')}</th>
              {showMatchesPlayed ? <th>{t('teamCalendar.matches')}</th> : null}
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
                  <td><PlayerCompetitionLabel comp={team.competition} player={stat.ply} withName={showPlayerAlias ? 'alias' : true} t={t} /></td>
                  {showMatchesPlayed ? <td>{Math.floor(stat.games / team.getTeamPlayerCount())}</td> : null}
                  <td><TeamOverviewPlayerStats stat={stat} /></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export const TeamOverviewPlayers = withViewport(connect(state => ({user: state.user}))(TeamOverviewPlayersComponent));
