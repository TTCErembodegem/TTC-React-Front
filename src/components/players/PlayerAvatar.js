import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';

import { playerUtils } from '../../models/PlayerModel.js';
import Avatar from 'material-ui/lib/avatar';

export default class PlayerAvatar extends Component {
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired
  }

  constructor(props) {
    super(props);

    var img = new Image();
    img.onload = () => this.setState({isLoaded: true});
    img.src = playerUtils.getAvatarImageUrl(this.props.player.id);

    this.state = {
      isLoaded: false,
      img: img.src,
    };
  }

  render() {
    var {player, ...props} = this.props;

    if (!this.state.isLoaded) {
      return <Avatar {...props}>{player.alias[0]}</Avatar>;
    }
    return <Avatar src={playerUtils.getAvatarImageUrl(player.id)} />;
  }
}