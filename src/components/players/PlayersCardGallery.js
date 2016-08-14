import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';
import PlayerImage from './PlayerImage.js';
import PlayerCard from './PlayerCard.js';
import Card from 'material-ui/lib/card/card';

import PlayerModel from '../../models/PlayerModel.js';
import withViewport from '../../utils/decorators/withViewport.js';

@withViewport
export default class Players extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    viewport: PropTypes.viewport,
  };

  render() {
    const players = this.props.players;
    if (this.props.viewport.width > 450) {
      return (
        <div style={{marginLeft: 10, marginRight: 10}} className="row">
          {players.map(player => {
            return (
              <div className="col-lg-4 col-md-6" key={player.id} style={{paddingBottom: 10}}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div style={{marginLeft: 10, marginRight: 10}}>
        {players.map(player => {
          return (
            <div key={player.id} style={{paddingBottom: 10, textAlign: 'center'}}>
              <Card>
                <h4>{player.name}</h4>
                <PlayerImage playerId={player.id} center={true} />
                <br />
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}