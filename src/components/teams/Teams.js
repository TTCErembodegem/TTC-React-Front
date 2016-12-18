import React, { Component } from 'react';
import PropTypes, { connect, withViewport } from '../PropTypes.js';
import moment from 'moment';
import cn from 'classnames';
import Immutable from 'immutable';
import http from '../../utils/httpClient.js';

import TabbedContainer from '../controls/TabbedContainer.js';
import Table from 'react-bootstrap/lib/Table';

import { OwnClubId } from '../../models/ClubModel.js';
import { util as storeUtil } from '../../store.js';
import { editMatchPlayers } from '../../actions/matchActions.js';

import Icon from '../controls/Icon.js';
import ButtonStack from '../controls/ButtonStack.js';
import PlayersCardGallery from '../players/PlayersCardGallery.js';
import MatchesTable from '../matches/MatchesTable.js';

export function getFirstOrLastMatches(allMatchesToCome, filter) {
  const firstMatches = allMatchesToCome.filter(x => x.date.month() >= 7);
  const lastMatches = allMatchesToCome.filter(x => x.date.month() < 7);
  if (filter === 'first' && firstMatches.length !== 0) {
    return {
      matches: firstMatches,
      hasMore: lastMatches.length !== 0
    };
  }
  return {
    matches: lastMatches,
    hasMore: firstMatches.length !== 0
  };
}
export function getFirstOrLast() {
  const today = moment();
  return today.month() >= 7 && !(today.month() === 11 && today.date() > 20) ? 'first' : 'last';
}

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
}, {editMatchPlayers})
@withViewport
export default class Teams extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    viewport: PropTypes.viewport,
    editMatchPlayers: PropTypes.func.isRequired,

    params: PropTypes.shape({
      tabKey: PropTypes.string,
      competition: PropTypes.oneOf(['vttl', 'sporta']).isRequired
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      view: 'matches',
      matchesFilter: getFirstOrLast(),
      editMode: false,
      tablePlayers: this._getAlreadyPicked(props),
      tableMatches: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    // TODO: BUG: if you resize the screen (or something else happens like a broadcast), already picked players are lost
    this.setState({tablePlayers: this._getAlreadyPicked(nextProps)});
  }
  _getAlreadyPicked(props) {
    if (props.user.canEditMatchesOrIsCaptain()) {
      var alreadyPicked = [];
      props.matches.forEach(match => {
        const team = match.getTeam();
        const formation = match.getPlayerFormation(this._getPlayerStatus());
        const matchPicked = formation.map(frm => Object.assign({}, frm, {matchId: match.id})).toArray();
        Array.prototype.push.apply(alreadyPicked, matchPicked);
      });
      return alreadyPicked;
    }
    return [];
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

  _downloadExcel() {
    if (this.state.isDownloading) {
      return;
    }
    this.setState({isDownloading: true});
    http.download.teamsExcel(this.context.t('teamCalendar.downloadExcelFileName'))
      .catch(err => {
        console.error('err', err);
      })
      .then(() => this.setState({isDownloading: false}));
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

    var viewsConfig = [/*{
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
    if (this.props.user.playerId) {
      viewsConfig.splice(1, 0, {
        key: 'matchesTable',
        text: this.context.t('teamCalendar.downloadExcelFileName')
      });
    }

    const {matches} = getFirstOrLastMatches(team.getMatches(), this.state.matchesFilter);
    return (
      <div>
        <div className="btn-toolbar" style={{padding: 10}}>
          <ButtonStack
            config={viewsConfig}
            small={this.props.viewport.width < 700}
            activeView={this.state.view}
            onClick={view => this.setState({view})} />

          {this.state.view.startsWith('matches') && this.props.user.canEditMatchesOrIsCaptain() && matches.some(m => !m.isSyncedWithFrenoy) ? (
            <div className="pull-right" style={{marginLeft: 5}}>
              {this.state.editMode && this.state.view != 'matches' ? (
                <button className="btn btn-danger" style={{marginRight: 5}} onClick={::this._saveAndBlockAll}>
                  {this.context.t('match.plys.saveAndBlockAll')}
                </button>
              ) : null}
              <button onClick={() => this.setState({editMode: !this.state.editMode})} className="btn btn-default">
                <Icon fa="fa fa-pencil-square-o" />
              </button>
            </div>
          ) : null}

          {this.props.user.playerId ? (
            <button onClick={::this._downloadExcel} className="btn btn-default pull-right">
              <Icon fa={this.state.isDownloading ? 'fa fa-spinner fa-pulse' : 'fa fa-file-excel-o'} />
            </button>
          ) : null}

          <a href={team.frenoy.getUrl('results')} target="_blank" className="pull-right">
            <button className="btn btn-default">{this.context.t('teamCalendar.frenoyResults')}</button>
          </a>
        </div>
        <h4 style={{marginLeft: 5}}>{team.getDivisionDescription()}</h4>
        {this._renderTabViewContent(team, matches)}
      </div>
    );
  }

  _getPlayerStatus() {
    return this.props.user.canManageTeams() ? 'Major' : 'Captain';
  }
  _saveAndBlockAll() {
    if (!this.state.tableMatches.length) {
      return;
    }

    _(this.state.tablePlayers)
    .filter(tb => this.state.tableMatches.indexOf(tb.matchId) !== -1)
    .groupBy('matchId')
    .forOwn((plyInfos, matchId) => {
      this.props.editMatchPlayers({
        matchId: matchId,
        playerIds: plyInfos.map(x => x.id),
        blockAlso: true,
        newStatus: this._getPlayerStatus()
      }, false)
      .catch(e => console.error('saveAndBlockAll', e));
    });
    this.setState({tableMatches: []});
  }
  _renderTabViewContent(team, matches) {
    switch (this.state.view) {
    case 'matches':
    case 'matchesTable':
      return (
        <div>
          <MatchesTable
            matches={matches}
            allowOpponentOnly
            striped
            user={this.props.user}
            editMode={this.state.editMode}

            tableForm={this.state.view === 'matchesTable'}
            team={team}
            tablePlayers={this.state.tablePlayers}
            onTablePlayerSelect={(plyInfos, match) => this.setState({tablePlayers: plyInfos, tableMatches: this.state.tableMatches.concat([match.id])})}
          />

          <SwitchBetweenFirstAndLastRoundButton setState={::this.setState} matchesFilter={this.state.matchesFilter} t={this.context.t} />
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

export const SwitchBetweenFirstAndLastRoundButton = ({t, setState, matchesFilter}) => (
  <div style={{textAlign: 'center'}}>
    <button
      className="btn btn-default"
      onClick={() => setState({matchesFilter: matchesFilter === 'first' ? 'last' : 'first'})}>
      <Icon fa="fa fa-chevron-circle-down" />
      &nbsp;
      {t('comp.round' + (matchesFilter === 'first' ? 'Back' : 'First'))}
    </button>
  </div>
);

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