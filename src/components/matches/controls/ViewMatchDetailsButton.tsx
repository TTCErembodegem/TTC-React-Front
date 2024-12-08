import React, {Component} from 'react';
import {Link} from 'react-router';
import cn from 'classnames';
import PropTypes, {storeUtil} from '../../PropTypes';
import {OwnClubId} from '../../../models/ClubModel';
import MatchScore from '../MatchScore';
import {IMatch} from '../../../models/model-interfaces';

type ViewMatchDetailsButtonProps = {
  match: IMatch;
  size: 'xs';
}

export class ViewMatchDetailsButton extends Component<ViewMatchDetailsButtonProps> {
  static contextTypes = PropTypes.contextTypes;

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


type MatchOtherRoundButtonProps = {
  match: IMatch;
}

export class MatchOtherRoundButton extends Component<MatchOtherRoundButtonProps> {
  static contextTypes = PropTypes.contextTypes;

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
