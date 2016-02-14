import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import PlayerModel from '../../../models/PlayerModel.js';
import MatchModel from '../../../models/MatchModel.js';
import UserModel from '../../../models/UserModel.js';

import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

import * as matchActions from '../../../actions/matchActions.js';

export default class SelectPlayersForm extends Component {
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.instanceOf(UserModel).isRequired,
  }

  render() {
    var team = this.props.match.getTeam();
    var reservePlayers = team.getPlayers('reserve');

    return (
      <div>
        <PlayerAvatarList players={team.getPlayers('standard')} match={this.props.match} />
        {reservePlayers.size ? <Divider /> : null}
        {reservePlayers.size ? <PlayerAvatarList players={reservePlayers} match={this.props.match} /> : null}
        <Divider />
      </div>
    );
  }
}

@connect(state => {
  return {
    matches: state.matches, // TODO: check how to connect the selectPlayer action only
  };
}, matchActions)
class PlayerAvatarList extends Component {
  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
      player: PropTypes.instanceOf(PlayerModel).isRequired,
      type: PropTypes.oneOf(['Standard', 'Captain', 'Reserve']).isRequired,
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
          return <PlayerAvatar player={player} select={this._onPlayerSelect.bind(this, player.id)} backgroundColor={color} key={player.id} />;
        })}
      </List>
    );
  }
  _onPlayerSelect(playerId) {
    this.props.selectPlayer(this.props.match.id, playerId);
  }
}



class PlayerAvatar extends Component {
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