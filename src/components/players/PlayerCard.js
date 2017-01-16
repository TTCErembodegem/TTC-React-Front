import React, { Component } from 'react';
import PropTypes, { contextTypes } from '../PropTypes.js';

import { Card } from 'material-ui/Card';
import PlayerImage from './PlayerImage.js';
import { Email, Icon, Telephone } from '../controls.js';

export default class PlayerCard extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    id: PropTypes.number.isRequired,
    alias: PropTypes.string,
    name: PropTypes.string.isRequired,
    contact: PropTypes.shape({
      mobile: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
    }),
    children: PropTypes.any
  };

  render() {
    const player = this.props;
    const cardWidth = 350;
    return (
      <Card style={{width: cardWidth, height: 256}}>
        <div style={{float: 'left'}}>
          <PlayerImage playerId={player.id} center={false} />
        </div>
        <div style={{float: 'left', marginLeft: 6, width: cardWidth - 208}}>
          <h4 style={{marginBottom: 0}}>{player.name.length > 15 && player.alias ? player.alias : player.name}</h4>
          {player.contact.email ? (
            <div className="truncate" style={{width: 150}}>
              <Email email={player.contact.email} />
            </div>
          ) : null}
          <Telephone number={player.contact.mobile} hideIcon />

          {this.props.children}

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
PlayerCard.Competition = ({player, t}) => (
  <div style={{marginTop: 5}}>
    <strong>{t('common.competition')}</strong>
    <br />
    <PlayerAllCompetitions player={player} t={t} />
  </div>
);

export const PlayerAllCompetitions = ({player, t}) => (
  <div>
    <PlayerCompetition comp="Vttl" player={player} t={t} />
    {player.vttl && player.sporta ? <br /> : null}
    <PlayerCompetition comp="Sporta" player={player} t={t} />
  </div>
);


export const TeamCaptainIcon = ({t}) => (
  <Icon fa="fa fa-star" color="#FFB00F" style={{marginRight: 5}} title={t('player.teamCaptain')} />
);

export const PlayerCompetition = ({comp, player, t, withName = false}) => {
  // withName = Jorn C2 (frenoylink)
  // !withName = Sporta (ploeg) C2 (frenoylink)
  const compDetails = player.getCompetition(comp);
  if (!compDetails.ranking) {
    return <div />;
  }

  const team = player.getTeam(comp);
  const isCaptain = team ? team.isCaptain(player) : false;
  return (
    <span>
      {isCaptain ? <TeamCaptainIcon t={t} /> : null}
      {withName ? <strong>{player.alias}</strong> : <span>{comp} {team ? team.teamCode : null}</span>}
      <small style={{marginLeft: 10}}>{compDetails.ranking} <PlayerFrenoyLink comp={compDetails} /></small>
    </span>
  );
};

import { createFrenoyLink } from '../../models/PlayerModel.js';
export const PlayerFrenoyLink = ({comp}) => (
  <a href={createFrenoyLink(comp)} target="_blank">
    <Icon fa="fa fa-search" />
  </a>
);
