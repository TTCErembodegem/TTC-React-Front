import React, { Component } from 'react';
import PropTypes, { connect } from '../../PropTypes.js';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import PlayerAutoComplete from '../../players/PlayerAutoComplete.js';
import PlayerAvatar from '../../players/PlayerAvatar.js';

import * as matchActions from '../../../actions/matchActions.js';
import { displayFormat } from '../../controls/Telephone.js';
import { getPlayingStatusColor } from '../../../models/PlayerModel.js';

@connect(state => {
  return {
    players: state.players,
  };
}, matchActions)
export default class SelectPlayersForm extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    match: PropTypes.MatchModel.isRequired,
    user: PropTypes.UserModel.isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  render() {
    const team = this.props.match.getTeam();
    var reservePlayers = team.getPlayers('reserve');

    // Add one time team players
    const selectedFromTeam = team.getPlayers().map(ply => ply.player.id);
    const otherSelectedPlayers = this.props.match.getOwnPlayerModels('onlyFinal')
      .filter(ply => selectedFromTeam.indexOf(ply.id) === -1)
      .map(ply => ({
        player: ply,
        type: 'Invaller'
      }));
    reservePlayers = reservePlayers.concat(otherSelectedPlayers.toArray());

    return (
      <div>
        <PlayerAvatarList players={team.getPlayers('standard')} match={this.props.match} selectPlayer={this.props.selectPlayer} />
        {reservePlayers.length ? <Divider /> : null}
        {reservePlayers.length ? <PlayerAvatarList players={reservePlayers} match={this.props.match} selectPlayer={this.props.selectPlayer} /> : null}
        <Divider />
        <PlayerAutoComplete
          selectPlayer={this.props.selectPlayer.bind(this, this.props.match.id)}
          style={{marginLeft: 10}}
          hintText={this.context.t('match.chooseOtherPlayer')} />
      </div>
    );
  }
}


class PlayerAvatarList extends Component {
  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
      player: PropTypes.PlayerModel.isRequired,
      type: PropTypes.oneOf(['Standard', 'Captain', 'Reserve', 'Invaller']).isRequired,
    })),
    match: PropTypes.MatchModel.isRequired,
    selectPlayer: PropTypes.func.isRequired
  }

  render() {
    return (
      <List>
        {this.props.players.map(({player/*, type*/}) => {
          return (
            <SelectableMatchPlayerAvatar
              player={player}
              select={this._onPlayerSelect.bind(this, player.id)}
              match={this.props.match}
              key={player.id} />
          );
        })}
      </List>
    );
  }
  _onPlayerSelect(playerId) {
    this.props.selectPlayer(this.props.match.id, playerId, this.props.match.block || 'Captain');
  }
}

const SelectableMatchPlayerAvatar = ({match, player, select}) => {
  const matchPlayer = match.plays(player, 'onlyFinal');
  const color = getPlayingStatusColor(matchPlayer);
  if (select) {
    return (
      <SelectablePlayerAvatar
        player={player}
        select={select}
        backgroundColor={color} />
    );
  }
  return (
    <PlayerAvatar
      player={player}
      backgroundColor={color} />
  );
};

class SelectablePlayerAvatar extends Component {
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
    select: PropTypes.func.isRequired,
    backgroundColor: PropTypes.string,
  }

  render() {
    var player = this.props.player;
    return (
      <ListItem
        leftAvatar={this._renderAvatar(player)}
        onTouchTap={this.props.select}
        primaryText={player.alias}
        secondaryText={displayFormat(player.contact.mobile)} />
    );
  }
  _renderAvatar(player) {
    return <Avatar backgroundColor={this.props.backgroundColor}>{player.alias[0]}</Avatar>;
  }
}