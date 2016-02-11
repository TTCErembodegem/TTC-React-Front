import React, { PropTypes, Component} from 'react';
import PlayerModel from '../../models/PlayerModel.js';

import PlayerAvatarList from './PlayerAvatarList.js';

export default class PlayerCard extends Component {
  static propTypes = {
    player: PropTypes.instanceOf(PlayerModel).isRequired,
    type: PropTypes.oneOf(['Standard', 'Captain', 'Reserve']).isRequired,
  }

  render() {
    return (
      <div>
        <PlayerAvatarList player={this.props.player} />
      </div>
    );
  }
}



// GridList?
// bootstrap thumbnails?

