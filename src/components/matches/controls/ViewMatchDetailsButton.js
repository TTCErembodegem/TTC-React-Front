import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import cn from 'classnames';
import PropTypes, {storeUtil} from '../../PropTypes.js';
import {OwnClubId} from '../../../models/ClubModel.js';
import MatchScore from '../MatchScore.js';

export class ViewMatchDetailsButton extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    size: PropTypes.oneOf(['xs']),
  }

  render() {
    const {match} = this.props;
    if (!match.shouldBePlayed) {
      return null;
    }

    const {t} = this.context;
    const {size} = this.props;
    const score = match.renderScore();
    return (
      <Link
        className={cn({'btn btn-default': !score, clickable: !!score, [`btn-${size}`]: !!size})}
        to={t.route('match', {matchId: match.id})}
      >
        {score ? <MatchScore match={match} style={{fontSize: size === 'xs' ? 12 : 16}} showComments /> : t('match.details')}
      </Link>
    );
  }
}


export class MatchOtherRoundButton extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const matches = storeUtil.matches
      .getFromOpponent(this.props.match)
      .filter(match => match.id !== this.props.match.id);

    const firstRoundMatchInfo = matches.find(match => (
      (match.home.clubId === OwnClubId && match.home.teamCode === this.props.match.getTeam().teamCode)
      || (match.away.clubId === OwnClubId && match.away.teamCode === this.props.match.getTeam().teamCode)
    ));

    const firstRoundMatch = firstRoundMatchInfo ? storeUtil.getMatch(firstRoundMatchInfo.id) : null;
    if (!firstRoundMatch) {
      return null;
    }

    const wasPrev = this.props.match.date > firstRoundMatch.date;
    return (
      <Link to={this.context.t.route('match', {matchId: firstRoundMatch.id})}>
        <button type="button" className="btn btn-default" style={{margin: 7}}>
          <div>
            <span style={{marginRight: 6}}>{this.context.t(`match.${wasPrev ? 'gotoPreviousEncounter' : 'gotoNextEncounter'}`)}</span>
            <MatchScore match={firstRoundMatch} forceDisplay />
          </div>
        </button>
      </Link>
    );
  }
}
