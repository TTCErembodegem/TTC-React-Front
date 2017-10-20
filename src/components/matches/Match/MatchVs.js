import React, {Component} from 'react';
import PropTypes, {browseTo} from '../../PropTypes.js';
import cn from 'classnames';
import {Icon} from '../../controls/Icon.js';
import {DivisionRankingLabel, OurDivisionRankingLabel} from '../controls/DivisionRankingLabel.js';

export default class MatchVs extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    opponentOnly: PropTypes.bool.isRequired,
    themOnly: PropTypes.bool,
    ownTeamLink: PropTypes.oneOf(['main', 'matches', 'ranking', 'players', 'matchesTable', 'week']),
    withLinks: PropTypes.bool,
    withPosition: PropTypes.bool,
  }

  static defaultProps = {
    themOnly: false,
    opponentOnly: false,
    withPosition: true,
  };

  render() {
    const {match, opponentOnly, themOnly} = this.props;
    const team = match.getTeam();
    const divisionRanking = team.getDivisionRanking(match.opponent);
    var them = (
      <span>
        {this.props.withPosition ? <DivisionRankingLabel divisionRanking={divisionRanking} /> : null}

        {this.props.withLinks ? (
          <a className="link-hover-underline" onClick={() => browseTo.opponent(match.competition, match.opponent)}>
            {match.renderOpponentTitle()}
          </a>
        ) : (
          match.renderOpponentTitle()
        )}
      </span>
    );

    if (divisionRanking.isForfait) {
      them = <s>{them}</s>;
    }

    if (themOnly) {
      return <span>{them}</span>;
    }


    const usClasses = cn('label label-as-badge label-info', {clickable: this.props.ownTeamLink});
    var us;
    if (this.props.ownTeamLink) {
      us = (
        <a onClick={() => browseTo.team(team, this.props.ownTeamLink)} className={usClasses}>
          <OurDivisionRankingLabel team={team} />
          <span style={{fontSize: 14}}>{team.renderOwnTeamTitle()}</span>
        </a>
      );

    } else {
      us = (
        <span className={usClasses} style={{fontSize: 14}}>
          <OurDivisionRankingLabel team={team} />
          {team.renderOwnTeamTitle()}
        </span>
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
