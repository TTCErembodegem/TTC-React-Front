import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import {getPlayingStatusClass} from '../../models/PlayerModel';

import {Icon, CommentIcon, PlayerLink} from '../controls';

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
    const {plyInfo} = this.props;
    const comp = plyInfo.player.getCompetition(this.props.competition);
    return (
      <PlayerLink player={plyInfo.player} className="clickable">
        <span
          className={`clickable label label-as-badge label-${getPlayingStatusClass(plyInfo.matchPlayer.status) || 'default'}`}
          key={plyInfo.player.id + plyInfo.matchPlayer.status}
          style={({fontSize: 14, display: 'inline-block', ...this.props.style})}
        >
          {plyInfo.player.alias}
          {this.props.competition && comp ? <span style={{marginLeft: 5, fontSize: 10}}>{comp.ranking}</span> : null}
        </span>
      </PlayerLink>
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
    const {plyInfo} = this.props;
    const {matchPlayer} = plyInfo;
    const comp = plyInfo.player.getCompetition(this.props.competition);
    return (
      <button
        key={plyInfo.player.id + matchPlayer.status}
        className={`btn btn-xs btn-${getPlayingStatusClass(matchPlayer) || 'default'}`}
        title={matchPlayer.statusNote}
        style={({marginBottom: 5, ...this.props.style})}
        onClick={this.props.onButtonClick}
      >
        {matchPlayer.statusNote ? <CommentIcon style={{marginRight: 5, marginLeft: 0}} /> : null}
        {plyInfo.player.alias}
        {this.props.competition && comp ? <span style={{marginLeft: 5, fontSize: 10}}>{comp.ranking}</span> : null}
        <Icon fa={this.props.actionIconClass} style={{marginRight: 0, marginLeft: 5, visibility: this.props.isPicked ? '' : 'hidden'}} />
      </button>
    );
  }
}
