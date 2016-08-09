import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MatchModel from '../../models/MatchModel.js';
import TeamModel from '../../models/TeamModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';

import TabbedContainer from '../controls/TabbedContainer.js';
import Table from 'react-bootstrap/lib/Table';

import { OwnClubId } from '../../models/ClubModel.js';

import { util as storeUtil } from '../../store.js';
import * as matchActions from '../../actions/matchActions.js';

import cn from 'classnames';
import Icon from '../controls/Icon.js';

export const TeamsVttl = () => <Teams competition="Vttl" />;
export const TeamsSporta = () => <Teams competition="Sporta" />;

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
}, matchActions)
export default class Teams extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    competition: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    teams: ImmutablePropTypes.listOf(PropTypes.instanceOf(TeamModel).isRequired).isRequired,
  }

  getDefaultTeam() {
    var teamCode = 'A';
    const teams = this.props.teams.filter(x => x.competition === this.props.competition);
    if (this.props.user.playerId) {
      let yourTeam = this.props.user.getTeams().find(team => team.competition);
      if (yourTeam) {
        teamCode = yourTeam.teamCode;
      }
    }
    return teams.find(x => x.teamCode === teamCode).id;
  }

  _renderOwnTeamPosition(team) {
    var positionClassName;
    if (team.isTopper()) {
      positionClassName = 'match-won';
    } else if (team.isInDegradationZone()) {
      positionClassName = 'match-lost';
    } else {
      positionClassName = 'label-default';
    }

    const ranking = team.getDivisionRanking();
    return <span className={cn('label label-as-badge ' + positionClassName)}>{ranking.position}</span>;
  }

  _renderTabContent(teamId) {
    const team = this.props.teams.find(t => t.id === teamId);
    return (
      <div>
        <DivisionRanking team={team} t={this.context.t} />
        <TeamMatches team={team} t={this.context.t} />
      </div>
    );
  }

  render() {
    const tabConfig = this.props.teams.filter(team => team.competition === this.props.competition).toArray().map(team => {
      return {
        key: team.id,
        title: team.renderOwnTeamTitle(),
        headerChildren: this._renderOwnTeamPosition(team),
      };
    });

    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <TabbedContainer
          openTabKey={this.getDefaultTeam()}
          tabKeys={tabConfig}
          tabRenderer={::this._renderTabContent}
          widthTreshold={750} />
      </div>
    );
  }
}


const TeamMatches = ({team, t}) => {
  const matchesForTeam = team.getMatches().sort((a, b) => a.date - b.date);
  return (
    <Table condensed hover>
      <thead>
        <tr>
          <th>{t('teamCalendar.date')}</th>
          <th>{t('teamCalendar.hour')}</th>
          <th>{t('teamCalendar.match')}</th>
          <th>{t('teamCalendar.score')}</th>
        </tr>
      </thead>
      <tbody>
      {matchesForTeam.map(match => {
        var thrillerIcon;
        if (team.getThriller(match)) {
          thrillerIcon = (<Icon fa="fa fa-heartbeat faa-pulse animated" style={{marginLeft: 3, marginRight: 7, marginTop: 3}} />);
        }
        return (
          <tr
            key={match.id}
            className={cn('clickable',{'match-won': match.scoreType === 'Won'})}
            onClick={() => browserHistory.push(t.route('match', {matchId: match.id}))}
          >
            <td>
              {thrillerIcon}
              {match.date.format('DD/MM')}
            </td>
            <td>{match.date.format('HH:mm')}</td>
            <td>
              {match.isHomeMatch ? team.renderOwnTeamTitle() : match.renderOpponentTitle()} -
              {match.isHomeMatch ? ' ' + match.renderOpponentTitle() : ' ' + team.renderOwnTeamTitle()}
            </td>
            <td>{match.renderScore()}</td>
          </tr>
        );
      })}
      </tbody>
    </Table>
  );
};


const DivisionRanking = ({team, t}) => (
  <Table condensed hover>
    <thead>
      <tr>
        <th>{t('teamCalendar.position')}</th>
        <th>{t('teamCalendar.name')}</th>
        <th className="hidden-xs">{t('teamCalendar.matchesWon')}</th>
        <th className="hidden-xs">{t('teamCalendar.matchesLost')}</th>
        <th className="hidden-xs">{t('teamCalendar.matchesDraw')}</th>
        <th>{t('teamCalendar.points')}</th>
      </tr>
    </thead>
    <tbody>
      {team.ranking.map(teamRanking => (
        <tr
          className={cn({'match-won': teamRanking.clubId === OwnClubId, 'accentuate': teamRanking.clubId === OwnClubId})}
          key={teamRanking.clubId + teamRanking.teamCode}
        >
          <td>{teamRanking.position}</td>
          <td>{storeUtil.getClub(teamRanking.clubId).name + ' ' + teamRanking.teamCode}</td>
          <td className="hidden-xs">{teamRanking.gamesWon}</td>
          <td className="hidden-xs">{teamRanking.gamesLost}</td>
          <td className="hidden-xs">{teamRanking.gamesDraw}</td>
          <td>{teamRanking.points}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);