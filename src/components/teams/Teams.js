import React, { Component } from 'react';
import PropTypes, { connect, withViewport } from '../PropTypes.js';
import moment from 'moment';
import cn from 'classnames';
import Immutable from 'immutable';

import TabbedContainer from '../controls/TabbedContainer.js';
import Table from 'react-bootstrap/lib/Table';

import { OwnClubId } from '../../models/ClubModel.js';
import { util as storeUtil } from '../../store.js';
import * as matchActions from '../../actions/matchActions.js';

import Icon from '../controls/Icon.js';
import ButtonStack from '../controls/ButtonStack.js';
import PlayersCardGallery from '../players/PlayersCardGallery.js';
import MatchesTable from '../matches/MatchesTable.js';

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
@withViewport
export default class Teams extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    viewport: PropTypes.viewport,

    params: PropTypes.shape({
      tabKey: PropTypes.string,
      competition: PropTypes.oneOf(['vttl', 'sporta']).isRequired
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
      view: 'matches',
      matchesFilter: moment().month() >= 7 ? 'first' : 'last',
      editMode: false,
    };
  }

  _getCompetition() {
    return this.props.params.competition[0].toUpperCase() + this.props.params.competition.substr(1);
  }
  getDefaultTeam() {
    const teams = this.props.teams.filter(x => x.competition === this._getCompetition());
    if (this.props.user.playerId) {
      let yourTeam = this.props.user.getTeams().find(team => team.competition);
      if (yourTeam) {
        return yourTeam.teamCode;
      }
    }
    return 'A';
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

  _renderTabContent(teamCode) {
    const team = this.props.teams.find(t => t.teamCode === teamCode && t.competition === this._getCompetition());
    if (!team) {
      return null;
    }

    const viewsConfig = [/*{
      key: 'main',
      text: this.context.t('teamCalendar.viewMain'),
    }, */{
      key: 'matches',
      text: this.context.t('teamCalendar.viewMatches')
    }, {
      key: 'ranking',
      text: this.context.t('teamCalendar.viewRanking')
    }, {
      key: 'players',
      text: this.context.t('match.tabs.players')
    }];
    return (
      <div>
        <div className="btn-toolbar" style={{padding: 10}}>
          <ButtonStack
            config={viewsConfig}
            small={this.props.viewport.width < 550}
            activeView={this.state.view}
            onClick={view => this.setState({view})} />

          {this.state.view === 'matches' && this.props.user.canEditMatchesOrIsCaptain() ? (
            <button onClick={() => this.setState({editMode: !this.state.editMode})} className="btn btn-default pull-right">
              <Icon fa="fa fa-pencil-square-o" />
            </button>
          ) : null}

          <a href={team.frenoy.getUrl('results')} target="_blank" className="pull-right">
            <button className="btn btn-default">{this.context.t('teamCalendar.frenoyResults')}</button>
          </a>
        </div>
        <h4 style={{marginLeft: 5}}>{team.getDivisionDescription()}</h4>
        {this._renderTabViewContent(team)}
      </div>
    );
  }
  _renderTabViewContent(team) {
    switch (this.state.view) {
    case 'matches':
      let matchesForTeam = team.getMatches().sort((a, b) => a.date - b.date);
      if (this.state.matchesFilter === 'first') {
        matchesForTeam = matchesForTeam.filter(x => x.date.month() >= 7);
      } else {
        matchesForTeam = matchesForTeam.filter(x => x.date.month() < 7);
      }

      return (
        <div>
          <MatchesTable matches={matchesForTeam} allowOpponentOnly user={this.props.user} editMode={this.state.editMode} />

          <div style={{textAlign: 'center'}}>
            <button
              className="btn btn-default"
              onClick={() => this.setState({matchesFilter: this.state.matchesFilter === 'first' ? 'last' : 'first'})}>
              <Icon fa="fa fa-chevron-circle-down" />
              &nbsp;
              {this.context.t('comp.round' + (this.state.matchesFilter === 'first' ? 'Back' : 'First'))}
            </button>
          </div>
        </div>
      );
    case 'ranking':
      return <DivisionRanking team={team} t={this.context.t} />;
    case 'players':
      return <PlayersCardGallery players={Immutable.List(team.getPlayers().map(x => x.player))} />;
    default:
      return <div>summary</div>;
    }
  }

  render() {
    const tabConfig = this.props.teams.filter(team => team.competition === this._getCompetition()).toArray().map(team => {
      return {
        key: team.teamCode,
        title: team.renderOwnTeamTitle(),
        headerChildren: this._renderOwnTeamPosition(team),
      };
    });

    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <TabbedContainer
          params={this.props.params}
          defaultTabKey={this.getDefaultTeam()}
          tabKeys={tabConfig}
          tabRenderer={::this._renderTabContent}
          route={{base: this.context.t.route('teams', {competition: this.props.params.competition})}}
          widthTreshold={750} />
      </div>
    );
  }
}

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