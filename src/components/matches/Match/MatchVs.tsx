import React, {Component} from 'react';
import {Link} from 'react-router';
import cn from 'classnames';
import PropTypes, {browseTo} from '../../PropTypes';
import {Icon} from '../../controls/Icons/Icon';
import {DivisionRankingLabel, OurDivisionRankingLabel} from '../controls/DivisionRankingLabel';
import {IMatch} from '../../../models/model-interfaces';

type MatchVsProps = {
  match: IMatch;
  opponentOnly: boolean;
  themOnly?: boolean;
  ownTeamLink: 'main' | 'matches' | 'ranking' | 'players' | 'matchesTable' | 'week';
  withLinks?: boolean;
  withPosition?: boolean;
}

type MatchVsState = {
  themOnly: boolean;
  opponentOnly: boolean;
  withPosition: boolean;
}

export default class MatchVs extends Component<MatchVsProps, MatchVsState> {
  static contextTypes = PropTypes.contextTypes;

  static defaultProps = {
    themOnly: false,
    opponentOnly: false,
    withPosition: true,
  };

  render() {
    const {t} = this.context;
    const {match, opponentOnly, themOnly} = this.props;
    const team = match.getTeam();
    const divisionRanking = team.getDivisionRanking(match.opponent);
    let them = (
      <span>
        {this.props.withPosition ? <DivisionRankingLabel divisionRanking={divisionRanking} /> : null}

        {this.props.withLinks ? (
          <Link className="link-hover-underline" to={browseTo.getOpponent(match.competition, match.opponent)}>
            {match.renderOpponentTitle()}
          </Link>
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
    let us;
    if (this.props.ownTeamLink) {
      us = (
        <Link to={browseTo.getTeam(team, this.props.ownTeamLink)} className={usClasses}>
          <OurDivisionRankingLabel team={team} />
          <span style={{fontSize: 14}}>{team.renderOwnTeamTitle()}</span>
        </Link>
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
          {match.isHomeMatch ? <Icon fa="fa fa-home" style={{marginRight: 5}} tooltip={t('common.matchAtHome')} /> : null}
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
