import React, {Component} from 'react';
import PropTypes, {connect, storeUtil} from '../PropTypes.js';
import Panel from 'react-bootstrap/lib/Panel';
import Image from 'react-bootstrap/lib/Image';
import {Email, Telephone} from '../controls.js';
import {playerUtils} from '../../models/PlayerModel.js';

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
            <div className="col-lg-4 col-md-6" key={manager.playerId} style={{paddingBottom: 10}}>
              <Panel header={(
                <span>
                  <strong>{manager.name}</strong>
                  <br />
                  {manager.description === 'Default' ? <br /> : this.context.t('clubs.managerTypes.' + manager.description)}
                </span>
              )}>

                <div style={{textAlign: 'center', marginBottom: 15}}>
                  <Image src={playerUtils.getImageUrl(manager.playerId)} circle />
                </div>

                <i className="fa fa-envelope" style={{marginRight: 8}} />
                <Email email={manager.contact.email} />
                <br />

                <i className="fa fa-phone" style={{marginRight: 8}} />
                <Telephone player={manager} hideIcon />

                {manager.contact.address ? (
                  <div style={{marginTop: 10}}>
                    <strong>{this.context.t('player.address')}</strong>
                    <br />
                    {manager.contact.address}
                    <br />
                    {manager.contact.city}
                  </div>
                ) : null}
              </Panel>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
