import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';
import { getPlayingStatusClass, getPlayingStatusColor } from '../../models/PlayerModel.js';

import Icon from '../controls/Icon.js';

export class PlayerCompetitionBadge extends Component {
  static propTypes = {
    style: PropTypes.object,
    plyInfo: PropTypes.shape({
      matchPlayer: PropTypes.object.isRequired,
      player: PropTypes.PlayerModel.isRequired,
    }).isRequired,
    competition: PropTypes.string,
  }
  static defaultProps = {
    style: {},
  }
  render() {
    const plyInfo = this.props.plyInfo;
    const comp = plyInfo.player.getCompetition(this.props.competition);
    return (
      <span
        className={'label label-as-badge label-' + (getPlayingStatusClass(plyInfo.matchPlayer.status) || 'default')}
        key={plyInfo.player.id + plyInfo.matchPlayer.status}
        style={Object.assign({fontSize: 14, display: 'inline-block'}, this.props.style)}>
        {plyInfo.player.alias}
        {this.props.competition && comp ? <span style={{marginLeft: 5, fontSize: 10}}>{comp.ranking}</span> : null}
      </span>
    );
  }
}

export class PlayerCompetitionButton extends Component {
  static propTypes = {
    plyInfo: PropTypes.shape({
      matchPlayer: PropTypes.object.isRequired,
      player: PropTypes.PlayerModel.isRequired,
    }).isRequired,
    onButtonClick: PropTypes.func.isRequired,
    isPicked: PropTypes.bool.isRequired,
    actionIconClass: PropTypes.string,
    style: PropTypes.object,
    competition: PropTypes.string,
  }
  render() {
    const plyInfo = this.props.plyInfo;
    const matchPlayer = plyInfo.matchPlayer;
    const comp = plyInfo.player.getCompetition(this.props.competition);
    return (
      <button
        key={plyInfo.player.id + matchPlayer.status}
        className={'btn btn-xs btn-' + (getPlayingStatusClass(matchPlayer) || 'default')}
        title={matchPlayer.statusNote}
        style={Object.assign({marginBottom: 5}, this.props.style)}
        onClick={this.props.onButtonClick}>
        {matchPlayer.statusNote ? <Icon fa="fa fa-comment-o" style={{marginRight: 5, marginLeft: 0}} /> : null}
        {plyInfo.player.alias}
        {this.props.competition && comp ? <span style={{marginLeft: 5, fontSize: 10}}>{comp.ranking}</span> : null}
        <Icon fa={this.props.actionIconClass} style={{marginRight: 0, marginLeft: 5, visibility: this.props.isPicked ? '' : 'hidden'}} />
      </button>
    );
  }
}