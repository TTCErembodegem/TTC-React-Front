import React, { Component } from 'react';
import PropTypes, { connect, storeUtil } from '../PropTypes.js';
import PlayerCard from '../players/PlayerCard.js';

@connect(state => {
  return {
    players: state.players,
    clubs: state.clubs,
  };
}
)export default class Administration extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    clubs: PropTypes.ClubModelList.isRequired,
  }

  render() {
    const club = storeUtil.getOwnClub();
    if (!club) {
      return <div />;
    }
    const managers = club.managers;
    return (
      <div style={{marginTop: 10}}>
        <h1>{this.context.t('clubs.managementTitle')}</h1>
        <div className="row">
          {managers.sort((a, b) => a.sortOrder - b.sortOrder).map(manager => (
            <div className="col-lg-4 col-md-6" key={manager.playerId} style={{paddingBottom: 10}}>
              <PlayerCard
                id={manager.playerId}
                name={manager.name}
                contact={manager.contact}
              >
                <br />
                <strong>{manager.description === 'Default' ? null : this.context.t('clubs.managerTypes.' + manager.description)}</strong>
              </PlayerCard>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
