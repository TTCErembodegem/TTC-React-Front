import React, {Component} from 'react';
import PropTypes, {browserHistory} from '../../PropTypes.js';
import cn from 'classnames';
import {Icon} from '../../controls/Icon.js';
import {browseTo} from '../../../routes.js';

export default class MatchVs extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    opponentOnly: PropTypes.bool.isRequired,
    themOnly: PropTypes.bool,
    ownTeamLink: PropTypes.oneOf(['main', 'matches', 'ranking', 'players', 'matchesTable', 'week']),
  }

  static defaultProps = {
    themOnly: false,
    opponentOnly: false,
  };

  render() {
    const {match, opponentOnly, themOnly} = this.props;
    const team = match.getTeam();
    const forfait = team.getDivisionRanking(match.opponent).isForfait;
    var them = match.renderOpponentTitle();
    if (forfait) {
      them = <s>{them}</s>
    }

    if (themOnly) {
      return <span>{them}</span>;
    }

    var us = <span className={cn('label label-as-badge label-info', {clickable: this.props.ownTeamLink})} style={{fontSize: 14}}>{team.renderOwnTeamTitle()}</span>;
    if (this.props.ownTeamLink) {
      us = (
        <a onClick={() => browseTo.team(team, this.props.ownTeamLink)}>
          {us}
        </a>
      );
    }

    if (!match.shouldBePlayed) {
      return us;
    }

    if (opponentOnly) {
      return (
        <span>
          {match.isHomeMatch ? <Icon fa="fa fa-home" style={{marginRight: 5}} /> : null}
          {them}
        </span>
      );
    }

    const separator = <Icon fa="fa fa-arrows-h" />;
    if (match.isHomeMatch) {
      return <span>{us} {separator} {them}</span>;
    }
    return <span>{them} {separator} {us}</span>;
  }
}
