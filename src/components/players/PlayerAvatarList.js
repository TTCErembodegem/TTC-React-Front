import React, { PropTypes, Component } from 'react';

import PlayerModel from '../../models/PlayerModel.js';

import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Icon from '../controls/Icon.js';

export default class PlayerAvatarList extends Component {
  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
      player: PropTypes.instanceOf(PlayerModel).isRequired,
      type: PropTypes.oneOf(['Standard', 'Captain', 'Reserve']).isRequired,
    })
  )}

  render() {
    return (
      <List>
        {this.props.players.map(({player, type}) => (
          <ListItem leftAvatar={<Avatar>{player.alias[0]}</Avatar>}>{player.alias}</ListItem>
        ))}
      </List>
    );
  }
}

class PlayerAvatar extends Component {
  // static propTypes = {
  //   player: PropTypes.instanceOf(PlayerModel).isRequired
  // }

  render() {
    // var icon;
    // if (this.props.player.hasImage) {
    //   return <Avatar src={<PlayerImage ply={this.props.player} />} />;
    // }
    // icon = <Icon fa="fa fa-star" />;

    return (
      <Avatar backgroundColor="#FFB00F" icon={icon} />
    );
  }
}

const PlayerImage = ({ply}) => (
  <img src={'/img/players/' + ply.id + '.jpg'} />
);

