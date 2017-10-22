import React, {Component} from 'react';
import PropTypes, {connect, withViewport} from '../PropTypes.js';

import {BackIcon} from '../controls.js';
import PlayerCard from './PlayerCard.js';
import {PlayerCompetition} from './Player/PlayerCompetition.js';

@connect(state => ({players: state.players}))
@withViewport
export class Player extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    viewport: PropTypes.viewport,

    params: PropTypes.shape({
      playerId: PropTypes.string.isRequired
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _getPlayer() {
    const playerId = parseInt(this.props.params.playerId, 10);
    const player = this.props.players.find(p => p.id === playerId);
    return player;
  }

  render() {
    const player = this._getPlayer();
    return (
      <div style={{marginTop: 20, marginBottom: 10}}>
        <BackIcon className="pull-right hidden-sm hidden-xs" />
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-4">
            <PlayerCard player={player} />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-8">
            &nbsp;
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <PlayerCompetition player={player} competition="Vttl" />
          </div>
          <div className="col-sm-6">
            <PlayerCompetition player={player} competition="Sporta" />
          </div>
        </div>
      </div>
    );
  }
}
