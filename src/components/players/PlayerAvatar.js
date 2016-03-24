import React, { PropTypes, Component } from 'react';
import PlayerModel from '../../models/PlayerModel.js';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

export default class PlayerAvatar extends Component {
  static propTypes = {
    player: PropTypes.instanceOf(PlayerModel).isRequired
  }

  render() {
    var {player, ...props} = this.props;
    return <Avatar {...props}>{player.alias[0]}</Avatar>;
  }
}