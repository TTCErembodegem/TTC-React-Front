import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import {Email, Telephone, PlayerAddress} from '../../controls.js';

export class PlayerContact extends Component {
  // static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
  };

  render() {
    const {player, ...props} = this.props;
    return (
      <div {...props}>
        <Email email={player.contact.email} showIcon />
        <br />
        <Telephone player={player} style={{marginTop: 5}} />
        <PlayerAddress contact={player.contact} style={{marginTop: 5}} />
      </div>
    );
  }
}
