import React, {Component} from 'react';
import PropTypes, {withViewport} from '../PropTypes.js';
import PlayerImage from './PlayerImage.js';
import PlayerCard from './PlayerCard.js';
import {Card, CardText} from 'material-ui/Card';

@withViewport
export default class PlayersCardGallery extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    viewport: PropTypes.viewport,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']),
  };

  render() {
    const players = this.props.players;
    if (this.props.viewport.width > 360) {
      return (
        <div style={{margin: 0, padding: 0}} className="row players-gallery">
          {players.map(player => {
            return (
              <div className="col-lg-4 col-sm-6" key={player.id}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
        {players.map(player => {
          const comp = player.getCompetition(this.props.competition);
          return (
            <div key={player.id} style={{paddingBottom: 10, textAlign: 'center'}}>
              <Card>
                <CardText>
                  <h4>
                    {player.name}
                    <small style={{marginLeft: 6}}>{comp.ranking}</small>
                    <br />
                    <small>
                      {player.style && player.style.name ? player.style.name : null}
                    </small>
                  </h4>
                  <PlayerImage playerId={player.id} center />
                </CardText>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}
