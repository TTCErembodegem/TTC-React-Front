import React, {Component} from 'react';
import Immutable from 'immutable';
import _ from 'lodash';
import PropTypes, {connect, withViewport, withRouter} from '../PropTypes';
import http from '../../utils/httpClient';
import {TabbedContainer} from '../controls/TabbedContainer';
import {editMatchPlayers} from '../../actions/matchActions';
import {DivisionRanking} from './DivisionRanking';
import {TeamOverview} from './TeamOverview';
import {TeamHeader} from './controls/TeamHeader';
import {TeamTabTitle} from './controls/TeamTabTitle';
import {SwitchBetweenFirstAndLastRoundButton, getFirstOrLastMatches, getFirstOrLast} from './SwitchBetweenFirstAndLastRoundButton';
import PlayersCardGallery from '../players/PlayersCardGallery';
import MatchesTable from '../matches/MatchesTable';
import {TeamMatchesWeek} from './TeamMatchesWeek';
import {ButtonStack} from '../controls/Buttons/ButtonStack';
import {SaveButton} from '../controls/Buttons/SaveButton';
import {EditButton} from '../controls/Buttons/EditButton';
import {ExcelButton} from '../controls/Buttons/ExcelButton';
import {FrenoyButton} from '../controls/Buttons/FrenoyButton';

class Teams extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    viewport: PropTypes.viewport,
    editMatchPlayers: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired,

    match: PropTypes.shape({
      params: PropTypes.shape({
        competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
        tabKey: PropTypes.string, // tabKey == TeamCode
        view: PropTypes.oneOf(['main', 'matches', 'ranking', 'players', 'matchesTable', 'week']),
      }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
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
      const alreadyPicked = [];
      props.matches.forEach(match => {
        const formation = match.getPlayerFormation(this._getPlayerStatus());
        const matchPicked = formation.map(frm => ({...frm, matchId: match.id})).toArray();
        Array.prototype.push.apply(alreadyPicked, matchPicked);
      });
      return alreadyPicked;
    }
    return [];
  }

  getDefaultTeam() {
    if (this.props.user.playerId) {
      const yourTeams = this.props.user.getTeams().filter(team => team.competition === this.props.match.params.competition);
      if (yourTeams.length === 0) {
        return 'A';
      }
      if (yourTeams.length === 1) {
        return yourTeams[0].teamCode;
      }
      const notReserve = yourTeams.find(t => t.getPlayers('standard').some(p => p.player.id === this.props.user.playerId));
      return notReserve ? notReserve.teamCode : yourTeams[0].teamCode;
    }
    return 'A';
  }

  _isSmall() {
    return this.props.viewport.width < 700;
  }

  _getUrl(view) {
    let url = this.context.t.route('teams', {competition: this.props.match.params.competition});
    url += `/${this.props.match.params.tabKey || this.getDefaultTeam()}`;
    if (view !== 'main') {
      url += `/${view}`;
    }
    return url;
  }

  _renderTabContent(teamCode) {
    const team = this.props.teams.find(t => t.teamCode === teamCode && t.competition === this.props.match.params.competition);
    if (!team) {
      return null;
    }

    const transView = key => this.context.t(`teamCalendar.view.${key}`);
    let viewsConfig = ['main', 'week', 'matches', 'ranking', 'players'];
    if (this.props.user.playerId && this.props.viewport.width > 1000) {
      viewsConfig.splice(3, 0, 'matchesTable');
    }
    viewsConfig = viewsConfig.map(v => ({key: v, text: transView(v)}));

    const view = this.props.match.params.view || 'main';
    const {matches} = getFirstOrLastMatches(team.getMatches(), this.state.matchesFilter);
    return (
      <div>
        <div className="btn-toolbar" style={{padding: 10}}>
          <ButtonStack
            config={viewsConfig}
            small={this._isSmall()}
            activeView={view}
            onClick={newView => this.props.history.push(this._getUrl(newView))}
          />

          {view.startsWith('matches') && this.props.user.canEditMatchesOrIsCaptain() && matches.some(m => !m.isSyncedWithFrenoy) ? (
            <div className="pull-right" style={{marginLeft: 5}}>
              {this.state.editMode && view !== 'matches' ? (
                <div style={{display: 'inline'}}>
                  <button className="btn btn-danger" style={{marginRight: 5}} onClick={this._saveAndBlockAll.bind(this, true)}>
                    {this.context.t('match.plys.saveAndBlockAll')}
                  </button>
                  {this.props.user.canManageTeams() ? (
                    <SaveButton
                      onClick={this._saveAndBlockAll.bind(this, false)}
                      title={this.context.t('match.plys.tooltipSave')}
                      style={{marginRight: 5}}
                    />
                  ) : null}
                </div>
              ) : null}
              <EditButton
                onClick={() => this.setState({editMode: !this.state.editMode})}
                fa="fa-2x"
                title={this.context.t('match.plys.tooltipOpenForm')}
              />
            </div>
          ) : null}

          <div className="button-bar-right">
            <ExcelButton
              onClick={() => http.download.teamsExcel(this.context.t('teamCalendar.downloadExcelFileName'))}
              tooltip={this.context.t('teamCalendar.downloadExcel')}
            />
            <FrenoyButton team={team} linkTo="results" />
            <FrenoyButton team={team} linkTo="ranking" />
          </div>
        </div>
        {view !== 'week' ? <TeamHeader team={team} t={this.context.t} showRanking={!this._isSmall()} /> : null}
        {this._renderTabViewContent(team, matches)}
      </div>
    );
  }

  _getPlayerStatus() {
    return this.props.user.canManageTeams() ? 'Major' : 'Captain';
  }

  _saveAndBlockAll(majorBlock) {
    if (!this.state.tableMatches.length) {
      return;
    }

    _(this.state.tablePlayers)
      .filter(tb => this.state.tableMatches.indexOf(tb.matchId) !== -1)
      .groupBy('matchId')
      .forOwn((plyInfos, matchId) => {
        this.props.editMatchPlayers({
          matchId,
          playerIds: plyInfos.map(x => x.id),
          blockAlso: true,
          newStatus: !majorBlock ? 'Captain' : this._getPlayerStatus(),
        }, false)
        .catch(e => console.error('saveAndBlockAll', e)); // eslint-disable-line
      });
    this.setState({tableMatches: []});
  }

  _renderTabViewContent(team, matches) {
    switch (this.props.match.params.view) {
      case 'matches':
      case 'matchesTable':
        return (
          <div>
            <MatchesTable
              matches={matches}
              allowOpponentOnly
              striped
              editMode={this.state.editMode}

              tableForm={this.props.match.params.view === 'matchesTable'}
              team={team}
              tablePlayers={this.state.tablePlayers}
              onTablePlayerSelect={(plyInfos, match) => {
                this.setState({tablePlayers: plyInfos, tableMatches: this.state.tableMatches.concat([match.id])});
              }}
            />

            <SwitchBetweenFirstAndLastRoundButton setState={this.setState.bind(this)} matchesFilter={this.state.matchesFilter} t={this.context.t} />
          </div>
        );

      case 'ranking':
        return <DivisionRanking team={team} t={this.context.t} />;

      case 'players':
        return <PlayersCardGallery players={Immutable.List(team.getPlayers().map(x => x.player))} competition={team.competition} />;

      case 'week':
        return <TeamMatchesWeek team={team} />;

      case 'main':
      default:
        return <TeamOverview team={team} t={this.context.t} small={this._isSmall()} />;
    }
  }

  render() {
    const {t} = this.context;
    const tabConfig = this.props.teams.filter(team => team.competition === this.props.match.params.competition).toArray().map(team => ({
      key: team.teamCode,
      title: '',
      headerChildren: <TeamTabTitle team={team} showRanking={this._isSmall()} />,
    }));

    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <TabbedContainer
          match={this.props.match}
          defaultTabKey={this.getDefaultTeam()}
          tabKeys={tabConfig}
          tabRenderer={eventKey => this._renderTabContent(eventKey)}
          route={{base: t.route('teams', {competition: this.props.match.params.competition}), suffix: this.props.match.params.view}}
          widthTreshold={750}
        />
      </div>
    );
  }
}

export default withViewport(withRouter(connect(state => ({
  config: state.config,
  user: state.user,
  players: state.players,
  clubs: state.clubs,
  matches: state.matches,
  teams: state.teams,
}), {editMatchPlayers})(Teams)));
