import React, { PropTypes, Component } from 'react';
import { contextTypes } from '../../utils/decorators/withContext.js';
import PlayerModel, { createFrenoyLink } from '../../models/PlayerModel.js';

// import Card from 'material-ui/lib/card/card';
// import CardHeader from 'material-ui/lib/card/card-header';
// import CardText from 'material-ui/lib/card/card-text';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

import Telephone from '../controls/Telephone.js';
import PlayerImage from './PlayerImage.js';

export default class PlayerCard extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    player: PropTypes.instanceOf(PlayerModel).isRequired,
  };

  render() {
    const player = this.props.player;
    const cardWidth = 350;
    return (
      <Card style={{width: cardWidth, height: 256}}>
        <div style={{float: 'left'}}>
          <PlayerImage playerId={player.id} center={false} />
        </div>
        <div style={{float: 'left', marginLeft: 6, width: cardWidth - 208}}>
          <h4 style={{marginBottom: 0}}>{player.name.length > 15 ? player.alias : player.name}</h4>
          <Telephone number={player.contact.mobile} hideIcon />

          {player.vttl || player.sporta ? (
            <div style={{marginTop: 5}}>
              <strong>{this.context.t('common.competition')}</strong>
              <br />
              <PlayerCompetition comp="Vttl" player={player} />
              {player.vttl && player.sporta  ? <br /> : null}
              <PlayerCompetition comp="Sporta" player={player} />
            </div>
          ) : null}

          {player.contact.address ? (
            <div style={{marginTop: 10}}>
              <strong>{this.context.t('player.address')}</strong>
              <br />
              {player.contact.address}
              <br />
              {player.contact.city}
            </div>
          ) : null}

        </div>
        <CardText>
        </CardText>
      </Card>
    );
  }
}


export const PlayerCompetition = ({comp, player}) => {
  const team = player.getTeam(comp);
  const compDetails = player.getCompetition(comp);
  if (!compDetails.ranking) {
    return <div />;
  }
  return (
    <span>
      {comp} {team ? team.teamCode : null} <small>({compDetails.ranking})</small>
    </span>
  );
}