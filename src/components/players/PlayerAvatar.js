import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import PropTypes, {withTooltip} from '../PropTypes.js';

import {playerUtils} from '../../models/PlayerModel.js';
import {PlayerLink} from '../controls.js';

class PlayerAvatar extends Component {
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
  }

  constructor(props) {
    super(props);

    const img = new Image();
    img.onload = () => this.setState({isLoaded: true});
    img.src = playerUtils.getAvatarImageUrl(this.props.player.id);

    this.state = {
      isLoaded: false,
      img: img.src,
    };
  }

  render() {
    const {player, ...props} = this.props; // eslint-disable-line
    if (!this.state.isLoaded) {
      return (
        <PlayerLink player={player}>
          <Avatar {...props}>{player.alias[0]}</Avatar>
        </PlayerLink>
      );
    }

    return (
      <PlayerLink player={player}>
        <Avatar {...props} src={playerUtils.getAvatarImageUrl(player.id)} />
      </PlayerLink>
    );
  }
}

export default withTooltip(PlayerAvatar);
