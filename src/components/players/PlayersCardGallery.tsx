import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PropTypes, {withViewport} from '../PropTypes';
import PlayerImage from './PlayerImage';
import PlayerCard from './PlayerCard';
import {PlayerLink} from './controls/PlayerLink';

class PlayersCardGallery extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    viewport: PropTypes.viewport,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']),
  };

  render() {
    const {players} = this.props;
    const viewWidth = this.props.viewport.width;
    if (viewWidth > 360) {
      return (
        <div style={{marginTop: 15, marginLeft: 0, marginRight: 0, padding: 0}} className="row players-gallery">
          {players.map(player => (
            <div className="col-lg-4 col-sm-6" key={player.id}>
              <PlayerCard player={player} showSideBySide={viewWidth < 768 && viewWidth > 550} />
            </div>
          ))}
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
                <CardContent>
                  <h4>
                    <PlayerLink player={player} />
                    <small style={{marginLeft: 6}}>{comp.ranking}</small>
                    <br />
                    <small>
                      {player.style && player.style.name ? player.style.name : null}
                    </small>
                  </h4>
                  <PlayerImage playerId={player.id} center shape="thumbnail" />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withViewport(PlayersCardGallery);
