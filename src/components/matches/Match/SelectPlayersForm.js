import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import PlayerModel from '../../../models/PlayerModel.js';
import MatchModel from '../../../models/MatchModel.js';
import UserModel from '../../../models/UserModel.js';

import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

import PlayerAutoComplete from '../../players/PlayerAutoComplete.js';

import * as matchActions from '../../../actions/matchActions.js';

@connect(state => {
  return {
    players: state.players,
  };
}, matchActions)
export default class SelectPlayersForm extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.instanceOf(UserModel).isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  render() {
    var team = this.props.match.getTeam();
    var reservePlayers = team.getPlayers('reserve');

    // Add one time team players
    var selectedFromTeam = team.getPlayers().map(ply => ply.player.id);
    var otherSelectedPlayers = this.props.match.getOwnPlayerModels()
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
      player: PropTypes.instanceOf(PlayerModel).isRequired,
      type: PropTypes.oneOf(['Standard', 'Captain', 'Reserve', 'Invaller']).isRequired,
    })),
    match: PropTypes.instanceOf(MatchModel).isRequired,
    selectPlayer: PropTypes.func.isRequired
  }

  render() {
    return (
      <List>
        {this.props.players.map(({player, type}) => {
          var color;
          if (this.props.match.plays(player)) {
            color = '#FFB00F';
          }
          return <SelectablePlayerAvatar player={player} select={this._onPlayerSelect.bind(this, player.id)} backgroundColor={color} key={player.id} />;
        })}
      </List>
    );
  }
  _onPlayerSelect(playerId) {
    this.props.selectPlayer(this.props.match.id, playerId);
  }
}

class SelectablePlayerAvatar extends Component {
  static propTypes = {
    player: PropTypes.instanceOf(PlayerModel).isRequired,
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
        secondaryText={player.contact.mobile} />
    );
  }
  _renderAvatar(player) {
    return <Avatar backgroundColor={this.props.backgroundColor}>{player.alias[0]}</Avatar>;
  }
}