import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import PlayerModel from '../../models/PlayerModel.js';
import MatchModel from '../../models/MatchModel.js';

import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Icon from '../controls/Icon.js';

import * as matchActions from '../../actions/matchActions.js';

@connect(state => {
  return {
    config: state.config,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
}, matchActions)
export default class PlayerAvatarList extends Component {
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
        <Divider />

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
  }

  render() {
    var player = this.props.player;
    return (
      <ListItem
        leftAvatar={this._renderAvatar(player)}
        onTouchTap={this.props.select}>
        {player.alias}
      </ListItem>
    );
    //return <Avatar>{this.props.letter}</Avatar>;
    // var icon;
    // if (this.props.player.hasImage) {
    //   return <Avatar src={<PlayerImage ply={this.props.player} />} />;
    // }
    // icon = <Icon fa="fa fa-star" />;

    // return (
    //   <Avatar backgroundColor="#FFB00F" icon={icon} />
    // );
  }
  _renderAvatar(player) {
    return <Avatar backgroundColor={this.props.backgroundColor}>{player.alias[0]}</Avatar>;
  }
}

const PlayerImage = ({ply}) => (
  <img src={'/img/players/' + ply.id + '.jpg'} />
);

