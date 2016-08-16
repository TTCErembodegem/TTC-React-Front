import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';
import { contextTypes } from '../../utils/decorators/withContext.js';

import { Card } from 'material-ui/Card';
import Telephone from '../controls/Telephone.js';
import PlayerImage from './PlayerImage.js';
import Icon from '../controls/Icon.js';

export default class PlayerCard extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
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
              {player.vttl && player.sporta ? <br /> : null}
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
      </Card>
    );
  }
}


export const PlayerCompetition = ({comp, player}) => {
  const compDetails = player.getCompetition(comp);
  if (!compDetails.ranking) {
    return <div />;
  }

  const team = player.getTeam(comp);
  const isCaptain = team ? team.isCaptain(player) : false;
  return (
    <span>
      {isCaptain ? <Icon fa="fa fa-star" color="#FFB00F" style={{marginRight: 5}} /> : null}
      {comp} {team ? team.teamCode : null} <small>({compDetails.ranking})</small>
    </span>
  );
};