import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import PlayerModel from '../../models/PlayerModel.js';
import MatchModel from '../../models/MatchModel.js';

import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Icon from '../controls/Icon.js';

import * as calendarActions from '../../actions/calendarActions.js';

@connect(state => {
  return {
    config: state.config,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
  };
}, calendarActions)
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
        {this.props.players.map(({player, type}) => (
          <ListItem key={player.id}
            leftAvatar={this._renderAvatar(player.alias[0])}
            onTouchTap={this._onPlayerSelect.bind(this, player.id)}>
            {player.alias}
          </ListItem>
        ))}
        <Divider />

      </List>
    );
  }
  _onPlayerSelect(playerId/*, e*/) {
    this.props.selectPlayer(this.props.match.id, playerId);
  }
  _renderAvatar(letter) {
    return <PlayerAvatar letter={letter} />;
  }
}

class PlayerAvatar extends Component {
  // static propTypes = {
  //   player: PropTypes.instanceOf(PlayerModel).isRequired
  // }

  render() {
    return <Avatar>{this.props.letter}</Avatar>;
    // var icon;
    // if (this.props.player.hasImage) {
    //   return <Avatar src={<PlayerImage ply={this.props.player} />} />;
    // }
    // icon = <Icon fa="fa fa-star" />;

    // return (
    //   <Avatar backgroundColor="#FFB00F" icon={icon} />
    // );
  }
}

const PlayerImage = ({ply}) => (
  <img src={'/img/players/' + ply.id + '.jpg'} />
);

