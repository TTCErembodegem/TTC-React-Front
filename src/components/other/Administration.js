import React, {Component} from 'react';
import PropTypes, {connect, storeUtil} from '../PropTypes.js';
import Panel from 'react-bootstrap/lib/Panel';
import {Email, Telephone, PlayerAddress} from '../controls.js';
import PlayerImage from '../players/PlayerImage.js';

@connect(state => ({
  players: state.players,
  clubs: state.clubs,
}))
export default class Administration extends Component {
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
            <div className="col-lg-4 col-sm-6" key={manager.playerId} style={{paddingBottom: 10}}>
              <Panel>
                <Panel.Heading>
                  <span>
                    <strong>{manager.name}</strong>
                    <br />
                    {manager.description === 'Default' ? <br /> : this.context.t('clubs.managerTypes.' + manager.description)}
                  </span>
                </Panel.Heading>

                <Panel.Body>
                  <PlayerImage playerId={manager.playerId} center shape="circle" />
                  <br />
                  <Email email={manager.contact.email} showIcon />
                  <br />
                  <Telephone player={manager} style={{marginTop: 5}} />

                  <PlayerAddress contact={manager.contact} style={{marginTop: 5}} />
                </Panel.Body>
              </Panel>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
