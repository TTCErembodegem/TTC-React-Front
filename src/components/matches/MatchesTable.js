import React, {Component} from 'react';
import PropTypes, {connect, withViewport, storeUtil} from '../PropTypes.js';
import {getPlayingStatusClass} from '../../models/PlayerModel.js';
import _ from 'lodash';

import {editMatchPlayers} from '../../actions/matchActions.js';

import Table from 'react-bootstrap/lib/Table';
import FormControl from 'react-bootstrap/lib/FormControl';
import {ThrillerIcon, FrenoyWeekLink} from '../controls.js';
import MatchVs from './Match/MatchVs.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import {TeamCaptainIcon} from '../players/PlayerCard.js';
import {PlayerCompetitionBadge, PlayerCompetitionButton} from '../players/PlayerBadges.js';
import OwnPlayer from './Match/OwnPlayer.js';
import {CannotEditMatchIcon, SaveMatchButtons, ViewMatchDetailsButton, MatchDate, OpenMatchForEditButton} from './controls/index.js';

function isPickedForMatch(status) {
  return status === 'Play' || status === 'Captain' || status === 'Major';
}


@withViewport
@connect(state => ({user: state.user}), {editMatchPlayers})
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
    striped: PropTypes.bool,
    ownTeamLink: PropTypes.oneOf(['main', 'matches', 'ranking', 'players', 'matchesTable', 'week']),
  }
  static defaultProps = {
    allowOpponentOnly: false,
    editMode: false,
    tableForm: false,
    striped: false,
  }
  constructor(props) {
    super(props);
    this.state = {editMatch: {}, players: [], comment: {}};
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
    //console.log('--------------------------------');
    const majorFormation = match.getPlayerFormation();
    if (!this.props.editMode) {
      return this._getTablePlayers()
        .map(ply => {
          const playerDecision = majorFormation.find(frm => frm.id === ply.player.id);
          //if (playerDecision)
          //  console.log(match.frenoyMatchId, playerDecision.player.alias, playerDecision.matchPlayer.status);
          return (
            <td key={ply.player.id} className={getPlayingStatusClass(playerDecision ? playerDecision.matchPlayer.status : '')}>&nbsp;</td>
          );
        });
    }

    const formation = match.getPlayerFormation('Play');
    return this._getTablePlayers()
      .map(plyInfo => {
        var playerDecision = formation.find(frm => frm.id === plyInfo.player.id);
        const majorDecision = majorFormation.find(frm => frm.id === plyInfo.player.id);
        if (!this.props.user.canEditMatchPlayers(match)) {
          return (
            <td
              style={{textAlign: 'center'}}
              key={plyInfo.player.id} className={getPlayingStatusClass(playerDecision ? playerDecision.matchPlayer.status : '')}
            >
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

        // TODO: oh god... :)
        // Zie problem: als Major gedeeltelijke Captain/Major table:
        // --> Momenteel zie je als Major enkel de Captains bij non-edit
        // --> In edit mode: een anchor icon om aan te geven dat kapitein dat gekozen heeft?

        // --> Different logins: Major, Captain, Member
        // --> Member can see Edit buttons but can then not change anything
        // --> Non edit view with backgroundColors is no good: use the badges instead
        // --> The count at the bottom are incorrect: they count only captain, not major???
        // --> Add anchor before the table

        // --> This'll be for next season? :)

        const onButtonClick = this._toggleTablePlayer.bind(this, plyInfo.player.id, match);
        return (
          <td
            style={{textAlign: 'center'}}
            key={plyInfo.player.id}
            className={getPlayingStatusClass(playerDecision ? playerDecision.matchPlayer.status : '')}
          >
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
            style={{marginRight: 5}}
            key={plyInfo.player.id}
          />
        ))}

        <h4>{this.context.t('match.plys.choicePlayers')}</h4>
        {this.state.players.map(plyInfo => (
          <PlayerCompetitionButton
            plyInfo={plyInfo}
            isPicked={!!this.state.playersEdit.find(x => x.id === plyInfo.id)}
            actionIconClass="fa fa-thumbs-o-up"
            onButtonClick={this._togglePlayer.bind(this, plyInfo.player.id)}
            style={{marginRight: 5}}
            key={plyInfo.player.id}
          />
        ))}

        <br />
        <PlayerAutoComplete
          clearOnSelect
          selectPlayer={playerId => this._togglePlayer(playerId)}
          placeholder={this.context.t('match.chooseOtherPlayer')}
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
      comment: {value: match.formationComment || ''},
      edit: false,
    });
  }
  _toggleTablePlayer(playerId, match) {
    const ply = this.props.tablePlayers.find(x => x.id === playerId && x.matchId === match.id);
    if (ply) {
      this.props.onTablePlayerSelect(this.props.tablePlayers.filter(x => x !== ply), match);

    } else {
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
      newStatus: this._getUserStatus(this.state.editMatch),
      comment: this.state.comment.value,
    });

    if (closeForm) {
      this.setState({editMatch: {}, players: [], playersEdit: []});
    }
  }

  _getUserStatus(match) { // eslint-disable-line
    return this.props.user.canManageTeams() ? 'Major' : 'Captain';
  }

  render() {
    const t = this.context.t;
    const matchRows = [];

    const viewWidth = this.props.viewport.width;
    const showDate = viewWidth > 350 || this.props.matches.some(match => !match.isSyncedWithFrenoy);

    this.props.matches.forEach((match, i) => {
      var stripeColor = {backgroundColor: i % 2 === 0 && !this.props.tableForm ? '#f9f9f9' : undefined};
      if (this.props.user.playerId && !this.props.striped) {
        stripeColor.backgroundColor = match.plays(this.props.user.playerId) || match.getTeam().plays(this.props.user.playerId) ? '#f9f9f9' : undefined; // eslint-disable-line
      }

      var thrillerIcon;
      if (match.shouldBePlayed) {
        const team = match.getTeam();
        if (team.getThriller(match)) {
          thrillerIcon = <ThrillerIcon color="red" />;
        }
      }

      // Complexity galore
      matchRows.push(
        <tr key={match.id} style={stripeColor}>
          {showDate ? (
            <td>
              {thrillerIcon}
              {match.shouldBePlayed ? <MatchDate match={match} /> : null}
            </td>
          ) : null}
          <td className="hidden-xs"><FrenoyWeekLink match={match} /></td>
          <td>
            <MatchVs
              match={match}
              opponentOnly={this.props.allowOpponentOnly && viewWidth < 450}
              ownTeamLink={this.props.ownTeamLink}
              withLinks
              withPosition={viewWidth > 400}
            />
          </td>
          {this.props.tableForm ? null : (<td>
            {!this.props.editMode || match.isSyncedWithFrenoy ? (
              <ViewMatchDetailsButton match={match} size={viewWidth < 450 ? 'xs' : null} />

            ) : !this.props.user.canEditMatchPlayers(match) ? (
              <CannotEditMatchIcon />

            ) : this.state.editMatch.id !== match.id ? (
              <OpenMatchForEditButton onClick={this._onOpenEditMatchForm.bind(this, match)} match={match} t={t} />

            ) : (
              <SaveMatchButtons
                onSave={this._saveFormation.bind(this, {blockAlso: false, closeForm: true})}
                onBlock={this._saveFormation.bind(this, {blockAlso: true, closeForm: true})}
                onCommentsToggle={() => this.setState({comment: Object.assign({}, this.state.comment, {edit: !this.state.comment.edit})})}
                t={t}
              />
            )}
          </td>)}
          {this.props.tableForm ? this._renderTableEditMatchPlayers(match) : null}
        </tr>
      );

      // Match formation comments row
      if (!this.props.tableForm && this.props.editMode && this.props.user.canEditMatchPlayers(match) &&
        (this.state.editMatch.id === match.id || match.formationComment)) {
        matchRows.push(
          <tr key={match.id + '_b'} style={stripeColor}>
            <td colSpan={4} style={{border: 'none'}}>
              {this.state.editMatch.id === match.id ? (
                <CommentForm model={this.state.comment} onUpdate={model => this.setState({comment: model})} t={this.context.t} />
              ) : (
                <i>{match.formationComment}</i>
              )}
            </td>
          </tr>
        );
      }

      // Display the players of the match (non TableForm)
      const isMatchInEdit = this.props.editMode && this.state.editMatch.id === match.id && this.props.user.canEditMatchPlayers(match);
      if (!this.props.tableForm && (isMatchInEdit || match.block || match.isSyncedWithFrenoy)) {
        matchRows.push(
          <tr key={match.id + '_c'} style={stripeColor}>
            <td colSpan={4} style={{border: 'none'}}>
              {isMatchInEdit ? this._renderEditMatchPlayers() : <ReadOnlyMatchPlayers match={match} />}
            </td>
          </tr>
        );
      }
    });

    return (
      <Table>
        <thead>
          <tr>
            {showDate ? <th>{t('common.date')}</th> : null}
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
              {this._getTablePlayers().map(ply => {
                const played = this.props.matches.filter(match => this.props.tablePlayers.find(frm => frm.matchId === match.id && frm.id === ply.player.id)); // eslint-disable-line
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

const ReadOnlyMatchPlayers = ({match}) => {
  if (match.isSyncedWithFrenoy) {
    return (
      <div style={{marginBottom: 4, marginTop: -5}}>
        {match.getOwnPlayers().map(ply => (
          <div style={{display: 'inline-block', marginRight: 7}} key={ply.uniqueIndex}>
            <OwnPlayer match={match} ply={ply} />
          </div>
        ))}
      </div>
    );
  }

  const players = match.getPlayerFormation();
  return (
    <div style={{marginBottom: 4, marginTop: -5}}>
      {players.map(plyInfo => (
        <PlayerCompetitionBadge
          plyInfo={plyInfo}
          competition={match.competition}
          style={{marginBottom: 4, marginRight: 5}}
          key={plyInfo.player.id}
        />
      ))}
    </div>
  );
};

ReadOnlyMatchPlayers.propTypes = {
  match: PropTypes.MatchModel.isRequired,
};

// const MatchBlockIcon = ({match, t}) => (
//   <Icon fa="fa fa-anchor" tooltip={t('match.block.' + match.block)} style={{marginRight: 8}} color={match.block !== 'Major' ? 'gray' : null} />
// );


var CommentForm = ({model, onUpdate, t}) => {
  return (
    <div style={{width: '50%', marginTop: -20, marginBottom: 15}}>
      {model.edit ? (
        <FormControl
          type="text"
          value={model.value}
          placeholder={t('match.plys.extraComment')}
          onChange={e => onUpdate(Object.assign({}, model, {value: e.target.value}))}
        />
      ) : <i>{model.value}</i>}
    </div>
  );
};

CommentForm.propTypes = {
  model: PropTypes.any,
  onUpdate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
