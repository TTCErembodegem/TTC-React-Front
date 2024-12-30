import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { OwnClubId } from '../../../models/ClubModel';
import { MatchScore } from '../MatchScore';
import { IMatch } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import storeUtil from '../../../storeUtil';

type ViewMatchDetailsButtonProps = {
  match: IMatch;
  size: 'xs' | null;
}

export class ViewMatchDetailsButton extends Component<ViewMatchDetailsButtonProps> {
  render() {
    const {match} = this.props;
    if (!match.shouldBePlayed) {
      return null;
    }

    const {size} = this.props;
    const score = match.renderScore();
    return (
      <Link
        className={cn({'btn btn-outline-secondary': !score, clickable: !!score, [`btn-${size}`]: !!size})}
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
      <Link to={t.route('match', {matchId: firstRoundMatch.id})}>
        <button type="button" className="btn btn-outline-secondary" style={{margin: 7}}>
          <div>
            <span style={{marginRight: 6}}>{t(`match.${wasPrev ? 'gotoPreviousEncounter' : 'gotoNextEncounter'}`)}</span>
            <MatchScore match={firstRoundMatch} forceDisplay />
          </div>
        </button>
      </Link>
    );
  }
}
