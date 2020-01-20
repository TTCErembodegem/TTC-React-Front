import React, {Component} from 'react';
import PropTypes from '../../PropTypes';
import {Email} from '../../controls/controls/Email';
import {Telephone} from '../../controls/controls/Telephone';
import {PlayerAddress} from './PlayerAddress';

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
