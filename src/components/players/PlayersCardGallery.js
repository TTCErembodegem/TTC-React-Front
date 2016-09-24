import React, { Component } from 'react';
import PropTypes, { withViewport, contextTypes } from '../PropTypes.js';
import PlayerImage from './PlayerImage.js';
import PlayerCard from './PlayerCard.js';
import { Card, CardText } from 'material-ui/Card';

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
                <PlayerCard id={player.id} name={player.name} alias={player.alias} contact={player.contact}>
                  {player.vttl || player.sporta ? <PlayerCard.Competition player={player} t={this.context.t} /> : null}
                </PlayerCard>
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
                <CardText>
                  <h4>{player.name}</h4>
                  <PlayerImage playerId={player.id} center />
                  <br />
                </CardText>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}
