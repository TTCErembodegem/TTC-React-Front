import React, {Component} from 'react';
import PropTypes, {connect, withViewport} from '../PropTypes';
import {BackIcon} from '../controls/Icons/BackIcon';
import PlayerCard from './PlayerCard';
import {PlayerCompetition} from './Player/PlayerCompetition';



class PlayerComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    viewport: PropTypes.viewport,

    match: PropTypes.shape({
      params: PropTypes.shape({
        playerId: PropTypes.string.isRequired,
      }).isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _getPlayer() {
    const playerSlug = this.props.match.params.playerId;
    const player = this.props.players.find(p => p.slug === playerSlug);
    return player;
  }

  render() {
    const player = this._getPlayer();
    const viewWidth = this.props.viewport.width;
    return (
      <div style={{marginTop: 20, marginBottom: 10}}>
        <BackIcon className="hidden-xs" style={{position: 'absolute', right: 5, top: 80, zIndex: 99}} />
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <PlayerCard player={player} showSideBySide={(viewWidth > 550 && viewWidth < 992) || viewWidth > 1200} />
          </div>
          <div className="col-sm-6">
            <PlayerCompetition player={player} competition="Vttl" />
          </div>
          {this.props.viewport.width > 992 ? <div style={{clear: 'both'}} /> : null}
          <div className="col-sm-6">
            <PlayerCompetition player={player} competition="Sporta" />
          </div>
        </div>
      </div>
    );
  }
}

export const Player = withViewport(connect(state => ({players: state.players}))(PlayerComponent));
