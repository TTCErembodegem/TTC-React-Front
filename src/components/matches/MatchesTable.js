import React, { Component } from 'react';
import PropTypes, { connect, withViewport, browserHistory } from '../PropTypes.js';
import { getPlayingStatusClass, getPlayingStatusColor } from '../../models/PlayerModel.js';
import { util as storeUtil } from '../../store.js';
import _ from 'lodash';

import { editMatchPlayers } from '../../actions/matchActions.js';

import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';

import Icon from '../controls/Icon.js';
import MatchVs from './Match/MatchVs.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import { TeamCaptainIcon } from '../players/PlayerCard.js';
import { PlayerCompetitionBadge, PlayerCompetitionButton } from '../players/PlayerBadges.js';

function isPickedForMatch(status) {
  return status === 'Play' || status === 'Captain' || status === 'Major';
}

@withViewport
@connect(state => ({}), {editMatchPlayers})
export default class MatchesTable extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    allowOpponentOnly: PropTypes.bool, // Allow "MatchVs" to display just against whom on small devices
    viewport: PropTypes.viewport,
    user: PropTypes.UserModel.isRequired,
    editMode: PropTypes.bool,
    editMatchPlayers: PropTypes.func.isRequired,

    tableForm: PropTypes.bool,
    team: PropTypes.TeamModel,
    onTablePlayerSelect: PropTypes.func,
    tablePlayers: PropTypes.array,
  }
  static defaultProps = {
    allowOpponentOnly: false,
    editMode: false,
    tableForm: false,
  }
  constructor(props) {
    super(props);
    this.state = {editMatch: {}, players: []};
  }

  _renderMatchPlayers(match) {
    const players = match.getPlayerFormation();
    return (
      <div style={{marginBottom: 4, marginTop: -5}}>
        {players.map(plyInfo => <PlayerCompetitionBadge plyInfo={plyInfo} competition={match.competition} style={{marginRight: 5}} />)}
      </div>
    );
  }

  _getTablePlayers() {
    // Matches the sorting with the Excel output (which happens on the backend)
    return _.sortBy(this.props.team.getPlayers(), ply => (ply.type === 'Reserve' ? '1' : '0') + ply.player.alias);
  }
  _getTablePlayerHeaders() {
    if (!this.props.team) {
      return [];
    }
    return this._getTablePlayers()
    .map(ply => (
      <th key={ply.player.id}>
        {ply.type === 'Captain' ? <TeamCaptainIcon t={this.context.t} /> : null}
        <span style={{fontStyle: ply.type === 'Reserve' ? 'italic' : undefined}}>{ply.player.alias}</span>
      </th>
    ));
  }
  _renderTableEditMatchPlayers(match) {
    const majorFormation = match.getPlayerFormation();
    if (!this.props.editMode) {
      return this._getTablePlayers()
      .map((ply, index) => {
        const playerDecision = majorFormation.find(frm => frm.id === ply.player.id);
        return (
          <td key={ply.player.id} className={getPlayingStatusClass(playerDecision ? playerDecision.matchPlayer.status : '')}>&nbsp;</td>
        );
      });
    }

    const formation = match.getPlayerFormation('Play');
    return this._getTablePlayers()
    .map((plyInfo, index) => {
      var playerDecision = formation.find(frm => frm.id === plyInfo.player.id);
      const majorDecision = majorFormation.find(frm => frm.id === plyInfo.player.id);
      if (!this.props.user.canEditMatchPlayers(match)) {
        return (
          <td style={{textAlign: 'center'}} key={plyInfo.player.id} className={getPlayingStatusClass(playerDecision ? playerDecision.matchPlayer.status : '')}>
            {majorDecision ? <PlayerCompetitionBadge plyInfo={majorDecision} /> : null}
          </td>
        );
      }

      var captainDecision = this.props.tablePlayers.find(frm => frm.matchId === match.id && frm.id === plyInfo.player.id);
      if (!captainDecision) {
        captainDecision = {
          id: plyInfo.player.id,
          matchPlayer: {status: ''},
          player: plyInfo.player
        };
      }
      const onButtonClick = this._toggleTablePlayer.bind(this, plyInfo.player.id, match);
      return (
        <td style={{textAlign: 'center'}} key={plyInfo.player.id} className={getPlayingStatusClass(playerDecision ? playerDecision.matchPlayer.status : '')}>
          <PlayerCompetitionButton
            plyInfo={captainDecision}
            isPicked={!!captainDecision.matchPlayer.status}
            actionIconClass="fa fa-thumbs-o-up"
            onButtonClick={onButtonClick} />
        </td>
      );
    });
  }

  _renderEditMatchPlayers() {
    const match = this.state.editMatch;
    return (
      <div style={{marginBottom: 4, marginTop: -30}}>
        <h4>{this.context.t('match.plys.choiceCaptain')}</h4>
        {this.state.playersEdit.map(plyInfo => (
          <PlayerCompetitionButton
            plyInfo={plyInfo}
            isPicked={isPickedForMatch(plyInfo.matchPlayer.status)}
            actionIconClass="fa fa-trash-o"
            onButtonClick={this._togglePlayer.bind(this, plyInfo.player.id)}
            competition={match.competition}
            style={{marginRight: 5}} />
        ))}

        <h4>{this.context.t('match.plys.choicePlayers')}</h4>
        {this.state.players.map(plyInfo => (
          <PlayerCompetitionButton
            plyInfo={plyInfo}
            isPicked={!!this.state.playersEdit.find(x => x.id === plyInfo.id)}
            actionIconClass="fa fa-thumbs-o-up"
            onButtonClick={this._togglePlayer.bind(this, plyInfo.player.id)}
            style={{marginRight: 5}} />
        ))}

        <br />
        <PlayerAutoComplete
          clearOnSelect
          selectPlayer={playerId => this._togglePlayer(playerId)}
          hintText={this.context.t('match.chooseOtherPlayer')}
          competition={match.competition}
        />
      </div>
    );
  }
  _onOpenEditMatchForm(match) {
    const team = match.getTeam();
    const userStatus = this._getUserStatus(match);

    const toDontKnowPlayer = teamPlayer => ({
      id: teamPlayer.player.id,
      player: teamPlayer.player,
      matchPlayer: {status: 'DontKnow'}
    });

    const playerChoices = match.getPlayerFormation('Play');
    const playerChoicesPlayerIds = playerChoices.map(x => x.player.id);
    const playersWithoutChoice = team.getPlayers().filter(x => playerChoicesPlayerIds.indexOf(x.player.id) === -1);

    var playersEdit = match.getPlayerFormation(userStatus);
    if (playersEdit.size === 0) {
      if (userStatus === 'Major') {
        playersEdit = match.getPlayerFormation('Captain');
      }
      if (playersEdit.size === 0) {
        playersEdit = playerChoices.filter(x => x.matchPlayer.status === 'Play');
      }
    }

    this.setState({
      editMatch: match,
      players: playerChoices.concat(playersWithoutChoice.map(toDontKnowPlayer)),
      playersEdit: playersEdit,
    });
  }
  _toggleTablePlayer(playerId, match) {
    const ply = this.props.tablePlayers.find(x => x.id === playerId && x.matchId === match.id);
    if (ply) {
      this.props.onTablePlayerSelect(this.props.tablePlayers.filter(x => x !== ply), match);

    } else {
      const team = match.getTeam();
      const plyInfo = {
        id: playerId,
        matchId: match.id,
        player: storeUtil.getPlayer(playerId),
        matchPlayer: {status: this._getUserStatus(match)}
      };
      this.props.onTablePlayerSelect(this.props.tablePlayers.concat([plyInfo]), match);
    }
  }
  _togglePlayer(playerId) {
    const ply = this.state.playersEdit.find(x => x.id === playerId);
    if (ply) {
      this.setState({playersEdit: this.state.playersEdit.filter(x => x !== ply)});

    } else {
      const team = this.state.editMatch.getTeam();
      const plyInfo = {
        id: playerId,
        player: storeUtil.getPlayer(playerId),
        matchPlayer: {status: this._getUserStatus(this.state.editMatch)}
      };
      this.setState({playersEdit: this.state.playersEdit.concat([plyInfo])});
    }
  }
  _saveFormation({blockAlso, closeForm}) {
    this.props.editMatchPlayers({
      matchId: this.state.editMatch.id,
      playerIds: this.state.playersEdit.map(x => x.id).toArray(),
      blockAlso: blockAlso,
      newStatus: this._getUserStatus(this.state.editMatch)
    });

    if (closeForm) {
      this.setState({editMatch: {}, players: [], playersEdit: []});
    }
  }

  _isCaptain(match) {
    const team = match.getTeam();
    return team.isCaptain(this.props.user.getPlayer());
  }
  _getUserStatus(match) {
    return this._isCaptain(match) ? 'Captain' : 'Major';
  }

  render() {
    const t = this.context.t;
    const matchRows = [];

    this.props.matches.forEach((match, i) => {
      const stripeColor = {backgroundColor: i % 2 === 0 && !this.props.tableForm ? '#f9f9f9' : undefined};
      const displayVictoryIcon = match.scoreType === 'Won';
      const score = match.renderScore();

      var thrillerIcon;
      const team = match.getTeam();
      if (team.getThriller(match)) {
        thrillerIcon = (
          <Icon
            fa="fa fa-heartbeat faa-pulse animated"
            style={{marginLeft: 3, marginRight: 7, marginTop: 3, color: 'red'}}
          />
        );
      }

      // Complexity galore
      matchRows.push(
        <tr key={match.id} style={stripeColor}>
          <td>
            {displayVictoryIcon ? <Icon fa="fa fa-trophy" color="#FCB514" style={{marginRight: 5}} /> : null}
            {thrillerIcon}
            {t('match.date', match.getDisplayDate())}
          </td>
          <td className="hidden-xs">{match.frenoyMatchId}</td>
          <td><MatchVs match={match} opponentOnly={this.props.allowOpponentOnly && this.props.viewport.width < 450} /></td>
          {this.props.tableForm ? null : (<td>
            {!this.props.editMode || match.isSyncedWithFrenoy ? (
              <button className="btn btn-default" onClick={() => browserHistory.push(t.route('match', {matchId: match.id}))}>
                {score || t('match.details')}
              </button>

            ) : this.state.editMatch.id !== match.id && this.props.user.canEditMatchPlayers(match) ? (
              <button
                onClick={this._onOpenEditMatchForm.bind(this, match)}
                className="btn btn-default pull-right"
                style={{marginRight: 5}}
                title={t('match.plys.tooltipOpenForm')}
              >
                <span className="fa-stack fa-sm">
                  {!match.block ? (
                    <Icon fa="fa fa-pencil-square-o fa-stack-1x" />
                  ) : (
                    <span>
                      <Icon fa="fa fa-anchor fa-stack-1x" />
                      <Icon fa="fa fa-ban fa-stack-2x text-danger" />
                    </span>
                  )}
                </span>
              </button>

            ) : this.state.editMatch.id !== match.id ? (
              <span className="fa-stack fa-sm pull-right" style={{marginRight: 8, marginTop: 5}}>
                <Icon fa="fa fa-pencil-square-o fa-stack-1x" />
                <Icon fa="fa fa-ban fa-stack-2x text-danger" />
              </span>

            ) : (
              <div className="pull-right" style={{whiteSpace: 'nowrap'}}>
                <button
                  className={'btn btn-default ' + (this.state.playersEdit.size !== team.getTeamPlayerCount() ? 'disabled' : '')}
                  onClick={this._saveFormation.bind(this, {blockAlso: true, closeForm: true})}
                  style={{marginRight: 5}}
                  title={t('match.plys.tooltipSaveAndBlock')}
                >

                  <Icon fa="fa fa-anchor" />
                </button>

                <button
                  className="btn btn-default"
                  onClick={this._saveFormation.bind(this, {blockAlso: false, closeForm: true})}
                  title={t('match.plys.tooltipSave')}
                >
                  <Icon fa="fa fa-floppy-o" />
                </button>
              </div>
            )}
          </td>)}
          {this.props.tableForm ? this._renderTableEditMatchPlayers(match) : null}
        </tr>
      );

      if (!this.props.tableForm) {
        if (this.props.editMode && this.state.editMatch.id === match.id && this.props.user.canEditMatchPlayers(match)) {
          matchRows.push(
            <tr key={match.id + '_b'} style={stripeColor}>
              <td colSpan={4} style={{border: 'none'}}>
                {this._renderEditMatchPlayers()}
              </td>
            </tr>
          );

        } else if (match.players.size) {
          matchRows.push(
            <tr key={match.id + '_b'} style={stripeColor}>
              <td colSpan={4} style={{border: 'none'}}>
                {this._renderMatchPlayers(match)}
              </td>
            </tr>
          );
        }
      }
    });

    return (
      <Table condensed>
        <thead>
          <tr>
            <th>{t('common.date')}</th>
            <th className="hidden-xs">{t('common.frenoy')}</th>
            <th>{t('teamCalendar.match')}</th>
            {!this.props.tableForm ? <th>{this.props.editMode ? t('match.plys.blockMatchTitle') : t('teamCalendar.score')}</th> : null}
            {this.props.tableForm ? this._getTablePlayerHeaders() : null}
          </tr>
        </thead>
        <tbody>
          {matchRows}
          {this.props.tableForm && this.props.editMode ? (
            <tr>
              <td colSpan={3}>&nbsp;</td>
              {this._getTablePlayers().map((ply, index) => {
                const played = this.props.matches.filter(match => match.players.find(mp => mp.playerId === ply.player.id && mp.status === match.block))
                return (
                  <td key={ply.player.id} style={{textAlign: 'center', fontWeight: 'bold'}}>{played.size}</td>
                );
              })}
            </tr>
          ) : null}
        </tbody>
      </Table>
    );
  }
}